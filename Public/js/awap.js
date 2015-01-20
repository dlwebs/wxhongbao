function o() {
		var a = document.body,
		b = document.documentElement;
		return {
			x: Math.max(a.scrollWidth, b.clientWidth),
			y: Math.max(a.scrollHeight, b.clientHeight),
			top: Math.max(b.scrollTop, a.scrollTop),
			left: Math.max(b.scrollLeft, a.scrollLeft),
			width: b.clientWidth,
			height: b.clientHeight
		}
	}
function Q(a) {
		var b = o(),
		d = b.height * .482 - a.offsetHeight / 2,
		e = b.left + (b.width - a.offsetWidth) / 2;
		a.style.top = b.top + d + "px",
		a.style.left = e + "px"
}
function R(t,c){
		$("body").append('<div id="tips" class="'+c+'"><span>'+t+'</span></div>'),
		Q(document.getElementById("tips")),setTimeout(function() {
			$("#tips").animate({
				top: o().top,
				opacity: 0
			},
			function() {
				$(this).remove()
			})
		},3000)
}

function R2(t,s,c){
		$("body").append('<div id="tips" class="'+c+'"><span>'+t+'</span></div>'),
		Q(document.getElementById("tips")),setTimeout(function() {
			$("#tips").animate({
				top: o().top,
				opacity: 0
			},
			function() {
				$(this).remove()
			})
		},s)
}

function R3(t,c){
		$("body").append('<div id="tips3" class="'+c+'"><span>'+t+'</span></div>'),
		Q(document.getElementById("tips3")),setTimeout(function() {
            //$("#tips3").css("background-image","url(images/r3.gif)");
			$("#tips3").animate({
				top: o().top,
				opacity: 0
			},
			function() {
				$(this).remove();
			})
		},3000)
}

function R4(t,s,c){
	    if (s=="" || isNaN(s)) s=3000;
		$("body").append('<div id="tips4" class="'+c+'"><span>'+t+'</span></div>'),
		Q(document.getElementById("tips4")),setTimeout(function() {
			$("#tips4").animate({
				top: o().top,
				opacity: 0
			},
			function() {
				$(this).remove()
			})
		},s)
}

//页面加载开始
$(document).ready(function() {

var visibleW=$(window).width();

/*左侧出来的分类模块*/
$('#top_rightXJs,#top_rightXJs2').click(function(){
	$('.pr_list').css('left',visibleW+"px");
	$('.pr_list').animate({left:'0'},500);
});

$('.pr_listBtn,.pr_listBtn a').click(function(){
	$('.pr_list').animate({left:'100%'},500);
});
$('.pr_listTip').click(function(){
	//var pr_listTip2=$(this).find('.pr_listTip');
	var class2=$(this).parents('.pr_listConModn').find('.class2');
	if(class2.is(":hidden")){
		$('.pr_listTip').removeClass('pr_listTip2');		
		$(this).addClass('pr_listTip2');
	}else{
		$(this).removeClass('pr_listTip2');
		
	}
	
});

/*点击灰色背景 或 取消按钮 的操作*/
$('.J_Shade_tip_img,.reset,.vote_tip_operate div.yl,.vote_tip_operate div.fq').click(function(){
	hideBg();
	$('.J_Shade_tip').css('display','none');	
	$('.apply_box').css('display','none');	
});



$('input,textarea').focus(function(){
   $(".footer2").css("display","none");

   $(this).blur(function() {
      $(".footer2").css("display","block");
   });
});


/*处理有边框的文本框的100%宽度
text_W();
function text_W(){
	var text_w=$('.apply_warp').width()-22;
	$('.apply_warp input').css('width',text_w+'px');
	$('.apply_warp textarea').css('width',text_w+'px');
}
*/
});
//页面加载结束


//隐藏底部开始
function foot_move(a1){
   $(".footer2").css("display","none");

   $("#"+a1).blur(function() {
      $(".footer2").css("display","block");
   });
}
//隐藏底部结束


/*点击 分享给朋友圈 按钮的操作--> .btn_general*/
function share_to(){
	var display=$('.J_Shade_tip').css('display');
	if(display=='none'){
		showBg();
		$('.J_Shade_tip').css('display','block');
	}else{
		hideBg();
		$('.J_Shade_tip').css('display','none');	
	}
}


/*查看报名人员*/
function apply_user_info(a1){
	var c1="remid_mob1_"+a1;
	
	if($("#"+c1).siblings('.remid_mob2').is(":hidden")){//判断是否隐藏
	    $('.remid_mob').removeClass('show');	
	    $('.remid_mob2').slideUp(200,function(){});
		//R(12);
		$("#"+c1).parents('.remid_mob').addClass('show');
		$("#"+c1).siblings('.remid_mob2').slideDown(200,function(){});
	}else{		
		$("#"+c1).siblings('.remid_mob2').slideUp(200,function(){
			$("#"+c1).parents('.remid_mob').removeClass('show');
		});
	}
}

/*点击 我要报名 按钮的操作--> .apply*/
function apply1(){
	var display=$('.apply_box1').css('display');
	if(display=='none'){
		showBg();
		$('.apply_box1').css('display','block');
	}else{
		hideBg();
		$('.apply_box1').css('display','none');	
	}
}

function apply2(){
	var display=$('.apply_box2').css('display');
	if(display=='none'){
		showBg();
		$('.apply_box2').css('display','block');
	}else{
		hideBg();
		$('.apply_box2').css('display','none');	
	}
}


/*隐藏灰色背景*/
function hideBg(){
	$('.J_Shade').removeClass('J_ShadeShow');
	$('.J_Shade').addClass('J_ShadeHide');
}

/*显示灰色背景*/
function showBg(){
	$('.J_Shade').removeClass('J_ShadeHide');
	$('.J_Shade').addClass('J_ShadeShow');
}



/*姓名检测开始*/
function isChn(str){ 

   var name = /^[\u4E00-\u9FA5]+$/; 

   if(!name.test(str)){ 
      R("提示：请正确输入真实姓名！"); 
      return false;  
   }

} 
/*姓名检测结束*/


