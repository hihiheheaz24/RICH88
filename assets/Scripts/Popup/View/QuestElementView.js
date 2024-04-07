
cc.Class({
    extends: cc.Component,
    ctor() {
        this.id = 0;
        this.data = null;
    },
    properties: {
        bar: cc.Sprite,
        title: cc.Label,
        progress: cc.Label,
        btn: cc.Button,
        nodeChuaHoanThanh:cc.Node,
        nodeDaNhanPhanThuong:cc.Node,
        lbGoldRevice:cc.Label,
        lbDay : cc.Label,
        nodeThatBai : cc.Node,
        btnPlay : cc.Node,

        listLabel : [cc.Node],
        //btnImg: cc.Sprite,
        //lbDaNhan:cc.Label,
        // imgReceive: cc.SpriteFrame,
        // imgReceived: cc.SpriteFrame,
    },

    UpdateInfo(quest) {
        this.data = quest;
        this.nodeChuaHoanThanh.active = false;
        this.nodeDaNhanPhanThuong.active = false;
        this.nodeThatBai.active = false;
        this.btn.node.active = false;
        this.btnPlay.active = false;
        this.node.opacity = 255;

        this.id = quest.MissionId;
        this.title.string = quest.MissionDescription;
        // this.bar.fillRange = quest.ProgressPoint;
        this.progress.string = quest.Point + "/" + quest.RulePoints;

        for (let i = 0; i < this.listLabel.length; i++) {
            let lb = this.listLabel[i];
            lb.color = cc.Color.WHITE;
        }
        //0-NONE, 1-SUCCESS, 2-RECEIVED
        cc.log("check game code : ", quest.GameCode);
        switch (quest.Status) {
            case 0:
                this.nodeChuaHoanThanh.active = true;
                if(quest.GameCode || quest.GameCode === 0){
                    this.nodeChuaHoanThanh.active = false;
                    this.btnPlay.active = true;
                }
                break;
            case 1:
                this.btn.interactable = true;
                this.btn.node.active = true;
                break;
            case 2:
                this.nodeDaNhanPhanThuong.active = true;
                this.node.opacity = 100;
                break;
            case -2:
                this.nodeThatBai.active = true;
                for (let i = 0; i < this.listLabel.length; i++) {
                    let lb = this.listLabel[i];
                    lb.color = new cc.Color({ r: 255, g: 0, b: 0, a: 255 });
                }
                break;
        }

        this.lbDay.string = quest.DayInfo;
        if(quest.DayInfo === "Hôm nay") this.lbDay.node.color = new cc.Color({ r: 245, g: 212, b: 37, a: 255 });
        // else this.lbDay.node.color = cc.Color.WHITE;

        if(quest.GoldRevice) {
            this.lbGoldRevice.string = Global.formatMoney(quest.GoldRevice);
        }

    },

    OnClick() {
        if(this.id === 64){
            Global.ReceivedFirstMisson = true;
        }
        let msgData = {};
        msgData[1] = this.id;
        require("SendRequest").getIns().MST_Client_Receive_Mission_Reward(msgData);
    },

    onClickQuest(){

        if(this.data.GameCode === 0){
            let myArray = [4, 7, 5]
            var rand = myArray[Math.floor(Math.random() * myArray.length)];
            this.data.GameCode = rand;
        }

        let gameName = Global.getGameNameById(this.data.GameCode);
        MainPlayerInfo.CurrentGameCode = "TMN";
        MainPlayerInfo.CurrentGameId = 7; // fix cung
        cc.log("C/heck game code la : ", this.data.GameCode)

        let msg = {};
        msg[AuthenticateParameterCode.GameId] = "TMN";
        msg[AuthenticateParameterCode.Blind] = 0;
        cc.log("send ow itemlobby : ", msg);
        require("SendCardRequest").getIns().MST_Client_Join_Game(msg);
        Global.UIManager.showMiniLoading();

        Global.QuestPopup.Hide();

    },
});
