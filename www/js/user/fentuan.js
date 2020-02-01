(function() {
	var fentuan = {
		index: {},
		levelStar: [],
		refferList: [],
		size: 10,
		page: 1,
		isLoad: false,
		totalPages:0
	};
	var m = {
		init: function() {
			m.initEvent();
			m.getFenTuanIndex();
			m.getReferrerList();
			m.buildVue();

		},
		getFenTuanIndex: function() {
			$.when($.ajax({
				url: $.apiUrl + '/api/v2/user/star/fans/index',
				type: 'GET'
			})).done(function(d) {
				$.ylbAjaxHandler(d, function() {
					fentuan.index = d.data;
					var level = d.data.starLevel;
					for (var i = 0; i < level; i++) {
						fentuan.levelStar.push(i);
					}
				});
			});
		},
		getReferrerList: function(isLoad) {
			
			$.when($.ajax({
				url: $.apiUrl + '/api/v2/user/refferList?page=' + fentuan.page + "&size=" + fentuan.size,
				type: 'GET'
			})).done(function(d) {
				fentuan.totalPages = d.data.totalPages;

				if(fentuan.page >= fentuan.totalPages){
					if(mui('#pullrefresh').pullRefresh()){
							mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
					}
				}else{
					if(mui('#pullrefresh').pullRefresh()){
							mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
					}
				}
				$.ylbAjaxHandler(d, function() {
					var gdata = d.data.data;
					for (var i = 0; i < gdata.length; i++) {
						fentuan.refferList.push(gdata[i]);
					}
				});
			});
		},
		initEvent: function() {

		var deceleration = mui.os.ios ? 0.003 : 0.0009;
				


			page.initContentRefresh("pullrefresh",function() {

				if(fentuan.isLoad){
					return;
				}
				fentuan.isLoad = true;
				fentuan.page += 1;
				m.getReferrerList();
			});

		},
		buildVue: function() {
			fentuan = new Vue({
				el: "#fentuan-main",
				data: fentuan,
				methods: {

					starLevelFun: function(val) {
						var ary = [];
						for (var i = 0; i < val; i++) {
							ary.push(i);
						}
						return ary;
					},
					goBack:function(){
						
						window.location.href = "User.html";
						
					}
				}
			});
		}
	};
	m.init();
})();
