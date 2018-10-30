$(function () {
	//删除标签
	$(".icon-remove-sign").live("click",function(){
		$(this).parent().remove();
		//遍历一遍更新tag数据
		var strtag=[]
		$(".ask-add-tag .ask-tag").each(function(){
			strtag.push($.trim($(this).attr("data-tid")));
    	 });
		$('#txttag').val(strtag);
	});
		
	//监听提页tag输入框回车事件
	$('#newtag').bind('keypress',function(event){
        if(event.keyCode == "13"){
        	submitTags();
        }
    });
	//问答内容页
	$("#ask-icon").bind('click',function(){
		$("#elmaaa").focus();
	});
/*	$(".reply-ul li").live('mouseover',function(){
		$(this).find('.reply-ul-view').show();
	});
	$(".reply-ul li").live('mouseout',function(){
		$(this).find('.reply-ul-view').hide();
	});*/

	$(".ask-add-tag").bind('click',function(){
		$("#newtag").focus();
	});

	$(".sugtag").live('click',function(){
		var tid   = $(this).attr("data-tid");
		var tname = $(this).text();
		if(!checkTags(tname)){
	 		return;
		}
		addTag(tid,tname);
	});

	$(".createtag").live('click',function(){
		submitTags();
	});
	//失去焦点，搜索框关闭
	$("body").bind('click',function(){
		$("#ask-item").hide();
	});
	$("#questioninfo").bind('click',function(event){
		event.stopPropagation();
	});
});

	
function getSames(){
	var title = $("#questioninfo").val();
	
	if(title.length == 0){
		$("#ask-suggest-list").empty();
		$('#ask-item').hide();
		return;
	}
	$('#question-icon').removeClass("question-icon");
	$('#question-icon').addClass("question-wait");

	$.ajax({
		url:"/question/getSames",
		type:"post",
		dataType: 'json',
		data:{"title":title},
		sync:false,
		success:function(data){
			$("#ask-suggest-list").empty();
			var ob = eval(data);
			if(ob.length != 0){
				for(var o in ob){
			  		$('#ask-suggest-list').append('<li><a href="/question/'+ob[o].id+'">'+ob[o].questioninfo+'<span>'+ob[o].answercount+'个回答</span></a></li>');
	        	}
				$('#ask-item').show();
			}else{
				$('#ask-item').hide();
			}
			$('#question-icon').removeClass("question-wait");
			$('#question-icon').addClass("question-icon");
		}
	});	
	$('#question-icon').removeClass("question-wait");
	$('#question-icon').addClass("question-icon");
}
function editAnswer(obj){
	var aid = $(obj).parents('.question-item').attr("data-aid");
	//判断权限
	$.ajaxdo({
		url:"/question/editAnswer",
		type:"post",
		dataType: 'json',
		data:{"aid":aid},
		sync:false,
		success:function(data){
			if(data.statusCode == 200){
				AnswerInfo.aid = aid;
				newxheditor.setSource(data.data.answerinfo);
				$("#editer").show();
				$("#editinfo").hide();
				$("#cancelEditAnswer").show();
				//滚动到底部
				var boom = document.body.clientHeight;
				$("html").animate({scrollTop:boom});
				$("#elmaaa").focus();
				$("#xhe0_container").addClass("borderflash");
				setTimeout(function(){$("#xhe0_container").removeClass("borderflash");},3500);
			}else{
				toastr.error(data.message,'',{"positionClass": "toast-top-center"});
			}
		}
	});
}

function delAnswer(aid){
	$.ajaxdo({
		url:"/question/delAnswer",
		type:"post",
		dataType: 'json',
		data:{"aid":aid},
		sync:false,
		success:function(data){
			if(data.statusCode == 200){
				$("#DivAnswer"+aid+"").remove();
				var num = $("#answercount").text();
				num = num*1-1;
				$("#answercount").text(num);
				$("#answercount2").text("回答("+num+")");
				toastr.success(data.message,'',{"positionClass": "toast-top-center"});
			}else{
				toastr.error(data.message,'',{"positionClass": "toast-top-center"});
			}
		}
	});
}
function cancelEditAnswer(){
	newxheditor.setSource("");
	AnswerInfo.aid = 0;
	$("#cancelEditAnswer").hide();
	$("#editer").hide();
	$("#editinfo").show();
}
	
function showReply(ob){
	var obj = $(ob).parent().parent().next();
	if (obj.is(":hidden")){
		obj.show();
	}else{
		obj.hide();
	} 
}

