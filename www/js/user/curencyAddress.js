(function () {
    var address = {
		isBuy:$.urlParam("isBuy") || '',
        addressList:[],
        type:'STH'
		
    };
    var m = {
        init: function () {
            m.getAddressList();
            m.buildVue();
            address.type = window.location.href.split('=')[1]
            console.log(window.location.href,585)
        },
		 getAddressList: function () {
			 
            // $.when($.ajax({
            //     url: $.apiUrl + '/api/v2/address/list',
            //     type: 'POST'
            // })).done(function (d) {
            //     $.ylbAjaxHandler(d, function () {
            //         address.addressList = d.data;
            //         console.log(d)
            //         //console.log(address.isBuy,455)
            //     });
            // });
            $.when($.ajax({
                url: $.apiUrl + '/api/userCoinAddr/getSendAddrList',
                type: 'POST'
            })).done(function (d) {
                $.ylbAjaxHandler(d, function () {
                    //console.log(d)
                    address.addressList = d.data;
                    // address.addressList = d.data;
                    // console.log(address)
                    // console.log(address.isBuy,455)
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
                        //User/MyAssets_fsxq.html
                        //console.log(id,location.search.split('=')[1])
                        let name = location.search.split('=')[1]
							$("#"+id).css("border","1px solid #3399FF");
                            $("#"+id).siblings().css("border","0");	
                             name = name?name:'STH'
                            window.location.href="../User/MyAssets_fsxq.html?type="+name+'&id='+id;
						// if(address.isBuy == 'buy'){
						// 	window.location.href="../Mall/IntelligentDecoder.html?addressId="+id;
						// }
					},
					goDetail:function (id) {
                        let name = location.search.split('=')[1]
                        if(name){
                            window.location.replace("editorCurrency.html?isBuy="+address.isBuy+"&id="+id+'&type='+name);
                        }else{
                            window.location.replace("editorCurrency.html?isBuy="+address.isBuy+"&id="+id);
                        }
                        // console.log(name)
                        //window.location.replace("editorCurrency.html?isBuy="+address.isBuy+"&id="+id);
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