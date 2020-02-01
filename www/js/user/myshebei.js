(function () {
    var myshebei = {
		page:1,
		size:10,
		sheBeiList:[],
		totalNum:0,
		deviceName:'',
		checkId:0,
		
    };
    var m = {
        init: function () {
			
            m.getSheBeiList();
            m.buildVue();
         
        },
		getSheBeiList: function () {
		    $.when($.ajax({
		        url: $.apiUrl + '/api/device/list',
		        type: 'POST'
		    })).done(function (d) {
		        $.ylbAjaxHandler(d, function () {
					myshebei.sheBeiList = d.data.devices;
					myshebei.totalNum = d.data.totalNumber;
		        });
		    });
		},
        buildVue: function () {
            myshebei = new Vue({
                el: "#myshebei-main",
                data: myshebei,
                methods: {
					
					godetail:function (id){
						window.location.href = "../Activity/kqjhq.html?id="+id;;
					},
					goAddSheBei:function(){
						window.location.href = "../Activity/Tjsbyi.html";
					},
					mm:function(id){
						
							myshebei.checkId = id;
							$(".overFlowDiv,.cmm").show();
					},
					rename:function(){
						var param = {id:myshebei.checkId,name:myshebei.deviceName};
							$.when($.ajax({
							    url: $.apiUrl + '/api/device/rename',
								data:JSON.stringify(param),
							    type: 'POST'
							})).done(function (d) {
							    $.ylbAjaxHandler(d, function () {
									mui.toast(d.errmsg);
									setTimeout(function(){
											window.location.reload();
									},200);
							    });
							});
					},
					deleteBtn:function(id){
						
						 var btnArray = ['取消', '确定'];
						mui.confirm('确定删除设备', '', btnArray, function(e) {
							if (e.index == 1) {
								var param = {id:id};
								$.when($.ajax({
								    url: $.apiUrl + '/api/device/unbind',
									data:JSON.stringify(param),
								    type: 'POST'
								})).done(function (d) {
								    $.ylbAjaxHandler(d, function () {
										mui.toast(d.errmsg);
										setTimeout(function(){
												window.location.reload();
										},200);
								    });
								});
							}else{
									window.location.reload();
							}
						})
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