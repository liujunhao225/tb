/**
 * 登录操作
 */
package com.oscar.oscar.action;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.oscar.oscar.bean.MenuBean;
import com.oscar.oscar.bean.User;
import com.oscar.oscar.service.MenuMapper;
import com.oscar.oscar.service.UserMapper;
import com.oscar.oscar.util.MD5Utils;

@Component
@Controller
@RequestMapping("/login")
public class LoginAction {
	private Logger log = Logger.getLogger(LoginAction.class);

	@Autowired
	private UserMapper usermap;

	@Autowired
	private MenuMapper menuMapper;
	
	
	@RequestMapping(value = "/index")
	@ResponseBody
	public String index(HttpServletRequest request) {
//		System.out.println("login");
//		User user = new User();
//		user.setUsername("tom");
//		List<User> list = usermap.getUserList(new RowBounds(0, 1), user);
//		System.out.println(user.getUsername());
//		log.error("login");
		return "login";
	}

	@RequestMapping(value = "/login", produces = "application/json;charset=utf-8")
	@ResponseBody
	public String login(HttpServletRequest request) {
		String username = request.getParameter("userName");
		String password = request.getParameter("password");

		User user = usermap.getUser(username);
		JSONObject job = new JSONObject();
		if (user == null) {
			job.put("errorType", 2);
		} else if (!checkPassword(password, user.getPassword())) {
			job.put("errorType", 3);
		} else {
			job.put("success", true);
			request.getSession().setAttribute("username", username);
			request.getSession().setAttribute("usertype", user.getRole());
		}
		return job.toString();
	}

	@RequestMapping(value = "/toLogin")
	public String todoLogin(HttpServletRequest request) {
		
		return "/login/login";

	}

	@RequestMapping("/toIndex")
	public String main(HttpServletRequest request,ModelMap map) {
		Object  userNameObj = request.getSession().getAttribute("username");
		if(userNameObj ==null){
			return "/login/login";
		}
		String userName = userNameObj.toString();
		if("admin".equals(userName)){
			return "index_admin";
		}
		// 处理操作权限
		List<Map<String,Object>> list = getUserOperations(userName);
		map.put("menu", list);
		return "index";
		
	}
	@RequestMapping("/toAdminIndex")
	public String adminmain(HttpServletRequest request) {
		return "index_admin";
	}

	@RequestMapping(value = "/logout")
	public String logOut(HttpServletRequest request) {
		request.getSession().invalidate();
		return "/login/login";
	}

	private boolean checkPassword(String password1, String password2) {
		System.out.println(MD5Utils.MD5(password1));
		if (MD5Utils.MD5(password1).equals(password2)) {
			return true;
		}
		return false;
	}
	
	/**
	 * 取得所有的操作权限
	 * @param admin
	 * @return
	 */
	@SuppressWarnings("rawtypes")
	private List<Map<String,Object>> getUserOperations(String admin) {
		List<Map<String,Object>> menuList = new ArrayList<Map<String,Object>>();
		List<MenuBean> fatherList = menuMapper.getAdminMenu(admin);
		for(MenuBean fatherBean :fatherList){
			Map<String,Object> tempFatherMap = new HashMap<String, Object>();
			int id = fatherBean.getId();
			tempFatherMap.put("id", fatherBean.getId());
			tempFatherMap.put("name", fatherBean.getMenuName());
			tempFatherMap.put("url", fatherBean.getMenuUrl());
			List<Map> sonList = new ArrayList<Map>();
			List<MenuBean> sonMenuList = menuMapper.getsubMenu(fatherBean.getId());
			
			for(MenuBean sonBean:sonMenuList){
				Map<String,Object> tempSonMap = new HashMap<String, Object>();
				tempSonMap.put("id", sonBean.getId());
				tempSonMap.put("name", sonBean.getMenuName());
				tempSonMap.put("url", sonBean.getMenuUrl());
				sonList.add(tempSonMap);
			}
			tempFatherMap.put("son", sonList);
			menuList.add(tempFatherMap);
		}
		
		return menuList;
	}

}
