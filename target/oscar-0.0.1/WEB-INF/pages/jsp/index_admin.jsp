<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
<title>实物进销存-主控制面板</title>
<link rel="stylesheet" type="text/css"
	href="/oscar/public/styles/resources/css/ext-all.css" />
<script type="text/javascript"
	src="/oscar/public/js/jquery/jquery.min.js"></script>
<script type="text/javascript" src="/oscar/public/js/ext/ext-all.js"></script>
<script type="text/javascript" src="/oscar/public/js/oscar-main.js"></script>
<script type="text/javascript" src="/oscar/public/js/oscar-view.js"></script>
<script type="text/javascript" src="/oscar/public/js/oscar-style.js"></script>
<script type="text/javascript" src="/oscar/public/js/ext/hashmap.js"></script>
<link rel="stylesheet" type="text/css"
	href="/oscar/public/styles/oscar-main.css" />
</head>
<body>
	<!-- 
		1、在本页面中，只要给a标签添加class='dsp-action'的属性，
		        并设置其它href属性值为：#goto:<URL>即可以定义一个以IFRAME打开的页面
		2、对于整个页面每个部位的组件对象操作方法定义在 oscar-view.js文件中
	 -->
	<div id="dsp-banner">
		<div style="background: #0B419B;">
			<table width="100%" border="0">
				<tr>
					<td width="84">
						<!-- <img src="/oscar/public/images/banner-logo.png"
						align="left" valign="baseline" /> --> <a
						style="display: block; height: 100px; width: 80px;"></a>
					</td>
					<td valign="bottom">
						<div style="margin-bottom: 8px;">
							<span style="color: white"> <!-- <b>无线城市</b> --> <br />
							</span> <span style="color: white; font-size: 28px;"><b>实物进销存管理平台</b><sub>(v1.0)</sub></span>
						</div>
					</td>
					<td align="right" valign="bottom">
						<table border="0" style="margin-right: 10px;">
							<tr>
								<td>
									<div class="topnav">
										<span class="dsp-loginUser-Info-welcome">欢迎您,</span><span
											class="dsp-loginUser-Info" id="dsp-userUser-changeInfo">${username}</span>
										|<span class="dsp-loginUser-Info" id="dsp-loginUser-changePwd">修改密码</span>
										| <span class="dsp-loginUser-Info" id="dsp-loginUser-exit"><a
											href="/oscar/login/logout.do" style="color: #fff;">退出系统</a></span>
										<!--| <a href="#goto:http://www.baidu.com/" class="dsp-action">帮助</a> -->
									</div>
								</td>
							</tr>
						</table>
					</td>
				</tr>
			</table>
		</div>
	</div>
	<!--导航菜单项定义开始-->
	<!--Demo-->

	<div id="dsp-menu-1" class="dsp-navmenu" caption="基础数据维护">
		<div class="dsp-menu-items">
			<ul>
				<li><a href="#goto:/oscar/supply/index.do" class="dsp-action">店铺信息管理</a></li>
				<li><a href="#goto:/oscar/shop/index.do" class="dsp-action">供应商管理</a></li>
				<li><a href="#goto:/oscar/storeHouse/index.do"
					class="dsp-action">仓库信息管理</a></li>
				<li><a href="#goto:/oscar/shSub/index.do" class="dsp-action">仓位信息管理</a></li>
				<li><a href="#goto:/oscar/product/index.do" class="dsp-action">商品信息管理</a></li>
			</ul>
		</div>
	</div>
	<!-- <div id="dsp-menu-2" class="dsp-navmenu" caption="用户与权限">
		<div class="dsp-menu-items">
			<ul>
				<li><a href="#goto:/oscar/platformAdmin/index.do"
					class="dsp-action">用户管理</a></li>
			</ul>
		</div>
	</div> -->
	<div id="dsp-menu-3" class="dsp-navmenu" caption="采购单与仓库管理 ">
		<div class="dsp-menu-items">
			<ul>
				<li><a href="#goto:/oscar/specialstore/index.do"
					class="dsp-action">库存管理</a></li>
			<!-- 	<li><a href="#goto:/oscar/specialstore/index.do"
					class="dsp-action">增量式导入(办公室)</a></li>
				<li><a href="#goto:/oscar/specialstore/index.do"
					class="dsp-action">清空导入(郑州本地)</a></li> -->
				<li><a href="#goto:/oscar/purchase/index.do" class="dsp-action">采购单</a></li>
				<li><a href="#goto:/oscar/bestore/index.do" class="dsp-action">采购验收入库</a></li>
				<!-- <li><a href="#goto:/oscar/cwchange/index.do?type=1" class="dsp-action">仓位商品管理</a></li>
				<li><a href="#goto:/oscar/cwchange/index.do?type=2" class="dsp-action">仓位信息调整</a></li> -->
				<!-- <li><a href="#goto:/oscar/specialstore/index.do"
					class="dsp-action">异地库导入</a></li> -->
			</ul>
		</div>
	</div>
	<div id="dsp-menu-4" class="dsp-navmenu" caption="订单管理 ">
		<div class="dsp-menu-items">
			<ul>
				<li><a href="#goto:/oscar/shopOrder/index.do"
					class="dsp-action">客户订单录入</a></li>
				<li><a href="#goto:/oscar/shopOrder/express.do"
					class="dsp-action">快递单号导入</a></li>
			</ul>
		</div>
	</div>
	<!-- <div id="dsp-menu-5" class="dsp-navmenu" caption="管理审核">
		<div class="dsp-menu-items">
			<ul>
				<li><a href="#goto:/oscar/diff/index.do" class="dsp-action">采购异常审核</a></li>
				<li><a href="#goto:/oscar/shopOrder/verify.do"
					class="dsp-action">订单匹配异常审核</a></li>
				<li><a href="#goto:/oscar/movestore/index.do"
					class="dsp-action">移库操作审核</a></li>
			</ul>
		</div>
	</div> -->
	<!--导航菜单项定义结束-->
	<!-- 控制面板（数据源平台首页） -->
	<div id="welcome" class="x-hide-display">
		<jsp:include page="welcome/welcome.jsp"></jsp:include>
		<div class="main-wrapper" style="display: none;">
			放置系统的一些快捷方式。 <a href="http://www.google.com/?s=未访问">未访问链接样式</a> <a
				href="#">已访问链接样式</a>
			<button class="dsp-button">按钮样式</button>
			<input type="button" class="dsp-button" value="按钮样式" /> <input
				type="text" class="dsp-input" value="文件本框样式" />
		</div>
	</div>
	<input type="hidden" id="dsp-loginUser-id" value="${loginUser.id}" />
</body>
</html>