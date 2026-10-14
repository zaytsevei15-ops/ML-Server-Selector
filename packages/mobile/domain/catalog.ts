// Independent information catalogue. This application is not affiliated with Moonton.
import { russianCities } from './russian-cities';
export type Language = 'ru' | 'en';
export type Label = { ru: string; en: string };
export type City = { name: Label; country: Label; code: string };
export type Region = { id: string; code: string; name: Label; description: Label; cities: City[] };
const city = (ru: string, en: string, cr: string, ce: string, code: string): City => ({ name: { ru, en }, country: { ru: cr, en: ce }, code });
export const regions: Region[] = [
  { id: 'ru', code: 'RU', name: { ru: 'Россия', en: 'Russia' }, description: { ru: '30 городов · от Калининграда до Владивостока', en: '30 cities · Kaliningrad to Vladivostok' }, cities: russianCities.map(([ru, en]) => city(ru, en, 'Россия', 'Russia', 'RU')) },
  { id: 'eu', code: 'EU', name: { ru: 'Европа', en: 'Europe' }, description: { ru: 'Центральная и Западная Европа', en: 'Central & Western Europe' }, cities: [city('Франкфурт', 'Frankfurt', 'Германия', 'Germany', 'DE'), city('Амстердам', 'Amsterdam', 'Нидерланды', 'Netherlands', 'NL'), city('Париж', 'Paris', 'Франция', 'France', 'FR'), city('Лондон', 'London', 'Великобритания', 'United Kingdom', 'GB')] },
  { id: 'sea', code: 'SEA', name: { ru: 'Юго-Восточная Азия', en: 'Southeast Asia' }, description: { ru: 'Индонезия, Малайзия, Сингапур, Филиппины', en: 'Indonesia, Malaysia, Singapore, Philippines' }, cities: [city('Джакарта', 'Jakarta', 'Индонезия', 'Indonesia', 'ID'), city('Куала-Лумпур', 'Kuala Lumpur', 'Малайзия', 'Malaysia', 'MY'), city('Сингапур', 'Singapore', 'Сингапур', 'Singapore', 'SG'), city('Манила', 'Manila', 'Филиппины', 'Philippines', 'PH')] },
  { id: 'na', code: 'NA', name: { ru: 'Северная Америка', en: 'North America' }, description: { ru: 'США и Канада', en: 'United States & Canada' }, cities: [city('Лос-Анджелес', 'Los Angeles', 'США', 'United States', 'US'), city('Нью-Йорк', 'New York', 'США', 'United States', 'US'), city('Торонто', 'Toronto', 'Канада', 'Canada', 'CA')] },
  { id: 'latam', code: 'LAT', name: { ru: 'Латинская Америка', en: 'Latin America' }, description: { ru: 'Бразилия, Мексика, Аргентина', en: 'Brazil, Mexico, Argentina' }, cities: [city('Сан-Паулу', 'São Paulo', 'Бразилия', 'Brazil', 'BR'), city('Мехико', 'Mexico City', 'Мексика', 'Mexico', 'MX'), city('Буэнос-Айрес', 'Buenos Aires', 'Аргентина', 'Argentina', 'AR')] },
  { id: 'me', code: 'ME', name: { ru: 'Ближний Восток', en: 'Middle East' }, description: { ru: 'ОАЭ и Турция', en: 'UAE & Türkiye' }, cities: [city('Дубай', 'Dubai', 'ОАЭ', 'UAE', 'AE'), city('Стамбул', 'Istanbul', 'Турция', 'Türkiye', 'TR')] },
];
// Geography is not infrastructure: no endpoint or server keys have been supplied.
export type Destination = City & { id: string };
export type Country = { code: string; name: Label; regionId: string; cities: Destination[] };
export const countries: Country[] = [];
for (const region of regions) {
  for (const entry of region.cities) {
    let country = countries.find(c => c.code === entry.code);
    if (!country) { country = { code: entry.code, name: entry.country, regionId: region.id, cities: [] }; countries.push(country); }
    const slug = entry.name.en.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    country.cities.push({ ...entry, id: `${entry.code.toLowerCase()}-${slug}` });
  }
}
export function findDestination(id?: string) { return countries.flatMap(c => c.cities).find(c => c.id === id); }
export function searchCountries(query: string, regionId = 'all') {
  const normalized = query.trim().toLocaleLowerCase().replace(/ё/g, 'е');
  return countries.filter(c => (regionId === 'all' || c.regionId === regionId) && [c.code, c.name.ru, c.name.en, ...c.cities.flatMap(v => [v.name.ru, v.name.en])].some(v => v.toLocaleLowerCase().replace(/ё/g, 'е').includes(normalized)));
}
export const officialUrl = 'https://www.mobilelegends.com/';
export const termsUrl = 'https://www.mobilelegends.com/news/articleldetail?newsid=2690368';

// A server/zone identifier is not a trustworthy geographical lookup key.
export function parsePlayerId(input: string): { player: string; server: string } | null {
  const match = /^\s*([0-9]{4,15})\s*\(\s*([0-9]{3,8})\s*\)\s*$/.exec(input);
  if (!match || /^0+$/.test(match[1]) || /^0+$/.test(match[2])) return null;
  return { player: match[1], server: match[2] };
}