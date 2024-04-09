// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        lbDate : cc.Label,
        lbTypeBet : cc.Label,
        lbNumberBet : cc.Label,
        lbBetOne : cc.Label,
        lbTotalBet : cc.Label,
        lbWin : cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Global.InfoBetting = this;
        this.dataBet = null;
    },

    start () {

    },

    show(data){
        Global.onPopOn(this.node);
        this.handleInfoBet(data);
        this.dataBet = data;
    },

    handleInfoBet(data){
        cc.log("check data bet : ", data)

        let dateNow = new Date();
        let day = dateNow.getDate();
        let month = dateNow.getMonth() + 1;
        let year = dateNow.getFullYear();
        cc.log("check day  : ", day)
        if (day < 10) {
            day = "0" + day;
        }
        if (month < 10) {
            month = "0" + month;
        }

    this.lbDate.string = day + "/" + month + "/" + year;

        let typeBet = "";
        switch (data.typeBet) {
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

        this.lbTypeBet.string = typeBet;
        this.lbNumberBet.string = data.numberbet;
        this.lbBetOne.string = Global.formatNumber(data.betOne);
        this.lbTotalBet.string = data.totalBet;
        this.lbWin.string = Global.formatNumber(data.winMoney);
    },

    onClickBet(){
        if(this.dataBet.typeBet === BET_TYPE.XIEN_2 || this.dataBet.typeBet === BET_TYPE.XIEN_3 || this.dataBet.typeBet === BET_TYPE.XIEN_4){
            this.dataBet.numberbet = this.sortNumbersInString(this.dataBet.numberbet);
        }
        let msg = {};
        msg[1] = this.dataBet.typeBet;
        msg[2] = this.dataBet.numberbet;
        msg[3] = Global.LoDe.pointBet;
        cc.log("check send to bet : ", msg)
        require("SendRequest").getIns().MST_Client_LoDe_Betting_Game(msg);
        this.hide();
    },

    hide(){
        Global.onPopOff(this.node);
    },

    sortNumbersInString(inputString) {
        // Tách chuỗi thành mảng các số
        let numbersArray = inputString.split('-');
    
        // Sắp xếp mảng các số
        numbersArray.sort((a, b) => {
            return a - b;
        });
    
        // Ghép mảng thành chuỗi
        let sortedString = numbersArray.join('-');
    
        return sortedString;
    },

    // update (dt) {},
});
