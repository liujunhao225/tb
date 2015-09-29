/**
 * 新增管理员，重置管理员密码，删除用户
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

import com.oscar.oscar.bean.PlatformAdminBean;
import com.oscar.oscar.service.PlatformAdminMapper;
import com.oscar.oscar.util.MD5Utils;

@Component
@Controller
@RequestMapping("/platformAdmin")
public class PlatformAdminAction {

	@Autowired
	private PlatformAdminMapper userMapper;

	@RequestMapping("/index.do")
	public String index() {
		return "/platformAdmin/platformAdmin";
	}

	@RequestMapping("/getUserList.do")
	@ResponseBody
	public String getUserList(HttpServletRequest request) {
		JSONObject json = new JSONObject();
		String userName = request.getParameter("userName");
		String start = request.getParameter("page");
		String limit = request.getParameter("limit");
		int startNum = 0;
		int limitNum = 15;
		if (userName == null || userName.equals("null")) {
			userName = "";
		}
		try {
			limitNum = Integer.parseInt(limit) + startNum;
			startNum = (Integer.parseInt(start) - 1) * limitNum;
		} catch (NumberFormatException e) {
			startNum = 0;
			limitNum = 15;
		}
		List<PlatformAdminBean> list = userMapper.getUserList(userName,
				new RowBounds(startNum, limitNum));
		json.put("datalist", list);
		int totalRecords = userMapper.getUserCount(userName);
		json.put("totalRecords", totalRecords);
		return json.toString();
	}

	@RequestMapping("/addUser.do")
	@ResponseBody
	public String addUser(HttpServletRequest request) {
		JSONObject json = new JSONObject();
		String userName = request.getParameter("userName");
		String pwd = request.getParameter("pwd");
		String role = request.getParameter("role");
		PlatformAdminBean bean = userMapper.getUserByUserName(userName);
		if (bean == null) {
			pwd = MD5Utils.MD5(pwd);
			bean = new PlatformAdminBean();
			bean.setUserName(userName);
			bean.setPassword(pwd);
			bean.setRole(role);
			userMapper.addUser(bean);
			json.put("success", true);
			json.put("status", "200");
			json.put("mess", "用户名添加成功");
		} else {
			json.put("success", true);
			json.put("status", "500");
			json.put("mess", "用户名重复");
		}
		return json.toString();
	}

	@RequestMapping("/updateUser.do")
	@ResponseBody
	public String updateUser(HttpServletRequest request) {
		JSONObject json = new JSONObject();
		String userName = request.getParameter("userName");
		String pwd = request.getParameter("pwd");
		String role = request.getParameter("role");
		PlatformAdminBean bean = userMapper.getUserByUserName(userName);
		if (bean != null) {
			bean = new PlatformAdminBean();
			if (pwd != null && !"".equals(pwd)) {
				pwd = MD5Utils.MD5(pwd);
				bean.setPassword(pwd);
			}

			bean.setUserName(userName);
			bean.setRole(role);
			userMapper.updateUser(bean);
			json.put("success", true);
			json.put("status", "200");
			json.put("mess", "用户名修改成功");
		} else {
			json.put("success", true);
			json.put("status", "500");
			json.put("mess", "用户名不存在");
		}
		return json.toString();
	}

	@RequestMapping("/deleteUser.do")
	@ResponseBody
	public String deleteUser(HttpServletRequest request) {
		JSONObject json = new JSONObject();
		String userName = request.getParameter("userName");
		userMapper.delectUser(userName);
		json.put("success", true);
		json.put("status", "200");
		json.put("mess", "用户名删除成功");
		return json.toString();
	}
}
