
cc.Class({
    extends: require("ParentChangePositionEDB"),
    ctor() {
        this.typeNspCardIn = 0;
        this.listTelcoIn = [];
        this.transelementValueTelco = [];
        this.typeCardIn = 0;
        this.valueCardIn = 0;
        this.listShopView = [];
        this.listSelectValueView = [];
        this.listNSP = [];
        this.listSelectNSPView = [];
    },

    properties: {
        serialIF: cc.EditBox,
        numberIF: cc.EditBox,
        textValue: cc.Label,
        objListButtonCardIn: cc.Node,
        shopView: cc.Node,
        selectValueView: cc.Node,
        objListButtonNSP: cc.Node,
        selectNSPView: cc.Node,
        textValueNSP: cc.Label,
        // momo
        textMomoName: cc.Label,
        textMomoPhone: cc.Label,
        textMomoCode: cc.Label,
        btnSelectNSPValue: cc.Button,
        //iconMomo: cc.Node,
    },
    onLoad(){
        this.initNodeMove(Global.ShopPopup.node);

        this.resignEdb(this.serialIF);
        this.resignEdb(this.numberIF);
        this.resignNext(this.serialIF , "numberIF");
    },
    Init() {
        this.listTelcoIn = Global.cardTopupInfosIn;
        if (this.isInit) {
            return;
        }
        this.isInit = true;
        this.listShopView[this.listShopView.length] = this.shopView.getComponent("ShopTelcoView");
        this.listSelectValueView[this.listSelectValueView.length] = this.selectValueView.getComponent("ShopTelcoView");
        this.listSelectNSPView[this.listSelectNSPView.length] = this.selectNSPView.getComponent("ShopTelcoView");
        cc.log("listSelectNSPView : " + this.listSelectNSPView.length);
    },

    show() {
        this.node.active = true;
        this.btnSelectNSPValue.interactable = true;
        //this.iconMomo.active = false;
        this.textValueNSP.string = "Chọn nhà mạng"
        this.Init();
        this.CheckNSPActive();
    },

    onClickMask(){
        this.objListButtonNSP.active = false;
        this.objListButtonCardIn.active = false;
    },

    CheckNSPActive() {
        this.listNSP = [];
        // if (Global.GameConfig.FeatureConfig.CashInByMomoFeature == EFeatureStatus.Open) {
        //     this.typeNspCardIn = NSP_TYPE.MOMO;
        //     this.listNSP[this.listNSP.length] = "Momo";
        // } else {

        // }
        if (Global.GameConfig.FeatureConfig.CashInByMobiFeature == EFeatureStatus.Open) {
            this.typeNspCardIn = NSP_TYPE.MOBIFONE;
            this.textValueNSP.string = "MobiFone";
            this.listNSP[this.listNSP.length] = "MobiFone";
        } else {
        }
        if (Global.GameConfig.FeatureConfig.CashInByVinaFeature == EFeatureStatus.Open) {
            this.typeNspCardIn = NSP_TYPE.VINAPHONE;
            this.textValueNSP.string = "VinaPhone";
            this.listNSP[this.listNSP.length] = "VinaPhone";

        } else {
        }
        if (Global.GameConfig.FeatureConfig.CashInByViettelFeature == EFeatureStatus.Open) {
            this.typeNspCardIn = NSP_TYPE.VIETTEL;
            this.textValueNSP.string = "Viettel";
            this.listNSP[this.listNSP.length] = "Viettel";
        } else {
        }

        this.SetListNSP();
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

    ClickShowListValue() {
        this.objListButtonCardIn.active = !this.objListButtonCardIn.active;
    },
    ClickShowListNSP() {
        this.objListButtonNSP.active = !this.objListButtonNSP.active;
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
                this.listSelectNSPView[this.listSelectNSPView.length] = itemView;
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

    SetListValueNSP(listCard) {
        for (let i = 0; i < this.listShopView.length; i++) {
            this.listShopView[i].node.active = false;
            this.listSelectValueView[i].node.active = false;
        }

        cc.log("check list card : ", listCard);
        for (let i = 0; i < listCard.length; i++) {
            if (i < this.listShopView.length) {
                this.listShopView[i].SetUp(listCard[i].CardAmount, listCard[i].GoldAmount);
                this.listSelectValueView[i].SetUp(listCard[i].CardAmount, listCard[i].GoldAmount);
            } else {
                let itemTrans = cc.instantiate(this.shopView);
                itemTrans.parent = this.shopView.parent;
                let itemView = itemTrans.getComponent("ShopTelcoView");
                itemView.SetUp(listCard[i].CardAmount, listCard[i].GoldAmount);
                this.listShopView[this.listShopView.length] = itemView;

                let item2Trans = cc.instantiate(this.selectValueView);
                item2Trans.parent = this.selectValueView.parent;
                let item2View = item2Trans.getComponent("ShopTelcoView");
                item2View.SetUp(listCard[i].CardAmount, listCard[i].GoldAmount);
                this.listSelectValueView[this.listSelectValueView.length] = item2View;
            }
        }
        for (let i = 0; i < this.listSelectValueView.length; i++) {
            let index = i;


            this.listShopView[i].node.scale = 0;
            cc.tween(this.listShopView[i].node)
            .to(0.15 * i, {scale: 1},{easing: "backOut" })
            .start();
            

            this.listSelectValueView[i].node.off(cc.Node.EventType.TOUCH_END, () => {
                this.ClickBtnSelectValueIn(listCard[index].CardAmount);
            }, this);
            this.listSelectValueView[i].node.on(cc.Node.EventType.TOUCH_END, () => {
                this.ClickBtnSelectValueIn(listCard[index].CardAmount);
            }, this);
        }
    },

    ClickBtnSelectValueIn(cardAmout) {
        this.objListButtonCardIn.active = false;
        this.typeCardIn = Global.ShopPopup.GetCardTypeByAmount(cardAmout);
        this.textValue.string = Global.formatNumber(cardAmout);
    },

    ClickBtnNSP(strNSP) {
        cc.log("strNSP : " + strNSP);
        this.objListButtonNSP.active = false;
        this.typeNspCardIn = this.GetNameNSP(strNSP);
        this.textValueNSP.string = strNSP;
        cc.log("this.typeNspCardIn : " + this.typeNspCardIn);
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
        this.typeCardIn = Global.ShopPopup.GetCardTypeByAmount(Global.ShopPopup.valueCardIn);
        cc.log("check check dcm : ", this.typeCardIn)
        cc.log("??? " ,Global.ShopPopup.valueCardIn)
        if (this.serialIF.string !== "" && this.numberIF.string !== "") {
            Global.UIManager.showConfirmPopup(
                Global.formatString(MyLocalization.GetText("NOTIFY_CASHIN_TELCO"), 
                [Global.ShopPopup.GetNspNameByType(this.typeNspCardIn), Global.formatNumber(Global.ShopPopup.valueCardIn)]), 
                () => this.SendCardIn(this.serialIF.string, this.numberIF.string)
                );         
        }
        else{
            Global.UIManager.showCommandPopup(MyLocalization.GetText("PASS_WORD_SPACE"), null);
        }
    },

    SendCardIn(serial, number) {
        Global.UIManager.showMiniLoading();
        let msgData = {};
        cc.log("S : " + this.typeCardIn);
        cc.log("S : " + this.typeNspCardIn);
        msgData[1] = this.typeCardIn;
        msgData[2] = this.typeNspCardIn;
        msgData[3] = serial;
        msgData[4] = number;
        require("SendRequest").getIns().MST_Client_Telco_CashIn(msgData);
    },

    ResetUI() {
        this.typeCardIn = 0;
        this.serialIF.string = "";
        this.numberIF.string = "";
        this.objListButtonNSP.active = false;
        this.objListButtonCardIn.active = false;
        this.textValue.string = MyLocalization.GetText("SELECT_VALUE");
    },

    hide() {
        this.ResetUI();
        this.node.active = false;
    },

});
