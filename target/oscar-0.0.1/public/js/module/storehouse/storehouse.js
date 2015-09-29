/**
 * 仓库管理
 */
var PAGE_SIZE = 15;
var STOREHOUSE_STORE_URL = "/oscar/storeHouse/getStoreHouseList.do";
var STOREHOUSE_SAVE_URL = "/oscar/storeHouse/storeHouseSave.do";
var STOREHOUSE_UPDATE_URL = "/oscar/storeHouse/storeHouseUpdate.do";
var STOREHOUSE_DELETE_URL = "/oscar/storeHouse/storeHouseDelete.do";
Ext.onReady(function() {
    Ext.QuickTips.init();
    var storeHouseStore = Ext.create('Ext.data.Store', {
        model: 'storeHouse',
        pageSize: PAGE_SIZE,
        proxy: {
            type: 'ajax',
            url: STOREHOUSE_STORE_URL,
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
    storeHouseStore.load({
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
    var addWin = null;
    // 增加仓库form
    var addForm = [
    {
        fieldLabel: '<span style="color:red;">*</span> 仓库名称',
        xtype: 'textfield',
        itemId: 'ashName',
        id: 'ashName',
        name:'shName',
        style: 'padding-top:3px;',
        labelWidth: 80,
        labelAlign: 'right',
        allowBlank : false,
  		blankText:'不能为空',
        width: 280,
        maxLength: 50,
        maxLengthText: '店铺名称不能超过50字符',
        emptyText:'仓库名称'
    },
    {
    	fieldLabel: '<span style="color:red;">*</span> 仓库类型',
    	xtype:'combobox',
    	id:'ashType',
    	name:'shType',
    	labelWidth: 80,
        labelAlign: 'right',
    	width:280,
    	typeAhead : true,
        triggerAction:'all',
        mode : 'local',  
        store : new Ext.data.ArrayStore({  
                    fields : ['value', 'text'],  
                    data : [["2", '本地'], ["1", '外地']]  
                }),  
        valueField : 'value',  
        displayField : 'text', 
        emptyText : '请选择',
        editable:false,
        allowBlank : false,
  		blankText:'不能为空',
    },
    {
        fieldLabel: '<span style="color:red;">*</span>匹配优先级',
        xtype: 'textfield',
        itemId: 'aprivilegeLevel',
        id: 'aprivilegeLevel',
        name:'privilegeLevel',
        style: 'padding-top:3px;',
        labelWidth: 80,
        labelAlign: 'right',
        width: 280,
        regex: /^[0-9]{1,2}$/i,
  		regexText : "只能输入0-99之间的数字",
        allowBlank : false,
        blankText:'不能为空',
        emptyText:'匹配优先级'
    },
    {
        fieldLabel: '所在地址',
        xtype: 'textfield',
        itemId: 'ashAddress',
        id: 'ashAddress',
        name:'shAddress',
        style: 'padding-top:3px;',
        labelWidth: 80,
        labelAlign: 'right',
        width: 280,
        maxLength: 500,
        maxLengthText: '所在地址不能超过500字符'
    }];

    var createAddWin = function() {
        return Ext.create('Ext.window.Window', {
            title: '新增仓库',
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
                             url: STOREHOUSE_SAVE_URL,
                             success: function(form, action) {
                                 if (action.success) {
                                	 if(action.result.status == 200)
                                	{
                                		 Ext.Msg.alert('操作提示', "新增仓库成功！",
                                                 function() {
                                                     storeHouseStore.load();
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
                                     Ext.Msg.alert('操作提示', '新增仓库失败！',
                                     function() {
                                     });
                                 }
                             },
                             failure: function(form, action) {
                                 Ext.Msg.alert('操作提示', "新增仓库失败！",
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
    // 修改仓库form
    var editForm = [{
        xtype: "hidden",
        itemId: "eshId",
        id: "eshId",
        name:"shId"
    },
    {
        fieldLabel: '<span style="color:red;">*</span> 仓库名称',
        xtype: 'textfield',
        itemId: 'eshName',
        id: 'eshName',
        name:'shName',
        style: 'padding-top:3px;',
        labelWidth: 80,
        labelAlign: 'right',
        allowBlank : false,
  		blankText:'不能为空',
        width: 280,
        maxLength: 50,
        maxLengthText: '店铺名称不能超过50字符',
        emptyText:'仓库名称'
    },
    {
    	fieldLabel: '<span style="color:red;">*</span> 仓库类型',
    	xtype:'combobox',
    	id:'eshType',
    	name:'shType',
    	labelWidth: 80,
        labelAlign: 'right',
    	width:280,
    	typeAhead : true,
        triggerAction:'all',
        mode : 'local',  
        store : new Ext.data.ArrayStore({  
                    fields : ['value', 'text'],  
                    data : [["2", '本地'], ["1", '外地']]  
                }),  
        valueField : 'value',  
        displayField : 'text', 
        emptyText : '请选择',
        editable:false,
        allowBlank : false,
  		blankText:'不能为空',
    },{

        fieldLabel: '<span style="color:red;">*</span>匹配优先级',
        xtype: 'textfield',
        itemId: 'eprivilegeLevel',
        id: 'eprivilegeLevel',
        name:'privilegeLevel',
        style: 'padding-top:3px;',
        labelWidth: 80,
        labelAlign: 'right',
        width: 280,
        regex: /^[0-9]{1,2}$/i,
  		regexText : "只能输入0-99之间的数字",
        allowBlank : false,
        blankText:'不能为空',
    
    },
    {
        fieldLabel: '所在地址',
        xtype: 'textfield',
        itemId: 'eshAddress',
        id: 'eshAddress',
        name:'shAddress',
        style: 'padding-top:3px;',
        labelWidth: 80,
        labelAlign: 'right',
        width: 280,
        maxLength: 500,
        maxLengthText: '所在地址不能超过500字符'
    }];

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
                            url: STOREHOUSE_UPDATE_URL,
                            success: function(form, action) {
                                if (action.success) {
                               	 if(action.result.status == 200)
                               	{
                               		 Ext.Msg.alert('操作提示', "修改仓库成功！",
                                                function() {
                                                    storeHouseStore.load();
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
                                    Ext.Msg.alert('操作提示', '修改仓库失败！',
                                    function() {
                                    });
                                }
                            },
                            failure: function(form, action) {
                                Ext.Msg.alert('操作提示', "修改仓库失败！",
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
        store: storeHouseStore,
        title: '仓库信息管理',
        region: 'south',
        autoHeight:true,
        forceFit: 1,
        viewConfig: {
            emptyText: '&nbsp;&nbsp;没有相关的记录'
        },
        columns: [{
            text: 'ID',
            dataIndex: 'shId',
            hidden: true
        },
        {
            text: '仓库名称',
            dataIndex: 'shName'
        },
        {
            text: '仓库类型',
            dataIndex: 'shType',
            renderer: function(value){
            	return value == 1?'外地':'本地';
            }
        },
        {
            text: '匹配优先级',
            dataIndex: 'privilegeLevel'
        },
        {
            text: '所在地址',
            dataIndex: 'shAddress'
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
                    Ext.Msg.confirm('操作提示', '删除仓库将删除该仓库下的所有仓位，确定要删除该仓库吗？',
                    function(btn) {
                        if (btn == "yes") {
                            var _store = grid.getStore();
                            var model = grid.getStore().getAt(rowIndex);
                            Ext.Ajax.request({
                                url: STOREHOUSE_DELETE_URL,
                                params: {
                                	shId: model.data.shId
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
                    var editForm = editWin.getComponent('form2');
                    editForm.getComponent('eshId').setValue(model.data.shId);
                    editForm.getComponent("eshName").setValue(model.data.shName);
                    editForm.getComponent("eshType").setValue(model.data.shType);
                    editForm.getComponent("eprivilegeLevel").setValue(model.data.privilegeLevel);
                    editForm.getComponent('eshAddress').setValue(model.data.shAddress);
                    editWin.show();
                }
            }]
        }],
        dockedItems: [{
            dock: 'bottom',
            xtype: 'pagingtoolbar',
            store: storeHouseStore,
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
                    '仓库名称：',
                    {
                    	xtype:'textfield',
                    	id:'shName',
                    	width:120
                    },
                    {
                    	xtype:'button',
                    	text:'查询',
                    	icon:'/oscar/public/images/common/icon_searchd.gif',
                    	listeners:{
                    		click:function(){
                    			if(storeHouseStore){
                    				var proxy=storeHouseStore.getProxy();
                    				proxy.setExtraParam('shName',Ext.getCmp('shName').getValue());
                    				storeHouseStore.load({
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