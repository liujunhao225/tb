/**
 * 仓位管理
 */
var PAGE_SIZE = 15;
var SHSUB_STORE_URL = "/oscar/shSub/getshSubList.do";
var SHSUB_SAVE_URL = "/oscar/shSub/shSubSave.do";
var SHSUB_UPDATE_URL = "/oscar/shSub/shSubUpdate.do";
var SHSUB_DELETE_URL = "/oscar/shSub/shSubDelete.do";
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
                        itemId: 'eshSubId',
                        id: 'eshSubId',
                        name:'shSubId',
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
                        fieldLabel: '<span style="color:red;">*</span> 所属仓库名称',
                        xtype: 'combobox',
                        itemId: 'eshId',
                        id: 'eshId',
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
                    }
//                    {
//                        fieldLabel: '<span style="color:red;">*</span>仓位容量',
//                        xtype: 'textfield',
//                        itemId: 'ecapacity',
//                        id: 'ecapacity',
//                        name:'capacity',
//                        style: 'padding-top:3px;',
//                        labelWidth: 100,
//                        labelAlign: 'right',
//                        width: 300,
//                        regex: /^[0-9]{0,6}$/i,
//                  		regexText : "只能输入6位以内数字",
//                        allowBlank : false,
//                  		blankText:'仓位容量不能为空',
//                        emptyText:'仓位容量'
//                    },
//                    {
//
//                        fieldLabel: '<span style="color:red;">*</span>已使用的数量',
//                        xtype: 'textfield',
//                        itemId: 'eusedTotal',
//                        id: 'eusedTotal',
//                        name:'usedTotal',
//                        style: 'padding-top:3px;',
//                        labelWidth: 100,
//                        labelAlign: 'right',
//                        width: 300,
//                        regex: /^[0-9]{0,6}$/i,
//                  		regexText : "只能输入6位以内数字",
//                        allowBlank : false,
//                  		blankText:'已使用的数量不能为空',
//                        emptyText:'已使用的数量'
//                    }
                    ];

    var createEditWin = function() {
        return Ext.create('Ext.window.Window', {
            title: '修改仓库',
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
                            url: SHSUB_UPDATE_URL,
                            success: function(form, action) {
                                if (action.success) {
                               	 if(action.result.status == 200)
                               	{
                               		 Ext.Msg.alert('操作提示', "修改仓位成功！",
                                                function() {
                                                    shSubStore.load();
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
                                    Ext.Msg.alert('操作提示', '修改仓位失败！',
                                    function() {
                                    });
                                }
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
//        {
//            text: '仓位容量',
//            dataIndex: 'capacity'
//        },
//        {
//            text: '已使用的数量',
//            dataIndex: 'usedTotal'
//        },
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
                    editForm.getComponent('eshSubId').setValue(model.data.shSubId);
                    editForm.getComponent("eshId").setValue(model.data.shId);
//                    editForm.getComponent('ecapacity').setValue(model.data.capacity);
//                    editForm.getComponent('eusedTotal').setValue(model.data.usedTotal);
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
                    	xtype:'textfield',
                    	id:'shSubId',
                    	width:120
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
});