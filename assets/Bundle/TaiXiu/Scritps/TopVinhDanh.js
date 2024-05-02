cc.Class({
    extends: cc.Component,

    properties: {
        scrView: cc.ScrollView,
        itemXepHang: cc.Node,
        toggleDuDay : cc.Toggle,
        toggleTop : cc.Toggle
    },

    onLoad() {
        Global.TopVinhDanh = this;
    },
    show(isCheckShowTab) {
        cc.log("check show tab : " + isCheckShowTab)
        // if(isCheckShowTab == "1"){
        //     this.toggleTop.isChecked = true;
        //     // this.toggleDuDay.isChecked = false;
        // }
        // else if(isCheckShowTab == "2"){
        //     this.toggleDuDay.isChecked = true;
        //     // this.toggleTop.isChecked = false;
        //     cc.log("chay vao 222222")
        // }
        this.node.active = true;
        require("SendRequest").getIns().MST_Client_TaiXiu_Get_Top_Daily_Winner();
        actionEffectOpen(this.node);
    },
    onClickClose() {
        // Global.UIManager.hideMask();
        actionEffectClose(this.node , ()=>{
            this.node.active = false;
        })
    },

    responseServer(packet) {
        Global.UIManager.hideMiniLoading();
        let length = packet.length;
        let contetn = this.scrView.content;
        for (let i = 0; i < length; i++) {
            let node = contetn.children[i];
            if(node == null){
                node = cc.instantiate(this.itemXepHang);
                contetn.addChild(node);
            }
            let item = node.getComponent("ItemXepHangTaiXiu");
            node.active = true;
            item.initItem(JSON.parse(packet[i]), i + 1);
        }
    },

    onDestroy() {
        Global.TopVinhDanh = null;
    }
    // update (dt) {},
});
