import { ConnectionState, type ConnectionStateListenerCallback, TLSSecurityProfile, AndroidCompatibilityMode } from './NativeOpenvpn';
export declare const connect: (params: import("./NativeOpenvpn").ConnectionParams) => Promise<string>, prepare: () => Promise<boolean>, disconnect: () => Promise<string>, getCurrentState: () => Promise<ConnectionState>, isPrepared: () => Promise<boolean>, requestCurrentState: () => Promise<void>;
export { ConnectionState, TLSSecurityProfile, AndroidCompatibilityMode };
export declare const addOpenVPNStateChangeListener: (callback: (state: ConnectionStateListenerCallback) => void) => import("react-native").EmitterSubscription;
//# sourceMappingURL=index.d.ts.map