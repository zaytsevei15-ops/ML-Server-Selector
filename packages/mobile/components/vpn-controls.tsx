import { View, Pressable } from 'react-native';
import { useVpn } from '../state/vpn-context';
import { useSelector } from '../state/selector-context';
import { Panel, Row, Icon, Copy, Button, Note } from './selector-ui';

export function VpnControls({ country, serverId, compact = false }: { country: string; serverId?: string; compact?: boolean }) {
  const vpn = useVpn(); const { prefs, update, t, colors } = useSelector();
  const labels = {
    unavailable: t('Только Android-сборка', 'Android build only'), disconnected: t('Не подключено', 'Not connected'),
    permission: t('Разрешение Android…', 'Android permission…'), loading: t('Загрузка профиля…', 'Loading profile…'),
    connecting: t('Подключение…', 'Connecting…'), connected: t('Подключено', 'Connected'),
    disconnecting: t('Отключение…', 'Disconnecting…'), error: t('Ошибка подключения', 'Connection error'),
  };
  const connecting = ['permission', 'loading', 'connecting', 'disconnecting'].includes(vpn.status);
  const messages: Record<string, string> = {
    PERMISSION_DENIED: t('Вы отказали в системном VPN-разрешении.', 'System VPN permission was denied.'),
    NO_SERVERS: t('В текущем списке нет узлов этой страны.', 'No nodes for this country in the current feed.'),
    TIMEOUT: t('За 60 секунд соединение не подтверждено. Отправлена команда остановки.', 'Connection was not confirmed within 60 seconds. Stop was requested.'),
    DISCONNECT_FAILED: t('Отключение не подтверждено. Проверьте VPN в настройках Android.', 'Disconnect was not confirmed. Check Android VPN settings.'),
  };
  return <>
    {!compact && <Panel><Row><Icon name={vpn.status === 'connected' ? 'shield-checkmark-outline' : 'cloud-offline-outline'} color={vpn.status === 'connected' ? colors.green : colors.muted} /><Copy accessibilityLiveRegion="polite" weight="bold">{labels[vpn.status]}</Copy></Row>
      {vpn.serverIp && <Copy size={12} color={colors.muted} style={{ marginTop: 12 }}>{vpn.serverIp} · {t('Город неизвестен', 'City unknown')}</Copy>}
    </Panel>}
    {compact && vpn.available && <Copy accessibilityLiveRegion="polite" size={12} color={colors.blue} style={{ marginBottom: 10, textAlign: 'center' }}>{labels[vpn.status]}</Copy>}
    {vpn.error && <Note title={t('Не удалось завершить действие', 'Action could not be completed')} text={messages[vpn.error] ?? t('Источник, VPN-служба или TLS-проверка недоступны. Обновите список и попробуйте другой узел. Проверки сертификата не отключаются.', 'Source, VPN service or TLS verification failed. Refresh the list and try another node. Certificate checks are never disabled.')} />}
    {vpn.status === 'connected' || connecting ? <Button secondary disabled={vpn.status === 'disconnecting'} onPress={() => { void vpn.disconnect(); }} icon="power-outline">{t('Отключить VPN', 'Disconnect VPN')}</Button> : <Button disabled={!vpn.available || !country || (!compact && !serverId)} onPress={() => { update({ vpnCountry: country }); void vpn.connect(serverId, country); }} icon="power-outline">{vpn.available ? t('Подключить VPN', 'Connect VPN') : t('Подключение недоступно', 'Connection unavailable')}</Button>}
    {compact ? <Copy size={10} color={colors.muted} style={{ textAlign: 'center', marginTop: 10, marginBottom: 18 }}>{vpn.available ? t('Сначала выберите страну. Город узла неизвестен.', 'Choose a country first. Node city is unknown.') : t('Нужна новая Android-сборка через Publish', 'New Android build through Publish required')}</Copy> : <>
    <View style={{ height: 16 }} />
    <Pressable accessibilityRole="switch" aria-checked={prefs.autoConnect && prefs.vpnCountry === country} accessibilityState={{ checked: prefs.autoConnect && prefs.vpnCountry === country, disabled: !vpn.available }} disabled={!vpn.available} onPress={() => update({ autoConnect: !(prefs.autoConnect && prefs.vpnCountry === country), vpnCountry: country })}>
      <Panel><Row><Icon name={prefs.autoConnect && prefs.vpnCountry === country ? 'toggle' : 'toggle-outline'} /><View style={{ flex: 1 }}><Copy weight="bold" size={13}>{t('Автоподключение при запуске', 'Auto-connect on launch')}</Copy><Copy size={11} color={colors.muted}>{t('Один запуск к узлу выбранной страны после VPN-согласия. Не после перезагрузки телефона.', 'One attempt to a node in this country after VPN consent. Not on phone boot.')}</Copy></View></Row></Panel>
    </Pressable>
    <Note title={t('Нативный Android VPN', 'Native Android VPN')} text={vpn.available ? t('Включён OpenVPN-модуль. Системное VPN-согласие обязательно. «Подключено» показывается только по событию движка, не по загрузке профиля. Работа на устройстве ещё не проверена.', 'OpenVPN module is present. System VPN consent is required. Connected is shown only from an engine event, never from profile loading. On-device operation is not yet verified.') : t('Код нативного VPN добавлен. Браузер и Expo Go не содержат этот модуль: нужна новая Android-сборка через Publish. Проверка туннеля на устройстве ещё не выполнена.', 'Native VPN integration has been added. Browsers and Expo Go do not contain this module: a new Android build through Publish is required. On-device tunnel testing is still pending.')} />
    </>}
  </>;
}