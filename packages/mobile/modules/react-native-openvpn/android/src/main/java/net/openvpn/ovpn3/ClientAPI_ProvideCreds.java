package net.openvpn.ovpn3;

/* loaded from: classes2.dex */
public class ClientAPI_ProvideCreds {
    protected transient boolean swigCMemOwn;
    private transient long swigCPtr;

    protected ClientAPI_ProvideCreds(long j, boolean z) {
        this.swigCMemOwn = z;
        this.swigCPtr = j;
    }

    protected static long getCPtr(ClientAPI_ProvideCreds clientAPI_ProvideCreds) {
        if (clientAPI_ProvideCreds == null) {
            return 0L;
        }
        return clientAPI_ProvideCreds.swigCPtr;
    }

    protected static long swigRelease(ClientAPI_ProvideCreds clientAPI_ProvideCreds) {
        if (clientAPI_ProvideCreds == null) {
            return 0L;
        }
        if (!clientAPI_ProvideCreds.swigCMemOwn) {
            throw new RuntimeException("Cannot release ownership as memory is not owned");
        }
        long j = clientAPI_ProvideCreds.swigCPtr;
        clientAPI_ProvideCreds.swigCMemOwn = false;
        clientAPI_ProvideCreds.delete();
        return j;
    }

    protected void finalize() {
        delete();
    }

    public synchronized void delete() {
        long j = this.swigCPtr;
        if (j != 0) {
            if (this.swigCMemOwn) {
                this.swigCMemOwn = false;
                ovpncliJNI.delete_ClientAPI_ProvideCreds(j);
            }
            this.swigCPtr = 0L;
        }
    }

    public void setUsername(String str) {
        ovpncliJNI.ClientAPI_ProvideCreds_username_set(this.swigCPtr, this, str);
    }

    public String getUsername() {
        return ovpncliJNI.ClientAPI_ProvideCreds_username_get(this.swigCPtr, this);
    }

    public void setPassword(String str) {
        ovpncliJNI.ClientAPI_ProvideCreds_password_set(this.swigCPtr, this, str);
    }

    public String getPassword() {
        return ovpncliJNI.ClientAPI_ProvideCreds_password_get(this.swigCPtr, this);
    }

    public void setHttp_proxy_user(String str) {
        ovpncliJNI.ClientAPI_ProvideCreds_http_proxy_user_set(this.swigCPtr, this, str);
    }

    public String getHttp_proxy_user() {
        return ovpncliJNI.ClientAPI_ProvideCreds_http_proxy_user_get(this.swigCPtr, this);
    }

    public void setHttp_proxy_pass(String str) {
        ovpncliJNI.ClientAPI_ProvideCreds_http_proxy_pass_set(this.swigCPtr, this, str);
    }

    public String getHttp_proxy_pass() {
        return ovpncliJNI.ClientAPI_ProvideCreds_http_proxy_pass_get(this.swigCPtr, this);
    }

    public void setResponse(String str) {
        ovpncliJNI.ClientAPI_ProvideCreds_response_set(this.swigCPtr, this, str);
    }

    public String getResponse() {
        return ovpncliJNI.ClientAPI_ProvideCreds_response_get(this.swigCPtr, this);
    }

    public void setDynamicChallengeCookie(String str) {
        ovpncliJNI.ClientAPI_ProvideCreds_dynamicChallengeCookie_set(this.swigCPtr, this, str);
    }

    public String getDynamicChallengeCookie() {
        return ovpncliJNI.ClientAPI_ProvideCreds_dynamicChallengeCookie_get(this.swigCPtr, this);
    }

    public ClientAPI_ProvideCreds() {
        this(ovpncliJNI.new_ClientAPI_ProvideCreds(), true);
    }
}