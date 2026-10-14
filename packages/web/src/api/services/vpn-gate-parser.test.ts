import { describe, expect, test } from 'bun:test';
import { parseCsv, parseGateFeed, isPublicIpv4, validateProfile } from './vpn-gate-parser';

const pem = (name: string) => `-----BEGIN ${name}-----\nQUJD\n-----END ${name}-----`;
const profile = `dev tun\nproto tcp\nremote 8.8.8.8 443\ncipher AES-128-CBC\ndata-ciphers AES-128-CBC\nauth SHA1\nclient\n<ca>\n${pem('CERTIFICATE')}\n</ca>\n<cert>\n${pem('CERTIFICATE')}\n</cert>\n<key>\n${pem('RSA PRIVATE KEY')}\n</key>\n`;
const header = '#HostName,IP,Score,Ping,Speed,CountryLong,CountryShort,NumVpnSessions,Uptime,TotalUsers,TotalTraffic,LogType,Operator,Message,OpenVPN_ConfigData_Base64';
const row = (config = profile) => ['node', '8.8.8.8', '123', '42', '1000000', 'Japan', 'JP', '2', '1', '1', '1', '2weeks', 'operator', 'message', Buffer.from(config).toString('base64')].join(',');

describe('VPN Gate CSV and untrusted profile handling', () => {
  test('supports quoted commas, escaped quotes and embedded newlines', () => {
    expect(parseCsv('a,"b,c","d""e"\r\n1,"two\nlines",3\r\n')).toEqual([['a', 'b,c', 'd"e'], ['1', 'two\nlines', '3']]);
    expect(() => parseCsv('a,"unclosed')).toThrow();
  });
  test('rejects private, loopback, metadata, multicast and reserved endpoints', () => {
    for (const ip of ['127.0.0.1', '10.0.0.1', '192.168.1.1', '169.254.169.254', '100.64.0.1', '172.31.0.1', '224.0.0.1', '0.0.0.0', '198.18.0.1', '192.0.2.1', '203.0.113.1', '8.8.8.999', '08.8.8.8']) expect(isPublicIpv4(ip)).toBe(false);
    expect(isPublicIpv4('8.8.8.8')).toBe(true);
  });
  test('validates endpoint without claiming TLS or handshake success', () => {
    expect(validateProfile(profile, '8.8.8.8')).toEqual({ protocol: 'tcp', port: 443, tlsServerRoleCheck: false });
    expect(() => validateProfile(profile, '1.1.1.1')).toThrow();
    expect(() => validateProfile(profile.replace(' 443', ' 0'), '8.8.8.8')).toThrow();
    expect(() => validateProfile(profile.replace(' 443', ' 65536'), '8.8.8.8')).toThrow();
  });
  test('fails closed on scripts, local files, plugins, proxies, duplicate remotes and invalid PEM', () => {
    for (const directive of ['up /tmp/run', 'down /tmp/run', 'plugin /tmp/lib.so', 'ca /tmp/cert', 'http-proxy 127.0.0.1 80', 'script-security 2', 'remote 1.1.1.1 443', 'management 127.0.0.1 5000']) expect(() => validateProfile(`${profile}${directive}\n`, '8.8.8.8')).toThrow();
    expect(() => validateProfile(profile.replace('QUJD', 'script'), '8.8.8.8')).not.toThrow(); // Structural, not cryptographic validation.
    expect(() => validateProfile(profile.replace('QUJD', '/tmp/private key'), '8.8.8.8')).toThrow();
  });
  test('parses, deduplicates and omits keys from metadata', () => {
    const entries = parseGateFeed(`*vpn_servers\n${header}\n${row()}\n${row()}\n*\n`);
    expect(entries).toHaveLength(1);
    expect(entries[0].server.countryCode).toBe('JP');
    expect(entries[0].server.reportedPingMs).toBe(42);
    expect(JSON.stringify(entries[0].server)).not.toContain('PRIVATE KEY');
    expect(entries[0].server).not.toHaveProperty('city');
  });
  test('drops unsafe profile rows and rejects unexpected feeds', () => {
    expect(parseGateFeed(`*vpn_servers\n${header}\n${row(profile + 'up /tmp/run\n')}\n*\n`)).toEqual([]);
    expect(() => parseGateFeed('<html>error</html>')).toThrow();
  });
});