function cancelReply(ob){
	var obj = $(ob).parent().parent().parent();
	if (obj.is(":hidden")){
		obj.show();
	}else{
		obj.hide();
	}
}
	
function saveReply(ob){
	var obj   = $(ob).parent().parent().parent().parent().parent();
	var objre = $(ob).parent().prev();
	var aid   = obj.attr("data-aid");
	var reply = objre.val();
	if (reply.length > 2000){
		toastr.info("回复字数请不要超过2000个字",'',{"positionClass": "toast-top-center"});
		return;
	}
	if (reply.length == 0){
		toastr.info("回复内容请不要为空",'',{"positionClass": "toast-top-center"});
		return;
	}
	$.ajaxdo({
		url:"/question/saveReply",
		type:"post",
		dataType: 'json',
		data:{"aid":aid,"reply":reply},
		sync:false,
		success:function(data){
			if(data.statusCode == 200){
				objre.val("");
				evalobj = eval(data.data);
				var htmlstr = '<li data-rid="'+evalobj.rid+'"><div class="ask-user-avatar"><a href="/u/'+evalobj.uid+'"><img src="/attachments/avatar2/avatar_'+evalobj.uid+'.jpg"></a></div><div class="question-info"><div class="reply-head"><a href="/u/'+evalobj.uid+'">'+evalobj.nickname+'</a><span>刚刚</span>	</div><div class="reply-content">'+reply+'</div><div class="reply-group reply-ul-view"><a href="javascript:;" class="reply-right" onclick="delReply(this)">删除</a><a href="javascript:;" class="reply-right" onclick="replyTo(this)">回复</a></div></div></li>';
				$(ob).parent().parent().prev().children('ul').append(htmlstr);
				var num = $("#replycount"+aid+"").text()*1+1;
				$("#replycount"+aid+"").text(num);
				toastr.success(data.message,'',{"positionClass": "toast-top-center"});
			}else{
				toastr.error(data.message,'',{"positionClass": "toast-top-center"});
			}
		}
	});
}
	
function delReply(ob){
	var obj = $(ob).parent().parent().parent();
	var rid = obj.attr("data-rid");
	var aid = $(ob).parents('.question-item').attr("data-aid");
	$.ajaxdo({
		url:"/question/delReply",
		type:"post",
		dataType: 'json',
		data:{"rid":rid,"aid":aid},
		sync:false,
		success:function(data){
			if(data.statusCode == 200){
				toastr.success(data.message,'',{"positionClass": "toast-top-center"});
				var num = $("#replycount"+aid+"").text()*1-1;
				$("#replycount"+aid+"").text(num);
				obj.remove();
			}else{
				toastr.error(data.message,'',{"positionClass": "toast-top-center"});
			}
		}
	});
}
	
function replyTo(ob){
	var name = $(ob).parent().prev().prev().children("a").text();
	var txtReply = $(ob).parents('.question-item').find('.comment-txt');
	txtReply.val("回复 "+name+":");
	txtReply.focus();
}
	
function approve(ob){
	var id   = 0; 
	var type = $(ob).attr("data-type");
	if(type == 'answer'){
		id = $(ob).parents('.question-item').attr("data-aid");
	}else{
		id = $(".question-head-title").attr('data-qid');
	}
	$.ajaxdo({
		url:"/question/approve",
		type:"post",
		dataType: 'json',
		data:{"type":type,"id":id},
		sync:false,
		success:function(data){
			if(data.statusCode == 200){
				var likecount = $(ob).children('span');
				likecount.text(likecount.text()*1+1);
				if(type == 'answer'){
					var unlikecount = $(ob).parent().next().find('span');
					if(data.message != 1){
						unlikecount.text(unlikecount.text()*1-1);
					}
				}
				toastr.success("点赞成功!",'',{"positionClass": "toast-top-center"});
			}else{
				toastr.error(data.message,'',{"positionClass": "toast-top-center"});
			}
		}
	});
}
	
