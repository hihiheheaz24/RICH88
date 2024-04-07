// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: require("DragMiniGame"),
    ctor(){
        this._stateGame = 0;
        this.isSendEndBonus = true;
        this.listColum = [];
        this.listColumResult = [];
        this.listNodeItem = [];
        this.listNodeItemResult = [];
        this.listMoneyRoom = [100,1000,10000];
        this.listLineChoose = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
        this.totalLineBet = 20;
        this.curRoomBet = 100;
        this.indexRoom = 1;
        this.gameType = null;
        this.dataFinish = null;
        this.listPromises = [];
        this.listFunShowOceLine = [];
        this.curTimeRemain = 0;
        this.isMaxSpeed = false;
        this.vectorCacheLbMoneyLost = cc.v2(20 , -10);
        this.isAutoSpin = false;
        this.isAutoSpinCache = false;

        this.freeSpinLeft = 0;
        this.freeSpinRevice = 0;
        this.isFreeSpin = false;

        this.isMinimizeGame = false;
        this.isCloseGame = false;

        this.chooseLinePop = null;
        this.helpPopup = null;


        
    },
    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        _stateGame:0,
        stateGame:{
            get(){
                return this._stateGame
            },
            set(value){
                this._stateGame = value;

                // if(value == StateSpin.Wating || value ==  StateSpin.ShowEffect){
                //     this.toggleAutoSpin.interactable = true;
                // }else{
                //     this.toggleAutoSpin.interactable = false;
                // }
            }
        },

        preItem:cc.Prefab,
        parentItem:cc.Node,
        parentLine:cc.Node,

        lbJackpot: require("LbJackpot"),
        labelChipRevice: require("LbMonneyChange"),
        effect:require("EffectCandy"),
        xHuCp : require("ItemXHu"),
        lbMoneyLostBet:cc.Label,
        lb_lineBet:cc.Label,


        toggleAutoSpin:cc.Toggle,
        toggleMaxSpeed:cc.Toggle,
        btnSpin:cc.Button,

        parentToggleChooseLine:cc.Node,

    },
    onClickTest(){
        if(this.stateGame == 0){
           this.runSpin();
        }else{
            this.stopSpin();
        }
        
    },
    // LIFE-CYCLE CALLBACKS:

   onLoad(){
    this._super();
    this.asset = this.getComponent("AssetCandy");
    this.initItem();
    this.gameType = GAME_TYPE.MINI_SLOT;
    this.isFirstCountTime = true;
   },

    // start () {
       
    //     //this.sendStartGame();
    // },
    startGame(){
        this.resetForNewGame();
        actionEffectOpen(this.node);
        // let msgData = {};
        // msgData[1] = 1;
        // msgData[40] = this.gameType;
        // require("SendRequest").getIns().MST_Client_Slot_Get_Account_Info(msgData);
    },
    initItem(){
        for(let i = 0 ; i < 3 ; i++){
            let cpItem = cc.instantiate(this.preItem).getComponent("ItemSlotCandy");
            this.parentItem.addChild(cpItem.node)
            this.listColum.push(cpItem);
            cpItem.randomFirtGame();
            cpItem.node.x = cpItem.node.width * i + (cpItem.node.width/2)
            cpItem.node.y = 0;
            let listItemColum = cpItem.getListItemSp();
            this.listNodeItem[i] = listItemColum[0];
            this.listNodeItem[i+3] = listItemColum[1];
            this.listNodeItem[i+6] = listItemColum[2];
        }
    },

    randomItemSlots(){
        for (let i = 0; i < this.parentItem.children.length; i++) {
            const itemSlots = this.parentItem.children[i];
            itemSlots.getComponent("ItemSlotCandy").randomFirtGame();
        }
    },

    onClickSpin(){
        
        let moneybet = this.curRoomBet * this.totalLineBet;
        if(MainPlayerInfo.ingameBalance < moneybet) {
            Global.UIManager.showConfirmPopup(MyLocalization.GetText("NO_MONEY_PLAY"),  ()=>{
                Global.UIManager.showShopPopup(STATUS_SHOP.CARD_IN , true);
            });
            this.toggleAutoSpin.uncheck();
            return;
        }

        if(this.stateGame == StateSpin.Wating){
            this.runSpin();
        }else if(this.stateGame == StateSpin.CanStop){
            this.forceStopSpin();
        }else if(this.stateGame == StateSpin.Stop){

        }else if(this.stateGame == StateSpin.ShowEffect){
            this.resetForNewGame();
        }
    },

    setStateToggleRoom(){
        if(this.stateGame != StateSpin.Wating  && this.stateGame != StateSpin.ShowEffect){
            let children = this.parentToggleChooseLine.children;
            for(let i = 0 ; i < children.length; i++){
                let cp = children[i].getComponent(cc.Toggle);
                if(cp) cp.interactable = false;
            }
        }else{
            let children = this.parentToggleChooseLine.children;
            for(let i = 0 ; i < children.length; i++){
                let cp = children[i].getComponent(cc.Toggle);
                if(cp) cp.interactable = true;
            }
        }
    },
    responseServer(code, packet) {
        cc.log("Code: " + code + "  :  " + JSON.stringify(packet));
        // switch (code) {
        //     case RESPONSE_CODE.MST_SERVER_STAR_SLOT_ACCOUNT_INFO:
        //         //start game
        //         this.handleCreateRoom(packet);
        //         break;
        //     case RESPONSE_CODE.MST_SERVER_STAR_SLOT_BONUS_RESULT:
        //         Global.MoneyUser.pushDelayMoney(this.gameType , packet[2]);
        //         Global.MoneyUser.removeDelay(this.gameType ,  packet[1]);
        //         break;
        //     case RESPONSE_CODE.MST_SERVER_STAR_SLOT_JACKPOT_INFO:
        //         //this.handleJackPotInfo(packet);
        //         break;
        //     case RESPONSE_CODE.MST_SERVER_STAR_SLOT_SPIN_RESULT:
        //         this.handleFinish(packet[1]);
        //         break;
        //     case RESPONSE_CODE.MST_SERVER_STAR_SLOT_TOP_TAKE_JACKPOT_INFO:
        //         if (Global.TopVoLamSlot) Global.TopVoLamSlot.responseServer(packet);
        //         break;
        // }


        switch (code) {
            case RESPONSE_CODE.MST_SERVER_MINISLOT_JACKPOT_INFO_NEW:
                cc.log("jackpot mini slot : ", packet[1])
                Global.JackpotController.listMoneyJackpot[GAME_TYPE.MINI_SLOT] = {};
                for (let i = 0; i < packet[1].length; i++) {
                    const objData = JSON.parse(packet[1][i]);
                    cc.log("itme jackpot : ", objData.JackpotFund)

                    Global.JackpotController.listMoneyJackpot[GAME_TYPE.MINI_SLOT][i + 1] = objData.JackpotFund;
                }
                this.lbJackpot.emitNewDataJackpot();
                cc.log("check jackpot : ", Global.JackpotController.listMoneyJackpot)
                break;
            case RESPONSE_CODE.MST_SERVER_MINISLOT_SPIN:
                this.handleFinish(packet);
                break;
            default:
                break;
        }
        
    },

    convertTimeRemain(time) {
        let hour = parseInt(time / (60 * 60));
        let minute1 = parseInt(time / 60);
        let second = time % 60;
        if (second < 10) second = "0" + second;
        let minute = minute1 % 60;
        if (minute < 10) minute = "0" + minute;
        this.lb_timeRemain.string = hour + ":" + minute + ":" + second;
    },



    handleFinish(data){
        
        this.dataFinish = {
            spinId: data[1],
            slotData: data[2],
            prizeData: data[3],
            totalBetValue: data[4],
            payLinePrizeValue: data[5],
            accountBalance: data[8],
            isTakeJackpot: data[6],
        }


        cc.log("chjeck data spin : ", this.dataFinish)


        // var spinId = packet[1];
        // var slotData = packet[2];
        // var prizeData = packet[3];
        // var totalBet = packet[4];
        // var totalPrizeValue = packet[5];
        // var isJackpot = packet[6];
        // var currentJackpotValue = packet[7];
        // var accountBalance = packet[8];
        Global.MoneyUser.pushDelayMoney(this.gameType , this.dataFinish.accountBalance);
        this.truTienBet(this.dataFinish.totalBetValue);
        if(this.dataFinish.bonusGameData != "") this.isSendEndBonus = false;
        let timeDelay1 = this.isMaxSpeed ? 0.2: 0.5;


        this.scheduleOnce(()=>{
            this.setResult(this.dataFinish.slotData);
            this.setUpShowOceLineWin();
            this.stateGame = StateSpin.CanStop;
            let time = this.isMaxSpeed ? 0.1 : 0.5;
            this.scheduleOnce(this.stopSpin,time)
        } , timeDelay1)
    },
    convertSlotId(list) {
        let strView = list.split(",");
        let newList = [];
        let i = 0;
        let size = strView.length;
        if (strView[0] > 100) {
            for (let i = 0; i < size; i++) {
                if (strView[i] <= 103) {
                    strView[i] = strView[i] % 100;
                } else {
                    strView[i] = strView[i] % 100 + 1;
                }
            }
        }
        for (let i = 0; i < size; i++)
            for (i; i < 5; i++) { //Horizontal
                let tempList = []
                for (let j = i; j < size; j += 5) {
                    tempList.push(parseInt(strView[j]));
                }
                newList.push(tempList);
            }
        return newList; //vertical
    },
    setResult(listId){
        //let listIdConvert = this.convertSlotId(listId);
        listId = listId.split(",");
        for(let i = 0  , l = 9; i < l ; i++){
            let sp = this.listNodeItem[i].getComponentInChildren(cc.Sprite);
            sp.spriteFrame = this.asset.listSpItem[listId[i] - 1];
        }
    },

    

    sendClickSpin() {
        let data = {};
        data[1] = this.indexRoom;
        data[2] = this.listLineChoose.toString();;
        cc.log("MiniSlot_Main data : ", JSON.stringify(data));
        require("SendRequest").getIns().MST_Client_MiniSlot_Spin(data);
    },

    runSpin(){    
        this.offAllLineWin();
        for(let i = 0 ; i < this.listColum.length; i++){
            this.listColum[i].runSpin();
        }
        this.sendClickSpin();
        this.stateGame = StateSpin.Run;
        this.setStateToggleRoom();
    },
    stopSpin(){
       this.stopColum(false);
    },
    forceStopSpin(){
        cc.log("force StopSpin")
        this.unschedule(this.stopSpin)
        this.stopColum(true);
        this.stateGame = StateSpin.Stop;
    },
    forceStopSpinByNotMoney(){
        this.forceStopSpin();
        this.resetForNewGame();
        this.toggleAutoSpin.uncheck();
        for(let i = 0 , l = this.listColum.length ; i < l ; i++){
            this.listColum[i].stopEndGame();
        }
    },
    checkAndShowEffect(){
        let isJackpot = this.dataFinish.isTakeJackpot;
        let isBigWin = (this.dataFinish.payLinePrizeValue >= 80 * this.curRoomBet) ? true: false;
        let isBonus =  false;
        let isFree = false;
        let funJackpot = (funNext)=>{
            if(isJackpot){
                this.effect.showJackpot(funNext);
            }else{
                funNext();
            }
        }
        let funBigWin = (funNext)=>{
            if(isBigWin && !isJackpot ){
                this.effect.showBigWin(funNext);
            }else{
                funNext()
            }
        }


        let funBonus = (funNext)=>{
            if(isBonus){
            let funInitBonus = ()=>{
                this.showBonusGame(funNext)
            }
                this.effect.showBonus(funInitBonus);
            }else{
               
                funNext()
            }
        }
        let funFree = (funNext)=>{
            if(isFree){
                this.effect.showFreeSpin(funNext);
            }else{
                funNext();
            }
        }
        this.showWild(()=>{
            this.showAllLineWin(()=>{
                funJackpot(()=>{
                    funBigWin(()=>{
                        funFree(()=>{
                            funBonus(()=>{
                                this.showOnceLine();
                            })
                        })
                    })
                })
            })
        })
        
    },
    showBonusGame(funNext){
        funNext();
    },
    handleStopAllColum(){
        this.stateGame = StateSpin.Stop;

        this.checkAndShowEffect();
        this.setStateToggleRoom();
    },
    stopColum(isForceStopSpin = false) {
        this.listPromises = [];
        let time = this.isMaxSpeed ? 0.15 : 0.3;
        let timeDelay = isForceStopSpin ? 0 : time;
        const handleSpin = (i) => {
            return new Promise((resolve, reject) => {
                this.listColum[i].stopSpin(timeDelay * i, resolve , reject)
            })
        }
        for (let i = 0, l = this.listColum.length; i < l; i++) {
            this.listPromises.push(handleSpin(i))
        }
        Promise.all(this.listPromises)
            .then(() => {
                this.handleStopAllColum();
            })
            .catch(()=>{
                //cc.log("stop colum");
            })
    },
    setUpShowOceLineWin(){
        this.listFunShowOceLine = [];
        if(this.dataFinish.prizeData == "") return;
        let listIdLineWin = this.dataFinish.prizeData.split(";");
        let children = this.parentLine.children;
        for(let i = 0  , l = listIdLineWin.length ; i < l ; i++ ){
            let idLine = parseInt(listIdLineWin[i].split(",")[0]) - 1; // id Line
            if(idLine >= 20){
                continue;
            }
            let funTemp = ()=>{
                this.offMoneyReviceSpin(true);
                this.offAllLineWin();
                children[idLine].active = true;
            }
            this.listFunShowOceLine.push(funTemp);
        }

    },
    showOnceLine(){
        
        let current = 0;
        if(this.listFunShowOceLine.length < 1){
            this.resetForNewGame();
            return;
        }
        this.stateGame = StateSpin.ShowEffect;
        
        let moneyRevice = this.dataFinish.payLinePrizeValue
        this.showMoneyReviceSpin (moneyRevice);
        this.addMoneyUser(moneyRevice);
        
        if(this.isAutoSpin){
            this.scheduleOnce(this.resetForNewGame , 1.5)
            return;
        }

        this.schedule( this.funShowOnceLine = ()=>{
            this.listFunShowOceLine[current%this.listFunShowOceLine.length]();
            current++;
        } , 1.5)

        this.setStateToggleRoom();
    },
    truTienBet(moneyBet){
        if(moneyBet == 0){
            return;
        } 
        this.lbMoneyLostBet.string = "-"+ Global.formatNumber(moneyBet);
        this.lbMoneyLostBet.node.opacity = 255;
        this.lbMoneyLostBet.node.position = this.vectorCacheLbMoneyLost;
        this.lbMoneyLostBet.node.runAction(cc.spawn(cc.moveBy(1 , 0,50 ) , cc.fadeOut(1)));
        Global.MoneyUser.subMoney(moneyBet);
    },
    showMoneyReviceSpin(money){
        if(money != 0) {
           // this.playSound(Sound.SOUND_MUTILJACKPOT.MoneyPrize);
            this.labelChipRevice.node.parent.active = true;
        }
        
        if(this.isMaxSpeed){
            this.labelChipRevice.time = 0.25;
        }else{
            this.labelChipRevice.time = 0.5;
        }
        this.labelChipRevice.node.parent.stopAllActions();
        this.labelChipRevice.node.parent.opacity = 255;
        this.labelChipRevice.setMoney(money);
    },
    offMoneyReviceSpin(isEffect = false){
        if(isEffect){
            this.labelChipRevice.node.parent.stopAllActions();
            this.labelChipRevice.node.parent.runAction(cc.sequence(cc.fadeOut(0.4) ,cc.callFunc(()=>{
                this.labelChipRevice.resetLb();
                this.labelChipRevice.node.parent.active = false;
            }) ) )
        }else{
            this.labelChipRevice.resetLb();
            this.labelChipRevice.node.parent.active = false;
        }
    },
    addMoneyUser(money){
        if(this.isMinimizeGame) Global.BtnMiniGame.effectFlyMoneyMiniSize(money, this.gameType);
        Global.MoneyUser.removeDelay(this.gameType , money);
    },
    showWild(funNext){ // de danh cho cac con khac co wild thi dung
        funNext();
    },
    showAllLineWin(funNext){
        this.offAllLineWin();
        this.funNextAllWin = funNext;
        this.scheduleOnce(funNext , 1);
        if(this.dataFinish.prizeData == "") return;
        let listIdLineWin = this.dataFinish.prizeData.split(";");
        let children = this.parentLine.children;
        for(let i = 0  ,l = listIdLineWin.length; i < l ; i++ ){
            let idLine = parseInt(listIdLineWin[i].split(",")[0]) - 1; // id Line
            if(idLine < 25){
                let node = children[idLine];
                node.active = true;
                node.opacity = 0;
                cc.Tween.stopAllByTarget(node);
                cc.tween(node)
                .delay(i*0.04)
                .to(0.1 , {opacity:255})
                .start();
            }
        }
        
    },
    offAllLineWin(){
        let children = this.parentLine.children;
        for(let i = 0  ,l = children.length; i < l ; i++ ){
            children[i].active = false;
        }
    },
    offAllItemWin(){
        
    },
    effectItemShow(node){
        cc.Tween.stopAllByTarget(node);
        node.scale = 1;
        cc.tween(node)
        .to(0.3 , {scale:1.2})
        .to(0.3 , {scale:1})
        .union()
        .repeatForever()
        .start();
    },

    effectShowItemWithBonusGame(){
        //cc.find("bkg", this.node).runAction(cc.fadeIn(0.2));
    },
    resetForNewGame(){
        cc.log("chay vao reset new game ");
        this.dataFinish =null;
        this.stateGame = StateSpin.Wating;
        this.unschedule(this.funNextAllWin);
        this.unschedule(this.funShowOnceLine);
        this.unschedule(this.resetForNewGame);
        this.offAllLineWin();
        this.setStateToggleRoom();
        if(this.isAutoSpin){
            this.scheduleOnce(()=>{
                this.offMoneyReviceSpin(true);
            } , 0.5)
            this.onClickSpin();
        }else{
            this.offMoneyReviceSpin();
        }
    },
    playSound(resSound) {
        return;
        if (this._gameMode !== 0) return;
        let soundManager = require('SoundManager1').getIns();
        if (resSound !== Sound.SOUND_SLOT.BG && stateSFX && resSound !== Sound.SOUND_SLOT.BONUS_BG)
            soundManager.playEffect(resSound);
        else if (resSound === Sound.SOUND_SLOT.BG || resSound === Sound.SOUND_SLOT.BONUS_BG && stateSound) {
            soundManager.playMusicBackground(resSound);
        }
    },
    onClickChooseLine(even, data) {
        //  this.playSound(Sound.SOUND_SLOT.CLICK);

        if(this.stateGame != StateSpin.Wating) return;

        if(this.isAutoSpin && !this.isFreeSpin){
          this.toggleAutoSpin.uncheck();
          }
          if (this.stateGame == StateSpin.ShowEffect){
              this.resetForNewGame();
              return;
          }else if(this.stateGame != StateSpin.Wating){
              return;
          }


          Global.UIManager.showMiniLoading();
          if (this.chooseLinePop == null) {
            //   let bundle = cc.assetManager.getBundle(this.gameType.toString());
              cc.loader.loadRes("Prefabs/PopupChooseLines", cc.Prefab, (err, prefab) => {
                if (err) return;
                Global.UIManager.hideMiniLoading();
                this.chooseLinePop = cc.instantiate(prefab);
                Global.UIManager.parentPopup.addChild(this.chooseLinePop, 10000);
                actionEffectOpen(this.chooseLinePop);
            })
          }else{
            this.chooseLinePop.active = true;
            actionEffectOpen(this.chooseLinePop);
            Global.UIManager.hideMiniLoading();
          }
         
         
      },

      setTxtChooseLine(listLine) {
        this.listLineChoose = listLine;
        this.totalLineBet = listLine.length;
        this.lb_lineBet.string = listLine.length;
        if (this.listLineChoose.length === 0) {
            this.btnSpin.interactable = false;
            this.toggleAutoSpin.interactable = false;
            this.toggleMaxSpeed.interactable = false;
            Global.UIManager.showCommandPopup("Vui Lòng Chọn Ít Nhất 1 Dòng")
        } else {
            this.btnSpin.interactable = true;
            this.toggleAutoSpin.interactable = true;
            this.toggleMaxSpeed.interactable = true;
        }
    },
    onClickChooseRoom(event, data) {
      //  this.playSound(Sound.SOUND_SLOT.CLICK);

    //   if(this.stateGame != StateSpin.Wating) return;

    //     if(this.isAutoSpin && !this.isFreeSpin){
    //         this.toggleAutoSpin.uncheck();
    //     }


    //     if (this.stateGame == StateSpin.ShowEffect){
    //         this.resetForNewGame();
    //         return;
    //     }else if(this.stateGame != StateSpin.Wating){
    //         return;
    //     }
      
        this.indexRoom = parseInt(data);
        this.curRoomBet = this.listMoneyRoom[this.indexRoom - 1];
        this.lbJackpot.changeIndex(this.indexRoom - 1);
        this.xHuCp.changeIndex(this.indexRoom);
        this.randomItemSlots();
    },
    // onClickMinimize() {
    //     this.isMinimizeGame = true;
    //     this.isCloseGame = false;
    //     Global.BtnMiniGame.hideGame(this, this.gameType);
    // },
    onClickClose(){
        this.isCloseGame = true;
        this.isMinimizeGame = false;
      //  this.playSound(Sound.SOUND_SLOT.CLICK);
        // require("SoundManager1").getIns().stopAll();
        actionEffectClose(this.node, () => {
            if (this.dataFinish){
                Global.MoneyUser.removeDelay(this.gameType, this.dataFinish.payLinePrizeValue)
                this.dataFinish = null;
            } 
            if(this.isAutoSpin) this.toggleAutoSpin.uncheck();
            this.isAutoSpin = false;
            this.forceStopSpin();
            Global.MoneyUser.endGameMOney(this.gameType);
            this.node.removeFromParent(false);
            // Global.UIManager.checkHideMiniGame();
            this.resetForNewGame();
            this.effect.onClose();
            for(let i = 0 , l = this.listColum.length ; i < l ; i++){
                this.listColum[i].stopEndGame();
            }
        })
    },
    onClickAutoSpin(){
        this.isAutoSpin = this.toggleAutoSpin.isChecked;
        if(this.isAutoSpin){
            if(this.stateGame == StateSpin.Wating || this.stateGame == StateSpin.ShowEffect) this.onClickSpin();
        }
      
    },
    onClickMaxSpeed(){
        this.isMaxSpeed = this.toggleMaxSpeed.isChecked;

        if(this.isMaxSpeed){
            if(this.stateGame == StateSpin.Wating || this.stateGame == StateSpin.ShowEffect) this.toggleAutoSpin.check();
        }
       
    },
    onClickLichSu() {
      //  this.playSound(Sound.SOUND_SLOT.CLICK);
      Global.UIManager.showMiniLoading();
      if (Global.HistoryMiniSlot) {
        Global.HistoryMiniSlot.show();
        }else{
            // let bundle = cc.assetManager.getBundle(this.gameType.toString());
        
            cc.loader.loadRes("Prefabs/MS_PopupHistory" , cc.Prefab , (err , prefab)=>{
                if(err) return;
                Global.UIManager.hideMiniLoading();
                Global.UIManager.parentPopup.addChild(cc.instantiate(prefab));
                Global.HistoryMiniSlot.show();
            })
        }

   
    // cc.resources.load("PopupMiniGame/MiniSlot/MS_PopupHistory", (err, prefab) => {
    //     if (err) return;
    //     Global.UIManager.hideMiniLoading();
    //     Global.UIManager.parentPopup.addChild(cc.instantiate(prefab));
    // })


   
        Global.UIManager.showMark();
    },
    onClichTop() {
      //  this.playSound(Sound.SOUND_SLOT.CLICK);
      if (Global.RankMiniSlot == null) {
        Global.UIManager.showMiniLoading();
        // let bundle = cc.assetManager.getBundle(this.gameType.toString());
        // cc.log("check bundle la : ", bundle)
        cc.loader.loadRes("Prefabs/MS_PopupRank" , (err , prefab)=>{
            if(err) return;
            Global.UIManager.hideMiniLoading();
            Global.UIManager.parentPopup.addChild(cc.instantiate(prefab));
            Global.RankMiniSlot.show();
        })
        }else{
            Global.RankMiniSlot.show();
        }
        Global.UIManager.showMark();
    },

    onClickHelp() {
        Global.UIManager.showMiniLoading();
        if (Global.GuideMiniSlot) {
            Global.GuideMiniSlot.show();

        }else{

            // let bundle = cc.assetManager.getBundle(this.gameType.toString());
            cc.loader.loadRes("Prefabs/MS_PopupGuide" , cc.Prefab , (err , prefab)=>{
                if(err) return;
                Global.UIManager.hideMiniLoading();
                Global.UIManager.parentPopup.addChild(cc.instantiate(prefab));
                Global.GuideMiniSlot.show();
            })
        }

     
        // cc.resources.load("PopupMiniGame/MiniSlot/MS_PopupGuide", (err, prefab) => {
        //     if (err) return;
        //     Global.UIManager.hideMiniLoading();
        //     Global.UIManager.parentPopup.addChild(cc.instantiate(prefab));
        // })


            Global.UIManager.showMark();
    },
    // onSetData(even, data) {
    //     this.dataSet = {};
    //     let data1;
    //     let data2;
    //     switch (data) {
    //         case "freespin":
    //             data1 = "2,2,2,2,4,5,6,5,4,3,4,5,6,5,4";
    //             data2 = "1";
    //             break;
    //         case "bonus":
    //             data1 = "5,7,6,5,1,5,1,5,3,6,3,7,1,3,7";
    //             data2 = "0";
    //             break;
    //         case "jackpot":
    //             data1 = " 3,3,3,3,3,4,5,6,5,4,5,6,7,3,2";
    //             data2 = "0";
    //             break;
    //         case "normal":
    //             data1 = "";
    //             data2 = "0";
    //             break;
    //         case "bigwin":
    //             data1 = "4,4,4,4,4,4,4,4,4,4,5,6,7,5,6";
    //             data2 = "0";
    //             break;

    //     }
    //     this.dataSet[1] = data1;
    //     this.dataSet[2] = data2;
    //     this.dataSet[10] = this.gameType;
    //     this.onSendDataSet();
    // },
    // onSendDataSet() {
    //     cc.log("send data set:" + JSON.stringify(this.dataSet));
    //     require("SendRequest").getIns().MST_Client_Slot_Set_Data(this.dataSet);
    // },

    

    // update (dt) {},
});
