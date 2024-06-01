cc.Class({
    extends: cc.Component,
    ctor() {
        this.numberPage = 10;
        this.numberRow = 10;
        this.listHistory = [];
        this.currentPage = 0;
        this.totalPage = 0;
    },

    properties: {
        rowView : cc.Node,
        listButtonPage : [cc.Button],
        nextPageBtn : cc.Node,
        previousPageBtn : cc.Node,
        lbCurentPage : cc.Label,
    },

    Init() {
        
        let parent = this.rowView.parent;
        for(let i = 0; i < this.numberRow - 1; i++) {
            let rowTrans = parent.children[i];
            if(rowTrans == null) {
                rowTrans = cc.instantiate(this.rowView);
            }
            rowTrans.parent = parent;
        }
    },

    show() {
        this.Init();
        this.listHistory = [];
        this.currentPage = 0;
        this.totalPage = 0;
        this.node.active = true;
        actionEffectOpen(this.node);
        let data = {};
        data[1] = 1;
        data[2] = 100;
        data[3] = GAME_TYPE.MINI_POKER;
        require("SendRequest").getIns().MST_Client_Slot_Get_Game_Detail_History(data);
    },

    ClickPage(event, index) {
        this.SetCurrentPage (parseInt(index));
    },

    SetInfoHistory(data) {
        Global.UIManager.hideMiniLoading();
        if (data.length > 100) {
            for (let i = 0; i < 100; i++) {
                this.listHistory [i] = data [i];
            }
        } else 
            this.listHistory = data;
        this.totalPage = parseInt((this.listHistory.length - 1) / this.numberRow + 1);
        if(this.totalPage > this.numberPage)
            this.totalPage = this.numberPage;
        if (this.totalPage == 1)
            this.totalPage = 0;
        for (let i = 0; i < this.listButtonPage.length; i++) {
            if (i < this.totalPage) {
                this.listButtonPage [i].node.active = true;
            } else {
                this.listButtonPage [i].node.active = false;
            }
        }
        this.SetCurrentPage (0);
    },

    ClickNextPage() {
        this.SetCurrentPage (this.currentPage+1);
        this.lbCurentPage.string = this.currentPage + 1  + "/" + this.totalPage;;
    },

    ClickPreviousePage() {
        this.SetCurrentPage (this.currentPage-1);
        this.lbCurentPage.string = this.currentPage + 1 + "/" + this.totalPage;;
    },

    Hide() {
        // Global.UIManager.hideMask();
        actionEffectClose(this.node , ()=>{
            this.node.active = false;
        })
    },

    SetCurrentPage (currentPage) {
        this.currentPage = currentPage;
        if (currentPage == 0)
            this.previousPageBtn.active = false;
        else
            this.previousPageBtn.active = true;
        if (currentPage == this.totalPage - 1)
            this.nextPageBtn.active = false;
        else
            if(this.totalPage != 0)
                this.nextPageBtn.active = true;
            else this.nextPageBtn.active = false;
        this.SetStateButtonPage ();

        let children = this.rowView.parent.children;
        for (let i = 0; i < children.length; i++) {
            if (currentPage * this.numberRow + i < this.listHistory.length) {
                
                children [i].active = true;
                let historyData = this.listHistory [currentPage * this.numberRow + i];
                let resule = JSON.parse(historyData.ResultData);
                children [i].getComponent("RowHistoryMiniPoker").SetInfo ("#"+historyData.TurnId, this.formatTime(historyData.CreatedAt), Global.formatNumber(historyData.TotalBet), Global.formatNumber(historyData.Prize), Global.GetTextListCardByInt(resule),i);
            } else {
                children [i].active = false;
            }
        }
        this.lbCurentPage.string = this.currentPage + 1 + "/" + this.totalPage;
    },

    formatTime(str) {
        return require("SyncTimeControl").getIns().convertTimeToString((new Date(str)).getTime());
    },

    SetStateButtonPage() {
        for (let i = 0; i < this.listButtonPage.length; i++) {
            this.listButtonPage [i].interactable = true;
        }
        this.listButtonPage [this.currentPage].interactable = false;
    },

    onDestroy() {
        Global.HistoryMiniPoker = null;
    },
});
