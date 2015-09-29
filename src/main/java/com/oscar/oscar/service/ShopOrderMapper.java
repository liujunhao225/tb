package com.oscar.oscar.service;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.session.RowBounds;

import com.oscar.oscar.bean.ShopOrderBean;

public interface ShopOrderMapper {
	
	public List<ShopOrderBean> getShopOrderList(@Param(value="orderId")String orderId,@Param(value="shopName")String shopName,@Param(value="isLocal")String isLocal,@Param(value="state")String state,@Param(value="expressId")String expressId,@Param(value="orderCode")String orderCode,@Param(value="isHaveProductFlag")String isHaveProductFlag,@Param(value="time")String time,RowBounds rowbounds);
	public int getShopOrderCount(@Param(value="orderId")String orderId,@Param(value="shopName")String shopName,@Param(value="isLocal")String isLocal,@Param(value="state")String state,@Param(value="expressId")String expressId,@Param(value="orderCode")String orderCode,@Param(value="isHaveProductFlag")String isHaveProductFlag,@Param(value="time")String time);
	public int saveShopOrder(ShopOrderBean shopOrder);
	public int updateExpressById(ShopOrderBean bean);
	public int deleteShopOrder(@Param(value="id")Long id);
	public ShopOrderBean getShopOrderDesc(@Param(value="id")Long id);
	public int updateShopOrder(ShopOrderBean bean);
	public int updateShopOrderAbnornalState(@Param(value="id")Long id,@Param(value="state")String state,@Param(value="abnormalMessage")String abnormalMessage);
	public int getShopOrderCountByState(@Param(value="state")String state);
	public List<ShopOrderBean> downloadShopOrderList(@Param(value="time")String time);
	public int updateExpress(ShopOrderBean bean);
	public ShopOrderBean getShopOrderBean(ShopOrderBean bean);
}
