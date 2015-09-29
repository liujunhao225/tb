/**
 * 店铺管理
 */
var PAGE_SIZE = 15;
var TURNPICTURE_STORE_URL = "/oscar/specialstore/list.do";
var SHOPORDER_UPLOAD_URL = "/oscar/specialstore/upload.do";
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
    
    var storeTypeData = Ext.create('Ext.data.Store',{
    	fields:['name','value'],
    	data:[{'name':'本地','value':'1'},{'name':'外地','value':'2'}]
    });
    var stortInputMethod = Ext.create('Ext.data.Store',{
    	fields:['name','value'],
    	data:[{'name':'增量式','value':'1'},{'name':'清空式','value':'2'}]
    });
    
    var uploadWin;
    var creatUploadWin = function() {
        return Ext.create('Ext.window.Window', {
            title: '导入订单',
            height: 350,
            width: 350,
            closeAction: 'hide',
            modal: true,
            items: {
                id: 'form3',
                xtype: 'form',
                bodyPadding: 5,
                height: 300,
                width: 340,
                items: [{
                    fieldLabel: '<span style="color:red;">*</span> 仓库类型',
                    xtype: 'combobox',
                    itemId: 'ustoreTypeId',
                    id: 'ustoreTypeId',
                    name:'ustoreTypeId',
                    style: 'padding-top:3px;',
                    labelWidth: 100,
                    labelAlign: 'right',
                    allowBlank : false,
              		blankText:'不能为空',
                    width: 300,
                	store:storeTypeData,
                	emptyText:'请选择',
                	mode:'local',
                	typeAhead: true,
                	valueField:'value',
                	displayField:'name'
                },{
                    fieldLabel: '<span style="color:red;">*</span>导入方法',
                    xtype: 'combobox',
                    itemId: 'umethod',
                    id: 'umethod',
                    name:'umethod',
                    style: 'padding-top:3px;',
                    labelWidth: 100,
                    labelAlign: 'right',
                    allowBlank : false,
              		blankText:'不能为空',
                    width: 300,
                	store:stortInputMethod,
                	emptyText:'请选择',
                	mode:'local',
                	typeAhead: true,
                	valueField:'value',
                	displayField:'name'
                } ,{
        			xtype : 'textfield',
        			fieldLabel:'<span style="color:red;">*</span> 文件',
        			inputType:'file',
        			id : 'auploadUrl',
        			name : 'file',
        			itemId:'auploadUrl',
        			labelWidth:80,
        			style: 'padding-top:3px;',
        			labelAlign:'right',
        			width:300,
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
						if(file_size > 1024*1000*20)
						{
							Ext.Msg.alert('操作提示','文件大小需在20M以内');
							return;
						}
						form.submit(
								{
									url:SHOPORDER_UPLOAD_URL,
									success:function(form,action){
										console.log(action);
										if(action.success){
												Ext.Msg.alert('操作提示',"导入信息"+action.result.total+"条！",function(){
													uploadWin.close();
													shopOrderStore.load();
												});	
										}else{
											Ext.Msg.alert('操作提示','导入文件失败',function(){
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
    
    Ext.define('storemodel', {
        extend: 'Ext.data.Model',
        fields: [{
            name: 'shId',
            type: 'string'
        },
        {
            name: 'shName',
            type: 'string'
        }]
    });
    var storekind = Ext.create('Ext.data.Store', {
        model: 'storemodel',
        proxy: {
            type: 'ajax',
            url: '/oscar/storeHouse/storekind.do',
            reader: {
                type: 'json',
                root: 'data'
            }
        },
        autoLoad: true
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
        columns: [
        {
            text: '商品号',
            dataIndex: 'productId'
        },
        {
            text: '仓库',
            dataIndex: 'shStoreId'
        },
        {
            text: '价格',
            dataIndex: 'price'
        }, 
        {
            text: '数量',
            dataIndex: 'totalCount'
        },{
        	text:'日期',
        	dataIndex:'inputTime'
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
                    {
                        fieldLabel: '仓库',
                        xtype: 'combobox',
                        itemId: 'schangeku',
                        id: 'schangeku',
                        store: storekind,
                        valueField: 'shId',
                        displayField: 'shName',
                        listener:{
                        	'onchange':function(){
                        		
                        	}
                        }
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
    								proxy.setExtraParam('tstorehouseid',Ext.getCmp('schangeku').getValue());
    								photoStore.load({
    									params:{
    										startLine:1,
    										limit:PAGE_SIZE
    									}
    								});
    							}
    						}
    					}
    				},'->', {
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
                    }
            ]
        }]
       
    });
});