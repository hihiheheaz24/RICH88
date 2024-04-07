var SendRequest = cc.Class({

    statics: {
        getIns() {
            if (this.self == null) this.self = new SendRequest();
            return this.self;
        }
    },

    MST_Client_Login(msg) {
        Global.NetworkManager.sendRequest(REQUEST_CODE.MST_CLIENT_LOGIN, msg);
    },

    MST_Client_Join_Room(msg) {
        Global.NetworkManager.sendRequest(REQUEST_CODE.MST_CLIENT_JOIN_ROOM, msg);
    },

    MST_Client_Send_Ping(msg) {
        Global.NetworkManager.sendRequest(REQUEST_CODE.MST_CLIENT_PING, msg);
    },

    MST_Client_Shot_Ingame(msg) {

        Global.NetworkManager.sendRequest(REQUEST_CODE.MST_CLIENT_SHOOTING, msg);
    },
    MST_Client_Shooting_Jackpot(msg) {
        Global.NetworkManager.sendRequest(REQUEST_CODE.MST_CLIENT_SHOOTING_JACKPOT, msg);
    },
    MST_Client_Fish_Collision(msg) {
        Global.NetworkManager.sendRequest(REQUEST_CODE.MST_CLIENT_FISH_COLLISION, msg);
    },
    MST_Client_LeaveRoom() {
        this.RequestMessageNoData(REQUEST_CODE.MST_CLIENT_LEAVE_ROOM);
    },

    MST_Client_Use_Item(msg) {
        Global.NetworkManager.sendRequest(REQUEST_CODE.MST_CLIENT_USING_ITEM, msg);
    },

    MST_Client_Kill_Electric_Fish(msg) {
        Global.NetworkManager.sendRequest(REQUEST_CODE.MST_CLIENT_KILL_ELECTRIC_FISH, msg);
    },

    MST_Client_Change_Gun(msg) {
        Global.NetworkManager.sendRequest(REQUEST_CODE.MST_CLIENT_CHANGE_GUN, msg);
    },

    MST_Client_Shooting_Fish_Collision_Speical_Gun(msg) {
        Global.NetworkManager.sendRequest(REQUEST_CODE.MST_CLIENT_KILL_FISH_SPECIAL_BULLET, msg);
    },

    RequestMessageNoData(RequestCode) {
        cc.log("==========> sendService No Data: ", RequestCode)
        let msg = {};
        Global.NetworkManager.sendRequest(RequestCode, msg);
    },

    MST_Client_Receive_TimeOnline_Reward() {
        this.RequestMessageNoData(REQUEST_CODE.MST_CLIENT_RECEIVE_TIMEONLINE_REWARD);
    },

    MST_Client_Get_Mission_Info() {
        cc.log("MST_CLIENT_GET_MISSION_INFO");
        this.RequestMessageNoData(REQUEST_CODE.MST_CLIENT_GET_MISSION_INFO);
    },

    MST_Client_Receive_Mission_Reward(msg) {
        Global.NetworkManager.sendRequest(REQUEST_CODE.MST_CLIENT_RECEIVE_MISSION_REWARD, msg);
    },

    MST_Client_Get_Vip_Config_Info() {
        this.RequestMessageNoData(REQUEST_CODE.MST_CLIENT_GET_VIP_CONFIG_INFO);
    },

    MST_Client_Send_Gift_Code(msg) {
        Global.NetworkManager.sendRequest(REQUEST_CODE.MST_CLIENT_GIFTCODE_CHECK_CODE, msg);
    },

    MST_Play_Daily_Bonus() {
        this.RequestMessageNoData(REQUEST_CODE.MST_CLIENT_PLAY_DAILY_SPIN);
    },

    MST_Client_Get_Daily_Spin_Info() {
        this.RequestMessageNoData(REQUEST_CODE.MST_CLIENT_GET_DAILY_SPIN_INFO);
    },

    MST_Cliet_Get_Top_Dai_Gia(msg) {
        Global.NetworkManager.sendRequest(REQUEST_CODE.MST_CLIENT_GET_TOP_DAI_GIA, msg);
    },

    MST_Client_Buy_Spin(msg) {
        Global.NetworkManager.sendRequest(REQUEST_CODE.MST_CLIENT_BUY_DAILY_SPIN, msg);
    },

    MST_Client_Read_Mail(msg) {
        Global.NetworkManager.sendRequest(REQUEST_CODE.MST_CLIENT_READ_MAIL, msg);
    },

    MST_Client_Delete_Mail(msg) {
        Global.NetworkManager.sendRequest(REQUEST_CODE.MST_CLIENT_DELETE_MAIL, msg);
    },

    MST_Client_Get_News() {
        this.RequestMessageNoData(REQUEST_CODE.MST_CLIENT_GET_NEWS);
    },

    MST_Client_Get_Event_Config_Info() {
        this.RequestMessageNoData(REQUEST_CODE.MST_CLIENT_GET_EVENT_CONFIG_INFO);
    },

    MST_Client_Top_Event(msg) {
        Global.NetworkManager.sendRequest(REQUEST_CODE.MST_CLIENT_TOP_EVENT, msg);
    },

    MST_Client_Update_PhoneNumber(msg) {
        Global.NetworkManager.sendRequest(REQUEST_CODE.MST_CLIENT_UPDATE_PHONENUMBER, msg);
    },

    MST_Client_Change_Password(msg) {
        Global.NetworkManager.sendRequest(REQUEST_CODE.MST_CLIENT_CHANGE_PASSWORD, msg);
    },

    MST_Client_Buy_Shop_Package(msg) {
        Global.NetworkManager.sendRequest(REQUEST_CODE.MST_CLIENT_BUY_SHOP_PACKAGE, msg);
    },

    MST_Client_Get_Shop_Config() {
        cc.log("MST_CLIENT_GET_SHOP_CONFIG");
        this.RequestMessageNoData(REQUEST_CODE.MST_CLIENT_GET_SHOP_CONFIG);
    },

    MST_Client_Account_History() {
        this.RequestMessageNoData(REQUEST_CODE.MST_CLIENT_ACCOUNT_HISTORY);
    },

    MST_Client_Rank_Take_Jackpot() {
        cc.log("chay vao jackpotttt")
        this.RequestMessageNoData(REQUEST_CODE.MST_CLIENT_RANK_TAKE_JACKPOT);
    },

    MST_Client_Top_Rank_Take_Jackpot() {
        cc.log("chay vao jackpotttt top")
        this.RequestMessageNoData(REQUEST_CODE.MST_CLIENT_RANK_TOP_TAKE_JACKPOT);
    },

    MST_Client_Telco_CashOut(msg) {
        cc.log("MST_Client_Telco_CashOut");
        cc.log(msg);
        Global.NetworkManager.sendRequest(REQUEST_CODE.MST_CLIENT_TELCO_CASHOUT, msg);
    },

    MST_Client_Telco_CashIn(msg) {
        Global.NetworkManager.sendRequest(REQUEST_CODE.MST_CLIENT_TELCO_CASHIN, msg);
    },

    MST_Client_Get_Join_Card_Piece_Info() {
        this.RequestMessageNoData(REQUEST_CODE.MST_CLIENT_GET_JOIN_CARD_PIECES_INFO);
    },

    MST_Client_Join_Card_Piece(msg) {
        Global.NetworkManager.sendRequest(REQUEST_CODE.MST_CLIENT_JOIN_CARD_PIECES, msg);
    },

    // Tai Xiu
    MST_Client_TaiXiu_Open_Game() {
        Global.NetworkManager.sendRequest(REQUEST_CODE.MSG_CLIENT_DICE_OPEN_GAME, {});
    },

    MST_Client_TaiXiu_Close_Game() {
        Global.NetworkManager.sendRequest(REQUEST_CODE.MSG_CLIENT_DICE_CLOSE_GAME, {});
    },

    MST_Client_TaiXiu_Chat(msg) {
        Global.NetworkManager.sendRequest(REQUEST_CODE.MSG_CLIENT_DICE_CHAT, msg);
    },

    MST_Client_TaiXiu_Get_Top_Win_Lose_Chain(msg) {
        Global.NetworkManager.sendRequest(REQUEST_CODE.MSG_CLIENT_DICE_GET_TOP_WIN_LOSE_CHAIN, msg);
    },

    MST_Client_TaiXiu_Get_Transaction_Detail(msg) {
        Global.NetworkManager.sendRequest(REQUEST_CODE.MSG_CLIENT_DICE_GET_TRANSACTION_DETAIL, msg);
    },

    MST_Client_TaiXiu_Get_Game_Detail_History(msg) {
        Global.NetworkManager.sendRequest(REQUEST_CODE.MSG_CLIENT_DICE_GET_GAME_DETAIL_HISTORY, msg);
    },

    MST_Client_TaiXiu_Set_Bet(msg) {
        Global.NetworkManager.sendRequest(REQUEST_CODE.MSG_CLIENT_DICE_SET_BET, msg);
    },

    MST_Client_TaiXiu_Get_Top_Daily_Winner() {
        Global.NetworkManager.sendRequest(REQUEST_CODE.MSG_CLIENT_DICE_GET_TOP_DAILY_WINNER, {});
    },

    //lode

    MST_Client_LoDe_Open_Game() {
        Global.NetworkManager.sendRequest(REQUEST_CODE.MSG_CLIENT_OPEN_GAME_XSMB, {});
    },

    MST_Client_LoDe_Betting_Game(msg) {
        Global.NetworkManager.sendRequest(REQUEST_CODE.MSG_CLIENT_BETTING, msg);
    },

    MST_Client_LoDe_Get_History_Game(msg) {
        Global.NetworkManager.sendRequest(REQUEST_CODE.MSG_CLIENT_GET_HISTORY, msg);
    },

    MST_Client_LoDe_Get_Daily_Result(msg) {
        Global.NetworkManager.sendRequest(REQUEST_CODE.MSG_CLIENT_GET_DAILY_RESULT, msg);
    },

    MST_Client_LoDe_Get_Chat_List() {
        this.RequestMessageNoData(REQUEST_CODE.MSG_CLIENT_GET_CHAT_LIST);
    },

    MST_Client_LoDe_Chatting(msg) {
        Global.NetworkManager.sendRequest(REQUEST_CODE.MSG_CLIENT_CHATTING, msg);
    },


    // Slot
    MST_Client_Slot_Get_Account_Info(msg) {
        Global.NetworkManager.sendRequest(REQUEST_CODE.MST_CLIENT_SLOT_GET_ACCOUNT_INFO, msg);
    },

    MST_Client_Slot_Spin(msg) {
        cc.log("nhay vao send slot " + JSON.stringify(msg));
        Global.NetworkManager.sendRequest(REQUEST_CODE.MST_CLIENT_SLOT_SPIN, msg);
    },

    MST_Client_Slot_Get_Top_Jackpot(msg) {
        Global.NetworkManager.sendRequest(REQUEST_CODE.MST_CLIENT_SLOT_GET_TOP_JACKPOT, msg);
    },

    MST_Client_Slot_Get_Accumulate(msg){
        Global.NetworkManager.sendRequest(REQUEST_CODE.MST_CLIENT_SLOT_MACHINE_GET_ACCUMULATE, msg);
    },

    MST_Client_Slot_Set_Data(msg) {
        Global.NetworkManager.sendRequest(REQUEST_CODE.MST_CLIENT_SLOT_SET_DATA, msg);
    },

    MST_Client_Slot_Play_Bonus(msg) {
        Global.NetworkManager.sendRequest(REQUEST_CODE.MST_CLIENT_SLOT_PLAY_BONUS, msg);
    },

    MST_Client_Slot_Open_Game(msg) {
        cc.log(msg);
        Global.NetworkManager.sendRequest(REQUEST_CODE.MST_CLIENT_SLOT_SELECT_GAME_TYPE, msg);
    },

    MST_Client_Slot_Get_Game_Detail_History(msg) {
        Global.NetworkManager.sendRequest(REQUEST_CODE.MST_CLIENT_SLOT_GET_DETAIL_HISTORY, msg);
    },

    MST_Client_Slot_Leave_Room() {
        Global.NetworkManager.sendRequest(REQUEST_CODE.MST_CLIENT_SLOT_LEAVE_ROOM, {});
    },

    MST_Client_Get_List_Cashout_Code() {
        Global.NetworkManager.sendRequest(REQUEST_CODE.MST_CLIENT_GET_LIST_CASHOUT_CODE, {});
    },

    MST_Client_Get_Acount_Ticket() {
        Global.NetworkManager.sendRequest(REQUEST_CODE.MST_CLIENT_GET_ACCOUNT_TICKET, {});
    },


    MST_Client_Use_Cashout_Code_Get_Card(msg) {
        Global.NetworkManager.sendRequest(REQUEST_CODE.MST_CLIENT_USE_CASHOUT_CODE_GET_CARD, msg);
    },

    MST_Client_Use_Cashout_Code_Rechange(msg) {
        Global.NetworkManager.sendRequest(REQUEST_CODE.MST_CLIENT_USE_CASHOUT_CODE_RECHANGE, msg);
    },

    MST_Client_Account_Telco_History(msg) {
        Global.NetworkManager.sendRequest(REQUEST_CODE.MST_CLIENT_ACCOUNT_TELCO_HISTORY, msg);
    },

    MST_Client_Get_Entered_Code_Info() {
        Global.NetworkManager.sendRequest(REQUEST_CODE.MST_CLIENT_GET_ENTERED_REF_CODE_INFO, {});
    },

    MST_Client_MiniPoker_Spin(msg , isSieuToc = false) {
        if(isSieuToc){
            Global.NetworkManager.sendRequest(REQUEST_CODE.MSG_CLIENT_MINIPOKER_SPIN_MULTIPLE_TIMES, msg);
        }else{
            Global.NetworkManager.sendRequest(REQUEST_CODE.MST_CLIENT_MINIPOKER_SPIN, msg);
        }
        
    },

    MST_Client_MiniPoker_Set_Data(msg) {
        Global.NetworkManager.sendRequest(REQUEST_CODE.MST_CLIENT_MINIPOKER_SET_DATA, msg);
    },

    MST_Client_MiniPoker_Get_Top_Winner() {
        this.RequestMessageNoData(REQUEST_CODE.MST_CLIENT_MINIPOKER_GET_TOP_WINNER);
    },

    MST_Client_MiniSlot_Spin(msg) {
        Global.NetworkManager.sendRequest(REQUEST_CODE.MST_CLIENT_MINISLOT_SPIN, msg);
    },

    MST_Client_MiniSlot_Get_Top_Winner() {
        this.RequestMessageNoData(REQUEST_CODE.MST_CLIENT_MINISLOT_GET_TOP_WINNER);
    },
    MST_Client_Get_Play_Spin_History() {
        this.RequestMessageNoData(REQUEST_CODE.MST_CLIENT_GET_PLAY_SPIN_HISTORY);
    },
    MST_Client_Cash_In_Banking(msg) {
        Global.NetworkManager.sendRequest(REQUEST_CODE.MST_CLIENT_GET_CHARGING_INFO, msg);
    },
 
    MST_Client_Get_Type_Very(msg){
        Global.NetworkManager.sendRequest(REQUEST_CODE.MST_CLIENT_GET_INFO_VERIFY_PHONENUMBER, msg);
    },
    MST_Client_Get_Bonus_First_Cashin(){
        this.RequestMessageNoData(REQUEST_CODE.MST_CLIENT_GET_BONUS_FIRST_CASHIN);
    },
    MST_Client_Receive_Bonus_Firsi_Cashin(msg){
        Global.NetworkManager.sendRequest(REQUEST_CODE.MST_CLIENT_RECEIVE_BONUS_FIRST_CASHIN, msg);
    },

    MST_Client_Cash_Out_To_Partner(msg){
        Global.NetworkManager.sendRequest(REQUEST_CODE.MST_CLIENT_CASHOUT_TO_PARTNER, msg);
    },

    MST_Client_Transder_Chip(msg){
        Global.NetworkManager.sendRequest(REQUEST_CODE.MST_CLIENT_TRANFER_CHIP, msg);
    },

    MST_Client_Input_Ref_Code(msg){
        Global.NetworkManager.sendRequest(REQUEST_CODE.MST_CLIENT_INPUT_REF_CODE, msg);
    },

    MST_Client_Get_Other_Player_Info(msg){
        Global.NetworkManager.sendRequest(REQUEST_CODE.MST_CLIENT_GET_OTHER_PLAYER_INFO, msg);
    },
    
    MST_Client_Get_History_Tour_Ranking(){
        this.RequestMessageNoData(REQUEST_CODE.MST_CLIENT_GET_HISTORY_TOUR_RANKING);
    },

    MST_Client_Get_Event_Info(){
        this.RequestMessageNoData(REQUEST_CODE.MST_SERVER_GET_EVENT_INFO);
    },
    /*
       require("SendRequest").getIns().MST_Client_TaiXiu_Open_Game();
    */

       //XocDia
    MST_Client_Xoc_Dia_Start_Game() {
        this.RequestMessageNoData(REQUEST_CODE.MST_CLIENT_OPEN_GAME);
    },
    MST_Client_Xoc_Dia_Betting(msg) {
        Global.NetworkManager.sendRequest(REQUEST_CODE.MST_CLIENT_BETTING, msg);
    },
    MST_Client_Xoc_Dia_Get_Chat_List() {
        this.RequestMessageNoData(REQUEST_CODE.MSG_CLIENT_GET_CHAT_LIST);
    },
    MST_Client_Xoc_Dia_Chatting() {
        this.RequestMessageNoData(REQUEST_CODE.MSG_CLIENT_CHATTING);
    },
    MST_Client_Xoc_Dia_Result_List() {
        this.RequestMessageNoData(REQUEST_CODE.MST_CLIENT_GET_RESULT_LIST);
    },
    MST_Client_Xoc_Dia_Get_History() {
        this.RequestMessageNoData(REQUEST_CODE.MST_CLIENT_GET_HISTORY);
    },
    MST_Client_Xoc_Dia_Get_Ranking() {
        this.RequestMessageNoData(REQUEST_CODE.MST_CLIENT_GET_RANKING);
    },
    MST_Client_Xoc_Dia_Get_Session_Info() {
        this.RequestMessageNoData(REQUEST_CODE.MST_CLIENT_GET_RESULT_LIST);
    },
    MST_Client_Xoc_Dia_Get_Detail_Session_Info(msg) {
        Global.NetworkManager.sendRequest(REQUEST_CODE.MST_CLIENT_DETAIL_HISTORY, msg);
    },
});
module.exports = SendRequest