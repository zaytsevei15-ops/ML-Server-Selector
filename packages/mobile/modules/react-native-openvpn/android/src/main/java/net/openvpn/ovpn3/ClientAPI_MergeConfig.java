package net.openvpn.ovpn3;

/* loaded from: classes2.dex */
public class ClientAPI_MergeConfig {
    protected transient boolean swigCMemOwn;
    private transient long swigCPtr;

    protected ClientAPI_MergeConfig(long j, boolean z) {
        this.swigCMemOwn = z;
        this.swigCPtr = j;
    }

    protected static long getCPtr(ClientAPI_MergeConfig clientAPI_MergeConfig) {
        if (clientAPI_MergeConfig == null) {
            return 0L;
        }
        return clientAPI_MergeConfig.swigCPtr;
    }

    protected static long swigRelease(ClientAPI_MergeConfig clientAPI_MergeConfig) {
        if (clientAPI_MergeConfig == null) {
            return 0L;
        }
        if (!clientAPI_MergeConfig.swigCMemOwn) {
            throw new RuntimeException("Cannot release ownership as memory is not owned");
        }
        long j = clientAPI_MergeConfig.swigCPtr;
        clientAPI_MergeConfig.swigCMemOwn = false;
        clientAPI_MergeConfig.delete();
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
                ovpncliJNI.delete_ClientAPI_MergeConfig(j);
            }
            this.swigCPtr = 0L;
        }
    }

    public void setStatus(String str) {
        ovpncliJNI.ClientAPI_MergeConfig_status_set(this.swigCPtr, this, str);
    }

    public String getStatus() {
        return ovpncliJNI.ClientAPI_MergeConfig_status_get(this.swigCPtr, this);
    }

    public void setErrorText(String str) {
        ovpncliJNI.ClientAPI_MergeConfig_errorText_set(this.swigCPtr, this, str);
    }

    public String getErrorText() {
        return ovpncliJNI.ClientAPI_MergeConfig_errorText_get(this.swigCPtr, this);
    }

    public void setBasename(String str) {
        ovpncliJNI.ClientAPI_MergeConfig_basename_set(this.swigCPtr, this, str);
    }

    public String getBasename() {
        return ovpncliJNI.ClientAPI_MergeConfig_basename_get(this.swigCPtr, this);
    }

    public void setProfileContent(String str) {
        ovpncliJNI.ClientAPI_MergeConfig_profileContent_set(this.swigCPtr, this, str);
    }

    public String getProfileContent() {
        return ovpncliJNI.ClientAPI_MergeConfig_profileContent_get(this.swigCPtr, this);
    }

    public void setRefPathList(ClientAPI_StringVec clientAPI_StringVec) {
        ovpncliJNI.ClientAPI_MergeConfig_refPathList_set(this.swigCPtr, this, ClientAPI_StringVec.getCPtr(clientAPI_StringVec), clientAPI_StringVec);
    }

    public ClientAPI_StringVec getRefPathList() {
        long ClientAPI_MergeConfig_refPathList_get = ovpncliJNI.ClientAPI_MergeConfig_refPathList_get(this.swigCPtr, this);
        if (ClientAPI_MergeConfig_refPathList_get == 0) {
            return null;
        }
        return new ClientAPI_StringVec(ClientAPI_MergeConfig_refPathList_get, false);
    }

    public ClientAPI_MergeConfig() {
        this(ovpncliJNI.new_ClientAPI_MergeConfig(), true);
    }
}