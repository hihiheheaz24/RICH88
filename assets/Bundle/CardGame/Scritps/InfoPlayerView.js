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
        avata: cc.Sprite,
        lbName: cc.Label,
        lbId: cc.Label,
        lbGold: cc.Label,
        lbDiamond: cc.Label,
        //
        lbSoVan: cc.Label,
        lbChipWin: cc.Label,
        //
        lbVPIP: cc.Label,
        lbPFR: cc.Label,
        lbBBD: cc.Label,
        lb3BET: cc.Label,
        lbWT: cc.Label,
        lbWR: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // this.node.setContentSize(cc.winSize);
        Global.InfoPlayerView = this;
    },

    init(player) {
        cc.log("data player la : ", player);
        Global.onPopOn(this.node);
        if (!player) return;

        console.log("check game ciode ", MainPlayerInfo.CurrentGameCode)
        switch (MainPlayerInfo.CurrentGameCode) {
            case "TMN":
                this.node.active = true;
                this.lbName.string = player.nameUser;
                this.lbGold.string = Global.formatNumber(player.gold);
                Global.GetAvataById(this.avata, player.id);
                this.pos = player.position;

                break;

            case "MAB":

                break;
            case "PKR":

                Global.GetAvataById(this.avata, player.AccountId);
                this.lbName.string = player.NickName;
                this.lbId.string = player.AccountId;
                this.lbGold.string = Global.formatNumber(player.Cash);
                this.lbDiamond.string = Global.formatNumber(player.Diamond);
                this.lbSoVan.string = Global.formatNumber(player.TotalMatchPlay);
                this.lbChipWin.string = Global.formatNumber(player.TotalWinMoney);
                //

                this.lbVPIP.string = Global.formatNumberPoker(player.VPIP) + "%";
                this.lbPFR.string = Global.formatNumberPoker(player.FPR) + "%";
                this.lbBBD.string = Global.formatNumberPoker(player.DBB) + "%";
                this.lb3BET.string = Global.formatNumberPoker(player.BET3) + "%";
                this.lbWT.string = Global.formatNumberPoker(player.WT) + "%";
                this.lbWR.string = Global.formatNumberPoker(player.WR) + "%";

                if (player.NickName !== MainPlayerInfo.nickName) {
                    this.lbGold.node.getParent().active = false;
                    this.lbDiamond.node.getParent().active = false;
                }
                else {
                    this.lbGold.node.getParent().active = true;
                    this.lbDiamond.node.getParent().active = true;
                }

                break;

            default:
                break;
        }

    },
    start() {

    },
    onClickItem(event, data) {
        let msg = {};
        msg[21] = data;
        msg[26] = this.pos;
        require("SendCardRequest").getIns().MST_Client_ChatEmoji(msg);
        this.onClickClose();
    },

    onClickClose() {
        Global.onPopOff(this.node);
    },
    onDestroy() {
        Global.InfoPlayer = null;
    }

    // update (dt) {},
});
