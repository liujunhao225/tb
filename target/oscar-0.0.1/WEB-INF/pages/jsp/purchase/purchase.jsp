<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<%
	response.setHeader("Cache-Control", "no-cache");
	response.setHeader("Cache-Control", "no-store");
	response.setHeader("Pragma", "no-cache");
	response.setDateHeader("Expires", 0);
%>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<script language="javascript"
	src="/oscar/public/js/jquery/jquery.min.js"></script>
<link rel="stylesheet" type="text/css"
	href="/oscar/public/styles/resources/css/ext-all.css" />
<script type="text/javascript" src="/oscar/public/js/ext/ext-all.js"></script> 
<script type="text/javascript" src="/oscar/public/js/oscar-util.js"></script>
<script type="text/javascript" src="/oscar/public/js/module/purchase/define.js"></script>
<script type="text/javascript" src="/oscar/public/js/module/purchase/purchase.js"></script>
<link rel="stylesheet" type="text/css" href="/oscar/public/styles/oscar-main.css" />
<title>采购单管理</title>
<style type="text/css">
.x-action-col-icon { height: 16px; width: 16px; margin-right: 8px;}
</style>
</head>
<body>
	<div id="formpanel"></div>
	<div id="gridpanel"></div>
	<img id='picture' style="width: 100%; height: 100%; display: none;"
		src="" />
	<img id='background' style="width: 100%; height: 100%; display: none;"
		src="" />
</body>
</html>