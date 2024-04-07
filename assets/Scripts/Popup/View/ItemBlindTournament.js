// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        lbLevel: cc.Label,
        lbBlinds: cc.Label,
        lbAnte: cc.Label,
        lbSecond: cc.Label,
        lbMinutes: cc.Label,
        itemSlected: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    init(data, i, ante, normalAnte) {
        cc.log("data blind la ; ", data)
        this.lbBlinds.string = Global.formatNumber(data) + "/" + Global.formatNumber(data * 2);
       
        this.lbLevel.string = i + 1;

        if(ante && ante > 0){
            this.lbAnte.string = Math.floor((data * ante));
        }
        else{
            this.lbAnte.string = Math.floor((data * normalAnte));
        }

        if (Global.TournamentView.timeTurn)
            this.lbSecond.string = Global.TournamentView.timeTurn;

        this.lbMinutes.string = parseInt(Global.TournamentView.dataTour.TimeChangeBlind / 60);

        if (Global.TournamentView.levelBlind === i + 1) {
            this.itemSlected.active = true;
        }
        else {
            this.itemSlected.active = false;
        }
    },

    // update (dt) {},
});
