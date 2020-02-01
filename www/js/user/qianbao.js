(function () {
    var qianbao = {
		
		asset:{},
		bank:{},
		wallet:0,
		payPassword:"",
		totalAmount:0,
		yesterAmount:0,
		page:1,
		size:10,
		incomeList:[]
    };
    var m = {
        init: function () {
			m.getWalletIndex();
			m.getWalletQueryIncome();
			//m.downRefresh();
            m.buildVue();
         
        },
		reload:function(){
			
			m.getWalletIndex();
			m.getWalletQueryIncome();
		},
		//这里加了 好像 全局都有了
		initEvent: function() {
			
			mui.plusReady(function () {
			   
			    if(window.plus){
				
					mui.init({
						pullRefresh: {
							container: '#pullrefresh',
							down: {
								height :50,//可选,默认50.触发下拉刷新拖动距离,
								range : 50, //可选 默认100px,控件可下拉拖拽的范围
								offset : 30, //可选 默认0px,下拉刷新控件的起始位置
								color : '#2BD009', //可选，默认“#2BD009” 下拉刷新控件颜色
								style : 'circle',//可选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
					
								callback: function() {
								
									 m.reload();
									 mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); 
								}
							}
						}
					});
					
				}else{
					$("#pullrefresh").hide();
				}
			})
			
			
		
		},
		getWalletIndex:function(){
			$.when($.ajax({
			    url: $.apiUrl + '/api/v2/user/wallet/index',
			    type: 'GET'
			})).done(function (d) {
			    $.ylbAjaxHandler(d, function () {
					
					qianbao.asset = d.data.asset;
					qianbao.totalAmount = d.data.totalAmount;
					qianbao.yesterAmount = d.data.yesterAmount;
			    });
			});
		},
		getWalletQueryIncome:function(){
			$.when($.ajax({
			    url: $.apiUrl + '/api/v2/user/wallet/queryIncome?page='+qianbao.page+'&size='+qianbao.size,
			    type: 'GET'
			})).done(function (d) {
			    $.ylbAjaxHandler(d, function () {
					qianbao.incomeList = d.data;
			    });
			});
		},

        buildVue: function () {
            qianbao = new Vue({
                el: "#qianbao-main",
                data: qianbao,
                methods: {
					
					goBack:function(){
						window.location.href="User.html";
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