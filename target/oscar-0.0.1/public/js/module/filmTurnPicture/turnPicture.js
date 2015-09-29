/**
 * 轮播图管理
 */
var PAGE_SIZE = 15;
var TURNPICTURE_STORE_URL = "/oscar/turn/list.do";
var TURNPICTURE_SAVE_URL = "/oscar/turn/add.do";
var TURNPICTURE_UPDATE_URL = "/oscar/turn/update.do";
var TURNPICTURE_DELETE_URL = "/oscar/turn/delete.do";
Ext.onReady(function() {
    Ext.QuickTips.init();
    var photoStore = Ext.create('Ext.data.Store', {
        model: 'movie_turnPicture',
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
        fieldLabel: '<span style="color:red;">*</span> 轮播图路径',
        xtype: 'filefield',
        itemId: 'atargetUrl',
        name: 'file',
        id: 'atargetUrl',
        style: 'padding-top:3px;',
        labelWidth: 80,
        labelAlign: 'right',
        width: 280,
        maxLength: 100,
        maxLengthText: '轮播图路径不能超过50个字符',
        buttonText: '选择文件'
    },
    {
        fieldLabel: '<span style="color:red;">*</span> 顺序',
        xtype: 'textfield',
        itemId: 'apOrder',
        id: 'apOrder',
        style: 'padding-top:3px;',
        labelWidth: 80,
        labelAlign: 'right',
        width: 280,
        maxLength: 20,
        maxLengthText: 'apOrder不能超过20个字符'
    },
    {
        fieldLabel: '<span style="color:red;">*</span> 状态',
        xtype: 'textfield',
        itemId: 'astate',
        id: 'astate',
        style: 'padding-top:3px;',
        labelWidth: 80,
        labelAlign: 'right',
        width: 280,
        maxLength: 10,
        maxLengthText: '状态不能超过10个字符'
    },
    {
        fieldLabel: '外链路径',
        xtype: 'textfield',
        itemId: 'aurl',
        id: 'aurl',
        style: 'padding-top:3px;',
        labelWidth: 80,
        labelAlign: 'right',
        width: 280,
        maxLength: 200,
        maxLengthText: ''
    }];

    var createAddWin = function() {
        return Ext.create('Ext.window.Window', {
            title: '新境轮播图',
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
                        if (Ext.String.trim(Ext.getCmp("apOrder").getValue()) == "") {
                            Ext.Msg.alert('操作提示', '顺序不能为空！');
                            return;
                        }
                        if (Ext.String.trim(Ext.getCmp("astate").getValue()) == "") {
                            Ext.Msg.alert('操作提示', '状态不能为空！');
                            return;
                        }
                    }
                    var photoUrl=Ext.getCmp("atargetUrl").getValue();
                    if(photoUrl !=null && photoUrl.length>0){
                    	var imgType=(photoUrl.substr(photoUrl.lastIndexOf('.')+1)).toLowerCase();
    					var reg=/^jpeg|jpg|png$/;
    					if(!reg.test(imgType)){
    						Ext.Msg.alert('操作提示','图片类型不支持！');
    						return;
    					}
    					var checkOver=checkImgSize("atargetUrl-fileInputEl");
    					console.log(checkOver);
    					if(checkOver==false){
    						Ext.Msg.alert('操作提示','图片太大，请上传大小在100KB以内的图片！');
    						return;
    					}
                    }
                    form.submit({
                        url: TURNPICTURE_SAVE_URL,
                        params: {
                            pictureOrder: Ext.getCmp("apOrder").getValue(),
                            pictureState: Ext.getCmp("astate").getValue(),
                            pictureUrl: Ext.getCmp('aurl').getValue()
                        },
                        success: function(form, action) {
                            if (action.success) {
                                Ext.Msg.alert('操作提示', "新增轮播图成功！",
                                function() {
                                    photoStore.load();
                                    addWin.close();
                                });
                            } else {
                                Ext.Msg.alert('操作提示', "新增轮播图失败！",
                                function() {
                                    addWin.close();
                                });
                            }
                        },
                        failure: function(form, action) {
                            Ext.Msg.alert('操作提示', "新增轮播图失败！",
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
        itemId: "eid",
        id: "eid"
    },
    {
    	
    	xtype : 'textfield',
		fieldLabel:'<span style="color:red;">*</span> 轮播图路径',
		inputType:'file',
		id : 'etargetUrl',
		name : 'file',
		itemId:'etargetUrl',
		labelWidth:80,
		labelAlign:'right',
		width:280,
		style:'padding-top:3px;',
		anchor : '95%',
		buttonText:'选择文件'
    },
    {
        fieldLabel: '<span style="color:red;">*</span> 顺序',
        xtype: 'textfield',
        itemId: 'epOrder',
        id: 'epOrder',
        style: 'padding-top:3px;',
        labelWidth: 80,
        labelAlign: 'right',
        width: 280,
        maxLength: 20,
        maxLengthText: 'apOrder不能超过20个字符'
    },
    {
        fieldLabel: '<span style="color:red;">*</span> 状态',
        xtype: 'textfield',
        itemId: 'estate',
        id: 'estate',
        style: 'padding-top:3px;',
        labelWidth: 80,
        labelAlign: 'right',
        width: 280,
        maxLength: 10,
        maxLengthText: '状态不能超过10个字符'
    },
    {
        fieldLabel: '外链',
        xtype: 'textfield',
        itemId: 'eurl',
        id: 'eurl',
        style: 'padding-top:3px;',
        labelWidth: 80,
        labelAlign: 'right',
        width: 280,
        maxLength: 200,
        maxLengthText: '状态不能超过200个字符'
    }];

    var createEditWin = function() {
        return Ext.create('Ext.window.Window', {
            title: '修改轮播图',
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
                        if (Ext.String.trim(Ext.getCmp("epOrder").getValue()) == "") {
                            Ext.Msg.alert('操作提示', '顺序不能为空！');
                            return;
                        }
                        if (Ext.String.trim(Ext.getCmp("estate").getValue()) == "") {
                            Ext.Msg.alert('操作提示', '状态不能为空！');
                            return;
                        }
                    }
                    var photoUrl=Ext.getCmp("etargetUrl").getValue();
                    if(photoUrl !=null && photoUrl.length>0){
                    	var imgType=(photoUrl.substr(photoUrl.lastIndexOf('.')+1)).toLowerCase();
    					var reg=/^jpeg|jpg|png$/;
    					if(!reg.test(imgType)){
    						Ext.Msg.alert('操作提示','图片类型不支持！');
    						return;
    					}
    					var checkOver=checkImgSize("etargetUrl-inputEl");
    					if(checkOver==false){
    						Ext.Msg.alert('操作提示','图片太大，请上传大小在100KB以内的图片！');
    						return;
    					}
                    }
                    form.submit({
                        url: TURNPICTURE_UPDATE_URL,
                        params: {
                            pictureId: Ext.getCmp("eid").getValue(),
                            pictureUrl: Ext.getCmp("etargetUrl").getValue(),
                            pictureOrder: Ext.getCmp("epOrder").getValue(),
                            pictureState: Ext.getCmp("estate").getValue(),
                            pictureUrl: Ext.getCmp('eurl').getValue()
                        },
                        success: function(form, action) {
                            if (action.success) {
                                Ext.Msg.alert('操作提示', "修改轮播图成功！",
                                function() {
                                    photoStore.load();
                                    editWin.close();
                                });
                            } else {
                                Ext.Msg.alert('操作提示', "修改轮播图失败！",
                                function() {
                                    editWin.close();
                                });
                            }
                        },
                        failure: function(form, action) {
                            Ext.Msg.alert('操作提示', "修改轮播图失败！",
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
        /*
		 * title: 'picture',//标题 collapsible:false,//右上角上的那个收缩按钮，设为false则不显示
		 */
        contentEl: 'picture',
        // 这个panel显示html中id为picture的内容
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
        title: '轮播图列表',
        region: 'south',
        // autoHeight:true,
        forceFit: 1,
        viewConfig: {
            emptyText: '&nbsp;&nbsp;没有相关的记录'
        },
        columns: [{
            text: 'ID',
            dataIndex: 'id',
            hidden: true
        },
        {
            text: '轮播图路径',
            dataIndex: 'image',
            renderer:function(value, metaData, record, row, col, store, gridView){
                metaData.tdAttr= 'data-qtip="点击查看图片"';
                return value;
            },
            listeners: {
            	'click':function(td, cellIndex, record, tr, rowIndex, e, eOpts ){
						var photoUrl=e.data.image;
						var imgName=photoUrl.substring(photoUrl.lastIndexOf('/')+1);
						if(photoWin==null){
							photoWin=createPhotoWin();
						}
						$("#picture").attr("src",host_url+turn_pic_path+photoUrl);
						$("#picture").attr("alt",imgName);
						$("#picture").show();
						photoWin.show();
            	}
            
            }
        },
        {
            text: '显示顺序',
            dataIndex: 'orderNum'
        },
        {
            text: '状态',
            dataIndex: 'isshow'
        },
        {
            text: '外链',
            dataIndex: 'url'
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
                    Ext.Msg.confirm('操作提示', '确定要删除该轮播图？',
                    function(btn) {
                        if (btn == "yes") {
                            var _store = grid.getStore();
                            var model = grid.getStore().getAt(rowIndex);
                            Ext.Ajax.request({
                                url: TURNPICTURE_DELETE_URL,
                                params: {
                                    id: model.data.id
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
                    editForm.getComponent('eid').setValue(model.data.id);
//                    Ext.getCmp("etargetUrl").setValue(model.data.image);
                    editForm.getComponent("epOrder").setValue(model.data.orderNum);
                    editForm.getComponent("estate").setValue(model.data.isshow);
                    editForm.getComponent('eurl').setValue(model.data.url);
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
            items: [
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