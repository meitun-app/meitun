(function () {
    var address = {
		isBuy:$.urlParam("isBuy") || '',
		addressList:[]
		
    };
    var m = {
        init: function () {
            m.getAddressList();
            m.buildVue();
         
        },
		 getAddressList: function () {
			 
            $.when($.ajax({
                url: $.apiUrl + '/api/v2/address/list',
                type: 'POST'
            })).done(function (d) {
                $.ylbAjaxHandler(d, function () {

                    address.addressList = d.data;
                });
            });
        },
		initEvent:function(){
				// $(".Address .AddressTnformation").click(function(){
				// 	$(this).parent().css("border","1px solid #3399FF");
				// 	$(this).parent().siblings().css("border","0");
				// 	
				// })
		},
        buildVue: function () {
            address = new Vue({
                el: "#address-main",
                data: address,
                methods: {
					chooseAddress:function (id){
							$("#"+id).css("border","1px solid #3399FF");
							$("#"+id).siblings().css("border","0");	
						
						if(address.isBuy == 'buy'){
							window.location.href="../Mall/IntelligentDecoder.html?addressId="+id;
						}
					},
					goDetail:function (id) {
                        window.location.replace("editorAddress.html?isBuy="+address.isBuy+"&id="+id);
                    },
					goBack:function(){
						
						if(address.isBuy){
							window.location.href = "../Mall/Mall.html";
						}else{
							window.location.href = "User.html";
						}
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