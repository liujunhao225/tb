<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<%
	response.setHeader("Cache-Control", "no-cache");
	response.setHeader("Pragma", "no-cache");
	response.setHeader("Expires", "0");
	request.setCharacterEncoding("utf-8");
%>
<script language="javascript"
	src="/oscar/public/js/jquery/jquery.min.js"></script>
<link rel="stylesheet" type="text/css"
	href="/oscar/public/styles/resources/css/ext-all.css" />
<script type="text/javascript" src="/oscar/public/js/ext/ext-all.js"></script>
<script type="text/javascript"
	src="/oscar/public/js/module/filmTurnPicture/define.js"></script>
<script type="text/javascript"
	src="/oscar/public/js/module/filmTurnPicture/turnPicture.js?"></script>
	<script type="text/javascript" src="/oscar/public/js/oscar-util.js"></script>
<link rel="stylesheet" type="text/css"
	href="/oscar/public/styles/oscar-main.css" />

<title>轮播图管理</title>
</head>
<body>
	<div id="formpanel"></div>
	<div id="gridpanel"></div>
	<img id='picture' style="width: 100%;height: 100%; display: none;" src="" />
</body>
</html>