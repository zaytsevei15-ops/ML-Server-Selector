import { useEffect, useRef, useState } from 'react';
import { NativeModules, Platform, View } from 'react-native';
import { useSelector } from '../state/selector-context';
import { useVpn } from '../state/vpn-context';
import { summarizePing, type PingResult } from '../domain/ping';
import { Panel, Copy, Row, Icon, Button } from './selector-ui';

export function NodePing({ ip }: { ip?: string }) {
  const { colors, t } = useSelector();
  const vpn = useVpn();
  const module = Platform.OS === 'android' ? NativeModules.NodePing : null;
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<(PingResult & { route: string })>();
  const [error, setError] = useState('');
  const generation = useRef(0);
  const statusRef = useRef(vpn.status); statusRef.current = vpn.status;
  useEffect(() => {
    const requestGeneration = generation;
    requestGeneration.current++; setResult(undefined); setError('');
    return () => { requestGeneration.current++; };
  }, [ip, vpn.status]);
  async function measure() {
    if (!module || !ip || busy) return;
    const token = ++generation.current; const route = statusRef.current;
    setBusy(true); setError(''); setResult(undefined);
    try {
      const value = await module.measure(ip) as PingResult;
      if (token !== generation.current) return;
      if (value.ip !== ip) throw new Error('INVALID_PING_RESULT');
      summarizePing(value);
      setResult({ ...value, route });
    } catch (e) {
      if (token === generation.current) setError((e as { code?: string }).code === 'PING_TIMEOUT' ? 'timeout' : 'unavailable');
    } finally { setBusy(false); }
  }
  const summary = result ? summarizePing(result) : undefined;
  const unstable = ['permission', 'loading', 'connecting', 'disconnecting'].includes(vpn.status);
  return <Panel style={{ borderColor: colors.blue }}>
    <Row><Icon name="pulse-outline" color={colors.blue} /><View style={{ flex: 1 }}><Copy weight="bold" size={14}>{t('Пинг с телефона', 'Ping from your phone')}</Copy><Copy size={11} color={colors.muted}>{ip ?? t('Сначала выберите узел', 'Select a node first')} · ICMP</Copy></View><Copy size={25} weight="display" color={colors.blue}>{summary?.medianMs != null ? `${summary.medianMs.toFixed(1)} ms` : '—'}</Copy></Row>
    <Copy accessibilityLiveRegion="polite" size={11} color={colors.muted} style={{ marginTop: 12, marginBottom: 14 }}>{busy ? t('Измеряем: 3 запроса, до 10 секунд…', 'Measuring: 3 probes, up to 10 seconds…') : !module ? t('Замер доступен только в новой Android-сборке, не в браузере или Expo Go.', 'Measurement requires a new Android build, not browser or Expo Go.') : error ? t('ICMP недоступен или превышен тайм-аут. Значение не получено.', 'ICMP unavailable or timed out. No value obtained.') : summary ? summary.received === 0 ? t('Нет ответа ICMP. Узел может блокировать ping; это не доказывает недоступность VPN.', 'No ICMP reply. The node may block ping; this does not prove the VPN is offline.') : t(`Ответов ${summary.received}/3 · потери ${summary.lossPercent.toFixed(0)}% · медиана RTT`, `${summary.received}/3 replies · ${summary.lossPercent.toFixed(0)}% loss · median RTT`) : t('Ручной замер до IP VPN-узла, не до сервера Mobile Legends.', 'Manual measurement to the VPN node IP, not to a Mobile Legends server.')}</Copy>
    {result && <Copy size={10} color={colors.muted} style={{ marginBottom: 12 }}>{new Date(result.measuredAt).toLocaleTimeString()} · {result.route === 'connected' ? t('VPN включён: текущий системный маршрут', 'VPN on: current system route') : t('VPN не подтверждён: текущий системный маршрут', 'VPN unconfirmed: current system route')}</Copy>}
    <Button secondary icon="pulse-outline" disabled={!module || !ip || busy || unstable} onPress={() => { void measure(); }}>{busy ? t('Замер пинга…', 'Measuring ping…') : t('Измерить пинг', 'Measure ping')}</Button>
  </Panel>;
}