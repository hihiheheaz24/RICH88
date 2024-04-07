cc.Class({
    extends: cc.Component,

    properties: {
       
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    show(){
        Global.onPopOn(this.node);
    },

    hide(){
        Global.onPopOff(this.node);
    },

    // update (dt) {},
});
