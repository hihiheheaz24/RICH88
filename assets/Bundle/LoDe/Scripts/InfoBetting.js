// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // lbDate : cc.Label,
        lbTypeBet : cc.Label,
        // lbNumberBet : cc.Label,
        lbBetOne : cc.Label,
        // lbTotalBet : cc.Label,
        lbRate : cc.Label,
        lbMinBet : cc.Label,
        lbRateWin : cc.Label,
        lbWinOnce : cc.Label,
        // lbWin : cc.Label,
        listItemNumber : cc.Node,
        itemNumber : cc.Node,
        edbInputBetOnce : cc.EditBox
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
        this.dataBet = data;
        this.handleInfoBet(data);
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

    // this.lbDate.string = day + "/" + month + "/" + year;

        let typeBet = "";
        switch (data.typeBet) {
            case BET_TYPE.DE:
                typeBet = "ĐỀ ĐẶC BIỆT"
                break;
            case BET_TYPE.LO:
                typeBet = "LÔ 2 SỐ"
                break;
            case BET_TYPE.XIEN_2:
                typeBet = "LÔ XIÊN 2"
                break;
            case BET_TYPE.XIEN_3:
                typeBet = "LÔ XIÊN 3"
                break;
            case BET_TYPE.XIEN_4:
                typeBet = "LÔ XIÊN 4"
                break;
            case BET_TYPE.BA_CANG:
                typeBet = "BA CÀNG"
                break;
            case BET_TYPE.DAU:
                typeBet = "ĐỀ ĐẦU"
                break;
            case BET_TYPE.DIT:
                typeBet = "ĐỀ CUỐI"
                break;
            case BET_TYPE.LO_3_SO:
                typeBet = "LÔ 3 SỐ"
                break;
        }

        cc.log("check config bet : ", data.configBet)
        let configGame = data.configBet;
        let tracuoc1 = configGame.XBetValue;
        let tracuoc2 = 1;
        let tracuoc3 = configGame.XRewardValue;


        this.lbTypeBet.string = "/ " + typeBet + " / " + "1 ĂN " + tracuoc3;
        // this.lbNumberBet.string = data.numberbet;
        this.lbRate.string = "Cần thanh toán X" +  tracuoc1 + " cho mỗi số";
        this.lbMinBet.string = Global.formatNumber(tracuoc1*1000);
        this.lbRateWin.string = "1 ăn " + tracuoc3;
        this.handleNumberBet(data.numberbet);
        if(Global.LoDe.typeBet === BET_TYPE.XIEN_2 || Global.LoDe.typeBet === BET_TYPE.XIEN_3 || Global.LoDe.typeBet === BET_TYPE.XIEN_4){
            this.lbBetOne.string = Global.formatNumber(data.betOne);
        }
        else{
            this.lbBetOne.string = Global.formatNumber(data.betOne * Global.LoDe.listNumberbet.length);
        }

        this.lbWinOnce.string = Global.formatNumber(parseInt(data.betOne / tracuoc1 * tracuoc3))
        if(data.pointBet < tracuoc1 * 1000){
            this.edbInputBetOnce.string = Global.formatNumber(tracuoc1 * 1000);
        }
        else{
            this.edbInputBetOnce.string = Global.formatNumber(data.pointBet);
        }
        // this.lbTotalBet.string = data.totalBet;
        // this.lbWin.string = Global.formatNumber(data.winMoney);
    },

    handleNumberBet(dataNummber){
        cc.log("check data nummber : ",dataNummber)
         // Tách chuỗi thành mảng bằng dấu phẩy
         var arrNuber = dataNummber.split(',');

         this.listItemNumber.removeAllChildren();
         for (let i = 0; i < arrNuber.length; i++) {
             const data = arrNuber[i];
             let item = null;
             if (i < this.listItemNumber.children.length) {
                 item = this.listItemNumber.children[i];
             }
             else {
                 item = cc.instantiate(this.itemNumber);
             }
             item.getChildByName("lbNumber").getComponent(cc.Label).string = data;
             this.listItemNumber.addChild(item);
         }
    },

    onClickBet(){
        if(parseInt(this.lbBetOne.string.replace(/\./g, "")) <= 0 || isNaN(parseInt(this.lbBetOne.string.replace(/\./g, "")))){
            Global.LoDe.effectThongBaoCuoiGame("Vui lòng chon số điểm cược");
            return;
        }
        if(this.dataBet.typeBet === BET_TYPE.XIEN_2 || this.dataBet.typeBet === BET_TYPE.XIEN_3 || this.dataBet.typeBet === BET_TYPE.XIEN_4){
            this.dataBet.numberbet = this.sortNumbersInString(this.dataBet.numberbet);
        }
        let msg = {};
        msg[1] = this.dataBet.typeBet;
        msg[2] = this.dataBet.numberbet;
        if(Global.LoDe.typeBet === BET_TYPE.XIEN_2 || Global.LoDe.typeBet === BET_TYPE.XIEN_3 || Global.LoDe.typeBet === BET_TYPE.XIEN_4){
            msg[3] = parseInt(parseInt(this.lbBetOne.string.replace(/\./g, "")) /  this.dataBet.configBet.XBetValue); //Global.LoDe.pointBet;
        }
        else{
            msg[3] = parseInt(parseInt(this.lbBetOne.string.replace(/\./g, "")) /  this.dataBet.configBet.XBetValue / Global.LoDe.listNumberbet.length); //Global.LoDe.pointBet;
        }
        cc.log("check send to bet : ", msg)
        cc.log("chcekc bet one : ", parseInt(this.lbBetOne.string.replace(/\./g, "")))
        require("SendRequest").getIns().MST_Client_LoDe_Betting_Game(msg);
        this.hide();
    },

    editBoxTextChanged: function (sender, text) {
        let strTemp = "";
        for (let i = 0; i < text.string.length; i++) {
            if (text.string.charAt(i) >= 0 && text.string.charAt(i) <= 9) {
                strTemp += text.string.charAt(i)
            }
        }
        if (strTemp == "") return;
        this.moneyTotal = parseInt(strTemp);
        if(this.moneyTotal < 0) this.moneyTotal = "";
        
        if (this.moneyTotal > MainPlayerInfo.ingameBalance) 
            this.moneyTotal = MainPlayerInfo.ingameBalance;
        if( MainPlayerInfo.ingameBalance === 0)
            this.moneyTotal = "";

        let xBetValue =  Global.LoDe.configBet[Global.LoDe.typeBet]
        let pointBet =  this.moneyTotal;

        // Global.LoDe.pointBet = pointBet;
        // Global.LoDe.edbPointBet.string = pointBet;

        let valueBet = 0;
        let valueWin = 0;

        if(Global.LoDe.typeBet === BET_TYPE.XIEN_2 || Global.LoDe.typeBet === BET_TYPE.XIEN_3 || Global.LoDe.typeBet === BET_TYPE.XIEN_4){
            valueBet = Global.formatNumber(pointBet)
            valueWin = Global.formatNumber(pointBet * xBetValue.XRewardValue);
        }
        else{
            valueBet =Global.formatNumber(pointBet *  Global.LoDe.listNumberbet.length)
            valueWin = Global.formatNumber(pointBet * xBetValue.XRewardValue);
        }

        this.lbBetOne.string = valueBet;
        this.lbWinOnce.string = Global.formatNumber( parseInt(pointBet / xBetValue.XBetValue * xBetValue.XRewardValue))

        // this.lbTotalBet.string = valueBet;
        // this.lbWin.string =valueWin;

        // Global.LoDe.betOne = pointBet * xBetValue.XBetValue;
        // if(!isNaN(pointBet * xBetValue.XBetValue * Global.LoDe.listNumberbet.length) && !isNaN(pointBet * xBetValue.XRewardValue)){
        //     Global.LoDe.lbTotalBet.string = valueBet;
        //     Global.LoDe.lbTotalWin.string = valueWin;
        // }
        // else{
        //     Global.LoDe.lbTotalBet.string = 0;
        //     Global.LoDe.lbTotalWin.string = 0;
        // }
        cc.log("chya dc den cuoi ",valueBet)
        cc.log("chya dc den cuoi ",valueWin)
    },

    edbTextEnd(text){
        let configGame = this.dataBet.configBet;
        let tracuoc1 = configGame.XBetValue;
        let tracuoc2 = 1;
        let tracuoc3 = configGame.XRewardValue;
        let pointBet = 0;
        if(this.edbInputBetOnce.string < tracuoc1 * 1000){
            cc.log("betn duoi muc toi thieu")
            pointBet = tracuoc1 * 1000;
            this.edbInputBetOnce.string = Global.formatNumber(tracuoc1 * 1000);
            Global.UIManager.showNoti("Số tiền cược tối thiểu là là " + Global.formatNumber(tracuoc1 * 1000))

            let valueBet = 0;
            let valueWin = 0;
    
            if(Global.LoDe.typeBet === BET_TYPE.XIEN_2 || Global.LoDe.typeBet === BET_TYPE.XIEN_3 || Global.LoDe.typeBet === BET_TYPE.XIEN_4){
                valueBet = Global.formatNumber(pointBet);
                valueWin = Global.formatNumber(pointBet * tracuoc3);
            }
            else{
                valueBet =  Global.formatNumber(pointBet *  Global.LoDe.listNumberbet.length);
                valueWin = Global.formatNumber(pointBet * tracuoc3);
            }
    
            this.lbBetOne.string = valueBet;
            this.lbWinOnce.string = Global.formatNumber(parseInt(pointBet / tracuoc1 * tracuoc3))
        }
        else{
            this.edbInputBetOnce.string = Global.formatNumber(text.string)
        }
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
