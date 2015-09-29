package com.oscar.oscar.bean;

public class PurchaseProductInfoObject {

	private String key;

	private Object bean;

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public Object getBean() {
		return bean;
	}

	public void setBean(Object bean) {
		this.bean = bean;
	}

	public void put(String key, Object bean) {
		this.key = key;
		this.bean = bean;
	}

}
