//登陆js控制文件 xujun/xKF58665 2012-08-31
Ext.onReady(function() {
	var DSP_LOGIN_TIMEOUT = 15000;// 登陆超时时间设置,默认15秒
	// 处理超时时，在顶级窗口打开登录页面toIndex.do
	if (window != top) {
		Ext.Msg.alert("消息", "登陆超时，请重新登陆!", function() {
			window.open("/oscar/login/toLogin.do", "_parent");
		});
		setTimeout(function() {
			window.open("/oscar/login/toLogin.do", "_parent");
		}, 0);

	}
	// 常量
	var tipInfo = [ "用户名不能为空", "密码不能为空" ];
	var params = [ "dsp-login-userName", "dsp-login-userPwd" ];
	var dsp_login_url = "/oscar/login/login.do";
	var dsp_toindex_url = "/oscar/login/toIndex.do";
	var loginMask = new Ext.LoadMask(Ext.getBody(), {
		msg : "登陆中..."
	});

	// 处理用户名
	handle(params[0], tipInfo[0]);
	// 处理密码
	handle(params[1], tipInfo[1]);
	// 处理输入完验证码后的回车
	Ext.EventManager.addListener(params[1], "keyup", function(e) {
		if (e.getKey() == Ext.EventObject.ENTER) {
			if (validateBeforeSubmit()) { // 简单校验成功，提交请求
				handleSubmit();
			}
		}
	});
	// 处理提交
	var loginSubmit = Ext.get("dsp-login-submit");
	if (loginSubmit) {
		loginSubmit.addListener('click', function() {
			if (validateBeforeSubmit()) { // 简单校验成功，提交请求
				handleSubmit();
			}
		});
	}

	// 函数定义区域
	// 处理事件
	function handle(domID, tip) {
		// 添加获取焦点事件
		Ext.EventManager.addListener(domID, 'focus', function() {
			// 清空提示内容
			Ext.get(domID + "-Tip").setHTML("");
		});
		// 添加失去焦点事件
		Ext.EventManager.addListener(domID, 'blur', function() {
			// 作简单校验
			validate(domID, tip);
		});
	}
	// 初步简单校验
	function validate(domID, tip) {
		if (Ext.isEmpty(Ext.getDom(domID).value, false)) {
			// 设置提示信息
			Ext.get(domID + "-Tip").setHTML(tip);
			return false;
		} else {
			return true;
		}
	}
	// 提交前校验
	function validateBeforeSubmit() {
		var validateOK = true;
		for (var i = 0; i < params.length - 1; i++) {
			if (!validate(params[i], tipInfo[i])) {
				validateOK = false;
			}
		}
		return validateOK;
	}
	// 发送登陆请求
	function handleSubmit() {
		// 显示蒙版提示
		loginMask.show();
		// 组织参数
		var jsonParams = {
			userName : Ext.getDom(params[0]).value,
			password : Ext.getDom(params[1]).value
		};
		Ext.Ajax.request({
			url : dsp_login_url,
			timeout : DSP_LOGIN_TIMEOUT,
			params : jsonParams ,
			success : function(response) {
				var text = response.responseText;
				// 处理返回的结果
				handleResult(text);
			},
			failure : function(response, opts) {
				if (response.timedout) {// 登陆请求超时
					loginMask.hide();
					Ext.Msg.alert("消息", "登陆超时，请稍后重试!");
				}
			}
		});
	}
	var errorInfo = [ "用户不存在", "密码输入不正确", "账号被锁定" ];
	// 处理返回结果
	function handleResult(text) {
		text = Ext.JSON.decode(text);
		if (text.success) {
			
			window.open(dsp_toindex_url, "_self");
		} else {
			loginMask.hide();
			var type = text.errorType;
			if (2 == type) {
				Ext.get(params[0] + "-Tip").setHTML(errorInfo[0]);
			} else if (3 == type) {
				Ext.get(params[1] + "-Tip").setHTML(errorInfo[1]);
			} else if (4 == type) {
				Ext.get(params[0] + "-Tip").setHTML(errorInfo[2]);
			}
		}
	}
});