cc.Class({
    extends: cc.Component,
    ctor() {
        this.numberPage = 10;
        this.numberRow = 8;
        this.TIME_CACHE_RANK = 30;
        this.lastTime = 0;
        this.listRow = [];
        this.listPlayHistory = [];
        this.currentPage = 0;
        this.totalPage = 0;
        this.listDataTakeJackpot = null;
        this.listDataTopWinJackpot = null;
        this.rankType = 0;//NONE = 0, TOP_JACKPOT = 1, TAKE_JACKPOT = 2
        this.currentPage = 0;
        this.totalPage = 0;
    },

    properties: {
        tabakeJackpotBtn: cc.Button,
        tabTopWinJackpotBtn: cc.Button,
        rowView: cc.Node,
        nextPageBtn: cc.Node,
        previousPageBtn: cc.Node,
        headerTopJackpot: cc.Node,
        headerKillJAckpot: cc.Node,
        listButtonPage: [cc.Button],
        takeJackpotToggle: cc.Toggle,
        topJackpotToggle: cc.Toggle,
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
            let rankView = rowTrans.getComponent("EventRankingView");
            this.listRow[this.listRow.length] = rankView;
        }

        this.takeJackpotToggle.node.on('toggle', this.takeJackpotToggleCallback, this);
        this.topJackpotToggle.node.on('toggle', this.topJackpotToggleCallback, this);
    },

    takeJackpotToggleCallback: function (toggle) {
        if (toggle.isChecked) {
            this.ClickTabTakeJackpot();
        }
    },
    topJackpotToggleCallback: function (toggle) {
        if (toggle.isChecked) {
            this.ClickTabTopWinJackpot();
        }
    },

    show() {
        this.Init();
        this.node.active = true;
        this.topJackpotToggle.isChecked = true;
        this.ClickTabTopWinJackpot();
    },

    ClickTabTopWinJackpot() {
        this.rankType = RANK_TYPE.TOP_JACKPOT;
        this.headerTopJackpot.active = true;
        this.headerKillJAckpot.active = false;
        if (this.listDataTopWinJackpot != null) {
            if (Global.GetRealTimeStartUp() < (this.lastTime + this.TIME_CACHE_RANK)) {
                this.SetInfoTopWinJackpot(this.listDataTopWinJackpot);
                this.lastTime = Global.GetRealTimeStartUp();
                return;
            }
        }
        Global.UIManager.showMiniLoading();
        this.SendRequestTopJackpot();
    },


    ClickTabTakeJackpot() {
        this.rankType = RANK_TYPE.TAKE_JACKPOT;
        this.headerTopJackpot.active = false;
        this.headerKillJAckpot.active = true;
        if (this.listDataTakeJackpot != null) {
            if (Global.GetRealTimeStartUp() < (this.lastTime + this.TIME_CACHE_RANK)) {
                this.SetInfoTakeJackpot(this.listDataTakeJackpot);
                this.lastTime = Global.GetRealTimeStartUp();
                return;
            }
        }
        Global.UIManager.showMiniLoading();
        this.SendRequestTakeJackpot();
    },

    ClickPage(event, index) {
        if (this.rankType == RANK_TYPE.TOP_JACKPOT) {
            this.ClickPageTopWinJackpot(index);
        } else if (this.rankType == RANK_TYPE.TAKE_JACKPOT) {
            this.ClickPageTakeJackpot(index);
        }
    },

    ClickPageTakeJackpot(index) {
        this.SetCurrentPageTakeJackpot(parseInt(index));
    },

    ClickPageTopWinJackpot(index) {
        this.SetCurrentPageTopWinJackpot(parseInt(index));
    },

    SetInfoTakeJackpot(data) {
        cc.log("SetInfoTakeJackpot", data);
        this.listDataTakeJackpot = data;
        this.totalPage = parseInt((this.listDataTakeJackpot.length - 1) / 10) + 1;
        if (this.totalPage == 1)
            this.totalPage = 0;
        for (let i = 0; i < this.listButtonPage.length; i++) {
            if (i < this.totalPage) {
                this.listButtonPage[i].node.active = true;
            } else {
                this.listButtonPage[i].node.active = false;
            }
        }
        this.SetCurrentPageTakeJackpot(0);
    },

    SetInfoTopWinJackpot(data) {
        cc.log("SetInfoTopWinJackpot", data);
        this.listDataTopWinJackpot = data;
        this.totalPage = parseInt((this.listDataTopWinJackpot.length - 1) / 10) + 1;
        if (this.totalPage == 1)
            this.totalPage = 0;
        for (let i = 0; i < this.listButtonPage.length; i++) {
            if (i < this.totalPage) {
                this.listButtonPage[i].node.active = true;
            } else {
                this.listButtonPage[i].node.active = false;
            }
        }
        this.SetCurrentPageTopWinJackpot(0);
    },

    ClickNextPage() {
        if (this.rankType == RANK_TYPE.TOP_JACKPOT) {
            this.ClickNextPageTopWinJackpot();
        } else if (this.rankType == RANK_TYPE.TAKE_JACKPOT) {
            this.NextPageTakeJackpot();
        }
    },

    ClickPreviousePage() {
        if (this.rankType == RANK_TYPE.TOP_JACKPOT) {
            this.ClickPreviousePageTopWinJackpot();
        } else if (this.rankType == RANK_TYPE.TAKE_JACKPOT) {
            this.PreviousePageTakeJackpot();
        }
    },

    NextPageTakeJackpot() {
        this.SetCurrentPageTakeJackpot(this.currentPage + 1);
    },

    PreviousePageTakeJackpot() {
        this.SetCurrentPageTakeJackpot(this.currentPage - 1);
    },

    ClickNextPageTopWinJackpot() {
        this.SetCurrentPageTopWinJackpot(this.currentPage + 1);
    },

    ClickPreviousePageTopWinJackpot() {
        this.SetCurrentPageTopWinJackpot(this.currentPage - 1);
    },

    SetCurrentPageTakeJackpot(currentPage) {
        this.SetStateButtonPage(currentPage);
        for (let i = 0; i < this.listRow.length; i++) {
            if (this.currentPage * 10 + i < this.listDataTakeJackpot.length) {
                this.listRow[i].node.active = true;
                let jackpotData = this.listDataTakeJackpot[this.currentPage * 10 + i];
                this.listRow[i].SetInfoTake(i, Global.formatTime(jackpotData.CreateDate), jackpotData.NickName, Global.formatNumber(jackpotData.RewardMoney), false);
            } else {
                this.listRow[i].node.active = false;
            }
        }
    },

    SetCurrentPageTopWinJackpot(currentPage) {
        this.SetStateButtonPage(currentPage);
        for (let i = 0; i < this.listRow.length; i++) {
            if (this.currentPage * 10 + i < this.listDataTopWinJackpot.length) {
                this.listRow[i].node.active = true;
                let jackpotData = this.listDataTopWinJackpot[this.currentPage * 10 + i];
                this.listRow[i].SetInfo(i, (i + 1).toString(), jackpotData.NickName, Global.formatNumber(jackpotData.TotalMoney));
            } else {
                this.listRow[i].node.active = false;
            }
        }
    },

    SetStateButtonPage(currentPage) {
        this.currentPage = currentPage;
        if (this.currentPage == 0)
            this.previousPageBtn.active = false;
        else
            this.previousPageBtn.active = true;
        if (currentPage == this.totalPage - 1)
            this.nextPageBtn.active = false;
        else
            if (this.totalPage != 0)
                this.nextPageBtn.active = true;
            else this.nextPageBtn.active = false;
        for (let i = 0; i < this.listButtonPage.length; i++) {
            this.listButtonPage[i].interactable = true;
        }
        this.listButtonPage[this.currentPage].interactable = false;
    },

    SendRequestTakeJackpot() {
        require("SendRequest").getIns().MST_Client_Rank_Take_Jackpot();
    },

    SendRequestTopJackpot() {
        require("SendRequest").getIns().MST_Client_Top_Rank_Take_Jackpot();
    },

    Hide() {
        this.node.active = false;
    },

    onDestroy() {
        Global.RankPopup = null;
    },

});
