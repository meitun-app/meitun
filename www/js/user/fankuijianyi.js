(function () {
    var fankuijianyi = {
		type:[],
		cycle:[],
		imgs:[],
		detail:{
			typeValue:0,
			cycleValue:0,
			content:'',
			linkMethod:''
			
		}

    };
    var m = {
        init: function () {
            m.getConfig();
            m.buildVue();
         
        },
		
		 getConfig: function () {
            $.when($.ajax({
                url: $.apiUrl + '/api/feedback/config',
                type: 'POST'
            })).done(function (d) {
                $.ylbAjaxHandler(d, function () {
					
					fankuijianyi.type = d.data.type;
					fankuijianyi.cycle = d.data.cycle; 
				});
			});
        },
		
        buildVue: function () {
            fankuijianyi = new Vue({
                el: "#fankuijianyi-main",
                data: fankuijianyi,
                methods: {
						deleteImg:function(index){
							fankuijianyi.imgs.splice(index,1);
						},
						choose:function(){
							if(fankuijianyi.imgs.length>4){
								mui.toast('最多添加4张图片');
								return
							}
							page.imgUp(function(t,status){
								if(status==200){
								var json = JSON.parse(t.responseText);
								fankuijianyi.imgs.push(json.data);
							   }else{
								   alert("上传失败："+status);
								  
							   }
							});
						},
						save:function(){
							var param = {};
							param.mobile=fankuijianyi.detail.linkMethod;
							param.feedType=fankuijianyi.detail.typeValue;
							param.feedCycle=fankuijianyi.detail.cycleValue;
							
							param.content=fankuijianyi.detail.content;
							param.imgs = fankuijianyi.imgs;
							
							$.when($.ajax({
								url: $.apiUrl + '/api/feedback/save',
								data:JSON.stringify(param),
								type:'POST'
							})).done(function (d) {
								$.ylbAjaxHandler(d,function(){
									mui.toast(d.errmsg);
									setTimeout(() => {
										window.history.go(-1)
									}, 1000);
									// window.history.go(-1)
									// window.location.href('User/User.html')
									// window.location.reload()
								})
								
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