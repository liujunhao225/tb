package com.oscar.oscar.service;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.session.RowBounds;

import com.oscar.oscar.bean.ProductInfoBean;

public interface ProductInfoMapper {

	public List<ProductInfoBean> getProductList(ProductInfoBean bean,
			RowBounds bounds); 

	public int getProductListCount(ProductInfoBean bean);

	public int addproduct(ProductInfoBean bena);

	public int deleteProductInfo(ProductInfoBean bean);

	public ProductInfoBean getProductInfoByBarCode(@Param(value="barCode")String barCode);
	
	public ProductInfoBean getProductInfoByCodeAndSize(@Param(value="productId")String productId,@Param(value="productSize")String productSize);

	public int updateProductInfo(ProductInfoBean bean);
	
	public int updateProductInfoBarCode(ProductInfoBean bean);
	
	public ProductInfoBean getProductInfoById(@Param(value="id")long id);
	
	public int addProductList(@Param(value="list") List<ProductInfoBean> list);
}
