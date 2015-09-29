//GRID列表每页显示的记录数Store xKF58665/xujun 2012-10-10
var PAGE_SIZE_STORE = Ext.create('Ext.data.Store', {
	fields : [ 'value', 'name' ],
	data : [ {
		"value" : 15,
		"name" : "15"
	}, {
		"value" : 20,
		"name" : "20"
	}, {
		"value" : 50,
		"name" : "50"
	} ]
});
DSP_MSG = Ext.create('Ext.window.MessageBox', {
	buttonText : {
		ok : '确定',
		yes : '确定',
		no : '取消',
		cancel : '取消'
	}
});