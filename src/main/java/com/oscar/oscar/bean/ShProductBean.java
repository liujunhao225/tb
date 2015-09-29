package com.oscar.oscar.bean;

import java.util.Date;

import com.oscar.oscar.util.MD5Utils;

public class ShProductBean {
	private String productId;
	private String productCode;
	private String shId;
	private Integer count;
	private String productSize;
	private String shSubId;
	private Integer tempCount;
	private String state;
	private Date time;

	public String getProductId() {
		return productId;
	}

	public void setProductId(String productId) {
		this.productId = productId;
	}

	public String getProductCode() {
		return productCode;
	}

	public void setProductCode(String productCode) {
		this.productCode = productCode;
	}

	public String getShId() {
		return shId;
	}

	public void setShId(String shId) {
		this.shId = shId;
	}

	public Integer getCount() {
		return count;
	}

	public void setCount(Integer count) {
		this.count = count;
	}

	public String getProductSize() {
		return productSize;
	}

	public void setProductSize(String productSize) {
		this.productSize = productSize;
	}

	public String getShSubId() {
		return shSubId;
	}

	public void setShSubId(String shSubId) {
		this.shSubId = shSubId;
	}

	public Integer getTempCount() {
		return tempCount;
	}

	public void setTempCount(Integer tempCount) {
		this.tempCount = tempCount;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public Date getTime() {
		return time;
	}

	public void setTime(Date time) {
		this.time = time;
	}

	public String toHashCode() {
		return MD5Utils.MD5(this.productCode + this.shId + this.shSubId);

	}
}
