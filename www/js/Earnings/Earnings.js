(function () {
    var earnings = {
		coinAsset:{},
		deviceList:[],
		grandTotalIncome:0,
		yesterdayIncome:0,
		spaceNum:1,
		totalCoin:0,
		totalSum:0,//总共统计
		yesSum:0,//昨日统计
		rank:[],//排行榜
		dongTai:{},//动态
    };
	var myPage = null;
    var m = {
        init: function () {
			m.initEvent();
			m.getEarningsIndex();
            m.buildVue();
         
        },
		initEvent:function(){
				myPage = new Swiper('#page',{
						on:{
						slideChangeTransitionStart: function(){
							m.updateNavPosition()
						}}
				});
				
				var myNav = new Swiper('#nav', {
					spaceBetween: 10,
					slidesPerView : 3,//导航显示个数
					watchSlidesProgress : true,
					watchSlidesVisibility : true,
					on:{
						tap: function(){
							myPage.slideTo( myNav.clickedIndex);
							
							if(myNav.clickedIndex == 0){
								m.getEarningsIndex();
							}else{
								m.getPromotionIndex();
							}
						}
					}
				})
				//点击我要抵押
				$("#woyadiya").click(function(){
					if(earnings.coinAsset.coin == 0){
						$(".fil").trigger("click");
					}else{
						$(".diya,.overFlowDiv").show();
					}
					
				})
				$(".diyadibu,.del,.quxiao").click(function(){
					$(".wydy,.overFlowDiv,zhye").hide();
				})
				//账户余额不足
				$(".fil").click(function(){
					if(earnings.coinAsset.coin == 0){
						$(".zhye,.overFlowDiv").show();
					}
					
				})
				
				//冻结
				$("#nav").ready(function(){
					var a,b,c;
					a = $(window).height();    //浏览器窗口高度
					c = $("#nav").offset().top;    //元素距离文档（document）顶部的高度
					$(window).scroll(function(){
						b = $(this).scrollTop();   //页面滚动的高度  
						if(b>c){            
							$("#nav").addClass("nav_ding");
						   
						}else{
							$("#nav").removeClass("nav_ding");            
						}

					});
				});
				//end冻结
		},
		createHash:function(hashLength){
			return Array.from(Array(Number(hashLength) || 25), () => Math.floor(Math.random() * 36).toString(36)).join('');
		},
		renderRecords2:function(){

				let html = ''
		  for(let i=3;i>=0;i--){
			  let temp = dayjs().subtract(i, 'second').valueOf().toString().substring(2,10)
			  let time = dayjs().subtract(i, 'second').format('HH:mm:ss')
			  let hash = m.createHash()
			  html +=`
			  <li  style="display:flex;line-height:1.4;color:666;padding-bottom:10px;font-size:12px;">
																<span style="padding-right: 10px;">${temp}</span>
																<span style="flex:1;">...${hash}</span>
																<span>${time}</span>
				</li>
			  `
		  }
		  $('.offlinerecord').html(html)

		},
		renderRecords:function(type){
			let data = Math.floor(Math.random()*(24-15+1)+15)
			$('.cpurate').html(data+'%')
			$('.cpupng').attr('src',`../../img/icon/cpu${data}.png`)

			// console.log(data)

				let html = ''
		  for(let i=3;i>=0;i--){
			  let temp = dayjs().subtract(i, 'second').valueOf().toString().substring(2,10)
			  let time = dayjs().subtract(i, 'second').format('HH:mm:ss')
			  let hash = m.createHash()
			  html +=`
			  <li  style="display:flex;line-height:1.4;color:666;padding-bottom:10px;font-size:12px;">
																<span style="padding-right: 10px;">${temp}</span>
																<span style="flex:1;">...${hash}</span>
																<span>${time}</span>
				</li>
			  `
		  }
		  $('.records').html(html)
		},
		updateNavPosition:function(){
					$('#nav .active-nav').removeClass('active-nav');
					var activeNav = $('#nav .swiper-slide').eq(myPage.activeIndex).addClass('active-nav');
					if (!activeNav.hasClass('swiper-slide-visible')) {
					  
						if (activeNav.index()>myNav.activeIndex) {
						  
							var thumbsPerNav = Math.floor(myNav.width/activeNav.width())-1
							myNav.slideTo(activeNav.index()-thumbsPerNav)
						}
						else {
						  console.log(3);
							myNav.slideTo(activeNav.index())
						}   
					}
		},
		geTel:function (tel){
			var reg = /^(\d{3})\d{4}(\d{4})$/;  
			return tel.replace(reg, "$1****$2");
		},
		getPromotionIndex: function(){
			$.when($.ajax({
		        url: $.apiUrl + '/api/coin/asset/promotion/list',
		        type: 'GET'
		    })).done(function (d) {
				
		        $.ylbAjaxHandler(d, function () {
					earnings.totalSum = d.data.totalSum;
					earnings.yesSum = d.data.yesSum;
					// var dong = d.data.dongTai;
					// if(dong && dong.mobile){
					// 	dong.mobile = m.geTel(dong.mobile);
						
					// }else{
					// 	dong = {};
					// 	dong.mobile = '';
					// 	dong.coin = 0;
					// }
					//earnings.dongTai = dong;
					if(d.data.dongTaiList && d.data.dongTaiList.length){
						earnings.dongTai= d.data.dongTaiList
						// 动画
                       setTimeout(()=>{
						   const width = $('.content01').width()-83
						   $('#gundong').width(width)
						var speed=60; //数字越大速度越慢
						var tab=document.getElementById("gundong");
						var tab1=document.getElementById("gundongAreaMain2");
						var tab2=document.getElementById("gundongAreaMain3");
						tab2.innerHTML=tab1.innerHTML;
						function Marquee(){
						if(tab2.offsetWidth-tab.scrollLeft<=0)
						tab.scrollLeft-=tab1.offsetWidth
						else{
						tab.scrollLeft++;
						}
						}
						var MyMar=setInterval(Marquee,speed);
						tab.onmouseover=function() {clearInterval(MyMar)};
						tab.onmouseout=function() {MyMar=setInterval(Marquee,speed)};
					   },0)
					}
					if(d.data.rank && d.data.rank.length){
						earnings.rank = []
						for(var i = 0 ; i < d.data.rank.length;i++){
							if(i<10){
								earnings.rank.push(d.data.rank[i])
							}
						}
						// for(var i = 0 ; i < d.data.rank.length;i++){
						// 	//item = d.data.rank[i];
						// 	//var numb = item.path.split("/").length;
							
						// 	// if(numb-1 < 0){
						// 	// 	numb = 0;
						// 	// }else{
						// 	// 	numb = numb-1;
						// 	// }
						// 	//item.mobile = m.geTel(item.mobile);
							
						// 	//item.numbers = numb;
							
						// 	//earnings.rank.push(item);
						// 	//earnings.dongTai.push(item)
						// }

					}
		        });
		    });
		},
		getEarningsIndex: function () {
		    $.when($.ajax({
		        url: $.apiUrl + '/api/earnings/index',
		        type: 'GET'
		    })).done(function (d) {
				
		        $.ylbAjaxHandler(d, function () {
					earnings.coinAsset = d.data.coinAsset;
					earnings.grandTotalIncome = d.data.grandTotalIncome;
					earnings.yesterdayIncome = d.data.yesterdayIncome;
					earnings.deviceList = d.data.deviceList;
					
					earnings.totalCoin = earnings.spaceNum * earnings.coinAsset.pledgeSpaceRate;
					//添加记录
					if(earnings.deviceList.length){

						setTimeout(()=>{m.renderRecords2()})
						setTimeout(()=>{m.renderRecords()})

                        setInterval(() => {
 	                       m.renderRecords()
                        }, 1000);
					}

		        });
		    });
		},
        buildVue: function () {
            earnings = new Vue({
                el: "#earnings-main",
                data: earnings,
                methods: {
					jianFun:function(){
						if(earnings.spaceNum > 1){
							earnings.spaceNum -=1;
						}else{
							earnings.spaceNum =1;
						}
						earnings.totalCoin = earnings.spaceNum * earnings.coinAsset.pledgeSpaceRate;
					},
					addFun:function(){
						
						earnings.spaceNum +=1;
					
						earnings.totalCoin = earnings.spaceNum * earnings.coinAsset.pledgeSpaceRate;
						
					},
					pledgeSubmit:function(){
						
						var param = {coinAssetId:earnings.coinAsset.id,pledgeSpace:earnings.spaceNum,
						coinType:earnings.coinAsset.coinType}
						
						$.when($.ajax({
							url: $.apiUrl + '/api/earnings/pledge',
							data:JSON.stringify(param),
							type: 'POST'
						})).done(function (d) {
							$.ylbAjaxHandler(d, function () {
								mui.toast(d.errmsg);
								setTimeout(function(){
										window.location.reload();
								},500);
								
							});
						});
					},
					goRecharge:function(){
						window.location.href = "../User/MyAssets_cb.html";
					}
                }
            });
			// setTimeout(function(){
			// 	m.initEvent();
			// },500);
        }
    };
    m.init();
})();