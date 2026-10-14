package net.openvpn.ovpn3;

/* loaded from: classes2.dex */
public class ClientAPI_ExternalPKIBase {
    protected transient boolean swigCMemOwn;
    private transient long swigCPtr;

    protected ClientAPI_ExternalPKIBase(long j, boolean z) {
        this.swigCMemOwn = z;
        this.swigCPtr = j;
    }

    protected static long getCPtr(ClientAPI_ExternalPKIBase clientAPI_ExternalPKIBase) {
        if (clientAPI_ExternalPKIBase == null) {
            return 0L;
        }
        return clientAPI_ExternalPKIBase.swigCPtr;
    }

    protected static long swigRelease(ClientAPI_ExternalPKIBase clientAPI_ExternalPKIBase) {
        if (clientAPI_ExternalPKIBase == null) {
            return 0L;
        }
        if (!clientAPI_ExternalPKIBase.swigCMemOwn) {
            throw new RuntimeException("Cannot release ownership as memory is not owned");
        }
        long j = clientAPI_ExternalPKIBase.swigCPtr;
        clientAPI_ExternalPKIBase.swigCMemOwn = false;
        clientAPI_ExternalPKIBase.delete();
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
                ovpncliJNI.delete_ClientAPI_ExternalPKIBase(j);
            }
            this.swigCPtr = 0L;
        }
    }

    public boolean sign(String str, String str2, SWIGTYPE_p_std__string sWIGTYPE_p_std__string, String str3, String str4, String str5) {
        return ovpncliJNI.ClientAPI_ExternalPKIBase_sign(this.swigCPtr, this, str, str2, SWIGTYPE_p_std__string.getCPtr(sWIGTYPE_p_std__string), str3, str4, str5);
    }
}