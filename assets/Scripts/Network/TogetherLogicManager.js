var OutGameLogicManager = require("OutGameLogicManager");
var InGameLogicManager = require("InGameLogicManager");
var ScreenManager = require("ScreenManager");
var TogetherLogicManager = cc.Class({
    statics: {
        getIns() {
            if (this.self == null) this.self = new TogetherLogicManager();
            return this.self;
        }
    },

    TogetherHandleResponse(operationResponse) {
        var data = operationResponse;

        let defineRe = RESPONSE_CODE.CTP_TAG;
        let packet = data.vals;
        var responseCode = packet[defineRe];

        if (responseCode == RESPONSE_CODE.MST_SERVER_LOGIN) {
            this.HandleLoginResponse(operationResponse);
        }
        else if (responseCode == RESPONSE_CODE.MST_SERVER_CONFIRM_MESSAGE) {
            this.HandleConfirmResponse(packet);
        }
        else if (responseCode == RESPONSE_CODE.MST_SERVER_MINIPOKER_SPIN_RESPONSE) {
            this.HandleResultSpinMiniPoker(operationResponse);
        }
        else if (responseCode == RESPONSE_CODE.MST_SERVER_NEW_MAIL) {
            this.HandleNewMail(packet);
        }
        else if (responseCode == RESPONSE_CODE.MST_SERVER_PLAY_DAILY_SPIN_RESPONSE) {
            this.HandlePlayDailySpin(packet);
        }
        else if (responseCode == RESPONSE_CODE.MST_SERVER_CASHOUT_NOTIFICATION) {
            this.HandleNotifyCashOut(operationResponse);
        }
        else if (responseCode == RESPONSE_CODE.MST_SERVER_TOPUP_INFO) {
            this.HandleTopupInfoShop(packet);
        }
        else if (responseCode == RESPONSE_CODE.MST_SERVER_GUN_INFO) {
            this.HandleGunInfo(packet);
        }
        else if (responseCode == RESPONSE_CODE.MST_SERVER_DELETE_MAIL_RESPONSE) {
            this.HandleDeleteMail(packet);
        }
        else if (responseCode == RESPONSE_CODE.MST_SERVER_UPDATE_PHONENUMBER) {
            this.HandleUpdatePhoneNumber(packet);
        }
        else if (responseCode == RESPONSE_CODE.MST_SERVER_GUN_TAKE_JACKPOT_PERCENT_INFO) {
            this.HandleTakeJackpotPercent(operationResponse);
        }
        else if (responseCode == RESPONSE_CODE.MST_SERVER_BATTLE_ROOM_INFO) {
            this.HandleBattleRoomInfo(operationResponse);
        }
        else if (responseCode == RESPONSE_CODE.MST_SERVER_GET_DAILY_SPIN_BONUS) {
            this.HandleGetDailySpinBonus(operationResponse);
        }
        else if (responseCode == RESPONSE_CODE.MST_SERVER_TAKE_REWARD) {
            this.HandleTakeReward(packet);
        }
        else if (responseCode == RESPONSE_CODE.MST_SERVER_RECEIVED_REWARD) {
            this.HandleRecediveReward(packet);
        }
        else if (responseCode == RESPONSE_CODE.MST_SERVER_STAR_SLOT_GET_DETAIL_HISTORY) {
            this.HandleHistoryGameSlot(operationResponse);
        }
        else if (responseCode == RESPONSE_CODE.MST_SERVER_GET_SHOP_CONFIG) {
            this.HandleGetShopConfig(packet);
        }
        else if (responseCode == RESPONSE_CODE.MST_SERVER_RECEIVED_DIAMOND) {
            this.HandleReceiveDiamond(operationResponse);
        }
        else if (responseCode == RESPONSE_CODE.MST_SERVER_SEND_UPDATE_DIAMOND) {
            this.HandleUpdateDiamond(operationResponse);
        }
        else if (responseCode == RESPONSE_CODE.MST_SERVER_GET_MISSION_INFO_RESPONSE) {
            this.HandleGetMissionInfo(operationResponse);
        }
    },
    
    HandleLoginResponse(operationResponse) {
        if (ScreenManager.getIns().currentScreen == SCREEN_CODE.INGAME_KILL_BOSS) {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        } else {
            OutGameLogicManager.getIns().OutGameHandleResponse(operationResponse);
        }
        
    },

    HandleTopupInfoShop(packet) {
        cc.log("data topup info ", packet)
        let cardTopupInfosInString = packet[1];
        let cardTopupInfosIn = [];
        for (let i = 0; i < cardTopupInfosInString.length; i++) {
            cardTopupInfosIn[i] = JSON.parse(cardTopupInfosInString[i]);
        }
        Global.cardTopupInfosIn = cardTopupInfosIn;


        let smsTopupInfosInString = packet[3];
        let smsTopupInfosIn = [];
        for (let i = 0; i < smsTopupInfosInString.length; i++) {
            smsTopupInfosIn[i] = JSON.parse(smsTopupInfosInString[i]);
        }
        Global.smsTopupInfosIn = smsTopupInfosIn;

        let bankTopupInfosInString = packet[4];
        let bankTopupInfosIn = [];
        for (let i = 0; i < bankTopupInfosInString.length; i++) {
            bankTopupInfosIn[i] = JSON.parse(bankTopupInfosInString[i]);
        }
        Global.bankTopupInfosIn = bankTopupInfosIn;

        let momoTopupInfosInString = packet[5];
        let momoTopupInfosIn = [];
        for (let i = 0; i < momoTopupInfosInString.length; i++) {
            momoTopupInfosIn[i] = JSON.parse(momoTopupInfosInString[i]);
        }
        Global.momoTopupInfosIn = momoTopupInfosIn;

        let cardTopupInfosOutString = packet[2];
        let cardTopupInfosOut = [];
        for (let i = 0; i < cardTopupInfosOutString.length; i++) {
            cardTopupInfosOut[i] = JSON.parse(cardTopupInfosOutString[i]);
        }
        Global.cardTopupInfosOut = cardTopupInfosOut;
    },

    HandleUpdateBalance(operationResponse) {
        
    },

    HandleReceiveDiamond(operationResponse) {
        if (ScreenManager.getIns().currentScreen == SCREEN_CODE.LOBBY) {
            OutGameLogicManager.getIns().OutGameHandleResponse(operationResponse);
        } else {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        }
    },

    HandleUpdateDiamond(operationResponse) {
        if (ScreenManager.getIns().currentScreen == SCREEN_CODE.LOBBY) {
            OutGameLogicManager.getIns().OutGameHandleResponse(operationResponse);
        } else {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        }
    },

    HandleConfirmResponse(packet) {
        
    },

    HandleGunInfo(packet) {
         return;
        cc.log("gun info " + JSON.stringify(packet));
       
        let gunRoom1 = packet[1];
        let gunRoom2 = packet[2];
        let listGunModelRoom1 = [];
        for (let i = 0; i < gunRoom1.length; i++) {
            listGunModelRoom1[i] = JSON.parse(gunRoom1[i]);
        }
        let listGunModelRoom2 = [];
        for (let i = 0; i < gunRoom2.length; i++) {
            listGunModelRoom2[i] = JSON.parse(gunRoom2[i]);
        }
        Global.gunConfigModelRoom1 = listGunModelRoom1;
        Global.gunConfigModelRoom2 = listGunModelRoom2;
    },
    HandleUpdatePhoneNumber(packet) {
        if(Global.ProfilePopup == null) return;
        Global.ProfilePopup.responsePhone(packet);
    },

    HandleGetShopConfig(packet) {
        cc.log("check shop config la : ", packet)
        let shopConfigString = packet[1];
        let listData = [];
        for (let i = 0; i < shopConfigString.length; i++) {
            listData[i] = JSON.parse(shopConfigString[i]);
        }
        let diamondBalance = packet[2];

        Global.DataConfigShopDiamond = listData;
        cc.log("check data km cung : ", listData)
        // Global.ShopPopup.UpdateItemConfig(listData);
        // Global.UIManager.showShopDiamondPopup(listData, diamondBalance);
    },

    HandleRecediveReward(packet) {
        cc.log("packet reward la " + JSON.stringify(packet));
        let rewardSpinString = packet[1];
        let listReward = [];
        for (let i = 0; i < rewardSpinString.length; i++) {
            listReward[i] = JSON.parse(rewardSpinString[i]);
        }
        Global.listReward[Global.listReward.length] = listReward;
        let content = packet[2];
        let accountBalance = packet[3];
        let diamondBalance = packet[4];
        MainPlayerInfo.ingameBalance = accountBalance;
        if(diamondBalance)
            MainPlayerInfo.diamondBalance = diamondBalance;
        Global.UIManager.showRewardPopup(STATUS_GIFT_POPUP.REWARD, content);
    },

    HandlePlayDailySpin(packet) {
        let indexReward = packet[1];
        let numberSpin = packet[2];
        let accountBalance = packet[3];
        Global.currentSpin = numberSpin;
        if (Global.LuckySpinPopup != null) {
            Global.LuckySpinPopup.PlaySpin(indexReward, numberSpin, () => {
                MainPlayerInfo.setMoneyUser(accountBalance);

            });
        }
    },

    HandleTakeReward(packet) {
        let content = packet[1];
        let rewardBalance = packet[2];
        let rewardSpin = packet[3];
        let currentAccountBalance = packet[4];
        let currentSpin = packet[5];

        Global.currentSpin = currentSpin;
        MainPlayerInfo.setMoneyUser(currentAccountBalance);
        Global.UIManager.showServerRewardPopup(content, rewardSpin, rewardBalance);
    },

    HandleNewMail(packet) {
        if (Global.GameConfig.FeatureConfig.MailFeature != EFeatureStatus.Open)
            return;
        let mail = packet[1];
        let mailObj = JSON.parse(mail);
        MainPlayerInfo.UpdateNewMail(mailObj);
        if (Global.LobbyView) {
            Global.LobbyView.UpdateMailStatus();
            Global.UIManager.showConfirmPopup(MyLocalization.GetText("NEW_MAIL_OPEN"), () => {
                Global.UIManager.showMailPopup();
            }, null);
        } else {
            Global.UIManager.showCommandPopup(MyLocalization.GetText("NEW_MAIL_CLOSE"), null);
        }
    },

    HandleDeleteMail(packet) {
        let data = packet[1];
        let listMailObj = [];
        let numMailNotRead = 0;
        for (let i = 0; i < data.length; i++) {
            listMailObj[i] = JSON.parse(data[i]);
            if (listMailObj[i].IsReaded == 0)
                numMailNotRead += 1;
        }

        MainPlayerInfo.SetUpMail(listMailObj, numMailNotRead);
        if (Global.LobbyView) {
            Global.LobbyView.UpdateMailStatus();
        }
        Global.MailPopup.SetInfoMailUpdate();
    },

    HandleNotifyCashOut(operationResponse) {
        cc.log("HandleNotifyCashOut");
        cc.log(packet);
        if (Global.LobbyView) {
            OutGameLogicManager.getIns().OutGameHandleResponse(operationResponse);
        } else {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        }
    }

});
module.exports = TogetherLogicManager;