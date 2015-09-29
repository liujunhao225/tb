package com.oscar.oscar.service;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.session.RowBounds;

import com.oscar.oscar.bean.StoreHouseBean;

public interface StoreHouseMapper {
	public List<StoreHouseBean> getStoreHouseList(@Param(value="shName")String shName,RowBounds rowbounds);
	public int getStoreHouseCount(String shName);
	public int storeHouseSave(StoreHouseBean bean);
	public StoreHouseBean getStoreHouseBeanDesc(String shId);
	public int storeHouseUpdate(@Param(value="shId")String shId,@Param(value="shName")String shName,@Param(value="shType")String shType,@Param(value="shAddress")String shAddress,@Param(value="privilegeLevel")int privilegeLevel,@Param(value="oldShId")String oldShId);
	public int storeHouseDelete(String shId);
	public List<StoreHouseBean> getUnLocalStoreHouse();
	public StoreHouseBean getStoreHouseBeanById(String shId);
	public List<StoreHouseBean> getLocalStoreHouse();
	
	public List<StoreHouseBean> getAllStore();
}
