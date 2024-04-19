cc.Class({
    extends: cc.Component,
    ctor() {
        this.numberPageNews = 10;
        this.numberRowNews = 5;
        this.currentPageNews = 0;
        this.totalPageNews = 0;
        this.listEventView = [];
        this.listEventData = [];
        this.currentEventSelect = 0;
        this.listRowRankEvent = [];
    },

    properties: {
        eventObj: cc.Node,
        btnEvent: cc.Node,
        boxRankEvent: cc.Node,
        boxRuleEvent: cc.Node,
        titleRuleEvent: cc.Label,
        descriptionEvent: cc.Label,
        rowRankView: cc.Node,
        currentRankView: cc.Node,
        toggleRule : cc.Toggle,

        isMeRank : cc.Label,
        isMeName : cc.Label,
        isMeAg : cc.Label,
        iteMe : cc.Node,

        noEvent: cc.Node
    },

    Init() {
        if (this.isInit) {
            return;
        }
        this.isInit = true;
        this.listEventView[this.listEventView.length] = this.btnEvent.getComponent(cc.Button);
        this.listRowRankEvent[this.listRowRankEvent.length] = this.rowRankView.getComponent("EventRankingView");
    },

    show(state, isClick = true) {
        this.Init();
        Global.EventPopup = this;
        Global.onPopOn(this.node);
        if (state == STATE_EVENT.NEWS){
            if(isClick)
            require("SendRequest").getIns().MST_Client_Get_News();
        }
        else if (state == STATE_EVENT.EVENT)
            this.ClickTabEvent();
    },

    ClickTabEvent() {
        this.eventObj.active = false;
        this.noEvent.active = true;
        return;
        this.eventObj.active = true;
        this.noEvent.active = false;
        require("SendRequest").getIns().MST_Client_Get_Event_Config_Info();
    },

    showListFirstCashIn(data){
        cc.log("check reule condug : ", data.RuleConfig)
    },

    //event
    GetListEventInfo(listEventData) {
        if (listEventData.length == 0) {
            this.eventObj.active = false;
            this.noEvent.active = true;
            return;
        }
        this.listEventData = listEventData;
        for (let i = 0; i < this.listEventView.length; i++) {
            this.listEventView[i].node.active = false;
        }
        for (let i = 0; i < listEventData.length; i++) {
            if (i < this.listEventView.length) {
                this.listEventView[i].node.active = true;
                this.listEventView[i].getComponentInChildren(cc.Label).string = listEventData[i].EventName;
            } else {
                let eventTrans = cc.instantiate(this.btnEvent);
                eventTrans.active = true;
                eventTrans.parent = this.btnEvent.parent;
                eventTrans.getComponentInChildren(cc.Label).string = listEventData[i].EventName;
                this.listEventView[this.listEventView.length] = eventTrans.getComponent(cc.Button);
            }
        }
        for (let i = 0; i < this.listEventView.length; i++) {
            let index = i;
            this.listEventView[i].node.off(cc.Node.EventType.TOUCH_END, () => {
                this.SelectEvent(index);
            }, this);
            this.listEventView[i].node.on(cc.Node.EventType.TOUCH_END, () => {
                this.SelectEvent(index);
            }, this);
        }
        this.SelectEvent(0);
    },

    SelectEvent(index) {
        for (let i = 0; i < this.listEventView.length; i++) {
            if (index == i) {
                this.listEventView[i].interactable = false;
            } else {
                this.listEventView[i].interactable = true;
            }
        }
        this.currentEventSelect = index;
        this.toggleRule.isChecked = true;
        this.ClickTabRuleEvent();
    },

    ClickTabRankEvent() {
        this.boxRankEvent.active = true;
        this.boxRuleEvent.active = false;
        let msgData = {};
        msgData[1] = this.listEventData[this.currentEventSelect].EventId;
        require("SendRequest").getIns().MST_Client_Top_Event(msgData);
    },

    ClickTabRuleEvent() {
        this.boxRankEvent.active = false;
        this.boxRuleEvent.active = true;
        this.titleRuleEvent.string = this.listEventData[this.currentEventSelect].EventName;
        let strDes = this.listEventData[this.currentEventSelect].Description;
        this.descriptionEvent.string = strDes.replace("\\n", "\n");
    },

    GetRankEvent(listData, currentData) {
        this.iteMe.active = true;
        this.isMeRank.string = currentData.Order;
        this.isMeName.string = currentData.NickName;
        this.isMeAg.string = Global.formatNumber(currentData.Point);
        //this.currentRankView.SetInfo (0, currentData.Order.toString(), currentData.NickName, Global.formatNumber(currentData.Point), true);
        for (let i = 0; i < this.listRowRankEvent.length; i++) {
            this.listRowRankEvent[i].node.active = false;
        }
        for (let i = 0; i < listData.length; i++) {
            if (i < this.listRowRankEvent.length) {
                this.listRowRankEvent[i].node.active = true;
                this.listRowRankEvent[i].SetInfo(i, listData[i].Order.toString(), listData[i].NickName, Global.formatNumber(listData[i].Point), false);
            } else {
                let eventTrans = cc.instantiate(this.rowRankView);
                eventTrans.active = true;
                eventTrans.parent = this.rowRankView.parent;
                let eventRankView = eventTrans.getComponent("EventRankingView");
                eventRankView.SetInfo(i, listData[i].Order.toString(), listData[i].NickName, Global.formatNumber(listData[i].Point), false);
                this.listRowRankEvent[this.listRowRankEvent.length] = eventRankView;
            }
        }
    },

    Hide() {
        Global.onPopOff(this.node);
    },

    onDestroy() {
        Global.EventPopup = null;
    },
});
