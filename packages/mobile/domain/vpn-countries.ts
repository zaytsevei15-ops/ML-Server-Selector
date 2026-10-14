import { countries, type Country, type Language } from './catalog';

type ListedServer = { countryCode: string; countryName: string };
const extras: Record<string, { ru: string; en: string; regionId: string }> = {
  JP: { ru: 'Япония', en: 'Japan', regionId: 'asia' }, KR: { ru: 'Южная Корея', en: 'South Korea', regionId: 'asia' },
  TH: { ru: 'Таиланд', en: 'Thailand', regionId: 'sea' }, BD: { ru: 'Бангладеш', en: 'Bangladesh', regionId: 'asia' },
  RO: { ru: 'Румыния', en: 'Romania', regionId: 'eu' },
};
export function vpnCountries(servers: ListedServer[] = []): Country[] {
  const result = [...countries];
  for (const server of servers) {
    if (result.some(c => c.code === server.countryCode)) continue;
    const names = extras[server.countryCode];
    result.push({ code: server.countryCode, name: names ?? { ru: server.countryName, en: server.countryName },
      regionId: names?.regionId ?? 'other', cities: [] });
  }
  return result;
}
export function filterVpnCountries(list: Country[], search: string, region = 'all') {
  const normalize = (s: string) => s.toLocaleLowerCase().replace(/ё/g, 'е'); const q = normalize(search.trim());
  return list.filter(c => (region === 'all' || c.regionId === region) &&
    [c.code, c.name.ru, c.name.en, ...c.cities.flatMap(v => [v.name.ru, v.name.en])].some(v => normalize(v).includes(q)));
}
export function sourceTime(timestamp: number, language: Language) {
  return new Date(timestamp).toLocaleTimeString(language === 'ru' ? 'ru-RU' : 'en-GB', { hour: '2-digit', minute: '2-digit' });
}