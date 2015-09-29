<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>实物进销存管理平台-欢迎页面</title>
<script type="text/javascript" src="/oscar/public/js/module/welcome/welcome.js"></script>
<style type="text/css">
body {
	margin-left: 0px;
	margin-top: 0px;
	margin-right: 0px;
	margin-bottom: 0px;
}

.text {
	font-size: 25px;
	color: #1e82cc;
}

a:link {
	color: #1e82cc;
	text-decoration: none;
}

a:visited {
	text-decoration: none;
	color: #CC0000;
}

a:hover {
	text-decoration: none;
}

a:active {
	text-decoration: none;
}
</style>
</head>
<body>
	<!-- <table width="100%" border="0" cellspacing="0" cellpadding="0">
		<tr>
			<td>
				<div align="center">
					<img src="/oscar/public/images/top.gif" width="469" height="68" />
				</div>
			</td>
		</tr>
	</table> -->
	<table width="100%" border="0" cellspacing="0" cellpadding="0">
		<tr>
			<td>
				<div align="center">
					<img src="/oscar/public/images/bgpic.gif" width="683" height="356" />
					<p class="text">欢迎进入实物进销存管理平台</p>
					<p class="text">异常订单数：<span style="color:red;" id="shopOrderAbnormalCount"></span></p>
					<p class="text">入库异常数：<span style="color:red;" id="purchaseAbnormalCount"></span></p>
					<p class="text">移库操作未审核数：<span style="color:red;" id="storeHouseAbnormalCount"></span></p>
				</div>
			</td>
		</tr>
	</table>
</body>
</html>
