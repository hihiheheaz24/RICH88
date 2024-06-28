cc.Class({
    extends: cc.Component,

    properties: {
        lbNumberBet : cc.EditBox,
        lbTotalBet : cc.Label,
        lbTotalWin : cc.Label,
        textEffect:cc.RichText,
        edbPointBet : cc.EditBox,
        parentPopup : cc.Node,
        lbRules : cc.RichText,
        lbRulesWin : cc.Label,
        lbTime : cc.Label,
        lbDate : cc.Label,
        lbMinbet : cc.Label,
        toggleChooseTypeBet : cc.Toggle,
        nodeAll : cc.Node,
        avatar : cc.Sprite,
        lbName : cc.Label,
        lbGold : cc.Label,
        toggleNoteNumber : cc.Toggle,

        nodeChooseTypeBet : cc.Node,
        nodeNoteNumber : cc.Node,

        listToggleSlectTypeBet : [cc.Toggle]
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Global.LoDe = this;
        this.typeBet = 1;
        this.numberRequire = 0;
        this.maxNumberSelectRequire = 0;
        this.minNumberSelectRequire = 0; 
        this.listNumberbet = [];
        this.configBet = [];
        this.pointBet = 0;
        this.dataBet = {};
        this.betOne = 0;
        this.gameType = GAME_TYPE.LODE;
        this.updateInfoUser();
        this.nodeNoteNumber.active = false;
        this.analyticsView = null;
    },

    updateInfoUser(){
        Global.GetAvataById(this.avatar, MainPlayerInfo.accountId);
        this.lbName.string = MainPlayerInfo.userName;
        this.lbGold.string = MainPlayerInfo.ingameBalance;
    },

    configGame(){
        cc.log("check type bet : ", this.typeBet)
        cc.log("check config bet : ", this.configBet)
        let configGame = this.configBet[this.typeBet];
        let tracuoc1 = configGame.XBetValue;
        let tracuoc2 = 1;
        let tracuoc3 = configGame.XRewardValue;

        this.lbRules.string = "Cần thanh toán X" + configGame.XBetValue + " cho mỗi số";
        this.lbRulesWin.string = "1 ăn " + tracuoc3;
        this.lbMinbet.string = Global.formatNumber(tracuoc1*1000);
        // this.lbRules.string = `THANH TOÁN <color=#FF7C3F>${tracuoc1}</color> LÔ ĐẶT <color=#FF7C3F>${tracuoc2}</color> ĂN <color=#FF7C3F>${tracuoc3} </color>`;
      
    },

    onClickToggleNoteNumber(){
        this.nodeNoteNumber.active = true;
    },

    setLbChooseNumber(){
        let configGame = this.configBet[this.typeBet];
        if(!configGame) return;
        let tracuoc1 = configGame.XBetValue;
        let tracuoc2 = 1;
        let tracuoc3 = configGame.XRewardValue;

        let nameBet = "";
        switch (this.typeBet) {
            case BET_TYPE.DE:
                nameBet = "ĐỀ ĐẶC BIỆT"
                break;
            case BET_TYPE.LO:
                nameBet = "LÔ 2 SỐ"
                break;
            case BET_TYPE.XIEN_2:
                nameBet = "LÔ XIÊN 2"
                break;
            case BET_TYPE.XIEN_3:
                nameBet = "LÔ XIÊN 3"
                break;
            case BET_TYPE.XIEN_4:
                nameBet = "LÔ XIÊN 4"
                break;
            case BET_TYPE.BA_CANG:
                nameBet = "BA CÀNG"
                break;
            case BET_TYPE.DAU:
                nameBet = "ĐẦU"
                break;
            case BET_TYPE.DIT:
                nameBet = "ĐÍT"
                break;
            case BET_TYPE.LO_3_SO:
                nameBet = "LÔ 3 SỐ"
                break;
        }

        Global.ChonSoLoDe.lbChooseNumber.string = nameBet + " ĐẶT " + tracuoc1 + " ĂN " + Global.formatNumber(tracuoc3);

    },

    responseServer(responseCode, packet){
        switch (responseCode) {
            case RESPONSE_CODE.MSG_SERVER_OPEN_GAME:
                cc.log("check data join game lode", packet)
                for (let i = 0; i < packet[2].length; i++) {
                    const data = JSON.parse(packet[2][i]);
                    this.configBet.push(data)
                }
                this.configGame();
                this.handleConfigBet();
                let time = packet[4];
                this.lbTime.string = Global.formatTimeBySec(time, true);
                this.schedule(this.funcTimeCountDown = () => {
                    time--;
                    this.lbTime.string = Global.formatTimeBySec(time, true);
                    if (time == 0) {
                        this.unschedule(this.funcTimeCountDown);
                        this.lbTime.string = "TRẢ THƯỞNG";
                    }
                }, 1); 

                let dateNow = new Date(packet[1]);
                let day = dateNow.getDate();
                let month = dateNow.getMonth() + 1;
                let year = dateNow.getFullYear();

                if (month < 10) {
                    month = "0" + month;
                }
                if (day < 10) {
                    day = "0" + day;
                }

                this.lbDate.string = day + "/" + month + "/" + year;
                this.onClickShowChonSo(null, "lo2so")
                // this.lo2so.isChecked = true;
                cc.log("check config bet: ", this.configBet)
                this.onClickNoteNumber();
                this.toggleNoteNumber.isChecked = true;
                this.nodeChooseTypeBet.active = true;
                break;

            case RESPONSE_CODE.MSG_SERVER_BETTING_RESPONSE:
                //Đặt cược thành công
                cc.log("chay vao dat cuoc thanh comg lo de")
                MainPlayerInfo.setMoneyUser(packet[1]);
                this.effectThongBaoCuoiGame("Đặt cược thành công");
                this.resetGameView();
                this.updateInfoUser();
                if(Global.ChonSoLoDe)
                    Global.ChonSoLoDe.resetNumberBet();
                break;

            case RESPONSE_CODE.MSG_SERVER_GET_HISTORY_RESPONSE:
                cc.log("check his lode : ", packet)
                if(Global.LoDeHistory)
                    Global.LoDeHistory.handleData(packet[2]);
                break;

            case RESPONSE_CODE.MSG_SERVER_GET_DAILY_RESULT_RESPONSE:
                cc.log("check data ket qua : ", packet)
                Global.ResultView.handleDataResult(packet);
                break;

            case RESPONSE_CODE.MSG_SERVER_PUSH_RESULT:
                cc.log("check data MSG_SERVER_PUSH_RESULT : ", packet);
                MainPlayerInfo.setMoneyUser(packet[4]);
                this.effectThongBaoCuoiGame("Bạn đã thắng số tiền : " + Global.formatNumber(packet[3]));
                break;

            case RESPONSE_CODE.MSG_SERVER_GET_CHAT_LIST_RESPONSE:
                cc.log("check data MSG_SERVER_GET_CHAT_LIST_RESPONSE : ", packet)
                break;

            case RESPONSE_CODE.MSG_SERVER_PUSH_PLAYER_CHATTING:
                cc.log("check data MSG_SERVER_PUSH_PLAYER_CHATTING : ", packet)
                break;
        }
    },

    handleConfigBet(){
        for (let i = 0; i < this.configBet.length; i++) {
            const objConfig = this.configBet[i];
            if(this.listToggleSlectTypeBet[i]){
                cc.log("co chay vao day : ", objConfig.XRewardValue)
                this.listToggleSlectTypeBet[i].node.getChildByName("bg-rate").getChildByName("lbRate").getComponent(cc.Label).string = "1 ăn " + objConfig.XRewardValue;
            }
        }
    },

    startGame(){
        require("SendRequest").getIns().MST_Client_LoDe_Open_Game();
    },

    start () {

    },

    onClickShowChonSo(event, data){
        this.resetGameView();
        switch (data) {
            //baolo
            case "lo2so":
                this.typeBet = BET_TYPE.LO;
                this.numberRequire = 100;
                this.minNumberSelectRequire = 1;
                this.maxNumberSelectRequire = 10;
                break;
            case "lo3so":
                this.typeBet = BET_TYPE.LO_3_SO;
                this.numberRequire = 1000;
                this.minNumberSelectRequire = 1;
                this.maxNumberSelectRequire = 10;
                break;
            //loxien
            case "xien2":
                this.typeBet = BET_TYPE.XIEN_2;
                this.numberRequire = 100;
                this.minNumberSelectRequire = 2;
                this.maxNumberSelectRequire = 2;
                break;
            case "xien3":
                this.typeBet = BET_TYPE.XIEN_3;
                this.numberRequire = 100;
                this.minNumberSelectRequire = 3;
                this.maxNumberSelectRequire = 3;
                break;
            case "xien4":
                this.typeBet = BET_TYPE.XIEN_4;
                this.numberRequire = 100;
                this.minNumberSelectRequire = 4;
                this.maxNumberSelectRequire = 4;
                break;
            //danhde
            case "dedacbiet":
                this.typeBet = BET_TYPE.DE;
                this.numberRequire = 100;
                this.minNumberSelectRequire = 1;
                this.maxNumberSelectRequire = 10;
                break;
            //3cang
            case "3cang":
                this.typeBet = BET_TYPE.BA_CANG;
                this.numberRequire = 1000;
                this.minNumberSelectRequire = 1;
                this.maxNumberSelectRequire = 10;
                break;
        }
        this.configGame();
        cc.log("check xem : ", Global.ChonSoLoDe)
        this.dataBet = {};
        cc.log("check xem 22: ", Global.ChonSoLoDe)
        this.dataBet.typeBet = this.typeBet;
        this.dataBet.numberRequire = this.numberRequire;
        this.dataBet.minNumberSelectRequire = this.minNumberSelectRequire;
        this.dataBet.maxNumberSelectRequire = this.maxNumberSelectRequire;
        this.toggleChooseTypeBet.isChecked = true;
        this.nodeAll.active = false;
        if(Global.ChonSoLoDe)
            Global.ChonSoLoDe.changeTab();

    },

    clickShowTabChonSo(){
        if (Global.ChonSoLoDe == null) {
            let bundle = cc.assetManager.getBundle(this.gameType.toString());
            bundle.load("Prefabs/ChonSoLoDe", cc.Prefab, (err, prefab) => {
                let item = cc.instantiate(prefab).getComponent("ChonSoLoDe");
                this.parentPopup.addChild(item.node);
                item.show(this.dataBet);
            });
        } else {
            Global.ChonSoLoDe.show(this.dataBet);
        }
    },

    clickShowAnalyticsView(){
        if (this.analyticsView == null) {
            let bundle = cc.assetManager.getBundle(this.gameType.toString());
            bundle.load("Prefabs/AnalyticsView", cc.Prefab, (err, prefab) => {
                let item = cc.instantiate(prefab).getComponent("AnalyticsView");
                this.analyticsView = item;
                this.parentPopup.addChild(item.node);
                item.show();
            });
        } else {
            this.analyticsView.show();
        }

        if(Global.ResultView)
            Global.ResultView.node.active = false;

        if(Global.LoDeHistory)
            Global.LoDeHistory.node.active = false;
    },

    clickShowTabResult() {

        Global.UIManager.showMiniLoading();
        if (Global.ResultView == null) {
            let bundle = cc.assetManager.getBundle(this.gameType.toString());
            bundle.load("Prefabs/ResultView", cc.Prefab, (err, prefab) => {
                let item = cc.instantiate(prefab).getComponent("ResultView");
                this.parentPopup.addChild(item.node);
                item.show();
                item.generateDate();
            });
        } else {
            Global.ResultView.show();
        }

        if(Global.LoDeHistory)
            Global.LoDeHistory.node.active = false;
        if(this.analyticsView)
            this.analyticsView.active = false;
    },

    editBoxTextBegin: function (stext){
        this.edbPointBet.string = stext.string.replace(/\./g, "")
    },

    editboxChange: function (editBoxString) {
        //công thức tính tiền bet
        let xBetValue = this.configBet[this.typeBet]
        let pointBet =  parseInt(editBoxString) ;
        cc.log("check point bet : ", pointBet);
        cc.log("check xBetValue bet : ", xBetValue.XBetValue);
        if(pointBet < xBetValue.XBetValue * 1000){
            cc.log("betn duoi muc toi thieu")
            pointBet = xBetValue.XBetValue * 1000;
            this.edbPointBet.string = xBetValue.XBetValue * 1000;
            Global.UIManager.showNoti("Số tiền cược tối thiểu là là " + Global.formatNumber(xBetValue.XBetValue * 1000))
        }
        this.pointBet = pointBet;
        this.betOne = pointBet;
        cc.log("check tham so  : ",pointBet , " hcekc xx ",xBetValue.XBetValue, "check number ber : ", this.listNumberbet.length )

        let valueBet = 0;
        let valueWin = 0;

        if(this.typeBet === BET_TYPE.XIEN_2 || this.typeBet === BET_TYPE.XIEN_3 || this.typeBet === BET_TYPE.XIEN_4){
            valueBet = Global.formatNumber(parseInt(pointBet)) 
            valueWin = Global.formatNumber(pointBet * xBetValue.XRewardValue);
        }
        else{
            valueBet = Global.formatNumber(parseInt(pointBet *  this.listNumberbet.length)) 
            valueWin = Global.formatNumber(pointBet * xBetValue.XRewardValue);
        }

   
        

        if(!isNaN(pointBet * xBetValue.XBetValue * this.listNumberbet.length) && !isNaN(pointBet * xBetValue.XRewardValue)){
            this.lbTotalBet.string = valueBet;
            this.lbTotalWin.string = Global.formatNumber( parseInt(pointBet / xBetValue.XBetValue * xBetValue.XRewardValue)) //Global.formatNumber(valueWin * 1000 / this.listNumberbet.length);
        }
        else{
            this.lbTotalBet.string = 0;
            this.lbTotalWin.string = 0;
        }



        // cc.log("cehck edb : ", editBoxString)
        // let strTemp = "";
        // for (let i = 0; i < editBoxString.length; i++) {
        //     if (editBoxString.charAt(i) >= 0 && editBoxString.charAt(i) <= 9) {
        //         strTemp += editBoxString.charAt(i)
        //     }
        // }
        // if (strTemp == "") return;
        // this.moneyTotal = parseInt(strTemp);
        // if(this.moneyTotal < 0) this.moneyTotal = "";
        
        // if (this.moneyTotal > MainPlayerInfo.ingameBalance) 
        //     this.moneyTotal = MainPlayerInfo.ingameBalance;
        // if( MainPlayerInfo.ingameBalance === 0)
        //     this.moneyTotal = "";
        // this.edbPointBet.string =  Global.formatNumber(editBoxString.replace(/\./g, "")) ;
        // this.edbPointBet.focus()
    },

    editTextEndMoney(editBoxString){
        var chuoiNhap = editBoxString.string;
        if(chuoiNhap === "") {
            this.edbPointBet.string = "";
            return;
        } 
        var soDaLoaiBo0DauTien = parseInt(chuoiNhap, 10).toString();
        cc.log("check number : ", soDaLoaiBo0DauTien)
        this.edbPointBet.string = Global.formatNumber(soDaLoaiBo0DauTien)
    },

    edbTextEnd(data) {
        // Lấy chuỗi từ EditBox
        let inputString = data.string.replace(/[^0-9]/g, '');

        cc.log("data nhap vao", data.string)

        // Xử lý chuỗi để tạo các cặp số
        let numberPairs = ""
        if(this.typeBet === BET_TYPE.BA_CANG || this.typeBet === BET_TYPE.LO_3_SO){
            numberPairs = this.splitStringIntoThree(inputString);
            numberPairs.slice(0, this.maxNumberSelectRequire);
            this.listNumberbet = numberPairs.slice(0, this.maxNumberSelectRequire);
        }
        else if(this.typeBet === BET_TYPE.XIEN_2 || this.typeBet === BET_TYPE.XIEN_3 || this.typeBet === BET_TYPE.XIEN_4){
            numberPairs = this.laySoTuChuoi(this.formatStringWithHyphen(inputString), this.maxNumberSelectRequire);
            this.listNumberbet = numberPairs.split("-");;
        }
        else {
            numberPairs = this.splitStringIntoPairs(inputString);
            numberPairs.slice(0, this.maxNumberSelectRequire);
            this.listNumberbet = numberPairs.slice(0, this.maxNumberSelectRequire);
        }


        this.lbMinbet.string = Global.formatNumber(this.configBet[this.typeBet].XBetValue * 1000)
        this.edbPointBet.string = Global.formatNumber( this.configBet[this.typeBet].XBetValue * 1000);
        // In kết quả ra console (bạn có thể xử lý kết quả theo nhu cầu của mình)
        cc.log("check list ban dau : ", numberPairs)
       
        Global.LoDe.lbNumberBet.string = numberPairs;
        // this.listNumberbet = this.listNumberbet.map(num => parseInt(num));
        console.log("data tra ve sau do", this.listNumberbet);


        this.pointBet = this.edbPointBet.string.replace(/\./g, "");
        let xBetValue = this.configBet[this.typeBet];
        let pointBet =  this.pointBet;
        let valueBet = 0;
        let valueWin = 0;

        this.betOne = pointBet;
        cc.log("check value bet one : ", this.betOne);
        if(this.typeBet === BET_TYPE.XIEN_2 || this.typeBet === BET_TYPE.XIEN_3 || this.typeBet === BET_TYPE.XIEN_4){
            valueBet = Global.formatNumber(parseInt(pointBet)) 
            valueWin = Global.formatNumber(pointBet * xBetValue.XRewardValue);
        }
        else{
            valueBet = Global.formatNumber(parseInt(pointBet *  this.listNumberbet.length)) 
            valueWin = Global.formatNumber(pointBet * xBetValue.XRewardValue);
        }


        if(!isNaN(pointBet * xBetValue.XBetValue * this.listNumberbet.length) && !isNaN(pointBet * xBetValue.XRewardValue)){
            this.lbTotalBet.string = valueBet;
            this.lbTotalWin.string = Global.formatNumber( parseInt(pointBet / xBetValue.XBetValue * xBetValue.XRewardValue))  //Global.formatNumber(valueWin * 1000);
        }
        else{
            this.lbTotalBet.string = 0;
            this.lbTotalWin.string = 0;
        }
    },

    effectThongBaoCuoiGame(str){
        cc.log("chay vao day >> ", str)
        let node = this.textEffect.node.parent;
        node.stopAllActions();
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

    onClickCommingSoon(){
        Global.UIManager.showNoti("Tính năng sắp được mở")
    },

    onClickShowHistory(){
        Global.UIManager.showMiniLoading();
        if (Global.LoDeHistoty == null) {
            let bundle = cc.assetManager.getBundle(this.gameType.toString());
			bundle.load("Prefabs/LoDeHistoty", cc.Prefab, (err, prefab) => {
				let item = cc.instantiate(prefab).getComponent("LoDeHistoty");
				Global.LoDeHistoty = item;
				item.show();
				this.parentPopup.addChild(item.node);
			});
		} else {
			Global.LoDeHistoty.show();
		}
        if(Global.ResultView)
            Global.ResultView.node.active = false;
        if(this.analyticsView)
            this.analyticsView.node.active = false;
    },

    onClickShowGuide(){
        if (Global.GuideViewLoDe == null) {
            cc.log("chay vao guide 1111")
            let bundle = cc.assetManager.getBundle(this.gameType.toString());
			bundle.load("Prefabs/GuideView", cc.Prefab, (err, prefab) => {
				let item = cc.instantiate(prefab).getComponent("GuideViewLoDe");
				Global.GuideViewLoDe = item;
				this.node.addChild(item.node);
                item.show();
			});
		} else {
            cc.log("chay vao guide 222")
			Global.GuideViewLoDe.show();
		}
    },

    onClickShowInfoBet1(){
        if(this.listNumberbet.length <=0 ){
            this.effectThongBaoCuoiGame("Bấm để nhập số ( chọn tối đa 10 số )");
            return;
        }
        if(this.listNumberbet.length < this.numberSelectRequire){
            this.effectThongBaoCuoiGame("Bạn chưa chọn đủ số");
            return;
        }
        if(this.pointBet <= 0 || isNaN(this.pointBet)){
            this.effectThongBaoCuoiGame("Vui lòng chon số điểm cược");
            return;
        }
        let msg = {};
        msg[1] = this.typeBet;
        msg[2] = this.lbNumberBet.string;
        msg[3] = parseInt(parseInt(this.lbTotalBet.string.replace(/\./g, ""))  /  this.listNumberbet.length /  this.configBet[this.typeBet].XBetValue); //Global.LoDe.pointBet;
        cc.log("check send to bet : ", msg)
        cc.log("chcekc bet one : ", parseInt(this.lbTotalBet.string.replace(/\./g, "")))
        require("SendRequest").getIns().MST_Client_LoDe_Betting_Game(msg);
    },


    onClickShowInfoBet(){
        if(this.listNumberbet.length <=0 ){
            this.effectThongBaoCuoiGame("Bấm để nhập số ( chọn tối đa 10 số )");
            return;
        }
        if(this.listNumberbet.length < this.numberSelectRequire){
            this.effectThongBaoCuoiGame("Bạn chưa chọn đủ số");
            return;
        }
        if(this.pointBet <= 0 || isNaN(this.pointBet)){
            this.pointBet = 1000 * this.configBet[this.typeBet].XBetValue;
            this.betOne = this.pointBet;
            this.lbTotalBet.string = Global.formatNumber(1000 * this.configBet[this.typeBet].XBetValue);
            this.lbTotalWin.string = Global.formatNumber( 1000 * this.configBet[this.typeBet].XRewardValue);
            this.edbPointBet.string = this.lbTotalBet.string;
            // this.effectThongBaoCuoiGame("Vui lòng chon số điểm cược");
            // return;
        }
        let dataBet = {};
        dataBet.typeBet = this.typeBet;
        dataBet.numberbet = this.lbNumberBet.string;
        dataBet.betOne =  this.betOne;
        dataBet.totalBet =  this.lbTotalBet.string;
        dataBet.winMoney = this.lbTotalWin.string;
        dataBet.configBet = this.configBet[this.typeBet];
        dataBet.pointBet = this.pointBet;

        if (Global.InfoBetting == null) {
            let bundle = cc.assetManager.getBundle(this.gameType.toString());
			bundle.load("Prefabs/InfoBetting", cc.Prefab, (err, prefab) => {
				let item = cc.instantiate(prefab).getComponent("InfoBetting");
				Global.InfoBetting = item;
				this.parentPopup.addChild(item.node);
                item.show(dataBet);
			});
		} else {
			Global.InfoBetting.show(dataBet);
		}
    },

    onClickChooseTypeBet(event, data) {
        switch (data) {
            case "baolo":
                this.onClickShowChonSo(null, "lo2so")
                break;
            case "loxien":
                this.onClickShowChonSo(null, "xien2")
                break;
            case "3cang":
                this.onClickShowChonSo(null, "3cang")
                break;
            case "dedacbiet":
                this.onClickShowChonSo(null, "dedacbiet")
                break;
        }
        this.resetGameView();
    },


    splitStringIntoPairs(inputString) {
        // Chia chuỗi thành các cặp số, ví dụ: "12345" thành ["12", "34", "05"]
        let pairs = [];
        for (let i = 0; i < inputString.length; i += 2) {
            let pair = inputString.slice(i, i + 2);
            // Nếu cặp số cuối cùng có 1 chữ số, thêm '0' vào trước
            if (pair.length === 1) {
                pair = '0' + pair;
            }
            pairs.push(pair);
        }
        return pairs;
    },

    splitStringIntoThree(inputString) {
        // Chia chuỗi thành các cặp số, ví dụ: "12345" thành ["12", "34", "05"]
        let pairs = [];
        for (let i = 0; i < inputString.length; i += 3) {
            let pair = inputString.slice(i, i + 3);
            // Nếu cặp số cuối cùng có 1 chữ số, thêm '0' vào trước
            if (pair.length === 1) {
                pair = '00' + pair;
            }else if (pair.length === 2) {
                pair = '0' + pair;
            }
            pairs.push(pair);
        }
        return pairs;
    },

    formatStringWithHyphen(inputString) {
        // Chia chuỗi thành các cặp số cách nhau bởi dấu "-"
        let formattedString = "";
        for (let i = 0; i < inputString.length; i += 2) {
            let pair = inputString.slice(i, i + 2);
            if (pair.length === 1) {
                // Nếu cặp chỉ có một chữ số, thêm '0' vào đầu
                pair = '0' + pair;
            }
            formattedString += pair + "-";
        }

        // Loại bỏ dấu "-" cuối cùng nếu có
        formattedString = formattedString.replace(/-$/, '');

        return formattedString;
    },

    laySoTuChuoi(chuoiSo, soLuong) {
        // Tách chuỗi thành mảng bằng dấu gạch ngang
        var mangSo = chuoiSo.split('-');
    
        // Lấy số lượng phần tử theo tham số truyền vào
        var ketQua = mangSo.slice(0, soLuong).join('-');
    
        return ketQua;
    },

    resetGameView(){
        this.lbNumberBet.string = "";
        this.lbTotalBet.string = 0;
        this.lbTotalWin.string = 0;
        this.edbPointBet.string = "";
        this.pointBet = 0;
        this.betOne = 0;
        this.listNumberbet = [];
        
        if(Global.ChonSoLoDe){
            Global.ChonSoLoDe.listNumberBet.children.forEach(item => {
                item.getComponent(cc.Toggle).isCheck = false;
            });
            Global.ChonSoLoDe.listSelected.destroyAllChildren();
        }
       
    },

    onClickAll(event, data){
        this.nodeAll.active =  event.isChecked;
        for (let i = 0; i < this.nodeAll.children.length; i++) {
            const toggle = this.nodeAll.children[i].getComponent(cc.Toggle);
            toggle.isChecked = false;      
        }
    },

    onClickXNumber(){
        this.lbNumberBet.string = "";
        this.lbNumberBet.focus();
    },

    onClickXGold(){
        this.edbPointBet.string = "";
        this.edbPointBet.focus();
    },

    onClickClose(){
        Global.UIManager.hideMask();
        this.node.active = false;
        // Global.LoDe = null;
        // this.node.destroy();
    },

    onClickNoteNumber(){
        if(Global.ResultView)
            Global.ResultView.node.active = false;

        if(Global.LoDeHistory)
            Global.LoDeHistory.node.active = false;

        if(this.analyticsView)
            this.analyticsView.node.active = false;
    },
    // update (dt) {},
});
