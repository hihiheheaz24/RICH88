cc.Class({
    extends: cc.Component,
    ctor() {
        this.listItem = [];
        this.isShowTime = false;
    },

    properties: {
        title: cc.Label,
        lbAg : cc.Label,
        bgItem : cc.Sprite,
        listSprBgItem : [cc.SpriteFrame],
        listSprItem : [cc.SpriteFrame],
        lbShowtime : cc.Label,

    },

    update(dt) {
        if(!this.isShowTime) return;
        if (Global.NetworkManager.GetTimeRemain() < 0) {
            this.lbShowtime.string = "00:00";
        } else if(this.isShowTime) {
            this.lbShowtime.node.active = true;
            this.lbShowtime.string = this.FormatTimeRemain(Global.NetworkManager.GetTimeRemain());
        }
        else{
            this.lbShowtime.node.active = true;
        }
    },
    FormatTimeRemain(timeRemain) {
        let minute = parseInt(timeRemain / 60);
        let second = parseInt(timeRemain % 60);
        let strMinute = "";
        let strSecond = "";
        if (minute < 10)
            strMinute = "0" + minute;
        else
            strMinute = minute.toString();
        if (second < 10)
            strSecond = "0" + second;
        else
            strSecond = second.toString();
        return strMinute + ":" + strSecond;
    },

    init(data, isOnline, index) {
        // SET TITLE ITEM
        cc.log("check index inline " ,Global.indexOnlineReward)
        let material =  cc.Material.getBuiltinMaterial("2d-gray-sprite");
        if (!isOnline){
            // this.title.fontSize = 27;
            // this.title.string = Global.formatString(MyLocalization.GetText("TITLE_DAILY_BONUS"), [data.Time]);
        }        
        else {
            cc.log("check time nline : ", data.Time)
            let hour = parseInt(data.Time / 60);
            let minute = parseInt(data.Time % 60);
            this.title.string = "ONLINE " + data.Time + " PHÚT"  //Global.formatString("{0}:{1}:00", [this.formatNumber(hour), this.formatNumber(minute)]);
            this.title.fontSize = 19;
        }
        // SET STATUS RECEIVED
        if (!isOnline) {
            if (data.Time - 1 <= Global.indexDailyReward) {
                this.bgItem.spriteFrame = this.listSprBgItem[0];
                this.lbAg.setMaterial(0 , material);
                this.bgItem.setMaterial(0 , material);
            }
            else {
                this.bgItem.spriteFrame = this.listSprBgItem[1];
            }
        }
        else{
            if (index < Global.indexOnlineReward + 1) {
                this.bgItem.spriteFrame = this.listSprBgItem[0];
                this.lbAg.setMaterial(0 , material);
            }else if(index === Global.indexOnlineReward + 1){
                this.isShowTime = true;
                this.bgItem.spriteFrame = this.listSprBgItem[2];
            }
            else {
                this.bgItem.spriteFrame = this.listSprBgItem[1];
            }
        }
        //SET AMOUS ITEM
        for (let i = 0; i < data.RewardList.length; i++) {
            const dataItem = data.RewardList[i];
            if (dataItem.ItemType !== 0) continue;
            this.lbAg.string = Global.formatNumber(dataItem.Amount);
        }

    },

    formatNumber(numb) {
        if (numb < 10)
            return "0" + numb;
        return numb.toString();
    },
});
