(function () {
    var detail = {
		id:$.urlParam("id") || 0,
		device:{},
		calcWidth:25,
		width:15,
		windSpeedType:1,
		isUpdating:false
		
		
    };
    var m = {
        init: function () {
			m.getDeviceDetail();
            m.buildVue();
         
        },
		getDeviceDetail: function () {
			var param = {id:detail.id};
		    $.when($.ajax({
		        url: $.apiUrl + '/api/device/detail',
				data:JSON.stringify(param),
		        type: 'POST'
		    })).done(function (d) {
				
		        $.ylbAjaxHandler(d, function () {
					detail.device = d.data;
					detail.windSpeedType = detail.device.windSpeedType;
					
					m.calFengSuWidth();
		        });
		    });
		},
		calFengSuWidth:function(){
						var calcWidth = detail.calcWidth * (detail.windSpeedType-1);
						var width = detail.width * (detail.windSpeedType-1);
						$(".fengsu>div>div>p>span:first-child").css("width","calc("+calcWidth+"% + "+width+"px)");
						
						$(".fengsu>div>div>p>span:last-child").css("left","calc("+calcWidth+"% + "+width+"px)");
		},
        buildVue: function () {
            detail = new Vue({
                el: "#kqjhq-main",
                data: detail,
                methods: {
					/**
					 * 设置默认值
					 */
					setOnLine:function(){
						var param = {id:detail.id};
						$.when($.ajax({
							url: $.apiUrl + '/api/device/online',
							data:JSON.stringify(param),
							type: 'POST'
						})).done(function (d) {
							
							$.ylbAjaxHandler(d, function () {
								mui.toast(d.errmsg);
								if(detail.device.power==0){
									//item.isOnline == 1;
									Vue.set(detail.device,'power',1);
								}else{
									//item.isOnline == 0;
									Vue.set(detail.device,'power',0);
								}
								
							});
						});
					},
					subFeng:function(){
						if(detail.isUpdating){
							return;
						}
						detail.windSpeedType -=1;
						if(detail.windSpeedType <0 ){
								detail.windSpeedType =0;
						}
						
						if(detail.device.windSpeedType == detail.windSpeedType){
							m.calFengSuWidth();
							return;
						}
						var param = {windSpeedType:detail.windSpeedType,id:detail.device.id};
						var url = $.apiUrl + '/api/device/updateFeng';
						detail.updateDevice(url,param,function(){
							detail.updateStateFengSu();
						});
					},
					addFeng:function(){
						if(detail.isUpdating){
							return;
						}
						detail.windSpeedType +=1;
						
						if(detail.windSpeedType>4){
							
								detail.windSpeedType=4;
								
						}
						if(detail.device.windSpeedType == detail.windSpeedType){
							m.calFengSuWidth();
							return;
						}
						var param = {windSpeedType:detail.windSpeedType,id:detail.device.id};
						var url = $.apiUrl + '/api/device/updateFeng';
						detail.updateDevice(url,param,function(){
							detail.updateStateFengSu();
						});
						
					},
					jianTimingFun:function(){
						if(detail.isUpdating){
							return;
						}
						detail.device.timing -=1;
						if(detail.device.timing < 0){
							detail.device.timing = 0;
						}
						var param = {timing:detail.device.timing,id:detail.device.id}
						var url = $.apiUrl + '/api/device/updateTiming';
						detail.updateDevice(url,param);
					},
					addTimingFun:function(){	
						if(detail.isUpdating){
							return;
						}
						detail.device.timing +=1;
						if(detail.device.timing >8){
							detail.device.timing = 8 ;
						}
						
						var param = {timing:detail.device.timing,id:detail.device.id}
						var url = $.apiUrl + '/api/device/updateTiming';
						detail.updateDevice(url,param);
					},
					setDengLiZi:function(tp){
						if(detail.isUpdating){
							return;
						}
						if(tp == detail.device.plasma){
							return ;
						}
						var param = {plasma:tp,id:detail.device.id}
						var url = $.apiUrl + '/api/device/updatePlasma';
						detail.updateDevice(url,param,function(){
								detail.device.plasma = tp;
						});
						
					},
					setTongSuo:function(tp){
						if(detail.isUpdating){
							return;
						}
						if(tp == detail.device.vChip){
							return ;
						}
						var param = {vChip:tp,id:detail.device.id}
						var url = $.apiUrl + '/api/device/updateVchip';
						detail.updateDevice(url,param,function(){
								detail.device.vChip = tp;
						});
					},
					setPattern:function(tp){
						if(detail.isUpdating){
							return;
						}
						if(tp == detail.device.pattern){
							if(detail.device.pattern == 0){
									return ;
							}else{
								tp = 0;
							}
							
						}
						var param = {pattern:tp,id:detail.device.id}
						var url = $.apiUrl + '/api/device/updatePattern';
						detail.updateDevice(url,param,function(){
								detail.device.pattern = tp;
						});
					},
					/**
					 * @param {Object} url
					 * @param {Object} param
					 * @param {Object} type  1:风速  2:定时 3:等离子 4:铜锁 5:模式
					 */
					updateDevice:function(url,param,callback){
						detail.isUpdating = true;
						$.when($.ajax({
							url: url,
							data:JSON.stringify(param),
							type: 'POST'
						})).done(function (d) {
							detail.isUpdating = false;
							$.ylbAjaxHandler(d, function () {
								mui.toast(d.errmsg);
								if(typeof callback == 'function'){
									callback();
								}
								
							});
						});
					},
					updateStateFengSu:function(){
							var speedMsg = "";
							if(detail.windSpeedType == 1){
								speedMsg = "低速";
							}else if(detail.windSpeedType == 2){
								speedMsg = "中速";
							}else if(detail.windSpeedType == 3){
								speedMsg = "高速";
							}else if(detail.windSpeedType == 4){
								speedMsg = "超高速";
							}
							Vue.set(detail.device,'windSpeedType',detail.windSpeedType);
							Vue.set(detail.device,'windSpeed',speedMsg);
							m.calFengSuWidth();
					},
					
					
                }
            });
        }
    };
    m.init();
})();