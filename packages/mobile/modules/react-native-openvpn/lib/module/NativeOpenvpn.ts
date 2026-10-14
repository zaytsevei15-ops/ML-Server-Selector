import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  /**
   * @AndroidOnly
   * Request VPN Connection Allowance for Android.
   * @returns void;
   */
  prepare: () => Promise<boolean>; // @AndroidOnly
  isPrepared: () => Promise<boolean>; // @AndroidOnly
  connect: (params: ConnectionParams) => Promise<string>;
  getCurrentState: () => Promise<ConnectionState>;
  requestCurrentState: () => Promise<void>;
  disconnect: () => Promise<string>;

  addListener: (eventType: string) => void;
  removeListeners: (count: number) => void;
}

export interface ConnectionParams {
  address: string;
  username: string;
  password: string;
  openVPNConfig?: string;
  openVPNConfigLocalFile?: string;
  /**
   * @iOS Only Params
   */
  iOSOptions: IOSConnectionOptions;
  /**
   * @Android Only
   */
  androidOptions: AndroidConnectionOptions;
}
// Starting with Capital Letter as Codegen behaviour.
export interface IOSConnectionOptions {
  localizedDescription: string;
  networkExtensionBundleIdentifier: string;
  disconnectOnSleep: boolean;
  onDemandEnabled: boolean;
  includeAllNetworks?: boolean;
  excludeLocalNetworks?: boolean;
  excludeCellularServices?: boolean;
  excludeDeviceCommunication?: boolean;

  /**
   * Client Behaviour
   */
  /**
   * Do not fallback to no vpn, when reconnecting.
   * @default false
   */
  persistTun?: boolean;

  /**
   * Connection Timeout.
   */
  connectionTimeout?: number;

  /**
   * Directly use googleDNS.
   */
  googleDNSFallback?: boolean;

  /**
   * Allow autologin sessions.
   */
  autologinSessions?: boolean;

  /**
   * Retry if login failed.
   */
  retryOnAuthFailed?: boolean;

  /**
   * Do not send client cert.
   */
  disableClientCert?: boolean;

  /**
   * Force AESCBC cipher suites.
   */
  forceCiphersuitesAESCBC?: boolean;
}

export interface AndroidConnectionOptions {
  Notification: AndroidNotificationOptions;
  /**
   * Internal Settings
   */

  /**
   * @EXPIREMENTAL
   * Expirmental Option, use OpenVPN3 for connections
   * @default false
   */
  useOpenVPN3?: boolean;

  /**
   * Use Sytem-wide for HTTP/HTTPS proxies to connect
   * Dependent on @useOpenVPN3 , if enabled, useSystemProxy is disabled.
   * @default true
   */
  useSystemProxy?: boolean;

  /**
   * Reconnect Connection on Network Change.
   * @default true
   */
  useReconnectOnNetworkChange?: boolean;

  /**
   * Puase VPN on Screen OFF
   * @default false
   */
  usePauseOnScreenOff?: boolean;

  /**
   * Disable Disconnect Confirm Dialogs.
   * @default false
   *
   * Note: This feature might be redundant as we directly connect/disconnect
   * VPN in this library.
   */
  useDisableConfirmDialog?: boolean;

  /**
   * Encrypt profiles for more security.
   * @default true
   */
  useProfileEncryption?: boolean;

  /**
   * OpenVPN will connect to specific VPN on boot try to keep connected.
   * @default false
   * Note: this feature might not work properly as we create profiles
   * as temporary profiles.
   */
  useKeepVPNConnected?: boolean;

  /**
   * Basic Settings.
   */

  /**
   * CompatibilityMode for OpenVPN connection
   * @default ModernDefaults
   */
  compatibilityMode?: AndroidCompatibilityMode;

  /**
   * Load OpenSSL legacy provider.
   * @default false
   */
  useLegacyProvider?: boolean;
  /**
   * Use LZO Compression.
   * @default false
   */
  useLZOCompression?: boolean;

  /**
   * Check Peer cerificate fingerprint
   * @default false
   */
  checkPeerFingerprint?: boolean;
  peerFingerPrints?: string;

  /**
   * Pull IPV4 and IPV6 from server.
   * @Default: true
   */
  pullSettings?: boolean;
  /**
   * Set IPV4 & IPV6 if pullSettings is false;
   */
  ipv4?: string;
  ipv6?: string;
  /**
   * Do Not Bind Local Address and Port.
   * @default true
   */
  noLocalBinding?: boolean;

  /**
   * Enable Override DNS
   * @default false
   */
  overrideDNS?: boolean;
  /**
   * Search Domain for Override DNS
   */
  searchDomain?: string;
  /**
   * DNS for Override DNS
   */
  DNS1?: string;
  DNS2?: string;

  /**
   * Routing:
   * Ignore routes pushed by the server
   * @default: false;
   */
  ignorePushedRoutes?: boolean;
  /**
   * Block unused IPV4 or IPV6 if not used.
   * @default true
   */
  blockUnusedAddressFamilies?: boolean;
  /**
   * Route All Local Traffic to vpn if FALSE.
   * @default true
   */
  allowLocalLAN?: boolean;

