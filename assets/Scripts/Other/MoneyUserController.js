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
        this.listLabel = [];
        this.moneyCache = 0;
        this.objDelay = {};
    },
    onLoad () {
        cc.game.addPersistRootNode(this.node);
        Global.MoneyUser = this;
    },
    onDestroy(){
        Global.MoneyUser = null;
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    emitNewMonney(){
        for(let i = 0 , l = this.listLabel.length ; i<l ; i++){
            this.listLabel[i].emitNewMoney();
        }
    },
    dangKy(component){
        if(!this.listLabel.includes(component))
        this.listLabel.push(component);
    },
    huyDangKy(component){
        let index = this.listLabel.indexOf(component);
        if(index > -1) this.listLabel.splice(index , 1);
    },



    subMoney(money){
        cc.log("money truyen sang la " + money);
        let _money = MainPlayerInfo.ingameBalance - money;
        cc.log(MainPlayerInfo.ingameBalance + " -money la " + _money);

        MainPlayerInfo.setMoneyUser(_money);
    },
    pushDelayMoney(gameType, totalMoney) {
        this.moneyCache = parseInt(totalMoney);
        this.objDelay[gameType.toString()] = "123";
    },
    removeDelay(gameType, moneyChange) {
        gameType +="";
      if( !this.objDelay.hasOwnProperty(gameType)) return;
        let money = MainPlayerInfo.ingameBalance + moneyChange;
        MainPlayerInfo.setMoneyUser(money);
        let str = gameType.toString()
        let count = this.getLengthDelayMoney();
        if (count < 2) {
            MainPlayerInfo.setMoneyUser(this.moneyCache);
            this.moneyCache = MainPlayerInfo.ingameBalance;
        }
        delete this.objDelay[str];
    },
    endGameMOney(gameType){
        if( !this.objDelay.hasOwnProperty(gameType)) return;
        let str = gameType.toString();
        delete this.objDelay[str];
    },
    getLengthDelayMoney(){
        let count = 0;
        for (let temp in this.objDelay) {
            count++;
        }
        return count;
    },
    // checkMoneyBet(moneyBet){
    //     if()
    // }
    // update (dt) {},
});
