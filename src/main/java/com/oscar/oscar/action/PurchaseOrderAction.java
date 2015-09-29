/**
 * 采购单管理 
 */
package com.oscar.oscar.action;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.ibatis.session.RowBounds;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.oscar.oscar.bean.ProductInfoBean;
import com.oscar.oscar.bean.PurchaseExcelAnalysisBean;
import com.oscar.oscar.bean.PurchaseOrderBean;
import com.oscar.oscar.bean.PurchaseOrderProductBean;
import com.oscar.oscar.service.ProductInfoMapper;
import com.oscar.oscar.service.PurchaseOrderMapper;
import com.oscar.oscar.service.PurchaseOrderProductMapper;
import com.oscar.oscar.util.DateTime;
import com.oscar.oscar.util.ExcelConverttoProductInfo;
import com.oscar.oscar.util.FileSaveUtil;
import com.oscar.oscar.util.FileUploadBean;
import com.oscar.oscar.util.SystemDictionary;

@Component
@Controller
@RequestMapping("/purchase")
public class PurchaseOrderAction {

	@Autowired
	PurchaseOrderMapper purchaseOrderMapper;

	@Autowired
	PurchaseOrderProductMapper purchaseOrderProductMapper;

	@Autowired
	ProductInfoMapper productInfoMapper;

	@RequestMapping("/index.do")
	public String index() {
		return "/purchase/purchase";
	}

	@RequestMapping("/list.do")
	@ResponseBody
	public String getList(HttpServletRequest request) {

		String tpurchaseId = request.getParameter("tpurchaseId");

		PurchaseOrderBean bean = new PurchaseOrderBean();
		bean.setOrderId(tpurchaseId);

		String start = request.getParameter("page");
		String limit = request.getParameter("limit");
		int startNum = 0;
		int limitNum = 15;
		try {
			limitNum = Integer.parseInt(limit) + startNum;
			startNum = (Integer.parseInt(start) - 1) * limitNum;
		} catch (NumberFormatException e) {
			startNum = 0;
			limitNum = 15;
		}
		List<PurchaseOrderBean> list = purchaseOrderMapper.getOrderList(bean,
				new RowBounds(startNum, limitNum));
		int count = purchaseOrderMapper.getOrderListCount(bean);
		JSONObject job = new JSONObject();
		job.put("datalist", list);
		job.put("totalRecords", count);
		return job.toString();
	}

	@RequestMapping("/add.do")
	@ResponseBody
	public String add(HttpServletRequest request) {
		String purchaseOrderId = request.getParameter("purchaseOrderId");
		String supplierId = request.getParameter("supplierId");
		String purchaseDate = request.getParameter("purchaseDate");
		PurchaseOrderBean bean = new PurchaseOrderBean();
		bean.setOrderId(purchaseOrderId);
		bean.setPurchaseDate(purchaseDate);
		bean.setSupplierId(supplierId);
		bean.setOrderState(SystemDictionary.PurchaseOrderState.NEW_ORDER);
		int result = purchaseOrderMapper.addOrder(bean);
		JSONObject job = new JSONObject();
		if (result > 0) {
			job.put("success", true);
			return job.toString();
		}
		job.put("success", false);
		return job.toString();
	}

	@RequestMapping("/update.do")
	@ResponseBody
	public String edit(HttpServletRequest request) {
		String orderId = request.getParameter("eorderId");
		String supplierId = request.getParameter("esupplierId");
		String boxCount = request.getParameter("eboxCount");
		String orderState = request.getParameter("eorderState");
		String purchaseDate = request.getParameter("purchaseDate");
		String logistics = request.getParameter("elogistics");
		String logisticsNum = request.getParameter("elogisticsNum");
		PurchaseOrderBean bean = new PurchaseOrderBean();
		bean.setOrderId(orderId);// 采购单号
		bean.setSupplierId(supplierId);// 供应厂家
		// 采购箱数)
		if (boxCount != null || !"".equals(boxCount)) {
			bean.setBoxCount(Integer.parseInt(boxCount));
		}
		String arriveDate="";
		if (SystemDictionary.PurchaseOrderState.ARRIVED.equals(orderState)) {
			arriveDate =  DateTime.format("yyyy-MM-dd");
		}
		String deliveryDate ="";
		if (SystemDictionary.PurchaseOrderState.DELEVERING.equals(orderState)) {
			deliveryDate= DateTime.format("yyyy-MM-dd");
		}
		String storeDate ="";
		if (SystemDictionary.PurchaseOrderState.STORED.equals(orderState)) {
			storeDate= DateTime.format("yyyy-MM-dd");
		}
		bean.setDeliveryDate(deliveryDate);// 发货日期
		bean.setOrderState(orderState);//
		bean.setPurchaseDate(purchaseDate);// 采购日期
		bean.setArriveDate(arriveDate);// 到货日期
		bean.setStoreDate(storeDate);// 入库日期
		bean.setLogistics(logistics);
		bean.setLogisticsNum(logisticsNum);

		int result = purchaseOrderMapper.editOrder(bean);

		JSONObject job = new JSONObject();
		if (result > 0) {
			job.put("success", true);
			return job.toString();
		}
		job.put("success", false);
		return job.toString();
	}

