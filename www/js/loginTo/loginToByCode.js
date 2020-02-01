(function() {
	var login = {
		mobile:'',
		code:'',
		time:60,
		sending:false,
		timeObj:null
	};
	var m = {
		init: function() {
			m.buildVue();
		},
		buildVue: function() {
			login = new Vue({
				el: "#loginBycode-main",
				data: login,
				methods: {
					inputMaxLenth:function(){
						
						if(login.mobile.length > 11)
						login.mobile=login.mobile.slice(0,11);
					},
					clean: function(){
						$("#error").text("");
					},
					cleanTime:function(){
						 clearInterval(login.timeObj);
						login.timeObj = null;
						login.time = 60;
					},
					sendCode:function(){
						var that = this;
						if(!login.mobile){
							$("#error").text("请输入手机号");
							return ;
						}
						if(login.sending){
							return ;
						}
						if(login.time != 60){
							return;
						}
						login.sending = true;
						var param = {mobile:login.mobile,type:3};
						$.when($.ajax({
							url: $.apiUrl + '/api/common/getIdentifyingCode',
							type: 'POST',
							data:JSON.stringify(param)
						})).done(function(d) {
							login.sending = false;
							if(typeof d == 'string'){
								d = JSON.parse(d);
							}
							if(d.errno==0){
								login.timeObj = setInterval(() => {
								  if (login.time === 0) {
									that.cleanTime();
								  } else {
									login.time -=1;
								  }
								}, 1000)
							}else{
								$("#error").text(d.errmsg);
							}
						});
					},
					loginFun: function() {
						let param = {"mobile":login.mobile,"code":login.code};
						$.when($.ajax({
							url: $.apiUrl + '/api/auth/loginByCode',
							type: 'POST',
							data:JSON.stringify(param)
						})).done(function(d) {
							
							if(typeof d == 'string'){
								d = JSON.parse(d);
							}
							if(d.errno==0){
								$.setID(d.data.token);
								$.localStorageHandler("set","userInfo",JSON.stringify(d.data.userVo));
								window.location.href="../Activity/Home.html";
							}else{
								$("#error").text(d.errmsg);
							}
						});
					}

				}
			});
		}
	};
	m.init();
})();
