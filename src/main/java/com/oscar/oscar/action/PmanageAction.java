package com.oscar.oscar.action;

import javax.servlet.http.HttpServletRequest;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.oscar.oscar.bean.ShProductBean;
import com.oscar.oscar.service.ShProductMapper;

@Component
@Controller
@RequestMapping("/pmanage")
public class PmanageAction {
	@Autowired
	ShProductMapper shProductMapper;

	@RequestMapping("/add")
	@ResponseBody
	public String add(HttpServletRequest reqeust) {
		String aproductid = reqeust.getParameter("aproductid");
		String asize = reqeust.getParameter("asize");
		String achangeweiid = reqeust.getParameter("achangeweiid");
		String achangeku = reqeust.getParameter("achangeku");
		String ainputcount = reqeust.getParameter("ainputcount");
		ShProductBean bean = new ShProductBean();
		bean.setProductId(aproductid);
		bean.setProductSize(asize);
		bean.setShSubId(achangeweiid);
		bean.setShId(achangeku);
		bean.setCount(Integer.parseInt(ainputcount));

		shProductMapper.addtostorehouse(bean);
		JSONObject job = new JSONObject();
		job.put("success", true);
		return job.toString();
	}

	@RequestMapping("/edit")
	@ResponseBody
	public String edit(HttpServletRequest reqeust) {
		String aproductid = reqeust.getParameter("productId");
		String asize = reqeust.getParameter("productSize");
		String achangeweiid = reqeust.getParameter("schangeweiid");
		String ainputcount = reqeust.getParameter("lurushuliang");
		ShProductBean bean = new ShProductBean();
		bean.setProductId(aproductid);
		bean.setProductSize(asize);
		bean.setShSubId(achangeweiid);
		bean.setCount(Integer.parseInt(ainputcount));

		shProductMapper.editProductInfo(bean);
		JSONObject job = new JSONObject();
		job.put("success", true);
		return job.toString();
	}

	@RequestMapping("/delete")
	@ResponseBody
	public String delete(HttpServletRequest reqeust) {
		String aproductid = reqeust.getParameter("productId");
		String asize = reqeust.getParameter("productSize");
		String achangeweiid = reqeust.getParameter("schangeweiid");
		ShProductBean bean = new ShProductBean();
		bean.setProductId(aproductid);
		bean.setProductSize(asize);
		bean.setShSubId(achangeweiid);
		shProductMapper.deleteProduct(bean);
		JSONObject job = new JSONObject();
		job.put("success", true);
		return job.toString();
	}
}
