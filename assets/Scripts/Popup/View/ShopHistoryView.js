

cc.Class({
    extends: cc.Component,

    ctor() {
        this.isInit = false;
        this.numberPage = 10;
        this.numberRow = 8;
        this.TimeCache = 30;
        this.currentPage = 1;
        this.totalPage = 0;
        this.lstDataIn = [];
        this.lstDataOut = [];
        this.listRow = [];
        this.state = 0;
    },

    properties: {
        rowView: require("HistoryCashView"),
        nextPageBtn: cc.Node,
        previousPageBtn: cc.Node,
    },
    init() {
        if (this.isInit) {
            return;
        }
        this.isInit = true;
        this.listRow.push(this.rowView);
        for (let i = 0; i < this.numberRow - 1; i++) {
            let rowTrans = cc.instantiate(this.rowView.node);
            rowTrans.parent = this.rowView.parent;
            let historyView = rowTrans.getComponent("HistoryCashView");
            this.listRow.push(historyView);
        }
    },

    Show(type) {
        this.init();
        this.node.active = true;
        this.state = type;
        if (type == 1) {
            if (this.lstDataIn.length > 0) {
                this.SetInfoTelco(this.lstDataIn);
                return;
            }
            this.SendGetTelcoHistory(type);
        } else if (type == 2) {
            if (this.lstDataOut.length > 0) {
                this.SetInfoTelcoOut(this.lstDataOut);
                return;
            }
            this.SendGetTelcoHistory(type);
        }
    },
    Hide() {
        this.node.active = false;
    },

    SetInfoTelco(data) {
        let size = data.length > 100 ? 100 : data.length;
        for (let i = 0; i < size; i++) {
            if (this.state == 1) {
                this.lstDataIn[i] = data[i];
            } else {
                this.lstDataOut[i] = data[i];
            }

        }
        this.totalPage = parseInt((size - 1) / this.numberRow + 1);
        if (this.totalPage == 1)
            this.totalPage = 0;
        // for (let i = 0; i < this.listButtonPage.length; i++) {
        //     if (i < this.totalPage) {
        //         this.listButtonPage[i].node.active = true;
        //     } else {
        //         this.listButtonPage[i].node.active = false;
        //     }
        // }
        this.SetCurrentPage(0);
    },
    ClickNextPage() {
        this.SetCurrentPage(this.currentPage + 1);
    },

    ClickPreviousePage() {
        this.SetCurrentPage(this.currentPage - 1);
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
        // this.SetStateButtonPage();
        let data = this.state == 1 ? this.lstDataIn : this.lstDataOut;
        for (let i = 0; i < this.listRow.length; i++) {
            if (currentPage * this.numberRow + i < data.length) {
                this.listRow[i].node.active = true;
                let itemData = data[currentPage * this.numberRow + i];
                this.listRow[i].SetInfo(itemData);
            } else {
                this.listRow[i].node.active = false;
            }
        }
    },


    SendGetTelcoHistory(telcoType) {
        if (Global.UIManager) Global.UIManager.showMiniLoading();
        let msg = {};
        msg[1] = telcoType;
        require("SendRequest").getIns().MST_Client_Account_Telco_History(msg);
    },


});
