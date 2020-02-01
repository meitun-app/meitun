(function ($) {
	"use strict";
    //$.apiUrl = "http://47.107.189.48:8091/star";
	//$.apiUrl = "http://appapi.meitun.ai";

	 //$.apiUrl = "http://119.3.132.49:21002/star";
	 $.apiUrl = "http://119.3.132.49:30001/star";
	// $.apiUrl = "http://192.168.100.113:8089/star"
	//$.apiUrl ="http://192.168.100.101:8080/star"
    // /api/userCoinAddr/getUserCoinAddr
	$.ajaxSetup({
        contentType: "application/json; charset=utf-8",
		beforeSend: function (request) {
            var token = $.getID();
			request.setRequestHeader("X-StarNode-Token",token);
		}
    });

	/**
	 * 检查session
	 * **/
	$.checkSession = function () {
		var sid = $.getID();
		var url = window.location.href;
		if (!sid) window.location.href = "../LogInTo/LogInTo.html";
		//if (!sid) window.location.href = "/index.html";
	}
	/**
	 * errCode处理
	 * **/
	$.ylbError = function (code,msg) {
		
		if (code == 401) {
			//登陆
			$.clearID();
			var url = window.location.href;
			//window.location.href = "login.html?url=" + url;
            window.location.href  = "../LogInTo/LogInTo.html";
		} else if (code === 2001) {
			$.ylbAlert("服务器开小差了,请稍后重试...");
		} else {
			$.ylbAlert(msg);
		}
	};
	
	/**
	 * Ajax结果处理
	 * **/
	$.ylbAjaxHandler = function (data, succ, fail) {
		
		if (typeof data == 'string') {
                data = JSON.parse(data);
		}
		
		if (data.errno==0) {
			succ();
		} else if(data.errno==201){//支付密码错误
			$(".surface-ipt input").each(function () {  //将有值的当前input 后面的所有input清空
				$(this).val("");				
			})
			$.ylbError(data.errno,data.errmsg);
			if (fail) fail();
		}
		//  else if(data.errno==202){//未设置密码
		// 	
		// 	// $.ylbError(data.errno,data.errmsg);
		// 	// setTimeout(function() {
		// 	// 	window.location.href="../LogInTo/ForgotPassword.html?t=2"
		// 	// }, 200);
		// } 
		else {
            
			$.ylbError(data.errno,data.errmsg);
			if (fail) fail();
		}
	};
	
	/**
	 * 弹窗提示
	 * **/
	$.ylbAlert = function (msg, delay) {
		//alert(msg);
        mui.toast(msg);
		// pop_tips({
		// 					
		// 	type: '2',
		// 					
		// 	msg: msg
		// 					
		// });
		return;

	};
	/**
	 * 获取url参数
	 * **/
	$.urlParam = function (name, url) {
        if (!url) {
            url = window.location.href;
        }
        try {
            var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(url);
            if (!results) {
                return "";
            }
            return results[1] || "";
        } catch (e) {
            return "";
        }
    };

    $.isWeiXin = function () {
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            return true;
        } else {
            return false;
        }
    }

	/**
	 * 获取url中跳转url
	 * **/
	$.regexUrl = function (url) {
        //正则出url
		if (!url) url = window.location.href;
        var strs = new Array(); //定义一数组
        strs = url.split("?url="); //字符分割
        if (strs[1]) {
            return strs[1];
        } else {
            strs = url.split("&url=");
            return strs[1];
        }
    };
	/**
	 * LocalStorage处理
	 * **/
	$.localStorageHandler = function (method, key, val) {
		switch (method) {
			case "set":
				localStorage.setItem(key, val);
				break;
			case "get":
				return localStorage.getItem(key);
			//break;
			case "clear":
				localStorage.removeItem(key);
				break;
			case "clearall":
				localStorage.clear();
				break;
		}
	};
	/**
	 * 存储sessionID
	 * **/
	$.setID = function (val) {
		localStorage.setItem("X-StarNode-Token", val);
	}
	$.getID = function () {
		return localStorage.getItem("X-StarNode-Token");
	}
	$.clearID = function () {
		localStorage.removeItem("X-StarNode-Token");
	}
	$.setRole = function (val) {
		localStorage.setItem("role", val);
	}
	$.getRole = function () {
		return localStorage.getItem("role");
	}
	$.setName = function (val) {
		localStorage.setItem("name", val);
	}
	$.getName = function () {
		return localStorage.getItem("name");
	}
	$.setUserID = function (val) {
		localStorage.setItem("userID", val);
	}
	$.getUserID = function () {
		return localStorage.getItem("userID");
	}
	$.clearRole = function () {
		localStorage.removeItem("role");
	}
	/**
	 * json和string互换
	 * **/
	$.parseHandler = function (method, val) {
		switch (method) {
			case "js":
				return JSON.stringify(val);
			case "sj":
				return $.parseJSON(val);
		}
	};

	/**
	 * 检测是否是手机号码
	 * **/
	$.checkIsMobileNumber = function (number) {
        var reg = /^1\d{10}$/;
        return reg.test(number);
    }
	
	/**
	 * 检测数字不能包含小数点
	 * **/
	$.checkNumberNoPoit = function (number) {
	    var reg = /^1\d{10}$/;
	    return reg.test(number);
	}
	
	/**
	 * 检测数字能包含小数点
	 * **/
	$.checkNumber = function (number,len) {
	    var reg = /^[1-9]\d{len-1}$/;
	    return reg.test(number);
	}
	

    $.initWxConfig = function() {
        $.when($.ajax({
            url:$.apiUrl+"/api/v2/wx/shareConfig?url="+window.location.href,
            type: 'GET',
            async: false
        })).done(function (d) {
            $.ylbAjaxHandler(d, function () {

                var shareData = d.data.shareData;
                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: d.data.appId, // 必填，公众号的唯一标识
                    timestamp: d.data.timestamp, // 必填，生成签名的时间戳
                    nonceStr: d.data.nonceStr, // 必填，生成签名的随机串
                    signature: d.data.signature,// 必填，签名
                    jsApiList: [
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage',
						'updateAppMessageShareData',
                        'updateTimelineShareData'
                    ] // 必填，需要使用的JS接口列表
                });

                wx.ready(function () {

                    if (wx.updateAppMessageShareData) {
                        wx.updateAppMessageShareData({
                            title: shareData.title, // 分享标题
                            desc: shareData.desc, // 分享描述
                            link: shareData.link, // 分享链接
                            imgUrl: shareData.imgUrl, // 分享图标
                            success: function () {
                                // 设置成功
                            }
                        });
                    } else {
                        wx.onMenuShareAppMessage({
                            title: shareData.title, // 分享标题
                                desc: shareData.desc, // 分享描述
                                link: shareData.link, // 分享链接
                                imgUrl: shareData.imgUrl, // 分享图标
                                type: '', // 分享类型,music、video或link，不填默认为link
                                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                                success: function () {
                                    // 用户确认分享后执行的回调函数

                                }
                        });
                    }
                    //分享给朋友圈
                    if (wx.updateTimelineShareData) {
                        wx.updateTimelineShareData({
                            title: shareData.title, // 分享标题
                            link: shareData.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                            imgUrl: shareData.imgUrl,  // 分享图标
                            success: function () {
                                // 设置成功
                            }
                        });
                    } else {
                        wx.onMenuShareTimeline({

                            title: shareData.title, // 分享标题
                            desc: shareData.desc,
                            link: shareData.link, // 分享链接
                            imgUrl: shareData.imgUrl, // 分享图标
                            success: function () {
                                // 用户确认分享后执行的回调函数

                            }

                        });
                    }


                    // wx.onMenuShareTimeline({
                    //     title: shareData.title, // 分享标题
                    //     desc: shareData.desc,
                    //     link: shareData.link, // 分享链接
                    //     imgUrl: shareData.imgUrl, // 分享图标
                    //     success: function () {
                    //         // 用户确认分享后执行的回调函数
                    //
                    //     }
                    // });
                    //
                    // wx.onMenuShareAppMessage({
                    //     title: shareData.title, // 分享标题
                    //     desc: shareData.desc, // 分享描述
                    //     link: shareData.link, // 分享链接
                    //     imgUrl: shareData.imgUrl, // 分享图标
                    //     type: '', // 分享类型,music、video或link，不填默认为link
                    //     dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    //     success: function () {
                    //         // 用户确认分享后执行的回调函数
                    //
                    //     }
                    // });


                });
            });
        });
    }

})(jQuery);
(function () {

})();