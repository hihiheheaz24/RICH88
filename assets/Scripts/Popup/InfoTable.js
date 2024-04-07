// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        itemInfo : cc.Node,
        listItemInfo : cc.ScrollView,
        listSprItem : [cc.SpriteFrame],
        nodeNull : cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    init(data){
        cc.log("data table la : ", data);
        let listPlayer = data[PKR_ParameterCode.AccountId];
        if(listPlayer.length === 0) this.nodeNull.active = true;
        else this.nodeNull.active = false;
        Global.onPopOn(this.node)
        this.listItemInfo.content.removeAllChildren();
        for (let i = 0; i < listPlayer.length; i++) {
            const dataPlayer = listPlayer[i];
            let objData = JSON.parse(dataPlayer);
            let item = null;
            if(i < this.listItemInfo.content.children.length){
                item = this.listItemInfo.content.children[i];
            }
            else{
                item = cc.instantiate(this.itemInfo);
            }
            if(i%2 === 0) item.getComponent(cc.Sprite).spriteFrame = this.listSprItem[0];
            else item.getComponent(cc.Sprite).spriteFrame = this.listSprItem[1];
            item.getChildByName("lb-name").getComponent(cc.Label).string = objData.NickName;
            item.getChildByName("lb-ag").getComponent(cc.Label).string = Global.formatNumberPoker(objData.Cash);
            item.getChildByName("lb-percen").getComponent(cc.Label).string = Global.formatNumberPoker(objData.WR) + "%";
            this.listItemInfo.content.addChild(item);
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
        if(Global.password !== ""){
            Global.UIManager.showPassWordPopup();
            Global.onPopOff(this.node);
            return;
        }
        let msg = {};
        msg[AuthenticateParameterCode.GameId] = MainPlayerInfo.CurrentGameCode;
        msg[AuthenticateParameterCode.Blind] = "";
        msg[AuthenticateParameterCode.TableId] = Global.PokerIdRoom;
        msg[CARD_ParamterCode.Password] = "";
        cc.log("send ow itemlobby : ", msg);
        require("SendCardRequest").getIns().MST_Client_Join_Game(msg);
        Global.UIManager.showMiniLoading();
        Global.onPopOff(this.node);
    },

    onClose(){
        Global.onPopOff(this.node);
    },

    // update (dt) {},
});
