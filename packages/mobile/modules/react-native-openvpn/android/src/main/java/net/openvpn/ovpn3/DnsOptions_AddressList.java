package net.openvpn.ovpn3;

import java.util.AbstractList;
import java.util.Iterator;
import java.util.RandomAccess;

/* loaded from: classes2.dex */
public class DnsOptions_AddressList extends AbstractList<DnsAddress> implements RandomAccess {
    protected transient boolean swigCMemOwn;
    private transient long swigCPtr;

    protected DnsOptions_AddressList(long j, boolean z) {
        this.swigCMemOwn = z;
        this.swigCPtr = j;
    }

    protected static long getCPtr(DnsOptions_AddressList dnsOptions_AddressList) {
        if (dnsOptions_AddressList == null) {
            return 0L;
        }
        return dnsOptions_AddressList.swigCPtr;
    }

    protected static long swigRelease(DnsOptions_AddressList dnsOptions_AddressList) {
        if (dnsOptions_AddressList == null) {
            return 0L;
        }
        if (!dnsOptions_AddressList.swigCMemOwn) {
            throw new RuntimeException("Cannot release ownership as memory is not owned");
        }
        long j = dnsOptions_AddressList.swigCPtr;
        dnsOptions_AddressList.swigCMemOwn = false;
        dnsOptions_AddressList.delete();
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
                ovpncliJNI.delete_DnsOptions_AddressList(j);
            }
            this.swigCPtr = 0L;
        }
    }

    public DnsOptions_AddressList(DnsAddress[] dnsAddressArr) {
        this();
        reserve(dnsAddressArr.length);
        for (DnsAddress dnsAddress : dnsAddressArr) {
            add(dnsAddress);
        }
    }

    public DnsOptions_AddressList(Iterable<DnsAddress> iterable) {
        this();
        Iterator<DnsAddress> it = iterable.iterator();
        while (it.hasNext()) {
            add(it.next());
        }
    }

    @Override // java.util.AbstractList, java.util.List
    public DnsAddress get(int i) {
        return doGet(i);
    }

    @Override // java.util.AbstractList, java.util.List
    public DnsAddress set(int i, DnsAddress dnsAddress) {
        return doSet(i, dnsAddress);
    }

    @Override // java.util.AbstractList, java.util.AbstractCollection, java.util.Collection, java.util.List
    public boolean add(DnsAddress dnsAddress) {
        this.modCount++;
        doAdd(dnsAddress);
        return true;
    }

    @Override // java.util.AbstractList, java.util.List
    public void add(int i, DnsAddress dnsAddress) {
        this.modCount++;
        doAdd(i, dnsAddress);
    }

    @Override // java.util.AbstractList, java.util.List
    public DnsAddress remove(int i) {
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

    public DnsOptions_AddressList() {
        this(ovpncliJNI.new_DnsOptions_AddressList__SWIG_0(), true);
    }

    public DnsOptions_AddressList(DnsOptions_AddressList dnsOptions_AddressList) {
        this(ovpncliJNI.new_DnsOptions_AddressList__SWIG_1(getCPtr(dnsOptions_AddressList), dnsOptions_AddressList), true);
    }

    @Override // java.util.AbstractCollection, java.util.Collection, java.util.List
    public boolean isEmpty() {
        return ovpncliJNI.DnsOptions_AddressList_isEmpty(this.swigCPtr, this);
    }

    @Override // java.util.AbstractList, java.util.AbstractCollection, java.util.Collection, java.util.List
    public void clear() {
        ovpncliJNI.DnsOptions_AddressList_clear(this.swigCPtr, this);
    }

    public DnsOptions_AddressList(int i, DnsAddress dnsAddress) {
        this(ovpncliJNI.new_DnsOptions_AddressList__SWIG_2(i, DnsAddress.getCPtr(dnsAddress), dnsAddress), true);
    }

    private int doCapacity() {
        return ovpncliJNI.DnsOptions_AddressList_doCapacity(this.swigCPtr, this);
    }

    private void doReserve(int i) {
        ovpncliJNI.DnsOptions_AddressList_doReserve(this.swigCPtr, this, i);
    }

    private int doSize() {
        return ovpncliJNI.DnsOptions_AddressList_doSize(this.swigCPtr, this);
    }

    private void doAdd(DnsAddress dnsAddress) {
        ovpncliJNI.DnsOptions_AddressList_doAdd__SWIG_0(this.swigCPtr, this, DnsAddress.getCPtr(dnsAddress), dnsAddress);
    }

    private void doAdd(int i, DnsAddress dnsAddress) {
        ovpncliJNI.DnsOptions_AddressList_doAdd__SWIG_1(this.swigCPtr, this, i, DnsAddress.getCPtr(dnsAddress), dnsAddress);
    }

    private DnsAddress doRemove(int i) {
        return new DnsAddress(ovpncliJNI.DnsOptions_AddressList_doRemove(this.swigCPtr, this, i), true);
    }

    private DnsAddress doGet(int i) {
        return new DnsAddress(ovpncliJNI.DnsOptions_AddressList_doGet(this.swigCPtr, this, i), false);
    }

    private DnsAddress doSet(int i, DnsAddress dnsAddress) {
        return new DnsAddress(ovpncliJNI.DnsOptions_AddressList_doSet(this.swigCPtr, this, i, DnsAddress.getCPtr(dnsAddress), dnsAddress), true);
    }

    private void doRemoveRange(int i, int i2) {
        ovpncliJNI.DnsOptions_AddressList_doRemoveRange(this.swigCPtr, this, i, i2);
    }
}