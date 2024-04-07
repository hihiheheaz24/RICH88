cc.Class({
    extends: cc.Component,

    properties: {
        element1: cc.Label,
        element2: cc.Label,
        element3: cc.Label,
        element4: cc.Label,
        element5: cc.Label,
        index: cc.Label,
        icRank: cc.Sprite,
        listSpriteFrameRank: [cc.SpriteFrame],
    },

    SetInfo(index, time, NewAccountBalance, ActionDescription, ChangeBalance) {
        this.element2.string = NewAccountBalance;
        this.element3.string = ActionDescription;
        if(this.element4)
         this.element4.string = ChangeBalance;

        let date = new Date(time);
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
 
        let rank = index+1;
        if(this.index && this.icRank){
            switch (rank) {
                case 1:
                    this.icRank.spriteFrame = this.listSpriteFrameRank[rank - 1];
                    this.index.node.active = false;
                    this.icRank.node.active = true;
                    break;
                case 2:
                    this.icRank.spriteFrame = this.listSpriteFrameRank[rank - 1];
                    this.index.node.active = false;
                    this.icRank.node.active = true;
                    break;
                case 3:
                    this.icRank.spriteFrame = this.listSpriteFrameRank[rank - 1];
                    this.index.node.active = false;
                    this.icRank.node.active = true;
                    break;
                default:
                    this.index.string = index + 1;
                    this.index.node.active = true;
                    this.icRank.node.active = false;
                    break;
            }
        }
       
        if(this.element1)
            this.element1.string = day + "." + month + "." + year;
        if(this.element5)
            this.element5.string = hours + ":" + minutes + ":" + seconds;

    },
    SetInfoTake(index, data1, data2, data3, isMe) {
        this.element1.string = data1;
        this.element2.string = data2;
        this.element3.string = data3;

        if (!isMe) {
            if (index % 2 == 0) {
                // bg.color = cc.Color.rgb2hsv(42, 29, 38, 255);
            } else {
                // bg.color = cc.Color.rgb2hsv(107, 65, 12, 0);
            }
        } else {
            // bg.color = cc.Color.rgb2hsv(6, 176, 0, 255);
            if (this.element1.string == "0")
                this.element1.string = "N/A";
        }
    },

});
