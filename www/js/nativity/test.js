document.addEventListener( "plusready",  function()
                          {
                          var _BARCODE = 'qinglian',
                          B = window.plus.bridge;
                          var qinglian =
                          {
                          deviceAp : function (Argus1, Argus2, Argus3, successCallback, errorCallback )
                          {
                          var success = typeof successCallback !== 'function' ? null : function(args)
                          {
                          successCallback(args);
                          },
                          fail = typeof errorCallback !== 'function' ? null : function(code)
                          {
                          errorCallback(code);
                          };
                          callbackID = B.callbackId(success, fail);
                          
                          return B.exec(_BARCODE, "deviceAp", [callbackID, Argus1, Argus2, Argus3]);
                          },
                          scanDevice : function (Argus1,successCallback, errorCallback )
                          {
                          var success = typeof successCallback !== 'function' ? null : function(args)
                          {
                          successCallback(args);
                          },
                          fail = typeof errorCallback !== 'function' ? null : function(code)
                          {
                          errorCallback(code);
                          };
                          callbackID = B.callbackId(success, fail);
                          
                          return B.exec(_BARCODE, "scanDevice", [callbackID,Argus1]);
                          },
                          deviceList : function (Argus1, Argus2, Argus3, Argus4, successCallback, errorCallback )
                          {
                          var success = typeof successCallback !== 'function' ? null : function(args)
                          {
                          successCallback(args);
                          },
                          fail = typeof errorCallback !== 'function' ? null : function(code)
                          {
                          errorCallback(code);
                          };
                          callbackID = B.callbackId(success, fail);
                          
                          return B.exec(_BARCODE, "deviceList", [callbackID, Argus1, Argus2, Argus3, Argus4]);
                          },
                          changeWifi : function (Argus1, Argus2, Argus3, successCallback, errorCallback )
                          {
                          var success = typeof successCallback !== 'function' ? null : function(args)
                          {
                          successCallback(args);
                          },
                          fail = typeof errorCallback !== 'function' ? null : function(code)
                          {
                          errorCallback(code);
                          };
                          callbackID = B.callbackId(success, fail);
                          
                          return B.execSync(_BARCODE, "changeWifi", [callbackID, Argus1, Argus2, Argus3]);
                          },
                          starScan : function (Argus1, Argus2, Argus3, successCallback, errorCallback )
                          {
                          var success = typeof successCallback !== 'function' ? null : function(args)
                          {
                          successCallback(args);
                          },
                          fail = typeof errorCallback !== 'function' ? null : function(code)
                          {
                          errorCallback(code);
                          };
                          callbackID = B.callbackId(success, fail);
                          
                          return B.execSync(_BARCODE, "starScan", [callbackID, Argus1, Argus2, Argus3]);
                          },
                          //获取ssid
                          getCurrentSSID : function (successCallback, errorCallback )
                          {
                          var success = typeof successCallback !== 'function' ? null : function(args)
                          {
                          successCallback(args);
                          },
                          fail = typeof errorCallback !== 'function' ? null : function(code)
                          {
                          errorCallback(code);
                          };
                          callbackID = B.callbackId(success, fail);
                          
                          return B.exec(_BARCODE, "getCurrentSSID", [callbackID]);
                          },
                          isDeviceWifiConnected : function (successCallback, errorCallback )
                          {
                          var success = typeof successCallback !== 'function' ? null : function(args)
                          {
                          successCallback(args);
                          },
                          fail = typeof errorCallback !== 'function' ? null : function(code)
                          {
                          errorCallback(code);
                          };
                          callbackID = B.callbackId(success, fail);
                          
                          return B.exec(_BARCODE, "isDeviceWifiConnected", [callbackID]);
                          },
                          starScanV2: function (Argus1, Argus2, Argus3, successCallback, errorCallback )
                          {
                          var success = typeof successCallback !== 'function' ? null : function(args)
                          {
                          successCallback(args);
                          },
                          fail = typeof errorCallback !== 'function' ? null : function(code)
                          {
                          errorCallback(code);
                          };
                          callbackID = B.callbackId(success, fail);
                          
                          return B.exec(_BARCODE, "starScanV2", [callbackID, Argus1, Argus2, Argus3]);
                          },
                          deviceApV2: function (Argus1, Argus2, Argus3, successCallback, errorCallback )
                          {
                          var success = typeof successCallback !== 'function' ? null : function(args)
                          {
                          successCallback(args);
                          },
                          fail = typeof errorCallback !== 'function' ? null : function(code)
                          {
                          errorCallback(code);
                          };
                          callbackID = B.callbackId(success, fail);
                          
                          return B.exec(_BARCODE, "deviceApV2", [callbackID, Argus1, Argus2, Argus3]);
                          },  scanDeviceV2: function (Argus1, Argus2, Argus3, successCallback, errorCallback )
                          {
                          var success = typeof successCallback !== 'function' ? null : function(args)
                          {
                          successCallback(args);
                          },
                          fail = typeof errorCallback !== 'function' ? null : function(code)
                          {
                          errorCallback(code);
                          };
                          callbackID = B.callbackId(success, fail);
                          
                          return B.exec(_BARCODE, "scanDeviceV2", [callbackID, Argus1, Argus2, Argus3]);
                          }
                          ,  checkExsitSSID: function (Argus1,successCallback, errorCallback )
                          {
                          var success = typeof successCallback !== 'function' ? null : function(args)
                          {
                          successCallback(args);
                          },
                          fail = typeof errorCallback !== 'function' ? null : function(code)
                          {
                          errorCallback(code);
                          };
                          callbackID = B.callbackId(success, fail);
                          
                          return B.exec(_BARCODE, "checkExsitSSID", [callbackID, Argus1]);
                          },
                          checkSsid: function (Argus1,successCallback, errorCallback )
                          {
                          var success = typeof successCallback !== 'function' ? null : function(args)
                          {
                          successCallback(args);
                          },
                          fail = typeof errorCallback !== 'function' ? null : function(code)
                          {
                          errorCallback(code);
                          };
                          callbackID = B.callbackId(success, fail);
                          
                          return B.exec(_BARCODE, "checkSsid", [callbackID, Argus1]);
                          },
                          smsCode : function (Argus1, Argus2, Argus3, Argus4, successCallback, errorCallback )
                          {
                          var success = typeof successCallback !== 'function' ? null : function(args)
                          {
                          successCallback(args);
                          },
                          fail = typeof errorCallback !== 'function' ? null : function(code)
                          {
                          errorCallback(code);
                          };
                          callbackID = B.callbackId(success, fail);
                          
                          return B.exec(_BARCODE, "smsCode", [callbackID, Argus1, Argus2, Argus3, Argus4]);
                          },
                          PluginTestFunction : function (Argus1, Argus2, Argus3, Argus4, successCallback, errorCallback )
                          {
                          var success = typeof successCallback !== 'function' ? null : function(args)
                          {
                          successCallback(args);
                          },
                          fail = typeof errorCallback !== 'function' ? null : function(code)
                          {
                          errorCallback(code);
                          };
                          callbackID = B.callbackId(success, fail);
                          
                          return B.exec(_BARCODE, "PluginTestFunction", [callbackID, Argus1, Argus2, Argus3, Argus4]);
                          },
                          PluginTestFunctionArrayArgu : function (Argus, successCallback, errorCallback )
                          {
                          var success = typeof successCallback !== 'function' ? null : function(args)
                          {
                          successCallback(args);
                          },
                          fail = typeof errorCallback !== 'function' ? null : function(code)
                          {
                          errorCallback(code);
                          };
                          callbackID = B.callbackId(success, fail);
                          return B.exec(_BARCODE, "PluginTestFunctionArrayArgu", [callbackID, Argus]);
                          },
                          PluginTestFunctionSync : function (Argus1, Argus2, Argus3, Argus4)
                          {
                          return B.execSync(_BARCODE, "PluginTestFunctionSync", [Argus1, Argus2, Argus3, Argus4]);
                          },
                          PluginTestFunctionSyncArrayArgu : function (Argus)
                          {
                          return B.execSync(_BARCODE, "PluginTestFunctionSyncArrayArgu", [Argus]);
                          }
                          };
                          window.plus.qinglian = qinglian;
                          }, true );

