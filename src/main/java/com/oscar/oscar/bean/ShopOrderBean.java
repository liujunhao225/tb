package com.oscar.oscar.bean;

public class ShopOrderBean {
	private Long id;
	/**
	 * 订单号
	 */
	private String orderId;
	
	/**
	 * 上传文件 ID
	 */
	private long fileId; 
	/**
	 * 店铺名称
	 */
	private String shopName;
	/**
	 * 产品号
	 */
	private String productCode;
	/**
	 * 数量
	 */
	private Integer count;
	/**
	 * 尺寸
	 */
	private String size;
	/**
	 * 仓位
	 */
	private String storePlace;
	/**
	 * 有货标志
	 */
	private String isHaveProductFlag;
	/**
	 * 订单备忘录
	 */
	private String orderNote;
	/**
	 * 快递号
	 */
	private String expressId;
	/**
	 * 订单编号
	 */
	private String orderCode;
	/**
	 * 价格
	 */
	private String price;
	/**
	 * 状态
	 */
	private String state;
	/**
	 * 是否是本地
	 */
	private Integer isLocal;
	/**
	 * 渠道
	 */
	private String channel;
	/**
	 * 
	 */
	private String note;
	private String freight;
	private String zipCode;
	private String address;
	private String telephone;
	private String consigneeName;
	private String deliveryMethod;
	private String time;
	private String abnormalMessage;
	
	public String getAbnormalMessage() {
		return abnormalMessage;
	}
	public void setAbnormalMessage(String abnormalMessage) {
		this.abnormalMessage = abnormalMessage;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getOrderId() {
		return orderId;
	}
	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}
	public String getShopName() {
		return shopName;
	}
	public void setShopName(String shopName) {
		this.shopName = shopName;
	}
	public String getProductCode() {
		return productCode;
	}
	public void setProductCode(String productCode) {
		this.productCode = productCode;
	}
	public Integer getCount() {
		return count;
	}
	public void setCount(Integer count) {
		this.count = count;
	}
	public String getSize() {
		return size;
	}
	public void setSize(String size) {
		this.size = size;
	}
	public String getStorePlace() {
		return storePlace;
	}
	public void setStorePlace(String storePlace) {
		this.storePlace = storePlace;
	}
	public String getIsHaveProductFlag() {
		return isHaveProductFlag;
	}
	public void setIsHaveProductFlag(String isHaveProductFlag) {
		this.isHaveProductFlag = isHaveProductFlag;
	}
	public String getOrderNote() {
		return orderNote;
	}
	public void setOrderNote(String orderNote) {
		this.orderNote = orderNote;
	}
	public String getExpressId() {
		return expressId;
	}
	public void setExpressId(String expressId) {
		this.expressId = expressId;
	}
	public String getOrderCode() {
		return orderCode;
	}
	public void setOrderCode(String orderCode) {
		this.orderCode = orderCode;
	}
	public String getPrice() {
		return price;
	}
	public void setPrice(String price) {
		this.price = price;
	}
	public String getState() {
		return state;
	}
	public void setState(String state) {
		this.state = state;
	}
	public Integer getIsLocal() {
		return isLocal;
	}
	public void setIsLocal(Integer isLocal) {
		this.isLocal = isLocal;
	}
	public String getChannel() {
		return channel;
	}
	public void setChannel(String channel) {
		this.channel = channel;
	}
	public String getNote() {
		return note;
	}
	public void setNote(String note) {
		this.note = note;
	}
	public String getFreight() {
		return freight;
	}
	public void setFreight(String freight) {
		this.freight = freight;
	}
	public String getZipCode() {
		return zipCode;
	}
	public void setZipCode(String zipCode) {
		this.zipCode = zipCode;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getTelephone() {
		return telephone;
	}
	public void setTelephone(String telephone) {
		this.telephone = telephone;
	}
	public String getConsigneeName() {
		return consigneeName;
	}
	public void setConsigneeName(String consigneeName) {
		this.consigneeName = consigneeName;
	}
	public String getDeliveryMethod() {
		return deliveryMethod;
	}
	public void setDeliveryMethod(String deliveryMethod) {
		this.deliveryMethod = deliveryMethod;
	}
	public String getTime() {
		return time;
	}
	public void setTime(String time) {
		this.time = time;
	}
	public long getFileId() {
		return fileId;
	}
	public void setFileId(long fileId) {
		this.fileId = fileId;
	}
	
}
