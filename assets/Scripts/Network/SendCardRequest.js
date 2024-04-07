var SendCardRequest = cc.Class({
    statics: {
        getIns() {
            if (this.self == null) this.self = new SendCardRequest();
            return this.self;
        }
    },
    //Global
    RequestMessageNoData(RequestCode) {
        let msg = {};
        // msg[AuthenticateParameterCode.RoomType] = 1;
        msg[AuthenticateParameterCode.RoomType] = MainPlayerInfo.CurrentGameType;
        msg[AuthenticateParameterCode.RoomId] = MainPlayerInfo.CurrentTableId;
        msg[AuthenticateParameterCode.GameCode] = MainPlayerInfo.CurrentGameId;
        Global.NetworkManager.sendCardRequest(RequestCode, msg);
    },
    RequestWithData(RequestCode, msg = {}) {
        // if(!msg[AuthenticateParameterCode.RoomType]){
        //     msg[AuthenticateParameterCode.RoomType] = 1;
        // }
        msg[AuthenticateParameterCode.RoomType] = MainPlayerInfo.CurrentGameType;
        msg[AuthenticateParameterCode.RoomId] = MainPlayerInfo.CurrentTableId;
        msg[AuthenticateParameterCode.GameCode] = MainPlayerInfo.CurrentGameId;
        Global.NetworkManager.sendCardRequest(RequestCode, msg);
    },
    MST_Client_Get_Game_Config() {
        this.RequestMessageNoData(CODE_RUN.GAME_CONFIG);
    },
    MST_Client_Get_Game_Blind(msg) {
        cc.log("c heck data la ", msg)
        this.RequestWithData(CODE_RUN.GET_GAME_BLIND, msg);
    },
    // Tournament
    MST_Client_Tournament_Get_List() {
        this.RequestMessageNoData(CODE_RUN.TOURNAMENT_GET_LIST);
    },
    MST_Client_Tournament_Get_Info(msg) {
        this.RequestWithData(CODE_RUN.TOURNAMENT_GET_INFO, msg);
    },
    MST_Client_Tournament_Register_Tour(msg) {
        this.RequestWithData(CODE_RUN.TOURNAMENT_REGISTER_TOUR, msg);
    },
    MST_Client_Tournament_Test_Tour(msg) {
        this.RequestWithData(CODE_RUN.TOURNAMENT_TEST_TOUR, msg);
    },
    //
    MST_Client_Join_Game(msg) {
        this.RequestWithData(CODE_RUN.JOIN_GAME, msg);
    },
    MST_Client_Set_Card_Config(msg) {
        this.RequestWithData(CODE_RUN.CONFIG_CARDS, msg);
    },
    MST_Client_Cash_In(msg) {
        this.RequestWithData(CODE_RUN.CASH_IN, msg);
    },
    MST_Client_Player_Invite_List() {
        this.RequestMessageNoData(CODE_RUN.PLAYER_INVITE_LIST);
    },
    MST_Client_Send_Player_Invite_List(msg) {
        this.RequestWithData(CODE_RUN.SEND_INVITE_PLAY , msg);
    },
    MST_Client_ChatEmoji(msg) {
        this.RequestWithData(CODE_RUN.CHAT_EMOTION, msg);
    },

    MST_Client_ChatText(msg) {
        this.RequestWithData(CODE_RUN.CHAT_TEXT, msg);
    },

    MST_Client_Get_History_Chat_Text() {
        this.RequestWithData(CODE_RUN.GET_CHAT_TEXT);
    },

    // TLMN
    MST_Client_TLMN_Get_Table_Info() {
        this.RequestWithData(CODE_RUN.TLMN_TABLE_INFO);
    },
    MST_Client_TLMN_Play_Card(msg) {
        this.RequestWithData(CODE_RUN.TLMN_PLAYING_CARD_REQUEST, msg);
    },
    MST_Client_TLMN_Fold() {
        this.RequestMessageNoData(CODE_RUN.TLMN_FOLD_REQUEST);
    },

    MST_Client_LeaveRoom() {
        this.RequestWithData(CODE_RUN.TLMN_LEAVE_TABLE_REQUEST);
    },

    MST_Client_TLMN_Send_Get_Log() {
        this.RequestWithData(CODE_RUN.END_GAME_LOG);
    },
    //Phỏm
    MST_Client_Phom_Get_Table_Info() {
        this.RequestMessageNoData(CODE_RUN.PHOM_TABLE_INFO_REQUEST);
    },
    MST_Client_Phom_Eated_Card() {
        this.RequestMessageNoData(CODE_RUN.PHOM_EATEN_CARD_REQUEST);
    },
    MST_Client_Phom_Down_Card() {
        this.RequestMessageNoData(CODE_RUN.PHOM_DOWN_REQUEST);
    },
    MST_Client_Phom_Send_Card() {
        this.RequestMessageNoData(CODE_RUN.PHOM_SEND_CARD_REQUEST);
    },
    MST_Client_Phom_Play_Card(msg) {
        this.RequestWithData(CODE_RUN.PHOM_PLAYING_CARD_REQUEST, msg);
    },
    MST_Client_Phom_Get_Card() {
        this.RequestMessageNoData(CODE_RUN.PHOM_PICK_CARD_REQUEST);
    },
    MST_Client_Phom_Leave_Table() {
        this.RequestMessageNoData(CODE_RUN.PHOM_LEAVE_TABLE_REQUEST);
    },

    // Ba Cây
    MST_Client_BCA_Get_Table_Info() {
        this.RequestMessageNoData(CODE_RUN.TABLE_INFO);
    },
    MST_Client_BCA_Betting(msg) {
        this.RequestWithData(CODE_RUN.BETTING, msg);
    },
    MST_Client_BCA_CashIn(msg) {
        this.RequestWithData(CODE_RUN.BCA_CASH_IN, msg);
    },
    MST_Client_BCA_Leave_Table() {
        this.RequestMessageNoData(CODE_RUN.LEAVE_GAME);
    },
    // Poker 
    MST_Client_Get_Info_Room_Poker(msg) {
        this.RequestWithData(CODE_RUN.POKER_VIEW_TABLE_INFO, msg);
    },
    MST_Client_Get_List_Table_Playing() {
        // let msg = {};
        // msg[AuthenticateParameterCode.RoomType] = Global.PokerRoomType;
        // msg[AuthenticateParameterCode.RoomId] = Global.PokerIdRoom;
        // msg[AuthenticateParameterCode.GameCode] = MainPlayerInfo.CurrentGameId;
        
        // this.RequestWithData(CODE_RUN.GET_LIST_TABLE_PLAYING, msg);
    },
    MST_Client_Get_Info_User(msg) {
        this.RequestWithData(CODE_RUN.POKER_GET_PLAYER_INFO, msg);
    },
    MST_Client_View_Oher_Hand_Card(msg) {
        this.RequestWithData(CODE_RUN.POKER_VIEW_OTHER_HAND_CARD, msg);
    },
    MST_Client_Send_Add_Time_Turn() {
        this.RequestWithData(CODE_RUN.POKER_ADD_TURN_TIME);
    },
    MST_Client_Poker_Off_Auto(msg) {
        this.RequestWithData(CODE_RUN.POKER_CANCEL_AUTO_ACTION, msg);
    },
    MST_Client_Poker_Get_Table_Info(msg) {
        this.RequestWithData(CODE_RUN.POKER_GET_INFO_TABLE, msg);
    },
    MST_Client_Poker_Show_Center_Card() {
        this.RequestWithData(CODE_RUN.POKER_SHOW_CENTER_CARD);
    },
    MST_Client_Poker_Betting(msg) {
        this.RequestWithData(CODE_RUN.POKER_BETTING, msg);
    },
    MST_Client_Poker_CashIn(msg) {
        this.RequestWithData(CODE_RUN.POKER_BUY_CASH, msg);
    },
    MST_Client_Poker_Open_Card(msg) {
        this.RequestWithData(CODE_RUN.POKER_OPEN_CARD, msg);
    },
    MST_Client_Poker_Leave_Table() {
        let msg = {}

        msg[AuthenticateParameterCode.RoomType] = Global.PokerView.roomType;
        this.RequestWithData(CODE_RUN.POKER_LEAVE_GAME, msg);
    },
    MST_Client_Poker_Start_Game(msg) {
        this.RequestWithData(CODE_RUN.POKER_PRESS_START_GAME, msg);
    },
    MST_Client_Poker_Get_History(msg) {
        this.RequestWithData(CODE_RUN.POKER_GET_HISTORY, msg);
    },
    MST_Client_Poker_Cancel_Register_Tour(tourId) {
        let msg = {};
        msg[PKR_ParameterCode.TourId] = tourId; 
        this.RequestWithData(CODE_RUN.TOURNAMENT_CANCEL_REGISTER, msg);
    },
    MST_Client_Poker_Search_Play_In_Tour(nickName) {
        let msg = {};
        msg[PKR_ParameterCode.Nickname] = nickName;    
        this.RequestWithData(CODE_RUN.TOURNAMENT_SEARCH_PLAY_IN_TOUR, msg);
    },
    MST_Client_Poker_Get_Detail_History() {
        this.RequestWithData(CODE_RUN.POKER_DETAIL_HISTORY);
    },

    MST_Client_Poker_Get_Status_Buy_In() {
        this.RequestWithData(CODE_RUN.POKER_GET_STATUS_BUYIN);
    },
     MST_Client_Poker_Push_Pause_Game(msg) { 
        this.RequestWithData(CODE_RUN.POKER_PAUSE_TABLE, msg);
    },

    MST_Client_Poker_Spin_Go_Get_Config() { 
        let msg = {};
        this.RequestWithData(CODE_RUN.GET_SPIN_GO_CONFIG, msg);
    },

    // Sâm
    MST_Client_SAM_Get_Table_Info() {
        this.RequestMessageNoData(CODE_RUN.SAM_TABLE_INFO);
    },
    MST_Client_SAM_Play_Card(msg) {
        this.RequestWithData(CODE_RUN.SAM_PLAYING_CARD, msg);
    },
    MST_Client_SAM_Fold() {
        this.RequestMessageNoData(CODE_RUN.SAM_PLAYER_FOLD);
    },

    MST_Client_SAM_LeaveRoom() {
        this.RequestMessageNoData(CODE_RUN.SAM_LEAVE_TABLE);
    },
    MST_Client_SAM_BAOSAM(msg) {
        this.RequestWithData(CODE_RUN.SAM_BAO_SAM , msg);
    },


    // Binh
    MST_Client_BINH_Get_Table_Info() {
        this.RequestMessageNoData(CODE_RUN.BINH_TABLE_INFO);
    },
    MST_Client_BINH_LeaveRoom() {
        this.RequestMessageNoData(CODE_RUN.BINH_LEAVE_TABLE);
    },
    MST_Client_BINH_Play_Card(msg) {
        this.RequestWithData(CODE_RUN.BINH_APPLY_CHI, msg);
    },

    //EndBinh
    MST_Client_Jackpot_CardGame_Info() {
        this.RequestMessageNoData(CODE_RUN.GET_JACKPOT_INFO);
    },
});
module.exports = SendCardRequest