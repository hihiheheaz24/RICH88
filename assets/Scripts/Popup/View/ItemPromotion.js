cc.Class({
    extends: cc.Component,

    properties: {
        lbChipReceiveLogin: cc.Label,
        lbTitleReceivePlay: cc.Label,
        lbChipReceivePlay: cc.Label,
        lbTotalPlay: cc.Label,
        lbTotalChipReceive: cc.Label,

        isReceivedDailyBonus : cc.Node,
        isReceivedMisson : cc.Node,
        btnIsReceived : cc.Node,

        btnTotalChip : cc.Node,
        itemBoder : cc.Sprite,
        listBoder : [cc.SpriteFrame],

        txtTotal : cc.Label,

        bgTickLogin : cc.Button,
        bgTickMission : cc.Button,
        lbReceived : cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.missionRequire = 0;
        this.dayCount = 0;
        this.chipReceivedLogin = 0;
        this.chipReceivedMission = 0;
    },

    start () {

    },

    init(data){
        cc.log("data promotion la : ", data);
        // BonusId: 1
        // DayCount: 1
        // LogId: 1
        // LoginDiamondBonus: 0
        // LoginMoneyBonus: 20000
        // MissionDiamondReward: 0
        // MissionMoneyReward: 50000
        // MissionRequire: 100
        // RequireCashin: 200000

        this.missionRequire = data.MissionRequire;
        this.dayCount = data.DayCount;

        this.lbChipReceiveLogin.string = "+" + Global.formatMoneyChip(data.LoginMoneyBonus);
        this.lbTitleReceivePlay.string = "Chơi " + data.MissionRequire + " ván";
        this.lbChipReceivePlay.string = "+" + Global.formatMoneyChip(data.MissionMoneyReward);
        this.lbTotalPlay.string = 0 + "/" + data.MissionRequire;
        this.lbTotalChipReceive.string = Global.formatMoneyChip(data.LoginMoneyBonus + data.MissionMoneyReward);

        this.chipReceivedLogin = data.LoginMoneyBonus;
        this.chipReceivedMission = data.MissionMoneyReward;
    },

    checkReceivePromotion(data, dayCountMax){
        // public int DayCount { get; set; } // ngày hiện tại đang làm
        // public int MissionCount { get; set; } // Số nhiệm vụ đã làm
        // public bool IsReceiveDailyBonus { get; set; } // Đã nhận thưởng ngày
        // public bool IsReceiveMissionBonus { get; set; } // Đã nhận thưởng nhiệm vụ


        cc.log("day count max : ", dayCountMax)
        cc.log("day count la : ", data.DayCount)
        if(data.DayCount < dayCountMax){
            this.itemBoder.spriteFrame = this.listBoder[1];
            this.node.getComponent(cc.Button).interactable = false;
            this.btnTotalChip.color = cc.Color.WHITE;
            this.lbTotalChipReceive.node.color = cc.Color.WHITE;

            if(data.IsReceiveDailyBonus){
                this.itemBoder.spriteFrame = this.listBoder[0];
                this.lbReceived.string = Global.formatMoneyChip(this.chipReceivedLogin);
                this.btnIsReceived.active = true;
                this.btnTotalChip.active = false;
                this.node.getComponent(cc.Button).interactable = false;
            }
            else if(data.IsReceiveMissionBonus){
                this.itemBoder.spriteFrame = this.listBoder[0];
                this.btnIsReceived.active = true;
                this.lbReceived.string = Global.formatMoneyChip(this.chipReceivedMission);
                this.btnTotalChip.active = false;
                this.node.getComponent(cc.Button).interactable = false;
            }
            else if(!data.IsReceiveDailyBonus && !data.IsReceiveMissionBonus){
                this.itemBoder.spriteFrame = this.listBoder[0];
                this.btnIsReceived.active = true;
                this.lbReceived.string = 0;
                this.btnTotalChip.active = false;
                this.node.getComponent(cc.Button).interactable = false;
            }
            if(!data.IsReceiveDailyBonus || !data.IsReceiveMissionBonus){
                Global.MissionFail = true;
            }
        }
        else if(data.DayCount === dayCountMax){
            this.itemBoder.spriteFrame = this.listBoder[3];
            this.btnTotalChip.getComponent(cc.Label).string = "Đang diễn ra";
            this.lbTotalChipReceive.node.active = false;
            this.node.getComponent(cc.Button).interactable = true;
           if(data.MissionCount >= this.missionRequire ){
                this.btnTotalChip.getComponent(cc.Label).string = "Nhận thưởng";
            }
           
        }
        else{
            this.itemBoder.spriteFrame = this.listBoder[2];
            this.btnTotalChip.active = true;
            this.btnTotalChip.getComponent(cc.Label).string = "Tổng";
            this.btnIsReceived.active = false;
            this.node.getComponent(cc.Button).interactable = false;
            this.node.getComponent(cc.Button).enableAutoGrayEffect = false;
        }

        this.lbTotalPlay.string = data.MissionCount + "/" + this.missionRequire;
        this.isReceivedDailyBonus.active = data.IsReceiveDailyBonus;
        this.isReceivedMisson.active = data.IsReceiveMissionBonus;

        this.bgTickLogin.interactable = data.IsReceiveDailyBonus;
        // this.bgTickMission.interactable = data.IsReceiveMissionBonus;

        if(data.IsReceiveDailyBonus && data.IsReceiveMissionBonus){
            this.itemBoder.spriteFrame = this.listBoder[0];
            this.btnIsReceived.active = true;
            this.lbReceived.string = "ĐÃ NHẬN";
            this.btnTotalChip.active = false;
            this.node.getComponent(cc.Button).interactable = false;
        }
    },

    onClickReceivePromitionDay(){
        cc.log("send received day count : ", this.dayCount)
        let msg = {};
        msg[1] = this.dayCount;
        require("SendRequest").getIns().MST_Client_Receive_Bonus_Firsi_Cashin(msg);
        // let data = {};
        // data[1] = 1000;
        // data[2] = 2000;
        // data[3] = 3000;
        // data[4] = 4000;
        // Global.PromotionView.handleDataReceivedPromotion(data);
    },
    // update (dt) {},
});
