/**
 * 影片剧照管理
 */
var PAGE_SIZE =15;
var FILMPHOTO_STORE_URL="/oscar/filmInfo/filmInfoStore.do";
var FILMPHOTO_SAVE_URL="/oscar/filmInfo/save.do";
var FILMPHOTO_UPDATE_URL="/oscar/filmInfo/update.do";
var FILMPHOTO_DELETE_URL="/oscar/filmInfo/delete.do";

Ext.onReady(function(){
	Ext.QuickTips.init();
	var filmInfoStore = Ext.create('Ext.data.Store', 
	{
		model : 'movie_filmInfo',
		pageSize : PAGE_SIZE,
		proxy : {
			type : 'ajax',
			url : FILMPHOTO_STORE_URL,
			extraParams : {
				filmName :''
			},
			reader : {
				type : 'json',
				root : 'datalist',
				totalProperty : 'totalRecords'
			}
		}
		 
	});
	filmInfoStore.load(
	{
		params : {
			start : 0,
			limit : PAGE_SIZE
		}
	});
	
	/*var addWin=null;
	//增加影片剧照信息form
	var addForm=[
		{
			fieldLabel:'<span style="color:red;">*</span> 影片名称',xtype:'textfield',itemId:'afilmName',
			id:'afilmName',style:'padding-top:3px;',labelWidth:80,
			labelAlign:'right',width:280,maxLength:30,
			maxLengthText:'影片名称不能超过30个字符'
		},
		{
			xtype : 'textfield',
			fieldLabel:'<span style="color:red;">*</span> 上传海报',
			inputType:'file',
			id : 'aposter',
			name : 'file',
			itemId:'aposter',
			labelWidth:80,
			labelAlign:'right',
			width:280,
			style:'padding-top:3px;',
			anchor : '95%',
			buttonConfig : {
				iconCls:'/oscar/public/images/common/icon_searchd.gif'
			},
			buttonText:'选择图片'
		},
		{
			xtype : 'textfield',
			fieldLabel:'上传背景',
			inputType:'file',
			id : 'abackgroundPic',
			name : 'file',
			itemId:'abackgroundPic',
			labelWidth:80,
			labelAlign:'right',
			width:280,
			style:'padding-top:3px;',
			anchor : '95%',
			buttonText:'选择图片'
		},
		{
			fieldLabel:'<span style="color:red;">*</span> 影片评论',
			xtype:'textarea',
			id:'afilmReview',
			itemId:'afilmReview',
			labelAlign:'right',
			labelWidth:80,
			maxLength:500,
			width:280,
			height:130,
			maxLengthText:'备注不能超过500个字符'
		}
	];
	
	var createAddWin=function(){
		return Ext.create('Ext.window.Window',
		{
			title:'新增在映影片信息',
			height:300,
			width:350,
			closeAction:'hide',
			modal:true,
			items:{
				id:'form1',
				xtype:'form',
				bodyPadding:5,
				height:280,
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
					if(form.isValid()){
						var explorer = window.navigator.userAgent;
						if(Ext.String.trim(Ext.getCmp("afilmName").getValue())==""){
							Ext.Msg.alert('操作提示','影片名称不能为空！');
							return;
						}
						if(Ext.String.trim(Ext.getCmp("afilmReview").getValue())==""){
							Ext.Msg.alert('操作提示','影片评论不能为空！');
							return;
						}
						if(Ext.String.trim(Ext.getCmp("aposter").getValue())==""){
							Ext.Msg.alert('操作提示','影片海报不能为空！');
							return;
						}else{
							var poster=Ext.getCmp("aposter").getValue();
							var imgType=(poster.substr(poster.lastIndexOf('.')+1)).toLowerCase();
							var reg=/^jpeg|jpg|png$/;
							if(!reg.test(imgType)){
								Ext.Msg.alert('操作提示','海报的图片类型不支持！');
								return;
							}
							var checkOver=checkImgSize("aposter-inputEl");
							if(checkOver==false){
								Ext.Msg.alert('操作提示','海报图片太大，请上传大小在100KB以内的图片！');
								return;
							}
						}
						if(Ext.String.trim(Ext.getCmp("abackgroundPic").getValue())!=""){
							var backgroundPic=Ext.getCmp("abackgroundPic").getValue();
							var imgType=(backgroundPic.substr(backgroundPic.lastIndexOf('.')+1)).toLowerCase();
							var reg=/^jpeg|jpg|png$/;
							if(!reg.test(imgType)){
								Ext.Msg.alert('操作提示','背景图片类型不支持！');
								return;
							}
							var checkOver=checkImgSize("abackgroundPic-inputEl");
							if(checkOver==false){
								Ext.Msg.alert('操作提示','背景图片太大，请上传大小在100KB以内的图片！');
								return;
							}
						}
					}
					form.submit(
					{
						url:FILMPHOTO_SAVE_URL,
						params:{
							filmName:Ext.getCmp("afilmName").getValue(),
							filmReview:Ext.getCmp("afilmReview").getValue()
						},
						success:function(form,action){
							if(action.result.success){
								Ext.Msg.alert('操作提示',"新增在映影片信息成功！",function(){
									filmInfoStore.load();
									addWin.close();
								});
							}else{
								Ext.Msg.alert('操作提示',"新增在映影片信息失败！",function(){
									  addWin.close();
								});
							}
						},
						failure:function(form,action){
							Ext.Msg.alert('操作提示',"新增在映影片信息失败！",function(){
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
	}*/
	
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
			labelAlign:'right',width:280,maxLength:30,readOnly:true,
			maxLengthText:'影片名称不能超过30个字符'
		},
		{
			xtype : 'textfield',
			fieldLabel:'更换海报',
			inputType:'file',
			id : 'eposter',
			name : 'file',
			itemId:'eposter',
			labelWidth:80,
			labelAlign:'right',
			width:280,
			style:'padding-top:3px;',
			anchor : '95%',
			/*buttonConfig : {
				iconCls:'/oscar/public/images/common/icon_searchd.gif'
			},*/
			buttonText:'选择图片'
		},
		{
			xtype : 'textfield',
			fieldLabel:'更换背景',
			inputType:'file',
			id : 'ebackgroundPic',
			name : 'file',
			itemId:'ebackgroundPic',
			labelWidth:80,
			labelAlign:'right',
			width:280,
			style:'padding-top:3px;',
			anchor : '95%',
			buttonText:'选择图片'
		},
		{
			fieldLabel:'<span style="color:red;">*</span> 影片评论',
			xtype:'textarea',
			id:'efilmReview',
			itemId:'efilmReview',
			labelAlign:'right',
			labelWidth:80,
			maxLength:500,
			width:280,
			height:130,
			maxLengthText:'备注不能超过500个字符'
		}
	];
	
	var createEditWin=function(){
		return Ext.create('Ext.window.Window',
		{
			title:'修改在映影片信息',
			height:300,
			width:350,
			closeAction:'hide',
			modal:true,
			items:{
				id:'form2',
				xtype:'form',
				bodyPadding:5,
				height:280,
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
					if(form.isValid()){
						if(Ext.String.trim(Ext.getCmp("efilmName").getValue())==""){
							Ext.Msg.alert('操作提示','影片名称不能为空！');
							return;
						}
						if(Ext.String.trim(Ext.getCmp("efilmReview").getValue())==""){
							Ext.Msg.alert('操作提示','影片评论不能为空！');
							return;
						}
						if(Ext.String.trim(Ext.getCmp("eposter").getValue())!=""){
							var poster=Ext.getCmp("eposter").getValue();
							var imgType=(poster.substr(poster.lastIndexOf('.')+1)).toLowerCase();
							var reg=/^jpeg|jpg|png$/;
							if(!reg.test(imgType)){
								Ext.Msg.alert('操作提示','海报的图片类型不支持！');
								return;
							}
							var checkOver=checkImgSize("eposter-inputEl");
							if(checkOver==false){
								Ext.Msg.alert('操作提示','海报图片太大，请上传大小在100KB以内的图片！');
								return;
							}
						}
						if(Ext.String.trim(Ext.getCmp("ebackgroundPic").getValue())!=""){
							var backgroundPic=Ext.getCmp("ebackgroundPic").getValue();
							var imgType=(backgroundPic.substr(backgroundPic.lastIndexOf('.')+1)).toLowerCase();
							var reg=/^jpeg|jpg|png$/;
							if(!reg.test(imgType)){
								Ext.Msg.alert('操作提示','背景图片类型不支持！');
								return;
							}
							var checkOver=checkImgSize("ebackgroundPic-inputEl");
							if(checkOver==false){
								Ext.Msg.alert('操作提示','背景图片太大，请上传大小在100KB以内的图片！');
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
							filmReview:Ext.getCmp("efilmReview").getValue()
						},
						success:function(form,action){
							if(action.result.success){
								Ext.Msg.alert('操作提示',"修改在映影片信息成功！",function(){
									filmInfoStore.load();
									editWin.close();
								});
							}else{
								Ext.Msg.alert('操作提示',"修改在映影片信息失败！",function(){
									  editWin.close();
								});
							}
						},
						failure:function(form,action){
							Ext.Msg.alert('操作提示',"修改在映影片信息失败！",function(){
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
	
	var posterWin=null;
	var posterForm=[
		{
			xtype:'panel',
			id:"posterPanel",
			/*title: 'picture',//标题
			collapsible:false,//右上角上的那个收缩按钮，设为false则不显示*/
			contentEl: 'picture',//这个panel显示html中id为picture的内容
			height:328,
			width:246
		}
	];
	
	var createPosterWin=function(){
		return Ext.create('Ext.window.Window',
		{
			title:'海报',
			height:328,
			width:246,
			closeAction:'hide',
			modal:true,
			items:{
				id:'posterForm',
				xtype:'form',
				bodyPadding:0,
				height:328,
				items:posterForm
			},
			buttons:[
			{
				text:'关闭',
				icon:'/oscar/public/images/common/undo.png',
				iconAlign:'right',
				handler:function(){
					posterWin.close();
				}
			}],
			buttonAlign:'center'
		});
	}
	
	var backPicWin=null;
	var backPicForm=[
		{
			xtype:'panel',
			id:"backPicPanel",
			/*title: 'picture',//标题
			collapsible:false,//右上角上的那个收缩按钮，设为false则不显示*/
			contentEl: 'background',//这个panel显示html中id为background的内容
			height:500,
			width:720
		}
	];
	
	var createBackPicWin=function(){
		return Ext.create('Ext.window.Window',
		{
			title:'背景图片',
			height:500,
			width:720,
			closeAction:'hide',
			modal:true,
			items:{
				id:'backPicForm',
				xtype:'form',
				bodyPadding:0,
				height:500,
				items:backPicForm
			},
			buttons:[
			{
				text:'关闭',
				icon:'/oscar/public/images/common/undo.png',
				iconAlign:'right',
				handler:function(){
					backPicWin.close();
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
			store:filmInfoStore,
			title:'在映影片信息列表',
			region:'south',
			autoHeight:true,
			forceFit:1,
			autoScroll:true,
			viewConfig:{emptyText:'&nbsp;&nbsp;没有相关的记录'},
			columns:[
			    {text:'ID',dataIndex:'id',hidden: true},
				{text:'影片名称',dataIndex:'filmName'},
				{text:'影片海报',dataIndex:'poster',
					renderer:function(value, metaData, record, row, col, store, gridView){
		                metaData.tdAttr= 'data-qtip="点击查看图片"';
		                return value;
	            	}
	            },
				{text:'背景图片',dataIndex:'backgroundPic',
					renderer:function(value, metaData, record, row, col, store, gridView){
		                metaData.tdAttr= 'data-qtip="点击查看图片"';
		                return value;
	            	}
				},
				{text:'影片评论',dataIndex:'filmReview'},
				{
					 header:'操作',
					 menuDisabled:true,
					 sortable:false,
					 xtype:'actioncolumn',
					 items:[
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
							Ext.getCmp("eposter").setValue();
							editForm.getComponent("ebackgroundPic").setValue();
							editForm.getComponent("efilmReview").setValue(model.data.filmReview);
							editWin.show();
						}
					 }]
				 }
			 ],
			dockedItems:[
			{
				dock:'bottom',xtype:'pagingtoolbar',
				store:filmInfoStore,displayInfo:true,
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
					{
						xtype:'button',
						text:'查询',
						icon:'/oscar/public/images/common/icon_searchd.gif',
						listeners:{
							click:function(){
								if(filmInfoStore){
									var proxy=filmInfoStore.getProxy();
									proxy.setExtraParam('filmName',Ext.getCmp('filmName_id').getValue());
									filmInfoStore.load({
										params:{start:0,limit:PAGE_SIZE}
									});
								}
							}
						}
					}/*,
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
					}*/
				]
			}],
			listeners:{
				'cellclick':function(grid,rowIndex,columnIndex,e)
				{
					if(columnIndex==2){
						var imgName=e.data.poster;
						if(posterWin==null){
							posterWin=createPosterWin();
						}
						$("#picture").attr("src",host_url+poster_path+imgName);
						$("#picture").attr("alt",imgName);
						$("#picture").show();
						posterWin.show();
					}
					if(columnIndex==3){
						var imgName=e.data.backgroundPic;
						if(backPicWin==null){
							backPicWin=createBackPicWin();
						}
						$("#background").attr("src",host_url+background_path+imgName);
						$("#background").attr("alt",imgName);
						$("#background").show();
						backPicWin.show();
					}
				}
			}
		});
});