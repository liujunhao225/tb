/**
 * 仓位管理操作
 */
package com.oscar.oscar.action;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.ibatis.session.RowBounds;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.oscar.oscar.bean.ShProductBean;
import com.oscar.oscar.bean.ShSubBean;
import com.oscar.oscar.bean.StoreHouseBean;
import com.oscar.oscar.service.ShProductMapper;
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

	@Autowired
	private ShProductMapper shProductMapper;

	private static Logger logger = Logger.getLogger(ShSubAction.class);

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
		// String capacity = request.getParameter("capacity");
		// String usedTotal = request.getParameter("usedTotal");
		StoreHouseBean bean = storeHouseMapper.getStoreHouseBeanById(shId);
		if (bean != null) {
			ShSubBean sbSub = shSubMapper.getShSubBeanDesc(shSubId);
			if (sbSub == null) {
				sbSub = new ShSubBean();
				// int cap = Integer.parseInt(capacity);
				// int use = Integer.parseInt(usedTotal);
				// if (cap >= use) {
				// sbSub.setCapacity(cap);
				sbSub.setShSubId(shSubId);
				// sbSub.setUsedTotal(use);
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
				// } else {
				// json.put("success", true);
				// json.put("status", "500");
				// json.put("mess", "已使用仓位数不能大于未使用的仓位数");
				// }

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
		// String capacity = request.getParameter("capacity");
		// String usedTotal = request.getParameter("usedTotal");
		StoreHouseBean bean = storeHouseMapper.getStoreHouseBeanById(shId);
		if (bean != null) {
			// int cap = Integer.parseInt(capacity);
			// int use = Integer.parseInt(usedTotal);
			// if (cap >= use) {
			int count = shSubMapper.shSubUpdate(shId, shSubId);
			if (count == 1) {
				json.put("success", true);
				json.put("status", "200");
			} else {
				json.put("success", true);
				json.put("status", "500");
				json.put("mess", "系统繁忙！");
			}
			// } else {
			// json.put("success", true);
			// json.put("status", "500");
			// json.put("mess", "已使用仓位数不能大于未使用的仓位数");
			// }

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
		if (list != null && !list.isEmpty()) {
			for (ShSubBean shSubBean : list) {
				JSONObject jsonObject = new JSONObject();
				jsonObject.put("shSubId", shSubBean.getShSubId());
				jsonArray.put(jsonObject);
			}
		}
		json.put("list", jsonArray);
		return json.toString();
	}

	/**
	 * 仓位库存列表
	 * 
	 * @param request
	 * @return
	 */
	@RequestMapping("/shsubProduct.do")
	@ResponseBody
	public String getproductList(HttpServletRequest request) {
		JSONObject json = new JSONObject();
		String shSubid = request.getParameter("shsubid");
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
		ShProductBean bean = new ShProductBean();
		bean.setShSubId(shSubid);

		logger.info("shSubid是：" + shSubid);
		List<ShProductBean> list = shProductMapper.getallshproduct(bean,
				new RowBounds(startNum, limitNum));
		json.put("datalist", list);
		int totalRecords = shProductMapper.getallshproductCount(bean);
		json.put("totalRecords", totalRecords);
		System.out.println("list:"+json.toString());
		return json.toString();
	}

	@ResponseBody
	@RequestMapping("/countupdate.do")
	public String updateCount(HttpServletRequest request) {
		JSONObject job = new JSONObject();
		String count = request.getParameter("count");
		String shSubId = request.getParameter("shSubId");
		String productCode = request.getParameter("productCode");
		String desshid = request.getParameter("desshid");

		// 整理库存
		if (count != null && count.length() > 0) {

			ShProductBean bean = new ShProductBean();
			bean.setCount(Integer.parseInt(count));
			bean.setShSubId(shSubId);
			bean.setProductCode(productCode);
			int result = shProductMapper.subShProductCountManage(bean);
			job.put("result", result);
		} else if (desshid != null && desshid.length() > 0) {
			// 取得仓位商品数量
			ShProductBean sbean = new ShProductBean();
			sbean.setShSubId(shSubId);
			sbean.setProductCode(productCode);
			sbean = shProductMapper.getproductstorehousebaseproductCode(sbean);
			// 取得转移仓位
			ShProductBean dbean = new ShProductBean();
			dbean.setShSubId(desshid);
			dbean.setProductCode(productCode);
			dbean = shProductMapper.getproductstorehousebaseproductCode(dbean);

			if (dbean == null) {
				// 插入移
				ShSubBean shsubbean = shSubMapper.getShSubBeanDesc(desshid);
				sbean.setShSubId(desshid);
				sbean.setShId(shsubbean.getShId());
				shProductMapper.addtostorehouse(sbean);
			} else {
				// 更新转移仓位数量
				dbean.setCount(sbean.getCount());
				shProductMapper.updatestorehouseBaseProductCode(dbean);
			}

			// 删除此条记录
			sbean.setShSubId(shSubId);
			shProductMapper.deleteProduct(sbean);

		}

		return job.toString();

	}

	@RequestMapping(value = "/changeweiinfo")
	@ResponseBody
	public String changeweiinfo(HttpServletRequest request) {
		String changekuid = request.getParameter("changechuid");
		String schangechuid = request.getParameter("schangeweiid");
		if (changekuid == null) {
			changekuid = "wtf";
		}
		changekuid = "";
		List<ShSubBean> list = shSubMapper.getallsubshnotsubId(changekuid,
				schangechuid);
		List<JSONObject> jlist = new ArrayList<JSONObject>();
		for (ShSubBean bean : list) {
			JSONObject tjob = new JSONObject();
			tjob.put("id", bean.getShSubId());
			tjob.put("shSubId", bean.getShSubId());
			jlist.add(tjob);
		}
		JSONObject job = new JSONObject();
		job.put("data", jlist);
		return job.toString();
	}

	@RequestMapping("/transfer.do")
	@ResponseBody
	public String transfer(HttpServletRequest request) {
		String ssubShid = request.getParameter("sshsubid");
		String dsubShid = request.getParameter("dshsubid");
		// 获取所有原仓位数据
		List<ShProductBean> productlist = shProductMapper
				.getShProductBeanByShSubId(ssubShid);
		ShSubBean shsubbean = shSubMapper.getShSubBeanDesc(dsubShid);
		
		for (ShProductBean bean : productlist) {

			String shSubId = bean.getShSubId();
			String productCode = bean.getProductCode();

			// 取得转移仓位
			ShProductBean dbean = new ShProductBean();
			dbean.setShSubId(dsubShid);
			dbean.setProductCode(productCode);
			dbean = shProductMapper.getproductstorehousebaseproductCode(dbean);

			if (dbean == null) {
				// 插入移
				bean.setShSubId(dsubShid);
				bean.setShId(shsubbean.getShId());
				shProductMapper.addtostorehouse(bean);
			} else {
				// 更新转移仓位数量
				dbean.setCount(bean.getCount());
				shProductMapper.updatestorehouseBaseProductCode(dbean);
			}
			// 删除此条记录
			bean.setShSubId(shSubId);
			shProductMapper.deleteProduct(bean);
		}
		JSONObject job = new JSONObject();
		job.put("success", true);
		return job.toString();

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
