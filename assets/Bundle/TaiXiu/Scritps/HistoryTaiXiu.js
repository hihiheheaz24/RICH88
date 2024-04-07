cc.Class({
    extends: cc.Component,

    properties: {
        srcListView: require("BaseScrollView"),
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        this.updateTimer = 0;
        this.updateInterval = 0.2;
        Global.HistoryTaiXiu = this;
       
    },
    show(){
        this.currentPage = 1;
        this.sendGetData(this.currentPage);
        this.isScr = false;
        this.srcListView.resetScr();
        this.node.active = true;
        actionEffectOpen(this.node);
    },
    responseServer(packe) {
        cc.log(packe)
        Global.UIManager.hideMiniLoading();
        let Page = packe[2];
        let dataJson = JSON.parse(packe[1]);
        let lengthRequire = packe[3];
        let lengHienCo = packe[4];

        if (Page == 1) {
            let length = dataJson.length;
            this.srcListView.init(dataJson, (length * 65), 65);
        } else {
            this.srcListView.addListItem(dataJson, dataJson.length * 65);
        }
        if (Page == this.currentPage) {
            this.currentPage++
        }


        if (lengthRequire > lengHienCo) {
            this.isScr = false;
        } else {
            this.isScr = true;
        }
    },
    onClickClose() {
        Global.UIManager.hideMark();
        actionEffectClose(this.node , ()=>{
            this.node.active = false;
        })
    },
    onDestroy() {
        cc.log("chay vao on destory tai xiu")
        Global.HistoryTaiXiu = null;
    },

    sendGetData(page) {
        let msg = {};
        msg[1] = page;
        msg[2] = 50;
        msg[3] = GAME_TYPE.TAI_XIU;
        require("SendRequest").getIns().MST_Client_TaiXiu_Get_Game_Detail_History(msg);
        Global.UIManager.showMiniLoading();
    },

    update(dt) {
        if (!this.isScr) return;
        this.updateTimer += dt;
        if (this.updateTimer < this.updateInterval) return;
        this.updateTimer = 0;
        let y1 = this.srcListView.scrollView.getScrollOffset().y;
        let y2 = this.srcListView.scrollView.getMaxScrollOffset().y;
        if (y2 - y1 < 100) {
            this.sendGetData(this.currentPage);
            this.isScr = false;
        }
    },
});
