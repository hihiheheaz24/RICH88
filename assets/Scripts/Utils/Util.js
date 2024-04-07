var GET_ANDROID_ID = "1";
var GET_BUNDLE_ID = "2";
var GET_VERSION_ID = "3";
var LOGIN_FACEBOOK = "4";
var VEYRY_PHONE = "6";
var CHAT_ADMIN = "7";
var DEVICE_VERSION = "8";
var LOGIN_FACEBOOK_CANCEL = "9";
var LOGIN_FACEBOOK_ERROR = "10";
var BUY_IAP = "11";
var SEND_SMS = "12";
var OPEN_FANPAGE = "14";
var OPEN_GROUP = "15";
var CHECK_NETWORK = "16";
var PUSH_NOTI_OFFLINE = "17";
var CARRIER_NAME = "19"; //for IOS
var CHECK1SIM = "20"; //for Android
var CHECK2SIM = "21";
var HIDESPLASH = "22";
var CALL_PHONE = "24";
var COPPY_TO_CLIP = "27";
var IAP_PURCHASE = "28";
var IAP_INIT = "29";
var IAP_PURCHASE_SUCCESS = "30";
var IAP_PURCHASE_ERROR = "31";
var IAP_PURCHASE_CANCEL = "32";
var OPEN_ADMOB = "33";
var EVENT_FIREBASE = "50";
var TRACKING_SCREEN = "51";
var SET_USER_ID = "52";
var GET_WIFI_LEVEL = "53";

