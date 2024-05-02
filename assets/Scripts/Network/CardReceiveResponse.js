var CardReceiveResponse = cc.Class({
  statics: {
    getIns() {
      if (this.self == null) this.self = new CardReceiveResponse();
      return this.self;
    },
  },

  reviceData(operationResponse) {
    operationResponse = JSON.parse(operationResponse);
    var data = operationResponse;
    cc.log("check operationResponse : ", operationResponse);
    let packet = data.vals;
    let resCode = ParameterCode.CodeRun;
    var codeRun = packet[resCode];
    let errorCode = data.errCode;
    let errMsg = data.errMsg;
    let gameCode = Global.getGameNameById(packet[AuthenticateParameterCode.GameCode]);
    let day = Date.now();
    let checkDate = Global.generateDate(day);
    let roomId = packet[AuthenticateParameterCode.RoomId];
    // if(codeRun != "SBI9"){
    // if(errorCode === 1 && errMsg !== null && codeRun === CODE_RUN.POKER_ADD_TURN_TIME) Global.UIManager.showCommandPopup(errMsg);
    // if(codeRun != "SBI1"){
    cc.log("!> =====> evt game tra ve : ", codeRun, " data full ", JSON.stringify(data) + " Time receive : ", checkDate);
    // }

    if (errorCode === 1 && errMsg !== null && codeRun !== "PKR4" && codeRun !== "TMN5" && codeRun !== "MAB3" && codeRun !== "SBI2") {
      Global.UIManager.hideMiniLoading();
      Global.UIManager.showCommandPopup(errMsg);
      return;
    }

    // cc.log("reviceData :" + codeRun + " |Data :" + JSON.stringify(packet));
    switch (codeRun) {

      case CODE_RUN.END_GAME_LOG:
        // let data = JSON.parse(packet)
        cc.log("check data log : ",packet )
        // cc.log("check data log : ", JSON.parse(data[37]))
      break;
      case CODE_RUN.MST_SERVER_SEND_TOAST:
        if (Global.GameView !== null) {
          Global.GameView.showNoti(packet[1]);
          Global.UIManager.hideMiniLoading();
        }
        break;

      //Game config
      case CODE_RUN.CONFIG:
      case CODE_RUN.PLAYER_INVITE_LIST:
        if (Global.MoiChoi) Global.MoiChoi.reviceData(packet);
        break;
      case CODE_RUN.PUSH_INVITE_PLAY:
        Global.UIManager.showInviteTable(packet);
        break;

      case CODE_RUN.GET_JACKPOT_INFO:
        Global.JackpotController.reviceDataJackpotCard(packet);
        break;

      case CODE_RUN.LOGIN:
      case CODE_RUN.GET_GAME_BLIND:
        cc.log("check select tabel : ", Global.SlectTable);
        if (Global.SlectTable) Global.SlectTable.handleDataListRoom(packet);
        break;
      case CODE_RUN.CONFIG_CARDS: //
        if (Global.InGameCard) Global.InGameCard.SetCardThanhCong(packet);

        break;

      case CODE_RUN.PUSH_TAKE_JACKPOT:
        if (Global.GameView) Global.GameView.takeJackpot(packet);
        break;

      case CODE_RUN.CASH_IN:
        if (Global.InGameCard) Global.InGameCard.reviceCashIn(packet);

        break;

      case CODE_RUN.GET_SPIN_GO_CONFIG:
        cc.log("chek selecy ta : ", Global.SlectTable);
        if (Global.SlectTable) {
          cc.log("chek selecy ta22 : ", Global.SlectTable);
          Global.SlectTable.handleDataBlindSpinGo(packet);
        }
        break;

      case CODE_RUN.TOURNAMENT_GET_LIST:
        if (Global.LobbyView) {
          Global.InGameCard.reviceBlind(packet, GAME_CODE.POKER);
        }
        break;

      case CODE_RUN.TOURNAMENT_SEARCH_PLAY_IN_TOUR:
        if (Global.LobbyView) {
          Global.LobbyView.unschedule(Global.LobbyView.requestDataTable);
          Global.InGameCard.reviceBlind(packet, GAME_CODE.POKER);
        }
        break;

      case CODE_RUN.TOURNAMENT_GET_INFO:
        Global.UIManager.showTournamentView(packet);
        break;

      case CODE_RUN.TOURNAMENT_CANCEL_REGISTER:
        if (Global.TournamentView) {
          Global.TournamentView.cancelRegisterTournament(packet);
        }
        break;

      case CODE_RUN.TOURNAMENT_REGISTER_TOUR:
        //{"errCode":1,"errMsg":"Thành công!","vals":{"0":0,"2":0,"3":1,"4":"Thành công!","5":"PKR61","201":1,"202":0}}
        Global.UIManager.showCommandPopup(packet[4]);
        cc.log("chay vao dang ky thanh cong : ", Global.TournamentView);
        if (Global.TournamentView) {
          cc.log("chay vao dang ky thanh cong");
          Global.TournamentView.registerSucess();
        }
        break;

      case CODE_RUN.JOIN_GAME:
        cc.log("received data join game", packet);
        if (Global.InGameCard) Global.InGameCard.reviceCantJoinGame(packet);
        break;

      //Chat

      case CODE_RUN.CHAT_EMOTION:
      case CODE_RUN.CHAT_TEXT:
      case CODE_RUN.GET_CHAT_TEXT:
      case CODE_RUN.PUSH_CHAT_EMTION:
      case CODE_RUN.PUSH_CHAT_TEXT:
        if (Global.InGameCard) Global.InGameCard.reviceChat(codeRun, packet);
        break;
      //end chat

      // TLMN
      case CODE_RUN.PUSH_EVENT_POINT_IN_ROOM:
      case CODE_RUN.TLMN_JOIN_GAME_PUSH_OTHER:
      case CODE_RUN.TLMN_FOLD_PUSH:
      case CODE_RUN.TLMN_LEAVE_TABLE_PUSH:
      case CODE_RUN.TLMN_PLAYING_CARD_PUSH:
      case CODE_RUN.TLMN_START_GAME_PUSH:
      case CODE_RUN.TLMN_START_COUNTDOWN_PUSH:
      case CODE_RUN.TLMN_READY_PUSH:
      case CODE_RUN.TLMN_ENDGAME_PUSH:
        // if (Global.TLMNView) Global.TLMNView.OnServerPush(codeRun, packet);
        cc.log("check game code va roo, id : ", gameCode, " room ", roomId);
        cc.log("check ton tai : ", Global[gameCode + roomId]);
        cc.log("cchay vao den day roi dcm mm:");
        if (Global.TienLenMN) {
          Global.TienLenMN.OnServerPush(codeRun, packet);
        }
        break;

      case CODE_RUN.TLMN_TABLE_INFO:
      case CODE_RUN.TLMN_FOLD_RESPONSE:
      case CODE_RUN.TLMN_LEAVE_TABLE_RESPONSE:
      case CODE_RUN.TLMN_PLAYING_CARD_RESPONSE:
      case CODE_RUN.TLMN_READY_RESPONSE:
        //   if (Global.TLMNView) Global.TLMNView.OnServerResponse(codeRun, packet);
        cc.log("check game code va roo, id : ", gameCode, " room ", roomId);
        cc.log("check ton tai : ", Global[gameCode + roomId]);
        if (Global.TienLenMN) {
          cc.log("cchay vao den day roi dcm mm:");
          Global.TienLenMN.OnServerResponse(codeRun, packet);
        }
        break;

      // BINH-----------------------------------
      case CODE_RUN.BINH_TABLE_INFO:
      case CODE_RUN.BINH_APPLY_CHI:
      case CODE_RUN.BINH_LEAVE_TABLE:
        if (Global.BinhView) Global.BinhView.OnServerResponse(codeRun, packet);

      case CODE_RUN.BINH_PUSH_JOIN_GAME_FOR_OTHER:
      case CODE_RUN.BINH_PUSH_START_COUNTDOWN:
      case CODE_RUN.BINH_PUSH_START_GAME:
      case CODE_RUN.BINH_PUSH_APPLY_CHI:
      case CODE_RUN.BINH_PUSH_END_GAME:
      case CODE_RUN.BINH_PUSH_LEAVE_TABLE:
        if (Global.BinhView) Global.BinhView.OnServerPush(codeRun, packet);
      //End BINh--------------------------------
      // SÂM

      // Vao ban
      case CODE_RUN.SAM_PUSH_JOIN_GAME_FOR_OTHER:
      case CODE_RUN.SAM_PUSH_READY:
      case CODE_RUN.SAM_PUSH_START_COUNTDOWN: // Dem thoi gian bat dau
      case CODE_RUN.SAM_PUSH_START_GAME: // Bat dau choi
      case CODE_RUN.SAM_PUSH_REQUEST_BAO_SAM: // Thông báo cho người chơi chọn báo sâm hay không
      case CODE_RUN.SAM_PUSH_BAO_SAM: // Khi người chơi thực hiện báo hoặc bỏ báo sâm
      case CODE_RUN.SAM_PUSH_START_PLAYING_CARD: // Xong báo sâm không ai báo thì bắt đầu chơi
      case CODE_RUN.SAM_PUSH_PLAYER_FOLD: // Nguoi choi bo luot
      case CODE_RUN.SAM_PUSH_PLAYING_CARD: // Nguoi choi danh bai
      case CODE_RUN.SAM_PUSH_LEAVE_TABLE:
      case CODE_RUN.SAM_PUSH_END_GAME:
        if (Global.SamView) Global.SamView.OnServerPush(codeRun, packet);
        break;

      case CODE_RUN.SAM_TABLE_INFO:
      case CODE_RUN.SAM_BAO_SAM:
      case CODE_RUN.SAM_PLAYER_FOLD:
      case CODE_RUN.SAM_LEAVE_TABLE:
      case CODE_RUN.SAM_PLAYING_CARD:
      case CODE_RUN.SAM_PLAYER_READY:
        if (Global.SamView) Global.SamView.OnServerResponse(codeRun, packet);
        break;

      //END SÂM--------------------------------------------------------
      //PHỎM
      case CODE_RUN.PHOM_TABLE_INFO_RESPONSE:
      case CODE_RUN.PHOM_PICK_CARD_RESPONSE:
      case CODE_RUN.PHOM_SEND_CARD_RESPONSE:
      case CODE_RUN.PHOM_PLAYING_CARD_RESPONSE:
      case CODE_RUN.PHOM_EATEN_CARD_RESPONSE:
      case CODE_RUN.PHOM_DOWN_RESPONSE:
      case CODE_RUN.PHOM_LEAVE_TABLE_RESPONSE:
        if (Global.PhomView) Global.PhomView.OnServerResponse(codeRun, packet);
        break;
      //Ba Cây
      case CODE_RUN.BCA_CASH_IN:
      case CODE_RUN.BETTING:
      case CODE_RUN.TABLE_INFO:
      case CODE_RUN.LEAVE_GAME:
        if (Global.BaCayView) Global.BaCayView.OnServerResponse(codeRun, packet);
        break;
      //Poker
      case CODE_RUN.POKER_VIEW_TABLE_INFO:
        if (Global.InGameCard) Global.InGameCard.showInfoTable(packet);
        break;
      case CODE_RUN.POKER_GET_INFO_TABLE:
      case CODE_RUN.POKER_USER_JOIN_GAME_PUSH:
      case CODE_RUN.POKER_PUSH_START_GAME:
      case CODE_RUN.POKER_PUSH_HAND_CARD:
      case CODE_RUN.POKER_PUSH_BETTING:
      case CODE_RUN.POKER_PUSH_END_ROUND:
      case CODE_RUN.POKER_PUSH_END_GAME:
      case CODE_RUN.POKER_PUSH_SHOW_HAND:
      case CODE_RUN.POKER_PUSH_WAITING_START:
      case CODE_RUN.POKER_PUSH_LEAVE_GAME:
      case CODE_RUN.POKER_PUSH_PRESS_START_GAME:
      case CODE_RUN.POKER_PUSH_OPEN_CARD:
      case CODE_RUN.POKER_PRESS_START_GAME:
      case CODE_RUN.POKER_GET_HISTORY:
      case CODE_RUN.PUSH_REGISTER_LEAVE:
      case CODE_RUN.POKER_SHOW_CENTER_CARD:
      case CODE_RUN.POKER_PUSH_DIAMOND_PRICE:
      case CODE_RUN.PUSH_ADD_TURN_TIME:
      case CODE_RUN.POKER_ADD_TURN_TIME:
      case CODE_RUN.POKER_VIEW_OTHER_HAND_CARD:
      case CODE_RUN.POKER_GET_PLAYER_INFO:
      case CODE_RUN.POKER_GET_STATUS_BUYIN:
      case CODE_RUN.POKER_PAUSE_TABLE:
      case CODE_RUN.PUSH_SELECTED_SPIN_GO_REWARD:
      case CODE_RUN.PUSH_SET_SPIN_GO_BLIND:
      case CODE_RUN.PUSH_AWARDED_SPIN_GO_REWARD:
      case CODE_RUN.PUSH_LOSER_SPIN_GO:
      case CODE_RUN.POKER_BETTING: // bettting
      case CODE_RUN.POKER_AUTO_PLAY:
      case CODE_RUN.TOURNAMENT_BREAK_TIME:
      case CODE_RUN.PUSH_NOTIFY_IN_ROOM:
      case CODE_RUN.TOURNAMENT_UPDATE_RANK_INFO:
        if (Global[gameCode + roomId] && Global[gameCode + roomId].node) {
          Global[gameCode + roomId].OnServerResponse(codeRun, packet);
          cc.log("chay dc vao day roi :", codeRun);
        }

        break;
      case CODE_RUN.POKER_LEAVE_GAME:
        let roomIdLeave = packet[AuthenticateParameterCode.RoomId];
        if (Global[gameCode + roomIdLeave] && Global[gameCode + roomIdLeave].node) Global[gameCode + roomIdLeave].OnServerResponse(codeRun, data);
        break;

      case CODE_RUN.GET_LIST_TABLE_PLAYING:
        break;

      case CODE_RUN.PUSH_CASHIN:
        if (Global.InGameCard) Global.InGameCard.reviceOtherCashIn(packet);
        break;
      case CODE_RUN.PUSH_REQUIRE_CASHIN:
        if (Global.InGameCard) Global.InGameCard.reviceInfoCashIn(packet);

        break;
      //Join
      case CODE_RUN.POKER_JOIN_GAME_PUSH:
      case CODE_RUN.TLMN_JOIN_GAME_PUSH:
      case CODE_RUN.SAM_PUSH_JOIN_GAME:
      case CODE_RUN.BINH_PUSH_JOIN_GAME:
        cc.log("======> load bundle join game ::: ");
        if (Global.InGameCard) Global.InGameCard.reviceJoinGame(packet);
        break;

      // PHỎM
      case CODE_RUN.PHOM_JOIN_GAME_PUSH:
      case CODE_RUN.PHOM_JOIN_GAME_OTHER_PUSH:
      case CODE_RUN.PHOM_EATEN_CARD_PUSH:
      case CODE_RUN.PHOM_DOWN_PUSH:
      case CODE_RUN.PHOM_ENDGAME_PUSH:
      case CODE_RUN.PHOM_LEAVE_TABLE_PUSH:
      case CODE_RUN.PHOM_PICK_CARD_PUSH:
      case CODE_RUN.PHOM_PLAYING_CARD_PUSH:
      case CODE_RUN.PHOM_REQUEST_LEAVE_TABLE_PUSH:
      case CODE_RUN.PHOM_SEND_CARDS_PUSH:
      case CODE_RUN.PHOM_START_COUNTDOWN_PUSH:
      case CODE_RUN.PHOM_START_GAME_PUSH:
        if (Global.PhomView) Global.PhomView.OnServerPush(codeRun, packet);
        break;
      // BaCay
      case CODE_RUN.PUSH_JOIN_ROOM:
      case CODE_RUN.PUSH_JOIN_ROOM_FOR_OTHER:
      case CODE_RUN.PUSH_COUNT_DOWN:
      case CODE_RUN.PUSH_START_BETTING:
      case CODE_RUN.PUSH_BETTING:
      case CODE_RUN.PUSH_DEAL_CARD:
      case CODE_RUN.PUSH_END_GAME:
      case CODE_RUN.PUSH_LEAVE_GAME:
      case CODE_RUN.PUSH_SET_MASTER:
      case CODE_RUN.BCA_PUSH_REQUIRE_CASH_IN:
      case CODE_RUN.BCA_PUSH_CASH_IN:
        if (Global.BaCayView) Global.BaCayView.OnServerPush(codeRun, packet);
        break;
      case CODE_RUN.PUSH_AUTO_JOIN:
        this.autoJoin(packet); // moi'
        break;
      default:
        break;
    }
  },

  autoJoin(data) {
    cc.log("=========> auto join : ", data);
    MainPlayerInfo.CurrentGameType = data[AuthenticateParameterCode.RoomType];
    MainPlayerInfo.CurrentGameCode = data[AuthenticateParameterCode.GameId];
    MainPlayerInfo.CurrentTableId = data[AuthenticateParameterCode.TableId];
    MainPlayerInfo.CurrentBlind = data[AuthenticateParameterCode.Blind];
    MainPlayerInfo.CurrentGameId = data[AuthenticateParameterCode.GameCode];
    MainPlayerInfo.isReconnect = true;

    if (data[AuthenticateParameterCode.Transactions]) {
      Global[gameCode + data[AuthenticateParameterCode.Transactions]].node.destroy();
    }

    if (!cc.sys.isNative || cc.sys.os == cc.sys.OS_WINDOWS) {
      if (Global.InGameCard) {
        Global.InGameCard.start();
      }
    } else {
      if (Global.UIManager.onClickOpenBigGame(Global.getGameTypeByName(MainPlayerInfo.CurrentGameCode), true)) {
        cc.log("======> dowload game ");
      } else {
        if (Global.InGameCard) {
          Global.InGameCard.start();
        }
      }
    }
  },
});
module.exports = CardReceiveResponse;