  /**
   * Redirect All traffic over VPN. IPV4
   * @default false
   * if true, customRoutes and excludeRoutes will be ignored.
   */
  useDefaultRoute?: boolean;
  /**
   * CIDR routes, these will be routed over VPN;
   * Divide each route by space
   * e.g. "10.0.0.0/8 2002::/16"
   */
  customRoutes?: string;
  /**
   * CIDR routes, these will NOT be routed over VPN;
   * Divide each route by space
   * e.g. "10.0.0.0/8 2002::/16"
   */
  excludedRoutes?: string;

  /**
   * Redirect All traffic over VPN. IPV6
   * @default false
   * if true, customRoutesV6 and excludeRoutesV6 will be ignored.
   */
  useDefaultRouteV6?: boolean;
  /**
   * CIDR routes, these will be routed over VPN;
   * Divide each route by space
   * e.g. "10.0.0.0/8 2002::/16"
   */
  customRoutesV6?: string;
  /**
   * CIDR routes, these will NOT be routed over VPN;
   * Divide each route by space
   * e.g. "10.0.0.0/8 2002::/16"
   */
  excludedRoutesV6?: string;

  /**
   * Routing Apps.
   */

  /**
   * List of Allowed Apps Package Name.
   */
  allowedVPNApps?: string[];
  /**
   * Allowed Apps Are marked as DisAllowed.
   * @default true
   */
  allowedVPNAppsAreDisallowed?: boolean;
  /**
   * Allow Apps to bypass VPN;
   * @default false
   */
  allowAppVpnBypass?: boolean;

  /**
   * TLS & AUTH & Encryption Settings
   */

  /**
   * @default: "LEGACY"
   */
  tlsProfileSecurity?: TLSSecurityProfile;

  /**
   * Check whether server uses a certificate with TLS server extension.
   * @default false
   */
  expectServerTLSCert?: boolean;

  /**
   * Check the remote server ceritficate subject DN
   * @default false
   */
  certificateHostnameCheck?: boolean;
  remoteCertificateSubject?: string;
  remoteX509UsernameField?: string;

  /**
   * Enabled additional auth/encryption layer for OPENVPN control channel.
   * @default true
   */
  useTLSAuth?: boolean;

  /**
   * Encryption Ciphers seprated by :
   * e.g. AES-12-GCM:AES-256-GCM
   * leave blank to use defaults
   */
  dataCiphers?: string;

  /**
   * Packet Authentication seprated by :
   * leave blank to use defaults
   */
  packetDigests?: string;

  /**
   * Client Behaviour
   */
  /**
   * Do not fallback to no vpn, when reconnecting.
   * @default false
   */
  persistTun?: boolean;
  /**
   * send Extra information to server.
   * @default false
   */
  pushPeerInfo?: boolean;
  /**
   * Add 6 random chars infront of host name.
   * @default false
   */
  useRandomHostname?: boolean;
  /**
   * Allow Authenticated packet from any IP.
   * @default false
   */
  useFloat?: boolean;

  /**
   * Custom Options
   * @default true
   */
  useCustomConfig?: boolean;
  customOptions?: string;

  /**
   * Reconnect Options
   */
  /**
   * Max attempts for retry.
   * "-1" for unlimited attemps.
   * @Default "-1"
   */
  connectRetryMax?: string;
  /**
   * Max time between connection attempts. in seconds
   * e.g. "300" or "10"
   * @Default "300"
   */
  connectRetryMaxTime?: string;
  /**
   * Seconds between connection.
   *  e.g. "300" or "10"
   * @Default "2"
   */
  connectRetry?: string;
}

export enum AndroidCompatibilityMode {
  ModernDefaults = 0,
  OpenVPN_2_5_x = 1,
  OpenVPN_2_4_x = 2,
  OpenVPN_2_3_x = 3,
}

export interface ConnectionStateListenerCallback {
  state: ConnectionState;
}

export enum ConnectionState {
  DISCONNECTED = '0',
  DISCONNECTING = '1',
  CONNECTING = '2',
  CONNECTED = '3',
  INVALID = '-1',
  ERROR = '-2',
}

export enum TLSSecurityProfile {
  INSECURE = 'insecure',
  LEGACY = 'legacy',
  PREFERED = 'preferred',
  SUITEB = 'suiteb',
}

export interface AndroidNotificationOptions {
  openActivityPackageName: string;
  /**
   * This Title is Shown as Notification Title.
   */
  titleNotification: string;

  showDisconnectAction?: boolean;
  titleDisconnectButton?: string;

  /**
   * Pause is NOT Supported, Ignore.
   */
  showPauseAction?: boolean;
  titlePauseButton?: string;
  titleResumeButton?: string;

  showTimer?: boolean;

  /**
   * These titles, are shown as Notification Message Text.
   */
  titleConnecting?: string;
  titleConnected?: string;
  titleDisconnecting?: string;
  titleDisconnected?: string;
  titlePaused?: string;
  titleError?: string;
}

export default TurboModuleRegistry.getEnforcing<Spec>('Openvpn');
