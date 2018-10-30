/**
 * 分享
 */
$(function () {
	var stylestr = '<style>'+
		'.share{background-color: #fff;border: 1px solid #ddd;border-radius: 3px;width: 100px;}'+
		'.share ul{padding: 0;margin:0;}'+
		'.share li{padding: 10px 3px;color: #333;}'+
		'.share li:hover{padding: 10px 3px;color: #333;background-color: #eee;}'+
		'.share a{display: block;color: #9e9e9e;text-decoration: none;}'+
	'</style>';
	$('head').append(stylestr);
	var htmlstr = '<div id="share" style="display: none;z-index:5000;" class="share">'+
	'<ul><li><a href="javascript:;" onclick="share(\'wechat\')">微信</a></li>'+
	'<li><a href="javascript:;" onclick="share(\'weibo\')">微博</a></li>'+
	'<li><a href="javascript:;" onclick="share(\'qzone\')">QQ空间</a></li></ul></div>';
	$('body').append(htmlstr);

	//控制分享的显示和隐藏
	$(".share").on('mouseover',function(){
		$("#share").attr("style","position:fixed;z-index:1000;left:" + (mousex-15) + "px;top:"+ (mousey-10) + "px;display:block;");
	});

	$(".share").on('mouseout',function(){
		$("#share").attr("style","display: none;z-index:5000;");
	});
	$(".icon-share").parent().on('mouseout',function(){
		$("#share").attr("style","display: none;z-index:5000;");
	});
	
});

function share(webid){
	var shareurl = $(".share").attr("data-url");
	switch(webid){
		case "wechat":
			shareurl = $(".share").attr("data-wechat");
			break;
		case "weibo":
			shareurl = shareurl+"&to=tsina"+"";
			break;
		case "qzone":
			shareurl = shareurl+"&to=qzone"+"";
			break;
		defaule:
			break;
	}
	shareurl = shareurl+"&firstime="+new Date().getTime()+"";
	window.open(shareurl);
}

function share_out(event,obj,type){
	if(type == "answer"){
		var title = $(obj).parent().parent().parent().find('.reply-content').text();
		if (title.length > 100){
			title = title.substring(0,100);
		}
		title = title + "- 优聚 - 基于知识分享协同的职场社交平台";
		var aid = $(obj).parent().parent().parent().parent().attr('data-aid');
		var url = window.location.href+"/answer/"+aid;	
	}else if(type == "webnav"){

		var ktitle    = $("#carditemmenu").data("title");
        var kcontent  = $("#carditemmenu").data("content");
		var title = ktitle+"   "+kcontent;
		var url = $("#carditemmenu").data("url");
	}else{
		var title = $("title").text();
		var url = window.location.href;
	}
	
	var shareurl = 'http://s.share.baidu.com/?click=1&url='+url+'&uid=0&type=text&title='+title+
	'&searchPic=0&sign=on';
	var wechat = 'http://www.jiathis.com/send/?webid=weixin&url='+url+'&title='+title+'&uid=2076325';

	$(".share").attr("data-url",shareurl);
	$(".share").attr("data-wechat",wechat);
	mousex = event.clientX;
	mousey = event.clientY;
	$("#share").attr("style","position:fixed;z-index:1000;left:" + (mousex-15) + "px;top:"+ (mousey-10) + "px;display:block;");
}