cc.Class({
    extends: cc.Component,

    properties: {
       listPlayer : cc.ScrollView,
       itemPlayer : cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    show(){
        Global.onPopOn(this.node)
    },

    handleDataPlayer(listDataPlayer){
        listDataPlayer = listDataPlayer.slice(3);
        cc.log("check data player la : ", listDataPlayer);
        this.listPlayer.content.removeAllChildren();
        for (let i = 0; i < listDataPlayer.length; i++) {
            const dataPlayer = listDataPlayer[i];
            let item = null;
            if (i < this.listPlayer.content.children.length) {
                item = this.listPlayer.content.children[i];
            }
            else {
                item = cc.instantiate(this.itemPlayer);
            }
            this.listPlayer.content.addChild(item);
            item.getChildByName("lbName").getComponent(cc.Label).string = Global.formatMoneyChip(dataPlayer.Username);
            item.getChildByName("lbChip").getComponent(cc.Label).string = Global.formatMoneyChip(dataPlayer.IngameBalance);
        }
    },

    hide(){
        Global.onPopOff(this.node)
    },

    // update (dt) {},
});
