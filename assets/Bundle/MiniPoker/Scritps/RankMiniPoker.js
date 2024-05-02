cc.Class({
    extends: cc.Component,
    ctor() {
        this.numberPage = 10;
        this.numberRow = 9;
        
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
            if(rowTrans == null){
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
        Global.UIManager.showMiniLoading();
        require("SendRequest").getIns().MST_Client_MiniPoker_Get_Top_Winner();
    },

    ClickPage(event, index) {
        this.SetCurrentPage (parseInt(index));
    },

    SetInfoRank(data) {
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
        // if (this.totalPage == 1)
        //     this.totalPage = 0;
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
        this.lbCurentPage.string = this.currentPage + 1  + "/" + this.totalPage;
    },

    ClickPreviousePage() {
        this.SetCurrentPage (this.currentPage-1);
        this.lbCurentPage.string = this.currentPage + 1 + "/" + this.totalPage;;
    },

    Hide() {
        Global.UIManager.hideMask();
        actionEffectClose(this.node , ()=>{
            this.node.active = false;
        })
    },

    SetCurrentPage (currentPage) {
        this.currentPage = currentPage;
        // if (currentPage == 0)
        //     this.previousPageBtn.active = false;
        // else
        //     this.previousPageBtn.active = true;
        // if (currentPage == this.totalPage - 1)
        //     this.nextPageBtn.active = false;
        // else
        //     if(this.totalPage != 0)
        //         this.nextPageBtn.active = true;
        //     else this.nextPageBtn.active = false;
        this.SetStateButtonPage ();

        let children = this.rowView.parent.children;
        for (let i = 0; i < children.length; i++) {
            if (currentPage * this.numberRow + i < this.listHistory.length) {
                children [i].active = true;
                let topWinData = this.listHistory [currentPage * this.numberRow + i];
                children [i].getComponent("RowHistoryMiniPoker").SetInfo (this.formatTime(topWinData.CreatedTime), topWinData.Nickname, Global.formatNumber(topWinData.BetValue), Global.formatNumber(topWinData.PrizeValue), this.GetWinDetail(topWinData.CardTypeID),i);
            } else {
                children [i].active = false;
            }
        }
        this.lbCurentPage.string = this.currentPage + 1 + "/" + this.totalPage;
    },

    formatTime(str) {
        return require("SyncTimeControl").getIns().convertTimeToString((new Date(str)).getTime());
    },

    GetWinDetail(cardTypeId) {
        switch (cardTypeId)
        {
            case 12: 
                return MyLocalization.GetText("THUNG_PHA_SANH_DAI");
            case 13:
                return MyLocalization.GetText("THUNG_PHA_SANH");
            default: return null;
        }
    },

    SetStateButtonPage() {
        for (let i = 0; i < this.listButtonPage.length; i++) {
            this.listButtonPage [i].interactable = true;
        }
        this.listButtonPage [this.currentPage].interactable = false;
    },

    onDestroy() {
        Global.RankMiniPoker = null;
    },
});
