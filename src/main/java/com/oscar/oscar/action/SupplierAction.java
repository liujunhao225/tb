/**
 * 供应商操作
 */
package com.oscar.oscar.action;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.ibatis.session.RowBounds;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.oscar.oscar.bean.SupplierBean;
import com.oscar.oscar.service.SupplierMapper;

@Component
@Controller
@RequestMapping("/supply")
public class SupplierAction {

	@Autowired
	private SupplierMapper supplierMapper;

	@RequestMapping("/index.do")
	public String index() {
		return "/supplier/supply";

	}

	@RequestMapping("/list.do")
	@ResponseBody
	public String getShopList(HttpServletRequest request) {
		String supplierName = request.getParameter("supplierName");
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
		JSONObject json = new JSONObject();
		List<SupplierBean> list = supplierMapper.getSupplierList(supplierName,
				new RowBounds(startNum, limitNum));
		int count = supplierMapper.getSupplierListCount(supplierName);
		json.put("datalist", list);
		json.put("totalRecords", count);
		return json.toString();
	}

	@RequestMapping("/add.do")
	@ResponseBody
	public String addShop(HttpServletRequest request) {
		String supplierName = request.getParameter("supplierName");
		String contactPeople = request.getParameter("contactPeople");
		String supplierPhone = request.getParameter("supplierPhone");
		String supplierProfile = request.getParameter("supplierProfile");

		SupplierBean supplierBean = new SupplierBean();
		supplierBean.setSupplierName(supplierName);
		supplierBean.setSupplierPhone(supplierPhone);
		supplierBean.setContactPeople(contactPeople);
		supplierBean.setSupplierProfile(supplierProfile);

		int result = supplierMapper.addSupplier(supplierBean);
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
	public String editShop(HttpServletRequest request) {
		String supplierId = request.getParameter("supplierId");
		String supplierName = request.getParameter("supplierName");
		String contactPeople = request.getParameter("contactPeople");
		String supplierPhone = request.getParameter("supplierPhone");
		String supplierProfile = request.getParameter("supplierProfile");

		SupplierBean supplierBean = new SupplierBean();
		supplierBean.setSupplierId(supplierId);
		supplierBean.setSupplierName(supplierName);
		supplierBean.setSupplierPhone(supplierPhone);
		supplierBean.setContactPeople(contactPeople);
		supplierBean.setSupplierProfile(supplierProfile);

		int result = supplierMapper.editSupplier(supplierBean);
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
	public String deleteShop(HttpServletRequest request) {

		String supplierId = request.getParameter("supplierId");
		int result = supplierMapper.deleteSupplier(supplierId);
		JSONObject job = new JSONObject();
		if (result > 0) {
			job.put("success", true);
			return job.toString();
		}
		job.put("success", false);
		return job.toString();
	}

	@RequestMapping("/kind.do")
	@ResponseBody
	public String getSupplierType() {
		JSONObject job = new JSONObject();
		List<SupplierBean> list = supplierMapper.getSupplierKind();
		List<JSONObject> jlist = new ArrayList<JSONObject>();
		for (SupplierBean bean : list) {
			JSONObject tempjob = new JSONObject();
			tempjob.put("key", bean.getSupplierId());
			tempjob.put("value", bean.getSupplierName());
			jlist.add(tempjob);
		}
		job.put("data", jlist);
		return job.toString();

	}

}
