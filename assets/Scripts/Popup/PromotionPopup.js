cc.Class({
    extends: cc.Component,

    properties: {
       itemPromotion : cc.Node,
       listPromotion : cc.Node,
    //    sprFill : cc.Sprite,
       btnshop : cc.Node,
       lbReceivedTotal : cc.Label,
       lbTitle1 : cc.Label,
       lbTitle2 : cc.Label,
       lbChipTotal : cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.dayCountMax = 0;
        this.isReceivedTotal = false;
    },

    start () {

    },

    show(){
        Global.onPopOn(this.node);
        require("SendRequest").getIns().MST_Client_Get_Bonus_First_Cashin();
    },

    onClose(){
        Global.onPopOff(this.node);
    },

    handleDataPromotion(data){
        // data = {"1":["{\"LogId\":1,\"AccountId\":1,\"DayCount\":1,\"MissionCount\":200,\"IsReceiveDailyBonus\":true,\"IsReceiveMissionBonus\":true,\"MissionMoneyReward\":50000,\"MissionDiamondReward\":0}", "{\"LogId\":1,\"AccountId\":1,\"DayCount\":2,\"MissionCount\":200,\"IsReceiveDailyBonus\":false,\"IsReceiveMissionBonus\":true,\"MissionMoneyReward\":50000,\"MissionDiamondReward\":0}"],"2":["{\"LogId\":1,\"BonusId\":1,\"RequireCashin\":200000,\"DayCount\":1,\"LoginMoneyBonus\":20000,\"LoginDiamondBonus\":0,\"MissionRequire\":100,\"MissionMoneyReward\":50000,\"MissionDiamondReward\":0}","{\"LogId\":2,\"BonusId\":1,\"RequireCashin\":200000,\"DayCount\":2,\"LoginMoneyBonus\":20000,\"LoginDiamondBonus\":0,\"MissionRequire\":200,\"MissionMoneyReward\":120000,\"MissionDiamondReward\":0}","{\"LogId\":3,\"BonusId\":1,\"RequireCashin\":200000,\"DayCount\":3,\"LoginMoneyBonus\":20000,\"LoginDiamondBonus\":0,\"MissionRequire\":100,\"MissionMoneyReward\":70000,\"MissionDiamondReward\":0}","{\"LogId\":4,\"BonusId\":1,\"RequireCashin\":200000,\"DayCount\":4,\"LoginMoneyBonus\":20000,\"LoginDiamondBonus\":0,\"MissionRequire\":200,\"MissionMoneyReward\":100000,\"MissionDiamondReward\":0}","{\"LogId\":5,\"BonusId\":1,\"RequireCashin\":200000,\"DayCount\":5,\"LoginMoneyBonus\":20000,\"LoginDiamondBonus\":0,\"MissionRequire\":100,\"MissionMoneyReward\":50000,\"MissionDiamondReward\":0}","{\"LogId\":6,\"BonusId\":1,\"RequireCashin\":200000,\"DayCount\":6,\"LoginMoneyBonus\":20000,\"LoginDiamondBonus\":0,\"MissionRequire\":500,\"MissionMoneyReward\":300000,\"MissionDiamondReward\":0}"],"3":2,"200":65}
        cc.log("data khuyen mai la : ", data)
        let listDataReceived = data[1];
        let listDataBasic = data[2];

        // let number1 = data[4].match(/[0-9]+/)[0];
        // let number2 = data[4].match(/[0-9]+$/)[0]
        this.lbTitle1.string = Global.formatMoneyPoker(data[4][0]);
        this.lbTitle2.string = Global.formatMoneyPoker(data[4][1]);
        
        this.lbChipTotal.string = Global.formatNumber(data[5]);

        this.genListBasic(listDataBasic);
        this.dayCountMax = data[3];
        Global.DaycountMax = this.dayCountMax;
        this.genListReceived(listDataReceived, data[3]);
        // if(this.dayCountMax > 0){
        //     this.btnshop.active = false;
        //     cc.Tween.stopAllByTarget(this.btnshop);
        // } 
        // else{
        //     this.btnshop.active = true;
        //     cc.tween(this.btnshop)
        //     .to(0.5, { scale: 1 })
        //     .to(0.5, { scale: 1.1 })
        //     .union()
        //     .repeatForever()
        //     .start()
        // } 
    },

    genListBasic(listDataBasic){
        // this.lbReceivedTotal.node.getParent().active = true;
        this.listPromotion.removeAllChildren();
        for (let i = 0; i < listDataBasic.length; i++) {
            const dataBasic = listDataBasic[i];
            let data = JSON.parse(dataBasic);
            let item = null;
            if(i < this.listPromotion.children.length){
                item = this.listPromotion.children[i];
            }
            else{
                item = cc.instantiate(this.itemPromotion).getComponent("ItemPromotion");
            }
            item.node.active = true;
            this.listPromotion.addChild(item.node)
            item.init(data);
            if(data.IsReceiveAll){
                this.lbReceivedTotal.node.getParent().active = false;
            }
        }
    },

    genListReceived(listDataReceived, dayCountMax){
        cc.log("data receive la : ", listDataReceived)
        
        // let dayCountMax = //JSON.parse(listDataReceived[listDataReceived.length - 1]).DayCount;

        for (let i = 0; i < listDataReceived.length; i++) {
            const data = JSON.parse(listDataReceived[i]);
            let item = this.listPromotion.children[i].getComponent("ItemPromotion");
            item.checkReceivePromotion(data, dayCountMax);
            if(data.IsReceiveAll){
                this.lbReceivedTotal.node.getParent().active = false;
            }
        }

        // this.sprFill.fillRange = (dayCountMax-1) / 5;

        if(this.lbReceivedTotal.node.getParent().active){
            if(!Global.MissionFail && this.dayCountMax >= 6){
                //NHẬN THƯỞNG
                this.lbReceivedTotal.string = "NHẬN THƯỞNG:";
                this.isReceivedTotal = true;
                cc.tween(this.lbReceivedTotal.node.getParent())
                    .to(0.5, { scale: 1 })
                    .to(0.5, { scale: 1.1 })
                    .union()
                    .repeatForever()
                    .start()
            }
            else {
                cc.Tween.stopAllByTarget(this.lbReceivedTotal.node.getParent());
                this.isReceivedTotal = false;
                this.lbReceivedTotal.string = "Hoàn thành 100% cả 6 ngày \n nhận thêm";
            } 
        }
       
    },

    handleDataReceivedPromotion(data){
        console.log("co data nhan thuong ma ko show , dcm ")
        if (Global.ShowRewardPopup === null) {
            console.log("load ShowRewardPopup ???")
            cc.resources.load("Popup/ShowRewardPopup", cc.Prefab, (err, prefab) => {
                let item = cc.instantiate(prefab).getComponent("ShowRewardPopup");
                Global.ShowRewardPopup = item;
                Global.UIManager.parentPopup.addChild(item.node);
                item.showRewardPromotion(data);
                item.active = false;
            })
        } else {
            console.log("on ShowRewardPopup ???")
            Global.ShowRewardPopup.showRewardPromotion(data);
        }

        this.genListReceived(data[5], this.dayCountMax);
    },

    onClickReceiveTotalPromotion(){
        if(!this.isReceivedTotal){
            Global.UIManager.showCommandPopup("Hoàn thành tất cả nhiệm vụ trong tiến trình để nhận thưởng");
            return;
        } 
        let msg = {};
        msg[1] = -100;
        require("SendRequest").getIns().MST_Client_Receive_Bonus_Firsi_Cashin(msg);

        // cc.Tween.stopAllByTarget(this.lbReceivedTotal.node.getParent());
        // this.lbReceivedTotal.node.getParent().active = false;
    },

    onClickOpenShop(){
        Global.UIManager.showShopPopup(STATUS_SHOP.CARD_IN);
    },

    // update (dt) {},
});
