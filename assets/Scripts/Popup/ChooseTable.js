cc.Class({
    extends: cc.Component,

    properties: {
        item_table: {
            default: null,
            type: cc.Prefab
        },
        list_table : require("BaseScrollView"),
        listBlindTournament : require("BaseScrollView"),
        prefabTaoBan: {
            default: null,
            type: cc.Prefab
        },

        //spin&go
		listBlind : cc.ScrollView,
        listBlindTour : cc.ScrollView,
		itemBlind : cc.Node,
        itemTournament : cc.Node,
        itemNLH : cc.Node,
        itemLobbyTournament : cc.Node,
        itemShortDeck : cc.Node,
        sprItemBlind : cc.SpriteFrame,
        lbSpinAndGo : cc.Node,

        listSprShortDeck : [cc.SpriteFrame],

        sprItemTournament : cc.SpriteFrame,

        edbTest : cc.EditBox,

        listToggle : [cc.Toggle],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Global.ChooseTable = this;
        this.list_table.node.active = false;
        this.listBlind.node.active = true;
        this.lbSpinAndGo.active = false;
        this.dataRoomTournament = [];
        this.dataSort = [];
        this.fillState = -1;
        this.listDieuKien = [];
    },

    start() {

    },

    setItemListView(data) {
        if(!this.list_table.node.active) return;
        this.lbSpinAndGo.active = false;
        this.list_table.resetScr();
        let dataInfo = data[AuthenticateParameterCode.TableId];

        let listData = [];
        for (let i = 0; i < dataInfo.length; i++) {
            const objData = dataInfo[i];
            let data = JSON.parse(objData);
            listData.push(data)
        }
        listData.sort(function (a, b) {
            return b.NumberPlayer - a.NumberPlayer;
        });
        this.list_table.init(listData , listData.length * 60 , 60);
    },

    setItemListViewCard(data) {
        this.listBlind.scrollToTop();
        this.listBlind.content.removeAllChildren();
        let dataInfo = data[AuthenticateParameterCode.TableId];
        let dataBlind = data[AuthenticateParameterCode.Blind];
        cc.log("datataa neeeee ", data)
        this.unschedule(this.funInit);
        if (dataBlind) {
            let listData = [];
            for (let i = 0; i < dataBlind.length; i++) {
                const objData = dataBlind[i];
                let data = JSON.parse(objData);
                listData.push(data)
            }

            let index = 0;
            for (let i = 0; i < listData.length; i++) {
                let item = null;
                const objData = listData[i];
                if (i < this.listBlind.content.children.length) {
                    item = this.listBlind.content.children[i];
                }
                else {
                    item = cc.instantiate(this.itemNLH);
                }
                item.active = true;
                item.opacity = 0;
                cc.tween(item)
                .delay(index * 0.05)
                .to(0.2,{ opacity  : 255}, {easing: "backOut" })
                .start();
                index ++;
                this.listBlind.content.addChild(item);

                var eventHandler = new cc.Component.EventHandler();
                eventHandler.target = this.node;
                eventHandler.component = "ChooseTable";
                eventHandler.handler = "onClickItemCardGame";
                eventHandler.customEventData = objData;
                item.getComponent(cc.Button).clickEvents.push(eventHandler);
            }
        }
    },

    setItemListViewTournament(data) {
        this.lbSpinAndGo.active = false;
        let dataInfo = data[PKR_ParameterCode.TournamentList];
        let configTimeremain = data[22];

        cc.log("data info la : ", configTimeremain)

        this.dataRoomTournament = []
        for (let i = 0; i < dataInfo.length; i++) {
            const objData = dataInfo[i];
            let data = JSON.parse(objData);
            data.remainTime = configTimeremain[i]          
            this.dataRoomTournament.push(data)
        }
        this.dataRoomTournament.sort(function (a, b) {
            return a.State - b.State;
        });
        this.handleDataSort();
    },

    genListItemBlindNLH(data){
        cc.log("data blind la : ", data[AuthenticateParameterCode.Blind]);
        this.lbSpinAndGo.active = false;
        let dataBlind = data[AuthenticateParameterCode.Blind];
        let infoUser = data[38];

        this.listBlind.content.destroyAllChildren();

        for (let i = 0; i < dataBlind.length; i++) {
			const objData = dataBlind[i];
            let item = cc.instantiate(this.itemNLH);  
            item.active = true;
            cc.log("data ite la : ", objData)

            if(infoUser && infoUser[i])
                item.getChildByName("lb-user").getComponent(cc.Label).string = infoUser[i];
            item.getChildByName("layout").getChildByName("lb-chip").getComponent(cc.Label).string = Global.formatNumber(objData*2);

            var eventHandler = new cc.Component.EventHandler();
            eventHandler.target = this.node;
            eventHandler.component = "ChooseTable";
            eventHandler.handler = "onClickItemNLH";
            eventHandler.customEventData = objData;
            eventHandler.roomType = 1;
            item.getComponent(cc.Button).clickEvents.push(eventHandler);

			this.listBlind.content.addChild(item);
		}
    },

    genListTournament(data){
        this.lbSpinAndGo.active = false;
		let configTour = data[49];
        let configTimeremain = data[22];
		cc.log("data tour la : ", configTour);
		this.listBlindTour.content.removeAllChildren();
		for (let i = 0; i < configTour.length; i++) {
			const objData = JSON.parse(configTour[i]);
            cc.log("data item la /l : ", objData)
            let item = cc.instantiate(this.itemTournament);;
            item.active = true;
            item.position = cc.v2(0, -30);
            item.getChildByName("layout").getChildByName("lb-chip").getComponent(cc.Label).string = Global.formatNumber(objData.TotalReward);
            item.getChildByName("layout2").getChildByName("lb-chip").getComponent(cc.Label).string = Global.formatNumber(objData.Buyin);
            item.getChildByName("titleTournament").getComponent(cc.Label).string = objData.TourName;


            // let timeStart = Date.now();
            // let timeEnd = Global.convertTimeToSecond(objData.EndTimeRegister);
            // cc.log("thoi gian start : ",  timeStart);
            // cc.log("thoi gian end : ", timeEnd );
            // let time = (timeEnd - timeStart)/1000;
            // item.getChildByName("nodeCountDown").getChildByName("lbTime").getComponent(cc.Label).string = Global.formatTimeBySec(time);

            var eventHandler = new cc.Component.EventHandler();
            eventHandler.target = this.node;
            eventHandler.component = "ChooseTable";
            eventHandler.handler = "onClickItemTournament";
            eventHandler.customEventData = objData.Id;
            eventHandler.roomType = 4;
            item.getComponent(cc.Button).clickEvents.push(eventHandler);

            let lbTime = item.getChildByName("bgTime").getChildByName("lbTime").getComponent(cc.Label);
            if(configTimeremain[i] && objData.State !== 0){
                cc.log("chay lai vao day r")
                let time = configTimeremain[i];
                lbTime.string = Global.formatTimeBySec(time, true);
                this.schedule(() => {
                    time--;
                    lbTime.string = Global.formatTimeBySec(time, true);
                    if (time == 0) {
                        lbTime.string = this.generateDate(objData.EndTimeRegister);
                    }
                }, 1); 
                
            }

            switch (objData.State) {
                case 0:
                    item.getChildByName("btnJoin").getChildByName("lbStatusTour").getComponent(cc.Label).string = "CHỜ ĐĂNG KÝ";
                    item.getChildByName("bgTime").getChildByName("lbTime").getComponent(cc.Label).string = this.generateDate(objData.StartTimeRegister);
                    break;
                case 1:
                    item.getChildByName("btnJoin").getChildByName("lbStatusTour").getComponent(cc.Label).string = "ĐANG ĐĂNG KÝ"
                    break;
                case 2:
                    item.getChildByName("btnJoin").getChildByName("lbStatusTour").getComponent(cc.Label).string = "ĐĂNG KÝ TRỄ"
                    break;
                case 3:
                    item.getChildByName("btnJoin").getChildByName("lbStatusTour").getComponent(cc.Label).string = "ĐANG DIỄN RA"
                    break;
                case 4:
                    item.getChildByName("btnJoin").getChildByName("lbStatusTour").getComponent(cc.Label).string = "ITM"
                    break;
                case 5:
                    item.getChildByName("btnJoin").getChildByName("lbStatusTour").getComponent(cc.Label).string = "FINAL TABLE"
                    break;
                case 6:
                    item.getChildByName("btnJoin").getChildByName("lbStatusTour").getComponent(cc.Label).string = "ĐÃ KẾT THÚC";
                    item.getChildByName("btnJoin").getComponent(cc.Button).interactable = false;
                    break;
                case 7:
                    item.getChildByName("btnJoin").getChildByName("lbStatusTour").getComponent(cc.Label).string = "TOUR ĐÃ HỦY";
                    item.getChildByName("btnJoin").getComponent(cc.Button).interactable = false;
                    break;
            }

            if(i %2 !== 0)
                item.getComponent(cc.Sprite).spriteFrame = this.sprItemTournament;

			this.listBlindTour.content.addChild(item);
		}
    },

    onClickItemTournament(event, data){
        let tourId = JSON.parse(data)
        let msg = {};
		msg[PKR_ParameterCode.TourId] = tourId;
		require("SendCardRequest").getIns().MST_Client_Tournament_Get_Info(msg); // data
    },

    genListItemBlindShortDeck(data){
        cc.log("data blind la : ", data[AuthenticateParameterCode.Blind]);
        this.lbSpinAndGo.active = false;
        let dataBlind = data[AuthenticateParameterCode.Blind];
        let infoUser = data[38];

        this.listBlind.content.destroyAllChildren();

        let index = 0;
        for (let i = 0; i < dataBlind.length; i++) {
			const objData = dataBlind[i];
            let item = cc.instantiate(this.itemShortDeck);  
            item.active = true;
            item.position = cc.v2(0,-30);
            cc.log("data ite la : ", objData)
            if(infoUser && infoUser[i])
                item.getChildByName("lb-user").getComponent(cc.Label).string = infoUser[i];
            item.getChildByName("layout").getChildByName("lb-chip").getComponent(cc.Label).string =  Global.formatNumber(objData*2);

            if(index >= 5) index = 0;
            item.getComponent(cc.Sprite).spriteFrame = this.listSprShortDeck[index];
            index++

            var eventHandler = new cc.Component.EventHandler();
            eventHandler.target = this.node;
            eventHandler.component = "ChooseTable";
            eventHandler.handler = "onClickItemShortDeck";
            eventHandler.customEventData = objData;
            item.roomType = 2;
            item.getComponent(cc.Button).clickEvents.push(eventHandler);

			this.listBlind.content.addChild(item);
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
        return hours + ":" + minutes + " " + day + "/" + month;
    },


    genListTournamentSpinAndGo(data){
        this.lbSpinAndGo.active = true;
        Global.DataConfigSpinGo = JSON.parse(data[13]).Buyin;
        cc.log("adjsahdi : ", Global.DataConfigSpinGo)
		let configTour = JSON.parse(data[13]);
        let infoUser = data[38];
        cc.log("infouser la : ", infoUser)
		cc.log("data tour la : ", configTour);
		this.listBlind.content.destroyAllChildren();
        cc.log("chilren la ", this.listBlind.content.children.length)
		for (let i = 0; i < configTour.Buyin.length; i++) {
			const objData = configTour.Buyin[i];
            let item = cc.instantiate(this.itemBlind);;
            item.active = true;
            cc.log("data ite la : ", objData)
            item.getChildByName("layout").getChildByName("lb-chip").getComponent(cc.Label).string = Global.formatNumber(objData);

            if(infoUser && infoUser[i])
                item.getChildByName("lb-user").getComponent(cc.Label).string = infoUser[i];

            var eventHandler = new cc.Component.EventHandler();
            eventHandler.target = this.node;
            eventHandler.component = "ChooseTable";
            eventHandler.handler = "onClickItemBlind";
            eventHandler.customEventData = objData;
            eventHandler.roomType = 4;
            item.getComponent(cc.Button).clickEvents.push(eventHandler);

            if(i %2 !== 0)
                item.getComponent(cc.Sprite).spriteFrame = this.sprItemBlind;

			this.listBlind.content.addChild(item);
		}
	},

    onClickItemCardGame(event, data) {
        cc.log("Check data ietm al : ", MainPlayerInfo.CurrentGameCode)
        let msg = {};
        msg[AuthenticateParameterCode.GameId] = "TMN" //MainPlayerInfo.CurrentGameCode;
        msg[AuthenticateParameterCode.Blind] = JSON.parse(data);
        msg[AuthenticateParameterCode.TableId] = 0;
        cc.log("send ow itemlobby : ", msg);
        require("SendCardRequest").getIns().MST_Client_Join_Game(msg);
        Global.UIManager.showMiniLoading();
    },

    onClickItemBlind(event, data){
        cc.log("click item table ever : ", event.roomType, " data : ", data)
        let msg = {};
        msg[AuthenticateParameterCode.GameId] = "PKR";
        msg[AuthenticateParameterCode.Blind] = data;
        msg[AuthenticateParameterCode.TableId] = "";
        msg[CARD_ParamterCode.Password] = "";
        cc.log("send ow itemlobby : ", msg);
        require("SendCardRequest").getIns().MST_Client_Join_Game(msg);
    },

    onClickItemNLH(event, data){
        cc.log("click item table ever : ", event, " data : ", data)
        let msg = {};
        msg[AuthenticateParameterCode.GameId] = "PKR";
        msg[AuthenticateParameterCode.Blind] = data;
        msg[AuthenticateParameterCode.TableId] = "";
        msg[CARD_ParamterCode.Password] = "";
        cc.log("send ow itemlobby : ", msg);
        require("SendCardRequest").getIns().MST_Client_Join_Game(msg);
    },

    onClickItemShortDeck(event, data){
        cc.log("click item table ever : ", event, " data : ", data)
        let msg = {};
        msg[AuthenticateParameterCode.GameId] = "PKR";
        msg[AuthenticateParameterCode.Blind] = data;
        msg[AuthenticateParameterCode.TableId] = "";
        msg[CARD_ParamterCode.Password] = "";
        cc.log("send ow itemlobby : ", msg);
        require("SendCardRequest").getIns().MST_Client_Join_Game(msg);
    },

    onClickPlayGame() {
        if (!Global.isLogin) {
            Global.UIManager.showCommandPopup(MyLocalization.GetText("NEED_LOGIN"));
            return;
        }
        cc.log("poker room id la : ", Global.PokerIdRoom)
        cc.log("prefab la /; ", Global[MainPlayerInfo.CurrentGameCode + Global.PokerIdRoom])
        if(Global[MainPlayerInfo.CurrentGameCode + Global.PokerIdRoom] && Global[MainPlayerInfo.CurrentGameCode + Global.PokerIdRoom].node){
            Global[MainPlayerInfo.CurrentGameCode + Global.PokerIdRoom].node.active = true;
            return;
        }
        let returnGame = Global.UIManager.onClickOpenBigGame(Global.getGameTypeByName("PKR"));
        console.log("gia tri return " + returnGame);
        if (returnGame)
            return;
        if(this.password !== ""){
            Global.UIManager.showPassWordPopup();
            Global.blind = this.blind;
            Global.password = this.password
            return;
        }
        Global.password = this.password
        let msg = {};
        msg[AuthenticateParameterCode.GameId] = MainPlayerInfo.CurrentGameCode;
        msg[AuthenticateParameterCode.Blind] = this.blind;
        msg[AuthenticateParameterCode.TableId] = this.id;
        msg[CARD_ParamterCode.Password] = "";
        cc.log("send ow itemlobby : ", msg);
        require("SendCardRequest").getIns().MST_Client_Join_Game(msg);
        Global.UIManager.showMiniLoading();
    },

    onClickRefresh() {
        // Global.InGameCard.sendGetTableInfo();
    },
    onClickTaoBan() {
        if (this.prefabTaoBan.parent) {
            Global.onPopOn(this.prefabTaoBan);
        }
        else {
            let item = cc.instantiate(this.prefabTaoBan);
            this.node.addChild(item);
        }
    },
    onClickSendIdTable(){
        let msg = {};
        Global.PokerIdRoom = this.edbTest.string;
        msg[AuthenticateParameterCode.GameId] = "PKR";
        msg[AuthenticateParameterCode.Blind] = "";
        msg[AuthenticateParameterCode.TableId] = this.edbTest.string;
        msg[CARD_ParamterCode.Password] = "";
        require("SendCardRequest").getIns().MST_Client_Join_Game(msg);
    },

    handleDataSort(){
        this.dataSort = []
        for (let i = 0; i < this.listDieuKien.length; i++) {
            const dieuKien = this.listDieuKien[i];
            this.dataRoomTournament.filter((item) =>{
                if(item.State === dieuKien){
                    this.dataSort.push(item);
                }
            });
        }

        let index = 0;
        for (let i = 0; i < this.listToggle.length; i++) {
            const toggle = this.listToggle[i];
            if(!toggle.isChecked){
                index++
            }      
        }

        if(index === this.listToggle.length){     
            this.dataSort = this.dataRoomTournament;
        }
        else{
            cc.log("sort data :", index)
        }
        this.listBlindTournament.resetScr(); 
        this.listBlindTournament.init(this.dataSort, this.dataSort.length * 55 , 55);
    },
    
    onClickSort(event, data){
        let type = data;
        if(type)
             type = JSON.parse(data);
        if(event.isChecked){
            if(type === 1){
                this.listDieuKien.push(type);
                this.listDieuKien.push(0);
            }
            else{
                this.listDieuKien.push(type);    
            }        
        }
        else {
            if(type === 1){
                this.listDieuKien = this.listDieuKien.filter(item => item !== type);
                this.listDieuKien = this.listDieuKien.filter(item => item !== 0);
            }
            else{
                this.listDieuKien = this.listDieuKien.filter(item => item !== type);
            }      
           
        }

        this.handleDataSort();
        // Global.LobbyView.unschedule(Global.LobbyView.requestDataTable);
        // cc.log("fill tour running : ", this.dataSort);
    },
});
