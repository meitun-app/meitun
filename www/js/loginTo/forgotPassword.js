(function() {
	var forgot = {
			t:$.urlParam("t")|| 0,
			url:$.urlParam("url")|| '',
			mobile:'',
			code:'',
			password:'',
			confirmPwd:'',
			time:60,
			sending:false,
			timeObj:null
	};
	var m = {
		init: function() {
			m.buildVue();
		},
		buildVue: function() {
			forgot = new Vue({
				el: "#forgotPassword-main",
				data: forgot,
				methods: {
					inputMaxLenth:function(){
						
						if(forgot.mobile.length > 11)
						forgot.mobile=forgot.mobile.slice(0,11);
					},
					cleanTime:function(){
						clearInterval(forgot.timeObj);
						forgot.timeObj = null;
						forgot.time = 60;
					},
					sendCode:function(){
						var that = this;
						var userPhone = JSON.parse(localStorage.getItem('userInfo')).mobile
						console.log(userPhone)
						if(!(/^1[3456789]\d{9}$/.test(forgot.mobile))){
						
							mui.toast("请输入正确手机号");
							return ;
						}
						if(userPhone!==forgot.mobile){
							mui.toast("请输入注册时手机号");
							return ;
						}
						if(forgot.sending){
							return ;
						}
						if(forgot.time != 60){
							return;
						}
						forgot.sending = true;
						var param = {mobile:forgot.mobile,type:2};
						$.when($.ajax({
							url: $.apiUrl + '/api/common/getIdentifyingCode',
							type: 'POST',
							data:JSON.stringify(param)
						})).done(function(d) {
							forgot.sending = false;
							
							$.ylbAjaxHandler(d, function () {
							
							   forgot.timeObj = setInterval(() => {
							     if (forgot.time === 0) {
									that.cleanTime();
							     } else {
									forgot.time -=1;
							     }
							   }, 1000)
							});
						});
					},
					forgotFun: function() {
						if(!forgot.mobile){
							mui.toast("请输入手机号码");
							return;
						}
						if(!forgot.code){
							mui.toast("请输入验证码");
							return;
						}
						if(!forgot.password){
							mui.toast("请输入密码");
							return;
						}
						// const length = forgot.password.length
						if(!/^\d{6}$/.test(forgot.password)){
							mui.toast("密码必须为6位数字");
							return;
						}
						if(forgot.password != forgot.confirmPwd){
							mui.toast("两次密码不一致");
							return;
						}
						
						let param = {"mobile":forgot.mobile,"password":forgot.password,"confirmPassword":forgot.confirmPwd,"code":forgot.code};
						let url = $.apiUrl + '/api/user/forget/loginpwd';
						if(forgot.t == 2){
							url = $.apiUrl + '/api/user/modify/payPwd';
						}
						$.when($.ajax({
							url: url,
							type: 'POST',
							data:JSON.stringify(param)
						})).done(function(d) {
							
							$.ylbAjaxHandler(d, function() {
								//mui.toast("找回密码成功");
								if(forgot.t !=2){
										window.location.href = "LogInTo.html";
								}else{
									mui.toast(d.errmsg);
									if(forgot.t ==2){
										setTimeout(function(){
											history.back(-1);
										},200);
									}
								}
								
							});
						});
					}

				}
			});
		}
	};
	m.init();
})();
