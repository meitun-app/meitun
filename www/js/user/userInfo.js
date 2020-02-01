(function () {
    var user = {
		t:$.urlParam("t") || 0,
		name:'',
		age:'',
		showName:false,
		showAge:false,
    };
    var m = {
        init: function () {
			var info = $.localStorageHandler("get","userInfo");
			var userInfo = JSON.parse(info);
			
			let name = userInfo.nickname;
			let age = userInfo.age;
           if(user.t==0){
			 user.showName = true;
		   }else if(user.t == 1){
			  user.showAge = true; 
		   }
            m.buildVue();
         
        },
		
        buildVue: function () {
            user = new Vue({
                el: "#info-main",
                data: user,
                methods: {
				
					save:function(){
						var param = {"nickname":user.name,"age":user.age}
						$.when($.ajax({
						    url: $.apiUrl + '/api/user/update',
							data:JSON.stringify(param),
						    type: 'POST'
						})).done(function (d) {
						    $.ylbAjaxHandler(d, function () {
								mui.toast(d.errmsg);
								$.localStorageHandler("set","userInfo",JSON.stringify(d.data));
						    });
						});
					},
					goBack:function(){
						
						window.location.href="Gerenxinxi.html";
						
					}
                }
            });
        }
    };
    m.init();
})();