package com.oscar.oscar.bean;

import java.util.List;

public class PurchaseExcelAnalysisBean {

	private List<String> errorLine = null;

	private List<PurchaseOrderProductBean> productInfoList = null;

	public List<String> getErrorLine() {
		return errorLine;
	}

	public void setErrorLine(List<String> errorLine) {
		this.errorLine = errorLine;
	}

	public List<PurchaseOrderProductBean> getProductInfoList() {
		return productInfoList;
	}

	public void setProductInfoList(
			List<PurchaseOrderProductBean> productInfoList) {
		this.productInfoList = productInfoList;
	}

}
