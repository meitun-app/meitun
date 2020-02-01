(function () {
    var tjsbyi = {
		wifiSSID:'',
		wifiPwd:''
    };
    var m = {
        init: function () {
            setTimeout(function(){
                m.initMui();
              },200)
            m.buildVue();
         
        },
		initMui:function(){
			mui.plusReady(function () {
				plus.qinglian.getCurrentSSID(function(result){
					 if(typeof result == "object"){
						result = JSON.stringify(result);
					 }
					var b = JSON.parse(result);
					if(b.code == 0){
						tjsbyi.wifiSSID = b.data;
					}else{
						mui.toast(b.msg);
					}
				},function(result){
					 if(typeof result == "object"){
							result = JSON.stringify(result);
					}
					var b = JSON.parse(result);
					if(b.code == 0){
						tjsbyi.wifiSSID = b.data;
					}else{
						mui.toast(b.msg);
					}
				  
				});
			
			})
		},
        buildVue: function () {
            tjsbyi = new Vue({
                el: "#tjsbyi-main",
                data: tjsbyi,
                methods: {
                    setWiFi:function(){
						if(tjsbyi.wifiSSID == ''){
							mui.toast("请填写WiFi名称");
							return ;
						}
						if(tjsbyi.wifiPwd == ''){
							mui.toast("请输入WiFi密码");
							return ;
						}

                        $.localStorageHandler("set","wifiInfo",JSON.stringify({ssid:tjsbyi.wifiSSID,password:tjsbyi.wifiPwd}));
		                // plus.qinglian.deviceAp(tjsbyi.wifiSSID,tjsbyi.wifiPwd,3000,function(result){
							// var b = JSON.parse(result);
		                //     mui.toast(b.msg);
							// $.localStorageHandler("set","wifiInfo",JSON.stringify({ssid:tjsbyi.wifiSSID,password:tjsbyi.wifiPwd}));
		                //
		                // },function(result){
							// var b = JSON.parse(result);
		                //   mui.toast(b.msg);
		                // });
		                window.location.href = "Tjsber.html";
                    },
					goNext:function () {
                        window.location.href = "Tjsber.html";
                    },
					goBack:function(){
						if(tjsbyi.url){
							window.location.href=tjsbyi.url;
						}else{
							// window.location.href="../User/MyShebei.html";
							window.history.back(-1)
						}
						
					}
                }
            });
			
        }
    };
    m.init();
})();