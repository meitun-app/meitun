(function () {
    var recharge = {
		url:$.urlParam("url") || '',
		company:{},
		image:"",
		amount:0,
		transferTime:'',
		transferName:'',
		isLoad:false
    };
    var m = {
        init: function () {
			
			m.getIndex();
            m.buildVue();
         
        },
		initEvent:function(){
			
			        var time = new Date();
			        var day = ("0" + time.getDate()).slice(-2);
			        var month = ("0" + (time.getMonth() + 1)).slice(-2);
			        var today = time.getFullYear() + "-" + (month) + "-" + (day);
			        recharge.transferTime = today;
			
			 
			
		},
		getIndex:function(){
			$.when($.ajax({
				url: $.apiUrl + '/api/recharge/index',
				
				type: 'GET'
			})).done(function (d) {
				$.ylbAjaxHandler(d, function () {
					
					recharge.company = d.data;
				});
			});
		},
        buildVue: function () {
            recharge = new Vue({
                el: "#recharge-main",
                data: recharge,
                methods: {
					copyText:function(value){
						page.copyFun(value);
					},
					deleteImg:function(){
						recharge.image = '';
					},
					choose:function(){
						page.imgUp(function(t,status){
							if(status==200){
							var url = JSON.parse(t.responseText);
							
							recharge.image=url.data;
							
						   }else{
							   alert("上传失败："+status);
							  
						   }
						});
					},
					addRecharge:function(){
						if(recharge.image == ''){
							mui.toast("请上传凭证");
							return ;
						}
						if(recharge.amount == 0){
							mui.toast("请填写充值金额");
							return ;
						}
						if(recharge.transferTime == ''){
							mui.toast("请填写汇款时间");
							return ;
						}
						if(recharge.transferName == ''){
							mui.toast("请填写汇款人");
							return ;
						}
						
						if(recharge.isLoad){
							return;
						}
						recharge.isLoad = true;
						var param = {"image":recharge.image,"amount":recharge.amount,'transferName':recharge.transferName,'transferTime':recharge.transferTime}
						$.when($.ajax({
						    url: $.apiUrl + '/api/recharge/add',
							data:JSON.stringify(param),
						    type: 'POST'
						})).done(function (d) {
							recharge.isLoad = false;
						    $.ylbAjaxHandler(d, function () {
								mui.toast(d.errmsg);
								setTimeout(function(){
										if(recharge.url){
											window.location.href = recharge.url;
										}else{
											//window.location.href="MyQianbao.html";
											history.back(-1);
										}
										
								},500);
						    });
						});
					},
					goBack:function(){
						var url = recharge.url;
						if(url){
							window.location.href = url;
						}else{
							history.back(-1);
						}
					}
                }
            });
			
			setTimeout(function(){
					m.initEvent();
			},200);
        }
    };
    m.init();
})();