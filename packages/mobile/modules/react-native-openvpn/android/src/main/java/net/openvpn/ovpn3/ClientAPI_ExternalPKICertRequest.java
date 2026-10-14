package net.openvpn.ovpn3;

/* loaded from: classes2.dex */
public class ClientAPI_ExternalPKICertRequest extends ClientAPI_ExternalPKIRequestBase {
    private transient long swigCPtr;

    protected ClientAPI_ExternalPKICertRequest(long j, boolean z) {
        super(ovpncliJNI.ClientAPI_ExternalPKICertRequest_SWIGUpcast(j), z);
        this.swigCPtr = j;
    }

    protected static long getCPtr(ClientAPI_ExternalPKICertRequest clientAPI_ExternalPKICertRequest) {
        if (clientAPI_ExternalPKICertRequest == null) {
            return 0L;
        }
        return clientAPI_ExternalPKICertRequest.swigCPtr;
    }

    protected static long swigRelease(ClientAPI_ExternalPKICertRequest clientAPI_ExternalPKICertRequest) {
        if (clientAPI_ExternalPKICertRequest == null) {
            return 0L;
        }
        if (!clientAPI_ExternalPKICertRequest.swigCMemOwn) {
            throw new RuntimeException("Cannot release ownership as memory is not owned");
        }
        long j = clientAPI_ExternalPKICertRequest.swigCPtr;
        clientAPI_ExternalPKICertRequest.swigCMemOwn = false;
        clientAPI_ExternalPKICertRequest.delete();
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
                ovpncliJNI.delete_ClientAPI_ExternalPKICertRequest(this.swigCPtr);
            }
            this.swigCPtr = 0L;
        }
        super.delete();
    }

    public void setCert(String str) {
        ovpncliJNI.ClientAPI_ExternalPKICertRequest_cert_set(this.swigCPtr, this, str);
    }

    public String getCert() {
        return ovpncliJNI.ClientAPI_ExternalPKICertRequest_cert_get(this.swigCPtr, this);
    }

    public void setSupportingChain(String str) {
        ovpncliJNI.ClientAPI_ExternalPKICertRequest_supportingChain_set(this.swigCPtr, this, str);
    }

    public String getSupportingChain() {
        return ovpncliJNI.ClientAPI_ExternalPKICertRequest_supportingChain_get(this.swigCPtr, this);
    }

    public ClientAPI_ExternalPKICertRequest() {
        this(ovpncliJNI.new_ClientAPI_ExternalPKICertRequest(), true);
    }
}