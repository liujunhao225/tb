
if (window.dsp) {
	
	// 获取内容实例对象
	dsp.getContentView = function() { return Ext.getCmp("dsp-content-view"); };
	dsp.getSidebarView = function() { return Ext.getCmp("dsp-sidebar-view"); };
	dsp.getBannerView  = function() { return Ext.getCmp("dsp-banner-view"); };

	// 添加一个标签页
	dsp.addTabPage = function(tabConfig) {
		var contentView = dsp.getContentView();
		if (contentView) {
			return contentView.add(tabConfig);
		}
	};
	// 以IFRAME方式打开一个页面
	dsp.addFramePage = function(itemId, title, url, showOnLoad) {
		var tabId = 'dsp-tab-'+ new Date().getTime();
		if (url.indexOf("?") != -1)
			url += "&rnd=" + new Date().getTime();
		else
			url += "?rnd=" + new Date().getTime();
		var frameTabConfig = {  
					itemId: itemId,
					title: title,  
					id: tabId,  
					margins:'0 0 0 0',  
					autoHeight:true,  
					autoScroll:true,  
					autoWidth:true,  
					closable:true,  
					frame:true,
					html:'<iframe src="'+url+'" width="100%" height="638" frameBorder="0" scrolling="auto"></iframe>'  
		};
		var frameTab = dsp.addTabPage(frameTabConfig); 
		if (showOnLoad) {
			frameTab.show();
			dsp.getContentView().setActiveTab(frameTab);
		}
		return frameTab;
	};

}
