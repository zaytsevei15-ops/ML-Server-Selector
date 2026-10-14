package net.openvpn.ovpn3;

/* loaded from: classes2.dex */
public class ClientAPI_Status {
    protected transient boolean swigCMemOwn;
    private transient long swigCPtr;

    protected ClientAPI_Status(long j, boolean z) {
        this.swigCMemOwn = z;
        this.swigCPtr = j;
    }

    protected static long getCPtr(ClientAPI_Status clientAPI_Status) {
        if (clientAPI_Status == null) {
            return 0L;
        }
        return clientAPI_Status.swigCPtr;
    }

    protected static long swigRelease(ClientAPI_Status clientAPI_Status) {
        if (clientAPI_Status == null) {
            return 0L;
        }
        if (!clientAPI_Status.swigCMemOwn) {
            throw new RuntimeException("Cannot release ownership as memory is not owned");
        }
        long j = clientAPI_Status.swigCPtr;
        clientAPI_Status.swigCMemOwn = false;
        clientAPI_Status.delete();
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
                ovpncliJNI.delete_ClientAPI_Status(j);
            }
            this.swigCPtr = 0L;
        }
    }

    public void setError(boolean z) {
        ovpncliJNI.ClientAPI_Status_error_set(this.swigCPtr, this, z);
    }

    public boolean getError() {
        return ovpncliJNI.ClientAPI_Status_error_get(this.swigCPtr, this);
    }

    public void setStatus(String str) {
        ovpncliJNI.ClientAPI_Status_status_set(this.swigCPtr, this, str);
    }

    public String getStatus() {
        return ovpncliJNI.ClientAPI_Status_status_get(this.swigCPtr, this);
    }

    public void setMessage(String str) {
        ovpncliJNI.ClientAPI_Status_message_set(this.swigCPtr, this, str);
    }

    public String getMessage() {
        return ovpncliJNI.ClientAPI_Status_message_get(this.swigCPtr, this);
    }

    public ClientAPI_Status() {
        this(ovpncliJNI.new_ClientAPI_Status(), true);
    }
}