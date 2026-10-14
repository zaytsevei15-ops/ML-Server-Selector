package net.openvpn.ovpn3;

/* loaded from: classes2.dex */
public class DnsAddress {
    protected transient boolean swigCMemOwn;
    private transient long swigCPtr;

    protected DnsAddress(long j, boolean z) {
        this.swigCMemOwn = z;
        this.swigCPtr = j;
    }

    protected static long getCPtr(DnsAddress dnsAddress) {
        if (dnsAddress == null) {
            return 0L;
        }
        return dnsAddress.swigCPtr;
    }

    protected static long swigRelease(DnsAddress dnsAddress) {
        if (dnsAddress == null) {
            return 0L;
        }
        if (!dnsAddress.swigCMemOwn) {
            throw new RuntimeException("Cannot release ownership as memory is not owned");
        }
        long j = dnsAddress.swigCPtr;
        dnsAddress.swigCMemOwn = false;
        dnsAddress.delete();
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
                ovpncliJNI.delete_DnsAddress(j);
            }
            this.swigCPtr = 0L;
        }
    }

    public String to_string() {
        return ovpncliJNI.DnsAddress_to_string(this.swigCPtr, this);
    }

    public void validate(String str) {
        ovpncliJNI.DnsAddress_validate(this.swigCPtr, this, str);
    }

    public void setAddress(String str) {
        ovpncliJNI.DnsAddress_address_set(this.swigCPtr, this, str);
    }

    public String getAddress() {
        return ovpncliJNI.DnsAddress_address_get(this.swigCPtr, this);
    }

    public void setPort(long j) {
        ovpncliJNI.DnsAddress_port_set(this.swigCPtr, this, j);
    }

    public long getPort() {
        return ovpncliJNI.DnsAddress_port_get(this.swigCPtr, this);
    }

    public DnsAddress() {
        this(ovpncliJNI.new_DnsAddress(), true);
    }
}