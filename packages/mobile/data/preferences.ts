import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { findDestination, type Language } from '../domain/catalog';

export type Preferences = { language: Language; theme: 'dark' | 'light'; consent: boolean; consentVersion: number; destinationId?: string; autoConnect: boolean; vpnCountry?: string };
export const defaults: Preferences = { language: 'ru', theme: 'dark', consent: false, consentVersion: 0, autoConnect: false };
export const CONSENT_VERSION = 4;
const KEY = 'ml-selector-preferences-v1';
// Never persist player IDs. Native preferences use encrypted OS-backed storage.
// Browser preview stores ONLY non-sensitive preferences in sessionStorage, not encrypted.
export async function loadPreferences(): Promise<Preferences> {
  const raw = Platform.OS === 'web' ? sessionStorage.getItem(KEY) : await SecureStore.getItemAsync(KEY);
  if (!raw) return defaults;
  const value = JSON.parse(raw);
  return {
    language: value.language === 'en' ? 'en' : 'ru',
    theme: value.theme === 'light' ? 'light' : 'dark',
    consent: value.consent === true && value.consentVersion === CONSENT_VERSION,
    consentVersion: value.consentVersion === CONSENT_VERSION ? CONSENT_VERSION : 0,
    destinationId: findDestination(value.destinationId)?.id ?? (typeof value.destinationId === 'string' && /^local-[a-z0-9-]{1,74}$/.test(value.destinationId) ? value.destinationId : undefined),
    autoConnect: value.autoConnect === true,
    vpnCountry: typeof value.vpnCountry === 'string' && /^[A-Z]{2}$/.test(value.vpnCountry) ? value.vpnCountry : undefined,
  };
}
export async function savePreferences(value: Preferences): Promise<void> {
  const raw = JSON.stringify(value);
  if (Platform.OS === 'web') sessionStorage.setItem(KEY, raw);
  else await SecureStore.setItemAsync(KEY, raw, { keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY });
}