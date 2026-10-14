package net.openvpn.ovpn3;

import java.util.AbstractList;
import java.util.Iterator;
import java.util.RandomAccess;

/* loaded from: classes2.dex */
public class ClientAPI_StringVec extends AbstractList<String> implements RandomAccess {
    protected transient boolean swigCMemOwn;
    private transient long swigCPtr;

    protected ClientAPI_StringVec(long j, boolean z) {
        this.swigCMemOwn = z;
        this.swigCPtr = j;
    }

    protected static long getCPtr(ClientAPI_StringVec clientAPI_StringVec) {
        if (clientAPI_StringVec == null) {
            return 0L;
        }
        return clientAPI_StringVec.swigCPtr;
    }

    protected static long swigRelease(ClientAPI_StringVec clientAPI_StringVec) {
        if (clientAPI_StringVec == null) {
            return 0L;
        }
        if (!clientAPI_StringVec.swigCMemOwn) {
            throw new RuntimeException("Cannot release ownership as memory is not owned");
        }
        long j = clientAPI_StringVec.swigCPtr;
        clientAPI_StringVec.swigCMemOwn = false;
        clientAPI_StringVec.delete();
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
                ovpncliJNI.delete_ClientAPI_StringVec(j);
            }
            this.swigCPtr = 0L;
        }
    }

    public ClientAPI_StringVec(String[] strArr) {
        this();
        reserve(strArr.length);
        for (String str : strArr) {
            add(str);
        }
    }

    public ClientAPI_StringVec(Iterable<String> iterable) {
        this();
        Iterator<String> it = iterable.iterator();
        while (it.hasNext()) {
            add(it.next());
        }
    }

    @Override // java.util.AbstractList, java.util.List
    public String get(int i) {
        return doGet(i);
    }

    @Override // java.util.AbstractList, java.util.List
    public String set(int i, String str) {
        return doSet(i, str);
    }

    @Override // java.util.AbstractList, java.util.AbstractCollection, java.util.Collection, java.util.List
    public boolean add(String str) {
        this.modCount++;
        doAdd(str);
        return true;
    }

    @Override // java.util.AbstractList, java.util.List
    public void add(int i, String str) {
        this.modCount++;
        doAdd(i, str);
    }

    @Override // java.util.AbstractList, java.util.List
    public String remove(int i) {
        this.modCount++;
        return doRemove(i);
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

    public ClientAPI_StringVec() {
        this(ovpncliJNI.new_ClientAPI_StringVec__SWIG_0(), true);
    }

    public ClientAPI_StringVec(ClientAPI_StringVec clientAPI_StringVec) {
        this(ovpncliJNI.new_ClientAPI_StringVec__SWIG_1(getCPtr(clientAPI_StringVec), clientAPI_StringVec), true);
    }

    @Override // java.util.AbstractCollection, java.util.Collection, java.util.List
    public boolean isEmpty() {
        return ovpncliJNI.ClientAPI_StringVec_isEmpty(this.swigCPtr, this);
    }

    @Override // java.util.AbstractList, java.util.AbstractCollection, java.util.Collection, java.util.List
    public void clear() {
        ovpncliJNI.ClientAPI_StringVec_clear(this.swigCPtr, this);
    }

    public ClientAPI_StringVec(int i, String str) {
        this(ovpncliJNI.new_ClientAPI_StringVec__SWIG_2(i, str), true);
    }

    private int doCapacity() {
        return ovpncliJNI.ClientAPI_StringVec_doCapacity(this.swigCPtr, this);
    }

    private void doReserve(int i) {
        ovpncliJNI.ClientAPI_StringVec_doReserve(this.swigCPtr, this, i);
    }

    private int doSize() {
        return ovpncliJNI.ClientAPI_StringVec_doSize(this.swigCPtr, this);
    }

    private void doAdd(String str) {
        ovpncliJNI.ClientAPI_StringVec_doAdd__SWIG_0(this.swigCPtr, this, str);
    }

    private void doAdd(int i, String str) {
        ovpncliJNI.ClientAPI_StringVec_doAdd__SWIG_1(this.swigCPtr, this, i, str);
    }

    private String doRemove(int i) {
        return ovpncliJNI.ClientAPI_StringVec_doRemove(this.swigCPtr, this, i);
    }

    private String doGet(int i) {
        return ovpncliJNI.ClientAPI_StringVec_doGet(this.swigCPtr, this, i);
    }

    private String doSet(int i, String str) {
        return ovpncliJNI.ClientAPI_StringVec_doSet(this.swigCPtr, this, i, str);
    }

    private void doRemoveRange(int i, int i2) {
        ovpncliJNI.ClientAPI_StringVec_doRemoveRange(this.swigCPtr, this, i, i2);
    }
}