/**
 * 入库各种操作
 */
package com.oscar.oscar.action;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.ibatis.session.RowBounds;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.oscar.oscar.bean.ProductInfoBean;
import com.oscar.oscar.bean.PurchaseOrderProductBean;
import com.oscar.oscar.bean.PurchaseOrderProductStoreBean;
import com.oscar.oscar.bean.ShProductBean;
import com.oscar.oscar.bean.StoreHouseBean;
import com.oscar.oscar.service.ProductInfoMapper;
import com.oscar.oscar.service.PurchaseOrderMapper;
import com.oscar.oscar.service.PurchaseOrderProductMapper;
import com.oscar.oscar.service.PurchaseOrderProductStoreMapper;
import com.oscar.oscar.service.ShProductMapper;
import com.oscar.oscar.service.StoreHouseMapper;
import com.oscar.oscar.util.SystemDictionary;

@Component
@Controller
@RequestMapping("/bestore")
public class BestoredAction {

	@Autowired
	private PurchaseOrderProductMapper purchaseOrderProductMapper;
	@Autowired
	PurchaseOrderMapper purchaseOrderMapper;
	@Autowired
	private ProductInfoMapper productInfoMapper;
	@Autowired
	private ShProductMapper shProductMapper;
	@Autowired
	private PurchaseOrderProductStoreMapper purchaseOrderProductStoreMapper;
	@Autowired
	private StoreHouseMapper storeHouseMapper;

	@RequestMapping(value = "/index")
	public String index() {

		return "bestore/bestore";
	}

	@RequestMapping("/list.do")
	@ResponseBody
	public String getList(HttpServletRequest request) {
		String orderId = request.getParameter("orderId");
		String barCode = request.getParameter("barCode");
		String start = request.getParameter("page");
		String limit = request.getParameter("limit");
		int startNum = 0;
		int limitNum = 20;
		try {
			limitNum = Integer.parseInt(limit) + startNum;
			startNum = (Integer.parseInt(start) - 1) * limitNum;
		} catch (NumberFormatException e) {
			startNum = 0;
			limitNum = 20;
		}

		String bars[] = {};
		if (barCode != null && barCode.length() > 0) {
			bars = barCode.split(",");
		}

		List<PurchaseOrderProductBean> list = purchaseOrderProductMapper
				.getPurchaseOrderProductList(orderId, null, bars,
						SystemDictionary.PurchaseOrderState.ARRIVED,
						new RowBounds(startNum, limitNum));
		JSONObject json = new JSONObject();
		if (list != null && !list.isEmpty()) {
			PurchaseOrderProductBean purchaseOrderProductBean = list.get(0);

			json.put("id", purchaseOrderProductBean.getProductInfoBean()
					.getId());
			json.put("productId", purchaseOrderProductBean.getProductInfoBean()
					.getProductId());
			json.put("productName", purchaseOrderProductBean
					.getProductInfoBean().getProductName());
			json.put("productSize", purchaseOrderProductBean
					.getProductInfoBean().getProductSize());
			json.put("productCode", purchaseOrderProductBean
					.getProductInfoBean().getProductCode());
			json.put("barCode", purchaseOrderProductBean.getProductInfoBean()
					.getBarCode());
			json.put("price", purchaseOrderProductBean.getPrice());
			json.put("sellsPrice", purchaseOrderProductBean.getSellsPrice());
			json.put("allPrice", purchaseOrderProductBean.getAllPrice());
			json.put("purchaseNum", purchaseOrderProductBean.getPurchaseNum());
			json.put("noStorageNum", purchaseOrderProductBean.getNoStorageNum());
			json.put("orderId", purchaseOrderProductBean.getPurchaseOrderBean()
					.getOrderId());
			json.put("inNum", 1);
			
		} else {
			json.put("id", "");
			json.put("productId", "");
			json.put("productName", "");
			json.put("productSize", "");
			json.put("productCode", "");
			json.put("barCode", barCode);
			json.put("price", "");
			json.put("sellsPrice", "");
			json.put("allPrice", "");
			json.put("purchaseNum", "");
			json.put("noStorageNum", "");
			json.put("orderId", orderId);
			json.put("inNum", 1);
		}

		return json.toString();
	}

