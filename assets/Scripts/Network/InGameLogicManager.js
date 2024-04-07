//var GameLogic = require("GameLogic");

var InGameLogicManager = cc.Class({
    statics: {
        getIns() {
            if (this.self == null) this.self = new InGameLogicManager();
            return this.self;
        }
    },

    properties: {
        gamelogic: null,
    },

    InGameHandleResponse(operationResponse) {
        return;
        cc.log("nhay vao nhan slot====== ")

        var data = operationResponse;

        let defineRe = RESPONSE_CODE.CTP_TAG;
        let packet = data.vals;
        var responseCode = packet[defineRe];
        if (responseCode == RESPONSE_CODE.MST_SERVER_LOGIN) {
            this.HandleLoginResponse(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_PLAYER_JOIN_ROOM) {
            this.HandleJoinGameNormal(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_ANOTHER_PLAYER_JOIN_ROOM) {
            this.HandleOtherJoinGameNormal(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_PING) {
            this.HandlePingTime(packet);
            if (this.gamelogic) {
                this.gamelogic.CheckIce();
                require("FishCollection").getIns().UpdateCurrentMoveTime();
            }
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_CREATE_FISH) {
            this.HandleCreateFish(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_INGAME_CHAT) {
            this.HandleChatInGame(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_NOT_FIND_FISH) {
            this.HandleNotFindFish(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_FISH_DEATH) {
            this.HandleFishDeath(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_SHOOTING) {
            this.HandleShooting(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_PLAYER_LEAVE_ROOM) {
            this.HandleLeaveRoom(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_PLAYER_ANOTHER_LEAVEROOM) {
            this.HandleOtherExitRoom(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_CHANGE_GUN) {
            this.HandleChangeGun(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_SEND_CLEAR_SPECIAL_FISH) {
            this.HandleClearSpecialFish(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_TAKE_JACKPOT) {
            this.HandleTakeJackpot(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_REMOVE_JACKPOT) {
            this.HandleRemoveJackpot(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_USING_ITEM) {
            this.HandleUsingItem(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_GET_ITEM_INFO) {
            this.GetItemInfo(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_TAKE_ITEM) {
            this.TakeItemInfo(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_CONFIRM_MESSAGE) {
            this.HandleConfirmResponce(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_UPDATE_ROOM_INFO) {
            this.HandleUpdateRoomInfoResponce(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_SEND_NOTIFICATION) {
            this.HandleNotifyInGame(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_CLEAR_ALL_NORMAL_FISH) {
            this.HandleClearAllNormalFish(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_UPDATE_PLAYER_BALANCE) {
            this.HandleUpdateBalance(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_GET_PLAYER_INFO) {
            this.HandleGetProfileInfo(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_MINIPOKER_SPIN_RESPONSE) {
            this.HandleResultSpinMiniPoker(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_CASHOUT_NOTIFICATION) {
            this.HandleNotifyCashOut(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_TAKE_JACKPOT_FREETURN) {
            this.HandleGetFreeTurn(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_GET_CURRENT_JACKPOT_FREETURN) {
            // this.HandleCurrentFreeTurn(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_PLAY_JACKPOT_FREETURN) {
            this.HandlePlayFreeTurn(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_TAKE_NORMAL_FREETURN) {
            this.HandleGetCurrentSpin(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_GET_CURRENT_NORMAL_FREETURN) {
            // this.HandleCurrentSpin(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_PLAY_NORMAL_FREETURN) {
            this.HandlePlaySpin(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_ICE_ITEM) {
            this.HandleItemIce(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_KILL_FISH_SPECIAL_AFFECT) {
            this.HandleElectricFishAffect(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_KILL_ELECTRIC_FISH) {
            this.HandleKillElectricFish(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_QUEST_SUCCESSED) {
            this.HandleQuestSucces(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_JOIN_WAIITNG_ROOM) {
            this.HandleJoinWaittingRoom(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_START_BATTLE_GAME) {
            this.HandleStartBattleGame(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_ENDGAME_BATTLE_GAME) {
            this.HandleEndGameBattle(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_OTHER_LEAVE_WAITING_ROOM) {
            this.HanldeOtherLeaveWaitting(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_UPDATE_QUEST_INFO) {
            this.HandleUpdateQuestInfo(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_USING_SPECIAL_BULLET) {
            this.HandleUseSpecialGun(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_TAKE_REWARD_SPECIAL_BULLET) {
            this.HandleSpecialGunKillFish(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_RECEIVED_DIAMOND) {
            this.HandleReceiveDiamond(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_SEND_UPDATE_DIAMOND) {
            this.HandleUpdateDiamond(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_PLAY_DAILY_SPIN_RESPONSE) {
            this.HandlePlayDailySpin(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_TAKE_REWARD_BOX_FISH) {
            this.HandleTakeRewardBoxFish(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_UPDATE_FREE_SHOOTING_INFO) {
            this.HandleUpdateFreeShootingInfo(packet);
        } else if (responseCode == RESPONSE_CODE.MST_SERVER_SET_MAIN_ACTOR) {
            this.HandleSetMainActor(packet);
        }

        switch (responseCode) {
            

            // case RESPONSE_CODE.MSG_SERVER_ORACLE_JOIN_ROOM:
            // case RESPONSE_CODE.MSG_SERVER_ORACLE_GET_ACCOUNT_INFO:
            // case RESPONSE_CODE.MSG_SERVER_ORACLE_GET_ACCUMULATE: 
            // case RESPONSE_CODE.MSG_SERVER_ORACLE_GET_JACKPOT_LOG: 
            // case RESPONSE_CODE.MSG_SERVER_ORACLE_GET_JACKPOT_INFO: 
            // case RESPONSE_CODE.MSG_SERVER_ORACLE_SPIN: 
            // case RESPONSE_CODE.MSG_SERVER_ORACLE_PLAY_BONUS:
            // case RESPONSE_CODE.MSG_SERVER_ORACLE_PLAY_X2:
            //     if (Global.ThatTruyen) Global.ThatTruyen.responseServer(responseCode, packet);
            //     break;
            
            default:
                break;
        }
    },

  
});
module.exports = InGameLogicManager;