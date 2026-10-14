import { useEffect, useState } from 'react';
import { View, Pressable, TextInput } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { sourceTime } from '../domain/vpn-countries';
import { profileInspectionOptions } from '../queries/vpn-gate';
import { useLocalCatalog } from '../queries/local-catalog';
import { VpnControls } from '../components/vpn-controls';
import { NodePing } from '../components/node-ping';
import { useSelector } from '../state/selector-context';
import { Screen, Copy, Icon, Row, Section, Panel, Note, Button, ui } from '../components/selector-ui';

export default function CountryDetailScreen() {
  const { code, city: query = '' } = useLocalSearchParams<{ code: string; city?: string }>();
  const router = useRouter();
  const { colors, prefs, update, t } = useSelector();
  const { gate, servers: allServers, countries, edits } = useLocalCatalog();
  const country = countries.find(c => c.code === code?.toUpperCase());
  const servers = allServers.filter(s => s.countryCode === country?.code);
  // Explicit user choice only; defaults are derived each render so local edits loaded after mount still restore the saved city.
  const [chosen, setChosen] = useState<string>();
  const [serverId, setServerId] = useState<string>();
  const [citySearch, setCitySearch] = useState('');
  const inspect = useMutation(profileInspectionOptions());
  const resetInspection = inspect.reset;
  const selectedServer = servers.find(s => s.id === serverId) ?? servers[0];
  const currentInspection = inspect.data?.server.id === selectedServer?.id ? inspect.data : undefined;
  useEffect(() => { resetInspection(); }, [selectedServer?.id, resetInspection]);
  const back = () => router.canGoBack() ? router.back() : router.replace('/(tabs)');
  if (!country) return <Screen><Note title={t('Страна пока не найдена', 'Country not found yet')} text={t('Для стран вне справочника нужен актуальный список VPN Gate.', 'Countries outside the directory require the current VPN Gate list.')} /><Button onPress={() => gate.refetch()}>{t('Обновить список', 'Refresh list')}</Button><View style={{ height: 16 }} /><Button secondary onPress={back}>{t('Вернуться', 'Go back')}</Button></Screen>;
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const selected = country.cities.find(c => c.id === chosen) ?? country.cities.find(c => c.id === prefs.destinationId) ?? (normalizedQuery ? country.cities.find(c => [c.name.ru, c.name.en].some(v => v.toLocaleLowerCase().includes(normalizedQuery))) : undefined) ?? country.cities[0];
  const cityMatches = country.cities.filter(c => [c.name.ru, c.name.en].some(name => name.toLocaleLowerCase().replace(/ё/g, 'е').includes(citySearch.trim().toLocaleLowerCase().replace(/ё/g, 'е'))));
  return <Screen>
    <Pressable accessibilityRole="button" accessibilityLabel={t('Все страны', 'All countries')} onPress={back} style={{ minHeight: 44, marginBottom: 16 }}><Row><Icon name="arrow-back" /><Copy color={colors.gold} size={12}>{t('Все страны', 'All countries')}</Copy></Row></Pressable>
    <Copy weight="bold" size={10} color={colors.gold} style={{ letterSpacing: 2 }}>{country.code} / VPN GATE</Copy>
    <Copy size={30} weight="bold" style={{ marginTop: 10 }}>{country.name[prefs.language]}</Copy>
    <Copy size={13} color={colors.muted} style={{ marginTop: 10 }}>{t('Направление независимо от игры. VPN Gate сообщает страну, но не город.', 'Destination is independent of the game. VPN Gate reports a country, not a city.')}</Copy>
    {edits.texts.countryHints[country.code] && <Note title={t('Ваше описание', 'Your description')} text={edits.texts.countryHints[country.code]} />}
    <Section right={`${cityMatches.length}/${country.cities.length}`}>{t('2 / Предпочитаемый город', '2 / Preferred city')}</Section>
    {country.cities.length > 5 && <TextInput accessibilityLabel={t('Поиск города в России', 'Search Russian cities')} value={citySearch} onChangeText={setCitySearch} placeholder={t('Найти город…', 'Find a city…')} placeholderTextColor={colors.muted} style={[ui.input, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.line, marginBottom: 16 }]} />}
    {country.cities.length > 0 && !cityMatches.length && <Copy color={colors.muted} style={{ marginBottom: 14 }}>{t('Город не найден', 'City not found')}</Copy>}
    {cityMatches.map(c => <Pressable key={c.id} accessibilityRole="radio" accessibilityLabel={c.name[prefs.language]} aria-checked={c.id === selected?.id} accessibilityState={{ checked: c.id === selected?.id }} onPress={() => setChosen(c.id)} style={{ marginBottom: 10 }}><Panel style={{ padding: 16, marginBottom: 0, borderColor: c.id === selected?.id ? colors.gold : colors.line, backgroundColor: c.id === selected?.id ? colors.raised : colors.surface }}><Row><Icon name="location-outline" color={colors.blue} /><View style={{ flex: 1 }}><Copy weight="bold" size={14}>{c.name[prefs.language]}</Copy><Copy size={11} color={colors.muted} style={{ marginTop: 5 }}>{t('Пожелание · VPN-локация города неизвестна', 'Preference · VPN city location unknown')}</Copy></View><Icon name={c.id === selected?.id ? 'radio-button-on' : 'radio-button-off'} size={20} /></Row></Panel></Pressable>)}
    {selected ? <><View style={{ height: 14 }} /><Button icon="bookmark-outline" onPress={() => update({ destinationId: selected.id, vpnCountry: country.code })}>{t('Сохранить направление', 'Save destination')}</Button>{prefs.destinationId === selected.id && <Copy accessibilityLiveRegion="polite" size={12} color={colors.green} style={{ marginTop: 12 }}>{t('Направление сохранено.', 'Destination saved.')}</Copy>}</> : <Note title={t('Город неизвестен', 'City unknown')} text={t('У этой страны в справочнике нет городов. Источник VPN Gate их не предоставляет.', 'This country has no cities in the directory. VPN Gate does not provide them.')} />}
    <Section right={gate.isError ? '—' : `${servers.length}`}>{t('3 / Профили OpenVPN', '3 / OpenVPN profiles')}</Section>
    <Panel><Row><Icon name="cloud-download-outline" color={colors.blue} /><View style={{ flex: 1 }}><Copy size={12} color={colors.muted}>{gate.isFetching ? t('Обновление…', 'Refreshing…') : gate.isError ? t('Ошибка загрузки. Старые данные не подтверждены.', 'Load failed. Previous data is unconfirmed.') : gate.data ? t(`Загружено ${sourceTime(gate.data.fetchedAt, prefs.language)} · по рейтингу источника`, `Fetched ${sourceTime(gate.data.fetchedAt, prefs.language)} · ranked by source`) : t('Ожидаем список', 'Waiting for list')}</Copy></View><Pressable accessibilityRole="button" accessibilityLabel={t('Обновить VPN Gate', 'Refresh VPN Gate')} disabled={gate.isFetching} onPress={() => gate.refetch()} style={{ padding: 12 }}><Icon name="refresh-outline" /></Pressable></Row></Panel>
    <Copy size={11} color={colors.muted} style={{ marginBottom: 16 }}>{t('Пинг и скорость ниже сообщает VPN Gate; это не замер с вашего устройства. Наличие профиля не подтверждает доступность сервера.', 'Ping and speed below are reported by VPN Gate, not measured from your device. A profile does not prove server reachability.')}</Copy>
    {!servers.length && !gate.isFetching && <Note title={gate.isError ? t('Источник недоступен', 'Source unavailable') : t('Нет профилей для этой страны', 'No profiles for this country')} text={t('Россия и другие страны доступны только при наличии узлов в текущем списке. Попробуйте обновить его позже.', 'Russia and other countries are available only when nodes appear in the current feed. Try refreshing later.')} />}
    {servers.slice(0, 8).map(server => <Pressable key={server.id} accessibilityRole="radio" accessibilityLabel={`${t('Узел', 'Node')} ${server.ip}`} aria-checked={server.id === selectedServer?.id} accessibilityState={{ checked: server.id === selectedServer?.id }} onPress={() => setServerId(server.id)}><Panel style={{ padding: 16, borderColor: server.id === selectedServer?.id ? colors.gold : colors.line }}><Row><Icon name={server.id === selectedServer?.id ? 'radio-button-on' : 'radio-button-off'} /><View style={{ flex: 1 }}><Copy weight="bold" size={14}>{server.ip}:{server.port}</Copy><Copy size={11} color={colors.blue}>OpenVPN / {server.protocol.toUpperCase()} · {country.code}</Copy><Copy size={10} color={colors.muted}>{t('Город неизвестен', 'City unknown')} · {t('рейтинг', 'score')} {server.score}</Copy><Copy size={10} color={colors.muted}>{t('Данные источника', 'Source reports')}: {server.reportedPingMs === null ? '—' : `${server.reportedPingMs} ms`} · {(server.reportedSpeedBps / 1_000_000).toFixed(1)} Mbps</Copy></View></Row></Panel></Pressable>)}
    {servers.length > 8 && <Copy size={11} color={colors.muted} style={{ marginBottom: 16 }}>{t('Показаны 8 профилей с наивысшим рейтингом источника.', 'Showing the 8 highest source-ranked profiles.')}</Copy>}
    <Button secondary disabled={!selectedServer || gate.isError || gate.isFetching || inspect.isPending} onPress={() => { if (selectedServer) inspect.mutate({ id: selectedServer.id }); }} icon="document-text-outline">{inspect.isPending ? t('Проверяем структуру…', 'Checking structure…') : t('Проверить профиль', 'Check profile')}</Button>
    {inspect.isError && <View style={{ marginTop: 16 }}><Note title={t('Профиль не получен', 'Profile unavailable')} text={t('Узел мог исчезнуть из списка или источник недоступен. Обновите список и повторите.', 'The node may have disappeared or the source is unavailable. Refresh the list and retry.')} /></View>}
    {currentInspection && <View style={{ marginTop: 16 }}><Note title={t('Структура профиля проверена', 'Profile structure checked')} text={t('Адрес совпадает со списком; разрешены только ожидаемые параметры и встроенные сертификаты. Проверка TLS ещё требуется. Соединение с сервером не проверялось; VPN не запущен.', 'Address matches the feed; only expected options and inline certificates are allowed. TLS review is still required. The endpoint was not probed; no VPN was started.')} /></View>}
    {servers.some(s => edits.nodes[s.id]?.featured) && <Copy size={11} color={colors.gold} style={{ marginBottom: 12 }}>{t('Выделенные вами узлы показаны первыми.', 'Your featured nodes are shown first.')}</Copy>}
    <Section>{t('4 / Android VPN', '4 / Android VPN')}</Section>
    <NodePing ip={selectedServer?.ip} />
    <VpnControls country={country.code} serverId={selectedServer?.id} />
    <Note title={t('Добровольческие узлы с журналами', 'Volunteer nodes with logs')} text={t('Операторы VPN Gate могут журналировать подключения, а серверы — исчезать без предупреждения. Это не сервис без логов и не гарантия анонимности.', 'VPN Gate operators may log connections, and nodes can disappear without warning. This is not a no-logs service or a guarantee of anonymity.')} />
  </Screen>;
}