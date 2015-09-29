package com.oscar.oscar.bean;

public class PurchaseOrderProductBean {

	private PurchaseOrderBean purchaseOrderBean;
	private ProductInfoBean productInfoBean;
	private String price;
	private String sellsPrice;
	private String allPrice;
	private Integer purchaseNum;
	private Integer noStorageNum;
	private String productId;

	public PurchaseOrderBean getPurchaseOrderBean() {
		return purchaseOrderBean;
	}
	public void setPurchaseOrderBean(PurchaseOrderBean purchaseOrderBean) {
		this.purchaseOrderBean = purchaseOrderBean;
	}
	public ProductInfoBean getProductInfoBean() {
		return productInfoBean;
	}
	public void setProductInfoBean(ProductInfoBean productInfoBean) {
		this.productInfoBean = productInfoBean;
	}
	public String getPrice() {
		return price;
	}
	public void setPrice(String price) {
		this.price = price;
	}
	public String getSellsPrice() {
		return sellsPrice;
	}
	public void setSellsPrice(String sellsPrice) {
		this.sellsPrice = sellsPrice;
	}
	public String getAllPrice() {
		return allPrice;
	}
	public void setAllPrice(String allPrice) {
		this.allPrice = allPrice;
	}
	public Integer getPurchaseNum() {
		return purchaseNum;
	}
	public void setPurchaseNum(Integer purchaseNum) {
		this.purchaseNum = purchaseNum;
	}
	public Integer getNoStorageNum() {
		return noStorageNum;
	}
	public void setNoStorageNum(Integer noStorageNum) {
		this.noStorageNum = noStorageNum;
	}
	public String getProductId() {
		return productId;
	}
	public void setProductId(String productId) {
		this.productId = productId;
	}
	
}
