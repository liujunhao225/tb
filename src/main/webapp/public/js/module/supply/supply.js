/**
 * 轮播图管理
 */
var PAGE_SIZE = 15;
var TURNPICTURE_STORE_URL = "/oscar/supply/list.do";
var TURNPICTURE_SAVE_URL = "/oscar/supply/add.do";
var TURNPICTURE_UPDATE_URL = "/oscar/supply/update.do";
var TURNPICTURE_DELETE_URL = "/oscar/supply/delete.do";
Ext.onReady(function() {
    Ext.QuickTips.init();
    var photoStore = Ext.create('Ext.data.Store', {
        model: 'supply',
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

    var addWin = null;
    // 增加影片剧照信息form
    var addForm = [
    {
        fieldLabel: '<span style="color:red;">*</span> 供应商名称',
        xtype: 'textfield',
        itemId: 'asupplierName',
        id: 'asupplierName',
        style: 'padding-top:3px;',
        labelWidth: 80,
        labelAlign: 'right',
        width: 280,
        maxLength: 20,
        maxLengthText: '供应商名称不能超过20个字'
    },
    {
        fieldLabel: ' 联系人',
        xtype: 'textfield',
        itemId: 'acontactPeople',
        id: 'acontactPeople',
        style: 'padding-top:3px;',
        labelWidth: 80,
        labelAlign: 'right',
        width: 280,
        maxLength: 30,
        maxLengthText: '供应商负责人30个字符'
    },
    {
        fieldLabel: '<span style="color:red;">*</span>供应商电话',
        xtype: 'textfield',
        itemId: 'asupplierPhone',
        id: 'asupplierPhone',
        style: 'padding-top:3px;',
        labelWidth: 80,
        labelAlign: 'right',
        width: 280,
        maxLength: 200,
        maxLengthText: ''
    },{
        fieldLabel: '供应商简介 ',
        xtype: 'textareafield',
        itemId: 'asupplierProfile',
        id: 'asupplierProfile',
        style: 'padding-top:3px;',
        labelWidth: 80,
        labelAlign: 'right',
        width: 280,
        maxLength: 200,
        maxLengthText: '供应商电话不能超过200字'
    }];

    var createAddWin = function() {
        return Ext.create('Ext.window.Window', {
            title: '新境供应商',
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
                        if (Ext.String.trim(Ext.getCmp("asupplierName").getValue()) == "") {
                            Ext.Msg.alert('操作提示', '供应商名称不能为空！');
                            return;
                        }
                        if (Ext.String.trim(Ext.getCmp("asupplierPhone").getValue()) == "") {
                            Ext.Msg.alert('操作提示', '供应商电话不能为空！');
                            return;
                        }
                    }
                    form.submit({
                        url: TURNPICTURE_SAVE_URL,
                        params: {
                            supplierName: Ext.getCmp("asupplierName").getValue(),
                            contactPeople: Ext.getCmp("acontactPeople").getValue(),
                            supplierPhone: Ext.getCmp('asupplierPhone').getValue(),
                            supplierProfile: Ext.getCmp('asupplierProfile').getValue()
                        },
                        success: function(form, action) {
                            if (action.success) {
                                Ext.Msg.alert('操作提示', "新增供应商成功！",
                                function() {
                                    photoStore.load();
                                    addWin.close();
                                });
                            } else {
                                Ext.Msg.alert('操作提示', "新增供应商失败！",
                                function() {
                                    addWin.close();
                                });
                            }
                        },
                        failure: function(form, action) {
                            Ext.Msg.alert('操作提示', "新增供应商失败！",
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

    var editWin = null;
    // 修改影片剧照信息form
    var editForm = [{
        xtype: "hidden",
        itemId: "esupplierId",
        id: "esupplierId"
    },
    {
        fieldLabel: '<span style="color:red;">*</span> 供应商名称',
        xtype: 'textfield',
        itemId: 'esupplierName',
        id: 'esupplierName',
        style: 'padding-top:3px;',
        labelWidth: 80,
        labelAlign: 'right',
        width: 280,
        maxLength: 20,
        maxLengthText: '供应商不能超过20个字符'
    },
    {
        fieldLabel: '供应商联系人',
        xtype: 'textfield',
        itemId: 'econtactPeople',
        id: 'econtactPeople',
        style: 'padding-top:3px;',
        labelWidth: 80,
        labelAlign: 'right',
        width: 280,
        maxLength: 10,
        maxLengthText: '供应商联系人不能超过10个字'
    },
    {
        fieldLabel: '供应商电话 ',
        xtype: 'textfield',
        itemId: 'esupplierPhone',
        id: 'esupplierPhone',
        style: 'padding-top:3px;',
        labelWidth: 80,
        labelAlign: 'right',
        width: 280,
        maxLength: 20,
        maxLengthText: '供应商电话不能超过20'
    },{
        fieldLabel: '供应商简介 ',
        xtype: 'textareafield',
        itemId: 'esupplierProfile',
        id: 'esupplierProfile',
        style: 'padding-top:3px;',
        labelWidth: 80,
        labelAlign: 'right',
        width: 280,
        maxLength: 200,
        maxLengthText: '供应商电话不能超过200字'
    }];

    var createEditWin = function() {
        return Ext.create('Ext.window.Window', {
            title: '修改供应商',
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
                        if (Ext.String.trim(Ext.getCmp("esupplierName").getValue()) == "") {
                            Ext.Msg.alert('操作提示', '供应商名称不能为空！');
                            return;
                        }
                        if (Ext.String.trim(Ext.getCmp("esupplierPhone").getValue()) == "") {
                            Ext.Msg.alert('操作提示', '供应商电话不能为空！');
                            return;
                        }
                    }
                    form.submit({
                        url: TURNPICTURE_UPDATE_URL,
                        params: {
                        	supplierId: Ext.getCmp("esupplierId").getValue(),
                        	supplierName: Ext.getCmp("esupplierName").getValue(),
                        	supplierPhone: Ext.getCmp("esupplierPhone").getValue(),
                        	contactPeople: Ext.getCmp("econtactPeople").getValue(),
                        	supplierProfile: Ext.getCmp("esupplierProfile").getValue()
                        },
                        success: function(form, action) {
                            if (action.success) {
                                Ext.Msg.alert('操作提示', "修改供应商成功！",
                                function() {
                                    photoStore.load();
                                    editWin.close();
                                });
                            } else {
                                Ext.Msg.alert('操作提示', "修改供应商失败！",
                                function() {
                                    editWin.close();
                                });
                            }
                        },
                        failure: function(form, action) {
                            Ext.Msg.alert('操作提示', "修改供应商信息失败！",
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
    var photoWin = null;
    var photoForm = [{
        xtype: 'panel',
        id: "photoPanel",
        contentEl: 'picture',
        height: 300,
        width: 400
    }];

    var createPhotoWin = function() {
        return Ext.create('Ext.window.Window', {
            title: '图片',
            height: 300,
            width: 400,
            closeAction: 'hide',
            modal: true,
            items: {
                id: 'photoForm',
                xtype: 'form',
                bodyPadding: 0,
                height: 300,
                items: photoForm
            },
            buttons: [{
                text: '关闭',
                icon: '/oscar/public/images/common/undo.png',
                iconAlign: 'right',
                handler: function() {
                    photoWin.close();
                }
            }],
            buttonAlign: 'center'
        });
    }
    grid = Ext.create('Ext.grid.Panel', {
        renderTo: 'gridpanel',
        width: Ext.getBody().getWidth(),
        store: photoStore,
        title: '供应商列表',
        region: 'south',
        // autoHeight:true,
        forceFit: 1,
        viewConfig: {
            emptyText: '&nbsp;&nbsp;没有相关的记录'
        },
        columns: [{
            text: 'ID',
            dataIndex: 'supplierId',
            hidden: true
        },
        {
            text: '供应商名称',
            dataIndex: 'supplierName'
        },
        {
            text: '联系人',
            dataIndex: 'contactPeople'
        },
        {
            text: '供应商电话',
            dataIndex: 'supplierPhone'
        },
        {
        	text: '供应商简介',
        	dataIndex: 'supplierProfile'
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
                    Ext.Msg.confirm('操作提示', '确定要删除该供应商信息吗？',
                    function(btn) {
                        if (btn == "yes") {
                            var _store = grid.getStore();
                            var model = grid.getStore().getAt(rowIndex);
                            Ext.Ajax.request({
                                url: TURNPICTURE_DELETE_URL,
                                params: {
                                	supplierId: model.data.supplierId
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
                    editForm.getComponent('esupplierId').setValue(model.data.supplierId);
                    editForm.getComponent("esupplierName").setValue(model.data.supplierName);
                    editForm.getComponent("esupplierPhone").setValue(model.data.supplierPhone);
                    editForm.getComponent('econtactPeople').setValue(model.data.contactPeople);
                    editForm.getComponent('esupplierProfile').setValue(model.data.supplierProfile);
                    editWin.show();
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
            items: ['供应商名称:',{
            	xtype:'textfield',id:'supplierName',width:120
            },{
				xtype : 'button',
				text : '查询',
				icon : '/oscar/public/images/common/icon_searchd.gif',
				listeners:{
					click:function(){
						if(photoStore){
							var proxy = photoStore.getProxy();
							proxy.setExtraParam('supplierName',Ext.getCmp('supplierName').getValue());
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
                }
            }],
        }]
       
    });
});