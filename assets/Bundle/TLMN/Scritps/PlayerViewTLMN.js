cc.Class({
    extends: cc.Component,

    properties: {
        listPosMoney : [cc.Vec2],
        listPosClock : [cc.Vec2],
        infoBox : cc.Node,
        infoBoxIsMe : cc.Node,
        _isPlaying:false,
        _nameUser:"",
        _gold:0,
        _isMe: false,
        _chipWin: 0,
        _chipLose: 0,
        id:0,
        showTip: 0,
        iconCard:null,
        indexInTable:0,
        nodeEmoji:null,
        nodeText:null,
        suggestTip: null,
        randomColor: null,
        fullName: null,
        position:-1,
        listCard:[],
        listChip:[],
        listCardCurrentSlect:[],
        listCardQuickPlay:[],
        listCardIdForReconnect:[],
        numberCard:0,
        isFrirtTurn :false,
        isTurn :false,
        nameUser:{
            get(){
                return this._nameUser
            },
            set(value){
                this._nameUser = value;
                this.lbName.string = this._nameUser;
                this.lbNameIsMe.string = this._nameUser;
            }
        },

        gold:{
            get(){
                return this._gold;
            },
            set(value){
                this._gold = value;
                if(this.node)
                    this.lbGold.setMoney(value);
                    this.lbGoldIsMe.setMoney(value);
           
            }
        },

        listPosToiTrang : [cc.Vec2],    
        lbName:cc.Label,
        lbGold:require("LbMonneyChange"),
        lbNameIsMe:cc.Label,
        lbGoldIsMe:require("LbMonneyChange"),
        avatar:cc.Sprite,
        iconThoatBan:cc.Node,
        imgCountDown:cc.Sprite,
        fontWin:cc.Font,
        fontLose:cc.Font,
        spCong:cc.SpriteFrame,
        spAnTrang:cc.SpriteFrame,
        spThoi2:cc.SpriteFrame,
        spBoLuot:cc.SpriteFrame,
        _moneyEarnCardCahe:0,
        ani3Bich: cc.Node,
        aniThoi3Bich : cc.Node,
        winner : cc.Node,
        loser : cc.Node,
        txtBest : cc.Node,
        lbGoldWinLose : cc.Label,
        lbPoint : cc.Label,
        clock : cc.Node,
        listBgAvater : [cc.Node],
        lbTimeCountDown : cc.Label,
        listSpriteFramePlayerLevel : [cc.SpriteFrame],
        iconPlayerLevel : cc.Sprite,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        for (let i = 0; i < this.listPosClock.length; i++) {
            const objPos = this.listPosClock[i];
            objPos.y *= (cc.winSize.height / 1920);
        }
    },

    // start () {

    // },
    getCardById(id = -1 , isRemoveFromMe = false){
       for(let i = this.listCard.length - 1 ; i >=0 ; i--){
           let card = this.listCard[i];
           if(card.id == id){
                let indexOfCardSlect = this.listCardCurrentSlect.indexOf(card);
                if(indexOfCardSlect>-1) this.listCardCurrentSlect.splice(indexOfCardSlect , 1);

                if(isRemoveFromMe){
                    this.listCard.splice(i , 1);
                }

                return card;
           }
       }
       return null;
    },

    showAnimWin(){
        this.winner.active = true;
    },

    showAnimLose(){
        this.loser.active = true;
    },


    showAnimBest(){
        this.txtBest.active = true;
    },

    onClickAvata(){
        // if(this.indexInTable ==0) return ; // isMe
        // Global.GameView.showInfoPlayerTLMN(this.id);
    },
    initPlayer(data,isHistory = false){
        cc.log("data init player : ", data)
        this.id = data.AccountId;
        if(data.NickName){
            this.nameUser = data.NickName;
            this.fullName = data.NickName;
        }
        else{
            this.nameUser = "..."//data.NickName;
            this.fullName = "..."//data.NickName;
        }
      
        this.gold = data.Cash;
        this.position = data.Position;
        this.winType = data.WinType;
        this.indexInTable = 0;
        this._isPlaying = data.IsReady;
        this.updateAvata();
        if(data.NumberOfCards) this.numberCard = data.NumberOfCards;
        if(data.HandCards && data.HandCards.length > 0)this.listCardIdForReconnect = data.HandCards; 
        if(data.WinLoseCash) this.winLoseCash = data.WinLoseCash;

        this.randomColor = new cc.Color({r:Global.RandomNumber(0,255), g: Global.RandomNumber(0,255), b: Global.RandomNumber(0,255), a: 255});
        this.clock.active = false;
        this.lbTimeCountDown.node.active  =  false;
        // this.listBgAvater[0].active = true;
        if(this._isMe && !isHistory){
            this.infoBox.active = false;
            this.infoBoxIsMe.active = true;
        }
        else{
            this.infoBox.active = true;
            this.infoBoxIsMe.active = false;
        }
        if(data.PlayLevel > 0)
            this.iconPlayerLevel.spriteFrame = this.listSpriteFramePlayerLevel[data.PlayLevel - 1];
    },

    setPoint(point){
        this.lbPoint.string = point;
    },

    dangKyThoatBan(isStatus){
        cc.log("trang thai dang ky la " + isStatus);
        this.iconThoatBan.active = isStatus;
    },

    onChonCard(card){
        if(card.isSlect) return;
        this.listCardCurrentSlect.push(card);
        cc.log("check count show tip : ", this.showTip)
        if (this._isMe && this.listCardCurrentSlect.length >= 2 && this.isTurn && this.showTip < 3) {
            let lbTip = Global.TienLenMN.cardController.lbTip;
            let fxScale_01 = cc.tween().to(0.3, { scale: 1 });
            let fxScale_02 = cc.tween().to(0.3, { scale: 1.1 });
            let fxScale = cc.tween().then(fxScale_01).then(fxScale_02);
            cc.tween(lbTip)
                .delay(2)
                .call(()=>{
                    lbTip.scale = 1;
                })
                .to(0.3 , {scale:1})
                .to(0.3 , {scale:1.1})
                .call(()=>{
                    this.showTip++;
                })
                .repeat(10, fxScale)
                .start()
        }
        card.onSlectCard();
    },
    boLuot(){
        if(this.nodeBoLuot) return;
        let node = this.creatNodeWithSp(this.spBoLuot);
        this.node.addChild(node);
        node.position = cc.v2(this.avatar.node.parent.position.x, this.avatar.node.parent.position.y + 100);
        this.nodeBoLuot = node;
        this.avatar.node.color = cc.Color.GRAY;

        this.boChonAllCard();
    },

    hideWinLose(){
        this.winner.active = false;
        this.loser.active = false;
        this.txtBest.active = false;
    },

    resetNewturn(){
        if(this.nodeBoLuot) this.nodeBoLuot.destroy();  
        this.nodeBoLuot = null;
        this.avatar.node.color = cc.Color.WHITE;
        this.winner.active = false;
        this.loser.active = false;
        this.txtBest.active = false;
        if(this.nodeMoneyChangeEndGame) this.nodeMoneyChangeEndGame.active = false;
        this.nodeMoneyChangeEndGame = null;
    },
    boChonCard(card){
        if(!card.isSlect) return;
        let index = this.listCardCurrentSlect.indexOf(card);
        if(index > -1)  this.listCardCurrentSlect.splice(index , 1);
        card.unSlectCard();

        if (this.listCardCurrentSlect.length <= 1) {
            Global.TienLenMN.cardController.lbTip.scale = 0;
            cc.Tween.stopAllByTarget(Global.TienLenMN.cardController.lbTip)
        }
    },
    boChonAllCard(){
        for(let i = 0 , l =  this.listCardCurrentSlect.length; i < l ; i++ ){
            this.boChonCard(this.listCardCurrentSlect[0]);
        }

        Global.TienLenMN.cardController.lbTip.scale = 0;
        cc.Tween.stopAllByTarget(Global.TienLenMN.cardController.lbTip)
    },
    getListIdCardSlect(){
        let listTemp = [];
        for(let i = 0 , l =  this.listCardCurrentSlect.length; i<l;i++ ){
            listTemp.push(this.listCardCurrentSlect[i]);
        }

        listTemp.sort((a, b)=> a.node.zIndex - b.node.zIndex )
        let listReturn = [];

        for(let i = 0 , l =listTemp.length ; i  < l ; i++ ){
            listReturn.push(listTemp[i].id)
        }

        return listReturn;
    },

    getListIdCurrentCard(){
        let listReturn = [];
        for(let i = 0 , l =  this.listCard.length; i<l;i++ ){
            listReturn.push(this.listCard[i].id);
        }
        return listReturn;
    },
    sortCardWithListCardId(listCardId){
        for(let i = 0 , l = listCardId.length; i < l ; i ++){
            let id = listCardId[i];
            let temp = this.listCard[i];
            for(let c = 0 , l2 = this.listCard.length; c < l2 ; c ++){
                if(id == this.listCard[c].id){
                    this.listCard[i] = this.listCard[c];
                    this.listCard[c] = temp;
                    break;
                }
            }
        }
    },

    changeMoney(money){
        if(money == 0) return;
        this._moneyEarnCardCahe += money;
        let font = money > 0 ? this.fontWin : this.fontLose;
        let node = new cc.Node();
        let lb = node.addComponent(cc.Label);
        lb.fontSize = 25;
        lb.font = font;
        lb.spacingX = -10;
        let strTem = money<0 ? "" : "+";
        lb.string =  strTem + Global.formatNumber(money);
        node.scale = 0;
        node.y = 50;
        this.node.addChild(node);
        node.opacity = 0;
        node.position = this.avatar.node.parent.position;
        cc.tween(node)
        .parallel(
            cc.tween().to(3 , {y: 180}),
            cc.tween().to(0.5 , {scale:1 , opacity : 255}),
        )
        .call(()=>{
            node.destroy();
            this.nodeMoneyChange = null;
        })
        .start();
      //  this.gold += money;

        this.nodeMoneyChange = node;
    },
    changeMoneyEndGame(money, isHistory = false){
        if(money == 0) return;
        cc.log("chay vao show text : ", this.indexInTable)
        let font = money > 0 ? this.fontWin : this.fontLose;


        let node = this.lbGoldWinLose.node.parent;

        node.active = true;

        this.lbGoldWinLose.fontSize = 25;
        this.lbGoldWinLose.spacingX = -10;
        this.lbGoldWinLose.font = font;
        let strTem = money<0 ? "" : "+";
        this.lbGoldWinLose.string =  strTem + Global.formatNumber(money);
        node.scale = 0;
        node.position = this.listPosMoney[this.indexInTable];

        if(isHistory && this.indexInTable === 0){
            node.position = cc.v2(270, 0)
        }

        cc.tween(node)
        .to(0.3 , {scale : 1 })
        .start();
        this.nodeMoneyChangeEndGame = node;
    },
    updateAvata(){
         Global.GetAvataById(this.avatar,this.id)
    },
    
    setTurn(time){
        cc.log("check count show tip : ", this.showTip)
        // this.clock.active = true;
        this.unschedule(this.funClock)
        this.lbTimeCountDown.node.active = true;
        if(this._isMe){
            this.clock.scale = 2;
        }
        else{
            this.clock.scale = 1;
        }
        let lbClock = this.clock.getChildByName("lbClock").getComponent(cc.Label);
        this.clock.position = this.listPosClock[this.indexInTable];
        if (this.listCardCurrentSlect.length >= 2 && this._isMe && this.showTip < 3) {
            let lbTip = Global.TienLenMN.cardController.lbTip;
            let fxScale_01 = cc.tween().to(0.3, { scale: 1 });
            let fxScale_02 = cc.tween().to(0.3, { scale: 1.1 });
            let fxScale = cc.tween().then(fxScale_01).then(fxScale_02);
            cc.tween(lbTip)
                .delay(2)
                .call(()=>{
                    lbTip.scale = 1;
                })
                .to(0.3, { scale: 1 })
                .to(0.3, { scale: 1.1 })
                .call(()=>{
                    this.showTip++;
                })
                .repeat(10, fxScale)
                .start()
        }


        this.isTurn = true;

        cc.tween(this.node)
            .to(0.08, { scale: 1.1 })
            .to(0.08, { scale: 1 })
            .start();
        this.imgCountDown.node.active = true;
        this.imgCountDown.fillRange = 1;
        lbClock.string = time;
        this.lbTimeCountDown.string = time;
        this.schedule(this.funClock = ()=>{      
            time--;
            lbClock.string = time;
            this.lbTimeCountDown.string = time;
            if(time < 0){
                this.lbTimeCountDown.node.active = false;
                this.unschedule(this.funClock)
            } 
        }, 1)
        cc.tween(this.imgCountDown)
            .to(time, { fillRange: 0 })
            .call(() => {
                this.imgCountDown.node.active = false;
            })
            .start();
        if (this._isMe) {
            Global.AudioManager.playTurn();
            this.scheduleOnce(this.funPlaySOund = () => {
                Global.AudioManager.playCountDown();
            }, time - 3);
        }
    },

    onDestroy(){
        cc.Tween.stopAllByTarget(this.node);
        cc.systemEvent.emit('playerDestroyed');
    },

    checkCard(){
        let playerCheck = null;
        for (let i = 0; i < Global.TienLenMN.players.length; i++) {
            const player = Global.TienLenMN.players[i];
            if(player){
                if(player.indexInTable === 1){
                    playerCheck = player;
                    break;
                }
            }
        }
        if(playerCheck === null){
            for (let i = 0; i < Global.TienLenMN.players.length; i++) {
                const player = Global.TienLenMN.players[i];
                if(player){
                    if(player.indexInTable ===2){
                        playerCheck = player;
                        break;
                    }
                }
            }
        }

        if (playerCheck) {
            if (playerCheck.listCard.length === 1) {

                let listIdCard = [];
                for (let i = 0; i < Global.TienLenMN.isMe.listCard.length; i++) {
                    const card = Global.TienLenMN.isMe.listCard[i];
                    listIdCard.push(card.id);
                }

                /*Tìm max trong mảng bằng Array reduce */
                let max_val = listIdCard.reduce(function (accumulator, element) {
                    return (accumulator > element) ? accumulator : element
                });
                return max_val;
            }
        }
    },

    endTurn() {
        if(!this.node) return
        this.unschedule(this.funClock)
        this.clock.active = false;
        this.lbTimeCountDown.node.active  =  false;
        this.isTurn = false;
        if(this._isMe){
            this.unschedule(this.funPlaySOund);
            if(Global.AudioManager) Global.AudioManager.stopCountDown();
            Global.TienLenMN.cardController.resetCardNotAnIsMe();
        }
        Global.TienLenMN.nodeBtnPlay.active = false;
        this.imgCountDown.node.active = false;
        this.isFrirtTurn = false;
        cc.Tween.stopAllByTarget(this.node);
        cc.Tween.stopAllByTarget(this.imgCountDown);

    },
    unuse(){
        cc.Tween.stopAllByTarget(this.node);
        if(this.nodeEmoji) this.nodeEmoji.destroy();
        this.nodeEmoji = null;
        if(this.nodeText)  this.nodeText.destroy();
        this.nodeText = null;
        // this.endTurn();
        this._isMe = false;
        this.showTip = 0;
    },
   //removeCard()
    resetCard(gameView){
        if(this.nodeMoneyChangeEndGame) this.nodeMoneyChangeEndGame.active = false;
        if(this.nodeMoneyChange) this.nodeMoneyChange.destroy();
        if(this.nodeTypeWin){
            this.nodeTypeWin.destroy();
        } 
        if(this.nodeBoLuot)   this.nodeBoLuot.destroy();

        this.ani3Bich.active = false;
        this.aniThoi3Bich.active = false;
        this.winType = 0;
        
        this._moneyEarnCardCahe = 0;
        for(let i = 0 , l = this.listCard.length; i <l ; i++){
            if(gameView)
                gameView.pool.putCard(this.listCard[i].node);
        }
        this.avatar.node.color = cc.Color.WHITE;
        this.listCardCurrentSlect.length = 0;
        this.listCard.length = 0;
        this.listCardIdForReconnect.length = 0;
        this.numberCard = 0;
        this.nodeTypeWin = null;
        this.nodeMoneyChange = null;
        this.nodeMoneyChangeEndGame = null;
        this.nodeBoLuot = null;

    },
    creatNodeWithSp(spriteFrame){
        let node = new cc.Node();
        let cpSp = node.addComponent(cc.Sprite);
        cpSp.spriteFrame = spriteFrame;
        return node;
    },
    play3Bich(isWin){
        // cc.log("isWinLa " + isWin);
        if(this._isMe){
            if(isWin){
                cc.log("chay vao blue")
                Global.TienLenMN.ani3Bich.active = true;
                cc.tween(Global.TienLenMN.ani3Bich)
                .delay(2)
                .call(()=>{
                    Global.TienLenMN.ani3Bich.active = false;
                })
                .start();
            }else{
                cc.log("chay vao red")
                Global.TienLenMN.aniThoi3Bich.active = true;
                cc.tween(Global.TienLenMN.aniThoi3Bich)
                .delay(2)
                .call(()=>{
                    Global.TienLenMN.aniThoi3Bich.active = false;
                })
                .start();
            }
        }
        else{
            if(isWin){
                cc.log("chay vao blue")
                this.ani3Bich.active = true;
                cc.tween(this.ani3Bich)
                .delay(2)
                .call(()=>{
                   this.ani3Bich.active = false;
                })
                .start();
            }else{
                cc.log("chay vao red")
                this.aniThoi3Bich.active = true;
                cc.tween(this.aniThoi3Bich)
                .delay(2)
                .call(()=>{
                   this.aniThoi3Bich.active = false;
                })
                .start();
            }
        }
     },
    showTypeWin(){
        let node = new cc.Node();
        node.name = "spriteWin";
        node.anchor = cc.v2(0.5, 0.5);
        let cpSp = node.addComponent(cc.Sprite);
        let spriteFrame = null;
        let positionCard = Global.TienLenMN.cardController.listPosOpenCard[this.indexInTable];

        switch (this.winType) {
            case WinType.Cong:
                spriteFrame = this.spCong;
                node.scale = 2.5;
                node.position = positionCard;
                for (let i = 0, l = this.listCard.length; i < l; i++) {
                    this.listCard[i].setGrayCard();
                }
                Global.TienLenMN.parentPlayer.addChild(node);
                break;
            case WinType.WinWhite:
                spriteFrame = this.spAnTrang;
                node.position = Global.TienLenMN.listPos[this.indexInTable];
                if(this._isMe){
                    node.scale = 2.2;
                    node.position = cc.v2(0, 200)
                }             
                Global.TienLenMN.node.addChild(node);
                break;
            case WinType.Win:
                this.showAnimWin();
                break;
            case WinType.Best:
                this.showAnimBest();
                break;
            case WinType.Worst:
                this.showAnimLose();
                break;
        }

        cpSp.spriteFrame = spriteFrame;  
        cc.tween(node)
        .delay(2)
        .call(()=>{
            node.destroy();
        })
        .start();
    },

    showTextThoi2(){
        cc.log("chay vao show text thoi 2")
        let node = new cc.Node();
        node.name = "spriteWin";
        node.anchor = cc.v2(0.5, 0.5);
        let cpSp = node.addComponent(cc.Sprite);
        let spriteFrame = null;

        spriteFrame = this.spThoi2;

        node.position = cc.v2( Global.TienLenMN.cardController.listPosOpenCard[this.indexInTable].x,  Global.TienLenMN.cardController.listPosOpenCard[this.indexInTable].y - 160);
        node.scale = 0.6;
        if(this._isMe){
            node.scale = 1;
            node.position = cc.v2( Global.TienLenMN.cardController.listPosOpenCard[this.indexInTable].x,  Global.TienLenMN.cardController.listPosOpenCard[this.indexInTable].y +264);
        }             
        Global.TienLenMN.node.addChild(node);
        cpSp.spriteFrame = spriteFrame;  
        cc.tween(node)
        .delay(2)
        .call(()=>{
            node.destroy();
        })
        .start();
    },

});
