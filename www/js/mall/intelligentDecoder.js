(function () {
    var decoder = {
		addressId:$.urlParam("addressId") || 0,
		address:{},
		goods:[],
		orderTotal:0,
		payPassword:'',
		isSubmit:false,
		isPay:false,
    };
    var m = {
        init: function () {
            m.getCheckout();
            m.buildVue();
        },
		initEvent:function(){
			$(".buy-confirm").on("click", function () {
			   if(!decoder.address){
				   mui.toast('收货地址不能为空');
				   return
			   }
			   
			   let flag = false;
			   let msg = '';
			   decoder.goods.map((item)=> {
					if(item.info.goodsNumber < item.number) {
						flag = true;
						msg = item.info.name + '库存不足，请调整选购数量！'
					}
			   })
			   if(flag) {
				mui.toast(msg);
				return
			   }
				// 打开支付密码对话框并生成订单
				$('.pay-part').css("display", "block");
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
		getCheckout: function () {
			
			var cartGoods = $.localStorageHandler("get","cartGoods");
			
			var item = JSON.parse(cartGoods);
			// console.log(item,222)
			// localStorage.quantity = item.quantity;
			var items = [];
			items.push(item);
			var param = {"addressId":decoder.addressId,"items":items}
		    $.when($.ajax({
		        url: $.apiUrl + '/api/v2/goods/checkOut',
		        type: 'POST',
				data:JSON.stringify(param)
		    })).done(function (d) {
		        $.ylbAjaxHandler(d, function () {
					decoder.address = d.data.address;
					decoder.goods = d.data.goods;
					decoder.orderTotal = d.data.total;
		        });
		    });
		},
       
        buildVue: function () {
            decoder = new Vue({
                el: "#intelligentDecoder-main",
                data: decoder,
                methods: {
					
					checkNumberLen:function(){
							
							if(decoder.payPassword.length == 6){
								decoder.submitOrder();
							}
					},
					chooseAddress:function(){
						window.location.href="../User/address.html?isBuy=buy"
					},
					submitOrder:function(){
						
						var carts = [];
						
						if(!decoder.address || !decoder.address.id){
							
							$(".cancel-btn").trigger("click");
							decoder.payPassword = '';
							$(".surface-ipt input").each(function () {  //将有值的当前input 后面的所有input清空
								$(this).val("");})
							mui.toast('收货地址不能为空');
							return;
						}
						
						for(var i = 0 ;i <decoder.goods.length;i++ ){
							var goods = decoder.goods[i];
							
							var cart = {};
							cart.goodsId = goods.info.id;
							cart.productId = goods.product.id;
							cart.quantity = goods.number;
							if(goods.spec){
								var checkedSpecText = goods.spec.map(function (v) {
									return v.specificationName+":"+v.value;
							});
								cart.goods_specifition_name_value = checkedSpecText.join(";");
							}else{
								cart.goods_specifition_name_value = '';
							}
							
							
							carts.push(cart);
						}
						if(decoder.isSubmit){
							return;
						}
						decoder.isSubmit = true;
						var para = {"addressId":decoder.address.id,"items":carts,"type":"submit",payPassword:decoder.payPassword};
						$.when($.ajax({
							url: $.apiUrl + '/api/v2/order/submit',
							type:'POST',
							data:JSON.stringify(para)
						})).done(function (d) {
							decoder.isSubmit = false;
							
							$.ylbAjaxHandler(d, function () {
								decoder.pay(d.data.id);
							},function(){
								var data = null;
								if (typeof d == 'string') {
								        data = JSON.parse(d);
								}
								if(data.errno == 202){
									decoder.payPassword = '';
									$(".surface-ipt input").each(function () {  //将有值的当前input 后面的所有input清空
										$(this).val("");});
									$("#showSetting").show();
									
								}else{
									decoder.payPassword = '';
									$(".surface-ipt input").each(function () {  //将有值的当前input 后面的所有input清空
										$(this).val("");})
									$(".del").trigger("click");
								}
								
							});
						});
				
					},
					pay:function(orderId){
						if(decoder.isPay){
							return;
						}
						decoder.isPay = true;
						var param = {orderId:orderId,payPassword:decoder.payPassword}
						$.when($.ajax({
							url: $.apiUrl + '/api/pay/orderPay?orderId',
							data:JSON.stringify(param),
							type:'POST'
						})).done(function (d) {
							decoder.isPay = false;
							if(typeof d == 'string'){
								d = JSON.parse(d);
							}
							if(d.errno == 201){
								mui.toast(d.errmsg);
								$(".surface-ipt input").each(function () {  //将有值的当前input 后面的所有input清空
									
									$(this).val("");
								
								})
								return;
							}else{
								var st = '';
								switch(d.errno) {
									case 0:
										st = 's';
										break;
									case 503:
										st = 'kcf';
										break;
									case 502:
										st = 'qbf';
										break;
									default:
										st = 'f';
										break;
								}
								window.location.href="../User/pay.html?st="+st+"&orderId="+orderId;
							}
						});
					},
					jsReduce: function(index) {
					
						var item = decoder.goods[index];
						item.number = item.number-1;
						if(item.number <=1){
							item.number = 1;
						}
						decoder.goods[index] = item;
						var cart = JSON.parse(window.localStorage.getItem('cartGoods'))
						cart.quantity = item.number
						window.localStorage.setItem('cartGoods', JSON.stringify(cart))
						decoder.cal();
					},
					jsAdd: function(index){
						
						var item = decoder.goods[index];
						item.number = item.number+1;
						decoder.goods[index] = item;
						var cart = JSON.parse(window.localStorage.getItem('cartGoods'))
						cart.quantity = item.number
						window.localStorage.setItem('cartGoods', JSON.stringify(cart))
						decoder.cal();
					},
					
					cal:function(){
						var total = 0;
						for(var i = 0 ;i <decoder.goods.length;i++ ){
							var goods = decoder.goods[i];
							
							total = total + goods.info.retailPrice * goods.number;
						}
						decoder.orderTotal = total;
					},
					goSettingPayWord:function(){
							window.location.href="../LogInTo/ForgotPassword.html?t=2&url=1";
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