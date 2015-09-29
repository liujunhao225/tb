Ext.define('product', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'id',
		type : 'string'
	}, {
		name : 'productCode',
		type : 'string'
	}, {
		name : "productName",
		type : "string"
	},{
		name : 'productId',
		type : 'string'
	},{
		name : 'productSize',
		type : 'string'
	}, {
		name : 'color',
		type : 'string'
	}, {
		name : 'barCode',
		type : 'string'
	}, {
		name : 'brand',
		type : 'string'
	}, {
		name : 'season',
		type : 'string'
	}, {
		name : 'ingrowth',
		type : 'string'
	} ]
});
Ext.define('productStoreModel', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'shName',
		type : 'string'
	}, {
		name : 'shSubId',
		type : 'string'
	}, {
		name : "count",
		type : "string"
	},{
		name : 'state',
		type : 'string'
	},{
		name : 'time',
		type : 'string'
	},
	{
		name:'price',
		type : 'string'
	}]
});
Ext.define('proPuchOrderModel', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'orderId',
		type : 'string'
	}, {
		name : 'supplierName',
		type : 'string'
	}, {
		name : "purchaseDate",
		type : "string"
	},{
		name : 'orderState',
		type : 'string'
	},{
		name : 'arriveDate',
		type : 'string'
	}]
});

