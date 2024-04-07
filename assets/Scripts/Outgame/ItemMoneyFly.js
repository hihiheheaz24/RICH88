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
        textClone:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.poolMoney = new cc.NodePool();
    },

    start () {

    },
    initItem(listStr){
        // let action = cc.callFunc(()=>{
        //     let nameGame = getNameGameByCode(gameType);
        //     let str = "<color=#00F5FF>%s\n</c><color=#FFFF00>+%n</color>";
        //     str = str.replace("%s" ,nameGame);
        //     str = str.replace("%n" ,formatMoney(money));
        //     let node = this.getMoneyClone();
        //     this.node.addChild(node);
        //     node.active = true;
        //     node.getComponent(cc.RichText).string = str;
        //     node.setPosition(0,0);
        //     let action1 = cc.moveBy(0.2 , 0,70).easing(cc.easeBackOut());
        //     node.runAction(cc.sequence(action1, cc.delayTime(1.2) , cc.callFunc(()=>{
        //         this.poolMoney.put(node);
        //         this.listScheduMoneyFly.shift()
        //         if(this.listScheduMoneyFly.length > 0){
        //            this.node.runAction(this.listScheduMoneyFly[0]);
        //         }
        //     })))
        // })
        this.node.active = true;
        cc.log("chay voa init item");
        let length = listStr.length;
        let widdth = 40 * (length - 0.5);
        for(let i = 0 ; i < length ; i++){
            let node = this.getMoneyClone();
            node.getComponent(cc.RichText).string = listStr[i];
             this.node.addChild(node);
             node.active = true;
             node.y = (-40*(i+0.5));
        }
        //let offsetY = this.node.wid
        let action1 = cc.moveBy(0.2 , 0,(widdth+50)).easing(cc.easeBackOut());
        this.node.runAction(cc.sequence(action1 , cc.delayTime(1.2) , cc.callFunc(()=>{
            this.releaseText();
        }) ))
    },

    releaseText(){
        return;
        let length = this.node.childrenCount;
        for(let i = 0 ; i < length ; i++ ){
            this.poolMoney.put(this.node.children[0]);
        }
        this.node.y = 20;
        this.node.active = false;
    },

    getMoneyClone(){
        let node = null;
        if(this.poolMoney.size() > 0){
            node = this.poolMoney.get();
        }else{
            node = cc.instantiate(this.textClone);
        }
        return node;
    },


    // update (dt) {},
});
