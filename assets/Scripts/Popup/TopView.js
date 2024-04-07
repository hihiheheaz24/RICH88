// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        listTop : require("BaseScrollView"),
        listItemTop : [cc.Node],
        itemTopMe : cc.Node,
        bgUser : cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.statusTab = 1;
        this.dataTopView = null;
        this.itemTopIsMe = null;
        this.firstPos = null;
    },

    start () {

    },

    show(typeRank){
        //data1 : game code
        Global.onPopOn(this.node);
        let msg = {};
        if(typeRank)
            msg[1] = typeRank;
        require("SendRequest").getIns().MST_Cliet_Get_Top_Dai_Gia(msg);
    },

    loadListView(data = null){
        if(data)
            this.dataTopView = data;
        this.listTop.resetScr();
        cc.log("check  data top : ", data)
        let dataTop = this.dataTopView[this.statusTab];
        let listData = [];
        for (let i = 0; i < dataTop.length; i++) {
            let itemDataTop = JSON.parse(dataTop[i]);
            itemDataTop["Rank"] = i+1;
            listData.push(itemDataTop);
        }
        cc.log("data top la : ", listData);

        for (let i = 0; i < 3; i++) {
            const objData = listData[i];
            cc.log("check objdata ", objData.NickName)
            this.listItemTop[i].getChildByName("lbName").getComponent(cc.Label).string = objData.NickName;
            this.listItemTop[i].getChildByName("lbGold").getComponent(cc.Label).string = Global.formatNumber(objData.TotalWinMoney);
        }
        listData = listData.slice(3);
        this.listTop.init(listData , listData.length * 80 , 80);

        this.listTop.node.getComponent(cc.ScrollView).scrollToTop(0);
        let dataIsMe = {}
        dataIsMe.NickName = MainPlayerInfo.nickName;
        dataIsMe.TotalWinMoney = 0;
        dataIsMe.TotalBonus = 0;
        dataIsMe.Rank = 999;
        dataIsMe.AccountId = MainPlayerInfo.accountId;
        cc.log("check data is me la L ", dataIsMe)
        this.bgUser.getComponent("ItemTopView").initIsMe(dataIsMe);
        this.scrollEvent(null, null, null);
    },

    onClickTopDay(){
        this.statusTab = 1;
        this.loadListView();
    },

    onClickTopWeek(){
        this.statusTab = 2;
        this.loadListView();
    },

    onClickTopMonth(){
        this.statusTab = 3;
        this.loadListView();
    },

    onClose(){
        this.firstPos = null;
        Global.onPopOff(this.node);
    },

    scrollEvent(number, data, event) {
        cc.log("check item top : ", this.itemTopIsMe)
        if (this.itemTopIsMe) {
            let myPosScoll = this.listTop.node.getComponent(cc.ScrollView).getContentPosition();
            let mypos = Global.getPostionInOtherNode(this.itemTopIsMe, this.listTop.node.getComponent(cc.ScrollView).content);
            if(!this.firstPos)
                this.firstPos = mypos;
            if (this.firstPos.y < myPosScoll.y + (215) && this.firstPos.y > myPosScoll.y - (215)) {
                this.bgUser.active = false;
            } else {
                this.bgUser.active = true;
            }
         
        }
        else{
            this.bgUser.active = true;
        }

        if(this.listTop.node.getComponent(cc.ScrollView).getScrollOffset().y === this.listTop.node.getComponent(cc.ScrollView).getMaxScrollOffset().y){
            this.bgUser.active = false;
        }
    },

    // update (dt) {},
});
