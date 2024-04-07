cc.Class({
    extends: cc.Component,

    properties: {
        itemView: cc.Node,
        previousPageBtn: cc.Node,
        nextPageBtn: cc.Node,
        lbNumberPage: cc.Label,
        itemIsMe: cc.Node,
        lbTitle : cc.Label,
        listTopRank : require("BaseScrollView"),
        listItemTop: [cc.Node],
        bgUser : cc.Node,
        lbTimeEvent : cc.Label,
        btnToggle : cc.Toggle,
        thele : cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.listItemView = [];
        this.listDataRank = [];
        this.currentPage = 0;
        this.totalPage = 0;
        this.numberRow =  50;
        this.dataIsMe = null;
        this.itemTopIsMe = null;
        this.firstPos = null;
        this.dataEvent = null;
    },

    start() {

    },

    show() {
        Global.onPopOn(this.node);
        let msgData = {};
        msgData[1] = 21;
        require("SendRequest").getIns().MST_Client_Top_Event(msgData);
        this.btnToggle.node.getChildByName("lb").getComponent(cc.Label).string = "Hôm trước";
        this.btnToggle.isChecked = false;
    },

    initView() {
        // for (let i = 0; i < this.numberRow; i++) {
        //     let itemView = cc.instantiate(this.itemView);
        //     itemView.parent = this.itemView.parent;
        //     itemView.active = true;
        //     this.listItemView.push(itemView.getComponent("ItemEventRanking"));
        // }
    },

    handleData(packet, isLoadYesterday = false) {
        this.dataEvent = packet;
        let listDataString = packet[1];
        let timeEventDay = packet[3]
        let listData = [];
        let listDataYesterday = [];
        for (let i = 0; i < listDataString.length; i++) {
            listData[i] = JSON.parse(listDataString[i]);
        }
        let listDataRank = null;
        let dataIsMe = JSON.parse(packet[2]);
        let dataYesterday = packet[4];
        for (let i = 0; i < dataYesterday.length; i++) {
            listDataYesterday[i] = JSON.parse(dataYesterday[i]);
        }
        cc.log("check data hom qua ", listDataYesterday)
        if(listDataYesterday.length === 0){
            this.btnToggle.node.active = false;
        }
        else{
            this.btnToggle.node.active = true;
        }
        if(isLoadYesterday) listDataRank = listDataYesterday;
        else listDataRank = listData

        cc.log("check list data", listDataRank)
        if(!listDataRank || listDataRank.length === 0) return;
        this.listTopRank.resetScr();
        // let index = 3;
        // if(listDataRank.length < 3)
        //     index = listDataRank.length
        // cc.log("check index la : ", index)
        // for (let i = 0; i < index; i++) {
        //     const objData = listDataRank[i];
        //     cc.log("check objdata ", objData.NickName)
        //     this.listItemTop[i].getChildByName("lbName").getComponent(cc.Label).string = objData.NickName;
        //     this.listItemTop[i].getChildByName("lbGold").getComponent(cc.Label).string = objData.Point;
        //     this.listItemTop[i].getChildByName("lbReward").getComponent(cc.Label).string = Global.formatNumber(objData.RewardInfo);
        // }
        // listDataRank = listDataRank.slice(3);
        this.listTopRank.init(listDataRank , listDataRank.length * 80 , 80);
        this.scrollEvent(null, null, null)
        this.bgUser.getComponent("ItemEventRanking").setInfoIsMe(dataIsMe);

        this.setTimeEventSanHeo(timeEventDay);
    },

    onClickToggle(event, data){
        cc.log("check event toggle : ", event.isChecked)
        this.handleData(this.dataEvent, event.isChecked)
        if(event.isChecked){
            this.btnToggle.node.getChildByName("lb").getComponent(cc.Label).string = "Hôm nay";
        }
        else{
            this.btnToggle.node.getChildByName("lb").getComponent(cc.Label).string = "Hôm trước";
        }
    },
    
    setTimeEventSanHeo(timeEventDay){
        if(!timeEventDay) return;
        let start = new Date(Global.EventSanHeo.StartDate);
        let end = new Date(Global.EventSanHeo.EndDate);
        // cc.log("check time sta,mp : ", new Date(Global.EventSanHeo.EndDate).getDate())
       
        let timeOver = Global.formatTimeBySec(timeEventDay);
        this.lbTimeEvent.string = "Diễn ra từ: " + start.getDate() + "/" + (start.getMonth() + 1) + " - " + end.getDate() + "/" + (end.getMonth() + 1) + " Thời gian còn lại: " + timeOver;
        this.unschedule(this.overTime);
        if(timeEventDay <= 0) this.unschedule(this.overTime);
        this.schedule(this.overTime = ()=>{
            timeOver = Global.formatTimeBySec(timeEventDay);
            this.lbTimeEvent.string = "Diễn ra từ: " + start.getDate() + "/" + (start.getMonth() + 1) + " - " + end.getDate() + "/" + (end.getMonth() + 1) + " Thời gian còn lại: " + timeOver
            timeEventDay--;
        },1)
    },

    // handleData(listDataRank, dataIsMe) {
    //     cc.log("check list data", listDataRank)
    //     cc.log("check data isme : ", dataIsMe)
    //     if(Global.EventSanHeo)
    //         this.lbTitle.string = Global.EventSanHeo.Description;
    //     this.dataIsMe = dataIsMe;
    //     // this.dataIsMe.Order = 10;




    //     this.itemIsMe.getComponent("ItemEventRanking").setInfo(dataIsMe.Order, dataIsMe.UserName, dataIsMe.Point)
    //     let size = listDataRank.length > 100 ? 100 : listDataRank.length;
    //     for (let i = 0; i < size; i++) {
    //         this.listDataRank[i] = listDataRank[i];
    //     }
    //     this.totalPage = parseInt(this.listDataRank.length / this.numberRow);

    //     if (this.totalPage == 1)
    //         this.totalPage = 0;
    //     this.SetCurrentPage(0);
    // },

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
        else {
            if (this.totalPage != 0)
                this.nextPageBtn.active = true;
            else
                this.nextPageBtn.active = false;
        }

        let indexPage = currentPage + 1;
        this.lbNumberPage.string = "(" + indexPage + "/" + this.totalPage + ")";

        for (let i = 0; i < this.listItemView.length; i++) {
            if (currentPage * this.numberRow + i < this.listDataRank.length) {
                this.listItemView[i].node.active = true;
                let itemData = this.listDataRank[currentPage * this.numberRow + i];
                this.listItemView[i].setInfo(itemData.Order, itemData.UserName, itemData.Point);
                if(itemData.AccountId === MainPlayerInfo.accountId){
                    this.listItemView[i].node.getChildByName("btnReceived").active = true;
                }
                else{
                    this.listItemView[i].node.getChildByName("btnReceived").active = false;
                }
            } else {
                this.listItemView[i].node.active = false;
            }
        }

        cc.log("check index page min : ", currentPage * this.numberRow)
        cc.log("check index page max: ", currentPage * this.numberRow + this.numberRow)
        cc.log("chcek order id : ", this.dataIsMe.Order)
        // if (currentPage * this.numberRow < this.dataIsMe.Order && this.dataIsMe.Order <= currentPage * this.numberRow + this.numberRow) {
        //     this.itemIsMe.active = false;
        // }
        // else {
        //     this.itemIsMe.active = true;
        // }
    },

    setDataIsMe() {

    },


    hide() {
        Global.onPopOff(this.node);
        this.firstPos = null;
    },

    scrollEvent(number, data, event) {
        if (this.itemTopIsMe) {
            let myPosScoll = this.listTopRank.node.getComponent(cc.ScrollView).getContentPosition();
            let mypos = Global.getPostionInOtherNode(this.itemTopIsMe, this.listTopRank.node.getComponent(cc.ScrollView).content);
            if(!this.firstPos)
                this.firstPos = mypos;
            if (this.firstPos.y < myPosScoll.y + (215) && this.firstPos.y > myPosScoll.y - (215)) {
                this.bgUser.active = false;
            } else {
                this.bgUser.active = true;
            } 
        }
        else{
            this.bgUser.active = true;
        }

        if(this.listTopRank.node.getComponent(cc.ScrollView).getScrollOffset().y === this.listTopRank.node.getComponent(cc.ScrollView).getMaxScrollOffset().y){
            this.bgUser.active = false;
        }
    },

    onClickShowTheLe(){
        Global.onPopOn(this.thele);
    },

    hideTheLe(){
        Global.onPopOff(this.thele);
    },

    // update (dt) {},
});
