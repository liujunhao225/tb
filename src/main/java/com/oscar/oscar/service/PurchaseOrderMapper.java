package com.oscar.oscar.service;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.session.RowBounds;

import com.oscar.oscar.bean.PurchaseOrderBean;

public interface PurchaseOrderMapper {

	public List<PurchaseOrderBean> getOrderList(PurchaseOrderBean bean,RowBounds rowbounds);
	
	public int getOrderListCount(PurchaseOrderBean bean);

	public PurchaseOrderBean getOrder(String orderId);

	public int addOrder(PurchaseOrderBean orderBean);

	public int editOrder(PurchaseOrderBean orderBean);

	public int deleteOrder(String shopId);
	
	public List<PurchaseOrderBean> getNoProductOrder();
	
	public void deletePurchaseOrderId(String orderId);
	
	public List<PurchaseOrderBean> getOrderListByProductId(@Param(value="productId")long productId,@Param(value="orderId")String orderId,RowBounds rowbounds);
	
	public int getOrderListCountByProductId(@Param(value="productId")long productId,@Param(value="orderId")String orderId);
	
	public List<PurchaseOrderBean> getPurchaseOrder(String state);
	
	//更改为审核
	public int addReviewPurchaseOrder(@Param(value="orderId")String orderId,@Param(value="note") String note);

}
