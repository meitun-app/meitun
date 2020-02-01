(function () {
    var bangzhu = {
		list:[]
    };
    var m = {
        init: function () {
			
            m.getBangZhuList();
            m.buildVue();
         
        },
		initDom:function(){
			 $(".flip").click(function(){
				$(this).siblings().slideToggle("slow");
				$(this).toggleClass("sanjiao");
			  });
		},
		getBangZhuList: function () {
			
            $.when($.ajax({
                url: $.apiUrl + '/api/v2/goods/issue',
                type: 'GET'
            })).done(function (d) {
                $.ylbAjaxHandler(d, function () {
					bangzhu.list = d.data;
					
                });
            });
        },
        buildVue: function () {
            bangzhu = new Vue({
                el: "#bangzhu-main",
                data: bangzhu,
                methods: {
					
                }
            });
			setTimeout(function(){
				m.initDom();
			},500);
        }
    };
    m.init();
})();