package com.oscar.oscar.util;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.jms.Session;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;

public class SecurityServlet extends HttpServlet implements Filter {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private static Map<String, String> forbiddenUrl = new HashMap<String, String>();// 需要登录才可以访问的链接

	public void init(FilterConfig filterConfig) throws ServletException {

		forbiddenUrl.put("myadmin", "/myadmin");
		forbiddenUrl.put("bestore", "/bestore");
		forbiddenUrl.put("product", "/product");
		forbiddenUrl.put("purchase", "/purchase");
		forbiddenUrl.put("shop", "/shop");
		forbiddenUrl.put("shopOrder", "/shopOrder");
		forbiddenUrl.put("shopOrderDiffLog", "/shopOrderDiffLog");
		forbiddenUrl.put("shProduct", "/shProduct");
		forbiddenUrl.put("shSub", "/shSub");
		forbiddenUrl.put("storeHouse", "/storeHouse");
		forbiddenUrl.put("supply", "/supply");
		forbiddenUrl.put("product", "/product");
		forbiddenUrl.put("product", "/product");
		forbiddenUrl.put("specialstore", "/specialstore");
		forbiddenUrl.put("movestore", "/movestore");
		forbiddenUrl.put("pmanage", "/pmanage");
	}

	public void doFilter(ServletRequest args0, ServletResponse args1,
			FilterChain chain) throws IOException, ServletException {
		HttpServletRequest request = (HttpServletRequest) args0;
		request.getSession();
		HttpServletResponse response = (HttpServletResponse) args1;
		String tempUrl = request.getServletPath().substring(0,
				request.getServletPath().indexOf("/", 2));
		if (forbiddenUrl.containsValue(tempUrl)) {
			Object obj = request.getSession().getAttribute("username");
			if (obj == null || StringUtils.isEmpty(obj.toString())) {
				response.sendRedirect("/oscar/login/toLogin.do");
			}

		}
		chain.doFilter(request, response);

	}
}
