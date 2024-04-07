var MiniGameLogicManager = cc.Class({
    statics: {
        getIns() {
            if (this.self == null) this.self = new MiniGameLogicManager();
            return this.self;
        }
    },

    MiniGameHandleResponse(operationResponse) {
        var data = operationResponse;

        let defineRe = RESPONSE_CODE.CTP_TAG;
        let packet = data.vals;
        var responseCode = packet[defineRe];

        switch (responseCode) {
            case RESPONSE_CODE.MSG_SERVER_DICE_GET_CURRENT_SESSION_INFO:
            case RESPONSE_CODE.MSG_SERVER_DICE_SET_BET:
            case RESPONSE_CODE.MSG_SERVER_DICE_GET_RESULT:
            case RESPONSE_CODE.MSG_SERVER_DICE_GET_ACCOUNT_RESULT:
            case RESPONSE_CODE.MSG_SERVER_DICE_GET_TOP_WINNER:
            case RESPONSE_CODE.MSG_SERVER_DICE_GET_BET_OF_ACCOUNT:
            case RESPONSE_CODE.MSG_SERVER_DICE_GET_CURRENT_BET_SESSION_INFO:
            case RESPONSE_CODE.MSG_SERVER_DICE_OPEN_GAME:
            case RESPONSE_CODE.MSG_SERVER_DICE_SERVER_MESSAGE:
            case RESPONSE_CODE.MSG_SERVER_DICE_GET_GAME_HISTORY:
            case RESPONSE_CODE.MSG_SERVER_DICE_CHAT:
            case RESPONSE_CODE.MSG_SERVER_DICE_CHAT_HISTORY:
            case RESPONSE_CODE.MSG_SERVER_DICE_GET_TRANSACTION_DETAIL:
            case RESPONSE_CODE.MSG_SERVER_DICE_GET_CHAIN:
                if (Global.TaiXiu !== null) {
                    Global.TaiXiu.responseServer(responseCode, packet);
                }
                break;
            case RESPONSE_CODE.MSG_SERVER_GET_LOG_TAI_XIU_IN_GAME:
                if (Global.HistoryTaiXiu != null) {
                    Global.HistoryTaiXiu.responseServer(packet);
                }
                break;
            case RESPONSE_CODE.MST_SERVER_MINISLOT_JACKPOT_INFO_NEW:
            case RESPONSE_CODE.MST_SERVER_MINISLOT_SPIN:
                if (Global.MiniSlot != null) {
                    Global.MiniSlot.responseServer(responseCode, packet);
                }
                break;
            case RESPONSE_CODE.MST_SERVER_MINISLOT_TOP_WINNER:
                if (Global.RankMiniSlot != null) {
                    Global.RankMiniSlot.responseServer(packet);
                }
                break;
            case RESPONSE_CODE.MSG_SERVER_MINIPOKER_GET_DETAILS_HISTORY:
            case RESPONSE_CODE.MST_SERVER_MINIPOKER_JACKPOT_INFO_NEW:
            case RESPONSE_CODE.MST_SERVER_MINIPOKER_SPIN:
            case RESPONSE_CODE.MST_SERVER_MINIPOKER_TOP_WINNER:
            case RESPONSE_CODE.MST_SERVER_MINIPOKER_SPIN_MULTI_TIMES:

                if (Global.MiniPoker != null) {
                    Global.MiniPoker.responseServer(responseCode, packet);
                }
                break;

            case RESPONSE_CODE.MSG_SERVER_OPEN_GAME:
            case RESPONSE_CODE.MSG_SERVER_BETTING_RESPONSE:
            case RESPONSE_CODE.MSG_SERVER_GET_HISTORY_RESPONSE:
            case RESPONSE_CODE.MSG_SERVER_GET_DAILY_RESULT_RESPONSE:
            case RESPONSE_CODE.MSG_SERVER_PUSH_RESULT:
            case RESPONSE_CODE.MSG_SERVER_GET_CHAT_LIST_RESPONSE:
            // case RESPONSE_CODE.MSG_SERVER_PUSH_PLAYER_CHATTING:
                if (Global.LoDe) {
                    Global.LoDe.responseServer(responseCode, packet)
                }
                break;

            case RESPONSE_CODE.MST_SERVER_OPEN_GAME_RESPONSE:
            case RESPONSE_CODE.MST_SERVER_BETTING_RESPONSE:
            case RESPONSE_CODE.MST_SERVER_PUSH_START_SESSION:
            case RESPONSE_CODE.MST_SERVER_PUSH_END_BETTING:
            case RESPONSE_CODE.MST_SERVER_PUSH_BETTING_RESULT:
            case RESPONSE_CODE.MSG_SERVER_PUSH_PLAYER_CHATTING:
            case RESPONSE_CODE.MSG_SERVER_GET_CHAT_LIST_RESPONSE_XOC_DIA:
            case RESPONSE_CODE.MST_SERVER_GET_RESULT_LIST_RESPONSE:
            case RESPONSE_CODE.MST_SERVER_PUSH_BETTING_INFO:
            case RESPONSE_CODE.MST_SERVER_PUSH_PLAYER_LIST:
            case RESPONSE_CODE.MST_SERVER_GET_HISTORY_RESPONSE:
            case RESPONSE_CODE.MST_SERVER_GET_RANKING_RESPONSE:
            case RESPONSE_CODE.MST_SERVER_DETAIL_HISTORY_RESPONSE:
                if (Global.XocDia) {
                    Global.XocDia.responseServer(responseCode, packet)
                }
                break;

            default:
                break;
        }
    },
});
module.exports = MiniGameLogicManager;