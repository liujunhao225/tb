/**
 * 预告片管理
 */
var FILMPLANTINFO_GETFILMDESC_URL = "/oscar/plantInfo/getFilmPlanDesc.do";
var FILMPLANTINFO_TOEDITFILM_URL = "/oscar/plantInfo/toFilmPlantEdit.do";
var FILMPLANTINFO_TOFlILMLIST_URL="/oscar/plantInfo/toPlantInfo.do";
var textfieldKeys = {
		'filmName':{'desc':'影片名称'},
		'filmName1':{'desc':'英文名'},
		'version':{'desc':'发行版本'},
		'duration':{'desc':'影片时长'},
		'publishDate':{'desc':'公映日期'},
		'director':{'desc':'导演'},
		'filmType':{'desc':'影片类型'},
		'country':{'desc':'国家'}
		};
var radiogroupKeys = {
		'isAttention':{'desc':'是否最受关注'},
		'recommendIndex':{'desc':'推荐指数'},
		'starIndex':{'desc':'明星阵容'},
		'seehearIndex':{'desc':'视听效果'},
		'storyIndex':{'desc':'剧情故事'},
		'mouthIndex':{'desc':'观众口碑'}
		};
var textareaKeys = {
		'cast':{'desc':'演员'},
		'inaword':{'desc':'一句话描述'},
		'filmReview':{'desc':'影评'},
		'introduction':{'desc':'内容简介'},
		'watchingFocus':{'desc':'看点'}
		};
Ext.onReady(function() {
	Ext.QuickTips.init();
	var creadForm = function(film){
		var items = [];
		var textfieldItems = {
				   xtype:'fieldset',
		    	   layout:'form',
		    	   defaultType:'textfield',
		    	   autoHeight:true,
		    	   width: "50%"	
		}
		var fieldItems = [];
		for(var key in textfieldKeys)
		{
			var value = film[key];
			if(!value)
			{
				value = "";
			}
			var filed = {
					fieldLabel : textfieldKeys[key].desc,
	          		name : key,
	          		value: value,
	          		readOnly:true
			}
			fieldItems.push(filed);
		}
		textfieldItems.items = fieldItems;
		items.push(textfieldItems);
		
		var radiogroupItem = {
				xtype:'fieldset',
		    	layout:'form',
		    	defaultType:'radiogroup',
		    	autoHeight:true,
		    	width: "50%"
		}
		var radioItems = [];
		for(var key in radiogroupKeys)
		{
			var value = film[key];
			if(!value)
			{
				value = "";
			}
			var filed = {
					fieldLabel : radiogroupKeys[key].desc,
	          		name : key,
	          		value: value,
	          		readOnly:true
			}
			if(key == "isAttention")
			{
				var item=[
				          {boxLabel: '是', name: key, inputValue: 1}, 
				          {boxLabel: '否', name: key, inputValue: 2} 
				     ];
				if(value == 1)
				{
					item[0].checked = true;
				}
				else
				{
					item[1].checked = true;
				}
			}
			else
			{
				var item=[
	          		        {boxLabel: '0颗星', name: key, inputValue: 0},
	          		        {boxLabel: '一颗星', name: key, inputValue: 1},
	          		        {boxLabel: '二颗星', name: key, inputValue: 2},
	          		        {boxLabel: '三颗星', name: key, inputValue: 3},
	          		        {boxLabel: '四颗星', name: key, inputValue: 4},
	          		        {boxLabel: '五颗星', name: key, inputValue: 5}
	          		];
				if(!isNaN(value)&&value<=5&&value>=0)
				{
					item[value].checked = true
				}else
				{
					item[0].checked = true
				}
			}
			filed.items = item;
			radioItems.push(filed);
		}
		radiogroupItem.items = radioItems;
		items.push(radiogroupItem);
		
		textareaItems = {
				xtype:'fieldset',
		    	defaultType:'textarea',
		    	layout:'column',
		    	autoHeight:true,
		    	width: "100%",
		    	defaults: {width: "100%"},
		    	lableWidth:100,
		    	lableAlign:'center'
		};
		areaItems = [];
		for(var key in textareaKeys)
		{
			var value = film[key];
			if(!value)
			{
				value = "";
			}
			var field = {
				fieldLabel : textareaKeys[key].desc,
 	        	name: key,
 	        	value: value,
          		readOnly:true
			}
			areaItems.push(field);
		}
		textareaItems.items = areaItems;
		items.push(textareaItems);
		
		return items;
	}
	var showform = function(formData,id){
		var simple = new Ext.FormPanel({
			id:'form',
			frame : true,
			title : '查看预告片信息',
			width : "100%",
			layout:'column',
			items : formData,
			buttonAlign:'center',
			buttons : [ {
				text : '编辑',
				handler:function(){
					window.location.href = FILMPLANTINFO_TOEDITFILM_URL+'?id='+id;
				}
			}, {
				text : '返回',
				handler:function(){
					window.location.href = FILMPLANTINFO_TOFlILMLIST_URL;
				}
			} ]
		});

		simple.render(document.body);
	}
	var initPage = function() {
		var id = Ext.get("id").getValue();
		Ext.Ajax.request({
			url: FILMPLANTINFO_GETFILMDESC_URL,
			params:{'id':id},
				success:function(resp,opts){
					content=JSON.parse(resp.responseText);
					var date = content.date
					if(content.success=="true"&&date)
					{
						var formData = creadForm(date);
						showform(formData,id);
					}
				},
				failure:function(){
					Ext.Msg.alert('操作提示',"系统繁忙，请稍后重试",function(){
						window.location.href = FILMPLANTINFO_TOFlILMLIST_URL;
					});
				}
			});
	}
	initPage();

});