package com.oscar.oscar.service;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.session.RowBounds;

import com.oscar.oscar.bean.ShopBean;
import com.oscar.oscar.bean.SupplierBean;

public interface SupplierMapper {

	public List<SupplierBean> getSupplierList(@Param(value="supplierName")String supplierName,RowBounds rowbounds);
	public int getSupplierListCount(@Param(value="supplierName")String supplierName);

	public List<SupplierBean> getSupplier(String supplierName);

	public int addSupplier(SupplierBean supplierBean);

	public int editSupplier(SupplierBean supplierBean);

	public int deleteSupplier(String supplierId);
	
	
	public List<SupplierBean> getSupplierKind();
	
	public SupplierBean getSupplierById(@Param(value="supplierId")String supplierId);

}