function disapproval(ob){
	var aid = $(ob).parents('.question-item').attr("data-aid");
	$.ajaxdo({
		url:"/question/disapproval",
		type:"post",
		dataType: 'json',
		data:{"aid":aid},
		sync:false,
		success:function(data,status){
			if(data.statusCode == 200){
				var likecount   = $(ob).parent().prev().find('span');
				var unlikecount = $(ob).children('span');
				unlikecount.text(unlikecount.text()*1+1);
				if(data.message != 1){
					likecount.text(likecount.text()*1-1);
				}
				toastr.success("反对成功!",'',{"positionClass": "toast-top-center"});
			}else{
				toastr.error(data.message,'',{"positionClass": "toast-top-center"});
			}
		}
	});
}
function openSort(event){
		
	mousex = event.clientX;
	mousey = event.clientY;
	//打开遮罩层
	var top  = document.body.scrollHeight;
	var left = document.body.scrollLeft;
	$("#bg").attr('style','height:'+top+'px;display:block;');
	$("#pop-up").attr("style","position:fixed;z-index:1000;left:" 
								+ (mousex) + "px;top:"
								+ (mousey) + "px;display:block;");
	$("#txtSname").focus();
}
function cancelEdit(){
	$("#txtSname").val("");
	$('#pop-up').hide();
	document.getElementById("bg").style.display ='none';
}
function saveSort(){
	var sname = $("#txtSname").val();
	var ename = $(".project-ename").attr("data-ename");
	if(sname.length == 0){
		toastr.info('分类名称不能为空','',{"positionClass": "toast-top-center"});
		return;
	}
	$.ajaxdo({
		url:"/question/saveSort",
		type:"post",
		dataType: 'json',
		data:{"sname":sname,"ename":ename},
		sync:false,
		success:function(data){
			if(data.statusCode == '200'){
				toastr.info('分类创建成功','',{"positionClass": "toast-top-center"});
				var strhtml = '<a href="javascript:;" class="active" data-sid="'+data.message+'">'+sname+'<img class="icon-remove-sign" src="/statics/yimages/del-icon-white.png" onclick="delSort(this)"></a>';
				$(".sortDiv").append(strhtml);
			}
			cancelEdit();
		}
	});
}
function delSort(ob){
	var action = 0;
	var obj = $(ob).parent();
	var sid = obj.attr("data-sid");
	
	if(confirm("是否删除该分类下的所有问题?")){
		action = 1;
	}
	$.ajaxdo({
		url:"/question/delSort",
		type:"post",
		dataType: 'json',
		data:{"action":action,"sid":sid},
		sync:false,
		success:function(data){
			if(data.statusCode == '200'){
				obj.remove();
			}
		}
	});
}
/**举报**/
$(".radio-box").click(function(){
	//alert($(this).val());
	$(this).find("input[type=radio]").attr("checked", 'checked');
});
//显示举报模态框
function showReportBox(obj){
	var tid    = $(obj).attr("data-tid");
	var module = $(obj).attr("data-module");
	$(".report-Box").attr("data-tid",tid);
	$(".report-Box").attr("data-module",module);
	$("body").attr("style","overflow:hidden;");
	$(".report-Box").attr("style","display:block;");
}
//关闭举报模态框
function closeReportBox(obj){
	$(".radio-text").attr("value","");
	$("body").attr("style","");
	$(".report-Box").attr("style","display:none;");
	$('.radio-box input:radio:checked').removeAttr('checked');
}
//点击其他后文本框获取焦点
function reportOther(obj){
	$(".radio-text").focus();
}
function reportSubmit(obj){
	var tid     = $(".report-Box").attr("data-tid");
	var module  = $(".report-Box").attr("data-module");
 	var url     = window.location.href;
 	var content = $(".radio-text").attr("value");
 	var type    = $('.radio-box input:radio:checked').val();
	if(type == null || (type == 0 && content.length == 0)){
		alert("举报内容不能为空");
		return;
	}
 	$.ajaxdo({
		type:"post",
	    url:"../comment/report",
	    async: false,
	    data: {tid:tid,module:module,url:url,content:content,type:type},
	    success:function(data){
	    	var arr = eval("("+data+")");
	    	alert(arr['message']);
    		$(".radio-text").attr("value","");
    		$("body").attr("style","");
    		$(".report-Box").attr("style","display:none;");
    		$('.radio-box input:radio:checked').removeAttr('checked');
	    }
	});
}
/**举报结束**/

