cc.Class({
    extends: cc.Component,

    ctor(){
        this.pokerView = null;
    },

    properties: {
        nodeBtnHistory : cc.Node,
        listToggle : [cc.Toggle],
        sprMusic : cc.Sprite,
        listToggleMusic : [cc.SpriteFrame],
        nodeHTP : cc.Node,
        nodeHTPHoldEm : cc.Node,
        nodeHTPShortDeck : cc.Node,
        nodeHTPPokerNow : cc.Node,
        listHTP : cc.ScrollView,
        lbOutRoom : cc.Label,

        btnOutRoom : cc.Toggle,
    },


    start () {

    },
    
    onLoad(){
        Global.GroupMenuInGame = this;
        this.isActiveSound = Global.AudioManager.isActiveSound;
        if(Global.PokerRoomType === 5) this.btnOutRoom.node.active = false;
        
    },
    onEnable(){
        for (let i = 0; i < this.listToggle.length; i++) {
            const toggle = this.listToggle[i];
            toggle.isChecked = false;
        }
        this.nodeHTP.active = false;
        if(this.pokerView.roomId && !this.pokerView.roomId.outRoom) 
            this.lbOutRoom.string  = "Thoát phòng"
        else if(this.pokerView.roomId)
            this.lbOutRoom.string  = "Hủy thoát"
    },
    show(){
        Global.onPopOn(this.node);
    },
    onClose(){
        this.node.destroy();
        if(MainPlayerInfo.CurrentGameCode === "PKR") this.nodeBtnHistory.active = true;
        else this.nodeBtnHistory.active = false;
    },
    
    onClickback() {
        cc.log("xem nao dcm may clickback :", this.pokerView)
        if(this.pokerView.lbSpinAndGo.active && this.pokerView.stateTable === StateTable.Playing){
            Global.UIManager.showConfirmPopup("Bạn sẽ không thể vào lại tour nếu thoát ra",
                () => {
                    // cc.log("xem nao dcm may :", Global[MainPlayerInfo.CurrentGameCode + Global.PokerIdRoom])  
                    let msg = {}
                    msg[AuthenticateParameterCode.RoomType] = 4;
                    require("SendCardRequest").getIns().MST_Client_Poker_Leave_Table(msg);
                    
                }
            )
        }
        else{
            this.pokerView.outRoom = !this.pokerView.outRoom;
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
        }
       
        this.onClose();
    },

    clickSettingSound(){
        if(this.pokerView) {
            this.isActiveSound = !this.isActiveSound;
            if(Global.AudioManager)  Global.AudioManager.isActiveSound = this.isActiveSound;
        }
        else Global.UIManager.showSettingPopup();
    },

    onClickHistory(){
        if(this.pokerView){
            this.pokerView.onClickGetHistory();
        }
    },

    onClickSetting(){
        cc.log("chay setting 1111111")
        if(this.pokerView){
            this.pokerView.onClickSetting();
        }
    },
    onClickHowToPlay(){
        Global.onPopOn(this.nodeHTP);
        switch (Global.PokerRoomType) {
            case 1:
                this.nodeHTPHoldEm.active = true;
                this.nodeHTPShortDeck.active = false;
                this.nodeHTPPokerNow.active = false;
                break;
            case 2:
                this.nodeHTPShortDeck.active = true;
                this.nodeHTPHoldEm.active = false;
                this.nodeHTPPokerNow.active = false;
                break;
            default:
                this.nodeHTPPokerNow.active = true
                this.nodeHTPHoldEm.active = false;
                this.nodeHTPShortDeck.active = false;
                break;
        }
        this.listHTP.scrollToTop();
    },
    onClickOffHTP(){
        Global.onPopOff(this.nodeHTP);
        this.reset();
    },

    onClickHide(){
        Global.UIManager.closeAllPopup();
        this.pokerView.node.scale = 0;
        Global.LobbyView.OnShowLobby();
        this.onClose();
        if(this.pokerView.isMe === null){
            require("SendCardRequest").getIns().MST_Client_Poker_Leave_Table();
        }
    },

    reset(){
        cc.log("chay vao reset gr menu")
        // for (let i = 0; i < this.listToggle.length; i++) {
        //     const toggle = this.listToggle[i];
        //     toggle.isChecked = false;
        // }
    },
    onDestroy(){
        if(this.pokerView)
            this.pokerView.groupMenu = null;
    },
});
