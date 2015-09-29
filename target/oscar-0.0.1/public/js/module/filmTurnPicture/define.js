//model start

Ext.define('movie_turnPicture', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'id',
		type : 'int'
	}, {
		name : 'name',
		type : 'string'
	}, {
		name : 'image',
		type : 'string'
	}, {
		name : 'orderNum',
		type : 'String'
	}, {
		name : 'isshow',
		type : 'String'
	} ,{
		name:'url',
		type:'String'
	}]
});
