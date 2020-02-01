(function () {
    var user = {
		userInfo:{},
		asset:{},
		orderNum:0
		
    };
    var m = {
        init: function () {
			
            m.getUserIndex();
            m.buildVue();
         
        },
		getUserIndex: function () {
		    $.when($.ajax({
		        url: $.apiUrl + '/api/user/index',
		        type: 'POST'
		    })).done(function (d) {
				
		        $.ylbAjaxHandler(d, function () {
				   user.userInfo = d.data.userInfo;
				   if(!user.userInfo.avatar){
					   user.userInfo.avatar = '../../img/default_avatar.png';
				   }
				   user.asset = d.data.asset;
				   user.orderNum = d.data.orderNum;
				   
				   $.localStorageHandler("set","userInfo",JSON.stringify(user.userInfo));
		        });
		    });
		},
        buildVue: function () {
            user = new Vue({
                el: "#user-main",
                data: user,
                methods: {
					copyText:function(value){
						page.copyFun(value);
					},
					goGerenxinxi:function (){
						window.location.href = "Gerenxinxi.html";
					}
                }
            });
        }
    };
    m.init();
})();