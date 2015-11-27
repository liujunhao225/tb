/**
 * 店铺管理
 */
var PAGE_SIZE = 20;
var PRODUCT_STORE_URL = "/oscar/product/list.do";
var PRODUCT_SAVE_URL = "/oscar/product/add.do";
var PRODUCT_UPDATE_URL = "/oscar/product/update.do";
var PRODUCT_DELETE_URL = "/oscar/product/delete.do";
var PRODUCT_PRODUCTSTORELIAT_URL = "/oscar/product/getProductStoreList.do";
var PRODUCT_PROPUCHORDERLIST_URL = "/oscar/product/proPuchOrderlist.do";
Ext.onReady(function() {
    Ext.QuickTips.init();
    var productStore = Ext.create('Ext.data.Store', {
        model: 'product',
        pageSize: PAGE_SIZE,
        proxy: {
            type: 'ajax',
            url: PRODUCT_STORE_URL,
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
    productStore .load({
        params: {
            start: 0,
            limit: PAGE_SIZE
        }
    });
    var addWin =null;
    var addForm=[{
    	 fieldLabel: '<span style="color:red;">*</span>货号',
         xtype: 'textfield',
         itemId: 'aproductId',
         id: 'aproductId',
         name:'productId',
         style: 'padding-top:3px;',
         labelWidth: 80,
         labelAlign: 'right',
         width: 280,
         allowBlank:false,
         blankText:'货号必须填'
    },{
        fieldLabel: '<span style="color:red;">*</span>尺码',
        xtype: 'textfield',
        itemId: 'aproductSize',
        id: 'aproductSize',
        name:'productSize',
        style: 'padding-top:3px;',
        labelWidth: 80,
        labelAlign: 'right',
        width: 280,
        allowBlank:false,
        blankText:'尺码必须填'
    },{
        fieldLabel: '<span style="color:red;">*</span>商品名称',
        xtype: 'textfield',
        itemId: 'aproductName',
        id: 'aproductName',
        name:'productName',
        style: 'padding-top:3px;',
        labelWidth: 80,
        labelAlign: 'right',
        width: 280,
        allowBlank:false,
        blankText:'商品名称必须填'
    },{
   	 fieldLabel: '<span style="color:red;">*</span>商品编码',
     xtype: 'textfield',
     itemId: 'aproductCode',
     id: 'aproductCode',
     name:'productCode',
     style: 'padding-top:3px;',
     labelWidth: 80,
     labelAlign: 'right',
     width: 280,
     allowBlank:false,
     blankText:'商品编码必须填'
    },{
        fieldLabel: '<span style="color:red;">*</span>条码',
        xtype: 'textfield',
        itemId: 'abarCode',
        id: 'abarCode',
        name:'barCode',
        style: 'padding-top:3px;',
        labelWidth: 80,
        labelAlign: 'right',
        width: 280, 
        allowBlank:false,
        blankText:'条码必须填'
    },
    {
        fieldLabel: '颜色编号',
        xtype: 'textfield',
        itemId: 'acolor',
        id: 'acolor',
        name:'color',
        style: 'padding-top:3px;',
        labelWidth: 80,
        labelAlign: 'right',
        width: 280
    },
    {
        fieldLabel: '品牌',
        xtype: 'textfield',
        itemId: 'abrand',
        id: 'abrand',
        name:'brand',
        style: 'padding-top:3px;',
        labelWidth: 80,
        labelAlign: 'right',
        width: 280
    },
    {
        fieldLabel: '货品季节',
        xtype: 'textfield',
        itemId: 'aseason',
        id: 'aseason',
        name:'season',
        style: 'padding-top:3px;',
        labelWidth: 80,
        labelAlign: 'right',
        width: 280
    },
    {
        fieldLabel: '內长',
        xtype: 'textfield',
        itemId: 'aingrowth',
        id: 'aingrowth',
        name:'ingrowth',
        style: 'padding-top:3px;',
        labelWidth: 80,
        labelAlign: 'right',
        width: 280
    },
    ];
    var createAddWin = function() {
        return Ext.create('Ext.window.Window', {
            title: '新增商品信息',
            height: 450,
            width: 350,
            closeAction: 'hide',
            modal: true,
            items: {
                id: 'form1',
                xtype: 'form',
                bodyPadding: 5,
                height: 300,
                width: 340,
                items: addForm
            },
            buttons: [{
                text: '确定',
                formBind: true,
                icon: '/oscar/public/images/common/success.png',
                iconAlign: 'right',
                handler: function() {
                    var formCmp = Ext.getCmp('form1');
                    var form = formCmp.getForm();
                    if (form.isValid()) {
                    	form.submit({
                            url: PRODUCT_SAVE_URL,
                            success: function(form, action) {
                                if (action.success) {
                                	if(action.result.recode=='1'){
                                		 Ext.Msg.alert('操作提示', action.result.desc);
                                	}
                                	else{
                                		Ext.Msg.alert('操作提示', "新增商品成功！",
                                		function() {
                                					productStore .load();
                                					addWin.close();
                                	});
                                	}
                                } else {
                                    Ext.Msg.alert('操作提示', "新增采商品失败！",
                                    function() {
                                    });
                                }
                            },
                            failure: function(form, action) {
                                Ext.Msg.alert('操作提示', "新增商品失败！",
                                function() {
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
                    addWin.close()
                }
            }],
            buttonAlign: 'center'
        });
    };
    
    var editWin = null;
    // 修改产品信息信息form
    var editForm = [{
            xtype: 'hidden',
            itemId: 'eid',
            id: 'eid',
            name:'id',
            readOnly:true
    },{
   	 fieldLabel: '<span style="color:red;">*</span>货号',
     xtype: 'textfield',
     itemId: 'eproductId',
     id: 'eproductId',
     name:'productId',
     style: 'padding-top:3px;',
     labelWidth: 80,
     labelAlign: 'right',
     width: 280,
     allowBlank:false,
     blankText:'货号必须填'
    },{
   	 	fieldLabel: '<span style="color:red;">*</span>尺码',
   	 	xtype: 'textfield',
   	 	itemId: 'eproductCode',
   	 	id: 'eproductCode',
   	 	name:'productCode',
   	 	style: 'padding-top:3px;',
   	 	labelWidth: 80,
   	 	labelAlign: 'right',
   	 	width: 280,
   	 	allowBlank:false,
   	 	blankText:'尺码必须填'
    },{
    	fieldLabel: '<span style="color:red;">*</span>商品尺寸',
    	xtype: 'textfield',
    	itemId: 'eproductSize',
    	id: 'eproductSize',
    	name:'productSize',
    	style: 'padding-top:3px;',
    	labelWidth: 80,
    	labelAlign: 'right',
    	width: 280,
    	allowBlank:false,
    	blankText:'商品尺寸必须填'
    },{
    	fieldLabel: '<span style="color:red;">*</span>商品名称',
    	xtype: 'textfield',
    	itemId: 'eproductName',
    	id: 'eproductName',
    	name:'productName',
    	style: 'padding-top:3px;',
    	labelWidth: 80,
    	labelAlign: 'right',
    	width: 280,
    	allowBlank:false,
    	blankText:'商品名称必须填'
    },{
   	 	fieldLabel: '<span style="color:red;">*</span>商品编码',
   	 	xtype: 'textfield',
   	 	itemId: 'eproductCode',
   	 	id: 'eproductCode',
   	 	name:'productCode',
   	 	style: 'padding-top:3px;',
   	 	labelWidth: 80,
   	 	labelAlign: 'right',
   	 	width: 280,
   	 	allowBlank:false,
   	 	blankText:'商品编码必须填'
    },{
    	fieldLabel: '<span style="color:red;">*</span>条码',
    	xtype: 'textfield',
    	itemId: 'ebarCode',
    	id: 'ebarCode',
    	name:'barCode',
    	style: 'padding-top:3px;',
    	labelWidth: 80,
    	labelAlign: 'right',
    	width: 280, 
    	allowBlank:false,
    	blankText:'条码必须填'
    },
    {
    	fieldLabel: '颜色编号',
    	xtype: 'textfield',
    	itemId: 'ecolor',
    	id: 'ecolor',
    	name:'color',
    	style: 'padding-top:3px;',
    	labelWidth: 80,
    	labelAlign: 'right',
    	width: 280
    },
    {
    	fieldLabel: '品牌',
    	xtype: 'textfield',
    	itemId: 'ebrand',
    	id: 'ebrand',
    	name:'brand',
    	style: 'padding-top:3px;',
    	labelWidth: 80,
    	labelAlign: 'right',
    	width: 280
    },
    {
    	fieldLabel: '货品季节',
    	xtype: 'textfield',
    	itemId: 'eseason',
    	id: 'eseason',
    	name:'season',
    	style: 'padding-top:3px;',
    	labelWidth: 80,
    	labelAlign: 'right',
    	width: 280
    },
    {
    	fieldLabel: '內长',
    	xtype: 'textfield',
    	itemId: 'eingrowth',
    	id: 'eingrowth',
    	name:'ingrowth',
    	style: 'padding-top:3px;',
    	labelWidth: 80,
    	labelAlign: 'right',
    	width: 280
    },
    ];

    var createEditWin = function() {
        return Ext.create('Ext.window.Window', {
            title: '修改产品信息',
            height: 405,
            width: 350,
            closeAction: 'hide',
            modal: true,
            items: {
                id: 'form2',
                xtype: 'form',
                bodyPadding: 5,
                height: 405,
                width: 340,
                items: editForm
            },
            buttons: [{
                text: '确定',
                formBind: true,
                icon: '/oscar/public/images/common/success.png',
                iconAlign: 'right',
                handler: function() {
                    var formCmp = Ext.getCmp('form2');
                    var form = formCmp.getForm();
                    if (form.isValid()) {
                    	form.submit({
                            url: PRODUCT_UPDATE_URL,
                            success: function(form, action) {
                                if (action.success) {
                                	if(action.result.recode=='1'){
                                		 Ext.Msg.alert('操作提示', action.result.desc);
                                	}
                                	else{
                                		Ext.Msg.alert('操作提示', "修改商品成功！",
                                		function() {
                                					productStore .load();
                                					editWin.close();
                                	});
                                	}
                                } else {
                                    Ext.Msg.alert('操作提示', "修改采商品失败！",
                                    function() {
                                    });
                                }
                            },
                            failure: function(form, action) {
                                Ext.Msg.alert('操作提示', "系统繁忙",
                                function() {
                                    editWin.close();
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
                    editWin.close()
                }
            }],
            buttonAlign: 'center'
        });
    }

    var proStorwin = null;
    var proStorStore = Ext.create('Ext.data.Store', {
        model: 'productStoreModel',
        pageSize: PAGE_SIZE,
        proxy: {
            type: 'ajax',
            url: PRODUCT_PRODUCTSTORELIAT_URL,
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
    var proStorGride = Ext.create('Ext.grid.Panel', {
        store: proStorStore ,
        region: 'south',
        autoHeight:true,
        forceFit: 1,
        viewConfig: {
            emptyText: '&nbsp;&nbsp;没有相关的记录'
        },
        columns: [
        {
            text: '仓库名称',
            dataIndex: 'shName'
        },
        {
            text: '仓位',
            dataIndex: 'shSubId'
        },
        {
            text: '数量',
            dataIndex: 'count'
        },
        {
            text: '价格',
            dataIndex: 'price'
        },
        {
            text: '状态',
            dataIndex: 'state',
            renderer:function(value){
            	if(value)
            	{
            		return value == 'A'?'可用':'锁定';	
            	}
            }
        },
        {
            text: '入库时间',
            dataIndex: 'time'
        }
        ],
        dockedItems: [{
            dock: 'bottom',
            xtype: 'pagingtoolbar',
            store: proStorStore ,
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
                    '仓库名称',{
                    	xtype:'textfield',id:'shName',width:120
                    },
                    '仓位',{
                    	xtype:'textfield',id:'shSubId',width:120
                    },'仓库类型',{
                    	xtype:'combobox',
                    	id:'type',
                    	width:80,
                    	typeAhead : true,
                        triggerAction:'all',
                        mode : 'local',  
                        store : new Ext.data.ArrayStore({  
                                    fields : ['value', 'text'],  
                                    data : [["2", '本地'], ["1", '外地']]  
                                }),  
                        valueField : 'value',  
                        displayField : 'text',  
                        editable:false
                    },{
    					xtype : 'button',
    					text : '查询',
    					icon : '/oscar/public/images/common/icon_searchd.gif',
    					listeners:{
    						click:function(){
    							if(proStorStore ){
    								var proxy = proStorStore .getProxy();
    								proxy.setExtraParam('shName',Ext.getCmp('shName').getValue());
    								proxy.setExtraParam('shSubId',Ext.getCmp('shSubId').getValue());
    								proxy.setExtraParam('type',Ext.getCmp('type').getValue());
    								proStorStore .load({
    									params:{
    										start:0,
    										limit:PAGE_SIZE
    									}
    								});
    							}
    						}
    					}
    				}],
        }]

    });
    var creatProStoreWin = function (){
        return Ext.create('Ext.window.Window', {
            title: '商品存储信息查询',
            height: $(window).height()*0.7,
            width: Ext.getBody().getWidth()*0.8,
            closeAction: 'hide',
            modal: true,
            items: [proStorGride]
        });
    
    }
    
    //
    var proPuchOrderwin = null;
    var proPuchOrderStore = Ext.create('Ext.data.Store', {
        model: 'proPuchOrderModel',
        pageSize: PAGE_SIZE,
        proxy: {
            type: 'ajax',
            url: PRODUCT_PROPUCHORDERLIST_URL,
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
    var proPuchOrderGride = Ext.create('Ext.grid.Panel', {
        store: proPuchOrderStore ,
        region: 'south',
        autoHeight:true,
        forceFit: 1,
        viewConfig: {
            emptyText: '&nbsp;&nbsp;没有相关的记录'
        },
        columns: [
        {
            text: '采购单ID',
            dataIndex: 'orderId'
        },
        {
            text: '供应商',
            dataIndex: 'supplierName'
        },
        {
            text: '采购日期',
            dataIndex: 'purchaseDate'
        },
        {
            text: '到货时间',
            dataIndex: 'arriveDate'
        },
        {
            	 text: '状态',
                 dataIndex: 'orderState',
                 renderer: function(val, meta, record) {
                 	 var tempState= record.data.orderState;
                      if(tempState=='A'){
                      	return '新生成'
                      } else if(tempState=='B'){
                      	return '未发货'
                      }else if(tempState=='C'){
                      	return '发货中'
                      }else if(tempState=='D'){
                      	return '已到货'
                      }else if(tempState=='E'){
                      	return '入库中'
                      }else{
                      	return '已入库'
                      }
             	}
        }
        ],
        dockedItems: [{
            dock: 'bottom',
            xtype: 'pagingtoolbar',
            store: proPuchOrderStore ,
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
                    '采购单ID',{
                    	xtype:'textfield',id:'orderId',width:120
                    },
                    {
    					xtype : 'button',
    					text : '查询',
    					icon : '/oscar/public/images/common/icon_searchd.gif',
    					listeners:{
    						click:function(){
    							if(proStorStore ){
    								var proxy = proPuchOrderStore .getProxy();
    								proxy.setExtraParam('orderId',Ext.getCmp('orderId').getValue());
    								proPuchOrderStore.load({
    									params:{
    										start:0,
    										limit:PAGE_SIZE
    									}
    								});
    							}
    						}
    					}
    				}],
        }]

    });
    var creatProPuchOrderWin = function (){
        return Ext.create('Ext.window.Window', {
            title: '商品存储信息查询',
            height: $(window).height()*0.7,
            width: Ext.getBody().getWidth()*0.8,
            closeAction: 'hide',
            modal: true,
            items: [proPuchOrderGride]
        });
    
    }
    //
    grid = Ext.create('Ext.grid.Panel', {
        renderTo: 'gridpanel',
        width: Ext.getBody().getWidth(),
        store: productStore ,
        title: '商品信息列表',
        region: 'south',
        autoHeight:true,
        forceFit: 1,
        viewConfig: {
            emptyText: '&nbsp;&nbsp;没有相关的记录'
        },
        columns: [{
            text: 'id',
            dataIndex: 'id',
            hidden: true
        },
        {
            text: '货号',
            dataIndex: 'productId'
        },
        {
            text: '尺码',
            dataIndex: 'productSize'
        },
        {
            text: '商品名称',
            dataIndex: 'productName'
        },
        {
            text: '商品编码',
            dataIndex: 'productCode'
        },
        {
            text: '颜色编号',
            dataIndex: 'color'
        },
        {
            text: '条码',
            dataIndex: 'barCode'
        },
        {
            text: '品牌',
            dataIndex: 'brand'
        },
        {
            text: '货品季节',
            dataIndex: 'season'
        },
        {
            text: '內长',
            dataIndex: 'ingrowth'
        }
        ,
        {
            header: '操作',
            menuDisabled: true,
            sortable: false,
            xtype: 'actioncolumn',
            items: [{
                icon: '/oscar/public/images/common/delete.gif',
                tooltip: '删除',
                handler: function(grid, rowIndex, colIndex) {
                    Ext.Msg.confirm('操作提示', '确定要删除该商品？',
                    function(btn) {
                        if (btn == "yes") {
                            var _store = grid.getStore();
                            var model = grid.getStore().getAt(rowIndex);
                            Ext.Ajax.request({
                                url: PRODUCT_DELETE_URL,
                                params: {
                                    id: model.data.id
                                },
                                success: function(response) {
                                    var text = Ext.decode(response.responseText);
                                    if (text.success == true) {
                                        Ext.Msg.alert('操作提示:', "删除成功！",
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
            },{

                icon: '/oscar/public/images/common/update.gif',
                tooltip: '修改',
                handler: function(grid, rowIndex, colIndex) {
                    var _store = grid.getStore();
                    var model = grid.getStore().getAt(rowIndex);
                    if (!editWin) {
                        editWin = createEditWin();
                    }
                    var editForm = editWin.getComponent('form2');
                    editForm.getComponent('eid').setValue(model.data.id);
                    editForm.getComponent("eproductId").setValue(model.data.productId);
                    editForm.getComponent("eproductCode").setValue(model.data.productCode);
                    editForm.getComponent('eproductName').setValue(model.data.productName);
                    editForm.getComponent('eproductSize').setValue(model.data.productSize);
                    editForm.getComponent('ecolor').setValue(model.data.color);
                    editForm.getComponent('ebarCode').setValue(model.data.barCode);
                    editForm.getComponent('ebrand').setValue(model.data.brand);
                    editForm.getComponent('eseason').setValue(model.data.season);
                    editForm.getComponent('eingrowth').setValue(model.data.ingrowth);
                    editWin.show();
                }
            
            },
            {
                icon: '/oscar/public/images/common/message.png',
                tooltip: '查看所在仓位',
                handler: function(grid, rowIndex, colIndex) {
                    var _store = grid.getStore();
                    var model = grid.getStore().getAt(rowIndex);
                    if (!proStorwin) {
                    	proStorwin = creatProStoreWin();
                    }
                    var proxy = proStorStore .getProxy();
                    Ext.getCmp('type').setValue('2');
					proxy.setExtraParam('id',model.data.id);
                    proStorStore .load({
                        params: {
                            start: 0,
                            limit: PAGE_SIZE,
                        }});
                    proStorwin.show();
                }
            
            },
            {
                icon: '/oscar/public/images/common/new.gif',
                tooltip: '查看所在的采购单',
                handler: function(grid, rowIndex, colIndex) {
                    var _store = grid.getStore();
                    var model = grid.getStore().getAt(rowIndex);
                    if (!proPuchOrderwin) {
                    	proPuchOrderwin = creatProPuchOrderWin();
                    }
                    var proxy = proPuchOrderStore .getProxy();
					proxy.setExtraParam('id',model.data.id);
					proPuchOrderStore.load({
                        params: {
                            start: 0,
                            limit: PAGE_SIZE,
                        }});
					proPuchOrderwin.show();
                }
            
            }
            ]
        }],
        dockedItems: [{
            dock: 'bottom',
            xtype: 'pagingtoolbar',
            store: productStore ,
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
                    '商品条码',{
                    	xtype:'textfield',id:'product_bar_code',width:120,
                    	listeners:{
                    		'specialkey':function (field,e){
                    			if (e.getKey() == e.ENTER) {
                                    console.log("enter key download");
                                    if(productStore){
        								var proxy = productStore.getProxy();
        								console.log(Ext.getCmp('product_bar_code').getValue());
        								proxy.setExtraParam('productBarCode',Ext.getCmp('product_bar_code').getValue());
        								productStore .load({
        									params:{
        										start:0,
        										limit:PAGE_SIZE
        									}
        								});
        							}
                                }
                    		}
                    	}
                    },
                    '商品编码',{
                    	xtype:'textfield',id:'productCode',width:120
                    },
                    '商品尺寸',{
                    	xtype:'textfield',id:'productSize',width:120
                    },'商品名称',{
                    	xtype:'textfield',id:'productName',width:120
                    },{
    					xtype : 'button',
    					text : '查询',
    					icon : '/oscar/public/images/common/icon_searchd.gif',
    					listeners:{
    						click:function(){
    							if(productStore ){
    								var proxy = productStore .getProxy();
    								proxy.setExtraParam('productCode',Ext.getCmp('productCode').getValue());
    								proxy.setExtraParam('productSize',Ext.getCmp('productSize').getValue());
    								proxy.setExtraParam('productName',Ext.getCmp('productName').getValue());
    								productStore .load({
    									params:{
    										start:0,
    										limit:PAGE_SIZE
    									}
    								});
    							}
    						}
    					}
    				},
            '->', {
                xtype: 'button',
                text: '新增',
                icon: '/oscar/public/images/common/add.png',
                handler: function() {
                	 if (addWin) {
                         addWin.show();
                     } else {
                         addWin = createAddWin();
                         addWin.show();
                     }
                }
            }],
        }]

    });
});