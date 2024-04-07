var CODE_RUN = {
    //Auth
    CONFIG: "COF0",
    GAME_CONFIG: "SBI8",
    PUSH_NOTIFY_IN_ROOM: "SBI8",
    LOGIN: "ATH0",
    AUTH: "ATH0",
    UPDATE_BALANCE: "ATH10",
    JOIN_GAME: "SBI2",
    GET_GAME_BLIND: "SBI1",
    GET_TRANSACTION: "ATH8",
    CONFIG_CARDS: "SBI3",
    CASH_IN: "SBI4",
    PUSH_CASHIN: "SBI12",
    PUSH_REQUIRE_CASHIN: "SBI11",
    PUSH_AUTO_JOIN: "SBI13",

    // Chat
    GET_JACKPOT_INFO:"SBI9",
    CHAT_EMOTION : "SBI5", // Chat emotion
    CHAT_TEXT : "SBI6", // Chat text
    GET_CHAT_TEXT : "SBI7", // Lay lich su chat text
    PLAYER_INVITE_LIST : "SBI10",
    PUSH_INVITE_PLAY : "SBI16",
    PUSH_TAKE_JACKPOT : "SBI17", //JACKPOT
    SEND_INVITE_PLAY : "SBI21",
    PUSH_CHAT_EMTION : "SBI14",
    PUSH_CHAT_TEXT : "SBI15",
    GET_LIST_TABLE_PLAYING : "SBI22", // Request lấy list bàn đang chơi
    PUSH_EVENT_POINT_IN_ROOM: "SBI19",
    //end===========

    // Poker
    // POKER_BUY_CASH: "PKR0",
    // ROUND_DEALER: "PKR1",
    // POKER_START_GAME: "PKR2",
    // POKER_WAITING_START_GAME: "PKR3",
    // POKER_GET_INFO_TABLE: "PKR_SBI5", //cũ
   
    // POKER_LEAVE_TABLE: "PKR_SBI6",
    // POKER_LEAVE_TABLE_PUSH: "PKR_SBI6_Push",
    // POKER_REGISTER_LEAVE_TABLE_PUSH: "PKR_SBI7",
    // POKER_CASH_IN_PUSH: "PKR11",
    // POKER_JOIN_GAME_PUSH: "PKR_SBI2", // cũ
    // POKER_USER_JOIN_GAME_PUSH: "PKR_SBI0",PKR12
    // POKER_END_GAME_PUSH: "PKR10",
    // POKER_END_ROUND_PUSH: "PKR9",
    // POKER_SHOW_HAND_PUSH: "PKR8",
    // POKER_OPEN_CARD_PUSH: "PKR6",
    // POKER_OPEN_CARD: "PKR6",
    // POKER_RAISE: "PKR5",
    // POKER_HAND_CARD_PUSH: "PKR4",

    //POKER NEW
    POKER_CANCEL_AUTO_ACTION: "PKR6",
    POKER_OPEN_CARD: "PKR3",
    POKER_BETTING: "PKR2",
    POKER_PRESS_START_GAME: "PKR5",
    POKER_GET_HISTORY: "PKR7",
    POKER_DETAIL_HISTORY: "PKR8",
    POKER_SHOW_CENTER_CARD: "PKR9",
    POKER_USER_JOIN_GAME_PUSH: "PKR12",
    POKER_GET_INFO_TABLE: "PKR0",
    POKER_JOIN_GAME_PUSH: "PKR11",
    POKER_AUTO_PLAY: "PKR13",
    POKER_PUSH_START_GAME: "PKR16",
    POKER_PUSH_HAND_CARD: "PKR18",
    POKER_PUSH_BETTING: "PKR19",
    POKER_PUSH_END_ROUND: "PKR20",
    POKER_PUSH_END_GAME: "PKR21",
    POKER_PUSH_OPEN_CARD: "PKR22",
    POKER_PUSH_SHOW_HAND: "PKR25",
    POKER_PUSH_WAITING_START: "PKR15",
    POKER_LEAVE_GAME: "PKR4",// Rời bàn
    POKER_PUSH_REGISTER_LEAVE: "PKR23",
    POKER_PUSH_LEAVE_GAME: "PKR24",
    POKER_PUSH_PRESS_START_GAME : "PKR26",
    PUSH_ADD_TURN_TIME : "PKR27",
    POKER_PUSH_DIAMOND_PRICE : "PKR28", //UPDATE GIA TRI SU DUNG KIM CUONG
    POKER_PUSH_PAUSE_GAME: "PKR29", // Su dung truong hop pause ban choi
    POKER_ADD_TURN_TIME : "PKR31", // Để thêm turn time
    POKER_VIEW_OTHER_HAND_CARD : "PKR32", // Để xem bài người khác
    POKER_GET_PLAYER_INFO : "PKR33", // lay info user
    POKER_VIEW_TABLE_INFO : "PKR34",
    POKER_GET_STATUS_BUYIN : "PKR36",
    POKER_PAUSE_TABLE: "PKR37", // Tạm dừng bàn chơi
    //spin and go
    PUSH_SELECTED_SPIN_GO_REWARD: "PKR40",
	PUSH_SET_SPIN_GO_BLIND: "PKR41",
	PUSH_AWARDED_SPIN_GO_REWARD: "PKR42",
    GET_SPIN_GO_CONFIG: "PKR50",
    PUSH_LOSER_SPIN_GO: "PKR43", // push danh sách người bị loại
    TOURNAMENT_GET_LIST: "PKR60",
    TOURNAMENT_REGISTER_TOUR: "PKR61",
    TOURNAMENT_GET_INFO: "PKR62",
    TOURNAMENT_TEST_TOUR: "PKR63",
    TOURNAMENT_BREAK_TIME: "PKR64",
    TOURNAMENT_UPDATE_RANK_INFO: "PKR65",
    TOURNAMENT_CANCEL_REGISTER: "PKR66",
    TOURNAMENT_SEARCH_PLAY_IN_TOUR: "PKR67",
    //

    // TLMN
    TLMN_TABLE_INFO: "TMN4",
    TLMN_JOIN_GAME_PUSH: "TMN1",
    TLMN_JOIN_GAME_PUSH_OTHER: "TMN3",
    TLMN_FOLD_PUSH: "TMN15",
    TLMN_ENDGAME_PUSH: "TMN13",
    TLMN_FOLD_REQUEST: "TMN14",
    TLMN_FOLD_RESPONSE: "TMN14",
    TLMN_LEAVE_TABLE_PUSH: "TMN6",
    TLMN_LEAVE_TABLE_REQUEST: "TMN5",
    TLMN_LEAVE_TABLE_RESPONSE: "TMN5",
    TLMN_PLAYING_CARD_PUSH: "TMN12",
    TLMN_PLAYING_CARD_REQUEST: "TMN11",
    TLMN_PLAYING_CARD_RESPONSE: "TMN11",
    TLMN_READY_PUSH: "TMN8",
    TLMN_READY_REQUEST: "TMN7",
    TLMN_READY_RESPONSE: "TMN7",
    TLMN_START_COUNTDOWN_PUSH: "TMN9",
    TLMN_START_GAME_PUSH: "TMN10",
    END_GAME_LOG: "TMN21",
//---------------------------

// Sâm
SAM_TABLE_INFO : "SAM1", // Lay info ban
SAM_BAO_SAM : "SAM2", // Bao Sam
SAM_PLAYER_FOLD : "SAM3", // Bo luot
SAM_LEAVE_TABLE : "SAM4", // Roi ban
SAM_PLAYING_CARD : "SAM5", // Danh bai
SAM_PLAYER_READY : "SAM6",



SAM_PUSH_JOIN_GAME : "SAM11", // Vao ban
SAM_PUSH_JOIN_GAME_FOR_OTHER : "SAM12",
SAM_PUSH_READY : "SAM13",
SAM_PUSH_START_COUNTDOWN : "SAM14", // Dem thoi gian bat dau
SAM_PUSH_START_GAME : "SAM15", // Bat dau choi
SAM_PUSH_REQUEST_BAO_SAM : "SAM16", // Thông báo cho người chơi chọn báo sâm hay không
SAM_PUSH_BAO_SAM : "SAM17", // Khi người chơi thực hiện báo hoặc bỏ báo sâm
SAM_PUSH_START_PLAYING_CARD : "SAM18", // Xong báo sâm không ai báo thì bắt đầu chơi
SAM_PUSH_PLAYER_FOLD : "SAM19", // Nguoi choi bo luot
SAM_PUSH_PLAYING_CARD : "SAM20", // Nguoi choi danh bai
SAM_PUSH_LEAVE_TABLE : "SAM21",  
SAM_PUSH_END_GAME : "SAM22", // Het van
//-----------------------------

// Binh---------------------------
   BINH_TABLE_INFO : "MAB1",
   BINH_APPLY_CHI : "MAB2", // Người chơi xếp chi
   BINH_LEAVE_TABLE : "MAB3",

   BINH_PUSH_JOIN_GAME : "MAB11",
   BINH_PUSH_JOIN_GAME_FOR_OTHER : "MAB12",
   BINH_PUSH_START_COUNTDOWN : "MAB13",
   BINH_PUSH_START_GAME : "MAB14",
   BINH_PUSH_APPLY_CHI : "MAB15",
   BINH_PUSH_END_GAME : "MAB16",
   BINH_PUSH_LEAVE_TABLE : "MAB17",
//End Game-------------------------
    // Phỏm
    PHOM_DOWN_PUSH: "PHO22",
    PHOM_DOWN_REQUEST: "PHO20",
    PHOM_DOWN_RESPONSE: "PHO20",
    PHOM_EATEN_CARD_PUSH: "PHO16",
    PHOM_EATEN_CARD_REQUEST: "PHO15",
    PHOM_EATEN_CARD_RESPONSE: "PHO15",
    PHOM_ENDGAME_PUSH: "PHO18",
    PHOM_TABLE_INFO_REQUEST: "PHO4",
    PHOM_TABLE_INFO_RESPONSE: "PHO4",
    PHOM_JOIN_GAME_PUSH: "PHO1",
    PHOM_JOIN_GAME_OTHER_PUSH: "PHO3",
    PHOM_LEAVE_TABLE_PUSH: "PHO6",
    PHOM_LEAVE_TABLE_REQUEST: "PHO5",
    PHOM_LEAVE_TABLE_RESPONSE: "PHO5",
    PHOM_PICK_CARD_PUSH: "PHO13",
    PHOM_PICK_CARD_REQUEST: "PHO14",
    PHOM_PICK_CARD_RESPONSE: "PHO14",
    PHOM_PLAYING_CARD_PUSH: "PHO12",
    PHOM_PLAYING_CARD_REQUEST: "PHO11",
    PHOM_PLAYING_CARD_RESPONSE: "PHO11",
    PHOM_SEND_CARDS_PUSH: "PHO17",
    PHOM_SEND_CARD_REQUEST: "PHO21",
    PHOM_SEND_CARD_RESPONSE: "PHO21",
    PHOM_START_COUNTDOWN_PUSH: "PHO9",
    PHOM_START_GAME_PUSH: "PHO10",
    PHOM_REQUEST_LEAVE_TABLE_PUSH: "PHO19",
    // Ba Cây
    BETTING: "BCA1",
    TABLE_INFO: "BCA2",
    LEAVE_GAME: "BCA3",
    PUSH_JOIN_ROOM: "BCA11",
    PUSH_JOIN_ROOM_FOR_OTHER: "BCA12",
    PUSH_COUNT_DOWN: "BCA13",
    PUSH_START_BETTING: "BCA14",
    PUSH_DEAL_CARD: "BCA19",
    PUSH_BETTING: "BCA15",
    PUSH_END_GAME: "BCA16",
    PUSH_LEAVE_GAME: "BCA17",
    PUSH_SET_MASTER: "BCA18",
    BCA_CASH_IN: "BCA4",
    BCA_PUSH_REQUIRE_CASH_IN: "BCA20",
    BCA_PUSH_CASH_IN: "BCA21",
}