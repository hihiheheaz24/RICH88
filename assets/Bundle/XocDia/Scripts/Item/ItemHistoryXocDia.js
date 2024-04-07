cc.Class({
    extends: cc.Component,

    properties: {
       lbSession :cc.Label,
       lbChipWin : cc.Label,
       lbChipbet : cc.Label,
       lbChipUser : cc.Label,
       lbStatus : cc.Label,
       lbTime : cc.Label,

       nodeMain : cc.Node,
       nodeDetail : cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    initItem(dataItem){
        cc.log("checlk dfta ifsdifosmfed ", dataItem)
        this.lbSession.string = "#" + dataItem.SessionId;     
        this.lbChipWin.string = Global.formatNumber(dataItem.Prize);
        this.lbChipbet.string = Global.formatMoneyChip(dataItem.BetMoney);
        this.lbChipUser.string = Global.formatMoneyChip(dataItem.AccountBalance);
        if(dataItem.SessionId === Global.XocDia.sessionId){
            this.lbStatus.string = "Đang tiến hành";
            this.lbStatus.node.color = cc.Color.YELLOW;
        }
        else{
            this.lbStatus.string = dataItem.Prize > 0 ? "* Thắng" : "* Thua";
            this.lbStatus.node.color = dataItem.Prize > 0 ? cc.Color.GREEN : cc.Color.RED;
        }
       
       
        this.lbTime.string = Global.formatDate(dataItem.CreatedAt);
    },

    onClickDetailSession(){
        let msg = {}
        msg[1] = this.lbSession.string.replace("#", "");
        require("SendRequest").getIns().MST_Client_Xoc_Dia_Get_Detail_Session_Info(msg);
        Global.HistoryXocDia.nodeMain.active = false;
        Global.HistoryXocDia.nodeDetail.active = true;
    },

    // update (dt) {},
});
