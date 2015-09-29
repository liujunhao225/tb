/**
 * 移库审批操作
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

import com.oscar.oscar.bean.CwchangeBean;
import com.oscar.oscar.bean.ShProductBean;
import com.oscar.oscar.bean.ShSubBean;
import com.oscar.oscar.service.CwChangeMapper;
import com.oscar.oscar.service.ShProductMapper;
import com.oscar.oscar.service.ShSubMapper;

@Component
@Controller
@RequestMapping("/movestore")
public class MoveStoreReviewAction {

	@Autowired
	private CwChangeMapper cwChangeMapper;
	@Autowired
	private ShProductMapper shProductMapper;
	@Autowired
	private ShSubMapper shSubMapper;

	@RequestMapping("/index")
	public String index() {

		return "/review/review";
	}

	@RequestMapping("/list")
	@ResponseBody
	public String getList(HttpServletRequest reqeust) {
		String productId = reqeust.getParameter("tproductId");
		String productSize = reqeust.getParameter("tproductSize");
		String state = reqeust.getParameter("tstate");
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
		CwchangeBean bean = new CwchangeBean();
		bean.setShProductId(productId);
		bean.setShProductSize(productSize);
		bean.setState(state);
		JSONObject json = new JSONObject();
		List<CwchangeBean> list = cwChangeMapper.getChangeList(bean,
				new RowBounds(startNum, limitNum));
		int count = cwChangeMapper.getChangeListCount(bean);
		json.put("datalist", list);
		json.put("totalRecords", count);
		return json.toString();
	}

	@RequestMapping("/agree")
	@ResponseBody
	public String agree(HttpServletRequest request) {
		String operaterId = request.getParameter("id");

		JSONObject job = new JSONObject();
		// 获得bean的信息
		CwchangeBean cwbean = cwChangeMapper.getBeanInfo(operaterId);
		String scw = cwbean.getShSubId1();
		String dcw = cwbean.getShSubId2();
		String productId = cwbean.getShProductId();
		String productSize = cwbean.getShProductSize();
		int productCount = cwbean.getCount();
		// 将原库中的数量减少
		ShProductBean shbean = new ShProductBean();
		shbean.setCount(-productCount);//减操作
		shbean.setProductId(productId);
		shbean.setProductSize(productSize);
		shbean.setShSubId(scw);
		shbean.setState("A");// 更新为可用状态
		int result = shProductMapper.updatestorehouse(shbean);
		if (result <= 0) {
			return job.toString();
		}
		// 将目标仓库商品数量增加
		
		//根据仓位获得仓库信息
		ShSubBean subBean = shSubMapper.getShSubBeanDesc(dcw);
		shbean.setShSubId(dcw);
		shbean.setCount(productCount);//加操作
		ShProductBean shbean2 = shProductMapper.getproductstorehouse(shbean);
		if(shbean2==null){
			shbean.setShId(subBean.getShId());
			result = shProductMapper.addtostorehouse(shbean);
		}else{
			result = shProductMapper.updatestorehouse(shbean);
		}
		if (result <= 0) {
			return job.toString();
		}
		// 更新bean的状态 ，操作时间
		result = cwChangeMapper.editBean(operaterId,"B");
		return job.toString();
	}

	@RequestMapping("/disagree")
	@ResponseBody
	public String disagree(HttpServletRequest request) {
		
		String productId = request.getParameter("productId");
		String productSize = request.getParameter("productSize");
		String shSubId = request.getParameter("shSubId");
		String operaterid = request.getParameter("id");
		// 更新bean的状态 ，操作时间
		int	result = cwChangeMapper.editBean(operaterid,"B");
		
		ShProductBean bean = new ShProductBean();
		bean.setProductId(productId);
		bean.setProductSize(productSize);
		bean.setShSubId(shSubId);
		 result = shProductMapper.unlockproduct(bean);
		JSONObject job = new JSONObject();
		
		if(result <0){
			job.put("success", true);
		}
		job.put("success", false);
		return job.toString();

	}

}
