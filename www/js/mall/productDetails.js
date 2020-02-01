(function () {
    var detail = {
		id:$.urlParam("id") || 0,
		info:{},
		gallery:[],
		productList:[],
		specificationList:[],
		attribute:[],
		infoDetails:[],
		chooseSpec:'请选择规格',
		orderCount:1,
		orderTotalPrice:0,
		payPassword:'',
		param:'',
		goodsAttributeVos:[]
		
    };
    var m = {
        init: function () {
			m.initEvent();
            m.getDetail();
            m.buildVue();
			
        },
		initEvent: function() {

		var deceleration = mui.os.ios ? 0.003 : 0.0009;
					// $('.mui-scroll-wrapper').scroll({
					// 	bounce: false,
					// 	indicators: true, //是否显示滚动条
					// 	deceleration: deceleration
					// });


			page.initContentRefreshParam("pullrefresh",function() {
				
				m.goGoodsDetail();
				this.endPullupToRefresh(true);
				
			},{
				"contentrefresh":"",
				"contentnomore":"",
				"contentinit":""
			});
		},
		goGoodsDetail:function(){
		
			window.location.href="Goodsdetails.html?id="+detail.id;	
		},
		getDetail: function () {
		    $.when($.ajax({
		        url: $.apiUrl + '/api/v2/goods/detail?id='+detail.id,
		        type: 'GET'
		    })).done(function (d) {
		        $.ylbAjaxHandler(d, function () {
					
		            detail.info = d.data.info;
		            detail.gallery = d.data.gallery;
		            detail.productList = d.data.productList;
		            detail.specificationList = d.data.specificationList;
		            
		            detail.attribute = d.data.attribute;
					detail.param = d.data.param;
					detail.goodsAttributeVos = d.data.goodsAttributeVos;
		
		            if(detail.info.goods_desc){
		                detail.infoDetails =  detail.info.goods_desc.split(";");
		            }
					detail.lovely = d.data.lovely;
					detail.concatInfo = d.data.concatInfo;
					
					detail.orderTotalPrice = detail.info.retail_price * detail.orderCount
		           
		
		        });
		    });
		},
       initDom:function(){
		 var slide2 = new auiSlide({
		     container:document.getElementById("aui-slide2"),
		     // "width":300,
		     "height":364,
		     "speed":300,
		     "autoPlay":4000, //自动播放
		     "pageShow":true,
		     "loop":true,
		     "pageStyle":'dot',
		     'dotPosition':'center'
		 })  
	   },
        buildVue: function () {
            detail = new Vue({
                el: "#detail-main",
                data: detail,
                methods: {
					checkNumberLen:function(){
							if(detail.payPassword.length == 6){
								detail.submitOrder();
							}
					},
					isCheckedAllSpec: function () {
					    return !this.getCheckedSpecValue().some(function (v) {
					        if (v.valueId == 0) {
					            return true;
					        }
					    });
					},
					//获取选中的规格信息
					getCheckedSpecValue: function () {
					    var checkedValues = [];
					    var _specificationList = detail.specificationList;
					    for (var i = 0; i < _specificationList.length; i++) {
					        var _checkedObj = {
					            nameId: _specificationList[i].specification_id,
								name: _specificationList[i].name,
					            valueId: 0,
					            valueText: ''
					        };
					        for (var j = 0; j < _specificationList[i].valueList.length; j++) {
					            if (_specificationList[i].valueList[j].selected) {
					                _checkedObj.valueId = _specificationList[i].valueList[j].id;
					                _checkedObj.valueText = _specificationList[i].valueList[j].value;
					            }
					        }
					        checkedValues.push(_checkedObj);
					    }
					
					    return checkedValues;
					
					},
					getCheckedSpecKey: function () {
					    var checkedValue = this.getCheckedSpecValue().map(function (v) {
					        return v.valueId;
					    });
					
					    return checkedValue.join('_');
					},
					getCheckedProductItem: function (key) {
						
					    return detail.productList.filter(function (v) {
					        if (v.goods_specification_ids.indexOf(key) > -1) {
					            return true;
					        } else {
					            return false;
					        }
					    });
					},
					clickSkuValue: function (nameId,valueId) {
					
					    var specNameId = nameId;
					    var specValueId = valueId;
					
					    //判断是否可以点击
					    //TODO 可以直接获取点击的属性名和属性值，不用循环
					    for (var i = 0; i < detail.specificationList.length; i++) {
					        var specition = detail.specificationList[i];
					
					        if (specition.specification_id == specNameId) {
					            for (var j = 0; j < detail.specificationList[i].valueList.length; j++) {
					
					                var valueList = specition.valueList;
					                for(var z = 0 ; z < valueList.length;z++){
					                    var valu = valueList[z];
					
					                    if(valu.id === specValueId){
					                        // var flag = false;
					                        // if(!valu.selected){
					                        //     flag = true;
					                        // }
					                        Vue.set(specition.valueList[z],'selected',true);
					                        //specition.valueList[z].selected=!valu.selected;
					                    }else{
					                        Vue.set(specition.valueList[z],'selected',false);
					                    }
					                }
					
					            }
					        }
					    }
					    //重新计算spec改变后的信息
					    this.changeSpecInfo();
					
					    //重新计算哪些值不可以点击
					},
					changeSpecInfo: function () {
					    var checkedNameValue = this.getCheckedSpecValue();
					
					    //设置选择的信息
					    var checkedValue = checkedNameValue.filter(function (v) {
					        if (v.valueId != 0) {
					            return true;
					        } else {
					            return false;
					        }
					    }).map(function (v) {
					        return v.valueText;
					    });
						
						detail.chooseSpec = "已选:"+checkedValue.join(",");
					    //'checkedSpecText': checkedValue.join('　')
					
					},
					submitOrder:function(){
					
						if (!this.isCheckedAllSpec()) {
							mui.toast("请选择规格");
							
							return false;
						}
						console.log(detail.orderCount)
						if(detail.info.goodsNumber < detail.orderCount) {
							mui.toast("库存不足，请调整选购数量！");
							
							return false;
						}
					
						//根据选中的规格，判断是否有对应的sku信息
						var checkedProduct = this.getCheckedProductItem(this.getCheckedSpecKey());
						
						if (!checkedProduct || checkedProduct.length <= 0) {
							mui.toast("没有对应的产品信息");
							return false;
						}
						
						var checkedSpecText = this.getCheckedSpecValue().map(function (v) {
								
							return v.name+":"+v.valueText;
						});
						
						var param ={};
						param.goodsId = detail.info.id;
						param.quantity = detail.orderCount;
						param.productId =checkedProduct[0].id;
						param.goods_specifition_name_value = checkedSpecText.join(";");
						
						$.localStorageHandler("set","cartGoods",JSON.stringify(param));
						
						window.location.href = "IntelligentDecoder.html";
						
					},
					jsReduce: function() {
					
						var count = detail.orderCount;
					
						if (count <= 1) {
							detail.orderCount =1;
						} else {
							detail.orderCount =parseInt(detail.orderCount) - 1;
							
						}
					},
					jsAdd: function(){
						detail.orderCount = parseInt(detail.orderCount)+ 1
					},
					goBack:function(){
					    window.location.href="Mall.html";
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