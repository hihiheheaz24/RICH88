// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        lbId : cc.Label,
        lbName : cc.Label,
        lbBlind : cc.Label,
        lbPlayerNumber : cc.Label,
        texture : cc.SpriteFrame,
        lbBtnView : cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    init(data){
        this.data = data;

        this.lbId.string = this.itemID + 1;
        // this.lbName.string = data.Name;
        let indexRoom = data.Name.match(/[0-9]+/)[0];
        cc.log("check id : ", indexRoom)
        this.lbName.string = "Bàn " + indexRoom;
        this.lbBlind.string = Global.formatNumber(data.Blind) + "/" + Global.formatNumber(data.Blind*2);
        this.lbPlayerNumber.string = data.NumberPlayer + "/" + data.LimitPlayer;

        if(this.itemID % 2 !== 0) this.node.getComponent(cc.Sprite).spriteFrame = this.texture;
        else this.node.getComponent(cc.Sprite).spriteFrame = null;

        if(data.IsPlayerInRoom) this.lbBtnView.string = "Chơi"
        else this.lbBtnView.string = "Xem"
    },

    onClickItem(){
        if(Global.InGameCard.parentGame.children.length > 2){
            Global.UIManager.showCommandPopup("Số bàn hiển thị không quá 3");
            return;
        }
        let msg = {};
        msg[AuthenticateParameterCode.GameId] = "PKR";
        msg[AuthenticateParameterCode.Blind] = "";
        msg[AuthenticateParameterCode.TableId] = this.data.Id;
        msg[CARD_ParamterCode.Password] = "";
        cc.log("send data test : ", msg);
        require("SendCardRequest").getIns().MST_Client_Join_Game(msg);
    },

    onClickGetInfoItem(){
        let msg = {};
        Global.PokerIdRoom = this.data.Id;
        Global.password = "";
        msg[PKR_ParameterCode.TableId] = this.data.Id;
        require("SendCardRequest").getIns().MST_Client_Get_Info_Room_Poker(msg);
    }    
    // update (dt) {},
});
