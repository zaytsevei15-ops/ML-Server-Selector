import React from 'react';
import { View, Text, Pressable, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from '../state/selector-context';

export function Copy({ children, size = 14, color, weight = 'regular', style, ...props }: { children: React.ReactNode; size?: number; color?: string; weight?: 'regular' | 'medium' | 'bold' | 'display'; style?: any; [key: string]: any }) {
  const { colors } = useSelector();
  const family = { regular: 'Manrope_400Regular', medium: 'Manrope_600SemiBold', bold: 'Manrope_700Bold', display: 'Rajdhani_700Bold' }[weight];
  return <Text {...props} style={[{ color: color ?? colors.text, fontSize: size, lineHeight: size * 1.5, fontFamily: family }, style]}>{children}</Text>;
}
export function Screen({ children }: { children: React.ReactNode }) {
  const { colors, prefs, storageError, t } = useSelector();
  return <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: colors.bg }}>
    <LinearGradient pointerEvents="none" colors={prefs.theme === 'dark' ? ['#183D63', '#071528', '#071528'] : ['#CCDDF0', '#EAF1F8', '#EAF1F8']} style={StyleSheet.absoluteFill} />
    <StatusBar style={prefs.theme === 'dark' ? 'light' : 'dark'} />
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 20, paddingBottom: 40, width: '100%', maxWidth: 720, alignSelf: 'center' }}>
        {storageError && <Note title={t('Настройки не сохранены', 'Preferences not saved')} text={t('Хранилище недоступно. Настройки действуют только в текущем запуске.', 'Storage is unavailable. Settings apply only during this session.')} />}
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>;
}
export function Icon({ name, size = 22, color }: { name: React.ComponentProps<typeof Ionicons>['name']; size?: number; color?: string }) {
  const { colors } = useSelector();
  return <Ionicons name={name} size={size} color={color ?? colors.gold} />;
}
export function Row({ children, style }: { children: React.ReactNode; style?: any }) { return <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 12 }, style]}>{children}</View>; }
export function Panel({ children, style }: { children: React.ReactNode; style?: any }) {
  const { colors } = useSelector();
  return <View style={[{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: 4, padding: 18, marginBottom: 14 }, style]}>{children}</View>;
}
export function Section({ children, right }: { children: React.ReactNode; right?: string }) {
  const { colors } = useSelector();
  return <Row style={{ justifyContent: 'space-between', marginTop: 26, marginBottom: 14 }}><Copy size={12} weight="bold" style={{ letterSpacing: 1.1, textTransform: 'uppercase', flex: 1 }}>{children}</Copy>{right && <Copy size={11} color={colors.muted}>{right}</Copy>}</Row>;
}
export function Button({ children, onPress, secondary = false, icon, disabled = false }: { children: React.ReactNode; onPress: () => void; secondary?: boolean; icon?: React.ComponentProps<typeof Ionicons>['name']; disabled?: boolean }) {
  const { colors, prefs } = useSelector();
  return <Pressable accessibilityRole="button" accessibilityLabel={typeof children === 'string' ? children : undefined} disabled={disabled} onPress={onPress} style={({ pressed }) => ({ minHeight: 54, borderRadius: 3, overflow: 'hidden', opacity: disabled ? 0.55 : pressed ? 0.75 : 1, borderWidth: 1, borderColor: secondary ? colors.line : colors.gold })}>
    <LinearGradient colors={secondary ? [colors.raised, colors.surface] : prefs.theme === 'dark' ? ['#FFF0BD', '#D5AA58', '#F1D18B'] : ['#977425', '#70520C']} style={{ minHeight: 54, padding: 14, alignItems: 'center', justifyContent: 'center' }}>
    <Row>{icon && <Icon name={icon} size={18} color={secondary ? colors.gold : colors.buttonText} />}<Copy weight="bold" size={14} color={secondary ? colors.text : colors.buttonText} style={{ letterSpacing: 0.5 }}>{children}</Copy></Row>
    </LinearGradient>
  </Pressable>;
}
export function Note({ title, text }: { title: string; text: string }) {
  const { colors } = useSelector();
  return <Panel style={{ borderLeftWidth: 3, borderLeftColor: colors.gold }}><Row style={{ alignItems: 'flex-start' }}><Icon name="information-circle-outline" size={20} /><View style={{ flex: 1 }}><Copy weight="bold" size={13}>{title}</Copy><Copy size={12} color={colors.muted} style={{ marginTop: 6 }}>{text}</Copy></View></Row></Panel>;
}
export function Pill({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  const { colors } = useSelector();
  return <Pressable accessibilityRole="button" accessibilityState={{ selected }} onPress={onPress} style={{ minHeight: 44, justifyContent: 'center', paddingHorizontal: 18, borderRadius: 3, backgroundColor: selected ? colors.raised : colors.surface, borderWidth: 1, borderBottomWidth: selected ? 3 : 1, borderColor: selected ? colors.gold : colors.line }}><Copy size={12} weight="bold" color={selected ? colors.gold : colors.muted}>{label}</Copy></Pressable>;
}
export async function openExternal(url: string) {
  // Never interpolate player IDs into links. These are fixed public information URLs.
  try { await Linking.openURL(url); } catch { Alert.alert('ML Server Selector', 'Не удалось открыть ссылку / Unable to open link.'); }
}
export const ui = StyleSheet.create({ input: { minHeight: 52, borderWidth: 1, borderRadius: 4, paddingHorizontal: 16, fontFamily: 'Manrope_400Regular', fontSize: 14 }, gap: { height: 16 } });