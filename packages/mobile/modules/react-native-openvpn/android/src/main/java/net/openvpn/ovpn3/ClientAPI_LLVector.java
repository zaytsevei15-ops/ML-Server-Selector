package net.openvpn.ovpn3;

import java.util.AbstractList;
import java.util.RandomAccess;

/* loaded from: classes2.dex */
public class ClientAPI_LLVector extends AbstractList<Long> implements RandomAccess {
    protected transient boolean swigCMemOwn;
    private transient long swigCPtr;

    protected ClientAPI_LLVector(long j, boolean z) {
        this.swigCMemOwn = z;
        this.swigCPtr = j;
    }

    protected static long getCPtr(ClientAPI_LLVector clientAPI_LLVector) {
        if (clientAPI_LLVector == null) {
            return 0L;
        }
        return clientAPI_LLVector.swigCPtr;
    }

    protected static long swigRelease(ClientAPI_LLVector clientAPI_LLVector) {
        if (clientAPI_LLVector == null) {
            return 0L;
        }
        if (!clientAPI_LLVector.swigCMemOwn) {
            throw new RuntimeException("Cannot release ownership as memory is not owned");
        }
        long j = clientAPI_LLVector.swigCPtr;
        clientAPI_LLVector.swigCMemOwn = false;
        clientAPI_LLVector.delete();
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
                ovpncliJNI.delete_ClientAPI_LLVector(j);
            }
            this.swigCPtr = 0L;
        }
    }

    public ClientAPI_LLVector(long[] jArr) {
        this();
        reserve(jArr.length);
        for (long j : jArr) {
            add(Long.valueOf(j));
        }
    }

    public ClientAPI_LLVector(Iterable<Long> iterable) {
        this();
        for (Long l : iterable) {
            l.longValue();
            add(l);
        }
    }

    @Override // java.util.AbstractList, java.util.List
    public Long get(int i) {
        return Long.valueOf(doGet(i));
    }

    @Override // java.util.AbstractList, java.util.List
    public Long set(int i, Long l) {
        return Long.valueOf(doSet(i, l.longValue()));
    }

    @Override // java.util.AbstractList, java.util.AbstractCollection, java.util.Collection, java.util.List
    public boolean add(Long l) {
        this.modCount++;
        doAdd(l.longValue());
        return true;
    }

    @Override // java.util.AbstractList, java.util.List
    public void add(int i, Long l) {
        this.modCount++;
        doAdd(i, l.longValue());
    }

    @Override // java.util.AbstractList, java.util.List
    public Long remove(int i) {
        this.modCount++;
        return Long.valueOf(doRemove(i));
    }

    @Override // java.util.AbstractList
    protected void removeRange(int i, int i2) {
        this.modCount++;
        doRemoveRange(i, i2);
    }

    @Override // java.util.AbstractCollection, java.util.Collection, java.util.List
    public int size() {
        return doSize();
    }

    public int capacity() {
        return doCapacity();
    }

    public void reserve(int i) {
        doReserve(i);
    }

    public ClientAPI_LLVector() {
        this(ovpncliJNI.new_ClientAPI_LLVector__SWIG_0(), true);
    }

    public ClientAPI_LLVector(ClientAPI_LLVector clientAPI_LLVector) {
        this(ovpncliJNI.new_ClientAPI_LLVector__SWIG_1(getCPtr(clientAPI_LLVector), clientAPI_LLVector), true);
    }

    @Override // java.util.AbstractCollection, java.util.Collection, java.util.List
    public boolean isEmpty() {
        return ovpncliJNI.ClientAPI_LLVector_isEmpty(this.swigCPtr, this);
    }

    @Override // java.util.AbstractList, java.util.AbstractCollection, java.util.Collection, java.util.List
    public void clear() {
        ovpncliJNI.ClientAPI_LLVector_clear(this.swigCPtr, this);
    }

    public ClientAPI_LLVector(int i, long j) {
        this(ovpncliJNI.new_ClientAPI_LLVector__SWIG_2(i, j), true);
    }

    private int doCapacity() {
        return ovpncliJNI.ClientAPI_LLVector_doCapacity(this.swigCPtr, this);
    }

    private void doReserve(int i) {
        ovpncliJNI.ClientAPI_LLVector_doReserve(this.swigCPtr, this, i);
    }

    private int doSize() {
        return ovpncliJNI.ClientAPI_LLVector_doSize(this.swigCPtr, this);
    }

    private void doAdd(long j) {
        ovpncliJNI.ClientAPI_LLVector_doAdd__SWIG_0(this.swigCPtr, this, j);
    }

    private void doAdd(int i, long j) {
        ovpncliJNI.ClientAPI_LLVector_doAdd__SWIG_1(this.swigCPtr, this, i, j);
    }

    private long doRemove(int i) {
        return ovpncliJNI.ClientAPI_LLVector_doRemove(this.swigCPtr, this, i);
    }

    private long doGet(int i) {
        return ovpncliJNI.ClientAPI_LLVector_doGet(this.swigCPtr, this, i);
    }

    private long doSet(int i, long j) {
        return ovpncliJNI.ClientAPI_LLVector_doSet(this.swigCPtr, this, i, j);
    }

    private void doRemoveRange(int i, int i2) {
        ovpncliJNI.ClientAPI_LLVector_doRemoveRange(this.swigCPtr, this, i, i2);
    }
}