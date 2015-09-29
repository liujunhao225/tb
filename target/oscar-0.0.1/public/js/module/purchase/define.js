//model start

Ext.define('purchaseOrder', {
	extend : 'Ext.data.Model',
	fields : [{
		name:'productId',
		type:'string'
	}, {
		name : 'orderId',
		type : 'string'
	}, {
		name : 'supplierId',
		type : 'string'
	}, {
		name:'boxCount',
		type:'int'
	},{
		name:'logistics',
		type:'string'
	},{
		name:'logisticsNum',
		type:'string'
	},{
		name:'orderState',
		type:'string'
	},{
		name : 'purchaseDate',
		type : 'string'
	},
	{
		name:'deliveryDate',
		type:'string'
	},
	{
		name:'arriveDate',
		type:'string'
	},
	{
		name:'storeDate',
		type:'string'
	},
	{
		name:'fileFlag',
		type:'string'
	}]
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
		name:'noStorageNum',
		type:'string'
	}
	]
});
