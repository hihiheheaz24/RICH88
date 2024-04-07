// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,
    editor: {
        requireComponent: "LbMonneyChange"
    },
    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.lbMoney = this.getComponent("LbMonneyChange");
        this.lbMoney.time = 2;
        Global.JackpotController.dangKyLabelCard(this);
    },
    onEnable(){
        if(Global.JackpotController && Global.JackpotController.dataJack)this.emitNewDataJackpot();
    },
    onDestroy(){
        if(Global.JackpotController) Global.JackpotController.huyDangKyLabelCard(this);
     },
   
    emitNewDataJackpot(){
        if(this.node.activeInHierarchy)
        this.lbMoney.setMoney(Global.JackpotController.dataJack[32]);
    }

    // update (dt) {},
});
