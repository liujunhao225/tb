package com.oscar.oscar.service;

import com.oscar.oscar.bean.PurchaseOrderProductStoreBean;

public interface PurchaseOrderProductStoreMapper {
	public int addPurchaseOrderProductStore(PurchaseOrderProductStoreBean bean);
	public int updatePurchaseOrderProductStore(PurchaseOrderProductStoreBean bean);
	public PurchaseOrderProductStoreBean getPurchaseOrderProductStore(PurchaseOrderProductStoreBean bean);
}
