var CARD_GAME_CODE = {
    TLMN: "TMN",
    PHOM: "PHO",
    POKER: "PKR",
    SAM: "SAM",
    BA_CAY: "BCA",
    TLMN_DL: "TDL",
    BINH: "MAB",
}

var StateFish = {
    Wating:0 ,
    Move:1,
    Stop:2,
    Ice:3
}
var StateSpin = {
    Wating:0,
    Run:1,
    CanStop:2,
    ShowEffect:3,
    Stop:4,
}

 var RewardTypeFish = {
    NONE : -1,
    INGAME_BALANCE : 0, // amount: số lượng tiền thưởng
    PIECE_CARD : 1, // amount: số lượng mảnh thẻ thưởng
    VQMM : 2, // amount: số vqmm thưởng
    LIXI : 3, // amount: số vqmm thưởng
    ITEM_INGAME : 4, // itemtype: loại item thưởng, amount: số lượng item thưởng
    CARD : 5, // itemtype: loại thẻ thưởng, amount: giá trị thẻ thưởng
    SPECIAL_BULLET : 6, // itemtype: loại súng, amount: số lần bắn
    X_REWARD_KILL_FISH : 7 // itemtype: x rate, amount: mili seconds giây sử dụng
 }   

var ParameterCode = {
    Flag: 0,
    Opcode: 1,
    SenderId: 2,
    ErrorCode: 3,
    ErrorMsg: 4,
    CodeRun: 5,
}

var CARD_ParamterCode = {
    UserInfo: 38,
    Password: 12,
    Transactions: 39,
    Message:24,
    VipType: 22,
}

var AuthenticateParameterCode = {
    Session: 10,
    Username: 11,
    Password: 12,
    UserId: 13,
    Nickname: 14,
    Cash: 15,
    Gold: 16,
    TableId: 17,
    GameId: 18,
    CurrentVip: 19,
    MaxVip: 20,
    Avatar: 21,
    VipType: 22,
    VipName: 23,
    Message: 24,
    Captcha: 25,
    FacebookId: 26,
    Fullname: 27,
    Firstname: 28,
    Lastname: 29,
    Url: 30,
    GiftCode: 31,
    Blind: 32,
    CashType: 33,
    Games: 34,
    GoldSafe: 35,
    KeyToken: 36,
    GameToken: 37,
    UserInfo: 38,
    Transactions: 39,
    PageNumber: 40,
    RowNumber: 41,
    TotalPage: 42,
    PassWord: 45,
    // NEW
    RoomType: 201,
    RoomId: 202,
    GameCode: 203,
}

var TMN_ParameterCode = {
    Blind: 10,
    TableId: 11,
    Players: 12,
    HandCard: 13,
    CurrentPlayer: 14,
    PlayerName: 15,
    Cards: 16,
    End: 17,
    NextPlayerName: 18,
    Type: 19,
    TotalCashEarn: 20,
    PlayerPay: 21,
    WinType: 22,
    ThuaCong: 23,
    NewRound: 24,
    NumberOfCards: 25,
    WinPlayers: 26,
    ResultPlayers: 27,
    NickName: 28,
    IsReady: 29,
    Cash: 30,
    LeaveType: 31,
    Message: 32,
    NextPlayerNickName: 33,
    Position: 34,
    Silver: 35,
    Avatar: 36,
    TableState: 37,
    TimeRemain: 38,
    CurrentAction: 39,
    DropCards: 40,
    CashType: 41,
    ShowPlayCard: 42,
    TimeConfigs: 43,
    NextPosition: 44,
    UserId: 45,
    AccountId: 46,
    LevelPlayer: 47,
}

var SAM_ParameterCode = {
    Blind :10,
    TableId:11,
    Players:12,
    HandCard:13,
    CurrentPlayer:14,
    PlayerName:15,
    Cards:16,
    End:17,
    NextPlayerName:18,
    Type:19,
    TotalCashEarn:20,
    PlayerPay:21,
    WinType:22,
    ThuaCong:23,
    NewRound:24,
    NumberOfCards:25,
    WinPlayers:26,
    ResultPlayers:27,
    NickName:28,
    IsReady:29,
    Cash:30,
    LeaveType:31,
    Message:32,
    NextPlayerNickName:33,
    Position:34,
    Silver:35,
    Avatar:36,
    TableState:37,
    TimeRemain:38,
    CurrentAction:39,
    DropCards:40,
    CashType:41,
    ShowPlayCard:42,
    TimeConfigs:43,
    NextPosition:44,
    UserId:45,
    AccountId:46,
    BaoSam:47
}

var BINH_ParameterCode = {
    Blind : 10,
    TableId :11,
    Players:12,
    HandCard:13,
    CurrentPlayer:14,
    PlayerName:15,
    Cards:16,
    End:17,
    NextPlayerName:18,
    Type:19,
    TotalCashEarn:20,
    PlayerPay:21,
    WinType:22,
    ThuaCong:23,
    NewRound:24,
    NumberOfCards:25,
    WinPlayers:26,
    ResultPlayers:27,
    NickName:28,
    IsReady:29,
    Cash:30,
    LeaveType:31,
    Message:32,
    NextPlayerNickName:33,
    Position:34,
    Silver:35,
    Avatar:36,
    TableState:37,
    TimeRemain:38,
    CurrentAction:39,
    DropCards:40,
    CashType:41,
    ShowPlayCard:42,
    TimeConfigs:43,
    NextPosition:44,
    UserId:45,
    AccountId:46,
    Chi1:47,
    Chi2:48,
    Chi3:49
}

