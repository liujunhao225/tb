package com.oscar.oscar.action;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.oscar.oscar.bean.MenuBean;
import com.oscar.oscar.service.MenuMapper;

@Component
@Controller
@RequestMapping("/menu")
public class AdminMenuAction {

	private Logger logger = Logger.getLogger(AdminMenuAction.class);
	@Autowired
	private MenuMapper menuMapper;

	@RequestMapping("/queryOpt")
	@ResponseBody
	public String queryOpt(HttpServletRequest request) {
		List<MenuBean> allMenuList = null;

		// 取得所有的菜单
		String userName = request.getParameter("username");
		allMenuList = menuMapper.getAdminMenu("");
		JSONArray list = new JSONArray();

		JSONObject rootObj = new JSONObject();
		rootObj.put("text", "Root");
		rootObj.put("cls", "folder");
		rootObj.put("expanded", true);
		// 取得 当前用户所有菜单
		List<MenuBean> adminMenuList = menuMapper.getAdminMenu(userName);
		List<JSONObject> childrenArray = new ArrayList<JSONObject>();
		for (MenuBean opt : allMenuList) {
			JSONObject child = new JSONObject();
			child.put("id", opt.getId());
			child.put("text", opt.getMenuName());
			child.put("leaf", true);

			if (null != adminMenuList && adminMenuList.size() > 0) {
				boolean flag = false;
				for (MenuBean tempMenu : adminMenuList) {
					if (tempMenu.getId() == opt.getId()
							|| tempMenu.getId().equals(opt.getId())) {
						flag = true;
					}
				}
				if (flag) {
					child.put("checked", true);
				} else {
					child.put("checked", false);
				}
			} else {
				child.put("checked", false);
			}
			childrenArray.add(child);
		}
		rootObj.put("children", childrenArray);
		logger.debug("树数据:" + rootObj.toString());
		return rootObj.toString();
	}

	@RequestMapping("/edit")
	@ResponseBody
	public String editAdminMenu(HttpServletRequest request) {
		String menuids[] = request.getParameterValues("menuId");
		String userName = request.getParameter("userName");

		if (menuids != null && menuids.length > 0) {
			List<MenuBean> ids = new ArrayList<MenuBean>();

			for (String str : menuids) {
				MenuBean bean = new MenuBean();
				bean.setId(Integer.parseInt(str));
				bean.setAdminName(userName);
				ids.add(bean);
			}
			// 删除原来所在权限
			menuMapper.removerMenu(userName);
			// 增加新的权限
			int result = menuMapper.addAdminMenu(ids);

		}
		JSONObject job = new JSONObject();
		job.put("success", true);
		return job.toString();
	}

}
