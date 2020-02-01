(function() {
 	var tjsber = {
 		device: [],
 		timer: null,
 		timerNumber: 0,
 		checkExsitSSIDTimer: null,
 		checkSsidTimer: null,
 		isCanClick: true,
 		btnText: "开始配网"
 	};
 	var m = {
 		init: function() {
 			m.initEvent();
 			m.buildVue();
 		},
 		initEvent: function() {},
 		buildVue: function() {
 			tjsber = new Vue({
 				el: "#tjsber-main",
 				data: tjsber,
 				methods: {
 					starScan3: function() {
 						tjsber.isCanClick = false;
 						tjsber.btnText = "配网中";

 						var ssid = "zhineng_";
 						//显示图片
						 document.getElementById('pic1').style.display = 'none';
						 document.getElementById('pic2').style.display = 'block';
 						var i = 0;
 						var timer = setInterval(() => {
 								i++
 								if (i > 60) {
 									clearInterval(timer)
 									window.location.href = "Tjsbsan.html";
 								}
 								plus.qinglian.isDeviceWifiConnected(function(result) {

 									if (plus.os.name == "iOS") {
 										if (typeof result == "object") {
 											result = JSON.stringify(result);
 											var data = JSON.parse(result);

 											if (data.code == 0) {
 												tjsber.checkZhinengExsitSSIDV3(ssid);
 												clearInterval(timer)
 											}
 										}
 									}
                                    else {

                                        var data = JSON.parse(result);
                                        if (data.code == 0) {

                                            tjsber.checkZhinengExsitSSIDV3(ssid);
                                            clearInterval(timer)
                                        }
 									}
 								}, function(error) {

 									mui.toast(error);
 								})
 							},
 							3000)
 					},
 					//检查设备热点是否存在
 					checkZhinengExsitSSIDV3: function(ssid) {

 						plus.qinglian.checkExsitSSID(ssid, function(result) {
 							if (typeof result == "object") {
 								result = JSON.stringify(result);
 							}
 							var data = JSON.parse(result);
 							if (data.code == 0) {
 								tjsber.checkChooseZhinengSSIDV3();

 							} else {
 								mui.toast(data.msg);
 								tjsber.isCanClick = true;
 								tjsber.btnText = "开始配网";
 							}

 						}, function(result) {
 							if (typeof result == "object") {
 								result = JSON.stringify(result);
 							}
 							var data = JSON.parse(result);
 							if (data.code == 0) {
 								tjsber.checkChooseZhinengSSIDV3();
 							} else {
 								mui.toast(data.msg);
 								tjsber.isCanClick = true;
 								tjsber.btnText = "开始配网";
 							}
 						});
 					},
 					checkChooseZhinengSSIDV3: function() {
 						var ssid = "zhineng_";
 						plus.qinglian.checkSsid(ssid, function(result) {
 							if (typeof result == "object") {
 								result = JSON.stringify(result);
 							}
 							var data = JSON.parse(result);
 							if (data.code == 0) {
 								mui.toast("连接设备热点成功开始配网");
 								tjsber.deviceApV2();
 							} else {
 								mui.toast(data.msg);
 								tjsber.isCanClick = true;
 								tjsber.btnText = "开始配网";
 							}

 						}, function(result) {
 							if (typeof result == "object") {
 								result = JSON.stringify(result);
 							}
 							var data = JSON.parse(result);
 							if (data.code == 0) {
 								mui.toast("连接设备热点成功开始配网");
 								tjsber.deviceApV2();
 							} else {
 								mui.toast(data.msg);
 								tjsber.isCanClick = true;
 								tjsber.btnText = "开始配网";
 							}
 						});
 					},
 					//1、检查是否存在 设备热点
 					//2、连接设备热点
 					//3、下发配网命令
 					//4、切回原来网络
 					starScan2: function() {
 						var ssid = "zhineng_";

 						tjsber.checkExsitSSIDTimer = setInterval(function() {
 							tjsber.checkZhinengExsitSSID(ssid);
 						}, 1000);
 					},
 					//检查设备热点是否存在
 					checkZhinengExsitSSID: function(ssid) {
 						plus.qinglian.checkExsitSSID(ssid, function(result) {

 							var data = JSON.parse(result);
 							if (data.code == 0) {
 								tjsber.timerNumber = 0;
 								window.clearInterval(tjsber.checkExsitSSIDTimer);
 								tjsber.checkSsidTimer = setInterval(function() {
 									tjsber.checkChooseZhinengSSID();
 								}, 1000);

 							} else {
 								tjsber.timerNumber += 1;
 								if (tjsber.timerNumber > 20) {
 									mui.toast("没有发现设备热点【zhineng_】");
 									tjsber.timerNumber = 0;
 									window.clearInterval(tjsber.checkExsitSSIDTimer);
 								}
 								// mui.toast(data.msg);
 							}

 						}, function(result) {
 							if (data.code == 0) {
 								tjsber.timerNumber = 0;
 								window.clearInterval(tjsber.checkExsitSSIDTimer);
 								tjsber.checkSsidTimer = setInterval(function() {
 									tjsber.checkChooseZhinengSSID();
 								}, 1000);

 							} else {
 								tjsber.timerNumber += 1;
 								if (tjsber.timerNumber > 20) {
 									mui.toast("没有发现设备热点【zhineng_】");
 									tjsber.timerNumber = 0;
 									window.clearInterval(tjsber.checkExsitSSIDTimer);
 								}
 							}
 						});
 					},
 					checkChooseZhinengSSID: function() {
 						var ssid = "zhineng_";
 						plus.qinglian.checkSsid(ssid, function(result) {

 							var data = JSON.parse(result);
 							if (data.code == 0) {
 								mui.toast("连接设备热点成功开始配网");
 								tjsber.timerNumber = 0;
 								window.clearInterval(tjsber.checkSsidTimer);
 								tjsber.deviceApV2();
 							} else {
 								tjsber.timerNumber += 1;
 								if (tjsber.timerNumber > 20) {
 									mui.toast("没有连上设备热点【zhineng_】");
 									tjsber.timerNumber = 0;
 									window.clearInterval(tjsber.checkSsidTimer);
 								}
 								// mui.toast(data.msg);
 							}

 						}, function(result) {
 							var data = JSON.parse(result);
 							if (data.code == 0) {
 								mui.toast("连接设备热点成功开始配网");
 								tjsber.timerNumber = 0;
 								window.clearInterval(tjsber.checkSsidTimer);
 								tjsber.deviceApV2();
 							} else {
 								tjsber.timerNumber += 1;
 								if (tjsber.timerNumber > 20) {
 									mui.toast("没有连上设备热点【zhineng_】");
 									tjsber.timerNumber = 0;
 									window.clearInterval(tjsber.checkSsidTimer);
 								}
 							}
 						});
 					},
 					startScan: function() {
 						var wifiInfo = $.localStorageHandler("get", "wifiInfo");
 						var json = JSON.parse(wifiInfo);
 						plus.qinglian.starScanV2(json.ssid, json.password, function(result) {

 							var data = JSON.parse(result);
 							if (data.code == 0) {
 								tjsber.deviceApV2();
 							} else {
 								mui.toast(data.msg);
 							}

 						}, function(result) {
 							var data = JSON.parse(result);
 							if (data.code == 0) {

 								tjsber.deviceApV2();
 							} else {
 								mui.toast(data.msg);
 							}
 						});
 					},


 					deviceApV2: function() {
 						var wifiInfo = $.localStorageHandler("get", "wifiInfo");
 						var json = JSON.parse(wifiInfo);
 						plus.qinglian.deviceApV2(json.ssid, json.password, function(result) {
 							if (typeof result == "object") {
 								result = JSON.stringify(result);
 							}
 							var data = JSON.parse(result);
 							if (data.code == 0) {
 								setTimeout(function() {
 									if (plus.os.name == "iOS") {

 										tjsber.checkSsidTimer = setInterval(function() {
 											tjsber.checkChooseOrginSSID();
 										}, 1000);

 									} else {
 										tjsber.scanDeviceV2();
 									}
 								}, 10000)
 							} else {
 								mui.toast(data.msg);
 								tjsber.isCanClick = true;
 								tjsber.btnText = "开始配网";
 							}
 						}, function(result) {
 							if (typeof result == "object") {
 								result = JSON.stringify(result);
 							}
 							var data = JSON.parse(result);
 							if (data.code == 0) {
 								setTimeout(function() {
 									if (plus.os.name == "iOS") {

 										tjsber.checkSsidTimer = setInterval(function() {
 											tjsber.checkChooseOrginSSID();
 										}, 1000);
 									} else {
 										tjsber.scanDeviceV2();
 									}

 								}, 10000)

 							} else {
 								mui.toast(data.msg);
 								tjsber.isCanClick = true;
 								tjsber.btnText = "开始配网";
 							}
 						});
 					},
 					checkChooseOrginSSID: function() {
 						var wifiInfo = $.localStorageHandler("get", "wifiInfo");
 						var json = JSON.parse(wifiInfo);
 						plus.qinglian.checkSsid(json.ssid, function(result) {
 							if (typeof result == "object") {
 								result = JSON.stringify(result);
 							}

 							var data = JSON.parse(result);
 							if (data.code == 0) {

 								tjsber.timerNumber = 0;
 								window.clearInterval(tjsber.checkSsidTimer);
 								setTimeout(function() {
 									tjsber.scanDeviceV2();
 								}, 5000);
 							} else {
 								tjsber.timerNumber += 1;
 								if (tjsber.timerNumber > 20) {
 									tjsber.timerNumber = 0;
 									window.clearInterval(tjsber.checkSsidTimer);
 								}
 								mui.toast(data.msg);
 							}

 						}, function(result) {
 							if (typeof result == "object") {
 								result = JSON.stringify(result);
 							}
 							var data = JSON.parse(result);
 							if (data.code == 0) {

 								tjsber.timerNumber = 0;
 								window.clearInterval(tjsber.checkSsidTimer);
 								setTimeout(function() {
 									tjsber.scanDeviceV2();
 								}, 5000);
 							} else {
 								tjsber.timerNumber += 1;
 								if (tjsber.timerNumber > 20) {

 									tjsber.timerNumber = 0;
 									window.clearInterval(tjsber.checkSsidTimer);
 								}
 								mui.toast(data.msg);
 							}
 						});
 					},
 					scanDeviceV2: function() {
 						var wifiInfo = $.localStorageHandler("get", "wifiInfo");
 						var json = JSON.parse(wifiInfo);
 						plus.qinglian.scanDeviceV2(json.ssid, json.password, function(result) {
 							tjsber.isCanClick = true;
 							tjsber.btnText = "开始配网";

 							if (typeof result == "object") {
 								result = JSON.stringify(result);
 							}

 							var d = JSON.parse(result);
 							var items = [];

 							if (d.code == 0) {
 								var item = {};
 								var mac = d.data.deviceMac;
 								if (mac) {
 									mac = mac.toLocaleLowerCase();
 									if (mac.indexOf(":") == -1) {
 										mac = mac.replace(/(.{2})/g, '$1:');
 										mac = mac.substr(0, 17);
 									}

 								}

 								item.deviceMac = mac;
 								item.iotToken = d.data.iotToken;
 								item.iotId = d.data.iotId;
 								items.push(item);
 								$.localStorageHandler("set", "device", JSON.stringify(items));
 								window.location.href = "Tjsb_jihuo.html";
 							} else {
 								mui.toast(d.msg);
 							}

 						}, function(result) {
 							tjsber.isCanClick = true;
 							tjsber.btnText = "开始配网";

 							if (typeof result == "object") {
 								result = JSON.stringify(result);
 							}

 							var d = JSON.parse(result);
 							var items = [];

 							if (d.code == 0) {

 								var item = {};

 								var mac = d.data.deviceMac;
 								if (mac) {
 									mac = mac.toLocaleLowerCase();
 									if (mac.indexOf(":") == -1) {
 										mac = mac.replace(/(.{2})/g, '$1:');
 										mac = mac.substr(0, 17);
 									}
 								}

 								item.deviceMac = mac;
 								item.iotToken = d.data.iotToken;
 								item.iotId = d.data.iotId;
 								items.push(item);

 								$.localStorageHandler("set", "device", JSON.stringify(items));
 								window.location.href = "Tjsb_jihuo.html";
 							} else {
 								mui.toast(d.msg);
 							}

 						});
 					},

 					doChangeWifi: function(ssid, password) {

 						var wifi = new WIFI();
 						var currentSSID = wifi.getSSID();
 						if (currentSSID == ssid) {
 							tjsber.timer = window.clearInterval(tjsber.timer);
 							tjsber.scanDevice();
 						} else {
 							plus.qinglian.changeWifi(ssid, password, true, function(result) {
 								mui.toast(result);

 								tjsber.timer = window.clearInterval(tjsber.timer);
 								tjsber.scanDevice();
 							}, function(result) {
 								mui.toast(result);
 							});
 						}
 					},
 					scanDevice: function() {

 						plus.qinglian.scanDevice(200, function(result) {


 							tjsber.device.push(JSON.parse(result));
 						}, function(result) {

 							alert(result);
 						});

 						setTimeout(function() {
 							var wifiInfo = $.localStorageHandler("get", "wifiInfo");
 							var json = JSON.parse(wifiInfo);
 							var timer = setInterval(m.doChangeWifi(json.ssid, json.password), 1000);

 							if (tjsber.device.length > 0) {
 								$.localStorageHandler("set", "device", JSON.stringify(tjsber.device));
 								window.location.href = "Tjsb_jihuo.html";
 							} else {
 								window.location.href = "Tjsbsan.html";
 							}



 						}, 30000);
 					},

 					bindDevice: function() {
 						if (tjsber.device.length == 0) {
 							mui.toast("没有发现设备");
 							return;
 						}
 						var macs = [];
 						for (var i = 0; i < tjsber.device.length; i++) {
 							var mc = tjsber.device[i].deviceMac;
 							if (mc && mc != '') {
 								macs.push(tjsber.device[i].deviceMac);
 							}

 						}
 						if (macs.length == 0) {
 							mui.toast("没有发现设备");
 							return;
 						}
 						mui.toast("mac==" + macs.join(","));
 						var macStr = macs.join();
 						if (macStr == '') {
 							return;
 						}
 						$.when($.ajax({
 							url: $.apiUrl + '/api/device/bind',
 							type: 'POST',
 							data: JSON.stringify({
 								"mac": macStr
 							})
 						})).done(function(d) {
 							$.ylbAjaxHandler(d, function() {
 								mui.toast(d.errmsg);
 								setTimeout(function() {
 									window.location.href = "../User/MyShebei.html";
 								}, 200)
 							});
 						});
 					}

 				}
 			});

 		}
 	};
 	m.init();
 })();
