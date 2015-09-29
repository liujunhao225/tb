/**
 * 预告片管理
 */
var PAGE_SIZE =15;
var FILMPLANTINFO_STORE_URL="/oscar/plantInfo/getFilmPlanList.do";
var FILMPLANTINFO_SAVEPHOTO_URL="/oscar/plantInfo/updateFilmPlanPhoto.do";
var FILMPLANTINFO_SAVEBACKGROUNDPHOTO_URL="/oscar/plantInfo/updateFilmPlanBackgroundPhoto.do";
var FILMPLANTINFO_SAVEVIDEO_URL="/oscar/plantInfo/updateFilmPlanVideo.do";
var FILMPLANTINFO_TOEDITFILM_URL = "/oscar/plantInfo/toFilmPlantEdit.do";

Ext.onReady(function(){
	Ext.QuickTips.init();
	var videoWin;
	var createVideoWin = function(videoUrl){
		var videoWin = Ext.create('Ext.window.Window',{
			title:'预告片',
			height:300,
			width:400,
			closeAction:'hide',
			modal:true,
			items:[{
					id:'videoForm',
					xtype:'panel',
				  columnWidth:0.5,
				  height:440,
				  html:'<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-44455354000" width="425" height="344"codebase="swflash.cab#version=6.0.40.0"><param name="allowFullScreen" value="true"/><param name="allowscriptaccess" value="always"/><param name="allowfullscreen" value="true"/><embed type="application/x-shockwave-flash" width="425" height="344" src="'+videoUrl+'",allowscriptaccess="always" allowfullscreen="true"></embed><object>'
				  }],
			buttons:[
			{
				text:'关闭',
				icon:'/oscar/public/images/common/undo.png',
				iconAlign:'right',
				handler:function(){
					videoWin.hide();
				}
			}],
			buttonAlign:'center'
		})
		return videoWin;
	}
	var photoWin;
	var createPhotoWin=function(imageUrl){
		var photoWin = Ext.create('Ext.window.Window',
		{
			title:'照片',
			height:300,
			width:400,
			closeAction:'hide',
			modal:true,
			items:[{
				id:'photoForm',
				xtype:'form',
				bodyPadding:0,
				height:300,
				items:[
				     {
				    	  xtype: 'box', //或者xtype: 'component',  
				    	  width: '100%', //图片宽度  
				    	  height: '100%', //图片高度  
				    	  autoEl: {  
				    	       tag: 'img',    //指定为img标签  
				    	       src: imageUrl    //指定url路径  
				    	    }
				     }  
				 ]
			}],
			buttons:[
			{
				text:'关闭',
				icon:'/oscar/public/images/common/undo.png',
				iconAlign:'right',
				handler:function(){
					photoWin.hide();
				}
			}],
			buttonAlign:'center'
		});
		return photoWin;
	}
	//修改影片剧照信息form
	var editForm=[
		{
			xtype:"hidden",
			itemId:"eid",
			id:"eid",
			name:'id'
		},
		{
			fieldLabel:'<span style="color:red;">*</span> 影片名称',xtype:'textfield',itemId:'efilmName',
			id:'efilmName',style:'padding-top:3px;',labelWidth:80,readOnly:true,
			labelAlign:'right',width:280,maxLength:30,
			maxLengthText:'影片名称不能超过30个字符'
		},
		{
			xtype : 'textfield',
			fieldLabel:'<span style="color:red;">*</span> 文&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;件',
			inputType:'file',
			id : 'aphotoUrl',
			name : 'file',
			itemId:'aphotoUrl',
			labelWidth:80,
			labelAlign:'right',
			width:280,
			style:'padding-top:3px;',
			anchor : '95%',
			buttonText:'选择文件',
			allowBlank : false,
      		blankText:'不能为空'
		}
	];
	var editWin;
	var isImage = true;
	var url = '';
	var createEditWin=function(title,submitURL){
		return Ext.create('Ext.window.Window',
		{
			title:title,
			height:180,
			width:350,
			closeAction:'hide',
			modal:true,
			items:{
				url : submitURL,
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
					if(form.isValid()){
						var $file =$('#form2:visible input[type=file]');
						var filePath = $file.val();
						if(isImage)
						{
							if(!(/.(jpg|jpeg|png)$/i.test(filePath)))
							{
								Ext.Msg.alert('操作提示','图片格式必须为jpg|jpeg|png中的一种');
								return;
							}
							file_size = $file[0].files[0].size;
							if(file_size > 1024*100)
							{
								Ext.Msg.alert('操作提示','图片大小需在100k以内');
								return;
							}
						}
						else
						{
							if(!(/.mp4$/i.test(filePath)))
							{
								Ext.Msg.alert('操作提示','请上传MP4格式的视频');
								return;
							}
							file_size = $file[0].files[0].size;
							if(file_size > 1024*1024*20)
							{
								Ext.Msg.alert('操作提示','视频大小需在20M以内');
								return;
							}
						
						}
						form.submit(
								{
									url:url,
									success:function(form,action){
										if(action.result.success == 'true'){
											Ext.Msg.alert('操作提示',"修改影片信息成功！",function(){
												photoStore.load();
												editWin.hide();
											});
										}else{
											Ext.Msg.alert('操作提示',"修改影片信息失败！",function(){
												  editWin.hide();
											});
										}
									},
									failure:function(form,action){
										Ext.Msg.alert('操作提示',"修改影片信息失败！",function(){
											  editWin.hide();
										});
									}
								});
					}
				}
			},
			{
				text:'取消',
				icon:'/oscar/public/images/common/undo.png',
				iconAlign:'right',
				handler:function(){
					editWin.hide();
				}
			}],
			buttonAlign:'center'
		});
	}
	var photoStore;
	var initPage = function(){		
		 photoStore = Ext.create('Ext.data.Store', 
				{
					model : 'movie_plantEXTInfo',
					pageSize : PAGE_SIZE,
					proxy : {
						type : 'ajax',
						url : FILMPLANTINFO_STORE_URL,
						extraParams : {
							filmName : ''
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
		grid=Ext.create(
				'Ext.grid.Panel',
				{
					renderTo:'gridpanel',
					width:Ext.getBody().getWidth(),
					store:photoStore,
					title:'预告片列表',
					region:'south',
					autoHeight:true,
					forceFit:1,
					viewConfig:{emptyText:'&nbsp;&nbsp;没有相关的记录'},
					columns:[
					    {text:'ID',dataIndex:'id',hidden: true},
						{text:'影片名称',dataIndex:'filmName'},
				        {
				            text: '海报',
				            dataIndex: 'image',
				            renderer:function(value, metaData, record, row, col, store, gridView){
				                metaData.tdAttr= 'data-qtip="点击查看图片"';
				                return value;
				            },
				            listeners: {
				            	'click':function(td, cellIndex, record, tr, rowIndex, e, eOpts ){
										var imgName=e.data.image;
		        						var photoUrl=host_url+stage_photo_path+imgName;
		        						if(!photoWin)
		        						{
		        							photoWin=createPhotoWin(photoUrl);
		        						}
		        						if($('#photoForm').html()){
		        							$('#photoForm').find('img').attr('src',photoUrl);
		        						}
		        						photoWin.show();
				            	}
				            }
				        },
				        {
				            text: '背景图片',
				            dataIndex: 'background_image',
				            renderer:function(value, metaData, record, row, col, store, gridView){
				                metaData.tdAttr= 'data-qtip="点击查看图片"';
				                return value;
				            },
				            listeners: {
				            	'click':function(td, cellIndex, record, tr, rowIndex, e, eOpts ){
										var imgName=e.data.background_image;
		        						var photoUrl=host_url+stage_photo_path+imgName;
		        						if(!photoWin)
		        						{
		        							photoWin=createPhotoWin(photoUrl);
		        						}
		        						if($('#photoForm').html()){
		        							$('#photoForm').find('img').attr('src',photoUrl);
		        						}
		        						photoWin.show();
				            	}
				            }
				        },
				        {
				            text: '预告片',
				            dataIndex: 'video',
				            renderer:function(value, metaData, record, row, col, store, gridView){
				                metaData.tdAttr= 'data-qtip="点击查看预告片"';
				                return value;
				            },
				            listeners: {
				            	'click':function(td, cellIndex, record, tr, rowIndex, e, eOpts ){
										var imgName=e.data.video;
			        					var vedioUrl=host_url+video_path+imgName;
			        					if(!videoWin)
			        					{
			        						videoWin = createVideoWin(vedioUrl);	
			        					}
			        					$('#videoForm').html('<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-44455354000" width="425" height="344"codebase="swflash.cab#version=6.0.40.0"><param name="allowFullScreen" value="true"/><param name="allowscriptaccess" value="always"/><param name="allowfullscreen" value="true"/><embed type="application/x-shockwave-flash" width="425" height="344" src="'+vedioUrl+'",allowscriptaccess="always" allowfullscreen="true"></embed><object>');
			        					videoWin.show();
				            	}
				            }
				        },
						{
							 header:'操作',
							 menuDisabled:true,
							 sortable:false,
							 xtype:'actioncolumn',
							 items:[{
									icon:'/oscar/public/images/common/update.gif',
									tooltip:'修改海报',
									handler:function(grid,rowIndex,colIndex){	
									var _store=grid.getStore();
									var model = grid.getStore().getAt(rowIndex);
									isImage = true;
									if(!editWin)
									{
										editWin=createEditWin('修改海报',FILMPLANTINFO_SAVEPHOTO_URL);	
									}
									else
									{
										editWin.setTitle('修改海报');
									}
									var editForm=editWin.getComponent('form2');
									url = FILMPLANTINFO_SAVEPHOTO_URL;
									editForm.getComponent('eid').setValue(model.data.id);
									editForm.getComponent('efilmName').setValue(model.data.filmName);
									editWin.show();
									}
								},{
									icon:'/oscar/public/images/common/update.gif',
									tooltip:'修改背景图片',
									handler:function(grid,rowIndex,colIndex){	
									var _store=grid.getStore();
									var model = grid.getStore().getAt(rowIndex);
									isImage = true;
									if(!editWin)
									{
										editWin=createEditWin('修改背景图片',FILMPLANTINFO_SAVEBACKGROUNDPHOTO_URL,true);
									}
									else
									{
										editWin.setTitle('修改背景图片');	
									}
									
									var editForm=editWin.getComponent('form2');
									url = FILMPLANTINFO_SAVEBACKGROUNDPHOTO_URL;
									editForm.getComponent('eid').setValue(model.data.id);
									editForm.getComponent('efilmName').setValue(model.data.filmName);
									editWin.show();
									}
								},{
									icon:'/oscar/public/images/common/update.gif',
									tooltip:'修改预告片',
									handler:function(grid,rowIndex,colIndex){	
									var _store=grid.getStore();
									var model = grid.getStore().getAt(rowIndex);
									isImage = false;
									if(editWin)
									{
										editWin=createEditWin('修改预告片',FILMPLANTINFO_SAVEVIDEO_URL);	
									}
									var editForm=editWin.getComponent('form2');
									url = FILMPLANTINFO_SAVEVIDEO_URL;
									editForm.getComponent('eid').setValue(model.data.id);
									editForm.getComponent('efilmName').setValue(model.data.filmName);
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
							{
								xtype:'button',
								text:'查询',
								icon:'/oscar/public/images/common/icon_searchd.gif',
								listeners:{
									click:function(){
										if(photoStore){
											var proxy=photoStore.getProxy();
											proxy.setExtraParam('filmName',Ext.getCmp('filmName_id').getValue());
											photoStore.load({
												params:{start:0,limit:PAGE_SIZE}
											});
										}
									}
								}
							}
						]
					}]
				});
	}
	initPage();
	
});