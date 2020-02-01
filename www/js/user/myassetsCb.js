(function () {
    var asset = {
		coinTypes:'',
		mobile:'',
		detail:{
			coinNum:0,
			toWalletAddr:'',
			fromWalletAddr:'',
			remarkCode:'',
			coinType:'',
			img:'',
			rechargeTime:'',
			rechargeName:''
		},
		isSubmit:false,
		currentIndex:0
		
    };
	var myPage = null;
    var m = {
        init: function () {
            m.getCoinTypeList();
            m.buildVue();
        },
		initEnvent:function(){
			var myNav = new Swiper('#nav', {
				spaceBetween: 10,
				slidesPerView : 4,//导航显示个数
				watchSlidesProgress : true,
				watchSlidesVisibility : true,
				on:{
					tap: function(){
						
						myPage.slideTo( myNav.clickedIndex);
						asset.currentIndex = myNav.clickedIndex;
					}
				}
			})
			myPage = new Swiper('#page',{
				on:{
				slideChangeTransitionStart: function(){
					m.updateNavPosition()
				}}
			})
			
			  var time = new Date();
			        var day = ("0" + time.getDate()).slice(-2);
			        var month = ("0" + (time.getMonth() + 1)).slice(-2);
			        var today = time.getFullYear() + "-" + (month) + "-" + (day);
			        asset.detail.rechargeTime = today;
		
		},
		updateNavPosition:function(){
			$('#nav .active-nav').removeClass('active-nav');
			var activeNav = $('#nav .swiper-slide').eq(myPage.activeIndex).addClass('active-nav');
			if (!activeNav.hasClass('swiper-slide-visible')) {
			  console.log(1);
				if (activeNav.index()>myNav.activeIndex) {
				  console.log(2);
					var thumbsPerNav = Math.floor(myNav.width/activeNav.width())-1
					myNav.slideTo(activeNav.index()-thumbsPerNav)
				}
				else {
				  console.log(3);
					myNav.slideTo(activeNav.index())
				}   
			}
		},
		getCoinTypeList: function () {
		    // $.when($.ajax({
		    //     url: $.apiUrl + '/api/coin/asset/coinType/list',
		    //     type: 'GET'
		    // })).done(function (d) {
				
		    //     $.ylbAjaxHandler(d, function () {
			// 		asset.coinTypes = d.data.coinTypes;
			// 		asset.mobile = d.data.mobile;
		    //     });
			// });
			$.when($.ajax({
		        url: $.apiUrl + '/api/userCoinAddr/getUserCoinAddr',
		        type: 'POST'
		    })).done(function (d) {
				
		        $.ylbAjaxHandler(d, function () {
					 asset.coinTypes = d.data
					 jQuery('#qrcode').qrcode({
						render: "canvas", //也可以替换为table
						width: 200,
						height: 200,
						text: d.data
					});
					 console.log(d.data)
					// asset.mobile = d.data.mobile;
		        });
			});
		},
        buildVue: function () {
            asset = new Vue({
                el: "#assets-main",
                data: asset,
                methods: {
					copyText:function(value){
						
						page.copyFun(value);
					},
					choose:function(){
						
						page.imgUp(function(t,status){
							if(status==200){
								var json = JSON.parse(t.responseText);
								asset.detail.img = json.data;
						   }else{
							   alert("上传失败："+status);
							  
						   }
						});
					},
					submit:function(){
						if(asset.isSubmit){
							return ;
						}
						if(!asset.detail.coinNum){
							mui.toast('充币数量不能为空')
							return ;
						}
						if(asset.detail.coinNum < 0){
							mui.toast('充币数量大于0')
							return ;
						}
						
						if(!asset.detail.fromWalletAddr){
							mui.toast('我的钱包不能为空')
							return ;
						}
						
						if(!asset.detail.fromWalletAddr){
							mui.toast('我的钱包不能为空')
							return ;
						}
						
						if(!asset.detail.rechargeTime){
							mui.toast('充币时间不能为空')
							return ;
						}
						
						if(!asset.detail.rechargeName){
							mui.toast('充币人不能为空')
							return ;
						}
						
						
						
						if(!asset.detail.img){
							mui.toast('充币截图不能为空')
							return ;
						}
						
						asset.isSubmit =true;
						var item = asset.coinTypes[asset.currentIndex];
						asset.detail.toWalletAddr = item.path;
						asset.detail.remarkCode = item.coinType +" "+asset.mobile;
						asset.detail.coinType = item.coinType;
						
						$.when($.ajax({
							url: $.apiUrl + '/api/coin/recharge/submit',
							data:JSON.stringify(asset.detail),
							type:'POST'
						})).done(function (d) {
							asset.isSubmit =false;
							$.ylbAjaxHandler(d,function(){
								mui.toast(d.errmsg);
								setTimeout(function(){
									window.history.back();
								},200)
							})
							
						});
					},
					goBack:function(){
						window.location.href="MyAssets.html";
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