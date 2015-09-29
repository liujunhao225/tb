var PAGE_SIZE = 15;
var TURNPICTURE_STORE_URL = "/oscar/cwchange/list.do";
var TURNPICTURE_UPDATE_URL = "/oscar/pmanage/edit.do";
var TURNPICTURE_ADD_URL = "/oscar/pmanage/add.do";
var PYMANAGE_DELETE_URL ="/oscar/pmanage/delete.do";
Ext.onReady(function() {
    Ext.QuickTips.init();
    var photoStore = Ext.create('Ext.data.Store', {
        model: 'product',
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

    Ext.define('storemodel', {
        extend: 'Ext.data.Model',
        fields: [{
            name: 'key',
            type: 'string'
        },
        {
            name: 'value',
            type: 'string'
        }]
    });

    var storekind = Ext.create('Ext.data.Store', {
        model: 'storemodel',
        proxy: {
            type: 'ajax',
            url: '/oscar/bestore/storekind.do',
            reader: {
                type: 'json',
                root: 'data'
            }
        },
        autoLoad: true
    });
    //仓位信息 开始
    Ext.define('changweimodel', {
        extend: 'Ext.data.Model',
        fields: [{
            name: 'name',
            type: 'string'
        },
        {
            name: 'capacity',
            type: 'string'
        },
        {
            name: 'usedtotal',
            type: 'string'
        }]
    });

    var changeweistore = Ext.create('Ext.data.Store', {
        model: 'changweimodel',
        proxy: {
            type: 'ajax',
            url: '/oscar/cwchange/changeweiinfo.do',
            reader: {
                type: 'json',
                root: 'data'
            }
        },
        autoLoad: false
    });

    var changeweistoreload = function(id,changeweiid) {
        changeweistore.getProxy().extraParams = {
            'changechuid': id,
            'schangeweiid':changeweiid
        };
        changeweistore.load();

    }
    //仓位信息 结束
    var addWin =null;
    var addForm = [
                    {
                        fieldLabel: '商品号',
                        xtype: 'textfield',
                        itemId: 'aproductid',
                        id: 'aproductid',
                        style: 'padding-top:3px;',
                        labelWidth: 80,
                        labelAlign: 'right',
                        width: 280,
                        allowBlank:false,
                        blankText:'商品号不可以为空'
                    },
                    {
                        fieldLabel: '型号',
                        xtype: 'textfield',
                        itemId: 'asize',
                        id: 'asize',
                        style: 'padding-top:3px;',
                        labelWidth: 80,
                        labelAlign: 'right',
                        width: 280,
                        allowBlank:false,
                        blankText:'型号不可以为空'
                    },
                    {
                        fieldLabel: '仓库',
                        xtype: 'combobox',
                        itemId: 'achangeku',
                        id: 'achangeku',
                        store: storekind,
                        valueField: 'key',
                        displayField: 'value',
                        style: 'padding-top:3px;',
                        labelWidth: 80,
                        labelAlign: 'right',
                        width: 280,
                        maxLength: 200,
                        maxLengthText: '状态不能超过200个字符',
                        listeners: {
                            'change': function(filed, newValue, oldValue, op) {
//                            	var schangeweiid = Ext.getCmp("schangeweiid").getValue();
                                changeweistoreload(newValue,'');
                            }
                        }
                    },
                    {
                        fieldLabel: '仓位',
                        xtype: 'combobox',
                        itemId: 'achangeweiid',
                        id: 'achangeweiid',
                        store: changeweistore,
                        valueField: 'name',
                        displayField: 'name',
                        style: 'padding-top:3px;',
                        labelWidth: 80,
                        labelAlign: 'right',
                        width: 280,
                        maxLength: 200
                    },
                    {
                        fieldLabel: '数量',
                        xtype: 'textfield',
                        itemId: 'ainputcount',
                        id: 'ainputcount',
                        style: 'padding-top:3px;',
                        labelWidth: 80,
                        labelAlign: 'right',
                        allowBlank:false,
                        maskRe: /[0-9.]/,
                        blankText:'数量不可以为空'
                    }];
    
    var createAddWin = function() {
        return Ext.create('Ext.window.Window', {
            title: '新增仓库商品',
            height: 350,
            width: 350,	
            closeAction: 'hide',
            modal: true,
            items: {
                id: 'form1',
                xtype: 'form',
                bodyPadding: 5,
                height: 300,
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
                    }else{
                    	return ;
                    }
                    form.submit({
                        url: TURNPICTURE_ADD_URL,
                        params: {
                        	aproductid: Ext.getCmp("aproductid").getValue(),
                        	asize: Ext.getCmp("asize").getValue(),
                        	achangeku: Ext.getCmp('achangeku').getValue(),
                        	achangeweiid: Ext.getCmp('achangeweiid').getValue(),
                        	ainputcount: Ext.getCmp('ainputcount').getValue()
                        },
                        success: function(form, action) {
                            if (action.success) {
                            	if(action.result.recode=='1'){
                            		 Ext.Msg.alert('操作提示', action.result.desc);
                            	}
                            	else{
                            		Ext.Msg.alert('操作提示', "新增仓库商品成功！",
                            		function() {
                            					photoStore.load();
                            					addWin.close();
                            	});
                            	}
                            } else {
                                Ext.Msg.alert('操作提示', "新增仓库商品失败！",
                                function() {
                                    addWin.close();
                                });
                            }
                        },
                        failure: function(form, action) {
                            Ext.Msg.alert('操作提示', "新增仓库商品失败！",
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
    };
    
    
    var editWin = null;

  
    // 修改影片剧照信息form
    var editForm = [
    {
    	xtype:'hidden',
        id:'schangeweiid'
    },{
        fieldLabel: '商品号',
        xtype: 'textfield',
        itemId: 'eproductid',
        readOnly: true,
        id: 'eproductid',
        style: 'padding-top:3px;',
        labelWidth: 80,
        labelAlign: 'right',
        width: 280
    },
    {
        fieldLabel: '型号',
        xtype: 'textfield',
        itemId: 'esize',
        readOnly: true,
        id: 'esize',
        style: 'padding-top:3px;',
        labelWidth: 80,
        labelAlign: 'right',
        width: 280
    },
    {
        fieldLabel: '数量',
        xtype: 'textfield',
        itemId: 'einputcount',
        id: 'einputcount',
        style: 'padding-top:3px;',
        labelWidth: 80,
        labelAlign: 'right',
        allowBlank:false,
        maskRe: /[0-9.]/,
        blankText:'数量不可以为空'
    }];

    var createEditWin = function() {
        return Ext.create('Ext.window.Window', {
            title: '更改商品数量',
            height: 300,
            width: 350,
            closeAction: 'hide',
            modal: true,
            autoScroll: true,
            items: [{
                id: 'form2',
                xtype: 'form',
                bodyPadding: 5,
                height: 200,
                width: 340,
                items: editForm
            }],
            buttons: [{
                text: '保存',
                formBind: true,
                //                icon: '/oscar/public/images/common/success.png',
                iconAlign: 'right',
                handler: function() {
                    var formCmp = Ext.getCmp('form2');
                    var form = formCmp.getForm();
                    if (form.isValid()) {
                        form.submit({
                            url: TURNPICTURE_UPDATE_URL,
                            params: {
                                'productId': Ext.getCmp("eproductid").getValue(),
                                'productSize': Ext.getCmp("esize").getValue(),
                                'schangeweiid': Ext.getCmp("schangeweiid").getValue(),
                                'lurushuliang': Ext.getCmp("einputcount").getValue(),
                            },
                            success: function(form,action) {
                            	 var text = Ext.decode(action.response.responseText);
                                    Ext.Msg.alert('操作提示', '更新数量成功',
                                    function() {
                                        photoStore.load();
                                        editWin.close();
                                    });
                            },
                            failure: function(form, action) {
                                Ext.Msg.alert('操作提示', "录入失败，请联系管理员！",
                                function() {
                                });
                            }
                        });
                    }
                }
            },
            {
                text: '取消',
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
        title: '商品列表',
        region: 'south',
        // autoHeight:true,
        forceFit: 1,
        viewConfig: {
            emptyText: '&nbsp;&nbsp;没有相关的记录'
        },
        columns: [
        {
            text: '产品名称',
            dataIndex: 'productId'
        },
        {
            text: '尺码',
            dataIndex: 'productSize'
        },
        {
            text: '仓库',
            dataIndex: 'shId'
        },
        {
            text: '仓位',
            dataIndex: 'shSubId'
        },
        {
            text: '数量',
            dataIndex: 'count'
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
                                url: PYMANAGE_DELETE_URL,
                                params: {
                                	'productId': model.get("productId"),
                                    'productSize': model.get("productSize"),
                                    'schangeweiid': model.get("shSubId")
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
                tooltip: '编辑',
                handler: function(grid, rowIndex, colIndex) {
                    var _store = grid.getStore();
                    var model = grid.getStore().getAt(rowIndex);
                    if (!editWin) {
                        editWin = createEditWin();
                    }
                    var editForm = editWin.getComponent('form2');
                    editForm.getComponent('eproductid').setValue(model.data.productId);
                    editForm.getComponent('esize').setValue(model.data.productSize);
                    editForm.getComponent('einputcount').setValue(model.data.count);
                    editForm.getComponent('schangeweiid').setValue(model.data.shSubId);
                    
                    changeweistore.load();
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
            items: ['商品号',{
            	xtype:'textfield',id:'tproductId',width:120
            },
            '尺码',{
            	xtype:'textfield',id:'tproductSize',width:120
            },
            '仓库',{
            	xtype:'textfield',id:'tchangkuid',width:120
            },
            '仓位',{
            	xtype:'textfield',id:'tchangeweiid',width:120
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
							proxy.setExtraParam('tproductSize',Ext.getCmp('tproductSize').getValue());
							proxy.setExtraParam('tchangkuid',Ext.getCmp('tchangkuid').getValue());
							proxy.setExtraParam('tchangeweiid',Ext.getCmp('tchangeweiid').getValue());
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
            '->',  {
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