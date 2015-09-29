package com.oscar.oscar.bean;

public class StoreHouseBean {

	private String shId;
	private String shName;
	private String shType;
	private Integer privilegeLevel;
	private String shAddress;
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
	public String getShType() {
		return shType;
	}
	public void setShType(String shType) {
		this.shType = shType;
	}
	public String getShAddress() {
		return shAddress;
	}
	public void setShAddress(String shAddress) {
		this.shAddress = shAddress;
	}
	public Integer getPrivilegeLevel() {
		return privilegeLevel;
	}
	public void setPrivilegeLevel(Integer privilegeLevel) {
		this.privilegeLevel = privilegeLevel;
	}
	
}
