package com.oscar.oscar.service;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.session.RowBounds;

import com.oscar.oscar.bean.PurchaseDiffLogBean;

public interface PurchaseDiffMapper {
	
	public int addLog(PurchaseDiffLogBean bean);
	
	public int editLog(PurchaseDiffLogBean bean);
	
	public List<PurchaseDiffLogBean> getList(PurchaseDiffLogBean bean,RowBounds bounds);
	
	public int getListCount(PurchaseDiffLogBean bean);

	public int getPurchaseByState(@Param(value="state")String state);
}
