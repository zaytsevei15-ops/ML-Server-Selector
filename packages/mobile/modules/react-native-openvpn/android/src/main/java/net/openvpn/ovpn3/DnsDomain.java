package net.openvpn.ovpn3;

/* loaded from: classes2.dex */
public class DnsDomain {
    protected transient boolean swigCMemOwn;
    private transient long swigCPtr;

    protected DnsDomain(long j, boolean z) {
        this.swigCMemOwn = z;
        this.swigCPtr = j;
    }

    protected static long getCPtr(DnsDomain dnsDomain) {
        if (dnsDomain == null) {
            return 0L;
        }
        return dnsDomain.swigCPtr;
    }

    protected static long swigRelease(DnsDomain dnsDomain) {
        if (dnsDomain == null) {
            return 0L;
        }
        if (!dnsDomain.swigCMemOwn) {
            throw new RuntimeException("Cannot release ownership as memory is not owned");
        }
        long j = dnsDomain.swigCPtr;
        dnsDomain.swigCMemOwn = false;
        dnsDomain.delete();
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
                ovpncliJNI.delete_DnsDomain(j);
            }
            this.swigCPtr = 0L;
        }
    }

    public String to_string() {
        return ovpncliJNI.DnsDomain_to_string(this.swigCPtr, this);
    }

    public void validate(String str) {
        ovpncliJNI.DnsDomain_validate(this.swigCPtr, this, str);
    }

    public void setDomain(String str) {
        ovpncliJNI.DnsDomain_domain_set(this.swigCPtr, this, str);
    }

    public String getDomain() {
        return ovpncliJNI.DnsDomain_domain_get(this.swigCPtr, this);
    }

    public DnsDomain() {
        this(ovpncliJNI.new_DnsDomain(), true);
    }
}