
cc.Class({
    extends: cc.Component,
    ctor(){
        this.listQuestView = [];
        this.listQuestFinish = [];
        this.listDataQuest = [];
    },
    properties: {
        questView : cc.Node,
    },

    Init() {
        if(this.isInit)
        {
            return;
        }
        this.isInit = true;
        this.listQuestView[this.listQuestView.length] = this.questView.getComponent("QuestElementView");
    },
	
	show(){
        Global.onPopOn(this.node);
        this.Init();
        require("SendRequest").getIns().MST_Client_Get_Mission_Info();
        for(let i = 0; i < this.listQuestView.length; i++){
            this.listQuestView[i].node.active = false;
        }     
    },

    UpdateQuestInfo(questInfo) {
        cc.log("info quest " , questInfo);
       


        questInfo.sort((a, b)=> a.Status - b.Status)

        for (let i = 0; i < questInfo.length; i++) {
            let itemDataQuest = questInfo[i];
            if(itemDataQuest.Status === 1 || itemDataQuest.Status === 0)
                itemDataQuest.percent = itemDataQuest.Point / itemDataQuest.RulePoints
        }

        questInfo.sort((a, b)=> b.percent - a.percent)

        this.listDataQuest = [];
        for (let i = 0; i < questInfo.length; i++) {
            if (i >= this.listQuestView.length) {
                let questTrans = cc.instantiate(this.questView);
                questTrans.parent = this.questView.parent;
                let questElement = questTrans.getComponent("QuestElementView");
                this.listQuestView[this.listQuestView.length] = questElement;
            }
            this.listQuestView[i].node.scale = 0;
            this.listQuestView[i].node.active = true;

            cc.tween(this.listQuestView[i].node)
                .delay(i * 0.1)
                .to(0.2, { scale: 1.2 }, { easing: 'quadInOut' })  // Scale to ra trong 0.5 giây với easing quadInOut
                .delay(0.05)  // Đợi 0.2 giây trước khi thực hiện hiệu ứng scale nhỏ lại
                .to(0.1, { scale: 1 }, { easing: 'quadInOut' })  // Scale nhỏ lại trong 0.3 giây với easing quadInOut
                .start();

            this.listQuestView [i].UpdateInfo (questInfo[i]);
            this.listDataQuest.push(questInfo[i]);
        }

        for (let i = 0; i < questInfo.length; i++) {
            let dataItem = questInfo[i];
            if(dataItem.Point < dataItem.RulePoints && dataItem.Status === 0){
                Global.TodayMission = dataItem;
                break;
            }
        }
        this.checkListQuest(this.listDataQuest);
    },

    checkListQuest(dataQuest){
        cc.log("check liest quest finish : ", this.listQuestFinish)
        cc.log("check liest dataQuest : ", dataQuest)

        if(Global.GameView && Global.GameView.node.active){
            for (let i = 0; i < dataQuest.length; i++) {
                const objData = dataQuest[i];
                let alreadyExist = false;
                if(objData.Status === 1){
                    for (let j = 0; j < this.listQuestFinish.length; j++) {
                        const objQuestFinish = this.listQuestFinish[j];
                        if (objData.MissionId === objQuestFinish.MissionId){    
                            alreadyExist = true;
                        }
                    }
    
                    if(!alreadyExist){
                        this.listQuestFinish.push(objData);
                        Global.GameView.showNoti("Bạn đã hoàn thành nhiệm vụ " + objData.MissionName  + ". Bạn có thể nhận thưởng ngoài sảnh")
                    }      
                }
            }
        }
        else{
            let index = 0;
            for (let i = 0; i < dataQuest.length; i++) {
                const objData = dataQuest[i];
                let alreadyExist = false;
                if (objData.Status === 1) {
                    index++;
                    for (let j = 0; j < this.listQuestFinish.length; j++) {
                        const objQuestFinish = this.listQuestFinish[j];
                        if (objData.MissionId === objQuestFinish.MissionId) {
                            alreadyExist = true;
                        }
                    }

                    if (!alreadyExist) {
                        this.listQuestFinish.push(objData);
                    }
                }
            }
            cc.log("check index mission L: ", index)
            if(index > 0){
                Global.LobbyView.notiMission.active = true;
                Global.LobbyView.notiMission.getChildByName("lb_dot").getComponent(cc.Label).string = index;
            }
            else{
                Global.LobbyView.notiMission.active = false;
            }
        }
       
      
     
    },

    Hide(){
        Global.onPopOff(this.node);
        if(Global.ReceivedFirstMisson){
            Global.UIManager.showBannerPopup();
        }
    },
	
	onDestroy(){
		Global.QuestPopup = null;
	},
});
