/**
 * 预告片管理
 */
var FILMPLANTINFO_SAVE_URL = "/oscar/plantInfo/filmPlantAdd.do";
var FILMPLANTINFO_TODESC_URL="/oscar/plantInfo/toFilmPlantDesc.do";
var FILMPLANTINFO_TOFlILMLIST_URL="/oscar/plantInfo/toPlantInfo.do";

Ext.onReady(function() {
	Ext.QuickTips.init();
	// 增加预告片form
	var addForm =[
	       {
	    	   xtype:'fieldset',
	    	   layout:'form',
	    	   defaultType:'textfield',
	    	   autoHeight:true,
	    	   width: "50%",
	    	   items:[
	    	          	{
	    	          		fieldLabel : ' 影片名称',
	    	          		name : 'filmName',
	    	          		allowBlank : false,
	    	          		blankText:'不能为空'
	    	          	}, {
	    	          		fieldLabel : ' 英文名',
	    	          		name : 'filmName1',
	    	          		allowBlank : false,
	    	          		blankText:'不能为空',
	    	          		regex: /^[0-9a-zA-Z]*$/i,
	    	          		regexText : "只能输入数字或字母"
	    	          	}, {
	    	          		fieldLabel : ' 发行版本',
	    	          		name: 'version'
	    	          	}, {
	    	          		fieldLabel : ' 影片时长',
	    	          		name: 'duration',
	    	          		regex: /^[\d]{1,4}$/i,
	    	          		regexText : "必须为1-4位数字"
	    	          	},{
	    	          		fieldLabel : ' 公映日期',
	    	          		name: 'publishDate',
	    	          		allowBlank : false,
	    	          		blankText:'不能为空',
	    	          		regex: /^[\d]{4}-[\d]{2}-[\d]{2}$|^[\d]{4}-[\d]{2}$/i,
	    	          		regexText : "正确的日期格式  yyyy-MM-dd或yyyy-MM"
	    	          	},{
	    	          		fieldLabel : ' 导演',
	    	          		name: 'director'
	    	          	}, {
	    	          		fieldLabel : ' 影片类型',
	    	          		name: 'filmType'
	    	          	}, {
	    	        		fieldLabel : ' 国家',
	    	        		name: 'country'
	    	        	}  
	    	   ]
	       },{
	    	   xtype:'fieldset',
	    	   layout:'form',
	    	   defaultType:'radiogroup',
	    	   autoHeight:true,
	    	   width: "50%",
	    	   items:[
	    	          	{
	    	          		xtype: 'radiogroup',
	    	          		fieldLabel: '是否最受关注',
	    	          		items: [
	    	          		        {boxLabel: '是', name: 'isAttention', inputValue: 1,checked: true},
	    	          		        {boxLabel: '否', name: 'isAttention', inputValue: 2}
	    	          		        ]
	    	          	},{
	    	          		xtype: 'radiogroup',
	    	          		fieldLabel : ' 推荐指数',
	    	          		items: [
	    	          		        {boxLabel: '0颗星', name: 'recommendIndex', inputValue: 0},
	    	          		        {boxLabel: '一颗星', name: 'recommendIndex', inputValue: 1},
	    	          		        {boxLabel: '二颗星', name: 'recommendIndex', inputValue: 2},
	    	          		        {boxLabel: '三颗星', name: 'recommendIndex', inputValue: 3},
	    	          		        {boxLabel: '四颗星', name: 'recommendIndex', inputValue: 4},
	    	          		        {boxLabel: '五颗星', name: 'recommendIndex', inputValue: 5,checked: true}
	    	          		        ]
	    	          	}, {
	    	          		xtype: 'radiogroup',
	    	          		fieldLabel : ' 明星阵容',
	    	          		items: [
	    	          		        {boxLabel: '0颗星', name: 'starIndex', inputValue: 0},
	    	          		        {boxLabel: '一颗星', name: 'starIndex', inputValue: 1},
	    	          		        {boxLabel: '二颗星', name: 'starIndex', inputValue: 2},
	    	          		        {boxLabel: '三颗星', name: 'starIndex', inputValue: 3},
	    	          		        {boxLabel: '四颗星', name: 'starIndex', inputValue: 4},
	    	          		        {boxLabel: '五颗星', name: 'starIndex', inputValue: 5,checked: true}
	    	          		        ]
	    	          	}, {
	    	          		xtype: 'radiogroup',
	    	          		fieldLabel : ' 视听效果 ',
	    	          		items: [
	    	          		        {boxLabel: '0颗星', name: 'seehearIndex', inputValue: 0},
	    	          		        {boxLabel: '一颗星', name: 'seehearIndex', inputValue: 1},
	    	          		        {boxLabel: '二颗星', name: 'seehearIndex', inputValue: 2},
	    	          		        {boxLabel: '三颗星', name: 'seehearIndex', inputValue: 3},
	    	          		        {boxLabel: '四颗星', name: 'seehearIndex', inputValue: 4},
	    	          		        {boxLabel: '五颗星', name: 'seehearIndex', inputValue: 5,checked: true}
	    	          		        ]
	    	          	}, {
	    	          		xtype: 'radiogroup',
	    	          		fieldLabel : ' 剧情故事 ',
	    	          		items: [
	    	          		        {boxLabel: '0颗星', name: 'storyIndex', inputValue: 0},
	    	          		        {boxLabel: '一颗星', name: 'storyIndex', inputValue: 1},
	    	          		        {boxLabel: '二颗星', name: 'storyIndex', inputValue: 2},
	    	          		        {boxLabel: '三颗星', name: 'storyIndex', inputValue: 3},
	    	          		        {boxLabel: '四颗星', name: 'storyIndex', inputValue: 4},
	    	          		        {boxLabel: '五颗星', name: 'storyIndex', inputValue: 5,checked: true}
	    	          		        ]
	    	          	}, {
	    	          		xtype: 'radiogroup',
	    	          		fieldLabel : ' 观众口碑 ',
	    	          		items: [
	    	          		        {boxLabel: '0颗星', name: 'mouthIndex', inputValue: 0},
	    	          		        {boxLabel: '一颗星', name: 'mouthIndex', inputValue: 1},
	    	          		        {boxLabel: '二颗星', name: 'mouthIndex', inputValue: 2},
	    	          		        {boxLabel: '三颗星', name: 'mouthIndex', inputValue: 3},
	    	          		        {boxLabel: '四颗星', name: 'mouthIndex', inputValue: 4},
	    	          		        {boxLabel: '五颗星', name: 'mouthIndex', inputValue: 5,checked: true}
	    	          		        ]
	    	          	}
	    	   ]
	       },{
	    	   xtype:'fieldset',
	    	   defaultType:'textarea',
	    	   layout:'column',
	    	   autoHeight:true,
	    	   width: "100%",
	    	   defaults: {width: "100%"},
	    	   lableWidth:100,
	    	   lableAlign:'center',
	    	   items:[ 
	    	           {
	    	        	   fieldLabel : '演员',
	    	        	   name: 'cast',
	    	        	   maxLength:'2000',
	    	        	   maxLengthText:'不能超过2000字符'
	    	           },
	    	          {
	    	        	  fieldLabel : ' 一句话描述',
	    	        	  name: 'inaword',
	    	        	  maxLength:'2000',
	    	        	  maxLengthText:'不能超过2000字符'
	    	          }, {
	    	        	  fieldLabel : ' 影评',
	    	        	  name: 'filmReview',
	    	        	  maxLength:'2000',
	    	        	  maxLengthText:'不能超过2000字符'
	    	          }, {
	    	        	  fieldLabel : ' 内容简介',
	    	        	  name: 'introduction',
	    	        	  maxLength:'3000',
	    	        	  maxLengthText:'不能超过3000字符'
	    	          }, {
	    	        	  fieldLabel : ' 看点',
	    	        	  name: 'watchingFocus',
	    	        	  maxLength:'5000',
	    	      		  maxLengthText:'不能超过5000字符'
	    	          } 
	    	   ]
	       }      
	    ];
	var initPage = function() {
			var simple = new Ext.FormPanel({
				url : FILMPLANTINFO_SAVE_URL,
				frame : true,
				title : '添加预告片信息',
				width : "100%",
				layout:'column',
				items : addForm,
				buttonAlign:'center',
				buttons : [ {
					text : '添加',
					handler:function(){
						var form=simple.getForm();
						if(form.isValid()){
							form.submit(
									{
										success:function(form,action){
												Ext.Msg.alert('操作提示',"添加成功",function(){
													var id = action.result.id;
													window.location.href = FILMPLANTINFO_TODESC_URL+'?id='+id;
												});
										},
										failure:function(form,action){
											Ext.Msg.alert('操作提示',"添加失败",function(){
											});
										}
									});
						}
					}
				}, {
					text : '取消',
					handler:function(){
						var form=simple.getForm();
						form.reset();
					}
				}, {
					text : '返回',
					handler:function(){
						window.location.href = FILMPLANTINFO_TOFlILMLIST_URL;
					}
				}]
			});

			simple.render(document.body);
	}
	initPage();

});