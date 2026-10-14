package net.openvpn.ovpn3;

/* loaded from: classes2.dex */
public class ClientAPI_AppCustomControlMessageEvent {
    protected transient boolean swigCMemOwn;
    private transient long swigCPtr;

    protected ClientAPI_AppCustomControlMessageEvent(long j, boolean z) {
        this.swigCMemOwn = z;
        this.swigCPtr = j;
    }

    protected static long getCPtr(ClientAPI_AppCustomControlMessageEvent clientAPI_AppCustomControlMessageEvent) {
        if (clientAPI_AppCustomControlMessageEvent == null) {
            return 0L;
        }
        return clientAPI_AppCustomControlMessageEvent.swigCPtr;
    }

    protected static long swigRelease(ClientAPI_AppCustomControlMessageEvent clientAPI_AppCustomControlMessageEvent) {
        if (clientAPI_AppCustomControlMessageEvent == null) {
            return 0L;
        }
        if (!clientAPI_AppCustomControlMessageEvent.swigCMemOwn) {
            throw new RuntimeException("Cannot release ownership as memory is not owned");
        }
        long j = clientAPI_AppCustomControlMessageEvent.swigCPtr;
        clientAPI_AppCustomControlMessageEvent.swigCMemOwn = false;
        clientAPI_AppCustomControlMessageEvent.delete();
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
                ovpncliJNI.delete_ClientAPI_AppCustomControlMessageEvent(j);
            }
            this.swigCPtr = 0L;
        }
    }

    public void setProtocol(String str) {
        ovpncliJNI.ClientAPI_AppCustomControlMessageEvent_protocol_set(this.swigCPtr, this, str);
    }

    public String getProtocol() {
        return ovpncliJNI.ClientAPI_AppCustomControlMessageEvent_protocol_get(this.swigCPtr, this);
    }

    public void setPayload(String str) {
        ovpncliJNI.ClientAPI_AppCustomControlMessageEvent_payload_set(this.swigCPtr, this, str);
    }

    public String getPayload() {
        return ovpncliJNI.ClientAPI_AppCustomControlMessageEvent_payload_get(this.swigCPtr, this);
    }

    public ClientAPI_AppCustomControlMessageEvent() {
        this(ovpncliJNI.new_ClientAPI_AppCustomControlMessageEvent(), true);
    }
}