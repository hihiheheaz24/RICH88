// const { time } = require("node:console");

cc.Class({
    extends: require("GameView"),

    ctor() {
        this.isTest = false;


        this.players = [null,null,null,null];
        this.isMe = null;
        this.stateTable = 0;
        this.turnTime = 0;
        this.isNeedResetGame = true;
        this.timeTest = 0;
        this.time_enter_background = 0;
        this.toiTrang = false;
    },

    properties: {
        historyPrefab : cc.Prefab,
        pool:require("PoolControllerTLMN"),
        cardController:require("CardControllerTLMN"),
       chatController:require("ChatController"),

        chatPrefab:cc.Prefab,

        listPos:[cc.Vec2],
        lbTableId : cc.Label,
        parentPlayer:cc.Node,
        parentChip:cc.Node,
        lbNoti:cc.Label,
        lbTimeCountDown:cc.Label,
        iconForceFold:cc.Node,
        nodeBtnXepBai:cc.Node,
        nodeBtnPlay:cc.Node,
        nodeBtnFoldCard:cc.Node,

        edbCardTest:cc.EditBox,
        mask : cc.Sprite,
        playerIsMe : cc.Node,
        nodeRankEvent : cc.Node,
        listItemEventRanking : [cc.Node],
        lbTimeEvent : cc.Label,
        btnEventSanHeo : cc.Node,
        lbSession : cc.Label,
        btnLeague : cc.Node,
        levelWifi : cc.Sprite,
        listLeveWifi : [cc.SpriteFrame],
        nodeQuickPlay : cc.Node,
        bgSpin : require("RandomReward"),
        ani3Bich: cc.Node,
        aniThoi3Bich : cc.Node
    },

    onLoad() {
        cc.systemEvent.on('playerDestroyed', function () {
            // Ngưng gọi đến node hoặc thực hiện các bước khác cần thiết
        });
        this.bgSpin.node.active = false;
        let orginPos = null;
        orginPos = cc.v2(0, 0)
        this.nodeQuickPlay.on(cc.Node.EventType.TOUCH_START, (touch) => {    

        })
        this.nodeQuickPlay.on(cc.Node.EventType.TOUCH_MOVE, (touch) => {
            this.isTouchMove = true;
            let delta = touch.getDelta();
            orginPos.x += delta.x;
            orginPos.y += delta.y;
            cc.log("check actin : ", this.nodeBtnPlay.active)
            if (this.nodeBtnPlay.active && !Global.isSendDanhBai) {
                if (Math.sqrt(Math.pow(this.node.y - orginPos.y, 2)) >= 80) {
                        cc.log("check list card select la : ", this.isMe.getListIdCardSlect().length)
                        cc.log("check list card select la : ", this.isMe.listCardCurrentSlect.length)
                        if(this.isMe.getListIdCardSlect().length > 0){
                            this.onClickDanhBai();
                        }
                        else{
                            this.onClickQuickPlay();
                        }
                        Global.isSendDanhBai = true;  
                }
            }
        })

        this.nodeQuickPlay.on(cc.Node.EventType.TOUCH_END, (touch) => {
            cc.log("chay vao touch end ")
            orginPos = cc.v2(0, 0);
            if(this.isMe)
                this.isMe.boChonAllCard();
        })

        if(cc.sys.os !== cc.sys.OS_ANDROID || CONFIG.VERSION !== "2.0.0"){
            this.levelWifi.node.active = false;
        }
        
        this.historyPopup = cc.instantiate(this.historyPrefab).getComponent("HistoryTLMN");
        this.node.addChild(this.historyPopup.node);
        this.historyPopup.node.active = false

        if(Global.LeagueData){
            this.btnLeague.active = true;
        }
        else{
            this.btnLeague.active = false;
        }
        if(!Global.EventSanHeo){
            this.btnEventSanHeo.active = false;
        }
        else{
            this.btnEventSanHeo.active = true
        }
        
        for (let i = 0; i < this.listPos.length; i++) {
            const objPos = this.listPos[i];
            objPos.y *= (cc.winSize.height / 1920);
        }
        this._super();
        Global.TienLenMN = this;
        if(this.isTest){
            this.node.active = true;
            this.node.position = cc.v2(640 , 360);
        }
        this.agTable = 0;
        this.listValue = [];
        this.listDataChip = [];
        this.node.setContentSize(cc.winSize);
        this.nodeBtnXepBai.active = false;
        this.nodeBtnPlay.active = false;
        this.chatController.initCardView(this);
        this.listEvtTest = [];
        this.listEvtTest.push(`{"0":0,"2":0,"3":0,"5":"TMN4","10":100,"11":3,"12":[{"Position":0,"NickName":"lvd2003","Cash":0,"AccountId":1038,"HandCards":[],"NumberOfCards":0,"IsReady":false}],"37":0,"38":0,"40":[],"43":20,"44":0}`) ;
        this.listEvtTest.push(`{"0":0,"2":0,"3":0,"4":"","5":"SBI4","15":0,"16":20000,"18":"TMN","35":20000}`) ;
        this.listEvtTest.push(`{"0":1,"2":0,"5":"TMN3","28":"Player1039","30":0,"34":2,"46":1039}`) ;
        this.listEvtTest.push(`{"0":1,"2":0,"5":"SBI12","13":2,"16":20000,"18":"TMN"}`);
        this.listEvtTest.push(`{"0":1,"2":0,"5":"TMN9","43":5}`);
        this.listEvtTest.push(`{"0":1,"2":0,"5":"TMN10","12":[{"Position":0,"NickName":"lvd2003","Cash":20000,"AccountId":0,"HandCards":[30,50,71,72,73,81,83,90,100,102,103,122,130],"NumberOfCards":13,"IsReady":false},{"Position":2,"NickName":"Player1039","Cash":20000,"AccountId":0,"HandCards":[],"NumberOfCards":13,"IsReady":false}],"14":0}`);
        this.listEvtTest.push(`{"0":1,"2":0,"5":"TMN13","27":[{"Position":0,"NickName":"lvd2003","WinType":4,"WinLoseCash":-200,"Cash":19800,"HandCards":[83,130]},{"Position":2,"NickName":"Player1039","WinType":1,"WinLoseCash":196,"Cash":20196,"HandCards":[]}]}`);
        this.listEvtTest.push(`{"0":1,"2":0,"5":"TMN6","24":false,"30":50041312,"32":"","34":2,"44":-1}`);
        this.indexClick  = 0;

        // if(MainPlayerInfo.nickName == "anhtrongbn99" || MainPlayerInfo.nickName == "anhtrongbn992"){
        //     let node = cc.find("NodeTestCard" , this.node);
        //     if(node) node.active = true;
        // }
    },

    onEventShow(time_out_bg){
        cc.log("chay vao event show nay TLMN");
        if(time_out_bg > 0){
            this.resetWithLeaveGame();
            MainPlayerInfo.CurrentTableId = this.tableId;
            require("SendCardRequest").getIns().MST_Client_TLMN_Get_Table_Info();
            for (let i = 0; i < Global.InGameCard.parentGame.children.length; i++) {
                const gameItem = Global.InGameCard.parentGame.children[i];
                gameItem.active = false;
            }
        }
    },

    onClickTest(){
        this.cardController.showCardWinWhite( 8, [22, 30,41,52,62,73,80,91,100, 111, 122,133,142], this.isMe);
        return;
        cc.log("str data: " + this.listEvtTest[this.indexClick]);
        let obj = JSON.parse(this.listEvtTest[this.indexClick]) ;
        this.OnServerResponse(obj[5] , obj);
        this.OnServerPush(obj[5] , obj);
        this.indexClick++;
    },
    onDestroy() {
        cc.Tween.stopAllByTarget(this.node);
        this._super();
        Global.TienLenMN = null;
        Global[MainPlayerInfo.CurrentGameCode + this.tableId] = null;
    },
    
    initGame(data){
        this.mePosition = data[TMN_ParameterCode.Position];
        this.tableId = data[TMN_ParameterCode.TableId];
        MainPlayerInfo.CurrentTableId = this.tableId;
        require("SendCardRequest").getIns().MST_Client_TLMN_Get_Table_Info();
    },
    OnServerResponse(code, packet) {
        cc.log("chay vao serer tra ve")
        switch (code) {   
            case CODE_RUN.TLMN_TABLE_INFO:
                cc.log("chay duoc vao den day sao ko ra init table z")
                this.initTable(packet);
                break;
            case CODE_RUN.TLMN_FOLD_RESPONSE:
                if (packet[ParameterCode.ErrorCode] != 0) {
                    this.showNoti(packet[ParameterCode.ErrorMsg])
                } 
                break;
            case CODE_RUN.TLMN_LEAVE_TABLE_RESPONSE:
                this.reviceDangKyThoat(packet);
                break;
            case CODE_RUN.TLMN_PLAYING_CARD_RESPONSE:
                if ( packet[ParameterCode.ErrorCode] != 0) {
                    this.showNoti(packet[ParameterCode.ErrorMsg]);
                    Global.isSendDanhBai = false;
                }
                break;
            case CODE_RUN.TLMN_READY_RESPONSE:

                break;

            default:
                break;
        }
    },
    OnServerPush(code, packet) {  // chỗ này là server tự động bắn về
       cc.log("TLMN push : === Code===" + code + "====Packet===" + JSON.stringify(packet));
        switch (code) {

            case CODE_RUN.TLMN_JOIN_GAME_PUSH_OTHER:
                this.otherJoinTable(packet);
                break;
            case CODE_RUN.TLMN_FOLD_PUSH:
                this.playerBoLuot(packet);
                break;
            case CODE_RUN.TLMN_LEAVE_TABLE_PUSH:
                this.otherLeaveTable(packet);
                break;
            case CODE_RUN.TLMN_PLAYING_CARD_PUSH:
                this.danhBai(packet);
                Global.isSendDanhBai = false;
                break;
            case CODE_RUN.TLMN_START_GAME_PUSH:
                this.startGame(packet);
                break;
            case CODE_RUN.TLMN_START_COUNTDOWN_PUSH:
                this.countDownStartGame(packet);
                break;
            case CODE_RUN.TLMN_READY_PUSH:
                break;
            case CODE_RUN.TLMN_ENDGAME_PUSH:
                this.endGame(packet);
                break;
            case CODE_RUN.PUSH_EVENT_POINT_IN_ROOM:
               cc.log("check data point la : ", packet[13].length)
                let listIdPlayer = packet[13]
                let listPointPlayer = packet[44];
                for (let i = 0; i < listIdPlayer.length; i++) {
                    const idPlayer = listIdPlayer[i];
                    cc.log("check id la : ", idPlayer)
                    let player = this.getPlayerWithId(idPlayer);
                    cc.log("check player la : ", player)
                    if(player){
                        cc.log("check id pojt la : ", listPointPlayer[i])
                        player.setPoint(listPointPlayer[i])
                    }
                    
                }
                break;

            default:
                break;
        }
    },
    checkActiveBtnPlay(){
        if( this.isMe.getListIdCardSlect().length > 0){
            this.nodeBtnPlay.children[0].getComponent(cc.Button).interactable = true;
        }else{
            this.nodeBtnPlay.children[0].getComponent(cc.Button).interactable = false;
        }
    },

    getPlayerWithName(namePlayer){
        for (let i = 0; i < this.players.length; i++) {
            const player = this.players[i];
            if(player){
                if(player.fullName === namePlayer) return player;
            }        
        }
        return null;
    },

    startGame(data){
        this.lbSession.string = "ID ván đánh: " + data[37];
        this.updatePositionPlayers();
        this.parentBtnInvite.active = false;
        this.mask.node.active = false;
        this.unschedule(this.funScheduleCountDown);
        this.lbTimeCountDown.node.parent.active = false;
        this.stateTable = StateTable.Playing;
        
        let posCurrentPlayer = data[TMN_ParameterCode.CurrentPlayer];
        let playerCurrent = this.getPlayerWithPosition(posCurrentPlayer);

        this.cardController.effectChiaBai(data, playerCurrent);
        playerCurrent.isFrirtTurn = true;
        this.nodeBtnPlay.active = false;
        this.nodeBtnFoldCard.active = true;
        ///

        Global.onPopOn(this.bgSpin.node);
        let listNamePlayer = [];
        for (let i = 0; i < this.players.length; i++) {
            const player = this.players[i];
            if(player){
                listNamePlayer.push(player._nameUser);
            }
        }
   
        this.bgSpin.randomRewardItem(listNamePlayer);
        this.bgSpin.runItemReward();
        this.unschedule(this.funScheduleReward);
        let index = 0;
        this.unschedule(this.funScheduleReward);
        this.schedule(this.funScheduleReward = () => {
            this.bgSpin.randomRewardItem(listNamePlayer);
            this.bgSpin.runItemReward();
            if (index == 10) {
                this.bgSpin.setItemReward(playerCurrent._nameUser);
                this.bgSpin.runItemReward();
                this.unschedule(this.funScheduleReward);
                setTimeout(() => {
                    Global.onPopOff(this.bgSpin.node);
                },1000);
            }
            index++;
        }, 0.15);
    },
    onClickMoiChoi(){
        Global.UIManager.showInviteList();
    },
    endGame(data) {
        cc.log("chay vao end game: ", data);
        if(this.isMe._isPlaying){
            let dataOld = localStorage.getItem("dataEndGame");
            if(dataOld){
                dataOld = JSON.parse(dataOld);
            } 
            else{
                dataOld = [];
            }
            data.date = Date.now();
            data.session = this.lbSession.string;
            data.infoTable = this.lbTableId.string
            dataOld.unshift(data);
         
            localStorage.setItem("dataEndGame", JSON.stringify(dataOld));
    
            cc.log("check list data ened game : ", localStorage.getItem("dataEndGame"))
    
        }
       
        this.nodeBtnPlay.active = false;
        this.nodeBtnXepBai.active = false;
        let result = data[TMN_ParameterCode.ResultPlayers];

        let listPlayerLost = [];
        let playerWin = null;
        let playerToiTrang = null;
        var timeToiTrang = 0;
        let checkToiTrang = false;

        this.isNeedResetGame = true;
        this.stateTable = StateTable.Endgame; 

        cc.log("endgame 1 : action_check_win_white ")
        for (let i = 0; i < result.length; i++) {
            result[i] = JSON.parse(result[i])
            let posPlayer = result[i].Position;
            let player = this.getPlayerWithPosition(posPlayer);
            let winType = result[i].WinType;
            if (player) {
                player.resetNewturn();
                player.winType = winType;
            }

            if (result[i].WinType == WinType.WinWhite) {
                // chỗ này check xem có player nào tới trắng không ??
                checkToiTrang = true;
                this.toiTrang = true;
            }
        }

        let action_clear_card_in_table = () => {
            cc.log("endgame 2 : action_clear_card_in_table ")
            this.cardController.xuLyCardEndGame();
        }

        let action_show_card_user = () => {
            cc.log("endgame 3 : action_show_card_user ", result)
            this.cardController.latBai(result);
        }

        let action_showwin = () => {
            cc.log("endgame 4 : action_showwin ")
            for (let i = 0; i < result.length; i++) {   
                let posPlayer = result[i].Position;
                let player = this.getPlayerWithPosition(posPlayer);
                if (player == null) continue;
                cc.log("chay vao show anim win lose : ", result)
                let winType = result[i].WinType;
                if (result[i].WinLoseCash  > 0) {
                    playerWin = player;
                    player._chipWin = result[i].WinLoseCash;
                    if (player == this.isMe) Global.AudioManager.playWin();
                } else if (result[i].WinLoseCash  < 0) { // thua thi mat tien luon
                    listPlayerLost.push(player);
                    player._chipLose = result[i].WinLoseCash;
                    if (player == this.isMe) Global.AudioManager.playLose();
                    this.creatChipPlayer(player, result[i].WinLoseCash);
                    
                }
                player._gold = result[i].Cash; 
                player.endTurn();
                if (winType !== WinType.WinWhite) {
                    player.showTypeWin();
                }
            }
        }

        let action_show_toi_Trang = () =>{
            for (let i = 0; i < result.length; i++) {   
                let posPlayer = result[i].Position;
                let player = this.getPlayerWithPosition(posPlayer);
                if (player == null) continue;
                let winType = result[i].WinType;
                player.endTurn();
                if (winType == WinType.WinWhite) {
                    // Nếu có player tới trắng thì show card ở đây
                    cc.log("check hand card : ", result[i].HandCards)
                    this.cardController.showCardWinWhite(result[i].ToiTrangType, result[i].HandCards, player)
                }
                
            }
        }

        let action_show_gold_label = () => {
            for (let i = 0; i < result.length; i++) {   
                let posPlayer = result[i].Position;
                let player = this.getPlayerWithPosition(posPlayer);
                if (player == null) continue;
                let winType = result[i].WinType;
                player.hideWinLose();
                player.changeMoneyEndGame(result[i].WinLoseCash);
            }
        };

        let action_effect_chip_win_lose = () => {
            cc.log("endgame 5 : action_effect_chip_win_lose ")
            this.scheduleOnce(()=>{
                if(playerWin){
                    playerWin.gold = playerWin._gold;
                }          
            }, 1)
           
            for (let i = 0, l = listPlayerLost.length; i < l; i++) {
                cc.log("chay vao tru tien player lose")
                let playerLose = listPlayerLost[i];
                this.chipMovePlayerToPlayerWin(listPlayerLost[i], playerWin);
                playerLose.gold = playerLose._gold;
            }

            
            // cc.log("check list quest : ", Global.QuestPopup.listDataQuest)
            // Global.QuestPopup.checkListQuest(Global.QuestPopup.listDataQuest);
        }

        let action_clear_table_end_game = () => {
            cc.log("endgame 6 : action_clear_table_end_game ")

            this.resetForNewGame();
            this.parentBtnInvite.active = true;
            this.isNeedResetGame = false;
            this.mask.node.active = false;
        }

        
        // Xu ly cse toi trang
        cc.log("check vao toi trang : ", checkToiTrang)
        if(checkToiTrang){
            cc.log("chay vao toi trang : ")
            cc.tween(this.node)
            .call(action_show_toi_Trang)
            .delay(3)
            .call(action_showwin)
            .delay(3)
            .call(action_show_card_user)
            .delay(1)
            .call(action_show_gold_label)
            .delay(1)
            .call(action_effect_chip_win_lose)
            .delay(2)
            .call(action_clear_table_end_game)

            .start()

            return;
        }

        //


        cc.tween(this.node)
        .delay(2)
        .call(action_clear_card_in_table)
        .call(action_show_card_user)
        .delay(2)
        .call(action_showwin)
        .delay(1.5)
        .call(action_show_gold_label)
        .delay(1.5)
        .call(action_effect_chip_win_lose)
        .delay(3)
        .call(action_clear_table_end_game)
        .start()
    },
    
    danhBai(data){
        let cardPlayerds = data[TMN_ParameterCode.Cards];
        let positionPlay = data[TMN_ParameterCode.Position];
        let nextPosition = data[TMN_ParameterCode.NextPosition];
        let totalCashEarn = data[TMN_ParameterCode.TotalCashEarn];
        let posPlayerPay = data[TMN_ParameterCode.PlayerPay];
        let newRound = data[TMN_ParameterCode.NewRound];
        let numberOfCards = data[TMN_ParameterCode.NumberOfCards];
        let isEndGame = data[17];

        let playerAtack = this.getPlayerWithPosition(positionPlay);
        cc.log("list players ingame : ", this.players);
        playerAtack.endTurn();

        let playerTurn = this.getPlayerWithPosition(nextPosition);
         if(playerTurn && !isEndGame) playerTurn.setTurn(this.turnTime);
         if(playerAtack == this.isMe){
            this.cardController.getCardTheoBo();
         } 

        if(playerTurn == this.isMe){
            this.isMe.listCardQuickPlay = [];
            this.cardController.checkTypeCardAn(cardPlayerds);
            this.cardController.getCardQuickPlay(playerTurn, cardPlayerds);
            if(isEndGame){
                this.nodeBtnPlay.active = false;
            }
            else
                {
                this.nodeBtnPlay.active = true;
            }
            
            this.checkActiveBtnPlay();
            this.nodeBtnFoldCard.active =true;
        }else{
            this.nodeBtnPlay.active = false;
        }
         if(totalCashEarn > 0){
            playerAtack.changeMoney(totalCashEarn);
            let playerPay = this.getPlayerWithPosition(posPlayerPay);
            playerPay.changeMoney(-totalCashEarn);
         }
         this.cardController.danhBai(playerAtack , cardPlayerds);
    },

    reviceCashIn(money){
        if(this.isMe)this.isMe.gold = money;
    },
    otherJoinTable(data){
        let dataTemp = {};
        dataTemp.AccountId = data[TMN_ParameterCode.AccountId];
        dataTemp.NickName = data[TMN_ParameterCode.NickName];
        dataTemp.Cash = data[TMN_ParameterCode.Cash];
        dataTemp.Position = data[TMN_ParameterCode.Position];
        dataTemp.PlayLevel = data[43];
        this.creatPlayerWithData(dataTemp);
        // this.updatePositionPlayers();
    },

    getIndexTableInPlaying(){
        for(let j = 0; this.players.length ; j++){
            if(!this.players[j]){
                return j;
            }
        }
        return -1;
    },

    reviceOtherCashIn(index , money){
        let player = this.getPlayerWithPosition(index);
        if(!player) return;
        cc.log("tlmn chay vao update gold : ", money)
        player.gold = money;
    },
    creatPlayerWithData(data){
        let player = this.pool.getPlayer().getComponent("PlayerViewTLMN");
        if (data.AccountId == MainPlayerInfo.accountId) {
            this.isMe = player;
            player._isMe = true;
            cc.log("check is me : ", this.isMe )
        }

        if (data.Position >= 0) // hien thi viewer
            this.parentPlayer.addChild(player.node);

        if(this.players[data.Position] === null){
            this.players[data.Position] = player;
        }
        else{
            for (let i = 0; i < this.players.length; i++) {
                let itemPlayer = this.players[i];
                if(!itemPlayer){
                    data.Position = i;
                    this.players[data.Position] = player;
                }
            }
        }

        player.initPlayer(data);
        let indexpos = this.checkUsingPositon();
        player.node.position = this.listPos[indexpos]
        player.indexInTable = indexpos;

        return player;
    },

    checkUsingPositon(){
        cc.log("check list pos : ", this.listPos)
        for (let i = 0; i < this.listPos.length; i++) {
            let daconguoingoi = false;
            let itemPos = this.listPos[i];
            for (let j = 0; j < this.players.length; j++) {
                const player = this.players[j];
                if(player){
                    if(player.node.position.x === itemPos.x && player.node.position.y === itemPos.y){
                        daconguoingoi = true; 
                    }
                }
            }
            if(!daconguoingoi){
                cc.log("ket qua tra ve la posX : " + itemPos.x + " POsY : " + itemPos.y)
                return i;
            } 
        }
        return cc.v2(0, 0);
    },

    removePlayer(player) {
        if(player === this.isMe){
            cc.error("sai roi tra ve is me")
        }
        player.resetCard(this);
        for (let i = 0; i < this.players.length; i++) {
            const playerCheck = this.players[i];
            if(playerCheck){
                if(playerCheck.id === player.id){
                    cc.log("check player put : ", this.players[i])
                    this.players[i] = null;
                    player.unuse();
                    this.pool.putPlayer(player.node);
                    break;
                }
            }
        }
    },

    updatePositionPlayers(){
        let listConfigUser = [];
        let listPlayer = [];

        let index = 0;
        for(let i = 0 ; i < this.players.length ; i++){
            let player = this.players[i];     
            if(player){    
                index++;
                player.node.active = true;
                player.indexInTable = this.getIndexOf(player);
                listPlayer.push(player);
            }        
        }
        
        listPlayer.sort(function(a, b){return a.indexInTable - b.indexInTable});

        switch (listPlayer.length) {
            case 1:
                listConfigUser = [0]
                break;
            case 2:
                listConfigUser = [0, 2]
                break;
            case 3:
                listConfigUser = [0, 1, 2]
                break;
            case 4:
                listConfigUser = [0, 1, 2, 3]
                break;
        }
        cc.log("check listUser : ", listPlayer)
        for (let i = 0; i < listPlayer.length; i++) {
            let player = listPlayer[i];
            if(player){
                player.node.position = this.listPos[listConfigUser[i]];
                player.indexInTable = listConfigUser[i];
            }
        }
    },
    resetWithLeaveGame(){
        cc.log("chay vao reset leave game");
        cc.Tween.stopAllByTarget( this.cardController.node);
        this.cardController.animDealCard.node.active = false;
        this.resetForNewGame();
        this.resetPlayer();
    },
    foldEnforceEffect(){
        this.iconForceFold.active = true;
    },
    resetFoldEnforceEffect(){
        this.iconForceFold.active = false;
    },
    resetPlayer(){
        for(let i = 0 , l = this.players.length ; i<l ; i++){
            let player = this.players[i];
            if(player){
                player.node.position = cc.v2(0,0);
                player.unuse();
                this.pool.putPlayer(player.node)
            }
        }
        this.players = [null,null,null,null];
        this.isMe = null;
    },

    getPlayerWithId(id) {
        cc.log("cehck id la " , id)
        cc.log("cehck id la " , this.players)
        for(let i = 0 ; i < this.players.length; i++){
            if(!this.players[i]) continue;
            if(this.players[i].id === id) return this.players[i];
        }
    },

    getPlayerWithPosition(position) {
        return this.players[position];
    },

    getIndexOf(player) {
        return ((player.position + this.players.length - this.isMe.position) % this.players.length);

        // =====> isme = 0 =====> is Me position = 0
        // 0 => 0 *** 1 => 1 *** 2 => 2 *** 3 => 3

        // =====> isme = 1 =====>  is Me position = 1
        // 0 => 3 *** 1 => 0 *** 2 => 1 *** 3 => 2

        // =====> isme = 1 =====>  is Me position = 2
        // 0 => 2 *** 1 => 3 *** 2 => 0 *** 3 => 1

        // =====> isme = 1 =====>  is Me position = 3
        // 0 => 1 *** 1 => 2 *** 2 => 3 *** 3 => 0
    },

    playerBoLuot(data) {
        let position = data[TMN_ParameterCode.Position];
        let nextPosition = data[TMN_ParameterCode.NextPosition];
        let newRound = data[TMN_ParameterCode.NewRound];
        let playerCurrent = this.getPlayerWithPosition(position);
        playerCurrent.endTurn();
        playerCurrent.boLuot();
        this.cardController.isSuggest = true;
        let playerNext = this.getPlayerWithPosition(nextPosition);
        playerNext.setTurn(this.turnTime);
        
        if (playerNext == this.isMe) {
            playerNext.listCardQuickPlay  = [];
            this.nodeBtnPlay.active = true;
            this.checkActiveBtnPlay();
            this.nodeBtnFoldCard.active = true;
            if (newRound) {
                playerNext.isFrirtTurn = true;
                this.cardController.getCardTheoBo();
                this.nodeBtnFoldCard.active = false;

              
                cc.log("check first  suggest :  ",   playerNext.listCard[0].id)
                let arrFirstSuggest = this.cardController._cardHelper.getArrByOneCard(playerNext.listCard[0].id)
                playerNext.listCardQuickPlay = [];
                if(arrFirstSuggest.length === 0){
                    arrFirstSuggest = [playerNext.listCard[0].id]
                }
                cc.log("check first  suggest :  ", arrFirstSuggest)
                playerNext.listCardQuickPlay = arrFirstSuggest;
            } else {
                playerNext.isFrirtTurn = false;
                cc.log("check listCardTurnPlayer : ", this.cardController.listCurrentIdCard)
                this.cardController.checkTypeCardAn(this.cardController.listCurrentIdCard);
                this.cardController.getCardQuickPlay(playerNext, this.cardController.listCurrentIdCard);
            }

        }else{
            this.nodeBtnPlay.active = false;
        }
        if(newRound){
            cc.log("===> new round + litsplayer la : " , this.players)
            this.cardController.xuLiCardNewTurn();
            this.resetPlayerNewTurn();
        } 
    },
    resetPlayerNewTurn(){
        if(this.players){
            for(let i = 0 , l = this.players.length ; i < l ; i++){
                let player = this.players[i];
                if(player) player.resetNewturn();
            }
        }   
    },
    getNameChip(value) {//450
		let soDu = 0;
		let valueChip = 0;

		for (let i = this.listValue.length - 1; i >= 0; i--) {
			if (value >= this.listValue[i]) {
				valueChip = this.listValue[i];
				break;
			}
			else {
                valueChip = value;
            }
		}
		soDu = value - valueChip;
		value = soDu;
		this.listDataChip.push(valueChip);
		if (soDu > 0) {
			this.getNameChip(value);
		}
	},
    creatChipPlayer(player, value){
        this.listDataChip = [0, 0, 0, 0, 0, 0, 0];
        // this.getNameChip(Math.abs(value));
        for(let i = 0 ; i < this.listDataChip.length; i++){
            let chip = this.pool.getChip(this.listDataChip[i]);
            cc.Tween.stopAllByTarget(chip);
            player.listChip.push(chip);
            chip.position = this.listPos[player.indexInTable];
            chip.opacity = 0;
            this.parentChip.addChild(chip);
        }
    },
    chipMoveToTable(player){
        let listChip  = player.listChip;
        let timeDelay = 0;
        for(let i = 0 , l = listChip.length; i < l ; i++){
            let chip = listChip[i];
            let pos = cc.v2(Global.RandomNumber (-50 , 51) ,  Global.RandomNumber (-30 , 31)) 
            let delayCache = Global.RandomNumber(0 , 15)/400
            cc.Tween.stopAllByTarget(chip);
            cc.tween(chip)
            .delay(timeDelay)
            .to(0.15 , {position:pos})
            .start();
            timeDelay += delayCache
        }
    },

    chipMovePlayerToPlayerWin(player , playerWin){
        return;
        if(!playerWin) return;
        let listChip = player.listChip;
        let pos = this.listPos[playerWin.indexInTable];
        for(let i = 0 , l = listChip.length ; i < l ; i++){
            let chip = listChip[i];
            cc.Tween.stopAllByTarget(chip);
            let delay = 0;
            let random2 = 0;
            let random1 = Global.RandomNumber(0 , 100);


            if(random1 < 20){
                delay = 0.3 // random2 = Global.RandomNumber(0 , 15)/500;
            }else if (random1 < 50) {
                delay = 0.15;
            }else{
                delay = 0.0;
            }
            chip.opacity = 255;

            let action = cc.bezierTo(1, [cc.Vec2.lerp(cc.Vec2.ONE, chip.position, pos, 0.3).addSelf(cc.v2(150, 150)), cc.Vec2.lerp(cc.Vec2.ONE, chip.position, pos, 0.7).subSelf(cc.v2(150, 150)), pos]);

            chip.runAction(
				cc.sequence(
					cc.delayTime(0.1 * i),
					action,
					cc.callFunc(()=>{
						this.pool.putChip(chip);
					})
				)
			)
        }
        player.listChip.length = 0;
    },

    initTable(data) {
        this.node.active = true;
        this.resetWithLeaveGame();
        // if(Global.IsNewUser && MainPlayerInfo.CurrentGameCode === "TMN"){
		// 	if (Global.TodayMission) {
		// 		Global.UIManager.showCommandPopup(Global.TodayMission.MissionDescription)
		// 	}
		// 	else{
		// 		Global.UIManager.showConfirmPopup("Chưa có nhiệm vụ hiện tại")
		// 	}
		// }
        cc.log("chay vao init table")
        this.resetPlayer();
        this.lbTableId.string = "Bàn: " + this.tableId + " " + "Cược: " + Global.formatNumber(data[TMN_ParameterCode.Blind]);
        this.agTable = data[TMN_ParameterCode.Blind];
        this.listValue = [this.agTable, this.agTable * 5, this.agTable * 10, this.agTable * 20, this.agTable * 50, this.agTable * 100];
        this.stateTable = data[TMN_ParameterCode.TableState];
        this.turnTime = data[TMN_ParameterCode.TimeConfigs];
        let timeRemain = data[TMN_ParameterCode.TimeRemain];
        let nextPosition = data[TMN_ParameterCode.NextPosition];
        let dropCards = data[TMN_ParameterCode.DropCards];
        let playerInfos = data[TMN_ParameterCode.Players];
        let otherPlayers = [];
        for (let i = 0; i < playerInfos.length; i++) {
            let temp = null;
           
          if(this.isTest) {
            temp = playerInfos[i];
          }else{
            temp = JSON.parse(playerInfos[i]);
          }
            let player = this.creatPlayerWithData(temp);
            if(player === this.isMe && temp.HandCards.length > 0)
            this.nodeBtnXepBai.active = true;
        }
        this.updatePositionPlayers(); 
        if(this.stateTable ==  StateTable.Playing ||this.stateTable ==  StateTable.Endgame){
            this.setupPlayerForReconnect();
            this.cardController.creatCardInTableForReConnect(dropCards);
            let playerCurrentTurn = this.getPlayerWithPosition(nextPosition);
            if(playerCurrentTurn && this.stateTable != StateTable.Endgame) {
                playerCurrentTurn.setTurn(timeRemain);
                if(playerCurrentTurn == this.isMe){
                    this.nodeBtnPlay.active = true;
                    this.checkActiveBtnPlay();
                    this.nodeBtnFoldCard.active =true;
                }else{
                    this.nodeBtnPlay.active = false;
                }
            } 
        }
        
        else{
            this.parentBtnInvite.active = true;
        }
        if(timeRemain > 0 && this.stateTable == StateTable.Waiting){
            this.countDownTime(timeRemain);
        }

        setTimeout(() => {
            cc.log("chekc card leng ", this.isMe.listCard.length)
            let index = this.countPlayer();
            if(index === 1){
                this.chatController.showNoti("Đợi người vào chơi bạn nhé")      
            }
            else if(this.stateTable ==  StateTable.Playing && this.isMe.listCard.length === 0){
                this.chatController.showNoti("Bạn sẽ chơi ở ván sau nha")  
            }
        }, 300);
      

    },

    countPlayer(){
        let index = 0;
        for (let i = 0; i < this.players.length; i++) {
            const tempPlayer = this.players[i];
            if(tempPlayer){
                index++;
            }
        }
        return index;
    },

    reviceDangKyThoat(data){
        let error = data[ParameterCode.ErrorCode];
        let isRegisterLeave = data[AuthenticateParameterCode.Session];
        if (error == 1) {
            cc.log("check is me : ", this.isMe)
            cc.log("cehcl stsdse : ", isRegisterLeave)
            this.isMe.dangKyThoatBan(isRegisterLeave);
            if(isRegisterLeave){
                Global.GroupMenuInGameCard.sprExitRoom.spriteFrame = Global.GroupMenuInGameCard.listSprExitRoom[1]
                this.showNoti(MyLocalization.GetText("POKER_REGISTER_LEAVE"));
            }else{
                Global.GroupMenuInGameCard.sprExitRoom.spriteFrame = Global.GroupMenuInGameCard.listSprExitRoom[0]
                this.showNoti(MyLocalization.GetText("HUY_DANGKY_THOAT_BAN"))
            }
            //this.playerOnBoards[this.mePosition].ShowRegisterLeaveTable(isRegisterLeave);
        }
    },

    otherLeaveTable(data){
        cc.log("nhay vao thoat ban roi" , data);
        let position = data[TMN_ParameterCode.Position];
        let cash = data[TMN_ParameterCode.Cash];
        let player = this.getPlayerWithPosition(position);
        if(player == null) return;
        if(player === this.isMe) {
            // require("WalletController").getIns().UpdateWallet(this.isMe.gold);
            MainPlayerInfo.setMoneyUser(this.isMe.gold) ;
            MainPlayerInfo.ingameBalance = cash
            this.resetWithLeaveGame();
            this.node.destroy();
            Global.GroupMenuInGameCard.sprExitRoom.spriteFrame = Global.GroupMenuInGameCard.listSprExitRoom[0];
        }else{
            this.removePlayer(player);
        }
    },

    showNoti(content){
        let node =  this.lbNoti.node.parent;
        this.lbNoti.string = content;
        node.stopAllActions();
        node.active = true;
        node.opacity = 255;
        node.scale = 0;
        cc.Tween.stopAllByTarget(node);
        cc.tween(node)
        .to(0.15 , {scale:1} , {easing:"backOut"})
        .delay(3)
        .to(0.5 ,{opacity: 0} )
        .start();
    },  
    countDownStartGame(data){
        this.mask.node.active = false;
        this.parentBtnInvite.active = false;
        let timer = data[TMN_ParameterCode.TimeConfigs];
        if (timer) {
            this.countDownTime(timer);
        }
        if(this.isNeedResetGame){
            this.unschedule(this.funResetGame);
            this.resetForNewGame();
            this.isNeedResetGame = false;
        }   
        this.stateTable = StateTable.Waiting;
    },
    countDownTime(timer){
        this.lbTimeCountDown.node.parent.active = true;
        this.lbTimeCountDown.string = timer;
        //let funSchedule = null;
        this.unschedule(this.funScheduleCountDown);
        this.schedule( this.funScheduleCountDown = ()=>{
            timer--;
            this.lbTimeCountDown.string = timer;
            if(timer == 0){
                this.lbTimeCountDown.node.parent.active = false;
                this.parentBtnInvite.active = true;
                this.unschedule(this.funScheduleCountDown);
            }
        } , 1)
    },
    resetForNewGame(){
        this.unschedule(this.funMOneyRevice);
        this.resetPlayerNewTurn();
        this.cardController.reset();
        this.nodeBtnPlay.active= false;
        this.mask.node.active = false;
        this.toiTrang = false;
        this.removeChipAllPlayer();
        this.updatePositionPlayers();
        cc.Tween.stopAllByTarget(this.node);

    },
    removeChipAllPlayer(){
        for(let i = 0 , l = this.players.length; i < l ; i++){
            let player = this.players[i];
            if(player){
                player.listChip.length = 0;
            }
        }
        let listChiInTable = this.parentChip.children;
        for(let i = 0 , l = listChiInTable.length; i < l; i++){
            let node = listChiInTable[0];
            this.pool.putChip(node);
        }
    },
    setupPlayerForReconnect(){
        for(let i = 0 , l = this.players.length; i < l ; i++){
            let player = this.players[i];
            if(player) this.cardController.creatCardForReconnect(player)
        }
    },
    onClickShowMenu () {
        if (Global.GroupMenuInGameCard == null) {
            let item = cc.instantiate(this.groupMenuInGame).getComponent("GroupMenuInGameCard");
			this.node.addChild(item.node);
		} else {
			this.node.addChild(Global.GroupMenuInGameCard.node);
		}
    },

    onClickShowMission(){
        Global.UIManager.showQuestPopup();
    },

    onClickback(){
        if (this.state == StateTable.Playing){
            Global.UIManager.showConfirmPopup(MyLocalization.GetText("LEAVE_ROOM_NOTIFY"));
        } else {
            require("SendCardRequest").getIns().MST_Client_LeaveRoom();
        }
    },

    onClickXepBai(){
        this.cardController.sortCardMe();
    },
    onClickDanhBai(){
        let listId = this.isMe.getListIdCardSlect();
        if(listId.length  < 1 ) return;
        // let idMax = this.isMe.checkCard();
        // if(listId.length === 1 && idMax > 0){
        //     if(listId[0] !== idMax){
        //         this.showNoti("Bạn phải đánh lá bài mạnh nhất")
        //         return;
        //     }
        // }

        listId.sort((a,b)=> a-b);
        cc.log("Check list id send to server : ", listId)
        let msg = {};
        msg[TMN_ParameterCode.TableId] = listId;
        require("SendCardRequest").getIns().MST_Client_TLMN_Play_Card(msg);
        cc.log(msg);
    },

    onClickQuickPlay(){
        let listId = this.isMe.listCardQuickPlay;
        cc.log("check list quick play : ", listId)
        if(listId.length > 0){
            if(listId.length  < 1 ) return;
            let idMax = this.isMe.checkCard();
            if(listId.length === 1 && idMax > 0){
                if(listId[0] !== idMax){
                    // this.showNoti("Bạn phải đánh lá bài mạnh nhất")
                    let msg = {};
                    msg[TMN_ParameterCode.TableId] = this.isMe.listCard[this.isMe.listCard.length - 1].id;
                    require("SendCardRequest").getIns().MST_Client_TLMN_Play_Card(msg);
                    return;
                }
            }
    
            listId.sort((a,b)=> a-b);
            let msg = {};
            msg[TMN_ParameterCode.TableId] = listId;
            require("SendCardRequest").getIns().MST_Client_TLMN_Play_Card(msg);
        }
        else{
            this.onClickBoBai();
        }
    },

    onClickBoBai(){
        require("SendCardRequest").getIns().MST_Client_TLMN_Fold();
    },

    onClickConfigCard(event , data){
        // let packet = {"0":1,"2":0,"5":"SBI17","13":[1190,1070,1119],"14":["tuyent333","Player1070","lvd2007"],"15":[101331,311159,98829],"16":[2831,5659,2829],"18":"PKR","20":0,"201":1,"202":0}
        // Global.GameView.takeJackpot(packet)
        // return
        // let packet = {"1":1,"2":1572630,"3":10,"200":62};
        // require("OutGameLogicManager").getIns().HandleReceiveTimeOnlineBonus(packet);
        let edb = cc.find("NodeTestCard/editbox" , this.node).getComponent(cc.EditBox);
        Global.InGameCard.onSetCardClicked(edb.string, this.tableId);
    },

    onClickRankEvent(){
        Global.UIManager.showEventRanking(STATE_EVENT.EVENT);
        return;
        if(this.nodeRankEvent.scaleY === 1){
            cc.tween(this.nodeRankEvent)
            .to(0.3, {scaleY : 0})
            .start()
        }
        else{
            cc.tween(this.nodeRankEvent)
            .to(0.3, {scaleY : 1})
            .start()
            this.setItemMeEventRanking();
            this.setTimeEventSanHeo();
        }
       
    },

    setTimeEventSanHeo(){
        cc.log("check event san heo start: ", Global.EventSanHeo.StartDate)
        cc.log("check event san heo end: ", Global.EventSanHeo.EndDate)

        let start =  Date.now();//new Date(Global.EventSanHeo.StartDate).getTime();
        let end =  new Date(Global.EventSanHeo.EndDate).getTime();
        cc.log("check time sta,mp : ", start)
        cc.log("check time sta,mp : ", end)
        cc.log("check time sta,mp : ", end - start)
       
        this.secon = (end - start)/1000;
        cc.log("check time  this.secon : ",  this.secon)
        this.lbTimeEvent.string = Global.formatTimeBySec(this.secon);
        this.schedule(()=>{
            cc.log("check time  this.secon : ",  this.secon)
            this.lbTimeEvent.string = Global.formatTimeBySec(this.secon);
            this.secon--;
        },1)
    },

    setItemMeEventRanking(){
        let listDataRanking = [];
       
        if(Global.EventRanking){
            cc.log("check data is me : ", Global.EventRanking.dataIsMe)
            // this.itemEventRanking.getChildByName("lbPoint").getComponent(cc.Label).string = Global.EventRanking.dataIsMe.Point + " pts";
            // this.itemEventRanking.getChildByName("lbRank").getComponent(cc.Label).string = Global.EventRanking.dataIsMe.Order;

            if(Global.EventRanking.dataIsMe.Order > 0 && Global.EventRanking.dataIsMe.Order <= 50){
                //user nằm trong khoảng top 50
                if(Global.EventRanking.listDataRank[Global.EventRanking.dataIsMe.Order - 2]){
                    listDataRanking.push(Global.EventRanking.listDataRank[Global.EventRanking.dataIsMe.Order - 2]);
                }
               
                listDataRanking.push(Global.EventRanking.dataIsMe)
                if(Global.EventRanking.listDataRank[Global.EventRanking.dataIsMe.Order]){
                    listDataRanking.push(Global.EventRanking.listDataRank[Global.EventRanking.dataIsMe.Order])
                }
                
            }
            else{
                // usser nằm ngoài top 50
                listDataRanking.push(Global.EventRanking.listDataRank[Global.EventRanking.listDataRank.length - 1]);
                listDataRanking.push(Global.EventRanking.dataIsMe)
            }

            cc.log("check list rank la : ", listDataRanking)
        }

        for (let i = 0; i < this.listItemEventRanking.length; i++) {
            const itemRanking = this.listItemEventRanking[i];
            if(!listDataRanking[i]){
                itemRanking.active = false;
            }
            else{
                itemRanking.getChildByName("lbPoint").getComponent(cc.Label).string = listDataRanking[i].Point + " pts";
                itemRanking.getChildByName("lbRank").getComponent(cc.Label).string = listDataRanking[i].Order;
            }
        }
    },

    clickBtnSetting() {
		if (!Global.isLogin) {
			Global.UIManager.showCommandPopup(MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
	
		Global.UIManager.showSettingPopup();
	},

    onClickShowQuest(){
        cc.log("check show quest popup")
        Global.UIManager.showQuestPopup();
    },

    onClickShowLeague(){
        Global.UIManager.showLeaguePopup();
    },
});
