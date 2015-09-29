var PAGE_SIZE = 15;
var TURNPICTURE_STORE_URL = "/oscar/cwchange/list.do";
var TURNPICTURE_UPDATE_URL = "/oscar/cwchange/input.do";
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
            url: '/oscar/storeHouse/storekind.do',
            reader: {
                type: 'json',
                root: 'data'
            }
        },
        autoLoad: true
    });

    var editWin = null;

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
        fieldLabel: '可移库数量',
        xtype: 'textfield',
        itemId: 'erealcount',
        id: 'erealcount',
        style: 'padding-top:3px;',
        labelWidth: 80,
        labelAlign: 'right',
    },
    {
        fieldLabel: '仓库',
        xtype: 'combobox',
        itemId: 'echangeku',
        id: 'echangeku',
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
            	var schangeweiid = Ext.getCmp("schangeweiid").getValue();
                changeweistoreload(newValue,schangeweiid);
            }
        }
    },
    {
        fieldLabel: '仓位',
        xtype: 'combobox',
        itemId: 'echangeweiid',
        id: 'echangeweiid',
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
        fieldLabel: '转移数量',
        xtype: 'textfield',
        itemId: 'einputcount',
        id: 'einputcount',
        style: 'padding-top:3px;',
        labelWidth: 80,
        labelAlign: 'right'
    }];

    //仓位信息end
    var changweigrid = Ext.create('Ext.grid.Panel', {
        width: 340,
        store: changeweistore,
        title: '仓库祥情',
        region: 'south',
        // autoHeight:true,
        forceFit: 1,
        viewConfig: {
            emptyText: '&nbsp;&nbsp;没有相关的记录'
        },
        columns: [{
            text: '仓位',
            dataIndex: 'name',
        },
        {
            text: '容量',
            dataIndex: 'capacity'
        },
        {
            text: '占用',
            dataIndex: 'usedtotal'
        }]
    });
    var createEditWin = function() {
        return Ext.create('Ext.window.Window', {
            title: '采购验收',
            height: 500,
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
            },
            changweigrid],
            buttons: [{
                text: '申请转移',
                formBind: true,
                //                icon: '/oscar/public/images/common/success.png',
                iconAlign: 'right',
                handler: function() {
                    var formCmp = Ext.getCmp('form2');
                    var form = formCmp.getForm();
                    if (form.isValid()) {
                        var erealcount = Ext.String.trim(Ext.getCmp("erealcount").getValue());
                        var einputcount = Ext.String.trim(Ext.getCmp("einputcount").getValue());
                        if (erealcount < einputcount) {
                            Ext.Msg.alert('操作提示', "转数量不可大于可入库数量!");
                            return;

                        }
                        form.submit({
                            url: TURNPICTURE_UPDATE_URL,
                            params: {
                                'productId': Ext.getCmp("eproductid").getValue(),
                                'productSize': Ext.getCmp("esize").getValue(),
                                'schangeweiid': Ext.getCmp("schangeweiid").getValue(),
                                'dchangeweiid': Ext.getCmp("echangeweiid").getValue(),
                                'lurushuliang': Ext.getCmp("einputcount").getValue(),
                            },
                            success: function(form,action) {
                            	 var text = Ext.decode(action.response.responseText);
                                if (text.code=="0000") {
                                    Ext.Msg.alert('操作提示', text.desc,
                                    function() {
                                        photoStore.load();
                                        editWin.close();
                                    });
                                } else {
                                    Ext.Msg.alert('操作提示', text.desc);
                                }
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
            items: [
            {
                icon: '/oscar/public/images/common/update.gif',
                tooltip: '移库',
                handler: function(grid, rowIndex, colIndex) {
                    var _store = grid.getStore();
                    var model = grid.getStore().getAt(rowIndex);
                    if (!editWin) {
                        editWin = createEditWin();
                    }
                    var editForm = editWin.getComponent('form2');
                    editForm.getComponent('eproductid').setValue(model.data.productId);
                    editForm.getComponent('esize').setValue(model.data.productSize);
                    editForm.getComponent('erealcount').setValue(model.data.count);
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
			}
            ],
        }]

    });

});