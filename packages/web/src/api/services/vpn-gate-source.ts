import { parseGateFeed, type GateEntry } from './vpn-gate-parser';

export const VPN_GATE_URL = 'https://www.vpngate.net/api/iphone/';
const TTL = 60_000;
let cached: { fetchedAt: number; entries: GateEntry[] } | undefined;
let pending: Promise<NonNullable<typeof cached>> | undefined;

export async function readGateSource() {
  if (cached && Date.now() - cached.fetchedAt < TTL) return cached;
  if (pending) return pending;
  pending = (async () => {
    // Fixed official URL; redirects disabled. Never accept a user-supplied URL.
    const response = await fetch(VPN_GATE_URL, { signal: AbortSignal.timeout(15_000), redirect: 'error' });
    if (!response.ok || !response.body) throw new Error('VPN Gate unavailable');
    const reader = response.body.getReader(); const decoder = new TextDecoder();
    let bytes = 0; let text = '';
    try {
      while (true) {
        const { value, done } = await reader.read(); if (done) break;
        bytes += value.length;
        if (bytes > 5 * 1024 * 1024) throw new Error('VPN Gate feed exceeds limit');
        text += decoder.decode(value, { stream: true });
      }
      text += decoder.decode();
    } finally { await reader.cancel().catch(() => {}); }
    const entries = parseGateFeed(text);
    if (!entries.length) throw new Error('No compatible VPN Gate profiles');
    cached = { fetchedAt: Date.now(), entries }; return cached;
  })();
  try { return await pending; } finally { pending = undefined; }
}