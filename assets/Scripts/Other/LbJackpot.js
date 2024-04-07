// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
const GameType = cc.Enum({
    NONE: 0,
    BAN_CA: 1,
    FARM: 2,
    COW_BOY: 3,
    MY_NHAN: 6,
    MINI_SLOT: 5,
    TAM_BAO: 4,
    TAI_XIU: 7,
    MINI_POKER: 8,
    FISH_HUNTER: 9,
    LUCKY_WHEEL: 10,
    ORACLE: 13,
})
cc.Class({
    extends: cc.Component,

    ctor(){
        this._money=0;
        this._objMoney=null;
        this._listMoney=[];
        this._lastIndex=null;
        this.currentIndex = 0;
        this.isFirtInit = false;
        this.gameType = 0;
    },
    editor: {
        requireComponent: "LbMonneyChange"
    },
    properties: {
        
        gameType:{
            default:GameType.NONE,
            type:GameType
            
        },
        currentIndex:{
            default:0,
            type:cc.Integer
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.lbMoney = this.getComponent("LbMonneyChange");
        this.lbMoney.time = Global.JackpotController.timeRunJackpot || 0.5;
        this._listMoney = [0,0,0,0];
        Global.JackpotController.dangKyLabel(this);
        
    },
    start(){
        
        this.emitNewDataJackpot();
    },
    firtInit(){
        this._listMoney = [this._objMoney[1]* 0.9 , this._objMoney[2]* 0.9 , this._objMoney[3]* 0.9];
        this.lbMoney._currentMonney = this._listMoney[this.currentIndex];
    },
    runMoney(){
        if(this.gameType ==0) return;
        if(this._objMoney == null) return;
        if(this._lastIndex != null){
          this._listMoney[this._lastIndex] =  this.lbMoney._currentMonney;
        }
        this._lastIndex = this.currentIndex;

        let money =  this._objMoney[this.currentIndex+1];
        this.lbMoney._currentMonney = this._listMoney[this.currentIndex];
        this.lbMoney.setMoney(money);
        this._money = money;
    },
    changeIndex(index){
        this.currentIndex = index;
        if(this.gameType ==0 )return;
        if(this._objMoney == null) return;
        this.runMoney();
        
    },
    emitNewDataJackpot(){
        let dataJackpot = Global.JackpotController.listMoneyJackpot;
        let objTemp = dataJackpot[this.gameType + ""];
        if(objTemp == null) return;
        this._objMoney = objTemp
        if(!this.isFirtInit) this.firtInit();
        this.isFirtInit = true;

        let moneyCurrent = this.lbMoney._currentMonney;
        let money =  this._objMoney[this.currentIndex+1];

        if(moneyCurrent > money){

            cc.log( moneyCurrent + " ----------tien-------------------- " + money);
            this.lbMoney.setMoneyNoTime(money);
            Global.JackpotController.otherPlayerTakeHu(); // send lay jackpotluon luon
        } else{
            this.runMoney();
        }
    },
    initItem(obj){
        this._objMoney = obj.money;
    },
    onDestroy(){
       if(Global.JackpotController) Global.JackpotController.huyDangKyLabel(this);
    }


    // update (dt) {},
});
