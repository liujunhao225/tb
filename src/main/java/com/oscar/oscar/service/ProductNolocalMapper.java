package com.oscar.oscar.service;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.session.RowBounds;

import java.util.List;

import com.oscar.oscar.bean.ProductNolocalBean;

public interface ProductNolocalMapper {
	public ProductNolocalBean getProductNolocalDesc(
			@Param(value = "productId") String productId,
			@Param(value = "shStoreId") String shStoreId);

	public int updateProductCount(@Param(value = "productId") String productId,
			@Param(value = "totalCount") long totalCount,
			@Param(value = "shStoreId") String shStoreId);

	public List<ProductNolocalBean> getList(
			@Param(value = "productId") String productId,@Param(value="shStoreId") String storeid,RowBounds bonds);
	
	public ProductNolocalBean getNolocalBean();
	
	public int addnolocalBatch(List<ProductNolocalBean> list);

	public int getListCount(@Param(value = "productId") String productId,@Param(value="shStoreId") String storeid);
	
	public void deleteAllRecord();
	
	public List<ProductNolocalBean> getProductNolocalList(@Param(value="productId")String productCode, @Param(value="shName")String shName, RowBounds bounds);
	
	public int getProductNolocalCount(@Param(value="productId")String productCode, @Param(value="shName")String shName);

	public List<ProductNolocalBean> matchProduct(@Param(value="productId")String productId);
}
