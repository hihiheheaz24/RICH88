var TypeAnCards = {
    None: -1,
    DoiThuong: 0,
    Sanh: 1,
    SamCo: 2,
    TuQuy: 3,
    DoiThong: 4,
    Thuong: 5,
}
var cardHelper = require("CardHelperNew");
cc.Class({
    extends: cc.Component,

    properties: {
        listPosFirtCard: [cc.Vec2],
        listPosOpenCard: [cc.Vec2],
        listPosDanhBai: [cc.Vec2],
        listPosDanhBaiBo: [cc.Vec2],
        skeCardType: sp.Skeleton,
        txtToiTrang : cc.Node,
        animDealCard : sp.Skeleton,
        lbTip : cc.Node,
        fontNumber : cc.Font
    },
    ctor() {
        this._cardHelper = null;
        this.listCardTurnPlayer = [];
        this.listCurrentIdCard = [];
        this.listNodeCardEffect = [];
        this.typeAnDuocCard = TypeAnCards.None;
        this.listIdCardGoiY = [];
        this.listReTurn = [];
        this.lengthCache = 0;
        this.isSuggest = true;
        this.countDanhBai = 0;
        this.listBoBaiDanh = [];
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.systemEvent.on('playerDestroyed', function () {
            // Ngưng gọi đến node hoặc thực hiện các bước khác cần thiết
        });
        for (let i = 0; i < this.listPosFirtCard.length; i++) {
            const objPos = this.listPosFirtCard[i];
            objPos.y *= (cc.winSize.height / 1920);
        }
        for (let i = 0; i < this.listPosOpenCard.length; i++) {
            const objPos = this.listPosOpenCard[i];
            objPos.y *= (cc.winSize.height / 1920);
        }
        this._cardHelper = new cardHelper();
        this.node.setContentSize(cc.winSize);
        this.cardStack = [];
    },
    onDestroy() {
        this._cardHelper.clear();
    },
    onEvent() {
        let orginPos = null;
        orginPos = cc.v2(0, 0)
      
        let player = Global.TienLenMN.isMe
        let listCard = player.listCard;
        for (let i = listCard.length - 1; i >= 0; i--) {
            let card = listCard[i];
            card.node.on(cc.Node.EventType.TOUCH_START, ()=>{
                if (!card.isSlect) {
                    player.onChonCard(card);
                    if (player.listCardCurrentSlect.length == 1 && !player.isFrirtTurn) this.suggestCard(card.id);
                    if (player.listCardCurrentSlect.length == 2 && player.isFrirtTurn) this.suggestWithListCard(player.getListIdCardSlect());
                }
                else{
                    player.boChonCard(card);
                }
            }, this);
            card.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);    

            card.node.on(cc.Node.EventType.TOUCH_MOVE, (touch)=>{
                let delta = touch.getDelta();
                orginPos.x += delta.x;
                orginPos.y += delta.y;
                if (Global.TienLenMN.nodeBtnPlay.active && !Global.isSendDanhBai) {
                    if (Math.sqrt(Math.pow(this.node.x - orginPos.x, 2)) >= 30
                        || Math.sqrt(Math.pow(this.node.y - orginPos.y, 2)) >= 30) {
                        Global.TienLenMN.onClickDanhBai();
                        Global.isSendDanhBai = true;
                    } else {
                        this.isMoving = false;
                        cc.log("is moving = false")
                    }
                }
            }, this);   
        }

    },
    offEvent() {
        let player = Global.TienLenMN.isMe
        let listCard = player.listCard;
        for (let i = listCard.length - 1; i >= 0; i--) {
            let card = listCard[i];
            card.node.off(cc.Node.EventType.TOUCH_START, this.onClickCard, this); 
            card.node.off(cc.Node.EventType.TOUCH_MOVE, ()=>{}, this); 
            card.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);    
        }
    },
    onClickCard(touch) {
        cc.log("ON TOUCH START !!! ");
        let v2Touch = cc.v2(touch.getLocation());
        let player = Global.TienLenMN.isMe
        let listCard = player.listCard;
        for (let i = listCard.length - 1; i >= 0; i--) {
            let card = listCard[i];
            if (card.node.getBoundingBoxToWorld().contains(v2Touch)) {
                if (!card.isSlect) {
                    player.onChonCard(card);

                    // // tuyen dev
                    // for(let j = i - 2; j <= i + 2; j++){
                    //     if(j >= 0 && j < listCard.length && i != j){
                    //         if(j == i - 1 || j == i + 1){
                    //             let subCard = listCard[j];
                    //             subCard.node.runAction(
                    //                 cc.sequence(
                    //                     cc.delayTime(0.2),
                    //                     cc.scaleTo(0.2,1.6).easing(cc.easeCubicActionOut()),
                    //                 )
                    //             )
                    //         }else{
                    //             let subCard = listCard[j];
                    //             subCard.node.runAction(
                    //                 cc.sequence(
                    //                     cc.delayTime(0.2),
                    //                     cc.scaleTo(0.2,1.5).easing(cc.easeCubicActionOut()),
                    //                 )
                    //             )
                    //         }
                    //     }
                    // }

                    // ////

                    if (player.listCardCurrentSlect.length == 1 && !player.isFrirtTurn) this.suggestCard(card.id);
                    if (player.listCardCurrentSlect.length == 2 && player.isFrirtTurn) this.suggestWithListCard(player.getListIdCardSlect());
                } else {
                    player.boChonCard(card);
                }
                break;
            }
        }
    },
    onTouchEnd(touch){
        cc.log("ON TOUCH END !!! ");
        let v2Touch = cc.v2(touch.getLocation());
    },
    onClickBoChonAllCard() {
        if(Global.TienLenMN.isMe){
            Global.TienLenMN.isMe.boChonAllCard();
        }
       
    },

    removeIconCard(player) {
        player.iconCard.destroy();
        player.iconCard = null;
    },
    creatCard(player = null, idCard = -1) {
        let nodeCard = Global.TienLenMN.pool.getCard();
        let cardComponent = nodeCard.getComponent("CardTLMN");
        cardComponent.setCardId(idCard);
        if (player) {
            player.listCard.push(cardComponent);
        }

        if(player !== Global.TienLenMN.isMe && player){
            let node = new cc.Node();
            let lbNumberCard = node.addComponent(cc.Label);
            node.parent = nodeCard;
            node.name = "lbNumberCard";
            node.position = cc.v2(0, 0)
           
            lbNumberCard.fontSize = 120;
            // if(player.indexInTable === 1 || player.indexInTable === 3)
            //     lbNumberCard.node.angle = 90
            lbNumberCard.font = this.fontNumber;
            lbNumberCard.lineHeight = 80;
            lbNumberCard.node.active = false;
            lbNumberCard.string = player.listCard.length;
        }
      
        this.node.addChild(nodeCard);
        return nodeCard;
    },
    
    effectChiaBai(data, playerCurrent) {
        //require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.sound_chiabai);
        let listPlayer = Global.TienLenMN.players
        let dataPlayers = data[TMN_ParameterCode.Players];
        let isMe = Global.TienLenMN.isMe
        this.cardStack = [];
        if (!isMe) return;
        // JSON.parse data 
        var dataMe = {};
        for (let i = 0; i < dataPlayers.length; i++) {
            if (!Global.TienLenMN.isTest) dataPlayers[i] = JSON.parse(dataPlayers[i]);
            if (isMe && dataPlayers[i].Position == isMe.position) {
                dataMe = dataPlayers[i];
                this._cardHelper.init(dataMe.HandCards);
            }
        }
        dataMe.HandCards.sort((a,b) => a - b);
        for (let i = 0; i < dataPlayers.length; i++) {
            let objData = dataPlayers[i];
            let player = Global.TienLenMN.getPlayerWithPosition(objData.Position);
            let cardLength = dataMe.HandCards;
            if (player === Global.TienLenMN.isMe) {
                player._isPlaying = true;
                for (let j = 0; j < objData.HandCards.length; j++) {
                    let numberCard = objData.HandCards[j];
                    let card = this.creatCard(player, numberCard);
                    card.position = cc.v2( i / 10, 60 + i / 6);
                    card.active = false;
                    this.cardStack.push(card);
                }
            }
            else {
                for (let j = 0; j < cardLength.length; j++) {
                    let card = this.creatCard(player);
                    card.position = cc.v2( i / 10, 60 + i / 6);
                    card.active = false;
                    this.cardStack.push(card);
                }
            }
            this.offEvent();
        }
        let action2 = () => {
            for (let i = 0; i < this.cardStack.length; i++) {
                let card = this.cardStack[i];
                card.active = false;
                card.scale = 0.7;
            }
            this.animDealCard.node.active = true;
            this.animDealCard.setAnimation(0, "animation", false);
        }

        let action3 = () => {
            cc.tween(this.node)
                .call(() => {
                    Global.AudioManager.playChiaBai();
                    for (let i = 0; i < this.cardStack.length; i++) {
                        let card = this.cardStack[i];
                        card.active = true;
                        card.scale
                    }
                    this.animDealCard.node.active = false;
                    let delay = 0;
                    let arrPosCard = [];
                    for (let i = 0; i < listPlayer.length; i++) {
                        const player = listPlayer[i];
                        if (player === null) continue;
                        delay = 0;


                        if(isMe){
                            this.arrangeCardChiaBai(this.listPosFirtCard[player.indexInTable].clone(), 13);
                            arrPosCard = this.listReTurn;    
                        }
                     
                        for (let j = 0; j < player.listCard.length; j++) {
                            const card = player.listCard[j];
                            card.active = true;
                            let posTarget = this.listPosFirtCard[player.indexInTable].clone();


                            if (player === isMe) {

                                let w = card.node.width * 0.5;
                                let l = player.listCard.length;

                                // posTarget.x = j * w - (((l - 1) * w) * 0.5) + w - 40;

                                cc.log("check pos chia bai : ", arrPosCard)
                                card.positionCache = cc.v2(arrPosCard[j].position.x, arrPosCard[j].position.y);
                                cc.tween(card.node)
                                    .delay(delay)
                                    .to(0.3, { scale: 1, position: cc.v2(arrPosCard[j].position.x, arrPosCard[j].position.y), angle: arrPosCard[j].angle }, { easing: "backOut" })
                                    .delay(0.5)
                                    .call(() => {
                                        card.getComponent("CardTLMN").openCardWithEffect();
                                    })
                                    .start();
                            }
                            else {
                                let posYValue = posTarget.y;
                                let posXValue = posTarget.x
                                if (player.indexInTable === 1) {
                                    posXValue = (posTarget.x - (j * 3))
                                }
                                if (player.indexInTable === 3) {
                                    posXValue = (posTarget.x + (j * 3))
                                }
                                if (player.indexInTable === 2) {
                                    posXValue = (posTarget.x - (j * 3))
                                }

                                cc.tween(card.node)
                                    .delay(delay)
                                    .to(0.3, { scale: 0.4, position: cc.v2(posXValue, posYValue), angle: 0 }, { easing: "expoOut" })
                                    .call(() => {
                                        card.node.getChildByName("lbNumberCard").active = true;
                                    })
                                    .start();
                            }
                            delay += 0.07;
                        }
                    }
                })
                .delay(3)
                .call(() => {
                    Global.AudioManager.stopChiaBai();
                    for (let i = 0; i < listPlayer.length; i++) {
                        let player = listPlayer[i];
                        if (player === null) continue;
                    }

                    this.getCardTheoBo();
                    if (!Global.TienLenMN.toiTrang) {
                        cc.log("co cahy vao dat turn")
                        Global.TienLenMN.nodeBtnXepBai.active = true;
                        if (playerCurrent == Global.TienLenMN.isMe) {
                            Global.TienLenMN.nodeBtnPlay.active = true;
                            Global.TienLenMN.checkActiveBtnPlay();
                            Global.TienLenMN.nodeBtnFoldCard.active = false;

                            cc.log("check first  suggest :",  playerCurrent.listCard[0].id)
                            let arrFirstSuggest = this._cardHelper.getArrByOneCard(playerCurrent.listCard[0].id)
                            cc.log("check first  suggest :",  arrFirstSuggest)
                            playerCurrent.listCardQuickPlay =  [];
                            if(arrFirstSuggest.length === 0){
                                arrFirstSuggest = [playerCurrent.listCard[0].id]
                            }
                            playerCurrent.listCardQuickPlay = arrFirstSuggest;
                        }
                        playerCurrent.setTurn(Global.TienLenMN.turnTime);
                        this.onEvent();
                    }
                })
                .start()
        }
            

        cc.tween(this.node)
        .delay(3.5)
        .call(action3)
        // .delay(2.5)
        // .call(action3)
        .start();
    },

    latBai(result) {
        let isMe = Global.TienLenMN.isMe;
        for (let i = 0, l = result.length; i < l; i++) {
            let temp = result[i];
            let tempCards = temp.HandCards;
            let position = temp.Position;
            let player = Global.TienLenMN.getPlayerWithPosition(position);
            cc.log("player cong la : ", player + "potition las : " + position)
            if (player == null) continue;
            if (player != isMe) {
                if(player.winType !== WinType.WinWhite)
                this.latBaiPlayer(player, tempCards);
            } else {
                this.checkFinishBaiMe();
            }

        }
        this.offEvent();
    },
    checkFinishBaiMe(){
        let isMe = Global.TienLenMN.isMe;
        let listCard =  isMe.listCard;
        let isThoi2 = false;
        for(let i = listCard.length - 1; i >= 0 ; i--){
            let card = listCard[i];
            if(isMe.winType != WinType.WinWhite){
                if (card.cardNumber != 2) card.setGrayCard(); // thoi' 2
                if (card.cardNumber == 2){
                    card.thoi2();
                    if(!isThoi2 && isMe.winType !== WinType.WinWhite && !Global.TienLenMN.toiTrang){
                        isMe.showTextThoi2();
                    }
                    isThoi2 = true;
                } 
            }
        }

        if(isMe.winType == WinType.BiChan3Bich || isMe.winType == WinType.Win3Bich){
            let isCheck = isMe.winType == WinType.Win3Bich ? true : false;
            isMe.play3Bich(isCheck);
        }
    },
    latBaiMe(arrIdCard) {
        cc.log("lat bai www : ", arrIdCard)
        // let arrPosCard = [];
        // this.arrangeCardChiaBai(this.listPosFirtCard[0].clone(), arrIdCard.length);
        // arrPosCard = this.listReTurn;  
        for (let i = 0; i < arrIdCard.length; i++) {
            let card = this.creatCard(Global.TienLenMN.isMe, arrIdCard[i]);
            // let posTarget = this.listPosFirtCard[0].clone();
            // posTarget.x += (c * card.width * 1);
            // posTarget.x += c * card.width * 0.75;
            // cc.log("checklist pos : ", arrPosCard);
            // card.position = cc.v2(arrPosCard[c].position.x, arrPosCard[c].position.y);
            // card.angle = arrPosCard[c].angle;
            let cardCp = card.getComponent("CardTLMN");
            // cardCp.positionCache = cc.v2(arrPosCard[c].position.x, arrPosCard[c].position.y);
            cardCp.openCard();
        }
    },

    latBaiPlayer(player, arrIdCard) {
        cc.log("chay vao lat bai player ... ", arrIdCard)
        arrIdCard.sort((a, b) => a - b);
        player.endTurn();
        let isShowThoi2 = false;
        let listCard = player.listCard;
        let posInTable = player.indexInTable;
        let posOpenCard = this.listPosOpenCard[posInTable].clone();
        let l = arrIdCard.length;
        let index = 0;
        for (let i = 0; i < arrIdCard.length; i++) {
            let card = listCard[i];
            if (card == null) {
                card = this.creatCard(player).getComponent("CardTLMN");
            }
            card.setCardIdAndOpen(arrIdCard[i]);
            card.node.angle = 0;
            if (card.cardNumber == 2){
                card.thoi2();
                if(!isShowThoi2 && player.winType !== WinType.WinWhite && !Global.TienLenMN.toiTrang){
                    card.showTextThoi2();
                }
                isShowThoi2 = true;
            }
            if (card.cardNumber != 2) card.setGrayCard(); // thoi' 2

            card.node.scale = 0.4;

            let w = card.node.width * 0.2;



            // let posX = posOpenCard.x + (i * w - (((l - 1) * w) * 0.5));

            let posX = 0;
          

            if(player.indexInTable === 1){
                if(index >= 7){
                    index = 0;
                    posOpenCard.y -= card.node.height * 0.4;
                }
                posX = posOpenCard.x - (index * w);
                card.node.zIndex = arrIdCard.length - index;
                card.node.position = cc.v2(posX, posOpenCard.y)
            }
            else{
                if(index >= 7){
                    index = 0;
                    posOpenCard.y -= card.node.height * 0.4;
                }
                posX = posOpenCard.x + (index * w);
                card.node.zIndex = index;
                card.node.position = cc.v2(posX, posOpenCard.y)
               
            }

            index++


        }

        if(player.winType == WinType.BiChan3Bich || player.winType == WinType.Win3Bich){
            let isCheck = player.winType == WinType.Win3Bich ? true : false;
            player.play3Bich(isCheck);
        }
        // danh cho truong hop bi loi
        if (arrIdCard.length < 1) return;
        for (let i = arrIdCard.length, l = listCard.length; i < l; i++) {
            let card = player.getCardById(null, true);
            if (card) Global.TienLenMN.pool.putCard(card.node);
        }
    },
    creatCardForReconnect(player) {
       
        let idCard = player.listCardIdForReconnect;
        let numCard = player.numberCard;
        if (player == Global.TienLenMN.isMe) {  // me
            cc.log("chay vao creatCardForReconnect " +  player.listCardIdForReconnect)
            this.latBaiMe(player.listCardIdForReconnect);
            this._cardHelper.clear();
            this._cardHelper.init(player.listCardIdForReconnect);
            this.getCardTheoBo();
            this.onEvent();
            this.sortCardMe();
            return;
        }
        if (idCard.length > 0) {             // dang show bai so diem
            this.latBaiPlayer(player, idCard);
            return;
        }
        let posTarget = this.listPosFirtCard[player.indexInTable]; // dang choi
        for (let i = 0; i < numCard; i++) {
            let card = this.creatCard(player);
            
            card.getChildByName("lbNumberCard").active = true;

    
            let posYValue = posTarget.y;
            let posXValue = posTarget.x
            if (player.indexInTable === 1){
                posXValue = (posTarget.x - (i * 3))
            }
            if (player.indexInTable === 3){
                posXValue = (posTarget.x + (i * 3))
            }
            if (player.indexInTable === 2){
                posXValue = (posTarget.x - (i * 3))
            }
    
            card.position = cc.v2(posXValue, posYValue);
            card.scale = 0.4;
            card.angle = 0;
           
        }
    },
    creatCardInTableForReConnect(listIdCard) {
        let listCardTurn = [];
        cc.log("check lisr card in table : ")
        let posCardAtackInTable = cc.v2(10, 20);
        let posCardAtackInTableBo = cc.v2(0, 60);

        for (let i = 0, l = listIdCard.length; i < l; i++) {
            let cardCp = this.creatCard(null, listIdCard[i]).getComponent("CardTLMN");
            cardCp.setGrayCard();
            cardCp.openCard();
            cardCp.node.scale = 0.9;
            this.listCardTurnPlayer.push(cardCp);

            this.arrangeCard(cc.v2(0, 0), listIdCard);
            let isSanh = this._cardHelper.isSanh(listIdCard);
            let pos = null;
            let arrCard = this.listReTurn;

            if(isSanh){
                pos = posCardAtackInTableBo.add(arrCard[i].position)
            }
            else{
                pos = posCardAtackInTable.add(arrCard[i].position)
            }

            cardCp.node.position = pos;
            cardCp.node.angle = arrCard[i].angle;

            listCardTurn.push(cardCp.node);
        }

        this.listBoBaiDanh.unshift(listCardTurn);
    },
    danhBai(player, listIdCard) {
        this.isSuggest = true;
        let isMe = Global.TienLenMN.isMe;

        let listCardTurn = [];
       

        let posCardAtackInTable = cc.v2(10,70);
        let posCardAtackInTableBo = cc.v2(0, 110);

        this.arrangeCard(cc.v2(0, 0), listIdCard);
        let arrCard = this.listReTurn;

        this.listCurrentIdCard = listIdCard.slice();

        if(player == isMe){
            this.lbTip.scale = 0;
            cc.Tween.stopAllByTarget(this.lbTip);
            this._cardHelper.removeIds(listIdCard);
        }
        for (let i = 0, l = listIdCard.length; i < l; i++) {
            let card = null;
            if (isMe == player) {
                card = player.getCardById(listIdCard[i], true);
                this.diChuyenCard(true);
            } else {
                card = player.getCardById(-1, true);
                card.setCardIdAndOpen(listIdCard[i]); 
            }

            card.node.off(cc.Node.EventType.TOUCH_START);
            card.node.off(cc.Node.EventType.TOUCH_MOVE);
            card.node.off(cc.Node.EventType.TOUCH_END);

            listCardTurn.push(card.node);

            cc.Tween.stopAllByTarget(card.node);
            
            card.node.angle = 0;
            card.node.scale = 1;

            let isSanh = this._cardHelper.isSanh(listIdCard)
            let posTarget = null;
            let scaleDown = 0.9;  // Scale nhỏ khi đánh bài

            if(isSanh){
                posTarget = posCardAtackInTableBo.add(arrCard[i].position)
                cc.tween(card.node)
                .parallel(
                    cc.tween().to(0.05 * i + 0.5, { position: posTarget, scale: 1.2 }, { easing: 'expoOut' }),  // Di chuyển và scale lớn với easing expoOut
                    cc.tween().to(0.5, { angle: arrCard[i].angle }, { easing: 'quadInOut' })  // Xoay 360 độ với easing quadInOut
                )
                .call(() => {
                    // Hiệu ứng mờ và scale
                    cc.tween(card.node)
                        .to(0.1, { opacity: 255, scale: 0.8 }, { easing: 'quadInOut' })  // scale về 0.9 với easing quadInOut
                        .start();
            
                    // Tween để trở về trạng thái scale ban đầu
                    cc.tween(card.node)
                        .to(0.1, { scale: 0.9 }, { easing: 'quadInOut' })  // scale về 1 với easing quadInOut
                        .start();
                })
                .start();
            
            }
            else{
                posTarget = posCardAtackInTable.add(arrCard[i].position)
                cc.tween(card.node)
                .to(0.5, { position: posTarget }, { easing: 'expoOut' })  // Di chuyển đến vị trí đích trong 0.5 giây với easing expoOut
                .call(() => {
                    // Hiệu ứng mờ và scale lớn
                    cc.tween(card.node)
                        .to(0.2, { opacity: 255, scale: scaleDown }, { easing: 'quadInOut' })  // Scale lớn và tăng độ mờ với easing quadInOut
                        .start();
                })
                .start();
            
            }

            this.listCardTurnPlayer.push(card);
        }

        for (let i = 0; i < listCardTurn.length; i++) {
            const cardTurn = listCardTurn[i].getComponent("CardTLMN");
            if(cardTurn.cardNumber === 2){
                Global.AudioManager.danh2();
            }
        }

        this.xuLyCardInTable();

        this.listBoBaiDanh.unshift(listCardTurn);

        this.lengthCache = listIdCard.length;
        this.sortIndexCardInTable();
        if(!this.checkTypeCardAndShowEffect(listIdCard)){
            Global.AudioManager.danhBai();
        }
    },

    arrangeCardChiaBai(midPoint , numberCard){
        if(numberCard <= 0 || !numberCard) return;
        this.listReTurn = [];
        let scaleCard = 1;
        let maxCard = numberCard;
        let heSo = 35;

        if(numberCard <= 4){
            for(let i = 0 ; i < maxCard ; i++){
                let posX = (i * 169 * 0.6);
                posX -= ((maxCard - 1) * 169 / 2 * 0.6);
                let obj = {};
                obj.angle = 0;
                obj.position = cc.v2(posX, midPoint.y);
                this.listReTurn.push(obj);
            }
            return;
        }

        let distanceMax = maxCard * heSo * scaleCard;// khoang canh tu quan giua den quan cuoi
        let firtPoint =  midPoint.x -distanceMax;
        let lastPoint =  midPoint.x +distanceMax;
        let p0 = {x:firtPoint, y: midPoint.y - maxCard * 2 - 20}, //use whatever points you want obviously
        p1 = {x: midPoint.x - (distanceMax/3), y: midPoint.y + maxCard},
        p2 = {x: midPoint.x + (distanceMax/3), y: midPoint.y + maxCard},
        p3 = {x: lastPoint , y: midPoint.y - maxCard * 2 - 20};
        let rotateFirt = -15; // angle card dau tien
        let rotateLast = -rotateFirt;
        let offsetRotate = (rotateLast - rotateFirt)/(maxCard - 1) //5la - 1;
        let offsetTime = 1/(maxCard - 1)// 5la - 1;
        let firtTime = 0;

        for(let i = 0 ; i < maxCard ; i++){
            let obj = {};
            obj.angle = -rotateFirt;
            obj.position =  this.getBezier(firtTime, p0, p1, p2, p3);
            firtTime += offsetTime;
            rotateFirt += offsetRotate;
            this.listReTurn.push(obj);
        }
    },

    arrangeCard(midPoint , arrIdCard, winWhite = false){
        if(arrIdCard.length <= 0 || !arrIdCard) return;
        this.listReTurn = [];
        let scaleCard = 0.9;
        let maxCard = arrIdCard.length;
        let heSo = 30;

        cc.log("cehck id catd : ", arrIdCard)
        let isSanh = this._cardHelper.isSanh(arrIdCard)
        cc.log("cehck id sanhg : ", isSanh)
        if(!isSanh && !winWhite){
            for(let i = 0 ; i < maxCard ; i++){
                let posX = (i * 169 * 0.6);
                posX -= ((maxCard - 1) * 169 / 2 * 0.6);
                let obj = {};
                obj.angle = 0;
                obj.position = cc.v2(posX, 0);
                this.listReTurn.push(obj);
            }
            return;
        }
        let distanceMax = maxCard * heSo * scaleCard;// khoang canh tu quan giua den quan cuoi
        let firtPoint =  midPoint.x -distanceMax;
        let lastPoint =  midPoint.x +distanceMax;
        let p0 = {x:firtPoint, y: midPoint.y - maxCard * 2 - 20}, //use whatever points you want obviously
        p1 = {x: midPoint.x - (distanceMax/3), y: midPoint.y + maxCard},
        p2 = {x: midPoint.x + (distanceMax/3), y: midPoint.y + maxCard},
        p3 = {x: lastPoint , y: midPoint.y - maxCard * 2 - 20};
        let rotateFirt = -15; // angle card dau tien
        let rotateLast = -rotateFirt;
        let offsetRotate = (rotateLast - rotateFirt)/(maxCard - 1) //5la - 1;
        let offsetTime = 1/(maxCard - 1)// 5la - 1;
        let firtTime = 0;

        for(let i = 0 ; i < maxCard ; i++){
            let obj = {};
            obj.angle = -rotateFirt;
            obj.position =  this.getBezier(firtTime, p0, p1, p2, p3);
            firtTime += offsetTime;
            rotateFirt += offsetRotate;
            this.listReTurn.push(obj);
        }
    },

    getBezier(t, p0, p1, p2, p3){
        var cX = 3 * (p1.x - p0.x),
            bX = 3 * (p2.x - p1.x) - cX,
            aX = p3.x - p0.x - cX - bX;
      
        var cY = 3 * (p1.y - p0.y),
            bY = 3 * (p2.y - p1.y) - cY,
            aY = p3.y - p0.y - cY - bY;
      
        var x = (aX * Math.pow(t, 3)) + (bX * Math.pow(t, 2)) + (cX * t) + p0.x;
        var y = (aY * Math.pow(t, 3)) + (bY * Math.pow(t, 2)) + (cY * t) + p0.y;
      
        return {x: x, y: y};
      },

    xuLyCardInTable() {
        this.countDanhBai = 0;

        let listId = [];
        let posTarget = null;
        let posCardAtackInTable = cc.v2(0, 0);
        let posCardAtackInTableBo = cc.v2(0, 0);


        cc.log("check list id bo bai ra la : ", this.listBoBaiDanh);

        for (let i = 0; i < this.listBoBaiDanh.length; i++) {
            const boBai = this.listBoBaiDanh[i];

            listId = [];
            for (let j = 0; j < boBai.length; j++) {
                const card = boBai[j];
                listId.push(card.getComponent("CardTLMN").id);
            }

            cc.log("check list id bo bai : ", listId);

            let isSanh = this._cardHelper.isSanh(listId);

            cc.log("check is sanh " , isSanh);

            if(this.countDanhBai >= 4) this.countDanhBai = 0;
            posCardAtackInTable = this.listPosDanhBai[this.countDanhBai];
            posCardAtackInTableBo = this.listPosDanhBaiBo[this.countDanhBai];
            
            this.arrangeCard(cc.v2(0, 0), listId);
            let arrCard = this.listReTurn;

            for (let k = 0; k < boBai.length; k++) {
                const cardArr = boBai[k];

                if(isSanh){
                    posTarget = posCardAtackInTableBo.add(arrCard[k].position)
                }
                else{
                    posTarget = posCardAtackInTable.add(arrCard[k].position)
                }

                cc.log("check pos lan nua : ", posTarget)

                cardArr.position = posTarget;
                cardArr.angle =  arrCard[k].angle;

                cardArr.getComponent("CardTLMN").setGrayCard();

                cc.log("check is angle " , arrCard[k].angle);
            }
            this.countDanhBai++;
        }
    },

    xuLyCardEndGame(){
        for (let i = 0, l = this.listCardTurnPlayer.length; i < l; i++) {
            Global.TienLenMN.pool.putCard(this.listCardTurnPlayer[i].node);    
        }
        this.listCardTurnPlayer.length = 0;
    },

    xuLiCardNewTurn() {
        for (let i = 0, l = this.listCardTurnPlayer.length; i < l; i++) {
            Global.TienLenMN.pool.putCard(this.listCardTurnPlayer[i].node);
        }
        this.listCardTurnPlayer.length = [];
        this.countDanhBai = 0;
        this.listCurrentIdCard.length = [];

        this.listBoBaiDanh = [];
    },

    reset() {
        let listPlayer = Global.TienLenMN.players;
        for (let i = 0, l = listPlayer.length; i < l; i++) {
            let player = listPlayer[i];
            if (player) {
                player.resetCard(Global.TienLenMN);
            }
        }
        this.xuLiCardNewTurn();
        this._cardHelper.clear();
        this.isSuggest = true;
        this.listCurrentIdCard.length = [];
    },
    checkTypeCardAndShowEffect(arrIdCard) {
        let isReturn = "";
        if (arrIdCard.length < 4) return false;
        Global.AudioManager.baiDacBiet();
        if(this._cardHelper.isTuQui (arrIdCard)){
            isReturn = "animation_tu_quy";
        }else{
            if( this._cardHelper.isThong (arrIdCard)){
                if(arrIdCard.length ==6)  isReturn = "animation_3_doi_thong";
 
                if(arrIdCard.length ==8)isReturn = "animation_4_doi_thong";
                
                 if(arrIdCard.length ==10) isReturn = "animation_5_doi_thong";
            }
         }
        if (isReturn != "") {
            this.skeCardType.node.active = true;
            this.skeCardType.setAnimation(0, isReturn, false); // show skeleton
            this.scheduleOnce(()=>{
                this.skeCardType.node.active = false;
            }, 1)
            return true;
        }
        return false;
    },

    showCardWinWhite(typeWin, arrIdCard, player) {


        // TU_QUY_3 = 0,
        // SAM_4 = 1,
        // DOI_THONG_3_BICH = 2,
        // DOI_6 = 3,
        // TU_QUY_2 = 4,
        // DOI_THONG_5 = 5,
        // DONG_MAU = 6,
        // HAI_TU_QUY = 7,
        // SANH_RONG = 8,
        // UNKNOWN

        cc.log("chya vao shdowaishfiawd")

        let listArrIdSort = [];
        let strSke = "";
        let cardWinWhite = new cardHelper();
        cardWinWhite.init(arrIdCard);
        switch (typeWin) {
            case 0:
                strSke = "animation_tu_quy_3";
                listArrIdSort = [30, 31, 32, 33];
                break;
            case 1:
                strSke = "animation_4sam";
                let listXam = cardWinWhite.listXam;
                for (let i = 0, l = listXam.length; i < l; i++) {
                    let xam = listXam[i];
                    for (let j = 0; j < xam.length; j++) {
                        listArrIdSort.push(xam[j]);
                    }
                }
                break;
            case 2:
                strSke = "animation_doi_thong_3_bich";
                let listThong = cardWinWhite.listThong;
                for (let i = 0; i < listThong.length; i++) {
                    let doiThong = listThong[i];
                    for (let z = 0; z < doiThong.length; z++) {
                        if (doiThong[z] == 30) {
                            listArrIdSort = doiThong;
                            break;
                        }
                    }
                }
                break;
            case 3:
                strSke = "animation_6_doi";
                // let listDoi = cardWinWhite.listDoi;
                let listDoi = this.loaiBoMangTrung(cardWinWhite.listDoi);
                cc.log("check animation_6_doi : ", JSON.stringify(listDoi))
                for (let i = 0, l = listDoi.length; i < l; i++) {
                    let doi = listDoi[i];
                    for (let j = 0; j < doi.length; j++) {
                        cc.log("check animation_6_doi : ", doi[j])
                        listArrIdSort.push(doi[j]);
                    }
                }
                break;
            case 4:
                strSke = "animation_tu_quy_2";
                listArrIdSort = [150, 151, 152, 153]
                break;
            case 5:
                strSke = "animation_5_doi_thong";
                let listThong5 = cardWinWhite.listThong;
                cc.log("check lisst arr sort thong 5 : ",listThong5 )
                // for (let i = 0, l = listThong5.length; i < l; i++) {
                //     let thong = listThong5[i];
                //     for (let j = 0; j < thong.length; j++) {
                //         listArrIdSort.push(thong[j]);
                //     }
                // }

                listArrIdSort = listThong5[5];

                cc.log("check lisst arr sort : ",listArrIdSort )
                break;
            case 6:
                strSke = "animation_dongmau";
                listArrIdSort = arrIdCard.slice();
                break;
            case 7:
                strSke = "animation_2_tu_quy";
                let listTuqui =  cardWinWhite.listTuQui;
                for (let i = 0, l = listTuqui.length; i < l; i++) {
                    let tuquy = listTuqui[i];
                    for (let j = 0; j < tuquy.length; j++) {
                        listArrIdSort.push(tuquy[j]);
                    }
                }
                break;
            case 8:
                strSke = "animation_sanh_rong";
                listArrIdSort = arrIdCard.slice();
                break;
        }
        if (strSke == "") return;
        this.showCardWithEffect(strSke, listArrIdSort, player , arrIdCard);
    },

    loaiBoMangTrung(arr) {
        let result = [];
    
        for (let i = 0; i < arr.length; i++) {
            let isTrung = false;
    
            for (let j = i + 1; j < arr.length; j++) {
                if (
                    (arr[i][0] >= arr[j][0] && arr[i][0] <= arr[j][1]) ||
                    (arr[i][1] >= arr[j][0] && arr[i][1] <= arr[j][1]) ||
                    (arr[j][0] >= arr[i][0] && arr[j][0] <= arr[i][1]) ||
                    (arr[j][1] >= arr[i][0] && arr[j][1] <= arr[i][1])
                ) {
                    isTrung = true;
                    break;
                }
            }
    
            if (!isTrung) {
                result.push(arr[i]);
            }
        }
    
        return result;
    },    
    
    showCardWithEffect(srtType, listArrIdSort = null, player, arrIdCardFull) {
        cc.log("check listArrIdSort : ", listArrIdSort)
        let listCardTemp = [];
        let isMe = Global.TienLenMN.isMe;
        
        for (let i = 0, l = listArrIdSort.length; i < l; i++) {
            let card = null;
            if (isMe == player) {
                card = player.getCardById(listArrIdSort[i], true);

            } else {
                card = player.getCardById(-1, true);
            }
            // cc.log("check arr cardi ,", listArrIdSort[i])

            if(card){
                cc.log("ko co loi : ", listArrIdSort[i])
                listCardTemp.push(card.node);
                this.listCardTurnPlayer.push(card);
            }
            else{
                cc.log("co loi roi : ", listArrIdSort[i])
            }
            
        }

        cc.tween(this)
        .delay(1)
        .call(()=>{
            Global.AudioManager.toiTrangTLMN();
            let posCardAtackInTableBo = cc.v2(0, -40);
            for (let i = 0, l = listArrIdSort.length; i < l; i++) {
                let cardCp = listCardTemp[i];

                if(!cardCp) continue;
    
                this.arrangeCard(cc.v2(0, 0), listArrIdSort, true);
                let posTarget = null;
                let arrCard = this.listReTurn;
                cardCp.getComponent("CardTLMN").setCardIdAndOpen(listArrIdSort[i]);
                posTarget = posCardAtackInTableBo.add(arrCard[i].position)
                cc.tween(cardCp)
                .to(0.1 * i + 0.3, { position: posTarget, angle: arrCard[i].angle, scale: 0.9 }, { easing: "expoOut" })
                .start();
            }
            this.sortIndexCardInTable();
            player.showTypeWin(WinType.WinWhite)
            this.diChuyenCard(true);
        })
        .delay(2)
        .call(()=>{
            this.skeCardType.node.active = true;
            this.skeCardType.setAnimation(0, srtType, false); // show anim
        })
        .delay(2)
        .call(()=>{
            this.skeCardType.node.active = false;  
            let arr = []
            for (let i = 0; i < arrIdCardFull.length; i++) {
                if(!listArrIdSort.includes(arrIdCardFull[i])){
                    arr.push(arrIdCardFull[i])
                }
            }
            cc.log("check card arrIdCardFull end : ", arr) 
            if(player !== isMe) this.latBaiPlayer(player, arr);
        })
        .start();

    },

    sortIndexCardInTable() {
        for (let i = 0, l = this.listCardTurnPlayer.length; i < l; i++) {
            this.listCardTurnPlayer[i].node.zIndex = i;
        }
    },
    sortCardMe() {
        this.isSuggest = true;
        let arrId = this._cardHelper.getArrXep();
        Global.TienLenMN.isMe.sortCardWithListCardId(arrId);
        this.duaTatCaCardRaGiua();
        this.diChuyenCard();
    },
    
    getCardTheoBo() {
        this.isSuggest = true;
    },
    duaTatCaCardRaGiua() {
        let tempList = Global.TienLenMN.isMe.listCard;
        let posFirtCard = this.listPosFirtCard[0].clone();
        for (let i = 0, l = tempList.length; i < l; i++) {
            tempList[i].node.position = cc.v2(0, posFirtCard.y);
        }
    },
    // dua card ve dung vi tri theo index trong list
    diChuyenCard(isSpeedMax = false) {
        let tempList = Global.TienLenMN.isMe.listCard;
        Global.TienLenMN.isMe.boChonAllCard();
        let x = this.listPosFirtCard[0].x;
        let y = this.listPosFirtCard[0].y;
        let speed = isSpeedMax ? 0.15 : 0.3;
        
        let scale = 0.5;

        let arrPosCard = [];
        cc.log("cehck lengrh card : ", tempList.length)
        this.arrangeCardChiaBai(this.listPosFirtCard[Global.TienLenMN.isMe.indexInTable].clone(), tempList.length);
        arrPosCard = this.listReTurn;    
        cc.log("set pos card :: ", arrPosCard)
        for (let i = 0; i < tempList.length; i++) {
            let card = tempList[i].node;
            card.zIndex = i;
            // let w = card.width * scale;
            // let posTarget = cc.v2(i * w - (((l - 1) * w) * 0.5) + w - 40 , y )
            tempList[i].positionCache = cc.v2(arrPosCard[i].position.x, arrPosCard[i].position.y);
            cc.log("set pos card :: ", cc.v2(arrPosCard[i].position.x, arrPosCard[i].position.y))
            tempList[i].isSlect = false;
            cc.Tween.stopAllByTarget(card);
            cc.tween(card)
                .to(speed, { position: cc.v2(arrPosCard[i].position.x, arrPosCard[i].position.y), angle: arrPosCard[i].angle })
                .start();

        }
    },
    resetListCardGoiY() {
        this.listIdCardGoiY.length = 0;
    },
    checkTypeCardAn(arrIdCard) {
        this._cardHelper.updateArrAn(arrIdCard);
        cc.log("check arr card danh : ", arrIdCard)
        this.setCardNotAn(this._cardHelper.getCardNotAn());
        cc.log("check arr card not an : ", this._cardHelper.getCardNotAn())
    },

    getCardQuickPlay(player, arrIdCard){
        let arrIdQuick = this._cardHelper.updateArrAn(arrIdCard);
        cc.log("check arr danh nhanh la : ", arrIdQuick);
        if(arrIdQuick.length > 0){
            player.listCardQuickPlay  = arrIdQuick[0];
            return player.listCardQuickPlay;
        }
        else{
            return null;
        }   
    },

    setCardNotAn(arrIdCard){
        this.resetCardNotAnIsMe();
        Global.TienLenMN.resetFoldEnforceEffect();
        let listCard = Global.TienLenMN.isMe.listCard;
        for(let i = 0 , l = listCard.length; i < l ; i++){
            let card = listCard[i];
            for(let j = 0; j < arrIdCard.length; j++){
                if(card.id == arrIdCard[j]){
                    card.setGrayCard();
                    break;
                } 
            }
        }
        if(listCard.length === arrIdCard.length){
            cc.log("k co con nao an dc")
            Global.TienLenMN.foldEnforceEffect();
        }
    },
    resetCardNotAnIsMe(){
        let listCard = Global.TienLenMN.isMe.listCard;
        for(let i = 0 , l = listCard.length; i < l ; i++){
            listCard[i].setNormalCard();
        }
    },

    suggestCard(idCard) {
        if(this.isSuggest){
            let listIdSuggest = this._cardHelper.getArrByOneCard(idCard);
            if(listIdSuggest.length > 0) this.isSuggest = false;
            this.uperCardWithIds(listIdSuggest);
        }
    },
    suggestWithListCard(listIdCard) {
        if(this.isSuggest){
            let arrIdCard = this._cardHelper.getArrByArr(listIdCard);
            cc.log("listSuggest " + JSON.stringify(arrIdCard))
            if(arrIdCard.length > 0) this.isSuggest = false;
            this.uperCardWithIds(arrIdCard);
        }
    },
    uperCardWithIds(listId) {
        let tempList = Global.TienLenMN.isMe.listCard;
        let isMe = Global.TienLenMN.isMe;
        for (let z = 0, lz = tempList.length; z < lz; z++) {
            for (let i = 0, l = listId.length; i < l; i++) {
                if (tempList[z].id == listId[i]) {
                    isMe.onChonCard(tempList[z]);
                }
            }
        }


    }


    // update (dt) {},
});
