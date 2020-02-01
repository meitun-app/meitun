(function () {
    var tjsbkh = {
		devices:[]
    };
    var m = {
        init: function () {
			m.getDevice();
            m.buildVue();
         
        },
		getDevice:function(){
			var json = $.localStorageHandler("get","device");
			
			tjsbkh.devices = JSON.parse(json);
			
		},
        buildVue: function () {
            tjsbkh = new Vue({
                el: "#tjsbjh-main",
                data: tjsbkh,
                methods: {
                    bindDevice:function(){
                    	if(tjsbkh.devices.length == 0){
                            mui.toast("没有发现设备");
                            return ;
                        }
                        var macs = [];
                        for(var i = 0 ; i < tjsbkh.devices.length;i++){
                            var mc = tjsbkh.devices[i].deviceMac;
                            if(mc && mc != ''){
                                macs.push(tjsbkh.devices[i].deviceMac);
                            }
                    
                        }
                         if(macs.length == 0){
                            mui.toast("没有发现设备");
                            return ;
                          }
                        
                        var macStr = macs.join();
                        if(macStr == ''){
                            return;
                        }
                        $.when($.ajax({
                                        url: $.apiUrl + '/api/device/bind',
                                        type: 'POST',
                                       	data:JSON.stringify({"mac":macStr})
                                    })).done(function (d) {
										$.localStorageHandler("clear","device");
                                        $.ylbAjaxHandler(d, function () {
                                                mui.toast(d.errmsg);
                                                setTimeout(function(){
                                                	 window.location.href = "../User/MyShebei.html";
                                                },200)
                                        });
                                 });
                    }
                }
            });
			
        }
    };
    m.init();
})();