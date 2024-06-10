var OutGameLogicManager = require("OutGameLogicManager");
var InGameLogicManager = require("InGameLogicManager");
var TogetherLogicManager = require("TogetherLogicManager");
var MiniGameLogicManager = require("MiniGameLogicManager");

var ReceiveResponse = cc.Class({
    statics: {
        getIns() {
            if (this.self == null) this.self = new ReceiveResponse();
            return this.self;
        }
    },

    reviceData(operationResponse) {
        operationResponse = JSON.parse(operationResponse)
        var data = operationResponse;
        let defineRe = RESPONSE_CODE.CTP_TAG;
        let packet = data.vals;
        var responseCode = packet[defineRe];

        let day = Date.now();
        let checkDate = Global.generateDate(day)


        if(responseCode !== "390")
            cc.log("======> service transport packet " + responseCode + " data : " + JSON.stringify(data) + " Time receive : ", checkDate);



        switch (responseCode) {
            case RESPONSE_CODE.MST_SERVER_PING:
                Global.setPingTime(packet);
                return;
            case RESPONSE_CODE.MSG_SERVER_DICE_GET_TOP_WIN_LOSE_CHAIN:
                Global.TaiXiu.responseServer(responseCode, packet);
                return;
            case RESPONSE_CODE.MST_SERVER_JILI_LOGIN_GAME_RESPONSE:
                Global.LobbyView.itemShootFishAPI.window.location = packet[1];
                return;
            case RESPONSE_CODE.MST_SERVER_JILI_GET_GAME_LIST:
                cc.log("handle list game o day")
                return;
            case RESPONSE_CODE.MST_SERVER_GET_VIP_CONFIG_INFO_RESPONSE:
                Global.ConfigVipPoint = packet;
                return;
            case RESPONSE_CODE.MST_SERVER_EXCHANGE_VIP_POINTS:
                cc.log("handle change vip point o day")
                // +) data 1: Vip level mới
                // +) data 2: điểm vip mới
                // +) data 3: số tiền nhận được
                Global.UIManager.showConfirmPopup("Bạn nhận được " + Global.formatNumber(packet[3]) + " từ sự kiện đổi điểm VIP");
                MainPlayerInfo.setMoneyUser(packet[4]);
                MainPlayerInfo.SetVip(packet[1]);
                MainPlayerInfo.SetVipPoint(packet[2]);
                // +) data 4: số tiền của người chơi
                return;
            case RESPONSE_CODE.MST_SERVER_RECEIVE_VIP_REWARD:
                cc.log("handle MST_SERVER_RECEIVE_VIP_REWARD o day")
                // data 1: phần thưởng
                Global.listReward[Global.listReward.length] = JSON.parse(packet[1]);
                Global.UIManager.showRewardPopup(STATUS_GIFT_POPUP.REWARD, MyLocalization.GetText("GET_REWARD"));
                MainPlayerInfo.setMoneyUser(packet[2])
                // data 2: tiền sau khi thưởng

                // data 3: thông tin các level có thể nhận thưởng con lại
                Global.ConfigVipPoint[3] = packet[3];
                cc.log("check config vip ", Global.ConfigVipPoint[3])
                Global.VipPoint.handleListReceive();
                return;
            case RESPONSE_CODE.MST_SERVER_SEND_LEAGUE_INFO:
                cc.log("check data league : ", packet)
                Global.LeagueData = packet;
                let dataIsMe = JSON.parse(packet[3])
                Global.LeagueLInfo = dataIsMe;
                Global.LeagueLevel = dataIsMe.LeagueLevel;
                if(Global.LeagueData){
                    Global.LobbyView.btnLeague.active = true;
                    if(Global.GameView){
                        Global.GameView.btnLeague.active = true;
                    }
                }
                else{
                    Global.LobbyView.btnLeague.active = false;
                }
            return;
            case RESPONSE_CODE.MST_SERVER_GUN_INFO:
                cc.log("dmdmdmd gun info la : ", packet)
                let listGunRoom1 = packet[1];
                for(let i = 0 , l = listGunRoom1.length ; i < l; i++ ){
                    listGunRoom1[i] = JSON.parse(listGunRoom1[i]);
                }
                let listGunRoom2 = packet[2];
                for(let i = 0 , l = listGunRoom2.length ; i < l; i++ ){
                    listGunRoom2[i] = JSON.parse(listGunRoom2[i]);
                }
                MainPlayerInfo.listCacheGun[1] = listGunRoom1;
                MainPlayerInfo.listCacheGun[2] = listGunRoom2;
                return;

            case RESPONSE_CODE.MST_SERVER_SEND_TOAST:
                cc.log("Chay vao show toast")
                Global.UIManager.showNoti(packet[1])
                Global.UIManager.hideMiniLoading();
                break;

            case RESPONSE_CODE.MST_SERVER_GET_ENTERED_REF_CODE_INFO:
                if(Global.InputRefCode){
                    Global.InputRefCode.setUpInfo(packet[1]);
                }
                break;

            case RESPONSE_CODE.MST_SERVER_TRANFER_MONEY_RESPONSE:
                if (Global.TransferChip)
                    Global.TransferChip.showTextNoti(packet)
                break;

            case RESPONSE_CODE.MST_SERVER_GET_OTHER_PLAYER_INFO:
                if (Global.TransferChip)
                    Global.TransferChip.fillInfoPlayer(packet)
                    
                if (Global.InfoPlayerTLMN)
                    Global.InfoPlayerTLMN.handleDataInfoPlayer(packet)

                if (Global.ProfilePopup)
                    Global.ProfilePopup.handleDataInfoPlayer(packet)
                break

            case RESPONSE_CODE.MST_SERVER_INPUT_REF_CODE_RESPONSE:
                let reward = []
                let list = {}
                list.Amount = packet[1];
                MainPlayerInfo.ingameBalance = packet[2];
                reward.push(list)
                Global.listReward[Global.listReward.length] = reward;
                Global.UIManager.showRewardPopup(STATUS_GIFT_POPUP.REWARD, "Bạn đã nhận được quà giới thiệu");
                MainPlayerInfo.IsEnteredRefCode = true;
                return;


            case RESPONSE_CODE.MST_SERVER_PLAYER_JOIN_ROOM:
            case  RESPONSE_CODE.MST_SERVER_ANOTHER_PLAYER_JOIN_ROOM:
            case  RESPONSE_CODE.MST_SERVER_CREATE_FISH:
            case  RESPONSE_CODE.MST_SERVER_NOT_FIND_FISH:
            
            case RESPONSE_CODE.MST_SERVER_PLAYER_LEAVE_ROOM:
            case RESPONSE_CODE.MST_SERVER_PLAYER_ANOTHER_LEAVEROOM:
            case RESPONSE_CODE.MST_SERVER_CHANGE_GUN:
            case RESPONSE_CODE.MST_SERVER_REMOVE_JACKPOT:
            case RESPONSE_CODE.MST_SERVER_SEND_CLEAR_SPECIAL_FISH:
            case RESPONSE_CODE.MST_SERVER_ACTIVE_NOT_ENOUGH_MONEY_REWARD:
            case RESPONSE_CODE.MST_SERVER_RECEIVED_NOT_ENOUGH_MONEY_REWARD:

            case RESPONSE_CODE.MST_SERVER_CLEAR_ALL_NORMAL_FISH:
            case RESPONSE_CODE.MST_SERVER_SHOOTING:
            case RESPONSE_CODE.MST_SERVER_FISH_DEATH:
            case RESPONSE_CODE.MST_SERVER_TAKE_JACKPOT:
            case RESPONSE_CODE.MST_SERVER_KILL_FISH_SPECIAL_AFFECT:
            case RESPONSE_CODE.MST_SERVER_KILL_ELECTRIC_FISH:
            case RESPONSE_CODE.MST_SERVER_TAKE_REWARD_BOX_FISH:    
            
            case RESPONSE_CODE.MST_SERVER_GET_ITEM_INFO:    
            case RESPONSE_CODE.MST_SERVER_TAKE_ITEM:    
            case RESPONSE_CODE.MST_SERVER_ICE_ITEM:    
            case RESPONSE_CODE.MST_SERVER_USING_ITEM:    
            case RESPONSE_CODE.MST_SERVER_USING_SPECIAL_BULLET:    
            case RESPONSE_CODE.MST_SERVER_TAKE_REWARD_SPECIAL_BULLET:    
            case RESPONSE_CODE.MST_SERVER_UPDATE_FREE_SHOOTING_INFO:    
            case RESPONSE_CODE.MST_SERVER_SET_MAIN_ACTOR:
            case RESPONSE_CODE.MST_SERVER_UPDATE_ROOM_INFO:
                if(Global.FishCaMap)Global.FishCaMap.responseSever(responseCode , packet);
            return;

            case RESPONSE_CODE.MST_SERVER_UPDATE_PLAYER_BALANCE:
                if(Global.FishCaMap)Global.FishCaMap.responseSever(responseCode , packet);
                let playerId = packet[1];
                let money = packet[2];
                if(playerId == MainPlayerInfo.accountId){
                    cc.log("chay váo et cung tien")
                    MainPlayerInfo.setMoneyUser(money);
                }
                return;

            case RESPONSE_CODE.MST_SERVER_CASHIN_COMPLETED:
                let typeCashIn = packet[1];
                let uag = packet[2];
                MainPlayerInfo.setMoneyUser(uag);
                switch (typeCashIn) {
                    case 4:
                        Global.ShopPopup.tabMomoContent.resetUI();
                        break;
                    case 5:
                        Global.ShopTabCashInBanking.resetUI();
                        break;
                }
                return;


            case RESPONSE_CODE.MSG_SERVER_ORACLE_JOIN_ROOM:
            case RESPONSE_CODE.MSG_SERVER_ORACLE_GET_ACCOUNT_INFO:
            case RESPONSE_CODE.MSG_SERVER_ORACLE_GET_ACCUMULATE: 
            case RESPONSE_CODE.MSG_SERVER_ORACLE_GET_JACKPOT_LOG: 
            case RESPONSE_CODE.MSG_SERVER_ORACLE_GET_JACKPOT_INFO: 
            case RESPONSE_CODE.MSG_SERVER_ORACLE_SPIN: 
            case RESPONSE_CODE.MSG_SERVER_ORACLE_PLAY_BONUS:
            case RESPONSE_CODE.MSG_SERVER_ORACLE_PLAY_X2:
                if (Global.ThatTruyen) Global.ThatTruyen.responseServer(responseCode, packet);
                return;

            case RESPONSE_CODE.MST_SERVER_TOP_TAKE_JACKPOT_RANK:
                if (Global.FishCaMap) Global.FishCaMap.responseSever(responseCode, packet);
                return;

            case RESPONSE_CODE.MST_SERVER_STAR_SLOT_ACCOUNT_INFO:
            case RESPONSE_CODE.MST_SERVER_STAR_SLOT_BONUS_RESULT:
            case RESPONSE_CODE.MST_SERVER_STAR_SLOT_JACKPOT_INFO:
            case RESPONSE_CODE.MST_SERVER_STAR_SLOT_SPIN_RESULT:
            case RESPONSE_CODE.MST_SERVER_STAR_SLOT_TOP_TAKE_JACKPOT_INFO:
                if (Global.VoLam) Global.VoLam.responseServer(responseCode, packet);
                return;
            case RESPONSE_CODE.MST_SERVER_STAR_SLOT_GET_DETAIL_HISTORY:
                //cc.log("__ History __ : ", JSON.stringify(packet));
                var gameId = packet[5];
                if (gameId == GAME_TYPE.MINI_SLOT) {
                    if (Global.HistoryMiniSlot) Global.HistoryMiniSlot.responseServer(packet);
                } else {
                    if (Global.LichSuQuayVoLam) Global.LichSuQuayVoLam.responseServer(packet);
                    if (Global.LichSuQuayThatTruyen) Global.LichSuQuayThatTruyen.responseServer(packet);
                }
                return;


            case RESPONSE_CODE.MST_SERVER_MINISLOT_JACKPOT_INFO_NEW:
            case RESPONSE_CODE.MST_SERVER_MINISLOT_SPIN:
            if (Global.MiniSlot != null) {
                Global.MiniSlot.responseServer(responseCode, packet);
            }
                return;


            
            case  RESPONSE_CODE.MST_SERVER_SEND_NOTIFICATION:
                if (Global.NotifyUI && Global.GameConfig.FeatureConfig.NotifyLobbyFeautre == EFeatureStatus.Open) Global.NotifyUI.UpdateListNotify(packet);
                //  cc.log("packet la " + JSON.stringify(packet))
                return;
            case RESPONSE_CODE.MST_SERVER_TOP_DAIGIA:
                Global.TopView.loadListView(packet);
                return;
            case RESPONSE_CODE.MST_SERVER_INFO_VERIFY_PHONENUMBER_RESPONSE:
                if (Global.ProfilePopup) Global.ProfilePopup.setTypeVeryPhone(packet);
                return;
            case RESPONSE_CODE.MST_SERVER_GET_CHARGING_INFO_RESPONSE:
                if (Global.ShopTabCashInBanking) Global.ShopTabCashInBanking.setDataInfotTransfer(packet);
                return;

            case RESPONSE_CODE.MST_SERVER_GET_BONUS_FIRST_CASHIN_RESPONSE:
                if (Global.PromotionView) Global.PromotionView.handleDataPromotion(packet);
                return;

            case RESPONSE_CODE.MST_SERVER_RECEIVE_BONUS_FIRST_CASHIN_RESPONSE:
                if (Global.PromotionView) Global.PromotionView.handleDataReceivedPromotion(packet);
                else {
                    cc.resources.load("Popup/PromotionPopup", cc.Prefab, (err, prefab) => {
                        let item = cc.instantiate(prefab).getComponent("PromotionPopup");
                        Global.PromotionView = item;
                        this.parentPopup.addChild(item.node);
                        Global.PromotionView.handleDataReceivedPromotion(packet);
                    })
                }
                return;
            case RESPONSE_CODE.MST_SERVER_GET_ACCOUNT_TICKET_RESPONSE:
                if(Global.ProfilePopup)
                    Global.ProfilePopup.handleDataTicket(packet);
                break;

            case RESPONSE_CODE.MST_SERVER_GET_HISTORY_TOUR_RANKING:
                cc.log("check data la :  ", packet)
                if(Global.LobbyView)
                    Global.LobbyView.handleDataRankTour(packet);
                break;
        }

       

        if (responseCode == RESPONSE_CODE.MST_SERVER_LOGIN) {
            cc.log("dcm cehck login : ", packet)
            Global.LobbyView.reviceLoginData(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_CONFIRM_MESSAGE) {
            Global.UIManager.hideMiniLoading();
            let multiLanguageConfiges = packet[1];
            let confirmCode = packet[2];
            Global.UIManager.ShowTogetherConfirmMessenge(multiLanguageConfiges, confirmCode);
        }   else if (responseCode == RESPONSE_CODE.MST_SERVER_ANOTHER_PLAYER_JOIN_ROOM) {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_PING) {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_CREATE_FISH) {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_INGAME_CHAT) {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_NOT_FIND_FISH) {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_FISH_DEATH) {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_SHOOTING) {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_PLAYER_LEAVE_ROOM) {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_PLAYER_ANOTHER_LEAVEROOM) {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_CHANGE_GUN) {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_SEND_CLEAR_SPECIAL_FISH) {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_TAKE_JACKPOT) {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_REMOVE_JACKPOT) {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_USING_ITEM) {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_GET_ITEM_INFO) {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_TAKE_ITEM) {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_TAKE_BOOM_FISH) {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_UPDATE_ROOM_INFO) {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        } 
         else if (responseCode == RESPONSE_CODE.MST_SERVER_GET_ALLMAIL) {
            
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
        }  
        else if (responseCode == RESPONSE_CODE.MST_SERVER_JACKPOT_INFO) {
            cc.log("cehck jackoit")
            OutGameLogicManager.getIns().OutGameHandleResponse(operationResponse);
        }
        else if (responseCode == RESPONSE_CODE.MST_SERVER_UPDATE_PLAYER_BALANCE) {
            TogetherLogicManager.getIns().TogetherHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_CLEAR_ALL_NORMAL_FISH) {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_GET_PLAYER_INFO) {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        }  else if (responseCode == RESPONSE_CODE.MST_SERVER_NEW_MAIL) {
            TogetherLogicManager.getIns().TogetherHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_CASHOUT_NOTIFICATION) {
            TogetherLogicManager.getIns().TogetherHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_NOTIFICATION_LOBBY_INFO) {
            OutGameLogicManager.getIns().OutGameHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_ACCOUNT_HISTORY) {
            OutGameLogicManager.getIns().OutGameHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_TOPUP_INFO) {
            TogetherLogicManager.getIns().TogetherHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_GUN_INFO) {
            TogetherLogicManager.getIns().TogetherHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_TELCO_HISTORY) {
            OutGameLogicManager.getIns().OutGameHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_TAKE_JACKPOT_RANK) {
            OutGameLogicManager.getIns().OutGameHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_TOP_TAKE_JACKPOT_RANK) {
            OutGameLogicManager.getIns().OutGameHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_DELETE_MAIL_RESPONSE) {
            TogetherLogicManager.getIns().TogetherHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_UPDATE_PHONENUMBER) {
            TogetherLogicManager.getIns().TogetherHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_TAKE_JACKPOT_FREETURN) {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_GET_CURRENT_JACKPOT_FREETURN) {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_PLAY_JACKPOT_FREETURN) {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_TAKE_NORMAL_FREETURN) {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_GET_CURRENT_NORMAL_FREETURN) {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_PLAY_NORMAL_FREETURN) {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_GUN_TAKE_JACKPOT_PERCENT_INFO) {
            TogetherLogicManager.getIns().TogetherHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_ICE_ITEM) {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_KILL_FISH_SPECIAL_AFFECT) {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_KILL_ELECTRIC_FISH) {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_QUEST_SUCCESSED) {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_JOIN_WAIITNG_ROOM) {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_START_BATTLE_GAME) {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_ENDGAME_BATTLE_GAME) {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_OTHER_LEAVE_WAITING_ROOM) {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_BATTLE_ROOM_INFO) {
            TogetherLogicManager.getIns().TogetherHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_GET_DAILY_SPIN_BONUS) {
            TogetherLogicManager.getIns().TogetherHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_TAKE_REWARD) {
            TogetherLogicManager.getIns().TogetherHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_UPDATE_QUEST_INFO) {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_DAILY_REWARD_CONFIG) {
            OutGameLogicManager.getIns().OutGameHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_RECEIVED_DAILY_BONUS) {
            OutGameLogicManager.getIns().OutGameHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_RECEIVED_TIMEONLINE_BONUS) {
            OutGameLogicManager.getIns().OutGameHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_GET_DAILY_SPIN_INFO) {
            OutGameLogicManager.getIns().OutGameHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_PLAY_DAILY_SPIN_RESPONSE) {
            TogetherLogicManager.getIns().TogetherHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_UPDATE_VIP) {
            OutGameLogicManager.getIns().OutGameHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_GET_VIP_CONFIG_INFO_RESPONSE) {
            OutGameLogicManager.getIns().OutGameHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_UPDATE_VIP_POINT) {
            OutGameLogicManager.getIns().OutGameHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_GET_JOIN_CARD_PIECES_CONFIG) {
            OutGameLogicManager.getIns().OutGameHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_JOIN_CARD_PIECES) {
            OutGameLogicManager.getIns().OutGameHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_GET_NEWS_RESPONSE) {
            OutGameLogicManager.getIns().OutGameHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_GET_EVENT_INFO) {
            OutGameLogicManager.getIns().OutGameHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_TOP_EVENT_RESPONSE) {
            OutGameLogicManager.getIns().OutGameHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_TOP_EVENT_RESPONSE) {
            OutGameLogicManager.getIns().OutGameHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_RECEIVED_REWARD) {
            TogetherLogicManager.getIns().TogetherHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_TAKE_REWARD_BOX_FISH) {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_USING_SPECIAL_BULLET) {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_TAKE_REWARD_SPECIAL_BULLET) {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_GET_PLAY_SPIN_HISTORY_RESPONSE) {
            OutGameLogicManager.getIns().OutGameHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_GET_MISSION_INFO_RESPONSE) {
            OutGameLogicManager.getIns().OutGameHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_GET_SHOP_SPIN_CONFIG) {
            OutGameLogicManager.getIns().OutGameHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_BUY_SHOP_PACKAGE_RESPONSE) {
            OutGameLogicManager.getIns().OutGameHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_GET_BAG_ITEM_INFO_RESPONSE) {
            OutGameLogicManager.getIns().OutGameHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_RECEIVED_DIAMOND) {
            TogetherLogicManager.getIns().TogetherHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_SEND_UPDATE_DIAMOND) {
            TogetherLogicManager.getIns().TogetherHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_BUY_DAILY_SPIN_RESPONSE) {
            OutGameLogicManager.getIns().OutGameHandleResponse(operationResponse);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_GET_SHOP_CONFIG) {
            TogetherLogicManager.getIns().TogetherHandleResponse(operationResponse);
        } 
       
        else if (responseCode == RESPONSE_CODE.MST_SERVER_TELCO_HISTORY) {
            OutGameLogicManager.getIns().OutGameHandleResponse(operationResponse);
        }
        else if (responseCode == RESPONSE_CODE.MST_SERVER_UPDATE_FREE_SHOOTING_INFO) {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        }
        else if (responseCode == RESPONSE_CODE.MST_SERVER_SET_MAIN_ACTOR) {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        }
        //region star slot
        else if (responseCode == RESPONSE_CODE.MST_SERVER_STAR_SLOT_JACKPOT_INFO) {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        }
        else if (responseCode == RESPONSE_CODE.MST_SERVER_STAR_SLOT_ACCOUNT_INFO) {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        }
        else if (responseCode == RESPONSE_CODE.MST_SERVER_STAR_SLOT_SPIN_RESULT) {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        }
        else if (responseCode == RESPONSE_CODE.MST_SERVER_STAR_SLOT_BONUS_RESULT) {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        }
        else if (responseCode == RESPONSE_CODE.MST_SERVER_STAR_SLOT_TOP_TAKE_JACKPOT_INFO) {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        }
        else if (responseCode == RESPONSE_CODE.MST_SERVER_STAR_SLOT_GET_DETAIL_HISTORY) {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        }



        else if (responseCode == RESPONSE_CODE.MSG_SERVER_ORACLE_JOIN_ROOM) {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        }
        else if (responseCode == RESPONSE_CODE.MSG_SERVER_ORACLE_GET_ACCOUNT_INFO) {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        }
        else if (responseCode == RESPONSE_CODE.MSG_SERVER_ORACLE_GET_ACCUMULATE) {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        }
        else if (responseCode == RESPONSE_CODE.MSG_SERVER_ORACLE_GET_JACKPOT_LOG) {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        }

        else if (responseCode == RESPONSE_CODE.MSG_SERVER_ORACLE_GET_JACKPOT_INFO) {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        }
        else if (responseCode == RESPONSE_CODE.MSG_SERVER_ORACLE_SPIN) {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        }
        else if (responseCode == RESPONSE_CODE.MSG_SERVER_ORACLE_PLAY_BONUS) {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        }
        else if (responseCode == RESPONSE_CODE.MSG_SERVER_ORACLE_PLAY_X2) {
            InGameLogicManager.getIns().InGameHandleResponse(operationResponse);
        }

        //lode

        else if (responseCode == RESPONSE_CODE.MSG_SERVER_OPEN_GAME) {
            MiniGameLogicManager.getIns().MiniGameHandleResponse(operationResponse);
        }

        else if (responseCode == RESPONSE_CODE.MSG_SERVER_BETTING_RESPONSE) {
            cc.log("chay vao dat cuoc thanh comg lo de")
            MiniGameLogicManager.getIns().MiniGameHandleResponse(operationResponse);
        }

        else if (responseCode == RESPONSE_CODE.MSG_SERVER_GET_HISTORY_RESPONSE) {
            MiniGameLogicManager.getIns().MiniGameHandleResponse(operationResponse);
        }

        else if (responseCode == RESPONSE_CODE.MSG_SERVER_GET_DAILY_RESULT_RESPONSE) {
            MiniGameLogicManager.getIns().MiniGameHandleResponse(operationResponse);
        }

        else if (responseCode == RESPONSE_CODE.MSG_SERVER_PUSH_RESULT) {
            MiniGameLogicManager.getIns().MiniGameHandleResponse(operationResponse);
        }

        else if (responseCode == RESPONSE_CODE.MSG_SERVER_GET_CHAT_LIST_RESPONSE) {
            MiniGameLogicManager.getIns().MiniGameHandleResponse(operationResponse);
        }

        // else if (responseCode == RESPONSE_CODE.MSG_SERVER_PUSH_PLAYER_CHATTING) {
        //     cc.log("co chay vao tra ve chat")
        //     MiniGameLogicManager.getIns().MiniGameHandleResponse(operationResponse);
        // }

        //region xoc dia

        else if (responseCode == RESPONSE_CODE.MST_SERVER_OPEN_GAME_RESPONSE) {
            MiniGameLogicManager.getIns().MiniGameHandleResponse(operationResponse);
        }

        else if (responseCode == RESPONSE_CODE.MST_SERVER_BETTING_RESPONSE) {
            MiniGameLogicManager.getIns().MiniGameHandleResponse(operationResponse);
        }

        else if (responseCode == RESPONSE_CODE.MST_SERVER_PUSH_START_SESSION) {
            MiniGameLogicManager.getIns().MiniGameHandleResponse(operationResponse);
        }

        else if (responseCode == RESPONSE_CODE.MST_SERVER_PUSH_END_BETTING) {
            MiniGameLogicManager.getIns().MiniGameHandleResponse(operationResponse);
        }

        else if (responseCode == RESPONSE_CODE.MST_SERVER_PUSH_BETTING_RESULT) {
            MiniGameLogicManager.getIns().MiniGameHandleResponse(operationResponse);
        }

        else if (responseCode == RESPONSE_CODE.MSG_SERVER_GET_CHAT_LIST_RESPONSE_XOC_DIA) {
            MiniGameLogicManager.getIns().MiniGameHandleResponse(operationResponse);
        }

        else if (responseCode == RESPONSE_CODE.MSG_SERVER_PUSH_PLAYER_CHATTING) {
            MiniGameLogicManager.getIns().MiniGameHandleResponse(operationResponse);
        }

        else if (responseCode == RESPONSE_CODE.MST_SERVER_GET_RESULT_LIST_RESPONSE) {
            MiniGameLogicManager.getIns().MiniGameHandleResponse(operationResponse);
        }

        else if (responseCode == RESPONSE_CODE.MST_SERVER_PUSH_BETTING_INFO) {
            MiniGameLogicManager.getIns().MiniGameHandleResponse(operationResponse);
        }

        else if (responseCode == RESPONSE_CODE.MST_SERVER_PUSH_PLAYER_LIST) {
            MiniGameLogicManager.getIns().MiniGameHandleResponse(operationResponse);
        }

        else if (responseCode == RESPONSE_CODE.MST_SERVER_GET_HISTORY_RESPONSE) {
            MiniGameLogicManager.getIns().MiniGameHandleResponse(operationResponse);
        }

        else if (responseCode == RESPONSE_CODE.MST_SERVER_GET_RANKING_RESPONSE) {
            MiniGameLogicManager.getIns().MiniGameHandleResponse(operationResponse);
        }

        else if (responseCode == RESPONSE_CODE.MST_SERVER_DETAIL_HISTORY_RESPONSE) {
            MiniGameLogicManager.getIns().MiniGameHandleResponse(operationResponse);
        }

        //region tai xiu
        else if (responseCode == RESPONSE_CODE.MSG_SERVER_DICE_GET_CURRENT_SESSION_INFO) {
            MiniGameLogicManager.getIns().MiniGameHandleResponse(operationResponse);
        }
        else if (responseCode == RESPONSE_CODE.MSG_SERVER_DICE_SET_BET) {
            MiniGameLogicManager.getIns().MiniGameHandleResponse(operationResponse);
        }
        else if (responseCode == RESPONSE_CODE.MSG_SERVER_DICE_GET_RESULT) {
            MiniGameLogicManager.getIns().MiniGameHandleResponse(operationResponse);
        }
        else if (responseCode == RESPONSE_CODE.MSG_SERVER_DICE_GET_ACCOUNT_RESULT) {
            MiniGameLogicManager.getIns().MiniGameHandleResponse(operationResponse);
        }
        else if (responseCode == RESPONSE_CODE.MSG_SERVER_DICE_GET_TOP_WINNER) {
            MiniGameLogicManager.getIns().MiniGameHandleResponse(operationResponse);
        }
        else if (responseCode == RESPONSE_CODE.MSG_SERVER_DICE_GET_BET_OF_ACCOUNT) {
            MiniGameLogicManager.getIns().MiniGameHandleResponse(operationResponse);
        }
        else if (responseCode == RESPONSE_CODE.MSG_SERVER_DICE_GET_CURRENT_BET_SESSION_INFO) {
            MiniGameLogicManager.getIns().MiniGameHandleResponse(operationResponse);
        }
        else if (responseCode == RESPONSE_CODE.MSG_SERVER_DICE_OPEN_GAME) {
            MiniGameLogicManager.getIns().MiniGameHandleResponse(operationResponse);
        }
        else if (responseCode == RESPONSE_CODE.MSG_SERVER_DICE_SERVER_MESSAGE) {
            MiniGameLogicManager.getIns().MiniGameHandleResponse(operationResponse);
        }
        else if (responseCode == RESPONSE_CODE.MSG_SERVER_DICE_GET_GAME_HISTORY) {
            MiniGameLogicManager.getIns().MiniGameHandleResponse(operationResponse);
        }
        else if (responseCode == RESPONSE_CODE.MSG_SERVER_DICE_CHAT) {
            MiniGameLogicManager.getIns().MiniGameHandleResponse(operationResponse);
        }
        else if (responseCode == RESPONSE_CODE.MSG_SERVER_DICE_CHAT_HISTORY) {
            MiniGameLogicManager.getIns().MiniGameHandleResponse(operationResponse);
        }
        else if (responseCode == RESPONSE_CODE.MSG_SERVER_DICE_GET_TRANSACTION_DETAIL) {
            MiniGameLogicManager.getIns().MiniGameHandleResponse(operationResponse);
        }
        else if (responseCode == RESPONSE_CODE.MSG_SERVER_DICE_GET_CHAIN) {
            MiniGameLogicManager.getIns().MiniGameHandleResponse(operationResponse);
        }
        else if (responseCode == RESPONSE_CODE.MSG_SERVER_GET_LOG_TAI_XIU_IN_GAME) {
            MiniGameLogicManager.getIns().MiniGameHandleResponse(operationResponse);
        }

        //region mini slot
        else if (responseCode == RESPONSE_CODE.MST_SERVER_MINISLOT_JACKPOT_INFO_NEW) {
            MiniGameLogicManager.getIns().MiniGameHandleResponse(operationResponse);
        }
        else if (responseCode == RESPONSE_CODE.MST_SERVER_MINISLOT_SPIN) {
            MiniGameLogicManager.getIns().MiniGameHandleResponse(operationResponse);
        }
        else if (responseCode == RESPONSE_CODE.MST_SERVER_MINISLOT_TOP_WINNER) {
            MiniGameLogicManager.getIns().MiniGameHandleResponse(operationResponse);
        }

        //region mini poker
        else if (responseCode == RESPONSE_CODE.MST_SERVER_MINIPOKER_JACKPOT_INFO_NEW) {
            MiniGameLogicManager.getIns().MiniGameHandleResponse(operationResponse);
        }
        else if (responseCode == RESPONSE_CODE.MST_SERVER_MINIPOKER_SPIN) {
            MiniGameLogicManager.getIns().MiniGameHandleResponse(operationResponse);
        }
        else if (responseCode == RESPONSE_CODE.MST_SERVER_MINIPOKER_TOP_WINNER) {
            MiniGameLogicManager.getIns().MiniGameHandleResponse(operationResponse);
        }
        else if (responseCode == RESPONSE_CODE.MST_SERVER_MINIPOKER_SPIN_MULTI_TIMES) {
            MiniGameLogicManager.getIns().MiniGameHandleResponse(operationResponse);
        }
        else if (responseCode == RESPONSE_CODE.MSG_SERVER_MINIPOKER_GET_DETAILS_HISTORY) {
            MiniGameLogicManager.getIns().MiniGameHandleResponse(operationResponse);
        }

        //region slot api
        else if(responseCode == RESPONSE_CODE.MST_SERVER_PARAMATIC_GET_GAME_LIST_RESPONSE){
            let gameList = JSON.parse(packet[1]);
            Global.LobbyView.hanldeListGameSlotAPI(gameList)
        }

        else if(responseCode == RESPONSE_CODE.MST_SERVER_PARAMATIC_START_GAME_RESPONSE){
            cc.log("check game api : ", packet)
            Global.LobbyView.handleShowGameApi(packet[1], packet[2])
        }

        else if(responseCode == RESPONSE_CODE.MST_SERVER_PARAMATIC_CLOSE_GAME_RESPONSE){
            Global.LobbyView.handleCloseGameApi(packet[1])
        }

        else if(responseCode == RESPONSE_CODE.MST_SERVER_PARAMATIC_CONNECT_ERROR){
            Global.LobbyView.url.close();
            Global.UIManager.showConfirmPopup(packet[1], ()=>{ Global.UIManager.showShopPopup(STATUS_SHOP.BANKING);

            });
            Global.UIManager.hideMiniLoading();
        }

    },

    GetPlatFrom() {
        if (cc.sys.isBrowser) return "1";//CONFIG.SOURCE_ID_WEB;
        switch (cc.sys.os) {
            case cc.sys.ANDROID:
                return "3"; //CONFIG.SOURCE_ID_ANDROID;
            case cc.sys.OS_IOS:
                return "2"; //CONFIG.SOURCE_ID_IOS;
            case cc.sys.OS_WINDOWS:
                return "4"; //CONFIG.SOURCE_ID_PC;
        }
    },

});
module.exports = ReceiveResponse;