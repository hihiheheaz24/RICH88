var OutGameLogicManager = cc.Class({
    statics: {
        getIns() {
            if (this.self == null) this.self = new OutGameLogicManager();
            return this.self;
        }
    },

    ctor(){
        this.listLabelJackpotIngame = [];
    },

    OutGameHandleResponse(operationResponse) {
        var data = operationResponse;

        let defineRe = RESPONSE_CODE.CTP_TAG;
        let packet = data.vals;
        var responseCode = packet[defineRe];
        if (responseCode == RESPONSE_CODE.MST_SERVER_LOGIN) {
            this.HandleLoginResponse(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_CHAT) {
            this.HandleServerChat(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_CHAT_LIST) {
            this.HandleServerChatList(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_CONFIRM_MESSAGE) {
            this.HandleConfirmResponce(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_MINIPOKER_SPIN_RESPONSE) {
            this.HandleResultSpinMiniPoker(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_CASHOUT_NOTIFICATION) {
            this.HandleNotifyCashOut(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_NOTIFICATION_LOBBY_INFO) {
            this.HandleNotifyLobby(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_ACCOUNT_HISTORY) {
            this.HandleAccountHistory(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_TELCO_HISTORY) {
            this.HandleTelcoHistory(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_TAKE_JACKPOT_RANK) {
            this.HandleTakeJackpotRank(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_TOP_TAKE_JACKPOT_RANK) {
            this.HandleTopJackpotRank(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_DAILY_REWARD_CONFIG) {
            this.HandleGetDailyRewardConfig(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_RECEIVED_DAILY_BONUS) {
            this.HandleReceiveDailyBonus(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_RECEIVED_TIMEONLINE_BONUS) {
            this.HandleReceiveTimeOnlineBonus(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_GET_DAILY_SPIN_INFO) {
            this.HandleGetDailySpinInfo(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_PLAY_DAILY_SPIN_RESPONSE) {
            this.HandlePlayDailySpin(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_UPDATE_VIP) {
            this.HandleUpdateVip(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_GET_VIP_CONFIG_INFO_RESPONSE) {
            this.HandleGetVipConfigInfo(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_UPDATE_VIP_POINT) {
            this.HandleUpdateVipPoint(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_GET_JOIN_CARD_PIECES_CONFIG) {
            this.HandleGetJoinCardFromPieceInfo(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_JOIN_CARD_PIECES) {
            this.HandleJoinCardFromPiece(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_GET_NEWS_RESPONSE) {
            this.HandleGetNews(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_GET_EVENT_INFO) {
            this.HandleGetEventInfo(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_TOP_EVENT_RESPONSE) {
            this.HandleGetTopEvent(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_GET_PLAY_SPIN_HISTORY_RESPONSE) {
            this.HandleGetHistoryPlaySpin(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_GET_MISSION_INFO_RESPONSE) {
            this.HandleGetMissionInfo(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_GET_BAG_ITEM_INFO_RESPONSE) {
            this.HandleGetBagItemInfo(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_BUY_SHOP_PACKAGE_RESPONSE) {
            this.HandleBuyShopPackage(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_RECEIVED_DIAMOND) {
            this.HandleReceiveDiamond(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_SEND_UPDATE_DIAMOND) {
            this.HandleUpdateDiamond(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_GET_SHOP_SPIN_CONFIG) {
            this.HandleGetShopSpinConfig(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_BUY_DAILY_SPIN_RESPONSE) {
            this.HandleBuySpin(packet);
        }  else if (responseCode == RESPONSE_CODE.MST_SERVER_TELCO_HISTORY) {
            this.HandleTelcoHistory(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_JACKPOT_INFO) {
            this.HandleJackpotInfo(packet);
        }
    },

    HandleLoginResponse(packet) {
        MainPlayerInfo.SetUpInfo(JSON.parse(packet[1]));
        this.CheckCastOut();
        CONFIG.TX_BET_PERIOD = 60;
        CONFIG.TX_AWARD_PERIOD = 20;
        if (Global.GameConfig.TextNotifiAlterLogin) {
            Global.UIManager.showCommandPopup(Global.GameConfig.TextNotifiAlterLogin, null);
        }
        
    },


    HandleGetVipConfigInfo(packet) {
        cc.log(packet);
        let vipConfigInfoString = packet[1];
        let description = packet[2] ? packet[2] : "";
        let dq = packet[3] ? packet[3] : "";
        let listVipInfo = [];
        for (let i = 0; i < vipConfigInfoString.length; i++) {
            listVipInfo[i] = JSON.parse(vipConfigInfoString[i]);
        }
        if (Global.VipInfoPopup != null && Global.VipInfoPopup.node.active == true)
            Global.VipInfoPopup.GetVipInfo(listVipInfo, description, dq);
        if (Global.ProfilePopup != null && Global.ProfilePopup.node.active == true) {
            Global.ProfilePopup.UpdateInfoVip(listVipInfo);
        }

    },

    HandleNotifyLobby(packet) {
        let notify = packet[1];
        let speed = packet[2];
        if( Global.LobbyView)Global.LobbyView.UpdateNotify(notify, speed);
    },

    HandleNotifyCashOut(packet) {
        return;
        let content = packet[1];
        let speed = packet[2];
        let repeat = packet[3];
        if (Global.LobbyView) {
            Global.LobbyView.ShowNotifyCash(content, speed, repeat);
        }
    },

    HandleUpdateVipPoint(packet) {
        let levelVip = packet[1];
        let vipPoint = packet[2];
        MainPlayerInfo.SetVip(levelVip);
        MainPlayerInfo.SetVipPoint(vipPoint);
    },

    HandleGetMissionInfo(packet) {
        let questDataArray = packet[1];
        let questList = [];
        for (let i = 0; i < questDataArray.length; i++) {
            questList[i] = JSON.parse(questDataArray[i]);
        }
        if (Global.QuestPopup != null)
            Global.QuestPopup.UpdateQuestInfo(questList);
        else {
            cc.resources.load("Popup/QuestPopup", cc.Prefab, (err, prefab) => {
                let item = cc.instantiate(prefab).getComponent("QuestPopup");
                Global.QuestPopup = item;
                Global.QuestPopup.UpdateQuestInfo(questList);
                Global.UIManager.parentPopup.addChild(item.node);
                item.node.active = false;
            })
        }
    },

    HandleGetShopSpinConfig(packet) {
        let shopSpinString = packet[1];
        let listShopSpinConfig = [];
        for (let i = 0; i < shopSpinString.length; i++) {
            listShopSpinConfig[i] = JSON.parse(shopSpinString[i]);
        }
        Global.shopSpinConfig = listShopSpinConfig;
    },

    HandleGetDailySpinInfo(packet) {
        let rewardSpinString = packet[1];
        let listReward = [];
        for (let i = 0; i < rewardSpinString.length; i++) {
            listReward[i] = JSON.parse(rewardSpinString[i]);
        }
        Global.listResult = listReward;
        let numberSpin = packet[2];
        Global.currentSpin = numberSpin;
        // Global.LobbyView.UpdateNumberSpin(numberSpin);
    },

    HandleBuySpin(packet) {
        let numberSpin = packet[1];
        let accountBalance = packet[2];
        Global.currentSpin = numberSpin;
        MainPlayerInfo.setMoneyUser(accountBalance) ;
        // Global.LobbyView.UpdateNumberSpin(numberSpin);
        Global.LuckySpinPopup.UpdatecurrentSpin(numberSpin);
        Global.UIManager.showCommandPopup(MyLocalization.GetText("SUCCESS"));
    },

    HandleUpdateBalanceResponce(packet) {
        let playerId = packet[1];
        let money = packet[2];
        if (playerId == MainPlayerInfo.accountId) {
            MainPlayerInfo.setMoneyUser(money) ;
        }
    },

    //gift
    HandleGetDailyRewardConfig(packet) {
        cc.log("data daily reward config la : ", JSON.stringify(packet))
        let listDailyReward = JSON.parse(packet[1]);
        if (packet[2]) {
            let listOnlineReward = JSON.parse(packet[2]);
            Global.listOnlineReward = listOnlineReward;
        }

        let indexDailyReward = packet[3];
        let indexOnlineReward = packet[4];
        let timeRemain = packet[5];
        Global.listDailyReward = listDailyReward;

        Global.indexDailyReward = indexDailyReward;
        Global.indexOnlineReward = indexOnlineReward;
        Global.NetworkManager.SetTimeOnline(timeRemain);
    },

    HandleReceiveDailyBonus(packet) {
        let indexDailyReward = packet[1];
        let accountBalance = packet[2];
        Global.indexDailyReward = indexDailyReward;
        // MainPlayerInfo.setMoneyUser(accountBalance) ;
        MainPlayerInfo.ingameBalance = accountBalance
        Global.UIManager.showRewardPopup(STATUS_GIFT_POPUP.ATTENDANCE);
    },

    HandleReceiveTimeOnlineBonus(packet) {
        cc.log("data time online ", packet)
        let indexOnlineReward = packet[1];
        let accountBalance = packet[2];
        let timeRemain = packet[3];
        Global.indexOnlineReward = indexOnlineReward;
        MainPlayerInfo.ingameBalance = accountBalance
        if (Global.UIManager) Global.UIManager.showRewardPopup(STATUS_GIFT_POPUP.ONLINE);
        if (Global.NetworkManager) Global.NetworkManager.SetTimeOnline(timeRemain);

        if(Global.WeeklyRewardPopup){
            Global.WeeklyRewardPopup.loadListOnline();
        }
    },

    HandleUpdateVip(packet) {
        let levelVip = packet[1];
        let vipPoint = packet[2];
        let rewardSpinString = packet[3];
        let accountBalance = packet[4];
        MainPlayerInfo.vipLevel = levelVip;
        MainPlayerInfo.vipPoint = vipPoint;
        // MainPlayerInfo.setMoneyUser(accountBalance) ;
        MainPlayerInfo.ingameBalance = accountBalance;
        cc.log("chay vao ipdate vip")
        require("SendRequest").getIns().MST_Client_Get_Vip_Point_Config();
        if (Global.UIManager) Global.UIManager.showRewardPopup(STATUS_GIFT_POPUP.VIP);
    },

    HandleAccountHistory(packet) {
        if (Global.UIManager) Global.UIManager.hideMiniLoading();
        if (Global.LobbyView) {
            let listDataString = packet[1];
            let listData = [];
            for (let i = 0; i < listDataString.length; i++) {
                listData[i] = JSON.parse(listDataString[i]);
            }
            if (Global.HistoryPopup) Global.HistoryPopup.SetInfoHistoryPlay(listData);
        }
    },

    HandleGetJoinCardFromPieceInfo(packet) {
        let telcoPieceString = packet[1];
        let listTelcoPiece = [];
        for (let i = 0; i < telcoPieceString.length; i++) {
            listTelcoPiece[i] = JSON.parse(telcoPieceString[i]);
        }
        let numbPiece = packet[2];
        Global.ShopPopup.SetUpListInfoPiece(listTelcoPiece, numbPiece);
    },

    //news 
    HandleGetNews(packet) {
        
    },

    HandleGetEventInfo(packet) {
        console.log("check event : ", packet)
        if(Global.JackpotController) Global.JackpotController.reviceXHu(packet);

        let infoEventString = packet[1];
        let listData = [];
        let isShowFirstCashIn = false;
        for (let i = 0; i < infoEventString.length; i++) {
            let data = JSON.parse(infoEventString[i]);
            listData[i] = data;
            if(data.EventId === 10){ // evtn id 10 la nap lan dau
                isShowFirstCashIn = true;
            }
            if(data.EventId === 21){ // evtn san heo
                Global.EventSanHeo = data;
            }
            
        }
        console.log("check list data event : ", listData)
        Global.listPromotionCashIn = listData;
        if(Global.listPromotionCashIn.length > 0 && isShowFirstCashIn){
            if(!Global.IsNewUser && isShowFirstCashIn){
                Global.UIManager.showPromotionFirstCashIn();
            }
            Global.LobbyView.btnFirstCashIn.active = true;
        }
        else{
            Global.LobbyView.btnFirstCashIn.active = false;
        }

        if(CONFIG.VERSION === "4.0.0"){
			Global.LobbyView.btnFirstCashIn.active = false;
		}

        if(!Global.EventSanHeo){
            Global.LobbyView.btnEventSanHeo.active = false;
        }
        else{
            Global.LobbyView.btnEventSanHeo.active = true
        }
        // if (Global.LobbyView) {
        //     let infoEventString = packet[1];
        //     let listData = [];
        //     for (let i = 0; i < infoEventString.length; i++) {
        //         listData[i] = JSON.parse(infoEventString[i]);
        //     }
        //     cc.log("check data nap lan dau : ", listData)


        //     Global.FirstCashIn.listPromotionCashIn = listData;

            // if (Global.EventPopup != null && Global.EventPopup.node.active == true)
            //     Global.EventPopup.GetListEventInfo(listData);
        // }
    },

    HandleJackpotInfo(packet) {
        Global.JackpotController.reviceData(packet[1]);
    },

    HandleGetTopEvent(packet) {
        cc.log("cehck data eventrankaspfjkoeqw ", packet)
        if (Global.EventRanking) {
            Global.EventRanking.handleData(packet);
        }
        else{
            cc.resources.load("Popup/EventRanking", cc.Prefab, (err, prefab) => {
                let item = cc.instantiate(prefab).getComponent("EventRanking");
                Global.EventRanking = item;
                Global.UIManager.parentPopup.addChild(item.node, 10);
                Global.EventRanking.node.active = false;
                item.initView();

                Global.EventRanking.handleData(packet);
            })
        }
    },

    //diamond
    HandleBuyShopPackage(packet) {
        if (Global.isPortrait && Global[MainPlayerInfo.CurrentGameCode + Global.PokerIdRoom])
            Global.UIManager.showCommandPopupPO(MyLocalization.GetText("SUCCESS"));
        else
            Global.UIManager.showCommandPopup(MyLocalization.GetText("SUCCESS"));
        let itemData = packet[1];
        let accountBalance = packet[2];
        let diamondBalance = packet[3];
        MainPlayerInfo.SetUpDiamond(diamondBalance);
        MainPlayerInfo.setMoneyUser(accountBalance);
    },

    HandleReceiveDiamond(packet) {
        let accountId = packet[1];
        let rewardDiamond = packet[2];
        let diamondBalance = packet[3];
        if (accountId == MainPlayerInfo.accountId) {
            let reward = {
                RewardType: REWARD_TYPE.DIAMOND,
                Amount: rewardDiamond,
                ItemType: 0,
            };
            let listReward = [];
            listReward[0] = reward;
            Global.listReward[Global.listReward.length] = listReward;
            MainPlayerInfo.SetUpDiamond(diamondBalance);
            if (Global.LobbyView) {
                Global.LobbyView.UpdateInfoView();
            }
            Global.UIManager.showRewardPopup(STATUS_GIFT_POPUP.REWARD, MyLocalization.GetText("GET_REWARD"));
        }
    },

    HandleUpdateDiamond(packet) {
        let diamondBalance = packet[2];
        MainPlayerInfo.SetUpDiamond(diamondBalance);
        Global.LobbyView.UpdateInfoView();
    },

    //rank
    HandleTakeJackpotRank(packet) {
        cc.log("HandleTakeJackpotRank :", packet);
        Global.UIManager.hideMiniLoading();
        if (Global.LobbyView) {
            let listDataString = packet[1];
            let listData = [];
            for (let i = 0; i < listDataString.length; i++) {
                listData[i] = JSON.parse(listDataString[i]);
            }
            if (Global.RankPopup != null && Global.RankPopup.node.active == true)
                Global.RankPopup.SetInfoTakeJackpot(listData);
        }
    },

    HandleTopJackpotRank(packet) {
        cc.log("data jackppot :", packet);
        Global.UIManager.hideMiniLoading();
        if (Global.LobbyView) {
            let listDataString = packet[1];
            let listData = [];
            for (let i = 0; i < listDataString.length; i++) {
                listData[i] = JSON.parse(listDataString[i]);
            }
            if (Global.RankPopup != null && Global.RankPopup.node.active == true)
                Global.RankPopup.SetInfoTopWinJackpot(listData);
        }
    },

    HandleListCashoutCode(packet) {
        let listDataString = packet[1];
        let listData = [];
        for (let i = 0; i < listDataString.length; i++) {
            listData[i] = JSON.parse(listDataString[i]);
        }


        let percent = packet[2];
        if(Global.ShopPopup)
            Global.ShopPopup.UpdateListCashoutCode(listData, percent);
    },

    HandleCashoutCodeSuccess(packet) {
        let mes = packet[3];
        let accountBalance = packet[2];
        MainPlayerInfo.setMoneyUser(accountBalance);
        Global.UIManager.showCommandPopup(mes);
    },
    HandleCancelCashoutCodeSuccess(packet) {
        let mes = packet[3];
        let accountBalance = packet[2];
        MainPlayerInfo.setMoneyUser(accountBalance);

        Global.UIManager.showCommandPopup(mes);
    },
    HandleTelcoHistory(packet) {
        if (Global.UIManager) Global.UIManager.hideMiniLoading();
        if (Global.LobbyView) {
            let listDataString = packet[1];
            let listData = [];
            for (let i = 0; i < listDataString.Length; i++) {
                listData[i] = JSON.parse(listDataString[i]);
            }
            if (Global.HistoryPopup) Global.HistoryPopup.SetInfoTelco(listData);
        }
    },
    HandlePlayDailySpin(packet) {
        let indexReward = packet[1];
        let numberSpin = packet[2];
        let accountBalance = packet[3];
        Global.LuckySpinPopup.PlaySpin(indexReward, numberSpin, accountBalance);
    },
    HandleGetHistoryPlaySpin(packet) {
        let historyStr = packet[1];
        let lstData = [];
        for (let i = 0; i < historyStr.length; i++) {
            lstData[i] = JSON.parse(historyStr[i]);
        }
        Global.LuckySpinPopup.UpdateHistory(lstData);
    },



    

});
module.exports = OutGameLogicManager;