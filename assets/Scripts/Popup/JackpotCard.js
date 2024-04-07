// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

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
        src:require("BaseScrollView")
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Global.JackpotCard = this;
    },
    onDestroy () {
        Global.JackpotCard = null;
    },

    show(){
        Global.onPopOn(this.node);
        if(!Global.JackpotController.dataJack[39]) return;
        let list = Global.JackpotController.dataJack[39].slice();
        for(let i = 0 , l = list.length; i < l ; i++){
            list[i] = JSON.parse(list[i]);
        }
        this.init(list);
    },
    init(data){
        cc.log("======> data parse : " , data);
        this.src.resetScr();
        this.src.init(data, (data.length * 70), 70);
    },
    onClickClose(){
        Global.onPopOff(this.node);
    }
    // update (dt) {},
});
