// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        scrView: cc.ScrollView,
        itemXepHang: cc.Node,
        nodeToggle : cc.Node,
        // lbTitleChain : cc.Label,
        lbTime : cc.Label
        // toggle : cc.Toggle
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Global.TopDuDay = this;
        this.data = null;
        this.dataWin = [];
        this.dataLose = [];
        this.isWin = true;
        this.dataRank = null;
        // this.lbTitleChain.string = "DÂY THẮNG";

        // Lấy thời điểm hiện tại
        this.ngayHienTai = new Date();       
        this.lbTime.string = this.generateDate(this.ngayHienTai);

        this.ngayHomTruoc = new Date();
        this.ngayHomSau = new Date();

        this.indexTime = 0;
        
        this.isSendGetTopDuDay = false;

    },

    show(){
        Global.UIManager.hideMiniLoading();
        Global.onPopOn(this.node);
        this.isSendGetTopDuDay = true;
        let msg = {}
        msg[1] = "";
        cc.log("send get du day top : ",msg);
        require("SendRequest").getIns().MST_Client_TaiXiu_Get_Top_Win_Lose_Chain(msg);
    },

    // onEnable(){
    //     Global.UIManager.hideMiniLoading();
    //     this.data = Global.TaiXiu.dataRankDuDay;
    //     // Global.onPopOn(this.node);
    //     this.hanldeDataDuDay();
    //     this.nodeToggle.active = false;
    // },

    onClickToggle(){
        this.nodeToggle.active = !this.nodeToggle.active
    },

    hanldeDataDuDay(){
        this.isSendGetTopDuDay = false;
        this.data = Global.TaiXiu.dataRankDuDay;
        Global.UIManager.hideMiniLoading();
        if(!this.data) return;
        this.dataWin = [];
        this.dataLose= [];
        for (let i = 0; i < this.data.length; i++) {
            const objData = this.data[i];
            if(objData.IsWin) this.dataWin.push(objData)
            else this.dataLose.push(objData);
        }

        if(this.isWin){
            this.dataRank = this.dataWin;
            // this.lbTitleChain.string = "DÂY THẮNG";
        }
        else{
            this.dataRank = this.dataLose;
            // this.lbTitleChain.string = "DÂY THUA";
        }
        this.scrView.content.removeAllChildren();
        for (let i = 0; i < this.dataRank.length; i++) {
            const objData = this.dataRank[i];
            let item = null;
            if (i < this.scrView.content.children.length) {
                item = this.scrView.content.children[i];
            }
            else {
                item = cc.instantiate(this.itemXepHang);
            }

            let itemScripts = item.getComponent("ItemXepHangDuDay");
            item.active = true;
            itemScripts.initItem(objData, i + 1);
            this.scrView.content.addChild(item);
        }

    },

    hide(){
        Global.onPopOff(this.node);
    },

    onClickTabWin(){
        this.isWin = true;
        this.hanldeDataDuDay()
        // this.nodeToggle.active = false;
        // this.toggle.isChecked = false;
    },

    onClickTabLose(){
        this.isWin = false;
        this.hanldeDataDuDay();
        // this.nodeToggle.active = false;
        // this.toggle.isChecked = false;
    },

    onClickPreviousDay(){
        this.isSendGetTopDuDay = true;
        Global.UIManager.showMiniLoading();
        this.ngayHomTruoc.setDate(this.ngayHienTai.getDate() - 1);
        this.ngayHienTai.setDate(this.ngayHomTruoc.getDate())
        this.lbTime.string = this.generateDate(this.ngayHomTruoc);
        let msg = {}
        msg[1] =  this.generateDate(this.ngayHomTruoc);
        cc.log("send get du day top : ",msg);
        require("SendRequest").getIns().MST_Client_TaiXiu_Get_Top_Win_Lose_Chain(msg);
    },

    onClickNextDay(){
       
        let checkDate = new Date();
        cc.log("check ngay select   : ", this.ngayHienTai.getDate())
        cc.log("check ngay hienm tai  : ", checkDate.getDate())
        if (this.ngayHienTai.getDate() + 1 === checkDate.getDate()) {
            Global.UIManager.showMiniLoading();
            this.isSendGetTopDuDay = true;
            let msg = {}
            msg[1] = "";
            cc.log("send get du day top : ",msg);
            this.ngayHienTai.setDate(this.ngayHomSau.getDate() + 1)
            this.lbTime.string = this.generateDate(checkDate);
            require("SendRequest").getIns().MST_Client_TaiXiu_Get_Top_Win_Lose_Chain(msg);
            return;
        }
        else if(this.ngayHienTai.getDate() + 1 < checkDate.getDate()){
            Global.UIManager.showMiniLoading();
            this.isSendGetTopDuDay = true;
            this.ngayHomSau.setDate(this.ngayHienTai.getDate() + 1);
            this.ngayHienTai.setDate(this.ngayHomSau.getDate())
            this.lbTime.string = this.generateDate(this.ngayHomSau);
            let msg = {}
            msg[1] = this.generateDate(this.ngayHomSau);
            cc.log("send get du day top : ",msg);
            require("SendRequest").getIns().MST_Client_TaiXiu_Get_Top_Win_Lose_Chain(msg);
        }

    },

    start () {

    },

    generateDate(data) {
        let date = new Date(data);
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        if (day < 10) {
            day = "0" + day;
        }
        if (month < 10) {
            month = "0" + month;
        }
        //2024-02-06
        return year + "-" + month + "-" + day;
    },

    onDestroy(){
        Global.TopDuDay = null;
    },

    // update (dt) {},
});
