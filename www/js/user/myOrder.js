(function () {
    var myorder = {
		cp:1,
		sz:5,
		status:0,
		orderList:[],
		isLoad:false,
		totalPages:0,
		payPassword:'',
		payOrderId:0,
		isPay:false,
		
    };
    var m = {
        init: function () {
			
            m.getOrderList();
			m.buildVue();
			
         
        },
		
		initPullRefreshEvent: function() {
			
			mui.plusReady(function () {
			
			    if(window.plus){
					
				//	var deceleration = mui.os.ios ? 0.0009 : 0.0009;
// 							$('.mui-scroll-wrapper').scroll({
// 								bounce: false,
// 								indicators: true, //是否显示滚动条
// 								deceleration: deceleration
// 							});
// // 
					
					mui.init({
						pullRefresh: {
							container: '#pullrefresh',
							up: {
								auto:false,
								contentrefresh: '正在加载...',
								callback: function() {
									if(myorder.isLoad){
										return;
									}
									myorder.isLoad = true;
									myorder.cp += 1;
									m.getOrderList();
									
								}
							}
						}
					});
					
				}else{
					$("#pullrefresh").hide();
				}
			})
		
		},
		
		initEvent:function(){
			var itemIndex = 0;
			var tabLoadEndArray = [false, false];
			var tabScroolTopArray = [0, 0];   
			// tabHead移动  
			$('.tabHead span').on('tap', function () {
				tabScroolTopArray[itemIndex] = $(window).scrollTop();
				var $this = $(this);
				itemIndex = $this.index();
				$(window).scrollTop(tabScroolTopArray[itemIndex]);
				
				
				$(this).addClass('active').siblings('.tabHead span').removeClass('active');
				$('.border').css('left', $(this).offset().left + 'px');
				$('.khfxPane').eq(itemIndex).show().siblings('.khfxPane').hide();   
				
				
				myorder.status = itemIndex;
				myorder.cp= 1;
				myorder.orderList = [];
				m.getOrderList();
				if(mui('#pullrefresh').pullRefresh()){
					mui('#pullrefresh').pullRefresh().enablePullupToRefresh();
				}
				
			});
			
			
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
		 getOrderList: function () {
            $.when($.ajax({
                url: $.apiUrl + '/api/v2/order/list?status='+myorder.status+"&cp="+myorder.cp+"&sz="+myorder.sz,
                type: 'GET'
            })).done(function (d) {
				
				myorder.isLoad = false;
                $.ylbAjaxHandler(d, function () {
					
					myorder.totalPages = d.data.totalPages;
					if(myorder.cp >= myorder.totalPages){
						
						if(mui('#pullrefresh').pullRefresh()){
							
							mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
						}
					}else{
						if(mui('#pullrefresh').pullRefresh()){
							mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
						}
					}
					var data = d.data.data;
					for(var i = 0;i < data.length;i++){
						myorder.orderList.push(data[i]);
					}
					
					if(myorder.orderList.length == 0){
						if(mui('#pullrefresh').pullRefresh()){
								mui('#pullrefresh').pullRefresh().disablePullupToRefresh();
						}
						
					}
				
                });
            });
        },
		
        buildVue: function () {
			// alert("121111111")
            myorder = new Vue({
                el: "#myorder-main",
                data: myorder,
                methods: {
					
					toPay:function(orderId){
						// alert("22222222222222")
						myorder.payOrderId = orderId;
						//alert("323233223")
						// $(".buy-confirm").bind("click", function () {
							// 打开支付密码对话框并生成订单
							console.log("打印");
							$('.pay-part').css("display", "block");
						// })
					},
					checkNumberLen:function(){
							
							if(myorder.payPassword.length == 6){
								myorder.pay();
							}
					},
					goDetail:function(id){
						window.location.href="orderDetail.html?orderId="+id;
					},
					pay:function(){
						if(myorder.isPay){
							return ;
						}
						myorder.isPay =true;
						var param = {orderId:myorder.payOrderId,payPassword:myorder.payPassword}
						$.when($.ajax({
							url: $.apiUrl + '/api/pay/orderPay',
							data:JSON.stringify(param),
							type:'POST'
						})).done(function (d) {
							myorder.isPay =false;
							myorder.payPassword = '';
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
								window.location.href="pay.html?st="+st+"&orderId="+myorder.payOrderId;
							}
							
							
						});
					},
						cancelOrder:function(orderId){
							console.log(orderId,444)
							var param = {"id":orderId};
							$.when($.ajax({
								url: $.apiUrl + '/api/v2/order/cancelOrder',
								data:JSON.stringify(param),
								type:'POST'
							})).done(function (d) {
								console.log(d,"d")
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
									window.location.reload();
								})
								
							});
						},
						goSettingPayWord:function(){
								window.location.href="../LogInTo/ForgotPassword.html?t=2&url=1";
						},
						goBack:function(){
							window.location.href="User.html";
						}
                }
            });
			
			setTimeout(function(){
				m.initPullRefreshEvent();
				m.initEvent();
				
			},500);
        }
    };
    m.init();
})();