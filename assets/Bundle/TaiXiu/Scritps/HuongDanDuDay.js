cc.Class({
    extends: cc.Component,

    properties: {
    
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Global.HDDuDay = this;
    },

    start () {

    },

    show(){
        Global.onPopOn(this.node);
        Global.UIManager.hideMiniLoading();
    },

    hide(){
        Global.onPopOff(this.node)
    },

    // update (dt) {},
});
