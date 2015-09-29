package com.oscar.oscar.bean;

public class ShopOrderDiffLogBean {
	private Long id;
	private Long shopOrderId;
	private String descripion;
	private String state;
	private String operator;
	private String submitDate;
	private String checkDate;
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Long getShopOrderId() {
		return shopOrderId;
	}
	public void setShopOrderId(Long shopOrderId) {
		this.shopOrderId = shopOrderId;
	}
	public String getDescripion() {
		return descripion;
	}
	public void setDescripion(String descripion) {
		this.descripion = descripion;
	}
	public String getState() {
		return state;
	}
	public void setState(String state) {
		this.state = state;
	}
	public String getOperator() {
		return operator;
	}
	public void setOperator(String operator) {
		this.operator = operator;
	}
	public String getSubmitDate() {
		return submitDate;
	}
	public void setSubmitDate(String submitDate) {
		this.submitDate = submitDate;
	}
	public String getCheckDate() {
		return checkDate;
	}
	public void setCheckDate(String checkDate) {
		this.checkDate = checkDate;
	}
	
}
