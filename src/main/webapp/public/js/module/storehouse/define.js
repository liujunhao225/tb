//model start

Ext.define('storeHouse', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'shId',
		type : 'string'
	}, {
		name : 'shName',
		type : 'string'
	}, {
		name : 'shType',
		type : 'string'
	}, {
		name : 'shAddress',
		type : 'string'
	}, {
		name : 'privilegeLevel',
		type : 'string'
	}]
});
