var WalletController = cc.Class({
	statics: {
        getIns() {
            if (this.self == null){
                this.self = new WalletController();
                this.self.listEvent = {};
                this.self.money = 0;
                this.self.cacheSub = 0;
                this.self.deleagate = [];
            } 
            return this.self;
        }
    },

    properties: {
       
    },

    init(){
        cc.log ("WalletController init");
        this.money = MainPlayerInfo.ingameBalance;
        this.deleagate = [];
    },

    PushBalance(id, betValue, prizeValue, accountBalance) {
        MainPlayerInfo.setMoneyUser(accountBalance) ;
        cc.log ("WalletController PushBalance accountBalance : ", accountBalance);
        cc.log ("WalletController PushBalance ingameBalance : ", MainPlayerInfo.ingameBalance);
        this.money = this.money - betValue;
        if (this.money < 0) {
            cc.log ("update PushBalance error:"+this.money+"    "+betValue);
            return;
        }
        let coin = {betValue, prizeValue};
        if (this.listEvent[id]) {
            this.TakeBalance (id);
        }
        this.listEvent[id] = coin;
        this.OnUpdateMoney();
    },

    TakeBalance(id)	{
        if (this.listEvent[id]) {
            var coin = this.listEvent [id];
            this.money += coin.prizeValue;
            if (this.money < 0) {
                cc.log ("update TakeBalance error:"+this.money+"    "+coin[1]);
                return;
            }
            this.OnUpdateMoney();
            delete this.listEvent[id];
        }
        if (this.getLengthObj(this.listEvent) == 0 && this.cacheSub == 0) {
            this.money = MainPlayerInfo.ingameBalance;
            this.OnUpdateMoney();
        }
    },

    UpdateBalance(gold) {
        this.money += gold;
        MainPlayerInfo.setMoneyUser(MainPlayerInfo.ingameBalance + gold) ;
        if (this.money < 0) {
            cc.log ("update UpdateBalance error:"+this.money+"    "+gold);
            return;
        }
        this.OnUpdateMoney();
    },

    UpdateWallet(accountBalance) {
        var cache = accountBalance - MainPlayerInfo.ingameBalance;
        MainPlayerInfo.setMoneyUser(accountBalance) ;
        this.money += cache;
        if (this.money < 0) {
            cc.log ("update UpdateWallet error:"+this.money+"    "+cache);
            return;
        }
        this.OnUpdateMoney();
    },

    UpdateTotal(accountBalance) {
        this.cacheSub = accountBalance - MainPlayerInfo.ingameBalance + this.cacheSub;
        MainPlayerInfo.setMoneyUser(accountBalance) ;
    },

    UpdateCache() {
        this.money += this.cacheSub;
        this.cacheSub = 0;
        if (this.money < 0) {
            cc.long ("update cache error:"+this.money+"    "+this.cacheSub);
            return;
        }
        this.OnUpdateMoney();
        if (this.getLengthObj(this.listEvent) == 0 && this.cacheSub == 0) {
            this.money = MainPlayerInfo.ingameBalance;
            this.OnUpdateMoney();
        }
    },

    getLengthObj(obj){
        let size = 0;
        for(let temp in obj){
            if(obj.hasOwnProperty(temp))size++;
        }
        return size
    },

    OnUpdateMoney() {
        for(var i = 0; i < this.deleagate.length; i++)
        {
            if(this.deleagate[i])
                this.deleagate[i].OnUpdateMoney(this.money);
        }
    },

    AddListener(event) {
        cc.log("add listenner");
        cc.log(event);
        this.deleagate[this.deleagate.length] = event;
    },

    RemoveListener(){
        cc.log("remove listenner");
        this.deleagate = [];
    },

});
module.exports = WalletController;