cc.Class({
    extends: cc.Component,

    properties: {
        lbTitleLeague : cc.Label,
        bgLeague : cc.Node,
        listItemTop : cc.ScrollView,
        itemTop : cc.Node,
        listSprItem : [cc.SpriteFrame],
        lbLevel : cc.Label,
        lbGoldReward : cc.Label,
        listUpOrDown : [cc.SpriteFrame],
        lbTimeSchedule : cc.Label,
        bgUserTop : cc.Node,
        bgUserBot : cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.itemTopIsMe = null;
    },
    onEnable(){
        if(Global.LeagueData)
            Global.LeaguePopup.handleData(Global.LeagueData)
    },

    start () {

    },

    show(){
        cc.log("check game view la : ", Global.GameView)
        if(Global.GameView){
            this.bgLeague.position = cc.v2(((cc.winSize.width / 2) - this.bgLeague.getContentSize().width  /  2) - 20, this.bgLeague.position.y)
        }
        else{
            this.bgLeague.position = cc.v2(((cc.winSize.width / 2) - this.bgLeague.getContentSize().width  /  2) - 80, this.bgLeague.position.y)
        }
        Global.onPopOn(this.node);
    },

    hide(){
        Global.onPopOff(this.node);
    },

    handleData(data){
        this.unschedule(this.funScheduleTimeLeague);
        cc.log("check data league : ", data)

        let dataIsMe = JSON.parse(data[3])
        this.lbLevel.string = "Level " + dataIsMe.LeagueLevel;
        Global.LeagueLInfo = dataIsMe;
        

        let dataLeague = data[1];
        let listLeague = [];
        // dataLeague = JSON.parse(dataLeague[0]);
        for (let i = 0; i < dataLeague.length; i++) {
            const objData = JSON.parse(dataLeague[i]);
            listLeague.push(objData);
            cc.log("check tung cai : ", dataIsMe.LeagueLevel)
            cc.log("check tung cai : ", JSON.parse(objData.Rewards))
            if(objData.LeagueLevel === dataIsMe.LeagueLevel){
                this.lbGoldReward.string = Global.formatNumber(JSON.parse(objData.TotalReward)) + " GOLD";
                this.lbTitleLeague.string = objData.Description;
            }
        }

        let dataPlayerLeague = data[2];
        let listDataPlayer = [];
        for (let i = 0; i < dataPlayerLeague.length; i++) {
            const objData = dataPlayerLeague[i];
            listDataPlayer.push(JSON.parse(objData))
        }

        this.listItemTop.content.removeAllChildren();

        for (let i = 0; i < listDataPlayer.length; i++) {
            const objData = listDataPlayer[i];
            let item = null;
            if (i < this.listItemTop.content.children.length) {
                item = this.listItemTop.content.children[i];
            }
            else {
                item = cc.instantiate(this.itemTop)
            }
            item.active = true;
            Global.GetAvataById(item.getChildByName("avt").getChildByName("avt-frame").getComponent(cc.Sprite), objData.AccountId);
            item.getChildByName("lbStt").getComponent(cc.Label).string = i + 1;
            item.getChildByName("lbRank").active = true;
            item.getChildByName("lbRank").getComponent(cc.Label).string = Math.abs(objData.RankUp);
            item.getChildByName("lbName").getComponent(cc.Label).string = objData.NickName;
            item.getChildByName("layout").getChildByName("lbBigBlind").getComponent(cc.Label).string = Global.formatNumber(objData.Point);
            if(objData.AccountId === MainPlayerInfo.accountId){
                item.getComponent(cc.Sprite).spriteFrame  =  this.listSprItem[0];
            }
            else{
                item.getComponent(cc.Sprite).spriteFrame  =  this.listSprItem[1];
            }
            if(objData.RankUp > 0){
                item.getChildByName("iconUpOrDown").getComponent(cc.Sprite).spriteFrame =  this.listUpOrDown[0]
            }
            else if(objData.RankUp < 0){
                item.getChildByName("iconUpOrDown").getComponent(cc.Sprite).spriteFrame =  this.listUpOrDown[1]
            }
            else {
                item.getChildByName("lbRank").active = false;
                item.getChildByName("iconUpOrDown").getComponent(cc.Sprite).spriteFrame = null
            }
            this.listItemTop.content.addChild(item);
            if (objData.AccountId == MainPlayerInfo.accountId) {
                this.itemTopIsMe = item; 
                Global.GetAvataById(this.bgUserTop.getChildByName("avt").getChildByName("avt-frame").getComponent(cc.Sprite), objData.AccountId);
                Global.GetAvataById(this.bgUserBot.getChildByName("avt").getChildByName("avt-frame").getComponent(cc.Sprite), objData.AccountId);
                Global.LeagueLInfo.rank = i + 1
                this.bgUserTop.getChildByName("lbStt").getComponent(cc.Label).string = i + 1;
                this.bgUserTop.getChildByName("lbRank").getComponent(cc.Label).string = Math.abs(objData.RankUp);
                this.bgUserTop.getChildByName("lbName").getComponent(cc.Label).string = objData.NickName;
                this.bgUserTop.getChildByName("layout").getChildByName("lbBigBlind").getComponent(cc.Label).string = Global.formatNumber(objData.Point);

                this.bgUserBot.getChildByName("lbStt").getComponent(cc.Label).string = i + 1;
                this.bgUserBot.getChildByName("lbRank").getComponent(cc.Label).string = Math.abs(objData.RankUp);
                this.bgUserBot.getChildByName("lbName").getComponent(cc.Label).string = objData.NickName;
                this.bgUserBot.getChildByName("layout").getChildByName("lbBigBlind").getComponent(cc.Label).string = Global.formatNumber(objData.Point);

                this.bgUserTop.getChildByName("lbRank").active = true;
                this.bgUserBot.getChildByName("lbRank").active = true;
                if (objData.RankUp > 0) {
                    this.bgUserTop.getChildByName("iconUpOrDown").getComponent(cc.Sprite).spriteFrame = this.listUpOrDown[0]
                    this.bgUserBot.getChildByName("iconUpOrDown").getComponent(cc.Sprite).spriteFrame = this.listUpOrDown[0]
                }
                else if (objData.RankUp < 0) {
                    this.bgUserTop.getChildByName("iconUpOrDown").getComponent(cc.Sprite).spriteFrame = this.listUpOrDown[1]
                    this.bgUserBot.getChildByName("iconUpOrDown").getComponent(cc.Sprite).spriteFrame = this.listUpOrDown[1]
                }
                else {
                    this.bgUserTop.getChildByName("iconUpOrDown").getComponent(cc.Sprite).spriteFrame = null
                    this.bgUserBot.getChildByName("iconUpOrDown").getComponent(cc.Sprite).spriteFrame = null
                    this.bgUserTop.getChildByName("lbRank").active = false;
                    this.bgUserBot.getChildByName("lbRank").active = false;
                }
            }
        }

        this.listItemTop.scrollToTop(0.1);
        setTimeout(() => {
            this.scrollEvent(null, null, null);
        }, 100);
       
        let time = data[4];
        this.lbTimeSchedule.string = Global.formatTimeBySec(time, true);
        this.schedule(this.funScheduleTimeLeague = () => {
            time--;
            this.lbTimeSchedule.string = Global.formatTimeBySec(time, true);
            if (time === 0) {
                this.unschedule(this.funScheduleTimeLeague);
                this.lbTimeSchedule.string = "00:00:00";
            }
        }, 1);    
        
    },

    scrollEvent(number, data, event) {
        if (this.itemTopIsMe) {
            let myPosScoll = this.listItemTop.getContentPosition();
            let mypos = Global.getPostionInOtherNode(this.itemTopIsMe, this.listItemTop.content);
            if (mypos.y < myPosScoll.y + (310) && mypos.y > myPosScoll.y - (310)) {
                this.bgUserBot.active = false;
                this.bgUserTop.active = false;
            } else {
                if (mypos.y > myPosScoll.y + (310)) {
                    this.bgUserBot.active = true;
                    this.bgUserTop.active = false;
                }
                else if (mypos.y < myPosScoll.y - (310)) {
                    this.bgUserTop.active = true;
                    this.bgUserBot.active = false;
                }

            }
        }
    },
    // update (dt) {},
});
