package net.openvpn.ovpn3;

/* loaded from: classes2.dex */
public class ConfigCommon {
    protected transient boolean swigCMemOwn;
    private transient long swigCPtr;

    protected ConfigCommon(long j, boolean z) {
        this.swigCMemOwn = z;
        this.swigCPtr = j;
    }

    protected static long getCPtr(ConfigCommon configCommon) {
        if (configCommon == null) {
            return 0L;
        }
        return configCommon.swigCPtr;
    }

    protected static long swigRelease(ConfigCommon configCommon) {
        if (configCommon == null) {
            return 0L;
        }
        if (!configCommon.swigCMemOwn) {
            throw new RuntimeException("Cannot release ownership as memory is not owned");
        }
        long j = configCommon.swigCPtr;
        configCommon.swigCMemOwn = false;
        configCommon.delete();
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
                ovpncliJNI.delete_ConfigCommon(j);
            }
            this.swigCPtr = 0L;
        }
    }

    public void setGuiVersion(String str) {
        ovpncliJNI.ConfigCommon_guiVersion_set(this.swigCPtr, this, str);
    }

    public String getGuiVersion() {
        return ovpncliJNI.ConfigCommon_guiVersion_get(this.swigCPtr, this);
    }

    public void setSsoMethods(String str) {
        ovpncliJNI.ConfigCommon_ssoMethods_set(this.swigCPtr, this, str);
    }

    public String getSsoMethods() {
        return ovpncliJNI.ConfigCommon_ssoMethods_get(this.swigCPtr, this);
    }

    public void setAppCustomProtocols(String str) {
        ovpncliJNI.ConfigCommon_appCustomProtocols_set(this.swigCPtr, this, str);
    }

    public String getAppCustomProtocols() {
        return ovpncliJNI.ConfigCommon_appCustomProtocols_get(this.swigCPtr, this);
    }

    public void setHwAddrOverride(String str) {
        ovpncliJNI.ConfigCommon_hwAddrOverride_set(this.swigCPtr, this, str);
    }

    public String getHwAddrOverride() {
        return ovpncliJNI.ConfigCommon_hwAddrOverride_get(this.swigCPtr, this);
    }

    public void setPlatformVersion(String str) {
        ovpncliJNI.ConfigCommon_platformVersion_set(this.swigCPtr, this, str);
    }

    public String getPlatformVersion() {
        return ovpncliJNI.ConfigCommon_platformVersion_get(this.swigCPtr, this);
    }

    public void setServerOverride(String str) {
        ovpncliJNI.ConfigCommon_serverOverride_set(this.swigCPtr, this, str);
    }

    public String getServerOverride() {
        return ovpncliJNI.ConfigCommon_serverOverride_get(this.swigCPtr, this);
    }

    public void setPortOverride(String str) {
        ovpncliJNI.ConfigCommon_portOverride_set(this.swigCPtr, this, str);
    }

    public String getPortOverride() {
        return ovpncliJNI.ConfigCommon_portOverride_get(this.swigCPtr, this);
    }

    public void setConnTimeout(int i) {
        ovpncliJNI.ConfigCommon_connTimeout_set(this.swigCPtr, this, i);
    }

    public int getConnTimeout() {
        return ovpncliJNI.ConfigCommon_connTimeout_get(this.swigCPtr, this);
    }

    public void setTunPersist(boolean z) {
        ovpncliJNI.ConfigCommon_tunPersist_set(this.swigCPtr, this, z);
    }

    public boolean getTunPersist() {
        return ovpncliJNI.ConfigCommon_tunPersist_get(this.swigCPtr, this);
    }

    public void setGoogleDnsFallback(boolean z) {
        ovpncliJNI.ConfigCommon_googleDnsFallback_set(this.swigCPtr, this, z);
    }

    public boolean getGoogleDnsFallback() {
        return ovpncliJNI.ConfigCommon_googleDnsFallback_get(this.swigCPtr, this);
    }

    public void setDhcpSearchDomainsAsSplitDomains(boolean z) {
        ovpncliJNI.ConfigCommon_dhcpSearchDomainsAsSplitDomains_set(this.swigCPtr, this, z);
    }

    public boolean getDhcpSearchDomainsAsSplitDomains() {
        return ovpncliJNI.ConfigCommon_dhcpSearchDomainsAsSplitDomains_get(this.swigCPtr, this);
    }

    public void setSynchronousDnsLookup(boolean z) {
        ovpncliJNI.ConfigCommon_synchronousDnsLookup_set(this.swigCPtr, this, z);
    }

    public boolean getSynchronousDnsLookup() {
        return ovpncliJNI.ConfigCommon_synchronousDnsLookup_get(this.swigCPtr, this);
    }

    public void setAutologinSessions(boolean z) {
        ovpncliJNI.ConfigCommon_autologinSessions_set(this.swigCPtr, this, z);
    }

    public boolean getAutologinSessions() {
        return ovpncliJNI.ConfigCommon_autologinSessions_get(this.swigCPtr, this);
    }

    public void setRetryOnAuthFailed(boolean z) {
        ovpncliJNI.ConfigCommon_retryOnAuthFailed_set(this.swigCPtr, this, z);
    }

    public boolean getRetryOnAuthFailed() {
        return ovpncliJNI.ConfigCommon_retryOnAuthFailed_get(this.swigCPtr, this);
    }

    public void setDisableClientCert(boolean z) {
        ovpncliJNI.ConfigCommon_disableClientCert_set(this.swigCPtr, this, z);
    }

    public boolean getDisableClientCert() {
        return ovpncliJNI.ConfigCommon_disableClientCert_get(this.swigCPtr, this);
    }

    public void setSslDebugLevel(int i) {
        ovpncliJNI.ConfigCommon_sslDebugLevel_set(this.swigCPtr, this, i);
    }

    public int getSslDebugLevel() {
        return ovpncliJNI.ConfigCommon_sslDebugLevel_get(this.swigCPtr, this);
    }

    public void setPrivateKeyPassword(String str) {
        ovpncliJNI.ConfigCommon_privateKeyPassword_set(this.swigCPtr, this, str);
    }

    public String getPrivateKeyPassword() {
        return ovpncliJNI.ConfigCommon_privateKeyPassword_get(this.swigCPtr, this);
    }

    public void setDefaultKeyDirection(int i) {
        ovpncliJNI.ConfigCommon_defaultKeyDirection_set(this.swigCPtr, this, i);
    }

    public int getDefaultKeyDirection() {
        return ovpncliJNI.ConfigCommon_defaultKeyDirection_get(this.swigCPtr, this);
    }

    public void setTlsVersionMinOverride(String str) {
        ovpncliJNI.ConfigCommon_tlsVersionMinOverride_set(this.swigCPtr, this, str);
    }

    public String getTlsVersionMinOverride() {
        return ovpncliJNI.ConfigCommon_tlsVersionMinOverride_get(this.swigCPtr, this);
    }

    public void setTlsCertProfileOverride(String str) {
        ovpncliJNI.ConfigCommon_tlsCertProfileOverride_set(this.swigCPtr, this, str);
    }

    public String getTlsCertProfileOverride() {
        return ovpncliJNI.ConfigCommon_tlsCertProfileOverride_get(this.swigCPtr, this);
    }

    public void setTlsCipherList(String str) {
        ovpncliJNI.ConfigCommon_tlsCipherList_set(this.swigCPtr, this, str);
    }

    public String getTlsCipherList() {
        return ovpncliJNI.ConfigCommon_tlsCipherList_get(this.swigCPtr, this);
    }

    public void setTlsCiphersuitesList(String str) {
        ovpncliJNI.ConfigCommon_tlsCiphersuitesList_set(this.swigCPtr, this, str);
    }

    public String getTlsCiphersuitesList() {
        return ovpncliJNI.ConfigCommon_tlsCiphersuitesList_get(this.swigCPtr, this);
    }

    public void setProxyHost(String str) {
        ovpncliJNI.ConfigCommon_proxyHost_set(this.swigCPtr, this, str);
    }

    public String getProxyHost() {
        return ovpncliJNI.ConfigCommon_proxyHost_get(this.swigCPtr, this);
    }

    public void setProxyPort(String str) {
        ovpncliJNI.ConfigCommon_proxyPort_set(this.swigCPtr, this, str);
    }

    public String getProxyPort() {
        return ovpncliJNI.ConfigCommon_proxyPort_get(this.swigCPtr, this);
    }

    public void setProxyUsername(String str) {
        ovpncliJNI.ConfigCommon_proxyUsername_set(this.swigCPtr, this, str);
    }

    public String getProxyUsername() {
        return ovpncliJNI.ConfigCommon_proxyUsername_get(this.swigCPtr, this);
    }

    public void setProxyPassword(String str) {
        ovpncliJNI.ConfigCommon_proxyPassword_set(this.swigCPtr, this, str);
    }

    public String getProxyPassword() {
        return ovpncliJNI.ConfigCommon_proxyPassword_get(this.swigCPtr, this);
    }

    public void setProxyAllowCleartextAuth(boolean z) {
        ovpncliJNI.ConfigCommon_proxyAllowCleartextAuth_set(this.swigCPtr, this, z);
    }

    public boolean getProxyAllowCleartextAuth() {
        return ovpncliJNI.ConfigCommon_proxyAllowCleartextAuth_get(this.swigCPtr, this);
    }

    public void setAltProxy(boolean z) {
        ovpncliJNI.ConfigCommon_altProxy_set(this.swigCPtr, this, z);
    }

    public boolean getAltProxy() {
        return ovpncliJNI.ConfigCommon_altProxy_get(this.swigCPtr, this);
    }

    public void setDco(boolean z) {
        ovpncliJNI.ConfigCommon_dco_set(this.swigCPtr, this, z);
    }

    public boolean getDco() {
        return ovpncliJNI.ConfigCommon_dco_get(this.swigCPtr, this);
    }

    public void setEcho(boolean z) {
        ovpncliJNI.ConfigCommon_echo_set(this.swigCPtr, this, z);
    }

    public boolean getEcho() {
        return ovpncliJNI.ConfigCommon_echo_get(this.swigCPtr, this);
    }

    public void setInfo(boolean z) {
        ovpncliJNI.ConfigCommon_info_set(this.swigCPtr, this, z);
    }

    public boolean getInfo() {
        return ovpncliJNI.ConfigCommon_info_get(this.swigCPtr, this);
    }

    public void setAllowLocalLanAccess(boolean z) {
        ovpncliJNI.ConfigCommon_allowLocalLanAccess_set(this.swigCPtr, this, z);
    }

    public boolean getAllowLocalLanAccess() {
        return ovpncliJNI.ConfigCommon_allowLocalLanAccess_get(this.swigCPtr, this);
    }

    public void setEnableRouteEmulation(boolean z) {
        ovpncliJNI.ConfigCommon_enableRouteEmulation_set(this.swigCPtr, this, z);
    }

    public boolean getEnableRouteEmulation() {
        return ovpncliJNI.ConfigCommon_enableRouteEmulation_get(this.swigCPtr, this);
    }

    public void setClockTickMS(long j) {
        ovpncliJNI.ConfigCommon_clockTickMS_set(this.swigCPtr, this, j);
    }

    public long getClockTickMS() {
        return ovpncliJNI.ConfigCommon_clockTickMS_get(this.swigCPtr, this);
    }

    public void setGremlinConfig(String str) {
        ovpncliJNI.ConfigCommon_gremlinConfig_set(this.swigCPtr, this, str);
    }

    public String getGremlinConfig() {
        return ovpncliJNI.ConfigCommon_gremlinConfig_get(this.swigCPtr, this);
    }

    public void setWintun(boolean z) {
        ovpncliJNI.ConfigCommon_wintun_set(this.swigCPtr, this, z);
    }

    public boolean getWintun() {
        return ovpncliJNI.ConfigCommon_wintun_get(this.swigCPtr, this);
    }

    public void setAllowLocalDnsResolvers(boolean z) {
        ovpncliJNI.ConfigCommon_allowLocalDnsResolvers_set(this.swigCPtr, this, z);
    }

    public boolean getAllowLocalDnsResolvers() {
        return ovpncliJNI.ConfigCommon_allowLocalDnsResolvers_get(this.swigCPtr, this);
    }

    public void setEnableLegacyAlgorithms(boolean z) {
        ovpncliJNI.ConfigCommon_enableLegacyAlgorithms_set(this.swigCPtr, this, z);
    }

    public boolean getEnableLegacyAlgorithms() {
        return ovpncliJNI.ConfigCommon_enableLegacyAlgorithms_get(this.swigCPtr, this);
    }

    public void setEnableNonPreferredDCAlgorithms(boolean z) {
        ovpncliJNI.ConfigCommon_enableNonPreferredDCAlgorithms_set(this.swigCPtr, this, z);
    }

    public boolean getEnableNonPreferredDCAlgorithms() {
        return ovpncliJNI.ConfigCommon_enableNonPreferredDCAlgorithms_get(this.swigCPtr, this);
    }

    public void setGenerateTunBuilderCaptureEvent(boolean z) {
        ovpncliJNI.ConfigCommon_generateTunBuilderCaptureEvent_set(this.swigCPtr, this, z);
    }

    public boolean getGenerateTunBuilderCaptureEvent() {
        return ovpncliJNI.ConfigCommon_generateTunBuilderCaptureEvent_get(this.swigCPtr, this);
    }

    public ConfigCommon() {
        this(ovpncliJNI.new_ConfigCommon(), true);
    }
}