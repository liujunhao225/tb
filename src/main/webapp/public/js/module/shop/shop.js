/**
 * 店铺管理
 */
var PAGE_SIZE = 15;
var TURNPICTURE_STORE_URL = "/oscar/shop/list.do";
var TURNPICTURE_SAVE_URL = "/oscar/shop/add.do";
var TURNPICTURE_UPDATE_URL = "/oscar/shop/update.do";
var TURNPICTURE_DELETE_URL = "/oscar/shop/delete.do";
Ext.onReady(function() {
    Ext.QuickTips.init();
    var photoStore = Ext.create('Ext.data.Store', {
        model: 'shop',
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
    var addForm = [{
        fieldLabel: '<span style="color:red;">*</span> 店铺名称',
        xtype: 'textfield',
        itemId: 'ashopName',
        id: 'ashopName',
        style: 'padding-top:3px;',
        labelWidth: 80,
        labelAlign: 'right',
        width: 280,
        maxLength: 20,
        maxLengthText: '店铺名称不能超过20个字'
    },
    {
        fieldLabel: '<span style="color:red;">*</span> 店铺负责人',
        xtype: 'textfield',
        itemId: 'ashopCharger',
        id: 'ashopCharger',
        style: 'padding-top:3px;',
        labelWidth: 80,
        labelAlign: 'right',
        width: 280,
        maxLength: 10,
        maxLengthText: '店铺负责人30个字符'
    },
    {
        fieldLabel: '店铺级别',
        xtype: 'textfield',
        itemId: 'ashopLevel',
        id: 'ashopLevel',
        style: 'padding-top:3px;',
        labelWidth: 80,
        labelAlign: 'right',
        width: 280,
        maxLength: 200,
        maxLengthText: ''
    }];

    var createAddWin = function() {
        return Ext.create('Ext.window.Window', {
            title: '新增店铺',
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
                        if (Ext.String.trim(Ext.getCmp("ashopName").getValue()) == "") {
                            Ext.Msg.alert('操作提示', '店铺名称不能为空！');
                            return;
                        }
                        if (Ext.String.trim(Ext.getCmp("ashopLevel").getValue()) == "") {
                            Ext.Msg.alert('操作提示', '店铺优先级不能为空！');
                            return;
                        }
                    }
                    form.submit({
                        url: TURNPICTURE_SAVE_URL,
                        params: {
                            shopName: Ext.getCmp("ashopName").getValue(),
                            shopLevel: Ext.getCmp("ashopLevel").getValue(),
                            shopCharger: Ext.getCmp('ashopCharger').getValue()
                        },
                        success: function(form, action) {
                            if (action.success) {
                                Ext.Msg.alert('操作提示', "新增店铺成功！",
                                function() {
                                    photoStore.load();
                                    addWin.close();
                                });
                            } else {
                                Ext.Msg.alert('操作提示', "新增店铺失败！",
                                function() {
                                    addWin.close();
                                });
                            }
                        },
                        failure: function(form, action) {
                            Ext.Msg.alert('操作提示', "新增店铺失败！",
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
        itemId: "eshopId",
        id: "eshopId"
    },
    {
        fieldLabel: '<span style="color:red;">*</span> 店铺名称',
        xtype: 'textfield',
        itemId: 'eshopName',
        id: 'eshopName',
        style: 'padding-top:3px;',
        labelWidth: 80,
        labelAlign: 'right',
        width: 280,
        maxLength: 20,
        maxLengthText: 'apOrder不能超过20个字符'
    },
    {
        fieldLabel: '<span style="color:red;">*</span> 店铺级别',
        xtype: 'textfield',
        itemId: 'eshopLevel',
        id: 'eshopLevel',
        style: 'padding-top:3px;',
        labelWidth: 80,
        labelAlign: 'right',
        width: 280,
        maxLength: 10,
        maxLengthText: '状态不能超过10个字符'
    },
    {
        fieldLabel: '店铺负责人',
        xtype: 'textfield',
        itemId: 'eshopCharger',
        id: 'eshopCharger',
        style: 'padding-top:3px;',
        labelWidth: 80,
        labelAlign: 'right',
        width: 280,
        maxLength: 200,
        maxLengthText: '状态不能超过200个字符'
    }];

    var createEditWin = function() {
        return Ext.create('Ext.window.Window', {
            title: '修改店铺',
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
                        if (Ext.String.trim(Ext.getCmp("eshopName").getValue()) == "") {
                            Ext.Msg.alert('操作提示', '店铺名称不能为空！');
                            return;
                        }
                        if (Ext.String.trim(Ext.getCmp("eshopLevel").getValue()) == "") {
                            Ext.Msg.alert('操作提示', '店铺级别不能为空！');
                            return;
                        }
                    }
                    form.submit({
                        url: TURNPICTURE_UPDATE_URL,
                        params: {
                            shopId: Ext.getCmp("eshopId").getValue(),
                            shopName: Ext.getCmp("eshopName").getValue(),
                            shopCharger: Ext.getCmp("eshopCharger").getValue(),
                            shopLevel: Ext.getCmp("eshopLevel").getValue()
                        },
                        success: function(form, action) {
                            if (action.success) {
                                Ext.Msg.alert('操作提示', "修改店铺成功！",
                                function() {
                                    photoStore.load();
                                    editWin.close();
                                });
                            } else {
                                Ext.Msg.alert('操作提示', "修改店铺成功！",
                                function() {
                                    editWin.close();
                                });
                            }
                        },
                        failure: function(form, action) {
                            Ext.Msg.alert('操作提示', "新增店铺失败！",
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
        title: '店铺列表',
        region: 'south',
        // autoHeight:true,
        forceFit: 1,
        viewConfig: {
            emptyText: '&nbsp;&nbsp;没有相关的记录'
        },
        columns: [{
            text: 'ID',
            dataIndex: 'shopId',
            hidden: true
        },
        {
            text: '店铺名称',
            dataIndex: 'shopName'
        },
        {
            text: '店铺负责人',
            dataIndex: 'shopCharger'
        },
        {
            text: '店铺优先级',
            dataIndex: 'privilegeLevel'
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
                    Ext.Msg.confirm('操作提示', '确定要删除该店铺吗？',
                    function(btn) {
                        if (btn == "yes") {
                            var _store = grid.getStore();
                            var model = grid.getStore().getAt(rowIndex);
                            Ext.Ajax.request({
                                url: TURNPICTURE_DELETE_URL,
                                params: {
                                    shopId: model.data.shopId
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
                    editForm.getComponent('eshopId').setValue(model.data.shopId);
                    editForm.getComponent("eshopName").setValue(model.data.shopName);
                    editForm.getComponent("eshopLevel").setValue(model.data.privilegeLevel);
                    editForm.getComponent('eshopCharger').setValue(model.data.shopCharger);
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
            items: ['供应商名称:', {
                xtype: 'textfield',
                id: 'shopName',
                width: 120
            },
            {
                xtype: 'button',
                text: '查询',
                icon: '/oscar/public/images/common/icon_searchd.gif',
                listeners: {
                    click: function() {
                        if (photoStore) {
                            var proxy = photoStore.getProxy();
                            proxy.setExtraParam('shopName', Ext.getCmp('shopName').getValue());
                            photoStore.load({
                                params: {
                                    start: 0,
                                    limit: PAGE_SIZE
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