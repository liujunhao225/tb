//model start

Ext.define('movie_plantInfo',
{
	extend:'Ext.data.Model',
	fields:[
	    {name:'id',type:'int'},
	    {name:'filmName',type:'string'},
	    {name:'filmName1',type:'string'},
	    {name:'cast',type:'string'},
	    {name:'version',type:'string'},
	    {name:'publishDate',type:'string'}
	]
});
Ext.define('movie_plantEXTInfo',
		{
			extend:'Ext.data.Model',
			fields:[
			    {name:'id',type:'int'},
			    {name:'filmName',type:'string'},
			    {name:'image',type:'string'},
			    {name:'background_image',type:'string'},
			    {name:'video',type:'string'}
			]
		});