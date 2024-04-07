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
        time: {
            default: 0.5,
            type: cc.Float,
        },

        _currentMonney: 0,
        _monney: 0,
        _deltaMonney: 0,
        _state: false,
        _label: null,
        _startX: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.lb = this.getComponent(cc.Label);
        this.motion = 0;
        this.timeMotion = 0;
    },

    onEnable() {

    },

    start() {
        if(this._monney > 0)
            this.StartIncreaseTo(this._monney);
    },

    StartIncreaseTo(monney, formatMoney = false) {
        this._monney = monney;
        if(this.node.active) {
            this.formatMoney = formatMoney;
            this.monneyChange = monney - this._currentMonney;
            this.motion = (2 * this.monneyChange) / (this.time * this.time);
            this._startX = this._currentMonney;
            this.timeMotion = 0;
            this._state = true;
        } else {
            this._currentMonney = monney;
        }
        
    },
    update(dt) {
        if (this._state) {
            this._currentMonney = this._startX + (0.5 * this.timeMotion * this.timeMotion * this.motion);
            // if(this.monneyChange < 0){
            //     if(this._currentMonney <= this._monney ){
            //         this._currentMonney = this._monney;
            //         this._state = false;
            //     } 
            // }else{
            if (this._currentMonney >= this._monney) {
                this._currentMonney = this._monney;
                this._state = false;
            }

            // }

            this.timeMotion += dt;
            if (this.formatMoney) {
                this.lb.string = Global.formatNumber(parseInt(this._currentMonney));
            } else {
                this.lb.string = Global.formatNumber(parseInt(this._currentMonney));
            }

        }
    },
});
