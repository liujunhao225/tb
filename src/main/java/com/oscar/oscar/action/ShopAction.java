/**
 * 店铺列表
 */
package com.oscar.oscar.action;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.oscar.oscar.bean.ShopBean;
import com.oscar.oscar.service.ShopMapper;
import com.oscar.oscar.util.MD5Utils;

@Component
@Controller
@RequestMapping("/shop")
public class ShopAction {

	@Autowired
	private ShopMapper shopMapper;

	@RequestMapping("/index.do")
	public String index() {
		return "/shop/shop";

	}

	@RequestMapping("/list.do")
	@ResponseBody
	public String getShopList(HttpServletRequest request) {
		String shopName = request.getParameter("shopName");
		
		JSONObject json = new JSONObject();
		List<ShopBean> list = shopMapper.getShopList(shopName);
		json.put("datalist", list);
		json.put("totalRecords", list.size());
		return json.toString();
	}

	@RequestMapping("/add.do")
	@ResponseBody
	public String addShop(HttpServletRequest request) {
		String shopName = request.getParameter("shopName");
		String shopLevel = request.getParameter("shopLevel");
		String shopCharger = request.getParameter("shopCharger");

		String shopId = MD5Utils.MD5(shopName);
		ShopBean shopBean = new ShopBean();
		shopBean.setPrivilegeLevel(shopLevel);
		shopBean.setShopCharger(shopCharger);
		shopBean.setShopId(shopId);
		shopBean.setShopName(shopName);
		int result = shopMapper.addShop(shopBean);
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
		String shopName = request.getParameter("shopName");
		String shopLevel = request.getParameter("shopLevel");
		String shopCharger = request.getParameter("shopCharger");
		String shopId = request.getParameter("shopId");

		String newShopId = MD5Utils.MD5(shopName);
		ShopBean shopBean = new ShopBean();
		shopBean.setPrivilegeLevel(shopLevel);
		shopBean.setShopCharger(shopCharger);
		shopBean.setShopId(shopId);
		shopBean.setShopName(shopName);
		int result = shopMapper.editShop(shopBean);
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
		
		String shopId = request.getParameter("shopId");
		int result = shopMapper.deleteShop(shopId);
		JSONObject job = new JSONObject();
		if (result > 0) {
			job.put("success", true);
			return job.toString();
		}
		job.put("success", false);
		return job.toString();
	}
	
}
