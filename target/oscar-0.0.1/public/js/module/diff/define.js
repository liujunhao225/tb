//model start
//
Ext.define('purchaseOrder', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'id',
		type : 'string'
	}, {
		name : 'purchaseId',
		type : 'string'
	}, {
		name : 'productId',
		type : 'string'
	}, {
		name : 'productSize',
		type : 'string'
	},{
		name:'operator',
		type:'string'
		
	},{
		name:'submitDate',
		type:'string'
	},
	{
		name:'state',
		type:'string'
		
	},{
		name:'checkDate',
		type:'string'
	},{
		name:'purchaseCount',
		type:'int'
	},{
		name:'realCount',
		type:'int'
	}]
});
