cc.Class({
    extends: cc.Component,

    properties: {
        listView: require("BaseScrollView"),
        itemView: cc.Node,
        nodeMain: cc.Node,
        nodeDetail: cc.Node,

        //info detaile
        lbSession: cc.Label,
        lbTime :cc.Label,
        lbChipWin : cc.Label,
        lbTotalBet : cc.Label,
        lbSurplus : cc.Label,

        listItemBet : cc.Node,
        itemBet : cc.Node,
        listSpriteItem : [cc.SpriteFrame],

        itemResult : cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Global.HistoryXocDia = this;
        this.nodeMain.active = true;
        this.nodeDetail.active = false;
    },

    start() {

    },

    show() {
        Global.onPopOn(this.node);
        this.listView.resetScr();
    },

    hide() {
        Global.onPopOff(this.node);
    },

    handleData(listDataHistory) {
        let listDataHandle = [];
        for (let i = 0; i < listDataHistory.length; i++) {
            const objData = JSON.parse(listDataHistory[i]);
            listDataHandle.push(objData);
        }
        this.listView.init(listDataHandle, listDataHandle.length * 180, 180);
    },

    handleDataDetails(listDataDetail) {
        for (let i = 0; i < listDataDetail.length; i++) {
            listDataDetail[i] = JSON.parse(listDataDetail[i]);
        }
        cc.log("cehck deadaosifiowejd : ", listDataDetail)
        let chipWin = 0;
        let totalBet = 0;
        let locationResult = null;
        this.listItemBet.removeAllChildren();
        for (let i = 0; i < listDataDetail.length; i++) {
            const objData = listDataDetail[i];
            this.lbSession.string = "#" + objData.SessionId;
            this.lbTime.string = Global.generateDate(objData.CreatedAt);
            this.lbSurplus.string = Global.formatNumber(objData.AccountBalance);
            locationResult = objData.LocationResult;
            chipWin += objData.Prize;
            totalBet += objData.BetMoney;

            let item = null;
            if (i < this.listItemBet.children.length) {
                item = this.listItemBet.children[i];
            }
            else {
                item =  cc.instantiate(this.itemBet);
            }
            this.listItemBet.addChild(item);
            item.getChildByName("lbChipbet").getComponent(cc.Label).string = Global.formatNumber(objData.BetMoney);  
            this.generateResult(objData.LocationId, item)
        }
        this.lbChipWin.string = Global.formatNumber(chipWin);
        this.lbTotalBet.string = Global.formatNumber(totalBet);
        if(locationResult){
            cc.log("checl location result : ", locationResult)
            this.generateResult(locationResult ,this.itemResult)
        }
    },

    generateResult(typeResult, parentItem) {
        cc.log("check typr re : ", typeResult)
        parentItem.getChildByName("lbGate").active = false;
        parentItem.getChildByName("listResult").active = true;
        switch (typeResult) {
            case 1:
                parentItem.getChildByName("lbGate").active = true;
                parentItem.getChildByName("listResult").active = false;
                parentItem.getChildByName("lbGate").getComponent(cc.Label).string = "Chẵn";
                break;
            case 2:
                parentItem.getChildByName("lbGate").active = true;
                parentItem.getChildByName("listResult").active = false;
                parentItem.getChildByName("lbGate").getComponent(cc.Label).string = "lẻ";
                break;
            case 3:
                parentItem.getChildByName("listResult").getChildByName("it1").getComponent(cc.Sprite).spriteFrame = this.listSpriteItem[0];
                parentItem.getChildByName("listResult").getChildByName("it2").getComponent(cc.Sprite).spriteFrame = this.listSpriteItem[0];
                parentItem.getChildByName("listResult").getChildByName("it3").getComponent(cc.Sprite).spriteFrame = this.listSpriteItem[1];
                parentItem.getChildByName("listResult").getChildByName("it4").getComponent(cc.Sprite).spriteFrame = this.listSpriteItem[1];
                break;
            case 4:
                parentItem.getChildByName("listResult").getChildByName("it1").getComponent(cc.Sprite).spriteFrame = this.listSpriteItem[1];
                parentItem.getChildByName("listResult").getChildByName("it2").getComponent(cc.Sprite).spriteFrame = this.listSpriteItem[1];
                parentItem.getChildByName("listResult").getChildByName("it3").getComponent(cc.Sprite).spriteFrame = this.listSpriteItem[1];
                parentItem.getChildByName("listResult").getChildByName("it4").getComponent(cc.Sprite).spriteFrame = this.listSpriteItem[0];
                break;
            case 5:
                parentItem.getChildByName("listResult").getChildByName("it1").getComponent(cc.Sprite).spriteFrame = this.listSpriteItem[1];
                parentItem.getChildByName("listResult").getChildByName("it2").getComponent(cc.Sprite).spriteFrame = this.listSpriteItem[0];
                parentItem.getChildByName("listResult").getChildByName("it3").getComponent(cc.Sprite).spriteFrame = this.listSpriteItem[0];
                parentItem.getChildByName("listResult").getChildByName("it4").getComponent(cc.Sprite).spriteFrame = this.listSpriteItem[0];
                break;
            case 6:
                parentItem.getChildByName("listResult").getChildByName("it1").getComponent(cc.Sprite).spriteFrame = this.listSpriteItem[1];
                parentItem.getChildByName("listResult").getChildByName("it2").getComponent(cc.Sprite).spriteFrame = this.listSpriteItem[1];
                parentItem.getChildByName("listResult").getChildByName("it3").getComponent(cc.Sprite).spriteFrame = this.listSpriteItem[1];
                parentItem.getChildByName("listResult").getChildByName("it4").getComponent(cc.Sprite).spriteFrame = this.listSpriteItem[1];
                break;
            case 7:
                parentItem.getChildByName("listResult").getChildByName("it1").getComponent(cc.Sprite).spriteFrame = this.listSpriteItem[0];
                parentItem.getChildByName("listResult").getChildByName("it2").getComponent(cc.Sprite).spriteFrame = this.listSpriteItem[0];
                parentItem.getChildByName("listResult").getChildByName("it3").getComponent(cc.Sprite).spriteFrame = this.listSpriteItem[0];
                parentItem.getChildByName("listResult").getChildByName("it4").getComponent(cc.Sprite).spriteFrame = this.listSpriteItem[0];
                break;
        }
    },

    onClickCloseDetail() {
        this.nodeMain.active = true;
        this.nodeDetail.active = false;
    },

    onDestroy() {
        Global.HistoryXocDia = this;
    },

    // update (dt) {},
});
