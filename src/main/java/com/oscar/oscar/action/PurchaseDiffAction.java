/**
 * 采购异常处理
 */
package com.oscar.oscar.action;

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
import com.oscar.oscar.bean.PurchaseDiffLogBean;
import com.oscar.oscar.service.ProductInfoMapper;
import com.oscar.oscar.service.PurchaseDiffMapper;
import com.oscar.oscar.util.DateTime;
import com.oscar.oscar.util.SystemDictionary;

@Controller
@Component
@RequestMapping("/diff")
public class PurchaseDiffAction {

	@Autowired
	private PurchaseDiffMapper purchaseDiffMapper;

	@Autowired
	private ProductInfoMapper productInfoMapper;

	@RequestMapping("/index")
	public String index() {
		return "/diff/diff";
	}

	@RequestMapping("/list")
	@ResponseBody
	public String getList(HttpServletRequest request) {
		PurchaseDiffLogBean bean = new PurchaseDiffLogBean();
		String productId = request.getParameter("tproductId");
		String productSize = request.getParameter("tproductSize");

		String state = request.getParameter("tstate");
		String purchaseId = request.getParameter("tpurchaseId");
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
		bean.setProductId(productId);
		bean.setProductSize(productSize);
		bean.setPurchaseId(purchaseId);
		bean.setState(state);
		List<PurchaseDiffLogBean> list = purchaseDiffMapper.getList(bean,
				new RowBounds(startNum, limitNum));
		int count = purchaseDiffMapper.getListCount(bean);

		JSONObject job = new JSONObject();
		job.put("datalist", list);
		job.put("totalRecords", count);
		System.out.println(job.toString());
		return job.toString();
	}

	@RequestMapping("/agree")
	@ResponseBody
	public String agree(HttpServletRequest request) {

		String id = request.getParameter("id");
		String purchaseId = request.getParameter("purchaseId");
		String productId = request.getParameter("productId");
		String productSize = request.getParameter("productSize");
		PurchaseDiffLogBean bean = new PurchaseDiffLogBean();
		// 更新异常日志表中的数据为已处理
		bean.setId(Integer.valueOf(id));
		bean.setState("B");
		bean.setCheckDate(DateTime.format("yyyy-MM-dd hh:mm:ss"));
		int result = purchaseDiffMapper.editLog(bean);

		// 更新product表中的数据为 已入库
		ProductInfoBean productBean = new ProductInfoBean();
		productBean.setProductId(productId);
		productBean.setProductSize(productSize);
//		productBean.setPurchaseOrderId(purchaseId);
//		productBean.setState(SystemDictionary.PurchaseOrderState.ARRIVED);
//		productInfoMapper.editProductInfo(productBean);

		JSONObject job = new JSONObject();
		if (result > 0) {
			job.put("success", true);
			job.toString();
		}
		job.put("success", true);
		return job.toString();
	}

	/**
	 * 
	 * @param request
	 * @return
	 */
	@RequestMapping("/disagree")
	@ResponseBody
	public String disagree(HttpServletRequest request) {

		String id = request.getParameter("id");
		String purchaseId = request.getParameter("purchaseId");
		String productId = request.getParameter("productId");
		String productSize = request.getParameter("productSize");
		PurchaseDiffLogBean bean = new PurchaseDiffLogBean();
		bean.setId(Integer.valueOf(id));
		bean.setCheckDate(DateTime.format("yyyy-MM-dd hh:mm:ss"));
		bean.setState("C");// 删除状态
		int result = purchaseDiffMapper.editLog(bean);
		// 更新product表中的数据为 已入库
		ProductInfoBean productBean = new ProductInfoBean();
		productBean.setProductId(productId);
		productBean.setProductSize(productSize);
//		productBean.setPurchaseOrderId(purchaseId);
//		productInfoMapper.editProductInfo(productBean);

		JSONObject job = new JSONObject();
		if (result > 0) {
			job.put("success", true);
			job.toString();
		}
		job.put("success", true);
		return job.toString();
	}

