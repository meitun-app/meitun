(function () {
    var bank = {
		t:$.urlParam("t") || 0,
		url:$.urlParam("url") || '',
		bankList:[]
		
    };
    var m = {
        init: function () {
            m.getBankList();
            m.buildVue();
         
        },
		 getBankList: function () {
			
            $.when($.ajax({
                url: $.apiUrl + '/api/user/bank/list',
                type: 'POST'
            })).done(function (d) {
                $.ylbAjaxHandler(d, function () {
					
					bank.bankList = d.data;
					for(var i = 0 ; i < bank.bankList.length;i++){
						var b = bank.bankList[i];
						 var value = b.cardNo.replace(/\s/g,'').replace(/(\w{4})(?=\w)/g,"$1 ");
						 var array = value.split(" ");
						 b.cardNoList = array;
						 
					}
                });
            });
        },
		
        buildVue: function () {
            bank = new Vue({
                el: "#bankList-main",
                data: bank,
                methods: {
					choose:function(item){
							
							if(bank.t != 1){
								return;
							}
							window.location.href = "MyQianbao_tixian.html?bankId="+item.id;
					},
					delete:function (id) {
						
						$.when($.ajax({
							url: $.apiUrl + '/api/user/bank/delete',
							data:JSON.stringify({"id":id}),
							type: 'POST'
						})).done(function (d) {
							$.ylbAjaxHandler(d, function () {
								window.location.reload();
							});
						});
                    },
					goBack:function(){
						
						if(bank.url){
							window.location.href = bank.url;
						}else{
							window.location.href = "User.html";
						}
					}
                }
            });
        }
    };
    m.init();
})();