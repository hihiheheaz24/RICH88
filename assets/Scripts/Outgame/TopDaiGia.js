var TopDaiGia = cc.Class({
    extends: cc.Component,
    statics: {
        getIns() {
            if (this.self == null) this.self = new TopDaiGia();
            return this.self;
        }
    },
    properties: {
        list_view : {
            default : null,
            type : cc.ScrollView
        },
        item_list_view : {
            default : null,
            type : cc.Prefab
        },
        list_view_ingame : {
            default : null,
            type : cc.ScrollView
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Global.TopDaiGia = this;
    },

    start () {

    },

    initTopDaiGia(data) {
        let dataDaiGia = data[1];

        if(MainPlayerInfo.CurrentGameCode){
            // this.list_view_ingame.scrollToTop();
            // this.list_view_ingame.content.destroyAllChildren();
            // for (let i = 0; i < dataDaiGia.length; i++) {
            //     const dataPacket = dataDaiGia[i];
            //     let data = JSON.parse(dataPacket);
            //     let item = cc.instantiate(this.item_list_view).getComponent("ItemTopDaiGia");
            //     item.init(data, i);
            //     item.node.active = true;
            //     this.list_view_ingame.content.addChild(item.node);
            // }
        }
        else{
            this.list_view.scrollToTop();
            this.list_view.content.destroyAllChildren();
            for (let i = 0; i < dataDaiGia.length; i++) {
                const dataPacket = dataDaiGia[i];
                let data = JSON.parse(dataPacket);
                let item = cc.instantiate(this.item_list_view).getComponent("ItemTopDaiGia");
                item.init(data, i);
                item.node.active = true;
                this.list_view.content.addChild(item.node);
            }
        }
    },

    onClickTopDaiGia() {

    },

    onClickNews (){

    },
    onClickXemThem(){
        if(MainPlayerInfo.CurrentGameCode)
            this.list_view_ingame.scrollToBottom(0.1);
        else
            this.list_view.scrollToBottom(0.1);
    },
});
module.exports = TopDaiGia;