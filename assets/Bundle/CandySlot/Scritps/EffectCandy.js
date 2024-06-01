

var ZEUS = {
    FREESPIN: 0,
    BONUS: 1,
    BIGWIN: 2,
    JACKPOT: 3,
    MEGAWIN: 4
}
var EGRYP_TEXT = {
    FREESPIN: 0,
    BONUS: 1,
    BIGWIN: 2,
    JACKPOT: 3,
}
var EGRYPT = {
    FREESPIN: 0,
    BONUS: 1,
    BIGWIN: 2,
    JACKPOT: 3,
}
var AMAZON = {
    FREESPIN: 0,
    BONUS: 1,
    BIGWIN: 2,
    JACKPOT: 3,
}

cc.Class({
    extends: cc.Component,

    properties: {
        lb_Money: cc.Label,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
       this.funNext = null;
    },
    onEnable() {
        this.scheduleOnce(this.funDelayOff = ()=>{
            this.node.on(cc.Node.EventType.TOUCH_END , this.onClose , this);
        } , 0.7)
        
    },
    onDisable() {
        this.unschedule(this.funDelayOff);
        this.node.off(cc.Node.EventType.TOUCH_END , this.onClose , this);
    },
    

    
    showJackpot(funNext){
        this.node.active = true;
        let money = Global.MiniSlot.dataFinish.payLinePrizeValue;
        let nodeJackpot = cc.find("Jackpot",this.node);
        nodeJackpot.active = true;
        nodeJackpot.getChildByName("fx").getComponent(sp.Skeleton).setAnimation(0, "appear2", false);
        this.lb_Money.node.parent.active = true;
        this.lb_Money.node.parent.runAction(cc.scaleTo(3.5, 1).easing(cc.easeBackOut()));
        let cpTemp = this.lb_Money.node.getComponent("LbMonneyChange");
        cpTemp._currentMonney = 0.4* money;
        cpTemp.time = 3;
        cpTemp.setMoney(money);
        this.isShowJP = true;
        this.funNext = funNext;
        this.scheduleOnce(this.onClose, 5); // vi dc jackpot la dung`
    },
    showBigWin(funNext){
        this.node.active = true;
        let money = Global.MiniSlot.dataFinish.payLinePrizeValue    
        let nodeBigWin = cc.find("BigWin",this.node);
        nodeBigWin.active = true;
        nodeBigWin.getChildByName("fx").getComponent(sp.Skeleton).setAnimation(0, "appear", false);
        this.lb_Money.node.parent.active = true;
        let cplb = this.lb_Money.node.getComponent("LbMonneyChange");
        cplb._currentMonney = 0.4* money;
        cplb.time = 1;
        cplb.setMoney(money);
        this.funNext = funNext;
        this.scheduleOnce(this.onClose, 3)

    },
    
    resetView(){
        
        cc.find("BigWin",this.node).active = false;
        cc.find("Jackpot",this.node).active = false;
        this.lb_Money.node.parent.active = false;
    },
    onClose() {
        this.unschedule(this.funDelayOff);
        this.unschedule(this.onClose);
        this.resetView();
        this.lb_Money.node.getComponent("LbMonneyChange").resetLb();
        if(this.funNext) this.funNext();
        this.funNext = null;
        this.node.active = false;
    }
    // update (dt) {},
});
