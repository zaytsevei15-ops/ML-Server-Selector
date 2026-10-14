package net.openvpn.ovpn3;

/* loaded from: classes2.dex */
public class DnsOptions {
    protected transient boolean swigCMemOwn;
    private transient long swigCPtr;

    protected DnsOptions(long j, boolean z) {
        this.swigCMemOwn = z;
        this.swigCPtr = j;
    }

    protected static long getCPtr(DnsOptions dnsOptions) {
        if (dnsOptions == null) {
            return 0L;
        }
        return dnsOptions.swigCPtr;
    }

    protected static long swigRelease(DnsOptions dnsOptions) {
        if (dnsOptions == null) {
            return 0L;
        }
        if (!dnsOptions.swigCMemOwn) {
            throw new RuntimeException("Cannot release ownership as memory is not owned");
        }
        long j = dnsOptions.swigCPtr;
        dnsOptions.swigCMemOwn = false;
        dnsOptions.delete();
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
                ovpncliJNI.delete_DnsOptions(j);
            }
            this.swigCPtr = 0L;
        }
    }

    public String to_string() {
        return ovpncliJNI.DnsOptions_to_string(this.swigCPtr, this);
    }

    public void setFrom_dhcp_options(boolean z) {
        ovpncliJNI.DnsOptions_from_dhcp_options_set(this.swigCPtr, this, z);
    }

    public boolean getFrom_dhcp_options() {
        return ovpncliJNI.DnsOptions_from_dhcp_options_get(this.swigCPtr, this);
    }

    public void setSearch_domains(DnsOptions_DomainsList dnsOptions_DomainsList) {
        ovpncliJNI.DnsOptions_search_domains_set(this.swigCPtr, this, DnsOptions_DomainsList.getCPtr(dnsOptions_DomainsList), dnsOptions_DomainsList);
    }

    public DnsOptions_DomainsList getSearch_domains() {
        long DnsOptions_search_domains_get = ovpncliJNI.DnsOptions_search_domains_get(this.swigCPtr, this);
        if (DnsOptions_search_domains_get == 0) {
            return null;
        }
        return new DnsOptions_DomainsList(DnsOptions_search_domains_get, false);
    }

    public void setServers(DnsOptions_ServersMap dnsOptions_ServersMap) {
        ovpncliJNI.DnsOptions_servers_set(this.swigCPtr, this, DnsOptions_ServersMap.getCPtr(dnsOptions_ServersMap), dnsOptions_ServersMap);
    }

    public DnsOptions_ServersMap getServers() {
        long DnsOptions_servers_get = ovpncliJNI.DnsOptions_servers_get(this.swigCPtr, this);
        if (DnsOptions_servers_get == 0) {
            return null;
        }
        return new DnsOptions_ServersMap(DnsOptions_servers_get, false);
    }

    public DnsOptions() {
        this(ovpncliJNI.new_DnsOptions(), true);
    }
}