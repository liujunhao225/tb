Ext.define('orderProduct', {
	extend : 'Ext.data.Model',
	fields : [{
		name : 'id',
		type : 'string'
	},{
		name : 'productId',
		type : 'string'
	}, {
		name : 'productName',
		type : 'string'
	}, {
		name : "productSize",
		type : "string"
	}, {
		name : 'productCode',
		type : 'string'
	}, {
		name:'barCode',
		type:'string'
	},{
		name : 'sellsPrice',
		type : 'string'
	}, {
		name : 'price',
		type : 'string'
	}, {
		name : 'allPrice',
		type : 'string'
	}, {
		name : 'purchaseNum',
		type : 'int'
	}, {
		name : 'noStorageNum',
		type : 'string'
	} ,{
		name:'orderId',
		type:'string'
	},{
		name:'checkbox',
		type:'string'
	},{
		name:'inNum',
		type:'int'
	}]
});

Ext.define('order', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'orderId',
		type : 'string'
	}, {
		name : 'supplier',
		type : 'string'
	} ]

});

Ext.define("purchaseProductModel",{
	extend:'Ext.data.Model',
	fields:[
	{
		name:'productId',
		type:'string'
	},
	{
		name:'productCode',
		type:'string'
	},
	{
		name:'productSize',
		type:'string'
	},
	{
		name:'productName',
		type:'string',
	},
	{
		name:'barCode',
		type:'string'
	},{
		name:'kind',
		type:'string'
	},{
		name:'price',
		type:'string'
	},{
		name:'sellsPrice',
		type:'string'
	},{
		name:'allPrice',
		type:'string'
	},{
		name:'purchaseNum',
		type:'string'
	},{
		name:'total',
		type:'string'
	}
	]
});

