package net.openvpn.ovpn3;

/* loaded from: classes2.dex */
public class ClientAPI_ServerEntry {
    protected transient boolean swigCMemOwn;
    private transient long swigCPtr;

    protected ClientAPI_ServerEntry(long j, boolean z) {
        this.swigCMemOwn = z;
        this.swigCPtr = j;
    }

    protected static long getCPtr(ClientAPI_ServerEntry clientAPI_ServerEntry) {
        if (clientAPI_ServerEntry == null) {
            return 0L;
        }
        return clientAPI_ServerEntry.swigCPtr;
    }

    protected static long swigRelease(ClientAPI_ServerEntry clientAPI_ServerEntry) {
        if (clientAPI_ServerEntry == null) {
            return 0L;
        }
        if (!clientAPI_ServerEntry.swigCMemOwn) {
            throw new RuntimeException("Cannot release ownership as memory is not owned");
        }
        long j = clientAPI_ServerEntry.swigCPtr;
        clientAPI_ServerEntry.swigCMemOwn = false;
        clientAPI_ServerEntry.delete();
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
                ovpncliJNI.delete_ClientAPI_ServerEntry(j);
            }
            this.swigCPtr = 0L;
        }
    }

    public void setServer(String str) {
        ovpncliJNI.ClientAPI_ServerEntry_server_set(this.swigCPtr, this, str);
    }

    public String getServer() {
        return ovpncliJNI.ClientAPI_ServerEntry_server_get(this.swigCPtr, this);
    }

    public void setFriendlyName(String str) {
        ovpncliJNI.ClientAPI_ServerEntry_friendlyName_set(this.swigCPtr, this, str);
    }

    public String getFriendlyName() {
        return ovpncliJNI.ClientAPI_ServerEntry_friendlyName_get(this.swigCPtr, this);
    }

    public ClientAPI_ServerEntry() {
        this(ovpncliJNI.new_ClientAPI_ServerEntry(), true);
    }
}