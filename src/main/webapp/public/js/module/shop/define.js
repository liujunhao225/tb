//model start

Ext.define('shop', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'shopId',
		type : 'string'
	}, {
		name : 'shopName',
		type : 'string'
	}, {
		name : 'shopCharger',
		type : 'string'
	}, {
		name : 'privilegeLevel',
		type : 'string'
	}]
});
