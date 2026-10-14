import { useEffect, useState } from 'react';
import { Modal, View, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from '../state/selector-context';
import { Copy, Icon, Row, Button, Pill } from './selector-ui';

export function FirstRunNotice() {
  const { colors, prefs, update, t } = useSelector();
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (!prefs.consent) setChecked(false); }, [prefs.consent]);
  return <Modal visible={!prefs.consent} transparent animationType="fade" onRequestClose={() => {}}>
    <SafeAreaView style={{ flex: 1, backgroundColor: '#050A14EB', justifyContent: 'center', padding: 20 }}>
      <View style={{ maxWidth: 500, width: '100%', maxHeight: '95%', alignSelf: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: 22, overflow: 'hidden' }}>
        <ScrollView contentContainerStyle={{ padding: 26 }}>
          <Row style={{ justifyContent: 'space-between', marginBottom: 22 }}><Icon name="shield-checkmark-outline" size={36} /><Row><Pill label="RU" selected={prefs.language === 'ru'} onPress={() => update({ language: 'ru' })} /><Pill label="EN" selected={prefs.language === 'en'} onPress={() => update({ language: 'en' })} /></Row></Row>
          <Copy size={10} color={colors.gold} weight="bold" style={{ letterSpacing: 2 }}>ML SERVER SELECTOR</Copy>
          <Copy size={26} weight="bold" style={{ marginTop: 8, marginBottom: 14 }}>{t('Прежде чем начать', 'Before you begin')}</Copy>
          <Copy size={13} color={colors.muted}>{t('Выбор направления: страна → город, независимо от игры. Приложение не связано с Moonton и не является официальным продуктом Mobile Legends: Bang Bang.', 'Choose a destination: country → city, independently of the game. This app is not affiliated with Moonton and is not an official Mobile Legends: Bang Bang product.')}</Copy>
          {[
            t('Приложение загружает список OpenVPN-профилей с VPN Gate. Источник сообщает только страны, а не города. Выбор города — пожелание, не подтверждённая VPN-локация.', 'The app loads OpenVPN profiles from VPN Gate. The source reports countries, not cities. A city selection is a preference, not a confirmed VPN location.'),
            t('VPN не гарантирует смену сервера или снижение пинга. Соблюдайте правила Moonton и местные законы.', 'A VPN does not guarantee a server change or lower ping. Follow Moonton’s rules and local laws.'),
            t('VPN Gate — добровольческие серверы с журналированием соединений; это не гарантия анонимности. Android VPN требует системного согласия и направляет трафик через выбранный узел. Автоподключение включается отдельно. Туннель работает только в нативной сборке; испытание на устройстве ещё требуется.', 'VPN Gate uses volunteer servers that log connections; it does not guarantee anonymity. Android VPN requires system consent and routes traffic through the chosen node. Auto-connect is opt-in. The tunnel requires a native build; on-device testing is still required.'),
            t('ID используется только для проверки формата в памяти, не сохраняется и не отправляется. В шаблоне есть аналитика Runable: внешняя передача событий и сетевых метаданных возможна.', 'Your ID is checked in memory only, never saved or sent. The template includes Runable analytics: events and network metadata may be transmitted externally.'),
          ].map((text, i) => <Row key={i} style={{ alignItems: 'flex-start', marginTop: 16 }}><Copy color={colors.gold} weight="display" size={20}>0{i + 1}</Copy><Copy style={{ flex: 1 }} size={12} color={colors.muted}>{text}</Copy></Row>)}
          <Pressable accessibilityRole="checkbox" accessibilityState={{ checked }} onPress={() => setChecked(!checked)} style={{ paddingVertical: 22 }}><Row><Icon name={checked ? 'checkbox' : 'square-outline'} /><Copy size={12} style={{ flex: 1 }}>{t('Я прочитал(а) предупреждение и понимаю ограничения', 'I have read the notice and understand the limitations')}</Copy></Row></Pressable>
          <Button disabled={!checked} onPress={() => update({ consent: true })} icon="arrow-forward">{t('Понятно, продолжить', 'Understood, continue')}</Button>
        </ScrollView>
      </View>
    </SafeAreaView>
  </Modal>;
}