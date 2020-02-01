(function () {
    var logistics = {
		orderId:$.urlParam("orderId") || 0,
		logisticsList:[]
		
    };
    var m = {
        init: function () {
            m.getTrackList();
            m.buildVue();
         
        },
		 getTrackList: function () {
			 
            $.when($.ajax({
                url: $.apiUrl + '/api/v2/order/track',
				data:JSON.stringify({"id":logistics.orderId}),
                type: 'POST'
            })).done(function (d) {
                $.ylbAjaxHandler(d, function () {
					
					logistics.logisticsList = d.data;
                });
            });
        },
        buildVue: function () {
            logistics = new Vue({
                el: "#logistics-main",
                data: logistics,
                methods: {
					
					goBack:function(){
						window.location.href="MyOrder.html";
					}
                }
            });
        }
    };
    m.init();
})();