const { getRandomValues } = require("crypto");

cc.Class({
    extends: cc.Component,

    properties: {
        listItem: cc.ScrollView,
        item: cc.Node,
        nodeNSP: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Global.FirstCashIn = this;
        this.listPromotionCashIn = null;
        this.nspType = 0;
        this.valueSms = 0;
    },

    start() {

    },

    show() {
        // Global.onPopOn(this.node);
        // cc.log("check data first cash inn : ", JSON.parse(Global.listPromotionCashIn[0].RuleConfig))
        if(Global.listPromotionCashIn.length === 0) return;
        this.updateListPromotion();
    },

    updateListPromotion() {
        if (Global.listPromotionCashIn.length > 0) {
            let listDataItem = JSON.parse(Global.listPromotionCashIn[0].RuleConfig);

            this.listItem.content.removeAllChildren();

            for (let i = 0; i < listDataItem.length; i++) {
                const dataItem = listDataItem[i];
                let item = null;
                if (i < this.listItem.content.children.length) {
                    item = this.listItem.content.children[i];
                }
                else {
                    item = cc.instantiate(this.item);
                }

                item.getChildByName("icon-sales-off").getChildByName("lbSaleOff").getComponent(cc.Label).string = dataItem.BonusPercent + "%";
                item.getChildByName("TextMoney").getComponent(cc.Label).string = Global.formatNumber(dataItem.MoneyAmount);
                item.getChildByName("TextGold").getComponent(cc.Label).string = Global.formatNumber(dataItem.GoldReceive);

                this.listItem.content.addChild(item);

                var eventHandler = new cc.Component.EventHandler();
                eventHandler.target = this.node;
                eventHandler.component = "FirstCashIn";
                eventHandler.handler = "onClickItem";
                eventHandler.customEventData = dataItem.MoneyAmount;
                item.getComponent(cc.Button).clickEvents.push(eventHandler);
            }
        }
    },

    hide() {
        Global.onPopOff(this.node, true);
    },

    onClickItem(event, data) {
        cc.log("check smsm item : ", data)
        // this.nodeNSP.active = true;
        Global.onPopOn(this.nodeNSP)
        this.valueSms = data;
    },

    hideNSP() {
        // this.nodeNSP.active = false;
        Global.onPopOff(this.nodeNSP)
    },

    onClickItemNSP(event, data) {
        cc.log("check data selcect : ", data)
        this.nspType = JSON.parse(data);
        let smsCode = "";
        let ServiceNum = "";
        cc.log("check sms : ", Global.smsTopupInfosIn)

        for (let i = 0; i < Global.smsTopupInfosIn.length; i++) {
            const dataSms = Global.smsTopupInfosIn[i];
            if (dataSms.MoneyVndCost === this.valueSms && this.nspType === dataSms.NSPType) {
                smsCode = dataSms.SmsCode;
                ServiceNum = dataSms.ServiceNum;
                break;
            }
        }

        var msg = {
            SmsCode: smsCode,
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
                        if (cc.sys.os == cc.sys.OS_IOS) {
                            url = "sms:" + Global.ConfigLogin.SmsNumber + "&body=" + encodeURI(dataJson.d);
                        }
                        cc.sys.openURL(url);
                    } else {
                        Global.UIManager.showCommandPopup(MyLocalization.GetText(dataJson.m));
                    }
                });
            }
        });
    },

    onDestroy(){
        Global.FirstCashIn = null;
    }

    // update (dt) {},
});
