// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        nodeBank: cc.Node,
        nodeCard: cc.Node,
        nodeMomo: cc.Node,

        toggleCashCard: cc.Toggle,
        toggleCashBank: cc.Toggle,
        toggleCashMomo: cc.Toggle,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Global.CashOut = this;
    },
    onDestroy () {
        Global.CashOut = null;
    },
    start () {

    },
    hide(){
        // actionEffectClose(this.node , ()=>{
        //     this.node.active = false;
        // })
        Global.onPopOff(this.node);
    },
    show(){
        // this.node.active = true;
        // actionEffectOpen(this.node);
        Global.onPopOn(this.node);
        this.checkStatusTab();
    },
    
    checkStatusTab(){
        if (Global.GameConfig.FeatureConfig.CashOutByBankFeature == EFeatureStatus.Open) {
            this.toggleCashBank.check();
            this.onClickTabBank();
        } 
        else{
            this.toggleCashCard.check();
            this.onClickTabCard();
        }
    },

    onClickTabBank(){
        this.nodeBank.active = true;
        this.nodeCard.active = false;
        this.nodeMomo.active = false
    },

    onClickTabMoMo(){
        this.nodeBank.active = false;
        this.nodeCard.active = false;
        this.nodeMomo.active = true
    },

    onClickTabCard(){
        this.nodeBank.active = false;
        this.nodeCard.active = true;
        this.nodeMomo.active = false
    },

    // update (dt) {},
});
