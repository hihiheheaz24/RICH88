cc.Class({
    extends: cc.Component,

    ctor(){
        this.totalReward = 0;
        this.isRegister = false;
    },

    properties: {
        btnRegister: cc.Button,
        btnCancel : cc.Button,
        lbRegister: cc.Label,
        lbDescription: cc.Label,
        lbPrize: cc.Label,
        lbPayout: cc.Label,

        listBlind: cc.ScrollView,
        listPlayerRegister: require("BaseScrollView"),
        itemBlind: cc.Node,

        listTable: require("BaseScrollView"),
        itemTable : cc.Node,

        listPrize : cc.ScrollView,
        itemPrize : cc.Node,

        // tab info
        lbGamename: cc.Label,
        lbBuyIn: cc.Label,
        lbStartingChip: cc.Label,
        lbStart: cc.Label,
        lbTimeLate: cc.Label,
        lbBlind: cc.Label,
        lbReEntry: cc.Label,
        lbNumberPlayers: cc.Label,
        lbBubble: cc.Label,
        lbBreakTime: cc.Label,

        // tab register
        lbStartTimeRegister: cc.Label,
        lbStatusTour: cc.Label,
        lbStartingChipRegister: cc.Label,
        lbTimeCountDown: cc.Label,
        lbStatusPlayer: cc.Label,
        lbRebuyIn: cc.Label,
        lbTotalPlayer: cc.Label,
        lbRebuyTop : cc.Label,
        lbBreakTimeRemain : cc.Label,
        lbBounty : cc.Label,

        returnPrize : cc.Label,
        logoTour : cc.Sprite,
        lbDescriptionTour : cc.Label,

        lbBlindPresend : cc.Label,
        lbBlindNext : cc.Label,

        toggleInfomation : cc.Toggle,
        toggleStructre : cc.Toggle,
        togglePrize : cc.Toggle,
        toggleTable : cc.Toggle,

        lbTotalChip : cc.Label,
        lbAVG : cc.Label,
        lbStackMax : cc.Label,
        lbStackMin : cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {
    // },

    start() {

    },

    show(data) {
        if(!this.isRegister){
            Global.LobbyView.onHideLobby();
            Global.nodeInOutToRight(this.node, null);
            this.toggleInfomation.isChecked = true;
            this.toggleStructre.isChecked = false;
            this.togglePrize.isChecked = false;
            this.toggleTable.isChecked = false;
        } 
        else{
            this.isRegister = false;
            this.onClickListTable();
        }
      
        this.playerStatus = data[PKR_ParameterCode.AccountId];
        this.dataTour = JSON.parse(data[PKR_ParameterCode.TournamentList]);
        this.dataPlayerRegister = data[PKR_ParameterCode.Players];
        this.dataTable = data[PKR_ParameterCode.TableId]
        this.dataReward = JSON.parse(data[PKR_ParameterCode.History]);
        this.timeTurn = data[23];

        this.breakTimeState = data[34];
        this.breakTimeRemainTime = data[35];

        clearInterval(this.timeBreak);
        switch (this.breakTimeState) {
            case -1:
                this.lbBreakTimeRemain.node.active = false;
                break;
            case 0:
                this.lbBreakTimeRemain.node.active = true;
                this.lbBreakTimeRemain.string = "Break time trong: " + Global.formatTimeBySec(this.breakTimeRemainTime, false);
                this.timeBreak = setInterval(()=>{
                    this.breakTimeRemainTime--;
                    this.lbBreakTimeRemain.string = "Break time trong: " + Global.formatTimeBySec(this.breakTimeRemainTime, false);
                },1000)
                break;
            case 1:
                this.lbBreakTimeRemain.node.active = true;
                this.lbBreakTimeRemain.string =  "Break time: " + Global.formatTimeBySec(this.breakTimeRemainTime, false);
                this.timeBreak = setInterval(()=>{
                    this.breakTimeRemainTime--;
                    this.lbBreakTimeRemain.string = "Break time: " + Global.formatTimeBySec(this.breakTimeRemainTime, false);
                },1000)
                break;
        }

        // if(this.dataTour.TicketRewards && this.dataTour.TicketRewards !== ""){
        //     let dataTicket = JSON.parse(this.dataTour.TicketRewards)
        //     this.nodeReward.active = false;
        //     this.nodeTicket.active = true;
        //     this.nodeTicket.getChildByName("lbTicket").getComponent(cc.Label).string = "tickket"
        //     cc.log("check ticket : ", dataTicket)
        // }
        // else{
        //     this.nodeReward.active = true;
        //     this.nodeTicket.active = false;
        // }

        if(this.dataTour.StartBountyValue === 0) this.lbBounty.node.active = false;
        else this.lbBounty.node.active = true

        this.levelBlind = data[17];
        this.nextBlind = data[19];
        this.timeRemainBlind = data[18];
        this.lbBlindNext.node.active = false;
        this.lbBlindPresend.node.active = false;
        this.btnCancel.node.active = false;
        this.showBlindInfoTour(this.dataTour.BlindStep)
        this.timeCountDown = data[PKR_ParameterCode.RemainTime];
        this.lbRebuyTop.string = this.dataTour.ReBuyin;
        this.totalReward = this.dataTour.TotalReward;

        for (let i = 0; i < this.length; i++) {
            const element = this[i];
            
        }

        cc.loader.load(this.dataTour.LogoUrl, (err, sp) => {
            // cc.log("sp la :", sp)
            // if (sp)
            //     this.logoTour.spriteFrame = new cc.SpriteFrame(sp);
            // else
            //     this.logoTour.spriteFrame = null;
        });

        this.lbDescriptionTour.string = this.dataTour.Description;
        this.lbDescription.string = this.dataTour.TourName;
        this.lbPrize.string = Global.formatNumberPoker(this.dataTour.TotalReward);
        this.lbPayout.stirng = this.dataTour.Payout + "%";
        //
        switch (this.dataTour.PlayType) {
            case 1:
                this.lbGamename.string = "No Limit Hold'em";
                Global.TourType = TOUR_TYPE.NORMAL;
                break;
            case 2:
                this.lbGamename.string = "Short Deck";
                Global.TourType = TOUR_TYPE.SHORT_DECK;
                break;
            case 6:
                this.lbGamename.string = "OMAHA";
                Global.TourType = TOUR_TYPE.OMAHA;
                break;
        }

        this.lbBuyIn.string = Global.formatNumberPoker(this.dataTour.Buyin);
        this.lbStartingChip.string = Global.formatNumberPoker(this.dataTour.StartChip);

        this.lbStart.string = this.generateData(this.dataTour.StartTimePlaying);
        this.lbTimeLate.string = this.generateData(this.dataTour.EndTimeRegister);

        // let timeStart = Date.now();
        // let timeEnd = this.convertTimeToSecond(this.dataTour.EndTimeRegister);
        // cc.log("thoi gian start : ", timeStart);
        // cc.log("thoi gian end : ", timeEnd);

        // let time = (timeEnd - timeStart) / 1000;

        this.unschedule(this.funScheduleTimeRegister);
        let time = data[22];
        if(time > 0 && this.dataTour.State !== 0){
            this.lbTimeCountDown.string = Global.formatTimeBySec(time, true);
            this.schedule(this.funScheduleTimeRegister = () => {
                time--;
                this.lbTimeCountDown.string = Global.formatTimeBySec(time, true);
                if (time === 0) {
                    this.unschedule(this.funScheduleTimeRegister);
                    this.btnRegister.interactable = false;
                    this.lbRegister.string = "ĐÓNG ĐĂNG KÝ";
                }
            }, 1);    
        }
       
        let timeDu = parseInt(this.dataTour.TimeChangeBlind%60);
        if(timeDu <= 0) timeDu = ""

        this.lbBlind.string = parseInt(this.dataTour.TimeChangeBlind/60) + " Phút " + timeDu;

        if (this.dataTour.LimitBuyin > 0)
            this.lbReEntry.string = this.dataTour.LimitBuyin;
        else
            this.lbReEntry.string = "KHÔNG GIỚI HẠN";


        if (this.dataTour.LimitPlayer > 0)
            this.lbNumberPlayers.string = this.dataTour.LimitPlayer;
        else
            this.lbNumberPlayers.string = "KHÔNG GIỚI HẠN";
       


        this.lbBubble.string = this.dataTour.Bubble
        this.lbBreakTime.string = this.dataTour.BreakTime + " Phút";

        this.lbRebuyIn.string = Global.formatNumberPoker(this.dataTour.ReBuyin);

        // this.listBlind.onLoad();
        // this.listBlind.resetScr();
        this.genListBlind();

        // this.listTable.onLoad();
        // this.listTable.resetScr();
        // this.genListTable();

        //info register
        this.lbStartTimeRegister.string = "Start: " + this.generateData(this.dataTour.StartTimePlaying);
        let dataBlind = JSON.parse(this.dataTour.BlindStep);

        // TRẠNG THÁI ĐĂNG KÝ
        if (this.playerStatus === -1) {
            this.btnRegister.interactable = true;
            this.lbRegister.string = "ĐĂNG KÝ";
        }
        else {
            this.lbRegister.string = "ĐÃ ĐĂNG KÝ";
            this.btnRegister.interactable = false;
        }
        /////////////////////

        this.lbStatusPlayer.node.active = true;
    
        switch (this.playerStatus) {
            case -1:
                this.lbStatusPlayer.string = "CHƯA ĐĂNG KÝ"
                break;

            case 0:
                this.lbStatusPlayer.string = "ĐANG CHỜ VÀO BÀN"
                break;
            case 1:
                this.lbStatusPlayer.string = "SẮP VÀO BÀN"
                break;
            case 2:
                this.lbStatusPlayer.string = "ĐANG CHƠI"
                break;
            case 3:
                this.lbStatusPlayer.string = "ĐÃ BỊ LOẠI"
                this.btnRegister.interactable = true;
                this.lbRegister.string = "ĐĂNG KÝ";
                break;
        }

        if(data[22] <= 0){
            this.btnRegister.interactable = false;
            this.lbRegister.string = "ĐÓNG ĐĂNG KÝ";
        }

        this.lbStartingChipRegister.string = "Starting chip: " + Global.formatNumberPoker(this.dataTour.StartChip) + " (" +  Global.formatNumberPoker(this.dataTour.StartChip / (dataBlind[0]*2)) + " BB)" //Starting chip: 20.000 (200BB)

        this.lbTotalChip.node.active = true;
        this.lbAVG.node.active = true;
        this.lbStackMax.node.active = true;
        this.lbStackMin.node.active = true;
        //0 : Chua choi, 1: Dang choi, 2: Da bi loai
        switch (this.dataTour.State) {
            case 0:
                this.lbStatusTour.string = "CHỜ ĐĂNG KÝ"
                this.lbRegister.string = "CHỜ ĐĂNG KÝ";
                this.lbTimeCountDown.string = this.generateData(this.dataTour.StartTimeRegister, true);
                this.btnRegister.interactable = false;
                break;
            case 1:
                this.lbStatusTour.string = "ĐANG ĐĂNG KÝ"
                break;
            case 2:
                this.lbStatusTour.string = "ĐĂNG KÝ TRỄ"
                break;
            case 3:
                this.lbStatusTour.string = "ĐANG DIỄN RA"
                break;
            case 4:
                this.lbStatusTour.string = "ITM"
                break;
            case 5:
                this.lbStatusTour.string = "FINAL TABLE"
                break;
            case 6:
                this.lbStartingChipRegister.string = "Stop: " + this.generateData(this.dataTour.StopTime);
                if(this.dataTour.StopLevel > 0)
                    this.listBlind.node.getComponent(cc.ScrollView).content.children[this.dataTour.StopLevel-1].getChildByName("bgr-line-2").active = true;
                this.lbTotalChip.node.active = false;
                this.lbAVG.node.active = false;
                this.lbStackMax.node.active = false;
                this.lbStackMin.node.active = false;
                this.lbStatusTour.string = "ĐÃ KẾT THÚC"
                this.lbRegister.string = "ĐÃ KẾT THÚC"
                this.lbStatusPlayer.node.active = false;
                break;
            case 7:
                this.lbStatusTour.string = "TOUR ĐÃ HỦY"
                this.lbRegister.string = "ĐÃ KẾT THÚC"
                this.lbStatusPlayer.node.active = false;
                break;
        }


        let timeNow = Date.now();
        let timeStartTour = this.convertTimeToSecond(this.dataTour.StartTimePlaying);
        let timeCancelTour = parseInt((timeStartTour - timeNow) / 1000);

        cc.log("time show la : ", timeCancelTour);

        if(timeCancelTour > 300 && this.playerStatus !== -1){
            this.btnCancel.node.active = true;
        }
    

        this.listPlayerRegister.onLoad();
        this.listPlayerRegister.resetScr();
        this.genListPlayerRegister();
        this.lbTotalPlayer.string = this.indexStack + "/" +this.dataPlayerRegister.length;

        //SHOW TAB GIAI THUONG
        this.showLbPrize();
    },

    onClickCancelTour() {
        Global.UIManager.showConfirmPopup("Bạn có muốn hủy đăng ký không ?",
            () => {
                require("SendCardRequest").getIns().MST_Client_Poker_Cancel_Register_Tour(this.dataTour.Id);
            }
        )
    },

    cancelRegisterTournament(data){
        this.btnCancel.node.active = false;
        this.btnRegister.interactable = true;
        this.lbRegister.string = "ĐĂNG KÝ";
		MainPlayerInfo.ingameBalance = data[PKR_ParameterCode.Cash];
        Global.UIManager.showCommandPopup("Hủy thành công");
        //
        this.isRegister = true;
        let msg = {};
        msg[PKR_ParameterCode.TourId] = this.dataTour.Id;
        require("SendCardRequest").getIns().MST_Client_Tournament_Get_Info(msg);
    },

    showBlindInfoTour(data) {
        //[10,15,20,30,40,50,60,75,90,100,125,150,175,200,225,250,300,350,400,500]
        let dataBlind = JSON.parse(data)
        let presendBlind = 0;
        if (this.levelBlind === 0) return;

        this.lbBlindNext.node.active = true;
        this.lbBlindPresend.node.active = true;

        for (let i = 0; i < dataBlind.length; i++) {
            const blind = dataBlind[i];
            cc.log("set blind : ", blind)
            if (i === this.levelBlind - 1) {
                this.lbBlindPresend.string = "Level " + this.levelBlind + ": " + blind + "/" + blind * 2;
                presendBlind = blind;
            }
            if (i === this.nextBlind - 1) {
                this.lbBlindNext.string = "Level " + this.nextBlind + ": " + blind + "/" + blind * 2
            }
        }

        this.lbBlindPresend.string = "Level " + this.levelBlind + ": " + presendBlind + "/" + presendBlind * 2 + " (" + Global.formatTimeBySec(this.timeRemainBlind, false) + ")";
        this.unschedule(this.timeRemain)
        this.schedule(this.timeRemain = ()=>{
            this.timeRemainBlind--;
            this.lbBlindPresend.string = "Level " + this.levelBlind + ": " + presendBlind + "/" + presendBlind * 2 + " (" + Global.formatTimeBySec(this.timeRemainBlind, false) + ")";
            if(this.timeRemainBlind === 0){
                console.log("level blind presend : ", this.levelBlind)
                console.log("level blind presend : ", this.listBlind.node.getComponent(cc.ScrollView).content.children.length)
                this.listBlind.node.getComponent(cc.ScrollView).content.children[this.levelBlind - 1].getChildByName("bgr-line-2").active = false;
                this.listBlind.node.getComponent(cc.ScrollView).content.children[this.levelBlind].getChildByName("bgr-line-2").active = true;
                this.timeRemainBlind = this.dataTour.TimeChangeBlind;
                this.levelBlind += 1;
                this.nextBlind += 1;
                this.showBlindInfoTour(this.dataTour.BlindStep);
            }
        },1)


    },

    showLbPrize(){
        let data = this.dataReward.RewardData;
        let index = 0;
        this.listPrize.content.removeAllChildren();
        for(let keyReward in this.dataReward.RewardData){
            cc.log("check data rew : ", keyReward)
            let itemReward = this.dataReward.RewardData[keyReward]
            cc.log("check data rew : ", itemReward)

            if(itemReward == 0) continue;

            let item = null;
            if (index < this.listPrize.content.children.length) {
                item = this.listPrize.content.children[index];
            }
            else {
                item = cc.instantiate(this.itemPrize);
            } 

            item.getChildByName("lbLevel").getComponent(cc.Label).string = keyReward;
            if(this.dataTour.StartBountyValue > 0)
                item.getChildByName("lbPrize").getComponent(cc.Label).string = itemReward + " + Bounty";
            else    
                item.getChildByName("lbPrize").getComponent(cc.Label).string = itemReward;

            this.listPrize.content.addChild(item);
            index++
        }

        let isTourTicket = false;
        if (data[11] && data[11] !== 0) {
            isTourTicket = true;
        }

        cc.log("Check tour ticket : ", isTourTicket)
        cc.log("Check tour stack : ", this.indexStack)

        for (let i = 0; i < this.listPrize.length; i++) {
            const lb = this.listPrize[i];
            if (this.indexStack < 10) {
                if (this.indexStack > i) {
                    lb.node.parent.opacity = 255
                }
                else {
                    lb.node.parent.opacity = 100
                }
            }
            else if (!isTourTicket) {
                let index = 0
                lb.node.parent.opacity = 255;

                if (this.indexStack >= 10 && this.indexStack < 15) {
                    index = 10;
                }

                if (this.indexStack >= 15 && this.indexStack < 20) {
                    index = 11;
                }

                if (this.indexStack >= 20 && this.indexStack < 25) {
                    index = 12;
                }

                if (this.indexStack >= 25 && this.indexStack < 30) {
                    index = 13;
                }

                if (this.indexStack >= 30 && this.indexStack < 35) {
                    index = 14;
                }

                if (this.indexStack >= 35 && this.indexStack < 40) {
                    index = 15;
                }

                if (this.indexStack > 40) {
                    index = 16;
                }

                if (index >= i) {
                    lb.node.parent.opacity = 255;
                }
                else {
                    lb.node.parent.opacity = 100;
                }

            }
            else {
                lb.node.parent.opacity = 255;
                if (this.indexStack - 1 >= i) {
                    lb.node.parent.opacity = 255;
                }
                else {
                    lb.node.parent.opacity = 100;
                }
            }
        }

        this.returnPrize.string = this.dataReward.Description;
    },

    convertTimeToSecond(data) {
        let date = new Date(data);
        let day = date.getDate();
        let month = date.getMonth();
        let year = date.getFullYear();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();

        return new Date(year, month, day, hours, minutes, seconds).getTime();
    },

    generateData(data, onlyDay = false) {
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
        if(onlyDay)
            return hours + ":" + minutes + "\n" + day + "/" + month;
        else
            return hours + ":" + minutes + " " + day + "/" + month + "/" + year;
    },

    onClose() {
        Global.nodeInOutToLeft(null, this.node);

        let isShowLobby = true;
        for (let i = 0; i < Global.InGameCard.parentGame.children.length; i++) {
            const game = Global.InGameCard.parentGame.children[i];
            if(game.scale === 1){
                isShowLobby = false;
            }
        }
        if(isShowLobby)
            Global.LobbyView.OnShowLobby();
    },

    clickBackToHome(){
        cc.log("onclick hite");
        Global.UIManager.closeAllPopup();
        for (let i = 0; i < Global.InGameCard.parentGame.children.length; i++) {
            const game = Global.InGameCard.parentGame.children[i];
            game.scale = 0;
        }
        Global.LobbyView.OnShowLobby();
    },
    
    registerSucess() {
        this.isRegister = true;
        this.btnRegister.interactable = false;
        this.lbRegister.string = "ĐÃ ĐĂNG KÝ";
        this.lbStatusPlayer.string = "ĐANG CHỜ VÀO BÀN"
        let msg = {};
        msg[PKR_ParameterCode.TourId] = this.dataTour.Id;
        require("SendCardRequest").getIns().MST_Client_Tournament_Get_Info(msg);
    },

    genListBlind() {
        let dataBlind = JSON.parse(this.dataTour.BlindStep);
        let dataAnte = []
        if(this.dataTour.AnteRates){
            dataAnte = JSON.parse(this.dataTour.AnteRates);
        }
        let normalAnte = this.dataTour.NormalAnteRate;
        this.listBlind.content.removeAllChildren();

        for (let i = 0; i < dataBlind.length; i++) {
            let data = dataBlind[i];
            let ante = dataAnte[i]
            let item = null;
            if (i < this.listBlind.content.children.length) {
                item = this.listBlind.content.children[i];
            }
            else {
                item = cc.instantiate(this.itemBlind).getComponent("ItemBlindTournament");
            }
            item.node.active = true;
            this.listBlind.content.addChild(item.node);
            item.init(data, i, ante, normalAnte);
        }

        // this.listBlind.init(dataBlind, dataBlind.length * 80, 80);
    },

    genListTable() {
        let listTablee = [];
        for (let i = 0; i < this.dataTable.length; i++) {
            let dataTable = JSON.parse(this.dataTable[i]);
            listTablee.push(dataTable);
        }
        cc.log("list table la : ", listTablee)
        this.listTable.init(listTablee, listTablee.length * 90, 90);
    },

    genListPlayerRegister() {
        let listPlayer = [];
        let totalChip = 0;
        let avg = 0;
        this.indexStack = 0;
        for (let i = 0; i < this.dataPlayerRegister.length; i++) {
            let dataPlayer = JSON.parse(this.dataPlayerRegister[i]);
            totalChip += dataPlayer.Stack;
            listPlayer.push(dataPlayer);
            if(dataPlayer.Stack > 0) this.indexStack++;
        }
        avg = totalChip/this.indexStack;
        this.lbTotalChip.string =  "Total chip: " + Global.formatNumberPoker(totalChip);
        if(avg && !isNaN(avg))
            this.lbAVG.string = "AVG: " + Global.formatNumberPoker(parseInt(avg));
        if(this.dataPlayerRegister.length > 0){
            cc.log("stack nho nhat la : ", this.dataPlayerRegister.length )
            this.lbStackMax.string = "Stack lớn nhất: " + Global.formatNumberPoker(JSON.parse(this.dataPlayerRegister[0]).Stack);
            for (let j = this.dataPlayerRegister.length - 1; j >= 0; j--) {
                const objData = JSON.parse(this.dataPlayerRegister[j]);
                if(objData && objData.Stack > 0 ){
                    this.lbStackMin.string = "Stack nhỏ nhất: " + Global.formatNumberPoker(objData.Stack);
                    break;
                }              
            }
        }    
        this.listPlayerRegister.init(listPlayer, listPlayer.length * 82, 82);
    },

    onClickListTable(){
        this.listTable.onLoad();
        this.listTable.resetScr();
        this.genListTable();
    },

    onClickTestTour() {
        let msg = {};
        msg[PKR_ParameterCode.TourId] = this.dataTour.Id;
        require("SendCardRequest").getIns().MST_Client_Tournament_Test_Tour(msg)
    },

    onClickRefresh(){
        this.isRegister = true;
        let msg = {};
        msg[PKR_ParameterCode.TourId] = this.dataTour.Id;
        require("SendCardRequest").getIns().MST_Client_Tournament_Get_Info(msg);
    },

    onClickRegisterTour() {
        let msg = {};
        msg[PKR_ParameterCode.TourId] = this.dataTour.Id;
        msg[PKR_ParameterCode.TableState] = StateTable.Idle;
        require("SendCardRequest").getIns().MST_Client_Tournament_Register_Tour(msg);
    }
    // update (dt) {},
});
