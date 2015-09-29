<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
<title>实物进销存管理平台-登录页面</title>
<link rel="stylesheet" type="text/css"
	href="/oscar/public/styles/oscar-login.css" />
<script language="javascript"
	src="/oscar/public/js/jquery/jquery.min.js"></script>
<script language="javascript" src="/oscar/public/js/ext/ext-all.js"></script>
<script type="text/javascript" src="/oscar/public/js/oscar-login.js"></script>
</head>
<body>
	<table width="960" border="0" class="dsp-wrapper" align="center">
		<tbody>
			<tr>
				<td align="center" valign="middle" height="650">
					<div
						style="background-color: white; padding-top: 80px; padding-bottom: 60px; width: 500px; border: 1px solid #eeeeee; border-right: 5px solid #eeeeee;">
						<div class="dsp-logo">&nbsp;</div>
					</div>
				</td>
				<td>
					<div class="dsp-login-title">
						实物进销存管理平台 <br /> <sup style="font-size: 13px; font-weight: normal">
							&nbsp;&copy;请输入您的帐号登录 </sup>
					</div>
					<form class="dsp-form" action="/dsp/login/login.do" method="post">
						<table>
							<tbody>
								<tr valign="middle">
									<td align="right">用户：</td>
									<td height="30"><input type="text" id="dsp-login-userName"
										class="dsp-login-input" value="" autocomplete="off" /></td>
								</tr>
								<tr>
									<td>&nbsp;</td>
									<td id="dsp-login-userName-Tip" class="dsp-error-hint"></td>
								</tr>

								<tr valign="middle">
									<td align="right">密码：</td>
									<td height="30"><input type="password"
										id="dsp-login-userPwd" class="dsp-login-input" value=""
										autocomplete="off" /></td>
								</tr>
								<tr>
									<td>&nbsp;</td>
									<td id="dsp-login-userPwd-Tip" class="dsp-error-hint"></td>
								</tr>
								<tr valign="middle">
									<td align="right">&nbsp;</td>
									<td height="50"><input type="button" id="dsp-login-submit"
										class="dsp-login-btn" value="登录" /></td>
								</tr>
							</tbody>
						</table>
					</form>
				</td>
			</tr>
		</tbody>
	</table>
	<div class="dsp-footer">
		<!-- <span class="dsp-copy"> &copy; 2012 CMCC </span> 中国移动河南分公司 -->
	</div>
</body>
</html>