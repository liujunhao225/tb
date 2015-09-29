package com.oscar.oscar.service;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.session.RowBounds;

import com.oscar.oscar.bean.ShProductBean;

public interface ShProductMapper {

	public int addtostorehouse(ShProductBean bean);
	public int updatestorehouse(ShProductBean bean);
	/**
	 * 仓库商品管理更新商品数量
	 * @param bean
	 * @return
	 */
	public int editProductInfo(ShProductBean bean);
	/**
	 * 删除库中商品
	 * @param bean
	 */
	public void deleteProduct(ShProductBean bean);
	public ShProductBean getproductstorehouse(ShProductBean bean);
	public List<ShProductBean> getShProductBean(@Param(value="productId")String productId , @Param(value="productSize")String productSize,@Param(value="shSubId")String shSubId);
	/**
	 * 
	 * @param productId
	 * @param shSubId
	 * @param count
	 * @param productSize
	 * @return
	 */
	public int updateshProductBeanForCount(@Param(value="productId")String productId , @Param(value="shSubId")String shSubId,@Param(value="count")int count,@Param(value="productSize")String productSize);
	public ShProductBean getShProductDesc(@Param(value="productId")String productId , @Param(value="shSubId")String shSubId);
	
	public List<ShProductBean> getallshproduct(ShProductBean bean ,RowBounds bounds);
	public int getallshproductCount(ShProductBean bean);
	
	public int lockproduct(ShProductBean bean);
	
	public int unlockproduct(ShProductBean bean);
	
	public List<ShProductBean> getShProductBeanList(@Param(value="productId")String productId, @Param(value="productSize")String productSize, @Param(value="shName")String shName, @Param(value="shSubId")String shSubId, RowBounds bounds);
	
	public int getShProductBeanCount(@Param(value="productId")String productId, @Param(value="productSize")String productSize, @Param(value="shName")String shName, @Param(value="shSubId")String shSubId);
	
	public List<ShProductBean> matchShProduct(@Param(value="productId")String productId , @Param(value="productSize")String productSize,@Param(value="shId")String shId);
	public void deleteAllRecord();
	
	public int batchAdd(List<ShProductBean> list);
}
