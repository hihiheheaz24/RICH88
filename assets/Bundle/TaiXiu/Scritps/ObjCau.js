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
        this.onEvent();
    },

    onEvent(){
        
        if(cc.sys.isMobile){
            this.node.on(cc.Node.EventType.TOUCH_MOVE , this.onTouchMove , this );
        }else{
            this.node.on(cc.Node.EventType.MOUSE_ENTER , this.onMouseHover , this );
        }
        this.node.on(cc.Node.EventType.MOUSE_LEAVE , this.onDisable , this );
        this.node.on(cc.Node.EventType.TOUCH_CANCEL , this.onDisable , this );
    },
    offEvent(){
        this.node.off(cc.Node.EventType.TOUCH_MOVE , this.onTouchMove , this );
        this.node.off(cc.Node.EventType.MOUSE_ENTER , this.onMouseHover , this );
        this.node.off(cc.Node.EventType.MOUSE_LEAVE , this.onDisable , this );
        this.node.off(cc.Node.EventType.TOUCH_CANCEL , this.onDisable , this );
    },

    
    onTouchMove(){
        Global.TaiXiu.viewInfoSesion(this.info , this.node);
    },

    onMouseHover(){
        Global.TaiXiu.viewInfoSesion(this.info , this.node);
    },

    onDisable(){
        Global.TaiXiu.offInfo();
    }, 

    setInfo(info){
        cc.log("check info cau", info)
        this.info = info;
        this.node.children[0].stopAllActions();
        this.node.children[0].y = 0;
       this.getComponentInChildren(cc.Sprite).spriteFrame = Global.TaiXiu.listSpFCau[parseInt(info.LocationIDWin) - 1];
    },
    onDestroy(){
        this.offEvent();
    },
    onClick(){
        // if(!this.info) return;
        cc.log("check currren : ",this.info.GameSessionID )
        Global.TaiXiu._curentGameSesionCau = this.info.GameSessionID;
        Global.UIManager.showMiniLoading();
        if(Global.ChiTietPhienTaiXiu){
            Global.ChiTietPhienTaiXiu.setInfo(this.info);
            Global.ChiTietPhienTaiXiu.show();
        }else{
            cc.loader.loadRes("TaiXiu/ChiTietPhien" , (err , prefab)=>{
                if(err) return;
                let node = cc.instantiate(prefab);
                node.getComponent("ChiTietPhienTaiXiu").setInfo(this.info);
                Global.UIManager.parentPopup.addChild(node);
                Global.ChiTietPhienTaiXiu.show();
            })
        }
        Global.UIManager.showMark();
    },
    initCilerBall(){
        
    },

    action(node){
        let nodeChildren = this.node.children[0];
        if(node.parent != null) node.parent = null;

        node.active=  true;
        node.parent = nodeChildren;
        nodeChildren.stopAllActions();
        nodeChildren.y = 0;
        var jumpUp = cc.moveBy(0.3, cc.v2(0, 20)).easing(cc.easeCubicActionOut());
        var jumpDown = cc.moveBy(0.3, cc.v2(0, -20)).easing(cc.easeCubicActionIn());
        nodeChildren.runAction(cc.repeatForever(cc.sequence(jumpUp , jumpDown)))

    },
    offAction(){
        let nodeChildren = this.node.children[0];
        nodeChildren.stopAllActions();
        nodeChildren.y = 0;
    }

    // update (dt) {},
});
