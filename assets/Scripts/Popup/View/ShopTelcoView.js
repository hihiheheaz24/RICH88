cc.Class({
    extends: cc.Component,
    ctor() {
        this._data = {};
        this.goldItem = 0;
    },
    properties: {
        textCard: cc.Label,
        textCoin: cc.Label,
    },

    SetUp(CardAmount, GoldBonus) {
        this.node.active = true;
        this.goldItem = CardAmount;
        if (this.textCard)
            this.textCard.string = Global.formatNumber(CardAmount);
        if (this.textCoin)
            this.textCoin.string = Global.formatNumber(GoldBonus);
    },

    SetupInfo(data) {
        this._data = data;
        if (this.textCard)
            this.textCard.string = this.GetHeaderNameNSP(this._data.NSPType) + Global.NumberShortK(this._data.CardAmount);
        if (this.textCoin)
            this.textCoin.string = Global.formatNumber(this._data.GoldCost);
    },

    OnClickItem() {
        let typeCardOut = Global.ShopPopup.GetCardTypeByAmount(this._data.CardAmount);
        if (typeCardOut == 0) {
            Global.UIManager.showCommandPopup(MyLocalization.GetText("CAST_OUT_AMOUNT_ERROR"));
        } else {
            Global.UIManager.showConfirmPopup(Global.formatString(MyLocalization.GetText("CAST_OUT_NOTIFY"), [this.textCoin.string, this.GetNameNSP(this._data.NSPType), Global.formatNumber(this._data.CardAmount)]),
                () => this.SendCardOut(this._data.NSPType, typeCardOut));
        }
    },

    OnClickItemMomo() {
        let typeCardOut = Global.ShopPopup.GetCardTypeByAmount(this._data.CardAmount);
        let phone = Global.ShopPopup.GetInputPhoneMomo();
        if (typeCardOut == 0) {
            Global.UIManager.showCommandPopup(MyLocalization.GetText("CAST_OUT_AMOUNT_ERROR"));
        } else {
            Global.UIManager.showConfirmPopup(Global.formatString(MyLocalization.GetText("CAST_OUT_NOTIFY"), [this.textCoin.string, this.GetNameNSP(this._data.NSPType), Global.formatNumber(this._data.CardAmount)]),
                () => this.SendCardOutMomo(this._data.NSPType, typeCardOut, phone));
        }
    },
    GetNameNSP(type) {
        if (type == NSP_TYPE.VIETTEL) {
            return "Viettel";
        } else if (type == NSP_TYPE.VINAPHONE) {
            return "VinaPhone";
        } else if (type == NSP_TYPE.MOBIFONE) {
            return "MobiFone";
        } else if (type == NSP_TYPE.MOMO) {
            return "Momo";
        }
        return "";
    },
    GetHeaderNameNSP(type) {
        if (type == NSP_TYPE.VIETTEL) {
            return "VT ";
        } else if (type == NSP_TYPE.VINAPHONE) {
            return "VNP ";
        } else if (type == NSP_TYPE.MOBIFONE) {
            return "MB ";
        } else if (type == NSP_TYPE.MOMO) {
            return "MOMO ";
        }
        return "";
    },
    SendCardOut(nspType, typeCashOut) {
        Global.UIManager.showMiniLoading();
        let msgData = {};
        msgData[1] = nspType;
        msgData[2] = typeCashOut;
        require("SendRequest").getIns().MST_Client_Telco_CashOut(msgData);
    },
    SendCardOutMomo(nspType, typeCashOut, strPhone) {
        Global.UIManager.showMiniLoading();
        let msgData = {};
        msgData[1] = nspType;
        msgData[2] = typeCashOut;
        msgData[3] = strPhone;
        require("SendRequest").getIns().MST_Client_Telco_CashOut(msgData);
    },

});