	@RequestMapping(value = "/storage.do")
	@ResponseBody
	public String storage(HttpServletRequest request) {
		JSONObject job = new JSONObject();
		String orderId = request.getParameter("orderId");
		String id = request.getParameter("id");
		String shId = request.getParameter("shId");
		String shSubId = request.getParameter("shSubId");
		String inNum = request.getParameter("inNum");
		long idNum = Long.parseLong(id);
		int inNumber = Integer.parseInt(inNum);
		int noStorageNum = purchaseOrderProductMapper
				.getPurchaseOrderProductNoStorageNum(orderId, idNum);
		if (noStorageNum >= inNumber) {
			int res = purchaseOrderProductMapper
					.updatePurchaseOrderProductNoStorageNum(orderId, idNum,
							-inNumber);
			if (res == 1) {
				ProductInfoBean product = productInfoMapper
						.getProductInfoById(idNum);
				String productId = product.getProductId();
				String productSize = product.getProductSize();
				String productCode = product.getProductCode();
				ShProductBean shProBean = new ShProductBean();
				shProBean.setProductId(productId);
				shProBean.setProductSize(productSize);
				shProBean.setShSubId(shSubId);
				shProBean = shProductMapper.getproductstorehouse(shProBean);
				if (shProBean == null) {
					shProBean = new ShProductBean();
					shProBean.setProductId(productId);
					shProBean.setProductSize(productSize);
					shProBean.setShSubId(shSubId);
					shProBean.setShId(shId);
					shProBean.setCount(inNumber);
					shProBean.setProductCode(productCode);
					shProBean.setState("A");
					shProBean.setTime(new Date());
					
					shProductMapper.addtostorehouse(shProBean);//库存量增加
					
					insertOrUpdatePurchaseOrderProductStore(orderId, idNum,
							shId, shSubId, inNumber);
					job.put("code", 200);
					job.put("mess", "保存成功");
				} else {
					res = shProductMapper.updateshProductBeanForCount(
							productId, shSubId, inNumber, productSize);
					if (res == 1) {
						job.put("code", 200);
						job.put("mess", "保存成功");
						insertOrUpdatePurchaseOrderProductStore(orderId, idNum,
								shId, shSubId, inNumber);
					} else {
						purchaseOrderProductMapper
								.updatePurchaseOrderProductNoStorageNum(
										orderId, idNum, inNumber);
						job.put("code", 500);
						job.put("mess", "库存信息更新失败");
					}
				}
			} else {
				job.put("code", 500);
				job.put("mess", "数据更新失败");
			}
		} else {
			job.put("code", 500);
			job.put("mess", "入库数据大于未入库数");
		}
		return job.toString();
	}

	private void insertOrUpdatePurchaseOrderProductStore(String orderId,
			Long productId, String shId, String shSubId, int inNum) {
		PurchaseOrderProductStoreBean bean = new PurchaseOrderProductStoreBean();
		bean.setOrderId(orderId);
		bean.setProductId(productId);
		bean.setShId(shId);
		bean.setShSubId(shSubId);
		bean.setInNum(inNum);
		PurchaseOrderProductStoreBean purchaseOrderProductStoreBean = purchaseOrderProductStoreMapper
				.getPurchaseOrderProductStore(bean);
		if (purchaseOrderProductStoreBean == null) {
			StoreHouseBean storeHourseBean = storeHouseMapper
					.getStoreHouseBeanById(shId);
			String shName = storeHourseBean.getShName();
			bean.setShName(shName);
			purchaseOrderProductStoreMapper.addPurchaseOrderProductStore(bean);
		} else {
			purchaseOrderProductStoreMapper
					.updatePurchaseOrderProductStore(bean);
		}
	}

