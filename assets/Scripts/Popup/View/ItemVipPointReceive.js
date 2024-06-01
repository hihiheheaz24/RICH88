// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        iconVip : cc.Sprite,
        listItemVip : [cc.SpriteFrame],
        lbReceive : cc.Label,
        btnReceive : cc.Button
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.data = null;
    },

    start () {

    },

    initItem(data){
        // IsReceived: false, Rewards: 30000
        this.data = data;
        this.iconVip.spriteFrame = this.listItemVip[data.VipLevel];
        this.lbReceive.string = Global.formatNumber(data.Rewards);
        this.btnReceive.interactable = data.IsReceived === true ? true : false;
    },

    onClickReceive(){
        let msg = {};
        msg[1] = this.data.VipLevel;
        require("SendRequest").getIns().MST_Client_Receive_Vip_Reward(msg);
    },

    // update (dt) {},
});
