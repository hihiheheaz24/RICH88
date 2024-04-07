cc.Class({
    extends: cc.Component,

    properties: {
        imgSpin: cc.Node,
        imgCard: cc.Sprite,
    },

    Force() {
        this.blur.active = false;
        this.imgSpin.active = false;
    },

    SetImage(cardName) {
        if (Global.MiniPoker) {
            this.imgCard.spriteFrame = Global.MiniPoker.getSpriteCard("bai_" + cardName);
        }
    },


});
