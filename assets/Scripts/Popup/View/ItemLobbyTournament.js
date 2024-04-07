cc.Class({
    extends: cc.Component,

    properties: {
        lbStatus : cc.Label,
        lbName : cc.Label,
        lbBuyIn : cc.Label,
        lbPlayer : cc.Label,
        lbPrize : cc.Label,
        texttureItem : cc.Sprite,
        listTextureItem : [cc.SpriteFrame],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.listLbItem = [];
        this.listLbItem = [this.lbStatus, this.lbName, this.lbBuyIn, this.lbPlayer, this.lbPrize];
    },

    start () {

    },

    init(data){
        this.tourId = data.Id

        this.lbName.string = data.TourName;
        if(data.TourName.length > 50)
            this.lbName.string = data.TourName.substring(0, 50) + '...';
            
        this.lbBuyIn.string =  Global.formatNumberPoker(data.Buyin);
        this.lbPlayer.string = data.CountPlayer;

        this.lbPrize.string = Global.formatNumberPoker(data.TotalReward);

        clearInterval(this.funcScheDulde);
        this.unscheduleAllCallbacks();
        switch (data.State) {
            case 0:
                this.lbStatus.string = this.generateDate(data.StartTimePlaying);
                // this.texttureItem.spriteFrame = this.listTextureItem[2];
                this.setColor(2);
                this.texttureItem.node.getComponent(cc.Button).interactable = true;
                break;
            case 1:
                // this.texttureItem.spriteFrame = this.listTextureItem[2];
                this.setColor(2);
                this.texttureItem.node.getComponent(cc.Button).interactable = true;
                if(data.remainTime){
                    this.lbStatus.string = "B/đầu (" + Global.formatTimeBySec(data.remainTime, true) + ")";
                    this.funcScheDulde = setInterval(() => {
                        // data.remainTime--;
                        this.lbStatus.string =  "B/đầu (" + Global.formatTimeBySec(data.remainTime, true) + ")";
                        if (data.remainTime == 0) {
                            this.lbStatus.string = "Bắt đầu tour";
                            this.unschedule(this.funcScheDulde);
                        }
                    }, 1000);            
                }
                this.timeContDown = this.schedule(()=>{
                    data.remainTime--;
                }, 1)
                break;
            case 2:
                // this.texttureItem.spriteFrame = this.listTextureItem[2];
                this.setColor(3);
                this.texttureItem.node.getComponent(cc.Button).interactable = true;
                if(data.remainTime){
                    this.lbStatus.string = "Đki trễ (" + Global.formatTimeBySec(data.remainTime, true) + ")";
                    this.funcScheDulde = setInterval(() => {
                        // data.remainTime--;
                        this.lbStatus.string = "Đki trễ (" + Global.formatTimeBySec(data.remainTime, true) + ")";
                        if (data.remainTime == 0) {
                            this.lbStatus.string = this.generateDate(data.EndTimeRegister);
                            this.unschedule(this.funcScheDulde)
                        }
                    }, 1000);            
                }
                this.timeContDown = this.schedule(()=>{
                    data.remainTime--;
                }, 1)
                break;
            case 3:
                // this.texttureItem.spriteFrame = this.listTextureItem[0];
                this.setColor(3);
                this.texttureItem.node.getComponent(cc.Button).interactable = true;
                this.lbStatus.string = "Đang chạy"
                break;
            case 4:
                // this.texttureItem.spriteFrame = this.listTextureItem[1];
                this.setColor();
                this.texttureItem.node.getComponent(cc.Button).interactable = true;
                this.lbStatus.string = "ITM"
                break;
            case 5:
                // this.texttureItem.spriteFrame = this.listTextureItem[1];
                this.setColor();
                this.texttureItem.node.getComponent(cc.Button).interactable = true;
                this.lbStatus.string = "Final table"
                break;
            case 6:
                this.lbStatus.string = "Đã kết thúc";
                this.setColor(1);
                // this.texttureItem.spriteFrame = this.listTextureItem[2];
                this.texttureItem.node.getComponent(cc.Button).interactable = false;
                break;
            case 7:
                // this.texttureItem.spriteFrame = this.listTextureItem[2];
                this.setColor();
                this.texttureItem.node.getComponent(cc.Button).interactable = false;
                this.lbStatus.string = "Tour đã hủy"
                break;
        }
    },

    onClickItemTournament(event, data){
        if(!this.tourId){
            cc.log("can't find tour id");
            return;
        }
        let msg = {};
		msg[PKR_ParameterCode.TourId] = this.tourId;
		require("SendCardRequest").getIns().MST_Client_Tournament_Get_Info(msg); // data
    },

    setColor(colorCode){
        for (let i = 0; i < this.listLbItem.length; i++) {
            const lbItem = this.listLbItem[i];
            switch (colorCode) {
                case 1:
                    lbItem.node.color = cc.Color.RED;
                    break;
                case 2:
                    lbItem.node.color = cc.Color.GREEN;
                    break;
                case 3:
                    lbItem.node.color = cc.Color.YELLOW;
                    break;
                default:
                    lbItem.node.color = cc.Color.WHITE;
                    break;
            }
        }
    },

    generateDate(data) {
        let date = new Date(data);
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
        cc.log("phus la : ", seconds)
        return hours + ":" + minutes + " (" +day + "/" + month + ")";
    },

    // update (dt) {},
});
