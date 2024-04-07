
cc.Class({
    extends: cc.Component,

    properties: {
        lbTime:cc.Label,
        lbName:cc.Label,
        lbMoney:cc.Label,
        lbReturn:cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    initItem(info){
        // if(this.itemID % 2 ==0){
        //     this.node.children[0].active =false;
        // }else{  
        //     this.node.children[0].active =true;
        // }
        let date = new Date(info.CreatedTime);
        let lbHour= date.getHours();
        let lbMinute= date.getMinutes();
        let lbSeccond= date.getSeconds();
        let timeReturn= +lbHour+":"+lbMinute+":"+lbSeccond; 
        this.lbTime.string = timeReturn;
        this.lbName.string = info.Nickname;
        this.lbMoney.string = Global.formatNumber(info.BetValue) ;
        this.lbReturn.string = Global.formatNumber(info.RefundValue) ;
    }

    // update (dt) {},
});
