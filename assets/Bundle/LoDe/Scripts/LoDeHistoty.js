// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        listItem : cc.ScrollView,
        item : cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Global.LoDeHistory = this;
    },

    start () {

    },

    show(){
        // Global.onPopOn(this.node);
        this.node.active = true;
        let msg = {}
        msg[1] = "";
        require("SendRequest").getIns().MST_Client_LoDe_Get_History_Game(msg)
    },

    handleData(packet){
        Global.UIManager.hideMiniLoading();
        let listData = [];
        for (let i = 0; i < packet.length; i++) {
            const objData = JSON.parse(packet[i]);
            listData.push(objData);
        }
        this.listItem.content.removeAllChildren();
        for (let i = 0; i < listData.length; i++) {
            const objData = listData[i];
            let item = null;
            if (i < this.listItem.content.children.length) {
                item = this.listItem.content.children[i];
            }
            else {
                item = cc.instantiate(this.item);
            }
            item.getComponent("ItemLodeHistory").init(objData)
            this.listItem.content.addChild(item);
        }
    },

    hide(){
        // Global.onPopOff(this.node);
        this.node.active = false;
    },

    // update (dt) {},
});
