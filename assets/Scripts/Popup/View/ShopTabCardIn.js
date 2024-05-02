
cc.Class({
    extends: require("ParentChangePositionEDB"),
    ctor() {
        this.typeNspCardIn = 0;
        this.listTelcoIn = [];
        this.transelementValueTelco = [];
        this.typeCardIn = 0;
        this.valueCardIn = 0;
        this.listShopView = [];
        this.listNSP = [];
        this.listSelectNSPView = [];
    },

    properties: {
        serialIF: cc.EditBox,
        numberIF: cc.EditBox,
        // textValue: cc.Label,
        shopView: cc.Node,
        selectValueView: cc.Node,
        textMomoName: cc.Label,
        textMomoPhone: cc.Label,
        textMomoCode: cc.Label,
    },
    onLoad(){
        this.initNodeMove(Global.ShopPopup.node);

        this.resignEdb(this.serialIF);
        this.resignEdb(this.numberIF);
        this.resignNext(this.serialIF , "numberIF");

        this.show();
    },
    Init() {
        this.listTelcoIn = Global.cardTopupInfosIn;
        if (this.isInit) {
            return;
        }
        this.isInit = true;
        this.listShopView[this.listShopView.length] = this.shopView.getComponent("ShopTelcoView");
        cc.log("listSelectNSPView : " + this.listSelectNSPView.length);
    },

    show() {
        this.node.active = true;
        this.Init();
        // this.CheckNSPActive();
    },

    CheckNSPActive() {
        this.listNSP = [];
        if (Global.GameConfig.FeatureConfig.CashInByMobiFeature == EFeatureStatus.Open) {
            this.typeNspCardIn = NSP_TYPE.MOBIFONE;
            // this.textValueNSP.string = "MobiFone";
            this.listNSP[this.listNSP.length] = "MobiFone";
        } else {
        }
        if (Global.GameConfig.FeatureConfig.CashInByVinaFeature == EFeatureStatus.Open) {
            this.typeNspCardIn = NSP_TYPE.VINAPHONE;
            // this.textValueNSP.string = "VinaPhone";
            this.listNSP[this.listNSP.length] = "VinaPhone";

        } else {
        }
        if (Global.GameConfig.FeatureConfig.CashInByViettelFeature == EFeatureStatus.Open) {
            this.typeNspCardIn = NSP_TYPE.VIETTEL;
            // this.textValueNSP.string = "Viettel";
            this.listNSP[this.listNSP.length] = "Viettel";
        }

        this.ClickSelectNSP(null, this.typeNspCardIn);
    },

    ClickSelectNSP(event, index) {
        this.ResetUI();
        this.typeNspCardIn = index;
        let listCard = [];
        for (let i = 0; i < this.listTelcoIn.length; i++) {
            if (this.listTelcoIn[i].NSPType == this.typeNspCardIn) {
                listCard[listCard.length] = this.listTelcoIn[i];
            }
        }
        this.SetListValueNSP(listCard);
    },

    SetListValueNSP(listCard) {
        for (let i = 0; i < this.listShopView.length; i++) {
            this.listShopView[i].node.active = false;
        }

        cc.log("check list card : ", listCard);
        for (let i = 0; i < listCard.length; i++) {
            if (i < this.listShopView.length) {
                this.listShopView[i].SetUp(listCard[i].CardAmount, listCard[i].GoldAmount);
            } else {
                let itemTrans = cc.instantiate(this.shopView);
                itemTrans.parent = this.shopView.parent;
                let itemView = itemTrans.getComponent("ShopTelcoView");
                itemView.SetUp(listCard[i].CardAmount, listCard[i].GoldAmount);
                this.listShopView[this.listShopView.length] = itemView;
            }
        }
        for (let i = 0; i < this.listShopView.length; i++) {
            let index = i;
            this.listShopView[i].node.off(cc.Node.EventType.TOUCH_END, () => {
                this.ClickBtnSelectValueIn(listCard[index].CardAmount);
            }, this);
            this.listShopView[i].node.on(cc.Node.EventType.TOUCH_END, () => {
                this.ClickBtnSelectValueIn(listCard[index].CardAmount);
            }, this);
        }
    },

    ClickBtnSelectValueIn(cardAmout) {
        this.typeCardIn = cardAmout;
        cc.log("check type card in : ", this.typeCardIn)
        // this.textValue.string = Global.formatNumber(cardAmout);
    },

    GetMomoConfig(response) {
        let dataJson = JSON.parse(response);

        if (dataJson.c != 0) {
            Global.UIManager.showCommandPopup(MyLocalization.GetText(dataJson.m));
        } else {
            Global.ShopPopup.UpdateMomoInfo(dataJson.d.SendToUserName, dataJson.d.SendToPhoneNum, dataJson.d.SendMessage);
        }
    },

    UpdateMomoInfo(name, phone, code) {
        this.textMomoName.string = name;
        this.textMomoPhone.string = phone;
        this.textMomoCode.string = code;
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

    ClickConfirmCardIn() {
        // cc.log("check check dcm : ", this.typeCardIn)
        // if (this.serialIF.string !== "" && this.numberIF.string !== "") {
        //     // Global.UIManager.showConfirmPopup(
        //     //     Global.formatString(MyLocalization.GetText("NOTIFY_CASHIN_TELCO"), 
        //     //     [Global.ShopPopup.GetNspNameByType(this.typeNspCardIn), Global.formatNumber(this.typeCardIn)]), 
        //     //     () => this.SendCardIn(this.serialIF.string, this.numberIF.string)
        //     //     );     
            
        //     this.SendCardIn(this.serialIF.string, this.numberIF.string)
        // }
        // else{
        //     Global.UIManager.showCommandPopup(MyLocalization.GetText("PASS_WORD_SPACE"), null);
        // }
        if (this.typeCardIn == 0) {
            Global.UIManager.showCommandPopup(MyLocalization.GetText("CAST_OUT_AMOUNT_ERROR"));
        } else if (Global.ShopPopup.CheckSpace(this.serialIF.string) && Global.ShopPopup.CheckSpace(this.numberIF.string)) {
            Global.UIManager.showConfirmPopup(Global.formatString(MyLocalization.GetText("NOTIFY_CASHIN_TELCO"), [Global.ShopPopup.GetNspNameByType(this.typeNspCardIn), Global.formatNumber(this.typeCardIn)]), () => this.SendCardIn(this.serialIF.string, this.numberIF.string));
        }
    },

    SendCardIn(serial, number) {
        Global.UIManager.showMiniLoading();
        let msgData = {};
        cc.log("S : " + Global.ShopPopup.GetCardTypeByAmount(this.typeCardIn));
        cc.log("S : " + this.typeNspCardIn);
        msgData[1] = Global.ShopPopup.GetCardTypeByAmount(this.typeCardIn);
        msgData[2] = this.typeNspCardIn;
        msgData[3] = serial;
        msgData[4] = number;
        require("SendRequest").getIns().MST_Client_Telco_CashIn(msgData);
    },

    ResetUI() {
        this.typeCardIn = 0;
        this.serialIF.string = "";
        this.numberIF.string = "";
        for (let i = 0; i < this.listShopView.length; i++) {
            const obj = this.listShopView[i];
            obj.node.getComponent(cc.Toggle).isChecked = false;
        }
    },

    hide() {
        this.ResetUI();
        this.node.active = false;
    },

});
