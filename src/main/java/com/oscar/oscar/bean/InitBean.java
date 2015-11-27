package com.oscar.oscar.bean;

public class InitBean {

	// <id column="id" property="id" />
	// <result column="table_name" property="tName" />
	// <result column="table_chinese_name" property="tcName" />
	// <result column="is_can_init" property="initFlag" />

	private String id;
	private String teName;//表名

	private String tcName;//中文表名

	private String initFlag;//初始化标志

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}


	public String getTcName() {
		return tcName;
	}

	public void setTcName(String tcName) {
		this.tcName = tcName;
	}

	public String getInitFlag() {
		return initFlag;
	}

	public void setInitFlag(String initFlag) {
		this.initFlag = initFlag;
	}

	public String getTeName() {
		return teName;
	}

	public void setTeName(String teName) {
		this.teName = teName;
	}
}
