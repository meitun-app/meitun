(function () {
    var myorder = {
		orderId:$.urlParam("orderId") || 0,
		url:$.urlParam("url") || '',
		orderInfo:{},
		handleOption:{},
		orderGoods:[],
		isCancel:false,
		Paid:false,
		UnPaid:false,
		Complete:false,
		Send:false,
		showPaidTime:false,
		showSendTime:false,
		showCompleteTime:false,
		payPassword:'',
		isPay:false
    };
    var m = {
        init: function () {
            m.getOrderDetail();
            m.buildVue();
         
        },
		initEvent:function(){
			mui.plusReady(function () {
			    
			})
			
			
			
				$(".cancel-btn").on("click", function () {
    $('.pay-part').css("display", "none");
    $inputs.each(function () {  //input清空
        $(this).val("");
    })
    pwd = "";
    $(".real-ipt").val("");
})
$(".confirm-btn").on("click", function () {
    
    if (len === 6 && pwd) {     //付款
 
                    // $.toast("密码错误")
        window.location.href = 'activity_buy_result.html'
 
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
		 getOrderDetail: function () {
            $.when($.ajax({
                url: $.apiUrl + '/api/v2/order/detail?orderId='+myorder.orderId,
                type: 'GET'
            })).done(function (d) {
                $.ylbAjaxHandler(d, function () {
					
					myorder.orderInfo = d.data.orderInfo;
					myorder.handleOption=d.data.handleOption;
					myorder.orderGoods=d.data.orderGoods;
					
					if(myorder.orderInfo.order_status == 0){
						myorder.UnPaid = true;
					}else if(myorder.orderInfo.order_status == 201 
					|| myorder.orderInfo.order_status == 200){
						myorder.Paid = true;
					}else if(myorder.orderInfo.order_status == 300){
						myorder.Send = true;
						myorder.showPaidTime=true;
						myorder.showSendTime=true;
		
					}else if(myorder.orderInfo.order_status == 301){
						myorder.Complete = true;
						myorder.showPaidTime=true;
						myorder.showSendTime=true;
						myorder.showCompleteTime=true;
					}else if(myorder.orderInfo.order_status == 101
					|| myorder.orderInfo.order_status == 401){
						myorder.isCancel = true;
					}
				
             
				});
			});
        },
		
        buildVue: function () {
            myorder = new Vue({
                el: "#orderDetail-main",
                data: myorder,
                methods: {
					toPay:function(){
						//$(".buy-confirm").bind("click", function () {
							// 打开支付密码对话框并生成订单
							console.log("打印");
							$('.pay-part').css("display", "block");
						//})
					},
					checkNumberLen:function(){
							
							if(myorder.payPassword.length == 6){
								myorder.pay();
							}
					},
					pay:function(){
						if(myorder.isPay){
							return ;
						}
						myorder.isPay = true;
						var param = {orderId:myorder.orderId,payPassword:myorder.payPassword}
						$.when($.ajax({
							url: $.apiUrl + '/api/pay/orderPay',
							data:JSON.stringify(param),
							type:'POST'
						})).done(function (d) {
							myorder.payPassword = '';
							myorder.isPay = false;
							if(typeof d == 'string'){
								d = JSON.parse(d);
							}
							if(d.errno == 201){
								mui.toast(d.errmsg);
								$(".surface-ipt input").each(function () {  //将有值的当前input 后面的所有input清空
									
										$(this).val("");
								})
								return;
							}else if(d.errno == 202) {
								var data = null;
								if (typeof d == 'string') {
								        data = JSON.parse(d);
								}
						
								$(".surface-ipt input").each(function () {  //将有值的当前input 后面的所有input清空
									$(this).val("");});
								$("#showSetting").show();
							}else{
								var st = 's';
								if(d.errno == 0){
									st = 's';	
								}else{
									st = 'f';	
								}
								window.location.href="pay.html?st="+st+"&orderId="+myorder.orderId;	
							}
							
							
						});
					},
						cancelOrder:function(orderId){
							var param = {"id":orderId};
							$.when($.ajax({
								url: $.apiUrl + '/api/v2/order/cancelOrder',
								data:JSON.stringify(param),
								type:'POST'
							})).done(function (d) {
								$.ylbAjaxHandler(d,function(){
									window.location.reload();
								})
							});
						},
						confirmOrder:function(orderId){
							var param = {"id":orderId};
							$.when($.ajax({
								url: $.apiUrl + '/api/v2/order/confirmOrder',
								data:JSON.stringify(param),
								type:'POST'
							})).done(function (d) {
								$.ylbAjaxHandler(d,function(){
									window.location.reload();
								})
								
							});
						},
						deleteOrder:function(orderId){
							var param = {"id":orderId};
							$.when($.ajax({
								url: $.apiUrl + '/api/v2/order/deleteOrder',
								data:JSON.stringify(param),
								type:'POST'
							})).done(function (d) {
								$.ylbAjaxHandler(d,function(){
									window.location.href="MyOrder.html";
								})
								
							});
						},
						goTrack:function(orderId){
							window.location.href="logistics.html?orderId="+orderId;
						},
						goSettingPayWord:function(){
								window.location.href="../LogInTo/ForgotPassword.html?t=2&url=1";
						},
						goBack:function(){
							var url = myorder.url;
							if(url){
								window.location.href = url;
							}else{
								history.back(-1);
							}
						}
                }
            });
			setTimeout(function(){
				m.initEvent();
			},500);
        }
    };
    m.init();
})();