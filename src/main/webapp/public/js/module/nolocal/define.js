//model start
Ext.define('purchaseOrder', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'productId',
		type : 'string'
	}, {
		name : 'shStoreId',
		type : 'string'
	}, {
		name : 'price',
		type : 'string'
	}, {
		name : 'totalCount',
		type : 'string'
	} ,{
		name:'inputTime',
		type:'date'
	}]
});
