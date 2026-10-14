package net.openvpn.ovpn3;

/* loaded from: classes2.dex */
public class ClientAPI_KeyValue {
    protected transient boolean swigCMemOwn;
    private transient long swigCPtr;

    protected ClientAPI_KeyValue(long j, boolean z) {
        this.swigCMemOwn = z;
        this.swigCPtr = j;
    }

    protected static long getCPtr(ClientAPI_KeyValue clientAPI_KeyValue) {
        if (clientAPI_KeyValue == null) {
            return 0L;
        }
        return clientAPI_KeyValue.swigCPtr;
    }

    protected static long swigRelease(ClientAPI_KeyValue clientAPI_KeyValue) {
        if (clientAPI_KeyValue == null) {
            return 0L;
        }
        if (!clientAPI_KeyValue.swigCMemOwn) {
            throw new RuntimeException("Cannot release ownership as memory is not owned");
        }
        long j = clientAPI_KeyValue.swigCPtr;
        clientAPI_KeyValue.swigCMemOwn = false;
        clientAPI_KeyValue.delete();
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
                ovpncliJNI.delete_ClientAPI_KeyValue(j);
            }
            this.swigCPtr = 0L;
        }
    }

    public ClientAPI_KeyValue() {
        this(ovpncliJNI.new_ClientAPI_KeyValue__SWIG_0(), true);
    }

    public ClientAPI_KeyValue(String str, String str2) {
        this(ovpncliJNI.new_ClientAPI_KeyValue__SWIG_1(str, str2), true);
    }

    public void setKey(String str) {
        ovpncliJNI.ClientAPI_KeyValue_key_set(this.swigCPtr, this, str);
    }

    public String getKey() {
        return ovpncliJNI.ClientAPI_KeyValue_key_get(this.swigCPtr, this);
    }

    public void setValue(String str) {
        ovpncliJNI.ClientAPI_KeyValue_value_set(this.swigCPtr, this, str);
    }

    public String getValue() {
        return ovpncliJNI.ClientAPI_KeyValue_value_get(this.swigCPtr, this);
    }
}