// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html



//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var GAME_STATE={
    WAITNG: 0,
    BETTING : 1,
    RACING : 2
}


cc.Class({
    extends: require("DragMiniGame"),

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
        _curentMoneyBet:0,
        nodeHistory:cc.Node,
        _listHistory:[],
        listSpFCau:[cc.SpriteFrame],  // 0 xiu , 1 tai
        _timeEnd:0,
        _gameStatus:0,
        _sum3Dice:0,
        _objResult:null,
        _isHideGame :false,
        _isHand:false,
        _curentObjGameSesionID:null,
        _curentGameSesionCau:null,
        lbMoneyAllTai: require("LbMonneyChange"),
        lbMoneyAllXiu: require("LbMonneyChange"),
        lbPeopleTai: cc.Label,
        lbPeopleXiu:cc.Label,
        lbMyMonneyBetTai: require("LbMonneyChange"),
        lbMyMonneyBetXiu: require("LbMonneyChange"),
        listSpriteDice:[cc.SpriteFrame],
        parentDice:cc.Node,
        scrListChat:cc.ScrollView,//require("BaseScrollView"),
        itemChat:cc.Prefab,
        nodeMoveToChat:cc.Node,
        animationXucXac:sp.Skeleton,
        _isNotChangeScence:false,
        textEffect:cc.RichText,
        objCau:cc.Node,
        objInfoSesion:require ("InfoSessionCau"),
        lbChatTop:cc.RichText,
        edbChatTaiXiu:cc.EditBox,
        nodeEffectResult:cc.Node,

        nodeTai: cc.Node,
        nodeXiu: cc.Node,

        eftai: cc.Node,
        efxiu: cc.Node,
      
        nodeDuDay : cc.Node,

        btnSoiCau:cc.Node,

        listSprDuDayChan : [cc.SpriteFrame],
        listSprDuDayLe : [cc.SpriteFrame],
        itemDuDay : [cc.Sprite],
        itemDuDayNormal : [cc.SpriteFrame],

        lbDuDayChan : cc.Label,
        lbDuDayLe : cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    
    onLoad () {
        
        this._super();
        this.getComponent("ParentChangePositionEDB").resignEdb(this.edbChatTaiXiu);
        this.poolChat = new cc.NodePool();
        this.poolCau = new cc.NodePool();
        this.updateTimer = 0;
        this.updateInterval = 0.2;
        this.dataRankDuDay = null;
        this.objCauView = {};
        this._isStateWatting = false;
        this.getComponent("DragMiniGame").gameType = GAME_TYPE.TAI_XIU;
        this.keyBoard = this.node.getComponentInChildren("KeyboardTaiXiu");
        // this.gameType = GAME_TYPE.TAI_XIU
        // cc.loader.loadRes("TaiXiu/NhanLocTX" , (err , prefab)=>{
        // })
      //  cc.log("nhan dc tai xiu")
      this.content = this.scrListChat.content;
        this._timeStartHide = 0;
       this.isResult = false;
       this._currentChatMiss = 0;

    //    this.onClickTheLeDuDay();
       if(Global.GameConfig.FeatureConfig.ActiveSoiCauTaiXiu == EFeatureStatus.Open){
           this.btnSoiCau.active= true;
       }else{
        this.btnSoiCau.active= false;
       }
    },

    updateTimeStartHide(){
        this._timeStartHide = this.node.getComponentInChildren("CountDownTaiXIu")._time;
    },
    start(){
    },
    startGame(){
        cc.log("chay vao start game tai xiu")
        require("SendRequest").getIns().MST_Client_TaiXiu_Open_Game();
            this._isNotChangeScence = true;
            actionEffectOpen(this.node);
            // if(Global.UIManager.isMiniSizeTaiXiu){
            //     Global.UIManager.isMiniSizeTaiXiu =false;
            //     this.miniSize(false);
            // }
    },
    resetGameUIWithBackGround(){
        require("SendRequest").getIns().MST_Client_TaiXiu_Open_Game();
        this._objResult = null;
        this.nodeXiu.stopAllActions();
        this.nodeXiu.scale = 1;
        this.nodeTai.stopAllActions();
        this.nodeTai.scale = 1;
        this._isNotChangeScence = false;
    },
    responseServer(code, packet) {
         cc.log("TX responseServer : " + JSON.stringify(packet));
        // if (code != RESPONSE_CODE.MSG_SERVER_DICE_GET_CURRENT_BET_SESSION_INFO)
        //     cc.log("TX responseServer : " + JSON.stringify(packet));
        // if (!this._isHideGame && this.node.parent == null) {
        //     if (code == RESPONSE_CODE.MSG_SERVER_DICE_GET_CURRENT_SESSION_INFO) {
        //         if (Global.BtnMiniGame != null)
        //             Global.BtnMiniGame.initTimeTaiXiu(packet[2], packet[3]);
        //     }
        //     return;
        // }
        switch (code) {
            case RESPONSE_CODE.MSG_SERVER_DICE_GET_TOP_WIN_LOSE_CHAIN:
              
                let dataSelf = JSON.parse(packet[1]);
                let dataRank = [];
                let numberDay = dataSelf.WinChain;
                if(dataSelf.WinChain < dataSelf.LoseChain) numberDay = dataSelf.LoseChain
                this.initItemDudDay(numberDay)
                if(dataSelf.WinChain > 0){
                    this.lbDuDayLe.node.parent.getComponent(cc.Button).interactable = false;
                    this.lbDuDayChan.node.parent.getComponent(cc.Button).interactable = true;
                }
                else if(dataSelf.LoseChain > 0){
                    this.lbDuDayLe.node.parent.getComponent(cc.Button).interactable = true;
                    this.lbDuDayChan.node.parent.getComponent(cc.Button).interactable = false;
                }
                this.lbDuDayChan.string = dataSelf.WinChain
                this.lbDuDayLe.string = dataSelf.LoseChain
              
                for (let i = 0; i < packet[2].length; i++) {
                    const objData = JSON.parse(packet[2][i]);
                    dataRank.push(objData)
                }
               cc.log("cehck avable : ", Global.TopDuDay.node.active)
                if(Global.TopDuDay.node.active && Global.TopDuDay.isSendGetTopDuDay){
                    this.dataRankDuDay = dataRank;
                    Global.TopDuDay.hanldeDataDuDay();
                    cc.log("check data bxh du day", dataRank);
                }
              
                break;
            case RESPONSE_CODE.MSG_SERVER_DICE_GET_CURRENT_SESSION_INFO:
                this.setInfoGame(packet);
                break;
            case RESPONSE_CODE.MSG_SERVER_DICE_SET_BET:
                this.responsePlayerBet(packet);
                break;
            case RESPONSE_CODE.MSG_SERVER_DICE_GET_RESULT:
                cc.log("ket qua xuc xac ", packet)
                this.finishEffect(packet[1]);
               
                break;
            case RESPONSE_CODE.MSG_SERVER_DICE_GET_ACCOUNT_RESULT:
                cc.log("ket qua cuoi van ", packet)
                this.getAcountResult(packet);
                break;
            case RESPONSE_CODE.MSG_SERVER_DICE_GET_TOP_WINNER:
                if (Global.TopVinhDanh) Global.TopVinhDanh.responseServer(packet[1]);
                break;
            case RESPONSE_CODE.MSG_SERVER_DICE_GET_BET_OF_ACCOUNT:
                let data = JSON.parse(packet[1]);
                cc.log("Check bet value : ", data.BetValue)
                if (data.BetValue != 0) {
                    if (data.LocationID == 1) {
                        this.lbMyMonneyBetXiu.setMoney(data.BetValue);
                    } else {
                        this.lbMyMonneyBetTai.setMoney(data.BetValue);
                    }
                }
                cc.log("chay vao thong bao hoan tien ", data.RefundValue)
                if(data.RefundValue !== 0){
                    cc.log("chay vao thong bao hoan tien ")
                    this.effectThongBaoCuoiGame("Hoàn " +  Global.formatNumber(data.RefundValue) + " Win")
                }
                cc.log("check check check ", JSON.parse(packet[2]))
                cc.log("check check check ", parseInt(data.RefundValue))
                Global.LobbyView.OnUpdateMoney(MainPlayerInfo.ingameBalance + parseInt(data.RefundValue))
                break;
            case RESPONSE_CODE.MSG_SERVER_DICE_GET_CURRENT_BET_SESSION_INFO:
                cc.log("chay vao set info bet : ")
                this.setCurrentBetTheir(packet[1]);
                break;
            case RESPONSE_CODE.MSG_SERVER_DICE_OPEN_GAME:
                break;
            case RESPONSE_CODE.MSG_SERVER_DICE_SERVER_MESSAGE:
                Global.UIManager.showCommandPopup(packet[1], null);
                break;
            case RESPONSE_CODE.MSG_SERVER_DICE_GET_GAME_HISTORY:
                this.setHistory(packet[1]);
                break;
            case RESPONSE_CODE.MSG_SERVER_DICE_CHAT:
                this.addChat(packet);
                break;
            case RESPONSE_CODE.MSG_SERVER_DICE_CHAT_HISTORY:
                this.setHistoryChat(packet[1]);
                break;
            case RESPONSE_CODE.MSG_SERVER_DICE_GET_TRANSACTION_DETAIL:
                if (Global.ChiTietPhienTaiXiu) Global.ChiTietPhienTaiXiu.responseServer(packet[1]);
                break;
            case RESPONSE_CODE.MSG_SERVER_DICE_GET_CHAIN:
                this.getChain(packet);
                break;
            case RESPONSE_CODE.MSG_SERVER_DICE_CHAIN_AWARD:
                break;
            case RESPONSE_CODE.MSG_SERVER_DICE_CHAT_TOP_MESSAGE:
                break;
            case RESPONSE_CODE.MSG_SERVER_PROFIT_SHARING_CREATE:
                this.sharingCreat(packet);
                break;
            case RESPONSE_CODE.MSG_SERVER_PROFIT_SHARING_RECEIVE:
                this.sharingRevice(packet);
                break;
        }
    },
    getChatPool(){
        let node = null;
        if(this.poolChat.size() > 0){
            node = this.poolChat.get();
        }else{
            node = cc.instantiate(this.itemChat);
        }
        return node;
    },
    getCauPool(){
        let node = null;
        if(this.poolCau.size() > 0){
            node = this.poolCau.get();
        }else{
            node = cc.instantiate(this.objCau);
        }
        return node;
    },

    resetDuDay(){
        for (let i = 0; i < this.itemDuDay.length; i++) {
            const item = this.itemDuDay[i];
            item.spriteFrame = this.itemDuDayNormal[i]
        }
    },

    initItemDudDay(numberDay){
        cc.log("check number day ", numberDay)
        this.resetDuDay();
        if(!this.nodeDuDay.active) return;
        let index = Math.floor(numberDay / 2);
        let subIndex = numberDay % 2;

        cc.log("check index : ", index)
        cc.log("check subIndex : ", subIndex)
        if(subIndex !== 0){
            for (let i = 0; i < index; i++) {
                let item = this.itemDuDay[i];
                item.spriteFrame = this.listSprDuDayChan[i];
            }
            cc.log("cahy vao dayt", parseInt(numberDay / 2))
            if(index <= this.itemDuDay.length - 1)
                this.itemDuDay[index].spriteFrame = this.listSprDuDayLe[index];;
        }
        else{
            for (let i = 0; i < index; i++) {
                let item = this.itemDuDay[i];
                item.spriteFrame = this.listSprDuDayChan[i];
            }
        }
    },

    onClickClose() {
        actionEffectClose(this.node, () => {
            this.currentPhien = 0;
            require("SendRequest").getIns().MST_Client_TaiXiu_Close_Game();
            //Global.MoneyUser.endGameMOney(GAME_TYPE.TAI_XIU);
            this.resetChat();
            //this.scrListChat.resetScr();
            this._objResult = null;


            this.nodeXiu.stopAllActions();
            this.nodeXiu.scale = 1;
            this.nodeTai.stopAllActions();
            this.nodeTai.scale = 1;
            this._isNotChangeScence = false;
            this.node.removeFromParent(false);
            // Global.UIManager.checkHideMiniGame();
        })
    },
    // onDisable(){
    //     cc.log("chay vao disble");
        
    // },
    
    getChain(packet){
       let listSp = cc.find("img_TienTriTX" , this.node).getComponentsInChildren(cc.Label);
       listSp[0].string = packet[1];
       //listSp[1].string = packet[2];
    },
    setInfoGame(packet){
        cc.log("chay vao get info game : ", packet)
        this._gameStatus = packet[2];
        this._timeEnd = packet[3];

        let nodeBat = this.node.getChildByName("batup");
        this.node.getChildByName("lbPhien").getComponent(cc.Label).string = "#" + packet[1];
        this.currentPhien = packet[1];
        

        //2024-02-06
        let day = new Date();
        let checkDate = this.generateDate(day);
        cc.log("check date  : ", checkDate)
        var ngayHomTruoc = new Date();
        ngayHomTruoc.setDate(day.getDate() - 1);
        cc.log("check date sau : ", this.generateDate(ngayHomTruoc))
        let msg = {}
        msg[1] = "";
        cc.log("send get du day top : ",msg);
        require("SendRequest").getIns().MST_Client_TaiXiu_Get_Top_Win_Lose_Chain(msg);
       

        if(this._gameStatus == 1){
            clearTimeout(this.funInfo);
            clearTimeout(this.funDelay);
            let arr = this.parentDice.getComponentsInChildren(cc.Sprite);
            let length = arr.length;
            for(let i = 0 ; i < length ; i++){
                arr[i].spriteFrame = null;
            }
            this.emitViewHistoryData();
            this.isResult = false;
            this._sum3Dice = 0;
            this.animationXucXac.node.active = false;
            this._curentMoneyBet = 0;
            this.parentDice.active = false;
          
            this.nodeEffectResult.active = false;
            this.nodeXiu.stopAllActions();
            this.nodeXiu.scale = 1;
            this.nodeTai.stopAllActions();
            this.nodeTai.scale = 1;

            this.stopWin();

            this.keyBoard.startNewGame();
            this.lbPeopleTai.string = 0;
            this.lbPeopleXiu.string = 0;
            this.lbMoneyAllTai.resetLb();
            this.lbMoneyAllXiu.resetLb();
            this.lbMyMonneyBetTai.resetLb();
            this.lbMyMonneyBetXiu.resetLb();
            nodeBat.active = false;
            cc.find("nodeLbCoundown/bg_elipse2" ,this.node).active = false;
        }else{
            // if(this._objResult != null){
            //     if(!this.parentDice.active) this.animationXucXac.node.active = true;
            //     this.animationXucXac.play();
            //     this.node.getChildByName("nodeLbCoundown").getChildByName("light_cirle").active = false;
            // }
            // this.funInfo =  setTimeout(()=>{
            //     this.animationXucXac.stop();
            //     this.animationXucXac.node.active = false;
            //    if(this._sum3Dice != 0) this.parentDice.active = true;
            //     if(this._objResult != null){
            //         if(!this._isHand){
            //             this.effectScaleResult(this._sum3Dice);
            //         }
            //     }
            //     if(this._isHand){
            //         nodeBat.active = true;
            //         nodeBat.setPosition(0,14);
            //     }
            // } , 1000)
            // this.scheduleOnce( ()=>{
                
            // },1)
            
        }
        Global.BtnMiniGame.initTimeTaiXiu(this._gameStatus , this._timeEnd);
        cc.log("check loi 111")
        this.node.getComponentInChildren("CountDownTaiXIu").startCountDown(parseInt(this._timeEnd ), this._gameStatus);
        cc.log("chay vao set time cowntdown " , parseInt(this._timeEnd ) , " vaf ", parseInt(this._gameStatus ))
    },

    generateDate(data) {
        let date = new Date(data);
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        if (day < 10) {
            day = "0" + day;
        }
        if (month < 10) {
            month = "0" + month;
        }
        //2024-02-06
        return year + "-" + month + "-" + day;
    },

    chatTopMes(packet){
        let isShow = packet[1];    
        let content = packet[2];
        //this.lbChatTop.node.parent.active = isShow;
        content = content.replace("<color=#00FFFC>" ,"<color=#FFDD21>");
        //this.lbChatTop.string = content;
    },  
    responsePlayerBet(packet){
        let monneyBet = packet[1];
        cc.log("money bet la " + monneyBet);
        // Global.MoneyUser.subMoney((monneyBet - this._curentMoneyBet))   //userAg -= ;
        // this._curentMoneyBet = monneyBet;
        //let monneyUser = packet[2];
        let gateBet = packet[4];
       
        
        if(monneyBet != 0){
            if(gateBet == 1) {
                // this.node.getChildByName("BoxBet2").getComponent(cc.Button).interactable = false;
                this.lbMyMonneyBetXiu.setMoney(monneyBet);
            }else{
                
                // this.node.getChildByName("BoxBet1").getComponent(cc.Button).interactable = false;
                this.lbMyMonneyBetTai.setMoney(monneyBet);
            }
        }
        MainPlayerInfo.setMoneyUser(packet[2]);
        this.keyBoard._lastBet = monneyBet;
        this.setCurrentBetTheir(packet[3]);
    },
    setCurrentBetTheir(packet){
        cc.log("chay vao dc den tan day")
        let data= JSON.parse(packet);
        this.lbPeopleTai.string = data.TotalAccount2;
        this.lbPeopleXiu.string = data.TotalAccount1;
        this.lbMoneyAllTai.setMoney(data.TotalBetValue2);
        this.lbMoneyAllXiu.setMoney(data.TotalBetValue1);
    },

    setHistory(packet){
        this._listHistory = [];
        for (let i = 0; i < packet.length; i++) {
            this._listHistory.push(JSON.parse(packet[i]));
        }
        this._curentObjGameSesionID = this._listHistory[0];
        this.emitViewHistoryData();
        if (this._gameStatus == 2 && this._objResult != null) {
            this.showResult(this._sum3Dice);
        }
    },   
    emitViewHistoryData(){
        this.resetCauView();
        let s = (this._listHistory.length )  < 12 ? this._listHistory.length : 12 ;
        if(s == 0) return;
        for(let i = s - 1; i >=0 ; i-- ){
            let node = this.getCauPool();
            this.nodeHistory.addChild(node);
            node.active = true;
            node.getComponent("ObjCau").setInfo(this._listHistory[i])
        }
      
        if(Global.SoiCauTaiXiu && Global.SoiCauTaiXiu.node.active) Global.SoiCauTaiXiu.emitNewcau();
    },
    resetCauView(){
        let length = this.nodeHistory.childrenCount;
        let children = this.nodeHistory.children
        for(let i = 0 ; i < length ; i++){
            this.poolCau.put(children[0]);
        }
    },

    resetChat(){
        let children = this.scrListChat.content.children;
        let length =     children.length;

        for(let i = 0 ; i < length ; i++){
            this.poolChat.put(children[0]);
        }
    },

    setHistoryChat(packet){
        this.resetChat();
        //this.scrListChat.resetScr();
        let list = [];
        let length = packet.length;
        let sumHeight = 0;

        let i = length - 13 < 0 ? 0 : length - 13 ;
        let parentChat = this.scrListChat.content;
        for(i ; i < length ; i++){
            let item = this.getChatPool();
            let data = JSON.parse(packet[i]);
            item.getComponent("ItemChatTaiXiu").initItem(data);
            parentChat.addChild(item);
        }
        this.scrListChat.scrollToBottom(0.2);
        //this.scrListChat.init(list , sumHeight , null);
    },
    addChat(packet){
        let nickName = packet[1];
        let content = packet[2];
        let vip = packet[3];
        let isAdmin = packet[4];
        let vipTopTanLoc = packet[5];
        let data = {
            VipLevel : vip,
            Nickname : nickName,
            ChatContent :content,
            IsAdmin :isAdmin,
            IsTopProfitSharing: vipTopTanLoc
        }
        
        let parentChat = this.scrListChat.content;
        if(parentChat.childrenCount > 50 ){
            this.poolChat.put(parentChat.children[0]);
        }
        let item = this.getChatPool();
        item.getComponent("ItemChatTaiXiu").initItem(data);
        parentChat.addChild(item);
        // let offset = vip > 2 ? 4 : 3;
        // let sumLength = offset + data.Nickname.length + data.ChatContent.length; 
        // let height = 25 * (parseInt( sumLength / 27) + 1);
        // data.height = height;

       // this.scrListChat.addItem(data);
       if(!this._isStateWatting){
        this.nodeMoveToChat.active = false;
        this.scrListChat.stopAutoScroll();
        this.scrListChat.scrollToBottom(0.2);
        this._currentChatMiss = 0;
    }else{
        this.nodeMoveToChat.active = true;
        this._currentChatMiss++;
        let lbStringMissChat = this.nodeMoveToChat.getComponentInChildren(cc.Label);
        if(lbStringMissChat ) lbStringMissChat.string = this._currentChatMiss.toString();
    }
    },

    addListHistory(obj){
        let lastSesion = this._listHistory[0].GameSessionID + 1
        cc.log("check ver moi nhat : ", lastSesion)
        obj.GameSessionID = lastSesion;
        obj.DiceSum =  this._sum3Dice;
        this._curentObjGameSesionID = obj;
        this._listHistory.unshift(obj);
    },
    viewInfoSesion(info , item){
        this.objInfoSesion.node.active = true;
        this.objInfoSesion.setInfo(info);
        let worldPos = item.parent.convertToWorldSpaceAR(item.position);
        let viewPos = this.node.convertToNodeSpaceAR(worldPos);
        this.objInfoSesion.node.setPosition(viewPos.x ,viewPos.y - 55);
    },

    offInfo(){
        this.objInfoSesion.node.active = false;
    },

    finishEffect(packet) {
        this.funDelay = setTimeout(() => {
            cc.log("gia tri game stat " + this._gameStatus);
            if (this._gameStatus == 0) return;
            this.isResult = true;
            let obj = JSON.parse(packet);
            this._objResult = obj;
            this.parentDice.active = true;
            let arr = this.parentDice.getComponentsInChildren(sp.Skeleton);
            let length = arr.length;
            let strGet = "Dice";
            this._sum3Dice = 0;
            let nodeBat = this.node.getChildByName("batup");
            nodeBat.getComponent("BatDrag")._isDragBat = false;
            for (let i = 0; i < length; i++) {
                let num = obj[strGet + (i + 1)];
                this._sum3Dice += num;
                // arr[i].spriteFrame = this.listSpriteDice[num- 1];
                // cc.log("check animation dice name : ",  this.getAnimationDiceEnd(num- 1))
                arr[i].setAnimation(0, this.getAnimationDiceStart(num), false);

                this.playSpine(arr[i].node, this.getAnimationDiceStart(num), false, ()=>{
                    nodeBat.getComponent("BatDrag")._isDragBat = true;
                })

            }
            this.addListHistory(this._objResult);
         
            if (this._objResult != null) {
                // if(!this.parentDice.active) this.animationXucXac.node.active = true;
                // this.animationXucXac.setAnimation(0 , "animation" , false);
                this.node.getChildByName("nodeLbCoundown").getChildByName("light_cirle").active = false;
            }



            this.funInfo = setTimeout(() => {
                // this.animationXucXac.node.active = false;
                //    if(this._sum3Dice != 0) this.parentDice.active = true;
                if (this._objResult != null) {
                    if (!this._isHand) {
                        setTimeout(() => {
                            this.showResult(this._sum3Dice);
                        }, 3000);

                    }
                }
                if (this._isHand) {
                    nodeBat.active = true;
                    nodeBat.setPosition(-1.115, 80.813);
                }
            }, 1000)
        }, 1000)
    },

    playSpine(nAnim , animName, loop, func) {
        let spine = nAnim.getComponent(sp.Skeleton);
        let track = spine.setAnimation(0, animName, loop);
        if (track) {
            // Register the end callback of the animation
            spine.setCompleteListener((trackEntry, loopCount) => {
                let name = trackEntry.animation ? trackEntry.animation.name : '';
                if (name === animName && func) {
                    func && func(); // Execute your own logic after the animation ends
                }
            });
        }
    },

    effectScaleResult(sum){
        if (sum == 0) return;

        this.nodeEffectResult.active = true;
        this.nodeXiu.stopAllActions();
        this.nodeXiu.scale = 1;
        this.nodeTai.stopAllActions();
        this.nodeTai.scale = 1;
        let node = null ;
        if(this._sum3Dice < 11){
            node = this.nodeXiu
        }else{
            node = this.nodeTai;

        }
        let nodeSum = cc.find("nodeLbCoundown/bg_elipse2" , this.node);
        this.nodeEffectResult.position = node.position;
        let action1 = cc.scaleTo(0.08, 1.07);
        let action2 = cc.scaleTo(0.08, 0.93);
        node.runAction(cc.repeatForever(cc.sequence(action1, action2)));
        nodeSum.getComponentInChildren(cc.Label).string = this._sum3Dice;
        nodeSum.active = true;
    },

    showResult(sum) {
        if (sum == 0) return;

        let msg = {}
        msg[1] = "";
        cc.log("send get du day top : ",msg);
        require("SendRequest").getIns().MST_Client_TaiXiu_Get_Top_Win_Lose_Chain(msg);
        
        let nodeSum = cc.find("nodeLbCoundown/bg_elipse2" , this.node);
        nodeSum.getComponentInChildren(cc.Label).string = this._sum3Dice;
        nodeSum.active = true;

        this.eftai.active = true;
        this.efxiu.active = false;

        this.nodeTai.active = false;
        this.nodeXiu.active = false;
        if (this._sum3Dice >= 11) {

            this.eftai.active = true;

            this.eftai.runAction(cc.repeatForever(cc.spawn(
                cc.sequence(cc.scaleTo(0.3, 0.8, 1.0), cc.scaleTo(0.3, 1.1, 1.3)),
                cc.sequence(cc.tintTo(0.3, 255, 255, 255), cc.tintTo(0.3, 255, 255, 255))
            )));
            this.nodeTai.active = false;
            this.nodeXiu.active = true;

        } else {

            this.efxiu.active = true;
            this.eftai.active = false;
            this.efxiu.runAction(cc.repeatForever(cc.spawn(
                cc.sequence(cc.scaleTo(0.3, 0.8, 1.0), cc.scaleTo(0.3, 1.1, 1.3)),
                cc.sequence(cc.tintTo(0.3, 255, 255, 255), cc.tintTo(0.3, 255, 255, 255))
            )));

            this.nodeTai.active = true;
            this.nodeXiu.active = false;

        }

    },

    stopWin() {
        this.eftai.active = false;
        this.efxiu.active = false;
        this.nodeTai.active = true;
        this.nodeXiu.active = true;

        this.efxiu.stopAllActions();
        this.efxiu.runAction(cc.spawn(cc.scaleTo(0.3, 1.0, 1.2), cc.tintTo(0.3, 255, 255, 255)));

        this.eftai.stopAllActions();
        this.eftai.runAction(cc.spawn(cc.scaleTo(0.3, 1.0, 1.2), cc.tintTo(0.3, 255, 255, 255)));
    },

    getAnimationDiceEnd(dice) {
        var anim = "";
        if (dice == 1) anim = "dice1_res1_hold";
        else if (dice == 2) anim = "dice1_res2_hold";
        else if (dice == 3) anim = "dice1_res3_hold";
        else if (dice == 4) anim = "dice1_res4_hold";
        else if (dice == 5) anim = "dice1_res5_hold";
        else if (dice == 6) anim = "dice1_res6_hold";
        return anim;
      },

      getAnimationDiceStart(dice) {
        var anim = "";
        if (dice == 1) anim = "dice1_res1";
        else if (dice == 2) anim = "dice1_res2";
        else if (dice == 3) anim = "dice1_res3";
        else if (dice == 4) anim = "dice1_res4";
        else if (dice == 5) anim = "dice1_res5";
        else if (dice == 6) anim = "dice1_res6";
        return anim;
      },

    getAcountResult(packet){

        let moneyUser = packet[2];
        let data = JSON.parse(packet[1]);
        let bonusReward = data.BonusReward; //tiền thưởng đu dây
        let refund = data.RefundValue;
        let winValue = data.PrizeValue - data.BetValue + refund;
        let str = "";

        var TextConfigTaiXiu = {
            HoanSao:"Hoàn %n Win",
            WinTaiXiu:"Thắng %n Win",
            LostTaiXiu:"Thua %n Win",
        }

        let timeSchedule = 0;

        cc.log("check tien bonus du day : ", bonusReward)
        if (bonusReward > 0) {
            this.effectThongBaoCuoiGame("Bạn nhận được tiền event đu dây: " + Global.formatNumber(bonusReward));
            timeSchedule = 2;
        }

        this.scheduleOnce(()=>{

            if (data.PrizeValue > 0){
                str = TextConfigTaiXiu.WinTaiXiu.replace("%n", Global.formatNumber(data.PrizeValue));
                this.effectThongBaoCuoiGame(str);
            }
        }, timeSchedule)


        Global.LobbyView.OnUpdateMoney(moneyUser);
         
        // Global.MoneyUser.pushDelayMoney(GAME_TYPE.TAI_XIU , moneyUser);
        // Global.MoneyUser.removeDelay(GAME_TYPE.TAI_XIU , data.PrizeValue + refund);
    //     if(data.BetValue  < 1) return;
    //     if (data.RefundValue > 0)
    //     str = TextConfigTaiXiu.HoanSao.replace("%n",Global.formatNumber(refund) );
    //     if( winValue <= 0){
    //         if(str != "")  this.effectThongBaoCuoiGame(str , winValue < 0);
    //         return;
    //     } 
    //    if (data.PrizeValue > 0)
    //    str = TextConfigTaiXiu.WinTaiXiu.replace("%n" , Global.formatNumber(winValue)  );
    //     this.effectThongBaoCuoiGame(str , winValue < 0);
    },

    effectThongBaoCuoiGame(str , isLost = false){
        let node = this.textEffect.node.parent;
        cc.Tween.stopAllByTarget(node);
        let str2 = "<b>%n</b>".replace("%n" , str);
       this.textEffect.string = str2;
       node.active = true;
       node.opacity = 0;
        let action1 = cc.fadeIn(0.5);
        let action2 = cc.delayTime(3);
        let action3 = cc.fadeOut(0.5);
        node.runAction(cc.sequence(action1,action2 , action3 , cc.callFunc(()=>{
            node.active = false;
        })))

    },
    onClickBtnSendChat(event ,data){
        let str = this.edbChatTaiXiu.string;
        str = str.trim();
        if(str == ""){
            this.edbChatTaiXiu.string = "";
            return;
        } 
        let msg = {};
        msg[1] = str;
        require("SendRequest").getIns().MST_Client_TaiXiu_Chat(msg);
        this.edbChatTaiXiu.string = "";
    },
    onClickHand(){
        this.node.getChildByName("btn_hand").children[0].active = this._isHand;
        this._isHand = !this._isHand;
    },

    onClickTopWinner(event , data){
        Global.UIManager.closeAllPopup();
        Global.UIManager.showMiniLoading();
        // let isCheckShowTab = data;
        if(Global.TopVinhDanh){
            Global.TopVinhDanh.show();
        }else{
            let bundle = cc.assetManager.getBundle(this.gameType.toString());
            bundle.load("Prefabs/TopVinhDanh" , (err , prefab)=>{
                if(err) return;
                let item = cc.instantiate(prefab).getComponent("TopVinhDanh");
                Global.UIManager.parentPopup.addChild(item.node);
                Global.TopVinhDanh.show();
            })
        }
      
        
        Global.UIManager.showMark();
    },

    onClickTheLeDuDay(event , data){
        Global.UIManager.closeAllPopup();
        Global.UIManager.showMiniLoading();
        if(Global.HDDuDay){
            Global.HDDuDay.show();
        }else{
            let bundle = cc.assetManager.getBundle(this.gameType.toString());
            bundle.load("Prefabs/HuongDanDuDay" , (err , prefab)=>{
                if(err) return;
                let item = cc.instantiate(prefab).getComponent("HuongDanDuDay");
                Global.UIManager.parentPopup.addChild(item.node);
                Global.HDDuDay.show();
            })
        }
      
        
        Global.UIManager.showMark();
    },

    onClickShowTopDuDay(event){
        Global.UIManager.closeAllPopup();
        if(Global.TopDuDay){
            Global.TopDuDay.show();
        }else{
            Global.UIManager.showMiniLoading();
            let bundle = cc.assetManager.getBundle(this.gameType.toString());
            bundle.load("Prefabs/TopDuDay" , (err , prefab)=>{
                if(err) return;
                Global.UIManager.parentPopup.addChild(cc.instantiate(prefab));
                Global.TopDuDay.show();
            })
        }
       
        
        // Global.UIManager.showMark();
    },

    onClickSoiCau(event){
        Global.UIManager.closeAllPopup();
        Global.UIManager.showMiniLoading();
        if(Global.SoiCauTaiXiu){
            Global.SoiCauTaiXiu.show();
        }else{
            let bundle = cc.assetManager.getBundle(this.gameType.toString());
            bundle.load("Prefabs/SoiCauTaiXiu" , (err , prefab)=>{
                if(err) return;
                Global.UIManager.parentPopup.addChild(cc.instantiate(prefab));
                Global.SoiCauTaiXiu.show();
            })
        }
       
        
        // Global.UIManager.showMark();
    },
    onClickHuongDanChoi(event , data){
        Global.UIManager.closeAllPopup();
        if(Global.HuongDanChoiTaiXiu){
            Global.HuongDanChoiTaiXiu.show();
        }else{
            let bundle = cc.assetManager.getBundle(this.gameType.toString());
            Global.UIManager.showMiniLoading();
            bundle.load("Prefabs/HuongDanChoi" , (err , prefab)=>{
                if(err) return;
                Global.UIManager.parentPopup.addChild(cc.instantiate(prefab));
                Global.HuongDanChoiTaiXiu.show();
            })
        }
        Global.UIManager.showMark();
        
    },
    onClickBtnChat(){
        Global.UIManager.closeAllPopup();
        let nodeChat = this.node.getChildByName("bg_chat");
        nodeChat.active = true;
        this.scrListChat.stopAutoScroll();
        this.scrListChat.scrollToBottom(0.2);
    },

    onClickCloseChat(){
        let nodeChat = this.node.getChildByName("bg_chat");
        nodeChat.active = false;
    },

    onClickBtnScrChat(){
        cc.log("chay vao click tbn")
        this._currentChatMiss = 0;
        this.scrListChat.stopAutoScroll();
        this.scrListChat.scrollToBottom(0.2);
    },

    onClickChiTietPhien(){
        if(this._curentObjGameSesionID == null) return;
        Global.TaiXiu._curentGameSesionCau = this._curentObjGameSesionID.GameSessionID;
        Global.UIManager.showMiniLoading();
        if(Global.ChiTietPhienTaiXiu){
            Global.ChiTietPhienTaiXiu.setInfo(this._curentObjGameSesionID);
            Global.ChiTietPhienTaiXiu.show();
        }else{
            let bundle = cc.assetManager.getBundle(this.gameType.toString());
            bundle.load("Prefabs/ChiTietPhien" , (err , prefab)=>{
                if(err) return;
                let node = cc.instantiate(prefab);
                node.getComponent("ChiTietPhienTaiXiu").setInfo(this._curentObjGameSesionID);
                Global.UIManager.parentPopup.addChild(node);
                Global.ChiTietPhienTaiXiu.show();
            })
        }
        Global.UIManager.showMark();
    },
    onClickTienTri(){
        Global.UIManager.showPopupEvent();
    },
    onClickHistoryTaiXiu(event){
        Global.UIManager.showMiniLoading();
        if(Global.HistoryTaiXiu){
            Global.HistoryTaiXiu.show();
        }else{
            let bundle = cc.assetManager.getBundle(this.gameType.toString());
            bundle.load("Prefabs/HistoryTaiXiu" , (err , prefab)=>{
                if(err) return;
                Global.UIManager.parentPopup.addChild(cc.instantiate(prefab));
                Global.HistoryTaiXiu.show();
            })
        }
        Global.UIManager.showMark();
    },
    onClickBtnTanLoc(){
        Global.UIManager.showTanLoc();
    },
    onClickTopChat(){
        //let str = this.lbChatTop.string;
         Global.MoneyUser.openLinkWithDetecURL(str);
        //;
    },
    update (dt) {
        this.updateTimer += dt;
        if (this.updateTimer < this.updateInterval) return; // we don't need to do the math every frame
        this.updateTimer = 0;
        let contentHeight = this.content.height;

       
        if(this.content.y >= contentHeight - this.scrListChat.node.height/2 -10){
            this._isStateWatting = false;
            this.nodeMoveToChat.active = false;
             
        }else{
            
            if(!this.nodeMoveToChat.active) this.nodeMoveToChat.getComponentInChildren(cc.Label).string = "";
            this.nodeMoveToChat.active = true;
             
            this._isStateWatting = true;
        }
    

    },
});
