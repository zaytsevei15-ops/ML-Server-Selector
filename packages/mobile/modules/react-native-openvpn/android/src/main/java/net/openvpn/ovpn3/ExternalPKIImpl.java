package net.openvpn.ovpn3;

/* loaded from: classes2.dex */
public class ExternalPKIImpl {
    protected transient boolean swigCMemOwn;
    private transient long swigCPtr;

    protected ExternalPKIImpl(long j, boolean z) {
        this.swigCMemOwn = z;
        this.swigCPtr = j;
    }

    protected static long getCPtr(ExternalPKIImpl externalPKIImpl) {
        if (externalPKIImpl == null) {
            return 0L;
        }
        return externalPKIImpl.swigCPtr;
    }

    protected static long swigRelease(ExternalPKIImpl externalPKIImpl) {
        if (externalPKIImpl == null) {
            return 0L;
        }
        if (!externalPKIImpl.swigCMemOwn) {
            throw new RuntimeException("Cannot release ownership as memory is not owned");
        }
        long j = externalPKIImpl.swigCPtr;
        externalPKIImpl.swigCMemOwn = false;
        externalPKIImpl.delete();
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
                ovpncliJNI.delete_ExternalPKIImpl(j);
            }
            this.swigCPtr = 0L;
        }
    }

    public ExternalPKIImpl() {
        this(ovpncliJNI.new_ExternalPKIImpl(), true);
    }
}