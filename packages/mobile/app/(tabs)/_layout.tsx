import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from '../../state/selector-context';

export default function TabLayout() {
  const { colors, t } = useSelector();
  const insets = useSafeAreaInsets();
  return <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.gold, tabBarInactiveTintColor: colors.muted, tabBarIconStyle: { height: 24, width: 24 }, tabBarItemStyle: { paddingBottom: 3 }, tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.gold, borderTopWidth: 1, paddingTop: 10, height: 78 + insets.bottom, paddingBottom: Math.max(insets.bottom, 12) }, tabBarLabelStyle: { fontFamily: 'Manrope_600SemiBold', fontSize: 10, lineHeight: 16, marginTop: 2 } }}>
    <Tabs.Screen name="index" options={{ title: t('Страны', 'Countries'), tabBarIcon: ({ color, size }) => <Ionicons name="globe-outline" color={color} size={size} /> }} />
    <Tabs.Screen name="my-server" options={{ title: t('Мой сервер', 'My server'), tabBarIcon: ({ color, size }) => <Ionicons name="server-outline" color={color} size={size} /> }} />
    <Tabs.Screen name="settings" options={{ title: t('Настройки', 'Settings'), tabBarIcon: ({ color, size }) => <Ionicons name="options-outline" color={color} size={size} /> }} />
  </Tabs>;
}