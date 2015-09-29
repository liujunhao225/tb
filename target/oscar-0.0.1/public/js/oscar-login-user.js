// 登陆用户信息管理js控制文件 xujun/xKF58665 2012-09-03
Ext.onReady(function() {
	var dsp_user_ids = [ "dsp-userUser-changeInfo", "dsp-loginUser-changePwd",
			"dsp-loginUser-exit" ];
	// Ext.EventManager.addListener(dsp_user_ids[0], "click", changeUserInfo);
	Ext.EventManager.addListener(dsp_user_ids[1], "click", changePwd);
//	Ext.EventManager.addListener(dsp_user_ids[2], "click", exitSys);
});
// 常量设置
var DSP_LOGIN_USER_CHANGE_INFO_URL = "/dsp/admin/changeInfo.do";
var DSP_LOGIN_USER_CHANGE_PWD_URL = "/oscar/myadmin/changePwd.do";
var DSP_LOGIN_USER_EXIT_SYS_URL = "/dsp/admin/exit.do";
var DSP_LOGIN_USER_GET_INFO_URL = "/dsp/admin/loginUserInfo.do";
var DSP_LOGIN_USER_LOGIN_URL = "/dsp/login/toLogin.do";
var DSP_LOGIN_USER_INTERNAL_ERROR = "出现系统内部错误，请联系管理员";

var dsp_loginUser_changeInfoWindow = null;
var DSP_LOGIN_USER_CHANGE_INF_TIMEOUT = 30;// 修改个人信息超时时间设置，单位秒
var DSP_LOGIN_USER_PHONE_ERROR_TIP = "手机号码输入格式不正确，请正确输入!";
Ext.form.field.VTypes.emailText = "邮箱格式不正确,正确格式样例:user@example.com";
var DSP_LOGIN_USER_CHANGE_INF_ERRORS = [ "修改个人信息成功", "修改个人信息失败，请稍后重试!",
		"用户不存在，请重新登陆后重新修改！" ];
var DSP_LOGIN_USER_INFO = [ "", "" ];

var dsp_loginUser_changePwdWindow = null;
var DSP_LOGIN_USER_CHANGE_PWD_TIMEOUT = 30;// 修改密码超时时间设置，单位秒
var DSP_LOGIN_USER_CHANGE_PWD_RESULT_WIN_TITLE = "修改结果";
var DSP_LOGIN_USER_NEWPWD_TIP = "两次输入的新密码不一致";
var DSP_LOGIN_USER_CONTAIN_BLANK_TIP = "密码不能包含空格且至少为6个字符,最多45个字符";
var DSP_LOGIN_USER_CHANGE_PWD_ERRORS = [ "修改密码失败，请稍后重试!", "用户名错误，请重新登陆后重新修改！",
		"旧密码不正确，修改密码失败!", "修改密码失败，请稍后重试!", "修改密码成功!" ];
var DSP_LOGIN_USER_FIELD_TIPS = [ "旧密码不能为空", "新密码不能为空", "确认密码不能为空" ];

var DSP_LOGIN_USER_EXIT_TIMEOUT = 10000;// 退出超时时间设置
var exitMask = new Ext.LoadMask(Ext.getBody(), {
	msg : "退出系统中..."
});

