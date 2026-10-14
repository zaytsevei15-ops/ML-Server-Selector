import { expect, test } from 'bun:test';
import { countries } from './catalog';
import { applyCountries, toCountryEdit, editsSchema, emptyEdits, visibleNodes } from './local-edits';
test('local geography edits preserve base catalogue and restore', () => {
  const edits = emptyEdits(); const ru = toCountryEdit(countries[0]);
  ru.name = { ru: 'Моя Россия', en: 'My Russia' }; ru.cities = [{ id: 'local-test', name: { ru: 'Тест', en: 'Test' } }]; edits.countries.push(ru);
  expect(applyCountries(countries, edits)[0].cities[0].country.ru).toBe('Моя Россия');
  expect(countries[0].cities).toHaveLength(30);
  ru.hidden = true; expect(applyCountries(countries, edits).some(c => c.code === 'RU')).toBe(false);
  expect(applyCountries(countries, edits, true)[0].code).toBe('RU');
  expect(applyCountries(countries, emptyEdits())[0].cities).toHaveLength(30);
});
test('hidden nodes excluded and featured nodes first, input unchanged', () => {
  const list = [{ id: 'a' }, { id: 'b' }, { id: 'c' }]; const edits = emptyEdits();
  edits.nodes = { a: { hidden: true, featured: false }, c: { hidden: false, featured: true } };
  expect(visibleNodes(list, edits).map(s => s.id)).toEqual(['c', 'b']); expect(list).toHaveLength(3);
});
test('editor validates names/codes/duplicates, not arbitrary endpoints', () => {
  const edits = emptyEdits(); edits.countries = [toCountryEdit(countries[0])];
  expect(editsSchema.safeParse(edits).success).toBe(true);
  edits.countries.push(edits.countries[0]); expect(editsSchema.safeParse(edits).success).toBe(false);
  expect(editsSchema.safeParse({ ...emptyEdits(), nodes: { unsafe: { hidden: true, featured: false } } }).success).toBe(false);
});