(function () {
    var qianbao = {
		amount: $.urlParam("amount") || 0,
		payPassword:"",
		walletInfo:{
			reviceMobile:"",
			wallet:0,
		},
		isSubmit:false
		
    };
    var m = {
        init: function () {
			
			m.initEvent();
            m.buildVue();
         
        },
		
		initEvent:function(){
			$(".buy-confirm").on("click", function () {
				
				if(qianbao.walletInfo.wallet == ''){
					qianbao.walletInfo.wallet = 0;
				}
				
				if(qianbao.walletInfo.wallet == 0){
					mui.toast("金额不能为空");
					return;
				}
				
				if(parseFloat(qianbao.walletInfo.wallet)>parseFloat(qianbao.amount)){
					mui.toast("账户余额不足");
					return;
				}
				
				// 打开支付密码对话框并生成订单
				$('.pay-part').css("display", "block");
			})
			$(".exchange-wallet-main-cancel-btn").on("click", function () {
				$('.pay-part').css("display", "none");
				$inputs.each(function () {  //input清空
					$(this).val("");
				})
				pwd = "";
				$(".real-ipt").val("");
			})
			$(".exchange-wallet-main-confirm-btn").on("click", function () {
				
				if(qianbao.isSubmit){
					return ;
				}
				
				if (len === 6 && pwd) {     //付款
					m.exchangeWallet();
				} else {
					$.toast("请输入支付密码")
				}
				})
			 
			var pwd = "";
			var len = 0;
			// type=tel input框
			var $inputs = $(".surface-ipt input");
			$(".real-ipt").on("input", function () {
				if (!$(this).val()) {   //无值
				}
				if (/^[0-9]*$/g.test($(this).val())) {  //有值且只能是数字（正则）
					pwd = $(this).val().trim();
					len = pwd.length;
					for (var i in pwd) {
						$inputs.eq(i).val(pwd[i]);
					}
					$inputs.each(function () {  //将有值的当前input 后面的所有input清空
						var index = $(this).index();
						if (index >= len) {
							$(this).val("");
						}
					})
					if (len === 6) {
						//执行付款操作
								}
			 
							} else {    //清除val中的非数字，返回纯number的value
					var arr = $(this).val().match(/\d/g);
					try {
						$(this).val($(this).val().slice(0,$(this).val().lastIndexOf(arr[arr.length-1])+1));
					} catch(e) {
						// console.log(e.message)
						//清空
						$(this).val("");
					}
				}
				console.log("password:" + pwd);
			})
			//  获取焦点事件避免输入键盘挡住对话框
			$('.real-ipt').on('focus', function () {
				$('.pay-dialog').css('top','40px')
			})
			$('.real-ipt').on('blur', function () {
				$('.pay-dialog').css('top','120px')
			})
		
			//点击输出支付款
			$(".del").click(function(){
				$(".common-part").hide();
			})	
		},
		exchangeWallet:function(){
			qianbao.isSubmit = true;
			$.when($.ajax({
			    url: $.apiUrl + '/api/v2/user/exchange/wallet',
				type: 'POST',
				data:JSON.stringify({wallet:qianbao.walletInfo.wallet,reviceMobile:qianbao.walletInfo.reviceMobile,payPassword:qianbao.payPassword})
			})).done(function (d) {
				qianbao.isSubmit = false;
			    $.ylbAjaxHandler(d, function () {
					window.location.href="MyQianbao.html";
			    },function(){
								var data = null;
								if (typeof d == 'string') {
								        data = JSON.parse(d);
								}
								if(data.errno == 202){
									qianbao.payPassword = '';
									$(".surface-ipt input").each(function () {  //将有值的当前input 后面的所有input清空
										$(this).val("");});
									$("#showSetting").show();
									
								}else{
									qianbao.payPassword = '';
									$(".surface-ipt input").each(function () {  //将有值的当前input 后面的所有input清空
										$(this).val("");})
									$(".del").trigger("click");
								}
								
							});
			});
		},
		
        buildVue: function () {
            qianbao = new Vue({
                el: "#exchange-wallet-main",
                data: qianbao,
                methods: {
					inputMaxLenth:function(){
						
						if(qianbao.walletInfo.reviceMobile.length > 11){
								qianbao.walletInfo.reviceMobile=qianbao.walletInfo.reviceMobile.slice(0,11);
						}
					},
					clearZero:function(){
						if(qianbao.walletInfo.wallet == 0){
							qianbao.walletInfo.wallet = '';
						}
					},
					goBack:function(){
						window.location.href="MyQianbao.html";
					},
					goSettingPayWord:function(){
							window.location.href="../LogInTo/ForgotPassword.html?t=2&url=1";
					}
                }
            });
	
        }
    };
    m.init();
})();