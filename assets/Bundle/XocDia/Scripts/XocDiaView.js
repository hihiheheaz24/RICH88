cc.Class({
    extends: cc.Component,

    properties: {
        lbSession : cc.Label,
        imgTimeCountDown : cc.Sprite,
        lbName : cc.Label,
        lbChip : cc.Label,
        itemChip : cc.Prefab,
        listGateBet : [cc.Node],
        animXocDia : sp.Skeleton,
        dealer : cc.Node,
        nodeUser : cc.Node,
        fontWin : cc.Font,
        btnRebet : cc.Toggle,
        btnDouble : cc.Button,
        lbTotalPlayer : cc.Label,
        itemPlayer : cc.Prefab,
        listPositionPlayer : [cc.Vec2],
        parentPlayer : cc.Node,
        lbStatusGame : cc.Label,
        parentPopup : cc.Node,
        listChipSelectBet : [cc.Node],
        nodeSubMenu : cc.Node,
        lbTime : cc.Label,
        btnAutoRebet : cc.Toggle,
        lbChat : cc.Label,
        listChip : [cc.Toggle],
        lbSuggestAutoRebet : cc.Label,
        //Prefab
        prefabListPlayer : cc.Prefab,
        prefabGuide : cc.Prefab,
        prefabRank : cc.Prefab,
        prefabHistory : cc.Prefab,

        //session
        listItemSession : cc.Node,
        sfOdd : cc.SpriteFrame,
        sfEven : cc.SpriteFrame,
        bgSession1 : cc.Node,
        bgSession2 : cc.Node,

        tableSession : cc.Node,
        itemColumn : cc.Node,
        itemSession : cc.Node,

        lbOdd : cc.Label,
        lbEvent : cc.Label,

        audios: [cc.AudioClip],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.gameStatus = XocDiaStatus.Betting;
        this.valueBet = 1000;
        this.indexChip = 0;
        this.currentStatusSession = false;
        this.isFirstInitSession = true;
        this.sessionId = 0;
        this.isPlayAudio = true;
        
        for (let i = 0; i < this.listGateBet.length; i++) {
            const gate = this.listGateBet[i];
            gate.listChipMyBet = [];
            gate.listChipInGate = [];
            gate.listChipRewardInGate = [];
            gate.valueRebet = 0;
            gate.totalMybetInGate = 0;
            gate.getChildByName("lbMyBet").active = false;
        }
        this.listIdGateWin = [];
        this.players = [];
        this.dataPlayers = null;
        //popup
        this.popupListPlayerHide = null;
        this.popupGuide = null;
        this.popupRank = null;
        this.popupHistory = null;

        if(MainPlayerInfo.ingameBalance < 100000){
            this.listChip[0].isChecked = true;
            this.valueBet = 1000;
        }
        else if(MainPlayerInfo.ingameBalance < 200000){
            this.listChip[1].isChecked = true;
            this.valueBet = 5000;
        }
        else if(MainPlayerInfo.ingameBalance < 500000){
            this.listChip[2].isChecked = true;
            this.valueBet = 10000;
        }
        else if(MainPlayerInfo.ingameBalance < 1000000){
            this.listChip[3].isChecked = true;
            this.valueBet = 50000;
        }
        else {
            this.listChip[4].isChecked = true;
            this.valueBet = 100000;
        }

    },

    start () {

    },

    responseServer(responseCode, packet) {
        switch (responseCode) {
            case RESPONSE_CODE.MST_SERVER_OPEN_GAME_RESPONSE:
                // NONE = 0,
                // BETTING_TIME = 1, // Thời gian đặt cược
                // WAITING_TIME = 2 // Chờ sang ván mới
        
                this.lbSession.string = "#" + packet[1];
                this.gameStatus = packet[2];
                var time = packet[3]

                if(this.gameStatus === 1){
                    this.lbStatusGame.string = "Thời gian đặt cược";
                }
                else if(this.gameStatus === 2){
                    this.lbStatusGame.string = "Đang trả thưởng";
                }
                let audioClock = this.playAudio(this.audios[2], true);
                cc.Tween.stopAllByTarget(this.imgTimeCountDown);
                this.imgTimeCountDown.node.parent.active = true;
                this.imgTimeCountDown.fillRange = 1;
                this.lbTime.string = time + "s";
                this.unschedule(this.funcTime);
                this.schedule(this.funcTime = ()=>{
                    time--;
                    if(time <= 0){
                        this.unschedule(this.funcTime);
                    }
                    this.lbTime.string = time + "s";
                },1)
                cc.tween(this.imgTimeCountDown)
                .to(time, { fillRange: 0 })
                .call(() => {
                    cc.audioEngine.stop(audioClock);
                    this.imgTimeCountDown.node.parent.active = false;
                })
                .start();

                this.updateGateBet(packet[4]);
                break;

            case RESPONSE_CODE.MST_SERVER_BETTING_RESPONSE:
                cc.log("betting chpip bay ra", packet);
                MainPlayerInfo.setMoneyUser(packet[5]);
                this.lbChip.string = Global.formatNumber(MainPlayerInfo.ingameBalance);
                this.handleChip(packet[2], packet[1], packet[3], this.lbChip.node, true);
                this.playAudio(this.audios[1], false, 0.3);
                this.updateGateBet(packet[4]);
                this.btnDouble.interactable = true;
                break;

            case RESPONSE_CODE.MST_SERVER_PUSH_START_SESSION:
                require("SendRequest").getIns().MST_Client_Xoc_Dia_Get_Session_Info();
                this.lbSession.string = "#" + packet[1];    
                this.sessionId =  packet[1];
                this.resetGameView();

                var time = packet[2];
                cc.Tween.stopAllByTarget(this.imgTimeCountDown);
                this.lbStatusGame.string = "Thời gian đặt cược";
                this.imgTimeCountDown.fillRange = 1;
                let audioClock2 = this.playAudio(this.audios[2], true);
                this.lbTime.string = time + "s";
                this.unschedule(this.funcTime);
                this.schedule(this.funcTime = ()=>{
                    time--;
                    if(time <= 0){
                        this.unschedule(this.funcTime);
                    }
                    this.lbTime.string = time + "s";
                },1)
                cc.tween(this.imgTimeCountDown)
                .to(time, { fillRange: 0 })
                .call(() => {
                    cc.audioEngine.stop(audioClock2);
                    this.imgTimeCountDown.node.parent.active = false;
                })
                .start();

                this.playAudio(this.audios[4])
                Global.playSpine(this.animXocDia.node, "XocXoc", false, () => {
                    this.playAudio(this.audios[5])
                    this.imgTimeCountDown.node.parent.active = true;
                    cc.log("check auto rebet : ", this.btnAutoRebet.isChecked)
                    this.gameStatus = XocDiaStatus.Betting;
                    if(this.btnAutoRebet.isChecked){
                        this.onClickRebet();
                    }
                    Global.playSpine(this.dealer, "dat", false, ()=>{
                        Global.playSpine(this.dealer, "idle", true, ()=>{});
                    });
                })
        

                break;

            case RESPONSE_CODE.MST_SERVER_PUSH_END_BETTING:
                let dataResultFinish = JSON.parse(packet[2]);
                this.handleDataFinish(dataResultFinish);
                this.gameStatus = XocDiaStatus.Endgame;
                cc.log("check data ket qua", packet)
                break;

            case RESPONSE_CODE.MST_SERVER_PUSH_BETTING_RESULT:
                Global.playSpine(this.dealer, "idle", true, ()=>{});
                this.dataReward = packet;
                this.saveValueRebet(packet[2]);
                break;

            case RESPONSE_CODE.MSG_SERVER_GET_CHAT_LIST_RESPONSE_XOC_DIA:

                break;

            case RESPONSE_CODE.MSG_SERVER_PUSH_PLAYER_CHATTING:
                this.showChat(packet[2])
                break;

            case RESPONSE_CODE.MST_SERVER_GET_RESULT_LIST_RESPONSE:
                this.handleDataSession(packet[1]);
            break;

            case RESPONSE_CODE.MST_SERVER_PUSH_BETTING_INFO:
                this.updateGateBet(packet[1]);
                this.handleUserBetting(packet);
            break;

            case RESPONSE_CODE.MST_SERVER_PUSH_PLAYER_LIST:
                let listPlayerBetting = []
                for (let i = 0; i < packet[1].length; i++) {
                    const dataPlayer = JSON.parse(packet[1][i]);
                    listPlayerBetting.push(dataPlayer);
                }
                let numberTotalUser =  packet[2];
                if(numberTotalUser > 3){
                    numberTotalUser = numberTotalUser - 3;
                    this.nodeUser.active = true;
                }
                else this.nodeUser.active = false;
            
                this.lbTotalPlayer.string = numberTotalUser;
                let listPlayerInTable = listPlayerBetting.slice(0, 3);
                this.dataPlayers = listPlayerBetting;
                this.handlePlayerInTable(listPlayerInTable);
            break;


            case RESPONSE_CODE.MST_SERVER_GET_HISTORY_RESPONSE:
                cc.log("check data his : ",packet)
                this.popupHistory.getComponent("HistoryPoppupXocDia").handleData(packet[1]);
            break;

            
            case RESPONSE_CODE.MST_SERVER_GET_RANKING_RESPONSE:
                this.popupRank.getComponent("RankPopupXocDia").handleData(packet);
            break;

            case RESPONSE_CODE.MST_SERVER_DETAIL_HISTORY_RESPONSE:
                Global.HistoryXocDia.handleDataDetails(packet[1])
            break;
        }
    },

    startGame(){
        require("SendRequest").getIns().MST_Client_Xoc_Dia_Start_Game();
        Global.LobbyView.onHideLobby();
        this.lbName.string = MainPlayerInfo.nickName;
        this.lbChip.string  = Global.formatNumber(MainPlayerInfo.ingameBalance);
    },

    handlePlayerInTable(listPlayerInTable){
        this.parentPlayer.destroyAllChildren();
        this.players = [];
        for (let i = 0; i < listPlayerInTable.length; i++) {
            const dataPlayer = listPlayerInTable[i];
            let player = cc.instantiate(this.itemPlayer);
            player.position = this.listPositionPlayer[i];
            this.parentPlayer.addChild(player);
            player.getComponent("PlayerViewXocDia").initPlayer(dataPlayer);   
            this.players.push(player);
        }
    },

    handleChip(valueChip, gate, totalBetGate, parentChip, isMyBet = false){
        let itemChip = cc.instantiate(this.itemChip);
        parentChip.addChild(itemChip);

        let randomX = 0;
        let randomY = 0;
        if(gate === 2 || gate === 1){
            randomX = Global.RandomNumber(-70, 70)
            randomY = Global.RandomNumber(-20, 20)
        }
        else{
            randomX = Global.RandomNumber(-70, 70)
            randomY = Global.RandomNumber(10, 50)
        }
     
        let converLocation = Global.getPostionInOtherNode(parentChip, this.listGateBet[gate - 1])
        itemChip.getComponent("Chip").onMove(cc.v2(converLocation.x + randomX, converLocation.y + randomY), 0.4);
        itemChip.getComponent("Chip").setImg(valueChip);
        if (totalBetGate || totalBetGate === 0) {
            this.listGateBet[gate - 1].listChipInGate.push(itemChip);
            if (isMyBet) {
                this.btnRebet.interactable = false;
                this.listGateBet[gate - 1].totalMybetInGate = totalBetGate ;
                this.listGateBet[gate - 1].listChipMyBet.push(itemChip);
                this.listGateBet[gate - 1].getChildByName("lbMyBet").getComponent(cc.Label).string = Global.formatMoneyChip(totalBetGate);
                this.listGateBet[gate - 1].getChildByName("lbMyBet").active = true;
                for (let i = 0; i < this.listGateBet.length; i++) {
                    const gateBet = this.listGateBet[i];
                    gateBet.valueRebet = 0;
                }
            } 
        }
        else{
            this.listGateBet[gate - 1].listChipRewardInGate.push(itemChip);     
        }
    },

    handleDataFinish(data){
        //show effect win
        let winType = data.ResultLocation; // id type win
        let listIdGateWin = data.WinLocation;
        let isChanLocation = data.IsChanLocation;

        this.listIdGateWin = listIdGateWin;


        let animName = '';
        switch (winType) {
            case 1:
                console.log("loi tra ket qua")
                break;
            case 2:
                console.log("loi tra ket qua")
                break;
            case 3:
                animName = "2 Red 2 White"
                break;
            case 4:
                animName = "3 White 1 Red"
                break;
            case 5:
                animName = "3 Red 1 White"
                break;
            case 6:
                animName = "4 White"
                break;
            case 7:
                animName = "4 Red"
                break;
        }


        cc.tween(this.animXocDia.node)
            .call(() => {
                Global.UIManager.showNoti("Đã hết thời gian đặt cược")
            })
            .delay(2)
            .to(0.5, { scale: 3 })
            .call(() => {
                // Global.playSpine(this.animXocDia.node, animName, false, () => {
                    
                // })
                this.animXocDia.timeScale = 0.5;
                this.animXocDia.setAnimation(0, animName, false);
               

                cc.tween(this.animXocDia.node)
                        .delay(2)
                        .to(0.5, { scale: 1 })
                        .call(() => {
                            this.playAudio(this.audios[6])
                            for (let i = 0; i < listIdGateWin.length; i++) {
                                let idGate = listIdGateWin[i];
                                let gateWinEffect = this.listGateBet[idGate - 1].getChildByName("effect-win").getComponent(cc.Animation);
                                gateWinEffect.node.active = true;
                                gateWinEffect.play('EffectWin');
                                gateWinEffect.on('finished', () => {
                                    gateWinEffect.node.active = false;
                                });
                            }
                        })
                        .delay(2)
                        .call(() => {
                            this.pushUpdateSession(isChanLocation, winType);
                            this.handleReward(this.dataReward);
                        })
                        .start();
            })
            .start();



    },
    // 
    handleReward(dataReward) {
        let dataBetGate = dataReward[2];
        cc.tween(this.node)
            .call(() => {
                this.playAudio(this.audios[1], false, 0.3)
                for (let i = 0; i < 7; i++) {
                    if (!this.listIdGateWin.includes(i + 1)) {
                        let chipRemove = this.listGateBet[i].listChipInGate;
                        this.listGateBet[i].getChildByName("lbValueBet").getComponent(cc.Label).string = 0;
                        this.listGateBet[i].getChildByName("lbMyBet").getComponent(cc.Label).string = 0;
                        for (let i = 0; i < chipRemove.length; i++) {
                            const chip = chipRemove[i];
                            chip.getComponent("Chip").onMove(Global.getPostionInOtherNode(chip.parent, this.dealer.parent), 0.5, true);
                        }
                    }
                }

            })
            .delay(1)
            .call(() => {
                this.playAudio(this.audios[1], false, 0.3)
                for (let i = 0; i < 7; i++) {
                    if (this.listIdGateWin.includes(i + 1)) {
                        let dataChipReward = this.listGateBet[i].listChipInGate;
                        for (let j = 0; j < dataChipReward.length; j++) {
                            const dataChipValue = dataChipReward[j];
                            this.handleChip(dataChipValue.getComponent("Chip").chipValue, i + 1, null, this.dealer.parent);
                        }
                    }
                }
            })
            .delay(1)
            .call(() => {
                this.playAudio(this.audios[1], false, 0.3)
                for (let i = 0; i < this.listIdGateWin.length; i++) {
                    let chipReturn = this.listGateBet[this.listIdGateWin[i] - 1].listChipInGate;
                    for (let i = 0; i < chipReturn.length; i++) {
                        const chip = chipReturn[i];
                        chip.getComponent("Chip").onMove(cc.v2(0, 0), 0.5, true);
                    }

                    let chipReward = this.listGateBet[this.listIdGateWin[i] - 1].listChipRewardInGate;
                    for (let i = 0; i < chipReward.length; i++) {
                        const chip = chipReward[i];
                        chip.destroy();
                    }

                    this.changeMoneyEndGame(dataReward[1]);
                    MainPlayerInfo.setMoneyUser(dataReward[3]);
                    this.lbChip.string = Global.formatNumber(MainPlayerInfo.ingameBalance);
                    this.listGateBet[this.listIdGateWin[i] - 1].getChildByName("lbValueBet").getComponent(cc.Label).string = 0;
                    this.listGateBet[this.listIdGateWin[i] - 1].getChildByName("lbMyBet").getComponent(cc.Label).string = 0;
                }
            })
            .delay(2)
            .call(() => {
                this.resetGameView();
            })
            .start()

    },

    handleUserBetting(dataUserBet) {
        let valueChip = dataUserBet[4];
        let gateBet = dataUserBet[3];
        let idUserBetting = dataUserBet[2];
        let userBet = this.nodeUser;

        for (let i = 0; i < this.players.length; i++) {
            const player = this.players[i];
            if (idUserBetting === player.getComponent("PlayerViewXocDia").id) {
                userBet = player;
            }
        }
        this.handleChip(valueChip, gateBet, 0, userBet);
        this.playAudio(this.audios[1], false, 0.3)
    },

    updateGateBet(data){
        let listGateBetting = [];

        for (let i = 0; i < data.length; i++) {
            const dataGateBetting = JSON.parse(data[i]);
            listGateBetting.push(dataGateBetting)
        }

        for (let i = 0; i < listGateBetting.length; i++) {
            const infoGate = listGateBetting[i];
            if(infoGate.LocationId !== 3){
                this.listGateBet[infoGate.LocationId - 1].getChildByName("lbValueBet").getComponent(cc.Label).string = Global.formatMoneyChip(infoGate.TotalBetMoney);
            }
        }
    },

    handleDataSession(listDataSession, isInitFirst = false){
        for (let i = 0; i < listDataSession.length; i++) {
            listDataSession[i] = JSON.parse(listDataSession[i]);
        }

        let countOdd = 0;
        let countEvent = 0;
        
        //handle table - 1

        for (let i = 0; i < this.listItemSession.childrenCount; i++) {
            if (i < listDataSession.length) {
                this.listItemSession.children[i].getComponent(cc.Sprite).spriteFrame = listDataSession[i].IsChanLocation === true ? this.sfOdd : this.sfEven;
                this.listItemSession.children[i].active = true;
            } else {
                this.listItemSession.children[i].active = false;
            }
            listDataSession[i].IsChanLocation === true ? countOdd++ : countEvent++
        }

        this.lbOdd.string = countOdd;
        this.lbEvent.string = countEvent;

        //handle table - 2
        if (!this.isFirstInitSession) return;
        this.isFirstInitSession = false;
        this.tableSession.destroyAllChildren();
        let indexColumn = 0;
        let isChanLocation = listDataSession[0].IsChanLocation;
        this.currentStatusSession = listDataSession[0].IsChanLocation;
        for (let i = 0; i < listDataSession.length; i++) {
            const dataSession = listDataSession[i];
            if (dataSession.IsChanLocation === isChanLocation) {
                if (typeof this.tableSession.children[indexColumn] == "undefined") {
                    let column = cc.instantiate(this.itemColumn);
                    this.tableSession.addChild(column);
                }
                let itemSession = cc.instantiate(this.itemSession);
                itemSession.active = true;
                itemSession.getComponent(cc.Sprite).spriteFrame = dataSession.IsChanLocation === true ? this.sfOdd : this.sfEven;
                itemSession.getChildByName("lbNumber").getComponent(cc.Label).string = this.converResultLocationToNumber(dataSession.ResultLocation);
                this.tableSession.children[indexColumn].addChild(itemSession);
            }
            else {
                isChanLocation = dataSession.IsChanLocation;
                let column = cc.instantiate(this.itemColumn);
                this.tableSession.addChild(column);
                indexColumn++;
                let itemSession = cc.instantiate(this.itemSession);
                itemSession.active = true;
                itemSession.getComponent(cc.Sprite).spriteFrame = dataSession.IsChanLocation === true ? this.sfOdd : this.sfEven;
                itemSession.getChildByName("lbNumber").getComponent(cc.Label).string = this.converResultLocationToNumber(dataSession.ResultLocation);
                this.tableSession.children[indexColumn].addChild(itemSession);
            }
        }
    },

    converResultLocationToNumber(resultLocation) {
        let number = 0;
        switch (resultLocation) {
            case 3:
                number = 2;
                break;
            case 4:
                number = 3;
                break;
            case 5:
                number = 1;
                break;
            case 6:
                number = 0;
                break;
            case 7:
                number = 4;
                break;
        }
        return number;
    },

    pushUpdateSession(isChanLocation, resultLocation){
        cc.log("check sesion hien tai : ", this.currentStatusSession, "va serron moi  : ", isChanLocation)
        if(this.currentStatusSession === isChanLocation){
            let itemSession = cc.instantiate(this.itemSession);
            itemSession.active = true;
            itemSession.getComponent(cc.Sprite).spriteFrame = isChanLocation === true ? this.sfOdd : this.sfEven;
            itemSession.getChildByName("lbNumber").getComponent(cc.Label).string = this.converResultLocationToNumber(resultLocation);
            this.tableSession.children[0].addChild(itemSession);
        }
        else{
            cc.log("chay vao day add them cot moi ")
            this.currentStatusSession = isChanLocation;
            let column = cc.instantiate(this.itemColumn);
            this.tableSession.addChild(column);
            this.tableSession.insertChild(column, 0);
            let itemSession = cc.instantiate(this.itemSession);
            itemSession.active = true;
            itemSession.getComponent(cc.Sprite).spriteFrame =isChanLocation === true ? this.sfOdd : this.sfEven;
            itemSession.getChildByName("lbNumber").getComponent(cc.Label).string = this.converResultLocationToNumber(resultLocation);
            this.tableSession.children[0].addChild(itemSession);
        }
    },

    resetGameView() {
        for (let i = 0; i < this.listGateBet.length; i++) {
            const gate = this.listGateBet[i];
            let listChipInGate = gate.listChipInGate;
            for (let j = 0; j < listChipInGate.length; j++) {
                let chip = listChipInGate[j];
                chip.destroy();
            }

            let listChipRewardInGate = gate.listChipRewardInGate;
            for (let j = 0; j < listChipRewardInGate.length; j++) {
                let chip = listChipRewardInGate[j];
                chip.destroy();
            }
            if(gate.valueRebet > 0){
                this.btnRebet.interactable = true;
            }
            this.btnDouble.interactable = false;
            gate.totalBetGate = 0;
            gate.listChipInGate = [];
            gate.listChipRewardInGate = [];
            gate.listChipMyBet = [];
            gate.totalMybetInGate = 0;
            gate.getChildByName("lbValueBet").getComponent(cc.Label).string = 0;
            gate.getChildByName("lbMyBet").active = false;
        }
        this.listIdGateWin = [];
        
        if(!this.btnAutoRebet.isChecked){
            this.btnRebet.isChecked = false;
        }
    },

    onClickChipBet(event, data){
        let valueChip = data;
        this.valueBet = valueChip;
    },

    onClickAvatar(){
        Global.UIManager.showProfilePopup(MainPlayerInfo.accountId)
    },

    onClickBetting(event, data){
        if(this.gameStatus !== XocDiaStatus.Betting){
            Global.UIManager.showNoti("Đã hết thời gian đặt cược")
            return;
        }
        this.btnRebet.interactable = false;
        let roomBet = parseInt(data);
        let msg = {}
        msg[1] = roomBet;
        msg[2] = this.valueBet;
        require("SendRequest").getIns().MST_Client_Xoc_Dia_Betting(msg)
    },

    onClickDouble() {
        if(this.gameStatus !== XocDiaStatus.Betting){
            Global.UIManager.showNoti("Đã hết thời gian đặt cược")
            return;
        }
        cc.log("chay vao double : ", this.listGateBet)
        for (let i = 0; i < this.listGateBet.length; i++) {
            let gateBet = this.listGateBet[i];
            cc.log("check value bet in gate : ", i, " check value : ",gateBet.totalMybetInGate )
            if(gateBet.totalMybetInGate > 0){
                let roomBet = i + 1;
                let msg = {}
                msg[1] = roomBet;
                msg[2] = gateBet.totalMybetInGate;
                require("SendRequest").getIns().MST_Client_Xoc_Dia_Betting(msg)
            }     
        }
    },

    onClickRebet() {
        if(this.gameStatus !== XocDiaStatus.Betting){
            this.btnRebet.isChecked = false;
            Global.UIManager.showNoti("Đã hết thời gian đặt cược")
            return;
        }

        cc.log("check rebet : ", this.listGateBet)
        for (let i = 0; i < this.listGateBet.length; i++) {
            let gateBet = this.listGateBet[i];
            let valueRebet = gateBet.valueRebet;
            if(valueRebet > 0){
                let msg = {}
                msg[1] = i + 1;
                msg[2] = valueRebet;
                cc.log(" check data send rebet : ", msg)
                require("SendRequest").getIns().MST_Client_Xoc_Dia_Betting(msg)
                valueRebet = 0;
            }
            
        }        
        this.btnRebet.interactable = false;
    },

    onClickShowListPlayer() {
        if(this.popupListPlayerHide === null){
            this.popupListPlayerHide = cc.instantiate(this.prefabListPlayer);
            this.parentPopup.addChild(this.popupListPlayerHide);
        }
        this.popupListPlayerHide.getComponent("ListPlayerHide").show();
        if(this.dataPlayers && this.dataPlayers.length > 0){  
            this.popupListPlayerHide.getComponent("ListPlayerHide").handleDataPlayer(this.dataPlayers);
        }
    },

    onClickShowGuideXocDia(){
        if(this.popupGuide === null){
            this.popupGuide = cc.instantiate(this.prefabGuide);
            this.parentPopup.addChild(this.popupGuide);
        }

        this.popupGuide.getComponent("GuidePopupXocDia").show();

        Global.UIManager.showMiniLoading();
        if (Global.RankMiniPoker) {
            Global.RankMiniPoker.show();
        } else {
            let bundle = cc.assetManager.getBundle(this.idGame.toString());
            bundle.load("Prefab/RankMiniPoker", (err, prefab) => {
                if (err) return;
                Global.RankMiniPoker = cc.instantiate(prefab).getComponent("RankMiniPoker");
                Global.UIManager.parentPopup.addChild(Global.RankMiniPoker.node);
                Global.RankMiniPoker.show();
            })

        }
       
    },

    onClickShowRank(){
        if(this.popupRank === null){
            this.popupRank = cc.instantiate(this.prefabRank);
            this.parentPopup.addChild(this.popupRank);
        }
        require("SendRequest").getIns().MST_Client_Xoc_Dia_Get_Ranking();
        this.popupRank.getComponent("RankPopupXocDia").show();
    },

    onClickAutoRebet(event, data){
        if(event.isChecked){
            this.lbSuggestAutoRebet.node.active = false;
        }
        else{
            this.lbSuggestAutoRebet.node.active = true;
        }
    },

    onClickShowHistory(){
        if(this.popupHistory === null){
            this.popupHistory = cc.instantiate(this.prefabHistory);
            this.parentPopup.addChild(this.popupHistory);
        }
        require("SendRequest").getIns().MST_Client_Xoc_Dia_Get_History();
        this.popupHistory.getComponent("HistoryPoppupXocDia").show();
    },

    onClickCheckSession(){
        this.bgSession1.active = !this.bgSession1.active;
        this.bgSession2.active = !this.bgSession2.active;
    },

    onClickShowSubMenu(){
        // this.nodeSubMenu.active = true;
        // if(this.nodeSubMenu.active){
        //     this.nodeSubMenu.getComponent(cc.Animation).play('animMenu');
        // }

        this.nodeSubMenu.scaleX = 0;
        cc.tween(this.nodeSubMenu)
        .to(0.25, {scaleX : 1})
        .start();
    },

    onClickHideSubMenu(){
        // this.nodeSubMenu.active = false;
        this.nodeSubMenu.scaleX = 1;
        cc.tween(this.nodeSubMenu)
        .to(0.25, {scaleX : 0})
        .start();
    },

    onClickNextChip(){
        this.indexChip++;
        cc.log("check lengnth : ",this.listChipSelectBet.length )
        if(this.indexChip + 5 > this.listChipSelectBet.length){
            this.indexChip = this.listChipSelectBet.length - 5;
        }
        let arrChip = this.listChipSelectBet.slice( this.indexChip,  this.indexChip + 5);

        for (let i = 0; i < this.listChipSelectBet.length; i++) {
            const chip = this.listChipSelectBet[i];
            if(arrChip.includes(chip)){
                chip.active = true
            }
            else{
                chip.active = false;
            }
        }
    },

    onClickBackChip(){
        this.indexChip--;
        if(this.indexChip <= 0){
            this.indexChip = 0;
        }
        let arrChip = this.listChipSelectBet.slice( this.indexChip,  this.indexChip + 6);

        for (let i = 0; i < this.listChipSelectBet.length; i++) {
            const chip = this.listChipSelectBet[i];
            if(arrChip.includes(chip)){
                chip.active = true
            }
            else{
                chip.active = false;
            }
        }
    },

    onClickOffMusic(event, data){
        this.isPlayAudio = !event.isChecked;
        if(this.isPlayAudio){
            cc.audioEngine.resumeAll();
        }
        else{
            cc.audioEngine.pauseAll();
        }
       
       
        cc.log("chakc gia tri : ", this.isPlayAudio)
    },

    saveValueRebet(listDataGate){
        for (let i = 0; i < listDataGate.length; i++) {
            listDataGate[i] = JSON.parse(listDataGate[i]);
            this.listGateBet[listDataGate[i].LocationId - 1].valueRebet = listDataGate[i].BetMoney;
        }
    },

    showChat(content){
        cc.log("check contrent chat ", content)
        let node = this.lbChat.node.parent;
        this.lbChat.string = content;
        var numberOfRunningActions = node.getNumberOfRunningActions();
        if(numberOfRunningActions >= 1){
            node.scale =1.1
            node.stopAllActions()
        }
        else{
            node.scale = 0;
        }
        node.active = true;
        node.opacity = 255;
        
        cc.Tween.stopAllByTarget(node);
        cc.tween(node).to(0.15,{ scale: 1.1}, { easing: "backOut" }).delay(1.5).to(0.5, { opacity: 0 }).start();
        cc.log("chay vao end chat ")
    },

    playAudio(audioId, isLoop = false, volume = 1){
        if(!this.isPlayAudio) return;
        let audio = null;
        audio =  cc.audioEngine.play(audioId, isLoop, volume);
        return audio;
    },

    changeMoneyEndGame(money){
        if(money == 0) return;
        // let font = money > 0 ? this.fontWin : this.fontLose;
        let font = this.fontWin;
        let node = new cc.Node();
        let lb = node.addComponent(cc.Label);
        lb.fontSize = 50;
        // lb.spacingX = -5;
        lb.font = font;
        let strTem = money<0 ? "" : "+";
        lb.string =  strTem + Global.formatMoneyChip(money);
        node.scale = 0;
        node.y = 0;
        this.lbChip.node.addChild(node, 100);
        node.opacity = 0;
        cc.tween(node)
        .to(0.5 , {y:150 ,opacity : 255 , scale : 1 })
        .delay(2)
        .to(0.5 , {opacity:0 , y: 320 })
        .call(()=>{
            node.destroy();
        })
        .start();
    },

    onClickBack(){
        Global.LobbyView.OnShowLobby();
        this.node.active = false;
        Global.UIManager.hideMask();
        // Global.XocDia = null;
        // this.node.destroy();
    },

    // update (dt) {},
});
