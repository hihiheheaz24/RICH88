// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        webGameApi : cc.WebView,
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        let canvas = cc.director.getScene().getChildByName("Canvas");
		if (!cc.sys.isMobile) {
			canvas.designResolution = cc.size(1920,1080);
			console.log("check win soze : ", cc.winSize)
			this.webGameApi.node.setContentSize(cc.size(cc.winSize.width - 500, cc.winSize.height));
			this.webGameApi.node.position = cc.v2(0, 0);
		}
		else{
			canvas.designResolution = cc.size(1358,1920);
		}
        this.webGameApi.url = Global.UrlGameApi;
    },

    start () {

    },

    onClickCloseGameApi(){
		this.webGameApi.url = "";
		require("SendRequest").getIns().MST_Client_Pramatic_Close_Game();
        cc.director.loadScene("LobbyScene");
		//
		// canvas.designResolution = cc.size(1358,1920);
	},

    // update (dt) {},
});
