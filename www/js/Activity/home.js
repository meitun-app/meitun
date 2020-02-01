(function () {
    var home = {
		deviceVos:[],
		deviceNums:0,
		coinType:'',
		grandTotalIncome:0,
		yesterdayIncome:0,
		weather:{}
		
    };
    var m = {
        init: function () {
			if(!navigator.onLine){
				mui.toast('网络已断开，请稍后再试')
			}
			m.getLocation();
			
            m.buildVue();
			
        },
		getInterIndex: function () {
			
		    $.when($.ajax({
		        url: $.apiUrl + '/api/v2/inter?city='+encodeURI(encodeURI(home.weather.city)),
		        type: 'GET'
		    })).done(function (d) {
				
		        $.ylbAjaxHandler(d, function () {
					home.deviceVos = d.data.deviceVos;
					
					home.deviceNums  = d.data.deviceNums;
					home.coinType  = d.data.coinType;
					home.weather = d.data.weather;
					home.grandTotalIncome  = d.data.grandTotalIncome;
					home.yesterdayIncome  = d.data.yesterdayIncome;
					
					if(home.weather.img){
						$("#weatherImg").attr("src","../../img/weatherIcon/"+home.weather.img+".png");
					}
					
		        });
		    });
		},
		getLocation:function(){
			page.getlocation(function(data){
				if(data.result) {  
				    var city = data.position.address.city;
					home.weather.city = city;
				} else {  
				    mui.toast(data.msg)
				} 
				m.getInterIndex();
			});
		},
        buildVue: function () {
            home = new Vue({
                el: "#home-main",
                data: home,
                methods: {
					/**
					 * 设置默认值
					 */
					setOnLine:function(item){
						var param = {id:item.id};
						$.when($.ajax({
							url: $.apiUrl + '/api/device/online',
							data:JSON.stringify(param),
							type: 'POST'
						})).done(function (d) {
							
							$.ylbAjaxHandler(d, function () {
								mui.toast(d.errmsg);
								if(item.power==0){
									
									Vue.set(item,'power',1);
								}else{
									
									Vue.set(item,'power',0);
								}
								
							});
						});
					},
					goDetail:function(id){
						window.location.href = "kqjhq.html?id="+id;
					},
					goShebeiList:function(){
						window.location.href = "../User/MyShebei.html";
					}
                }
            });
			
			setTimeout(function(){
				//m.getLocation();
			},200);
        }
    };
    m.init();
})();