cc.Class({
    extends: cc.Component,

    properties: {
        scrTai: require("BaseScrollView"),
        scrXiu: require("BaseScrollView"),
        listSpDice: [cc.SpriteFrame],
        _currentIndexInList: 0,
        _currentGameSesionId: 0,
        _countReviceData: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        Global.ChiTietPhienTaiXiu = this;
        
    },
    show(){
        this.node.active= true;
        this.scrTai.resetScr();
        this.scrXiu.resetScr();
        let gameSS = Global.TaiXiu._curentGameSesionCau;
        let msg = {};
        msg[1] = gameSS;
        //this.setInfo(Global.TaiXiu._listHistory[0]);
        cc.log("check game sesion : ", gameSS)
        require("SendRequest").getIns().MST_Client_TaiXiu_Get_Transaction_Detail(msg);
        actionEffectOpen(this.node);
        Global.UIManager.hideMiniLoading();
    },
    setInfo(obj) {
        if(!obj) return;
        cc.log("check obj la : ", obj)
        this._currentGameSesionId = obj.GameSessionID;
        cc.log("cehck dcmdmcm : ",  cc.find("Scale/xx1",this.node))
        cc.log("cehck dcmdmcm : ",  obj)
        cc.find("Scale/xx1",this.node).getComponent(cc.Sprite).spriteFrame = this.listSpDice[obj.Dice1 - 1];
        cc.find("Scale/xx2",this.node).getComponent(cc.Sprite).spriteFrame = this.listSpDice[obj.Dice2 - 1];
        cc.find("Scale/xx3",this.node).getComponent(cc.Sprite).spriteFrame = this.listSpDice[obj.Dice3 - 1];
        cc.find("Scale/lbPhien",this.node).getComponent(cc.RichText).string = "Phiên <color =#EAA705 >#%n </c>".replace("%n", obj.GameSessionID);
        cc.find("Scale/result",this.node).getComponent(cc.Label).string = obj.DiceSum;

        let nodeTai = cc.find("Scale/txt_Tai",this.node);
        let nodeXiu = cc.find("Scale/txt_Xiu",this.node);
        nodeXiu.stopAllActions();
        nodeXiu.scale = 1;
        nodeTai.stopAllActions();
        nodeTai.scale = 1;
    },

    responseServer(packet) {

        let length = packet.length;
        let listTai = [];
        let listXiu = [];
        let sumDatTai = 0;
        let sumTraTai = 0;
        let sumDatXiu = 0;
        let sumTraXiu = 0;

        if (length < 1 && this._countReviceData < 4) {
            this.unscheduleAllCallbacks();
            this._countReviceData++
            this.scheduleOnce(() => {
                let msg = {};
                msg[1] = this._currentGameSesionId;
                require("SendRequest").getIns().MST_Client_TaiXiu_Get_Transaction_Detail(msg);
            }, 5);
        } else {
            this._countReviceData = 0;
        }

        for (let i = 0; i < length; i++) {
            let item = JSON.parse(packet[i]);
            if (item.LocationID == 1) {
                listXiu.push(item);
                sumDatXiu += item.BetValue;
                sumTraXiu += item.RefundValue;
            } else {
                listTai.push(item);
                sumDatTai += item.BetValue;
                sumTraTai += item.RefundValue;
            }
        }
        if (listTai.length > 0) {
            this.scrTai.node.active = true;
            this.scrTai.init(listTai, listTai.length * 35, 35);

        }
        if (listXiu.length > 0) {
            this.scrXiu.node.active = true;
            this.scrXiu.init(listXiu, listXiu.length * 35, 35);
        }

        cc.find("Scale/Bot/sumDatTai", this.node).getComponent(cc.Label).string = Global.formatMoney(sumDatTai);
        cc.find("Scale/Bot/sumTraTai", this.node).getComponent(cc.Label).string = Global.formatMoney(sumTraTai);
        cc.find("Scale/Bot/sumDatXiu", this.node).getComponent(cc.Label).string = Global.formatMoney(sumDatXiu);
        cc.find("Scale/Bot/sumTraXiu", this.node).getComponent(cc.Label).string = Global.formatMoney(sumTraXiu);
    },

    onClickClose() {
        Global.UIManager.hideMask();
        actionEffectClose(this.node , ()=>{
            this.node.active = false;
        })
    },

    onDestroy() {
        Global.ChiTietPhienTaiXiu = null;
    },
    onClick(event, data) {

        switch (data) {
            case "0":
                this._currentIndexInList++;
                let obj = Global.TaiXiu._listHistory[this._currentIndexInList];
                this.setInfo(obj);
                this.unscheduleAllCallbacks();
                this.scheduleOnce(() => {
                    this.scrTai.resetScr()
                    this.scrXiu.resetScr()
                    let msg = {}
                    msg[1] = obj.GameSessionID;
                    require("SendRequest").getIns().MST_Client_TaiXiu_Get_Transaction_Detail(msg);
                }, 0.5)

                break;
            case "1":
                if (this._currentIndexInList > 0) {
                    this._currentIndexInList--;
                    let obj = Global.TaiXiu._listHistory[this._currentIndexInList];
                    this.setInfo(obj);
                    this.unscheduleAllCallbacks();
                    this.scheduleOnce(() => {
                        this.scrTai.resetScr();
                        this.scrXiu.resetScr();
                        let msg = {}
                        msg[1] = obj.GameSessionID;
                        require("SendRequest").getIns().MST_Client_TaiXiu_Get_Transaction_Detail(msg);
                    }, 0.5)
                } else {
                    if (this._currentGameSesionId >= Global.TaiXiu._listHistory[0].GameSessionID) {
                        return;
                    } else {
                        let obj = Global.TaiXiu._listHistory[0];
                        this.setInfo(obj);
                        this.unscheduleAllCallbacks();
                        this.scheduleOnce(() => {
                            this.scrTai.node.active = false;
                            this.scrXiu.node.active = false;
                            let msg = {}
                            msg[1] = obj.GameSessionID;
                            require("SendRequest").getIns().MST_Client_TaiXiu_Get_Transaction_Detail(msg);
                        }, 0.5)
                    }
                }
                break;
        }
    },


    // update (dt) {},
});
