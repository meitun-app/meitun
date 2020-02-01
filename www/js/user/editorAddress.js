(function () {
    var address = {
		id: $.urlParam("id") || 0,
        isBuy: $.urlParam("isBuy") || '',
		detail:{
            id:0,
            userName:"",
            telNumber:"",
            provinceName:"",
            cityName:"",
            countyName:"",
            detailInfo:"",
            isDefault:0
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
                    url: $.apiUrl + '/api/v2/address/detail?id='+address.id,
                    type: 'GET'
                })).done(function (d) {
                    $.ylbAjaxHandler(d, function () {

                        address.detail = d.data;
						console.log(d.data.isDefault)
						if(!d.data.isDefault){
							var test1 = document.getElementById('moren');
							 test1.src="../../img/icon/huisedagou@2x(2).png";
						}
                        address.allRegion = address.detail.provinceName+" "+address.detail.cityName+" "+address.detail.countyName
                    });
                });
            }
        },
		
      
        buildVue: function () {
            address = new Vue({
                el: "#editaddress-main",
                data: address,
                methods: {
					telNumberDown:function () {
					   if(address.detail.telNumber > 11 ){
						   address.detail.telNumber = address.detail.telNumber.substr(0, 10);
					   }
					},
					defaultAddress:function () {
						var test1 = document.getElementById('moren');
                        // console.log(address.detail.isDefault)
                        if(address.detail.isDefault == 0){
		               test1.src="../../img/icon/Shape@2x(2).png";
                            address.detail.isDefault = 1;
							
                        }else if(address.detail.isDefault == 1){
                          test1.src="../../img/icon/huisedagou@2x(2).png";
                            address.detail.isDefault = 0;
                        }
						console.log(889)
                    },
					deleteAddress:function () {
						var btn = ['确定', '取消'];
						mui.confirm('确定要删除吗?','', btn, function(e) {
							if(e.index == 0){
									$.when($.ajax({
										url: $.apiUrl + '/api/v2/address/delete',
										data:JSON.stringify({"id":address.detail.id}),
										type: 'POST'
									})).done(function (d) {
										$.ylbAjaxHandler(d, function () {
											window.location.href="address.html?isBuy="+address.isBuy;
										});
									});
								}
						
							})
                        
                    },
                    saveAddress:function () {
                        $.when($.ajax({
                            url: $.apiUrl + '/api/v2/address/save',
                            data:JSON.stringify(address.detail),
                            type: 'POST'
                        })).done(function (d) {
                            $.ylbAjaxHandler(d, function () {
                                window.location.href="address.html?isBuy="+address.isBuy;
                            });
                        });
                    },
					goBack:function(){
							window.location.href = "address.html";
						
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