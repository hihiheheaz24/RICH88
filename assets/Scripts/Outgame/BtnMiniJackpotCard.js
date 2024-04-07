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
       // lbText:require("LbMonneyChange")
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.dataJack = null;
        Global.BtnMiniJackpotCard = this;

        this.posCache = null;
        this.savePos = this.node.position;
        // let offsetX = cc.winSize.width / 2;
        // let offsety = cc.winSize.height / 2;
        let offsetX = cc.winSize.width / 2;
        let offsety = cc.winSize.height / 2;


        this.node.on(cc.Node.EventType.TOUCH_START, (touch) => {
            let v2Touch = cc.v2(touch.getLocation());
            let target = v2Touch.subSelf(cc.v2(offsetX, offsety));
            this._vecStart = target;
            this._v2OffsetChange = this.node.position.subSelf(target);
            this._isMoveBtnMiniGame = false;
            this._isTouch = true;
        })

        this.node.on(cc.Node.EventType.TOUCH_MOVE, (touch) => {
           
            if (this._isTouch) {
                let v2Touch = cc.v2(touch.getLocation());
                let target = v2Touch.subSelf(cc.v2(offsetX, offsety));
                this.node.position = target.addSelf(this._v2OffsetChange);
                this.savePos = this.node.position;
                this._isMoveBtnMiniGame = true;
            }
        })

        this.node.on(cc.Node.EventType.TOUCH_CANCEL, (touch) => {

            this._isTouch = false;
            this.checkPosition();
            if (!this._isMoveBtnMiniGame) this.onClick();
        })

        this.node.on(cc.Node.EventType.TOUCH_END, (touch) => {

            this._isTouch = false;
            let v2Touch = cc.v2(touch.getLocation());
            let target = v2Touch.subSelf(cc.v2(offsetX, offsety));


            if (target.subSelf(this._vecStart).mag() < 15) {
                this.onClick();
            }else{
                this.checkPosition()
            }
        })
        this.poolMoney = new cc.NodePool();


        this.height = 1080/2;
        this.width = 1920/2;
    },
    onDestroy() {
        Global.BtnMiniJackpotCard = null;
    },
    // reviceData(data){
    //     cc.log("data jack la " + JSON.stringify(data) );
    //     this.lbText.setMoney(data[32]);
    //     this.dataJack = data;
    // },

    start () {

    },
    onClick() {
        if(this.node.getNumberOfRunningActions() > 0) return;
        Global.UIManager.showJackpotCard();
    },
    checkPosition(){
        //  if(!this._isOpen){
              let X =0;
              let Y = this.node.y;
              let posTarget = null;
              if(this.node.y > this.height - this.node.height/2) Y = this.height - this.node.height/2;
              if(this.node.y < -this.height + this.node.height/2) Y = -this.height + this.node.height/2;
      
              if(this.node.x >= 0){
                  posTarget = cc.v2(this.width - this.node.width/2 -10 , Y);
              }else{
                  posTarget = cc.v2(-this.width  + this.node.width/2 +10, Y);
              }
              this.node.stopAllActions();
              this.node.runAction(cc.moveTo(0.15 , posTarget).easing(cc.easeBackOut()) )
        //  }
  
         
      },

    // update (dt) {},
});
