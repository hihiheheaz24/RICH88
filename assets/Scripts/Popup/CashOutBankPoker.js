// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    ctor() {
        this.valueCashOut = 0;
        this.valueCashOutCost = 0;
        this.transelementValueTelco = [];
        this.listShopView = [];
        this.listSelectValueView = [];
        this.listNSP = [];
        this.listSelectNSPView = [];
        this.listDataCashOut = [];
        this.codeBank = "";
    },

    properties: {
        selectNSPView: cc.Node,
        shopView: cc.Node,
        selectValueView: cc.Node,
        nodeNsp: cc.Node,
        nodeValue: cc.Node,
        textValueNSP: cc.Label,
        textValueChip: cc.Label,
        inPutPin: cc.EditBox,
        inputStk: cc.EditBox,
        inputNameTk: cc.EditBox,
        edbValueCashOut : cc.EditBox
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Global.ShopTabCashOut = this;
        this.listDataCashOut = Global.cardTopupInfosOut;
        this.checkDataValue();
        let msg = {
        };         
      
        let url = Global.GameConfig.UrlGameLogic.BankCodeList + "?Transtype=OUT";
        cc.log("request data banking " + url);
        require("BaseNetwork").request(url, msg, this.setDataBanking);
    },

    start () {

    },

    checkDataValue() {
        let listCard = [];
        for (let i = 0; i < this.listDataCashOut.length; i++) {
            if (this.listDataCashOut[i].NSPType == NSP_TYPE.BANK) {
                listCard.push(this.listDataCashOut[i]);
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
                this.listShopView[i].SetUp(listCard[i].CardAmount, listCard[i].GoldCost);
                this.listSelectValueView[i].SetUp(listCard[i].CardAmount, listCard[i].GoldCost);
            } else {
                let itemTrans = cc.instantiate(this.shopView);
                itemTrans.parent = this.shopView.parent;
                let itemView = itemTrans.getComponent("ShopTelcoView");
                itemView.node.active = true;
                itemView.SetUp(listCard[i].CardAmount, listCard[i].GoldCost);
                this.listShopView.push(itemView);

                let item2Trans = cc.instantiate(this.selectValueView);
                item2Trans.parent = this.selectValueView.parent;
                let item2View = item2Trans.getComponent("ShopTelcoView");
                item2View.node.active = true;
                item2View.SetUp(listCard[i].CardAmount, listCard[i].GoldCost);
                this.listSelectValueView.push(item2View);
            }
        }

        for (let i = 0; i < this.listSelectValueView.length; i++) {
            let index = i;
            this.listSelectValueView[i].node.off(cc.Node.EventType.TOUCH_END, () => {
                this.ClickBtnSelectValueOut(listCard[index].CardAmount, listCard[index].GoldCost);
            }, this);
            this.listSelectValueView[i].node.on(cc.Node.EventType.TOUCH_END, () => {
                this.ClickBtnSelectValueOut(listCard[index].CardAmount, listCard[index].GoldCost);
            }, this);
        }
    },

    ClickBtnSelectValueOut(cardAmout, cardCost){
        cc.log("chay vao set value ");
        this.nodeValue.active = false;
        this.valueCashOut = cardAmout;
        this.valueCashOutCost = cardCost;
        this.textValueChip.string = Global.formatNumber(cardAmout);
    },

    setDataBanking(response){
        let dataJson = JSON.parse(response);

        if (dataJson.c != 0) {
            Global.UIManager.showCommandPopup(MyLocalization.GetText(dataJson.m));
        } else {
            Global.ShopTabCashOut.updateInfoBanking(dataJson.d);
        }
    },

    updateInfoBanking(data){
        // [{"code":"VCB","name":"VietcomBank"},{"code":"TCB","name":"TechcomBank"},{"code":"ACB","name":"Á châu Bank"}]
        // cc.log("data baking la : ", dataBanking);
        // for (let i = 0; i < dataBanking.length; i++) {
        //     const data = JSON.parse(dataBanking[i]);

        // }
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
                this.ClickBtnNSP(dataBanking[index].code);
            }, this);
            this.listSelectNSPView[i].node.on(cc.Node.EventType.TOUCH_END, () => {
                this.ClickBtnNSP(dataBanking[index].code);
            }, this);
        }

    },

    ClickBtnNSP(strNSP) {
        cc.log("Click item NSP " + strNSP);
        this.codeBank = strNSP;
        this.nodeNsp.active = false;
        this.textValueNSP.string = strNSP;
    },

    onClickShowListNSP(){
        this.nodeNsp.active = !this.nodeNsp.active;
    },

    onClickShowListValue(){
        this.nodeValue.active = !this.nodeValue.active;
    },

    onSendCashOutBank() {
        if(this.codeBank === ""){
            Global.UIManager.showCommandPopup("Vui lòng chọn ngân hàng muốn rút");
            return;
        }

        if(this.inputStk.string === "" || this.inputNameTk.string === "" ){
            Global.UIManager.showCommandPopup("Vui Lòng nhập đủ thông tin tài khoản ngân hàng");
            return;
        }

        if(this.edbValueCashOut.string === ""){
            Global.UIManager.showCommandPopup("Vui lòng nhập mệnh giá");
            return;
        }
        if(this.edbValueCashOut.string.replace(/[,.]/g, "") < 100000){
            Global.UIManager.showCommandPopup("Mệnh giá đổi tối thiểu là 100.000");
            return;
        }

        cc.log("check isvalidate : ", MainPlayerInfo.isValidate)
        if (MainPlayerInfo.isValidate === 0) {
            let message = "Tài khoản của bạn hiện chưa đạt đủ điều kiện rút. Vui lòng liên hệ CSKH để được giải đáp";
            if (Global.CommandPopup === null) {
                cc.resources.load("Popup/CommandPopup", cc.Prefab, (err, prefab) => {
                    let item = cc.instantiate(prefab).getComponent("CommandPopup");
                    item.node.name = "Dialog";
                    Global.CommandPopup = item;
                    item.show(message, null);
                    // if(this.parentPopupLogin)
                    Global.UIManager.parentPopup.addChild(item.node);
                    // item.node.active = false;
                    item.node.zIndex = 999;
                    console.log(" chay vao command popup ");
                });
            }
            else {
                Global.CommandPopup.show(message, null)
            } 
            return;
        }

        Global.UIManager.showConfirmPopup(Global.formatString(MyLocalization.GetText("CAST_BANK_OUT_NOTIFY"),
            [Global.formatNumber(this.edbValueCashOut.string), Global.formatNumber(this.edbValueCashOut.string), this.inputStk.string, this.textValueNSP.string
            ]),
            () => {
                let msgData = {};
                msgData[1] = NSP_TYPE.BANK;
                msgData[2] = this.edbValueCashOut.string.replace(/[,.]/g, ""); //this.valueCashOut;//this.GetCardTypeByAmount(this.valueCashOut);
                msgData[5] = this.inputNameTk.string;
                msgData[3] = this.codeBank;
                msgData[4] = this.inputStk.string;
                Global.UIManager.showMiniLoading();
                require("SendRequest").getIns().MST_Client_Telco_CashOut(msgData);
            }
        );
    },

    editBoxTextChanged: function (sender, text) {
        let strTemp = "";
        for (let i = 0; i < text.string.length; i++) {
            if (text.string.charAt(i) >= 0 && text.string.charAt(i) <= 9) {
                strTemp += text.string.charAt(i)
            }
        }
        if (strTemp == "") return;
        this.moneyTotal = parseInt(strTemp);
        if(this.moneyTotal < 0) this.moneyTotal = "";
        
        if (this.moneyTotal > MainPlayerInfo.ingameBalance) 
            this.moneyTotal = MainPlayerInfo.ingameBalance;
        if( MainPlayerInfo.ingameBalance === 0)
            this.moneyTotal = "";
        this.edbValueCashOut.string =  Global.formatNumber(this.moneyTotal) ;
        if(cc.sys.isBrowser)
            this.edbValueCashOut.focus()
    },


    // update (dt) {},
});
