cc.Class({
    extends: cc.Component,

    properties: {
        lbValue : cc.Label,
        lbAmount : cc.Label,
        lbContent : cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {
    // },

    start () {

    },

    init(data){
        cc.log("daat ticet : ", data)
        let value = 0;

        cc.log("check data ", Global.DataConfigSpinGo)

        if(Global.DataConfigSpinGo){
            value = Global.DataConfigSpinGo[data.TicketType - 1];
        }
        else{
            cc.log("Global.DataConfigSpinGo = null ", Global.DataConfigSpinGo);
        }

        this.value = value;
        this.gameMode = data.PlayMode;

        if(this.gameMode === 4){
            this.lbContent.string = "Ticket Spin & Go"
            this.lbValue.string = Global.formatNumber(value);
        }
        else{
            this.lbContent.string = "Ticket Tournament"
            this.lbValue.string = Global.formatNumber(data.Buyin);
        }

       
        this.lbAmount.string = Global.formatNumber(data.Amount);
    },

    onClickItem(){
        cc.log("click game mode la : ", this.gameMode)
        cc.log("click value la : ", this.value)

        let msg = {};
        msg[AuthenticateParameterCode.GameId] = "PKR";
        msg[AuthenticateParameterCode.Blind] = this.value;
        msg[AuthenticateParameterCode.TableId] = 0;
        msg[CARD_ParamterCode.Password] = "";
        Global.PokerRoomType = this.gameMode;
        Global.PokerIdRoom = 0;
        cc.log("send ow itemlobby : ", msg);
        require("SendCardRequest").getIns().MST_Client_Join_Game(msg);
    },

    // update (dt) {},
});
