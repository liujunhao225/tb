package com.oscar.oscar.bean;

import com.oscar.oscar.util.MD5Utils;

public class ProductNolocalBean {
	private String productId;
	private String shStoreId;
	private String price;
	private Long totalCount;
	public String getProductId() {
		return productId;
	}
	public void setProductId(String productId) {
		this.productId = productId;
	}
	public String getShStoreId() {
		return shStoreId;
	}
	public void setShStoreId(String shStoreId) {
		this.shStoreId = shStoreId;
	}
	public String getPrice() {
		return price;
	}
	public void setPrice(String price) {
		this.price = price;
	}
	public Long getTotalCount() {
		return totalCount;
	}
	public void setTotalCount(Long totalCount) {
		this.totalCount = totalCount;
	}

	
	public String toHashCode(){
		return MD5Utils.MD5(this.productId+this.shStoreId);
	}
	
}
