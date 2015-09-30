/**
 * 订单录入管理
 */
var PAGE_SIZE = 15;
var SHOPORDER_STORE_URL = "/oscar/shopOrder/getShopOrderUploadList.do";
var SHOPORDER_UPLAODORDER_URL ="/oscar/shopOrder/uploadShopOrderFile.do";
var SHOPORDER_MATCH_URL ="/oscar/shopOrder/uploadShopOrder.do";
var SHOPORDER_DELETE_URL = "/oscar/shopOrder/delShopOrderUploadFile.do";
var SHOPORDER_DOWNLOAD_URL="/oscar/shopOrder/downLoadShopOrder.do"
Ext.onReady(function() {
    Ext.QuickTips.init();
	  
	function exportButtonClick (){  
	     window.location.href = SHOPORDER_DOWNLOAD_URL;  
	}
	Ext.define('shopUpload', {
		extend : 'Ext.data.Model',
		fields : [{
			name : 'id',
			type : 'string'
		}, {
			name : 'uploadeTime',
			type : 'string'
		}, {
			name : 'fileName',
			type : 'string'
		}, {
			name : 'isMath',
			type : 'string'
		}]
	});
    var shopOrderStore = Ext.create('Ext.data.Store', {
        model: 'shopUpload',
        pageSize: PAGE_SIZE,
        proxy: {
            type: 'ajax',
            url: SHOPORDER_STORE_URL,
            extraParams: {
                createDate: ''
            },
            reader: {
                type: 'json',
                root: 'datalist',
                totalProperty: 'totalRecords'
            }
        }
    });
    shopOrderStore.load();
    var uploadWin;
    var creatUploadWin = function() {
        return Ext.create('Ext.window.Window', {
            title: '导入订单',
            height: 100,
            width: 350,
            closeAction: 'hide',
            modal: true,
            items: {
                id: 'form3',
                xtype: 'form',
                bodyPadding: 5,
                height: 100,
                width: 340,
                items: [{
        			xtype : 'textfield',
        			fieldLabel:'<span style="color:red;">*</span> 文&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;件',
        			inputType:'file',
        			id : 'auploadUrl',
        			name : 'file',
        			itemId:'auploadUrl',
        			labelWidth:80,
        			labelAlign:'right',
        			width:280,
        			style:'padding-top:3px;',
        			anchor : '95%',
        			buttonText:'选择文件',
        			allowBlank : false,
              		blankText:'不能为空'
                }]
            },
            buttons: [{
                text: '确定',
                formBind: true,
                icon: '/oscar/public/images/common/success.png',
                iconAlign: 'right',
                handler: function() {
					var formCmp=Ext.getCmp('form3');
					var form=formCmp.getForm();
					if(form.isValid()){
						var $file =$('#form3:visible input[type=file]');
						var filePath = $file.val();
						form.submit(
								{
									url:SHOPORDER_UPLAOD_URL,
									success:function(form,action){
										if(action.success){
											if(action.result.status == 200)
											{
												Ext.Msg.alert('操作提示',"导入信息成功！",function(){
													uploadWin.close();
													shopOrderStore.load();
												});	
											}
											else
											{
												Ext.Msg.alert('操作提示',action.result.mess,function(){
												});
											}
											
										}else{
											Ext.Msg.alert('操作提示',action.result.mess,function(){
											});
										}
									},
									failure:function(form,action){
										Ext.Msg.alert('操作提示',"导入信息失败！",function(){
										});
									}
								});
					}
				}
            },
            {
                text: '取消',
                icon: '/oscar/public/images/common/undo.png',
                iconAlign: 'right',
                handler: function() {
                	uploadWin.close();
                }
            }],
            buttonAlign: 'center'
        });
    }

    grid = Ext.create('Ext.grid.Panel', {
        renderTo: 'gridpanel',
        width: Ext.getBody().getWidth(),
        store: shopOrderStore,
        title: '订单导入管理',
        region: 'south',
        autoHeight:true,
        forceFit: 1,
        viewConfig: {
            emptyText: '&nbsp;&nbsp;没有相关的记录'
        },
        columns: [{
            dataIndex: 'id',
            hidden: true
        },{
            text: '文件名称',
            dataIndex: 'fileName',
        },{
        	text:'是否匹配',
        	dataIndex:'isMath'
        },{
        	text:'上传时间',
        	dataIndex:'uploadeTime'
        },
        {
            header: '操作',
            menuDisabled: true,
            sortable: false,
            xtype: 'actioncolumn',
            items: [{
                icon: '/oscar/public/images/common/delete.gif',
                tooltip: '删除',
                handler: function(grid, rowIndex, colIndex) {
                    Ext.Msg.confirm('操作提示', '确定要删除该订单吗？',
                    function(btn) {
                        if (btn == "yes") {
                            var _store = grid.getStore();
                            var model = grid.getStore().getAt(rowIndex);
                            Ext.Ajax.request({
                                url: SHOPORDER_DELETE_URL,
                                params: {
                                	id: model.data.id
                                },
                                success: function(response) {
                                    var text = Ext.decode(response.responseText);
                                    if (text.success == true) {
                                        Ext.Msg.alert('操作提示:',  '删除成功！',
                                        function() {
                                            _store.loadPage(_store.currentPage);
                                        });
                                    } else {
                                        Ext.Msg.alert('操作提示:', "删除失败！");
                                    }
                                },
                                failure: function() {
                                    Ext.Msg.alert('操作提示', "删除失败！");
                                }
                            });
                        }
                    });
                }
            },
            {

                icon: '/oscar/public/images/common/start.gif',
                tooltip: '开始匹配',
                handler: function(grid, rowIndex, colIndex) {
                    Ext.Msg.confirm('操作提示', '是否要匹配订单？',
                            function(btn) {
                                if (btn == "yes") {
                                    var _store = grid.getStore();
                                    var model = grid.getStore().getAt(rowIndex);
                                    Ext.Ajax.request({
                                        url: SHOPORDER_MATCH_URL,
                                        params: {
                                        	id: model.data.id
                                        },
                                        success: function(response) {
                                            var action = Ext.decode(response.responseText);
    										if(action.success){
    											if(action.status == 200)
    											{
    												Ext.Msg.alert('操作提示',"导入信息成功！",function(){
    													uploadWin.close();
    													shopOrderStore.load();
    												});	
    											}
    											else
    											{
    												Ext.Msg.alert('操作提示',action.mess,function(){
    												});
    											}
    											
    										}else{
    											Ext.Msg.alert('操作提示',action.mess,function(){
    											});
    										}
                                        },
                                        failure: function() {
                                            Ext.Msg.alert('操作提示', "匹配失败！");
                                        }
                                    });
                                }
                            });
                        }
            },{
                icon: '/oscar/public/images/common/t_download.png',
                tooltip: '下载',
                handler: function(grid, rowIndex, colIndex) {
                    Ext.Msg.confirm('操作提示', '是否要匹配订单？',
                            function(btn) {
                                if (btn == "yes") {
                                    var _store = grid.getStore();
                                    var model = grid.getStore().getAt(rowIndex);
                                    Ext.Ajax.request({
                                        url: SHOPORDER_MATCH_URL,
                                        params: {
                                        	id: model.data.id
                                        },
                                        success: function(response) {
                                            var action = Ext.decode(response.responseText);
    										if(action.success){
    											if(action.status == 200)
    											{
    												Ext.Msg.alert('操作提示',"导入信息成功！",function(){
    													uploadWin.close();
    													shopOrderStore.load();
    												});	
    											}
    											else
    											{
    												Ext.Msg.alert('操作提示',action.mess,function(){
    												});
    											}
    											
    										}else{
    											Ext.Msg.alert('操作提示',action.mess,function(){
    											});
    										}
                                        },
                                        failure: function() {
                                            Ext.Msg.alert('操作提示', "匹配失败！");
                                        }
                                    });
                                }
                            });
                        }
            }]
        }],
        dockedItems: [{
            dock: 'bottom',
            xtype: 'pagingtoolbar',
            store: shopOrderStore,
            displayInfo: true,
            refreshText: '刷新',
            firstText: '第一页',
            prevText: '上一页',
            nextText: '下一页',
            lastText: '尾页',
            beforePageText: '跳转到第',
            afterPageText: '页,共{0}页',
            displayMsg: '第{0} - {1}条记录,共 {2}条记录',
            emptyMsg: '没有记录'
        },
        {
            xtype: 'toolbar',
            dock: 'top',
            items: [
                    '文件名称：',
                    {
                    	xtype:'textfield',
                    	id:'fileName',
                    	width:80
                    },
                    {
                    	xtype:'button',
                    	text:'查询',
                    	icon:'/oscar/public/images/common/icon_searchd.gif',
                    	listeners:{
                    		click:function(){
                    			if(shopOrderStore){
                    				var proxy=shopOrderStore.getProxy();
                    				proxy.setExtraParam('fileName',Ext.getCmp('fileName').getValue());
                    				shopOrderStore.load({
                    					params:{start:0,limit:PAGE_SIZE}
                    				});
                    			}
                    		}
                    	}
                    },
            '->', {
                    	xtype: 'button',
                        text: '导入',
                        icon: '/oscar/public/images/common/excel-up.png',
                        handler: function() {
                            if (uploadWin) {
                            	uploadWin.show();
                            } else {
                            	uploadWin = creatUploadWin();
                            	uploadWin.show();
                            }
                        }
                    }],
        }]
       
    });
});