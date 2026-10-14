import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from '../state/selector-context';
import { useVpn } from '../state/vpn-context';
import { useEditor } from '../state/editor-context';
import { Copy, Row, Icon } from './selector-ui';

export function LobbyBanner({ destination, countryCount }: { destination?: string; countryCount: number }) {
  const { colors, prefs, t } = useSelector();
  const vpn = useVpn();
  const { edits } = useEditor();
  return <LinearGradient colors={prefs.theme === 'dark' ? ['#1D4C76', '#123252', '#0C233E'] : ['#E1EFFD', '#CEDFF1', '#EDF5FF']} style={{ borderWidth: 1, borderColor: colors.line, borderRadius: 5, overflow: 'hidden', marginBottom: 16 }}>
    <View style={{ padding: 20 }}>
      <Row style={{ justifyContent: 'space-between' }}><Copy size={10} weight="bold" color={colors.gold} style={{ letterSpacing: 2 }}>SERVER LOBBY</Copy><Row style={{ gap: 5 }}><Icon name="globe-outline" size={13} color={colors.blue} /><Copy size={10} color={colors.blue}>{countryCount} {t('стран', 'countries')}</Copy></Row></Row>
      <View style={{ height: 156, alignItems: 'center', justifyContent: 'center' }} accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <View style={[styles.orbit, { width: 140, height: 140, borderColor: colors.line }]} />
        <View style={[styles.orbit, { width: 116, height: 116, borderColor: colors.blue, opacity: 0.35, transform: [{ rotate: '45deg' }] }]} />
        <View style={[styles.orbit, { width: 82, height: 82, borderColor: colors.gold, backgroundColor: colors.raised, transform: [{ rotate: '45deg' }] }]} />
        <Icon name="shield-half-outline" size={58} color={colors.gold} />
        <View style={{ position: 'absolute', bottom: 8 }}><Copy weight="display" size={11} color={colors.gold} style={{ letterSpacing: 5 }}>◆  ◆  ◆</Copy></View>
      </View>
      <Copy size={10} color={colors.blue} style={{ textAlign: 'center', letterSpacing: 1.5 }}>{t('ВАШЕ НАПРАВЛЕНИЕ', 'YOUR DESTINATION')}</Copy>
      <Copy size={24} weight="bold" style={{ textAlign: 'center', marginTop: 6, lineHeight: 34 }}>{destination ?? (edits.texts.lobbyTitle || t('Выберите свой маршрут', 'Choose your next route'))}</Copy>
      <Row style={{ justifyContent: 'center', marginTop: 12, gap: 6 }}><Icon name={vpn.status === 'connected' ? 'shield-checkmark-outline' : 'shield-outline'} size={14} color={vpn.status === 'connected' ? colors.green : colors.muted} /><Copy size={11} color={vpn.status === 'connected' ? colors.green : colors.muted}>{vpn.status === 'connected' ? t('VPN подключён', 'VPN connected') : vpn.available ? t('OpenVPN · статус ниже', 'OpenVPN · see status below') : t('OpenVPN · нужна Android-сборка', 'OpenVPN · Android build required')}</Copy></Row>
    </View>
    <Row style={{ justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: colors.line, backgroundColor: colors.surface }}><Copy size={10} color={colors.muted}>VPN GATE / OPENVPN</Copy><Copy size={10} color={colors.gold}>{t('СТРАНА → ГОРОД', 'COUNTRY → CITY')}</Copy></Row>
  </LinearGradient>;
}
const styles = StyleSheet.create({ orbit: { position: 'absolute', borderWidth: 1, borderRadius: 3, transform: [{ rotate: '45deg' }] } });