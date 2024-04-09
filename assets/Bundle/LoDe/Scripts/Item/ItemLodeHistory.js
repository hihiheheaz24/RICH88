// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
       lbTimeBet : cc.Label,
       lbTypeBet : cc.Label,
       lbTotalBet : cc.Label,
       lbResult : cc.Label,
       lbDate : cc.Label,
       listItemNumber : cc.Node,
       itemNumber : cc.Node,

       listSprItem : [cc.SpriteFrame],
       sprItem : cc.Sprite,

       listSprItemNumber : [cc.SpriteFrame]
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    init(data){
        let typeBet = "";
        switch (data.BetType) {
            case BET_TYPE.DE:
                typeBet = "Đề Đặc Biệt"
                break;
            case BET_TYPE.LO:
                typeBet = "Lô 2 Số"
                break;
            case BET_TYPE.XIEN_2:
                typeBet = "Lô Xiên 2"
                break;
            case BET_TYPE.XIEN_3:
                typeBet = "Lô Xiên 3"
                break;
            case BET_TYPE.XIEN_4:
                typeBet = "Lô Xiên 4"
                break;
            case BET_TYPE.BA_CANG:
                typeBet = "Ba Càng"
                break;
            case BET_TYPE.DAU:
                typeBet = "Đề Đầu"
                break;
            case BET_TYPE.DIT:
                typeBet = "Đề Cuối"
                break;
            case BET_TYPE.LO_3_SO:
                typeBet = "Lô 3 Số"
                break;
        }
       

        this.lbTimeBet.string = "Thời gian: " + this.generateDate(data.CreatedAt);

     

        let date = new Date(data.SessionId)
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        if (day < 10) {
            day = "0" + day;
        }
        if (month < 10) {
            month = "0" + month;
        }
        this.lbDate.string = "Miền Bắc: " + day + "/" + month + "/" + year;
        cc.log("check tiem bet : ", day)

        this.lbTypeBet.string = "(" + typeBet + ")";
        this.lbTotalBet.string = Global.formatMoneyChip(data.TotalBetMoney);

        // Chuỗi ban đầu
        var chuoiNgay = data.BetValue;

        // Tách chuỗi thành mảng bằng dấu phẩy
        var mangNgay = chuoiNgay.split(',');


        var mangWin = [];
        if (data.AwardResult !== null) {
            // Chuỗi ban đầu
            var chuoiWin = data.AwardResult;

            // Tách chuỗi thành mảng bằng dấu phẩy
            mangWin = chuoiWin.split(',');
        }
        
        cc.log("check nimber bet : ", mangWin)

        this.listItemNumber.removeAllChildren();
        for (let i = 0; i < mangNgay.length; i++) {
            const data = mangNgay[i];
            let item = null;
            if (i < this.listItemNumber.children.length) {
                item = this.listItemNumber.children[i];
            }
            else {
                item = cc.instantiate(this.itemNumber);
            }
            item.getChildByName("lbNumber").getComponent(cc.Label).string = data;
            if(mangWin.includes(data)){
                item.getComponent(cc.Sprite).spriteFrame = this.listSprItemNumber[0]
            }
            else{
                item.getComponent(cc.Sprite).spriteFrame = this.listSprItemNumber[1]
            }
            this.listItemNumber.addChild(item);
        }

        var mangSo = data.BetValue.split(","); // Tách chuỗi thành mảng
        var soPhanTu = mangSo.length;

        if (data.Prize > 0){
            this.lbResult.string = "+" + Global.formatNumber(data.Prize);
            this.lbResult.node.color = cc.Color.YELLOW;
        }
        else{
            this.lbResult.string = "-" + Global.formatNumber(data.TotalBetMoney);
            this.lbResult.node.color = cc.Color.RED;
        }


        if(data.SessionId !== this.getSessionId()){
            this.sprItem.spriteFrame = this.listSprItem[1];
        }
        else{
            cc.log("chay vao day 1 lan")
            this.sprItem.spriteFrame = this.listSprItem[0];
            if(data.AwardResult === null){
                this.lbResult.string = "Đang chờ kết quả"
                this.lbResult.node.color = cc.Color.WHITE;
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
        cc.log("phus la : ", seconds);
        return hours + ":" + minutes + ":" + seconds + "-" + day + "/" + month + "/" + year;
    },


    getSessionId(){
        let dateNow = new Date();
        let day = dateNow.getDate();
        let month = dateNow.getMonth() + 1;
        let year = dateNow.getFullYear();

        if (day < 10) {
            day = "0" + day;
        }
        if (month < 10) {
            month = "0" + month;
        }

        return year + "-" + month + "-" + day;
        
    },



    // update (dt) {},
});
