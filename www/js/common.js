 var page=null;
 var ws=null;
	page={  
		imgUp:function(callback){  
			var m=this;  
			plus.nativeUI.actionSheet({cancel:"取消",buttons:[  
				{title:"拍照"},  
				{title:"从相册中选择"}  
			]}, function(e){//1 是拍照  2 从相册中选择  
				switch(e.index){  
					case 1: page.appendByCamera(callback);break;  
					case 2:page.appendByGallery(callback);break;  
				}  
			});  
		},
		appendByCamera:function(callback){
				
				plus.camera.getCamera().captureImage(function(e){
				
					plus.io.resolveLocalFileSystemURL(e, function(entry) { 
						var path = entry.toLocalURL(); 
						
						plus.zip.compressImage({  
							src: path,  
							dst: "_doc/chat/gallery/" + path,  
							quality: 20,  
							overwrite: true  
						}, function(e) {  
							page.upload($.apiUrl+"/api/upload/upload",e.target,callback);	
						}, function(err) {  
							console.error("压缩失败：" + err.message);  
						});  
					}, function(e) { 
						mui.toast("读取拍照文件错误：" + e.message); 
					}); 
		
				});    
			},
		appendByGallery:function(callback){
			
			
			
			
			plus.gallery.pick(function(path){
				plus.zip.compressImage({  
					src: path,  
					dst: "_doc/chat/gallery/" + path,  
					quality: 20,  
					overwrite: true  
				}, function(e) {  
					page.upload($.apiUrl+"/api/upload/upload",e.target,callback);	
				}, function(err) {  
					console.error("压缩失败：" + err.message);  
				});  
				
				
		
			});
		},
		
		upload :function(server,src,callback){
			   var wt=plus.nativeUI.showWaiting();
			   var task=plus.uploader.createUpload(server,
				   {method:"POST"},
				   function(t,status){
					   wt.close(); //关闭等待提示按钮
					    callback(t,status)
				   }
				  
				   // function(t,status){ //上传完成
					  //  if(status==200){
						 //   //alert("上传成功："+t.responseText);
						 //   console.info(t.responseText);
						 //   wt.close(); //关闭等待提示按钮
						 //   return t.responseText.data;
					  //  }else{
						 //   alert("上传失败："+status);
						 //   wt.close();//关闭等待提示按钮
					  //  }
				   // }
			   );
			   
			   //添加其他参数
			 
			   task.addFile(src,{key:"file"});
			   task.start();
		},
		copyFun:function(copyValue){
			
				//判断是安卓还是ios
				if(mui.os.ios){
					//ios
					var UIPasteboard = plus.ios.importClass("UIPasteboard");
					var generalPasteboard = UIPasteboard.generalPasteboard();
					//设置/获取文本内容:
					generalPasteboard.plusCallMethod({
						setValue:copyValue,
						forPasteboardType: "public.utf8-plain-text"
					});
					generalPasteboard.plusCallMethod({
						valueForPasteboardType: "public.utf8-plain-text"
					});
					mui.toast("已成功复制到剪贴板");
				}else{
					//安卓
					var context = plus.android.importClass("android.content.Context");
					var main = plus.android.runtimeMainActivity();
					var clip = main.getSystemService(context.CLIPBOARD_SERVICE);
					plus.android.invoke(clip,"setText",copyValue);
					mui.toast("已成功复制到剪贴板");
				}
		},
		/**  
         * @constructor  
         * @description 得到定位信息  
         */  
        getlocation: function(callback) {  
            mui.plusReady(function() {  
                var data = {  
                    result: false,  
                    code: '',  
                    msg: '',  
                    position: null  
                };  
                plus.geolocation.getCurrentPosition(function(p) {  
                    //debugCom.log(JSON.stringify(p))  
                    data.result = true;  
                    data.position = p;  
                    data.code = 0;  
                    data.msg = '';  
                    //回调              
                    callback(data);  
                }, function(e) {  
                    console.log(JSON.stringify(e))  
                    data.result = false;  
                    data.code = e.code;  
                    switch(e.code) {  
                        case 1:  
                            data.msg = "GPS访问被拒绝 或 GPS未开启";  
                            break;  
                        case 2:  
                            data.msg = "位置信息不可用";  
                            break;  
                        case 3:  
                            data.msg = "获取用户位置的请求超时";  
                            break;  
                        default:  
                            data.msg = e.message;  
                            break;  
                    }  
                    if(data.msg == '')  
                        data.msg = "获取用户位置的请求超时";  
                    //回调  
                    callback(data);  
                }, {  
                    provider: 'baidu'  
                });  
                /*  
                 provider: (String 类型 )优先使用的定位模块可取以下供应者： "system"：表示系统定位模块，支持wgs84坐标系； "baidu"：表示百度定位模块，支持gcj02/bd09/bd09ll坐标系； "amap"：表示高德定位模板，支持gcj02坐标系。 默认值按以下优先顺序获取（amap>baidu>system），若指定的provider不存在或无效则返回错误回调。 注意：百度/高德定位模块需要配置百度/高德地图相关参数才能正常使用。  
                 * */  
            });  
        },  
        /**  
         * @constructor  
         * @description 得到地址  
         */  
        getaddress: function(callback) {  
            this.getlocation(function(data) {  
                var resdata = {  
                    result: false,  
                    msg: '',  
                    data: ''  
                }  
                if(data.result) {  
                    resdata.result = true;  
                    resdata.data = data.position.addresses;  
                    callback(resdata);  
                } else {  
                    resdata.msg = data.msg;  
                    callback(resdata);  
                }  
            })  
        },
		initContentRefresh:function (id,callback){
			mui.init({
				pullRefresh: {
					container: '#'+id,
					// down: {
					// 	callback: pulldownRefresh
					// },
					up: {
						contentrefresh: '正在加载...',
						contentnomore:'没有更多数据了',
						callback: callback
					}
				}
			});
		},
		initContentRefreshParam:function (id,callback,param){
			mui.init({
				pullRefresh: {
					container: '#'+id,
					// down: {
					// 	callback: pulldownRefresh
					// },
					up: {
						contentrefresh: param.contentrefresh,
						contentnomore:param.contentnomore,
						contentinit:param.contentinit,
						callback: callback
					}
				}
			});
		},
		initDownContentRefresh:function (id,callback,param){
			mui.init({
				pullRefresh: {
					container: '#'+id,
					height:2,
					 contentdown : "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
					 contentover : "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
					 contentrefresh : "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
					down: {
						callback: callback
					},
					
				}
			});
		}
	}
	

	