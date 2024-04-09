cc.Class({
    extends: cc.Component,

    properties: {
        playerPrefab : cc.Prefab,
        cardPrefab : cc.Prefab,
        lbInfoTable : cc.Label,
        lbSesion : cc.Label,
        lbTime : cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Global.HistoryTLMN = this;
        this.listPos = [];
    },

    onEnable(){
        this.index = 0;
        this.listDataHistory = [];
        this.listReTurn = [];
        this.players = [null, null, null, null];
        this.isMe = null;
        this.toiTrang = false;
    },

    start () {

    },

    show(){
        Global.onPopOn(this.node);
        this.initData();
        if(this.listDataHistory[0]){
            this.generateHistoryImage(this.listDataHistory[0]);
        }
        else{
            Global.UIManager.showCommandPopup("Chưa ghi nhận lịch sử ván đánh");
        }
        
    },

    hide(){
        Global.onPopOff(this.node)
    },

    initData(){
        if(!localStorage.getItem("dataEndGame")){
            return;
        }
        let listDataHistory = JSON.parse(localStorage.getItem("dataEndGame"));
        this.listDataHistory = listDataHistory;
    },

    generateHistoryImage(data){
        cc.log("check data endgame : ", data.date)
        this.removePlayer();
        this.initPlayer(data[27]);
        this.lbInfoTable.string = data.infoTable;
        this.lbSesion.string = data.session;

        let date = new Date(data.date);
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();

        if (day < 10) {
            day = "0" + day;
        }
        if (month < 10) {
            month = "0" + month;
        }
        if (hours < 10) {
            hours = "0" + hours;
        }
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        if (seconds < 10) {
            seconds = "0" + seconds;
        }

        this.lbTime.string = "Thời gian: " + hours + ":" + minutes + ":" + seconds + " - Ngày: " + day + "/" + month + "/" + year;
    },

    initPlayer(data){
        let isShow = false;
        for (let i = 0; i < data.length; i++) {
            let temp = JSON.parse(data[i]);
            this.creatPlayerWithData(temp);
            cc.log("Check id  : ",temp)
            if(temp.AccountId === MainPlayerInfo.accountId){
                isShow = true;
            }
        }
        if(!isShow){
            if(this.index < 10)
                this.onClickNext();
            return;
        }
        this.updatePositionPlayers();
        for (let i = 0; i < this.players.length; i++) {
            const player = this.players[i];
            if(player){
                this.setCardPlayer(player, player.listCardIdForReconnect) ;
                 player.changeMoneyEndGame(player.winLoseCash, true);
            }
             
        }
      
    },

    creatPlayerWithData(data){
        let player = cc.instantiate(this.playerPrefab).getComponent("PlayerViewTLMN");
        if (data.NickName == MainPlayerInfo.nickName) {
            player._isMe = true;
            this.isMe = player;
        }
        player.initPlayer(data, true);
        player.winType = data.WinType;
        if (player.winType !== -1 && player.winType !== 5)
            player.showTypeWin(data.WinType);
        else {
            if(player.winType === WinType.WinWhite)
                this.toiTrang = true;
        }
        this.players[data.Position] = player;
        this.node.getChildByName("bgHistorry").getChildByName("bg").addChild(player.node)
        return player;
    },

    setCardPlayer(player, arrIdCard){
        cc.log("check id card  : ", arrIdCard)
        arrIdCard.sort((a, b) => a - b);
        let isShowThoi2 = false;
        let l = arrIdCard.length
        let listCard = player.listCard;
        let posInTable = player.indexInTable;
        let posOpenCard = Global.GameView.cardController.listPosOpenCard[posInTable].clone();
        let arrPosCard = [];
        let index = 0;
        if(player._isMe){
            this.arrangeCardChiaBai(posOpenCard, arrIdCard);
            arrPosCard = this.listReTurn;
        }

        for (let i = 0; i < arrIdCard.length; i++) {
            let card = listCard[i];
            if (card == null) {
                card = this.creatCard(player).getComponent("CardTLMN");
            }
            card.setCardIdAndOpen(arrIdCard[i]);
            card.node.angle = 0;
            if (card.cardNumber == 2){
                card.thoi2();
                if(!isShowThoi2 && player.winType !== WinType.WinWhite && !this.toiTrang){
                    card.showTextThoi2(player.indexInTable);
                }
                isShowThoi2 = true;
            }
            if (card.cardNumber != 2) card.setGrayCard(); // thoi' 2

            let w = card.node.width * 0.2;

            cc.log("check index in table : ", player.indexInTable)
            let posX = 0;

            if(player.indexInTable === 0){
                w = card.node.width * 0.5;
                cc.log("check list return poscard : ", arrPosCard)
                card.node.zIndex = i;
                if(arrPosCard[i]){
                    card.node.position = arrPosCard[i].position;
                    card.node.angle =  arrPosCard[i].angle;
                }
              
            }
            else if(player.indexInTable === 1){
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

           
            if(player === this.isMe){
                card.node.scale = 0.9;
            }
            else{
                card.node.scale = 0.4;
            }
            index++;
        }

        if(player.winType == WinType.BiChan3Bich || player.winType == WinType.Win3Bich){
            let isCheck = player.winType == WinType.Win3Bich ? true : false;
            player.play3Bich(isCheck);
        }
    },

    arrangeCardChiaBai(midPoint , arrIdCard){
        cc.log("check arr id card : ", arrIdCard.length)
        if(arrIdCard.length <= 0 || !arrIdCard) return;
        this.listReTurn = [];
        let scaleCard = 1;
        let maxCard = arrIdCard.length;
        let heSo = 35;

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

    
    setPositionPlayer(){
        for(let i = 0 , l = this.players.length ; i < l ; i++){
            let player = this.players[i];
            
            if(player){
                let indexChuaXapSep = this.getIndexOf(player);
                let indexInTable = indexChuaXapSep;//this.getDynamicIndex(indexChuaXapSep);
                player.indexInTable = indexInTable;
                player.node.position = Global.GameView.listPos[indexInTable];
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
                player.node.position = Global.GameView.listPos[listConfigUser[i]];
                player.indexInTable = listConfigUser[i];
            }
        }
    },

    creatCard(player = null, idCard = -1) {
        let nodeCard = cc.instantiate(this.cardPrefab)
        let cardComponent = nodeCard.getComponent("CardTLMN");
        cardComponent.setCardId(idCard);
        if (player) {
            player.listCard.push(cardComponent);
        }
        this.node.getChildByName("bgHistorry").getChildByName("bg").addChild(nodeCard);
        return nodeCard;
    },
    

    getIndexOf(player) {
        let index = player.position;//vi tri hien tai trong players
        let thisPlayerIndex = this.players.length;
        if (this.isMe) {
            thisPlayerIndex = this.isMe.position;
        }
        return ((index + this.players.length - thisPlayerIndex) % this.players.length);
    },

    onClickNext(){
        this.index++;
        if( this.index > 10) this.index = 10;
        if(this.index > this.listDataHistory.length - 1) this.index = this.listDataHistory.length - 1;
        if(this.listDataHistory){
            cc.log("chek index la : ", this.index)
            this.generateHistoryImage(this.listDataHistory[this.index]);
        }
    },

    removePlayer(){
        this.toiTrang = false;
        this.players = [null, null, null, null]
        this.node.getChildByName("bgHistorry").getChildByName("bg").destroyAllChildren();
    },

    onClickPreview(){
        this.index--;
        if(this.index < 0) this.index = 0;
        if(this.listDataHistory){
            this.generateHistoryImage(this.listDataHistory[this.index]);
        }
    },

    // update (dt) {},
});
