(function () {
    var mall = {
		sz:10,
		cp:1,
		goodsList:[],
		totalPages:0,
		isLoad:false
		
    };
    var m = {
        init: function () {
			
            m.getGoodsList();
            m.buildVue();
         
        },
		initEvent: function() {
// 		if(window.plus){
// 			var deceleration = mui.os.ios ? 0.003 : 0.0009;
// 					$('.mui-scroll-wrapper').scroll({
// 						bounce: false,
// 						indicators: true, //是否显示滚动条
// 						deceleration: deceleration
// 					});
// 
// 
// 			page.initContentRefresh("pullrefresh",function() {
// 				
// 				if(mall.isLoad){
// 					return;
// 				}
// 				mall.isLoad = true;
// 				mall.cp += 1;
// 				m.getGoodsList();
// 				
// 			});
// 		}else{
// 			$("#pullrefresh").hide();
// 		}
		
		
		mui.plusReady(function () {
			
			    if(window.plus){
					
				var deceleration = mui.os.ios ? 0.0003 : 0.0009;
					// $('.mui-scroll-wrapper').scroll({
					// 	bounce: false,
					// 	indicators: true, //是否显示滚动条
					// 	deceleration: deceleration
					// });
// 
					
					mui.init({
						pullRefresh: {
							container: '#pullrefresh',
							up: {
								auto:true,
								contentrefresh: '正在加载...',
								callback: function() {
									
									if(mall.isLoad){
										return;
									}
									mall.isLoad = true;
									mall.cp += 1;
									m.getGoodsList();
									
								}
							}
						}
					});
					
				}else{
					$("#pullrefresh").hide();
				}
			})
		
		},
		getGoodsList: function () {
			
            $.when($.ajax({
                url: $.apiUrl + '/api/v2/goods/list?cp='+mall.cp+"&sz="+mall.sz,
                type: 'GET'
            })).done(function (d) {
				mall.isLoad = false;
                $.ylbAjaxHandler(d, function () {
					
					mall.totalPages = d.data.totalPages;
					
					if(mall.cp >= mall.totalPages){
						if(mui('#pullrefresh').pullRefresh()){
							mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
						}
						//mui('#pullrefresh').pullRefresh().disablePullupToRefresh();
					}else{
						if(mui('#pullrefresh').pullRefresh()){
							mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
						}
						
					}
					var gdata = d.data.data;
                    for (var i = 0 ;i < gdata.length;i++){
                        mall.goodsList.push(gdata[i]);
                    }
                });
            });
        },
       
//         bindScorll:function(){
//             $(window).scroll(function() {
//                 var mayLoadContent = $(window).scrollTop() >= $(document).height() - $(window).height();
// 
//                 var docHeight = $(document).height();
//                 if (mayLoadContent) {
// 
//                     m.goToNextPage(); //跳转到下一页的方法
//                 }
//             });
//         },
        buildVue: function () {
            mall = new Vue({
                el: "#mall-main",
                data: mall,
                methods: {

        
					goDetail:function(id){
					    window.location.href = "ProductDetails.html?id="+id;
					}
					
                }
            });
			
			// setTimeout(function(){
			// 	m.initEvent();
			// },500);
        }
    };
    m.init();
})();