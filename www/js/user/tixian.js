(function () {
    var tixian = {
		bankId:$.urlParam("bankId") || 0,
		asset:{},
		bank:{
			id:0
		},
		wallet:0,
		payPassword:""
    };
    var m = {
        init: function () {
			m.getWalletInfo();
            m.buildVue();
         
        },
		getWalletInfo:function(){
			$.when($.ajax({
			    url: $.apiUrl + '/api/v2/user/transfer/walletInfo?bankId='+tixian.bankId,
			    type: 'GET'
			})).done(function (d) {
				
			    $.ylbAjaxHandler(d, function () {
					tixian.asset = d.data.asset;
					tixian.bank = d.data.bank;
			    });
			});
		},
        buildVue: function () {
            tixian = new Vue({
                el: "#tixian-main",
                data: tixian,
                methods: {
					checkNumberLen:function(){
							if(tixian.payPassword.length == 6){
								tixian.submitSave();
							}
					},
					cleanNumber:function(){
							tixian.wallet ='';
					},
					chooseBank:function(){
						window.location.href = "Shezhi_yinhangka.html?t=1";
					},
					submitSave:function(){
						if(tixian.wallet == '' || tixian.wallet == 0){
							tixian.payPassword = '';
							$(".surface-ipt input").each(function () {  //将有值的当前input 后面的所有input清空
								$(this).val("");})
							$(".del").trigger("click");
							mui.toast("请输入提现金额");
							return ;
						}
						
						if(tixian.bank.id == '' || tixian.bank.id == 0){
							tixian.payPassword = '';
							$(".surface-ipt input").each(function () {  //将有值的当前input 后面的所有input清空
								$(this).val("");
							
								})
								
							$(".del").trigger("click");
							mui.toast("请选择银行卡");
							return ;
						}
						var param = {"wallet":tixian.wallet,"bankId":tixian.bank.id,"payPassword":tixian.payPassword};
						$.when($.ajax({
						    url: $.apiUrl + '/api/v2/user/transfer/wallet',
							data:JSON.stringify(param),
						    type: 'POST'
						})).done(function (d) {
						    $.ylbAjaxHandler(d, function () {
								mui.toast(d.errmsg);
								setTimeout(function(){
									window.location.reload()
								},500)
								
								
						    },function(){
								var data = null;
								if (typeof d == 'string') {
								        data = JSON.parse(d);
								}
								tixian.payPassword = '';
								if(data.errno == 202) {			
									$(".surface-ipt input").each(function () {  //将有值的当前input 后面的所有input清空
										$(this).val("");});
									$("#showSetting").show();
								}else{
									tixian.payPassword = '';
									$(".surface-ipt input").each(function () {  //将有值的当前input 后面的所有input清空
										$(this).val("");})
									$(".del").trigger("click");
								}
								
								
							});
						});
					},
					goSettingPayWord:function(){
							window.location.href="../LogInTo/ForgotPassword.html?t=2&url=1";
					},
					goBack:function(){
						window.location.href="MyQianbao.html";
					}
                }
            });
        }
    };
    m.init();
})();