package com.openvpn

import android.app.Activity
import android.app.Activity.RESULT_OK
import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.ServiceConnection
import android.graphics.Color
import android.net.VpnService
import android.os.Build
import android.os.Bundle
import android.os.IBinder
import android.os.RemoteException
import android.os.StrictMode
import android.os.StrictMode.ThreadPolicy
import android.os.StrictMode.VmPolicy
import android.os.strictmode.Violation
import android.util.Log
import androidx.annotation.RequiresApi
import androidx.core.content.edit
import com.facebook.react.bridge.ActivityEventListener
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.ikev2.convertMixedMapToBundle
import de.blinkt.openvpn.VpnProfile
import de.blinkt.openvpn.core.ConfigParser
import de.blinkt.openvpn.core.ConnectionStatus
import de.blinkt.openvpn.core.IOpenVPNServiceInternal
import de.blinkt.openvpn.core.LogItem
import de.blinkt.openvpn.core.OpenVPNService
import de.blinkt.openvpn.core.Preferences
import de.blinkt.openvpn.core.ProfileManager
import de.blinkt.openvpn.core.StatusListener
import de.blinkt.openvpn.core.VPNLaunchHelper
import de.blinkt.openvpn.core.VpnStatus
import de.blinkt.openvpn.fragments.Utils
import java.io.BufferedReader
import java.io.File
import java.io.FileInputStream
import java.io.InputStream
import java.io.InputStreamReader
import java.io.StringReader
import java.util.concurrent.Executors

/**
 * Why this?
 * we are sending the whole readableMap as Bundle to the CharonVPNService.
 * so we want to persist androidOptions.Notification readableMap keys
 * to reference them from other places. this helps mismatch and time-cost.
 */
object NotificationBundle {
  const val BUNDLE_KEY:String = "Notification" // key of bundle sent to vpnService. Not key sent from JS side
  //Keys from JS-SIDE
  const val ACTIVITY_PACKAGE_NAME:String = "openActivityPackageName"
  const val TITLE_NOTIFICATION:String = "titleNotification"

  const val SHOW_DISCONNECT:String = "showDisconnectAction"
  const val TITLE_ACTION_DISCONNECT:String = "titleDisconnectButton"

  const val SHOW_PAUSE:String = "showPauseAction"
  const val TITLE_ACTION_PAUSE:String = "titlePauseButton"
  const val TITLE_ACTION_RESUME:String = "titleResumeButton"

  const val SHOW_TIMER:String = "showTimer"

  const val TITLE_CONNECTING:String = "titleConnecting"
  const val TITLE_CONNECTED:String = "titleConnected"
  const val TITLE_DISCONNECTING:String = "titleDisconnecting"
  const val TITLE_DISCONNECTED:String = "titleDisconnected"
  const val TITLE_ERROR:String = "titleError"
  const val TITLE_PAUSED:String = "titlePaused"
}


