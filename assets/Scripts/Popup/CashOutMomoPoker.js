var MOMO = 4;
cc.Class({
    extends: cc.Component,

    ctor() {
        this.valueCashOut = 0;
        this.valueCashOutCost = 0;
        this.transelementValueTelco = [];
        this.listShopView = [];
        this.listSelectValueView = [];
        this.listNSP = [];
        this.listDataCashOut = [];
    },

    properties: {
        shopView: cc.Node,
        selectValueView: cc.Node,
        objListButtonValue: cc.Node,
        textValueChip: cc.Label,
        //
        edbAccMomo: cc.EditBox,
        captchaImgGift : cc.Node,
        captchaInputGift : cc.EditBox,
        inPutPin : cc.EditBox,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.log("chay vao onload doi thuong momo")
        this.listDataCashOut = Global.cardTopupInfosOut;
        this.checkDataValue();
        Global.CashOutMomo = this;
    },

    onEnable(){
        this.ReloadCaptchaGift();
    },
    
    start () {

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
            Global.CashOutMomo.base64 = capcha.d[0];
            Global.CashOutMomo._captchaMd5 = capcha.d[1];
            Global.CashOutMomo._time = capcha.d[2];
            Global.CashOutMomo.createCaptcha( Global.CashOutMomo.base64);
        }
    },

    SuccessCaptchaGift (response) {
        Global.UIManager.hideMiniLoading();
        let model = JSON.parse(response);
        if(model.c != 0) {
            Global.UIManager.showCommandPopup (MyLocalization.GetText ("CAPTCHA_FAIL"), null);
            Global.CashOutMomo.ReloadCaptchaGift();
        } else {
            Global.CashOutMomo.onCashOutMomo();
        }
    },

    LoadCaptchaFail() {
        Global.UIManager.showCommandPopup (MyLocalization.GetText ("LOAD_CAPTCHA_FAIL"), null);
    },

    checkDataValue() {
        let listCard = [];
        for (let i = 0; i < this.listDataCashOut.length; i++) {
            if (this.listDataCashOut[i].NSPType === MOMO) {
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

    ClickBtnSelectValueOut(cardAmout, cardCost){
        cc.log("chay vao set value ");
        this.objListButtonValue.active = false;
        this.valueCashOutCost = cardCost;
        this.textValueChip.string = Global.formatNumber(cardAmout);
        this.valueCashOut = cardAmout;
    },

    ClickShowListValue() {
        this.objListButtonValue.active = !this.objListButtonValue.active;
        if(this.objListButtonValue.active)
            this.checkDataValue();
    },

    onCashOutMomo() {
        // if(this.inPutPin.string === ""){
        //     Global.UIManager.showCommandPopup("Vui Lòng nhập mã PIN ( Mã hệ thống gửi về sau khi xác nhận số điện thoại )");
        //     return;
        // }
        if(this.valueCashOutCost === 0){
            Global.UIManager.showCommandPopup("Vui lòng chọn mệnh giá");
            return;
        }
        let str = this.edbAccMomo.string;
        if (str == "") {
            Global.UIManager.showCommandPopup(MyLocalization.GetText("IF_MOBILE_NULL"));
            return;
        }

        if(MainPlayerInfo.isValidate === 0){
            Global.UIManager.showConfirmPopup("Tài khoản của bạn hiện chưa đạt đủ điều kiện rút. Vui lòng liên hệ CSKH để được giải đáp");
            return;
        }
      
        Global.UIManager.showConfirmPopup(Global.formatString(MyLocalization.GetText("CAST_OUT_NOTIFY_MOMO"),
            [this.valueCashOutCost, str, this.textValueChip.string]),
            () => {
                let msgData = {};
                msgData[1] = MOMO;
                msgData[2] = this.GetCardTypeByAmount(this.valueCashOut);
                msgData[3] = str;
                // msgData[10] = this.inPutPin.string;
                Global.UIManager.showMiniLoading();
                require("SendRequest").getIns().MST_Client_Telco_CashOut(msgData);
            }
        );
    },
    GetCardTypeByAmount(cardAmount) {
        let index = CARD_AMOUNT_VALUE.indexOf(cardAmount);
        if(index == -1) return 0;
        return index
    },

    // update (dt) {},
});
