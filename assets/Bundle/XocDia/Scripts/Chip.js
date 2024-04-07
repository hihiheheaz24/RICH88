cc.Class({
    extends: cc.Component,

    properties: {
        imgChip: cc.Sprite,
        listImg: [cc.SpriteFrame],
        lbValue: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.chipValue = 0;
    },

    start() {

    },

    onMove(pos, time, isDestroy = false) {
        this.node.angle = Math.random() * 180
        this.node.runAction(cc.sequence(cc.moveTo(time, pos).easing(cc.easeCubicActionOut()), cc.callFunc(() => {
            if (isDestroy) {
                this.node.destroy();
            }
        }))
        )
    },

    setImg(valueChip) {
        switch (valueChip) {
            case 1000:
                this.imgChip.spriteFrame = this.listImg[0];
                break;
            case 5000:
                this.imgChip.spriteFrame = this.listImg[1]
                break;
            case 10000:
                this.imgChip.spriteFrame = this.listImg[2]
                break;
            case 50000:
                this.imgChip.spriteFrame = this.listImg[3]
                break;
            case 100000:
                this.imgChip.spriteFrame = this.listImg[4]
                break;
            case 500000:
                this.imgChip.spriteFrame = this.listImg[5]
                break;
            case 1000000:
                this.imgChip.spriteFrame = this.listImg[6]
                break;
        }
        this.lbValue.string = Global.formatMoneyChip(valueChip);
        this.chipValue = valueChip;
    }

    // update (dt) {},
});
