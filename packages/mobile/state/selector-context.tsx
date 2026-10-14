import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { CONSENT_VERSION, defaults, loadPreferences, savePreferences, type Preferences } from '../data/preferences';
import { ActivityIndicator, View } from 'react-native';

export const palettes = {
  dark: { bg: '#071528', surface: '#102A47', raised: '#193C5E', text: '#EDF5FF', muted: '#A3BCD5', line: '#315476', gold: '#F1D18B', blue: '#7DD9FF', green: '#79D8B0', danger: '#FFB09B', buttonText: '#19263A' },
  light: { bg: '#EAF1F8', surface: '#F7FAFF', raised: '#DCE8F5', text: '#142F4D', muted: '#4C6881', line: '#AABFD4', gold: '#80600F', blue: '#17658C', green: '#236E52', danger: '#A03F2C', buttonText: '#FFFFFF' },
};
type ContextValue = {
  prefs: Preferences; colors: typeof palettes.dark; update: (patch: Partial<Preferences>) => void;
  t: (ru: string, en: string) => string; storageError: boolean;
};
const Context = createContext<ContextValue | null>(null);
// Presentation view-model; serializes repository writes to avoid stale language/theme saves.
export function SelectorProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefs] = useState(defaults);
  const current = useRef(defaults);
  const writes = useRef(Promise.resolve());
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    loadPreferences().then(value => { current.current = value; setPrefs(value); }).catch(() => setStorageError(true)).finally(() => setReady(true));
  }, []);
  const update = (patch: Partial<Preferences>) => {
    const next = { ...current.current, ...patch, ...(patch.consent !== undefined ? { consentVersion: patch.consent ? CONSENT_VERSION : 0 } : {}) };
    current.current = next;
    setPrefs(next);
    writes.current = writes.current.then(() => savePreferences(next)).then(() => setStorageError(false)).catch(() => setStorageError(true));
  };
  if (!ready) return <View style={{ flex: 1, backgroundColor: palettes.dark.bg, justifyContent: 'center' }}><ActivityIndicator color={palettes.dark.gold} /></View>;
  return <Context.Provider value={{ prefs, colors: palettes[prefs.theme], update, storageError, t: (ru, en) => prefs.language === 'ru' ? ru : en }}>{children}</Context.Provider>;
}
export function useSelector() {
  const value = useContext(Context);
  if (!value) throw new Error('SelectorProvider is required');
  return value;
}