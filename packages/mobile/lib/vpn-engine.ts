import { NativeEventEmitter, Platform, TurboModuleRegistry } from 'react-native';
import appJson from '../app.json';

type Module = {
  prepare(): Promise<boolean>; isPrepared(): Promise<boolean>;
  connect(params: Record<string, unknown>): Promise<unknown>;
  disconnect(): Promise<unknown>; getCurrentState(): Promise<string>;
  addListener(name: string): void; removeListeners(count: number): void;
};
export function vpnEngine(): Module | null {
  return Platform.OS === 'android' ? TurboModuleRegistry.get<Module & import('react-native').TurboModule>('Openvpn') : null;
}
export function subscribeVpn(callback: (state: string) => void) {
  const engine = vpnEngine();
  if (!engine) return () => {};
  const subscription = new NativeEventEmitter(engine as never).addListener('VPNStateOV', event => callback(String(event.state)));
  return () => subscription.remove();
}
export async function startVpn(profile: string, ip: string) {
  const engine = vpnEngine(); if (!engine) throw new Error('NATIVE_UNAVAILABLE');
  await engine.connect({ address: ip, username: 'vpn', password: 'vpn', openVPNConfig: profile,
    openVPNConfigLocalFile: '', iOSOptions: {}, androidOptions: {
      Notification: { openActivityPackageName: `${appJson.expo.android.package}.MainActivity`,
        titleNotification: 'ML Server Selector VPN', titleConnecting: 'Connecting', titleConnected: 'Connected',
        titleDisconnected: 'Disconnected', titleError: 'Connection error',
        showDisconnectAction: false, showPauseAction: false, showTimer: false },
      useOpenVPN3: false, useSystemProxy: false, usePauseOnScreenOff: false,
      useReconnectOnNetworkChange: true, useKeepVPNConnected: false,
      useProfileEncryption: true, useDefaultRoute: true, useDefaultRouteV6: true,
      blockUnusedAddressFamilies: true, allowLocalLAN: false, allowAppVpnBypass: false,
      expectServerTLSCert: true, useCustomConfig: true, persistTun: true,
      connectRetryMax: '2', connectRetryMaxTime: '15', connectRetry: '3',
    } });
}