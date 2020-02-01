(function () {
    var asset = {
		type:$.urlParam("type"),
		tabIndex:0,
		coinType:{},
		sendAddress:'',
		block:{
			path:'',
			amount:0,
		},
		zhan:{
			mobile:'',
			amount:0,
		},
		payPassword:"",
		isSubmit:false,
		
    };
	var myPage = null;
    var m = {
        init: function () {
			
            m.getAssetDetail();
            m.buildVue();
         
        },
		initEnvent:function(){
			$(".buy-confirm").bind("click", function () {
				//
				// if(!(asset.block.amount>0)){
				// 	mui.toast('转账金额需大于0')
				// 	return
				//   }
				//   if(asset.block.amount>asset.coinType.coin){
				// 	mui.toast('余额不足')
				// 	return
				//   }
				// if(!asset.block.path){
				// 	mui.toast('接口地址不能为空')
				// 	return
				//   }
				//显示支付密码
				//$('.pay-part').css("display", "block");
			})
			//-------york 
			$('.showAll').click(function(){
				// console.log(asset)
				$('.showMoney').val(asset.coinType.coin)
			})

			$(".cancel-btn").on("click", function () {
			    $('.pay-part').css("display", "none");
			    $inputs.each(function () {  //input清空
			        $(this).val("");
			    })
			    pwd = "";
			    $(".real-ipt").val("");
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
									if(asset.tabIndex==0){
										asset.subTab0()
									}else{
										asset.subTab1()
									}
									//asset.submit()
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
					
			
			
			var myNav = new Swiper('#nav', {
				spaceBetween: 10,
				slidesPerView : 2,//导航显示个数
				watchSlidesProgress : true,
				watchSlidesVisibility : true,
				on:{
					tap: function(){
						myPage.slideTo( myNav.clickedIndex);
						asset.tabIndex = myNav.clickedIndex;
					}
				}
			})
			 myPage = new Swiper('#page',{
				on:{
				slideChangeTransitionStart: function(){
					m.updateNavPosition()
				}}
			})
		},
		updateNavPosition:function (){
			$('#nav .active-nav').removeClass('active-nav');
			var activeNav = $('#nav .swiper-slide').eq(myPage.activeIndex).addClass('active-nav');
			if (!activeNav.hasClass('swiper-slide-visible')) {
			  
				if (activeNav.index()>myNav.activeIndex) {
				  
					var thumbsPerNav = Math.floor(myNav.width/activeNav.width())-1
					myNav.slideTo(activeNav.index()-thumbsPerNav)
				}
				else {
				  
					myNav.slideTo(activeNav.index())
				}   
			}
		},
		getAssetDetail: function () {
		    $.when($.ajax({
		        url: $.apiUrl + '/api/coin/asset/detail?type='+asset.type,
		        type: 'GET'
		    })).done(function (d) {
				
		        $.ylbAjaxHandler(d, function () {
					asset.coinType = d.data;
					// york
					let money = localStorage.getItem("outMoney")
					// console.log(money)
					$('.showMoney').val(money)
					// localStorage.removeItem("outMoney")
		        });
			});
			$.when($.ajax({
		        url: $.apiUrl + '/api/userCoinAddr/getUserCoinAddr',
		        type: 'POST'
		    })).done(function (d) {
				
		        $.ylbAjaxHandler(d, function () {
					 asset.sendAddress = d.data
		        });
			});
			let id = ''
			if(location.search.split('&')[1]){
				 id = location.search.split('&')[1].split('=')[1]
				 console.log(id)
				 $.when($.ajax({
					url: $.apiUrl + '/api/userCoinAddr/getSendAddrInfo',
					type: 'POST',
					data:JSON.stringify({id}),
					
				})).done(function (d) {
					
					$.ylbAjaxHandler(d, function () {
						asset.block.path = d.data.sendAddr
						//console.log(d.data.sendAddr,asset.block.path)
					});
				});
			}
			
		},
        buildVue: function () {
            asset = new Vue({
                el: "#assets-main",
                data: asset,
                methods: {
					checkNumberLen:function(){
							//console.log(asset.payPassword.length)
							if(asset.payPassword.length == 6){
								console.log(8859)
								asset.submit();
							}
					},
					outMoney() {
						if (/^(\d?)+(\.\d{0,2})?$/.test(asset.block.amount)) { //正则验证，提现金额小数点后不能大于两位数字
							asset.block.amount = asset.block.amount;
						  } else {
							asset.block.amount = asset.block.amount.substring(0, asset.block.amount.length-1);
						  }
						//   console.log(asset.block.amount)
					},
					outMoney2() {
						if (/^(\d?)+(\.\d{0,2})?$/.test(asset.zhan.amount)) { //正则验证，提现金额小数点后不能大于两位数字
							asset.zhan.amount = asset.zhan.amount;
						  } else {
							asset.zhan.amount = asset.zhan.amount.substring(0, asset.zhan.amount.length-1);
						  }
						//   console.log(asset.zhan.amount)
					},
					submit:function(){
						asset.block.amount = $('.showMoney').val()
						//$('.pay-part').css("display", "block");
						if(asset.tabIndex == 0){
							if(!(asset.block.amount>0)){
								mui.toast('转账金额需大于0')
								return
							  }
							  if(asset.block.amount>asset.coinType.coin){
								mui.toast('余额不足')
								return
							  }
							if(!asset.block.path){
								mui.toast('接收地址不能为空')
								return
							  }
							  $('.pay-part').css("display", "block");
							//asset.subTab0();
							// !(/^1[3456789]\d{9}$/.test(phone))							
						}else if(asset.tabIndex == 1){
							if(!(/^1[3456789]\d{9}$/.test(asset.zhan.mobile))){
								mui.toast('无此用户')
								return
							  }
							if(!(asset.zhan.amount>0)){
								mui.toast('转账金额需大于0')
								return
							  }
							  console.log(asset.zhan.amount,asset.coinType.coin)
							  if(asset.zhan.amount>asset.coinType.coin){
								mui.toast('余额不足')
								return
							  }
							  $('.pay-part').css("display", "block");
							//asset.subTab1();
						}
					},
					subTab0:function(){
						if(asset.isSubmit){
							return ;
						}
						asset.isSubmit = true;
						var param = {type:"0",ethPath:asset.block.path,coinType:asset.type,amount:asset.block.amount,password:asset.payPassword}
						$.when($.ajax({
							url: $.apiUrl + '/api/coin/send/submit',
							data:JSON.stringify(param),
							type: 'POST'
						})).done(function (d) {
							asset.isSubmit = false;
							asset.payPassword = '';
							
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
								mui.toast(d.errmsg);
								if(d.errno == 0){
									setTimeout(function(){
										// window.history.back();
										// 跳到地址蒲
										window.location.href="curencyAddress.html?type="+asset.type;
										localStorage.removeItem('outMoney')
									},200)
								}
								$(".surface-ipt input").each(function () {  //将有值的当前input 后面的所有input清空
								$(this).val("");});
								$(".del").trigger("click");					
							}
						
						});
					},
					subTab1:function(){
						if(asset.isSubmit){
							return ;
						}
						asset.isSubmit = true;
						var param = {type:"1",reciverMobile:asset.zhan.mobile,coinType:asset.type,amount:asset.zhan.amount,password:asset.payPassword}
						$.when($.ajax({
							url: $.apiUrl + '/api/coin/send/submit',
							data:JSON.stringify(param),
							type: 'POST'
						})).done(function (d) {
							asset.isSubmit = false;
							asset.payPassword = '';
							
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
								mui.toast(d.errmsg);
								if(d.errno == 0){
									setTimeout(function(){
										window.history.back();
									},200)
								}
								$(".surface-ipt input").each(function () {  //将有值的当前input 后面的所有input清空
								$(this).val("");});
								$(".del").trigger("click");	
							}
						});
					},
					goSettingPayWord:function(){
							window.location.href="../LogInTo/ForgotPassword.html?t=2&url=1";
					},
					goBack:function(){
						window.location.href="MyAssets_detail.html?type="+asset.type;
						localStorage.removeItem('outMoney')
					},
					address:function(){

						// localStorage.setItem('outMoney',asset.block.amount)
						console.log(asset.type)
						// console.log(type)
						// console.log(address.isBuy)
						// console.log(id,454)
						// localStorage.setItem('outMoney',asset.block.amount)
						localStorage.setItem('outMoney',$('.showMoney').val())
						window.location.replace("curencyAddress.html?type="+asset.type);

					}
                }
            });
			setTimeout(function(){
				m.initEnvent();
			},500);
		}
		
    };
    m.init();
})();