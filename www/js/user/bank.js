(function () {
    var bank = {
		t:$.urlParam("t") || 0,
		detail:{
            id:0,
            name:"",
            cardNo:"",
            bankName:"",
            bankAddress:"",
            mobile:'',
		    code:''
        },
		allRegion:"",
		time:60,
		sending:false,
		timeObj:null
		
    };
    var m = {
        init: function () {
           
            m.buildVue();
         
        },
		initDom:function(){
			
            var $target = $('#J_Address');

            $target.citySelect();

            $target.on('click', function(event) {
                event.stopPropagation();
                $target.citySelect('open');
            });

            $target.on('done.ydui.cityselect', function(ret) {

                bank.detail.bankAddress = ret.provance + ' ' + ret.city + ' ' + ret.area;
                
                $(this).val(ret.provance + ' ' + ret.city + ' ' + ret.area);
            });
        
		},
        buildVue: function () {
            bank = new Vue({
                el: "#bank-main",
                data: bank,
                methods: {
					// mobilePress:function(){
					// 	var b = $.checkIsMobileNumber(bank.detail.mobile);
					
					// 	if(!b){
					// 		return;
					// 	}
					// },
					telNumberDown:function () {
					   if(bank.detail.mobile > 11 ){
						   bank.detail.mobile = bank.detail.mobile.substr(0, 10);
					   }
					},
					telCardNoDown:function () {
					   if(bank.detail.cardNo > 20 ){
						   bank.detail.cardNo = bank.detail.cardNo.substr(0, 20);
					   }
					},
					cleanTime:function(){
						 clearInterval(bank.timeObj);
						bank.timeObj = null;
						bank.time = 60;
					},
					sendCode:function(){
						var that = this;
						if(!bank.detail.mobile){
						
							mui.toast("请输入手机号");
							return ;
						}
						if(bank.sending){
							return ;
						}
						if(bank.time != 60){
							return;
						}
						bank.sending = true;
						var param = {mobile:bank.detail.mobile,type:4};
						$.when($.ajax({
							url: $.apiUrl + '/api/common/getIdentifyingCode',
							type: 'POST',
							data:JSON.stringify(param)
						})).done(function(d) {
							bank.sending = false;
							if(typeof d == 'string'){
								d = JSON.parse(d);
							}
							if(d.errno==0){
								bank.timeObj = setInterval(() => {
								  if (bank.time === 0) {
									that.cleanTime();
								  } else {
									bank.time -=1;
								  }
								}, 1000)
							}else{
							
								mui.toast(d.errmsg);
							}
						});
					},
					save:function () {
						
                       $.when($.ajax({
						url: $.apiUrl + '/api/user/bank/save',
						data:JSON.stringify(bank.detail),
						type: 'POST'
					})).done(function (d) {
						$.ylbAjaxHandler(d, function () {
							window.location.href="result.html?t="+bank.t;
						});
					});
                    },
					
                },
				watch:{
					// 'detail.mobile':{
					// 	 handler(newName, oldName) {
					// 	  // ...
					// 	  
					// 	  },
					// 	  deep: true,
					// 	  immediate: true
					// }
				}
            });
			setTimeout(function(){
				m.initDom();
			},500);
        }
    };
    m.init();
})();