	@RequestMapping("/delete.do")
	@ResponseBody
	public String delete(HttpServletRequest request) {
		String orderId = request.getParameter("orderId");
		purchaseOrderMapper.deletePurchaseOrderId(orderId);
		JSONObject job = new JSONObject();
		job.put("success", true);
		return job.toString();
	}

	@RequestMapping("/importFile.do")
	@ResponseBody
	public String importFile(FileUploadBean filebean, HttpServletRequest request) {
		String purchaseOrderId = request.getParameter("purchaseOrderId");
		String fileName = FileSaveUtil.save(filebean, "");
		PurchaseOrderBean bean = new PurchaseOrderBean();
		ExcelConverttoProductInfo converter = new ExcelConverttoProductInfo();
		bean.setFileFlag("T");
		bean.setFilePath(fileName);
		bean.setOrderId(purchaseOrderId);
		bean.setOrderState(SystemDictionary.PurchaseOrderState.NOT_SENT);
		int result = purchaseOrderMapper.editOrder(bean);
		PurchaseExcelAnalysisBean analysisBean = converter
				.convertToProductInfo(fileName);
		// 保存到tb2_purchase_order_product中
		for (PurchaseOrderProductBean pbean : analysisBean.getProductInfoList()) {
			ProductInfoBean tempProductInfoBean = productInfoMapper
					.getProductInfoByCodeAndSize(pbean.getProductInfoBean()
							.getProductId(), pbean.getProductInfoBean()
							.getProductSize());
			if (tempProductInfoBean == null) {
				productInfoMapper.addproduct(pbean.getProductInfoBean());
			} else {
				pbean.getProductInfoBean().setId(tempProductInfoBean.getId());
			}
			pbean.getPurchaseOrderBean().setOrderId(purchaseOrderId);
		}
		purchaseOrderProductMapper.addPurchaseProduct(analysisBean
				.getProductInfoList());// 全量插入
		JSONObject job = new JSONObject();
		job.put("errorMessge", analysisBean.getErrorLine());
		if (result > 0) {
			job.put("success", true);
			return job.toString();
		}
		job.put("success", false);
		return job.toString();
	}

	/**
	 * 获取采购单下所有商品详情
	 * 
	 * @param request
	 * @return
	 */
	@RequestMapping("/productInfoList.do")
	@ResponseBody
	public String getPurchaseProductInfoList(HttpServletRequest request) {

		String tpurchaseId = request.getParameter("tpurchaseId");
		String barcode = request.getParameter("barcode");
		PurchaseOrderBean bean = new PurchaseOrderBean();
		bean.setOrderId(tpurchaseId);

		String start = request.getParameter("page");
		String limit = request.getParameter("limit");
		int startNum = 0;
		int limitNum = 15;
		try {
			limitNum = Integer.parseInt(limit) + startNum;
			startNum = (Integer.parseInt(start) - 1) * limitNum;
		} catch (NumberFormatException e) {
			startNum = 0;
			limitNum = 15;
		}
		List<PurchaseOrderProductBean> list = purchaseOrderProductMapper
				.getPurchaseOrderProductList(tpurchaseId, barcode, null, null,
						new RowBounds(startNum, limitNum));
		int count = purchaseOrderProductMapper
				.getPurchaseOrderProductListCount(tpurchaseId, barcode, null,
						null);
		List<JSONObject> datalist = new ArrayList<JSONObject>();
		for (PurchaseOrderProductBean tempBean : list) {
			JSONObject tempJob = new JSONObject();
			// 货号
			tempJob.put("productId", tempBean.getProductInfoBean().getId());
			// 货品编码
			tempJob.put("productCode", tempBean.getProductInfoBean()
					.getProductCode());
			// 货品型号
			tempJob.put("productSize", tempBean.getProductInfoBean()
					.getProductSize());
			// 货品名称
			tempJob.put("productName", tempBean.getProductInfoBean()
					.getProductName());
			// 条形码
			tempJob.put("barCode", tempBean.getProductInfoBean().getBarCode());
			// 类别
			tempJob.put("kind", tempBean.getProductInfoBean().getKind());
			// 采购价
			tempJob.put("price", tempBean.getPrice());
			// 销售价
			tempJob.put("sellsPrice", tempBean.getSellsPrice());
			// 总价
			tempJob.put("allPrice", tempBean.getAllPrice());
			// 采购数量
			tempJob.put("purchaseNum", tempBean.getPurchaseNum());
			// 未入库数量
			tempJob.put("noStorageNum", tempBean.getNoStorageNum());
			tempJob.put("active", false);
			datalist.add(tempJob);
		}
		JSONObject job = new JSONObject();
		job.put("datalist", datalist);
		job.put("totalRecords", count);
		return job.toString();
	}

