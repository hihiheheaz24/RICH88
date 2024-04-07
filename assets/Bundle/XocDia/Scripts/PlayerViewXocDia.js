cc.Class({
    extends: cc.Component,

    properties: {
        lbName : cc.Label,
        lbChip : cc.Label,
        avatar : cc.Sprite
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.id = 0;
    },

    start () {

    },

    initPlayer(dataPlayer){
        cc.log("check data player : ", dataPlayer)
        Global.GetAvataById(this.avatar, dataPlayer.AccountId)
        this.id = dataPlayer.AccountId;
        this.lbName.string = dataPlayer.Username;
        this.lbChip.string = Global.formatMoneyChip(dataPlayer.IngameBalance);
    },

    // update (dt) {},
});