var VERY_OTP = "VERY_OTP";
var RESEND_OTP = "RESEND_OTP";
cc.NativeCallJS = function (evt, params) {
    console.log("iNativeCallJS------------------------>   DEMO " + evt + "     " + params);
    switch (evt) {
        case GET_WIFI_LEVEL:
            console.log("check wifi level la : ", params)
          
            if(Global.GameView){
                let leveWifi = parseInt(params);
                if(leveWifi > 0){
                    Global.GameView.levelWifi.spriteFrame = Global.GameView.listLeveWifi[params];
                    Global.GameView.levelWifi.node.getChildByName("lb-wifi").getComponent(cc.Label).string = "Mạng"
                }
                else{
                    Global.GameView.levelWifi.spriteFrame = Global.GameView.listLeveWifi[params];
                    Global.GameView.levelWifi.node.getChildByName("lb-wifi").getComponent(cc.Label).string = "Mất kết nối"
                }
            }
            break;
        case GET_ANDROID_ID:
            cc.sys.localStorage.setItem("GEN_DEVICEID", params);
            Global.deviceId = params;
            console.log("check device id la : ", params)
            break;
        case GET_BUNDLE_ID:
            require("GameManager").getIns().bundleID = params;
            cc.sys.localStorage.setItem("GEN_BUNDLEID", params);
            break;
        case GET_VERSION_ID:
            require("GameManager").getIns().versionGame = params;
            cc.sys.localStorage.setItem("GEN_VERSIONGAME", params);
            cc.log("gia tri versionGame la===" + params);
            break;
        case LOGIN_FACEBOOK:
            cc.log("tra ve token la===" + params);
            cc.sys.localStorage.setItem("Token", params);
            if (Global.LoginView) {
                var data = {
                    token: params,
                };
                Global.LoginView.LoginWithFacebookData(data);
            }
            break;
        case LOGIN_FACEBOOK_CANCEL:
            cc.log("LOGIN_FACEBOOK_CANCEL la===" + params);
            break;
        case LOGIN_FACEBOOK_ERROR:
            cc.log("LOGIN_FACEBOOK_CANCEL la===" + params);
            break;
        case IAP_PURCHASE_SUCCESS:
            console.log("IAP_PURCHASE_SUCCESS la===" + params);
            Global.UIManager.showMiniLoading();
            let dataIAP = atob(params);
            if (dataIAP) {
                var receipt = JSON.parse(dataIAP);
            }
            var data = {
                ProductId: receipt.productId,
                TransactionId: Global.ShopIAP.transId,
                PackageName: receipt.packageName,
                PurchaseTime: receipt.purchaseTime,
                PurchaseState: receipt.purchaseState,
                PurchaseToken: receipt.purchaseToken,
                SystemProductId: Global.ShopIAP.systemProductId,
            };
            console.log("data send confirm iap : " + JSON.stringify(data));
            require("BaseNetwork").request(Global.ConfigLogin.ConfirmIapOrder, data, Global.ShopIAP.ConfirmSuccess);
            break;
        case IAP_PURCHASE_ERROR:
            console.log("IAP_PURCHASE_ERROR la===" + params);
            Global.UIManager.hideMiniLoading();
            // if (Global.ShopPopup) Global.ShopPopup.OnIAPError();
            break;
        case IAP_PURCHASE_CANCEL:
            console.log("IAP_PURCHASE_CANCEL la===" + params);
            Global.UIManager.hideMiniLoading();
            // if (Global.ShopPopup) Global.ShopPopup.OnIAPCancel();
            break;
        case VEYRY_PHONE:
            let phone = params;
            console.log("verify thanh cong data la : ", params);
            if (params != "") {
                if (Global.ProfilePopup) Global.ProfilePopup.onVeryPhoneSuccess(params);
            } else {
                if (Global.ProfilePopup) Global.ProfilePopup.onVeryPhoneFail();
            }
            break;
        case VERY_OTP:
            console.log("verry code ");
            if (Global.ProfilePopup) Global.ProfilePopup.onReviceOTP();
            break;
        case DEVICE_VERSION:
            require("GameManager").getIns().deviceVersion = params;
            break;
        case CHECK_NETWORK:
            if (params === "-1") {
                cc.log("Chuc mung ban da duoc ra dao!!!");
            }
            break;
        case CARRIER_NAME:
            cc.log("mcc la: " + params);
            require("GameManager").getIns().mccsim1 = parseInt(params);
            break;
        case CHECK1SIM:
            cc.log("===D: check 1 sim", params);
            Global.CariName = params;
            break;
        case CHECK2SIM:
            cc.log("===D: check 2 sim", params);
            // if (params.indexOf("_") !== -1) {//co 2 sim tren may
            //     var listCountrycode = params.split("_");
            //     cc.log("listCountrycode", listCountrycode);
            //     for (var i = 0; listCountrycode.length; i++) {
            //         if (i == 0) require('GameManager').getIns().mccsim1 = parseInt(listCountrycode[0]);
            //         if (i == 1) require('GameManager').getIns().mccsim2 = parseInt(listCountrycode[1]);
            //     }
            // } else {//chi co 1 sim tren may
            //     require('GameManager').getIns().mccsim1 = parseInt(params);
            // }
            break;

        case COPPY_TO_CLIP:
            Global.UIManager.showAlertMini("Đã Sao Chép");
            break;

        case OPEN_ADMOB:
            cc.log("REWARD_ADMOB:=====" + params);
            cc.systemEvent.emit('REWARD_ADMOB', params)
            break;

        case "100":
            console.log("iaploggggsigndata:=====" + params);

            break;
        case "101":
            console.log("iaploggggsignature:=====" + params);

            break;

        case "200":
            console.log("iaploggggreceiptData:=====" + params);

            break;
    }
};

cc.NativeCallIAP = function (evt, params) {
    cc.log("iapobj------------------------>" + evt + params);
    switch (evt) {
        case "100":
            console.log("iaploggggsigndata:=====" + params);

            break;
        case "101":
            console.log("iaploggggsignature:=====" + params);

            break;
    }
};

