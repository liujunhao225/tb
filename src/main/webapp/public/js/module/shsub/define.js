//model start
Ext.define('shSub', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'shSubId',
		type : 'string'
	}, {
		name : 'shName',
		type : 'string'
	}, {
		name : 'capacity',
		type : 'string'
	}, {
		name : 'usedTotal',
		type : 'string'
	},{
		name:'shId',
		type:'string'
	}]
});
//仓位商品
Ext.define("cwproductmodel",{
	extend:'Ext.data.Model',
	fields:[{
		name:'shSubId',
		type:'string'
	},
	{
		name:'productCode',
		type:'string'
	},
	{
		name:'shId',
		type:'string',
	},
	{
		name:'count',
		type:'string'
	},{
		name:'reallycount',
		type:'int'
	},{
		name:'dsubShid',
		type:'string'
	},{
		name:'reserverCol1',
		type:'string'
	}
	]
});

//仓位信息
Ext.define('changweimodel', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'id',
        type: 'string'
    },{
    	name:'shSubId',
    	type:'string'
    }
   ]
});


