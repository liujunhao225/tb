package com.oscar.oscar.bean;

public class ShSubBean {
	private String shSubId;
	private StoreHouseBean storeHouseBean;
	private Integer capacity;
	private Integer usedTotal;
	private String shId;
	public String getShSubId() {
		return shSubId;
	}
	public void setShSubId(String shSubId) {
		this.shSubId = shSubId;
	}
	public StoreHouseBean getStoreHouseBean() {
		return storeHouseBean;
	}
	public void setStoreHouseBean(StoreHouseBean storeHouseBean) {
		this.storeHouseBean = storeHouseBean;
	}
	public Integer getCapacity() {
		return capacity;
	}
	public void setCapacity(Integer capacity) {
		this.capacity = capacity;
	}
	public Integer getUsedTotal() {
		return usedTotal;
	}
	public void setUsedTotal(Integer usedTotal) {
		this.usedTotal = usedTotal;
	}
	public String getShId() {
		return shId;
	}
	public void setShId(String shId) {
		this.shId = shId;
	}
	
}
