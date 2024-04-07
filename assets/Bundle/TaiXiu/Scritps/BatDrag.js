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
        _isTouch :false,
        _v2OffsetChange:null,
        _isOpenBat:false,
        _isDragBat: true,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.updateInterval = 0.2;
        this.updateTimer = 0;
        let offsetX = cc.winSize.width / 2;
        let offsety = cc.winSize.height/2;
        this.node.on(cc.Node.EventType.TOUCH_START  , (touch)=>{
            let v2Touch = cc.v2(touch.getLocation());
            let target = v2Touch.subSelf(cc.v2(offsetX , offsety));
            this._v2OffsetChange = this.node.position.subSelf(target);
           this._isTouch = true;
           Global.TaiXiu.getComponent("DragMiniGame")._isDrag = true;
        })

        this.node.on(cc.Node.EventType.TOUCH_MOVE , (touch)=>{
            if(this._isTouch && this._isDragBat){
                let v2Touch = cc.v2(touch.getLocation());
                let target = v2Touch.sub(cc.v2(offsetX , offsety));
                this.node.position = target.add(this._v2OffsetChange) ;
            }
        })
        
        this.node.on(cc.Node.EventType.TOUCH_CANCEL , (touch)=>{
            this._isTouch = false;
            Global.TaiXiu.getComponent("DragMiniGame")._isDrag = false;
        })

        this.node.on(cc.Node.EventType.TOUCH_END , (touch)=>{
            this._isTouch = false;
            Global.TaiXiu.getComponent("DragMiniGame")._isDrag = false;
        })       
    },
    onEnable(){
        this._isOpenBat = false;
    },
    onDisable(){
        Global.TaiXiu.getComponent("DragMiniGame")._isDrag = false;
    },
    update (dt) {
        if(this._isOpenBat) return;
        this.updateTimer += dt;
        if (this.updateTimer < this.updateInterval) return; // we don't need to do the math every frame
        this.updateTimer = 0;
        let vec = this.node.position.subSelf(cc.v2(0,80)).mag();
        if(vec > 240 ){
            this._isOpenBat = true;
            this.node.parent.getComponentInChildren("CountDownTaiXIu")._isDragBat = true;
            Global.TaiXiu.showResult(Global.TaiXiu._sum3Dice);
        }
    },
    openBat(){
        if(!this._isTouch)
        this.node.runAction(cc.moveTo(1 , cc.v2(-7,-486)));
    }
});
