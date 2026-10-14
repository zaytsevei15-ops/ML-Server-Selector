import { View, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSelector } from '../../state/selector-context';
import { Screen, Copy, Icon, Row, Panel, Section, Pill, Note, Button, openExternal } from '../../components/selector-ui';
import { termsUrl } from '../../domain/catalog';

export default function SettingsScreen() {
  const { colors, prefs, update, t } = useSelector();
  const router = useRouter();
  return <Screen>
    <Row style={{ marginBottom: 24 }}><Icon name="options-outline" /><Copy size={10} color={colors.gold} weight="bold" style={{ letterSpacing: 2 }}>{t('ПОД ВАС', 'MAKE IT YOURS')}</Copy></Row>
    <Copy size={30} weight="bold">{t('Настройки', 'Settings')}</Copy>
    <Copy color={colors.muted} size={13} style={{ marginTop: 10 }}>{t('Ваш язык. Ваша тема. Никаких подписок.', 'Your language. Your theme. No subscriptions.')}</Copy>
    <Section>{t('Оформление', 'Appearance')}</Section>
    <Panel><Row style={{ marginBottom: 16 }}><Icon name={prefs.theme === 'dark' ? 'moon-outline' : 'sunny-outline'} color={colors.blue} /><Copy weight="bold">{t('Тема интерфейса', 'Interface theme')}</Copy></Row><Row><Pill label={t('Тёмная', 'Dark')} selected={prefs.theme === 'dark'} onPress={() => update({ theme: 'dark' })} /><Pill label={t('Светлая', 'Light')} selected={prefs.theme === 'light'} onPress={() => update({ theme: 'light' })} /></Row></Panel>
    <Section>{t('Язык приложения', 'App language')}</Section>
    <Panel><Row style={{ marginBottom: 16 }}><Icon name="language-outline" color={colors.blue} /><Copy weight="bold">{t('Язык', 'Language')}</Copy></Row><Row><Pill label="Русский" selected={prefs.language === 'ru'} onPress={() => update({ language: 'ru' })} /><Pill label="English" selected={prefs.language === 'en'} onPress={() => update({ language: 'en' })} /></Row></Panel>
    <Section>{t('Локальное управление', 'Local management')}</Section>
    <Button secondary icon="create-outline" onPress={() => router.push('/admin')}>{t('Меню администратора', 'Administrator menu')}</Button>
    <Copy size={11} color={colors.muted} style={{ marginTop: 8 }}>{t('Страны, города, тексты и видимость узлов — только на вашем устройстве.', 'Countries, cities, texts and node visibility — on this device only.')}</Copy>
    <Section>{t('Приватность и безопасность', 'Privacy & safety')}</Section>
    <Panel>{[
      { icon: 'lock-closed-outline' as const, title: t('Локальные настройки', 'Local preferences'), body: Platform.OS === 'web' ? t('В браузерном превью тема, язык и согласие хранятся в sessionStorage без шифрования. ID не сохраняется.', 'In the browser preview, theme, language and consent use unencrypted sessionStorage. IDs are not stored.') : t('Тема, язык и согласие защищены Expo SecureStore — шифрование средствами ОС. ID не сохраняется.', 'Theme, language and consent are protected by Expo SecureStore using OS encryption. IDs are not stored.') },
      { icon: 'shield-checkmark-outline' as const, title: t('VPN Gate / OpenVPN', 'VPN Gate / OpenVPN'), body: t('Загружается официальный список и проверяется структура профилей. Город и доступность узла не подтверждаются. Нативный Android OpenVPN добавлен; в браузере и Expo Go он недоступен. Испытание на устройстве ещё требуется.', 'Loads the official list and checks profile structure. Node city and reachability are unconfirmed. Native Android OpenVPN integration added; unavailable in browser and Expo Go. On-device testing is still required.') },
      { icon: 'heart-outline' as const, title: t('Добровольческие узлы', 'Volunteer nodes'), body: t('Нет покупок и партнёрских ссылок. VPN Gate ведёт журналы соединений; узлы могут исчезать. Это не VPN без логов.', 'No purchases or affiliate links. VPN Gate keeps connection logs; nodes may disappear. This is not a no-logs VPN.') },
    ].map((item, index) => <Row key={index} style={{ alignItems: 'flex-start', marginTop: index ? 22 : 0 }}><Icon name={item.icon} color={colors.green} size={20} /><View style={{ flex: 1 }}><Copy size={13} weight="bold">{item.title}</Copy><Copy size={12} color={colors.muted} style={{ marginTop: 5 }}>{item.body}</Copy></View></Row>)}</Panel>
    <Note title={t('Аналитика платформы Runable', 'Runable platform analytics')} text={t('Шаблон включает обязательную аналитику с адресом r.lilstts.com/events. События использования и сетевые метаданные могут передаваться наружу; полной сетевой изоляции нет. Мы не добавляем ID игрока в события, ссылки или запросы. Открытие внешнего сайта регулируется его политикой.', 'The template includes mandatory analytics at r.lilstts.com/events. Usage events and network metadata may leave the device; this is not a fully offline-isolated app. We do not add player IDs to events, links or requests. External sites have their own privacy policies.')} />
    <Section>{t('О приложении', 'About the app')}</Section>
    <Panel><Copy size={20} weight="display" color={colors.gold}>ML SERVER SELECTOR</Copy><Copy size={11} color={colors.muted} style={{ marginTop: 6 }}>{t('Версия 1.4.0 · Android 9+ · ICMP-пинг', 'Version 1.4.0 · Android 9+ · ICMP ping')}</Copy><Copy size={12} color={colors.muted} style={{ marginTop: 14 }}>{t('Независимое приложение, не связано с Moonton. Названия Mobile Legends: Bang Bang и Moonton принадлежат правообладателям. Справочник не гарантирует доступность локаций, смену сервера или снижение задержки.', 'Independent app, not affiliated with Moonton. Mobile Legends: Bang Bang and Moonton belong to their respective owners. The directory guarantees neither location availability, server switching nor lower latency.')}</Copy></Panel>
    <Button secondary onPress={() => openExternal(termsUrl)} icon="open-outline">{t('Условия игры', 'Game terms')}</Button><View style={{ height: 12 }} />
    <Button secondary onPress={() => update({ consent: false })} icon="information-circle-outline">{t('Показать предупреждение', 'Show first-run notice')}</Button>
  </Screen>;
}