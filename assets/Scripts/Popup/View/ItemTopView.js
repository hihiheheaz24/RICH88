// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        listSpriteFrameRank: [cc.SpriteFrame],
        lbRank: cc.Label,
        lbNamePlayer: cc.Label,
        lbChipWin: cc.Label,
        lbBonus: cc.Label,
        avatar  : cc.Sprite,
        bgItem : cc.Sprite,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    init(data){
        cc.log("init item top view :", data);
        this.lbNamePlayer.string = data.NickName;
        this.lbChipWin.string = Global.formatNumber(data.TotalWinMoney);
        this.lbBonus.string = Global.formatNumber(data.TotalBonus);
        this.lbRank.string = data.Rank;
        Global.GetAvataById(this.avatar,  data.AccountId);
        this.bgItem.spriteFrame = this.listSpriteFrameRank[0];
        if (data.AccountId == MainPlayerInfo.accountId){
            Global.TopView.itemTopIsMe = this.node
            this.bgItem.spriteFrame = this.listSpriteFrameRank[1]
        }
    },

    initIsMe(data){
        cc.log("init item top view :", data);
        this.lbNamePlayer.string = data.NickName;
        this.lbChipWin.string = Global.formatNumber(data.TotalWinMoney);
        this.lbBonus.string = Global.formatNumber(data.TotalBonus);
        if(data.Rank === 0) data.Rank = 999;
        this.lbRank.string = data.Rank;
        Global.GetAvataById(this.avatar,  data.AccountId)
    },
});
