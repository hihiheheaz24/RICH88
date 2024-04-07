// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        lbStt: cc.Label,
        lbName: cc.Label,
        lbPoint: cc.Label,
        lbPrice: cc.Label,
        bgPoint: cc.Sprite,
        listSpr: [cc.SpriteFrame],
        avatar  : cc.Sprite,
        bgItem : cc.Sprite,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    setInfo(data) {
        this.lbStt.string = data.Order;
        this.lbName.string = data.NickName;
        this.lbPoint.string = data.Point;
        this.bgItem.spriteFrame = this.listSpr[0];
        Global.GetAvataById(this.avatar,  data.AccountId)
        if(data.AccountId == MainPlayerInfo.accountId){
            Global.EventRanking.itemTopIsMe = this.node;
            this.bgItem.spriteFrame = this.listSpr[1];
        }
        if(data.RewardInfo)
            this.lbPrice.string = Global.formatNumber(data.RewardInfo);
    },

    setInfoIsMe(data) {
        if(data.Order === 0) data.Order = 999;
        this.lbStt.string = data.Order;
        
        if(data.NickName.length > 10){
            this.lbName.string = data.NickName.substring(0, 10) + '...';
        }
        else{
            this.lbName.string = data.NickName;
        }
        this.lbPoint.string = data.Point;
        if(data.RewardInfo)
            this.lbPrice.string = Global.formatNumber(data.RewardInfo);
        Global.GetAvataById(this.avatar,  data.AccountId)
    },

    // update (dt) {},
});