// 登陆用户信息修改 xujun/xKF58665 2012-09-03
function changeUserInfo() {
	// 校验
	var phoneReg = /^1[3-9][0-9]{9}/;
	// 简单校验手机号码:必须保证11位数字
	Ext.apply(Ext.form.field.VTypes, {
		phoneValue : function(val, field) {
			return (phoneReg.test(val) && val.length == 11);
		},
		phoneValueText : DSP_LOGIN_USER_PHONE_ERROR_TIP,
		phoneValueMask : /(\d)+/i
	});

	if (null == dsp_loginUser_changeInfoWindow) {// 第一次点击时创建组件
		loginUser = Ext.getDom("dsp-loginUser-id").value;
		// 处理字段的初始化值
		handleFieldsInit(loginUser);
		// Form定义
		dsp_loginUser_changeInfo_formPanel = Ext
				.create(
						'Ext.form.Panel',
						{
							id : 'dsp-loginUser-changeInfo-formPanel',
							bodyPadding : 3,
							buttonAlign : 'center',
							url : DSP_LOGIN_USER_CHANGE_INFO_URL + "?userid="
									+ loginUser,
							timeout : DSP_LOGIN_USER_CHANGE_INF_TIMEOUT,
							defaults : {
								xtype : 'textfield',
								size : 20,
								labelWidth : 60,
								labelAlign : 'right'
							},
							items : [ {
								id : 'dsp-loginUser-phoneNumber',
								name : 'phone',
								fieldLabel : "手机号码",
								vtype : 'phoneValue',
								value : DSP_LOGIN_USER_INFO[0]
							}, {
								id : 'dsp-loginUser-email',
								name : 'email',
								fieldLabel : "邮箱",
								vtype : 'email',
								value : DSP_LOGIN_USER_INFO[1]
							} ],
							buttons : [
									{
										text : "保存修改",
										xtype : 'button',
										formBind : true,
										disabled : true,
										handler : function() {
											var form = this.up('form')
													.getForm();
											if (form.isValid()) {
												form
														.submit({
															success : function(
																	form,
																	action) {
																Ext.Msg
																		.alert(
																				DSP_LOGIN_USER_CHANGE_PWD_RESULT_WIN_TITLE,
																				DSP_LOGIN_USER_CHANGE_INF_ERRORS[0],
																				function() {
																					dsp_loginUser_changeInfoWindow
																							.hide();
																				});
															},
															failure : function(
																	form,
																	action) {
																var error_num = action.result.result;
																if (1 == error_num) {
																	Ext.Msg
																			.alert(
																					DSP_LOGIN_USER_CHANGE_PWD_RESULT_WIN_TITLE,
																					DSP_LOGIN_USER_CHANGE_INF_ERRORS[1]);
																} else if (2 == error_num) {
																	Ext.Msg
																			.alert(
																					DSP_LOGIN_USER_CHANGE_PWD_RESULT_WIN_TITLE,
																					DSP_LOGIN_USER_CHANGE_INF_ERRORS[2]);
																} else if (3 == error_num) {
																	Ext.Msg
																			.alert(
																					DSP_LOGIN_USER_CHANGE_PWD_RESULT_WIN_TITLE,
																					DSP_LOGIN_USER_CHANGE_INF_ERRORS[1]);
																} else {
																	Ext.Msg
																			.alert(
																					DSP_LOGIN_USER_CHANGE_PWD_RESULT_WIN_TITLE,
																					DSP_LOGIN_USER_INTERNAL_ERROR);
																}
															}
														});
											}
										}
									},
									{
										text : "取消",
										handler : function() {
											dsp_loginUser_changeInfoWindow
													.hide();
										}
									} ]
						});
		// 窗口定义
		dsp_loginUser_changeInfoWindow = Ext.create('Ext.window.Window', {
			title : "修改个人信息",
			height : 125,
			width : 260,
			padding : 0,
			resizable : false,
			layout : 'anchor',
			closeAction : 'hide',
			modal : true,
			items : [ dsp_loginUser_changeInfo_formPanel ]
		});

	}
	// 显示组件
	if (!dsp_loginUser_changeInfoWindow.isVisible()) {
		dsp_loginUser_changeInfoWindow.show();
	}
}

