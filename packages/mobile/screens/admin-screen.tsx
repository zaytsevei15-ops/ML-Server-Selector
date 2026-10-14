import { useState } from 'react';
import { TextInput, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSelector } from '../state/selector-context';
import { useEditor } from '../state/editor-context';
import { useVpnGate } from '../queries/vpn-gate';
import { vpnCountries } from '../domain/vpn-countries';
import { applyCountries, toCountryEdit, emptyEdits, type CountryEdit } from '../domain/local-edits';
import { Screen, Copy, Pill, Panel, Button, Note, Section, ui } from '../components/selector-ui';

function ruCities(n: number) { const m10 = n % 10, m100 = n % 100; return m10 === 1 && m100 !== 11 ? 'город' : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? 'города' : 'городов'; }

export default function AdminScreen() {
  const { t, colors, prefs } = useSelector(); const router = useRouter();
  const { edits, save, state, ready } = useEditor(); const gate = useVpnGate();
  const [tab, setTab] = useState('geo'); const [draft, setDraft] = useState<CountryEdit>();
  const [query, setQuery] = useState(''); const [ru, setRu] = useState(''); const [en, setEn] = useState('');
  const [textDraft, setTextDraft] = useState(edits.texts); const [confirmReset, setConfirmReset] = useState(false);
  const [hintCountry, setHintCountry] = useState('RU');
  const [isNew, setIsNew] = useState(false); const [nodeQuery, setNodeQuery] = useState(''); const [duplicate, setDuplicate] = useState(false);
  const base = vpnCountries(gate.data?.servers ?? []);
  const countries = applyCountries(base, edits, true);
  const nodeMatches = (gate.data?.servers ?? []).filter(s => `${s.ip} ${s.countryCode} ${s.countryName}`.toLowerCase().includes(nodeQuery.trim().toLowerCase()));
  function input(label: string, value: string, change: (v: string) => void, max = 80) {
    return <View style={{ marginBottom: 12 }}><Copy size={11} color={colors.muted}>{label}</Copy><TextInput accessibilityLabel={label} value={value} onChangeText={change} maxLength={max} style={[ui.input, { color: colors.text, borderColor: colors.line, backgroundColor: colors.raised, marginTop: 4 }]} /></View>;
  }
  async function saveCountry() {
    if (!draft) return;
    // A new country must not silently overwrite an existing feed/catalogue country; edit that country instead.
    if (isNew && countries.some(c => c.code === draft.code)) { setDuplicate(true); return; }
    setDuplicate(false);
    if (await save({ ...edits, countries: [...edits.countries.filter(c => c.code !== draft.code), draft] })) setDraft(undefined);
  }
  return <Screen>
    <Button secondary onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/settings')}>{t('Вернуться в настройки', 'Back to settings')}</Button>
    <Section>{t('Администратор', 'Administrator')}</Section>
    <Copy size={26} weight="bold">{t('Локальный редактор', 'Local editor')}</Copy>
    <Note title={t('Только на этом устройстве', 'Only on this device')} text={t('Без пароля и серверных прав. Правки хранятся локально без шифрования. VPN-адреса, ключи, TLS и предупреждения безопасности не редактируются. Скрытие узла не отключает уже работающий туннель.', 'No password or server privileges. Edits are stored locally without encryption. VPN addresses, keys, TLS and safety notices are not editable. Hiding a node does not disconnect an active tunnel.')} />
    <Copy accessibilityLiveRegion="polite" size={12} color={state.includes('error') || state === 'invalid' ? colors.danger : colors.green} style={{ marginBottom: 12 }}>{!ready ? t('Загрузка…', 'Loading…') : state === 'saved' ? t('Изменения сохранены на устройстве', 'Changes saved on device') : state === 'saving' ? t('Сохранение…', 'Saving…') : state === 'invalid' ? t('Проверьте код страны, названия и уникальность городов.', 'Check country code, names and unique cities.') : state.includes('error') ? t('Хранилище недоступно или данные повреждены. Изменения не подтверждены.', 'Storage unavailable or data invalid. Changes are unconfirmed.') : ''}</Copy>
    <ScrollView horizontal contentContainerStyle={{ gap: 8, marginBottom: 18 }}><Pill label={t('Страны и города', 'Countries & cities')} selected={tab === 'geo'} onPress={() => setTab('geo')} /><Pill label={t('Тексты', 'Texts')} selected={tab === 'text'} onPress={() => { setTextDraft(edits.texts); setTab('text'); }} /><Pill label={t('VPN-узлы', 'VPN nodes')} selected={tab === 'nodes'} onPress={() => setTab('nodes')} /></ScrollView>
    {tab === 'geo' && (draft ? <>
      <Panel>
        {isNew ? input(t('Код страны (2 латинские буквы)', 'Country code (2 letters)'), draft.code, code => { setDuplicate(false); setDraft({ ...draft, code: code.toUpperCase() }); }, 2) : <Copy weight="bold" color={colors.gold} style={{ marginBottom: 12 }}>{t('Код страны', 'Country code')}: {draft.code}</Copy>}
        {duplicate && <Copy size={12} color={colors.danger} style={{ marginBottom: 12 }}>{t('Страна с таким кодом уже есть — откройте её через «Редактировать».', 'A country with this code exists — open it with “Edit”.')}</Copy>}
        {input(t('Название страны RU', 'Country name RU'), draft.name.ru, v => setDraft({ ...draft, name: { ...draft.name, ru: v } }))}
        {input(t('Название страны EN', 'Country name EN'), draft.name.en, v => setDraft({ ...draft, name: { ...draft.name, en: v } }))}
        <ScrollView horizontal contentContainerStyle={{ gap: 6 }}>{['ru', 'eu', 'sea', 'na', 'latam', 'me', 'asia', 'other'].map(r => <Pill key={r} label={r.toUpperCase()} selected={draft.regionId === r} onPress={() => setDraft({ ...draft, regionId: r as CountryEdit['regionId'] })} />)}</ScrollView>
        <View style={{ height: 14 }} /><Button secondary onPress={() => setDraft({ ...draft, hidden: !draft.hidden })}>{draft.hidden ? t('Страна скрыта — показать', 'Country hidden — show') : t('Скрыть страну', 'Hide country')}</Button>
      </Panel>
      <Section>{t('Города: названия RU / EN', 'Cities: RU / EN names')}</Section>
      {draft.cities.map((c, index) => <Panel key={c.id}>
        <Copy size={11} color={colors.gold}>{index + 1}</Copy>
        {input(`${t('Город RU', 'City RU')} ${index + 1}`, c.name.ru, v => setDraft({ ...draft, cities: draft.cities.map(x => x.id === c.id ? { ...x, name: { ...x.name, ru: v } } : x) }))}
        {input(`${t('Город EN', 'City EN')} ${index + 1}`, c.name.en, v => setDraft({ ...draft, cities: draft.cities.map(x => x.id === c.id ? { ...x, name: { ...x.name, en: v } } : x) }))}
        <Button secondary onPress={() => setDraft({ ...draft, cities: draft.cities.filter(x => x.id !== c.id) })}>{t('Убрать город из черновика', 'Remove city from draft')}</Button>
      </Panel>)}
      <Panel>{input(t('Новый город RU', 'New city RU'), ru, setRu)}{input(t('Новый город EN', 'New city EN'), en, setEn)}<Button secondary disabled={!ru.trim() || !en.trim() || draft.cities.length >= 100} onPress={() => { setDraft({ ...draft, cities: [...draft.cities, { id: `local-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`, name: { ru: ru.trim(), en: en.trim() } }] }); setRu(''); setEn(''); }}>{t('Добавить город', 'Add city')}</Button></Panel>
      <Button disabled={!ready || state === 'saving'} onPress={() => { void saveCountry(); }}>{t('Сохранить страну и города', 'Save country & cities')}</Button><View style={{ height: 12 }} /><Button secondary onPress={() => setDraft(undefined)}>{t('Отменить черновик', 'Discard draft')}</Button>
    </> : <>
      <Button secondary disabled={!ready} onPress={() => { setIsNew(true); setDuplicate(false); setDraft({ code: '', name: { ru: '', en: '' }, regionId: 'other', hidden: false, cities: [] }); }}>{t('Добавить страну', 'Add country')}</Button>
      {input(t('Поиск в редакторе', 'Search editor'), query, setQuery)}
      {countries.filter(c => [c.code, c.name.ru, c.name.en].some(n => n.toLowerCase().includes(query.toLowerCase()))).map(c => <Panel key={c.code}><Copy weight="bold">{c.code} · {c.name[prefs.language]} {edits.countries.find(e => e.code === c.code)?.hidden ? t('(скрыта)', '(hidden)') : ''}</Copy><Copy size={11} color={colors.muted}>{c.cities.length} {t(ruCities(c.cities.length), c.cities.length === 1 ? 'city' : 'cities')}</Copy><View style={{ height: 12 }} /><Button secondary onPress={() => { setIsNew(false); setDuplicate(false); setDraft(edits.countries.find(e => e.code === c.code) ?? toCountryEdit(c)); setRu(''); setEn(''); }}>{t(`Редактировать ${c.code}`, `Edit ${c.code}`)}</Button>{edits.countries.some(e => e.code === c.code) && <><View style={{ height: 8 }} /><Button secondary onPress={() => { void save({ ...edits, countries: edits.countries.filter(e => e.code !== c.code) }); }}>{t(`Восстановить ${c.code}`, `Restore ${c.code}`)}</Button></>}</Panel>)}
    </>)}
    {tab === 'text' && <Panel>
      {input(t('Заголовок лобби', 'Lobby title'), textDraft.lobbyTitle, v => setTextDraft({ ...textDraft, lobbyTitle: v }))}
      {input(t('Подсказка списка стран', 'Country list hint'), textDraft.catalogHint, v => setTextDraft({ ...textDraft, catalogHint: v }), 600)}
      {input(t('Код страны описания', 'Description country code'), hintCountry, v => setHintCountry(v.toUpperCase()), 2)}
      {input(t('Описание страны', 'Country description'), textDraft.countryHints[hintCountry] ?? '', v => setTextDraft({ ...textDraft, countryHints: { ...textDraft.countryHints, [hintCountry]: v } }), 600)}
      <Copy size={11} color={colors.muted}>{t('Пустое поле возвращает стандартный текст. Пользовательские тексты одинаковы для RU/EN.', 'Empty fields restore defaults. Custom texts are shared across RU/EN.')}</Copy><View style={{ height: 12 }} />
      <Button disabled={!ready || state === 'saving'} onPress={() => { void save({ ...edits, texts: textDraft }); }}>{t('Сохранить тексты', 'Save texts')}</Button>
    </Panel>}
    {tab === 'nodes' && <>
      <Button secondary disabled={gate.isFetching} onPress={() => { void gate.refetch(); }}>{t('Обновить VPN Gate', 'Refresh VPN Gate')}</Button>
      <Copy size={11} color={colors.muted} style={{ marginVertical: 12 }}>{gate.isError ? t('Источник недоступен', 'Source unavailable') : t('Только узлы текущего списка. Отметки привязаны к ID профиля и не гарантируют доступность.', 'Current feed nodes only. Marks are bound to profile IDs and do not guarantee availability.')}</Copy>
      {input(t('Поиск узла: IP или страна', 'Node search: IP or country'), nodeQuery, setNodeQuery)}
      {nodeMatches.length > 40 && <Copy size={11} color={colors.muted} style={{ marginBottom: 12 }}>{t(`Показаны первые 40 из ${nodeMatches.length}. Уточните поиск.`, `Showing first 40 of ${nodeMatches.length}. Refine search.`)}</Copy>}
      {nodeMatches.slice(0, 40).map(s => {
        const mark = edits.nodes[s.id] ?? { hidden: false, featured: false };
        return <Panel key={s.id}><Copy weight="bold">{s.countryCode} · {s.ip}:{s.port}</Copy><Copy size={11} color={colors.muted}>{mark.hidden ? t('Скрыт', 'Hidden') : t('Виден', 'Visible')} · {mark.featured ? t('Выделен', 'Featured') : t('Обычный', 'Normal')}</Copy><View style={{ height: 10 }} /><Button secondary disabled={state === 'saving'} onPress={() => { void save({ ...edits, nodes: { ...edits.nodes, [s.id]: { ...mark, hidden: !mark.hidden } } }); }}>{mark.hidden ? t(`Показать ${s.ip}`, `Show ${s.ip}`) : t(`Скрыть ${s.ip}`, `Hide ${s.ip}`)}</Button><View style={{ height: 8 }} /><Button secondary disabled={state === 'saving'} onPress={() => { void save({ ...edits, nodes: { ...edits.nodes, [s.id]: { ...mark, featured: !mark.featured } } }); }}>{mark.featured ? t(`Снять выделение ${s.ip}`, `Unfeature ${s.ip}`) : t(`Выделить ${s.ip}`, `Feature ${s.ip}`)}</Button></Panel>;
      })}
    </>}
    <Section>{t('Сброс локальных правок', 'Reset local edits')}</Section>
    {confirmReset ? <Panel><Copy>{t('Удалить все локальные правки? Настройки VPN, язык и согласие останутся.', 'Delete all local edits? VPN preferences, language and consent remain.')}</Copy><Button onPress={() => { void save(emptyEdits()).then(ok => { if (ok) { setDraft(undefined); setTextDraft(emptyEdits().texts); setConfirmReset(false); } }); }}>{t('Подтвердить сброс', 'Confirm reset')}</Button><View style={{ height: 8 }} /><Button secondary onPress={() => setConfirmReset(false)}>{t('Отмена', 'Cancel')}</Button></Panel> : <Button secondary onPress={() => setConfirmReset(true)}>{t('Сбросить все локальные правки', 'Reset all local edits')}</Button>}
  </Screen>;
}