	@RequestMapping("/productAdd.do")
	@ResponseBody
	public String productAdd(HttpServletRequest request) {
		String productCode = request.getParameter("productCode");
		String productSize = request.getParameter("productSize");
		String productName = request.getParameter("productName");
		String barCode = request.getParameter("barCode");
		String kind = request.getParameter("kind");
		String price = request.getParameter("price");
		String sellsPrice = request.getParameter("sellsPrice");
		String allPrice = request.getParameter("allPrice");
		String purchaseNum = request.getParameter("purchaseNum");
		String orderId = request.getParameter("orderId");
		ProductInfoBean tempProductInfoBean = productInfoMapper
				.getProductInfoByCodeAndSize(productCode, productSize);
		PurchaseOrderProductBean purchaseOrderProductBean = new PurchaseOrderProductBean();
		purchaseOrderProductBean.setAllPrice(allPrice);
		purchaseOrderProductBean.setNoStorageNum(Integer.parseInt(purchaseNum));
		purchaseOrderProductBean.setPrice(price);
		purchaseOrderProductBean.setSellsPrice(sellsPrice);

		purchaseOrderProductBean.setPurchaseNum(Integer.parseInt(purchaseNum));
		purchaseOrderProductBean.setNoStorageNum(Integer.parseInt(purchaseNum));
		if (tempProductInfoBean == null) {
			tempProductInfoBean = new ProductInfoBean();
			tempProductInfoBean.setBarCode(barCode);
			tempProductInfoBean.setKind(kind);
			tempProductInfoBean.setProductCode(productCode);
			tempProductInfoBean.setProductSize(productSize);
			tempProductInfoBean.setProductName(productName);
			productInfoMapper.addproduct(tempProductInfoBean);
		}
		PurchaseOrderBean purchaseOrderBean = new PurchaseOrderBean();
		purchaseOrderBean.setOrderId(orderId);
		purchaseOrderProductBean.setPurchaseOrderBean(purchaseOrderBean);
		purchaseOrderProductBean.setProductInfoBean(tempProductInfoBean);
		List<PurchaseOrderProductBean> list = new ArrayList<PurchaseOrderProductBean>();
		list.add(purchaseOrderProductBean);
		purchaseOrderProductMapper.addPurchaseProduct(list);// 全量插入
		JSONObject job = new JSONObject();
		job.put("success", false);
		return job.toString();
	}

	@RequestMapping("/productUpdate.do")
	@ResponseBody
	public String productUpdate(HttpServletRequest request) {
		String record = request.getParameter("record");
		System.out.println(record);
		String purchaseNum = request.getParameter("purchaseNum");
		// String noStorageNum = request.getParameter("noStorageNum");
		String orderId = request.getParameter("orderId");
		String productId = request.getParameter("productId");
		purchaseOrderProductMapper.updatePurchaseProduct(purchaseNum,
				purchaseNum, orderId, productId);
		JSONObject job = new JSONObject();
		job.put("success", false);
		return job.toString();
	}

	@RequestMapping("/productDelete.do")
	@ResponseBody
	public String productDelete(HttpServletRequest request) {
		String orderId = request.getParameter("orderId");
		String productId = request.getParameter("productId");
		purchaseOrderProductMapper
				.deleteProductchaseProduct(orderId, productId);
		JSONObject job = new JSONObject();
		job.put("success", false);
		System.out.println(job.toString());
		return job.toString();
	}

	@RequestMapping("/unSavePurchaseOrder.do")
	@ResponseBody
	public String unSavePurchaseOrder(HttpServletRequest request) {
		List<PurchaseOrderBean> list = purchaseOrderMapper
				.getPurchaseOrder(SystemDictionary.PurchaseOrderState.ARRIVED);
		List<JSONObject> templist = new ArrayList<JSONObject>();
		for (PurchaseOrderBean temp : list) {
			JSONObject job = new JSONObject();
			job.put("purchaseId", temp.getOrderId());
			job.put("purchaseName", temp.getOrderId());
			templist.add(job);
		}
		JSONObject job = new JSONObject();
		job.put("data", templist);
		System.out.println(job.toString());
		return job.toString();
	}

}
