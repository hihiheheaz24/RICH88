// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

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
        
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        this.amount = 0;
     },

    start () {

    },
    onClickBtn(){
        if(this.amount == 0) return;
        let msg = {};
        msg[1] = this.amount
       require ("NetworkManager").getIns().sendRequest(REQUEST_CODE.MSG_CLIENT_PROFIT_SHARING_CREATE , msg);
        this.onClickRemove();
    },
    onClickClose(){
        actionEffectClose(this.node , ()=>{
            this.node.destroy();
        })
    },
    onClickRemove(){
        this.node.getComponentInChildren(cc.EditBox).string = "";
        this.amount = 0;
    },
    textChange(event){
        let str = event.replace(/\./g , "");
        this.amount = parseInt(str);
        this.node.getComponentInChildren(cc.EditBox).string = Global.formatNumber(str);
    },

    onClickPrice(event){
        let node = event.target;
        let infoString = node.getComponentInChildren(cc.Label).string;
        infoString = infoString.replace(/\./g, "");
        this.amount += parseInt(infoString);
        this.node.getComponentInChildren(cc.EditBox).string = Global.formatNumber(this.amount);
    }

    // update (dt) {},
});
