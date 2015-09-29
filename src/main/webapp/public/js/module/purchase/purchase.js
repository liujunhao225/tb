/**
 * 店铺管理
 */
var PAGE_SIZE = 15;
var PURCHASE_STORE_URL = "/oscar/purchase/list.do";
var PURCHASE_SAVE_URL = "/oscar/purchase/add.do";
var PURCHASE_UPDATE_URL = "/oscar/purchase/update.do";
var PURCHASE_DELETE_URL = "/oscar/purchase/delete.do";
var IMPORT_FILE_URL = "/oscar/purchase/importFile.do";
var PURCHASE_PRODUCT_LIST_URL = "/oscar/purchase/productInfoList.do";//product list url
var PURCHASE_PRODUCT_ADD_URL ="/oscar/purchase/productAdd.do";
var PURCHASE_PRODUCT_UPDATE_URL ="/oscar/purchase/productUpdate.do";
var PURCHASE_PRODUCT_DELETE_URL ="/oscar/purchase/productDelete.do";


Ext.onReady(function() {
    Ext.QuickTips.init();
    //加载列表 start
    var photoStore=Ext.create("Ext.data.Store",{model:"purchaseOrder",pageSize:PAGE_SIZE,proxy:{type:"ajax",url:PURCHASE_STORE_URL,extraParams:{createDate:""},reader:{type:"json",root:"datalist",totalProperty:"totalRecords"}}});photoStore.load({params:{start:0,limit:PAGE_SIZE}});
    //加载列表 end

    //供应商  start
    Ext.define("suppplierModel",{extend:"Ext.data.Model",fields:[{name:"key",type:"string"},{name:"value",type:"string"}]});var supplierKindStore=Ext.create("Ext.data.Store",{model:"suppplierModel",proxy:{type:"ajax",url:"/oscar/supply/kind.do",reader:{type:"json",root:"data"}},autoLoad:false});
  //供应商  end
    
    //采购单状态 
    var stateStore=Ext.create("Ext.data.Store",{fields:["key","value"],data:[{"key":"A","value":"新生成"},{"key":"B","value":"未发货"},{"key":"C","value":"发货中"},{"key":"D","value":"已到货"},{"key":"E","value":"入库中"},{"key":"F","value":"已入库"}]});
  

    // 增加影片剧照信息form
    var addWin = null;
    var addForm = [
    {
        fieldLabel: '<span style="color:red;">*</span> 采购单号',
        xtype: 'textfield',
        itemId: 'apurchaseOrderId',
        id: 'apurchaseOrderId',
        style: 'padding-top:3px;',
        labelWidth: 80,
        labelAlign: 'right',
        width: 280,
        maxLength: 20,
        allowBlank:false,
        blankText:'采购单号必须',
        maxLengthText: '采购单号不能超过20个字'
    },
    {
        fieldLabel: '<span style="color:red;">*</span>供应商',
        xtype: 'combobox',
        itemId: 'asupplierId',
        id: 'asupplierId',
        store:supplierKindStore,
        valueField:'key',
        displayField:'value',
        style: 'padding-top:3px;',
        labelWidth: 80,
        labelAlign: 'right',
        width: 280,
        maxLength: 10,
        allowBlank:false
    },
    {
        fieldLabel: '采购日期',
        xtype: 'textfield',
        itemId: 'apurchaseDate',
        id: 'apurchaseDate',
        style: 'padding-top:3px;',
        labelWidth: 80,
        labelAlign: 'right',
        width: 280,
        maxLength: 20,
        maxLengthText: '时间填写如:2015-08-10'
    }
    ];

    var createAddWin = function() {
        return Ext.create('Ext.window.Window', {
            title: '新增采购单',
            height: 230,
            width: 350,
            closeAction: 'hide',
            modal: true,
            items: {
                id: 'form1',
                xtype: 'form',
                bodyPadding: 5,
                height: 160,
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
                        if (Ext.String.trim(Ext.getCmp("apurchaseOrderId").getValue()) == "") {
                            Ext.Msg.alert('操作提示', '采购单号不能为空！');
                            return;
                        }
                    }
                    form.submit({
                        url: PURCHASE_SAVE_URL,
                        params: {
                        	purchaseOrderId: Ext.getCmp("apurchaseOrderId").getValue(),
                        	supplierId: Ext.getCmp("asupplierId").getValue(),
                        	purchaseDate: Ext.getCmp('apurchaseDate').getValue(),
                        },
                        success: function(form, action) {
                            if (action.success) {
                                Ext.Msg.alert('操作提示', "新增采购单成功！",
                                function() {
                                    photoStore.load();
                                    addWin.close();
                                });
                            } else {
                                Ext.Msg.alert('操作提示', "新增采购单失败！",
                                function() {
                                    addWin.close();
                                });
                            }
                        },
                        failure: function(form, action) {
                            Ext.Msg.alert('操作提示', "新增采购单失败！",
                            function() {
                                addWin.close();
                            });
                        }
                    });
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
    }
    
 
    //导入采购文件
    var importWin = null;
    var importForm=[{
        xtype: "hidden",
        itemId: 'iorderId',
        id: 'iorderId'
    },{
    	 fieldLabel: '导入采购文件',
         xtype: 'filefield',
         itemId: 'aimportFileId',
         name: 'file',
         id: 'aimportFileId',
         style: 'padding-top:3px;',
         labelWidth: 80,
         labelAlign: 'right',
         width: 280,
         buttonText: '选择文件'
    	
    }]; 
    var createimportWin = function() {
        return Ext.create('Ext.window.Window', {
            title: '导入文件',
            height: 150,
            width: 365,
            closeAction: 'hide',
            modal: true,
            items: {
                id: 'form3',
                xtype: 'form',
                bodyPadding: 5,
                height: 160,
                width: 340,
                items: importForm
            },
            buttons: [{
                text: '确定',
                formBind: true,
                icon: '/oscar/public/images/common/success.png',
                iconAlign: 'right',
                handler: function() {
                    var formCmp = Ext.getCmp('form3');
                    var form = formCmp.getForm();
                    var filePath=Ext.getCmp("aimportFileId").getValue();
                    if(filePath !=null && filePath.length>0){
                    	var fileType=(filePath.substr(filePath.lastIndexOf('.')+1)).toLowerCase();
    					var reg=/^xls|xlsx$/;
    					if(!reg.test(fileType)){
    						Ext.Msg.alert('操作提示','只能上传xls或xlsx的文件！');
    						return;
    					}
                    }
                    form.submit({
                        url: IMPORT_FILE_URL,
                        params: {
                        	purchaseOrderId: Ext.getCmp("iorderId").getValue(),
                        },
                        success: function(form, action) {
                            if (action.success) {
                            	console.log(action);
                                Ext.Msg.alert('操作提示', "导入采购单成功！"+action.result.errorMessge,
                                function() {
                                    photoStore.load();
                                    importWin.close();
                                });
                            } else {
                                Ext.Msg.alert('操作提示', "导入采购单失败！",
                                function() {
                                	importWin.close();
                                });
                            }
                        },
                        failure: function(form, action) {
                            Ext.Msg.alert('操作提示', "导入采购单失败！",
                            function() {
                            	importWin.close();
                            });
                        }
                    });
                }
            },
            {
                text: '取消',
                icon: '/oscar/public/images/common/undo.png',
                iconAlign: 'right',
                handler: function() {
                	importWin.close()
                }
            }],
            buttonAlign: 'center'
        });
    };
    
    //编辑采购单
    var editWin = null;
    var editForm = [
    {
        fieldLabel: '订单号',
        xtype: 'textfield',
        itemId: 'eorderId',
        id: 'eorderId',
        name:'eorderId',
        style: 'padding-top:3px;',
        labelWidth: 80,
        labelAlign: 'right',
        width: 280,
        maxLength: 20,
        readonly:true
    },
    {
        fieldLabel: '供应商',
        xtype: 'textfield',
        itemId: 'esupplier',
        style: 'padding-top:3px;',
        name:'esupplier',
        labelWidth: 80,
        labelAlign: 'right',
        width: 280,
        readOnly:true,
        maxLength: 10
    },
    {
        fieldLabel: '状态',
        xtype: 'combobox',
        itemId: 'eorderState',
        id: 'eorderState',
        name:'eorderState',
        store:stateStore,
        valueField:'key',
        displayField:'value',
        style: 'padding-top:3px;',
        labelWidth: 80,
        labelAlign: 'right',
        width: 280,
        maxLength: 200
    },{
    	 fieldLabel:'箱数',
         xtype:'textfield',
         name:'eboxCount',
         id:'eboxCount',
         itemId:'eboxCount',
         style:'padding-top:3px;',
         labelWidth: 80,
         labelAlign: 'right',
         width: 280,
         maxLength: 10,
         maskRe: /[0-9.]/,
         maxLengthText:'不能超过10位数'
    },{
    	 fieldLabel: '物流',
         xtype: 'textfield',
         itemId: 'elogistics',
         id:'elogistics',
         name:'elogistics',
         style: 'padding-top:3px;',
         labelWidth: 80,
         labelAlign: 'right',
         width: 280,
         maxLength: 50,
         maxLengthText:'不能超过50个字'
    },{
    	 fieldLabel: '物流单号',
         xtype: 'textfield',
         itemId: 'elogisticsNum',
         id:'elogisticsNum',
         name:'elogisticsNum',
         style: 'padding-top:3px;',
         labelWidth: 80,
         labelAlign: 'right',
         width: 280,
         maxLength: 50,
         maxLengthText:'不能超过50个字'
         
    }
    ];

    var createEditWin = function() {
        return Ext.create('Ext.window.Window', {
            title: '修改采购单状态',
            height: 400,
            width: 350,
            closeAction: 'hide',
            modal: true,
            items: {
                id: 'form2',
                xtype: 'form',
                bodyPadding: 5,
                height: 300,
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
                    form.submit({
                        url: PURCHASE_UPDATE_URL,
                        success: function(form, action) {
                            if (action.success) {
                                Ext.Msg.alert('操作提示', "修改采购单成功！",
                                function() {
                                    photoStore.load();
                                    editWin.close();
                                });
                            } else {
                                Ext.Msg.alert('操作提示', "修改采购单失败！",
                                function() {
                                    editWin.close();
                                });
                            }
                        },
                        failure: function(form, action) {
                            Ext.Msg.alert('操作提示', "修改采购单失败！",
                            function() {
                                editWin.close();
                            });
                        }
                    });
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
    //采购单商品查看 
    var proStorwin = null;
    var proStorStore = Ext.create('Ext.data.Store', {
        model: 'purchaseProductModel',
        pageSize: PAGE_SIZE,
        proxy: {
            type: 'ajax',
            url: PURCHASE_PRODUCT_LIST_URL,
            reader: {
                type: 'json',
                root: 'datalist',
                totalProperty: 'totalRecords'
            }
        }
    });
    
    //采购单商品查看--新增加采购单商品
 
    var rowEditing2 = Ext.create('Ext.grid.plugin.RowEditing', {
        clicksToMoveEditor: 1,
        autoCancel: false,
        saveBtnText  : '保存',
        cancelBtnText: '取消',
        listeners:{
        	edit: function(editor, ctx, eOpts) {
               var tempdata = ctx.record.data;
               var requestUrl='';
                if(tempdata.productId=='0'){
                	requestUrl=PURCHASE_PRODUCT_ADD_URL;
                }else{
                	requestUrl=PURCHASE_PRODUCT_UPDATE_URL;
                }
                Ext.Ajax.request({
                    url: requestUrl,
                    params: { 
                    	orderId:Ext.getCmp('spurchaseOrderId').getValue(),
                    	productId:tempdata.productId,
                    	productCode: tempdata.productCode,
                    	productSize: tempdata.productSize,
                    	productName: tempdata.productName,
                    	barCode: tempdata.barCode,
                    	kind: tempdata.kind,
                    	price: tempdata.price,
                    	sellsPrice: tempdata.sellsPrice,
                    	purchaseNum: tempdata.purchaseNum
                    }
                });
            },
            canceledit:function(rowEditing, context) {
                if (context.record.phantom) {
                    context.store.remove(context.record);
                }
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
        plugins: [rowEditing2],
      
        columns: [{
        	text: '货品号',
        	dataIndex:'productId',
        	hidden:true
        },
        {
            text: '货品编码',
            dataIndex: 'productCode',
            editor:{
            	 allowBlank: true
            }
        },{
            text: '货品型号',
            dataIndex: 'productSize',
            editor:{
            	allowBlank: true
            }
        },{
            text: '货品名称',
            dataIndex: 'productName',
            editor:{
            	allowBlank: true
           }
        },{
            text: '条形码',
            dataIndex: 'barCode',
            editor:{
            	allowBlank: true
           }
        },{
            text: '类别',
            dataIndex: 'kind',
            editor:{
            	allowBlank: true
           }
        },{
            text: '采购价',
            dataIndex: 'price',
            editor:{
            	allowBlank: true
           }
        },{
            text: '销售价',
            dataIndex: 'sellsPrice',
            editor:{
            	allowBlank: true
           }
        },{
            text: '总价',
            dataIndex: 'allPrice',
            editor:{
            	allowBlank: true
           }
        },{
            text: '采购数量',
            dataIndex: 'purchaseNum',
            editor:{
            	allowBlank: true
           }
        },{
        	text:'未入库数量',
        	dataIndex:'noStorageNum'
        }],tbar:[{
            text: '增加商品',
            iconCls: 'employee-add',
            handler : function() {
            	if(rowEditing2.editing)
					return false;
            	var r = {
            		productId:'0',
            		productCode: '',
            		productSize: '',
            		productName: '',
            		barCode: '',
            		kind: '',
            		price:'',
            		sellsPrice:'',
            		allPrice:'',
            		purchaseNum:'',
            		noStorageNum:''
                };
            	proStorStore.insert(0, r);
            	rowEditing2.startEdit(0, 0);
            }
        },{
            itemId: 'removeEmployee',
            text: '删除',
            id:'removeEmployee',
            iconCls: 'delete',
            handler: function() {
            	 rowEditing2.cancelEdit();
            	 var sm = proStorGride.getSelectionModel();
            	 var tempdata = sm.getSelection()[0].data;
            	 Ext.Ajax.request({
                     url: PURCHASE_PRODUCT_DELETE_URL,
                     params: {
                    	 orderId:Ext.getCmp('spurchaseOrderId').getValue(),
                    	 productId:tempdata.productId
                     }
                 });
            	 proStorStore.remove(sm.getSelection());
            }
        }],	
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
                    '条码',{
                    	xtype:'textfield',id:'barcode',width:120
                    },{
                    	xtype:'hiddenfield',id:'spurchaseOrderId'
                    },{
    					xtype : 'button',
    					text : '查询',
    					icon : '/oscar/public/images/common/icon_searchd.gif',
    					listeners:{
    						click:function(){
    							if(proStorStore ){
    								var proxy = proStorStore .getProxy();
    								proxy.setExtraParam('barcode',Ext.getCmp('barcode').getValue());
    								proxy.setExtraParam('tpurchaseId',Ext.getCmp('spurchaseOrderId').getValue());
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
            title: '商品信息展示',
            height: $(window).height()*0.8,
            width: Ext.getBody().getWidth()*0.8,
            closeAction: 'hide',
            modal: true,
            items: [proStorGride]
        });
    
    }
    //列表
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
        columns: [
        {
            text: '采购单编号',
            dataIndex: 'orderId'
        },
        {
            text: '供应商',
            dataIndex: 'supplierId'
        },
        {
            text: '箱数',
            dataIndex: 'boxCount'
        },
        {
        	text: '物流',
        	dataIndex: 'logistics'
        },
        {
        	text: '物流单号',
        	dataIndex: 'logisticsNum'
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
                 }else if(tempState=='F'){
                 	return '已入库'
                 }else if(tempState='G'){
                	 return '审核中'
                 }
        	}
        },
        {
        	text: '采购日期',
        	dataIndex: 'purchaseDate'
        },
        {
        	text: '发货日期',
        	dataIndex: 'deliveryDate'
        },
        {
        	text: '到货日期',
        	dataIndex: 'arriveDate'
        },
        {
        	text: '入库日期',
        	dataIndex: 'storeDate'
        },
        {
        	text:'是否上传文件',
        	dataIndex:'fileFlag',
        	renderer: function(val, meta, record) {
                var tempFlag= record.data.fileFlag;
                if(tempFlag=='T'){
                	return '已上传'
                }else{
                	return '未上传';
                }
        	}
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
                    Ext.Msg.confirm('操作提示', '删除采购时，同时会删除采购单下面的商品，确定要删除吗？',
                    function(btn) {
                        if (btn == "yes") {
                            var _store = grid.getStore();
                            var model = grid.getStore().getAt(rowIndex);
                            Ext.Ajax.request({
                                url: PURCHASE_DELETE_URL,
                                params: {
                                	orderId: model.data.orderId
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
            },
            {
                icon: '/oscar/public/images/common/update.gif',
                tooltip: '修改',
                getClass:function(val,meta,m){
					if(m.get('fileFlag') == 'T'){
						return "x-action-col-cell img.interface";
					}else{
						return "x-hide-display"
					}
                },
                handler: function(grid, rowIndex, colIndex) {
                    var _store = grid.getStore();
                    var model = grid.getStore().getAt(rowIndex);
                    if (!editWin) {
                        editWin = createEditWin();
                    }
                    var editForm = editWin.getComponent('form2');
                    editForm.getComponent('eorderId').setValue(model.data.orderId);
                    editForm.getComponent("esupplier").setValue(model.data.supplierId);
                    editForm.getComponent("eorderState").setValue(model.data.orderState);
                    editForm.getComponent("eboxCount").setValue(model.data.boxCount);
                    editForm.getComponent("elogistics").setValue(model.data.logistics);
                    editForm.getComponent("elogisticsNum").setValue(model.data.logisticsNum);
                    editWin.show();
                }
            }, {
                icon: '/oscar/public/images/common/nfs_mount.gif',
                tooltip: '导入采购单',
                getClass:function(val,meta,m){
					if(m.get('fileFlag') == 'F'){
						return "x-action-col-cell img.interface";
					}else{
						return "x-hide-display"
					}
                },
                handler: function(grid, rowIndex, colIndex) {
                    var _store = grid.getStore();
                    var model = grid.getStore().getAt(rowIndex);
                    if (!importWin) {
                    	importWin = createimportWin();
                    }
                    var importForm = importWin.getComponent('form3');
                    importForm.getComponent('iorderId').setValue(model.data.orderId);
                    importWin.show();
                }
            },{
                icon: '/oscar/public/images/common/new.gif',
                tooltip: '查看采购单商品信息',
                getClass:function(val,meta,m){
					if(m.get('fileFlag') != 'F'){
						return "x-action-col-cell img.interface";
					}else{
						return "x-hide-display"
					}
                },
                handler: function(grid, rowIndex, colIndex) {
                	
                    var _store = grid.getStore();
                    var model = grid.getStore().getAt(rowIndex);
                    if (!proStorwin) {
                    	proStorwin = creatProStoreWin();
                    }
                    var proxy = proStorStore .getProxy();
                    Ext.getCmp('spurchaseOrderId').setValue(model.data.orderId);
					proxy.setExtraParam('tpurchaseId',model.data.orderId);
                    proStorStore .load({
                        params: {
                            start: 0,
                            limit: PAGE_SIZE,
                        }});
                    proStorwin.show();
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
                    '采购单编号:',{
                    	xtype:'textfield',id:'tpurchaseId',width:120
                    },{
    					xtype : 'button',
    					text : '查询',
    					icon : '/oscar/public/images/common/icon_searchd.gif',
    					listeners:{
    						click:function(){
    							if(photoStore){
    								var proxy = photoStore.getProxy();
    								proxy.setExtraParam('tpurchaseId',Ext.getCmp('tpurchaseId').getValue());
    								photoStore.load({
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
                    supplierKindStore.load();
                }
            }]
        }]
       
    });
});