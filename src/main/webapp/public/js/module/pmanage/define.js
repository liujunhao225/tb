Ext.define('product', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'productId',
		type : 'string'
	}, {
		name:'shId',
		type:'String'
	}, {
		name:'count',
		type:'int'
	}, {
		name:'productSize',
		type:'String'
	}, {
		name:'shSubId',
		type:'String'
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

