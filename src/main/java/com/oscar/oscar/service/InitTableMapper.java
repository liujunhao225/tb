package com.oscar.oscar.service;

import java.util.List;

import com.oscar.oscar.bean.InitBean;

public interface InitTableMapper {
	
	public List<InitBean> getInitList();
	
	public void clearTable(InitBean bean);
	
	public InitBean getTableName(InitBean id);
	
	

}
