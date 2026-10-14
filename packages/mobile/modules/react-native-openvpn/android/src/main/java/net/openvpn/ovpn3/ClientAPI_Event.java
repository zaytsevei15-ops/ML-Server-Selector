package net.openvpn.ovpn3;

/* loaded from: classes2.dex */
public class ClientAPI_Event {
    protected transient boolean swigCMemOwn;
    private transient long swigCPtr;

    protected ClientAPI_Event(long j, boolean z) {
        this.swigCMemOwn = z;
        this.swigCPtr = j;
    }

    protected static long getCPtr(ClientAPI_Event clientAPI_Event) {
        if (clientAPI_Event == null) {
            return 0L;
        }
        return clientAPI_Event.swigCPtr;
    }

    protected static long swigRelease(ClientAPI_Event clientAPI_Event) {
        if (clientAPI_Event == null) {
            return 0L;
        }
        if (!clientAPI_Event.swigCMemOwn) {
            throw new RuntimeException("Cannot release ownership as memory is not owned");
        }
        long j = clientAPI_Event.swigCPtr;
        clientAPI_Event.swigCMemOwn = false;
        clientAPI_Event.delete();
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
                ovpncliJNI.delete_ClientAPI_Event(j);
            }
            this.swigCPtr = 0L;
        }
    }

    public void setError(boolean z) {
        ovpncliJNI.ClientAPI_Event_error_set(this.swigCPtr, this, z);
    }

    public boolean getError() {
        return ovpncliJNI.ClientAPI_Event_error_get(this.swigCPtr, this);
    }

    public void setFatal(boolean z) {
        ovpncliJNI.ClientAPI_Event_fatal_set(this.swigCPtr, this, z);
    }

    public boolean getFatal() {
        return ovpncliJNI.ClientAPI_Event_fatal_get(this.swigCPtr, this);
    }

    public void setName(String str) {
        ovpncliJNI.ClientAPI_Event_name_set(this.swigCPtr, this, str);
    }

    public String getName() {
        return ovpncliJNI.ClientAPI_Event_name_get(this.swigCPtr, this);
    }

    public void setInfo(String str) {
        ovpncliJNI.ClientAPI_Event_info_set(this.swigCPtr, this, str);
    }

    public String getInfo() {
        return ovpncliJNI.ClientAPI_Event_info_get(this.swigCPtr, this);
    }

    public ClientAPI_Event() {
        this(ovpncliJNI.new_ClientAPI_Event(), true);
    }
}