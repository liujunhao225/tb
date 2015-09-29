package com.oscar.oscar.service;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.session.RowBounds;

import com.oscar.oscar.bean.CwchangeBean;


public interface CwChangeMapper {

	public int addchangelog(CwchangeBean bean);
	
	public List<CwchangeBean> getChangeList(CwchangeBean bean,RowBounds bounds);
	
	public int getChangeListCount(CwchangeBean bean);
	
	public CwchangeBean getBeanInfo(String id);
	
	public int editBean(@Param(value="id")String id,@Param(value="state") String state);
	
	public int getCwchangCountByState(@Param(value="state")String state);
}
