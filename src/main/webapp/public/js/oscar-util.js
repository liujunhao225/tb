//服务器路径
//var host_url = "http://app13.wxhn.cn/public/apps/Oscar/";
var host_url = "http://192.168.10.14:19091/public/apps/Oscar/";
// 轮播图路径
var turn_pic_path = "images/";
// 视频路径
var video_path = "images/";
// 剧照路么
var stage_photo_path = "images/movies_pic/";
// 背景图片路径
var background_path = "images/movies_pic/";
// 海报图片路径
var poster_path = "images/movies_pic/";

var checkImgSize=function(tagId){
	var explorer = window.navigator.userAgent;
	var f=document.getElementById(tagId);
	var checkOver=true;
	/*if(explorer.indexOf("MSIE") >= 0){
		var img=new Image();//动态创建img
		img.src=f.value;
		img.style.display="none";
		img.onreadystatechange=function(){
			if(img.readyState=='complete'){//当图片load完毕
				console.log(img.fileSize/1024);//ie获取文件大小
				if((img.fileSize/1024)>100){
					Ext.Msg.alert('操作提示','图片太大，请上传大小在100KB以内的图片！');
					checkOver=false;
				}
			}
		}
	}else{
		var imgSize=f.files[0].size;//火狐谷歌等标准取值办法
		if((imgSize/1024)>100){
			Ext.Msg.alert('操作提示','图片太大，请上传大小在100KB以内的图片！');
			checkOver=false;
		}
	}*/
	var imgSize=f.files[0].size;//火狐谷歌IE10等标准取值办法
	if((imgSize/1024)>100){
		checkOver=false;
	}
	return checkOver;
}