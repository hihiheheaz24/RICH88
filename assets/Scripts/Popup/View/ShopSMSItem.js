
cc.Class({
    extends: cc.Component,
    ctor() {
        this._data = {};
        this.nspType = 0;
    },
    properties: {
        lblCoin: cc.Label,
        lblMoney: cc.Label,
        nodeBonus: cc.Node,
        lblBonus: cc.Label,

        nodeSelectNSP : cc.Node,
    },

    SetupInfo(data, nspType, shopTabSMS) {
        this.shopTabSMS = shopTabSMS;
        this.node.active = true;
        this._data = data;
        this.nspType = nspType;
        this.lblCoin.string = Global.formatNumber(data.GoldBonus) + " " + MyLocalization.GetText("FP_BALANCE_NAME");
        this.lblMoney.string = Global.formatNumber(data.MoneyVndCost) + " " + MyLocalization.GetText("REAL_BALANCE");
        this.lblBonus.string = data.BonusPercent + "%";
    },

    onClickSelectNSP(){
        this.nodeSelectNSP.active = true;
        Global.dataSmsItem = this._data;
    },

    hideNSP(){
        this.nodeSelectNSP.active = false;
    },

    onClickItemNSP(event, data){
        cc.log("check data selcect : ", Global.dataSmsItem)
        this.nspType = JSON.parse(data);
        let ServiceNum = "";
        for (let i = 0; i < Global.smsTopupInfosIn.length; i++) {
            const dataSms = Global.smsTopupInfosIn[i];
            if (dataSms.MoneyVndCost ===  Global.dataSmsItem.MoneyVndCost && this.nspType === dataSms.NSPType) {
                ServiceNum = dataSms.ServiceNum
                cc.log("check sms number : ", dataSms)
               cc.log("check sms number : ", dataSms.ServiceNum)
                break;
            }
        }

        if (Global.dataSmsItem) {
            var msg = {
                SmsCode: Global.dataSmsItem.SmsCode,
                NspType: this.nspType,
            }
            cc.log("check data send : ", msg)
            let smsUrl = Global.GameConfig.UrlGameLogic.CreateSmsOrder + "?accountid=" + MainPlayerInfo.accountId;
            // cc.log("OnSendSMS : ", msg);
            // cc.log("smsUrl : ", smsUrl);
            require("BaseNetwork").request(smsUrl, msg, function (response) {
                let dataJson = JSON.parse(response);
                cc.log(dataJson);
                if (dataJson.c != 0) {
                    Global.UIManager.showCommandPopup(MyLocalization.GetText(dataJson.m));
                } else {
                    Global.UIManager.showConfirmPopup(Global.formatString(MyLocalization.GetText("QUEST_SEND_SMS"), [dataJson.d, ServiceNum]), () => {
                        if (cc.sys.isMobile) {
                            let url = "sms:" + Global.ConfigLogin.SmsNumber + "?body=" + encodeURI(dataJson.d);
                            if(cc.sys.os == cc.sys.OS_IOS){
                                 url = "sms:" + Global.ConfigLogin.SmsNumber + "&body=" + encodeURI(dataJson.d);
                            }
                            cc.sys.openURL(url);
                        } else {
                            Global.UIManager.showCommandPopup(MyLocalization.GetText(dataJson.m));
                        }
                    });
                }
            });
        }
    },

    OnSendSMS() {
        if (this._data) {
            var msg = {
                SmsCode: this._data.SmsCode,
                NspType: this.nspType,
            }
            let smsUrl = Global.GameConfig.UrlGameLogic.CreateSmsOrder + "?accountid=" + MainPlayerInfo.accountId;
            // cc.log("OnSendSMS : ", msg);
            // cc.log("smsUrl : ", smsUrl);
            require("BaseNetwork").request(smsUrl, msg, function (response) {
                let dataJson = JSON.parse(response);
                cc.log(dataJson);
                if (dataJson.c != 0) {
                    Global.UIManager.showCommandPopup(MyLocalization.GetText(dataJson.m));
                } else {
                    Global.UIManager.showConfirmPopup(Global.formatString(MyLocalization.GetText("QUEST_SEND_SMS"), [dataJson.d, Global.ConfigLogin.SmsNumber]), () => {
                        if (cc.sys.isMobile) {
                            let url = "sms:" + Global.ConfigLogin.SmsNumber + "?body=" + encodeURI(dataJson.d);
                            if(cc.sys.os == cc.sys.OS_IOS){
                                 url = "sms:" + Global.ConfigLogin.SmsNumber + "&body=" + encodeURI(dataJson.d);
                            }
                            cc.sys.openURL(url);
                        } else {
                            Global.UIManager.showCommandPopup(MyLocalization.GetText(dataJson.m));
                        }
                    });
                }
            });
        }
    },

});
