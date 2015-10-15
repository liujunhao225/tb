/**
 * 仓位管理
 */
var PAGE_SIZE = 15;
var SHSUB_STORE_URL = "/oscar/shSub/getshSubList.do";
var SHSUB_SAVE_URL = "/oscar/shSub/shSubSave.do";
var SHSUB_UPDATE_URL = "/oscar/shSub/shSubUpdate.do";
var SHSUB_DELETE_URL = "/oscar/shSub/shSubDelete.do";
var SHSUB_PRODUCT_LIST_URL="/oscar/shSub/shsubProduct.do";
var SHSUB_PRODUCT_COUNT_UPDATE_URL="/oscar/shSub/countupdate.do";
var SHSUB_TRANSFER_URL="/oscar/shSub/transfer.do";
Ext.onReady(function() {
    Ext.QuickTips.init();
    var shSubStore = Ext.create('Ext.data.Store', {
        model: 'shSub',
        pageSize: PAGE_SIZE,
        proxy: {
            type: 'ajax',
            url: SHSUB_STORE_URL,
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
    shSubStore.load({
        params: {
            start: 0,
            limit: PAGE_SIZE
        }
    });

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

    //仓位store
    var changeweistore = Ext.create('Ext.data.Store', {
        model: 'changweimodel',
        proxy: {
            type: 'ajax',
            url: '/oscar/shSub/changeweiinfo.do',
            reader: {
                type: 'json',
                root: 'data'
            }
        },
        mode:'local',
        autoLoad: true
    });
    
    var addWin = null;
    // 增加仓位form
    var addForm = [
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

    var createAddWin = function() {
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
                             url: SHSUB_SAVE_URL,
                             success: function(form, action) {
                                 if (action.success) {
                                	 if(action.result.status == 200)
                                	{
                                		 Ext.Msg.alert('操作提示', "新增仓位成功！",
                                                 function() {
                                                     shSubStore.load();
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
                    addWin.close()
                }
            }],
            buttonAlign: 'center'
        });
    }

    var editWin = null;
    // 修改仓位form
    var editForm = [
                    {
                        fieldLabel: '<span style="color:red;">*</span> 仓位唯一标示',
                        xtype: 'textfield',
                        itemId: 'sshsubid',
                        id: 'sshsubid',
                        name:'sshsubid',
                        style: 'padding-top:3px;',
                        labelWidth: 100,
                        labelAlign: 'right',
                        allowBlank : false,
                  		blankText:'不能为空',
                        width: 300,
                        maxLength: 50,
                        maxLengthText: '仓位唯一标示不能超过50字符',
                        emptyText:'仓位唯一标示',
                        readOnly:true
                    },
                    {
                        fieldLabel: '<span style="color:red;">*</span> 转移仓位',
                        xtype: 'combobox',
                        itemId: 'dshsubid',
                        id: 'dshsubid',
                        name:'dshsubid',
                        style: 'padding-top:3px;',
                        labelWidth: 100,
                        labelAlign: 'right',
                        allowBlank : false,
                  		blankText:'不能为空',
                        width: 300,
                    	store:changeweistore,
                    	emptyText:'请选择',
                    	queryMode: 'local',
                    	typeAhead: true,
                    	displayField: 'shSubId',
    	                valueField: 'shSubId',
                    }
                    ];

    var createEditWin = function() {
        return Ext.create('Ext.window.Window', {
            title: '转移仓库',
            height: 230,
            width: 350,
            closeAction: 'hide',
            modal: true,
            items: {
                id: 'form2',
                xtype: 'form',
                bodyPadding: 5,
                height: 160,
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
                            url: SHSUB_TRANSFER_URL,
                            success: function(form, action) {
                            	Ext.Msg.alert("提示","已成功转移！");
                            	editWin.close();
                            },
                            failure: function(form, action) {
                                Ext.Msg.alert('操作提示', "修改仓位失败！",
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

    grid = Ext.create('Ext.grid.Panel', {
        renderTo: 'gridpanel',
        width: Ext.getBody().getWidth(),
        store: shSubStore,
        title: '仓位信息管理',
        region: 'south',
        autoHeight:true,
        forceFit: 1,
        viewConfig: {
            emptyText: '&nbsp;&nbsp;没有相关的记录'
        },
        columns: [{
            text: '仓位唯一标示',
            dataIndex: 'shSubId',
        },
        {
            text: '所在仓库名称',
            dataIndex: 'shName'
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
                                url: SHSUB_DELETE_URL,
                                params: {
                                	shSubId: model.data.shSubId
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
                handler: function(grid, rowIndex, colIndex) {
                    var _store = grid.getStore();
                    var model = grid.getStore().getAt(rowIndex);
                    if (!editWin) {
                        editWin = createEditWin();
                    }
                    houseStore.load();
                    var editForm = editWin.getComponent('form2');
                    editForm.getComponent('sshsubid').setValue(model.data.shSubId);
                    editWin.show();
                }
            }]
        }],
        dockedItems: [{
            dock: 'bottom',
            xtype: 'pagingtoolbar',
            store: shSubStore,
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
                    '仓位唯一标示：',
                    {
    	                	id:'shSubId',
    	                	width:120,
    	                	xtype:'combobox',
        	                store:  changeweistore,
        	                queryMode: 'local',
        	                displayField: 'shSubId',
        	                valueField: 'shSubId',
                    },
                    {
                    	xtype:'button',
                    	text:'查询',
                    	icon:'/oscar/public/images/common/icon_searchd.gif',
                    	listeners:{
                    		click:function(){
                    			if(shSubStore){
                    				var proxy=shSubStore.getProxy();
                    				proxy.setExtraParam('shSubId',Ext.getCmp('shSubId').getValue());
                    				shSubStore.load({
                    					params:{start:0,limit:PAGE_SIZE}
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
                	 houseStore.load();
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
    //
   
    var creatProStoreWin = function (){
        return Ext.create('Ext.window.Window', {
            title: '商品信息展示',
            height: $(window).height()*0.8,
            width: Ext.getBody().getWidth()*0.8,
            closeAction: 'hide',
            modal: true,
            items: [cwProductgrid]
        });
    
    };
    
  
    //仓位商品
    var cwproductstore = Ext.create('Ext.data.Store', {
        model: 'cwproductmodel',
        pageSize: PAGE_SIZE,
        proxy: {
            type: 'ajax',
            url: SHSUB_PRODUCT_LIST_URL,
            reader: {
                type: 'json',
                root: 'datalist',
                totalProperty: 'totalRecords'
            }
        },
    	autoLoad:true,
    });
    
    var proStorwin=null;
    function queryfromrow( grid,record,item,rowIndex,rowIndex){
    		console.log("window show");
    	  if (!proStorwin) {
          	proStorwin = creatProStoreWin();
          }
          var proxy = cwproductstore .getProxy();
          proxy.setExtraParam('shsubid',record.data.shSubId);
          cwproductstore .load({
          params: {
              start: 0,
              limit: PAGE_SIZE,
          }});
          proStorwin.show();
    }
    
    var rowEditing2 = Ext.create('Ext.grid.plugin.RowEditing', {
        clicksToMoveEditor: 1,
        autoCancel: false,
        saveBtnText  : '保存',
        cancelBtnText: '取消',
        listeners:{
        	edit: function(editor, ctx, eOpts) {
               var tempcount = ctx.record.data.reallycount;
               var desshid = ctx.record.data.dsubShid;
               var shSubId= ctx.record.data.shSubId;
               var productcode = ctx.record.data.productCode;
               if(tempcount=='' && desshid==''){
            	   console.log("both null");
            	   return ;
               }else if(tempcount !='' && desshid !='' ){
            	   console.log("both not null");
            	   return ;
               }
                Ext.Ajax.request({
                    url: SHSUB_PRODUCT_COUNT_UPDATE_URL,
                    params: { 
                    	count:tempcount,
                    	shSubId:shSubId,
                    	productCode:productcode,
                    	desshid:desshid
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
    
   var cwProductgrid = Ext.create('Ext.grid.Panel', {
    	        store: cwproductstore ,
    	        region: 'south',
    	        autoHeight:false,
    	        forceFit: 1,
    	        height:400,
    	        viewConfig: {
    	            emptyText: '&nbsp;&nbsp;没有相关的记录'	
    	        },
    	        plugins: [rowEditing2],
    	      
    	        columns: [
    	         {
    	        	 text:'',
    	        	 dataIndex:'shSubId',
    	        	 hidden:true
    	         }
    	         ,
    	        {
    	            text: '货品编码',
    	            dataIndex: 'productCode'
    	        },{
    	            text: '所在仓库',
    	            dataIndex: 'shId',
    	        },{
    	        	text:'库存数量',
    	        	dataIndex:'count'
    	        },{
    	        	text:'实际数量',
    	        	dataIndex:'reallycount',
    	        	editor:{
    	        		allowBlank:true
    	        	}
    	        },{
    	        	text:'仓位变更',
    	        	dataIndex:'dsubShid',
    	        	editor:{
    	        		xtype:'combobox',
    	                store:  changeweistore,
    	                queryMode: 'local',
    	                displayField: 'shSubId',
    	                valueField: 'shSubId',
    	        	}
    	        }
    	        ],	
    	        dockedItems: [{
    	            dock: 'bottom',
    	            xtype: 'pagingtoolbar',
    	            store: cwproductstore ,
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
    	        }
    	        ]

    	    });
    	 
    	 grid.addListener("itemdblclick",queryfromrow);
});