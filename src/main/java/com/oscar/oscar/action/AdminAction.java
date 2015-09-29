/***
 * 管理员变更密码
 * 
 */
package com.oscar.oscar.action;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.oscar.oscar.bean.User;
import com.oscar.oscar.service.UserMapper;
import com.oscar.oscar.util.MD5Utils;

@Component
@Controller
@RequestMapping("/myadmin")
public class AdminAction {

	private static Logger logger = Logger.getLogger(AdminAction.class);

	@Autowired
	private UserMapper userMapper;

	@RequestMapping(value = "/changePwd.do", produces = "application/json;charset=utf-8")
	@ResponseBody
	public String changePsd(HttpServletRequest request) {

		String oldPsd = request.getParameter("oldPwd");
		String newPwd = request.getParameter("newPwd");
		User user = userMapper.getUser(request.getSession()
				.getAttribute("username").toString());
		JSONObject job = new JSONObject();
		if (user == null) {
			job.put("result", "2");
		} else if (!checkPassword(oldPsd, user.getPassword())) {
			job.put("result", "3");
		} else {
			job.put("success", true);
			userMapper.changePsd(MD5Utils.MD5(newPwd));
		}
		return job.toString();
	}

	private boolean checkPassword(String password1, String password2) {
		System.out.println(MD5Utils.MD5(password1));
		if (MD5Utils.MD5(password1).equals(password2)) {
			return true;
		}
		return false;
	}

}
