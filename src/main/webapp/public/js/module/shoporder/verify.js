/**
 * 订单匹配异常审核
 */
var PAGE_SIZE = 15;
var SHOPORDER_STORE_URL = "/oscar/shopOrder/getShopOrderList.do";
var SHOPORDER_SAVE_URL = "/oscar/shopOrder/addShopOrder.do";
var SHOPORDER_UPDATE_URL = "/oscar/shopOrder/updateShopOrder.do";
var SHOPORDER_DELETE_URL = "/oscar/shopOrder/deleteShopOrder.do";
var SHOPORDER_UPLOAD_URL = "/oscar/shopOrder/uploadShopOrder.do";
var SHOPORDER_SUBMIT_ABNORMAL = "/oscar/shopOrder/submitAbnormalOrder.do";
Ext.onReady(function() {
    Ext.QuickTips.init();
    var shopOrderStore = Ext.create('Ext.data.Store', {
        model: 'shopOrder',
        pageSize: PAGE_SIZE,
        proxy: {
            type: 'ajax',
            url: SHOPORDER_STORE_URL,
            extraParams: {
                createDate: '',
                state:3,
            },
            reader: {
                type: 'json',
                root: 'datalist',
                totalProperty: 'totalRecords'
            }
        }
    });
    shopOrderStore.load({
        params: {
            start: 0,
            limit: PAGE_SIZE,
        }
    });

    var addWin = null;
    // 增加影片剧照信息form
    var addForm = [
    {
        fieldLabel: '<span style="color:red;">*</span> 订单号',
        xtype: 'textfield',
        itemId: 'aorderId',
        id: 'aorderId',
        name:'orderId',
        style: 'padding-top:3px;',
        labelWidth: 100,
        labelAlign: 'right',
        allowBlank : false,
  		blankText:'不能为空',
        width: 300,
        maxLength: 20,
        maxLengthText: '订单号不能超过20字符'
    },{
        fieldLabel: '<span style="color:red;">*</span>订单编号',
        xtype: 'textfield',
        itemId: 'aorderCode',
        id: 'aorderCode',
        name:'orderCode',
        style: 'padding-top:3px;',
        labelWidth: 100,
        labelAlign: 'right',
        width: 300,
        allowBlank : false,
  		blankText:'不能为空',
        maxLength: 50,
        maxLengthText: '订单编号不能超过50字符'
    },
    {
        fieldLabel: '<span style="color:red;">*</span> 店铺名称',
        xtype: 'textfield',
        itemId: 'ashopName',
        id: 'ashopName',
        name:'shopName',
        style: 'padding-top:3px;',
        labelWidth: 100,
        labelAlign: 'right',
        allowBlank : false,
  		blankText:'不能为空',
        width: 300,
        maxLength: 100,
        maxLengthText: '店铺名称不能超过100字符'
    },
    {
        fieldLabel: '<span style="color:red;">*</span> 商品编码',
        xtype: 'textfield',
        itemId: 'aproductCode',
        id: 'aproductCode',
        name:'productCode',
        style: 'padding-top:3px;',
        labelWidth: 100,
        labelAlign: 'right',
        allowBlank : false,
  		blankText:'不能为空',
        width: 300,
        maxLength: 20,
        maxLengthText: '商品编码不能超过20字符'
    },
    {
        fieldLabel: '<span style="color:red;">*</span>数量',
        xtype: 'textfield',
        itemId: 'acount',
        id: 'acount',
        name:'count',
        style: 'padding-top:3px;',
        labelWidth: 100,
        labelAlign: 'right',
        width: 300,
        regex: /^[0-9]{0,6}$/i,
  		regexText : "只能输入6位以内数字",
        allowBlank : false,
  		blankText:'不能为空'
    },
    {

        fieldLabel: '<span style="color:red;">*</span>尺码',
        xtype: 'textfield',
        itemId: 'asize',
        id: 'asize',
        name:'size',
        style: 'padding-top:3px;',
        labelWidth: 100,
        labelAlign: 'right',
        width: 300,
        allowBlank : false,
  		blankText:'尺码不能为空'
    },
    {

        fieldLabel: '<span style="color:red;">*</span>价格',
        xtype: 'textfield',
        itemId: 'aprice',
        id: 'aprice',
        name:'price',
        style: 'padding-top:3px;',
        labelWidth: 100,
        labelAlign: 'right',
        width: 300,
        allowBlank : false,
  		blankText:'价格不能为空'
    },{
        fieldLabel: '<span style="color:red;">*</span>仓位（或外地仓库名）',
        xtype: 'textfield',
        itemId: 'astorePlace',
        id: 'astorePlace',
        name:'storePlace',
        style: 'padding-top:3px;',
        labelWidth: 100,
        labelAlign: 'right',
        width: 300,
        allowBlank : false,
  		blankText:'不能为空',
        maxLength: 50,
        maxLengthText: '仓位不能超过50字符'
    }, {
    	fieldLabel: '<span style="color:red;">*</span>仓库类型',
    	labelAlign: 'right',
    	xtype:'combobox',
    	width:300,
    	itemId: 'aisLocal',
        id: 'aisLocal',
        name:'isLocal',
    	typeAhead : true,
        triggerAction:'all',
        mode : 'local',  
        store : new Ext.data.ArrayStore({  
                    fields : ['value', 'text'],  
                    data : [["0", '本地'], ["2", '外地']]  
                }),  
        valueField : 'value',  
        displayField : 'text',  
        emptyText : '请选择',  
        editable:false
    },
    {

        fieldLabel: '时间',
        xtype: 'textfield',
        itemId: 'atime',
        id: 'atime',
        name:'time',
        style: 'padding-top:3px;',
        labelWidth: 100,
        labelAlign: 'right',
        width: 300
    },
    {

        fieldLabel: '备忘录',
        xtype: 'textarea',
        itemId: 'aorderNote',
        id: 'aorderNote',
        name:'orderNote',
        style: 'padding-top:3px;',
        labelWidth: 100,
        labelAlign: 'right',
        width: 300,
        maxLength: 500,
        maxLengthText: '订单号不能超过500字符',
    }
    ];

    var createAddWin = function() {
        return Ext.create('Ext.window.Window', {
            title: '新增仓库',
            height: 405,
            width: 350,
            closeAction: 'hide',
            modal: true,
            items: {
                id: 'form1',
                xtype: 'form',
                bodyPadding: 5,
                height: 405,
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
                             url: SHOPORDER_SAVE_URL,
                             success: function(form, action) {
                                 if (action.success) {
                                	 if(action.result.status == 200)
                                	{
                                		 Ext.Msg.alert('操作提示', action.result.mess,
                                                 function() {
                                                     shopOrderStore.load();
                                                     addWin.close();
                                                 }); 
                                	}
                                	 else
                                	{
                                		 Ext.Msg.alert('操作提示', action.result.mess,
                                                 function() {
                                                 });	 
                                	}
                                     
                                 } else {
                                     Ext.Msg.alert('操作提示', '新增失败！',
                                     function() {
                                     });
                                 }
                             },
                             failure: function(form, action) {
                                 Ext.Msg.alert('操作提示', "新增失败！",
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
    }

    var editWin = null;
    // 修改影片剧照信息form
    var editForm = [
                   {
                       xtype: 'hidden',
                       itemId: 'eid',
                       id: 'eid',
                       name:'id',
                       readOnly:true
                    },
                    {
                        fieldLabel: '<span style="color:red;">*</span> 订单号',
                        xtype: 'textfield',
                        itemId: 'eorderId',
                        id: 'eorderId',
                        name:'orderId',
                        style: 'padding-top:3px;',
                        labelWidth: 100,
                        labelAlign: 'right',
                        allowBlank : false,
                  		blankText:'不能为空',
                        width: 300,
                        maxLength: 20,
                        maxLengthText: '订单号不能超过20字符'
                    },{
                        fieldLabel: '<span style="color:red;">*</span>订单编号',
                        xtype: 'textfield',
                        itemId: 'eorderCode',
                        id: 'eorderCode',
                        name:'orderCode',
                        style: 'padding-top:3px;',
                        labelWidth: 100,
                        labelAlign: 'right',
                        width: 300,
                        allowBlank : false,
                  		blankText:'不能为空',
                        maxLength: 50,
                        maxLengthText: '订单编号不能超过50字符'
                    },
                    {
                        fieldLabel: '<span style="color:red;">*</span> 店铺名称',
                        xtype: 'textfield',
                        itemId: 'eshopName',
                        id: 'eshopName',
                        name:'shopName',
                        style: 'padding-top:3px;',
                        labelWidth: 100,
                        labelAlign: 'right',
                        allowBlank : false,
                  		blankText:'不能为空',
                        width: 300,
                        maxLength: 100,
                        maxLengthText: '店铺名称不能超过100字符'
                    },
                    {
                        fieldLabel: '<span style="color:red;">*</span> 商品编码',
                        xtype: 'textfield',
                        itemId: 'eproductCode',
                        id: 'eproductCode',
                        name:'productCode',
                        style: 'padding-top:3px;',
                        labelWidth: 100,
                        labelAlign: 'right',
                        allowBlank : false,
                  		blankText:'不能为空',
                        width: 300,
                        maxLength: 20,
                        maxLengthText: '商品编码不能超过20字符'
                    },
                    {
                        fieldLabel: '<span style="color:red;">*</span>数量',
                        xtype: 'textfield',
                        itemId: 'ecount',
                        id: 'ecount',
                        name:'count',
                        style: 'padding-top:3px;',
                        labelWidth: 100,
                        labelAlign: 'right',
                        width: 300,
                        regex: /^[0-9]{0,6}$/i,
                  		regexText : "只能输入6位以内数字",
                        allowBlank : false,
                  		blankText:'不能为空'
                    },
                    {

                        fieldLabel: '<span style="color:red;">*</span>尺码',
                        xtype: 'textfield',
                        itemId: 'esize',
                        id: 'esize',
                        name:'size',
                        style: 'padding-top:3px;',
                        labelWidth: 100,
                        labelAlign: 'right',
                        width: 300,
                        allowBlank : false,
                  		blankText:'尺码不能为空'
                    },
                    {

                        fieldLabel: '<span style="color:red;">*</span>价格',
                        xtype: 'textfield',
                        itemId: 'eprice',
                        id: 'eprice',
                        name:'price',
                        style: 'padding-top:3px;',
                        labelWidth: 100,
                        labelAlign: 'right',
                        width: 300,
                        allowBlank : false,
                  		blankText:'价格不能为空'
                    },{
                        fieldLabel: '<span style="color:red;">*</span>仓位（或外地仓库名）',
                        xtype: 'textfield',
                        itemId: 'estorePlace',
                        id: 'estorePlace',
                        name:'storePlace',
                        style: 'padding-top:3px;',
                        labelWidth: 100,
                        labelAlign: 'right',
                        width: 300,
                        allowBlank : false,
                  		blankText:'不能为空',
                        maxLength: 50,
                        maxLengthText: '仓位不能超过50字符'
                    }, {
                    	fieldLabel: '<span style="color:red;">*</span>仓库类型',
                    	labelAlign: 'right',
                    	xtype:'combobox',
                    	width:300,
                    	itemId: 'eisLocal',
                        id: 'eisLocal',
                        name:'isLocal',
                    	typeAhead : true,
                        triggerAction:'all',
                        mode : 'local',  
                        store : new Ext.data.ArrayStore({  
                                    fields : ['value', 'text'],  
                                    data : [["0", '本地'], ["2", '外地']]  
                                }),  
                        valueField : 'value',  
                        displayField : 'text',  
                        emptyText : '请选择',  
                        editable:false
                    },
                    {

                        fieldLabel: '时间',
                        xtype: 'textfield',
                        itemId: 'etime',
                        id: 'etime',
                        name:'time',
                        style: 'padding-top:3px;',
                        labelWidth: 100,
                        labelAlign: 'right',
                        width: 300
                    },
                    {

                        fieldLabel: '备忘录',
                        xtype: 'textarea',
                        itemId: 'eorderNote',
                        id: 'eorderNote',
                        name:'orderNote',
                        style: 'padding-top:3px;',
                        labelWidth: 100,
                        labelAlign: 'right',
                        width: 300,
                        maxLength: 500,
                        maxLengthText: '订单号不能超过500字符',
                    }
                    ];

    var createEditWin = function() {
        return Ext.create('Ext.window.Window', {
            title: '修改',
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
                            url: SHOPORDER_UPDATE_URL,
                            success: function(form, action) {
                                if (action.success) {
                               	 if(action.result.status == 200)
                               	{
                               		 Ext.Msg.alert('操作提示', action.result.mess,
                                                function() {
                                                    shopOrderStore.load();
                                                    editWin.close();
                                                }); 
                               	}
                               	 else
                               	{
                               		 Ext.Msg.alert('操作提示', action.result.mess,
                                                function() {
                                                });	 
                               	}
                                    
                                } else {
                                    Ext.Msg.alert('操作提示', action.result.mess,
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
    var uploadWin;
    var creatUploadWin = function() {
        return Ext.create('Ext.window.Window', {
            title: '导入',
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
						if(!(/.(xlsx)$/i.test(filePath)))
						{
							Ext.Msg.alert('操作提示','请选择excle2007文件');
							return;
						}
						file_size = $file[0].files[0].size;
						if(file_size > 1024*100)
						{
							Ext.Msg.alert('操作提示','图片大小需在100k以内');
							return;
						}
						form.submit(
								{
									url:SHOPORDER_UPLOAD_URL,
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
    var submitAbnormalWin = null;
    // 增加影片剧照信息form
    var abnormalForm = [ {
        		xtype: 'hidden',
        		itemId: 'abnornalid',
        		id: 'abnornalid',
        		name:'id',
        		readOnly:true
     		},{
     			fieldLabel: '<span style="color:red;">*</span>描述',
     			xtype: 'textarea',
     			itemId: 'abnornaldesc',
     			id: 'abnornaldesc',
     			name:'desc',
     			style: 'padding-top:3px;',
     			labelWidth: 50,
     			labelAlign: 'right',
     			allowBlank : false,
          		blankText:'不能为空',
     			width: 250,
     			maxLength: 200,
     			maxLengthText: '不能超过200字符',
     		}];

    var createAbnormalWin = function() {
        return Ext.create('Ext.window.Window', {
            title: '提交异常审核',
            height: 140,
            width: 300,
            closeAction: 'hide',
            modal: true,
            items: {
                id: 'form4',
                xtype: 'form',
                bodyPadding: 5,
                height: 140,
                width: 300,
                items: abnormalForm
            },
            buttons: [{
                text: '确定',
                formBind: true,
                icon: '/oscar/public/images/common/success.png',
                iconAlign: 'right',
                handler: function() {
                    var formCmp = Ext.getCmp('form4');
                    var form = formCmp.getForm();
                    if (form.isValid()) {
                    	 form.submit({
                             url: SHOPORDER_SUBMIT_ABNORMAL,
                             success: function(form, action) {
                                 if (action.success) {
                                	 if(action.result.status == 200)
                                	{
                                		 Ext.Msg.alert('操作提示', action.result.mess,
                                                 function() {
                                                     ShopOrderStore.load();
                                                     submitAbnormalWin.close();
                                                 }); 
                                	}
                                	 else
                                	{
                                		 Ext.Msg.alert('操作提示', action.result.mess,
                                                 function() {
                                                 });	 
                                	}
                                     
                                 } else {
                                     Ext.Msg.alert('操作提示', '提交失败！',
                                     function() {
                                     });
                                 }
                             },
                             failure: function(form, action) {
                                 Ext.Msg.alert('操作提示', "提交失败！",
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
                	submitAbnormalWin.close()
                }
            }],
            buttonAlign: 'center'
        });
    }
    
    grid = Ext.create('Ext.grid.Panel', {
        renderTo: 'gridpanel',
        width: Ext.getBody().getWidth(),
        store: shopOrderStore,
        title: '订单录入管理',
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
            text: '订单号',
            dataIndex: 'orderId',
        },
        {
            text: '订单编码',
            dataIndex: 'orderCode'
        },
        {
            text: '店铺名称',
            dataIndex: 'shopName'
        },
        {
            text: '商品编码',
            dataIndex: 'productCode'
        },
        {
            text: '尺码',
            dataIndex: 'size'
        },
        {
            text: '仓位(或外地仓库名)',
            dataIndex: 'storePlace'
        },
        {
            text: '数量',
            dataIndex: 'count'
        },
        {
            text: '是否有货',
            dataIndex: 'isHaveProductFlag',
            renderer:function(value){
            	return value == 1?'有货':'无货';
            }
        },
        {
            text: '价格',
            dataIndex: 'price'
        },{
            text: '所属仓库',
            dataIndex: 'isLocal',
            renderer:function(value){
            	return value == 0?'本地':'外地';
            }
        },{
            text: '状态',
            dataIndex: 'abnormalMessage',
        },
        {
            header: '操作',
            menuDisabled: true,
            sortable: false,
            xtype: 'actioncolumn',
            items: [/*{
                icon: '/oscar/public/images/common/delete.gif',
                tooltip: '删除',
                handler: function(grid, rowIndex, colIndex) {
                    Ext.Msg.confirm('操作提示', '确定要删除该仓位吗？',
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
                                        Ext.Msg.alert('操作提示:',  text.mess,
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
                handler: function(grid, rowIndex, colIndex) {
                    var _store = grid.getStore();
                    var model = grid.getStore().getAt(rowIndex);
                    if (!editWin) {
                        editWin = createEditWin();
                    }
                    var editForm = editWin.getComponent('form2');
                    editForm.getComponent('eid').setValue(model.data.id);
                    editForm.getComponent("eorderId").setValue(model.data.orderId);
                    editForm.getComponent('eshopName').setValue(model.data.shopName);
                    editForm.getComponent('eproductCode').setValue(model.data.productCode);
                    editForm.getComponent('ecount').setValue(model.data.count);
                    editForm.getComponent('esize').setValue(model.data.size);
                    editForm.getComponent('estorePlace').setValue(model.data.storePlace);
                    editForm.getComponent('eisLocal').setValue(model.data.isLocal);
                    editForm.getComponent('eorderCode').setValue(model.data.orderCode);
                    editForm.getComponent('eorderNote').setValue(model.data.orderNote);
                    editForm.getComponent('etime').setValue(model.data.time);
                    editForm.getComponent('eprice').setValue(model.data.price);
                    editWin.show();
                }
            },{

                icon: '/oscar/public/images/common/cancel.png',
                tooltip: '提交异常审核',
                handler: function(grid, rowIndex, colIndex) {
                    var _store = grid.getStore();
                    var model = grid.getStore().getAt(rowIndex);
                    if (!submitAbnormalWin) {
                    	submitAbnormalWin = createAbnormalWin();
                    }
                    var editForm = submitAbnormalWin.getComponent('form4');
                    editForm.getComponent('abnornalid').setValue(model.data.id);
                    submitAbnormalWin.show();
                }
            }*/]
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
                    '订单号：',
                    {
                    	xtype:'textfield',
                    	id:'orderId',
                    	width:100
                    },
                    '店铺名称：',
                    {
                    	xtype:'textfield',
                    	id:'shopName',
                    	width:100
                    },
                    '是否有货：',
                    {
                    	xtype:'combobox',
                    	id:'isHaveProductFlag',
                    	width:80,
                    	typeAhead : true,
                        triggerAction:'all',
                        mode : 'local',  
                        store : new Ext.data.ArrayStore({  
                                    fields : ['value', 'text'],  
                                    data : [["", '所有'],["1", '有货'], ["2", '无货']]  
                                }),  
                        valueField : 'value',  
                        displayField : 'text',  
                        emptyText : '请选择',  
                        editable:false
                    },
                    '仓库类型：',
                    {
                    	xtype:'combobox',
                    	id:'isLocal',
                    	width:80,
                        typeAhead : true,
                        triggerAction:'all',
                        mode : 'local',  
                        store : new Ext.data.ArrayStore({  
                                    fields : ['value', 'text'],  
                                    data : [["", '所有'],["0", '本地'], ["2", '外地']]  
                                }),  
                        valueField : 'value',  
                        displayField : 'text',  
                        emptyText : '请选择',  
                        editable:false
                    },
                    {
                    	xtype:'button',
                    	text:'查询',
                    	icon:'/oscar/public/images/common/icon_searchd.gif',
                    	listeners:{
                    		click:function(){
                    			if(shopOrderStore){
                    				var proxy=shopOrderStore.getProxy();
                    				proxy.setExtraParam('orderId',Ext.getCmp('orderId').getValue());
                    				proxy.setExtraParam('shopName',Ext.getCmp('shopName').getValue());
                    				proxy.setExtraParam('isHaveProductFlag',Ext.getCmp('isHaveProductFlag').getValue());
                    				proxy.setExtraParam('isLocal',Ext.getCmp('isLocal').getValue());
                    				shopOrderStore.load({
                    					params:{start:0,limit:PAGE_SIZE}
                    				});
                    			}
                    		}
                    	}
                    }
            ],
        }]
       
    });
});