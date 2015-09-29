package com.oscar.oscar.bean;

public class PurchaseOrderProductStoreBean {
	
	private String orderId;
	private Long productId;
	private String shId;
	private String shName;
	private String shSubId;
	private Integer inNum;
	
	/**
	 * A可用，B不可用
	 */
	private String state;
	
	
	public String getOrderId() {
		return orderId;
	}
	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}
	public Long getProductId() {
		return productId;
	}
	public void setProductId(Long productId) {
		this.productId = productId;
	}
	public String getShId() {
		return shId;
	}
	public void setShId(String shId) {
		this.shId = shId;
	}
	public String getShName() {
		return shName;
	}
	public void setShName(String shName) {
		this.shName = shName;
	}
	public String getShSubId() {
		return shSubId;
	}
	public void setShSubId(String shSubId) {
		this.shSubId = shSubId;
	}
	public Integer getInNum() {
		return inNum;
	}
	public void setInNum(Integer inNum) {
		this.inNum = inNum;
	}
	public String getState() {
		return state;
	}
	public void setState(String state) {
		this.state = state;
	}
	
}