	@RequestMapping(value = "connect")
	@ResponseBody
	public String connnectBarCodeToProduct(HttpServletRequest request) {

		String orderId = request.getParameter("orderId");
		String barCode = request.getParameter("barCode");
		String productCode = request.getParameter("productCode");
		// 首先从采购单中查找是否有此产品
		PurchaseOrderProductBean popBean = purchaseOrderProductMapper
				.getPurchaseProductInfo(orderId, productCode);
		JSONObject job = new JSONObject();
		if (popBean != null) {
			// //有 更新商品表数据（条码），重新获取此商品详情
			ProductInfoBean productInfoBean = new ProductInfoBean();
			productInfoBean.setBarCode(barCode);
			productInfoBean.setProductCode(productCode);
			productInfoMapper.updateProductInfoBarCode(productInfoBean);
			popBean.getProductInfoBean().setBarCode(barCode);
			job.put("flag", true);
			job.put("desc", "成功！");
			job.put("id", popBean.getProductId());
			job.put("productId", popBean.getProductId());
			job.put("productName", popBean.getProductInfoBean()
					.getProductName());
			job.put("allPrice", popBean.getAllPrice());
			job.put("noStorageNum", popBean.getNoStorageNum());
			job.put("purchaseNum", popBean.getPurchaseNum());
			job.put("price", popBean.getPrice());
			job.put("sellsPrice", popBean.getSellsPrice());
			job.put("orderId", orderId);
			job.put("productSize", popBean.getProductInfoBean()
					.getProductSize());
		} else {
			// //无，返回采购单中无此记录
			job.put("flag", false);
			job.put("desc", "没有此采购记录");
		}
		return job.toString();
	}

	@RequestMapping(value = "compare")
	@ResponseBody
	public String compare(HttpServletRequest request) {
		String orderId = request.getParameter("orderId");
		String start = request.getParameter("page");
		String limit = request.getParameter("limit");
		String barCode = request.getParameter("barCode");
		int startNum = 0;
		int limitNum = 20;
		try {
			limitNum = Integer.parseInt(limit) + startNum;
			startNum = (Integer.parseInt(start) - 1) * limitNum;
		} catch (NumberFormatException e) {
			startNum = 0;
			limitNum = 20;
		}
		List<PurchaseOrderProductBean> compareList = purchaseOrderProductMapper
				.purchaseAndBeStroeCompare(orderId,barCode, new RowBounds(startNum,
						limitNum));
		List<JSONObject> jsonList = new ArrayList<JSONObject>();
		for(PurchaseOrderProductBean tempBean :compareList){
			JSONObject tempJob = new JSONObject();
			tempJob.put("productId", tempBean.getProductInfoBean().getProductId());
			tempJob.put("productCode", tempBean.getProductInfoBean().getProductCode());
			tempJob.put("productSize", tempBean.getProductInfoBean().getProductSize());
			tempJob.put("productName", tempBean.getProductInfoBean().getProductName());
			tempJob.put("purchaseNum", tempBean.getPurchaseNum());
			tempJob.put("total", tempBean.getNoStorageNum());
			jsonList.add(tempJob);
		}
		int count = purchaseOrderProductMapper.purchaseAndBeStroeCompareCount(orderId,barCode);
		JSONObject job = new JSONObject();
		job.put("datalist", jsonList); 
		job.put("totalRecords", count);
		System.out.println(job.toString());
		return job.toString();
	}
	
	/**
	 * 提交审核
	 * @param request
	 * @return
	 */
	@RequestMapping(value="/diffreview.do")
	@ResponseBody
	public String diffReview(HttpServletRequest request){
		String  orderId = request.getParameter("orderId");
		String  note = request.getParameter("noteId");
		purchaseOrderMapper.addReviewPurchaseOrder(orderId, note);
		return "";
	}
}
