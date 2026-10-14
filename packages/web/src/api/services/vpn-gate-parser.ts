/// <reference types="node" />
import { createHash } from 'node:crypto';

export type GateServer = {
  id: string; hostName: string; ip: string; countryCode: string; countryName: string;
  score: number; reportedPingMs: number | null; reportedSpeedBps: number;
  sessions: number; logPolicy: string; protocol: 'tcp' | 'udp'; port: number;
};
export type GateEntry = { server: GateServer; profile: string };

// RFC-style quoted fields (including embedded commas/newlines). Never split a CSV on commas.
export function parseCsv(text: string): string[][] {
  const rows: string[][] = []; let row: string[] = []; let field = ''; let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      if (quoted && text[i + 1] === '"') { field += '"'; i++; }
      else if (quoted || field === '') quoted = !quoted;
      else throw new Error('Invalid CSV quote');
    } else if (!quoted && ch === ',') { row.push(field); field = ''; }
    else if (!quoted && (ch === '\n' || ch === '\r')) {
      row.push(field); rows.push(row); row = []; field = '';
      if (ch === '\r' && text[i + 1] === '\n') i++;
    } else field += ch;
  }
  if (quoted) throw new Error('Unclosed CSV quote');
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows;
}

export function isPublicIpv4(value: string): boolean {
  if (!/^(?:\d{1,3}\.){3}\d{1,3}$/.test(value)) return false;
  const n = value.split('.').map(Number);
  if (n.some((v, i) => v > 255 || String(v) !== value.split('.')[i])) return false;
  const [a, b, c] = n;
  return !(a === 0 || a === 10 || a === 127 || a >= 224 ||
    (a === 100 && b >= 64 && b <= 127) || (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) || (a === 192 && (b === 168 || b === 0 || (b === 88 && c === 99) || (b === 2))) ||
    (a === 198 && (b === 18 || b === 19 || (b === 51 && c === 100))) ||
    (a === 203 && b === 0 && c === 113));
}

// Structural validation only. Not a TLS/endpoint authenticity audit and not a handshake.
// Reject file references, scripts, plugins, proxies, unknown options and extra remotes.
export function validateProfile(profile: string, ip: string) {
  if (!profile || profile.length > 96 * 1024 || [...profile].some(ch => {
    const code = ch.charCodeAt(0); return ![9, 10, 13].includes(code) && (code < 32 || code > 126);
  })) throw new Error('Invalid profile');
  const directives = new Map<string, string>(); const blocks = new Set<string>();
  let block = ''; let body: string[] = [];
  for (const original of profile.split(/\r?\n/)) {
    const line = original.trim();
    if (block) {
      if (line === `</${block}>`) {
        const pem = body.join('\n');
        const kind = block === 'key' ? '(?:RSA )?PRIVATE KEY' : 'CERTIFICATE';
        if (!new RegExp(`^-----BEGIN ${kind}-----\\n[A-Za-z0-9+/=\\n]+\\n-----END ${kind}-----$`).test(pem)) throw new Error('Invalid inline PEM');
        blocks.add(block); block = ''; body = [];
      } else if (line) body.push(line);
      continue;
    }
    if (!line || line.startsWith('#') || line.startsWith(';')) continue;
    if (/^<(ca|cert|key)>$/.test(line)) {
      block = line.slice(1, -1); if (blocks.has(block)) throw new Error('Duplicate inline block'); continue;
    }
    const [name, ...args] = line.split(/\s+/); const arg = args.join(' ');
    const allowed: Record<string, RegExp> = {
      dev: /^tun$/, proto: /^(tcp|tcp-client|udp)$/, remote: /^\d+\.\d+\.\d+\.\d+ [0-9]{1,5}$/,
      cipher: /^AES-(128|192|256)-(CBC|GCM)$/, 'data-ciphers': /^AES-(128|192|256)-(CBC|GCM)(:AES-(128|192|256)-(CBC|GCM))*$/,
      auth: /^SHA(1|256|384|512)$/, 'resolv-retry': /^infinite$/, nobind: /^$/, 'persist-key': /^$/,
      'persist-tun': /^$/, client: /^$/, verb: /^[0-4]$/, 'remote-cert-tls': /^server$/,
    };
    if (!allowed[name]?.test(arg) || directives.has(name)) throw new Error('Unsupported profile directive');
    directives.set(name, arg);
  }
  if (block || ['ca', 'cert', 'key'].some(v => !blocks.has(v)) ||
    ['dev', 'proto', 'remote', 'client'].some(v => !directives.has(v))) throw new Error('Incomplete profile');
  const [remote, portString] = directives.get('remote')!.split(' '); const port = Number(portString);
  if (remote !== ip || !isPublicIpv4(remote) || port < 1 || port > 65535) throw new Error('Invalid endpoint');
  return { protocol: directives.get('proto')!.startsWith('tcp') ? 'tcp' as const : 'udp' as const, port,
    tlsServerRoleCheck: directives.get('remote-cert-tls') === 'server' };
}

export function parseGateFeed(text: string): GateEntry[] {
  if (!text.startsWith('*vpn_servers')) throw new Error('Invalid VPN Gate feed');
  const rows = parseCsv(text); const header = rows[1];
  if (!header?.[0]?.startsWith('#HostName')) throw new Error('Missing feed header');
  const names = header.map(v => v.replace(/^#/, ''));
  for (const key of ['IP', 'CountryShort', 'CountryLong', 'OpenVPN_ConfigData_Base64']) if (!names.includes(key)) throw new Error('Missing feed columns');
  const entries: GateEntry[] = []; const seen = new Set<string>();
  const number = (v: string) => /^\d+$/.test(v) && Number.isSafeInteger(Number(v)) ? Number(v) : 0;
  for (const cells of rows.slice(2, 1002)) {
    if (cells.length !== names.length) continue;
    const r = Object.fromEntries(names.map((name, i) => [name, cells[i]]));
    if (!isPublicIpv4(r.IP) || !/^[A-Z]{2}$/.test(r.CountryShort) || !/^[A-Za-z0-9.-]{1,120}$/.test(r.HostName)) continue;
    const encoded = r.OpenVPN_ConfigData_Base64;
    if (!encoded || encoded.length > 128 * 1024 || !/^[A-Za-z0-9+/]+={0,2}$/.test(encoded)) continue;
    try {
      const profile = Buffer.from(encoded, 'base64').toString('utf8');
      const { protocol, port } = validateProfile(profile, r.IP);
      const id = createHash('sha256').update(`${r.HostName}|${r.IP}|${profile}`).digest('hex').slice(0, 32);
      if (seen.has(id)) continue; seen.add(id);
      entries.push({ profile, server: { id, hostName: r.HostName, ip: r.IP, countryCode: r.CountryShort,
        countryName: r.CountryLong.slice(0, 80), score: number(r.Score), reportedPingMs: /^\d+$/.test(r.Ping) ? number(r.Ping) : null,
        reportedSpeedBps: number(r.Speed), sessions: number(r.NumVpnSessions),
        logPolicy: r.LogType.slice(0, 100), protocol, port } });
    } catch { /* Fail closed per row; do not log profiles or inline shared keys. */ }
  }
  return entries.sort((a, b) => b.server.score - a.server.score);
}