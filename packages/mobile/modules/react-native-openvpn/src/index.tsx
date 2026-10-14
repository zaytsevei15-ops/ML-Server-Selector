import { NativeModules, NativeEventEmitter } from 'react-native';
import Openvpn, {
  ConnectionState,
  type ConnectionStateListenerCallback,
  TLSSecurityProfile,
  AndroidCompatibilityMode,
} from './NativeOpenvpn';

export const {
  connect,
  prepare,
  disconnect,
  getCurrentState,
  isPrepared,
  requestCurrentState,
} = Openvpn;

export { ConnectionState, TLSSecurityProfile, AndroidCompatibilityMode };

const OpenVPNStateEventKey = 'VPNStateOV';
const eventEmitter = new NativeEventEmitter(NativeModules.Openvpn);
export const addOpenVPNStateChangeListener = (
  callback: (state: ConnectionStateListenerCallback) => void
) => {
  return eventEmitter.addListener(OpenVPNStateEventKey, callback);
};
