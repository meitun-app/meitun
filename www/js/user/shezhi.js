(function () {
    var shezhi = {
		list:[]
    };
    var m = {
        init: function () {
			
           
            m.buildVue();
         
        },
	
        buildVue: function () {
            shezhi = new Vue({
                el: "#shezhi-main",
                data: shezhi,
                methods: {
					goBack:function(){
						window.location.href="User.html";
					}
                }
            });
        }
    };
    m.init();
})();