/**
 * 仓位管理操作
 */
package com.oscar.oscar.action;

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

import com.oscar.oscar.bean.ShSubBean;
import com.oscar.oscar.bean.StoreHouseBean;
import com.oscar.oscar.service.ShSubMapper;
import com.oscar.oscar.service.StoreHouseMapper;

@Component
@Controller
@RequestMapping("/shSub")
public class ShSubAction {

	@Autowired
	private StoreHouseMapper storeHouseMapper;

	@Autowired
	private ShSubMapper shSubMapper;

	@RequestMapping("/index.do")
	public String index() {
		return "/shsub/shsub";
	}

	@RequestMapping("/getshSubList.do")
	@ResponseBody
	public String getshSubList(HttpServletRequest request) {
		JSONObject json = new JSONObject();
		String shSubId = request.getParameter("shSubId");
		String start = request.getParameter("page");
		String limit = request.getParameter("limit");
		int startNum = 0;
		int limitNum = 15;
		if (shSubId == null || shSubId.equals("null")) {
			shSubId = "";
		}
		try {
			limitNum = Integer.parseInt(limit) + startNum;
			startNum = (Integer.parseInt(start) - 1) * limitNum;
		} catch (NumberFormatException e) {
			startNum = 0;
			limitNum = 15;
		}
		List<ShSubBean> list = shSubMapper.getShSubList(shSubId, new RowBounds(
				startNum, limitNum));
		JSONArray jsonArray = formToJsonArray(list);
		json.put("datalist", jsonArray);
		int totalRecords = shSubMapper.getShSubCount(shSubId);
		json.put("totalRecords", totalRecords);
		return json.toString();
	}

	@RequestMapping("/shSubSave.do")
	@ResponseBody
	public String shSubSave(HttpServletRequest request) {
		JSONObject json = new JSONObject();
		String shSubId = request.getParameter("shSubId");
		String shId = request.getParameter("shId");
//		String capacity = request.getParameter("capacity");
//		String usedTotal = request.getParameter("usedTotal");
		StoreHouseBean bean = storeHouseMapper.getStoreHouseBeanById(shId);
		if (bean != null) {
			ShSubBean sbSub = shSubMapper.getShSubBeanDesc(shSubId);
			if (sbSub == null) {
				sbSub = new ShSubBean();
//				int cap = Integer.parseInt(capacity);
//				int use = Integer.parseInt(usedTotal);
//				if (cap >= use) {
//					sbSub.setCapacity(cap);
					sbSub.setShSubId(shSubId);
//					sbSub.setUsedTotal(use);
					sbSub.setStoreHouseBean(bean);
					int count = shSubMapper.shSubSave(sbSub);
					if (count == 1) {
						json.put("success", true);
						json.put("status", "200");
					} else {
						json.put("success", true);
						json.put("status", "500");
						json.put("mess", "系统繁忙！");
					}
//				} else {
//					json.put("success", true);
//					json.put("status", "500");
//					json.put("mess", "已使用仓位数不能大于未使用的仓位数");
//				}

			} else {
				json.put("success", true);
				json.put("status", "500");
				json.put("mess", "仓位唯一标示重复");
			}

		} else {
			json.put("success", true);
			json.put("status", "500");
			json.put("mess", "仓位所属的仓库不存在");
		}
		return json.toString();
	}

	@RequestMapping("/shSubUpdate.do")
	@ResponseBody
	public String shSubUpdate(HttpServletRequest request) {
		JSONObject json = new JSONObject();
		String shSubId = request.getParameter("shSubId");
		String shId = request.getParameter("shId");
//		String capacity = request.getParameter("capacity");
//		String usedTotal = request.getParameter("usedTotal");
		StoreHouseBean bean = storeHouseMapper.getStoreHouseBeanById(shId);
		if (bean != null) {
//			int cap = Integer.parseInt(capacity);
//			int use = Integer.parseInt(usedTotal);
//			if (cap >= use) {
				int count = shSubMapper.shSubUpdate(shId, shSubId);
				if (count == 1) {
					json.put("success", true);
					json.put("status", "200");
				} else {
					json.put("success", true);
					json.put("status", "500");
					json.put("mess", "系统繁忙！");
				}
//			} else {
//				json.put("success", true);
//				json.put("status", "500");
//				json.put("mess", "已使用仓位数不能大于未使用的仓位数");
//			}

		} else {
			json.put("success", true);
			json.put("status", "500");
			json.put("mess", "仓位所属的仓库不存在");
		}
		return json.toString();
	}

	@RequestMapping("/shSubDelete.do")
	@ResponseBody
	public String shSubDelete(HttpServletRequest request) {
		JSONObject json = new JSONObject();
		String shSubId = request.getParameter("shSubId");
		shSubMapper.shSubDelete(shSubId);
		json.put("success", true);
		json.put("status", "200");
		return json.toString();
	}
	
	@RequestMapping("/getshSubByShId.do")
	@ResponseBody
	public String getshSubByShId(HttpServletRequest request) {
		JSONObject json = new JSONObject();
		JSONArray jsonArray = new JSONArray();
		String shId = request.getParameter("shId");
		List<ShSubBean> list = shSubMapper.getallsubshbyshid(shId);
		if(list != null && !list.isEmpty())
		{
			for (ShSubBean shSubBean : list) {
				JSONObject jsonObject = new JSONObject();
				jsonObject.put("shSubId", shSubBean.getShSubId());
				jsonArray.put(jsonObject);
			}
		}
		json.put("list", jsonArray);
		return json.toString();
	}
	public JSONArray formToJsonArray(List<ShSubBean> list) {
		JSONArray jsonArray = new JSONArray();
		if (list != null && !list.isEmpty()) {
			for (int i = 0; i < list.size(); i++) {
				JSONObject json = new JSONObject();
				ShSubBean bean = list.get(i);
				json.put("shSubId", bean.getShSubId());
				json.put("shId", bean.getShId());
				json.put("capacity", bean.getCapacity());
				json.put("usedTotal", bean.getUsedTotal());
				StoreHouseBean storeHouseBean = bean.getStoreHouseBean();
				if (storeHouseBean != null) {
					json.put("shName", storeHouseBean.getShName());
				}
				jsonArray.put(json);
			}
		}
		return jsonArray;
	}
}
