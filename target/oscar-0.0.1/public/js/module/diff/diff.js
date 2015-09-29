/**
 * 店铺管理
 */
var PAGE_SIZE = 15;
var TURNPICTURE_STORE_URL = "/oscar/diff/list.do";
var TURNPICTURE_UPDATE_URL = "/oscar/diff/update.do";
var TURNPICTURE_DELETE_URL = "/oscar/diff/delete.do";
Ext.onReady(function() {
    Ext.QuickTips.init();
    var photoStore = Ext.create('Ext.data.Store', {
        model: 'purchaseOrder',
        pageSize: PAGE_SIZE,
        proxy: {
            type: 'ajax',
            url: TURNPICTURE_STORE_URL,
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
    photoStore.load({
        params: {
            start: 0,
            limit: PAGE_SIZE
        }
    });


    var stateStore = Ext.create('Ext.data.Store', {
        fields: ['key', 'value'],
        data : [
            {"key":"", "value":"<空>"},
            {"key":"A", "value":"未处理"},
            {"key":"B", "value":"入库"},
            {"key":"C", "value":"已删除"}
        ]
    });
    
    
    grid = Ext.create('Ext.grid.Panel', {
        renderTo: 'gridpanel',
        width: Ext.getBody().getWidth(),
        store: photoStore,
        title: '店铺列表',
        region: 'south',
        // autoHeight:true,
        forceFit: 1,
        viewConfig: {
            emptyText: '&nbsp;&nbsp;没有相关的记录'
        },
        
        columns: [{
           text: 'id',
           dataIndex: 'id',
           hidden:true
         },
        {
            text: '采购单号',
            dataIndex: 'purchaseId'
        },
        {
            text: '商品号',
            dataIndex: 'productId'
        },
        {
            text: '型号',
            dataIndex: 'productSize'
        }, 
        {
            text: '提交日期',
            dataIndex: 'submitDate'
        },{
        	text:'采购数量',
        	dataIndex:'purchaseCount'
        },
        {
        	text:'实际数量',
        	dataIndex:'realCount'
        },
        {
            text: '状态',
            dataIndex: 'state',
            renderer:function(val,meta,record){
            	var tempFlag = record.data.state;
            	if(tempFlag=='A'){
            		return '未处理'
                }else if(tempFlag=='B'){
                	return '已处理';
                }else{
                	return '已删除';
                }
            }
        },
        {
            header: '操作',
            menuDisabled: true,
            sortable: false,
            xtype: 'actioncolumn',
            items: [{
                icon: '/oscar/public/images/common/cancel.png',
                tooltip: '驳回',
                getClass:function(val,meta,m){
                	if(m.get('state') == 'A'){
						return "x-action-col-cell img.interface";
					}else{
						return "x-hide-display";
					}
                },
                handler: function(grid, rowIndex, colIndex) {
                	  var _store = grid.getStore();
                      var model = grid.getStore().getAt(rowIndex);
                      Ext.Ajax.request({
                  	    url: '/oscar/diff/disagree.do',
                  	    params: {
                  	        productId: model.get("productId"),
                  	        productSize: model.get("productSize"),
                  	        purchaseId: model.get("purchaseId"),
                  	        id: model.get("id")
                  	    },
                  	    success: function(response){
                  	    	Ext.Msg.alert('操作提示:', "您已取消");
                  	    	photoStore.load();
                  	    }
                  	});
                }
            },
            {
                icon: '/oscar/public/images/common/accept.png',
                tooltip: '确定',
                getClass:function(val,meta,m){
					if(m.get('state') == 'A'){
						return "x-action-col-cell img.interface";
					}else{
						return "x-hide-display";
					}
                },
                handler: function(grid, rowIndex, colIndex) {
                	 var _store = grid.getStore();
                     var model = grid.getStore().getAt(rowIndex);
                     Ext.Ajax.request({
                    	url: '/oscar/diff/agree.do',
                    	params: {
                    		productId: model.get("productId"),
                  	        productSize: model.get("productSize"),
                  	        purchaseId: model.get("purchaseId"),
                  	        id: model.get("id")
                    	},
                    	success: function(response){
                    		Ext.Msg.alert('操作提示:', "您已批准")
                    		photoStore.load();
                    	}
               	});
                }
            }]
        }],
        dockedItems: [{
            dock: 'bottom',
            xtype: 'pagingtoolbar',
            store: photoStore,
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
                    '商品号:',{
                    	xtype:'textfield',id:'tproductId',width:120
                    },
                    '尺寸:',{
                    	xtype:'textfield',id:'tproductSize',width:120
                    },
                    '状态:',{
                    	xtype:'combo',store:stateStore,editable:false,displayField:'value',
    					valueField:'key',queryMode:'local',id:'tstate',width:120
                    },
                    {
    					xtype : 'button',
    					text : '查询',
    					icon : '/oscar/public/images/common/icon_searchd.gif',
    					listeners:{
    						click:function(){
    							if(photoStore){
    								var proxy = photoStore.getProxy();
    								proxy.setExtraParam('tproductId',Ext.getCmp('tproductId').getValue());
    								proxy.setExtraParam('tproductSize',Ext.getCmp('tproductSize').getValue());
    								proxy.setExtraParam('tstate',Ext.getCmp('tstate').getValue());
    								photoStore.load({
    									params:{
    										start:0,
    										limit:PAGE_SIZE
    									}
    								});
    							}
    						}
    					}
    				}
            ]
        }]
       
    });
});