(function () {
    var assetDetail = {
		assetList:[],
		page:1,
		size:10,
		date:"",
		totalPages:0,
		isLoad:false,
		extend:{income:0,pay:0}
    };
    var m = {
        init: function () {
		//	m.testData();
            m.getDataIndex();
            m.buildVue();
        },
		initEvent: function() {
			
			
			mui.plusReady(function () {
			
			    if(window.plus){
					
					var deceleration = mui.os.ios ? 0.0009 : 0.0009;
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
								auto:true,
								contentrefresh: '正在加载...',
								callback: function() {
									
									if(assetDetail.isLoad){
										return;
									}
									assetDetail.isLoad = true;
									assetDetail.page += 1;
									
									m.getDataIndex();
									
								}
							}
						}
					});
					
				}else{
					$("#pullrefresh").hide();
				}
			})
			
			
		
		},
		
		getDataIndex: function () {
		    $.when($.ajax({
		        url: $.apiUrl + '/api/v2/user/wallet/detail/list?page='+assetDetail.page+'&size='+assetDetail.size+"&date="+assetDetail.date,
		        type: 'GET'
		    })).done(function (d) {
				assetDetail.isLoad = false;
		        $.ylbAjaxHandler(d, function () {
					
					assetDetail.totalPages = d.data.totalPages;
					assetDetail.extend = d.data.extend;
					if(assetDetail.page >= assetDetail.totalPages){
						if(mui('#pullrefresh').pullRefresh()){
							mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
						}
						
					}else{
						if(mui('#pullrefresh').pullRefresh()){
							mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
						}
						
					}
					var gdata = d.data.data;
                    for (var i = 0 ;i < gdata.length;i++){
                        assetDetail.assetList.push(gdata[i]);
                    }
				
		        });
		    });
		},
        buildVue: function () {
            assetDetail = new Vue({
                el: "#mingxi-main",
                data: assetDetail,
                methods: {
					dateInput:function (){
						assetDetail.assetList=[];
						assetDetail.page = 1;
						m.getDataIndex();
						
						
					},
					goBack:function(){
						
						window.location.href="MyQianbao.html";
						
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