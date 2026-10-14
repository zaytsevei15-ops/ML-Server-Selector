package net.openvpn.ovpn3;

/* loaded from: classes2.dex */
public class ClientAPI_ExternalPKIRequestBase {
    protected transient boolean swigCMemOwn;
    private transient long swigCPtr;

    protected ClientAPI_ExternalPKIRequestBase(long j, boolean z) {
        this.swigCMemOwn = z;
        this.swigCPtr = j;
    }

    protected static long getCPtr(ClientAPI_ExternalPKIRequestBase clientAPI_ExternalPKIRequestBase) {
        if (clientAPI_ExternalPKIRequestBase == null) {
            return 0L;
        }
        return clientAPI_ExternalPKIRequestBase.swigCPtr;
    }

    protected static long swigRelease(ClientAPI_ExternalPKIRequestBase clientAPI_ExternalPKIRequestBase) {
        if (clientAPI_ExternalPKIRequestBase == null) {
            return 0L;
        }
        if (!clientAPI_ExternalPKIRequestBase.swigCMemOwn) {
            throw new RuntimeException("Cannot release ownership as memory is not owned");
        }
        long j = clientAPI_ExternalPKIRequestBase.swigCPtr;
        clientAPI_ExternalPKIRequestBase.swigCMemOwn = false;
        clientAPI_ExternalPKIRequestBase.delete();
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
                ovpncliJNI.delete_ClientAPI_ExternalPKIRequestBase(j);
            }
            this.swigCPtr = 0L;
        }
    }

    public void setError(boolean z) {
        ovpncliJNI.ClientAPI_ExternalPKIRequestBase_error_set(this.swigCPtr, this, z);
    }

    public boolean getError() {
        return ovpncliJNI.ClientAPI_ExternalPKIRequestBase_error_get(this.swigCPtr, this);
    }

    public void setErrorText(String str) {
        ovpncliJNI.ClientAPI_ExternalPKIRequestBase_errorText_set(this.swigCPtr, this, str);
    }

    public String getErrorText() {
        return ovpncliJNI.ClientAPI_ExternalPKIRequestBase_errorText_get(this.swigCPtr, this);
    }

    public void setInvalidAlias(boolean z) {
        ovpncliJNI.ClientAPI_ExternalPKIRequestBase_invalidAlias_set(this.swigCPtr, this, z);
    }

    public boolean getInvalidAlias() {
        return ovpncliJNI.ClientAPI_ExternalPKIRequestBase_invalidAlias_get(this.swigCPtr, this);
    }

    public void setAlias(String str) {
        ovpncliJNI.ClientAPI_ExternalPKIRequestBase_alias_set(this.swigCPtr, this, str);
    }

    public String getAlias() {
        return ovpncliJNI.ClientAPI_ExternalPKIRequestBase_alias_get(this.swigCPtr, this);
    }

    public ClientAPI_ExternalPKIRequestBase() {
        this(ovpncliJNI.new_ClientAPI_ExternalPKIRequestBase(), true);
    }
}