(function() {
	var login = {
		mobile:'',
		password:''
	};
	var m = {
		init: function() {
			m.buildVue();
		},
		buildVue: function() {
			login = new Vue({
				el: "#login-main",
				data: login,
				methods: {
					inputMaxLenth:function(){
						
					if(login.mobile.length > 11)
						login.mobile=login.mobile.slice(0,11);
					},
					clean: function(){
						$("#error").text("");
					},
					loginFun: function() {
						
						let param = {"mobile":login.mobile,"password":login.password};
						$.when($.ajax({
							url: $.apiUrl + '/api/auth/login',
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
