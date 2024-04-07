var ScreenManager = cc.Class({
    statics: {
        getIns() {
            if (this.self == null) this.self = new ScreenManager();
            return this.self;
        }
    },

    properties: {
        // foo: {
        currentScreen: 0,
        roomType: 0,//1-my nhan, 0-tam bao
        cardRoomType: 0,// 0 - TLMN , 1 - Poker , 2 - Phỏm , 3 - Ba cây , 4 - Sâm , 5 - Mậu Binh
    },

    LoadScene(screenCode) {
        if (screenCode == SCREEN_CODE.LOGIN) {
            if (Global.NetworkManager._connect && Global.NetworkManager._connect.connectionState === "Connected") {
                Global.NetworkManager.disconnect();
                Global.AudioManager.playMusicJoinGameStop();
            }
            this.currentScreen = SCREEN_CODE.LOGIN;
            if(!Global.LobbyView)
                cc.director.loadScene("LobbyScene");
            if(Global.InGameCard)
                Global.InGameCard.parentGame.destroyAllChildren();
            // if(cc.sys.isBrowser) {
            //     var url = new URL(window.location.href);
            //     var AccessToken = url.searchParams.get("accesstoken");
            //     if (AccessToken) {
            //         Global.UIManager.autoLogin();
            //     }
            //     else{
            //         Global.UIManager.showLoginTabView();
            //     }
            // }
            // else{
            //     Global.UIManager.showLoginTabView();
            // }
            // Global.LobbyView.onClickCloseListMenu();
            Global.UIManager.closeAllPopup();
            for (let i = 0; i < Global.InGameCard.parentGame.children.length; i++) {
                const gameItem = Global.InGameCard.parentGame.children[i];
                gameItem.active = false;
            }
            // require("SendCardRequest").getIns().MST_Client_Get_List_Table_Playing();
        }
        else if (screenCode == SCREEN_CODE.LOBBY) {
            this.currentScreen = SCREEN_CODE.LOBBY;
            if(Global.LobbyView)
                Global.LobbyView.OnShowLobby();
            else 
                cc.director.loadScene("LobbyScene");
            if(Global.InGameCard)
                Global.InGameCard.parentGame.destroyAllChildren();
        }
    }
});
module.exports = ScreenManager;