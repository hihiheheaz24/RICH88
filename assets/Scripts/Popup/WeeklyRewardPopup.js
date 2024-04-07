cc.Class({
    extends: cc.Component,
    ctor() {
        this.listOnline = [];
    },

    properties: {
        itemReward : cc.Node,
        listReward : cc.ScrollView,
        listItemDailyBonus : [require("WeeklyItemView")],
        nodeDailyBonus : cc.Node,
        nodeTimeOnline : cc.Node,
        btnAdsDailyBonus : cc.Node,
        btnAdsTimeOnlne  : cc.Node,
    },

    show(status = 0) {
        //show popup phan thuong
        cc.log("list online reward la : ", JSON.stringify(Global.listOnlineReward))
        cc.log("list dailybonus reward la : ", JSON.stringify(Global.listDailyReward))
        Global.onPopOn(this.node)
        if(status === 0){
            this.onClickDailyBonus();
        }
        else if(status === 2){
            this.onClickTimeOnline();
        }
      
    },

    onClickDailyBonus(){
        this.loadListDailyBonus();
        this.nodeTimeOnline.active = false;
        this.nodeDailyBonus.active = true;
    },

    onClickTimeOnline(){
        this.loadListOnline();
        this.nodeTimeOnline.active = true;
        this.nodeDailyBonus.active = false;
    },

    loadListDailyBonus(){
        if(!Global.listDailyReward) return;
        cc.log("chay vao load daily bosnus")
        for (let i = 0; i < Global.listDailyReward.length; i++) {
            const objData = Global.listDailyReward[i];
            let itemDailyBonus = this.listItemDailyBonus[i]
            itemDailyBonus.init(objData, false, i);
        }
    },

    loadListOnline(){
        if(!Global.listOnlineReward) return;
        this.listReward.content.removeAllChildren();
        this.listReward.scrollToLeft(0.1);
        for (let i = 0; i < Global.listOnlineReward.length; i++) {
            const objData = Global.listOnlineReward[i];
            let item = null;
            if(i < this.listReward.content.children.length){
                item = this.listReward.content.children;
            }
            else{
                item = cc.instantiate(this.itemReward).getComponent("WeeklyItemView");
            }
            item.init(objData, true, i);
            this.listReward.content.addChild(item.node);
        }
    },
    
    getPositionInViewOnline: function (item) { 
        let worldPos = item.parent.convertToWorldSpaceAR(item.position);
        let viewPos = this.scrOnline.node.convertToNodeSpaceAR(worldPos);
        return viewPos;
    },

    Hide() {
        Global.onPopOff(this.node);
    },

    onClickShowAdsDaiyBonus(){
        require("Util").onShowAdMob("2");
        this.btnAdsDailyBonus.active = false;
    },

    onClickShowAdsTimeOnline(){
        require("Util").onShowAdMob("2");
        this.btnAdsTimeOnlne.active = false;
    },

    onDestroy() {
        Global.WeeklyRewardPopup = null;
    },
});

