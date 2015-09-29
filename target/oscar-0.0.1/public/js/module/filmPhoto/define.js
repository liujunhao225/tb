//model start

Ext.define('movie_filmPhoto',
{
	extend:'Ext.data.Model',
	fields:[
	    {name:'id',type:'int'},
	    {name:'filmName',type:'string'},
	    {name:'filmCode',type:'string'},
	    {name:'photoUrl',type:'string'},
	    {name:'creatTime',type:'string'}
	]
});

