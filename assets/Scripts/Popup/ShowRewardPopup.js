

cc.Class({
    extends: cc.Component,
    properties: {
        onlineContent: cc.Node,
        dailyContent: cc.Node,
        rewardContent: cc.Node,
        rewardKichHoatContent: cc.Node,
        vipContent: cc.Node,
        weeklyItem: cc.Node,
        rewardItem: cc.Node,
        iconOnlineReward: cc.Sprite,
        valueOnlineReward: cc.Label,
        descriptionOnline: cc.Label,
        descriptionDaily: cc.Label,
        descriptionReward: cc.Label,
        vipLv: cc.Label,
        imgXu: cc.SpriteFrame,
        imgItemIce: cc.SpriteFrame,
        imgItemTarget: cc.SpriteFrame,
        imgItemSpeed: cc.SpriteFrame,
        imgLixi: cc.SpriteFrame,
        imgPiece: cc.SpriteFrame,
        imgCard: cc.SpriteFrame,
        imgDiamond: cc.SpriteFrame,
        nodeEff: cc.Node,
        btnReceivedWithAds: cc.Node,
        func : null,
    },

    Init() {
        //this.fx();
        if (this.isInit) {
            return;
        }
        this.isInit = true;
        this.listItem[this.listItem.length] = this.weeklyItem.getComponent("RewardItemView");
        this.listReward[this.listReward.length] = this.rewardItem.getComponent("RewardItemView");
    },

    fx() {
        this.nodeEff.stopAllActions();
        let fxScale_01 = cc.tween().to(0.1, { scale: 0.8 });
        let fxScale_02 = cc.tween().to(0.1, { scale: 1 });
        let fxScale = cc.tween().then(fxScale_01).then(fxScale_02);

        let actionX = cc.tween()
            .repeat(3, fxScale)
            .delay(1);

        cc.tween(this.nodeEff)
            .then(actionX)
            .repeatForever()
            .start();
    },

    onLoad() { 
        this.statusRewards = null;
        this.listItem = [];
        this.listReward = [];
        this.listDescriptionReward = [];
        cc.log("chay vao on load")
    },

    show(status, content = null, func) {
        this.func = func
        // this.node.active = false;
        cc.log("check show reward id : ",status) 
        if (status == STATUS_GIFT_POPUP.ATTENDANCE){
            Global.listCacheShow.push(Global.indexDailyReward);       
        }        
        else if (status == STATUS_GIFT_POPUP.ONLINE) {
            Global.listCacheShow.push(Global.indexOnlineReward + 10);
        } else if (status == STATUS_GIFT_POPUP.VIP) {
            Global.listCacheShow.push(20);
        } else {
            Global.listCacheShow.push(30);
            this.listDescriptionReward[Global.listCacheShow.length - 1] = content;
        }
        cc.log("check leng Global.listCacheShow.length : ", Global.listCacheShow)
        cc.log("check is show la : ", Global.isShow)
        if (!Global.isShow)
            return;
        this.ShowProcess(status);
    },

    ShowProcess(status) {
        cc.log("show log status : ", status)
        Global.isShow = false;
        Global.AgRewardAds = 0;
        if (status == STATUS_GIFT_POPUP.ATTENDANCE) {
            this.statusRewards = STATUS_GIFT_POPUP.ATTENDANCE;
            this.dailyContent.active = true;
            this.onlineContent.active = false;
            this.rewardKichHoatContent.active = false;
            this.rewardContent.active = false;
            this.vipContent.active = false;
            let rewardConfig = Global.listDailyReward[Global.listCacheShow[0]];
            this.descriptionDaily.string = Global.formatString(MyLocalization.GetText("RECEIVE_REWARD_DAILY"), [rewardConfig.Time]);
            for (let i = 0; i < this.listItem.length; i++) {
                this.listItem[i].node.active = false;
            }
            for (let i = 0; i < rewardConfig.RewardList.length; i++) {
                if (i < this.listItem.length) {
                    this.listItem[i].FillInfo(rewardConfig.RewardList[i].RewardType, rewardConfig.RewardList[i].ItemType, rewardConfig.RewardList[i].Amount, this);
                } else {
                    let itemTrans = cc.instantiate(this.weeklyItem);
                    itemTrans.active = true;
                    itemTrans.parent = this.weeklyItem.parent;
                    let itemView = itemTrans.getComponent("RewardItemView");
                    this.listItem[this.listItem.length] = itemView;
                    itemView.FillInfo(rewardConfig.RewardList[i].RewardType, rewardConfig.RewardList[i].ItemType, rewardConfig.RewardList[i].Amount, this);
                }
                if(rewardConfig.RewardList[i].RewardType == REWARD_TYPE.INGAME_BALANCE){
                    Global.AgRewardAds += rewardConfig.RewardList[i].Amount;
                }
            }
            if(cc.sys.os === cc.sys.OS_ANDROID){
                this.btnReceivedWithAds.active = true;
            }
        } else if (status == STATUS_GIFT_POPUP.ONLINE) {
            this.statusRewards = STATUS_GIFT_POPUP.ONLINE;
            this.dailyContent.active = false;
            this.onlineContent.active = true;
            this.rewardKichHoatContent.active = false;
            this.rewardContent.active = false;
            this.vipContent.active = false;

            if (Global.listOnlineReward) {
                cc.log("ShowProcess  : ", Global.listOnlineReward);
                cc.log("check list cache : ", Global.listCacheShow)
                let rewardConfig = Global.listOnlineReward[Global.listCacheShow[0] - 10];
                cc.log("ShowProcess  : ", rewardConfig);
                this.descriptionOnline.string = Global.formatString(MyLocalization.GetText("RECEIVE_REWARD_ONLINE"), [rewardConfig.Time]);
                this.valueOnlineReward.string = "X" + Global.formatNumber(rewardConfig.RewardList[0].Amount);
                this.SetIconItem(this.iconOnlineReward, rewardConfig.RewardList[0].RewardType, rewardConfig.RewardList[0].ItemType);
                if(rewardConfig.RewardList[0].RewardType == REWARD_TYPE.INGAME_BALANCE){
                    Global.AgRewardAds += rewardConfig.RewardList[0].Amount
                }
            }
            if(cc.sys.os === cc.sys.OS_ANDROID)
                this.btnReceivedWithAds.active = true;
        } else if (status == STATUS_GIFT_POPUP.REWARD) {
            this.statusRewards = STATUS_GIFT_POPUP.REWARD
            this.dailyContent.active = false;
            this.onlineContent.active = false;
            this.rewardContent.active = true;
            this.rewardKichHoatContent.active = false;
            this.vipContent.active = false;

            for (let i = 0; i < this.listReward.length; i++) {
                this.listReward[i].node.active = false;
            }
            cc.log("check xem nao : ",Global.listReward[0] )
            for (let i = 0; i < Global.listReward[0].length; i++) {
                if (i < this.listReward.length) {
                    this.listReward[i].FillInfo(0, 0, Global.listReward[0][i].Amount, this);
                } else {
                    let itemTrans = cc.instantiate(this.rewardItem);
                    itemTrans.active = true;
                    itemTrans.parent = this.rewardItem.parent;
                    let itemView = itemTrans.getComponent("RewardItemView");
                    this.listReward[this.listReward.length] = itemView;
                    itemView.FillInfo(Global.listReward[0][i].RewardType, Global.listReward[0][i].ItemType, Global.listReward[0][i].Amount, this);
                }
            }
            cc.log("Check dcm  : ", this.listDescriptionReward[0])
            if (this.listDescriptionReward[0] == null) {
                this.descriptionReward.string = MyLocalization.GetText("REWARD_DESCIPTION_VIP");
                this.vipLv.string = MainPlayerInfo.vipLevel.toString();
            } else {
                this.descriptionReward.string = this.listDescriptionReward[0];
            }
            this.listDescriptionReward.splice(0, 1);
            Global.listReward.splice(0, 1);
        } else if (status == STATUS_GIFT_POPUP.VIP) {
            cc.log("chay vao show vip")
            this.statusRewards = STATUS_GIFT_POPUP.VIP
            this.dailyContent.active = false;
            this.onlineContent.active = false;
            this.rewardContent.active = false;
            this.rewardKichHoatContent.active = false;
            this.vipContent.active = true;
            this.vipLv.string = MainPlayerInfo.vipLevel.toString();
        }
        Global.listCacheShow.shift();
    },

    SetIconItem(img, rewardType, itemType) {

        if (itemType == REWARD_TYPE.INGAME_BALANCE) {
            img.spriteFrame = this.imgXu;
        }
        else if (itemType == REWARD_TYPE.DIAMOND) {
            img.spriteFrame = this.imgDiamond;
        }

        // if (rewardType == REWARD_TYPE.INGAME_BALANCE) {
        //     img.spriteFrame = this.imgXu;
        // } else if (rewardType == REWARD_TYPE.ITEM_INGAME) {
        //     if (itemType == ITEM_TYPE.ICE) {
        //         img.spriteFrame = this.imgItemIce
        //     } else if (itemType == ITEM_TYPE.TARGET) {
        //         img.spriteFrame = this.imgItemTarget
        //     } else if (itemType == ITEM_TYPE.SPEED) {
        //         img.spriteFrame = this.imgItemSpeed;
        //     }
        // } else if (rewardType == REWARD_TYPE.LIXI) {
        //     img.spriteFrame = this.imgLixi;
        // } else if (rewardType == REWARD_TYPE.PIECE_CARD) {
        //     img.spriteFrame = this.imgPiece;
        // } else if (rewardType == REWARD_TYPE.CARD) {
        //     img.spriteFrame = this.imgCard;
        // } else if(rewardType == REWARD_TYPE.DIAMOND){
        //     img.spriteFrame = this.imgDiamond;
        // }
    },
    showRewardKichHoat(listPhanThuong) { // viet rieng phan nay
        this.Init();
        Global.isShow = false;
        this.rewardKichHoatContent.active = true;
        this.dailyContent.active = false;
        this.onlineContent.active = false;
        this.rewardContent.active = false;
        this.vipContent.active = false;
        let parentItem = cc.find("ContentItem", this.rewardKichHoatContent);
        let itemClone = cc.find("Item", parentItem);
        for (let i = 0, l = parentItem.children.length; i < l; i++) {
            parentItem.children[i].active = false;
        }
        for (let i = 0; i < listPhanThuong.length; i++) {
            let item = parentItem.children[i];
            if (item == null) {
                item = cc.instantiate(itemClone);
                item.active = true;
                item.parent = parentItem;
            }
            let cp = item.getComponent("RewardItemView");
            cp.FillInfo(listPhanThuong[i].RewardType, listPhanThuong[i].ItemType, listPhanThuong[i].Amount, this);
        }
        let lb = cc.find("Lb", this.rewardKichHoatContent).getComponent(cc.Label);
        lb.string = MyLocalization.GetText("REWARD_DESCIPTION_KICH_HOAT");
    },

    showRewardPromotion(data) {
        this.Init();
        Global.isShow = false;
        this.rewardKichHoatContent.active = true;
        this.dailyContent.active = false;
        this.onlineContent.active = false;
        this.rewardContent.active = false;
        this.vipContent.active = false;
        let parentItem = cc.find("ContentItem", this.rewardKichHoatContent);
        let itemClone = cc.find("Item", parentItem);
        let cp = itemClone.getComponent("RewardItemView");
        cp.FillInfo(REWARD_TYPE.INGAME_BALANCE, 0, data[1], this);

        if(data[3] > 0){
            let itemClone2 = cc.find("Item2", parentItem);
            let cp2 = itemClone2.getComponent("RewardItemView");
            cp2.FillInfo(REWARD_TYPE.DIAMOND, 0, data[3], this);
        }
      
      
        let lb = cc.find("Lb", this.rewardKichHoatContent).getComponent(cc.Label);
        MainPlayerInfo.ingameBalance = data[2];
		MainPlayerInfo.diamondBalance = data[4];
        MainPlayerInfo.setMoneyUser(data[2])
        lb.string = data[6];
    },


    showRewardFirstLogin(data, func = null) {
        Global.isShow = false;
        cc.log("chay dc vao day truoc 222 : ", Global.isShow)
        this.func = func;
        this.rewardKichHoatContent.active = true;
        this.dailyContent.active = false;
        this.onlineContent.active = false;
        this.rewardContent.active = false;
        this.vipContent.active = false;

        let parentItem = cc.find("ContentItem", this.rewardKichHoatContent);
        let itemClone = cc.find("Item", parentItem);
        let cp = itemClone.getComponent("RewardItemView");
        cp.FillInfo(REWARD_TYPE.INGAME_BALANCE, 0, data.IngameBalance, this);

      
        let lb = cc.find("Lb", this.rewardKichHoatContent).getComponent(cc.Label);
        lb.string = "QUÀ TÂN THỦ";
    },

    showRewardFinishQuest(data, func = null) {
        this.func = func
        this.Init();
        
        this.rewardKichHoatContent.active = true;
        this.dailyContent.active = false;
        this.onlineContent.active = false;
        this.rewardContent.active = false;
        this.vipContent.active = false;

        let parentItem = cc.find("ContentItem", this.rewardKichHoatContent);
        let itemClone = cc.find("Item", parentItem);
        let cp = itemClone.getComponent("RewardItemView");
        cp.FillInfo(REWARD_TYPE.INGAME_BALANCE, 0, data.GoldRevice, this);

        let lb = cc.find("Lb", this.rewardKichHoatContent).getComponent(cc.Label);
        lb.string = data.MissionDescription;
    },

    Hide() {
        cc.log("list cache show con lai : ", Global.listCacheShow.length)
        Global.isShow = true;
        if (Global.listCacheShow.length == 0) {
            Global.onPopOff(this.node, true);
            if(this.func){
                this.func();
                this.func = null;
            }
            else{
                if(this.statusRewards === STATUS_GIFT_POPUP.ATTENDANCE){
                    Global.UIManager.showBannerPopup();
                } 
            }
        }
        else {
                
            Global.onPopOff(this.node, true);

            setTimeout(() => {
                if(Global.listCacheShow.length > 0){
                    Global.UIManager.showRewardPopup(Global.listCacheShow[0]);
                    Global.listCacheShow.shift();
                }
            }, 500);
        }
     
    },

    onClickRewardWithAds(){
        require("Util").onShowAdMob("2");
        if(cc.sys.os === cc.sys.OS_ANDROID)
            this.btnReceivedWithAds.active = false;
    },

    onDestroy() {
        Global.ShowRewardPopup = null;
    },
});
