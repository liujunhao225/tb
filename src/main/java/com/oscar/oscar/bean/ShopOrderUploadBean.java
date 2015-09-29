package com.oscar.oscar.bean;

import java.text.SimpleDateFormat;
import java.util.Date;

public class ShopOrderUploadBean {
	private Integer id;
	private String fileName;
	private Date uploadeTime;
	private Integer isMath;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public String getUploadeTime() {
		SimpleDateFormat sf = new SimpleDateFormat("YYYY-MM-dd hh:mm:ss");
		return sf.format(uploadeTime);
	}

	public void setUploadeTime(Date uploadeTime) {
		this.uploadeTime = uploadeTime;
	}

	public Integer getIsMath() {
		return isMath;
	}

	public void setIsMath(Integer isMath) {
		this.isMath = isMath;
	}

}
