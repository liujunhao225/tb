//model start
//
Ext.define('initModel', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'id',
		type : 'string'
	}, {
		name : 'teName',
		type : 'string'
	}, {
		name : 'tcName',
		type : 'string'
	}, {
		name:'initFlag',
		type:'string'
	} ]
});
