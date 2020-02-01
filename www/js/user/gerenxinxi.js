(function () {
    var user = {
		userInfo:{}
    };
    var m = {
        init: function () {
			var info = $.localStorageHandler("get","userInfo");
			
			user.userInfo = JSON.parse(info);
            m.buildVue();
         
        },
		
        buildVue: function () {
            user = new Vue({
                el: "#gerenxx-main",
                data: user,
                methods: {
					gender:function(){
						var genderPicker = new mui.PopPicker();
						genderPicker.setData([{value:'1',text:'男'},{value:'2',text:'女'}]);
						var i = 0;
						genderPicker.show(function (selectItems) {
							
							if(i==0){
								i = 1;
								user.updateSex(selectItems[0].value);
							}
						 
						 })
					},
					updateSex:function(value){
						var param = {"sex":value}
						$.when($.ajax({
						    url: $.apiUrl + '/api/user/update',
							data:JSON.stringify(param),
						    type: 'POST'
						})).done(function (d) {
						    $.ylbAjaxHandler(d, function () {
								mui.toast(d.errmsg); 
								user.userInfo = d.data;
								$.localStorageHandler("set","userInfo",JSON.stringify(d.data));
						    });
						});
					},
					choose:function(){
						page.imgUp(function(t,status){
							if(status==200){
							var url = JSON.parse(t.responseText);
							
							user.updateHeadImg(url.data);
						   }else{
							   alert("上传失败："+status);
							  
						   }
						});
					},
					updateHeadImg:function(url){
						var param = {"avatar":url}
						$.when($.ajax({
						    url: $.apiUrl + '/api/user/update',
							data:JSON.stringify(param),
						    type: 'POST'
						})).done(function (d) {
						    $.ylbAjaxHandler(d, function () {
								mui.toast(d.errmsg); 
								user.userInfo = d.data;
								$.localStorageHandler("set","userInfo",JSON.stringify(d.data));
						    });
						});
					},
					goBack:function(){
						window.location.href="User.html";
					}
                }
            });
        }
    };
    m.init();
})();