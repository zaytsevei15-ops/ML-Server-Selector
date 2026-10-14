package net.openvpn.ovpn3;

import java.util.AbstractList;
import java.util.Iterator;
import java.util.RandomAccess;

/* loaded from: classes2.dex */
public class ClientAPI_ServerEntryVector extends AbstractList<ClientAPI_ServerEntry> implements RandomAccess {
    protected transient boolean swigCMemOwn;
    private transient long swigCPtr;

    protected ClientAPI_ServerEntryVector(long j, boolean z) {
        this.swigCMemOwn = z;
        this.swigCPtr = j;
    }

    protected static long getCPtr(ClientAPI_ServerEntryVector clientAPI_ServerEntryVector) {
        if (clientAPI_ServerEntryVector == null) {
            return 0L;
        }
        return clientAPI_ServerEntryVector.swigCPtr;
    }

    protected static long swigRelease(ClientAPI_ServerEntryVector clientAPI_ServerEntryVector) {
        if (clientAPI_ServerEntryVector == null) {
            return 0L;
        }
        if (!clientAPI_ServerEntryVector.swigCMemOwn) {
            throw new RuntimeException("Cannot release ownership as memory is not owned");
        }
        long j = clientAPI_ServerEntryVector.swigCPtr;
        clientAPI_ServerEntryVector.swigCMemOwn = false;
        clientAPI_ServerEntryVector.delete();
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
                ovpncliJNI.delete_ClientAPI_ServerEntryVector(j);
            }
            this.swigCPtr = 0L;
        }
    }

    public ClientAPI_ServerEntryVector(ClientAPI_ServerEntry[] clientAPI_ServerEntryArr) {
        this();
        reserve(clientAPI_ServerEntryArr.length);
        for (ClientAPI_ServerEntry clientAPI_ServerEntry : clientAPI_ServerEntryArr) {
            add(clientAPI_ServerEntry);
        }
    }

    public ClientAPI_ServerEntryVector(Iterable<ClientAPI_ServerEntry> iterable) {
        this();
        Iterator<ClientAPI_ServerEntry> it = iterable.iterator();
        while (it.hasNext()) {
            add(it.next());
        }
    }

    @Override // java.util.AbstractList, java.util.List
    public ClientAPI_ServerEntry get(int i) {
        return doGet(i);
    }

    @Override // java.util.AbstractList, java.util.List
    public ClientAPI_ServerEntry set(int i, ClientAPI_ServerEntry clientAPI_ServerEntry) {
        return doSet(i, clientAPI_ServerEntry);
    }

    @Override // java.util.AbstractList, java.util.AbstractCollection, java.util.Collection, java.util.List
    public boolean add(ClientAPI_ServerEntry clientAPI_ServerEntry) {
        this.modCount++;
        doAdd(clientAPI_ServerEntry);
        return true;
    }

    @Override // java.util.AbstractList, java.util.List
    public void add(int i, ClientAPI_ServerEntry clientAPI_ServerEntry) {
        this.modCount++;
        doAdd(i, clientAPI_ServerEntry);
    }

    @Override // java.util.AbstractList, java.util.List
    public ClientAPI_ServerEntry remove(int i) {
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

    public ClientAPI_ServerEntryVector() {
        this(ovpncliJNI.new_ClientAPI_ServerEntryVector__SWIG_0(), true);
    }

    public ClientAPI_ServerEntryVector(ClientAPI_ServerEntryVector clientAPI_ServerEntryVector) {
        this(ovpncliJNI.new_ClientAPI_ServerEntryVector__SWIG_1(getCPtr(clientAPI_ServerEntryVector), clientAPI_ServerEntryVector), true);
    }

    @Override // java.util.AbstractCollection, java.util.Collection, java.util.List
    public boolean isEmpty() {
        return ovpncliJNI.ClientAPI_ServerEntryVector_isEmpty(this.swigCPtr, this);
    }

    @Override // java.util.AbstractList, java.util.AbstractCollection, java.util.Collection, java.util.List
    public void clear() {
        ovpncliJNI.ClientAPI_ServerEntryVector_clear(this.swigCPtr, this);
    }

    public ClientAPI_ServerEntryVector(int i, ClientAPI_ServerEntry clientAPI_ServerEntry) {
        this(ovpncliJNI.new_ClientAPI_ServerEntryVector__SWIG_2(i, ClientAPI_ServerEntry.getCPtr(clientAPI_ServerEntry), clientAPI_ServerEntry), true);
    }

    private int doCapacity() {
        return ovpncliJNI.ClientAPI_ServerEntryVector_doCapacity(this.swigCPtr, this);
    }

    private void doReserve(int i) {
        ovpncliJNI.ClientAPI_ServerEntryVector_doReserve(this.swigCPtr, this, i);
    }

    private int doSize() {
        return ovpncliJNI.ClientAPI_ServerEntryVector_doSize(this.swigCPtr, this);
    }

    private void doAdd(ClientAPI_ServerEntry clientAPI_ServerEntry) {
        ovpncliJNI.ClientAPI_ServerEntryVector_doAdd__SWIG_0(this.swigCPtr, this, ClientAPI_ServerEntry.getCPtr(clientAPI_ServerEntry), clientAPI_ServerEntry);
    }

    private void doAdd(int i, ClientAPI_ServerEntry clientAPI_ServerEntry) {
        ovpncliJNI.ClientAPI_ServerEntryVector_doAdd__SWIG_1(this.swigCPtr, this, i, ClientAPI_ServerEntry.getCPtr(clientAPI_ServerEntry), clientAPI_ServerEntry);
    }

    private ClientAPI_ServerEntry doRemove(int i) {
        return new ClientAPI_ServerEntry(ovpncliJNI.ClientAPI_ServerEntryVector_doRemove(this.swigCPtr, this, i), true);
    }

    private ClientAPI_ServerEntry doGet(int i) {
        return new ClientAPI_ServerEntry(ovpncliJNI.ClientAPI_ServerEntryVector_doGet(this.swigCPtr, this, i), false);
    }

    private ClientAPI_ServerEntry doSet(int i, ClientAPI_ServerEntry clientAPI_ServerEntry) {
        return new ClientAPI_ServerEntry(ovpncliJNI.ClientAPI_ServerEntryVector_doSet(this.swigCPtr, this, i, ClientAPI_ServerEntry.getCPtr(clientAPI_ServerEntry), clientAPI_ServerEntry), true);
    }

    private void doRemoveRange(int i, int i2) {
        ovpncliJNI.ClientAPI_ServerEntryVector_doRemoveRange(this.swigCPtr, this, i, i2);
    }
}