package com.oscar.oscar.action;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.oscar.oscar.bean.InitBean;
import com.oscar.oscar.service.InitTableMapper;

@Component
@Controller
@RequestMapping(value="/sys_init")
public class SystemInitAction {
	
	@Autowired
	private InitTableMapper initTableMapper;
	
	@RequestMapping("/index.do")
	public String index(){
		return "/init/init";
	}
	
	@RequestMapping("/list.do")
	@ResponseBody
	public String getList(){
		List<InitBean> list = initTableMapper.getInitList();
		JSONObject job = new JSONObject();
		job.put("datalist", list);
		return job.toString();
	}
	@ResponseBody
	@RequestMapping("/init.do")
	public String doInitAction(HttpServletRequest request){
		System.out.println(request.getParameter("selectid"));
		String selectids = request.getParameter("selectid");
		String[] tablesId = selectids.split(",");
		for(String id:tablesId){
			InitBean tempBean =new InitBean();
			tempBean.setId(id);
			//取得表名
			tempBean= initTableMapper.getTableName(tempBean);
			if(tempBean==null)
				continue;
			//清空数据
			initTableMapper.clearTable(tempBean);
		}
		return "";
		
	}

}
