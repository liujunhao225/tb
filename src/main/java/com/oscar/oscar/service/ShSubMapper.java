package com.oscar.oscar.service;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.session.RowBounds;

import com.oscar.oscar.bean.ShSubBean;

public interface ShSubMapper {
	public List<ShSubBean> getShSubList(@Param(value="shSubId")String shSubId,RowBounds rowbounds);
	public int getShSubCount(@Param(value="shSubId")String shSubId);
	public int shSubSave(ShSubBean bean);
	public ShSubBean getShSubBeanDesc(String shSubId);
	public int shSubUpdate(@Param(value="shId")String shId,@Param(value="shSubId")String shSubId);
	public int shSubDelete(String shSubId);
	public int updateShSubByShId(@Param(value="shId")String shiId,@Param(value="oldShId")String oldShId);
	public int deleteShSubByShId(String shid);
	public List<ShSubBean> getallsubshbyshid(String shId);
	public List<ShSubBean> getallsubshnotsubId(@Param(value="shId")String shId,@Param(value="shSubId")String shSubId);
	
	public int updatetotalused(@Param(value="usedTotal")int usedTotal,@Param(value="shSubId")String shSubId);
}
