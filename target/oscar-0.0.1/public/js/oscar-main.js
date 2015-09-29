var dsp = {
	debug : false, // 调试模式，开启日志打印
	log : function(info) {
		// 检测浏览器是否支持，控制台打印功能
		if (window.console && dsp.debug) {
			console.log(info);
		}
	},
	createNavStyle : function(source) {
		return "<b style='font-size: 14px'>" + source + "</b>";
	}
};

Ext.require([ '*' ]);

Ext.onReady(function() {

	Ext.QuickTips.init();
	// Ext.state.Manager.setProvider(Ext.create('Ext.state.CookieProvider'));
	// 获取菜单项定义
	var dspNavMenu = [];
	$(".dsp-navmenu").each(function() {
		var itemId = $(this).attr("id");
		var caption = $(this).attr("caption");
		dspNavMenu.push({
			title : dsp.createNavStyle(caption),
			contentEl : itemId
		});
	});
	// 横幅LOGO区域
	var bannerView = Ext.create('Ext.Component', {
		id : "dsp-banner-view",
		region : 'north',
		contentEl : 'dsp-banner',
		height : 100
	});
	// 侧边栏
	var sidebarView = {
		region : 'west',
		stateId : 'navigation-panel',
		id : 'dsp-sidebar-view',
		title : '<span style="font-size: 14px;">功能导航</span>',
		split : true,
		width : 160,
		minWidth : 150,
		maxWidth : 200,
		collapsible : false,
		animCollapse : false,
		margins : '0 0 0 5',
		layout : 'accordion',
		items : dspNavMenu
	// 菜单定义见： dsp-menu.js
	};
	// 内容栏
	var contentView = Ext.create('Ext.tab.Panel', {
		id : "dsp-content-view",
		region : 'center',
		deferredRender : false,
		activeTab : 0,
		items : [ {
			itemId : "dashboard",
			contentEl : 'welcome',
			title : '欢迎页面',
			closable : false,
			autoScroll : true
		} ]
	});

	var viewport = Ext.create('Ext.Viewport', {
		id : 'dsp-viewport',
		layout : 'border',
		items : [ bannerView, sidebarView, contentView ]
	});

	var nameMap = new HashMap();
	// 给每一个链接添加一个唯一标识
	$(".dsp-action").each(function() {

		// 在此函数外声明一个map,需加载hashmap.js
		// 循环{
		// name = $(this).html()
		// 如果map中不包含name,则随机生成一个uid,把name和uid写入map
		// 如果包含name,则把name对应的uid赋给$(this)的dsp-uid属性
		// }

		// 获取每个连接的html值
		var temp = null;
		var title = $(this).attr("title");
		if (title) {
			temp = title;
		} else {
			temp = $(this).html();
		}
		// 用来判断这个值是否已经生成了uid
		var flag = false;
		var nameId;
		nameMap.each(function(key, value, index) {
			if (temp == key) {
				flag = true;
				nameId = value;
			}
		});

		if (flag) {
			$(this).attr("dsp-uid", nameId);
		} else {
			var randval = Math.floor(Math.random() * 1000000);
			var uid = "dsp-uid-" + new Date().getTime() + "-" + randval;
			$(this).attr("dsp-uid", uid);
			nameMap.put(temp, uid);
		}
		dsp.log(uid);
	});

	// 注册导航菜单链接的动作
	$(".dsp-action").click(function() {
		var url = $(this).attr("href");
		url = url.replace("#goto:", "");
		if (url != "" && url != "#" && url.indexOf("javascript:") == -1) {
			var dspUID = $(this).attr("dsp-uid");
			var tabs = dsp.getContentView();
			var tabItem = tabs.child("#" + dspUID);
			dsp.log("dspUID: " + dspUID);
			if (!tabItem) {
				var title = $(this).attr("title");
				if (!title) {
					title = $(this).html();
				}
				dsp.addFramePage(dspUID, title, url, true);
			} else {
				tabs.setActiveTab(tabItem);
			}
		}
		return false;
	});
});
