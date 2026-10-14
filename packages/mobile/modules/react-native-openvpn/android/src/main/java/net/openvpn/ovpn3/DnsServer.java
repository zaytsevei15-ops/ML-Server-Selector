package net.openvpn.ovpn3;

/* loaded from: classes2.dex */
public class DnsServer {
    protected transient boolean swigCMemOwn;
    private transient long swigCPtr;

    protected DnsServer(long j, boolean z) {
        this.swigCMemOwn = z;
        this.swigCPtr = j;
    }

    protected static long getCPtr(DnsServer dnsServer) {
        if (dnsServer == null) {
            return 0L;
        }
        return dnsServer.swigCPtr;
    }

    protected static long swigRelease(DnsServer dnsServer) {
        if (dnsServer == null) {
            return 0L;
        }
        if (!dnsServer.swigCMemOwn) {
            throw new RuntimeException("Cannot release ownership as memory is not owned");
        }
        long j = dnsServer.swigCPtr;
        dnsServer.swigCMemOwn = false;
        dnsServer.delete();
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
                ovpncliJNI.delete_DnsServer(j);
            }
            this.swigCPtr = 0L;
        }
    }

    public String dnssec_string(Security security) {
        return ovpncliJNI.DnsServer_dnssec_string(this.swigCPtr, this, security.swigValue());
    }

    public String transport_string(Transport transport) {
        return ovpncliJNI.DnsServer_transport_string(this.swigCPtr, this, transport.swigValue());
    }

    public String to_string(String str) {
        return ovpncliJNI.DnsServer_to_string__SWIG_0(this.swigCPtr, this, str);
    }

    public String to_string() {
        return ovpncliJNI.DnsServer_to_string__SWIG_1(this.swigCPtr, this);
    }

    public void setAddresses(DnsOptions_AddressList dnsOptions_AddressList) {
        ovpncliJNI.DnsServer_addresses_set(this.swigCPtr, this, DnsOptions_AddressList.getCPtr(dnsOptions_AddressList), dnsOptions_AddressList);
    }

    public DnsOptions_AddressList getAddresses() {
        long DnsServer_addresses_get = ovpncliJNI.DnsServer_addresses_get(this.swigCPtr, this);
        if (DnsServer_addresses_get == 0) {
            return null;
        }
        return new DnsOptions_AddressList(DnsServer_addresses_get, false);
    }

    public void setDomains(DnsOptions_DomainsList dnsOptions_DomainsList) {
        ovpncliJNI.DnsServer_domains_set(this.swigCPtr, this, DnsOptions_DomainsList.getCPtr(dnsOptions_DomainsList), dnsOptions_DomainsList);
    }

    public DnsOptions_DomainsList getDomains() {
        long DnsServer_domains_get = ovpncliJNI.DnsServer_domains_get(this.swigCPtr, this);
        if (DnsServer_domains_get == 0) {
            return null;
        }
        return new DnsOptions_DomainsList(DnsServer_domains_get, false);
    }

    public void setDnssec(Security security) {
        ovpncliJNI.DnsServer_dnssec_set(this.swigCPtr, this, security.swigValue());
    }

    public Security getDnssec() {
        return Security.swigToEnum(ovpncliJNI.DnsServer_dnssec_get(this.swigCPtr, this));
    }

    public void setTransport(Transport transport) {
        ovpncliJNI.DnsServer_transport_set(this.swigCPtr, this, transport.swigValue());
    }

    public Transport getTransport() {
        return Transport.swigToEnum(ovpncliJNI.DnsServer_transport_get(this.swigCPtr, this));
    }

    public void setSni(String str) {
        ovpncliJNI.DnsServer_sni_set(this.swigCPtr, this, str);
    }

    public String getSni() {
        return ovpncliJNI.DnsServer_sni_get(this.swigCPtr, this);
    }

    public DnsServer() {
        this(ovpncliJNI.new_DnsServer(), true);
    }

    public static final class Security {
        public static final Security No;
        public static final Security Optional;
        public static final Security Unset;
        public static final Security Yes;
        private static int swigNext;
        private static Security[] swigValues;
        private final String swigName;
        private final int swigValue;

        static {
            Security security = new Security("Unset");
            Unset = security;
            Security security2 = new Security("No");
            No = security2;
            Security security3 = new Security("Yes");
            Yes = security3;
            Security security4 = new Security("Optional");
            Optional = security4;
            swigValues = new Security[]{security, security2, security3, security4};
            swigNext = 0;
        }

        public final int swigValue() {
            return this.swigValue;
        }

        public String toString() {
            return this.swigName;
        }

        public static Security swigToEnum(int i) {
            Security[] securityArr = swigValues;
            if (i < securityArr.length && i >= 0) {
                Security security = securityArr[i];
                if (security.swigValue == i) {
                    return security;
                }
            }
            int i2 = 0;
            while (true) {
                Security[] securityArr2 = swigValues;
                if (i2 < securityArr2.length) {
                    Security security2 = securityArr2[i2];
                    if (security2.swigValue == i) {
                        return security2;
                    }
                    i2++;
                } else {
                    throw new IllegalArgumentException("No enum " + Security.class + " with value " + i);
                }
            }
        }

        private Security(String str) {
            this.swigName = str;
            int i = swigNext;
            swigNext = i + 1;
            this.swigValue = i;
        }

        private Security(String str, int i) {
            this.swigName = str;
            this.swigValue = i;
            swigNext = i + 1;
        }

        private Security(String str, Security security) {
            this.swigName = str;
            int i = security.swigValue;
            this.swigValue = i;
            swigNext = i + 1;
        }
    }

    public static final class Transport {
        public static final Transport HTTPS;
        public static final Transport Plain;
        public static final Transport TLS;
        public static final Transport Unset;
        private static int swigNext;
        private static Transport[] swigValues;
        private final String swigName;
        private final int swigValue;

        static {
            Transport transport = new Transport("Unset");
            Unset = transport;
            Transport transport2 = new Transport("Plain");
            Plain = transport2;
            Transport transport3 = new Transport("HTTPS");
            HTTPS = transport3;
            Transport transport4 = new Transport("TLS");
            TLS = transport4;
            swigValues = new Transport[]{transport, transport2, transport3, transport4};
            swigNext = 0;
        }

        public final int swigValue() {
            return this.swigValue;
        }

        public String toString() {
            return this.swigName;
        }

        public static Transport swigToEnum(int i) {
            Transport[] transportArr = swigValues;
            if (i < transportArr.length && i >= 0) {
                Transport transport = transportArr[i];
                if (transport.swigValue == i) {
                    return transport;
                }
            }
            int i2 = 0;
            while (true) {
                Transport[] transportArr2 = swigValues;
                if (i2 < transportArr2.length) {
                    Transport transport2 = transportArr2[i2];
                    if (transport2.swigValue == i) {
                        return transport2;
                    }
                    i2++;
                } else {
                    throw new IllegalArgumentException("No enum " + Transport.class + " with value " + i);
                }
            }
        }

        private Transport(String str) {
            this.swigName = str;
            int i = swigNext;
            swigNext = i + 1;
            this.swigValue = i;
        }

        private Transport(String str, int i) {
            this.swigName = str;
            this.swigValue = i;
            swigNext = i + 1;
        }

        private Transport(String str, Transport transport) {
            this.swigName = str;
            int i = transport.swigValue;
            this.swigValue = i;
            swigNext = i + 1;
        }
    }
}