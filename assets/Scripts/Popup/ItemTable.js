cc.Class({
    extends: cc.Component,

    properties: {
        lb_id: {
            default: null,
            type: cc.Label
        },
        lb_ag: {
            default: null,
            type: cc.Label
        },
        lb_player: {
            default: null,
            type: cc.Label
        },
        lb_blind: cc.Label,
        listSpriteFrameItem: [cc.SpriteFrame],
        itemTable: cc.Sprite,
        icLock : cc.Node,

        icCoin1: cc.Sprite,
        icCoin2: cc.Sprite,
        listSprCoin: [cc.SpriteFrame]

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.password = "";
    },

    start() {

    },

    init(data, blind = 0) {
        this.id = data.Id;
        this.blind = data.Blind;
        this.lb_id.string = data.Id;
        this.lb_ag.string = data.Blind;
        if (MainPlayerInfo.CurrentGameCode === "PKR") {
            this.lb_ag.string = data.Blind + "/" + data.Blind * 2
        }
        this.lb_blind.string = ((data.Blind * 2) * 50).toString();
        this.lb_player.string = data.NumberPlayer + "/" + data.LimitPlayer;

        this.itemTable.spriteFrame = this.listSpriteFrameItem[Global.PokerRoomType - 1];

        if(data.Password !== ""){
            this.icLock.active = true;
            this.password = data.Password;
        }
        else{
            this.icLock.active = false;
            this.password = "";
        }

        switch (Global.PokerRoomType) {
            case 3:
                this.icCoin1.spriteFrame = this.listSprCoin[1];
                this.icCoin2.spriteFrame = this.listSprCoin[1];
                break;
            default:
                this.icCoin1.spriteFrame = this.listSprCoin[0];
                this.icCoin2.spriteFrame = this.listSprCoin[0];
                break;
        }
    },

    onClickPlayGame() {
        if(Global.InGameCard.parentGame.children.length >= 3){
            Global.UIManager.showCommandPopup("Bạn không thể chơi quá 3 bàn");
            return;
        }
        if (!Global.isLogin) {
            Global.UIManager.showCommandPopup(MyLocalization.GetText("NEED_LOGIN"));
            return;
        }
        Global.PokerIdRoom = this.id;
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
    onClickItemGame() {
        if (!Global.isLogin) {
            Global.UIManager.showCommandPopup(MyLocalization.GetText("NEED_LOGIN"));
            return;
        }
        Global.PokerIdRoom = this.id;
        if(Global[MainPlayerInfo.CurrentGameCode + Global.PokerIdRoom] && Global[MainPlayerInfo.CurrentGameCode + Global.PokerIdRoom].node){
            Global[MainPlayerInfo.CurrentGameCode + Global.PokerIdRoom].node.active = true;
            cc.log("tabe poiekr aksd : ", )
            return;
        }
        let returnGame = Global.UIManager.onClickOpenBigGame(Global.getGameTypeByName("PKR"));
        console.log("gia tri return " + returnGame);
        if (returnGame)
            return;
        Global.password = this.password;
        Global.blind = this.blind;
        let msg = {};
        msg[PKR_ParameterCode.TableId] = this.id;
        require("SendCardRequest").getIns().MST_Client_Get_Info_Room_Poker(msg);
    },

   
});
