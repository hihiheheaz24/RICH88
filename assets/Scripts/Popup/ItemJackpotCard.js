cc.Class({
    extends: cc.Component,

    properties: {
        labelNameGame: cc.Label,
        labelBoBai: cc.Label,
        labelRoom: cc.Label,
        labelGold: cc.Label,
        labelNamePlayer: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    initItem(rawData) {
        // 53: "{\"GameId\":\"SAM\",\"AccountId\":1137,\"NickName\":\"anhtrongbn99\",\"Blind\":1000,\"RewardMoney\":7351,\"Cards\":\"[140,70,152,32,53,63,81,93,102,41]\",\"CreatedAt\":\"2021-08-03T11:46:33.953\",\"ToiTrangType\":\"Sảnh Rồng\",\"PlayerShare\":0}"

        this.labelNameGame.string = Global.getNameGameCardByType(rawData.GameId);
        if(rawData.ToiTrangType == null){
            this.labelBoBai.string =this.converCard(rawData.Cards);
            this.labelBoBai.fontSize = 23;
        }else{
            let textCard = rawData.ToiTrangType;
            if(MyLocalization.GetText(rawData.ToiTrangType))
                textCard = MyLocalization.GetText(rawData.ToiTrangType)
            this.labelBoBai.string = textCard;
            this.labelBoBai.fontSize = 30;
        }
     //this.converCard(rawData.Cards);

        this.labelGold.string = Global.formatNumber(rawData.RewardMoney);
        this.labelRoom.string = Global.formatNumber(rawData.Blind);
        this.labelNamePlayer.string = rawData.NickName.substring(0, 8) + '...';
        if(this.itemID == 0){
            this.node.children[0].active = false;
        }else{
            this.node.children[0].active = true;
        }
    },
    converCard(listIdCard){
      //  cc.log(listIdCard)
      listIdCard = JSON.parse(listIdCard);
        let str = "";
        for(let i = 0 , l  = listIdCard.length; i < l; i++){
            let id = listIdCard[i];
            let strOffset = "";
            if(i < l - 1)strOffset = ","
            let card = this.getNumber(id)+ this.getFace(id)+strOffset;
            str+=card
        }
       
        return str;
    },
    getNumber(id){
        let number  =parseInt(id/10);
        if(number == 15 ) number = "2";
        if(number == 14) number = "A"
        return number
    },
    getFace(id){
        let face = id%10;
        //let str= "";
        switch(face){
            case 0 : return "♠";
            case 1 : return "♣";
            case 2 : return "♦";
            case 3 : return "♥";
        }
        
    }

    // update (dt) {},
});
