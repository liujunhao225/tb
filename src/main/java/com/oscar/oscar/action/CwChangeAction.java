/**
 * 仓位变更各种操作
 */
package com.oscar.oscar.action;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.ibatis.session.RowBounds;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.oscar.oscar.bean.CwchangeBean;
import com.oscar.oscar.bean.ShProductBean;
import com.oscar.oscar.bean.ShSubBean;
import com.oscar.oscar.service.CwChangeMapper;
import com.oscar.oscar.service.ShProductMapper;
import com.oscar.oscar.service.ShSubMapper;

@Component
@Controller
@RequestMapping("/cwchange")
public class CwChangeAction {

	@Autowired
	private ShProductMapper shProductMapper;
	@Autowired
	private ShSubMapper shSubMapper;
	@Autowired
	private CwChangeMapper cwChangeMapper;

	@RequestMapping("/index")
	public String index(HttpServletRequest request) {
		String type = request.getParameter("type");
		if (type != null && "1".equals(type))
			return "/pmanage/pmanage";
		else
			return "/cwchange/cwchange";
	}

	@RequestMapping("/list")
	@ResponseBody
	public String getlist(HttpServletRequest reqeust) {
		String productId = reqeust.getParameter("tproductId");
		String productSize = reqeust.getParameter("tproductSize");
		String shId = reqeust.getParameter("tchangkuid");
		String shSubId = reqeust.getParameter("tchangeweiid");
		String start = reqeust.getParameter("page");
		String limit = reqeust.getParameter("limit");
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
		bean.setProductId(productId);
		bean.setProductSize(productSize);
		bean.setShId(shId);
		bean.setShSubId(shSubId);

		JSONObject json = new JSONObject();

		List<ShProductBean> list = shProductMapper.getallshproduct(bean,
				new RowBounds(startNum, limitNum));
		int count = shProductMapper.getallshproductCount(bean);
		json.put("datalist", list);
		json.put("totalRecords", count);
		return json.toString();
	}

	@RequestMapping(value = "/changeweiinfo")
	@ResponseBody
	public String changeweiinfo(HttpServletRequest request) {
		String changekuid = request.getParameter("changechuid");
		String schangechuid = request.getParameter("schangeweiid");
		if (changekuid == null) {
			changekuid = "wtf";
		}
		List<ShSubBean> list = shSubMapper.getallsubshnotsubId(changekuid,
				schangechuid);
		List<JSONObject> jlist = new ArrayList<JSONObject>();
		for (ShSubBean bean : list) {
			JSONObject tjob = new JSONObject();
			tjob.put("name", bean.getShSubId());
			tjob.put("capacity", bean.getCapacity());
			tjob.put("usedtotal", bean.getUsedTotal());
			jlist.add(tjob);
		}
		JSONObject job = new JSONObject();
		job.put("data", jlist);
		return job.toString();
	}

	@RequestMapping(value = "/input.do")
	@ResponseBody
	public String changeChangeWei(HttpServletRequest request) {
		String productid = request.getParameter("productId");
		String productsize = request.getParameter("productSize");
		String schangeweiid = request.getParameter("schangeweiid");
		String dchangeweiid = request.getParameter("dchangeweiid");
		int lurushuliang = Integer.parseInt(request
				.getParameter("lurushuliang"));

		CwchangeBean bean = new CwchangeBean();
		bean.setShProductId(productid);
		bean.setShProductSize(productsize);
		bean.setShSubId1(schangeweiid);
		bean.setShSubId2(dchangeweiid);
		bean.setWriter(request.getSession().getAttribute("username").toString());
		bean.setCount(lurushuliang);
		//
		JSONObject job = new JSONObject();

		// 根据仓位信息判断是否可以入库2
		ShSubBean subBean = shSubMapper.getShSubBeanDesc(dchangeweiid);
		if (subBean == null) {
			job.put("success", true);
			job.put("code", "2");
			job.put("desc", "没有此仓位！");
			return job.toString();
		}

		if (subBean.getCapacity() - subBean.getUsedTotal() < lurushuliang) {
			job.put("success", true);
			job.put("code", "3");
			job.put("desc", "仓位空间不足，请换仓位或者减少录入数量！");
			return job.toString();
		}
		// 增加申请记录

		cwChangeMapper.addchangelog(bean);
		// 锁订产品 不可以被匹配到
		ShProductBean productBean = new ShProductBean();
		productBean.setProductId(productid);
		productBean.setProductSize(productsize);
		productBean.setShSubId(schangeweiid);
		int result = shProductMapper.lockproduct(productBean);
		job.put("success", true);
		job.put("code", "0000");
		job.put("desc", "提交申请成功!");
		return job.toString();
	}

	@RequestMapping(value = "/getStoreHouseAbnormalCount.do")
	@ResponseBody
	public String getStoreHouseAbnormalCount(HttpServletRequest request) {
		JSONObject job = new JSONObject();
		int count = cwChangeMapper.getCwchangCountByState("A");
		job.put("success", true);
		job.put("count", count);
		return job.toString();
	}
}
