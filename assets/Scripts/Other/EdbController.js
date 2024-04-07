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
    },
    ctor(){
        this.listEventEnter = [];
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Global.EDBController = this;
        this.node.x = cc.winSize.width/2;
        this.node.y = cc.winSize.height/2;
        cc.game.addPersistRootNode(this.node);
       // if (cc.sys.isBrowser && !cc.sys.isMobile) {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
      //  }
      
    },
    onDestroy(){
        Global.EDBController = null;
    },
    onEventEnter(fun) {
       // if(cc.sys.isMobile) return;
        this.listEventEnter.unshift(fun);
    },
    offEventEnter(fun) {
      //  if(cc.sys.isMobile) return;
        let index = this.listEventEnter.indexOf(fun);
        if (index != -1)
            this.listEventEnter.splice(index, 1);
    },
    start () {

    }, 
    checkAndChangePositionEDB(edb , nodeMove){
        if(!cc.sys.isMobile) return;
        //cc.log("chay vao change position")
        let worldPos = edb.node.parent.convertToWorldSpaceAR(edb.node.getPosition());
        let viewPos = this.node.convertToNodeSpaceAR(worldPos);
        cc.log(viewPos.y);
        cc.log(worldPos.y);
        
        let offset = 100;
            if(Global.GetPlatFrom() == 3) offset = 125;
        console.log("dcm chay vao 1 : ", offset)
        if(viewPos.y  < offset){
            this.nodeCacheEDB = nodeMove;
            this.posCacheEDB = this.nodeCacheEDB.position;
            this.nodeCacheEDB.stopAllActions();
            let y = offset - viewPos.y;
            if(Global.LobbyView == null) y = y* 0.6666666;
            this.nodeCacheEDB.runAction(cc.moveBy(0.1 , 0 , y));
            console.log("set pos la : ", y)
        }
    },
    endNodeEDB(){
        if(this.nodeCacheEDB != null && this.posCacheEDB != null){
            this.nodeCacheEDB.stopAllActions();
            this.nodeCacheEDB.runAction(cc.moveTo(0.1 , this.posCacheEDB));
            this.nodeCacheEDB = null;
            this.posCacheEDB = null;
        }
    },

    onKeyDown(event) {
        switch (event.keyCode) {
            case 6:
              // cc.lgo("back roi nay+")
            break;

            case cc.macro.KEY.enter:
                if (this.listEventEnter.length > 0)
                    this.listEventEnter[0].call();
                    cc.log("chay vao enter nay")
                break;
            case cc.macro.KEY.f5:
                window.location = window.location;
                break;
            // case cc.KEY.tab:
            //     cc.log("onClick Tab")
            //     if(this.listEditBoxCurret.length > 0){
            //         this.currentIndexEdb++;
            //         if(this.currentIndexEdb > this.listEditBoxCurret[0].length - 1)this.currentIndexEdb = 0;
            //         this.listEditBoxCurret[0][this.currentIndexEdb]._sgNode._renderCmd._edTxt.focus();
            //     }
            //     break;
            default:
                break;
        }
        //if (Global.TaiXiu) Global.TaiXiu.keyBoard.onInputKeyBoard(event.keyCode);
    },

    // update (dt) {},
});