@RequiresApi(Build.VERSION_CODES.O)
@ReactModule(name = OpenvpnModule.NAME)
class OpenvpnModule(reactContext: ReactApplicationContext) :
  NativeOpenvpnSpec(reactContext), VpnStatus.StateListener,ActivityEventListener,VpnStatus.LogListener {

  companion object {
    const val NAME = "Openvpn"
    const val EVENT_NAME = "VPNStateOV"
    const val PREPARE_VPN_PROFILE = 100
  }
  override fun getName(): String {
    return NAME
  }




  /**
   * Class for interacting with the main interface of the service.
   */
  private var mService: IOpenVPNServiceInternal? = null
  private val mConnection: ServiceConnection = object : ServiceConnection {
    override fun onServiceConnected(className: ComponentName, service: IBinder) {
      mService = IOpenVPNServiceInternal.Stub.asInterface(service)

    }

    override fun onServiceDisconnected(arg0: ComponentName) {
      mService = null
    }
  }

  private fun bindService() {
    val intent = Intent(reactApplicationContext, OpenVPNService::class.java)
    intent.setAction(OpenVPNService.START_SERVICE)
    reactApplicationContext.bindService(intent, mConnection, Context.BIND_AUTO_CREATE)
  }

  private var mStatus: StatusListener? = null
  init {
    try{
      mStatus = StatusListener()
      mStatus?.init(reactApplicationContext)
    }catch (e:Exception){
     // Log.e("VXXT",e.localizedMessage)
    }


   if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) createNotificationChannels()
   // ML: StrictMode debug logging disabled.

    VpnStatus.addStateListener(this)
    VpnStatus.addLogListener(this)

    reactApplicationContext.addActivityEventListener(this)
    bindService();
  }


  /**
   * VPN CONTROL RELATED
   */

  var preparePromise: Promise? = null;
  override fun prepare(promise: Promise?) {
    val activity = reactApplicationContext.currentActivity
    if (activity == null) {
      promise?.reject("E_ACTIVITY_ERROR", "Activity doesn't exist")
      return
    }
    preparePromise = promise
    val intent = VpnService.prepare(activity)
    if (intent != null) {
      activity.startActivityForResult(intent, PREPARE_VPN_PROFILE)
    }else{
      preparePromise?.resolve(true)
      preparePromise = null
    }
  }

  override fun isPrepared(promise: Promise?) {
    val intent = VpnService.prepare(reactApplicationContext);
    if(intent!=null){
      promise?.resolve(false)
    }else{
      promise?.resolve(true)
    }
  }

  /**
   * --> Here we skip LanchVPN activity and directly use ProfileManager + VPNLaunchHelper
   *  and start the VPN.
   */
  private var profileToConnectAfterPrepare: VpnProfile? = null
  override fun connect(params: ReadableMap?, promise: Promise?) {
    try {

      val address: String = params?.getString("address").toString()
      val username: String = params?.getString("username").toString()
      val password: String = params?.getString("password").toString()
      if (address.isEmpty() || username.isEmpty() || password.isEmpty()) {
        promise?.reject("ERR_CREDENTIALS", "NO CREDENTIALS PROVIDED");
        return;
      }

      val openVPNConfigString: String = params?.getString("openVPNConfig").toString()
      val openVPNConfigLocalFile: String = params?.getString("openVPNConfigLocalFile").toString();

      //Pickup the config.
      val openVPNConfigData: String = openVPNConfigString.ifEmpty {
        readFile(openVPNConfigLocalFile);
      }
      if (openVPNConfigData.isEmpty()) {
        promise?.reject("ERR_CONFIG", "NO CONFIG PROVIDED");
        return
      }

      //Start Parsing Config
      val cParser = ConfigParser()
      cParser.parseConfig(StringReader(openVPNConfigData));
      var openProfile: VpnProfile = cParser.convertProfile();

      //Start Mapping Options.
      openProfile = populateVPNProfile(openProfile, params!!)

      //Add Credentials
      openProfile.mUsername = username
      openProfile.mPassword = password
     // openProfile.mAuthenticationType = VpnProfile.TYPE_USERPASS

      //check profile
      if (openProfile.checkProfile(reactApplicationContext) != R.string.no_error_found) {
        throw RemoteException(reactApplicationContext.getString(openProfile.checkProfile(reactApplicationContext)));
      }

      /**
       * Redundacny, [TODO]
       * get androidOptions, ship it with bundle, get it in OpenVPNService
       */
      val androidOptions = params.getMap("androidOptions")!!
      val notificationOptions = androidOptions.getMap("Notification")?.toHashMap()
      //set into launcher
      VPNLaunchHelper.extraBundle = convertMixedMapToBundle(notificationOptions)


      val intent = VpnService.prepare(reactApplicationContext)
      if (intent != null) {
        promise?.reject("VPN_PERMISSION_REQUIRED", "Prepare VPN permission before connecting")
        return
      }else{
        //Starting Connection, Directly
        ProfileManager.setTemporaryProfile(reactApplicationContext, openProfile);
        VPNLaunchHelper.startOpenVpn(openProfile, reactApplicationContext,"user requested",true);
      }

      promise?.resolve(null);
    }catch (e:Exception){
      promise?.reject("ERR_PARSE", "VPN profile rejected or service unavailable")
    }
  }

  private fun connectAfterPrepared(){
    ProfileManager.setTemporaryProfile(reactApplicationContext, profileToConnectAfterPrepare);
    VPNLaunchHelper.startOpenVpn(profileToConnectAfterPrepare, reactApplicationContext,"user requested",true);
    profileToConnectAfterPrepare = null
  }

  override fun getCurrentState(promise: Promise?) {
    promise?.resolve(translateVPNState(VpnStatus.getStatus()));
  }

  override fun requestCurrentState(promise: Promise?) {
    val params: WritableMap = Arguments.createMap()
    params.putString("state", translateVPNState(VpnStatus.getStatus()))
    sendEvent(EVENT_NAME, params)
  }

  override fun disconnect(promise: Promise?) {
    try {
      if (mService == null) {
        promise?.reject("SERVICE_NOT_READY", "VPN service not bound; retry disconnect")
        bindService()
        return
      }
      mService!!.stopVPN(false)
      promise?.resolve(null)
    } catch (e: java.lang.Exception) {
      promise?.reject("E_STOP_OVPN_ERROR", "Stop ovpn failed")
    }
  }

  /**
   * VPN STATE RELATED
   */
  override fun addListener(eventType: String?) {}

  override fun removeListeners(count: Double) {}

  private fun sendEvent(eventName: String = EVENT_NAME, params: WritableMap) {
    if (!reactApplicationContext.hasActiveReactInstance()) {
      return
    }
    reactApplicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit(eventName, params)
  }

  override fun updateState(
    state: String?,
    logmessage: String?,
    localizedResId: Int,
    level: ConnectionStatus?,
    Intent: Intent?
  ) {
    val params: WritableMap = Arguments.createMap()
    params.putString("state", translateVPNState(level ?: ConnectionStatus.UNKNOWN_LEVEL))
    sendEvent(EVENT_NAME, params)
  }

  override fun setConnectedVPN(uuid: String?) {
  }


  private enum class VpnState(val value: String) {
    VPN_STATE_DISCONNECTED("0"),
    VPN_STATE_DISCONNECTING("1"),
    VPN_STATE_CONNECTING("2"),
    VPN_STATE_CONNECTED("3"),
    VPN_STATE_INVALID("-1"),
    VPN_STATE_ERROR("-2");

    companion object {
      fun fromValue(value: String): VpnState? = entries.find { it.value == value }
    }
  }

  private fun translateVPNState(level: ConnectionStatus): String {
    val state: VpnState = when (level) {
      ConnectionStatus.LEVEL_NOTCONNECTED -> VpnState.VPN_STATE_DISCONNECTED
      ConnectionStatus.LEVEL_START, ConnectionStatus.LEVEL_WAITING_FOR_USER_INPUT, ConnectionStatus.LEVEL_CONNECTING_NO_SERVER_REPLY_YET, ConnectionStatus.LEVEL_CONNECTING_SERVER_REPLIED -> VpnState.VPN_STATE_CONNECTING
      ConnectionStatus.LEVEL_CONNECTED -> VpnState.VPN_STATE_CONNECTED
      else -> VpnState.VPN_STATE_INVALID
    }
    return state.value;
  }


  /**
   * VPN CONFIGURATION RELATED
   */

  private fun readFile(mPath:String):String{
    return try {
      if (mPath.isEmpty() || mPath == "null") "" else File(mPath).readText()
    } catch (ignore: Exception) {
      ""
    }
  }

  private fun setUseOpenVPN3(enableOVPN3:Boolean){
    val prefs = Preferences.getDefaultSharedPreferences(reactApplicationContext)
    prefs.edit {
      putBoolean("ovpn3",enableOVPN3)
    }
  }

  private fun setUseSystemProxy(enableSystemProxy:Boolean){
    val prefs = Preferences.getDefaultSharedPreferences(reactApplicationContext)
    prefs.edit {
      putBoolean("usesystemproxy",enableSystemProxy)
    }
  }

  private fun setReconnectOnNetworkChange(enableReconnectOnNetworkChange:Boolean){
    val prefs = Preferences.getDefaultSharedPreferences(reactApplicationContext)
    prefs.edit {
      putBoolean("netchangereconnect",enableReconnectOnNetworkChange)
    }
  }

  private fun setPauseOnScreenOff(pauseOnScreenOff:Boolean){
    val prefs = Preferences.getDefaultSharedPreferences(reactApplicationContext)
    prefs.edit {
      putBoolean("screenoff",pauseOnScreenOff)
    }
  }

  private fun setDisableConfirmationDialogs(disableConfirmationDialogs:Boolean){
    val prefs = Preferences.getDefaultSharedPreferences(reactApplicationContext)
    prefs.edit {
      putBoolean("disableconfirmation",disableConfirmationDialogs)
    }
  }

  private fun setEncryptProfiles(encryptProfiles:Boolean){
    val prefs = Preferences.getDefaultSharedPreferences(reactApplicationContext)
    prefs.edit {
      putBoolean("preferencryption",encryptProfiles)
    }
  }

  private fun setKeepVPNConnected(keepVPNConnected:Boolean){
    val prefs = Preferences.getDefaultSharedPreferences(reactApplicationContext)
    prefs.edit {
      putBoolean("restartvpnonboot",keepVPNConnected)
    }
  }

  private fun populateVPNProfile(vpnProfile:VpnProfile, params:ReadableMap):VpnProfile{
    val temporaryProfile = vpnProfile.copy("temporaryProfile")

    temporaryProfile.mName = "tempProfile"
    //No Options, just send back profile.
    if(!params.hasKey("androidOptions")){
      return temporaryProfile
    }

    val options = params.getMap("androidOptions")!!
    //Internal Settings
    if(options.hasKey("useOpenVPN3")){
      setUseOpenVPN3(options.getBoolean("useOpenVPN3"))
    }
    if(options.hasKey("useSystemProxy")){
      setUseSystemProxy(options.getBoolean("useSystemProxy"))
    }
    if(options.hasKey("useReconnectOnNetworkChange")){
      setReconnectOnNetworkChange(options.getBoolean("useReconnectOnNetworkChange"))
    }
    if(options.hasKey("usePauseOnScreenOff")){
      setPauseOnScreenOff(options.getBoolean("usePauseOnScreenOff"))
    }
    if(options.hasKey("useDisableConfirmDialog")){
      setDisableConfirmationDialogs(options.getBoolean("useDisableConfirmDialog"))
    }
    if(options.hasKey("useProfileEncryption")){
      setEncryptProfiles(options.getBoolean("useProfileEncryption"))
    }
    if(options.hasKey("useKeepVPNConnected")){
      setKeepVPNConnected(options.getBoolean("useKeepVPNConnected"))
    }

    //Profile Settings
    if(options.hasKey("compatibilityMode")){
      temporaryProfile.mCompatMode = Utils.mapCompatMode(options.getInt("compatibilityMode"))
    }
    if(options.hasKey("useLegacyProvider")){
      temporaryProfile.mUseLegacyProvider = options.getBoolean("useLegacyProvider")
    }
    if(options.hasKey("useLZOCompression")){
      temporaryProfile.mUseLzo = options.getBoolean("useLZOCompression")
    }
    if(options.hasKey("checkPeerFingerprint")){
      temporaryProfile.mCheckPeerFingerprint = options.getBoolean("checkPeerFingerprint")
    }
    if(options.hasKey("peerFingerPrints")){
      temporaryProfile.mPeerFingerPrints = options.getString("peerFingerPrints")
    }
    if(options.hasKey("pullSettings")){
      temporaryProfile.mUsePull = options.getBoolean("pullSettings")
    }
    if(options.hasKey("ipv4")){
      temporaryProfile.mIPv4Address = options.getString("ipv4")
    }
    if(options.hasKey("ipv6")){
      temporaryProfile.mIPv6Address = options.getString("ipv6")
    }
    if(options.hasKey("noLocalBinding")){
      temporaryProfile.mNobind = options.getBoolean("noLocalBinding")
    }
    if(options.hasKey("overrideDNS")){
      temporaryProfile.mOverrideDNS = options.getBoolean("overrideDNS")
    }
    if(options.hasKey("searchDomain")){
      temporaryProfile.mSearchDomain = options.getString("searchDomain")
    }
    if(options.hasKey("DNS1")){
      temporaryProfile.mDNS1 = options.getString("DNS1")
    }
    if(options.hasKey("DNS2")){
      temporaryProfile.mDNS2 = options.getString("DNS2")
    }
    if(options.hasKey("ignorePushedRoutes")){
      temporaryProfile.mRoutenopull = options.getBoolean("ignorePushedRoutes")
    }
    if(options.hasKey("blockUnusedAddressFamilies")){
      temporaryProfile.mBlockUnusedAddressFamilies = options.getBoolean("blockUnusedAddressFamilies")
    }
    if(options.hasKey("allowLocalLAN")){
      temporaryProfile.mAllowLocalLAN = options.getBoolean("allowLocalLAN")
    }


    if(options.hasKey("useDefaultRoute")){
      temporaryProfile.mUseDefaultRoute = options.getBoolean("useDefaultRoute")
      //set options if useDefaultRoute option disabled.
      if(!options.getBoolean("useDefaultRoute")){
        if(options.hasKey("customRoutes")){
          temporaryProfile.mCustomRoutes = options.getString("customRoutes")
        }
        if(options.hasKey("excludedRoutes")){
          temporaryProfile.mExcludedRoutes = options.getString("excludedRoutes")
        }
      }
    }


    if(options.hasKey("useDefaultRouteV6")){
      temporaryProfile.mUseDefaultRoutev6 = options.getBoolean("useDefaultRouteV6")
      //set options if useDefaultRouteV6 option disabled.
      if(!options.getBoolean("useDefaultRouteV6")){
        if(options.hasKey("customRoutesV6")){
          temporaryProfile.mCustomRoutesv6 = options.getString("customRoutesV6")
        }
        if(options.hasKey("excludedRoutesV6")){
          temporaryProfile.mExcludedRoutesv6 = options.getString("excludedRoutesV6")
        }
      }
    }


    if(options.hasKey("allowedVPNApps")){
      for(app in options.getArray("allowedVPNApps")!!.toArrayList()){
        temporaryProfile.mAllowedAppsVpn.add(app.toString())
      }
    }
    if(options.hasKey("allowedVPNAppsAreDisallowed")){
      temporaryProfile.mAllowedAppsVpnAreDisallowed = options.getBoolean("allowedVPNAppsAreDisallowed")
    }
    if(options.hasKey("allowAppVpnBypass")){
      temporaryProfile.mAllowAppVpnBypass = options.getBoolean("allowAppVpnBypass")
    }

    if(options.hasKey("tlsProfileSecurity")){
      temporaryProfile.mTlSCertProfile = options.getString("tlsProfileSecurity")
    }
    if(options.hasKey("expectServerTLSCert")){
      temporaryProfile.mExpectTLSCert = options.getBoolean("expectServerTLSCert")
    }
    if(options.hasKey("certificateHostnameCheck")){
      temporaryProfile.mCheckRemoteCN = options.getBoolean("certificateHostnameCheck")
    }
    if(options.hasKey("remoteCertificateSubject")){
      temporaryProfile.mRemoteCN = options.getString("remoteCertificateSubject")
    }
    if(options.hasKey("remoteX509UsernameField")){
      temporaryProfile.mx509UsernameField = options.getString("remoteX509UsernameField")
    }

    if(options.hasKey("useTLSAuth")){
      temporaryProfile.mUseTLSAuth = options.getBoolean("useTLSAuth")
    }
    if(options.hasKey("dataCiphers")){
      temporaryProfile.mDataCiphers = options.getString("dataCiphers")
    }
    if(options.hasKey("packetDigests")){
      temporaryProfile.mAuth = options.getString("packetDigests")
    }

    if(options.hasKey("persistTun")){
      temporaryProfile.mPersistTun = options.getBoolean("persistTun")
    }
    if(options.hasKey("pushPeerInfo")){
      temporaryProfile.mPushPeerInfo = options.getBoolean("pushPeerInfo")
    }
    if(options.hasKey("useRandomHostname")){
      temporaryProfile.mUseRandomHostname = options.getBoolean("useRandomHostname")
    }
    if(options.hasKey("useFloat")){
      temporaryProfile.mUseFloat = options.getBoolean("useFloat")
    }

    if(options.hasKey("useCustomConfig")){
      temporaryProfile.mUseCustomConfig = options.getBoolean("useCustomConfig")
    }
    if(options.hasKey("customOptions")){
      temporaryProfile.mCustomConfigOptions = options.getString("customOptions")
    }

    if(options.hasKey("connectRetryMax")){
      temporaryProfile.mConnectRetryMax = options.getString("connectRetryMax")
    }
    if(options.hasKey("connectRetryMaxTime")){
      temporaryProfile.mConnectRetryMaxTime = options.getString("connectRetryMaxTime")
    }
    if(options.hasKey("connectRetry")){
      temporaryProfile.mConnectRetry = options.getString("connectRetry")
    }



    return temporaryProfile
  }


  /**
   * VPN PREPARE RELATED
   */

  override fun onActivityResult(activity: Activity, requestCode: Int, resultCode: Int, data: Intent?) {
    if (requestCode == PREPARE_VPN_PROFILE) {
      if (preparePromise != null) {
        if (resultCode == RESULT_OK) {
          preparePromise!!.resolve(true)
        } else {
          preparePromise!!.resolve(false)
        }
        preparePromise = null
      }
      if(resultCode == RESULT_OK && profileToConnectAfterPrepare!=null){
        connectAfterPrepared()
      }
    }
  }

  override fun onNewIntent(intent: Intent) {
  }

  private fun enableStrictModes() {
    val tpbuilder = ThreadPolicy.Builder()
      .detectAll()
      .penaltyLog()


    val vpbuilder = VmPolicy.Builder()
      .detectAll()
      .penaltyLog()

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
      tpbuilder.penaltyListener(
        Executors.newSingleThreadExecutor()
      ) { v: Violation? ->
        if (v != null) {
          this.logViolation(v)
        }
      }
      vpbuilder.penaltyListener(
        Executors.newSingleThreadExecutor()
      ) { v: Violation? ->
        if (v != null) {
          this.logViolation(v)
        }
      }
    }

    val policy = vpbuilder.build()
    StrictMode.setVmPolicy(policy)
  }

  @RequiresApi(api = Build.VERSION_CODES.P)
  fun logViolation(v: Violation) {
    val name = Application.getProcessName()
    System.err.println("------------------------- Violation detected in " + name + " ------" + v.cause + "---------------------------")
    VpnStatus.logException(VpnStatus.LogLevel.DEBUG, null, v)
  }


  @RequiresApi(Build.VERSION_CODES.O)
  private fun createNotificationChannels() {
    val mNotificationManager =
      reactApplicationContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

    // Background message
    var name: CharSequence? = reactApplicationContext.getString(R.string.channel_name_background)
    var mChannel = NotificationChannel(
      OpenVPNService.NOTIFICATION_CHANNEL_BG_ID,
      name, NotificationManager.IMPORTANCE_MIN
    )

    mChannel.description = reactApplicationContext.getString(R.string.channel_description_background)
    mChannel.enableLights(false)

    mChannel.lightColor = Color.DKGRAY
    mNotificationManager.createNotificationChannel(mChannel)

    // Connection status change messages
    name = reactApplicationContext.getString(R.string.channel_name_status)
    mChannel = NotificationChannel(
      OpenVPNService.NOTIFICATION_CHANNEL_NEWSTATUS_ID,
      name, NotificationManager.IMPORTANCE_LOW
    )

    mChannel.description = reactApplicationContext.getString(R.string.channel_description_status)
    mChannel.enableLights(true)

    mChannel.lightColor = Color.BLUE
    mNotificationManager.createNotificationChannel(mChannel)


    // Urgent requests, e.g. two factor auth
    name = reactApplicationContext.getString(R.string.channel_name_userreq)
    mChannel = NotificationChannel(
      OpenVPNService.NOTIFICATION_CHANNEL_USERREQ_ID,
      name, NotificationManager.IMPORTANCE_HIGH
    )
    mChannel.description = reactApplicationContext.getString(R.string.channel_description_userreq)
    mChannel.enableVibration(true)
    mChannel.lightColor = Color.CYAN
    mNotificationManager.createNotificationChannel(mChannel)
  }

  override fun newLog(logItem: LogItem?) {
    // ML: do not emit VPN logs or profile material to logcat.
  }

}
