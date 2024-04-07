// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        lbTime:cc.Label,
        lbPhien:cc.Label,
        cuadat:cc.Label,
        ketQua:cc.Label,
        saoDat:cc.Label,
        saoHoan:cc.Label,
        thucNhan:cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    initItem(info){
        // if(this.itemID == 0){
        //     this.node.children[0].active = false;
        // }else{
        //     this.node.children[0].active = true;
        // }
       let date = new Date(info.CreatedAt);
       let lbDate=date.getDate();
        if(lbDate < 10) lbDate = "0" + lbDate;
        let lbMonth= date.getMonth() + 1 ;
        if(lbMonth < 10) lbMonth = "0" + lbMonth;
        let lbHour= date.getHours();
        if(lbHour < 10) lbHour = "0" + lbHour;
        let lbMinute= date.getMinutes();
        if(lbMinute < 10) lbMinute = "0" + lbMinute;
        let lbSeccond= date.getSeconds();
        if(lbSeccond < 10) lbSeccond = "0" + lbSeccond;
        let timeReturn= lbDate+"/"+lbMonth+" "+lbHour+":"+lbMinute+":"+lbSeccond;
       

        this.lbTime.string = timeReturn;
       this.lbPhien.string = info.TurnId;
       this.cuadat.string = info.BetLocation == 1 ? "Xỉu" : "Tài";
       this.ketQua.string = info.Result
       this.saoDat.string = Global.formatNumber(info.TotalBet) ;
       this.saoHoan.string = Global.formatNumber (info.Refund);
       this.thucNhan.string = Global.formatNumber(info.Prize);
    }

    // update (dt) {},
});
