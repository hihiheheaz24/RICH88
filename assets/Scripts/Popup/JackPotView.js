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
        src: require("BaseScrollView"),
        tabDieuKien: cc.Node,
        tabCoCau: cc.Node,
        tabTyle: cc.Node,
        tabJackpot: cc.Node,

        listLbJackpot : [cc.Label]
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.tabDieuKien.scale = 0;
        this.tabCoCau.scale = 0;
        this.tabTyle.scale = 0;
        this.tabJackpot.scale = 0;
    },

    start () {

    },

    onHide(){
        Global.onPopOff(this.node);
        // if(Global.LobbyView)
        //     Global.LobbyView.nodeJackpot.active = true;
            // Global.onPopOn(Global.LobbyView.nodeJackpot) //.active = true;
    },

    show(){
        Global.onPopOn(this.node);
       
    },

    onClickShowDieuKien(){
        cc.log("chay vao tab dieu kien")
        cc.tween(this.tabDieuKien)
        .to(0.1, {scale: 1})
        .start();
        //
        cc.tween(this.tabCoCau)
        .to(0.1, {scale: 0})
        .start();
        //
        cc.tween(this.tabTyle)
        .to(0.1, {scale: 0})
        .start();
        //
        cc.tween(this.tabJackpot)
        .to(0.1, {scale: 0})
        .start();
    },

    onClickShowCocCau(){
        cc.tween(this.tabDieuKien)
        .to(0.1, {scale: 0})
        .start();
        //
        cc.tween(this.tabCoCau)
        .to(0.1, {scale: 1})
        .start();
        //
        cc.tween(this.tabTyle)
        .to(0.1, {scale: 0})
        .start();
        //
        cc.tween(this.tabJackpot)
        .to(0.1, {scale: 0})
        .start();

        cc.log("data jack pot can show la : ", JSON.parse(Global.JackpotController.dataJack[34][3]))
        let dataJackpot = JSON.parse(Global.JackpotController.dataJack[34][3]);
        for (let i = 0; i < dataJackpot.Blinds.length; i++) {
            const data = dataJackpot.Blinds[i];
            cc.log("data jackpot room la : ", data)
            this.listLbJackpot[i].string = Global.formatNumber(parseInt(Global.JackpotController.dataJack[32] * (dataJackpot.JackpotPercent[i] / 100)));
        }
    },

    onClickShowTyle(){
        cc.tween(this.tabDieuKien)
        .to(0.1, {scale: 0})
        .start();
        //
        cc.tween(this.tabCoCau)
        .to(0.1, {scale: 0})
        .start();
        //
        cc.tween(this.tabTyle)
        .to(0.1, {scale: 1})
        .start();
        //
        cc.tween(this.tabJackpot)
        .to(0.1, {scale: 0})
        .start();
    },

    onClickShowResultJackpot(){
        cc.tween(this.tabDieuKien)
        .to(0.1, {scale: 0})
        .start();
        //
        cc.tween(this.tabCoCau)
        .to(0.1, {scale: 0})
        .start();
        //
        cc.tween(this.tabTyle)
        .to(0.1, {scale: 0})
        .start();
        //
        cc.tween(this.tabJackpot)
        .to(0.1, {scale: 1})
        .start();
        if(!Global.JackpotController.dataJack[39]) return;
        let list = Global.JackpotController.dataJack[39].slice();
        let data = [];
        for(let i = 0 , l = list.length; i < l ; i++){
            list[i] = JSON.parse(list[i]);
            if(list[i].GameId === "PKR")
                data.push(list[i]);
        }
        this.init(data);
    },

    init(data){
        cc.log("======> data parse : " , data);
        this.src.resetScr();
        this.src.init(data, (data.length * 70), 70);
    },
    // update (dt) {},
});
