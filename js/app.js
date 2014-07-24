$(function(){
	document.addEventListener('deviceready', function(){
		navigator.splashscreen.hide();
	}, false);
	wawapi.key = "408271ba8a705f930f09a930e1e6d7e6add2cd71";
	wawapi.secret = "bb868f16eb82823946924036aef1fe10";
	if(localStorage.getItem("user")){
		hideLogin(JSON.parse(localStorage.getItem("user")),false);
	}
	$('#login').submit(function(e){
		e.preventDefault();
		var that = $(this);
		var username = that.find('input[name=username]');
		username.blur();
		username = username.val();
		var password = that.find('input[name=password]');
		password.blur();
		password = password.val();
		wawapi.post("/users/token",{"username":username,"password":password},function(data){
			if(data.error){
				alert(data.message);
			}else{
				user.token = data.token;
				wawapi.token = data.token;
				wawapi.get("/users/data",function(data){
					if(data.error){
						alert(data.message);
					}else{
						var datas = data.data.user;
						datas.token = wawapi.token;
						hideLogin(datas,true);
					}
				});
			}
		});
	});
});	
function hideLogin(data,save){
	user = data;
	console.log(data);
	if(save){
		localStorage.setItem("user",JSON.stringify(data));
	}else{
		wawapi.token = user.token;
	}
	$('#login').fadeOut();
	$('.nav').find('.avatar').attr("src","http://src.whereandwhere.com"+user.avatar);
	$('.author').fadeOut();
	$('.nav').fadeIn();
	$('.view').fadeIn();
	changePanel("profile");
	listenNav($('.nav'));
}
function listenNav(elem){
	elem.find('a').each(function(){
		var that = $(this);
		var page = that.attr("href");
		that.click(function(e){
			e.preventDefault();
			$('a.active').removeClass("active");
			changePanel(page);
			that.addClass("active");
		});
	});
}
function changePanel(page){
	$.ajax({
		url : "pages/"+page+".html",
		cache : false,
		success : function(data){
			$('.view').fadeOut("fast",function(){
				$(this).empty().append(data).fadeIn("fast");
			});
		},
		error : function(xhr,ts,et){
			alert(ts);
		}
	});
}
var user = {
	token : null
}
var wawapi = {

	root : "http://mobile.whereandwhere.com/proxy.php",
	key : null,
	secret : null,
	token : null,

	call : function(method,url,body,callback){
		$('.name').hide();
		$('.load').show();
		$('.loader').show();
		if(body != null && wawapi.token != null){
			$.post(wawapi.root,{"key":wawapi.key,"secret":wawapi.secret,"method":method,"url":url,"data":JSON.stringify(body),"token":wawapi.token},function(data){
				$('.load').hide();
				$('.loader').hide();
				$('.name').show();	
				callback(data);
			},"json");
		}else if(wawapi.token != null){
			$.post(wawapi.root,{"key":wawapi.key,"secret":wawapi.secret,"method":method,"url":url,"token":wawapi.token},function(data){
				$('.load').hide();
				$('.loader').hide();
				$('.name').show();	
				callback(data);
			},"json");
		}else if(body != null){
			$.post(wawapi.root,{"key":wawapi.key,"secret":wawapi.secret,"method":method,"url":url,"data":JSON.stringify(body)},function(data){
				$('.load').hide();
				$('.loader').hide();
				$('.name').show();
				callback(data);
			},"json");
		}else{
			$.post(wawapi.root,{"key":wawapi.key,"secret":wawapi.secret,"method":method,"url":url},function(data){
				$('.load').hide();
				$('.loader').hide();
				$('.name').show();
				callback(data);
			},"json");
		}
	},

	get : function(url,callback){
		return wawapi.call("GET",url,null,callback);
	},

	post : function(url,body,callback){
		return wawapi.call("POST",url,body,callback);
	},

	put : function(url,body,callback){
		return wawapi.call("PUT",url,body,callback);
	},

	delete : function(url,callback){
		return wawapi.call("DELETE",url,null,callback);
	}

}