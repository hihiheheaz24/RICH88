cc.Class({
    extends: cc.Component,

    properties: {
        _listHistory: [],
        srcListView: require("BaseScrollView")
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Global.HistoryMiniSlot = this;
        
    },
    responseServer(packet) {
        cc.log(packet[1])
        let dataJson = JSON.parse(packet[1]);
        let length = dataJson.length;
        this.srcListView.init(dataJson, (length * 50), 50);
        Global.UIManager.hideMiniLoading();
    },
    onClickClose() {
        Global.HistoryMiniSlot = null;
        Global.UIManager.hideMark();
        actionEffectClose(this.node , ()=>{
            this.node.active = false;
        })
    },
    show(){
        this.srcListView.resetScr();
        let msg = {};
        msg[1] = 1;
        msg[2] = 100;
        msg[3] = GAME_TYPE.MINI_SLOT;
        require("SendRequest").getIns().MST_Client_Slot_Get_Game_Detail_History(msg);
        Global.UIManager.showMiniLoading();
        this.node.active = true;
        actionEffectOpen(this.node);
    },
    onDestroy() {
        Global.HistoryMiniSlot = null;
    }

    // update (dt) {},
});
