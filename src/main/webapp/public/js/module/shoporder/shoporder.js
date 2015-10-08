/**
 * 订单录入管理
 */
var PAGE_SIZE = 15;
var SHOPORDER_STORE_URL = "/oscar/shopOrder/getShopOrderList.do";
var SHOPORDER_SAVE_URL = "/oscar/shopOrder/addShopOrder.do";
var SHOPORDER_UPDATE_URL = "/oscar/shopOrder/updateShopOrder.do";
var SHOPORDER_DELETE_URL = "/oscar/shopOrder/deleteShopOrder.do";
var SHOPORDER_UPLOAD_URL = "/oscar/shopOrder/uploadShopOrder.do";
var SHOPORDER_SUBMIT_ABNORMAL = "/oscar/shopOrder/submitAbnormalOrder.do";
var SHOPORDER_DOWNLOAD_URL = "/oscar/shopOrder/downLoadShopOrder.do";
Ext.onReady(function() {
    Ext.QuickTips.init();
	  
	function exportButtonClick (){  
	     window.location.href = SHOPORDER_DOWNLOAD_URL;  
	}
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
   
    //仓位信息 开始
    Ext.define('shSubmodel', {
        extend: 'Ext.data.Model',
        fields: [{
            name: 'test',
            type: 'string'
        },
        {
            name: 'value',
            type: 'string'
        }]
    });

    var shSubStore = Ext.create('Ext.data.Store', {
        model: 'shSubmodel',
        proxy: {
            type: 'ajax',
            url: '/oscar/shopOrder/getStorePlace.do',
            reader: {
                type: 'json',
                root: 'list'
            }
        },
        autoLoad: true
    });
    var shSubCombo = new Ext.form.ComboBox({
    	fieldLabel: '<span style="color:red;">*</span>仓位（或外地仓库名）',
    	labelWidth: 135,
    	store:shSubStore,
    	emptyText:'请选择',
    	mode:'local',
    	itemId: 'astorePlace',
        id: 'astorePlace',
        name:'storePlace',
    	typeAhead: true,
    	queryMode: 'local',
    	valueField:'value',
    	displayField:'test'
    });
    
    var addWin = null;
    // 增加订单form
    var addForm = [
    {
        fieldLabel: '<span style="color:red;">*</span> 订单号',
        xtype: 'textfield',
        itemId: 'aorderId',
        id: 'aorderId',
        name:'orderId',
        style: 'padding-top:3px;',
        labelWidth: 120,
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
        labelWidth: 120,
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
        labelWidth: 120,
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
        labelWidth: 120,
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
        labelWidth: 120,
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
        labelWidth: 120,
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
        labelWidth: 120,
        labelAlign: 'right',
        width: 300,
        allowBlank : false,
  		blankText:'价格不能为空'
    }, {
    	fieldLabel: '<span style="color:red;">*</span>仓库类型',
    	labelAlign: 'right',
    	xtype:'combobox',
    	labelWidth: 120,
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
    	listeners: {
            'change': function(filed, newValue, oldValue, op) {
            	var proxy = shSubStore.getProxy();
            	var productCode = Ext.String.trim(Ext.getCmp("aproductCode").getValue());
            	var count = Ext.String.trim(Ext.getCmp("acount").getValue());
            	var size = Ext.String.trim(Ext.getCmp("asize").getValue());
            	Ext.getCmp("astorePlace").setValue("");
            	if(!productCode)
            	{
            		Ext.Msg.alert('操作提示', '请输入产品编码'); 
            		return;
            	}
            	if(!size)
            	{
            		Ext.Msg.alert('操作提示', '请输入尺寸'); 
            		return;
            	}
            	if(!/^[1-9][0-9]{0,5}$/i.test(count))
            	{
            		Ext.Msg.alert('操作提示', '请输入数量'); 
            		return;
            	}
				proxy.setExtraParam('isLocal',newValue);
				proxy.setExtraParam('productCode',productCode);
				proxy.setExtraParam('count',count);
				proxy.setExtraParam('size',size);
            	shSubStore.load();
            }
    	},
        editable:false
    },shSubCombo,
    {

        fieldLabel: '时间',
        xtype: 'textfield',
        itemId: 'atime',
        id: 'atime',
        name:'time',
        style: 'padding-top:3px;',
        labelWidth: 120,
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
        labelWidth: 120,
        labelAlign: 'right',
        width: 300,
        maxLength: 500,
        maxLengthText: '订单号不能超过500字符',
    }
    ];

    var createAddWin = function() {
        return Ext.create('Ext.window.Window', {
            title: '新增订单',
            height: 425,
            width: 375,
            closeAction: 'hide',
            modal: true,
            items: {
                id: 'form1',
                xtype: 'form',
                bodyPadding: 5,
                height: 425,
                width: 370,
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
    var eshSubCombo = new Ext.form.ComboBox({
    	fieldLabel: '<span style="color:red;">*</span>仓位（或外地仓库名）',
    	labelWidth: 135,
    	store:shSubStore,
    	emptyText:'请选择',
    	mode:'local',
    	itemId: 'estorePlace',
        id: 'estorePlace',
        name:'storePlace',
    	typeAhead: true,
    	queryMode: 'local',
    	valueField:'value',
    	displayField:'test'
    });
    var editWin = null;
    // 修改订单form
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
                        listeners: {
                            'change': function(filed, newValue, oldValue, op) {
                            	var proxy = shSubStore.getProxy();
                            	var productCode = Ext.String.trim(Ext.getCmp("eproductCode").getValue());
                            	var count = Ext.String.trim(Ext.getCmp("ecount").getValue());
                            	var size = Ext.String.trim(Ext.getCmp("esize").getValue());
                            	if(!productCode)
                            	{
                            		Ext.Msg.alert('操作提示', '请输入产品编码'); 
                            		return;
                            	}
                            	if(!size)
                            	{
                            		Ext.Msg.alert('操作提示', '请输入尺寸'); 
                            		return;
                            	}
                            	if(!/^[1-9][0-9]{0,5}$/i.test(count))
                            	{
                            		Ext.Msg.alert('操作提示', '请输入数量'); 
                            		return;
                            	}
                				proxy.setExtraParam('isLocal',newValue);
                				proxy.setExtraParam('productCode',productCode);
                				proxy.setExtraParam('count',count);
                				proxy.setExtraParam('size',size);
                				
                            	shSubStore.load();
                            }
                    	},  
                        editable:false
                    },eshSubCombo,
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
            title: '修改订单',
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
    var downloadWin;
    var creatdownloadWin = function() {
        return Ext.create('Ext.window.Window', {
            title: '导入订单',
            height: 100,
            width: 350,
            closeAction: 'hide',
            modal: true,
            items: {
                id: 'downloadform',
                xtype: 'form',
                bodyPadding: 5,
                height: 100,
                width: 340,
                items: [{
                    fieldLabel: '时间标记',
                    xtype: 'textfield',
                    itemId: 'downLoadTime',
                    id: 'downLoadTime',
                    name:'downLoadTime',
                    style: 'padding-top:3px;',
                    labelWidth: 80,
                    labelAlign: 'right',
                    width: 320,
                    maxLength: 500,
                    maxLengthText: '订单号不能超过500字符',
                }]
            },
            buttons: [{
                text: '确定',
                formBind: true,
                icon: '/oscar/public/images/common/success.png',
                iconAlign: 'right',
                handler: function() {
					var formCmp=Ext.getCmp('downloadform');
					var form=formCmp.getForm();
					var downLoadTime = formCmp.getComponent('downLoadTime').getValue();
					window.location.href = SHOPORDER_DOWNLOAD_URL+"?downLoadTime="+downLoadTime;
					downloadWin.close();
                }
            },
            {
                text: '取消',
                icon: '/oscar/public/images/common/undo.png',
                iconAlign: 'right',
                handler: function() {
                	downloadWin.close();
                }
            }],
            buttonAlign: 'center'
        });
    }
    var submitAbnormalWin = null;
    // 提交匹配订单异常form
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
                                                     shopOrderStore.load();
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
    
    
    Ext.define("filemodel", {
        extend: "Ext.data.Model",
        fields: [{
            name: "file_id",
            type: "string"
        },
        {
            name: "file_name",
            type: "string"
        }]
    });
    var filemodelstore = Ext.create("Ext.data.Store", {
        model: "filemodel",
        proxy: {
            type: "ajax",
            url: "/oscar/shopOrder/filelist.do",
            reader: {
                type: "json",
                root: "data"
            }
        },
        autoLoad: false
    });
    
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
            text: '时间',
            dataIndex: 'time',
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
            dataIndex: 'state',
            renderer:function(value){
            	switch(value){
            	case '1': return '匹配成功';
            	case '2':return '匹配失败';
            	case '3':return '异常';
            	case '4': return '已确认';
            	case '5':return '已出库';
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
                    var proxy = shSubStore.getProxy();
                	proxy.setExtraParam('isLocal',model.data.isLocal);
    				proxy.setExtraParam('productCode',model.data.productCode);
    				proxy.setExtraParam('count',model.data.count);
    				proxy.setExtraParam('size',model.data.size);
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
            }/*,{

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
                    '导入文件名：',
                    {
                    	xtype:'combobox',
                    	id:'f_file_id',
                    	width:220,
                    	valueField:'file_id',
                    	displayField:'file_name',
                    	store:filemodelstore,
                    	editables:false
                    },
                    '订单号：',
                    {
                    	xtype:'textfield',
                    	id:'orderId',
                    	width:80
                    },
                    '店铺名称：',
                    {
                    	xtype:'textfield',
                    	id:'shopName',
                    	width:80
                    },
                    '是否有货：',
                    {
                    	xtype:'combobox',
                    	id:'isHaveProductFlag',
                    	width:60,
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
                    	width:60,
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
                    '状态：',
                    {
                    	xtype:'combobox',
                    	id:'state',
                    	width:70,
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
                    				console.log("文件id:"+Ext.getCmp('f_file_id').getValue());
                    				proxy.setExtraParam('f_file_id',Ext.getCmp('f_file_id').getValue());
                    				proxy.setExtraParam('orderId',Ext.getCmp('orderId').getValue());
                    				proxy.setExtraParam('shopName',Ext.getCmp('shopName').getValue());
                    				proxy.setExtraParam('isHaveProductFlag',Ext.getCmp('isHaveProductFlag').getValue());
                    				proxy.setExtraParam('isLocal',Ext.getCmp('isLocal').getValue());
                    				proxy.setExtraParam('state',Ext.getCmp('state').getValue());
                    				shopOrderStore.load({
                    					params:{start:0,limit:PAGE_SIZE}
                    				});
                    			}
                    		}
                    	}
                    },
//            '->', {
//                    	xtype: 'button',
//                        text: '导出',
//                        icon: '/oscar/public/images/common/excel-up.png',
//                        handler: function() {
//                        	if(!downloadWin)
//                        	{
//                        		downloadWin = creatdownloadWin();
//                        	}
//                        	downloadWin.show();
//                        }
//                    }, {
//                    	xtype: 'button',
//                        text: '导入',
//                        icon: '/oscar/public/images/common/excel-up.png',
//                        handler: function() {
//                            if (uploadWin) {
//                            	uploadWin.show();
//                            } else {
//                            	uploadWin = creatUploadWin();
//                            	uploadWin.show();
//                            }
//                        }
//                    }, {
//                    	xtype: 'button',
//                    	text: '新增',
//                    	icon: '/oscar/public/images/common/add.png',
//                    	handler: function() {
//                    		if (addWin) {
//                    			addWin.show();
//                    		} else {
//                    			addWin = createAddWin();
//                    			addWin.show();
//                    		}
//                    	}
//            }
            ],
        }]
       
    });
});