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
        // Guide

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
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
        if(MainPlayerInfo.vipLevel === 0){
            this.iconVip.spriteFrame = this.listIconVip[MainPlayerInfo.vipLevel];
            this.lbTopUpPromotion.string = "0%"
        }
        else{
            this.iconVip.spriteFrame = this.listIconVip[MainPlayerInfo.vipLevel];

            let text = listPromotion[MainPlayerInfo.vipLevel - 1].Description;
            // Sử dụng biểu thức chính quy để tìm số trước %
            let regex = /(\d+)%/;
            let match = text.match(regex);
    
            if (match) {
                let percent = match[1];
                console.log(percent);
                this.lbTopUpPromotion.string = percent + "%";
            } else {
                console.log("Không có khuyến mãi nạp thẻ");
                this.lbTopUpPromotion.string = "0%"
            }
        }

        let index = 0;
        index = MainPlayerInfo.vipLevel - 1;
        if(index <= 0) index = 0;
        this.vipLevelFillRange.fillRange = index / 8;

        let listPromotion = [];
        if(Global.ConfigVipPoint){
            cc.log("check config vip point : ", Global.ConfigVipPoint);      
            for (let i = 0; i < Global.ConfigVipPoint[1].length; i++) {
                const obj = JSON.parse(Global.ConfigVipPoint[1][i]);
                listPromotion.push(obj);
            }
            cc.log("check list promotion : ", listPromotion[0].Description)
        }

        for (let i = 0; i < this.listBtnInfoVip.length; i++) {
            const btn = this.listBtnInfoVip[i];
            if(listPromotion[i] && listPromotion[i].Description)
                btn.node.getChildByName("noti").getChildByName("lbInfo").getComponent(cc.Label).string = listPromotion[i].Description.replace(/^-/gm, '');
        }
       

        this.lbPointVip.string = MainPlayerInfo.vipPoint;
        this.lbLevelVip.string = MainPlayerInfo.vipLevel;
        this.lbRankUp.string = "0";
        
    },

    handleListReceive(){
        if(!Global.ConfigVipPoint) return;
        let listReceive = Global.ConfigVipPoint[3];
        cc.log("check list item la : ", listReceive);

        this.listItemReceive.content.destroyAllChildren();
        for (let i = 0; i < listReceive.length; i++) {
            const obj = listReceive[i];
            let item = cc.instantiate(this.itemReceive).getComponent("ItemVipPointReceive");
            item.initItem(obj);
            item.node.active = true;
            this.listItemReceive.content.addChild(item.node);
        }
    },

    onClickShowInfoVipLevel(){

    },

    onClickSendExchangeVipPoint(){
        let point = parseInt(this.edbInputVipPoint.string);
        let msg = {}
        msg[1] = point
        require("SendRequest").getIns().MST_Client_Exchange_Vip_Point(msg);

    },

    // update (dt) {},
});
