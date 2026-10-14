import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { client } from '../lib/api';
import { vpnEngine, startVpn, subscribeVpn } from '../lib/vpn-engine';
import { useSelector } from './selector-context';
import { nativeSignal } from '../domain/vpn-state';
import { useEditor } from './editor-context';
import { visibleNodes } from '../domain/local-edits';

type Status = 'unavailable' | 'disconnected' | 'permission' | 'loading' | 'connecting' | 'connected' | 'disconnecting' | 'error';
type Value = { status: Status; error: string; serverIp?: string; available: boolean;
  connect: (id?: string, country?: string) => Promise<void>; disconnect: () => Promise<void> };
const Context = createContext<Value | null>(null);
export function VpnProvider({ children }: { children: React.ReactNode }) {
  const { prefs } = useSelector();
  const { edits, ready: editorReady } = useEditor();
  const available = !!vpnEngine();
  const [status, setStatus] = useState<Status>(available ? 'disconnected' : 'unavailable');
  const [error, setError] = useState('');
  const [serverIp, setServerIp] = useState<string>();
  const operation = useRef(0); const active = useRef(false); const busy = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const autoTried = useRef(false);
  const stopping = useRef(false);
  const clearTimer = () => { if (timer.current) clearTimeout(timer.current); timer.current = undefined; };
  useEffect(() => {
    const engine = vpnEngine(); if (!engine) return;
    const receive = (state: string) => {
      const signal = nativeSignal(state, { busy: busy.current, active: active.current, stopping: stopping.current });
      if (signal === 'stop') { engine.disconnect().catch(() => setError('DISCONNECT_FAILED')); return; }
      if (signal === 'connected') {
        clearTimer(); busy.current = false; active.current = true; setError(''); setStatus('connected');
      }
      else if (signal === 'connecting') { setStatus('connecting'); }
      else if (signal === 'disconnecting') { setStatus('disconnecting'); }
      else if (signal === 'disconnected') {
        clearTimer(); busy.current = false; active.current = false; setStatus(s => s === 'error' ? s : 'disconnected');
      }
      else if (signal === 'error') {
        clearTimer(); operation.current++; stopping.current = true; busy.current = false; active.current = false;
        setStatus('error'); setError('VPN_FAILED'); engine.disconnect().catch(() => setError('DISCONNECT_FAILED'));
      }
    };
    const unsubscribe = subscribeVpn(receive);
    engine.getCurrentState().then(state => { if (!busy.current) receive(state); }).catch(() => { setStatus('error'); setError('STATE_UNAVAILABLE'); });
    const appSubscription = AppState.addEventListener('change', state => {
      if (state === 'active' && !busy.current) engine.getCurrentState().then(receive).catch(() => {});
    });
    return () => { unsubscribe(); appSubscription.remove(); clearTimer(); };
  }, []);

  async function disconnect() {
    autoTried.current = true; stopping.current = true; operation.current++; active.current = false; busy.current = false; clearTimer();
    const engine = vpnEngine(); if (!engine) return;
    setStatus('disconnecting'); setError('');
    timer.current = setTimeout(() => { setStatus('error'); setError('DISCONNECT_FAILED'); }, 15_000);
    try {
      await engine.disconnect();
      const state = await engine.getCurrentState();
      if (state === '0') { clearTimer(); setStatus('disconnected'); }
      // A stop request is not a confirmed disconnected event.
    } catch { clearTimer(); setStatus('error'); setError('DISCONNECT_FAILED'); }
  }

  async function connect(id?: string, country?: string) {
    const engine = vpnEngine();
    if (!engine || !prefs.consent || !editorReady || busy.current || active.current) return;
    const token = ++operation.current; stopping.current = false; busy.current = true; setError('');
    try {
      setStatus('permission');
      if (!(await engine.isPrepared()) && !(await engine.prepare())) throw new Error('PERMISSION_DENIED');
      if (token !== operation.current) return;
      setStatus('loading');
      const feed = await client.vpnGate.list();
      if (edits.countries.some(c => c.code === country && c.hidden)) throw new Error('NO_SERVERS');
      const candidates = visibleNodes(feed.servers, edits).filter(s => !country || s.countryCode === country);
      const chosen = candidates.find(s => s.id === id) ?? candidates[0];
      if (!chosen) throw new Error('NO_SERVERS');
      const config = await client.vpnGate.profile({ id: chosen.id });
      if (token !== operation.current) return;
      active.current = true; setServerIp(chosen.ip); setStatus('connecting');
      timer.current = setTimeout(() => {
        if (token !== operation.current) return;
        operation.current++; stopping.current = true; busy.current = false; active.current = false;
        setStatus('error'); setError('TIMEOUT');
        engine.disconnect().catch(() => setError('DISCONNECT_FAILED'));
      }, 60_000);
      await startVpn(config.profile, chosen.ip);
      // Never mark connected from connect() resolution: only native state 3 does that.
    } catch (e) {
      if (token !== operation.current) return;
      clearTimer(); stopping.current = true; busy.current = false; active.current = false; setStatus('error');
      const code = e instanceof Error ? e.message : '';
      setError(['PERMISSION_DENIED', 'NO_SERVERS'].includes(code) ? code : 'VPN_FAILED');
      engine.disconnect().catch(() => {});
    } finally { if (token === operation.current && !active.current) busy.current = false; }
  }
  useEffect(() => {
    if (!prefs.consent) { if (active.current || busy.current) void disconnect(); return; }
    if (editorReady && available && prefs.autoConnect && prefs.vpnCountry && !autoTried.current) {
      autoTried.current = true;
      void connect(undefined, prefs.vpnCountry);
    }
    // One opt-in auto attempt per app launch. No boot receiver or hidden retry loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorReady, available, prefs.consent, prefs.autoConnect, prefs.vpnCountry]);
  return <Context.Provider value={{ available, status, error, serverIp, connect, disconnect }}>{children}</Context.Provider>;
}
export function useVpn() {
  const value = useContext(Context); if (!value) throw new Error('VpnProvider required'); return value;
}