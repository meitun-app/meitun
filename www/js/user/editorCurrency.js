(function () {
    var address = {
		id: $.urlParam("id") || 0,
        isBuy: $.urlParam("isBuy") || '',
		detail:{
            id:0,
            userName:"",
            remark:"",
            provinceName:"",
            cityName:"",
            countyName:"",
            detailInfo:"",
            isDefault:0,
            currency:''
        },
		allRegion:""
		
    };
    var m = {
        init: function () {
            m.getDetail();
            m.buildVue();
         
        },
		initDom:function(){
			
            var $target = $('#J_Address');

            $target.citySelect();

            $target.on('click', function(event) {
                event.stopPropagation();
                $target.citySelect('open');
            });

            $target.on('done.ydui.cityselect', function(ret) {

                address.detail.provinceName = ret.provance;
                address.detail.cityName = ret.city;
                address.detail.countyName = ret.area;
                $(this).val(ret.provance + ' ' + ret.city + ' ' + ret.area);
            });
        
		},
		getDetail:function () {
            if(address.id > 0){
                $.when($.ajax({
                    url: $.apiUrl + '/api/userCoinAddr/getSendAddrInfo?id='+address.id,
                    type: 'POST',
                    data:JSON.stringify({id:address.id}),
                })).done(function (d) {
                    $.ylbAjaxHandler(d, function () {
                        address.detail.userName = d.data.name
                        address.detail.remark = d.data.node
                        address.detail.detailInfo = d.data.sendAddr
                    });
                });
            }
        },
		
      
        buildVue: function () {
            address = new Vue({
                el: "#editaddress-main",
                data: address,
                methods: {
					// telNumberDown:function () {
					//    if(address.detail.remark > 11 ){
					// 	   address.detail.remark = address.detail.remark.substr(0, 10);
					//    }
                    // },
                    checkoutCurrency:function(){
                        var picker = new mui.PopPicker(); 
                        picker.setData([{value:'1',text:'STH'},{value:'2',text:'YTA'},{value:'3',text:'FIL'},{value:'4',text:'USDT'}]);
                        picker.show( function(selectItems){
                            console.log(selectItems,44)
                            address.detail.currency = selectItems[0].text
                        } ) 
                    },
                    
					// defaultAddress:function () {
					// 	var test1 = document.getElementById('moren');
                    //     // console.log(address.detail.isDefault)
                    //     if(address.detail.isDefault == 0){
		            //    test1.src="../../img/icon/Shape@2x(2).png";
                    //         address.detail.isDefault = 1;
							
                    //     }else if(address.detail.isDefault == 1){
                    //       test1.src="../../img/icon/huisedagou@2x(2).png";
                    //         address.detail.isDefault = 0;
                    //     }
					// 	console.log(889)
                    // },
					deleteAddress:function () {
						var btn = ['确定', '取消'];
						mui.confirm('确定要删除吗?','', btn, function(e) {
                            //console.log(location.search.split('&'))
                            let name = ''
                            if(location.search.split('&')){
                                if(location.search.split('&')[2]){
                                    name = location.search.split('&')[2]
                                }
                            }
                           // return
							if(e.index == 0){
									$.when($.ajax({
										url: $.apiUrl + '/api/userCoinAddr/delSendAddrInfo',
										data:JSON.stringify({"id":address.id}),
										type: 'POST'
									})).done(function (d) {
										$.ylbAjaxHandler(d, function () {
                                            console.log(name)
                                            if(name){
                                                window.location.href="curencyAddress.html?"+name
                                            }else{
                                                window.location.href="curencyAddress.html"
                                            }
										});
									});
								}
						
							})
                        
                    },
                    saveAddress:function () {
                        console.log(typeof address.id)
                        if(!address.detail.userName){
                            mui.toast('联系人不能为空')
                            return
                        }
                        if(!address.detail.detailInfo){
                            mui.toast('收货地址不能为空')
                            return
                        }
                        const params = {}
                        params.name =address.detail.userName
                        params.sendAddr =address.detail.detailInfo
                        params.node = address.detail.remark
                        let name = ''
                        if(location.search.split('&')){
                            if(location.search.split('&')[2]){
                                name = location.search.split('&')[2]
                            }
                        }
                        if(address.id-0){
                            console.log(99986)
                            params.id = address.id
                            $.when($.ajax({
                                url: $.apiUrl + '/api/userCoinAddr/updateSendAddrInfo',
                                data:JSON.stringify(params),
                                type: 'POST'
                            })).done(function (d) {
                                $.ylbAjaxHandler(d, function () {
                                    if(name){
                                        window.location.href="curencyAddress.html?"+name
                                    }else{
                                        window.location.href="curencyAddress.html"
                                    }
                                    // window.location.href="curencyAddress.html";
                                });
                            });
                            return
                        }
                        $.when($.ajax({
                            url: $.apiUrl + '/api/userCoinAddr/addSendAddr',
                            data:JSON.stringify(params),
                            type: 'POST'
                        })).done(function (d) {
                            $.ylbAjaxHandler(d, function () {
                                if(name){
                                    window.location.href="curencyAddress.html?"+name
                                }else{
                                    window.location.href="curencyAddress.html"
                                }
                            });
                        });
                    },
					goBack:function(){
                        window.location.href = "../User/curencyAddress.html";
						
					}
				
                }
            });
			
			setTimeout(function(){
				m.initDom();
			},500);
        }
    };
    m.init();
})();