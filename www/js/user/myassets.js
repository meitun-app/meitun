(function () {
    var asset = {
		coinTypes:[],
		currentCoin:{},
		page:1,
		size:10,
		incomeList:[]
    };
	var myPage = null;
    var m = {
        init: function () {
			
            m.getMyAssetsIndex();
			m.getIncomeList();
            m.buildVue();
         
        },
		
		getMyAssetsIndex: function () {
		    $.when($.ajax({
		        url: $.apiUrl + '/api/coin/asset/index',
		        type: 'GET'
		    })).done(function (d) {
				
		        $.ylbAjaxHandler(d, function () {
					
					asset.coinTypes = d.data.data;
					asset.currentCoin = d.data.currentCoin;
				
		        });
		    });
		},
		getIncomeList:function(){
				
				$.when($.ajax({
					url: $.apiUrl + '/api/earnings/income?page='+asset.page+'&size='+asset.size,
					type: 'GET'
				})).done(function (d) {
					
					$.ylbAjaxHandler(d, function () {
						asset.incomeList = d.data;
					});
				});
		},
        buildVue: function () {
            asset = new Vue({
                el: "#assets-main",
                data: asset,
                methods: {
					goChongBi:function(){
					
						window.location.href="MyAssets_cb.html";
					},
					redeem:function(){
						$.when($.ajax({
							url: $.apiUrl + '/api/earnings/redeem',
							data:JSON.stringify({coinAssetId:asset.currentCoin.id}),
							type: 'POST'
						})).done(function (d) {
							$.ylbAjaxHandler(d, function () {
								mui.toast(d.errmsg);
								setTimeout(function(){
										window.location.reload();
								},500);
							});
						});
					},
					goBack:function(){
						window.location.href="User.html";
					}
                }
            });
        }
    };
    m.init();
})();