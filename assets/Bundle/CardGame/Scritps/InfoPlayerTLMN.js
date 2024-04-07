cc.Class({
    extends: cc.Component,

    properties: {
        lbName: cc.Label,
        lbGold: cc.Label,
        statiticList: cc.Node,
        itemStatic: cc.Node,
        achivementList: cc.Node,
        itemAchivement: cc.Node,
        starLevel: cc.Sprite,
        listStarLevel: [cc.SpriteFrame],
        lbStarLevel: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Global.InfoPlayerTLMN = this;
    },

    start() {

    },

    show(idPlayer) {
        Global.onPopOn(this.node);
        let msg = {};
        msg[1] = idPlayer;
        require("SendRequest").getIns().MST_Client_Get_Other_Player_Info(msg)
    },

    handleDataInfoPlayer(data) {

        let dataPlayer = JSON.parse(data[1]);
        this.lbName.string = dataPlayer.UserName;
        this.lbGold.string = dataPlayer.IngameBalance;

        cc.log("check data info : ", dataPlayer.StatiticList);

        this.statiticList.removeAllChildren();
        for (let i = 0; i < dataPlayer.StatiticList.length; i++) {
            const dataStatic = dataPlayer.StatiticList[i];
            let item = null;
            if (i < this.statiticList.children.length) {
                item = this.statiticList.children[i];
            }
            else {
                item = cc.instantiate(this.itemStatic)
            }
            cc.log("check game code : ", dataStatic.GameCode)
            let gameName = null;
            switch (dataStatic.GameCode) {
                case "PKR":
                    gameName = "Poker: "
                    break;
                case "TMN":
                    gameName = "TLMN: "
                    break;
                case "MAB":
                    gameName = "Binh: "
                    break;

                default:
                    gameName = "NULL: "
                    break;
            }

            let percentWin = ((dataStatic.WinMatch / dataStatic.PlayMatch) * 100).toFixed(0);
            if (!percentWin) percentWin = 0;
            //PlayMatch
            //WinMatch
            cc.log("check win :", dataStatic.WinMatch)
            cc.log("check win :", dataStatic.PlayMatch)
            item.getComponent(cc.Label).string = gameName + Global.formatNumber(dataStatic.PlayMatch) + " ván (" + percentWin + "% thắng)"
            this.statiticList.addChild(item)
        }

        cc.log("check data info : ", dataPlayer.AchievementList);
        this.achivementList.removeAllChildren();
        for (let i = 0; i < dataPlayer.AchievementList.length; i++) {
            const dataAchivement = dataPlayer.AchievementList[i];
            let item = null;
            if (i < this.achivementList.children.length) {
                item = this.achivementList.children[i];
            }
            else {
                item = cc.instantiate(this.itemAchivement)
            }
            item.getChildByName("lbDes").getComponent(cc.Label).string = dataAchivement.Name;
            item.getChildByName("lbNumber").getComponent(cc.Label).string = dataAchivement.Number;
            this.achivementList.addChild(item)
        }

        this.starLevel.spriteFrame = this.listStarLevel[dataPlayer.StarLevel - 1];

        let text = ""
        switch (dataPlayer.StarLevel) {
            case 1:
                text = "BRONZE"
                break;
            case 2:
                text = "SILVER"
                break;
            case 3:
                text = "GOLD"
                break;
            case 4:
                text = "PLATINUM"
                break;
            case 5:
                text = "DIAMOND"
                break;
            case 6:
                text = "ELITE"
                break;
            case 7:
                text = "MASTER"
                break;
        }
        this.lbStarLevel.string = text;
    },

    hide() {
        Global.onPopOff(this.node);
    },

    onDestroy() {
        Global.InfoPlayerTLMN = null
    }

    // update (dt) {},
});
