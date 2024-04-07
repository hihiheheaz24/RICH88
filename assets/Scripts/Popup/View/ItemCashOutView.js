// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,
    ctor() {
        this.data = {};
    },
    properties: {
        imgItem: cc.Sprite,
        lbPrice: cc.Label,
        lbGold: cc.Label,
        sprViettel: cc.SpriteFrame,
        sprVinaphone: cc.SpriteFrame,
        sprMobifone: cc.SpriteFrame,
        sprMomo: cc.SpriteFrame,
    },

    onLoad() {
        this.initUI();
    },

    initUI() {
        if (this.isInit) return;
        this.isInit = true;
        this.node.on('click', this.onItemClicked, this);
    },

    setupInfo(data) {
        this.data = data;
        this.node.active = true;
        if (!this.isInit) this.initUI();
        this.lbPrice.string = Global.formatNumber(this.data.CardAmount) + " đ";
        this.lbGold.string = Global.formatNumber(this.data.GoldCost);
        switch (this.data.NSPType) {
            case NSP_TYPE.VIETTEL:
                this.imgItem.spriteFrame = this.sprViettel;
                break;
            case NSP_TYPE.VINAPHONE:
                this.imgItem.spriteFrame = this.sprVinaphone;
                break;
            case NSP_TYPE.MOBIFONE:
                this.imgItem.spriteFrame = this.sprMobifone;
                break;
            case NSP_TYPE.MOMO:
                this.imgItem.spriteFrame = this.sprMomo;
                break;

            default:
                break;
        }
    },

    onItemClicked() {
        let typeCardOut = Global.ShopPopup.GetCardTypeByAmount(this.data.CardAmount);
        let phone = Global.ShopPopup.GetInputPhoneMomo();
        if (this.data.NSPType == NSP_TYPE.MOMO) {
            if (phone.length <= 9 || phone.length > 13) {
                Global.UIManager.showCommandPopup(MyLocalization.GetText("IS_NOT_PHONE_NUMBER"));
                return;
            }
        }
        if (typeCardOut == 0) {
            Global.UIManager.showCommandPopup(MyLocalization.GetText("CAST_OUT_AMOUNT_ERROR"));
        } else {

            Global.UIManager.showConfirmPopup(Global.formatString(MyLocalization.GetText("CAST_OUT_NOTIFY"), [this.lbGold.string, this.GetNameNSP(this.data.NSPType), Global.formatNumber(this.data.CardAmount)]),
                () => {
                    if (this.data.NSPType == NSP_TYPE.MOMO) {
                        this.SendCardOutMomo(this.data.NSPType, typeCardOut, phone);
                    } else {
                        this.SendCardOut(this.data.NSPType, typeCardOut);
                    }

                });
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
