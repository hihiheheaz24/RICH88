// 
//  
// 
//  
// 
//  

cc.Class({
    extends: cc.Component,
    ctor() {
        this.promotionPercent = 1;
        this._data = [];
        this.isInit = false;
        this.CodeView = [];
    },
    properties: {
        edtCode: cc.EditBox,
        txtReCashIn: cc.Label,
        txtPercent: cc.RichText,
        ItemCodeView: cc.Node,
    },

    

    // onLoad () {},

    start () {

    },

    init(){
        if(this.isInit){
            return;
        }
        this.isInit = true;
        this.CodeView[this.CodeView.length] = this.ItemCodeView.getComponent("CashoutCodeItemView");
    },

    show() {
        this.init();
        Global.UIManager.showMiniLoading();
        require("SendRequest").getIns().MST_Client_Get_List_Cashout_Code();
    },

    onReCashInCodeClicked(){
        let code = this.edtCode.string;
        if(code == ""){
            Global.UIManager.showCommandPopup (MyLocalization.GetText("CODE_IS_EMPTY"));
            return;
        }
        let codeItem = null;
        for(let i = 0;i < this._data.length;i++){
            if(this._data[i].Code == code){
                codeItem = this._data[i];
            }
        }
        cc.log(codeItem);
        if(codeItem == null){
            Global.UIManager.showCommandPopup (MyLocalization.GetText("CODE_NOT_FOUND"));
            return;
        }

        if(codeItem.Status != 0){
            Global.UIManager.showCommandPopup (MyLocalization.GetText("CODE_USED"));
            return;
        }
        let cardTpye = this.GetNameNSP(codeItem.NspType) + "-" + Global.NumberShortK(codeItem.CardAmount);
        Global.UIManager.showConfirmPopup (Global.formatString(MyLocalization.GetText ("CONFIRM_CARD_CODE"), [cardTpye]), () => this.sendCardoutCodeReChange (codeItem.CashoutCodeId, codeItem.Code));
    },
    OnChangeCodeClicked(){
        let code = this.edtCode.string;
        if(code == ""){
            Global.UIManager.showCommandPopup (MyLocalization.GetText("CODE_IS_EMPTY"));
            return;
        }
        let codeItem = null;
        for(let i = 0;i < this._data.length;i++){
            if(this._data[i].Code == code){
                codeItem = this._data[i];
            }
        }
        cc.log(codeItem);
        if(codeItem == null){
            Global.UIManager.showCommandPopup (MyLocalization.GetText("CODE_NOT_FOUND"));
            return;
        }

        if(codeItem.Status != 0){
            Global.UIManager.showCommandPopup (MyLocalization.GetText("CODE_USED"));
            return;
        }
        let cardTpye = this.GetNameNSP(codeItem.NspType) + "-" + Global.NumberShortK(codeItem.CardAmount);
        Global.UIManager.showConfirmPopup (Global.formatString(MyLocalization.GetText ("CONFIRM_CARD_CODE"), [cardTpye]), () => this.sendCardoutCode (codeItem.CashoutCodeId, codeItem.Code));
    },

    UpdateListCashoutCode(lstCashout, percent){
        Global.UIManager.hideMiniLoading();
        cc.log("percent : " + percent);
        cc.log(lstCashout);
        this.promotionPercent = percent;
        this._data = lstCashout;
        this.edtCode.string = "";
        this.txtReCashIn.string = Global.formatString(MyLocalization.GetText("RECHANGE_CODE_PROMOTION"),[this.promotionPercent]);
        this.txtPercent.string = Global.formatString(MyLocalization.GetText("PROMMOTION_TITLE"),[this.promotionPercent]);

        for (let i = 0; i < this.CodeView.length; i++) {
            cc.log(" len : " + this.CodeView.length);
            this.CodeView[i].node.active = false;
        }
        for (let i = 0; i < lstCashout.length; i++) {
            if (i < this.CodeView.length) {
                this.CodeView [i].FillData (lstCashout[i]);
            } else {
                let itemTrans = cc.instantiate(this.ItemCodeView);
                itemTrans.parent = this.ItemCodeView.parent;
                let itemView = itemTrans.getComponent("CashoutCodeItemView");
                itemView.FillData (lstCashout[i]);
                this.CodeView[this.CodeView.length] = itemView;
            }
        }
        for(let i = 0; i < this.CodeView.length; i++) {
            let index = i;
            this.CodeView [i].node.off(cc.Node.EventType.TOUCH_END , ()=>{
                this.SetInPutCode(lstCashout[index].Code);
            }, this);
            this.CodeView [i].node.on(cc.Node.EventType.TOUCH_END , ()=>{
                this.SetInPutCode(lstCashout[index].Code);
            }, this);
        }

    },

    SetInPutCode(strCode){
            if(this.edtCode)
            this.edtCode.string = strCode;
    },

    sendCardoutCode(codeId,code){
        //Global.UIManager.showMiniLoading();
        let msgData = {};
        msgData[1] = codeId;
        msgData[2] = code;
        require("SendRequest").getIns().MST_Client_Use_Cashout_Code_Get_Card (msgData);
    },

    sendCardoutCodeReChange(codeId,code){
        //Global.UIManager.showMiniLoading();
        let msgData = {};
        msgData[1] = codeId;
        msgData[2] = code;
        require("SendRequest").getIns().MST_Client_Use_Cashout_Code_Rechange (msgData);
    },

    GetNameNSP(type){
            
            if (type == NSP_TYPE.VIETTEL)
            {
                return "Viettel";
            }
            else if (type == NSP_TYPE.VINAPHONE)
            {
                return "VinaPhone";
            }
            else if (type == NSP_TYPE.MOBIFONE)
            {
                return "MobiFone";
            }
            else if (type == NSP_TYPE.ZING)
            {
                return "Zing";
            }
            else if (type == NSP_TYPE.MOMO)
            {
                return "Momo";
            }
            return "";
    },

    // update (dt) {},
});
