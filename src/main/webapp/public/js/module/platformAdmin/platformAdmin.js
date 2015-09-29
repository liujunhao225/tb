/**
 * 仓库管理
 */
var PAGE_SIZE = 15;
var STOREHOUSE_STORE_URL = "/oscar/platformAdmin/getUserList.do";
var STOREHOUSE_SAVE_URL = "/oscar/platformAdmin/addUser.do";
var STOREHOUSE_UPDATE_URL = "/oscar/platformAdmin/updateUser.do";
var STOREHOUSE_DELETE_URL = "/oscar/platformAdmin/deleteUser.do";
var OSCAR_MENU_UPDATE_URL ="/oscar/menu/edit.do"

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

    var addWin = null;
    // 增加用户form
    var addForm = [
    {
        fieldLabel: '<span style="color:red;">*</span> 用户名',
        xtype: 'textfield',
        itemId: 'auserName',
        id: 'auserName',
        name:'userName',
        style: 'padding-top:3px;',
        labelWidth: 80,
        labelAlign: 'right',
        allowBlank : false,
  		blankText:'不能为空',
        width: 280,
        maxLength: 50,
        maxLengthText: '用户名不能超过50字符'
    },{
        fieldLabel: '<span style="color:red;">*</span> 密码',
        xtype: 'textfield',
        itemId: 'apwd',
        id: 'apwd',
        name:'pwd',
        style: 'padding-top:3px;',
        labelWidth: 80,
        labelAlign: 'right',
        allowBlank : false,
  		blankText:'不能为空',
        width: 280,
        maxLength: 50,
        maxLengthText: '密码不能超过50字符'
    },
    {
    	fieldLabel: '<span style="color:red;">*</span>角色',
    	labelAlign: 'right',
    	xtype:'combobox',
    	labelWidth: 80,
    	width:280,
    	itemId: 'arole',
        id: 'arole',
        name:'role',
        allowBlank : false,
  		blankText:'不能为空',
    	typeAhead : true,
        triggerAction:'all',
        mode : 'local',  
        store : new Ext.data.ArrayStore({  
                    fields : ['value', 'text'],  
                    data : [["1", '普通用户'], ["2", '管理员']]  
                }),  
        valueField : 'value',  
        displayField : 'text',  
        emptyText : '请选择',  
        editable:false
    }];

    var createAddWin = function() {
        return Ext.create('Ext.window.Window', {
            title: '新增用户',
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
                                		 Ext.Msg.alert('操作提示', "新增用户成功！",
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
                                     Ext.Msg.alert('操作提示', '新增用户失败！',
                                     function() {
                                     });
                                 }
                             },
                             failure: function(form, action) {
                                 Ext.Msg.alert('操作提示', "新增用户失败！",
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
        itemId: "euserName",
        id: "euserName",
        name:"userName"
    },
    {
        fieldLabel: '密码',
        xtype: 'textfield',
        labelWidth: 80,
        width:280,
        itemId: 'epwd',
        id: 'epwd',
        name:'pwd',
        style: 'padding-top:3px;',
        labelWidth: 80,
        labelAlign: 'right',
        width: 280,
        maxLength: 50,
        maxLengthText: '密码不能超过50字符',
    },
    {
    	fieldLabel: '<span style="color:red;">*</span>角色',
    	labelAlign: 'right',
    	xtype:'combobox',
    	labelWidth: 80,
    	width:280,
    	itemId: 'erole',
        id: 'erole',
        name:'role',
        allowBlank : false,
  		blankText:'不能为空',
    	typeAhead : true,
        triggerAction:'all',
        mode : 'local',  
        store : new Ext.data.ArrayStore({  
                    fields : ['value', 'text'],  
                    data : [["1", '普通用户'], ["2", '管理员']]  
                }),  
        valueField : 'value',  
        displayField : 'text',  
        emptyText : '请选择',  
        editable:false
    }];

    var createEditWin = function() {
        return Ext.create('Ext.window.Window', {
            title: '修改用户',
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
                               		 Ext.Msg.alert('操作提示', "修改用户成功！",
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
                                    Ext.Msg.alert('操作提示', '修改用户失败！',
                                    function() {
                                    });
                                }
                            },
                            failure: function(form, action) {
                                Ext.Msg.alert('操作提示', "修改用户失败！",
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
        title: '用户信息管理',
        region: 'south',
        autoHeight:true,
        forceFit: 1,
        viewConfig: {
            emptyText: '&nbsp;&nbsp;没有相关的记录'
        },
        columns: [
        {
            text: '用户名',
            dataIndex: 'userName'
        },
        {
            text: '角色',
            dataIndex: 'role',
            renderer: function(value){
            	return value == 1?'普通用户':'管理员';
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
                    Ext.Msg.confirm('操作提示', '确定要删除该用户吗？',
                    function(btn) {
                        if (btn == "yes") {
                            var _store = grid.getStore();
                            var model = grid.getStore().getAt(rowIndex);
                            Ext.Ajax.request({
                                url: STOREHOUSE_DELETE_URL,
                                params: {
                                	userName: model.data.userName
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
                    editForm.getComponent('euserName').setValue(model.data.userName);
                    editForm.getComponent('erole').setValue(model.data.role);
                    editWin.show();
                }
            },
            {
	            icon: '/oscar/public/images/common/edit.gif',
				tooltip : '权限管理',
				handler : function(grid, rowIndex, colIndex) {
					var username = grid.getStore().getAt(rowIndex).get("userName");
					console.log(username)
					var optRoleStole2 = Ext.create('Ext.data.TreeStore', {
				        proxy: {
				            type: 'ajax',
				            url: '/oscar/menu/queryOpt.do?username='+username
				        },
				        root: {
				            text: 'Ext JS',
				            id: 'src',
				            expanded: true
				        },
				        folderSort: true
				    });
					
					Ext.create('Ext.window.Window', {
						id : 'dsp_role_update_window',
	    				title: '编辑用户权限',
	    				height: 410,
	    				width: 380,
	    				modal : true,
	    				items: [
	    					Ext.create('Ext.form.Panel', {
	    						id : 'dsp_role_update_form',
								bodyPadding : 5,
						    	x : 10,
						    	y : 10,
						    	width : 350,
								height : 360,
						    	fieldDefaults : {
						    		labelAlign : 'right',
						    		labelWidth : 80
						    	},
						    	items : [{
						    		xtype : 'textfield',
						    		name : 'userName',
						    		fieldLabel : '用户名',
						    		width : 300,
						    		value :username,
						    		allowBlank : false,
									maxLength : 150,
									readOnly:true
						    	},{
									xtype:'treepanel',
									id:'roleOptedit',
									animate : true,
									store: optRoleStole2,
									rootVisible: false,
									useArrows: true,
									frame: true,
									title: '分配用户权限：',
									x : 85,
							        width: 215,
							        height: 180
							        
						    	}],
						    	buttonAlign : 'center',
								buttons : [{
									xtype : 'button',
									text : '提交',
									scope : this,
									handler : function(){
									//console.log(Ext.getDom("roleOptseditID").value);
							        var records = Ext.getCmp("roleOptedit").getChecked(),
							                        ids = [];
							        Ext.Array.each(records, function(rec){
							             ids.push(rec.get('id'));
							        });
										Ext.getCmp('dsp_role_update_form').getForm().submit({
											clientValidation : true,
											url : OSCAR_MENU_UPDATE_URL,
											method : 'POST',
											params:{
												menuId:ids
											},
											success : function(form, action){
												Ext.Msg.alert("恭喜您","用户权限修改成功！");
												Ext.getCmp('dsp_role_update_window').close();
												dsp_role_dataStore.load();
												return;
											},
											failure : function(form, action){
												Ext.Msg.alert('Failed', action.result.msg);
												dsp_role_dataStore.load();
												return;
											}
										});
									}
								},{
									xtype : 'button',
									text : '关闭',
									scope : this,
									handler : function(){
										Ext.getCmp('dsp_role_update_window').close();
									}
								}] 
	    				})]
					}).show();
				}
			
	            }
            ]
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
                    '用户名：',
                    {
                    	xtype:'textfield',
                    	id:'userName',
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
                    				proxy.setExtraParam('userName',Ext.getCmp('userName').getValue());
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