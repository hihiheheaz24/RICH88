// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        parentBtnInvite:cc.Node,
        groupMenuInGame : cc.Prefab,
        nodeJackPot: cc.Node,
        lbJackPot: cc.Label,

        nodeJackpotUser : cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.log("=======> chay vao game view");
        Global.GameView = this;
        if(this.parentBtnInvite)
        this.parentBtnInvite.active = false;
        Global.NotifyUI.isInGame = true;
        Global.UIManager.closeAllPopup();
    },

    start () {

    },

    onDestroy() {
        // Global.GameView = null;
        cc.log("chay vao destroy game view") 
        Global.UIManager.hideMask();
        Global.NotifyUI.isInGame = false;
        Global.GameView = null;
        if(Global.LeaguePopup && Global.LeaguePopup.node.active)
            Global.LeaguePopup.hide();
        Global.AudioManager.stopInGame();
        Global.AudioManager.playMusic();

        this.checkShowShop();
        if(Global.listDelayReward.length > 0){
            Global.UIManager.showRewardPopup(Global.listDelayReward[0]);
            Global.listDelayReward.shift();
        }
    },

    checkShowShop(){
        if(MainPlayerInfo.ingameBalance < 10000 && Global.listDelayReward.length === 0){
            Global.UIManager.showShopPopup(STATUS_SHOP.CARD_IN);
        }
    },

    takeJackpot(data){
        cc.log("data jack pot la  : ", data);
        //16 số tiền thuong
        //15 so tien user sau khi thuong
        let listId = data[13];
        let listPlayerName = data[14];
        let listCash = data[15];
        let listGold = data[16];
        let idPlayerWinJackPot = 0;//data[20];
        
        cc.log("check list id : ", listId)
        cc.log("check list id player: ", MainPlayerInfo.accountId)
        cc.log("check list id : ", this.nodeJackPot)
        cc.log("check id : ",idPlayerWinJackPot )
        if(listId[0] === MainPlayerInfo.accountId && this.nodeJackPot){
           cc.log("chay vao if")
            this.nodeJackPot.active = true;
            this.nodeJackPot.opacity = 0;
            this.lbJackPot.string = Global.formatNumber(listGold[idPlayerWinJackPot]);
            this.isMe.ag = listCash[idPlayerWinJackPot];
            this.nodeJackPot.runAction(cc.sequence(cc.spawn(cc.fadeIn(0.3), cc.scaleTo(0.1, 1.5).easing(cc.easeCubicActionOut())), cc.scaleTo(0.1, 1.2).easing(cc.easeCubicActionOut())));
            this.scheduleOnce(function () {
                this.nodeJackPot.runAction(cc.fadeOut(0.3).easing(cc.easeCubicActionOut()));
            }, 3)
        }

        if(listId[0] !== MainPlayerInfo.accountId){

            let name = listPlayerName[0];
            let str = `<color=#F8F800>{0}</color> trúng Jackpot  \n <color=#F8F800>{1}</color> (TLMN)`;
    
            this.nodeJackpotUser.getChildByName("New Label").getComponent(cc.RichText).string = Global.formatString(str, [name,  Global.formatNumber(listGold[idPlayerWinJackPot])]);
            this.nodeJackpotUser.position = cc.v2(920, 210);
            let percent = cc.winSize.width / 1920;
            cc.tween(this.nodeJackpotUser)
            .to(0.5, {position: cc.v2(-150 / percent, 210)})
            .delay(3)
            .to(0.5, {position:  cc.v2(800, 210)})
            .start()
          
        }


        // for (let i = 0; i < listId.length; i++) {
        //     const idPlayer = listId[i];
        //     let player = this.getPlayerWithId(idPlayer);
        //     if (player) {
        //         player.winJackpotSmall();
        //     }
        // }
    },

    showInfoPlayerTLMN(idPlayer){
		// if (Global.InfoPlayerTLMN == null) {
		// 	cc.resources.load("Popup/InfoPlayerTLMN", cc.Prefab, (err, prefab) => {
		// 		let item = cc.instantiate(prefab).getComponent("InfoPlayerTLMN");
		// 		item.show(idPlayer);
		// 		this.node.addChild(item.node);
		// 	})
		// } else {
		// 	Global.InfoPlayerTLMN.show(idPlayer);
		// }
        if(idPlayer === MainPlayerInfo.accountId)
            Global.UIManager.showProfilePopup(idPlayer)
	},
    // update (dt) {},
});