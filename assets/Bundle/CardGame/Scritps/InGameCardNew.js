cc.Class({
    extends: cc.Component,
    ctor(){
        this.moneyCurrentCashIn = 0;
    },
    properties: {
        parentGame:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Global.InGameCard = this;
        this.isRequireMoney = false;
        // this.sendGetTableInfo();
    },
    onDestroy(){
        Global.InGameCard = null;
    },
    start () {
        if(MainPlayerInfo.isReconnect){
            cc.log("chay vao reconect : ")
            let msg = {};
            msg[AuthenticateParameterCode.GameId] = MainPlayerInfo.CurrentGameCode;
            msg[AuthenticateParameterCode.Blind] = MainPlayerInfo.CurrentBlind;
            msg[AuthenticateParameterCode.TableId] = MainPlayerInfo.CurrentTableId;
            require("SendCardRequest").getIns().MST_Client_Join_Game(msg);
            MainPlayerInfo.isReconnect = false;
        }

    },
   
    reviceCantJoinGame(data){
        Global.UIManager.hideMiniLoading();
        cc.log("data join la " + JSON.stringify(data))
        let error = data[ParameterCode.ErrorCode];
        if (error != 0) {
            if(data[ParameterCode.ErrorMsg]){
                Global.UIManager.showNoti(data[ParameterCode.ErrorMsg],cc.v2(298.645, 391.865));
            }
            // if(MainPlayerInfo.ingameBalance < 25000)
            //     Global.UIManager.showShopPopup("1");
        }
    },
    reviceJoinGame(data){
        Global.UIManager.hideMiniLoading();
        let gameType = "";
        let url = "";
        let componentGlobal = "";
        cc.log("check game id : ", MainPlayerInfo.CurrentGameCode)
        switch (MainPlayerInfo.CurrentGameCode) {
            case GAME_CODE.TLMN:
                url = "TLMNNew";
                componentGlobal = "TienLenMN";
                gameType = GAME_TYPE.TLMN.toString();
                break;
            case GAME_CODE.PHOM:
                url = "Phom";
                gameType = GAME_TYPE.PHOM.toString();
                break;
            case GAME_CODE.POKER:
                url = "PokerView";
                componentGlobal = "PokerView"
                gameType = GAME_TYPE.POKER.toString();
                break;
            case GAME_CODE.SAM:
                url = "SamView";
                componentGlobal = "SamView"
                gameType = GAME_TYPE.SAM.toString();
                break;
            case GAME_CODE.BINH:
                url = "BinhView";
                componentGlobal = "BinhView"
                gameType = GAME_TYPE.BINH.toString();
                break;
            default:
                console.log("loi game code")
                break;
        }
        let roomId = data[AuthenticateParameterCode.RoomId];
        Global.RoomID = roomId;
        if(Global[MainPlayerInfo.CurrentGameCode + roomId]){
            Global[MainPlayerInfo.CurrentGameCode + roomId].node.active = true;
            Global[MainPlayerInfo.CurrentGameCode + roomId].initGame(data);
            // Global.AudioManager.playInGame();
            return;
        }

        Global.UIManager.showLoading();

        // let funFinish = (component) => {
        //     cc.log("load xong prefabs " + gameType)
        //     Global.UIManager.hideLoading();
        //     cc.log("==> MainPlayerInfo.CurrentGameCode la : ", MainPlayerInfo.CurrentGameCode);
        //     cc.log("==> roomId la : ", roomId);
        //     let gameView = cc.instantiate(prefab).getComponent(componentGlobal);
        //     this.parentGame.addChild(gameView.node);
        //     Global.AudioManager.playInGame();
        //     Global[MainPlayerInfo.CurrentGameCode + roomId] = gameView;
        //     if (Global[MainPlayerInfo.CurrentGameCode + roomId]["initGame"]) Global[MainPlayerInfo.CurrentGameCode + roomId].initGame(data);
		// };
        // Global.UIManager.getBundleAndInitGame(gameType,  Global.UIManager.downloadProgress(gameType),funFinish )

        // return;
        cc.resources.load(url, cc.Prefab, (count, total) => {
            Global.UIManager.progressLoading(count / total);
        }, (err2, prefab) => {
            console.log("bat dau load prefabs " + url)
            if (err2) {
                console.log("co loi  khi load prefab : ", err2)
                return;
            }
            cc.log("load xong prefabs " + gameType)
            Global.UIManager.hideLoading();
            cc.log("==> MainPlayerInfo.CurrentGameCode la : ", MainPlayerInfo.CurrentGameCode);
            cc.log("==> roomId la : ", roomId);
            let gameView = cc.instantiate(prefab).getComponent(componentGlobal);
            this.parentGame.addChild(gameView.node);
            Global.AudioManager.playInGame();
            Global.GameView = gameView;
            Global[MainPlayerInfo.CurrentGameCode + roomId] = gameView;
            if (Global[MainPlayerInfo.CurrentGameCode + roomId]["initGame"]) Global[MainPlayerInfo.CurrentGameCode + roomId].initGame(data);
        });

    },
    
    showInfoTable(data){
        if (data[4] && data[3] === 1){
            Global.UIManager.showNoti(data[4]);
            return;
        }
        Global.UIManager.showInfoTablePopup(data);
    },
    reviceCashIn(data){
        let roomId = data[AuthenticateParameterCode.RoomId]
        if(Global[MainPlayerInfo.CurrentGameCode + roomId] && data[4])
            Global[MainPlayerInfo.CurrentGameCode + roomId].reviceCashIn(data[4]);
    },
    reviceOtherCashIn(data){
        let roomId = data[AuthenticateParameterCode.RoomId]
        let position = data[AuthenticateParameterCode.UserId];
        let cash = data[AuthenticateParameterCode.Gold];
        let gameCode = Global.getGameNameById(data[AuthenticateParameterCode.GameCode]);
        cc.log("check game view : ", Global[gameCode + roomId])
        if(Global[gameCode + roomId]){
            Global[gameCode + roomId].reviceOtherCashIn(position, cash);
        }
    },

    reviceChat(code , packet){
        let roomId = packet[AuthenticateParameterCode.RoomId]
        // if(Global.TienLenMN && Global.TienLenMN.chatController)Global.TienLenMN.chatController.reviceServer(code , packet);
        // if(Global.SamView && Global.SamView.chatController)Global.SamView.chatController.reviceServer(code , packet);
        // if(Global.BinhView && Global.BinhView.chatController)Global.BinhView.chatController.reviceServer(code , packet);
        cc.log("check game code : ", MainPlayerInfo.CurrentGameCode, " check room id : ", roomId)
        if(Global[MainPlayerInfo.CurrentGameCode + roomId] && Global[MainPlayerInfo.CurrentGameCode + roomId].chatController)Global[MainPlayerInfo.CurrentGameCode + roomId].chatController.reviceServer(code , packet);
    },


    sendGetTableInfo(event, data) {
        let roomType = parseInt(data);
        if(roomType){
            MainPlayerInfo.CurrentGameCode = GAME_CODE.POKER;
            MainPlayerInfo.CurrentGameId = Global.getGameIdByName(GAME_CODE.POKER)
            Global.PokerRoomType = roomType;
            let msg = {};
            msg[AuthenticateParameterCode.RoomType] = roomType;
            msg[AuthenticateParameterCode.RoomId] = null;
            msg[AuthenticateParameterCode.GameId] = MainPlayerInfo.CurrentGameCode;
            msg[AuthenticateParameterCode.GameCode] = MainPlayerInfo.CurrentGameCode; // NEW;
            cc.log("chay vao send info data 111 : ", msg);
            require("SendCardRequest").getIns().MST_Client_Get_Game_Blind(msg);
        }
        else{
            let msg = {};
            msg[AuthenticateParameterCode.RoomType] = 1;
            msg[AuthenticateParameterCode.RoomId] = null;
            msg[AuthenticateParameterCode.GameId] = MainPlayerInfo.CurrentGameCode;
            msg[AuthenticateParameterCode.GameCode] = MainPlayerInfo.CurrentGameCode; // NEW;
            cc.log("chay vao send info data 222: ", msg);
            require("SendCardRequest").getIns().MST_Client_Get_Game_Blind(msg);
        }
    },

    reviceInfoCashIn(data) {
        let roomId = data[AuthenticateParameterCode.RoomId]
        if (data[AuthenticateParameterCode.GameId] === CARD_GAME_CODE.POKER && Global[MainPlayerInfo.CurrentGameCode + Global.PokerIdRoom]) {
            cc.log("on the PokerView : ", data)
            Global[MainPlayerInfo.CurrentGameCode + roomId].showRequireCashIn(data);
        }
    },
    sendCashIn(){
        let msg = {};
        msg[AuthenticateParameterCode.GameId] = MainPlayerInfo.CurrentGameCode;
        msg[AuthenticateParameterCode.Gold] = this.moneyCurrentCashIn;
        require("SendCardRequest").getIns().MST_Client_Cash_In(msg);
        this.isRequireMoney = false;
    },
    
    onSetCardClicked(str, roomId) {
        console.log("chay vao sey card ...")
        // if (str.length <= 0) {
        //     return;
        // }
        
        let msg = {};
        msg[AuthenticateParameterCode.RoomId] = roomId;
        msg[AuthenticateParameterCode.GameId] = MainPlayerInfo.CurrentGameCode;
        msg[AuthenticateParameterCode.Games] = `{"Username":"tuyent321","HandCards":[],"OtherPlayerCards":[]}`;
        console.log("chay vao set card with data : ",msg);
        require("SendCardRequest").getIns().MST_Client_Set_Card_Config(msg);
    },
    SetCardThanhCong(packet){
        if(Global.TienLenMN)Global.TienLenMN.showNoti(packet[4]);
        if(Global.SamView)Global.SamView.showNoti(packet[4]);
        if(Global.BinhView)Global.BinhView.showNoti(packet[4]);
        
    },


    // update (dt) {},
});
