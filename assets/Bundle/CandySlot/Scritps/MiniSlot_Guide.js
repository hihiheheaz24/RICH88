cc.Class({
    extends: cc.Component,

    properties: {
        listSprGuide : [cc.SpriteFrame],
        itemGuilde : cc.Sprite
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Global.GuideMiniSlot = this;
    },

    start() {
        this.index = 0;
        this.itemGuilde.spriteFrame = this.listSprGuide[0];
     },

    onClickNext(){
        this.index++;
        if(this.index >= 2) this.index = 2;
        this.itemGuilde.spriteFrame = this.listSprGuide[this.index];
    },

    onClickPreview (){
        this.index--;
        if(this.index <= 0) this.index = 0;
        this.itemGuilde.spriteFrame = this.listSprGuide[this.index];
    },

    onClickClose() {
        // Global.UIManager.hideMask();
        actionEffectClose(this.node , ()=>{
            this.node.active = false;
        })
    },
    show(){
        Global.UIManager.hideMiniLoading();
        this.node.active = true;
        actionEffectOpen(this.node);
    },
    onDestroy() {
        Global.GuideMiniSlot = null;
    }

    // update (dt) {},
});