/*身份证检测开始*/
function checkCardId(socialNo){

	  if(socialNo == "")
	  {
	    R("请正确输入身份证");
	    return (false);
	  }

	  if (socialNo.length != 15 && socialNo.length != 18)
	  {
	    R("请正确输入身份证");
	    return (false);
	  }
		
	 var area={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"}; 
	   
	   if(area[parseInt(socialNo.substr(0,2))]==null) {
	   	R("请正确输入身份证");
	    	return (false);
	   } 
	    	
	  if (socialNo.length == 15)
	  {
	     pattern= /^\d{15}$/;
	     if (pattern.exec(socialNo)==null){
			R("请正确输入身份证");
			return (false);
	    }
		var birth = parseInt("19" + socialNo.substr(6,2));
		var month = socialNo.substr(8,2);
		var day = parseInt(socialNo.substr(10,2));
		switch(month) {
			case '01':
			case '03':
			case '05':
			case '07':
			case '08':
			case '10':
			case '12':
				if(day>31) {
					R('请正确输入身份证');
					return false;
				}
				break;
			case '04':
			case '06':
			case '09':
			case '11':
				if(day>30) {
					R('请正确输入身份证');
					return false;
				}
				break;
			case '02':
				if((birth % 4 == 0 && birth % 100 != 0) || birth % 400 == 0) {
					if(day>29) {
						R('请正确输入身份证');
						return false;
					}
				} else {
					if(day>28) {
						R('请正确输入身份证');
						return false;
					}
				}
				break;
			default:
				R('请正确输入身份证');
				return false;
		}
		var nowYear = new Date().getYear();
		if(nowYear - parseInt(birth)<15 || nowYear - parseInt(birth)>100) {
			R('请正确输入身份证');
			return false;
		}
	    return (true);
	  }
	  
	  var Wi = new Array(
	            7,9,10,5,8,4,2,1,6,
	            3,7,9,10,5,8,4,2,1
	            );
	  var   lSum        = 0;
	  var   nNum        = 0;
	  var   nCheckSum   = 0;
	  
	    for (i = 0; i < 17; ++i)
	    {
	        

	        if ( socialNo.charAt(i) < '0' || socialNo.charAt(i) > '9' )
	        {
	            R("请正确输入身份证");
	            return (false);
	        }
	        else
	        {
	            nNum = socialNo.charAt(i) - '0';
	        }
	         lSum += nNum * Wi[i];
	    }

	  
	    if( socialNo.charAt(17) == 'X' || socialNo.charAt(17) == 'x')
	    {
	        lSum += 10*Wi[17];
	    }
	    else if ( socialNo.charAt(17) < '0' || socialNo.charAt(17) > '9' )
	    {
	        R("请正确输入身份证");
	        return (false);
	    }
	    else
	    {
	        lSum += ( socialNo.charAt(17) - '0' ) * Wi[17];
	    }

	    
	    
	    if ( (lSum % 11) == 1 )
	    {
	        return true;
	    }
	    else
	    {
	        R("请正确输入身份证");
	        return (false);
	    }
		
}
/*身份证检测结束*/


/*手机检测开始*/
function checkPhone(tel) {

if ( /^13\d{9}$/g.test(tel) || /^14\d{9}$/g.test(tel) || /^15\d{9}$/g.test(tel) || /^17\d{9}$/g.test(tel) || /^18\d{9}$/g.test(tel)){
     return true;
}else{
	 R("请正确输入手机");
     return (false);
}

}
/*手机检测结束*/


/*邮箱检测开始*/
function checkEmail(email){
    var temp = email;
    //对电子邮件的验证
    var myreg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+[\.][a-zA-Z]{2,3}$/;
    if (!myreg.test(temp)){
        R("请正确输入E-Mail");
        return false;
    }
}
/*邮箱检测结束*/

/*邮箱检测开始*/
function checkUser2(user){
    var reg = /^[A-Za-z0-9]+$/;   
   if (arr=user.match(reg)) {  
      //return ture;   
   }else{
      R("密码只允许输入英文、数字");   
      return false;   
   }   
}
/*邮箱检测结束*/

/*用户名检测开始*/
function checkUser(user){
   var reg = /^(\w|[\u4E00-\u9FA5])*$/;   
   if (arr=user.match(reg)) {  
      //return ture;   
   }else{
      R("用户名只允许输入英文、数字、汉字");   
      return false;   
   }   
}
/*用户名检测结束*/


/*保存报名数据开始*/
function apply_save() {
	var username=$("#username").val();
	var phone=$("#phone").val();
	var weixin=$("#weixin").val();
	var beizhu=$("#beizhu").val();	
	var aid=$("#aid").val();

	if (aid=="" || isNaN(aid)) {
       R("数据异常！");
       return (false);
    }
	
	if (username == "" || username.length > 4 || username.length < 2) {
       R("请正确输入真实姓名");
       return (false);
    }
	
	if (isChn(username)==false) return (false);
	
	if (phone == "" || phone.length != 11 || isNaN(phone)) {
       R("请正确输入手机");
       return (false);
    }
	
	if (checkPhone(phone)==false) return (false);
	
	if (weixin == "" || weixin.length > 30) {
       R("请正确输入微信帐号");
       return (false);
    }
	
	if (beizhu != "" && (beizhu==" " || beizhu=="　")) {
       R("请正确输入备注");
       return (false);
    }
	
	$("#BtnOn1").css("display","none");
	$("#BtnOn2").css("display","inline");
	//$("#BtnOn3").css("display","none");
	
	$.post("apply_save.do", {username:username,phone:phone,weixin:weixin,beizhu:beizhu,aid:aid},function(txt){tb_remove(),$("#net_re").html(txt);});
}



function apply_save_re(a1) {
   if (a1=="no"){
	  $("#BtnOn1").css("display","inline");
	  $("#BtnOn2").css("display","none");
	  $("#BtnOn3").css("display","inline");
   }
   
   if (a1=="yes"){
      apply1();	
	  $("#BtnOn1").css("display","inline");
	  $("#BtnOn2").css("display","none");
	  $("#BtnOn3").css("display","inline");
   }
}
/*保存报名数据结束*/


/*验证发布人开始*/
function apply_user_check() {
	var aid=$("#aid").val();
	var pwd=$("#pwd").val();
	
	if (aid=="" || isNaN(aid)) {
       R("数据异常！");
       return (false);
    }
	
	if (pwd == "" || pwd.length > 16 || pwd.length < 6) {
       R("请正确输入管理密码");
       return (false);
    }
	
	$("#BtnOn4").css("display","none");
	$("#BtnOn5").css("display","inline");
	//$("#BtnOn6").css("display","none");
	
	$.post("apply_user_check.do", {aid:aid,pwd:pwd},function(txt){tb_remove(),$("#net_re").html(txt);});
}



function apply_user_check_re(a1) {
   if (a1=="no"){
	  $("#BtnOn4").css("display","inline");
	  $("#BtnOn5").css("display","none");
	  $("#BtnOn6").css("display","inline");
   }
   
   if (a1=="yes"){
      apply2();	
	  $("#BtnOn4").css("display","inline");
	  $("#BtnOn5").css("display","none");
	  $("#BtnOn6").css("display","inline");
   }
}
/*验证发布人结束*/


/*查看报名人页开始*/
function apply_user_del(a1,a2,a3){
	
	var v1=$("#aid").val();
	var url;

	if (a1=="" || isNaN(a1) || v1=="" || isNaN(v1)) {
       R("数据异常！");
       return (false);
    }
	
	var jstxt="删除用户“"+a2+"”，确认操作？"
	
	if (confirm(jstxt)){
	   var b1="remid_mob_s_"+a1;
	   var b2="remid_"+a1;
	
       $("#"+b1).slideUp(300);
	   
	   url="apply_user_del.do";
	   if (a3=="ping") url="apply_ping_del.do";
	   if (a3=="match") url="match_ping_del.do";
	   
	   $.post(url, {uid:a1,aid:v1},function(txt){tb_remove(),$("#net_re").html(txt);});
	}   
}


function apply_user_page(a1){
	var k=$("#k").val();
	var aid=$("#aid").val();
	var tid=$("#tid").val();
	var page=$("#page").val();
	var d1="remid_more_"+page;
	var url;
	
	if (page=="" || isNaN(page) || aid=="" || isNaN(aid) || tid=="" || isNaN(tid)) {
       R("数据异常！");
       return (false);
    }
	
	var nextpage=page*1+1;
	var b1="rem_load1_"+page;
	var b2="rem_load2_"+page;
	
	$("#"+b2).css("display","block");
	$("#"+b1).css("display","none");
	
	url="apply_user_page.do";
	if (a1=="ping") url="apply_ping_page.do";
	
	$.post(url, {page:nextpage,aid:aid,tid:tid,k:k},function(txt){tb_remove(),$("#"+d1).html(txt);});
}


function apply_user_search(a1){
	var search_text=$("#search_text").val();
	var aid=$("#aid").val();
	
	if (a1=="ping"){
	   location.href="apply-ping-"+aid+"-"+search_text+".html";
	}else{
	   location.href="apply-user-"+aid+"-"+search_text+".html";
	}
}


function match_ping_del(pingid,pid,sname){
	
	var url;

	if (pingid=="" || isNaN(pingid) || pid=="" || isNaN(pid)) {
       R("数据异常！");
       return (false);
    }
	
	var jstxt="删除用户“"+sname+"”的评论，确认操作？"
	
	if (confirm(jstxt)){
	   var b1="remid_mob_s_"+pingid;
	   var b2="remid_"+pingid;
	
       $("#"+b1).slideUp(300);
	   
	   url="match_ping_del.do";
	   
	   $.post(url, {pingid:pingid,pid:pid},function(txt){tb_remove(),$("#net_re").html(txt);});
	}   
}


function match_ping_page(){
	var k=$("#k").val();
	var pid=$("#pid").val();
	var page=$("#page").val();
	var d1="remid_more_"+page;
	var url;
	
	if (page=="" || isNaN(page) || pid=="" || isNaN(pid)) {
       R("数据异常！");
       return (false);
    }
	
	var nextpage=page*1+1;
	var b1="rem_load1_"+page;
	var b2="rem_load2_"+page;
	
	$("#"+b2).css("display","block");
	$("#"+b1).css("display","none");
	
	url="match_ping_page.do";
	
	$.post(url, {page:nextpage,pid:pid,k:k},function(txt){tb_remove(),$("#"+d1).html(txt);});
}


function match_ping_search(){
	var search_text=$("#search_text").val();
	var pid=$("#pid").val();
	
	location.href="match-ping-"+pid+"-"+search_text+".html";
}


function match_ping_reply(pingid){
   var pid=$("#pid").val();
   var reinfo=$("#reinfo_"+pingid).val();
   var d1="ping4_1_"+pingid;
   var b1="ping7_1_"+pingid;
   var b2="ping7_2_"+pingid;
	
   if (pid=="" || isNaN(pid) || pingid=="" || isNaN(pingid)) {
       R("数据异常！");
       return (false);
   }
   
   if (reinfo.length > 300) {
       R("回复内容限制300字符");
       return (false);
   }
   
   $("#"+b1).css("display","none");
   $("#"+b2).css("display","block");
   
   $.post("match_ping_reply.do", {pingid:pingid,pid:pid,reinfo:reinfo},function(txt){tb_remove(),$("#"+d1).html(txt);});
}
/*查看报名人页结束*/


/*报名列表开始*/
function apply_list_page(){
	var k=$("#search_text").val();
	var page=$("#page").val();
	var netid=$("#netid").val();
	var d1="remid_more_"+page;
	
	if (page=="" || isNaN(page)) {
       R("数据异常！");
       return (false);
    }
	
	var nextpage=page*1+1;
	var b1="rem_load1_"+page;
	var b2="rem_load2_"+page;
	
	$("#"+b2).css("display","block");
	$("#"+b1).css("display","none");
	
	$.post("apply_list_page.do", {page:nextpage,k:k,netid:netid},function(txt){tb_remove(),$("#"+d1).html(txt);});
}


function apply_list_search(){

	var search_text=$("#search_text").val();
	var netid=$("#netid").val();
	
	if (netid!="" && isNaN(netid)) {
       R("数据异常！");
       return (false);
    }
	
	if (search_text=="输入“活动关键字”或“发起人姓名”") search_text="";
	
	if (netid=="") netid="0";
	
	$.post("apply_list_search.do", {k:search_text,netid:netid},function(txt){tb_remove(),$("#net_re").html(txt);});
	//location.href="apply-list-"+netid+"-"+search_text+".html";
}
/*报名列表结束*/


/*发布报名页切换开始*/
function apply_add_site(a1) {

if (a1 != "1" && a1 != "2" && a1 != "3"){
    //R("数据异常！");
    //return (false);	
}

if (a1=="1" || a1=="2") {
   $(".apply_add1 div").removeClass("apply_add1_on");
   $("#psite").val(a1);
}

if (a1 == "1") {
   $(".apply_add3").css("display","none");
   $(".apply_add4").css("display","none");
   $("#address").val("");
   $(".apply_add1_1").addClass("apply_add1_on");
}

if (a1 == "2") {
   $(".apply_add3").css("display","block");
   $(".apply_add1_2").addClass("apply_add1_on");
}

if (a1 == "3") R("VIP版正在内测中");

if (a1 == "4") {
   $("#apply_add5").css("display","none");
   $(".apply_add4").css("display","block");
}

}
/*发布报名页切换结束*/


/*封面图片上传开始*/
function FpicUp(){
  $("#FpicUpDiv2").css("display","block");
  $("#FpicUpDiv1").css("display","none");
  
  $("#apply_up_on").trigger("click");
}


function FpicDel(a1){
  $("#FpicUpDiv4").css("display","block");
  $("#FpicUpDiv3").css("display","none");
  
  url="fpic_up_del.do";
  
  if (a1=="2") url="MJoinpic_up_del.do";
  if (a1=="5") url="weixiao_fpic_up_del.do";
  
  $.post(url, function(txt){tb_remove(),$("#net_re").html(txt);});
}


function FpicTo(a1,a2){
	if (a2!="0" && a2!="1") a2="0";
	$("#picUrl",window.parent.parent.document).val(a1);
	$("#picSite",window.parent.parent.document).val(a2);
}


function JpicTo(a1,a2,a3){
	$("#picUrl"+a2,window.parent.parent.document).val(a1);
	$("#picSite"+a2,window.parent.parent.document).val(a3);
}

function JpicDel(a1,a2){
  $("#FpicUpDiv4").css("display","block");
  $("#FpicUpDiv3").css("display","none");
  
  url="jobpic_up_del.do";
  if (a2=="haibao") url="haibaoPic_up_del.do";
  if (a2=="matchJoin") url="MJoinPic_up_del.do";
  
  $.post(url,{picid:a1},function(txt){tb_remove(),$("#net_re").html(txt);});
}
/*封面图片上传结束*/


/*发布报名开始*/
function apply_add_save() {
	var title=$("#title").val();
	var timeTxt=$("#timeTxt").val();
	var priceTxt=$("#priceTxt").val();
	var info=$("#info").val();
	var fromUser=$("#fromUser").val();
	var fromPhone=$("#fromPhone").val();
	var fromWeixin=$("#fromWeixin").val();
	var fromPwd=$("#fromPwd").val();
	var psite=$("#psite").val();
	var picUrl=$("#picUrl").val();
	var province=$("#province").val();
	var city=$("#city").val();
	var area=$("#area").val();
	var address=$("#address").val();
	
	if (psite != "1" && psite != "2") {
       R("数据异常！");
       return (false);
    }
	
	if (title == "" || title == " " || title == "　") {
       R("请正确输入活动主题");
       return (false);
    }
	
	if (title.length > 30) {
       R("活动主题限制30个字符");
       return (false);
    }
	
	if (timeTxt != "" && (timeTxt == " " || timeTxt == "　")) {
       R("请正确输入活动时间");
       return (false);
    }
	
	if (priceTxt != "" && (priceTxt == " " || priceTxt == "　")) {
       R("请正确输入活动费用");
       return (false);
    }
	
	if (address != "" && (province == "" || city == "") && psite=="2") {
       R("请选择省、市、区");
       return (false);
    }
	
	if (info == "" || info == " " || info == "　") {
       R("请正确输入活动详细");
       return (false);
    }
	
	if (info.length > 100000) {
       R("活动详细限制10万个字符");
       return (false);
    }
	
	if (fromPwd== "" || fromPwd == " " || fromPwd == "　") {
       R("请正确输入密码");
       return (false);
    }
	
	if (fromPwd.length > 16 || fromPwd.length < 6) {
       R("密码长度限制6-16位");
       return (false);
    }
	
	if (checkUser2(fromPwd)==false) return (false);
	
	if ( fromUser== "" || fromUser == " " || fromUser == "　") {
       R("请正确输入姓名");
       return (false);
    }
	
	if (fromUser.length > 15 || fromUser.length < 2) {
       R("姓名长度限制2-15位");
       return (false);
    }
	
	if (fromPhone == "" || fromPhone.length != 11 || isNaN(fromPhone)) {
       R("请正确输入手机");
       return (false);
    }
	
	if (checkPhone(fromPhone)==false) return (false);
	
	if (fromWeixin == "" || fromWeixin.length > 30) {
       R("请正确输入微信或QQ");
       return (false);
    }
	
	$("#apply_add_on2").css("display","block");
	$("#apply_add_on1").css("display","none");
	
	$.post("apply_add_save.do", {title:title,timeTxt:timeTxt,priceTxt:priceTxt,info:info,fromUser:fromUser,fromPwd:fromPwd,psite:psite,picUrl:picUrl,province:province,city:city,area:area,address:address,fromPhone:fromPhone,fromWeixin:fromWeixin},function(txt){tb_remove(),$("#net_re").html(txt);});
}



function apply_add_save_re(a1) {
   $("#apply_add_on2").css("display","none");
   $("#apply_add_on1").css("display","block");
}
/*发布报名结束*/


/*发布比赛开始*/
function match_add_save() {
	var title=$("#title").val();
	var timeTxt=$("#timeTxt").val();
	var priceTxt=$("#priceTxt").val();
	var info=$("#info").val();
	var fromUser=$("#fromUser").val();
	var fromPhone=$("#fromPhone").val();
	var fromWeixin=$("#fromWeixin").val();
//	var fromPwd=$("#fromPwd").val();
	var picUrl=$("#picUrl").val();
	var host=$("#host").val();
	
	if (title == "" || title == " " || title == "　") {
       R("请正确输入比赛主题");
       return (false);
    }
	
	if (title.length > 30) {
       R("比赛主题限制30个字符");
       return (false);
    }
	
	if (timeTxt != "" && (timeTxt == " " || timeTxt == "　")) {
       R("请正确输入比赛时间");
       return (false);
    }
	
	if (priceTxt != "" && (priceTxt == " " || priceTxt == "　")) {
       R("请正确输入比赛费用");
       return (false);
    }
	
	if (host != "" && (host == " " || host == "　")) {
       R("请正确输入比赛主办方");
       return (false);
    }
	
	if (host.length > 50) {
       R("请正确输入比赛主办方");
       return (false);
    }
	
	if (info == "" || info == " " || info == "　") {
       R("请正确输入比赛详细");
       return (false);
    }
	
	if (info.length > 100000) {
       R("比赛详细限制10万个字符");
       return (false);
    }
	
//	if (fromPwd== "" || fromPwd == " " || fromPwd == "　") {
//       R("请正确输入密码");
//       return (false);
//    }
//	
//	if (fromPwd.length > 16 || fromPwd.length < 6) {
//       R("密码长度限制6-16位");
//       return (false);
//    }
//	
//	if (checkUser2(fromPwd)==false) return (false);
	
	if ( fromUser== "" || fromUser == " " || fromUser == "　") {
       R("请正确输入姓名");
       return (false);
    }
	
	if (fromUser.length > 15 || fromUser.length < 2) {
       R("姓名长度限制2-15位");
       return (false);
    }
	
	if (fromPhone == "" || fromPhone.length != 11 || isNaN(fromPhone)) {
       R("请正确输入手机");
       return (false);
    }
	
	if (checkPhone(fromPhone)==false) return (false);
	
	if (fromWeixin == "" || fromWeixin.length > 30) {
       R("请正确输入微信或QQ");
       return (false);
    }
	
	$("#apply_add_on2").css("display","block");
	$("#apply_add_on1").css("display","none");

        $('#voteform').submit();
	
//	$.post("/index.php/vote/saveVote", {title:title,timeTxt:timeTxt,priceTxt:priceTxt,info:info,fromUser:fromUser,fromPwd:fromPwd,picUrl:picUrl,host:host,fromPhone:fromPhone,fromWeixin:fromWeixin},function(txt){tb_remove(),$("#net_re").html(txt);});
}



function match_add_save_re(a1) {
	  $("#apply_add_on2").css("display","none");
	  $("#apply_add_on1").css("display","block");
}

/*发布比赛结束*/

/*比赛内容开始*/
function match_info_con(aid) {
	
	if (aid=="" || isNaN(aid)) {
       R("数据异常！");
       return (false);
    }
	
	$.post("match_info_con.do", {aid:aid},function(txt){tb_remove(),$("#info").html(txt);});
}
/*比赛内容结束*/

/*比赛报名开始*/
function match_Join_save() {
	var username=$("#username").val();
	var phone=$("#phone").val();
	var weixin=$("#weixin").val();
	var kouhao=$("#kouhao").val();
	var beizhu=$("#beizhu").val();	
	var aid=$("#aid").val();
	var netid=$("#netid").val();
	var province=$("#province").val();
	var city=$("#city").val();
	var matmv=$("#matmv").val();
	var wxsite=$("#wxsite").val();
	var picUrl1=$("#fpicUp_k1").val();
	var picUrl2=$("#fpicUp_k2").val();
	var picUrl3=$("#fpicUp_k3").val();
//	var picUrl4=$("#picUrl4").val();
//	var picUrl5=$("#picUrl5").val();
//	var picUrl6=$("#picUrl6").val();
//	var picUrl7=$("#picUrl7").val();
//	var picUrl8=$("#picUrl8").val();
//	var picUrl9=$("#picUrl9").val();
//	var picSite1=$("#picSite1").val();
//	var picSite2=$("#picSite2").val();
//	var picSite3=$("#picSite3").val();
//	var picSite4=$("#picSite4").val();
//	var picSite5=$("#picSite5").val();
//	var picSite6=$("#picSite6").val();
//	var picSite7=$("#picSite7").val();
//	var picSite8=$("#picSite8").val();
//	var picSite9=$("#picSite9").val();

	
	if (username == "" || username.length > 10 || username.length < 2) {
       R("请正确输入真实姓名");
       return (false);
    }
	
	//if (isChn(username)==false) return (false);
	
	if (phone == "" || phone.length != 11 || isNaN(phone)) {
       R("请正确输入手机");
       return (false);
    }
	
	if (checkPhone(phone)==false) return (false);
	
	if (wxsite=="yes"){
	   if (weixin == "" || weixin.length > 30) {
          R("请正确输入微信帐号");
          return (false);
       }
	}
	
	if (province == ""){
	   R("请选择省份");
       return (false);
	}
	
	if (picUrl1 == "" || picUrl1.length > 100) {
       R("请上传参赛图片");
       return (false);
    }
	
	if (matmv != "" && ((matmv.substr(0,19)!="http://v.youku.com/" || matmv.length<30 || matmv.indexOf("/id_")<=0 || matmv.indexOf(".html")<=0) && (matmv.substr(0,22)!="http://www.meipai.com/") && matmv.substr(0,19)!="http://changba.com/")) {
       R("请正确输入“美拍或优酷视频”网址");
       return (false);
    }
	
	if (kouhao != "" && (kouhao==" " || kouhao=="　")) {
       R("请正确输入参赛口号");
       return (false);
    }
	
	if (beizhu != "" && (beizhu==" " || beizhu=="　")) {
       R("请正确输入备注");
       return (false);
    }
	
	$("#apply_add_on2").css("display","block");
	$("#apply_add_on1").css("display","none");
	$("#baomingform").submit();
//	$.post("match_Join_save.do", {username:username,phone:phone,weixin:weixin,province:province,city:city,kouhao:kouhao,beizhu:beizhu,aid:aid,netid:netid,matmv:matmv,wxsite:wxsite,picUrl1:picUrl1,picUrl2:picUrl2,picUrl3:picUrl3,picUrl4:picUrl4,picUrl5:picUrl5,picUrl6:picUrl6,picUrl7:picUrl7,picUrl8:picUrl8,picUrl9:picUrl9,picSite1:picSite1,picSite2:picSite2,picSite3:picSite3,picSite4:picSite4,picSite5:picSite5,picSite6:picSite6,picSite7:picSite7,picSite8:picSite8,picSite9:picSite9},function(txt){tb_remove(),$("#net_re").html(txt);});
}



function match_Join_save_re(a1) {
   if (a1=="no"){
	  $("#apply_add_on2").css("display","none");
	  $("#apply_add_on1").css("display","block");
   }
   
   if (a1=="yes"){
      
   }
}


function matchPic_ping(){
   var cssTest=$("#btn_ping").css("display");
	
   if (cssTest=="none"){
      $("#btn_ping_open").css("display","none");
      $("#btn_ping_txt").css("display","block");
      $("#btn_ping").css("display","block");
   }else{
	  $("#btn_ping_open").css("display","block");
      $("#btn_ping_txt").css("display","none");
      $("#btn_ping").css("display","none");
   }
}



function match_Join_edit_save() {
	var username=$("#username").val();
	var phone=$("#phone").val();
	var weixin=$("#weixin").val();
	var kouhao=$("#kouhao").val();
	var beizhu=$("#beizhu").val();	
	var aid=$("#aid").val();
	var pid=$("#pid").val();
	var netid=$("#netid").val();
	var matmv=$("#matmv").val();
	var wxsite=$("#wxsite").val();
	var picUrl1=$("#picUrl1").val();
	var picUrl2=$("#picUrl2").val();
	var picUrl3=$("#picUrl3").val();
	var picUrl4=$("#picUrl4").val();
	var picUrl5=$("#picUrl5").val();
	var picUrl6=$("#picUrl6").val();
	var picUrl7=$("#picUrl7").val();
	var picUrl8=$("#picUrl8").val();
	var picUrl9=$("#picUrl9").val();
	var picSite1=$("#picSite1").val();
	var picSite2=$("#picSite2").val();
	var picSite3=$("#picSite3").val();
	var picSite4=$("#picSite4").val();
	var picSite5=$("#picSite5").val();
	var picSite6=$("#picSite6").val();
	var picSite7=$("#picSite7").val();
	var picSite8=$("#picSite8").val();
	var picSite9=$("#picSite9").val();

	if (aid=="" || isNaN(aid) || pid=="" || isNaN(pid)) {
       R("数据异常！");
       return (false);
    }
	
	if (netid=="" && isNaN(netid)) {
       R("数据异常！");
       return (false);
    }
	
	if (picUrl1 == "" || picUrl1.length > 100) {
       R("请上传参赛图片");
       return (false);
    }
	
	if (username == "" || username.length > 10 || username.length < 2) {
       R("请正确输入真实姓名");
       return (false);
    }
	
	//if (isChn(username)==false) return (false);
	
	if (phone == "" || phone.length != 11 || isNaN(phone)) {
       R("请正确输入手机");
       return (false);
    }
	
	if (checkPhone(phone)==false) return (false);
	
	if (wxsite=="yes"){
	   if (weixin == "" || weixin.length > 30) {
          R("请正确输入微信帐号");
          return (false);
       }
	}

	//if (matmv != "" && (matmv.substr(0,19)!="http://v.youku.com/" || matmv.length<30 || matmv.indexOf("/id_")<=0 || matmv.indexOf(".html")<=0)) {
       //R("请正确输入“优酷视频”网址");
       //return (false);
    //}
	
	if (kouhao != "" && (kouhao==" " || kouhao=="　")) {
       R("请正确输入参赛口号");
       return (false);
    }
	
	if (beizhu != "" && (beizhu==" " || beizhu=="　")) {
       R("请正确输入备注");
       return (false);
    }
	
	$("#apply_add_on2").css("display","block");
	$("#apply_add_on1").css("display","none");
	
	
	
	$.post("match_Join_edit_save.do", {username:username,phone:phone,weixin:weixin,kouhao:kouhao,beizhu:beizhu,aid:aid,pid:pid,netid:netid,matmv:matmv,wxsite:wxsite,picUrl1:picUrl1,picUrl2:picUrl2,picUrl3:picUrl3,picUrl4:picUrl4,picUrl5:picUrl5,picUrl6:picUrl6,picUrl7:picUrl7,picUrl8:picUrl8,picUrl9:picUrl9,picSite1:picSite1,picSite2:picSite2,picSite3:picSite3,picSite4:picSite4,picSite5:picSite5,picSite6:picSite6,picSite7:picSite7,picSite8:picSite8,picSite9:picSite9},function(txt){tb_remove(),$("#net_re").html(txt);});
}



function match_Join_edit_save_re(a1) {
   if (a1=="no"){
	  $("#apply_add_on2").css("display","none");
	  $("#apply_add_on1").css("display","block");
   }
   
   if (a1=="yes"){
      
   }
}


function match_tp_Nobegin() {
   R("比赛还没有开始，<br>请关注比赛时间。");
}
/*比赛报名结束*/


/*比赛内置图片页开始*/
function PicListAutoHeight(a1) {
var h = $("."+a1).height();

$(".match_pic_info2 ul li").css("height",h+"px");
  
window.onresize = function() {
	            PicListAutoHeight(a1);
			};
}
/*比赛内置图片页结束*/


/*比赛投票页视频开始*/
function match_pic_mv_con() {
	$("#match_pic_mv2").css("display","block");
	$("#match_pic_mv1").css("display","none");
}
/*比赛投票页视频结束*/


/*发布招聘开始*/
function job_add_save() {
	var title=$("#title").val();
	var jobZhiWei=$("#jobZhiWei").val();
	var jobDaiYu=$("#jobDaiYu").val();
	var host=$("#host").val();
	var info=$("#info").val();
	var fromPwd=$("#fromPwd").val();
	var fromUser=$("#fromUser").val();
	var fromPhone=$("#fromPhone").val();
	var fromWeixin=$("#fromWeixin").val();
	var fromPwd=$("#fromPwd").val();
	var psite=$("#psite").val();
	var picUrl=$("#picUrl").val();
	var province=$("#province").val();
	var city=$("#city").val();
	var area=$("#area").val();
	var address=$("#address").val();
	
	if (psite != "1" && psite != "2") {
       R("数据异常！");
       return (false);
    }
	
	if (title == "" || title == " " || title == "　") {
       R("请正确输入活动主题");
       return (false);
    }
	
	if (title.length > 30) {
       R("活动主题限制30个字符");
       return (false);
    }
	
	if (jobZhiWei != "" && (jobZhiWei == " " || jobZhiWei == "　")) {
       R("请正确输入招聘职位");
       return (false);
    }
	
	if (jobDaiYu != "" && (jobDaiYu == " " || jobDaiYu == "　")) {
       R("请正确输入薪金待遇");
       return (false);
    }
	
	if (host != "" && (host == " " || host == "　")) {
       R("请正确输入主办单位");
       return (false);
    }
	
	if (address != "" && (province == "" || city == "") && psite=="2") {
       R("请选择省、市、区");
       return (false);
    }
	
	if (info == "" || info == " " || info == "　") {
       R("请正确输入活动详细");
       return (false);
    }
	
	if (info.length > 100000) {
       R("活动详细限制10万个字符");
       return (false);
    }
	
	if (fromPwd== "" || fromPwd == " " || fromPwd == "　") {
       R("请正确输入密码");
       return (false);
    }
	
	if (fromPwd.length > 16 || fromPwd.length < 6) {
       R("密码长度限制6-16位");
       return (false);
    }
	
	if (checkUser2(fromPwd)==false) return (false);
	
	if ( fromUser== "" || fromUser == " " || fromUser == "　") {
       R("请正确输入姓名");
       return (false);
    }
	
	if (fromUser.length > 15 || fromUser.length < 2) {
       R("姓名长度限制2-15位");
       return (false);
    }
	
	if (fromPhone == "" || fromPhone.length != 11 || isNaN(fromPhone)) {
       R("请正确输入手机");
       return (false);
    }
	
	if (checkPhone(fromPhone)==false) return (false);
	
	if (fromWeixin == "" || fromWeixin.length > 30) {
       R("请正确输入微信或QQ");
       return (false);
    }
	
	if (checkUser2(fromPwd)==false) return (false);
	
	$("#apply_add_on2").css("display","block");
	$("#apply_add_on1").css("display","none");
	
	$.post("job_add_save.do", {title:title,jobZhiWei:jobZhiWei,jobDaiYu:jobDaiYu,host:host,info:info,fromUser:fromUser,fromPwd:fromPwd,fromPhone:fromPhone,fromWeixin:fromWeixin,psite:psite,picUrl:picUrl,province:province,city:city,area:area,address:address},function(txt){tb_remove(),$("#net_re").html(txt);});
}



function job_add_save_re(a1) {
   $("#apply_add_on2").css("display","none");
   $("#apply_add_on1").css("display","block");
}
/*发布招聘结束*/


/*招聘报名开始*/
function job_Join_save() {
	var username=$("#username").val();
	var phone=$("#phone").val();
	var weixin=$("#weixin").val();
	var beizhu=$("#beizhu").val();	
	var aid=$("#aid").val();
	var picUrl1=$("#picUrl1").val();
	var picUrl2=$("#picUrl2").val();
	var picUrl3=$("#picUrl3").val();
	var netid=$("#netid").val();

	if (aid=="" || isNaN(aid)) {
       R("数据异常！");
       return (false);
    }
	
	if (netid=="" && isNaN(netid)) {
       R("数据异常！");
       return (false);
    }
	
	if (username == "" || username.length > 4 || username.length < 2) {
       R("请正确输入真实姓名");
       return (false);
    }
	
	if (isChn(username)==false) return (false);
	
	if (phone == "" || phone.length != 11 || isNaN(phone)) {
       R("请正确输入手机");
       return (false);
    }
	
	if (checkPhone(phone)==false) return (false);
	
	if (weixin == "" || weixin.length > 30) {
       R("请正确输入微信帐号");
       return (false);
    }
	
	if (beizhu != "" && (beizhu==" " || beizhu=="　")) {
       R("请正确输入备注");
       return (false);
    }
	
	$("#apply_add_on2").css("display","block");
	$("#apply_add_on1").css("display","none");
	
	$.post("job_Join_save.do", {username:username,phone:phone,weixin:weixin,beizhu:beizhu,aid:aid,picUrl1:picUrl1,picUrl2:picUrl2,picUrl3:picUrl3,netid:netid},function(txt){tb_remove(),$("#net_re").html(txt);});
}



function job_Join_save_re(a1) {
   if (a1=="no"){
	  $("#apply_add_on2").css("display","none");
	  $("#apply_add_on1").css("display","block");
   }
   
   if (a1=="yes"){
      
   }
}


function jobUserPic(a1) {
   if (a1=="") return (false);
   var pictxt="<img src='up/pic/"+a1+"' />"
   $("#jobUserPic1").html(pictxt);
   $("#jobUserPic").animate({marginLeft:"0%"});
}

function jobUserPicBack() {
   $("#jobUserPic").animate({marginLeft:"100%"});
}
/*招聘报名结束*/


/*发布招募开始*/
function recruit_add_save() {
	var title=$("#title").val();
	var jobZhiWei=$("#jobZhiWei").val();
	var jobDaiYu=$("#jobDaiYu").val();
	var host=$("#host").val();
	var info=$("#info").val();
	var fromPwd=$("#fromPwd").val();
	var fromUser=$("#fromUser").val();
	var fromPhone=$("#fromPhone").val();
	var fromWeixin=$("#fromWeixin").val();
	var psite=$("#psite").val();
	var picUrl=$("#picUrl").val();
	var province=$("#province").val();
	var city=$("#city").val();
	var area=$("#area").val();
	var address=$("#address").val();
	
	if (psite != "1" && psite != "2") {
       R("数据异常！");
       return (false);
    }
	
	if (title == "" || title == " " || title == "　") {
       R("请正确输入活动主题");
       return (false);
    }
	
	if (title.length > 30) {
       R("活动主题限制30个字符");
       return (false);
    }
	
	if (jobZhiWei != "" && (jobZhiWei == " " || jobZhiWei == "　")) {
       R("请正确输入招聘职位");
       return (false);
    }
	
	if (jobDaiYu != "" && (jobDaiYu == " " || jobDaiYu == "　")) {
       R("请正确输入薪金待遇");
       return (false);
    }
	
	if (host != "" && (host == " " || host == "　")) {
       R("请正确输入主办单位");
       return (false);
    }
	
	if (address != "" && (province == "" || city == "") && psite=="2") {
       R("请选择省、市、区");
       return (false);
    }
	
	if (info == "" || info == " " || info == "　") {
       R("请正确输入活动详细");
       return (false);
    }
	
	if (info.length > 100000) {
       R("活动详细限制10万个字符");
       return (false);
    }
	
	if ( fromUser== "" || fromUser == " " || fromUser == "　") {
       R("请正确输入姓名");
       return (false);
    }
	
	if (fromUser.length > 15 || fromUser.length < 2) {
       R("姓名长度限制2-15位");
       return (false);
    }
	
	if (fromPwd.length > 16 || fromPwd.length < 6) {
       R("密码长度限制6-16位");
       return (false);
    }
	
	if (checkUser2(fromPwd)==false) return (false);
	
	if ( fromUser== "" || fromUser == " " || fromUser == "　") {
       R("请正确输入姓名");
       return (false);
    }
	
	if (fromUser.length > 15 || fromUser.length < 2) {
       R("姓名长度限制2-15位");
       return (false);
    }
	
	if (fromPhone == "" || fromPhone.length != 11 || isNaN(fromPhone)) {
       R("请正确输入手机");
       return (false);
    }
	
	if (checkPhone(fromPhone)==false) return (false);
	
	if (fromWeixin == "" || fromWeixin.length > 30) {
       R("请正确输入微信或QQ");
       return (false);
    }

	$("#apply_add_on2").css("display","block");
	$("#apply_add_on1").css("display","none");
	
	$.post("recruit_add_save.do", {title:title,jobZhiWei:jobZhiWei,jobDaiYu:jobDaiYu,host:host,info:info,fromUser:fromUser,fromPwd:fromPwd,psite:psite,picUrl:picUrl,province:province,city:city,area:area,address:address,fromPhone:fromPhone,fromWeixin:fromWeixin},function(txt){tb_remove(),$("#net_re").html(txt);});
}


function recruit_add_save_re(a1) {
   $("#apply_add_on2").css("display","none");
   $("#apply_add_on1").css("display","block");
}
/*发布招募结束*/


/*应招报名开始*/
function recruit_Join_save() {
	var username=$("#username").val();
	var phone=$("#phone").val();
	var weixin=$("#weixin").val();
	var beizhu=$("#beizhu").val();	
	var aid=$("#aid").val();
	var picUrl1=$("#picUrl1").val();
	var picUrl2=$("#picUrl2").val();
	var picUrl3=$("#picUrl3").val();
	var netid=$("#netid").val();

	if (aid=="" || isNaN(aid)) {
       R("数据异常！");
       return (false);
    }
	
	if (netid=="" && isNaN(netid)) {
       R("数据异常！");
       return (false);
    }
	
	if (username == "" || username.length > 4 || username.length < 2) {
       R("请正确输入真实姓名");
       return (false);
    }
	
	if (isChn(username)==false) return (false);
	
	if (phone == "" || phone.length != 11 || isNaN(phone)) {
       R("请正确输入手机");
       return (false);
    }
	
	if (checkPhone(phone)==false) return (false);
	
	if (weixin == "" || weixin.length > 30) {
       R("请正确输入微信帐号");
       return (false);
    }
	
	if (beizhu != "" && (beizhu==" " || beizhu=="　")) {
       R("请正确输入备注");
       return (false);
    }
	
	$("#apply_add_on2").css("display","block");
	$("#apply_add_on1").css("display","none");
	
	$.post("recruit_Join_save.do", {username:username,phone:phone,weixin:weixin,beizhu:beizhu,aid:aid,picUrl1:picUrl1,picUrl2:picUrl2,picUrl3:picUrl3,netid:netid},function(txt){tb_remove(),$("#net_re").html(txt);});
}



function recruit_Join_save_re(a1) {
   if (a1=="no"){
	  $("#apply_add_on2").css("display","none");
	  $("#apply_add_on1").css("display","block");
   }
   
   if (a1=="yes"){
      
   }
}
/*应聘报名结束*/


/*发布文章开始*/
function matchPic_ping_con(aid,tid,pid,netid,psite,uid) {
	
	var pingCss=$("#div_ping_con").css("display");
    
	if (pingCss=="none") {
	
	   if (aid=="" || isNaN(aid) || tid=="" || isNaN(tid) || (netid!="" && isNaN(netid)) || (psite=="mp" && (pid=="" || isNaN(pid))) || (uid!="" && isNaN(uid)) ) {
          R("数据异常！");
          return (false);
       }
	   
	   window.scrollTo(0,408);
	
	   $("#div_ping_con").css("display","block");
	   $("#div_ping_con").html("<div class='ping_load'></div>");

       $.post("article_ping_con.do", {aid:aid,tid:tid,netid:netid,psite:psite,pid:pid,uid:uid},function(txt){tb_remove(),$("#div_ping_con").html(txt);});
	
	}else{
		
	   $("#div_ping_con").css("display","none");
	   $("#div_ping_con").html("");
	   
    }
}


function article_add_save() {
	var title=$("#title").val();
	var timeTxt=$("#timeTxt").val();
	var priceTxt=$("#priceTxt").val();
	var info=$("#info").val();
	var fromUser=$("#fromUser").val();
	var fromPhone=$("#fromPhone").val();
	var fromWeixin=$("#fromWeixin").val();
	var fromPwd=$("#fromPwd").val();
	var psite=$("#psite").val();
	var picUrl=$("#picUrl").val();
	var province=$("#province").val();
	var city=$("#city").val();
	var area=$("#area").val();
	var address=$("#address").val();
	
	if (title == "" || title == " " || title == "　") {
       R("请正确输入文章主题");
       return (false);
    }
	
	if (title.length > 30) {
       R("文章主题限制30个字符");
       return (false);
    }
	
	if (info == "" || info == " " || info == "　") {
       R("请正确输入文章内容");
       return (false);
    }
	
	if (info.length > 150000) {
       R("文章内容限制15万个字符");
       return (false);
    }
	
	if ( fromUser== "" || fromUser == " " || fromUser == "　") {
       R("请正确输入姓名");
       return (false);
    }
	
	if (fromUser.length > 15 || fromUser.length < 2) {
       R("姓名长度限制2-15位");
       return (false);
    }
	
	if (fromPwd== "" || fromPwd == " " || fromPwd == "　") {
       R("请正确输入密码");
       return (false);
    }
	
	if (fromPwd.length > 16 || fromPwd.length < 6) {
       R("密码长度限制6-16位");
       return (false);
    }
	
	if (checkUser2(fromPwd)==false) return (false);
	
	if ( fromUser== "" || fromUser == " " || fromUser == "　") {
       R("请正确输入姓名");
       return (false);
    }
	
	if (fromUser.length > 15 || fromUser.length < 2) {
       R("姓名长度限制2-15位");
       return (false);
    }
	
	if (fromPhone == "" || fromPhone.length != 11 || isNaN(fromPhone)) {
       R("请正确输入手机");
       return (false);
    }
	
	if (checkPhone(fromPhone)==false) return (false);
	
	if (fromWeixin == "" || fromWeixin.length > 30) {
       R("请正确输入微信或QQ");
       return (false);
    }
	
	if (checkUser2(fromPwd)==false) return (false);
	
	$("#apply_add_on2").css("display","block");
	$("#apply_add_on1").css("display","none");
	
	$.post("article_add_save.do", {title:title,info:info,fromUser:fromUser,fromPwd:fromPwd,picUrl:picUrl,fromPhone:fromPhone,fromWeixin:fromWeixin},function(txt){tb_remove(),$("#net_re").html(txt);});
}


function article_add_save_re(a1) {
   $("#apply_add_on2").css("display","none");
   $("#apply_add_on1").css("display","block");
}


function article_ping() {
   $("#btn_ping_open").css("display","none");
   $("#btn_ping_txt").css("display","block");
}


function article_ping_save(psite) {
   var psname=$("#psname").val();
   var pconter=$("#pconter").val();
   var tid=$("#tid").val();
   var aid=$("#aid").val();
   var pid=$("#pid").val();
   var uid=$("#uid").val();
   var netid=$("#netid").val();
   
   if (aid=="" || isNaN(aid) || tid=="" || isNaN(tid)) {
       R("数据异常！");
       return (false);
    }
	
	if ((pid=="" || isNaN(pid)) && psite=="mp") {
       R("数据异常！");
       return (false);
    }
   
   if (netid!="" && isNaN(netid)) {
       R("数据异常！");
       return (false);
    }
	
   if (pconter== "" || pconter == " " || pconter == "　") {
       R("请正确输入评论内容");
       return (false);
   }
   
   if (pconter.length < 4) {
       R("评论内容太短");
       return (false);
   }
	
   if (pconter.length > 300) {
       R("评论长度限制300字符");
       return (false);
   }
	
   $("#ping_on2").css("display","block");
   $("#ping_on1").css("display","none");
	
   $.post("article_ping_save.do", {pconter:pconter,aid:aid,pid:pid,uid:uid,tid:tid,netid:netid,psite:psite},function(txt){tb_remove(),$("#net_re").html(txt);});
}

function article_ping_save_re(a1,a2) {
   var txt1="";	
	
   $("#ping_on1").css("display","block");
   $("#ping_on2").css("display","none");
   
   if (a1=="yes"){
      txt1=$("#btn_ping_new").html();
	  //$("#btn_ping").css("display","block");
	  $("#btn_ping_new").html(a2+txt1);
	  $("#pconter").val("");
	  $("#btn_ping_nocon").css("display","none");
	  R("发送成功！");
   }
}

function article_ping_page(){
   var tid=$("#tid").val();
   var aid=$("#aid").val();
   var page=$("#page").val();
	
   var pid=$("#pid").val();
   var uid=$("#uid").val();
   var psite=$("#psite").val();
   var netid=$("#netid").val();	
	
   if (aid=="" || isNaN(aid) || tid=="" || isNaN(tid) || (netid!="" && isNaN(netid)) || (psite=="mp" && (pid=="" || isNaN(pid))) ) {
       R("数据异常！");
       return (false);
   }
	
   var nextpage=page*1+1;
   var d1="ping_page_"+page;
	
   $(".btn_ping3_1").css("display","none");
   $(".btn_ping_load").css("display","block");
	
   $.post("article_ping_page.do", {page:nextpage,tid:tid,aid:aid,pid:pid,uid:uid,psite:psite,netid:netid},function(txt){tb_remove(),$("#"+d1).html(txt);});
}

function apply_ping_reply(a1){
   var tid=$("#tid").val();
   var aid=$("#aid").val();
   var reinfo=$("#reinfo_"+a1).val();
   var d1="ping4_1_"+a1;
   var b1="ping7_1_"+a1;
   var b2="ping7_2_"+a1;
	
   if (aid=="" || isNaN(aid) || tid=="" || isNaN(tid) || a1=="" || isNaN(a1)) {
       R("数据异常！");
       return (false);
   }
   
   if (reinfo.length > 300) {
       R("回复内容限制300字符");
       return (false);
   }
   
   $("#"+b1).css("display","none");
   $("#"+b2).css("display","block");
   
   $.post("apply_ping_reply.do", {pid:a1,tid:tid,aid:aid,reinfo:reinfo},function(txt){tb_remove(),$("#"+d1).html(txt);});
}
/*发布文章结束*/


/*画册制作开始*/
function haibao_add_save() {
	var title=$("#title").val();
	var info=$("#info").val();
	var picUrl1=$("#picUrl1").val();
	var picUrl2=$("#picUrl2").val();
	var picUrl3=$("#picUrl3").val();
	var picUrl4=$("#picUrl4").val();
	var picUrl5=$("#picUrl5").val();
	var picUrl6=$("#picUrl6").val();
	var picUrl7=$("#picUrl7").val();
	var picUrl8=$("#picUrl8").val();
	var picUrl9=$("#picUrl9").val();
	var picUrl10=$("#picUrl10").val();
	var picUrl11=$("#picUrl11").val();
	var picUrl12=$("#picUrl12").val();
	var picUrl13=$("#picUrl13").val();
	var picUrl14=$("#picUrl14").val();
	var picUrl15=$("#picUrl15").val();
	var picUrl16=$("#picUrl16").val();
	var picUrl17=$("#picUrl17").val();
	var picUrl18=$("#picUrl18").val();
	var picUrl19=$("#picUrl19").val();
	var picUrl20=$("#picUrl20").val();
	
	var picSite1=$("#picSite1").val();
	var picSite2=$("#picSite2").val();
	var picSite3=$("#picSite3").val();
	var picSite4=$("#picSite4").val();
	var picSite5=$("#picSite5").val();
	var picSite6=$("#picSite6").val();
	var picSite7=$("#picSite7").val();
	var picSite8=$("#picSite8").val();
	var picSite9=$("#picSite9").val();
	var picSite10=$("#picSite10").val();
	var picSite11=$("#picSite11").val();
	var picSite12=$("#picSite12").val();
	var picSite13=$("#picSite13").val();
	var picSite14=$("#picSite14").val();
	var picSite15=$("#picSite15").val();
	var picSite16=$("#picSite16").val();
	var picSite17=$("#picSite17").val();
	var picSite18=$("#picSite18").val();
	var picSite19=$("#picSite19").val();
	var picSite20=$("#picSite20").val();
	
	var netUrl=$("#netUrl").val();
	var musicUrl=$("#musicUrl").val();
	var fromUser=$("#fromUser").val();
	var fromPhone=$("#fromPhone").val();
	var fromWeixin=$("#fromWeixin").val();
	var fromPwd=$("#fromPwd").val();
	var tid=$("#tid").val();
	
	if (title == "" || title == " " || title == "　") {
       R("请正确输入海报标题");
       return (false);
    }
	
	if (title.length > 30) {
       R("海报标题限制30个字符");
       return (false);
    }
	
	if (info.length > 120) {
       R("内容简介限制120个字符");
       return (false);
    }
	
	if (picUrl1 == "" || picUrl2 == "" || picUrl3 == "") {
       R("请至少上传三张图片");
       return (false);
    }
	
	if (netUrl.length > 200) {
       R("链接网址限制200个字符");
       return (false);
    }
	
	if (musicUrl != "" && isNaN(musicUrl)) {
       R("数据异常");
       return (false);
    }
	
	if (fromPwd== "" || fromPwd == " " || fromPwd == "　") {
       R("请正确设置密码");
       return (false);
    }
	
	if (fromPwd.length > 16 || fromPwd.length < 6) {
       R("密码长度限制6-16位");
       return (false);
    }
	
	if (checkUser2(fromPwd)==false) return (false);
	
	if (fromUser== "" || fromUser == " " || fromUser == "　") {
       R("请正确输入姓名");
       return (false);
    }
	
	if (fromUser.length > 15 || fromUser.length < 2) {
       R("姓名长度限制2-15位");
       return (false);
    }
	
	if (fromPhone == "" || fromPhone.length != 11 || isNaN(fromPhone)) {
       R("请正确输入手机");
       return (false);
    }
	
	if (checkPhone(fromPhone)==false) return (false);
	
	if (fromWeixin == "" || fromWeixin.length > 30) {
       R("请正确输入微信或QQ");
       return (false);
    }
	
	$("#apply_add_on2").css("display","block");
	$("#apply_add_on1").css("display","none");
	
	$.post("haibao_add_save.do", {title:title,info:info,picUrl1:picUrl1,picUrl2:picUrl2,picUrl3:picUrl3,picUrl4:picUrl4,picUrl5:picUrl5,picUrl6:picUrl6,picUrl7:picUrl7,picUrl8:picUrl8,picUrl9:picUrl9,picUrl10:picUrl10,picUrl11:picUrl11,picUrl12:picUrl12,picUrl13:picUrl13,picUrl14:picUrl14,picUrl15:picUrl15,picUrl16:picUrl16,picUrl17:picUrl17,picUrl18:picUrl18,picUrl19:picUrl19,picUrl20:picUrl20,picSite1:picSite1,picSite2:picSite2,picSite3:picSite3,picSite4:picSite4,picSite5:picSite5,picSite6:picSite6,picSite7:picSite7,picSite8:picSite8,picSite9:picSite9,picSite10:picSite10,picSite11:picSite11,picSite12:picSite12,picSite13:picSite13,picSite14:picSite14,picSite15:picSite15,picSite16:picSite16,picSite17:picSite17,picSite18:picSite18,picSite19:picSite19,picSite20:picSite20,netUrl:netUrl,fromUser:fromUser,fromPwd:fromPwd,tid:tid,musicUrl:musicUrl,fromPhone:fromPhone,fromWeixin:fromWeixin},function(txt){tb_remove(),$("#net_re").html(txt);});
}


function haibao_add_save_re(a1) {
   $("#apply_add_on2").css("display","none");
   $("#apply_add_on1").css("display","block");
}

function haibao_music_open(){
   $("#apply_add6").css("display","block");
   $("#apply_add5").css("display","none");
}

function haibaoSelMusic(a1) {
   if (a1 == "" || isNaN(a1)) {
      R("数据异常");
      return (false);
   }
   
   $(".apply_add6_1").removeClass("apply_add6_2");
   $("#music"+a1).addClass("apply_add6_2");
   
   if (a1=="0") {
	  $("#musicUrl").val("");
   }else{
	  $("#musicUrl").val(a1);
   }
   
   $("#video1").html("<source src='music/"+a1+".mp3' type='audio/mpeg'>");
   mp3Play("stop");
   mp3Play("play");
}
/*画册制作结束*/


/*用户登录开始*/
function user_login() {
	var username=$("#username").val();
	var sfz=$("#sfz").val();
	var prid=$("#prid").val();
	
	if (prid=="" || isNaN(prid)) {
       R("数据异常！");
       return (false);
    }
	
	if (username == "" || username.length > 4 || username.length < 2) {
       R("请正确输入真实姓名");
       return (false);
    }
	
	if (isChn(username)==false) return (false);
	
	
	if (sfz == "" || sfz.length != 11 || isNaN(sfz)) {
       R("请正确输入手机");
       return (false);
    }
	
	if (checkPhone(sfz)==false) return (false);
	
	//$("#BtnOn1").css("display","none");
	//$("#BtnOn2").css("display","inline");
	
	//$.post("go.do", {username:username,sfz:sfz,prid:prid},function(txt){tb_remove(),$("#net_re").html(txt);});
	document.form.submit();   
    return true;	
}


function user_login_re(a1) {
   if (a1=="no"){
	  $("#BtnOn1").css("display","inline");
	  $("#BtnOn2").css("display","none");
   }
}
/*用户登录结束*/


//分享开始
function shareWeb(a1) {
if (a1=="weixin"){
   $(".WeiXinShareShow").css("display","block");
}

if (a1=="weixinShare"){
   $(".WeiXinShareShow2").css("display","block");
}
}


function shareWebClose() {
   $(".WeiXinShareShow").css("display","none");
   $(".WeiXinShareShow2").css("display","none");
}


function shareSu(a1,a2,a3) {
  if (a1=="" || isNaN(a1) || a1=="" || isNaN(a1)) {
       return (false);
  }
  
  $.post("sharesu_save.do", {aid:a1,pid:a2,fsite:a3},function(txt){tb_remove(),$("#net_re").html(txt);});
}
//分享结束


/*相册自动宽度开始*/
function PicListAutoWidth() {
  var w = document.body.clientWidth || window.innerWidth || document.documentElement.offsetWidth;
  var w2 = window.innerWidth;
  //R(w+"-"+w2);
  w = (w - (10*2 + 2 + 7))/2;
  w2 = w - 10;
  $(".photoTxt").css("width",w+"px");
  $(".picCon").css("width",w2+"px");
  
  window.onresize = function() {
				PicListAutoWidth();
			};
}


function PicAutoSet() {
  $("#pageCon").masonry({  
         singleMode: true,  
         itemSelector:".picCon",
		 
         });
}
/*相册自动宽度结束*/



/*抢位宽度开始*/
function QiangWeiAutoWidth() {
  var w = document.body.clientWidth || window.innerWidth || document.documentElement.offsetWidth;
  var w2 = window.innerWidth;

  w2 = (w - (10*2 + 20*4))/5;
  $(".match_pic_daifu3_1").css("width",w2+"px");
  $(".match_pic_daifu3_1").css("height",w2+"px");
  $(".match_pic_daifu3_1").css("margin-top",8+"px")
  
  $(".match_pic_daifu3_2").css("width",w2+18+"px");
  $(".match_pic_daifu3_2").css("height",w2+18+"px");
  $(".match_pic_daifu3_2").css("margin-top",0+"px");
  
  $(".match_pic_daifu3_1_1").css("margin-top",w2-8+"px");
 
  window.onresize = function() {
				QiangWeiAutoWidth();
			};
}
/*抢位宽度结束*/



/*相册MV开始*/
function matchMvOpen(a1,a2) {
  if (a1 != "" && a2=="youku"){
	 mvCon="<iframe height=100% width=100% src='http://player.youku.com/embed/"+a1+"' frameborder=0 allowfullscreen></iframe>"
     $("#matchMv").css("display","block");
	 $("#matchMvClose").animate({marginRight:"0px"});
	 $("#matchMvCon").html(mvCon);
  }
}

function matchMvClose() {
  $("#matchMvCon").html("");
  $("#matchMv").css("display","none");
  $("#matchMvClose").css("margin-right","-50px");
}
/*相册MV结束*/


/*自动宽度开始*/
function autoWidth(a1,a2) {
  var w = document.body.clientWidth || window.innerWidth || document.documentElement.offsetWidth;

  if (a1 != "" && !isNaN(a1)){
      w = w - a1*1;
      $("."+a2).css("width",w+"px");
  }
  
  window.onresize = function() {
				autoWidth(a1,a2);
			};
}
/*自动宽度开始*/


/*投票开始*/
function match_tp(a1,a2){
  var b1="tpsu_"+a1;
  var b2="div_tpsu_"+a1;	
	
  if (a1=="" || isNaN(a1) || a1=="" || isNaN(a1)) {
       R("数据异常！");
       return (false);
  }
  
  url="match_tp_ajax.do";
  
  $("#"+b1).html("+1");
  $("#"+b2).attr("onclick","");
	  
  $.post(url, {aid:a1,tpsu:a2}, function(txt){tb_remove(),$("#"+b1).html(txt);});
}

function match_tp_end(){
  R("本期比赛已经结束，<br>感谢你的支持！");
}


function match_tp_kuang(a1,a2){
	
	if (a1=="" || isNaN(a1) || a2=="" || isNaN(a2)) {
       R("数据异常！");
       return (false);
    }
	
	var display=$('.apply_box2').css('display');
	if(display=='none'){
		showBg();
		$('.apply_box2').css('display','block');
		$.post("match_k_txt.do",{pid:a1,tpsu:a2}, function(txt){tb_remove(),$("#apply_box").html(txt);});
	}else{
		hideBg();
		$('.apply_box2').css('display','none');	
	}
}

function match_tp_check(a1,a2){
  var b1="tpsu_"+a1;
  var b2="div_tpsu_"+a1;
  
  if (a1=="" || isNaN(a1) || a2=="" || isNaN(a2)) {
       R("数据异常！");
       return (false);
  }
  
  $("#"+b1).html("+1");
  
  url="match_tp_ajax.do";
	  
  $.post(url, {aid:a1,tpsu:a2}, function(txt){tb_remove(),$("#"+b1).html(txt);});
}

function match_tp_check_re(){
   hideBg();
   $(".apply_box2").css("display","none");
   $("#apply_box").html("<div class='apply_box3_0'></div>");
}


function match_tp_check2(a1,a2){
  var b1="tpsu_"+a1;
  var b2="div_tpsu_"+a1;
  var matchCheckSu=$("#matchCheckSu").val();
  
  if (matchCheckSu=="" || isNaN(matchCheckSu) || matchCheckSu.length!=4) {
       R("请输入验证码！");
       return (false);
  }
	
  if (a1=="" || isNaN(a1) || a1=="" || isNaN(a1)) {
       R("数据异常！");
       return (false);
  }

  hideBg();
  $('.apply_box2').css('display','none');	
  $("#tpcheckimg").html("");
  $("#matchCheckSu").val("");
  
  $("#"+b1).html("+1");
  
  url="match_tp_ajax.do";
	  
  $.post(url, {aid:a1,tpsu:a2,matchCheckSu:matchCheckSu}, function(txt){tb_remove(),$("#"+b1).html(txt);});
}


function match_user_search(){
//  var aid=$("#aid").val();
  var search_text=$("#search_text").val();
	
//  if (aid=="" || isNaN(aid)) {
//       R("数据异常！");
//       return (false);
//  }
  
  if (search_text=="" || search_text.length<2 || search_text.length>15) {
       R("请正常输入参赛人！");
       return (false);
  }
  
  $("#match_search_con").html("<div class='match_search_con_loading'></div>");
  $('#searchform').submit();
//  url="match_user_search.do";
//	  
//  $.post(url, {aid:aid,search_text:search_text}, function(txt){tb_remove(),$("#match_search_con").html(txt);});
}

/*投票结束*/



/*众筹开始*/
function raise_pay(){
  var aid=$("#aid").val();
  var gid=$("#gid").val();
  var zname=$("#zname").val();
  var phone=$("#phone").val();
  var province=$("#province").val();
  var city=$("#city").val();
  var area=$("#area").val();
  var address=$("#address").val();
	
  if (aid=="" || isNaN(aid) || gid=="" || isNaN(gid)) {
       R("数据异常！");
       return (false);
  }
  
  if (zname=="" || zname.length < 2) {
	 R("请输入收货人姓名");
	 return (false);
  }
  
  if (isChn(zname)==false) return (false);
  
  if (phone=="" || phone.length!=11) {
	 R("请输入手机号码");
	 return (false);
  }
  
  if (checkPhone(phone)==false) return (false);
  
  if (province=="") {
	 R("请选择省、市、区");
	 return (false);
  }
  
  if (address=="" || address.length<5) {
	 R("请输入详细地址");
	 return (false);
  }
  
  $(".raise_con1_7_1").css("display","none");
  $(".raise_con1_7_2").css("display","block");
  
  url="raise-pay.do";
  $.post(url, {aid:aid,gid:gid,zname:zname,phone:phone,province:province,city:city,area:area,address:address}, function(txt){tb_remove(),$("#net_re").html(txt);});
}

function raise_pay_re(){
  $(".raise_con1_7_2").css("display","none");
  $(".raise_con1_7_1").css("display","block");
}
/*众筹结束*/


/*众筹开始*/
function daiFu_link_tab(aid,pid,sid){
  if (aid=="" || isNaN(aid) || pid=="" || isNaN(pid)) {
     R("数据异常！");
     return (false);
  }
  
  if (sid!="1" && sid!="2"){
     R("数据异常！");
     return (false);
  }
  
  $("#daiFu_con4_1_1").removeClass("daiFu_con_on");
  $("#daiFu_con4_1_2").removeClass("daiFu_con_on");
  $("#daiFu_con4_1_"+sid).addClass("daiFu_con_on");
  
  $.post("daiFu_link_tab.do", {aid:aid,pid:pid,sid:sid}, function(txt){tb_remove(),$("#daiFu_con4_0").html(txt);}); 
}
/*众筹结束*/



/*代付开始*/
function daifu_pay(){
  var aid=$("#aid").val();
  var did=$("#did").val();
  var pid=$("#pid").val();
  var pay_price=$("#pay_price").val();
  var zname=$("#zname").val();
  var phone=$("#phone").val();
	
  if (aid=="" || isNaN(aid) || did=="" || isNaN(did) || pid=="" || isNaN(pid) || pay_price=="" || isNaN(pay_price)) {
       R("数据异常！");
       return (false);
  }
  
  if (zname=="" || zname.length < 2) {
	 R("请输入收货人姓名");
	 return (false);
  }
  
  if (isChn(zname)==false) return (false);
  
  if (phone=="" || phone.length!=11) {
	 R("请输入手机号码");
	 return (false);
  }
  
  if (checkPhone(phone)==false) return (false);
  
  $(".raise_con1_7_1").css("display","none");
  $(".raise_con1_7_2").css("display","block");
  
  url="daiFu-pay.do";
  $.post(url, {aid:aid,did:did,pid:pid,zname:zname,phone:phone,pay_price:pay_price}, function(txt){tb_remove(),$("#net_re").html(txt);});
}

function daifu_pay_re(){
  $(".raise_con1_7_2").css("display","none");
  $(".raise_con1_7_1").css("display","block");
}
/*代付结束*/



/*海布发布开始*/
function haibao_save() {
	var title=$("#title").val();
	var timeTxt=$("#timeTxt").val();
	var priceTxt=$("#priceTxt").val();
	var info=$("#info").val();
	var fromUser=$("#fromUser").val();
	var fromPwd=$("#fromPwd").val();
	var picUrl=$("#picUrl").val();
	var host=$("#host").val();
	
	if (title == "" || title == " " || title == "　") {
       R("请正确输入比赛主题");
       return (false);
    }
	
	if (title.length > 30) {
       R("比赛主题限制30个字符");
       return (false);
    }
	
	if (timeTxt != "" && (timeTxt == " " || timeTxt == "　")) {
       R("请正确输入比赛时间");
       return (false);
    }
	
	if (priceTxt != "" && (priceTxt == " " || priceTxt == "　")) {
       R("请正确输入比赛费用");
       return (false);
    }
	
	if (host != "" && (host == " " || host == "　")) {
       R("请正确输入比赛主办方");
       return (false);
    }
	
	if (host.length > 50) {
       R("请正确输入比赛主办方");
       return (false);
    }
	
	if (info == "" || info == " " || info == "　") {
       R("请正确输入比赛详细");
       return (false);
    }
	
	if (info.length > 100000) {
       R("比赛详细限制10万个字符");
       return (false);
    }
	
	if ( fromUser== "" || fromUser == " " || fromUser == "　") {
       R("请正确输入姓名");
       return (false);
    }
	
	if (fromUser.length > 15 || fromUser.length < 2) {
       R("姓名长度限制2-15位");
       return (false);
    }
	
	if (fromPwd== "" || fromPwd == " " || fromPwd == "　") {
       R("请正确输入密码");
       return (false);
    }
	
	if (fromPwd.length > 16 || fromPwd.length < 6) {
       R("密码长度限制6-16位");
       return (false);
    }
	
	if (checkUser2(fromPwd)==false) return (false);
	
	$("#apply_add_on2").css("display","block");
	$("#apply_add_on1").css("display","none");
	
	$.post("match_add_save.do", {title:title,timeTxt:timeTxt,priceTxt:priceTxt,info:info,fromUser:fromUser,fromPwd:fromPwd,picUrl:picUrl,host:host},function(txt){tb_remove(),$("#net_re").html(txt);});
}



function haibao_add_save_re(a1) {
	  $("#apply_add_on2").css("display","none");
	  $("#apply_add_on1").css("display","block");
}


function haibao_pic_add(a1) {
	  $("#apply_add_hb"+a1).css("display","none");
	  $("#apply_add_piclist"+a1).css("display","block");	
}
/*海布发布结束*/


/*点击赋值开始*/
function QRonInput(a1){
   var v1=$("#"+a1).val();
   var v2,inpTxt;
   
   if (a1 != ""){
	  if (a1=="search_text"){
	     inpTxt="输入“活动关键字”或“发起人姓名”";
		 if (v1==inpTxt) $("#"+a1).val("");
	  }
	  
	  $("#"+a1).blur(function() {
		   v2=$("#"+a1).val();
           if (v2=="") $("#"+a1).val(inpTxt);
      })
   }
}
/*点击赋值结束*/

/*改变字体颜色开始*/
function selFontColor(){
   $(".apply_add4").addClass("apply_add4_2");
}
/*改变字体颜色结束*/

/*播放MP3开始*/
function mp3Play(a1) {
if (a1!="play" && a1!="stop") return false;

if (a1=="stop") {
	document.getElementById('video1').load();
	}

if (a1=="play") {
	document.getElementById('video1').play();
	}
}
/*播放MP3结束*/

/*微信授权开始*/
function weixinapi(fromurl) {
  var neturl="http://m.17ll.com";
  if (fromurl=="" || fromurl.length<10) fromurl=window.location.href;
  top.location.href=neturl+"/apply/wxapi/?fromurl="+fromurl;
}
/*微信授权结束*/

/*游戏排行榜开始*/
function gameph_list_con(){
	var gid=$("#gid").val();
	
	if (gid=="" || isNaN(gid)) {
       alert("数据异常！");
       return (false);
    }
	
	var d1="gamephLi";
	
	$("#gameph").css("display","block");
	$("#gameph").animate({marginLeft:"0%"});
	
	$.post("../gameph_list_con.do", {gid:gid},function(txt){tb_remove(),$("#"+d1).html(txt);});
}

function gameph_list_close(){
    $("#gameph").animate({marginLeft:"100%"},function(){
                     $(this).css("display","none");
				 });
}

function gameph_list_page(){
	var gid=$("#gid").val();
	var gid_now=$("#gid_now").val();
	var page=$("#page").val();
	var d1="gameph_more_"+page;
	
	if (gid=="" || isNaN(gid) || page=="" || isNaN(page) || (gid_now!="" && isNaN(gid_now))) {
       alert("数据异常！");
       return (false);
    }
	
	var nextpage=page*1+1;
	var b1="gameph_load1_"+page;
	var b2="gameph_load2_"+page;
	
	$("#"+b2).css("display","block");
	$("#"+b1).css("display","none");
	
	$.post("gameph_list_page.do", {page:nextpage,gid:gid,gid_now:gid_now},function(txt){tb_remove(),$("#"+d1).html(txt);});
}
/*游戏排行榜结束*/


/*游戏排行榜开始*/
function userRegTo(){
    top.location.href='http://m.17ll.com/apply/wxapi/?fromurl='+window.location.href;
}
/*游戏排行榜结束*/


/*游戏排行榜开始*/
function qcodeSite(a1){
  var w = $(window).width();
  var v1;
  v1=a1;
  
  w=w*1;
  if (v1=="") v1=window.location.href;

  if (w > 420) {
	 $(".qcode").css("display","block");
     $("#qcode1").html("<img src='http://www.17ll.com/qrcode/pic.php?url="+v1+"' />");
  }else{
     $(".qcode").css("display","none");
  }
  
  if (a1!="match"){
     window.onresize = function() {
	            qcodeSite(a1);
			};
  }
}
/*游戏排行榜结束*/
