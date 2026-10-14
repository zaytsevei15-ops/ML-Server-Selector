import { useState } from 'react';
import { View, Pressable, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LobbyBanner } from '../components/lobby-banner';
import { VpnControls } from '../components/vpn-controls';
import { regions } from '../domain/catalog';
import { filterVpnCountries, sourceTime } from '../domain/vpn-countries';
import { useLocalCatalog } from '../queries/local-catalog';
import { useSelector } from '../state/selector-context';
import { Screen, Copy, Icon, Row, Section, Pill, Panel, Note, ui } from '../components/selector-ui';

export default function CountriesScreen() {
  const { colors, prefs, t } = useSelector();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const { gate, servers, countries, edits } = useLocalCatalog();
  const matches = filterVpnCountries(countries, search, filter);
  const selected = countries.flatMap(c => c.cities).find(c => c.id === prefs.destinationId);
  return <Screen>
    <Row style={{ justifyContent: 'space-between', marginBottom: 18 }}>
      <Row><View style={{ borderWidth: 1, borderColor: colors.gold, borderRadius: 10, padding: 9 }}><Icon name="shield-outline" size={21} /></View><View><Copy weight="display" size={19}>ML SERVER SELECTOR</Copy><Copy size={9} color={colors.muted} style={{ letterSpacing: 1.5 }}>{t('СТРАНА → ГОРОД', 'COUNTRY → CITY')}</Copy></View></Row>
      <Pressable accessibilityRole="button" accessibilityLabel={t('Открыть настройки', 'Open settings')} onPress={() => router.push('/(tabs)/settings')} style={{ padding: 8 }}><Icon name="options-outline" color={colors.muted} /></Pressable>
    </Row>
    <LobbyBanner countryCount={countries.length} destination={selected ? `${selected.country[prefs.language]} · ${selected.name[prefs.language]}` : undefined} />
    <VpnControls compact country={selected?.code ?? prefs.vpnCountry ?? ''} />
    <Panel><Row><Icon name="cloud-download-outline" color={colors.blue} /><View style={{ flex: 1 }}><Copy weight="bold" size={14}>VPN Gate</Copy><Copy accessibilityLiveRegion="polite" size={11} color={colors.muted}>{gate.isFetching ? t('Загружаем официальный список…', 'Loading official list…') : gate.isError ? t('Источник недоступен. Список не актуален.', 'Source unavailable. List is not current.') : gate.data ? t(`${servers.length} совместимых профилей · загружено ${sourceTime(gate.data.fetchedAt, prefs.language)}`, `${servers.length} compatible profiles · fetched ${sourceTime(gate.data.fetchedAt, prefs.language)}`) : t('Список ещё не загружен', 'List not loaded yet')}</Copy></View><Pressable accessibilityRole="button" accessibilityLabel={t('Обновить VPN Gate', 'Refresh VPN Gate')} disabled={gate.isFetching} onPress={() => gate.refetch()} style={{ padding: 12 }}><Icon name="refresh-outline" /></Pressable></Row></Panel>
    <Row style={{ marginBottom: 16, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: 4, paddingLeft: 16 }}><Icon name="search-outline" color={colors.blue} size={20} /><TextInput accessibilityLabel={t('Поиск страны или города', 'Search country or city')} value={search} onChangeText={setSearch} placeholder={t('Страна или город…', 'Country or city…')} placeholderTextColor={colors.muted} style={[ui.input, { flex: 1, color: colors.text, borderWidth: 0, paddingHorizontal: 0 }]} />{!!search && <Pressable accessibilityLabel={t('Очистить поиск', 'Clear search')} onPress={() => setSearch('')} style={{ padding: 14 }}><Icon name="close" size={18} color={colors.muted} /></Pressable>}</Row>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}><Pill label={t('Все страны', 'All countries')} selected={filter === 'all'} onPress={() => setFilter('all')} />{[...regions, { id: 'asia', code: 'ASIA' }, { id: 'other', code: t('Другие', 'Other') }].map(r => <Pill key={r.id} label={r.code} selected={filter === r.id} onPress={() => setFilter(r.id)} />)}</ScrollView>
    {edits.texts.catalogHint && <Note title={t('Ваша подсказка', 'Your hint')} text={edits.texts.catalogHint} />}
    <Section right={`${matches.length}/${countries.length}`}>{t('1 / Выберите страну', '1 / Choose a country')}</Section>
    {matches.map(country => <Pressable key={country.code} accessibilityRole="button" accessibilityLabel={country.name[prefs.language]} onPress={() => router.push({ pathname: '/country/[code]', params: { code: country.code, city: search } })}>
      <Panel style={{ padding: 15, marginBottom: 10, borderLeftWidth: 3, borderColor: country.code === 'RU' ? colors.gold : colors.line }}><Row><View style={{ backgroundColor: colors.raised, borderWidth: 1, borderColor: colors.line, width: 49, height: 53, borderRadius: 3, alignItems: 'center', justifyContent: 'center' }}><Copy size={24} weight="display" color={country.code === 'RU' ? colors.gold : colors.blue}>{country.code}</Copy></View><View style={{ flex: 1 }}><Copy size={15} weight="bold">{country.name[prefs.language]}</Copy><Copy size={10} color={colors.muted} style={{ marginTop: 3 }}>{country.cities.length ? country.cities.slice(0, 2).map(c => c.name[prefs.language]).join(' · ') : t('Города не указаны источником', 'Source does not specify cities')}</Copy><Copy size={10} color={gate.isError || !gate.data ? colors.muted : colors.blue} style={{ marginTop: 5 }}>{gate.isError || !gate.data ? t('Доступность неизвестна', 'Availability unknown') : t(`Профилей VPN Gate: ${servers.filter(s => s.countryCode === country.code).length}`, `VPN Gate profiles: ${servers.filter(s => s.countryCode === country.code).length}`)}</Copy></View><Icon name="chevron-forward" size={18} color={colors.gold} /></Row></Panel>
    </Pressable>)}
    {!matches.length && <Panel><Copy weight="bold">{t('Ничего не найдено', 'No destinations found')}</Copy><Pressable accessibilityRole="button" onPress={() => { setFilter('all'); setSearch(''); }} style={{ paddingVertical: 14 }}><Copy color={colors.gold}>{t('Сбросить поиск', 'Reset search')}</Copy></Pressable></Panel>}
    <View style={{ height: 16 }} />
    <Note title={t('Город — пожелание, не адрес VPN', 'City is a preference, not a VPN address')} text={t('VPN Gate сообщает только страну и ведёт журналы соединений. Профиль не подтверждает доступность узла. Нативный VPN доступен только в новой Android-сборке, не в браузере или Expo Go.', 'VPN Gate reports countries only and keeps connection logs. A profile does not prove node reachability. Native VPN requires a new Android build, not a browser or Expo Go.')} />
    <Section>{t('Отдельно об игре', 'Separate game information')}</Section>
    <Pressable accessibilityRole="button" accessibilityLabel="Advanced Server" onPress={() => router.push('/advanced')}><Panel><Row><Icon name="flask-outline" color={colors.blue} /><View style={{ flex: 1 }}><Copy weight="bold">Advanced Server</Copy><Copy size={11} color={colors.muted}>{t('Не VPN-локация. Доступ определяет Moonton.', 'Not a VPN location. Moonton controls access.')}</Copy></View><Icon name="chevron-forward" size={18} /></Row></Panel></Pressable>
    <Copy size={10} color={colors.muted} style={{ textAlign: 'center', marginTop: 12 }}>{t('Не связано с Moonton. Нет изменения файлов игры.', 'Not affiliated with Moonton. No game-file modification.')}</Copy>
  </Screen>;
}