/***提问页标签添加***/
//提交tag
function submitTags(){
	//获取TAG名称
	var tname = $('#newtag').val();
	if(tname.length == 0 ){
		toastr.info('标签名称不能为空','',{"positionClass": "toast-top-center"});
		$('#newtag').focus();
		return ;
	}
	if(tname.length > 10){
		toastr.info('标签名称不要超过10个字','',{"positionClass": "toast-top-center"});
		return ;
	}
	if(!checkTags(tname)){
	 	return;
	}
    $.ajaxdo({
		url:"/question/selTag",
		type:"post",
		dataType: 'json',
		data:{"tname":tname},
		sync:false,
		success:function(data){
			if(data.statusCode == 200){
    			addTag(data.message,tname);
			}else{
				toastr.error(data.message,'',{"positionClass": "toast-top-center"});
			}
		}
	});	
}
//往标签页添加Tag
function addTag(tagid,tname){
	var tagHtml = '<span class="ask-tag" data-tid="'+tagid+'" >'+tname+'<img src="/statics/yimages/del-icon.png" class="icon-remove-sign"></span>';
	$("#newtag").before(tagHtml);
	var strtag=[]
	$(".ask-add-tag .ask-tag").each(function(){
		strtag.push($.trim($(this).attr("data-tid")));
	});
	$('#txttag').val(strtag);
}
//验证Tag是否已经添加
function checkTags(tname){
	var tags=[]; 
	$(".ask-add-tag .ask-tag").each(function(){
		 tags.push($.trim($(this).text()));
	 });

	if($.inArray(tname,tags) != -1){//tags 已经存在就直接返回
     	$('#newtag').val("");
     	toastr.info('该标签已经添加过了','',{"positionClass": "toast-top-center"});
     	return false;
     }

    if(tags.length > 4){
    	toastr.info('不要添加超过5个标签','',{"positionClass": "toast-top-center"});
    	return false;
    }
    $("#newtag").val("");
    $('.suggest-tag').empty();
    $(".create-tag").empty();
    $('.tag-item').hide();
    $('.create-item').hide();
    return true;
}
//查询Tag
function getTags(){
	var tname = $("#newtag").val();
	if(tname.length == 0){
		$(".suggest-tag").empty();
		$(".create-tag").empty();
		$('.tag-item').hide();
		$('.create-item').hide();
		return;
	}

	var tags=[]; 
	$(".ask-add-tag .ask-tag").each(function(){
		 tags.push($.trim($(this).text()));
	 });

	if($.inArray(tname,tags) != -1){//tags 已经存在就直接返回
     	$(".suggest-tag").empty();
		$(".create-tag").empty();
		$('.tag-item').hide();
		$('.create-item').hide();
     	return;
     }
	
	$.ajaxdo({
		url:"/question/getSameTag",
		type:"post",
		dataType: 'json',
		data:{"tname":tname},
		sync:false,
		success:function(data){
			$('.suggest-tag').empty();
			$(".create-tag").empty();
			var ob = eval(data);
			if(ob.length != 0){
				for(var o in ob){
			  		$('.suggest-tag').append('<li><a href="javascript:;" data-tid="'+ob[o].tagid+'" class="sugtag">'+ob[o].tagname+'</a></li>');	
	        	}
	        	$('.create-item').hide();
				$('.tag-item').show();
			}else{
				//$('.create-tag').append('<li>创建<a href="javascript:;" class="createtag" >'+tname+'</a>标签？</li>');
				$('.create-tag').append('<li>没有找到标签:'+tname+',请使用已创建的标签</li>');
				$('.tag-item').hide();
				$('.create-item').show();

			}
		}
	});	
}

//加精
function gifts(obj){
	var id   = $(obj).attr("data-id");
	var type = $(obj).attr("data-type");
	var action = $(obj).attr("data-action");

	$.ajaxdo({
		url:"/question/gifts",
		type:"post",
		dataType: 'json',
		data:{"id":id,"type":type,"action":action},
		sync:false,
		success:function(data){
			if(data.statusCode == 200){
				if(type == 'q'){
					if (action == 'enlighten'){
						$(".question-head-title").append('<span class="gifts">精华</span>');
						$(obj).attr("data-action","unenlighten");
						$(obj).html('取消精品');
					}else{
						$(".question-head-title").find('span').remove();
						$(obj).attr("data-action","enlighten");
						$(obj).html('加精');
					}
				}
				if(type == 'a'){
					var ob = $(obj).parent().parent().find('.reply-head');
					if (action == 'enlighten'){
						$(ob).find('a').after('<span class="gifts-small">精华</span>');
						$(obj).attr("data-action","unenlighten");
						$(obj).html('取消精品');
					}else{
						$(ob).find('.gifts-small').remove();
						$(obj).attr("data-action","enlighten");
						$(obj).html('加精');
					}
				}
    			toastr.info(data.message);

			}else{
				toastr.error(data.message);
			}
		}
	});	
}


	