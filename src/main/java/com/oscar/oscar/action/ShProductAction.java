package com.oscar.oscar.action;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.oscar.oscar.service.ShProductMapper;

@Component
@Controller
@RequestMapping("/shProduct")
public class ShProductAction {

	@Autowired
	private ShProductMapper shProductMapper;
	
	@RequestMapping("/index.do")
	public String index() {
		return "/shoporder/shoporder";
	}
}
