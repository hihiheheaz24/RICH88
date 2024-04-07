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
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.updateInterval = 0.2;
        this.updateTimer = 0;
        this.offsetX = cc.winSize.width / 2;
        this.offsety = cc.winSize.height/2;
        this.node.on(cc.Node.EventType.TOUCH_START  , this.tStart , this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE , this.move, this);

        this.node.on(cc.Node.EventType.TOUCH_CANCEL , this.tCancel , this);

        this.node.on(cc.Node.EventType.TOUCH_END , this.tEnd , this);
    },

    start () {

    },
    move(touch){
        if(this._isTouch){
            let v2Touch = cc.v2(touch.getLocation()) ;
            let target = v2Touch.sub(cc.v2(this.offsetX , this.offsety));
            this.node.position = target.add(this._v2OffsetChange) ;
        }
    },
    tStart(touch){
        let v2Touch = cc.v2(touch.getLocation());
        let target = v2Touch.subSelf(cc.v2(this.offsetX , this.offsety));
        this._v2OffsetChange = this.node.position.subSelf(target);
       this._isTouch = true;
        this.setFirtIndex();
    },
    tCancel(touch){
        this._isTouch = false;
    },
    tEnd(touch){
        this._isTouch = false;
    },

    onDestroy(){
        this.node.off(cc.Node.EventType.TOUCH_START , this.tStart , this);
        this.node.off(cc.Node.EventType.MOUSE_MOVE ,this.move, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL , this.tCancel, this);
        this.node.off(cc.Node.EventType.TOUCH_END , this.tEnd, this);
    },
    setFirtIndex(){
        this.node.setSiblingIndex(this.node.parent.childrenCount - 1);
        this.node.scale = 1;
    }
    // update (dt) {
      
    // },
});
