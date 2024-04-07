
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
        lbContent : cc.Label,

        listItemNap : cc.ScrollView,
        itemNap : cc.Node,
        nodeInputNap : cc.Node,
    },

    onLoad() {
        // if (cc.sys.isMobile) {
        //     this.btnCopyName.node.active = true;
        //     this.btnCopyCode.node.active = true;
        // } else {
        //     this.btnCopyName.node.active = false;
        //     this.btnCopyCode.node.active = false;
        // }
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
        this.lbContent.string = " - Để nạp tiền, truy cập vào MOMO chọn chuyển tiền \n - Nhập số điện thoại và nội dung chuyển khoản ở trên \n - Kiểm tra lại thông tin trước khi chuyển \n Lưu ý: \n - Chuyển khoản tối thiếu 10.000 VNĐ \n - Tỷ giá nạp : " + this.rateChange + "\n - NPH sẽ không giải quyết các trường hợp người chơi chuyển nhầm tài khoản";

        this.showListItemMomo();
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
