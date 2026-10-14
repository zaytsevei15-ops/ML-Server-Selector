package net.openvpn.ovpn3;

/* loaded from: classes2.dex */
public class ClientAPI_SessionToken {
    protected transient boolean swigCMemOwn;
    private transient long swigCPtr;

    protected ClientAPI_SessionToken(long j, boolean z) {
        this.swigCMemOwn = z;
        this.swigCPtr = j;
    }

    protected static long getCPtr(ClientAPI_SessionToken clientAPI_SessionToken) {
        if (clientAPI_SessionToken == null) {
            return 0L;
        }
        return clientAPI_SessionToken.swigCPtr;
    }

    protected static long swigRelease(ClientAPI_SessionToken clientAPI_SessionToken) {
        if (clientAPI_SessionToken == null) {
            return 0L;
        }
        if (!clientAPI_SessionToken.swigCMemOwn) {
            throw new RuntimeException("Cannot release ownership as memory is not owned");
        }
        long j = clientAPI_SessionToken.swigCPtr;
        clientAPI_SessionToken.swigCMemOwn = false;
        clientAPI_SessionToken.delete();
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
                ovpncliJNI.delete_ClientAPI_SessionToken(j);
            }
            this.swigCPtr = 0L;
        }
    }

    public void setUsername(String str) {
        ovpncliJNI.ClientAPI_SessionToken_username_set(this.swigCPtr, this, str);
    }

    public String getUsername() {
        return ovpncliJNI.ClientAPI_SessionToken_username_get(this.swigCPtr, this);
    }

    public void setSession_id(String str) {
        ovpncliJNI.ClientAPI_SessionToken_session_id_set(this.swigCPtr, this, str);
    }

    public String getSession_id() {
        return ovpncliJNI.ClientAPI_SessionToken_session_id_get(this.swigCPtr, this);
    }

    public ClientAPI_SessionToken() {
        this(ovpncliJNI.new_ClientAPI_SessionToken(), true);
    }
}