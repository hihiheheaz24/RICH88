cc.Class({
    extends: cc.Component,
    ctor() {
        this.numberPage = 10;
        this.numberRow = 8;
        this.listRow = [];
        this.listPlayHistory = [];
        this.currentPage = 0;
        this.totalPage = 0;
        this.state = 0;
    },

    properties: {
        rowView: cc.Node,
        nextPageBtn: cc.Node,
        previousPageBtn: cc.Node,
        // contentCash: require("ShopHistoryView"),
        lbNumberPage: cc.Label,
    },

    Init() {
        if (this.isInit) {
            return;
        }
        this.isInit = true;
        this.listRow[this.listRow.length] = this.rowView.getComponent("EventRankingView");
        for (let i = 0; i < this.numberRow - 1; i++) {
            let rowTrans = cc.instantiate(this.rowView);
            rowTrans.parent = this.rowView.parent;
            let historyView = rowTrans.getComponent("EventRankingView");
            this.listRow[this.listRow.length] = historyView;
        }
    },

    show() {
        this.Init();
        Global.onPopOn(this.node);
        Global.UIManager.showMiniLoading();
        require("SendRequest").getIns().MST_Client_Account_History();
    },
    onToggleHistoryIn(toggle) {
        if (toggle.isChecked) {
            this.clickCashIn();
        }
    },
    onToggleHistoryOut(toggle) {
        if (toggle.isChecked) {
            this.clickCashOut();
        }
    },

    ClickPage(event, index) {
        this.SetCurrentPage(parseInt(index));
    },
    SetInfoTelco(lstData) {
        // if (this.contentCash) {
        //     this.contentCash.SetInfoTelco(lstData);
        // }
    },
    SetInfoHistoryPlay(data) {
        cc.log("data history : ", data)
        let size = data.length > 100 ? 100 : data.length;
        for (let i = 0; i < size; i++) {
            this.listPlayHistory[i] = data[i];
        }
        this.totalPage = parseInt((this.listPlayHistory.length - 1) / this.numberRow + 1);
        if (this.totalPage == 1)
            this.totalPage = 0;
        this.SetCurrentPage(0);
    },

    ClickNextPage() {
        this.SetCurrentPage(this.currentPage + 1);
    },

    ClickPreviousePage() {
        this.SetCurrentPage(this.currentPage - 1);
    },

    Hide() {
        Global.onPopOff(this.node);
    },

    SetCurrentPage(currentPage) {
        this.currentPage = currentPage;
        if (currentPage == 0)
            this.previousPageBtn.active = false;
        else
            this.previousPageBtn.active = true;
        if (currentPage == this.totalPage - 1)
            this.nextPageBtn.active = false;
        else
            if (this.totalPage != 0)
                this.nextPageBtn.active = true;
            else this.nextPageBtn.active = false;
        this.SetStateButtonPage();
        let indexPage = currentPage + 1;
        this.lbNumberPage.string = "(" + indexPage + "/" + this.totalPage + ")";

        for (let i = 0; i < this.listRow.length; i++) {
            if (currentPage * this.numberRow + i < this.listPlayHistory.length) {
                this.listRow[i].node.active = true;
                let historyGameData = this.listPlayHistory[currentPage * this.numberRow + i];
                this.listRow[i].SetInfo(i, historyGameData.DateTime, Global.formatNumber(historyGameData.NewAccountBalance), historyGameData.ActionDescription, Global.formatNumber(historyGameData.ChangeBalance));
            } else {
                this.listRow[i].node.active = false;
            }
        }
    },

    formatTime(str) {
        return require("SyncTimeControl").getIns().convertTimeToString((new Date(str)).getTime());
    },

    SetStateButtonPage() {
        
    },

    onDestroy() {
        Global.HistoryPopup = null;
    },
});
