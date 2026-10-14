import { describe, expect, test } from 'bun:test';
import { parsePlayerId, regions, countries, findDestination, searchCountries } from './catalog';
import { vpnCountries, filterVpnCountries } from './vpn-countries';

describe('Local ID parser (no geographical inference)', () => {
  test('accepts expected and whitespace formats', () => {
    expect(parsePlayerId('123456789 (1234)')).toEqual({ player: '123456789', server: '1234' });
    expect(parsePlayerId(' 123456789( 12345 ) ')).toEqual({ player: '123456789', server: '12345' });
  });
  test('rejects empty, malformed, excessive and all-zero values', () => {
    for (const input of ['', 'abc (1234)', '123456789', '123 (1234)', '123456 (ab12)', '0000 (1234)', '123456 (000)', '123456 (1234) extra', '1234567890123456 (1234)']) expect(parsePlayerId(input)).toBeNull();
  });
  test('never returns an inferred region', () => expect(Object.keys(parsePlayerId('123456 (1234)')!)).toEqual(['player', 'server']));
});
describe('Independent reference catalogue', () => {
  test('includes Russia and four SEA countries', () => {
    expect(regions.map(r => r.id)).toEqual(['ru', 'eu', 'sea', 'na', 'latam', 'me']);
    expect(regions.find(r => r.id === 'sea')!.cities.map(c => c.code)).toEqual(['ID', 'MY', 'SG', 'PH']);
  });
  test('all labels are bilingual', () => {
    for (const region of regions) {
      expect(region.name.ru.length).toBeGreaterThan(0);
      expect(region.name.en.length).toBeGreaterThan(0);
      for (const city of region.cities) { expect(city.name.ru.length).toBeGreaterThan(0); expect(city.name.en.length).toBeGreaterThan(0); }
    }
  });
  test('Russia cities are preferences only; search works in either language', () => {
    expect(countries[0].code).toBe('RU');
    expect(countries[0].cities).toHaveLength(30);
    expect(new Set(countries[0].cities.map(c => c.id)).size).toBe(30);
    expect(findDestination('ru-vladivostok')?.name.ru).toBe('Владивосток');
    expect(searchCountries('Калининград').map(c => c.code)).toEqual(['RU']);
    expect(countries.filter(c => c.code !== 'RU').flatMap(c => c.cities)).toHaveLength(16);
    expect(findDestination('ru-moscow')?.name.ru).toBe('Москва');
    expect(findDestination('invalid')).toBeUndefined();
    expect(searchCountries('Казань').map(c => c.code)).toEqual(['RU']);
    expect(searchCountries('Manila').map(c => c.code)).toEqual(['PH']);
  });
  test('live countries are added without fabricating cities', () => {
    const list = vpnCountries([{ countryCode: 'JP', countryName: 'Japan' }, { countryCode: 'JP', countryName: 'Japan' }]);
    expect(list.filter(c => c.code === 'JP')).toHaveLength(1);
    expect(list.find(c => c.code === 'JP')?.cities).toEqual([]);
    expect(filterVpnCountries(list, 'Япония').map(c => c.code)).toEqual(['JP']);
    expect(filterVpnCountries(list, 'Japan', 'eu')).toEqual([]);
  });
});