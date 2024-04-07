

cc.Class({
    extends: cc.Component,
    ctor() {
        this._data = null;
    },

    properties: {
        diamondLabel: cc.Label,
        goldLabel : cc.Label,
        lbRate : cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    show() {
        this.node.active = true;
    },
    hide() {
        this.node.active = false;
    },

    SetupInfo(data) {
        this._data = data;
        this.diamondLabel.string = Global.formatNumber(data.DiamondPrice);
        let dataPackage = JSON.parse(data.Package);
        cc.log("check daa : ", data.XRate)
        this.goldLabel.string = Global.formatNumber(dataPackage[0].Amount);
        if(data.XRate > 1)
            this.lbRate.string = "x" + data.XRate;
        else
            this.lbRate.string = "";
    },

    OnClickedItem(event, index) {
        if (index == 4) {
            Global.UIManager.showCommandPopup(MyLocalization.GetText("COMMING_SOON"));
        } else {
            if (this._data != null) {
                if (MainPlayerInfo.diamondBalance < this._data.DiamondPrice) {
                    Global.UIManager.showCommandPopup(MyLocalization.GetText("CAST_OUT_DIAMOND_NOT_ENOUGH"));
                } else {
                    Global.UIManager.showConfirmPopup(Global.formatString(MyLocalization.GetText("CAST_OUT_DIAMOND_NOTIFY"), [this._data.DiamondPrice]),
                        () => this.SendCashItem(this._data.Id));
                }
            } else {
                if (MainPlayerInfo.diamondBalance == 0) {
                    Global.UIManager.showCommandPopup(MyLocalization.GetText("CAST_OUT_DIAMOND_NOT_ENOUGH"));
                } else {
                    Global.UIManager.showCommandPopup(MyLocalization.GetText("CAST_OUT_DIAMOND_NOT_READY"));
                }
            }
        }

    },
    SendCashItem(id) {
        let msg = {};
        msg[1] = id;
        msg[2] = 1;
        require("SendRequest").getIns().MST_Client_Buy_Shop_Package(msg);
    },
    // update (dt) {},
});
