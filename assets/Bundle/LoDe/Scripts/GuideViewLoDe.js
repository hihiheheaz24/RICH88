cc.Class({
    extends: cc.Component,

    properties: {
        imgGuide : cc.Sprite,
        listImgGuide : [cc.SpriteFrame]
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Global.GuideViewLoDe = this;

    },

    start () {

    },

    show() {
        Global.onPopOn(this.node);
        if(this.listImgGuide[Global.LoDe.typeBet])
            this.imgGuide.spriteFrame = this.listImgGuide[Global.LoDe.typeBet];
    },

    hide(){
        Global.onPopOff(this.node);
    },
    // update (dt) {},
});
