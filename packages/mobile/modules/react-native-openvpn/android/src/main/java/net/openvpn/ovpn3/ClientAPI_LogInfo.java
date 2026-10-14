package net.openvpn.ovpn3;

/* loaded from: classes2.dex */
public class ClientAPI_LogInfo {
    protected transient boolean swigCMemOwn;
    private transient long swigCPtr;

    protected ClientAPI_LogInfo(long j, boolean z) {
        this.swigCMemOwn = z;
        this.swigCPtr = j;
    }

    protected static long getCPtr(ClientAPI_LogInfo clientAPI_LogInfo) {
        if (clientAPI_LogInfo == null) {
            return 0L;
        }
        return clientAPI_LogInfo.swigCPtr;
    }

    protected static long swigRelease(ClientAPI_LogInfo clientAPI_LogInfo) {
        if (clientAPI_LogInfo == null) {
            return 0L;
        }
        if (!clientAPI_LogInfo.swigCMemOwn) {
            throw new RuntimeException("Cannot release ownership as memory is not owned");
        }
        long j = clientAPI_LogInfo.swigCPtr;
        clientAPI_LogInfo.swigCMemOwn = false;
        clientAPI_LogInfo.delete();
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
                ovpncliJNI.delete_ClientAPI_LogInfo(j);
            }
            this.swigCPtr = 0L;
        }
    }

    public ClientAPI_LogInfo() {
        this(ovpncliJNI.new_ClientAPI_LogInfo__SWIG_0(), true);
    }

    public ClientAPI_LogInfo(String str) {
        this(ovpncliJNI.new_ClientAPI_LogInfo__SWIG_1(str), true);
    }

    public void setText(String str) {
        ovpncliJNI.ClientAPI_LogInfo_text_set(this.swigCPtr, this, str);
    }

    public String getText() {
        return ovpncliJNI.ClientAPI_LogInfo_text_get(this.swigCPtr, this);
    }
}