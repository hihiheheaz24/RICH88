
cc.Class({
    extends: cc.Component,
    ctor() {
        this.data = null;
    },
    properties: {
        lbMobile: cc.Label,
        lbMomoName: cc.Label,
        lbMomoCode: cc.Label,
        btnCopyName: cc.Button,
        btnCopyCode: cc.Button,

        listItemNap : cc.ScrollView,
        itemNap : cc.Node,
        nodeInputNap : cc.Node,
        qrCode : cc.WebView
    },

    onLoad() {
        // if (this.data) {
        //     this.updateInfo(this.data);
        // } else {
        //     let msg = {};
            
        //     let momoUrl = Global.GameConfig.UrlGameLogic.MomoGetInfo + "?accountid=" + MainPlayerInfo.accountId;
        //     cc.log("link la " + momoUrl);
        //     require("BaseNetwork").request(momoUrl, msg, this.configSuccess);
        // }
    },

    resetUI(){
        this.lbMobile.string = "...";
        this.lbMomoName.string = "...";
        this.lbMomoCode.string = "...";
        this.qrCode.url = "";

        let msg = {};    
        let momoUrl = Global.GameConfig.UrlGameLogic.MomoGetInfo + "?accountid=" + MainPlayerInfo.accountId;
        cc.log("link la " + momoUrl);
        require("BaseNetwork").request(momoUrl, msg, this.configSuccess);
    },

    onEnable(){
        cc.log("chay vao enabled");
        this.resetUI();
    },

    updateInfo(data) {
        cc.log("check data momo : ", data)
      //  this.node.active = true;
        this.data = data;
        if(!data.RateRecharge) data.RateRecharge = 100;
        this.rateChange = data.RateRecharge +"%";
        this.lbMobile.string = this.data.SendToPhoneNum;
        this.lbMomoName.string = this.data.SendToUserName;
        this.lbMomoCode.string = this.data.SendMessage;

        // Dữ liệu cần gửi lên
        let demo = "2|99|{0}|{1}||0|0|10000|{2}|transfer_myqr";
        const postData = {
            type: "text",
            data: Global.formatString(demo, [this.data.SendToPhoneNum, this.data.SendToUserName, this.data.SendMessage]),
            background: "rgb(255,255,255)",
            foreground: "rgb(0,0,0)",
            logo: "https://img.ziller.vn/ib/h8yW5TnAM3.png"
        };
        cc.log("check posdata : ", postData.data)
        require("BaseNetwork").getQrMomo(postData, (data) => {
            this.qrCode.url = JSON.parse(data).link;
        });
    },

    showListItemMomo(){
        let dataInfos = Global.momoTopupInfosIn;

        cc.log("check dtaa momo : ", dataInfos);

        this.listItemNap.content.removeAllChildren();

        for (let i = 0; i < dataInfos.length; i++) {
            const objData = dataInfos[i];
            let item = null;
            if (i < this.listItemNap.content.children.length) {
                item = this.listItemNap.content.children[i];
            }
            else {
                item = cc.instantiate(this.itemNap);
            }

            item.scale = 0;
            cc.tween(item)
            .to(0.15 * i, {scale: 1},{easing: "backOut" })
            .start();

            this.setInfoItem(item, objData);

            this.listItemNap.content.addChild(item)
        }
    },

    setInfoItem(item, data){
        item.getChildByName("bg-nnap").getChildByName("icon-sales-off").getChildByName("lbSaleOff").getComponent(cc.Label).string = data.BonusPercent + "%";
        item.getChildByName("bg-nnap").getChildByName("lbAmount").getComponent(cc.Label).string = Global.formatNumber(data.MoneyAmount);
        item.getChildByName("bg-nnap").getChildByName("lbGoldReceived").getComponent(cc.Label).string = Global.formatNumber(data.GoldReceive);
    },

    onClickItemNap(){
        Global.onPopOn(this.nodeInputNap);
    },

    onClickMasK(){
        Global.onPopOff(this.nodeInputNap);
    },

    configSuccess(response) {
        let dataJson = JSON.parse(response);

        if (dataJson.c != 0) {
            Global.UIManager.showCommandPopup(MyLocalization.GetText(dataJson.m));
        } else {
            Global.ShopPopup.UpdateMomoInfo(dataJson.d);
        }
    },
    show() {
        this.node.active = true;
        if (this.data) {
            this.updateInfo(this.data);
        } else {
            let msg = {};
            
            let momoUrl = Global.GameConfig.UrlGameLogic.MomoGetInfo + "?accountid=" + MainPlayerInfo.accountId;
            cc.log("link la " + momoUrl);
            require("BaseNetwork").request(momoUrl, msg, this.configSuccess);
        }
    },
    hide() {
        this.node.active = false;
    },

    onCopyNameClicked() {
        let nameMomo = this.lbMobile.string;
        if (nameMomo != null && nameMomo != "") {
            // if (cc.sys.isNative) {
            //     //cc.sys.copyTextToClipboard(nameMomo);
            // } else {
                
            // }
            Global.coppyToClipboard(nameMomo);
        }

    },
    onCopyCodeClicked() {
        let nameMomo = this.lbMomoCode.string;
        if (nameMomo != null && nameMomo != "") {
            // if (cc.sys.isNative) {
            //     //cc.sys.copyTextToClipboard(nameMomo);
            // } else {
               
            // }
            Global.coppyToClipboard(nameMomo);
        }
    },


});
