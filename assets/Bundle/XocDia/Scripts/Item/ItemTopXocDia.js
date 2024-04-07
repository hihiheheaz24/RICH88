cc.Class({
    extends: cc.Component,

    properties: {
        iconTop : cc.Sprite,
        listIconTop : [cc.SpriteFrame],
        lbTop : cc.Label,
        lbName : cc.Label,
        lbAmount  : cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    initItem(dataItem) {
        cc.log("init Item top", dataItem)
        this.lbName.string = dataItem.Nickname;
        this.lbAmount.string = Global.formatMoneyChip(dataItem.RankingPoint)
        this.lbTop.string = this.itemID + 1;
        this.lbTop.node.active = true;
        this.iconTop.node.active = false;
        switch (this.itemID) {
            case 0:
                this.lbTop.node.active = false;
                this.iconTop.node.active = true;
                this.iconTop.spriteFrame = this.listIconTop[0];
                break;
            case 1:
                this.lbTop.node.active = false;
                this.iconTop.node.active = true;
                this.iconTop.spriteFrame = this.listIconTop[1];
                break;
            case 2:
                this.lbTop.node.active = false;
                this.iconTop.node.active = true;
                this.iconTop.spriteFrame = this.listIconTop[2];
                break;
        }
    }

    // update (dt) {},
});
