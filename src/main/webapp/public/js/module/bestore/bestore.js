/**
 * 店铺管理
 */


var PAGE_SIZE = 20;
var TURNPICTURE_STORE_URL = "/oscar/bestore/list.do";
var TURNPICTURE_UPDATE_URL = "/oscar/bestore/input.do";
var BESTORE_CONNECT_URL ="/oscar/bestore/connect.do";
var SHSUB_SAVE_URL = "/oscar/shSub/shSubSave.do";
var DIFF_REVIEW_URL="/oscar/bestore/diffreview.do";

var PURCHASE_BESTORE_COMPARE_URL="/oscar/bestore/compare.do";
Ext.onReady(function() {
    Ext.QuickTips.init();
    
    var photoStore = Ext.create('Ext.data.Store', {
        model: 'orderProduct',
        data:[]
    });


    var purchaseOrderStore = Ext.create('Ext.data.Store', {
    	fields:['purchaseId','purchaseName'],
    	proxy: {
    		type: 'ajax',
    		url:'/oscar/purchase/unSavePurchaseOrder.do',
    		reader: {
    			type: 'json',
    			root: 'data'
    		}
    	},
    	autoLoad: false
    });

    var changeweistore = Ext.create('Ext.data.Store', {
        model: 'changweimodel',
        proxy: {
            type: 'ajax',
            url: '/oscar/bestore/changeweiinfo.do',
            reader: {
                type: 'json',
                root: 'data'
            }
        },
        autoLoad: false
    });
    var changeweistoreload = function(id) {
        changeweistore.getProxy().extraParams = {
            'changechuid': id
        };
        changeweistore.load();

    }
    
    Ext.define('housemodel', {
        extend: 'Ext.data.Model',
        fields: [{
            name: 'shName',
            type: 'string'
        },
        {
            name: 'shId',
            type: 'string'
        }]
    });

    var houseStore = Ext.create('Ext.data.Store', {
        model: 'housemodel',
        proxy: {
            type: 'ajax',
            url: '/oscar/storeHouse/getLocalStoreHouse.do',
            reader: {
                type: 'json',
                root: 'list'
            }
        },
        autoLoad: true
    });
    houseStore.load();
    var houseCombo = new Ext.form.ComboBox({
    	store:houseStore,
    	emptyText:'请选择',
    	id:'shId',
    	mode:'local',
    	triggerAction:'all',
    	valueField:'shId',
    	displayField:'shName',
    	editable: false,
    	listeners: {
            'change': function(filed, newValue, oldValue, op) {
            	var proxy = shSubStore.getProxy();
				proxy.setExtraParam('shId',newValue);
            	shSubStore.load();
            }
    	}
    });
   
    //仓位信息 开始
    Ext.define('shSubmodel', {
        extend: 'Ext.data.Model',
        fields: [{
            name: 'shSubId',
            type: 'string'
        },
        {
            name: 'shSubId',
            type: 'string'
        }]
    });

    var shSubStore = Ext.create('Ext.data.Store', {
        model: 'shSubmodel',
        proxy: {
            type: 'ajax',
            url: '/oscar/shSub/getshSubByShId.do',
            reader: {
                type: 'json',
                root: 'list'
            }
        },
        autoLoad: true
    });
    var shSubCombo = new Ext.form.ComboBox({
    	store:shSubStore,
    	emptyText:'请选择',
    	mode:'local',
    	id:'shSubId',
    	typeAhead: true,
    	queryMode: 'local',
    	valueField:'shSubId',
    	displayField:'shSubId'
    });
    
    var addChangweiWin = null;
    // 增加仓位form
    var addChangeForm = [
    {
        fieldLabel: '<span style="color:red;">*</span> 仓位唯一标示',
        xtype: 'textfield',
        itemId: 'ashSubId',
        id: 'ashSubId',
        name:'shSubId',
        style: 'padding-top:3px;',
        labelWidth: 100,
        labelAlign: 'right',
        allowBlank : false,
  		blankText:'不能为空',
        width: 300,
        maxLength: 50,
        maxLengthText: '仓位唯一标示不能超过50字符',
        emptyText:'仓位唯一标示'
    },
    {
        fieldLabel: '<span style="color:red;">*</span> 所属仓库名称',
        xtype: 'combobox',
        itemId: 'ashId',
        id: 'ashId',
        name:'shId',
        style: 'padding-top:3px;',
        labelWidth: 100,
        labelAlign: 'right',
        allowBlank : false,
  		blankText:'不能为空',
        width: 300,
    	store:houseStore,
    	emptyText:'请选择',
    	mode:'local',
    	typeAhead: true,
    	valueField:'shId',
    	displayField:'shName'
    }];
    var createChangeWeiAddWin = function() {
        return Ext.create('Ext.window.Window', {
            title: '新增仓位',
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
                items: addChangeForm
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
                             url: SHSUB_SAVE_URL,
                             success: function(form, action) {
                                 if (action.success) {
                                	 if(action.result.status == 200)
                                	{
                                		 Ext.Msg.alert('操作提示', "新增仓位成功！",
                                                 function() {
                                                     shSubStore.load();
                                                     addChangweiWin.close();
                                                 }); 
                                	}
                                	 else
                                	{
                                		 Ext.Msg.alert('操作提示', action.result.mess,
                                                 function() {
                                                 });	 
                                	}
                                     
                                 } else {
                                     Ext.Msg.alert('操作提示', '新增仓位失败！',
                                     function() {
                                     });
                                 }
                             },
                             failure: function(form, action) {
                                 Ext.Msg.alert('操作提示', "新增仓位失败！",
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
                	addChangweiWin.close()
                }
            }],
            buttonAlign: 'center'
        });
    }
    //仓位信息 结束
  
    var storage = function(query,selections,i){
    	console.log("selections.length="+selections.length);
    	if(i < selections.length)
    	{

    		var record = selections[i];
    		var index = record.index+1;
    		var orderId = record.get('orderId');
    		var productId = record.get('id');
    		var inNum = record.get('inNum');
    		query.orderId = orderId;
    		query.id = productId;
    		query.inNum = inNum;
    		console.log("inNum"+inNum);
    		if(inNum&&inNum>0)
    		{
    			 Ext.Ajax.request({
    				                url: '/oscar/bestore/storage.do',
    				                async:false,
    				                params: query,
    				                method: 'POST',
    				                success: function (response, options) {
    									var result = Ext.decode(response.responseText)
    									var code = result.code;
    									if(code != 200)
    									{
    										var message = result.mess;
    										Ext.MessageBox.alert('提示信息', '第'+index+'行保存失败，'+message,function(){
    											photoStore.load();
    										});
    									}
    									else
    									{
    										i++;
    										storage(query,selections,i);
    									}
    				                   
    				                },
    				                failure: function (response, options) {
    				                    Ext.MessageBox.alert('提示信息', '系统繁忙！',function(){
    											photoStore.load();
    									});
    				                }
    				            });
    		}
    		else
    		{
    			i++;
    			storage(query,selections,i);
    		}
    	
    	}
    	else
    	{
    		Ext.MessageBox.alert('提示信息', '保存成功',function(){
    			photoStore.load();
    		});
    	}
    	
    }
    
    //入库采购对比 
    var bestoreStorwin = null;
    var bestoreStore = Ext.create('Ext.data.Store', {
        model: 'purchaseProductModel',
        pageSize: PAGE_SIZE,
        proxy: {
            type: 'ajax',
            url: PURCHASE_BESTORE_COMPARE_URL,
            reader: {
                type: 'json',
                root: 'datalist',
                totalProperty: 'totalRecords'
            }
        }
    });
    var bestoreGride = Ext.create('Ext.grid.Panel', {
        store: bestoreStore ,
        region: 'south',
        autoHeight:true,
        forceFit: 1,
        viewConfig: {
            emptyText: '&nbsp;&nbsp;没有相关的记录'	
        },
        columns: [
        {
        	text: '货品号',
        	dataIndex:'productId',
        	hidden:true
        },
        {
            text: '货品编码',
            dataIndex: 'productCode',
        },{
            text: '货品型号',
            dataIndex: 'productSize',
        },{
            text: '货品名称',
            dataIndex: 'productName',
        },{
            text: '采购数量',
            dataIndex: 'purchaseNum',
        },{
        	text:'入库数量',
        	dataIndex:'total'
        }],
        dockedItems: [{
            dock: 'bottom',
            xtype: 'pagingtoolbar',
            store: bestoreStore ,
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
                    	xtype:'textfield',id:'compareBarcode',width:120
                    },{
    					xtype : 'button',
    					text : '查询',
    					icon : '/oscar/public/images/common/icon_searchd.gif',
    					listeners:{
    						click:function(){
    							if(bestoreStore ){
    								var proxy = bestoreStore .getProxy();
    								proxy.setExtraParam('orderId',Ext.getCmp('orderId').getValue());
    								proxy.setExtraParam('barCode',Ext.getCmp('compareBarcode').getValue());
    								bestoreStore .load({
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
            items: [bestoreGride]
        });
    }
    var rowEditing2 =  Ext.create('Ext.grid.plugin.RowEditing', {
        clicksToMoveEditor: 1,
        autoCancel: false,
        saveBtnText  : '保存',
        cancelBtnText: '取消',
        pluginId:'rowediting22',
        listeners:{
        	beforeedit:function(editor,e){
        		console.log("编辑号1"+e.colIdx);
        		if(e.colIdx ===13)
        			return false;
        		return true;
        	},
        	edit: function(editor, ctx, eOpts) {
               var tempdata = ctx.record.data;
               var requestUrl=BESTORE_CONNECT_URL;
                Ext.Ajax.request({
                    url: requestUrl,
                    params: { 
                    	orderId:Ext.getCmp('orderId').getValue(),
                    	productCode: tempdata.productCode,
                    	barCode:tempdata.barCode
                    },
                    success: function(response){
                        var text = response.responseText;
                        var jsonObject = Ext.JSON.decode(text);
                        console.log(jsonObject.flag);
                        if(jsonObject.flag){
                        	ctx.record.set('productId',jsonObject.productId);
                        	ctx.record.set('productName',jsonObject.productName);
                        	ctx.record.set('allPrice',jsonObject.allPrice);
                        	ctx.record.set('purchaseNum',jsonObject.purchaseNum);
                        	ctx.record.set('price',jsonObject.price);
                        	ctx.record.set('sellsPrice',jsonObject.sellsPrice);
                        	ctx.record.set('productSize',jsonObject.productSize);
                        }else{
                        	Ext.Msg.alert("提示","没有此采购记录！");
                        }
                    }
                });
            },
            canceledit:function(rowEditing, context) {
            	
            }
        }
    });
    
    //审核window
    
    var reviewWin = null;
    // 增加仓位form
    var reviewForm = [
    {
        fieldLabel: '备注',
        xtype: 'textareafield',
        itemId: 'noteId',
        id: 'noteId',
        name:'noteId',
        style: 'padding-top:3px;',
        labelWidth: 100,
        labelAlign: 'right',
        width: 300,
        height:180
    }];
    var createReviewWin = function() {
        return Ext.create('Ext.window.Window', {
            title: '审核窗口',
            height: 260,
            width: 350,
            closeAction: 'hide',
            modal: true,
            items: {
                id: 'form5',
                xtype: 'form',
                bodyPadding: 5,
                height: 200,
                width: 340,
                items: reviewForm
            },
            buttons: [{
                text: '确定',
                formBind: true,
                icon: '/oscar/public/images/common/success.png',
                iconAlign: 'right',
                handler: function() {
                    var formCmp = Ext.getCmp('form5');
                    var form = formCmp.getForm();
                    if (form.isValid()) {
                    	 form.submit({
                             url: DIFF_REVIEW_URL,
                             params:{
                            	 orderId:Ext.getCmp('orderId').getValue()
                             },
                             success: function(form, action) {
                                 Ext.Msg.alert("提示","已提交审核");
                             },
                             failure: function(form, action) {
                            	 Ext.Msg.alert("提示","已提交审核");
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
                	reviewWin.close()
                }
            }],
            buttonAlign: 'center'
        });
    }
    
    
   var cellingEditing =  Ext.create('Ext.grid.plugin.CellEditing',{  
        clicksToEdit:2, //设置单击单元格编辑  
        pluginId:'cellediting2',
        listeners:{
        	beforeedit:function(editor,e){
        		console.log("编辑号2"+e.colIdx);
        		if(e.colIdx !=13){
        			return false;
        		}
        		return true;
        	}
        }
    });
    var sm = Ext.create('Ext.selection.CheckboxModel');
    grid = Ext.create('Ext.grid.Panel', {
        renderTo: 'gridpanel',
        width: Ext.getBody().getWidth(),
        store: photoStore,
        title: '商品入库',
        region: 'south',
        forceFit: 1,
        selModel: sm,
        height:500,
        plugins:[
         rowEditing2,cellingEditing
        ],
        viewConfig: {
            emptyText: '&nbsp;&nbsp;没有相关的记录'
        },
        columns: [{
        	dataIndex: 'id',
            hidden: true
        },{
            text: '采购单号',
            dataIndex: 'orderId',
            editor:{
           	 	allowBlank: true
           }
        },{
            text: '商品ID',
            dataIndex: 'productId',
            editor:{
           	 allowBlank: true
           }
        },
        {
            text: '尺码',
            dataIndex: 'productSize',
            editor:{
           	 allowBlank: true
           }
        },
        {
            text: '商品编码',
            dataIndex: 'productCode',
            editor:{
           	 allowBlank: true
           }
        },
        {
            text: '条形码',
            dataIndex: 'barCode',
            
        },
        {
            text: '商品名称',
            dataIndex: 'productName',
            editor:{
              	 allowBlank: true
              }
        },
        {
            text: '成本价',
            dataIndex: 'price',
            editor:{
              	 allowBlank: true
              }
        },
        {
            text: '牌价',
            dataIndex: 'sellsPrice',
            editor:{
              	 allowBlank: true
            }
        },
        {
            text: '总价',
            dataIndex: 'allPrice',
            editor:{
            	 plugins:[ Ext.create('Ext.grid.plugin.CellEditing',{  
                           clicksToEdit:1 //设置单击单元格编辑  
                           })],
             	 allowBlank: true
           }
        },
        {
            text: '采购数量',
            dataIndex: 'purchaseNum',
            editor:{
              	 allowBlank: true
            }
        },
//        {
//            text: '未入库数量',
//            dataIndex: 'noStorageNum',
//            editor:{
//              	 allowBlank: true
//            }
//        },
        {
            text: '数量(点击编辑)',
            dataIndex: 'inNum',
            editor:{
             	 allowBlank: true
           }
        }
        ],
        tbar:[{
            itemId: 'removeEmployee',
            text: '删除',
            id:'removeEmployee',
            iconCls: 'delete',
            handler: function(t) {
            	rowEditing2.cancelEdit();
            	var grid = t.up('gridpanel');
            	var sm = grid.getSelectionModel();
            	console.log(grid);
            	photoStore.remove(sm.getSelection());
            }
        },{
			xtype : 'button',
			text : '清空',
			listeners:{
				click:function(){
					console.log('清空');
					if(photoStore){
						photoStore.removeAll();
					}
				}
			}
		},{
			xtype : 'button',
			text : '采购与入库对比',
			listeners:{
				click:function(){
					var orderId = Ext.getCmp('orderId').getValue();
					if(orderId ==null){
						Ext.Msg.alert("提示","请选择采购单!");
						return ;
					}
					var proxy = bestoreStore.getProxy();
					proxy.setExtraParam('orderId',orderId);
					bestoreStore.load({
						params:{
							start:0,
							limit:PAGE_SIZE
						}
					});
					if(bestoreStorwin ==null){
						bestoreStorwin = creatProStoreWin();
					}
					bestoreStorwin.show();
				}
			}
		},{
			xtype:'button',
			text:'提交审核',
			listeners:{
				click:function(){
					var orderId = Ext.getCmp('orderId').getValue();
					if(orderId ==null){
                		Ext.Msg.alert("提示","请选择采购单");
                		return;
                	}
					if(reviewWin ==null){
						reviewWin = createReviewWin();
					}
					reviewWin.show();
				}
			}
		},
		{
			xtype : 'button',
			text : '新增仓位',
			listeners:{
				click:function(){
					if (addChangweiWin) {
						addChangweiWin.show();
                    } else {
                    	addChangweiWin = createChangeWeiAddWin();
                    	addChangweiWin.show();
                    }
				}
			}
		}],
        dockedItems: [{
            dock: 'bottom',
            xtype: 'toolbar',
            items:['->']
        },
        {
            xtype: 'toolbar',
            dock: 'top',
            items: [
            {
                fieldLabel: '采购单号',
                xtype: 'combobox',
                itemId: 'orderId',
                id: 'orderId',
                store: purchaseOrderStore,
                valueField: 'purchaseId',
                displayField: 'purchaseName',
                style: 'padding-top:3px;',
                labelWidth: 80,
                labelAlign: 'right',
                width: 280
            },
            '条码',{
            	xtype:'textareafield',id:'barCode',width:330,
            	listeners:{
            		'change':function(item,newValue,oldValue,e){
            			if(newValue !=null && newValue !=''){
            			var existFlag = false;
            			photoStore.each(function(record) {
            			   if(record.get('barCode')==newValue){
            				   record.set('inNum',record.get('inNum')+1);
            				   existFlag = true;
            			   }
            			});
            			if(existFlag==false){
            				orderId = Ext.getCmp('orderId').getValue();
            				console.log(orderId);
	            			if(orderId !=null && orderId !=''){
	            				Ext.Ajax.request({
	            					url: TURNPICTURE_STORE_URL,
	            					params: { 
	            						orderId:orderId,
	            						barCode:newValue
	            					},
	            					success: function(response){
	            				        var text = response.responseText;
	            				        console.log(text);
	            				        var r = Ext.JSON.decode(text);
	            				        photoStore.insert(0, r);
	            				    }
	            			});
            			}else{
            				Ext.Msg.alert('提示','请选择采购单！');
            			}
            		}
            		item.reset();	
            	}
            		
            	}
            }
            },{
				xtype : 'button',
				text : '查询',
				icon : '/oscar/public/images/common/icon_searchd.gif',
				listeners:{
					click:function(){
						if(photoStore){
							var proxy = photoStore.getProxy();
							proxy.setExtraParam('orderId',Ext.getCmp('orderId').getValue());
							proxy.setExtraParam('barCode',Ext.getCmp('barCode').getValue());
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
            '->','仓库',houseCombo,'仓位',shSubCombo,{
                xtype: 'button',
                text: '全部保存',
                icon: '/oscar/public/images/common/add.png',
                handler: function(t) {
                	var shId = Ext.getCmp('shId').getValue();
                	var shSubId = Ext.getCmp('shSubId').getValue();
                	if(!shId)
                	{
                		Ext.Msg.alert('操作提示','请选择仓库');
                		return;
                	}
                	if(!shSubId)
                	{
                		Ext.Msg.alert('操作提示','请选择仓位');
                		return;
                	}
                	var grid = t.up('gridpanel');
                	var gridstore = grid.getStore();
                	console.log("storedata:"+gridstore);
                	var dateArray = [];
                	gridstore.each(function(record) {
                		if(record)
                		{
                			dateArray.push(record);	
                		}
         			});
                	var query = {shId:shId,shSubId:shSubId}
                	console.log("dateArray = "+dateArray);
                	storage(query,dateArray,0);
//                	var selections = grid.getSelectionModel().getSelection();
//                	console.log(selections.length);
//                	if(!selections||selections.length <= 0)
//                	{
//                		Ext.Msg.alert('操作提示','请至少选择一条记录');
//                		return;
//                	}
//                	var dateObj = {};
//                	var maxIndex = 0;
//                	var minIndex = 0;
//                	for(var i=0;i<selections.length;i++)
//                	{
//                		var record = selections[i];
//                		var index = record.index;
//                		var inNum = record.get('inNum');
//                		if(!/^[1-9][0-9]*$/.test(inNum))
//                		{
//                			Ext.Msg.alert('操作提示','第'+(index+1)+'行数量必须为大于0的整数');
//                			return;
//                		}
//                		dateObj[index]= record;
//                		if(maxIndex < index)
//                		{
//                			maxIndex = index;
//                		}
//                		if(minIndex > index)
//                		{
//                			minIndex = index;
//                		}
//                	}
                }
            }],
        }]

    });
    
   
});
