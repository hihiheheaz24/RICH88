cc.Class({
    extends: require("DragMiniGame"),
    ctor() {
        this.idGame = null;
        this.isShow = false;
        this.roomId = 1;
        this.cardResult = null;
        this.priceRoom = [100, 1000, 10000];
        this.jackpotValueArray = [10000, 100000, 1000000];
        this.cachePrize = 0;
        this.countTime = 0;
        this.isSpinSuccess = false;
        this.isGetResult = false;
        this.isAuto = false;
        this.isEndTurn = true;
        this.isX2 = false;
        this.TIME_ROTATION = 0.2;
        this.cacheResultType = null;
        this.startX = 0;
        this.startY = 0;
        this.isSieuToc = false;
        this.isBigwin = false;
        this.isX5 = false;
        this.isMinimizeGame = false;
    },

    properties: {
        listCardSpin: [require("ItemMiniPoker")],
        spriteResult: cc.Sprite,
        listSpriteResult: [cc.SpriteFrame],



        textJackpot: require("LbJackpot"),
        xHuCp : require("ItemXHu"),

        animMessage: cc.Animation,
        btnAuto: cc.Toggle,
        btnSieuToc: cc.Toggle,

        //roomValue: [cc.Label],
        btnSpin: cc.Button,
        groupToggle: [cc.Toggle],


       // canGatSpin: cc.Node,
        imgBigwin: cc.Node,

        paticleNoHu: cc.ParticleSystem,
        lbMoneyTakeJackpot: cc.Label,
        nodeEffectJackpot: cc.Node,

        nodeSieuToc: cc.Node,
        cardAtlas: cc.SpriteAtlas,

        skeCanGat: sp.Skeleton,
    },
    start() {
    },

    getSpriteCard(cardName) {
        return this.cardAtlas.getSpriteFrame(cardName);
    },

    responseServer(code, packet) {
        cc.log("code la: " + code + " --content: " + JSON.stringify(packet));
        switch (code) {
            case RESPONSE_CODE.MSG_SERVER_MINIPOKER_GET_DETAILS_HISTORY:
                this.HandleGetHistoryMiniPoker(packet);
                break;
            case RESPONSE_CODE.MST_SERVER_MINIPOKER_JACKPOT_INFO_NEW:
                this.HandleJackpotMiniPoker(packet);
                break;
            case RESPONSE_CODE.MST_SERVER_MINIPOKER_SPIN:
            case RESPONSE_CODE.MST_SERVER_MINIPOKER_SPIN_MULTI_TIMES:
                this.HandleResultSpinMiniPoker(packet);
                break;
            case RESPONSE_CODE.MST_SERVER_MINIPOKER_TOP_WINNER:
                this.HandleGetTopMiniPokerWinner(packet);
                break;
        }
    },

    UpdateRoomBetValue() {
        // for (let i = 0; i < this.priceRoom.length; i++) {
        //     this.priceRoom[i] = Global.GameConfig.SlotMachineBetValues[GAME_TYPE.MINI_POKER][i];
        //     this.roomValue[i].string = Global.formatPrice(this.priceRoom[i]);
        // }

    },

    startGame() {
        actionEffectOpen(this.node);
        // this.skeCanGat.play();
        this.skeCanGat.setAnimation(0 , "DEFAULT" , true)
        this.isShow = !this.isShow;
        if (this.isShow) {
            this.node.active = true;
        } else {
            this.ForceStop();
        }

        let listCard = {"CardID1":1,"CardID2":2,"CardID3":3,"CardID4":4,"CardID5":5}
        this.listCardSpin[0].setCardStart(listCard, ()=>{})
    },

    ChangeValue(index) {
        this.roomId = index + 1;
        let to = 36;
        let from = 65;

        cc.log("chang index la : ", index)
        this.textJackpot.changeIndex(index);

        this.xHuCp.changeIndex(this.roomId);
        // #044475
        let listCard = {};
        switch (index) {
            case 0:
                listCard = {"CardID1":1,"CardID2":2,"CardID3":3,"CardID4":4,"CardID5":5}
                break;
            case 1:
                listCard = {"CardID1":0,"CardID2":26,"CardID3":39,"CardID4":50,"CardID5":37}
                break;
            case 2:
                listCard = {"CardID1":51,"CardID2":38,"CardID3":25,"CardID4":12,"CardID5":50}
                break;
        }
        this.listCardSpin[0].setCardStart(listCard, ()=>{})
    },

    ClickSpin(event, data) {
        if (MainPlayerInfo.ingameBalance < this.priceRoom[this.roomId - 1]) {
            this.animMessage.play("Message");
            this.ClickAuto(false);
            return;
        }
        if (!this.isAuto) {
            // this.skeCanGat.timeScale = 2;
            // this.skeCanGat.play();
            this.skeCanGat.setAnimation(0, "TRUCQUAY", false);
        }
        Global.MoneyUser.subMoney(this.priceRoom[this.roomId - 1]);
        this.ActiveButton(false);
        this.isSpinSuccess = false;
        this.isGetResult = false;
        this.isEndTurn = false;
        this.countTime = 0;
        let msgData = {};
        msgData[1] = this.roomId;
        if (this.isX5) {
            for (let i = 0, l = this.listCardSpin.length; i < l; i++) {
                this.listCardSpin[i].spinItem();
            }
        } else {
            this.listCardSpin[0].spinItem();
        }
        require("SendRequest").getIns().MST_Client_MiniPoker_Spin(msgData, this.isX5);

    },


    ActiveButton(isActive) {
      //  cc.log("gia tri set la: " + isActive);
        this.btnSpin.interactable = isActive;
        this.btnSieuToc.interactable = isActive;
        this.isBigwin = false;
        for (let i = 0; i < this.groupToggle.length; i++) {
            this.groupToggle[i].interactable = isActive;
        }

        if(isActive){
            // this.skeCanGat.timeScale = 1;
            this.skeCanGat.setAnimation(0 , "DEFAULT" , true)
        }
    },

    OnGetResult(spinId, cardList, jackpotValue, prize, accountBalance) {
        //this.textSessionId.string = "#" + spinId;
        this.jackpotValueArray[this.roomId - 1] = jackpotValue;
        this.cachePrize = prize;
        cc.log("Check cache prize", prize)
        let listCardRevice = [];
        let listCardServer = JSON.parse(cardList);
        if (Number.isInteger(spinId)) { // check co phai quay 5 phat hay ko
            listCardServer.PrizeValue = prize;
            listCardRevice.push(listCardServer);
            //require("WalletController").getIns().PushBalance(this.idGame, this.priceRoom[this.roomId - 1], prize, accountBalance);
            Global.MoneyUser.pushDelayMoney(this.idGame , accountBalance)
            if (prize > (this.priceRoom[this.roomId - 1] * 8) - 1) this.isBigwin = true;
        } else {
            for (let i = 0; i < 5; i++) {
                listCardRevice.push(listCardServer[i]);
            }
            //require("WalletController").getIns().PushBalance(this.idGame, this.priceRoom[this.roomId - 1] * 5, prize, accountBalance);
            Global.MoneyUser.pushDelayMoney(this.idGame , accountBalance)

            if (prize > (this.priceRoom[this.roomId - 1] * 15) - 1) this.isBigwin = true;
        }
        //  listCardRevice[0].CardTypeID =CARD_RESULT_TYPE.THUNG_PHA_SANH_DAI

        //     this.cardResult = ;

        this.isGetResult = true;
        this.stopSpinAndSetCard(listCardRevice, prize);
        if (!this.node.active) {
            //require("WalletController").getIns().TakeBalance(idGame);
        }


        //this.isBigwin = true;
    },
    stopSpinAndSetCard(listCardRevice, prize) {
        let promises = [];
        const handleSpin = (i) => {
            return new Promise((resolve, reject) => {
                cc.log("check liscatd : ", JSON.stringify(listCardRevice[i]))
                this.listCardSpin[i].setCard(listCardRevice[i], resolve)
            })
        }
        this.scheduleOnce(() => {
            for (let i = 0, l = this.listCardSpin.length; i < l; i++) {
                promises.push(handleSpin(i))
            }
            Promise.all(promises)
                .then(() => {
                    this.checkShowJackpotAndBigwin(listCardRevice, prize, () => {
                        this.stopSpinAndShowResult(listCardRevice);
                    })
                })
        }, 1)
    },
    stopSpinAndShowResult(listCardRevice) {
        let promises = [];
        const handleSpin = (i) => {
            return new Promise((resolve, reject) => {
                cc.log("chay vao stopSpin=========")
                this.listCardSpin[i].handleShowResult(listCardRevice[i], resolve)
            })
        }
        this.scheduleOnce(() => {
            for (let i = 0, l = this.listCardSpin.length; i < l; i++) {
                promises.push(handleSpin(i))
            }
            Promise.all(promises)
                .then(() => {
                    this.ShowTextSuccess();
                })
        }, 1.5)
    },
    showEffectTakeJackpot(money) {
        this.paticleNoHu.node.active = true;
        this.paticleNoHu.resetSystem();
        Global.MiniPoker.Vibrate(2);
        this.nodeEffectJackpot.active = true;
        this.nodeEffectJackpot.stopAllActions();
        this.nodeEffectJackpot.scale = 0;
        this.nodeEffectJackpot.runAction(cc.scaleTo(0.3, 1).easing(cc.easeBackOut()));
        this.lbMoneyTakeJackpot.string = Global.formatNumber(money);
    },

    checkShowJackpotAndBigwin(listCard, money, funNext) {
        for (let i = 0, l = listCard.length; i < l; i++) {
            if (listCard[i].CardTypeID == CARD_RESULT_TYPE.THUNG_PHA_SANH_DAI) {
                this.showEffectTakeJackpot(money);
                this.scheduleOnce(() => {
                    this.btnAuto.uncheck();
                    this.nodeEffectJackpot.active = false;
                    this.paticleNoHu.node.active = false;
                    funNext();
                }, 3)
                return;
            }
        }
        if (this.isBigwin) {
            this.showBigwinEffect(funNext);
        } else {
            funNext();
        }

    },

    showBigwinEffect(funNext) {
        this.imgBigwin.active = true;
        // this.imgBigwin.fillRange = 0;
        cc.tween(this.imgBigwin)
            // .to(0.25, { fillRange: 1 })
            .delay(1.2)
            .call(() => {
                this.imgBigwin.active = false;
                if (funNext) funNext();
            })
            .start();
    },
    ShowTextSuccess() {
        //require("WalletController").getIns().TakeBalance(this.idGame);
        cc.log("show text success");
        if(this.isMinimizeGame) Global.BtnMiniGame.effectFlyMoneyMiniSize(this.cachePrize, this.idGame);
        Global.MoneyUser.removeDelay(this.idGame , this.cachePrize);
        this.ActiveButton(true);
        this.isEndTurn = true;
        if (this.isAuto)
            this.AutoSpin();
    },

    AutoSpin() {   
        this.skeCanGat.setAnimation(0, "TRUCQUAY", false);
        this.ClickSpin();
    },

    ForceStop() {

        actionEffectClose(this.node , ()=>{
            this.isSpinSuccess = false;
            this.isGetResult = false;
            this.isAuto = false;
            this.isEndTurn = true;
    
    
            this.animMessage.node.active = false;
            this.ActiveButton(true);
            this.btnAuto.isChecked = false;
    
            for (let i = 0, l = this.listCardSpin.length; i < l; i++) {
                this.listCardSpin[i].Force();
            }
            //require("WalletController").getIns().TakeBalance(this.idGame);
            // Global.MoneyUser.removeDelay(this.idGame , this.cachePrize);
            this.Close();
        })


    },

    forceStopSpinByNotMoney() {
        this.ActiveButton(true);
        this.isSpinSuccess = false;
        this.isGetResult = false;
        this.isAuto = false;
        this.isEndTurn = true;
        for (let i = 0, l = this.listCardSpin.length; i < l; i++) {
            this.listCardSpin[i].stopByNotMoney();
            //  this.listCardSpin[i].Force();
        }
        cc.log("chay vao day nay forceStop");
    },

    UpdateJackpot(jackpotDataArray) {
        for (let i = 0; i < jackpotDataArray.length; i++) {
            this.jackpotValueArray[i] = jackpotDataArray[i];
        }
    },

    Vibrate(timeVibrate) {
        this.startX = parseInt(this.node.getPosition().x);
        this.startY = parseInt(this.node.getPosition().y);
        this.isVibrate = true;
        this.scheduleOnce(() => {
            this.isVibrate = false;
            this.node.setPosition(cc.v2(this.startX, this.startY));
        }, timeVibrate)
    },

    update(dt) {
        if (this.isVibrate) {
            this.node.x = (Global.RandomNumber(-15, 16)) + this.startX;
            this.node.y = (Global.RandomNumber(-15, 16)) + this.startY;
        }
    },

    OnClickRoom(event, index) {
        this.ChangeValue(parseInt(index));
    },

    OnClickAuto() {
        this.ClickAuto(this.btnAuto.isChecked);
    },

    ClickAuto(isSelected) {
        this.isAuto = isSelected;
        if (this.isAuto)
            if (this.isEndTurn)
                this.AutoSpin();
    },
    ClickX5(event, data) {
        // cc.log(event);
        // return 
        this.isX5 = event.isChecked;
        this.nodeSieuToc.active = this.isX5;
    },
    // ClickCancelX5() {
    //     this.isX5 = false;
    //     this.nodeSieuToc.active = false;
    //     this.nodeX5.active = true;
    // },

    ClickButtonHelp() {

        Global.UIManager.showMiniLoading();
        if (Global.HuongDanChoiMiniPoker) {
            Global.HuongDanChoiMiniPoker.show();
        } else {
            let bundle = cc.assetManager.getBundle(this.idGame.toString());
            bundle.load("Prefab/HelpMiniPoker", (err, prefab) => {
                if (err) return;
                Global.UIManager.parentPopup.addChild(cc.instantiate(prefab));
                Global.HuongDanChoiMiniPoker.show();
            })
        }
        Global.UIManager.showMark();
    },

    ClickButtonHistory() {
        Global.UIManager.showMiniLoading();
        if (Global.HistoryMiniPoker) {
            Global.HistoryMiniPoker.show();
        } else {
            let bundle = cc.assetManager.getBundle(this.idGame.toString());
            bundle.load("Prefab/HistoryMiniPoker", (err, prefab) => {
                if (err) return;
                Global.HistoryMiniPoker = cc.instantiate(prefab).getComponent("HistoryMiniPoker");
                Global.UIManager.parentPopup.addChild(Global.HistoryMiniPoker.node);
                Global.HistoryMiniPoker.show();
            })
        }
        Global.UIManager.showMark();
    },

    ClickButtonRank() {

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


        Global.UIManager.showMark();
    },

    Close() {
        Global.MoneyUser.endGameMOney(this.idGame);
        this.isMinimizeGame = false;;
        this.isShow = false;
        this.node.removeFromParent(false)
        // Global.UIManager.checkHideMiniGame();
        Global.UIManager.hideMask();
    },



    //response

    HandleResultSpinMiniPoker(packet) {
        let spinId = packet[1];
        let betValue = packet[2];
        let prizeValue = packet[3];
        let jackpotValue = packet[4];
        let result = packet[5];
        let accountBalance = packet[6];
        this.OnGetResult(spinId, result, jackpotValue, prizeValue, accountBalance);
    },

    HandleJackpotMiniPoker(packet) {
        let jackpotDataArray = [];
        jackpotDataArray[0] = packet[1];
        jackpotDataArray[1] = packet[2];
        jackpotDataArray[2] = packet[3];
        Global.JackpotController.listMoneyJackpot[8] = []
        Global.JackpotController.listMoneyJackpot[8][1] = packet[1]
        Global.JackpotController.listMoneyJackpot[8][2] = packet[2]
        Global.JackpotController.listMoneyJackpot[8][3] = packet[3]
        this.textJackpot.emitNewDataJackpot();
        this.UpdateJackpot(jackpotDataArray);
    },

    HandleGetHistoryMiniPoker(packet) {
        let datas = packet[1];
        let historyDataArray = JSON.parse(datas);
        Global.HistoryMiniPoker.SetInfoHistory(historyDataArray);
    },

    HandleGetTopMiniPokerWinner(packet) {
        let datas = packet[1];
        let topWinDataArray = [];
        for (let i = 0; i < datas.length; i++) {
            topWinDataArray[i] = JSON.parse(datas[i]);
        }
        Global.RankMiniPoker.SetInfoRank(topWinDataArray);
    },
    onClickMiniSize(){
        if (!this.isAuto) {
            this.ForceStop();
        } else {
            this.isMinimizeGame = true;
            this.isCloseGame = false;
            Global.BtnMiniGame.hideGame(this,this.idGame);
        }
    },
    onToggleSieuToc(event, data) {
        this.isSieuToc = event.isChecked;
        cc.log("check sieu toc : ",  this.isSieuToc)
    },
    onLoad() {
        this._super();
        this.idGame = GAME_TYPE.MINI_POKER;
        Global.MiniPoker = this;
    },

    onDestroy() {
        Global.MiniPoker = null;
    },



});
