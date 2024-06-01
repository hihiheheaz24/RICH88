cc.Class({
    extends: cc.Component,

    properties: {
        listTable: cc.ScrollView,
        itemTable: cc.Node,
        listBlinnd : cc.ScrollView,
        itemBlind : cc.Node,
        listSpriteFrameItemSpinGo : [cc.SpriteFrame],

        iconGame : cc.Sprite,
        listIconGame : [cc.SpriteFrame]
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.roomType = 0;
        Global.SlectTable = this;
    },

    start() {

    },

    handleDataBlindSpinGo(data) {
        let lobbyView = Global.LobbyView;
        if (!lobbyView.nodeChooseTable.active) {
            Global.nodeInOutToRight(lobbyView.nodeChooseTable, null);
            Global.nodeInOutToRight(null, lobbyView.nodeMiddle);
        }
        Global.LobbyView.setIconGame();
        this.listTable.node.active = false;
        this.listBlinnd.node.active = true;
        let objData = JSON.parse(data[13]);
        let objDataUserNumber = data[38];
        cc.log("check data blind : ", objData.Buyin)
        let dataBlind = objData.Buyin;
        this.listBlinnd.content.removeAllChildren();
        this.roomType = 4;
        for (let i = 0; i < dataBlind.length; i++) {
            const blind = dataBlind[i];
            cc.log("check item blind la : ", blind)
            let item = null;
            if (i < this.listBlinnd.content.children.length) {
                item = this.listBlinnd.content.children[i];
            }
            else {
                item = cc.instantiate(this.itemBlind);
            }
            let dataNumberUser = objDataUserNumber[i];
            if(dataNumberUser){
                cc.log("check number user la : ", dataNumberUser)
                item.getChildByName("lbUser").getComponent(cc.Label).string = dataNumberUser;
            }
            item.getChildByName("lbBlind").getComponent(cc.Label).string = Global.formatMoneyPoker(blind);
          
            item.blind = blind;

            if(i % 2){
                item.getComponent(cc.Sprite).spriteFrame = this.listSpriteFrameItemSpinGo[0];
            }
            else{
                item.getComponent(cc.Sprite).spriteFrame = this.listSpriteFrameItemSpinGo[1];
            }
          


            var eventHandler = new cc.Component.EventHandler();
            eventHandler.target = this.node;
            eventHandler.component = "SelectTable";
            eventHandler.handler = "onClickJoinRoom";
            item.getComponent(cc.Button).clickEvents.push(eventHandler);

            this.listBlinnd.content.addChild(item)
        }
    },

    handleDataListRoom(data) {
        cc.log("check select tb : ", data)
        // {"errCode":0,"errMsg":"","opCode":105,"vals":{"0":0,"2":0,"3":0,"4":"","5":"SBI1","15":20,"17":["{\"Id\":1,\"Name\":\"Phòng 1\",\"Blind\":50,\"LimitPlayer\":4,\"NumberPlayer\":2,\"State\":2,\"LimitCash\":1000,\"Password\":\"\",\"IsPlayerInRoom\":false}",


        switch (data[18]) {
            case "TMN":
                this.iconGame.spriteFrame = this.listIconGame[0]
                break;

            case "MAB":
                this.iconGame.spriteFrame = this.listIconGame[1]
                break;
        }

        MainPlayerInfo.CurrentGameId = Global.getGameIdByName(data[18]);
		MainPlayerInfo.CurrentGameCode = data[18];

        this.roomType = data[AuthenticateParameterCode.RoomType];

        cc.log("check data selcet table : ", data)

        let dataTable = data[32];
        let dataPlayerCount = data[38];

        this.listTable.content.removeAllChildren();

        for (let i = 0; i < dataTable.length; i++) {
            const objData = dataTable[i];

            let item = null;
            if (i < this.listTable.content.children.length) {
                item = this.listTable.content.children[i];
            }
            else {
                item = cc.instantiate(this.itemTable);
            }

            item.getChildByName("lbBlind").getComponent(cc.Label).string = Global.formatMoneyPoker(objData, item.getChildByName("lbBlind").getComponent(cc.Label));
            if(dataPlayerCount[i])
                item.getChildByName("lbUser").getComponent(cc.Label).string = dataPlayerCount[i];
            // item.getChildByName("lbId").getComponent(cc.Label).string = objData.Id;
            // item.blind =  objData;//objData.Blind;

            item.getComponent(cc.Sprite).spriteFrame = this.listSpriteFrameItemSpinGo[i % 3];


            var eventHandler = new cc.Component.EventHandler();
            eventHandler.target = this.node;
            eventHandler.component = "SelectTable";
            eventHandler.handler = "onClickJoinRoom";
            eventHandler.customEventData = objData;
            item.getComponent(cc.Button).clickEvents.push(eventHandler);

            this.listTable.content.addChild(item)
        }

    },

    onClickJoinRoom(event, data) {
        if (Global.NetworkManager._connect && Global.NetworkManager._connect.connectionState !== "Connected") {
            Global.UIManager.showCommandPopup(MyLocalization.GetText("NEED_LOGIN"));
            return;
        }
        let msg = {};
        msg[AuthenticateParameterCode.RoomType] = this.roomType;
        msg[AuthenticateParameterCode.GameId] = MainPlayerInfo.CurrentGameCode;
        msg[AuthenticateParameterCode.Blind] = JSON.parse(data);
        msg[AuthenticateParameterCode.TableId] = null;
        cc.log("Check send table id : ", msg[AuthenticateParameterCode.TableId])
        msg[CARD_ParamterCode.Password] = "";
        cc.log("send ow itemlobby : ", msg);
        require("SendCardRequest").getIns().MST_Client_Join_Game(msg);
        Global.UIManager.showMiniLoading();
    },

    // update (dt) {},
});
