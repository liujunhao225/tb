<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<!DOCTYPE>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<script language="javascript" src="/oscar/public/js/ext/ext-all.js"></script>
<title>上传文件</title>
</head>
<body>

	<form action="/oscar/turn/update.do" method="post" enctype="application/x-www-form-urlencoded"></form>
	<div id="fi-form" style="padding: 25px;"></div>
</body>
<script type="text/javascript">
/* 	Ext.onReady(function() {

		Ext.create('Ext.form.Panel', {
			title : 'File Uploader',
			width : 400,
			bodyPadding : 10,
			frame : true,
			renderTo : 'fi-form',
			items : [ {
				xtype : 'filefield',
				name : 'file',
				fieldLabel : 'File',
				labelWidth : 50,
				msgTarget : 'side',
				allowBlank : false,
				anchor : '100%',
				buttonText : 'Select a File...'
			}, {
				xtype : 'hiddenfield',
				name : 'hidden_field_1',
				value : 'value from hidden field'
			} ],

			buttons : [ {
				text : 'Upload',
				handler : function() {
					var form = this.up('form').getForm();
					if (form.isValid()) {
						form.submit({
							url : '/oscar/upload/upload.do',
							waitMsg : 'Uploading your file...',
							headers : {
								'Content-Type':'charset=UTF-8;',
								'accept-charset':'UTF-8'
							},
							params:{
								
							},
							success : function(fp, o) {
								Ext.Msg.alert('Success',
										'Your file has been uploaded.');
							}
						});
					}
				}
			} ]
		});
	}); */
</script>
</html>