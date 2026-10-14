package net.openvpn.ovpn3;

/* loaded from: classes2.dex */
public class ClientAPI_ExternalPKISignRequest extends ClientAPI_ExternalPKIRequestBase {
    private transient long swigCPtr;

    protected ClientAPI_ExternalPKISignRequest(long j, boolean z) {
        super(ovpncliJNI.ClientAPI_ExternalPKISignRequest_SWIGUpcast(j), z);
        this.swigCPtr = j;
    }

    protected static long getCPtr(ClientAPI_ExternalPKISignRequest clientAPI_ExternalPKISignRequest) {
        if (clientAPI_ExternalPKISignRequest == null) {
            return 0L;
        }
        return clientAPI_ExternalPKISignRequest.swigCPtr;
    }

    protected static long swigRelease(ClientAPI_ExternalPKISignRequest clientAPI_ExternalPKISignRequest) {
        if (clientAPI_ExternalPKISignRequest == null) {
            return 0L;
        }
        if (!clientAPI_ExternalPKISignRequest.swigCMemOwn) {
            throw new RuntimeException("Cannot release ownership as memory is not owned");
        }
        long j = clientAPI_ExternalPKISignRequest.swigCPtr;
        clientAPI_ExternalPKISignRequest.swigCMemOwn = false;
        clientAPI_ExternalPKISignRequest.delete();
        return j;
    }

    @Override // net.openvpn.ovpn3.ClientAPI_ExternalPKIRequestBase
    protected void finalize() {
        delete();
    }

    @Override // net.openvpn.ovpn3.ClientAPI_ExternalPKIRequestBase
    public synchronized void delete() {
        if (this.swigCPtr != 0) {
            if (this.swigCMemOwn) {
                this.swigCMemOwn = false;
                ovpncliJNI.delete_ClientAPI_ExternalPKISignRequest(this.swigCPtr);
            }
            this.swigCPtr = 0L;
        }
        super.delete();
    }

    public void setData(String str) {
        ovpncliJNI.ClientAPI_ExternalPKISignRequest_data_set(this.swigCPtr, this, str);
    }

    public String getData() {
        return ovpncliJNI.ClientAPI_ExternalPKISignRequest_data_get(this.swigCPtr, this);
    }

    public void setSig(String str) {
        ovpncliJNI.ClientAPI_ExternalPKISignRequest_sig_set(this.swigCPtr, this, str);
    }

    public String getSig() {
        return ovpncliJNI.ClientAPI_ExternalPKISignRequest_sig_get(this.swigCPtr, this);
    }

    public void setAlgorithm(String str) {
        ovpncliJNI.ClientAPI_ExternalPKISignRequest_algorithm_set(this.swigCPtr, this, str);
    }

    public String getAlgorithm() {
        return ovpncliJNI.ClientAPI_ExternalPKISignRequest_algorithm_get(this.swigCPtr, this);
    }

    public void setHashalg(String str) {
        ovpncliJNI.ClientAPI_ExternalPKISignRequest_hashalg_set(this.swigCPtr, this, str);
    }

    public String getHashalg() {
        return ovpncliJNI.ClientAPI_ExternalPKISignRequest_hashalg_get(this.swigCPtr, this);
    }

    public void setSaltlen(String str) {
        ovpncliJNI.ClientAPI_ExternalPKISignRequest_saltlen_set(this.swigCPtr, this, str);
    }

    public String getSaltlen() {
        return ovpncliJNI.ClientAPI_ExternalPKISignRequest_saltlen_get(this.swigCPtr, this);
    }

    public ClientAPI_ExternalPKISignRequest() {
        this(ovpncliJNI.new_ClientAPI_ExternalPKISignRequest(), true);
    }
}