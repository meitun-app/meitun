(function () {
    var asset = {
		type:$.urlParam("type"),
		coinType:{},
		clickedIndex:0,
		coinid:'',
		cp:1,
		size:10,
		
		orderList:[],
		isLoad:false,
		totalPages:0
    };
	var myPage = null;
    var m = {
        init: function () {
			
            m.getAssetDetail();
			m.initPullRefreshEvent();
			m.getAssetDetailList();
            m.buildVue();
         
        },
		initPullRefreshEvent: function() {
			mui.plusReady(function () {
			    if(window.plus){
		var deceleration = mui.os.ios ? 0.003 : 0.0009;
					$('.mui-scroll-wrapper').scroll({
						bounce: false,
						indicators: true, //是否显示滚动条
						deceleration: deceleration
					});


			page.initContentRefresh("pullrefresh",function() {
				
				if(asset.isLoad){
					return;
				}
				
				asset.isLoad = true;
				asset.cp += 1;
				m.getAssetDetailList();
				
				
			});
			}else{
				
				$("#pullrefresh").hide();
			}
			})
		
		
		},
		initEnvent:function(){
			var myNav = new Swiper('#nav', {
				spaceBetween: 10,
				slidesPerView : 4,//导航显示个数
				watchSlidesProgress : true,
				watchSlidesVisibility : true,
				on:{
					tap: function(){
						asset.clickedIndex = myNav.clickedIndex;
						myPage.slideTo(asset.clickedIndex);
						m.updateNavPosition(asset.clickedIndex);
						
						asset.cp= 1;
						asset.orderList = [];
						m.getAssetDetailList();
					
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
		updateNavPosition:function(index){
			$('#nav .active-nav').removeClass('active-nav');
			
			var activeNav = $('#nav .swiper-slide').eq(index).addClass('active-nav');
			
		},
			getAssetDetailList: function () {
				var kind = "Income";
				  if(asset.clickedIndex == 0){
					  kind = "Income"
				  }else if(asset.clickedIndex == 1){
					  kind = "Send"
				  }else if(asset.clickedIndex == 2){
					  kind = "Receive"
				  }
					$.when($.ajax({
						url: $.apiUrl + '/api/coin/asset/detail/list?type='+asset.type+"&kind="+kind+"&page="+asset.cp+"&size="+asset.size,
						type: 'GET'
					})).done(function (d) {
						
						asset.isLoad = false;
						$.ylbAjaxHandler(d, function () {

							asset.totalPages = d.data.totalPages;
							if(asset.cp >= asset.totalPages){
								
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
								asset.orderList.push(data[i]);
							}
						
						});
					});
				},
				
		getAssetDetail: function () {
		    $.when($.ajax({
		        url: $.apiUrl + '/api/coin/asset/detail?type='+asset.type,
		        type: 'GET'
		    })).done(function (d) {
				
		        $.ylbAjaxHandler(d, function () {
					asset.coinid = d.data.id
					asset.coinType = d.data;
		        });
		    });
		},
        buildVue: function () {
            asset = new Vue({
                el: "#assets-main",
                data: asset,
                methods: {
					goSendCoin:function(){
					
						window.location.href="MyAssets_fsxq.html?type="+asset.coinType.coinType;
					},
					goBack:function(){
						window.location.href="MyAssets.html";
					}
                }
            });
			setTimeout(function(){
				m.initEnvent();
				// if(plus.window){
				// 	m.initPullRefreshEvent();
				// }
				
			},500);
        }
    };
    m.init();
})();