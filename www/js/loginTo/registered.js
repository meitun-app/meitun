(function() {
	var register = {
		mobile:'',
		code:'',
		password:'',
		referrerCode:'',
		time:60,
		sending:false,
		timeObj:null
	};
	//移动端的文本框获取焦点时导致fixed或absolute定位的按钮被手机键盘顶上去的问题
	//https://blog.csdn.net/think_of_/article/details/82895400
	var win_h = $(window).height();//关键代码
		window.addEventListener('resize', function () {
			if($(window).height() < win_h){
				$('.bottom_fixd').hide();
			}else{
				$('.bottom_fixd').show();
			}
		});
	//
	var m = {
		init: function() {
			m.buildVue();
		},
		buildVue: function() {
			register = new Vue({
				el: "#register-main",
				data: register,
				methods: {
					inputMaxLenth:function(){
						
						if(register.mobile.length > 11)
						register.mobile=register.mobile.slice(0,11);
					},
					cleanTime:function(){
						 clearInterval(register.timeObj);
						register.timeObj = null;
						register.time = 60;
					},
					sendCode:function(){
						var that = this;
						if(!register.mobile){
						
							mui.toast("请输入手机号");
							return ;
						}
						if(register.sending){
							return ;
						}
						if(register.time != 60){
							return;
						}
						register.sending = true;
						var param = {mobile:register.mobile,type:1};
						$.when($.ajax({
							url: $.apiUrl + '/api/common/getIdentifyingCode',
							type: 'POST',
							data:JSON.stringify(param)
						})).done(function(d) {
							register.sending = false;
							
							$.ylbAjaxHandler(d, function () {
							
							   register.timeObj = setInterval(() => {
							     if (register.time === 0) {
									that.cleanTime();
							     } else {
									register.time -=1;
							     }
							   }, 1000)
							});
						});
					},
					registerFun: function() {
						if(!register.mobile){
							mui.toast("请输入手机号码");
							return;
						}
						if(!register.code){
							mui.toast("请输入验证码");
							return;
						}
						if(!register.password){
							mui.toast("请输入密码");
							return;
						}
						// if(register.password != register.confirmPwd){
						// 	mui.toast("两次密码不一致");
						// 	return;
						// }
						let param = {"mobile":register.mobile,"password":register.password,"code":register.code,"referrerCode":register.referrerCode};
						$.when($.ajax({
							url: $.apiUrl + '/api/register/register',
							type: 'POST',
							data:JSON.stringify(param)
						})).done(function(d) {
							
							$.ylbAjaxHandler(d, function() {
								mui.toast("注册成功");
								window.location.href = "LogInTo.html";
							});
						});
					},
					goBack:function(){
						
						window.location.href="LogInTo.html";
						
					}

				}
			});
		}
	};
	m.init();
})();
