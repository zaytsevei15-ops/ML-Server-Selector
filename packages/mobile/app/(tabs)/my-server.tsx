import { useState } from 'react';
import { View, TextInput, Pressable } from 'react-native';
import { parsePlayerId, officialUrl } from '../../domain/catalog';
import { useSelector } from '../../state/selector-context';
import { Screen, Copy, Icon, Row, Panel, Section, Note, Button, ui, openExternal } from '../../components/selector-ui';

export default function MyServerScreen() {
  const { colors, t } = useSelector();
  // Intentionally ephemeral: never saved, logged, used in analytics or sent to any API.
  const [input, setInput] = useState('');
  const [result, setResult] = useState<ReturnType<typeof parsePlayerId> | undefined>(undefined);
  return <Screen>
    <Row style={{ marginBottom: 24 }}><Icon name="server-outline" /><Copy size={10} weight="bold" color={colors.gold} style={{ letterSpacing: 2 }}>{t('ВАШ АККАУНТ', 'YOUR ACCOUNT')}</Copy></Row>
    <Copy size={30} weight="bold">{t('Мой сервер', 'My server')}</Copy>
    <Copy size={13} color={colors.muted} style={{ marginTop: 10 }}>{t('Разберите ID игрока и номер сервера. Проверка выполняется на устройстве.', 'Read the player ID and server number. Validation runs on your device.')}</Copy>
    <Section>{t('Где найти ID', 'Where to find your ID')}</Section>
    <Panel><Row style={{ alignItems: 'flex-start' }}><Icon name="person-circle-outline" color={colors.blue} size={30} /><View style={{ flex: 1 }}><Copy weight="bold" size={13}>{t('MLBB → профиль → ID', 'MLBB → Profile → ID')}</Copy><Copy size={12} color={colors.muted} style={{ marginTop: 7 }}>{t('Номер перед скобками — ID игрока. Число в скобках — ID сервера/зоны, а не надёжный код страны.', 'The number before parentheses is your player ID. The number inside is a server/zone ID, not a reliable country code.')}</Copy></View></Row></Panel>
    <Section>{t('Проверить формат', 'Check the format')}</Section>
    <Copy size={11} color={colors.muted} style={{ marginBottom: 9 }}>{t('ID игрока (ID сервера)', 'Player ID (Server ID)')}</Copy>
    <TextInput accessibilityLabel={t('ID игрока и сервера', 'Player and server ID')} autoCorrect={false} autoCapitalize="none" maxLength={40} value={input} onChangeText={value => { setInput(value); setResult(undefined); }} placeholder="123456789 (1234)" placeholderTextColor={colors.muted} style={[ui.input, { color: colors.text, backgroundColor: colors.surface, borderColor: result === null ? colors.danger : colors.line }]} />
    <View style={ui.gap} />
    <Button onPress={() => setResult(parsePlayerId(input))} icon="search-outline">{t('Проверить ID', 'Check ID')}</Button>
    <Copy size={10} color={colors.muted} style={{ marginTop: 12 }}>{t('ID не сохраняется и не отправляется. Проверяется только формат, не существование аккаунта.', 'The ID is neither stored nor sent. Only format is checked, not account existence.')}</Copy>
    {result === null && <View accessibilityLiveRegion="polite" style={{ marginTop: 20 }}><Note title={t('Проверьте формат ID', 'Check your ID format')} text={t('Введите цифры ID игрока и цифры сервера в скобках: 123456789 (1234). Буквы и другие символы не допускаются.', 'Enter player digits and server digits in parentheses: 123456789 (1234). Letters and other characters are not accepted.')} /></View>}
    {!!result && <View accessibilityLiveRegion="polite" style={{ marginTop: 22 }}><Panel style={{ borderColor: colors.gold }}>
      <Row><Icon name="checkmark-circle-outline" color={colors.green} /><Copy weight="bold">{t('Формат распознан', 'Format recognized')}</Copy></Row>
      <Row style={{ justifyContent: 'space-between', marginTop: 18 }}><Copy size={12} color={colors.muted}>{t('ID игрока', 'Player ID')}</Copy><Copy weight="display" size={20}>{result.player}</Copy></Row>
      <Row style={{ justifyContent: 'space-between', marginTop: 8 }}><Copy size={12} color={colors.muted}>{t('Сервер / зона', 'Server / zone')}</Copy><Copy weight="display" size={20} color={colors.gold}>{result.server}</Copy></Row>
      <View style={{ height: 1, backgroundColor: colors.line, marginVertical: 18 }} />
      <Copy size={13} weight="bold">{t('Регион: достоверно не определён', 'Region: cannot be reliably determined')}</Copy>
      <Copy size={12} color={colors.muted} style={{ marginTop: 8 }}>{t('Подтверждённой официальной таблицы «первые цифры → страна» нет в приложении. Оно не выдаёт догадки за результат. Уточните регион в поддержке игры.', 'The app has no verified official “leading digits → country” table. It will not present guesses as a result. Ask in-game support about your region.')}</Copy>
    </Panel><Pressable accessibilityRole="button" onPress={() => { setInput(''); setResult(undefined); }} style={{ padding: 12, alignSelf: 'center' }}><Copy color={colors.gold} size={12}>{t('Очистить введённый ID', 'Clear entered ID')}</Copy></Pressable></View>}
    <Section>{t('Официальная поддержка', 'Official support')}</Section>
    <Note title={t('Связаться из игры', 'Contact support in-game')} text={t('Откройте MLBB → значок поддержки / Customer Service в главном меню. Это основной канал помощи по аккаунту. Кнопка ниже открывает официальный сайт, не форму обращения.', 'Open MLBB → support icon / Customer Service in the main menu. This is the primary account-help channel. The button below opens the official site, not a support ticket form.')} />
    <Button secondary icon="open-outline" onPress={() => openExternal(officialUrl)}>{t('Официальный сайт MLBB', 'Official MLBB website')}</Button>
  </Screen>;
}