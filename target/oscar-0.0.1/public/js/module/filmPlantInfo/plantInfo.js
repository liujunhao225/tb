/**
 * 预告片管理
 */
var PAGE_SIZE =15;
var FILMPLANTINFO_STORE_URL="/oscar/plantInfo/getFilmPlanList.do";
var FILMPLANTINFO_TOSAVE_URL="/oscar/plantInfo/toFilmPlantAdd.do";
var FILMPLANTINFO_TODESC_URL="/oscar/plantInfo/toFilmPlantDesc.do";
var FILMPLANTINFO_DELETE_URL="/oscar/plantInfo/deleteFilmPlanById.do";
var FILMPLANTINFO_TOEDITFILM_URL = "/oscar/plantInfo/toFilmPlantEdit.do";

Ext.onReady(function(){
	Ext.QuickTips.init();
	var initPage = function(){		
		var photoStore = Ext.create('Ext.data.Store', 
				{
					model : 'movie_plantInfo',
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
						{text:'英文名',dataIndex:'filmName1'},
						{text:'演员',dataIndex:'cast'},
						{text:'发行版本',dataIndex:'version'},
						{text:'公映日期',dataIndex:'publishDate'},
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
									Ext.Msg.confirm('操作提示','确定要删除该预告片？',function(btn){
										if(btn=="yes"){
											var _store=grid.getStore();
											var model = grid.getStore().getAt(rowIndex);
											Ext.Ajax.request({
												url:FILMPLANTINFO_DELETE_URL,
												params:{id:model.data.id},
												success:function(response){
													var text=Ext.decode(response.responseText);
													if(text.success == "true"){
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
									var store = grid.getStore();
									var model = store.getAt(rowIndex);
									var id = model.data.id;
									window.location.href= FILMPLANTINFO_TOEDITFILM_URL+'?id='+id;
								}
							},{
								icon:'/oscar/public/images/common/table.gif',
								tooltip:'查看详情',
								handler:function(grid,rowIndex,colIndex){
									var store = grid.getStore();
									var model = store.getAt(rowIndex);
									var id = model.data.id;
									window.location.href= FILMPLANTINFO_TODESC_URL+'?id='+id;
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
							},
							'->',
							{
								xtype:'button',
								text:'新增',
								icon:'/oscar/public/images/common/add.png',
								handler:function(){
									window.location.href= FILMPLANTINFO_TOSAVE_URL;
								}
							}
						]
					}]
				});
	}
	initPage();
	
});