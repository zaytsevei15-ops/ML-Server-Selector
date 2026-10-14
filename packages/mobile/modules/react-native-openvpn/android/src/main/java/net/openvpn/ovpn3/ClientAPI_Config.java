package net.openvpn.ovpn3;

/* loaded from: classes2.dex */
public class ClientAPI_Config extends ConfigCommon {
    private transient long swigCPtr;

    protected ClientAPI_Config(long j, boolean z) {
        super(ovpncliJNI.ClientAPI_Config_SWIGUpcast(j), z);
        this.swigCPtr = j;
    }

    protected static long getCPtr(ClientAPI_Config clientAPI_Config) {
        if (clientAPI_Config == null) {
            return 0L;
        }
        return clientAPI_Config.swigCPtr;
    }

    protected static long swigRelease(ClientAPI_Config clientAPI_Config) {
        if (clientAPI_Config == null) {
            return 0L;
        }
        if (!clientAPI_Config.swigCMemOwn) {
            throw new RuntimeException("Cannot release ownership as memory is not owned");
        }
        long j = clientAPI_Config.swigCPtr;
        clientAPI_Config.swigCMemOwn = false;
        clientAPI_Config.delete();
        return j;
    }

    @Override // net.openvpn.ovpn3.ConfigCommon
    protected void finalize() {
        delete();
    }

    @Override // net.openvpn.ovpn3.ConfigCommon
    public synchronized void delete() {
        if (this.swigCPtr != 0) {
            if (this.swigCMemOwn) {
                this.swigCMemOwn = false;
                ovpncliJNI.delete_ClientAPI_Config(this.swigCPtr);
            }
            this.swigCPtr = 0L;
        }
        super.delete();
    }

    public void setContent(String str) {
        ovpncliJNI.ClientAPI_Config_content_set(this.swigCPtr, this, str);
    }

    public String getContent() {
        return ovpncliJNI.ClientAPI_Config_content_get(this.swigCPtr, this);
    }

    public void setContentList(SWIGTYPE_p_std__vectorT_openvpn__ClientAPI__KeyValue_t sWIGTYPE_p_std__vectorT_openvpn__ClientAPI__KeyValue_t) {
        ovpncliJNI.ClientAPI_Config_contentList_set(this.swigCPtr, this, SWIGTYPE_p_std__vectorT_openvpn__ClientAPI__KeyValue_t.getCPtr(sWIGTYPE_p_std__vectorT_openvpn__ClientAPI__KeyValue_t));
    }

    public SWIGTYPE_p_std__vectorT_openvpn__ClientAPI__KeyValue_t getContentList() {
        long ClientAPI_Config_contentList_get = ovpncliJNI.ClientAPI_Config_contentList_get(this.swigCPtr, this);
        if (ClientAPI_Config_contentList_get == 0) {
            return null;
        }
        return new SWIGTYPE_p_std__vectorT_openvpn__ClientAPI__KeyValue_t(ClientAPI_Config_contentList_get, false);
    }

    public void setProtoOverride(String str) {
        ovpncliJNI.ClientAPI_Config_protoOverride_set(this.swigCPtr, this, str);
    }

    public String getProtoOverride() {
        return ovpncliJNI.ClientAPI_Config_protoOverride_get(this.swigCPtr, this);
    }

    public void setProtoVersionOverride(int i) {
        ovpncliJNI.ClientAPI_Config_protoVersionOverride_set(this.swigCPtr, this, i);
    }

    public int getProtoVersionOverride() {
        return ovpncliJNI.ClientAPI_Config_protoVersionOverride_get(this.swigCPtr, this);
    }

    public void setAllowUnusedAddrFamilies(String str) {
        ovpncliJNI.ClientAPI_Config_allowUnusedAddrFamilies_set(this.swigCPtr, this, str);
    }

    public String getAllowUnusedAddrFamilies() {
        return ovpncliJNI.ClientAPI_Config_allowUnusedAddrFamilies_get(this.swigCPtr, this);
    }

    public void setCompressionMode(String str) {
        ovpncliJNI.ClientAPI_Config_compressionMode_set(this.swigCPtr, this, str);
    }

    public String getCompressionMode() {
        return ovpncliJNI.ClientAPI_Config_compressionMode_get(this.swigCPtr, this);
    }

    public void setExternalPkiAlias(String str) {
        ovpncliJNI.ClientAPI_Config_externalPkiAlias_set(this.swigCPtr, this, str);
    }

    public String getExternalPkiAlias() {
        return ovpncliJNI.ClientAPI_Config_externalPkiAlias_get(this.swigCPtr, this);
    }

    public void setPeerInfo(SWIGTYPE_p_std__vectorT_openvpn__ClientAPI__KeyValue_t sWIGTYPE_p_std__vectorT_openvpn__ClientAPI__KeyValue_t) {
        ovpncliJNI.ClientAPI_Config_peerInfo_set(this.swigCPtr, this, SWIGTYPE_p_std__vectorT_openvpn__ClientAPI__KeyValue_t.getCPtr(sWIGTYPE_p_std__vectorT_openvpn__ClientAPI__KeyValue_t));
    }

    public SWIGTYPE_p_std__vectorT_openvpn__ClientAPI__KeyValue_t getPeerInfo() {
        long ClientAPI_Config_peerInfo_get = ovpncliJNI.ClientAPI_Config_peerInfo_get(this.swigCPtr, this);
        if (ClientAPI_Config_peerInfo_get == 0) {
            return null;
        }
        return new SWIGTYPE_p_std__vectorT_openvpn__ClientAPI__KeyValue_t(ClientAPI_Config_peerInfo_get, false);
    }

    public ClientAPI_Config() {
        this(ovpncliJNI.new_ClientAPI_Config(), true);
    }
}