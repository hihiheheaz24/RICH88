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
    editor: {
        requireComponent: cc.Label,
    },
    ctor(){
       this.objEasing= {};
       this._currentMonney=0;
       this._monney=0;
       this.isChangeBB = false;
    },
    properties: {
        time:{
            default:0.5,
            type :cc.Float,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.lb = this.getComponent(cc.Label);
        this.motion = 0;
        this.timeMotion = 0;
    },

    start () {
        
    },
    resetLb(){
        cc.Tween.stopAllByTarget(this);
       if(this.lb) this.lb.string = "0";
        this._currentMonney = 0;
        this._monney = 0;
    },
    setMoneyNoTime(money , formatMoney = false){
        this.resetLb();
        this._currentMonney = money;
        this._monney = money;
        if(formatMoney){
            this.lb.string = Global.formatMoney(parseInt(this._currentMonney));
        }else{
            this.lb.string = Global.formatNumber(parseInt(this._currentMonney));
        }
    },
    onDestroy(){
        cc.Tween.stopAllByTarget(this);

    },
    setMoney(monney , isFormatMoney = false, frontString = ""){
        cc.Tween.stopAllByTarget(this);
        this.formatMoney = isFormatMoney;
        this._monney = monney;
        cc.log("chay vao set monery : ", monney)
        cc.tween(this)
         .to(this.time, { _currentMonney:{
          value:this._monney,
          progress:(start, end, current, ratio) =>{
              let _current = start + (end - start)*ratio;
              
              if(isFormatMoney){
                this.lb.string = frontString+Global.formatMoney(parseInt(_current) , 1 , 1000000);
              }else{
                if(this.lb)
                    this.lb.string = frontString+Global.formatNumber(parseInt(_current));
                else{
                    cc.log("loi ko tim thay labal")
                }
              }
            return _current
          }
        } },  this.objEasing)
        .start();
    },
    setMoneyPoker(monney, agTable = 0, isChangeBB = false, time = 0.5, addText = " BB") {
        if(this.isChangeBB !== isChangeBB) this.resetLb();
        this.isChangeBB = isChangeBB;
        cc.Tween.stopAllByTarget(this);
        if(isChangeBB){
            if(monney % (agTable*2) !== 0){
                this._monney = parseFloat((monney / (agTable*2)).toFixed(2));
            }
            else{
                this._monney = parseInt(monney / (agTable*2));
            }
        }
        else{
            this._monney = parseInt(monney);

        }
        if(this._monney < 0) this._monney = 0;
        this.time = time;
        cc.tween(this)
            .to(this.time, {
                _currentMonney: {
                    value: this._monney,
                    progress: (start, end, current, ratio) => {
                        let _current = start + (end - start) * ratio;
                        if(this.isChangeBB){
                            if(this.lb) this.lb.string = Global.formatNumberPoker(_current) + addText;
                        }
                        else{
                            if(this.lb) this.lb.string = Global.formatNumber(parseInt(_current));
                        }
                        return _current
                    }
                }
            }, this.objEasing)
            .start();
    },

});
