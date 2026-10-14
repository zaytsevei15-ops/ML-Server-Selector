package net.openvpn.ovpn3;

/* loaded from: classes2.dex */
public class ClientAPI_OpenVPNClient extends ClientAPI_TunBuilderBase {
    private transient long swigCPtr;

    protected ClientAPI_OpenVPNClient(long j, boolean z) {
        super(ovpncliJNI.ClientAPI_OpenVPNClient_SWIGUpcast(j), z);
        this.swigCPtr = j;
    }

    protected static long getCPtr(ClientAPI_OpenVPNClient clientAPI_OpenVPNClient) {
        if (clientAPI_OpenVPNClient == null) {
            return 0L;
        }
        return clientAPI_OpenVPNClient.swigCPtr;
    }

    protected static long swigRelease(ClientAPI_OpenVPNClient clientAPI_OpenVPNClient) {
        if (clientAPI_OpenVPNClient == null) {
            return 0L;
        }
        if (!clientAPI_OpenVPNClient.swigCMemOwn) {
            throw new RuntimeException("Cannot release ownership as memory is not owned");
        }
        long j = clientAPI_OpenVPNClient.swigCPtr;
        clientAPI_OpenVPNClient.swigCMemOwn = false;
        clientAPI_OpenVPNClient.delete();
        return j;
    }

    @Override // net.openvpn.ovpn3.ClientAPI_TunBuilderBase
    protected void finalize() {
        delete();
    }

    @Override // net.openvpn.ovpn3.ClientAPI_TunBuilderBase
    public synchronized void delete() {
        if (this.swigCPtr != 0) {
            if (this.swigCMemOwn) {
                this.swigCMemOwn = false;
                ovpncliJNI.delete_ClientAPI_OpenVPNClient(this.swigCPtr);
            }
            this.swigCPtr = 0L;
        }
        super.delete();
    }

    protected void swigDirectorDisconnect() {
        this.swigCMemOwn = false;
        delete();
    }

    public void swigReleaseOwnership() {
        this.swigCMemOwn = false;
        ovpncliJNI.ClientAPI_OpenVPNClient_change_ownership(this, this.swigCPtr, false);
    }

    public void swigTakeOwnership() {
        this.swigCMemOwn = true;
        ovpncliJNI.ClientAPI_OpenVPNClient_change_ownership(this, this.swigCPtr, true);
    }

    public ClientAPI_OpenVPNClient() {
        this(ovpncliJNI.new_ClientAPI_OpenVPNClient(), true);
        ovpncliJNI.ClientAPI_OpenVPNClient_director_connect(this, this.swigCPtr, true, true);
    }

    public ClientAPI_EvalConfig eval_config(ClientAPI_Config clientAPI_Config) {
        return new ClientAPI_EvalConfig(ovpncliJNI.ClientAPI_OpenVPNClient_eval_config(this.swigCPtr, this, ClientAPI_Config.getCPtr(clientAPI_Config), clientAPI_Config), true);
    }

    public ClientAPI_Status provide_creds(ClientAPI_ProvideCreds clientAPI_ProvideCreds) {
        return new ClientAPI_Status(ovpncliJNI.ClientAPI_OpenVPNClient_provide_creds(this.swigCPtr, this, ClientAPI_ProvideCreds.getCPtr(clientAPI_ProvideCreds), clientAPI_ProvideCreds), true);
    }

    public boolean socket_protect(int i, String str, boolean z) {
        return getClass() == ClientAPI_OpenVPNClient.class ? ovpncliJNI.ClientAPI_OpenVPNClient_socket_protect(this.swigCPtr, this, i, str, z) : ovpncliJNI.ClientAPI_OpenVPNClient_socket_protectSwigExplicitClientAPI_OpenVPNClient(this.swigCPtr, this, i, str, z);
    }

    public ClientAPI_Status connect() {
        return new ClientAPI_Status(ovpncliJNI.ClientAPI_OpenVPNClient_connect(this.swigCPtr, this), true);
    }

    public ClientAPI_ConnectionInfo connection_info() {
        return new ClientAPI_ConnectionInfo(ovpncliJNI.ClientAPI_OpenVPNClient_connection_info(this.swigCPtr, this), true);
    }

    public boolean session_token(ClientAPI_SessionToken clientAPI_SessionToken) {
        return ovpncliJNI.ClientAPI_OpenVPNClient_session_token(this.swigCPtr, this, ClientAPI_SessionToken.getCPtr(clientAPI_SessionToken), clientAPI_SessionToken);
    }

    public void stop() {
        ovpncliJNI.ClientAPI_OpenVPNClient_stop(this.swigCPtr, this);
    }

    public void pause(String str) {
        ovpncliJNI.ClientAPI_OpenVPNClient_pause(this.swigCPtr, this, str);
    }

    public void resume() {
        ovpncliJNI.ClientAPI_OpenVPNClient_resume(this.swigCPtr, this);
    }

    public void reconnect(int i) {
        ovpncliJNI.ClientAPI_OpenVPNClient_reconnect(this.swigCPtr, this, i);
    }

    public boolean pause_on_connection_timeout() {
        return ovpncliJNI.ClientAPI_OpenVPNClient_pause_on_connection_timeout(this.swigCPtr, this);
    }

    public static int stats_n() {
        return ovpncliJNI.ClientAPI_OpenVPNClient_stats_n();
    }

    public static String stats_name(int i) {
        return ovpncliJNI.ClientAPI_OpenVPNClient_stats_name(i);
    }

