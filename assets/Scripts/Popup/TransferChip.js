// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        edbUserId : cc.EditBox,
        edbChip : cc.EditBox,
        lbNamePlayer : cc.Label,
        textNoti : cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Global.TransferChip = this;
        this.isCorrectUserID = false;
        this.clickSearchID = false;
        this.moneyTotal = 0;
        this.chipSend = 0;
    },

    start () {

    },

    onEnable(){
        this.edbUserId.string = "";
        this.edbChip.string = "";
        this.textNoti.string = '';
    },

    show(){
        Global.onPopOn(this.node)
       
    },

    onClickSendChip(){
        if(this.edbUserId.string === '' || this.edbChip.string === ''){
            Global.UIManager.showNoti("Thông tin nhập vào bị thiếu")
            return;
        }
        if(parseInt(this.chipSend) <= 0){
            Global.UIManager.showNoti("Số tiền chuyển tối thiểu phải lớn hơn 0")
            return;
        }
        this.clickSearchID = false;
        let msg = {};
        msg[1] = parseInt(this.edbUserId.string);
        require("SendRequest").getIns().MST_Client_Get_Other_Player_Info(msg)       
    },

    onClickSearchID(){
        this.clickSearchID = true;
        let msg = {};
        msg[1] = parseInt(this.edbUserId.string);
        require("SendRequest").getIns().MST_Client_Get_Other_Player_Info(msg)
    },


    fillInfoPlayer(data){
       
        this.isCorrectUserID = data[2];

        //
        if(!this.isCorrectUserID){
            // Global.UIManager.showNoti("ID này không tồn tại, bạn thử lại nhé")
            this.lbNamePlayer.string = "ID này không tồn tại";
            this.lbNamePlayer.node.color = cc.Color.RED;
            return;
        }
        this.lbNamePlayer.string = data[1];
        this.lbNamePlayer.node.color = cc.Color.WHITE;
        if(this.clickSearchID) return;

        let msg = {}
		msg[1] = parseInt(this.edbUserId.string);
		msg[2] = parseInt(this.chipSend);
		require("SendRequest").getIns().MST_Client_Transder_Chip(msg);
    },

    onClickHide(){
        Global.onPopOff(this.node, true)
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
        cc.log("============> money la " + this.moneyTotal);
        if(this.moneyTotal < 0) this.moneyTotal = 0;
        
        if (this.moneyTotal > MainPlayerInfo.ingameBalance) 
            this.moneyTotal =  MainPlayerInfo.ingameBalance;
        this.edbChip.string = Global.formatNumber(this.moneyTotal);
        this.chipSend = this.moneyTotal;
        if (cc.sys.isBrowser) {
            this.edbChip.focus();
        }
    },

    showTextNoti(data){
        if(data[1]){
            this.textNoti.node.color = cc.Color.YELLOW;
        }
        else{
            this.textNoti.node.color = cc.Color.RED;
        }
        this.textNoti.string = data[2];
    },

    // update (dt) {},
});
