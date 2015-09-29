//model start

Ext.define('supply', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'supplierId',
		type : 'string'
	}, {
		name : 'supplierName',
		type : 'string'
	}, {
		name : 'contactPeople',
		type : 'string'
	}, {
		name : 'supplierPhone',
		type : 'string'
	}, {
		name : 'supplierProfile',
		type : 'string'
	}]
});
