// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
       listItemJackPot : [require("ItemSlotJackPot")]
    },
    ctor(){
        this.listMoneyJackpot = {};
        this.listLabelJackpot = [];
        this.listLabelJackpotCard = [];
        this.dataJack = null;

        this.timeRunJackpot = 4.9;
        this.timeRequestjackpot = 5;
        this.timeCacheJackot = this.timeRequestjackpot;

        this.dataXhu = [];
        this.listXhu = [];

    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.game.addPersistRootNode(this.node);
        Global.JackpotController = this;
        cc.log("chay vao onload nay`=================");
    },
    onDestroy(){
        Global.JackpotController = null;
    },
    start () {

    },
    reviceData(data){

        clearTimeout(this.funJpChuaLogin);
        this.listMoneyJackpot = {};
        for(let  i= 0  , l = data.length  ; i < l ; i++){
            data[i] = JSON.parse(data[i]);
            let gameID = data[i].PlayMode + "";
            let roomIndex = data[i].RoomType;
            let moneyRoomIndex = data[i].JackpotValue;
           if(this.listMoneyJackpot[gameID] == null )  this.listMoneyJackpot[gameID] = {};
           this.listMoneyJackpot[gameID][roomIndex] = moneyRoomIndex;
        }

        if(Global.TopHu) Global.TopHu.initItem();
        let length = this.listLabelJackpot.length;
        for(let i = 0 ; i < length ; i++){
            this.listLabelJackpot[i].emitNewDataJackpot();
        }
        clearTimeout(this.funJp);
        this.funJp =  setTimeout(()=>{
            if(Global.isLogin){
                require ("SendRequest").getIns().MST_Client_Jackpot_Info();
                // require("SendCardRequest").getIns().MST_Client_Jackpot_CardGame_Info();
            }
        } , this.timeCacheJackot*1000)
        this.timeCacheJackot = this.timeRequestjackpot;
    },

    reviceXHu(packet){
        
        let infoEventString = packet[1];
        this.dataXhu = [];
        for (let i = 0; i < infoEventString.length; i++) {
            this.dataXhu[i] = JSON.parse(infoEventString[i]);
            if(this.dataXhu[i].RuleConfig) this.dataXhu[i].RuleConfig = JSON.parse(this.dataXhu[i].RuleConfig);
        }

      //  this.dataXhu[0].RuleConfig.GameList[1].RoomId[0] = 1; // TEST
        for(let i = 0, length = this.listXhu.length ; i < length ; i++){
            this.listXhu[i].emitNewDataJackpot();
        }
    },

    reviceDataChuaLogin(data){
     
        this.listMoneyJackpot = {};
        for(let  i= 0  , l = data.length  ; i < l ; i++){
            //if(typeof data[i] == "string")data[i] = JSON.parse(data[i]);
            let gameID = data[i].PlayMode + "";
            let roomIndex = data[i].RoomType;
            let moneyRoomIndex = data[i].JackpotValue;
           if(this.listMoneyJackpot[gameID] == null )  this.listMoneyJackpot[gameID] = {};
           this.listMoneyJackpot[gameID][roomIndex] = moneyRoomIndex;
        }

        if(Global.TopHu) Global.TopHu.initItem();
        let length = this.listLabelJackpot.length;
        for(let i = 0 ; i < length ; i++){
            this.listLabelJackpot[i].emitNewDataJackpot();
        }
        clearTimeout(this.funJpChuaLogin);
        this.funJpChuaLogin =  setTimeout(()=>{
            if(Global.isLogin){
                clearTimeout(this.funJpChuaLogin);
                return;
            }
            Global.LobbyView.requestJackpotChuaLogin();
        } , 20*1000)
    },

    otherPlayerTakeHu(){
        this.timeCacheJackot = 0.5
    },

    dangKyLabel(component){
        if(!this.listLabelJackpot.includes(component))
        this.listLabelJackpot.push(component);
    },
    huyDangKyLabel(component){
        let index = this.listLabelJackpot.indexOf(component);
        if(index > -1) this.listLabelJackpot.splice(index , 1);
    },
    dangXHu(component){
        if(!this.listXhu.includes(component))
            this.listXhu.push(component);
    },
    huyDangXHu(component) {
        let index = this.listXhu.indexOf(component);
        if (index > -1) this.listXhu.splice(index, 1);
    },

    reviceDataJackpotCard(data) {
        this.unschedule(this.funJp);
        this.scheduleOnce(this.funJp = () => {
            if (!Global.isLogin) {
                this.unschedule(this.funJp);
                return;
            }
            require("SendCardRequest").getIns().MST_Client_Jackpot_CardGame_Info();
        }, 10)

        cc.log("========> nhan dc jackpot : " , data[32]);
        this.dataJack = data;
        let txt = data[32].toString();
        let index = 0
        // if(txt.length > 4)
        for (let i = txt.length-1; i >= 0 ; i--) {
            const number = txt[i];
            cc.log("check data32 : ", number)
            if(this.listItemJackPot[index].getStringJackpot() !== number){
                this.listItemJackPot[index].setStringItem(number);
            } 
            index++;
        }

       
        // clearTimeout(this.funJp);
        // setTimeout(this.funJp = ()=>{
        //     cc.log("send take jacpot : ", Global.isLogin)
        //     if(!Global.isLogin){
        //         clearTimeout(this.funJp);
        //         return;
        //     }
        //     cc.log("send take jackpot")
        //     require("SendCardRequest").getIns().MST_Client_Jackpot_CardGame_Info();

        // } , 1000)

        // let length = this.listLabelJackpotCard.length;
        // for (let i = 0; i < length; i++) {
        //     this.listLabelJackpotCard[i].emitNewDataJackpot();
        // }
    },

    dangKyLabelCard(component) {
        if (!this.listLabelJackpotCard.includes(component))
            this.listLabelJackpotCard.push(component);
    },
    huyDangKyLabelCard(component) {
        let index = this.listLabelJackpotCard.indexOf(component);
        if (index > -1) this.listLabelJackpotCard.splice(index, 1);
    },

    // update (dt) {},
});
