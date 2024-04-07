// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
       nodeRules : cc.Node,
       nodePigHunter : cc.Node,
       nodeLeague : cc.Node,

       listBanner  : [cc.Node]
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.indexBanner = 0;
    },

    start () {

    },

    show(){
        Global.onPopOn(this.node);
        this.listBanner[this.indexBanner].active = true;
    },

    hide(){
        this.indexBanner++;
        if(this.indexBanner >= this.listBanner.length){
            Global.onPopOff(this.node)
        }
        else{
            Global.onPopOn(this.listBanner[this.indexBanner]);
            Global.onPopOff(this.listBanner[this.indexBanner - 1])
        }
      
    },

    onClickJoin(){
        if (!Global.isLogin) {
			Global.UIManager.showCommandPopup(MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		let msg = {};
		msg[AuthenticateParameterCode.GameId] = MainPlayerInfo.CurrentGameCode;
		msg[AuthenticateParameterCode.Blind] = 0;
		cc.log("send ow itemlobby : ", msg);
		require("SendCardRequest").getIns().MST_Client_Join_Game(msg);
		Global.UIManager.showMiniLoading();
        this.hide();
    },

    onClickCloseRules(){
        Global.onPopOn(this.nodePigHunter);
        Global.onPopOff(this.nodeRules);
    },

    onClickShowRules(){
        Global.onPopOn(this.nodeRules);
        Global.onPopOff(this.nodePigHunter);
    },

    onClickShowBXH(){
        if (!Global.isLogin) {
			Global.UIManager.showCommandPopup(MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		//Global.AudioManager.ClickButton();
		Global.UIManager.showEventRanking(STATE_EVENT.EVENT);
    },

    // update (dt) {},
});