    public long stats_value(int i) {
        return ovpncliJNI.ClientAPI_OpenVPNClient_stats_value(this.swigCPtr, this, i);
    }

    public ClientAPI_LLVector stats_bundle() {
        return new ClientAPI_LLVector(ovpncliJNI.ClientAPI_OpenVPNClient_stats_bundle(this.swigCPtr, this), true);
    }

    public ClientAPI_InterfaceStats tun_stats() {
        return new ClientAPI_InterfaceStats(ovpncliJNI.ClientAPI_OpenVPNClient_tun_stats(this.swigCPtr, this), true);
    }

    public ClientAPI_TransportStats transport_stats() {
        return new ClientAPI_TransportStats(ovpncliJNI.ClientAPI_OpenVPNClient_transport_stats(this.swigCPtr, this), true);
    }

    public void post_cc_msg(String str) {
        ovpncliJNI.ClientAPI_OpenVPNClient_post_cc_msg(this.swigCPtr, this, str);
    }

    public void send_app_control_channel_msg(String str, String str2) {
        ovpncliJNI.ClientAPI_OpenVPNClient_send_app_control_channel_msg(this.swigCPtr, this, str, str2);
    }

    public void start_cert_check(String str, String str2, SWIGTYPE_p_std__optionalT_std__string_const_t sWIGTYPE_p_std__optionalT_std__string_const_t) {
        ovpncliJNI.ClientAPI_OpenVPNClient_start_cert_check__SWIG_0(this.swigCPtr, this, str, str2, SWIGTYPE_p_std__optionalT_std__string_const_t.getCPtr(sWIGTYPE_p_std__optionalT_std__string_const_t));
    }

    public void start_cert_check(String str, String str2) {
        ovpncliJNI.ClientAPI_OpenVPNClient_start_cert_check__SWIG_1(this.swigCPtr, this, str, str2);
    }

    public void start_cert_check_epki(String str, SWIGTYPE_p_std__optionalT_std__string_const_t sWIGTYPE_p_std__optionalT_std__string_const_t) {
        ovpncliJNI.ClientAPI_OpenVPNClient_start_cert_check_epki(this.swigCPtr, this, str, SWIGTYPE_p_std__optionalT_std__string_const_t.getCPtr(sWIGTYPE_p_std__optionalT_std__string_const_t));
    }

    public void event(ClientAPI_Event clientAPI_Event) {
        ovpncliJNI.ClientAPI_OpenVPNClient_event(this.swigCPtr, this, ClientAPI_Event.getCPtr(clientAPI_Event), clientAPI_Event);
    }

    public void acc_event(ClientAPI_AppCustomControlMessageEvent clientAPI_AppCustomControlMessageEvent) {
        ovpncliJNI.ClientAPI_OpenVPNClient_acc_event(this.swigCPtr, this, ClientAPI_AppCustomControlMessageEvent.getCPtr(clientAPI_AppCustomControlMessageEvent), clientAPI_AppCustomControlMessageEvent);
    }

    public void log(ClientAPI_LogInfo clientAPI_LogInfo) {
        ovpncliJNI.ClientAPI_OpenVPNClient_log(this.swigCPtr, this, ClientAPI_LogInfo.getCPtr(clientAPI_LogInfo), clientAPI_LogInfo);
    }

    public void external_pki_cert_request(ClientAPI_ExternalPKICertRequest clientAPI_ExternalPKICertRequest) {
        ovpncliJNI.ClientAPI_OpenVPNClient_external_pki_cert_request(this.swigCPtr, this, ClientAPI_ExternalPKICertRequest.getCPtr(clientAPI_ExternalPKICertRequest), clientAPI_ExternalPKICertRequest);
    }

    public void external_pki_sign_request(ClientAPI_ExternalPKISignRequest clientAPI_ExternalPKISignRequest) {
        ovpncliJNI.ClientAPI_OpenVPNClient_external_pki_sign_request(this.swigCPtr, this, ClientAPI_ExternalPKISignRequest.getCPtr(clientAPI_ExternalPKISignRequest), clientAPI_ExternalPKISignRequest);
    }

    public boolean remote_override_enabled() {
        return getClass() == ClientAPI_OpenVPNClient.class ? ovpncliJNI.ClientAPI_OpenVPNClient_remote_override_enabled(this.swigCPtr, this) : ovpncliJNI.ClientAPI_OpenVPNClient_remote_override_enabledSwigExplicitClientAPI_OpenVPNClient(this.swigCPtr, this);
    }

    public void remote_override(ClientAPI_RemoteOverride clientAPI_RemoteOverride) {
        if (getClass() == ClientAPI_OpenVPNClient.class) {
            ovpncliJNI.ClientAPI_OpenVPNClient_remote_override(this.swigCPtr, this, ClientAPI_RemoteOverride.getCPtr(clientAPI_RemoteOverride), clientAPI_RemoteOverride);
        } else {
            ovpncliJNI.ClientAPI_OpenVPNClient_remote_overrideSwigExplicitClientAPI_OpenVPNClient(this.swigCPtr, this, ClientAPI_RemoteOverride.getCPtr(clientAPI_RemoteOverride), clientAPI_RemoteOverride);
        }
    }

    public void clock_tick() {
        if (getClass() == ClientAPI_OpenVPNClient.class) {
            ovpncliJNI.ClientAPI_OpenVPNClient_clock_tick(this.swigCPtr, this);
        } else {
            ovpncliJNI.ClientAPI_OpenVPNClient_clock_tickSwigExplicitClientAPI_OpenVPNClient(this.swigCPtr, this);
        }
    }
}