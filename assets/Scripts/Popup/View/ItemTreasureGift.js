cc.Class({
    extends: cc.Component,

    properties: {
        sprIcon: cc.Sprite,
        lblGold: cc.Label,
        imgGold: cc.SpriteFrame,
        imgJackpot: cc.SpriteFrame,
        imgLixi: cc.SpriteFrame,
        imgCard10: cc.SpriteFrame,
        imgCard20: cc.SpriteFrame,
        imgCard50: cc.SpriteFrame,
        imgCard100: cc.SpriteFrame,
    },

    initItem(info) {
        if (this.itemID % 2 == 0) {
            this.node.children[0].active = false;
        } else {
            this.node.children[0].active = true;
        }
        lblGold.string = "X" + Global.formatNumber(info.Amount);
        if (info.RewardType == REWARD_TYPE.INGAME_BALANCE) {
            if (info.ItemType == 0) {
                this.sprIcon.spriteFrame = this.imgGold;
                this.sprIcon.node.scale = 1;
            } else if (info.ItemType == 1) {
                this.sprIcon.spriteFrame = this.imgJackpot;
                this.sprIcon.node.scale = 0.35;
            }
        } else if (info.RewardType == REWARD_TYPE.LIXI) {
            this.sprIcon.spriteFrame = this.imgLixi;
            this.sprIcon.node.scale = 0.5;
        } else if (info.RewardType == REWARD_TYPE.CARD) {
            let card = info.Amount / 1000;
            lblGold.string = "X1";
            if (card == 10) {
                this.sprIcon.spriteFrame = this.imgCard10;
            } else if (card == 20) {
                this.sprIcon.spriteFrame = this.imgCard20;
            } else if (card == 50) {
                this.sprIcon.spriteFrame = this.imgCard50;
            } else if (card == 100) {
                this.sprIcon.spriteFrame = this.imgCard100;
            }
            this.sprIcon.node.scale = 0.5;
        }
    },

});
