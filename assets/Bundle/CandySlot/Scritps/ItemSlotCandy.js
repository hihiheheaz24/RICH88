// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,
    ctor(){
        this.listSpItem = null;
        this.stateSpin = 0;
        this.funReject = null;
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
        listSpBlur:[cc.Sprite],
        aniBlur:cc.Animation,
        parentItem:cc.Node,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {},


    randomFirtGame(){
        let listNode = this.getListItemSp();
        for(let i = 0 , l = listNode.length ; i < l ; i++){
            let cpSp = listNode[i].getComponentInChildren(cc.Sprite);
            cpSp.spriteFrame = Global.MiniSlot.asset.listSpItem[Global.RandomNumber(0,6)];
        }
    },
    setIsResult(){
        let children = this.parentItem.children;;
         children[3].active = false;
        children[4].active = false;
    },
    // setResult(listId){
    //     let listNode = this.getListItemSp();
    //     for(let i = 0 , l = listNode.length ; i < l ; i++){
    //         let cpSp = listNode[i].getComponentInChildren(cc.Sprite);
    //         cpSp.spriteFrame = Global.MiniSlot.asset.listSpItem[listId[i]-1];
    //     }

    // },
    getListItemSp(){
        if(this.listSpItem != null) return this.listSpItem;
        this.listSpItem = [];
        let children = this.parentItem.children;
        for(let i = 0 ; i < 3  ; i++){
            this.listSpItem.push(children[i]);
        }
        return this.listSpItem;
    },
    runSpin(){
        this.randomBlur();
        let deltal = Global.MiniSlot.isMaxSpeed ? 2 : 1;
        let actionMoveUp = cc.moveBy(0.12 / deltal, 0 , 40).easing(cc.easeSineOut());
        let actionMoveDown = cc.moveBy(0.2 / deltal, 0 , -360 ).easing(cc.easeSineIn());
        let funCall = cc.callFunc(()=>{
            this.aniBlur.node.active = true;
            this.aniBlur.play("ItemBlur");
            this.node.y = 0;
            this.parentItem.active = false;
        })
        this.node.stopAllActions();
        this.node.runAction(cc.sequence(actionMoveUp , actionMoveDown , funCall))
        this.stateWhel = StateSpin.Run;
    },
    stopSpin(delay = 0 , funNext , funReject){
        if(this.stateWhel == StateSpin.Stop ){

           this.funReject();
            funNext();
            return;
        }

        let funCall = cc.callFunc(()=>{
            this.stateWhel = StateSpin.Stop;
            this.node.y = 0;
            this.parentItem.active = true;
            this.aniBlur.node.active = false;
        })
        let deltal = Global.MiniSlot.isMaxSpeed ? 2 : 1;
        this.funReject = funReject;
        let actionMoveDown = cc.moveBy(0.12/ deltal, 0 , -40).easing(cc.easeSineOut());
        let actionMoveUp = cc.moveBy(0.12 / deltal, 0 , 40).easing(cc.easeSineIn());
        let actionDelay = cc.delayTime(delay);
        let acNext = cc.callFunc(funNext)
        this.node.stopAllActions();
        this.node.runAction(cc.sequence( actionDelay , funCall,actionMoveDown , actionMoveUp , acNext))
        
    },
    stopEndGame(){
        this.stateWhel = StateSpin.Stop;
        this.node.y = 0;
        this.parentItem.active = true;
        this.aniBlur.node.active = false;
        this.node.stopAllActions();
        if(this.funReject)this.funReject();
    },
    randomBlur(){
        let children = this.parentItem.children;;
        let itemFake1 = children[3];
        let itemFake2 = children[4];
        itemFake1.getComponentInChildren(cc.Sprite).spriteFrame = Global.MiniSlot.asset.listSpItem[Global.RandomNumber(0,6)];
        itemFake2.getComponentInChildren(cc.Sprite).spriteFrame = Global.MiniSlot.asset.listSpItem[Global.RandomNumber(0,6)];
        for(let i = 0 , l = this.listSpBlur.length ; i<l; i++){
            let rd = Global.RandomNumber(0,3);
            this.listSpBlur[i].spriteFrame = Global.MiniSlot.asset.listSpItemBlur[rd];
        }
    }
    // update (dt) {},
});
