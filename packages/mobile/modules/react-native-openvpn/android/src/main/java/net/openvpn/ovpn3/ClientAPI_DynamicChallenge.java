package net.openvpn.ovpn3;

/* loaded from: classes2.dex */
public class ClientAPI_DynamicChallenge {
    protected transient boolean swigCMemOwn;
    private transient long swigCPtr;

    protected ClientAPI_DynamicChallenge(long j, boolean z) {
        this.swigCMemOwn = z;
        this.swigCPtr = j;
    }

    protected static long getCPtr(ClientAPI_DynamicChallenge clientAPI_DynamicChallenge) {
        if (clientAPI_DynamicChallenge == null) {
            return 0L;
        }
        return clientAPI_DynamicChallenge.swigCPtr;
    }

    protected static long swigRelease(ClientAPI_DynamicChallenge clientAPI_DynamicChallenge) {
        if (clientAPI_DynamicChallenge == null) {
            return 0L;
        }
        if (!clientAPI_DynamicChallenge.swigCMemOwn) {
            throw new RuntimeException("Cannot release ownership as memory is not owned");
        }
        long j = clientAPI_DynamicChallenge.swigCPtr;
        clientAPI_DynamicChallenge.swigCMemOwn = false;
        clientAPI_DynamicChallenge.delete();
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
                ovpncliJNI.delete_ClientAPI_DynamicChallenge(j);
            }
            this.swigCPtr = 0L;
        }
    }

    public void setChallenge(String str) {
        ovpncliJNI.ClientAPI_DynamicChallenge_challenge_set(this.swigCPtr, this, str);
    }

    public String getChallenge() {
        return ovpncliJNI.ClientAPI_DynamicChallenge_challenge_get(this.swigCPtr, this);
    }

    public void setEcho(boolean z) {
        ovpncliJNI.ClientAPI_DynamicChallenge_echo_set(this.swigCPtr, this, z);
    }

    public boolean getEcho() {
        return ovpncliJNI.ClientAPI_DynamicChallenge_echo_get(this.swigCPtr, this);
    }

    public void setResponseRequired(boolean z) {
        ovpncliJNI.ClientAPI_DynamicChallenge_responseRequired_set(this.swigCPtr, this, z);
    }

    public boolean getResponseRequired() {
        return ovpncliJNI.ClientAPI_DynamicChallenge_responseRequired_get(this.swigCPtr, this);
    }

    public void setStateID(String str) {
        ovpncliJNI.ClientAPI_DynamicChallenge_stateID_set(this.swigCPtr, this, str);
    }

    public String getStateID() {
        return ovpncliJNI.ClientAPI_DynamicChallenge_stateID_get(this.swigCPtr, this);
    }

    public ClientAPI_DynamicChallenge() {
        this(ovpncliJNI.new_ClientAPI_DynamicChallenge(), true);
    }
}