import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSelector } from '../state/selector-context';
import { officialUrl } from '../domain/catalog';
import { Screen, Copy, Icon, Row, Panel, Section, Note, Button, openExternal } from '../components/selector-ui';

export default function AdvancedScreen() {
  const { colors, t } = useSelector();
  const router = useRouter();
  return <Screen>
    <Pressable accessibilityRole="button" accessibilityLabel={t('Все страны', 'All countries')} onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)')} style={{ minHeight: 44, marginBottom: 20 }}><Row><Icon name="arrow-back" /><Copy color={colors.gold}>{t('Все страны', 'All countries')}</Copy></Row></Pressable>
    <Icon name="flask-outline" size={42} color={colors.blue} />
    <Copy size={36} weight="display" color={colors.gold} style={{ marginTop: 18 }}>ADVANCED SERVER</Copy>
    <Copy size={18} weight="bold">{t('Тестовый сервер', 'Test server')}</Copy>
    <Copy size={13} color={colors.muted} style={{ marginTop: 12 }}>{t('Среда для тестирования будущих изменений MLBB. Это не обычный регион для подбора матчей.', 'A testing environment for future MLBB changes. It is not an ordinary matchmaking region.')}</Copy>
    <Section>{t('Как проверить доступ', 'How to check access')}</Section>
    {[
      [t('Откройте настройки аккаунта', 'Open account settings'), t('Запустите официальную игру → Настройки → Аккаунт. Названия и доступность пунктов зависят от версии.', 'Launch the official game → Settings → Account. Menu labels and availability depend on the version.')],
      [t('Найдите пункт смены сервера', 'Look for the switch-server option'), t('Если Advanced Server предлагается внутри игры, прочитайте актуальные условия доступа и предупреждения.', 'If Advanced Server is offered inside the game, read its current eligibility conditions and warnings.')],
      [t('Используйте только официальный доступ', 'Use official access only'), t('Если пункта нет или мест не хватает, уточните условия у поддержки. Приложение и VPN не могут выдать право доступа.', 'If the option is absent or capacity is full, ask support about eligibility. This app and a VPN cannot grant access.')],
    ].map(([title, body], i) => <Panel key={i}><Row style={{ alignItems: 'flex-start' }}><Copy weight="display" size={25} color={colors.gold}>0{i + 1}</Copy><PanelText title={title} body={body} /></Row></Panel>)}
    <Note title={t('Отдельный прогресс и нестабильность', 'Separate progress & instability')} text={t('Тестовая среда может содержать ошибки и иметь отдельный прогресс. Не рассчитывайте на перенос покупок или достижений. Точные условия определяет Moonton; приложение не проверяет вашу доступность.', 'The test environment may contain bugs and have separate progress. Do not assume purchases or achievements transfer. Moonton sets the exact conditions; this app does not check your eligibility.')} />
    <Button secondary icon="open-outline" onPress={() => openExternal(officialUrl)}>{t('Официальный сайт MLBB', 'Official MLBB website')}</Button>
  </Screen>;
}

function PanelText({ title, body }: { title: string; body: string }) {
  const { colors } = useSelector();
  return <View style={{ flex: 1 }}><Copy size={13} weight="bold">{title}</Copy><Copy size={12} color={colors.muted} style={{ marginTop: 8 }}>{body}</Copy></View>;
}