cc.Class({
    extends: cc.Component,

    properties: {
        edbPassWord : cc.EditBox,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {
    // },

    start () {

    },

    show(){
        Global.onPopOn(this.node);
        this.edbPassWord.string = "";
    },

    onClose(){
        Global.onPopOff(this.node);
    },

    onClickConfirm(){
        cc.log("pass la ?? ", Global.password)
        // if(this.edbPassWord.string === Global.password){
        //     let msg = {};
        //     msg[AuthenticateParameterCode.GameId] = MainPlayerInfo.CurrentGameCode;
        //     msg[AuthenticateParameterCode.Blind] = Global.blind;
        //     msg[AuthenticateParameterCode.TableId] = Global.PokerIdRoom;
        //     cc.log("send ow itemlobby : ", msg);
        //     require("SendCardRequest").getIns().MST_Client_Join_Game(msg);
        //     Global.UIManager.showMiniLoading();
        //     Global.onPopOff(this.node);
        // }
        // else{
        //     Global.UIManager.showCommandPopup("Mật khẩu sai, vui lòng thử lại", null);
        // }
        let msg = {};
        msg[AuthenticateParameterCode.GameId] = MainPlayerInfo.CurrentGameCode;
        msg[AuthenticateParameterCode.Blind] = Global.blind;
        msg[AuthenticateParameterCode.TableId] = Global.PokerIdRoom;
        msg[CARD_ParamterCode.Password] = this.edbPassWord.string;
        cc.log("send ow itemlobby : ", msg);
        require("SendCardRequest").getIns().MST_Client_Join_Game(msg);
        Global.UIManager.showMiniLoading();
        Global.onPopOff(this.node);
        this.edbPassWord.string = "";
    },

    // update (dt) {},
});