	@RequestMapping("/getPurchaseAbnormalCount")
	@ResponseBody
	public String getPurchaseAbnormalCount(HttpServletRequest request) {
		int count = purchaseDiffMapper.getPurchaseByState("A");
		JSONObject job = new JSONObject();
		job.put("success", true);
		job.put("count", count);
		return job.toString();
	}
//	@RequestMapping("/list")
//	@ResponseBody
//	public String getList(HttpServletRequest request) {
//		PurchaseDiffLogBean bean = new PurchaseDiffLogBean();
//		String productId = request.getParameter("tproductId");
//		String productSize = request.getParameter("tproductSize");
//
//		String state = request.getParameter("tstate");
//		String purchaseId = request.getParameter("tpurchaseId");
//		String start = request.getParameter("page");
//		String limit = request.getParameter("limit");
//		int startNum = 0;
//		int limitNum = 15;
//		try {
//			limitNum = Integer.parseInt(limit) + startNum;
//			startNum = (Integer.parseInt(start) - 1) * limitNum;
//		} catch (NumberFormatException e) {
//			startNum = 0;
//			limitNum = 15;
//		}
//		bean.setProductId(productId);
//		bean.setProductSize(productSize);
//		bean.setPurchaseId(purchaseId);
//		bean.setState(state);
//		List<PurchaseDiffLogBean> list = purchaseDiffMapper.getList(bean,
//				new RowBounds(startNum, limitNum));
//		int count = purchaseDiffMapper.getListCount(bean);
//
//		JSONObject job = new JSONObject();
//		job.put("datalist", list);
//		job.put("totalRecords", count);
//		System.out.println(job.toString());
//		return job.toString();
//	}
//
//	@RequestMapping("/agree")
//	@ResponseBody
//	public String agree(HttpServletRequest request) {
//
//		String id = request.getParameter("id");
//		String purchaseId = request.getParameter("purchaseId");
//		String productId = request.getParameter("productId");
//		String productSize = request.getParameter("productSize");
//		PurchaseDiffLogBean bean = new PurchaseDiffLogBean();
//		// 更新异常日志表中的数据为已处理
//		bean.setId(Integer.valueOf(id));
//		bean.setState("B");
//		bean.setCheckDate(DateTime.format("yyyy-MM-dd hh:mm:ss"));
//		int result = purchaseDiffMapper.editLog(bean);
//
//		// 更新product表中的数据为 已入库
//		ProductInfoBean productBean = new ProductInfoBean();
//		productBean.setProductId(productId);
//		productBean.setProductSize(productSize);
//		productBean.setPurchaseOrderId(purchaseId);
//		productBean.setState(SystemDictionary.PurchaseOrderState.ARRIVED);
//		productInfoMapper.editProductInfo(productBean);
//
//		JSONObject job = new JSONObject();
//		if (result > 0) {
//			job.put("success", true);
//			job.toString();
//		}
//		job.put("success", true);
//		return job.toString();
//	}
//
//	/**
//	 * 
//	 * @param request
//	 * @return
//	 */
//	@RequestMapping("/disagree")
//	@ResponseBody
//	public String disagree(HttpServletRequest request) {
//
//		String id = request.getParameter("id");
//		String purchaseId = request.getParameter("purchaseId");
//		String productId = request.getParameter("productId");
//		String productSize = request.getParameter("productSize");
//		PurchaseDiffLogBean bean = new PurchaseDiffLogBean();
//		bean.setId(Integer.valueOf(id));
//		bean.setCheckDate(DateTime.format("yyyy-MM-dd hh:mm:ss"));
//		bean.setState("C");// 删除状态
//		int result = purchaseDiffMapper.editLog(bean);
//		// 更新product表中的数据为 已入库
//		ProductInfoBean productBean = new ProductInfoBean();
//		productBean.setProductId(productId);
//		productBean.setProductSize(productSize);
//		productBean.setPurchaseOrderId(purchaseId);
//		productBean.setState(SystemDictionary.PurchaseOrderState.DELETE_FLAG);
//		productInfoMapper.editProductInfo(productBean);
//
//		JSONObject job = new JSONObject();
//		if (result > 0) {
//			job.put("success", true);
//			job.toString();
//		}
//		job.put("success", true);
//		return job.toString();
//	}
//
//	@RequestMapping("/getPurchaseAbnormalCount")
//	@ResponseBody
//	public String getPurchaseAbnormalCount(HttpServletRequest request) {
//
//		int count = purchaseDiffMapper.getPurchaseByState("A");
//		JSONObject job = new JSONObject();
//		job.put("success", true);
//		job.put("count", count);
//		return job.toString();
//	}
}
