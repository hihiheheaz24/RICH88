// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    ctor() {
        this.typeNspCardIn = 1;
        this.listTelcoIn = [];
        this.transelementValueTelco = [];
        this.typeCardIn = 0;
        this.listShopView = [];
        this.listSelectValueView = [];
        this.listSelectNSPView = [];
        this.codeBank = "";
        this.valueBank = "";
    },

    properties: {
        selectNSPView: cc.Node,
        nodeNsp: cc.Node,
        nodeValue: cc.Node,
        shopView: cc.Node,
        selectValueView: cc.Node,
        textValueNSP: cc.Label,
        textValueChip: cc.Label,
        nodeInputInfoBank: cc.Node,
        nodeInfoBank: cc.Node,
        //
        lbBankName: cc.Label,
        lbStk: cc.Label,
        lbTenTk: cc.Label,
        lbContent: cc.Label,

        listItemNap : cc.ScrollView,
        itemNap : cc.Node,
        nodeInputNap : cc.Node,

        qrCode : cc.Sprite
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        let msg = {};         
        cc.log("request data banking " + Global.GameConfig.UrlGameLogic.BankCodeList);
        let url = Global.GameConfig.UrlGameLogic.BankCodeList + "?Transtype=IN";
        require("BaseNetwork").request(url, msg, this.setDataBanking.bind(this));
        Global.ShopTabCashInBanking = this;
        this.listTelcoIn = Global.cardTopupInfosIn;

        // this.checkDataValue();
       

        // let msg = {};
        // msg[1] = NSP_TYPE.BANK;
        // msg[2] = "techcombank"//this.codeBank;
        // msg[3] = 10000//this.valueBank;
        // require("SendRequest").getIns().MST_Client_Cash_In_Banking(msg);
    },
    checkreet(){
        Global.ShopTabCashInBanking.resetUI();
    },

    resetUI(){
        this.qrCode.spriteFrame = null;
        this.lbBankName.string = "Chọn ngân hàng";
        this.lbStk.string = "...";
        this.lbTenTk.string = "...";
        this.lbContent.string = "...";
    },

    onEnable(){
        cc.log("chay vao enabled");
        this.resetUI();
    },

    start () {
      
    },

    show(){
        this.node.active = true;
        // this.nodeInputInfoBank.active = true;
        // this.nodeInfoBank.active = false;
        // this.showListItemBank();
    },

    hide(){
        this.node.active = false;
    },

    setDataBanking(response){
        cc.log("check list bank ", response)
        let dataJson = JSON.parse(response);

        if (dataJson.c != 0) {
            Global.UIManager.showCommandPopup(MyLocalization.GetText(dataJson.m));
        } else {
            this.updateInfoBanking(dataJson.d);
        }
    },

    updateInfoBanking(data){
        let dataBanking = JSON.parse(data);

        if (this.listSelectNSPView.length > 0)
            for (let i = 0; i < this.listSelectNSPView.length; i++) {
                if (this.listSelectNSPView != null)
                    this.listSelectNSPView[i].node.active = false;
            }

        for (let i = 0; i < dataBanking.length; i++) {
            cc.log("dta baj kign a : ", dataBanking[i])
            if (i < this.listSelectNSPView.length) {
                this.listSelectNSPView[i].SetUp(dataBanking[i].name, 0);
            } else {
                let itemTrans = cc.instantiate(this.selectNSPView);
                itemTrans.parent = this.selectNSPView.parent;
                let itemView = itemTrans.getComponent("ShopTelcoView");
                itemView.SetUp(dataBanking[i].name, 0);
                this.listSelectNSPView.push(itemView);
            }
        }

        for (let i = 0; i < this.listSelectNSPView.length; i++) {
            let index = i;
            this.listSelectNSPView[i].node.off(cc.Node.EventType.TOUCH_END, () => {
                this.ClickBtnNSP(dataBanking[index].name, dataBanking[index].code);
            }, this);
            this.listSelectNSPView[i].node.on(cc.Node.EventType.TOUCH_END, () => {
                this.ClickBtnNSP(dataBanking[index].name, dataBanking[index].code);
            }, this);
        }

    },

    showListItemBank(){
        let dataInfos = Global.bankTopupInfosIn;

        cc.log("check dtaa bank : ", dataInfos);
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

    checkDataValue() {
        let listCard = [];
        for (let i = 0; i < this.listTelcoIn.length; i++) {
            if (this.listTelcoIn[i].NSPType == NSP_TYPE.BANK) {
                listCard.push(this.listTelcoIn[i]);
            }
        }
        this.SetListValueNSP(listCard);
    },

    SetListValueNSP(listCard) {
        cc.log("liscard cash out la : ", listCard);

        for (let i = 0; i < this.listShopView.length; i++) {
            this.listShopView[i].node.active = false;
            this.listSelectValueView[i].node.active = false;
        }

        for (let i = 0; i < listCard.length; i++) {
            if (i < this.listShopView.length) {
                this.listShopView[i].SetUp(listCard[i].CardAmount, listCard[i].GoldBonus);
                this.listSelectValueView[i].SetUp(listCard[i].CardAmount, listCard[i].GoldBonus);
            } else {
                let itemTrans = cc.instantiate(this.shopView);
                itemTrans.parent = this.shopView.parent;
                let itemView = itemTrans.getComponent("ShopTelcoView");
                itemView.node.active = true;
                itemView.SetUp(listCard[i].CardAmount, listCard[i].GoldBonus);
                this.listShopView.push(itemView);

                let item2Trans = cc.instantiate(this.selectValueView);
                item2Trans.parent = this.selectValueView.parent;
                let item2View = item2Trans.getComponent("ShopTelcoView");
                item2View.node.active = true;
                item2View.SetUp(listCard[i].CardAmount, listCard[i].GoldBonus);
                this.listSelectValueView.push(item2View);
            }
        }

        for (let i = 0; i < this.listSelectValueView.length; i++) {
            let index = i;
            this.listSelectValueView[i].node.off(cc.Node.EventType.TOUCH_END, () => {
                this.ClickBtnSelectValueOut(listCard[index].CardAmount);
            }, this);
            this.listSelectValueView[i].node.on(cc.Node.EventType.TOUCH_END, () => {
                this.ClickBtnSelectValueOut(listCard[index].CardAmount);
            }, this);
        }
    },

    onClickItemNap(){
        Global.onPopOn(this.nodeInputNap);
    },

    onClickMasK(){
        Global.onPopOff(this.nodeInputNap);
    },

    ClickBtnNSP(strNSP, code) {
        cc.log("Click item NSP " + strNSP);
        this.codeBank = strNSP;
        this.nodeNsp.active = false;
        this.textValueNSP.string = strNSP;

        let msg1 = {};
        cc.log("request data banking 22" + Global.GameConfig.UrlGameLogic.BankTopupInfo);
        let bankUrl = Global.GameConfig.UrlGameLogic.BankTopupInfo + "?accountId=" + MainPlayerInfo.accountId +"&amount="+ 0 + "&bank=" + code;
        require("BaseNetwork").request(bankUrl , msg1, this.setDataInfotTransfer.bind(this));
    },

    ClickBtnSelectValueOut(cardAmout){
        cc.log("chay vao set value ");
        this.nodeValue.active = false;
        // this.valueCashOut = cardAmout;
        // this.valueCashOutCost = cardCost;
        this.valueBank = cardAmout;
        this.textValueChip.string = Global.formatNumber(cardAmout);
    },

    onClickSendGetInfoBanking(){
        if(this.codeBank === ""){
            Global.UIManager.showConfirmPopup("Vui lòng chọn ngân hàng muốn nạp");
            return;
        }
        if(this.valueBank === ""){
            Global.UIManager.showConfirmPopup("Vui lòng chọn mệnh giá muốn nạp");
            return;
        }
        let msg = {};
        msg[1] = NSP_TYPE.BANK;
        msg[2] = this.codeBank;
        msg[3] = this.valueBank;
        require("SendRequest").getIns().MST_Client_Cash_In_Banking(msg);
    },

    setDataInfotTransfer(packet){
        packet = JSON.parse(packet)
        cc.log("data chuyen tien 222 : ", packet.d);
        let dataTransfer = packet.d;
        cc.log("check bank : " + dataTransfer.Bank)
        // return
        this.lbBankName.string = dataTransfer.Bank;
        this.lbStk.string = dataTransfer.AccountNumber;
        this.lbTenTk.string = dataTransfer.AccountName;
        this.lbContent.string = dataTransfer.Content;

        let codeBank = null;
        switch (dataTransfer.Bank) {
            case "Bidv Đầu tư và Phát triển VN":
                codeBank = 970418;
                break;

            case "MB Quân đội":
                codeBank = 970422;
                break;

            case "Acb Á Châu":
                codeBank = 970416;
                break;

            case "Vcb Ngoại Thương VN":
                codeBank = 970436;
                break;

            case "Vietin Công thương VN":
                codeBank = 970415;
                break;

            default:
                break;
        }

        // https://img.vietqr.io/image/vietinbank-113366668888-compact2.jpg?amount=790000&addInfo=dong%20qop%20quy%20vac%20xin&accountName=Quy%20Vac%20Xin%20Covid
        let urlBase = "https://img.vietqr.io/image/{0}-{1}-qr_only.jpg?addInfo={2}";
        let urlQr = Global.formatString(urlBase, [codeBank, dataTransfer.AccountNumber, dataTransfer.Content]);
        cc.log("check url qr", urlQr)
        Global.loadImgFromUrl(this.qrCode, urlQr);
    },

    onCopySTK() {
        let stk = this.lbStk.string;
        if (stk != null && stk != "") {
            Global.coppyToClipboard(stk);
        }
    },

    onCopyTenTk() {
        let tenTk = this.lbTenTk.string;
        if (tenTk != null && tenTk != "") {
            Global.coppyToClipboard(tenTk);
        }
    },

    onCopyContentTransfer() {
        let content = this.lbContent.string;
        if (content != null && content != "") {
            Global.coppyToClipboard(content);
        }
    },

    onClickShowListNSP(){
        this.nodeNsp.active = !this.nodeNsp.active;
    },

    onClickShowListValue(){
        this.nodeValue.active = !this.nodeValue.active;
    },

    // update (dt) {},
});
