
cc.Class({
    extends: cc.Component,
    ctor() {
        this._isInit = false;
        this.lsttelco = [];
        this.nspType = 1;
    },
    properties: {
        itemSMS : cc.Node,
        listItemSMS  : cc.ScrollView,
        // toggleViettel: cc.Toggle,
        // toggleMobifone: cc.Toggle,
        // toggleVinaPhone: cc.Toggle,
    },

    show() {
        this.node.active = true;
        this.CheckActiveTab();
    },

    CheckActiveTab() {
        // if (Global.GameConfig.FeatureConfig.SmsByVinaFeature == EFeatureStatus.Open) {
        //     this.toggleVinaPhone.node.active = true;
        //     this.nspType = NSP_TYPE.VINAPHONE;
        // } else {
        //     this.toggleVinaPhone.node.active = false;
        // }

        // if (Global.GameConfig.FeatureConfig.SmsByMobiFeature == EFeatureStatus.Open) {
        //     this.toggleMobifone.node.active = true;
        //     this.nspType = NSP_TYPE.MOBIFONE;
        // } else {
        //     this.toggleMobifone.node.active = false;
        // }

        // if (Global.GameConfig.FeatureConfig.SmsByViettelFeature == EFeatureStatus.Open) {
        //     this.toggleViettel.node.active = true;
        //     this.nspType = NSP_TYPE.VIETTEL;
        // } else {
        //     this.toggleViettel.node.active = false;
        // }

        // let msg = {};
        // require("BaseNetwork").request(Global.GameConfig.UrlGameLogic.GetListProductSms, msg, this.GetListTelco.bind(this));
        // check active tab

        this.lsttelco = Global.smsTopupInfosIn
        this.loadListDataSMS();

    },

    GetListTelco(response) {

        cc.log("Check data sms : ", response)
        let dataJson = JSON.parse(response);

        if (dataJson.c != 0) {
            Global.UIManager.showCommandPopup(MyLocalization.GetText(dataJson.m));
        } else {
            this.lsttelco = dataJson.d;
            // if (this.nspType == NSP_TYPE.VIETTEL) {
            //     this.toggleViettel.isChecked = true;
            // } else if (this.nspType == NSP_TYPE.VINAPHONE) {
            //     this.toggleVinaPhone.isChecked = true;
            // } else if (this.nspType == NSP_TYPE.MOBIFONE) {
            //     this.toggleMobifone.isChecked = true;
            // }
            this.loadListDataSMS();
        }
    },

    OnTabViettelChanged: function (toggle) {
        if (toggle.isChecked) {
            this.nspType = NSP_TYPE.VIETTEL;
            this.loadListDataSMS();
        }
    },

    OnTabMobifoneChanged: function (toggle) {
        if (toggle.isChecked) {
            this.nspType = NSP_TYPE.MOBIFONE;
            this.loadListDataSMS();
        }
    },

    OnTabVinaphoneChanged: function (toggle) {
        if (toggle.isChecked) {
            this.nspType = NSP_TYPE.VINAPHONE;
            this.loadListDataSMS();
        }
    },

    loadListDataSMS() {
        this.listItemSMS.scrollToTop();
        this.listItemSMS.content.removeAllChildren();
        let index = 0;
        for (let i = 0; i < this.lsttelco.length; i++) {
            const objData = this.lsttelco[i];
            if(objData.NSPType === this.nspType || typeof objData.NSPType === "undefined"){
                let item = null;
                if(i < this.listItemSMS.content.children.length){
                    item = this.listItemSMS.content.children;
                }
                else{
                    item = cc.instantiate(this.itemSMS).getComponent("ShopSMSItem");
                }
                cc.Tween.stopAllByTarget(item.node);
                item.SetupInfo(objData, this.nspType, this);
                item.node.active = true;
                item.node.scale = 0;
                item.node.opacity = 0;
                this.listItemSMS.content.addChild(item.node);
                cc.tween(item.node)
                .delay(index * 0.05)
                .to(0.2,{scale : 1, opacity  : 255}, {easing: "backOut" })
                .start()
                index ++;
            }
        }
        cc.log("====> dddm lis iten ", this.listItemSMS.content.children.length);
    },
    hide() {
        this.node.active = false;
    },
});