// 登陆用户密码修改 xujun/xKF58665 2012-09-03
function changePwd() {
	// 验证定义
	var validateNullReg = /.*\S$/i;
	// 验证两次输入的新密码
	Ext.apply(Ext.form.field.VTypes, {
		changePWDConfirm : function(val, field) {
			var newPwdField = field.previousNode().queryById(
					'dsp-loginUser-newPwd');
			var newPwdValue = newPwdField.rawValue;
			if (val == newPwdValue) {
				return true;
			} else {
				return false;
			}
		},
		changePWDConfirmText : DSP_LOGIN_USER_NEWPWD_TIP,
		changePWDConfirmMask : /^[~\S](.*)+/i
	});
	// 验证空格
	Ext
			.apply(
					Ext.form.field.VTypes,
					{
						nullValue : function(val, field) {
							return (validateNullReg.test(val)
									&& (val.length >= 6) && (val.length <= 45));
						},
						nullValueText : DSP_LOGIN_USER_CONTAIN_BLANK_TIP,
						nullValueMask : /^[~\S](.*)+/i
					});

	if (null == dsp_loginUser_changePwdWindow) {// 第一次点击时创建组件
		loginUser = Ext.getDom("dsp-loginUser-id").value;
		// Form定义
		dsp_loginUser_changePwd_formPanel = Ext
				.create(
						'Ext.form.Panel',
						{
							id : 'dsp-loginUser-changePwd-formPanel',
							bodyPadding : 3,
							buttonAlign : 'center',
							url : DSP_LOGIN_USER_CHANGE_PWD_URL + "?userid="
									+ loginUser,
							timeout : DSP_LOGIN_USER_CHANGE_PWD_TIMEOUT,
							items : [ {
								id : 'dsp-loginUser-oldPwd',
								xtype : 'textfield',
								name : 'oldPwd',
								size : 10,
								fieldLabel : "旧密码",
								allowBlank : false,
								labelAlign : 'right',
								inputType : 'password',
								vtype : 'nullValue',
								blankText : DSP_LOGIN_USER_FIELD_TIPS[0]
							}, {
								id : 'dsp-loginUser-newPwd',
								xtype : 'textfield',
								size : 10,
								name : 'newPwd',
								fieldLabel : "新密码",
								allowBlank : false,
								labelAlign : 'right',
								inputType : 'password',
								vtype : 'nullValue',
								blankText : DSP_LOGIN_USER_FIELD_TIPS[1]
							}, {
								id : 'dsp-loginUser-confirmPwd',
								xtype : 'textfield',
								size : 10,
								name : 'confirmPwd',
								fieldLabel : "确认密码",
								allowBlank : false,
								labelAlign : 'right',
								inputType : 'password',
								blankText : DSP_LOGIN_USER_FIELD_TIPS[2],
								vtype : 'changePWDConfirm'
							} ],
							buttons : [
									{
										text : "保存",
										formBind : true,
										disabled : true,
										handler : function() {
											var form = this.up('form')
													.getForm();
											if (form.isValid()) {
												form
														.submit({
															success : function(
																	form,
																	action) {
																Ext.Msg
																		.alert(
																				DSP_LOGIN_USER_CHANGE_PWD_RESULT_WIN_TITLE,
																				DSP_LOGIN_USER_CHANGE_PWD_ERRORS[4],
																				function() {
																					dsp_loginUser_changePwdWindow
																							.hide();
																				});
															},
															failure : function(
																	form,
																	action) {
																	Ext.Msg
																			.alert(
																					DSP_LOGIN_USER_CHANGE_PWD_RESULT_WIN_TITLE,
																					DSP_LOGIN_USER_CHANGE_PWD_ERRORS[2]);
															}
														});
											}
										}
									}, {
										text : "重置",
										handler : function() {
											this.up('form').getForm().reset();
										}
									} ]
						});
		// 窗口定义
		dsp_loginUser_changePwdWindow = Ext.create('Ext.window.Window', {
			title : "修改密码",
			height : 150,
			width : 260,
			padding : 0,
			resizable : false,
			layout : 'anchor',
			closeAction : 'hide',
			modal : true,
			items : [ dsp_loginUser_changePwd_formPanel ]
		});
	}
	// 显示组件
	if (!dsp_loginUser_changePwdWindow.isVisible()) {
		var form = dsp_loginUser_changePwdWindow
				.queryById('dsp-loginUser-changePwd-formPanel');
		form.getForm().reset();// 清空字段值
		dsp_loginUser_changePwdWindow.show();
	}
}

// 退出系统 xujun/xKF58665 2012-09-03
function exitSys() {
	exitMask.show();
	Ext.Ajax.request({
		url : DSP_LOGIN_USER_EXIT_SYS_URL,
		timeout : DSP_LOGIN_USER_EXIT_TIMEOUT,
		params : {
			userName : Ext.get("dsp-userUser-changeInfo").getHTML()
		},
		success : function(response) {
			var text = response.responseText;
			var textJSON = Ext.JSON.decode(text, true);
			if (null != textJSON) {

				if (textJSON.success) {// 退出成功
					window.open(DSP_LOGIN_USER_LOGIN_URL, "_self");
				} else {// 退出失败
					exitMask.hide();
					Ext.Msg.alert("消息", "退出系统失败!");

				}
			} else {
				window.open(DSP_LOGIN_USER_LOGIN_URL, "_self");
			}
		},
		failure : function(response, opts) {
			if (response.timedout) {// 退出请求超时
				exitMask.hide();
				Ext.Msg.alert("消息", "请求超时，退出系统失败!");
			} else {
				window.open(DSP_LOGIN_USER_LOGIN_URL, "_self");
			}

		}
	});
}

// #############辅助函数定义区域###############33
function handleFieldsInit(loginUserId) {
	Ext.Ajax.request({
		url : DSP_LOGIN_USER_GET_INFO_URL,
		params : {
			id : loginUserId
		},
		async : false,
		success : function(response) {
			var text = response.responseText;
			var textJSON = Ext.JSON.decode(text);
			if (textJSON.success) {// 获取登录用户信息成功
				DSP_LOGIN_USER_INFO[0] = textJSON.phone;
				DSP_LOGIN_USER_INFO[1] = textJSON.email;
			}
		}
	});
}
