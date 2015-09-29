/**
 * 快递单号管理
 */
var PAGE_SIZE = 15;
var SHOPORDER_STORE_URL = "/oscar/shopOrder/getShopOrderList.do";
var SHOPORDER_SAVE_URL = "/oscar/shSub/shSubSave.do";
var SHOPORDER_UPDATE_URL = "/oscar/shopOrder/updateExpress.do";
var SHOPORDER_DELETE_URL = "/oscar/shopOrder/deleteShopOrder.do";
var SHOPORDER_UPLOADEXPRESS_URL = "/oscar/shopOrder/uploadExpress.do";
Ext.onReady(function() {
    Ext.QuickTips.init();
    var shopOrderStore = Ext.create('Ext.data.Store', {
        model: 'shopOrder',
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
    shopOrderStore.load({
        params: {
            start: 0,
            limit: PAGE_SIZE
        }
    });

    var editWin = null;
    // 修改快递单号form
    var editForm = [
                    {
                        xtype: 'hidden',
                        itemId: 'eid',
                        id: 'eid',
                        name:'id',
                        readOnly:true
                    },
                    {
                        fieldLabel: '<span style="color:red;">*</span> 快递单号',
                        xtype: 'textfield',
                        itemId: 'eexpressId',
                        id: 'eexpressId',
                        name:'expressId',
                        style: 'padding-top:3px;',
                        labelWidth: 100,
                        labelAlign: 'right',
                        allowBlank : false,
                  		blankText:'不能为空',
                        width: 300,
                        maxLength: 20,
                        maxLengthText: '快递单号不能超过20字符',
                    },
                    {

                        fieldLabel: '渠道优化',
                        xtype: 'textfield',
                        itemId: 'echannel',
                        id: 'echannel',
                        name:'channel',
                        style: 'padding-top:3px;',
                        labelWidth: 100,
                        labelAlign: 'right',
                        maxLength: 20,
                        maxLengthText: '渠道优化不能超过20字符',
                        width: 300,
                    },
                    {

                        fieldLabel: '运费',
                        xtype: 'textfield',
                        itemId: 'efreight',
                        id: 'efreight',
                        name:'freight',
                        style: 'padding-top:3px;',
                        labelWidth: 100,
                        labelAlign: 'right',
                        maxLength: 10,
                        maxLengthText: '运费不能超过10字符',
                        width: 300,
                    },
                    {

                        fieldLabel: '邮编',
                        xtype: 'textfield',
                        itemId: 'ezipCode',
                        id: 'ezipCode',
                        name:'zipCode',
                        style: 'padding-top:3px;',
                        labelWidth: 100,
                        labelAlign: 'right',
                        maxLength: 10,
                        maxLengthText: '邮编不能超过10字符',
                        width: 300,
                    },
                    {

                        fieldLabel: '<span style="color:red;">*</span>收货人姓名',
                        xtype: 'textfield',
                        itemId: 'econsigneeName',
                        id: 'econsigneeName',
                        name:'consigneeName',
                        style: 'padding-top:3px;',
                        labelWidth: 100,
                        labelAlign: 'right',
                        maxLength: 20,
                        maxLengthText: '收货人姓名不能超过20字符',
                        width: 300,
                        allowBlank : false,
                  		blankText:'不能为空',
                    },
                    {

                        fieldLabel: '<span style="color:red;">*</span>联系方式',
                        xtype: 'textfield',
                        itemId: 'etelephone',
                        id: 'etelephone',
                        name:'telephone',
                        style: 'padding-top:3px;',
                        labelWidth: 100,
                        labelAlign: 'right',
                        maxLength: 30,
                        maxLengthText: '联系方式不能超过30字符',
                        width: 300,
                        allowBlank : false,
                  		blankText:'不能为空',
                    },
                    {

                        fieldLabel: '<span style="color:red;">*</span>发货方式',
                        xtype: 'textfield',
                        itemId: 'edeliveryMethod',
                        id: 'edeliveryMethod',
                        name:'deliveryMethod',
                        style: 'padding-top:3px;',
                        labelWidth: 100,
                        labelAlign: 'right',
                        maxLength: 20,
                        maxLengthText: '发货方式不能超过20字符',
                        width: 300,
                        allowBlank : false,
                  		blankText:'不能为空',
                    },
                    {

                        fieldLabel: '<span style="color:red;">*</span>收货地址',
                        xtype: 'textfield',
                        itemId: 'eaddress',
                        id: 'eaddress',
                        name:'address',
                        style: 'padding-top:3px;',
                        labelWidth: 100,
                        labelAlign: 'right',
                        maxLength: 200,
                        maxLengthText: '收货地址不能超过200字符',
                        width: 300,
                        allowBlank : false,
                  		blankText:'不能为空',
                    },
                    {

                        fieldLabel: '备注',
                        xtype: 'textarea',
                        itemId: 'enote',
                        id: 'enote',
                        name:'note',
                        style: 'padding-top:3px;',
                        labelWidth: 100,
                        labelAlign: 'right',
                        maxLength: 500,
                        maxLengthText: '备注不能超过500字符',
                        width: 300,
                    }
                    ];

    var createEditWin = function() {
        return Ext.create('Ext.window.Window', {
            title: '修改',
            height: 420,
            width: 350,
            closeAction: 'hide',
            modal: true,
            items: {
                id: 'form2',
                xtype: 'form',
                bodyPadding: 5,
                height: 420,
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
                               		 Ext.Msg.alert('操作提示', "修改成功！",
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
                                    Ext.Msg.alert('操作提示', '修改失败！',
                                    function() {
                                    });
                                }
                            },
                            failure: function(form, action) {
                                Ext.Msg.alert('操作提示', "修改失败！",
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
									url:SHOPORDER_UPLOADEXPRESS_URL,
									success:function(form,action){
										if(action.success){
											if(action.result.status == 200)
											{
												var mes = action.result.mess;
												if(!mes)
												{
													mes = "导入信息成功！";
												}
												Ext.Msg.alert('操作提示',mes,function(){
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
        title: '快递单号导入',
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
            text: '时间',
            dataIndex: 'time',
        },{
            text: '订单号',
            dataIndex: 'orderId',
        },
        {
            text: '快递单号',
            dataIndex: 'expressId'
        },{
            text: '收货人',
            dataIndex: 'consigneeName'
        },{
            text: '手机号',
            dataIndex: 'telephone'
        },{
            text: '邮编',
            dataIndex: 'zipCode'
        },{
            text: '收货地址',
            dataIndex: 'address'
        },{
            text: '快递方式',
            dataIndex: 'deliveryMethod'
        },
        {
            text: '渠道优化',
            dataIndex: 'channel'
        },
        {
            text: '运费',
            dataIndex: 'freight'
        },
        {
            text: '状态',
            dataIndex: 'state',
            renderer:function(value){
            	switch(value){
            	case '1': return '匹配成功';
            	case '2':return '匹配失败';
            	case '3':return '异常';
            	case '4': return '已确认';
            	case '5':return '已出库';
            	case '6':return '已删除';
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
                    Ext.Msg.confirm('操作提示', '确定要删除该记录吗？',
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
                                        Ext.Msg.alert('操作提示:', text.mess,
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
                    editForm.getComponent("eexpressId").setValue(model.data.expressId);
                    editForm.getComponent('echannel').setValue(model.data.channel);
                    editForm.getComponent('efreight').setValue(model.data.freight);
                    editForm.getComponent('ezipCode').setValue(model.data.zipCode);
                    editForm.getComponent('eaddress').setValue(model.data.address);
                    editForm.getComponent('etelephone').setValue(model.data.telephone);
                    editForm.getComponent('econsigneeName').setValue(model.data.consigneeName);
                    editForm.getComponent('edeliveryMethod').setValue(model.data.deliveryMethod);
                    editForm.getComponent('enote').setValue(model.data.note);
                    editWin.show();
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
                    '时间标记：',
                    {
                    	xtype:'textfield',
                    	id:'time',
                    	width:100
                    },
                    '订单号：',
                    {
                    	xtype:'textfield',
                    	id:'orderId',
                    	width:120
                    },
                    '快递单号：',
                    {
                    	xtype:'textfield',
                    	id:'expressId',
                    	width:120
                    },
                    '订单编码：',
                    {
                    	xtype:'textfield',
                    	id:'orderCode',
                    	width:120
                    },
                    '状态：',
                    {
                    	xtype:'combobox',
                    	id:'state',
                    	width:120,
                    	width:120,
                    	typeAhead : true,
                        triggerAction:'all',
                        mode : 'local',  
                        store : new Ext.data.ArrayStore({  
                                    fields : ['value', 'text'],  
                                    data : [["", '所有'],["1", '匹配成功'], ["2", '匹配失败'], ["3", '异常'], ["4", '已确认'], ["5", '已出库']]  
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
                    				proxy.setExtraParam('time',Ext.getCmp('time').getValue());
                    				proxy.setExtraParam('orderId',Ext.getCmp('orderId').getValue());
                    				proxy.setExtraParam('expressId',Ext.getCmp('expressId').getValue());
                    				proxy.setExtraParam('state',Ext.getCmp('state').getValue());
                    				proxy.setExtraParam('orderCode',Ext.getCmp('orderCode').getValue());
                    				shopOrderStore.load({
                    					params:{start:0,limit:PAGE_SIZE}
                    				});
                    			}
                    		}
                    	}
                    },
                    '->', {
                    	xtype: 'button',
                        text: '导入快递单号',
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