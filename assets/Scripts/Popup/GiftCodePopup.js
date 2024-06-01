cc.Class({
    extends: require("ParentChangePositionEDB"),
    ctor(){
        this._time = "";
        this._captchaMd5 = "";
    },

    properties: {
        captchaInputGift : cc.EditBox,
        textGift : cc.EditBox,
        captchaImgGift : cc.Node,
    },

    onLoad(){
        this.resignEdb(this.captchaInputGift);
        this.resignEdb(this.textGift);

        this.resignNext(this.textGift , "captchaInputGift");

    },

    show() {
        Global.onPopOn(this.node);
        this.ReloadCaptchaGift();
        this.textGift.string = "";
        if(!MainPlayerInfo.phoneNumber){
            this.textGift.placeholder = "Xác thực số điện thoại trước";
        }
        else{
            this.textGift.placeholder = "NHẬP GIFTCODE"
        }
    },

    ReloadCaptchaGift() {
        Global.UIManager.showMiniLoading();
        this.captchaInputGift.string = "";
        var data = {
		}
		require("BaseNetwork").request(Global.GameConfig.UrlGameLogic.ShopGetCaptchaUrl, data, this.HandleGetCaptchaGift);
    },

    HandleGetCaptchaGift(_data){
        Global.UIManager.hideMiniLoading();
        var capcha = JSON.parse(_data);
        if(capcha.c != 0) {
            this.LoadCaptchaFail();
        } else {
            Global.GiftCodePopup.base64 = capcha.d[0];
            Global.GiftCodePopup._captchaMd5 = capcha.d[1];
            Global.GiftCodePopup._time = capcha.d[2];
            Global.GiftCodePopup.createCaptcha(Global.GiftCodePopup.base64);
        }
    },

    createCaptcha(base64) {
		require("BaseNetwork").getCapcha(base64 , this.captchaImgGift);
    },
    
    CheckCaptchaGift() {
        let captcha = this.captchaInputGift.string;
        Global.UIManager.showMiniLoading();
        this.VerifyCaptcha (captcha, this._captchaMd5, this._time);
    },

    VerifyCaptcha(captcha, md5, time){
		var data = {
            Text: captcha,
            Encrypt: md5,
            Verify:time,
        }
		require("BaseNetwork").request(Global.GameConfig.UrlGameLogic.ShopCheckCaptchaUrl, data, this.SuccessCaptchaGift);
    },
    
    SuccessCaptchaGift (response) {
        Global.UIManager.hideMiniLoading();
        let model = JSON.parse(response);
        if(model.c != 0) {
            Global.UIManager.showCommandPopup (MyLocalization.GetText ("CAPTCHA_FAIL"), null);
            Global.GiftCodePopup.ReloadCaptchaGift();
        } else {
            if (Global.GiftCodePopup.textGift.string.replace(" ","").length == 0) {
                Global.UIManager.showCommandPopup (MyLocalization.GetText ("NAME_KHOANG_TRANG"), null);
                return;
            }
            if(!MainPlayerInfo.phoneNumber){
                Global.UIManager.showCommandPopup("Bấm vào Avatar của bạn để xác thực số điện thoại");
                return;
            }
            let msgData = {};
            msgData[1] = Global.GiftCodePopup.textGift.string;
            require("SendRequest").getIns().MST_Client_Send_Gift_Code (msgData);
        }
    },

    LoadCaptchaFail() {
        Global.UIManager.showCommandPopup (MyLocalization.GetText ("LOAD_CAPTCHA_FAIL"), null);
    },

    edbBegan(){
        if(!MainPlayerInfo.phoneNumber){
            Global.UIManager.showCommandPopup("Bấm vào Avatar của bạn để xác thực số điện thoại");
            this.textGift.maxLength = 0;
        }
        else{
            this.textGift.maxLength = 20;
        }
    },

    Hide() {
        Global.onPopOff(this.node);
    },

    onDestroy(){
        Global.GiftCodePopup = null;
    },
});
