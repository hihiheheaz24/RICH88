cc.Class({
    extends: cc.Component,

    properties: {
        nodeConfigVip : cc.Node,
        nodeReward : cc.Node,
        nodeGuide : cc.Node,
        listIconVip : [cc.SpriteFrame],
        // Config Vip
        iconVip : cc.Sprite,
        lbLevelVip : cc.Label,
        lbPointVip : cc.Label,
        lbRankUp : cc.Label,
        lbTopUpPromotion : cc.Label,
        listBtnInfoVip : [cc.Button],
        vipLevelFillRange : cc.Sprite,
        // Reward vip
        edbInputVipPoint : cc.EditBox,
        listItemReceive : cc.ScrollView,
        itemReceive : cc.Node,
        lbPercentExchange : cc.Label,
        lbReceiveExchange : cc.Label,
        edbInputVipPoint : cc.EditBox
        // Guide

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.listPromotion = [];
        this.listPercent = [0, 100, 200, 300, 400, 500, 600, 700, 800, 1000];

        for (let i = 0; i < this.listBtnInfoVip.length; i++) {
            const btn = this.listBtnInfoVip[i];
            btn.node.on(cc.Node.EventType.MOUSE_ENTER, function(event) {
                // Xử lý khi chuột di chuyển vào node
                console.log("Mouse enter node");
                btn.node.getChildByName("noti").active = true;
            });
            
            // Lắng nghe sự kiện hover khi di chuột ra khỏi node
            btn.node.on(cc.Node.EventType.MOUSE_LEAVE, function(event) {
                // Xử lý khi chuột di chuyển ra khỏi node
                console.log("Mouse leave node");
                btn.node.getChildByName("noti").active = false;
            });

            btn.node.on(cc.Node.EventType.TOUCH_START, function(event) {
                // Xử lý khi người dùng chạm vào node
                console.log("Touch start on node");
                btn.node.getChildByName("noti").active = true;
            });
            
            // Lắng nghe sự kiện touchend khi người dùng kết thúc việc chạm vào node
            btn.node.on(cc.Node.EventType.TOUCH_END, function(event) {
                // Xử lý khi người dùng kết thúc việc chạm vào node
                console.log("Touch end on node");
                btn.node.getChildByName("noti").active = false;
            });
            
            // Lắng nghe sự kiện touchcancel khi một cuộc gọi API cảm ứng hủy bỏ sự kiện cảm ứng
            btn.node.on(cc.Node.EventType.TOUCH_CANCEL, function(event) {
                // Xử lý khi sự kiện cảm ứng được hủy bỏ
                console.log("Touch cancel on node");
                btn.node.getChildByName("noti").active = false;
            });
        }
    },

    start () {

    },

    show(){
        Global.onPopOn(this.node);
        Global.UIManager.showMask();
        this.setViewConfig();
    },

    hide(){
        Global.onPopOff(this.node);
        Global.UIManager.hideMask();
    },

    onClickChooseType(event, data){
        if(data == "vip"){
            this.nodeConfigVip.active = true;
            this.nodeReward.active = false;
            this.nodeGuide.active = false;
            this.setViewConfig();
        }
        else if(data == "reward"){
            this.nodeConfigVip.active = false;
            this.nodeReward.active = true;
            this.nodeGuide.active = false;
            this.handleListReceive();
        }
        else if(data == "guide"){
            this.nodeConfigVip.active = false;
            this.nodeReward.active = false;
            this.nodeGuide.active = true;
        }
    },

    setViewConfig(){

        let index = 0;
        index = MainPlayerInfo.vipLevel - 1;
        if(index <= 0) index = 0;
        this.vipLevelFillRange.fillRange = index / 8;

        this.listPromotion = [];
        if(Global.ConfigVipPoint){
            cc.log("check config vip point : ", Global.ConfigVipPoint);      
            for (let i = 0; i < Global.ConfigVipPoint[1].length; i++) {
                const obj = JSON.parse(Global.ConfigVipPoint[1][i]);
                this.listPromotion.push(obj);
            }
            cc.log("check list promotion : ", this.listPromotion)
        }

        for (let i = 0; i < this.listBtnInfoVip.length; i++) {
            const btn = this.listBtnInfoVip[i];
            if(this.listPromotion[i] && this.listPromotion[i].Description)
                btn.node.getChildByName("noti").getChildByName("lbInfo").getComponent(cc.Label).string = this.listPromotion[i].Description.replace(/^-/gm, '');
        }

        if(MainPlayerInfo.vipLevel === 0){
            this.iconVip.spriteFrame = this.listIconVip[MainPlayerInfo.vipLevel];
            this.lbTopUpPromotion.string = "0%"
        }
        else{
            this.iconVip.spriteFrame = this.listIconVip[MainPlayerInfo.vipLevel];
            cc.log("check promotion la : ",  this.listPromotion[MainPlayerInfo.vipLevel - 1].RatePromotion)
            this.lbTopUpPromotion.string =  this.listPromotion[MainPlayerInfo.vipLevel - 1].RatePromotion + "%"
        }

        

        this.lbPointVip.string = MainPlayerInfo.vipPoint;
        this.lbLevelVip.string = MainPlayerInfo.vipLevel;
        if(this.listPromotion[MainPlayerInfo.vipLevel])
            this.lbRankUp.string = this.listPromotion[MainPlayerInfo.vipLevel].RequirePoint;
        
    },

    handleListReceive(){
        if(!Global.ConfigVipPoint) return;

        this.lbPercentExchange.string = "VIP " + MainPlayerInfo.vipLevel + " x" + this.listPercent[MainPlayerInfo.vipLevel];

        let listReceive = this.listPromotion;
        cc.log("check list item la : ", Global.ConfigVipPoint[3]);

        this.listItemReceive.content.destroyAllChildren();
        for (let i = 0; i < listReceive.length; i++) {
            const obj = listReceive[i];
            if(obj.RewardsList.length === 0) continue;
            let item = cc.instantiate(this.itemReceive).getComponent("ItemVipPointReceive");

            obj.Rewards = obj.RewardsList[0].Amount;

            this.listItemReceive.content.addChild(item.node);
            item.initItem(obj);
            item.node.active = true;
            item.node.idVip = obj.VipId;    
        }

        for (let i = 0; i < Global.ConfigVipPoint[3].length; i++) {
            const obj = JSON.parse(Global.ConfigVipPoint[3][i]);
            for (let j = 0; j < this.listItemReceive.content.children.length; j++) {
                const itemVip = this.listItemReceive.content.children[j];
                if(obj.VipLevel === itemVip.idVip){
                    if(!obj.IsReceived){
                        itemVip.getChildByName("btnReceive").getComponent(cc.Button).interactable = true;
                    }
                    else{
                        itemVip.getChildByName("btnReceive").active = false;
                    }
                    continue;
                }
            }
        }

    },

    edbChange(editBoxString, text){
        cc.log("check text la : ", text)

         cc.log("cehck edb : ", editBoxString)
        let strTemp = "";
        for (let i = 0; i < editBoxString.length; i++) {
            if (editBoxString.charAt(i) >= 0 && editBoxString.charAt(i) <= 9) {
                strTemp += editBoxString.charAt(i)
            }
        }
        if (strTemp == "") return;
        this.moneyTotal = parseInt(strTemp);
        if(this.moneyTotal < 0) this.moneyTotal = "";
        
        if (this.moneyTotal > MainPlayerInfo.ingameBalance) 
            this.moneyTotal = MainPlayerInfo.ingameBalance;
        if( MainPlayerInfo.ingameBalance === 0)
            this.moneyTotal = "";
        this.edbInputVipPoint.string =  Global.formatNumber(editBoxString.replace(/\./g, "")) ;
        this.lbReceiveExchange.string =  Global.formatNumber(editBoxString.replace(/\./g, "") * this.listPercent[MainPlayerInfo.vipLevel]);
        this.edbInputVipPoint.focus()
    },

    onClickShowInfoVipLevel(){

    },

    onClickSendExchangeVipPoint(){
        let point = parseInt(this.edbInputVipPoint.string.replace(/\./g, ""));
        let msg = {}
        msg[1] = point;
        require("SendRequest").getIns().MST_Client_Exchange_Vip_Point(msg);

    },

    // update (dt) {},
});
