import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { editsSchema, emptyEdits, type LocalEdits } from '../domain/local-edits';
const KEY = 'ml-local-editor-v1';
const Context = createContext<{ edits: LocalEdits; ready: boolean; save: (value: LocalEdits) => Promise<boolean>; state: string } | null>(null);
export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [edits, setEdits] = useState(emptyEdits); const [ready, setReady] = useState(false); const [state, setState] = useState('');
  const writes = useRef(Promise.resolve());
  useEffect(() => {
    (async () => {
      try { const raw = Platform.OS === 'web' ? sessionStorage.getItem(KEY) : await AsyncStorage.getItem(KEY); if (raw) setEdits(editsSchema.parse(JSON.parse(raw))); }
      catch { setState('load-error'); }
      finally { setReady(true); }
    })();
  }, []);
  async function save(value: LocalEdits) {
    const parsed = editsSchema.safeParse(value);
    if (!parsed.success) { setState('invalid'); return false; }
    setState('saving');
    let success = false;
    writes.current = writes.current.then(async () => {
      try { const raw = JSON.stringify(parsed.data); if (Platform.OS === 'web') sessionStorage.setItem(KEY, raw); else await AsyncStorage.setItem(KEY, raw); setEdits(parsed.data); setState('saved'); success = true; }
      catch { setState('save-error'); }
    });
    await writes.current; return success;
  }
  return <Context.Provider value={{ edits, ready, save, state }}>{children}</Context.Provider>;
}
export function useEditor() { const value = useContext(Context); if (!value) throw new Error('EditorProvider required'); return value; }