var PHO_ParameterCode = {
    Blind: 10,
    TableId: 11,
    Players: 12,
    HandCard: 13,
    GameSession: 14,
    PosCurrentPlayer: 15,
    NocNumber: 16,
    Card: 17,
    NickName: 18,
    PosNextPlayer: 19,
    IsEnd: 20,
    IsNextPlayerEatable: 21,
    PhomsToLaidDown: 22,
    SortedHandCards: 23,
    WinCash: 24,
    LostCardPlayer: 25,
    EatType: 26,
    CardMoves: 27,
    Phoms: 28,
    SentCards: 29,
    Position: 30,
    Cash: 31,
    Avatar: 32,
    VipPoint: 33,
    TableState: 34,
    TimeRemain: 35,
    CashType: 36,
    CurrentPlayerNickName: 37,
    TimeConfigs: 38,
    IsGoingToLeave: 39,
    Message: 40,
    LeaveType: 41,
    CountDownTime: 42,
    IsDownPhom: 43,
    IsReplay: 44,
}

var BCA_ParameterCode = {
    Blind: 10,
    TableId: 11,
    GameSession: 12,
    Players: 13,
    HandCard: 14,
    PlayerName: 15,
    Position: 16,
    TableState: 17,
    TimeRemain: 18,
    AccountBalance: 19,
    BetValue: 20,
    TotalBet: 21,
    TimeConfigs: 22,
    AccountId: 23,
    PosBalance: 24,
    Message: 25,
}
var PKR_ParameterCode = {
    Position: 10,
    Nickname: 11,
    Avatar: 12,
    TableId: 13,
    Players: 14,
    CommuniCard: 15,
    CenterCash: 16,
    Blind: 17,
    MinCashIn: 18,
    MaxCashIn: 19,
    PosDealer: 20,
    PosPlayerNow: 21,
    RemainTime: 22,
    TurnTime: 23,
    TableState: 24,
    Gamesession: 25,
    CashType: 26,
    Silver: 27,
    Gold: 28,
    CashIn: 29,
    CardDealer: 30,
    Winners: 31,
    Cash: 32,
    NextPlayer: 33,
    PosSmallBlind: 34,
    PosBigBlind: 35,
    Cards: 36,
    RoundName: 37,
    CardsRank: 38,
    Message: 39,
    CashBet: 40,
    ActionId: 41,
    ActionName: 42,
    IsEndRound: 43,
    AccountId: 44,
    TotalCenterCash: 45,
    History: 46,
    FixedCenterCash: 47,
    TournamentList: 49,
    TourId: 50,
    NumberPlayer: 51,
    LimitBetting : 53,
    TourPlayType: 54
}
var StateTable = {
    Idle: 0,
    Waiting: 1,
    Playing: 2,
    Endgame: 3,
}

var WinType = {
    BiChan3Bich : -4,
    None: -3,
    Cong: -1,
    Win: 0, // lời tiền
    Best: 1,
    Thoi2: 2,
    Worst: 4,
    WinWhite: 5,
    Win3Bich : 6
}


var WinTypeSam =
  {
    Lose_KhongChanBai : -5,
    Lose_Sam : -4,
    Lose_BiChatSam : -3,
    Lose_Cong : -2,
    Lose : -1,
    Unknow : 0,
    Win : 1,
    Win_ChatSam : 2,
    Win_BaoSam : 3,
    ToiTrang : 4
  }

//   var WinTypeBinh =
//   {
//     Lose_SapHam:0,
//     Lose_ToiTrang : 1,
//     Lose_BinhLung :2,
//     Lose : 3,
//     None : 4,
//     Win : 5,
//     ToiTrang:6,
//     Win_SapLang:7,
//   }
  var WinTypeBinh =
  {
    Lose_SapLang:0,
    Lose_SapHam:1,
    Lose_ToiTrang:2,
    Lose_BinhLung:3,
    Lose:4,
    None:5,
    Win:6,
    Win_ToiTrang:7,
    Win_SapLang:8,
    Win_SapHam:9,
  }

  

var ETableState = {
    INNIT: 0,
    WAITING: 1,
    PLAYING: 2,
    ENDGAME: 3,
}

var ERoundState = {
    PRE_FLOP: 0,
    FLOP: 1,
    TURN: 2,
    RIVER: 3,
}

var EUserAction = {
    UNKNOW: -1,
    FOLD: 0,
    CHECK: 1,
    CALL: 2,
    RAISE: 3,
    ALLIN: 4,
}

var CardRank = {
    HIGH_CARD: 1,// Bài Cao
    ONE_PAIR: 2,// 1 đôi
    TWO_PAIR: 3,// 2 đôi
    THREE_OF_KIND: 4,// Sám cô
    STRAIGHT: 5,// Sảnh
    FLUSH: 6,// Thùng
    FULL_HOUSE: 7, // Cù lũ
    FOUR_OF_KIND: 8,// Tứ Quý
    STRAIGHT_FLUSH: 9,// Thùng phá sảnh
    ROYAL_FLUSH: 10,  // Thùng phá sảnh thượng
}

var EndOrderType = {
    U: 0,
    FIRST: 1,
    SECOND: 2,
    THIRD: 3,
    FORTH: 4,
    PUNISH_U: 5,
    LOSE_U: 6,
    U_KHAN: 7,
    NOTHING: 8,
    BURNING: 9,
    CHOT: 10,
    TAI_LUOT: 11
}
var EatType = {
    NORMAL: 0,
    CHOT: 1
}

var TLMN_EFF_NAME = {
    FOUR_OF_KIND : "tuquy",
    THREE_OF_CEASE : "3doithong",
    FOUR_OF_CEASE : "4doithong",
    FIVE_OF_CEASE : "5doithong",
    SIX_OF_CEASE : "6doithong",
}