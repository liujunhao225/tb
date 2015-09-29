//model start
//
Ext.define('purchaseOrder', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'id',
		type : 'string'
	}, {
		name : 'shSubId1',
		type : 'string'
	}, {
		name : 'shProductId',
		type : 'string'
	}, {
		name : 'shProductSize',
		type : 'string'
	},{
		name:'shSubId2',
		type:'string'
		
	},{
		name:'count',
		type:'string'
	},
	{
		name:'writer',
		type:'string'
		
	},{
		name:'submitDate',
		type:'string'
	},{
		name:'state',
		type:'string'
	}]
});
