/**
 * 影片剧照管理
 */
var PAGE_SIZE =15;
var FILMPHOTO_STORE_URL="/oscar/filmPhoto/filmPhotoStore.do";
var FILMPHOTO_SAVE_URL="/oscar/filmPhoto/save.do";
var FILMPHOTO_UPDATE_URL="/oscar/filmPhoto/update.do";
var FILMPHOTO_DELETE_URL="/oscar/filmPhoto/delete.do";

Ext.onReady(function(){
	Ext.QuickTips.init();
	var photoStore = Ext.create('Ext.data.Store', 
	{
		model : 'movie_filmPhoto',
		pageSize : PAGE_SIZE,
		proxy : {
			type : 'ajax',
			url : FILMPHOTO_STORE_URL,
			extraParams : {
				fileName :'',
				createDate:''
			},
			reader : {
				type : 'json',
				root : 'datalist',
				totalProperty : 'totalRecords'
			}
		}
		 
	});
	photoStore.load(
	{
		params : {
			start : 0,
			limit : PAGE_SIZE
		}
	});
	
	var addWin=null;
	//增加影片剧照信息form
	var addForm=[
		{
			fieldLabel:'<span style="color:red;">*</span> 影片名称',xtype:'textfield',itemId:'afilmName',
			id:'afilmName',style:'padding-top:3px;',labelWidth:80,
			labelAlign:'right',width:280,maxLength:30,
			maxLengthText:'影片名称不能超过30个字符'
		},
		{
			fieldLabel:'影片编码',xtype:'textfield',itemId:'afilmCode',
			id:'afilmCode',style:'padding-top:3px;',labelWidth:80,
			labelAlign:'right',width:280,maxLength:50,
			maxLengthText:'影片编码不能超过50个字符'
		},
		{
			xtype : 'textfield',
			fieldLabel:'<span style="color:red;">*</span> 上传剧照',
			inputType:'file',
			id : 'aphotoUrl',
			name : 'file',
			itemId:'aphotoUrl',
			labelWidth:80,
			labelAlign:'right',
			width:280,
			style:'padding-top:3px;',
			anchor : '95%',
			buttonText:'选择文件'
		}
	];
	
	var createAddWin=function(){
		return Ext.create('Ext.window.Window',
		{
			title:'新增影片剧照信息',
			height:180,
			width:350,
			closeAction:'hide',
			modal:true,
			items:{
				id:'form1',
				xtype:'form',
				bodyPadding:5,
				height:160,
				width:340,
				items:addForm
			},
			buttons:[
			{
				text:'确定',
				formBind:true,
				icon:'/oscar/public/images/common/success.png',
				iconAlign:'right',
				handler:function(){
					var formCmp=Ext.getCmp('form1');
					var form=formCmp.getForm();
					var imgName='';
					if(form.isValid()){
						if(Ext.String.trim(Ext.getCmp("afilmName").getValue())==""){
							Ext.Msg.alert('操作提示','影片名称不能为空！');
							return;
						}
						if(Ext.String.trim(Ext.getCmp("aphotoUrl").getValue())==""){
							Ext.Msg.alert('操作提示','剧照图片不能为空！');
							return;
						}else{
							var photoUrl=Ext.getCmp("aphotoUrl").getValue();
							var imgType=(photoUrl.substr(photoUrl.lastIndexOf('.')+1)).toLowerCase();
							var reg=/^jpeg|jpg|png$/;
							if(!reg.test(imgType)){
								Ext.Msg.alert('操作提示','图片类型不支持！');
								return;
							}
							var checkOver=checkImgSize("aphotoUrl-inputEl");
							if(checkOver==false){
								Ext.Msg.alert('操作提示','剧照图片太大，请上传大小在100KB以内的图片！');
								return;
							}
						}
					}
					form.submit(
					{
						url:FILMPHOTO_SAVE_URL,
						params:{
							filmName:Ext.getCmp("afilmName").getValue(),
							filmCode:Ext.getCmp("afilmCode").getValue()
						},
						success:function(form,action){
							if(action.result.success){
								Ext.Msg.alert('操作提示',"新增影片剧照信息成功！",function(){
									photoStore.load();
									addWin.close();
								});
							}else{
								Ext.Msg.alert('操作提示',"新增影片剧照信息失败！",function(){
									  addWin.close();
								});
							}
						},
						failure:function(form,action){
							Ext.Msg.alert('操作提示',"新增影片剧照信息失败！",function(){
								  addWin.close();
							});
						}
					});
				}
			},
			{
				text:'取消',
				icon:'/oscar/public/images/common/undo.png',
				iconAlign:'right',
				handler:function(){
					addWin.close()
				}
			}],
			buttonAlign:'center'
		});
	}
	
	var editWin=null;
	//修改影片剧照信息form
	var editForm=[
		{
			xtype:"hidden",
			itemId:"eid",
			id:"eid"
		},
		{
			fieldLabel:'<span style="color:red;">*</span> 影片名称',xtype:'textfield',itemId:'efilmName',
			id:'efilmName',style:'padding-top:3px;',labelWidth:80,
			labelAlign:'right',width:280,maxLength:30,
			maxLengthText:'影片名称不能超过30个字符'
		},
		{
			fieldLabel:'影片编码',xtype:'textfield',itemId:'efilmCode',
			id:'efilmCode',style:'padding-top:3px;',labelWidth:80,
			labelAlign:'right',width:280,maxLength:50,
			maxLengthText:'影片编码不能超过50个字符'
		},
		{
			xtype : 'textfield',
			inputType:'file',
			fieldLabel:'修改剧照',
			id : 'ephotoUrl',
			name : 'file',
			itemId:'ephotoUrl',
			labelWidth:80,
			labelAlign:'right',
			width:280,
			style:'padding-top:3px;',
			anchor : '95%',
			buttonText:'选择图片'
		}
	];
	
	var createEditWin=function(){
		return Ext.create('Ext.window.Window',
		{
			title:'修改影片剧照信息',
			height:180,
			width:350,
			closeAction:'hide',
			modal:true,
			items:{
				id:'form2',
				xtype:'form',
				bodyPadding:5,
				height:160,
				width:340,
				items:editForm
			},
			buttons:[
			{
				text:'确定',
				formBind:true,
				icon:'/oscar/public/images/common/success.png',
				iconAlign:'right',
				handler:function(){
					var formCmp=Ext.getCmp('form2');
					var form=formCmp.getForm();
					var imgName='';
					if(form.isValid()){
						if(Ext.String.trim(Ext.getCmp("efilmName").getValue())==""){
							Ext.Msg.alert('操作提示','影片名称不能为空！');
							return;
						}
						if(Ext.String.trim(Ext.getCmp("ephotoUrl").getValue())!=""){
							var photoUrl=Ext.getCmp("ephotoUrl").getValue();
							var imgType=(photoUrl.substr(photoUrl.lastIndexOf('.')+1)).toLowerCase();
							var reg=/^jpeg|jpg|png$/;
							if(!reg.test(imgType)){
								Ext.Msg.alert('操作提示','图片类型不支持！');
								return;
							}
							var checkOver=checkImgSize("ephotoUrl-inputEl");
							if(checkOver==false){
								Ext.Msg.alert('操作提示','剧照图片太大，请上传大小在100KB以内的图片！');
								return;
							}
						}
					}
					form.submit(
					{
						url:FILMPHOTO_UPDATE_URL,
						params:{
							id:Ext.getCmp("eid").getValue(),
							filmName:Ext.getCmp("efilmName").getValue(),
							filmCode:Ext.getCmp("efilmCode").getValue()
						},
						success:function(form,action){
							if(action.result.success){
								Ext.Msg.alert('操作提示',"修改影片剧照信息成功！",function(){
									photoStore.load();
									editWin.close();
								});
							}else{
								Ext.Msg.alert('操作提示',"修改影片剧照信息失败！",function(){
									  editWin.close();
								});
							}
						},
						failure:function(form,action){
							Ext.Msg.alert('操作提示',"修改影片剧照信息失败！",function(){
								  editWin.close();
							});
						}
					});
				}
			},
			{
				text:'取消',
				icon:'/oscar/public/images/common/undo.png',
				iconAlign:'right',
				handler:function(){
					editWin.close()
				}
			}],
			buttonAlign:'center'
		});
	}
	
	var photoWin=null;
	var photoForm=[
		{
			xtype:'panel',
			id:"photoPanel",
			/*title: 'picture',//标题
			collapsible:false,//右上角上的那个收缩按钮，设为false则不显示*/
			contentEl: 'picture',//这个panel显示html中id为picture的内容
			height:300,
			width:400
		}
	];
	
	var createPhotoWin=function(){
		return Ext.create('Ext.window.Window',
		{
			title:'剧照',
			height:300,
			width:400,
			closeAction:'hide',
			modal:true,
			items:{
				id:'photoForm',
				xtype:'form',
				bodyPadding:0,
				height:300,
				items:photoForm
			},
			buttons:[
			{
				text:'关闭',
				icon:'/oscar/public/images/common/undo.png',
				iconAlign:'right',
				handler:function(){
					photoWin.close();
				}
			}],
			buttonAlign:'center'
		});
	}
	
	grid=Ext.create(
		'Ext.grid.Panel',
		{
			renderTo:'gridpanel',
			width:Ext.getBody().getWidth(),
			store:photoStore,
			title:'影片剧照信息列表',
			region:'south',
			autoHeight:true,
			forceFit:1,
			autoScroll:true,
			viewConfig:{emptyText:'&nbsp;&nbsp;没有相关的记录'},
			columns:[
			    {text:'ID',dataIndex:'id',hidden: true},
				{text:'影片名称',dataIndex:'filmName'},
				{text:'影片编码',dataIndex:'filmCode'},
				{text:'剧照',dataIndex:'photoUrl',
					renderer:function(value, metaData, record, row, col, store, gridView){
		                metaData.tdAttr= 'data-qtip="点击查看图片"';
		                return Ext.String.format('{0}', value.replace("images/movies_pic/",""));
	            	},
	            	listeners: {
		            	'click':function(td, cellIndex, record, tr, rowIndex, e, eOpts ){
								var photoUrl=e.data.photoUrl;
								if(photoWin==null){
									photoWin=createPhotoWin();
								}
								$("#picture").attr("src",host_url+photoUrl);
								$("#picture").attr("alt",photoUrl.replace("images/movies_pic/",""));
								$("#picture").show();
								photoWin.show();
		            	}
		            }
	            },
				{text:'添加时间',dataIndex:'creatTime',renderer: function(value) {
			            return Ext.String.format('{0}', value.split('.')[0]);
			        }
			    },
				{
					 header:'操作',
					 menuDisabled:true,
					 sortable:false,
					 xtype:'actioncolumn',
					 items:[
					 {
						icon:'/oscar/public/images/common/delete.gif',
						tooltip:'删除',
						handler:function(grid,rowIndex,colIndex){
							Ext.Msg.confirm('操作提示','确定要删除该影片剧照信息？',function(btn){
								if(btn=="yes"){
									var _store=grid.getStore();
									var model = grid.getStore().getAt(rowIndex);
									Ext.Ajax.request({
										url:FILMPHOTO_DELETE_URL,
										params:{id:model.data.id},
										success:function(response){
											var text=response.responseText;
											if(text == "true"){
												Ext.Msg.alert('操作提示:',"删除成功！",function(){
													_store.loadPage(_store.currentPage);
												});
											}else{
												Ext.Msg.alert('操作提示:',"删除失败！");
											}
									    },
									    failure:function(){
											Ext.Msg.alert('操作提示',"删除失败！");
										}
									});
								}
							});
						}
					},
					{
						icon:'/oscar/public/images/common/update.gif',
						tooltip:'修改',
						handler:function(grid,rowIndex,colIndex){
							var _store=grid.getStore();
							var model = grid.getStore().getAt(rowIndex);
							if(!editWin){
								editWin=createEditWin();
							}
							var editForm=editWin.getComponent('form2');
							editForm.getComponent('eid').setValue(model.data.id);
							editForm.getComponent('efilmName').setValue(model.data.filmName);
							Ext.getCmp("efilmCode").setValue(model.data.filmCode);
							editForm.getComponent("ephotoUrl").setValue();
							editWin.show();
						}
					}]
				}
			],
			dockedItems:[
			{
				dock:'bottom',xtype:'pagingtoolbar',
				store:photoStore,displayInfo:true,
				refreshText:'刷新',firstText:'第一页',
				prevText:'上一页',nextText:'下一页',
				lastText:'尾页',beforePageText:'跳转到第',
				afterPageText:'页,共{0}页',
				displayMsg:'第{0} - {1}条记录,共 {2}条记录',
				emptyMsg:'没有记录'
			},
			{
				xtype:'toolbar',
				dock:'top',
				items:
				[
					'影片名称：',
					{
						xtype:'textfield',
						id:'filmName_id',
						width:120
					},
					/*'创建时间：',
					{
						xtype:'textfield',
						id:'ctime_id',
						width:120
					},*/
					{
						xtype:'button',
						text:'查询',
						icon:'/oscar/public/images/common/icon_searchd.gif',
						listeners:{
							click:function(){
								if(photoStore){
									var proxy=photoStore.getProxy();
									proxy.setExtraParam('filmName',Ext.getCmp('filmName_id').getValue());
									/*proxy.setExtraParam('createDate',Ext.getCmp('ctime_id').getValue());*/
									photoStore.load({
										params:{start:0,limit:PAGE_SIZE}
									});
								}
							}
						}
					},
					'->',
					{
						xtype:'button',
						text:'新增',
						icon:'/oscar/public/images/common/add.png',
						handler:function(){
							if(addWin){
								addWin.show();
							}else{
								addWin=createAddWin();
								addWin.show();
							}
						}
					}
				]
			}]
		});
});