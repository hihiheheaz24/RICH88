cc.Class({
    extends: cc.Component,

    properties: {
        toggleMusic:cc.Toggle,
        sprExitRoom : cc.Sprite,
        listSprExitRoom : [cc.SpriteFrame]
        // toggleSound:cc.Toggle,
    },


    start () {

    },
    
    onLoad(){
        Global.GroupMenuInGameCard = this;
        // let isActiveSound = cc.sys.localStorage.getItem("sound");
        // // let isActiveMusic = cc.sys.localStorage.getItem("music");
        // if(isActiveSound == null || isActiveSound == "" || isActiveSound == 'off') {
        //     this.toggleSound.uncheck();
        // }else{
        //     this.toggleSound.check();
        // }

        // if(isActiveMusic == null || isActiveMusic == "" || isActiveMusic == 'off') {
        //     this.toggleMusic.uncheck();
        // }else{
        //     this.toggleMusic.check();
        // }
        if(Global.AudioManager.isActiveSound) this.toggleMusic.isChecked = false;
        else this.toggleMusic.isChecked = true;
        this.sprExitRoom.spriteFrame = this.listSprExitRoom[0]
    },

    onClose(){
        this.node.removeFromParent();
    },
    
    onClickback() {
        cc.log("check game : ", MainPlayerInfo.CurrentGameCode)
        switch (MainPlayerInfo.CurrentGameCode) {
            case "TMN":
                require("SendCardRequest").getIns().MST_Client_LeaveRoom();
                break;
            case "SAM":
                require("SendCardRequest").getIns().MST_Client_SAM_LeaveRoom()
                break;
            case "MAB":
                require("SendCardRequest").getIns().MST_Client_BINH_LeaveRoom();
                break;
            case "PKR":
                require("SendCardRequest").getIns().MST_Client_Poker_Leave_Table();
                break;
        }
        this.onClose();
    },

    // onSoundClicked(event, index) {
    //     this.isActiveSound = this.toggleSound.isChecked;
    //     if (Global.AudioManager) Global.AudioManager.isActiveSound = this.isActiveSound;
    // },
    // onMusicClicked(event, index) {
    //     this.isActiveMusic = this.toggleMusic.isChecked;
    //     if (Global.AudioManager) Global.AudioManager.isActiveMusic = this.isActiveMusic;
    //     this.onClose();
    // },
    clickSettingSound(event, data){
        cc.log("check event : ", event.isChecked)
        // Global.UIManager.showSettingPopup();
        if(Global.AudioManager)  Global.AudioManager.isActiveSound = !event.isChecked;
        if(Global.AudioManager) Global.AudioManager.isActiveMusic = !event.isChecked;
    },


    onClickShowHistory(){
        cc.log("check item la : ", Global.GameView.historyPopup)
        this.onClose();
        Global.GameView.historyPopup.show();
        // require("SendCardRequest").getIns().MST_Client_TLMN_Send_Get_Log();
    },
});
