package com.oscar.oscar.service;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.session.RowBounds;

import com.oscar.oscar.bean.PurchaseOrderProductBean;

public interface PurchaseOrderProductMapper {
	public List<PurchaseOrderProductBean> getPurchaseOrderProductList(
			@Param(value = "orderId") String orderId,
			@Param(value = "barCode") String barCode,
			@Param(value = "bars") String[] bars,
			@Param(value = "orderState") String orderState, RowBounds rowbounds);

	public int getPurchaseOrderProductListCount(
			@Param(value = "orderId") String orderId,
			@Param(value = "barCode") String barCode,
			@Param(value = "bars") String[] bars,
			@Param(value = "orderState") String orderState);

	public int addPurchaseProduct(List<PurchaseOrderProductBean> list);

	public int updatePurchaseProduct(
			@Param(value = "purchaseNum") String purchaseNum,
			@Param(value = "noStorageNum") String noStorageNum,
			@Param(value = "orderId") String orderId,
			@Param(value = "productId") String productId);

	public int deleteProductchaseProduct(
			@Param(value = "orderId") String orderId,
			@Param(value = "productId") String productId);

	public int getPurchaseOrderProductNoStorageNum(
			@Param(value = "orderId") String orderId,
			@Param(value = "productId") long productId);

	public int updatePurchaseOrderProductNoStorageNum(
			@Param(value = "orderId") String orderId,
			@Param(value = "productId") long productId,
			@Param(value = "inNum") int inNum);

	public PurchaseOrderProductBean getPurchaseProductInfo(
			@Param(value = "orderId") String orderId,
			@Param(value = "productCode") String productCode);

	public List<PurchaseOrderProductBean> purchaseAndBeStroeCompare(
			@Param(value = "orderId") String orderId,
			@Param(value = "barCode") String barCode, RowBounds bonds);

	public int purchaseAndBeStroeCompareCount(@Param(value = "orderId") String orderId,
			@Param(value = "barCode") String barCode);
}
