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
        lb1:cc.Label,
        lb2:cc.Label,

        lb3:cc.Label,
        _time:0,
        _isEndTimebet:false,
        bkgCountdown:cc.Node,
        _isDragBat:false,
        nodeVongQuay:cc.Node,

        nodeCountDownReward:cc.Node,
        nodeResultPoint:cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //this.bkgCountdown.children[0].runAction(cc.repeatForever(cc.rotateBy(2,360)));
        //Global.UIManager.addEventHideTime(this);
        this.state = 1;
        this.nodeVongQuay.runAction(cc.repeatForever(cc.rotateBy(10, 1800)))
    },

    startCountDown(time , type = 1){
        
        cc.log("start count dw : " , time, "type : ", type)
        this._time = time;
        this.state = type;
        this.resetView();
        cc.log("check loi 2222")
        clearInterval(this.funInterval);
        this.funInterval = setInterval(()=>{
            this._time --;
            this.updateTimeEffect();
        } , 1000)
    },

    updateTimeEffect(){
        if(this._time <= 0 ){
            this.lb2.string = 0;
            this.lb1.string = 0;
            return;
        }
        if(this.state == 1){
            let stringTime = this._time.toString();
            if(stringTime.length < 2) stringTime = "0" + stringTime;
            let num1 = stringTime[0];
            let num2 = stringTime[1];
            if(num1 != this.lb1.string) this.effectChange(this.lb1.node);
            this.lb1.string = num1;
            if(num2 != this.lb2.string) this.effectChange(this.lb2.node);
            this.lb2.string = num2;
            if(this._time <5 && !this._isEndTimebet ){
                this.endTimeBet();
                this._isEndTimebet = true;
            }
        }else{
            // if(this._time < 10){
            //    
            //     this.nodeResultPoint.active = false;
            // }
            this.nodeCountDownReward.active = true;
            let stringTime = this._time.toString();
            if(stringTime.length < 2) stringTime = "0" + stringTime;
            this.lb3.string = "00:"+ stringTime;
            if(this._time < 4 && !this._isDragBat){
                this._isDragBat = true;
                this.node.parent.getComponentInChildren("BatDrag").openBat();
            }
        }
        
    },
    resetView(){
        let timeBet = Global.BtnMiniGame.timeType1.toString();
        let timeReward = Global.BtnMiniGame.timeType2.toString();

        let timeCurrent = Global.BtnMiniGame.currentTimeTx.toString();

        if(timeCurrent != -1) {
            timeBet = timeCurrent;
            timeReward = timeCurrent;
        }

        if(timeBet.length < 2) timeBet = "0" + timeBet;
        if(timeReward.length < 2) timeReward = "0" + timeBet;
        this._isEndTimebet = false;
        this._isDragBat = false;
        this.nodeCountDownReward.active = false;
        if(this.state == 1){
            this.nodeVongQuay.resumeAllActions();
            this.lb1.node.y = 7;
            this.lb2.node.y = 7;
            this.lb1.node.stopAllActions();
            this.lb2.node.stopAllActions();
            this.lb1.string = timeBet[0];
            this.lb2.string = timeBet[1];
            this.lb1.node.color = cc.Color.WHITE;
            this.lb2.node.color = cc.Color.WHITE;
            this.lb1.node.opacity = 255;
            this.lb2.node.opacity = 255;
            this.nodeResultPoint.active = false;
            this.bkgCountdown.active = true;
        }else{
            this.nodeVongQuay.pauseAllActions()
            this.bkgCountdown.active = false;
            this.lb3.string = "00:"+ timeReward;
        }
       


    },
    
    effectChange(node){
        node.opacity = 0;
        node.y += 40;
        let action1 = cc.moveBy(0.3 , cc.v2(0,-40)).easing(cc.easeBackOut());
        let action12 = cc.fadeIn(0.15);
        node.runAction(cc.spawn(action1,action12));
    },
    endTimeBet(){
        this.node.parent.getComponentInChildren("KeyboardTaiXiu").endTimeBet();
        this.lb1.node.color = cc.Color.RED;
        this.lb2.node.color = cc.Color.RED;
    },
    onDestroy(){
        clearInterval(this.funInterval)
    }

    // update (dt) {},
});
