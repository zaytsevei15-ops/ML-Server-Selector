import { z } from 'zod';
import type { Country, Label } from './catalog';
const label = z.object({ ru: z.string().trim().min(1).max(80), en: z.string().trim().min(1).max(80) });
const countryEdit = z.object({ code: z.string().regex(/^[A-Z]{2}$/), name: label, regionId: z.enum(['ru', 'eu', 'sea', 'na', 'latam', 'me', 'asia', 'other']), hidden: z.boolean(), cities: z.array(z.object({ id: z.string().regex(/^[a-z0-9-]{1,80}$/), name: label })).max(100) });
export const editsSchema = z.object({
  version: z.literal(1), countries: z.array(countryEdit).max(100),
  texts: z.object({ lobbyTitle: z.string().max(80), catalogHint: z.string().max(600), countryHints: z.record(z.string().regex(/^[A-Z]{2}$/), z.string().max(600)) }),
  nodes: z.record(z.string().regex(/^[a-f0-9]{32}$/), z.object({ hidden: z.boolean(), featured: z.boolean() })),
}).superRefine((v, ctx) => {
  if (new Set(v.countries.map(c => c.code)).size !== v.countries.length) ctx.addIssue({ code: 'custom', message: 'Duplicate country' });
  const ids = v.countries.flatMap(c => c.cities.map(city => city.id));
  if (new Set(ids).size !== ids.length) ctx.addIssue({ code: 'custom', message: 'Duplicate city ID' });
  if (Object.keys(v.nodes).length > 500 || Object.keys(v.texts.countryHints).length > 100) ctx.addIssue({ code: 'custom', message: 'Too many overrides' });
});
export type LocalEdits = z.infer<typeof editsSchema>;
export type CountryEdit = LocalEdits['countries'][number];
export function emptyEdits(): LocalEdits { return { version: 1, countries: [], texts: { lobbyTitle: '', catalogHint: '', countryHints: {} }, nodes: {} }; }
export function applyCountries(base: Country[], edits: LocalEdits, includeHidden = false): Country[] {
  const result = base.filter(c => !edits.countries.some(e => e.code === c.code));
  for (const entry of edits.countries) {
    if (entry.hidden && !includeHidden) continue;
    result.push({ code: entry.code, name: entry.name, regionId: entry.regionId,
      cities: entry.cities.map(c => ({ ...c, code: entry.code, country: entry.name })) });
  }
  // Preserve catalogue ordering and put added countries at the end.
  return result.sort((a, b) => (base.findIndex(c => c.code === a.code) < 0 ? 999 : base.findIndex(c => c.code === a.code)) - (base.findIndex(c => c.code === b.code) < 0 ? 999 : base.findIndex(c => c.code === b.code)));
}
export function toCountryEdit(country: Country): CountryEdit {
  return { code: country.code, name: country.name, regionId: country.regionId as CountryEdit['regionId'], hidden: false, cities: country.cities.map(c => ({ id: c.id, name: c.name as Label })) };
}
export function visibleNodes<T extends { id: string }>(servers: T[], edits: LocalEdits): T[] {
  return servers.filter(s => !edits.nodes[s.id]?.hidden).sort((a, b) => Number(!!edits.nodes[b.id]?.featured) - Number(!!edits.nodes[a.id]?.featured));
}