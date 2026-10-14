import { ORPCError } from '@orpc/server';
import { z } from 'zod';
import { base } from '../__core/app';
import { readGateSource, VPN_GATE_URL } from '../services/vpn-gate-source';
import { validateProfile } from '../services/vpn-gate-parser';

async function source() {
  try { return await readGateSource(); }
  catch { throw new ORPCError('SERVICE_UNAVAILABLE', { message: 'VPN Gate is unavailable. Retry later.' }); }
}
export const vpnGate = {
  profile: base.input(z.object({ id: z.string().regex(/^[a-f0-9]{32}$/) })).handler(async ({ input }) => {
    const { entries } = await source();
    const entry = entries.find(e => e.server.id === input.id);
    if (!entry) throw new ORPCError('NOT_FOUND', { message: 'Refresh the server list.' });
    validateProfile(entry.profile, entry.server.ip);
    const expectedName = `${entry.server.hostName}.opengw.net`;
    // Keep CA validation, require server EKU and exact expected VPN Gate server CN.
    // Servers with incompatible certificates fail closed; never retry with checks disabled.
    const profile = entry.profile.replace(/^remote-cert-tls\s+server\s*$/gm, '') +
      `\nremote-cert-tls server\nverify-x509-name ${expectedName} name\n`;
    return { profile, server: entry.server, expectedName };
  }),
  list: base.handler(async () => {
    const { entries, fetchedAt } = await source();
    return { fetchedAt, sourceUrl: VPN_GATE_URL, refreshAfterMs: 60_000,
      servers: entries.map(e => e.server) };
  }),
  inspect: base.input(z.object({ id: z.string().regex(/^[a-f0-9]{32}$/) })).handler(async ({ input }) => {
    const { entries, fetchedAt } = await source();
    const entry = entries.find(e => e.server.id === input.id);
    if (!entry) throw new ORPCError('NOT_FOUND', { message: 'Server disappeared. Refresh the list.' });
    const result = validateProfile(entry.profile, entry.server.ip);
    // No key material sent to the browser or persisted by the app. This only checks profile structure.
    return { server: entry.server, fetchedAt, ...result, structureChecked: true,
      city: null, endpointReachability: 'not-tested' as const, tunnel: 'not-connected' as const,
      securityReview: 'required' as const };
  }),
};