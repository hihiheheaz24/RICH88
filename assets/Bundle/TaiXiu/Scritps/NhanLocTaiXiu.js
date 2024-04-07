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
        scrView: require ("BaseScrollView"),
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.listId = [];
        this.isSub = false;
        this.isInit = false;
        Global.NhanLocTaiXiu = this;
    },
    onDestroy(){
        Global.NhanLocTaiXiu = null;
    },
    start () {
        let node = cc.find("btn" , this.node);
        node.scale = 0.2;
        node.opacity = 30;

        let action1 = cc.scaleTo(0.3 , 1);
        let action2  =cc.fadeIn(0.15);
        let action3 = cc.rotateBy(0.3 , 720);

        node.runAction(cc.spawn(action1,action2,action3));

    },
    init(id){
        this.listId.push(id);
        if(!this.isInit){
            this.id = id;
        }else{
            cc.find("POPUP/btnSub" , this.node).active = true;
           // this.isSub = true;
        }
        this.isInit = true;
    },
    responseServer(packet){
        
        cc.find("POPUP" , this.node).active = true;
        cc.find("btn" , this.node).active = false;
        cc.find("POPUP/labelName" , this.node).getComponent(cc.Label).string = packet[1] +" PHÁT LỘC";
    
        let id = packet[5];
        let index = this.listId.indexOf(id);
        this.listId.splice(index , 1);
        if(this.listId.length < 1) {
            cc.find("POPUP/btnSub", this.node).active = false;
        }

        let state = packet[4];
        if(state ==0){
            cc.find("POPUP/ThangLoc", this.node).active = true;
            cc.find("POPUP/ThuaLoc", this.node).active = false;
            cc.find("POPUP/HetLoc", this.node).active = false;
            cc.find("POPUP/ThangLoc/NhanLoc/lbMoney" , this.node).getComponent(cc.Label).string = Global.formatNumber(packet[2]);
        }else if(state == 1){
            cc.find("POPUP/ThangLoc", this.node).active = false;
            cc.find("POPUP/ThuaLoc", this.node).active = true;
            cc.find("POPUP/HetLoc", this.node).active = false;
        }else{
            cc.find("POPUP/ThangLoc", this.node).active = false;
            cc.find("POPUP/ThuaLoc", this.node).active = false;
            cc.find("POPUP/HetLoc", this.node).active = true;
        }
        this.scrView.resetScr();
        let list = JSON.parse(packet[3]);
        this.scrView.init(list);
    },

    onClickNhanLoc(){
        let msg = {};
        msg[1] =this.listId[0];
        require ("NetworkManager").getIns().sendRequest(REQUEST_CODE.MSG_CLIENT_PROFIT_SHARING_RECEIVE , msg);
    },

    // onClickNhanSub(){
    //     let msg = {};
    //     msg[1] = this.id;
    //     require ("NetworkManager").getIns().sendRequest(REQUEST_CODE.MSG_CLIENT_PROFIT_SHARING_RECEIVE , msg);
    // },

    onClickClose(){
        //actionEffectClose(this.node , ()=>{
            this.node.destroy();
        //})
    },
    // update (dt) {},
});
