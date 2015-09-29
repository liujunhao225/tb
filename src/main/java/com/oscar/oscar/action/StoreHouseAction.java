/**
 * 仓库操作
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

import com.oscar.oscar.bean.StoreHouseBean;
import com.oscar.oscar.service.ShSubMapper;
import com.oscar.oscar.service.StoreHouseMapper;
import com.oscar.oscar.util.MD5Utils;

@Component
@Controller
@RequestMapping("/storeHouse")
public class StoreHouseAction {
	
	@Autowired
	private StoreHouseMapper storeHouseMapper;
	
	@Autowired
	private ShSubMapper shSubMapper;
	
	@RequestMapping("/index.do")
	public String index() {
		return "/storehouse/storehouse";
	}
	
	@RequestMapping("/getStoreHouseList.do")
	@ResponseBody
	public String getStoreHouseList(HttpServletRequest request){
		JSONObject json = new JSONObject();
		String shName = request.getParameter("shName");
		String start = request.getParameter("page");
		String limit = request.getParameter("limit");
		int startNum = 0;
		int limitNum = 15;
		if(shName == null||shName.equals("null"))
		{
			shName = "";
		}
		try {
			limitNum = Integer.parseInt(limit) + startNum;
			startNum = (Integer.parseInt(start)-1)*limitNum;
		} catch (NumberFormatException e) {
			startNum = 0;
			limitNum = 15;
		}
		List<StoreHouseBean> list = storeHouseMapper.getStoreHouseList(shName,new RowBounds(startNum,limitNum));
		json.put("datalist", list);
		int totalRecords = storeHouseMapper.getStoreHouseCount(shName);
		json.put("totalRecords", totalRecords);
		System.out.println(json.toString());
		return json.toString();
	}
	
	@RequestMapping("/storeHouseSave.do")
	@ResponseBody
	public String storeHouseSave(HttpServletRequest request){
		JSONObject json = new JSONObject();
		String shName = request.getParameter("shName");
		String shType = request.getParameter("shType");
		String shAddress = request.getParameter("shAddress");
		String privilegeLevel = request.getParameter("privilegeLevel");
		StoreHouseBean bean = storeHouseMapper.getStoreHouseBeanDesc(shName);
		if(bean == null)
		{
			String shId = MD5Utils.MD5(shName);
			bean = new StoreHouseBean();
			bean.setShId(shId);
			bean.setShName(shName);
			bean.setShType(shType);
			bean.setShAddress(shAddress);
			bean.setPrivilegeLevel(Integer.parseInt(privilegeLevel));
			int count = storeHouseMapper.storeHouseSave(bean);
			if(count == 1)
			{
				json.put("success", true);
				json.put("status", "200");
			}
			else
			{
				json.put("success", true);
				json.put("status", "500");
				json.put("mess", "系统繁忙！");
			}
		}
		else
		{
			json.put("success", true);
			json.put("status", "500");
			json.put("mess", "仓库名称不能重复");
		}
		return json.toString();
	}
	
	@RequestMapping("/storeHouseUpdate.do")
	@ResponseBody
	public String storeHouseUpdate(HttpServletRequest request){
		JSONObject json = new JSONObject();
		String oldShId = request.getParameter("shId");
		String shName = request.getParameter("shName");
		String shType = request.getParameter("shType");
		String shAddress = request.getParameter("shAddress");
		String privilegeLevel = request.getParameter("privilegeLevel");
		StoreHouseBean bean = storeHouseMapper.getStoreHouseBeanDesc(shName);
		if(bean == null||bean.getShName().equals(shName))
		{
			String shId = MD5Utils.MD5(shName);
			int count = storeHouseMapper.storeHouseUpdate(shId,shName,shType,shAddress,Integer.parseInt(privilegeLevel),oldShId);
			if(count == 1)
			{
				shSubMapper.updateShSubByShId(shId, oldShId);
				json.put("success", true);
				json.put("status", "200");
			}
			else
			{
				json.put("success", true);
				json.put("status", "500");
				json.put("mess", "系统繁忙！");
			}
		}
		else
		{
			json.put("success", true);
			json.put("status", "500");
			json.put("mess", "仓库名称不能重复");
		}
		return json.toString();
	}
	
	@RequestMapping("/storeHouseDelete.do")
	@ResponseBody
	public String storeHouseDelete(HttpServletRequest request){
		JSONObject json = new JSONObject();
		String shId = request.getParameter("shId");
		storeHouseMapper.storeHouseDelete(shId);
		shSubMapper.deleteShSubByShId(shId);
		json.put("success", true);
		json.put("status", "200");
		return json.toString();
	}
	
	@RequestMapping("/getLocalStoreHouse.do")
	@ResponseBody
	public String getLocalStoreHouse(HttpServletRequest request){
		JSONObject json = new JSONObject();
		JSONArray jsonArray = new JSONArray();
		List<StoreHouseBean> list = storeHouseMapper.getLocalStoreHouse();
		if(list != null && !list.isEmpty())
		{
			for (StoreHouseBean storeHouseBean : list) {
				JSONObject jsonObject = new JSONObject();
				jsonObject.put("shId", storeHouseBean.getShId());
				jsonObject.put("shName", storeHouseBean.getShName());
				jsonArray.put(jsonObject);
			}
		}
		json.put("list", jsonArray);
		System.out.println(json.toString());
		return json.toString();
	}
	
	@RequestMapping("/storekind.do")
	@ResponseBody
	public String getStoreKind(HttpServletRequest request){
		JSONObject json = new JSONObject();
		JSONArray jsonArray = new JSONArray();
		List<StoreHouseBean> list = storeHouseMapper.getAllStore();
		if(list != null && !list.isEmpty())
		{
			for (StoreHouseBean storeHouseBean : list) {
				JSONObject jsonObject = new JSONObject();
				jsonObject.put("shId", storeHouseBean.getShId());
				jsonObject.put("shName", storeHouseBean.getShName());
				jsonArray.put(jsonObject);
			}
		}
		json.put("data", jsonArray);
		System.out.println(json.toString());
		return json.toString();
	}
}
