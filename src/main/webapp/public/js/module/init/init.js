/**
 * 店铺管理
 */
var TURNPICTURE_STORE_URL = "/oscar/sys_init/list.do";
var TURNPICTURE_UPDATE_URL = "/oscar/sys_init/init.do";
Ext.onReady(function() {
    Ext.QuickTips.init();
    var checkGroup = {
    	    xtype: 'fieldset',
    	    title: '请选择',
    	    layout: 'anchor',
    	    id:'checkGroupId',
    	    defaults: {
    	        anchor: '100%',
    	        labelStyle: 'padding-left:4px;'
    	    },
    	    collapsible: false,
    	    collapsed: false,
    	    items: [],
    	    listeners:{
    	    	'render':function(view,opt){
    	    		console.log("group checkbox init");
    	    		var cbg=this;
    	    		var tableArray = new Array();
    	    		
    	    		Ext.Ajax.request({ 
    	    			async:false,
    	    			url:TURNPICTURE_STORE_URL,
    	    			method:'get',
    	    			
    	    			success:function(response){
    	    				console.log("返回信息:"+response.responseText);
    	    			     var job = Ext.JSON.decode(response.responseText);
    	    				 var tables  = job.datalist;
    	    			     console.log("tables size"+tables.length);
    	    				 for(var j=0;j<tables.length;j++){
    	    					 console.log(tables[j].tcName+"--"+tables[j].teName+"--"+tables[j].id);
    	    					 cbg.items.add(
    	    							  new Ext.form.Checkbox({  
                                              boxLabel: tables[j].tcName,   
                                              inputValue: tables[j].teName,   
                                              name: 'init_table',
                                              id:tables[j].id  
                                           }) 
    	    					 ); 
    	    					 console.log("add "+j);
    	    				 }
    	    			}
    	    			
    	    		});
    	    	cbg.doLayout();
    	    	}
    	    }
    	};
    var fp = Ext.create('Ext.FormPanel', {
        title: '初始表配置',
        frame: true,
        fieldDefaults: {
            labelWidth: 110
        },
        width: 600,
        renderTo:'initDiv',
        bodyPadding: 10,
        items: [
            checkGroup
        ],
        buttons: [{
            text: '保存',
            handler: function(){
               if(fp.getForm().isValid()){
            	   
                    Ext.Msg.alert('提示', '你所选中的表数据将被初始化!');
                    var allItems = Ext.getCmp('checkGroupId').items.items;
//                    console.log(allItems.items);
                    var selectTableIds = "";
                    for(var i=0;i<allItems.length;i++){
                    	console.log(allItems[i].checked);
                    	if(allItems[i].checked){
                    		selectTableIds=selectTableIds+','+allItems[i].id
                    	}
                    }
                    console.log('选中的表id:'+selectTableIds);
                    Ext.Ajax.request({ 
    	    			async:false,
    	    			url:TURNPICTURE_UPDATE_URL+'?selectid='+selectTableIds,
    	    			method:'get',
    	    			success:function(response){
    	    				Ext.Msg.alert("提示信息","已清空");
    	    			}
    	    			
    	    		});
                    
                }
            }
        },{
            text: '重置',
            handler: function(){
                fp.getForm().reset();
            }
        }]
    });
    
});