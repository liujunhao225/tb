package com.oscar.oscar.service;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.oscar.oscar.bean.ShopBean;

public interface ShopMapper {

	public List<ShopBean> getShopList(@Param(value="shopName")String shopName);

	public List<ShopBean> getShop(String shopName);

	public int addShop(ShopBean shopBean);

	public int editShop(ShopBean shopBean);

	public int deleteShop(String shopId);
	
	public ShopBean getShopDesc(String shopId);

}
