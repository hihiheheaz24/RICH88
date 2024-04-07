// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        scr:require("BaseScrollView"),
        btnCheckAll : cc.Toggle
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Global.MoiChoi = this;
    },
    onDestroy(){
        Global.MoiChoi = null;
    },
    show(){
        this.scr.resetScr();
        Global.onPopOn(this.node);
        this.listInvite= [];
        this.isCheckAll = false;
        this.btnCheckAll.uncheck();
    },
    reviceData(packet){
        console.log("=========> package moi choi : ", packet)
        Global.UIManager.hideMiniLoading();
        let listPlayer = packet[38];
        for(let i = 0 , l = listPlayer.length ; i < l; i++){
            listPlayer[i] = JSON.parse(listPlayer[i]);
            listPlayer[i].isChecked = false;
        }
        this.scr.init(listPlayer , listPlayer.length * 106 , 106);
    },
    onHide(){
        Global.onPopOff(this.node);
    },
    sendListInvite(){
        cc.log("======> list la : ", this.listInvite);
        if(this.listInvite.length < 1) return;
        let listId = [];
        for(let i = 0 , l = this.listInvite.length; i < l ; i++){
            listId.push(this.listInvite[i].data.AccountId);
        }
        let data = {};
        data[13] = listId;
        cc.log("list send en " + JSON.stringify(listId));
        require("SendCardRequest").getIns().MST_Client_Send_Player_Invite_List(data);
        Global.UIManager.showAlertMini( MyLocalization.GetText("MOITHANHCONG"));
        this.onHide();
    },
    eventToggleMoiChoi() {
        cc.log("======> list check invite la : ", this.scr.content.children);
        let listItemInvite = this.scr.content.children;
        this.isCheckAll = !this.isCheckAll;
        if (this.isCheckAll) {
            let list = this.scr._listInfo;
            for (let i = 0, l = list.length; i < l; i++) {
                list[i].isChecked = true;
            }
            this.scr.updateAllItemInView();
            for (let i = 0; i < listItemInvite.length; i++) {
                const objItem = listItemInvite[i];
                objItem.getComponent("ItemPlayerInvite").checkList();
            }
        }
        else {
            let list = this.scr._listInfo;
            for (let i = 0, l = list.length; i < l; i++) {
                list[i].isChecked = false;
            }
            this.scr.updateAllItemInView();
            for (let i = 0; i < listItemInvite.length; i++) {
                const objItem = listItemInvite[i];
                objItem.getComponent("ItemPlayerInvite").checkList();
            }
        }
    },
    onEnable() {
        Global.UIManager.showMiniLoading();
        require("SendCardRequest").getIns().MST_Client_Player_Invite_List();
    },
    dangKyList(component){
        if(!this.listInvite.includes(component))
        this.listInvite.push(component);
    },
    huyDangKy(component){
        let index = this.listInvite.indexOf(component);
        if(index > -1) this.listInvite.splice(index , 1);
    }

    // update (dt) {},
});