var Util = cc.Class({
    statics: {
        onCallNative(evt, params) {
            if (cc.sys.os === cc.sys.OS_ANDROID && cc.sys.isNative) {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "onCallFromJavascript", "(Ljava/lang/String;Ljava/lang/String;)V", evt, params);
            } else if (cc.sys.os === cc.sys.OS_IOS && cc.sys.isNative) {
                jsb.reflection.callStaticMethod("AppController", "onCallFromJavaScript:andParams:", evt, params);
            }
        },
        getGetDeviceId() {
            Util.onCallNative(GET_ANDROID_ID, "");
        },
        getGetWifiLevel() {
            Util.onCallNative(GET_WIFI_LEVEL, "");
        },
        closewebview() {
            Util.onCallNative("dcm", "");
        },
        getBundleId() {
            Util.onCallNative(GET_BUNDLE_ID, "");
        },
        getVersionId() {
            Util.onCallNative(GET_VERSION_ID, "");
        },
        onLoginFb(reLogin = "0") {
            Util.onCallNative(LOGIN_FACEBOOK, "" + reLogin);
        },
        onVeryPhone(phone) {
            Util.onCallNative(VEYRY_PHONE, phone);
        },
        onVeryOTP(otp) {
            Util.onCallNative(VERY_OTP, otp);
        },
        onReSendOTP() {
            Util.onCallNative(RESEND_OTP);
        },
        onChatAdmin() {
            let data = {
                pageID: require("GameManager").getIns().fanpageID,
                pageUrl: require("GameManager").getIns().fanpageURL,
            };
            cc.log("pageID la===" + require("GameManager").getIns().fanpageID);
            cc.log("pageURL la===" + require("GameManager").getIns().fanpageURL);
            let str = JSON.stringify(data);
            Util.onCallNative(CHAT_ADMIN, str);
            // cc.sys.openURL(require("GameManager").getIns().u_chat_fb);
        },
        getDeviceVersion() {
            Util.onCallNative(DEVICE_VERSION, "");
        },
        onBuyIap(itemID) {
            console.log("click buy iap ", itemID);
            Util.onCallNative(BUY_IAP, itemID);
        },
        // sendTagOneSignal(key, value) {
        //     let data = {
        //         key: key,
        //         value: value
        //     };
        //     Util.onCallNative(SEND_TAG_ONESIGNAL, JSON.stringify(data));
        //     cc.log("sendTagOneSignal: " + JSON.stringify(data));
        // },

        openFanpage() {
            let data = {
                pageID: require("GameManager").getIns().fanpageId,
                pageUrl: require("GameManager").getIns().fanpage,
            };

            Util.onCallNative(OPEN_FANPAGE, JSON.stringify(data));
        },
        openGroup() {
            let data = {
                groupID: require("GameManager").getIns().groupID,
                groupUrl: require("GameManager").getIns().groupURL,
            };
            // cc.log('---->  openGroup');
            Util.onCallNative(OPEN_GROUP, JSON.stringify(data));
        },

        checkNetwork() {
            // Util.onCallNative(CHECK_NETWORK, "");
        },

        getCarrierName() {
            Util.onCallNative(CARRIER_NAME, "");
        },

        sendCheck1Sim() {
            cc.log("sendCheck1Sim");
            Util.onCallNative(CHECK1SIM, "");
        },

        sendCheck2Sim() {
            cc.log("sendCheck2Sim");
            Util.onCallNative(CHECK2SIM, "");
        },
        
        hideSplash() {
            Util.onCallNative(HIDESPLASH, "");
        },
        // getInfoDeviceSML() {
        //     cc.log("Call Android:getInfoDeviceSML");
        //     Util.onCallNative(GET_INFO_DEVICE_SML, "");
        //     let deviceId = cc.sys.localStorage.getItem("GEN_DEVICEID");
        //     if (deviceId == null) {
        //         require("Util").getGetDeviceId();
        //     }
        // },
        onCallPhone(phoneNumber) {
            Util.onCallNative(CALL_PHONE, phoneNumber);
        },
        onPurchase(id) {
            Util.onCallNative(IAP_PURCHASE, id);
        },
        onInitIAP(data) {
            Util.onCallNative(IAP_INIT, data);
        },
        sendSMS(data) {
            //   Util.onCallNative(SEND_SMS, data);
        },

        onCoppyToClip(str) {
            Util.onCallNative(COPPY_TO_CLIP, str);
        },
        onShowAdMob(typeAds) {
            Util.onCallNative(OPEN_ADMOB, typeAds);
        },
        pushNotiOffline(data) {
            console.log("UtilCocos: Push noti offline!");
            Util.onCallNative(PUSH_NOTI_OFFLINE, data);
        },
        onSendTrackingFirebase(str) {
            console.log("UtilCocos: Send tracking to firebase! " + str);
            Util.onCallNative(EVENT_FIREBASE, str);
        },
        onSendTrackingFirebaseScreen(str) {
            console.log("UtilCocos: Send tracking screen to firebase! " + str);
            Util.onCallNative(TRACKING_SCREEN, str);
        },
        onSendTrackingSetUserID(str) {
            console.log("UtilCocos: Send tracking Set User id to firebase! " + str);
            Util.onCallNative(SET_USER_ID, str);
        }
    },
});

module.exports = Util;
