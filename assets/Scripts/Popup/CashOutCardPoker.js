// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    ctor() {
        this.cardAmount = 0;
        this.typeNspCardOut = 0;
        this.valueCashOut = 0;
        this.valueCashOutCost = 0;
        this.transelementValueTelco = [];
        this.listShopView = [];
        this.listSelectValueView = [];
        this.listNSP = [];
        this.listSelectNSPView = [];
        this.listDataCashOut = [];
    },

    properties: {
        shopView: cc.Node,
        selectValueView: cc.Node,
        selectNSPView: cc.Node,
        objListButtonNSP: cc.Node,
        objListButtonValue: cc.Node,
        textValueNSP: cc.Label,
        textValueChip: cc.Label,
        captchaImgGift : cc.Node,
        captchaInputGift : cc.EditBox,
        inPutPin : cc.EditBox,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.log("chay vao onload doi thuong")
        this.listDataCashOut = Global.cardTopupInfosOut;
        this.CheckNSPActive();
        this.checkDataValue();
        Global.CashOutCard = this;
    },

    onEnable(){
        this.ReloadCaptchaGift();
    },

    ReloadCaptchaGift() {
        Global.UIManager.showMiniLoading();
        this.captchaInputGift.string = "";
        var data = {
		}
		require("BaseNetwork").request(Global.GameConfig.UrlGameLogic.ShopGetCaptchaUrl, data, this.HandleGetCaptchaGift);
    },

    createCaptcha(base64) {
		require("BaseNetwork").getCapcha(base64 , this.captchaImgGift);
    },

    CheckCaptchaGift() {
        let captcha = this.captchaInputGift.string;
        if(captcha === ""){
            Global.UIManager.showCommandPopup("Mã Captcha không được để trống", null);
            return;
        }
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

    HandleGetCaptchaGift(_data){
        Global.UIManager.hideMiniLoading();
        var capcha = JSON.parse(_data);
        if(capcha.c != 0) {
            this.LoadCaptchaFail();
        } else {
            Global.CashOutCard.base64 = capcha.d[0];
            Global.CashOutCard._captchaMd5 = capcha.d[1];
            Global.CashOutCard._time = capcha.d[2];
            Global.CashOutCard.createCaptcha( Global.CashOutCard.base64);
        }
    },

    SuccessCaptchaGift (response) {
        Global.UIManager.hideMiniLoading();
        let model = JSON.parse(response);
        if(model.c != 0) {
            Global.UIManager.showCommandPopup (MyLocalization.GetText ("CAPTCHA_FAIL"), null);
            Global.CashOutCard.ReloadCaptchaGift();
        } else {
            Global.CashOutCard.onSendCashOutCard();
        }
    },

    LoadCaptchaFail() {
        Global.UIManager.showCommandPopup (MyLocalization.GetText ("LOAD_CAPTCHA_FAIL"), null);
    },


    CheckNSPActive() {
        this.listNSP = [];
        if (Global.GameConfig.FeatureConfig.CashOutByMobiFeature == EFeatureStatus.Open) {
            this.typeNspCardOut = NSP_TYPE.MOBIFONE;
            this.listNSP[this.listNSP.length] = "MobiFone";
            this.textValueNSP.string = "MobiFone";
        } 
        if (Global.GameConfig.FeatureConfig.CashOutByVinaFeature == EFeatureStatus.Open) {
            this.typeNspCardOut = NSP_TYPE.VINAPHONE;
            this.listNSP[this.listNSP.length] = "VinaPhone";
            this.textValueNSP.string = "VinaPhone";
        } 
        if (Global.GameConfig.FeatureConfig.CashOutByViettelFeature == EFeatureStatus.Open) {
            this.typeNspCardOut = NSP_TYPE.VIETTEL;
            this.listNSP[this.listNSP.length] = "Viettel";
            this.textValueNSP.string = "Viettel";
        }

        this.SetListNSP();
    },

    checkDataValue() {
        let listCard = [];
        for (let i = 0; i < this.listDataCashOut.length; i++) {
            if (this.listDataCashOut[i].NSPType == this.typeNspCardOut) {
                listCard.push(this.listDataCashOut[i]);
            }
        }
        this.SetListValueNSP(listCard);
    },

    SetListValueNSP(listCard) {
        cc.log("liscard cash out la : ", listCard);

        for (let i = 0; i < this.listShopView.length; i++) {
            this.listShopView[i].node.active = false;
            this.listSelectValueView[i].node.active = false;
        }

        for (let i = 0; i < listCard.length; i++) {
            if (i < this.listShopView.length) {
                this.listShopView[i].SetUp(listCard[i].CardAmount, listCard[i].GoldCost);
                this.listSelectValueView[i].SetUp(listCard[i].CardAmount, listCard[i].GoldCost);
            } else {
                let itemTrans = cc.instantiate(this.shopView);
                itemTrans.parent = this.shopView.parent;
                let itemView = itemTrans.getComponent("ShopTelcoView");
                itemView.node.active = true;
                itemView.SetUp(listCard[i].CardAmount, listCard[i].GoldCost);
                this.listShopView.push(itemView);

                let item2Trans = cc.instantiate(this.selectValueView);
                item2Trans.parent = this.selectValueView.parent;
                let item2View = item2Trans.getComponent("ShopTelcoView");
                item2View.node.active = true;
                item2View.SetUp(listCard[i].CardAmount, listCard[i].GoldCost);
                this.listSelectValueView.push(item2View);
            }
        }

        for (let i = 0; i < this.listSelectValueView.length; i++) {
            let index = i;
            this.listSelectValueView[i].node.off(cc.Node.EventType.TOUCH_END, () => {
                this.ClickBtnSelectValueOut(listCard[index].CardAmount, listCard[index].GoldCost);
            }, this);
            this.listSelectValueView[i].node.on(cc.Node.EventType.TOUCH_END, () => {
                this.ClickBtnSelectValueOut(listCard[index].CardAmount, listCard[index].GoldCost);
            }, this);
        }
    },

    SetListNSP() {
        if (this.listSelectNSPView.length > 0)
        for (let i = 0; i < this.listSelectNSPView.length; i++) {
            if (this.listSelectNSPView != null)
                this.listSelectNSPView[i].node.active = false;
        }

        for (let i = 0; i < this.listNSP.length; i++) {
            if (i < this.listSelectNSPView.length) {
                this.listSelectNSPView[i].SetUp(this.listNSP[i], 0);
            } else {
                let itemTrans = cc.instantiate(this.selectNSPView);
                itemTrans.parent = this.selectNSPView.parent;
                let itemView = itemTrans.getComponent("ShopTelcoView");
                itemView.SetUp(this.listNSP[i], 0);
                this.listSelectNSPView.push(itemView);
            }
        }

        for (let i = 0; i < this.listSelectNSPView.length; i++) {
            let index = i;
            this.listSelectNSPView[i].node.off(cc.Node.EventType.TOUCH_END, () => {
                this.ClickBtnNSP(this.listNSP[index]);
            }, this);
            this.listSelectNSPView[i].node.on(cc.Node.EventType.TOUCH_END, () => {
                this.ClickBtnNSP(this.listNSP[index]);
            }, this);
        }

    },

    ClickBtnNSP(strNSP) {
        cc.log("Click item NSP " + strNSP);
        this.objListButtonNSP.active = false;
        this.typeNspCardOut = this.GetNameNSP(strNSP);
        this.textValueNSP.string = strNSP;
    },

    ClickBtnSelectValueOut(cardAmout, cardCost){
        cc.log("chay vao set value ");
        this.objListButtonValue.active = false;
        this.valueCashOut = cardAmout;
        this.valueCashOutCost = cardCost;
        this.textValueChip.string = Global.formatNumber(cardAmout);
    },

    GetNameNSP(strNSP) {
        cc.log(" :  " + strNSP);
        if (strNSP == "Viettel") {
            return NSP_TYPE.VIETTEL;
        } else if (strNSP == "VinaPhone") {
            return NSP_TYPE.VINAPHONE;
        } else if (strNSP == "MobiFone") {
            cc.log(" 1 :  " + strNSP);
            return NSP_TYPE.MOBIFONE;
        } else if (strNSP == "Momo") {
            return NSP_TYPE.MOMO;
        }
        cc.log("2 :  " + strNSP);
        return NSP_TYPE.VIETTEL;
    },

    onSendCashOutCard() {
        if(this.inPutPin.string === ""){
            Global.UIManager.showCommandPopup("Vui Lòng nhập mã PIN ( Mã hệ thống gửi về sau khi xác nhận số điện thoại )");
            return;
        }
        if(this.valueCashOutCost === 0){
            Global.UIManager.showCommandPopup("Vui lòng chọn mệnh giá");
            return;
        }
        Global.UIManager.showConfirmPopup(Global.formatString(MyLocalization.GetText("CAST_OUT_NOTIFY"),
            [this.valueCashOutCost, this.textValueNSP.string,
            this.textValueChip.string]),
            () => {
                if (!MainPlayerInfo.checkCardOut(this.valueCashOutCost)) return;
                let msgData = {};
                msgData[1] = this.typeNspCardOut;
                msgData[2] = this.GetCardTypeByAmount(this.valueCashOut);
                msgData[10] = this.inPutPin.string;
                Global.UIManager.showMiniLoading();
                require("SendRequest").getIns().MST_Client_Telco_CashOut(msgData);
            }
        );
    },

    GetCardTypeByAmount(cardAmount) {
        let index = CARD_AMOUNT_VALUE.indexOf(cardAmount);
        if (index == -1) return 0;
        return index
    },

    ClickShowListValue() {
        if(this.typeNspCardOut === 0){
            Global.UIManager.showConfirmPopup("Bạn cần chọn nhà mạng trước sau đó hãy chọn mệnh giá muốn đổi");
            return;
        }
        this.objListButtonValue.active = !this.objListButtonValue.active;
        if(this.objListButtonValue.active)
            this.checkDataValue();
    },
    ClickShowListNSP() {
        this.objListButtonNSP.active = !this.objListButtonNSP.active;
        this.objListButtonValue.active = false;
        if(this.objListButtonNSP)
            this.CheckNSPActive();
       
    },

    onClickMask(){
        this.objListButtonValue.active = false;
        this.objListButtonNSP.active = false;
    }
    // update (dt) {},
});
