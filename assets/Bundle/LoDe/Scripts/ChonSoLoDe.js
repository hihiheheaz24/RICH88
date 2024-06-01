cc.Class({
    extends: cc.Component,

    properties: {
        listNumberBet: cc.Node,
        itemNumberBet: cc.Node,
        itemNumberSelect : cc.Node,
        listTabNumber: [cc.Node],
        listTop : cc.Node,
        listSelected : cc.Node,
        listViewNumber : cc.Node,
        puSelectNumnber : cc.Node,

        lbChooseNumber : cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // this.dataBet = null;
        // this.minNumberSelectRequire = 0;
        // this.maxNumberSelectRequire = 0;
        Global.ChonSoLoDe = this;
        this.currentTypeBet = 1;
        this.listNumberSelected = [];
        cc.log("chay vao 111 onload")

        this.listSelected.on("child-added", (itemPopup) => {
            if(this.listSelected.children.length > 0){
                this.puSelectNumnber.active = true;
            }
            else{
                this.puSelectNumnber.active = false;
            }
        });

        this.listSelected.on("child-removed", (miniGame) => {
            if(this.listSelected.children.length > 0){
                this.puSelectNumnber.active = true;
            }
            else{
                this.puSelectNumnber.active = false;
            }
        });
    },

    onEnable(){
        this.show(Global.LoDe.dataBet);
        cc.log("check listselect : ", this.listSelected.children.length)
        if(this.listSelected.children.length > 0){
            this.puSelectNumnber.active = true;
        }
        else{
            this.puSelectNumnber.active = false;
        }
        Global.LoDe.setLbChooseNumber();
        this.checkActive();
        this.listTabNumber[0].getComponent(cc.Toggle).isChecked = true;
    },

    checkActive(){
        this.listSelected.destroyAllChildren();
        this.listNumberBet.children.forEach(obj => {
            if(obj.getComponent(cc.Toggle).isChecked){
                let data = obj.getChildByName("lbNumber").getComponent(cc.Label).string;
                let item = cc.instantiate(this.itemNumberSelect);
                item.position = cc.v2(0,0);
                item.scale = 0.8;
                item.node = event.target;
                item.active = true;
                item.getChildByName("lbNumber").getComponent(cc.Label).string = data;
                item.getComponent(cc.Toggle).isChecked = true;
    
                item.getComponent(cc.Toggle).clickEvents = [];
                var eventHandler = new cc.Component.EventHandler();
                eventHandler.target = this.node;
                eventHandler.component = "ChonSoLoDe";
                eventHandler.handler = "cancelNumberBet";
                eventHandler.customEventData = data;
                item.getComponent(cc.Toggle).clickEvents.push(eventHandler);
    
                this.listSelected.addChild(item);
            }
        });
    },

    handleBetting(){
        let xBetValue =  Global.LoDe.configBet[Global.LoDe.typeBet];
        if(Global.LoDe.pointBet <= 0){
            Global.LoDe.pointBet = Global.LoDe.configBet[Global.LoDe.typeBet].xBetValue * 1000;
        }
        let pointBet = Global.LoDe.pointBet;
        cc.log("check ppont bet la : ", Global.LoDe.pointBet)

        Global.LoDe.edbPointBet.string = Global.formatNumber(pointBet);

        let valueBet = 0;
        let valueWin = 0;

        if(Global.LoDe.typeBet === BET_TYPE.XIEN_2 || Global.LoDe.typeBet === BET_TYPE.XIEN_3 || Global.LoDe.typeBet === BET_TYPE.XIEN_4){
            valueBet = Global.formatNumber(pointBet * xBetValue.XBetValue);
            valueWin = Global.formatNumber(pointBet * xBetValue.XRewardValue);
        }
        else{
            valueBet = Global.formatNumber(pointBet * xBetValue.XBetValue * Global.LoDe.listNumberbet.length);
            valueWin = Global.formatNumber(pointBet * xBetValue.XRewardValue);
        }

        Global.LoDe.betOne = pointBet;
        if(!isNaN(pointBet * xBetValue.XBetValue * Global.LoDe.listNumberbet.length) && !isNaN(pointBet * xBetValue.XRewardValue)){
            Global.LoDe.lbTotalBet.string = valueBet;
            Global.LoDe.lbTotalWin.string = valueWin;
        }
        else{
            Global.LoDe.lbTotalBet.string = 0;
            Global.LoDe.lbTotalWin.string = 0;
        }
        cc.log("chya dc den cuoi ",valueBet)
        cc.log("chya dc den cuoi ",valueWin)
    },

    show(dataBet) {
        this.node.active = true
        // Global.onPopOn(this.node);
        cc.log("check data bet la  : ", dataBet)
        cc.log("Check type bet current : ", this.currentTypeBet  + " check nua : ", dataBet.typeBet)
        this.currentTypeBet = dataBet.typeBet
       
        this.dataBet = dataBet;
        this.minNumberSelectRequire = dataBet.minNumberSelectRequire;
        this.maxNumberSelectRequire = dataBet.maxNumberSelectRequire;
        this.chooseListTabNumber(null, 0);

        let totalTab = Math.floor(dataBet.numberRequire / 100);
        this.listTabNumber.forEach(tabNumber => {
            tabNumber.active = false;
        });
        cc.log("check total tab : ", totalTab)
        if(totalTab === 1){
            this.listTop.active = false;
            this.listViewNumber.setContentSize(cc.size(914, 922));
            cc.log("check size : ", this.listViewNumber.size)
        }else{
            this.listTop.active = true;
            this.listViewNumber.setContentSize(cc.size(914, 743));
        }
        

        cc.log("check toteltab : ", totalTab)
        for (let i = 0; i < totalTab; i++) {
            if (this.listTabNumber.length > i) {
                this.listTabNumber[i].active = true;
            }
        }
    },

    hide() {
        this.puSelectNumnber.active = false;
        Global.LoDe.resetGameView();
        this.resetNumberBet();
    },


    onClickChooseBet(){
        Global.onPopOff(this.node);
    },

    start() {
        cc.log("chay vao 111 start")
    },

    chooseListTabNumber(event, data) {
        let index = parseInt(data);
        if (!index) index = 0;
        cc.log("check choose list number : ", index, "check data bet : ", this.dataBet)
        if (this.dataBet)
            this.showListNumner(this.dataBet, index);

    },

    showListNumner(dataBet, index) {
        let numberRequire = dataBet.numberRequire;
        let countItemNumberGnerate = numberRequire > 100 ? 100 : numberRequire;

        this.listNumberBet.removeAllChildren();
        for (let i = 0; i < countItemNumberGnerate; i++) {
            let objNumber = null;
            let addNumber = 100 * index;
            if (i < this.listNumberBet.children.length) {
                objNumber = this.listNumberBet.children[i];
            }
            else {
                objNumber = cc.instantiate(this.itemNumberBet);
                this.listNumberBet.addChild(objNumber);
            }

            let number = parseInt(addNumber + i) < 10 ? i.toString() : i;
            if (addNumber === 0) {
                if (numberRequire === 1000 && parseInt(addNumber + i) < 10) {
                    addNumber = "00";
                } else if (numberRequire === 1000 && parseInt(addNumber + i) > 10) {
                    addNumber = "0";
                }
            }

            objNumber.getChildByName("lbNumber").getComponent(cc.Label).string = addNumber + number;

            this.scheduleOnce(() => {
                objNumber.active = true;
            }, 0.01 * i)


            let numberCheck = (addNumber + number).toString();
            cc.log("check  number  : ", numberCheck)
            cc.log("check list 22 ", Global.LoDe.listNumberbet)
          
            if(Global.LoDe.listNumberbet.includes(numberCheck)){
                cc.log("check co tnon tai ", addNumber + number)
                objNumber.getComponent(cc.Toggle).isChecked = true;
            }

            var eventHandler = new cc.Component.EventHandler();
            eventHandler.target = this.node;
            eventHandler.component = "ChonSoLoDe";
            eventHandler.handler = "onNumberClick";
            eventHandler.customEventData = addNumber + number;
            objNumber.getComponent(cc.Toggle).clickEvents.push(eventHandler);
        }

    },

    onNumberClick(event, data) {
       
        cc.log("cehck event : ", event.target.getComponent(cc.Toggle).isChecked)

        if (!event.target.getComponent(cc.Toggle).isChecked) {
            if(Global.LoDe.listNumberbet.length >= this.maxNumberSelectRequire){
                Global.LoDe.effectThongBaoCuoiGame("Bạn chỉ được chọn tối đa " + this.maxNumberSelectRequire + " số trong màn cược này");
                event.target.getComponent(cc.Toggle).isChecked = true;
    
                if (!event.target.getComponent(cc.Toggle).isChecked) {
                    console.log("Số " + data + " đã được chọn.");
                    Global.LoDe.listNumberbet.push(data);         
                }
                else {
                    console.log("Số " + data + " đã bị hủy");
                    cc.log("check list number bet : ", Global.LoDe.listNumberbet)
                    let index = Global.LoDe.listNumberbet.indexOf(data);
                    cc.log("check list number bet : ", index)
                    if (index != -1) {
                        Global.LoDe.listNumberbet.splice(index, 1);
                    }
                    this.listSelected.children.forEach(itemNumber => {
                        cc.log("check item number : ", itemNumber.getChildByName("lbNumber").getComponent(cc.Label).string)
                        cc.log("check item event.target : ",event.target.getChildByName("lbNumber").getComponent(cc.Label).string)
                        if(itemNumber.getChildByName("lbNumber").getComponent(cc.Label).string == event.target.getChildByName("lbNumber").getComponent(cc.Label).string){
                            cc.log("co roi dcm")
                            itemNumber.destroy();
                        }
                    });
                }    
                return;
            }
            console.log("Số " + data + " đã được chọn.");
            Global.LoDe.listNumberbet.push(data)
            let item = cc.instantiate(this.itemNumberSelect);
            item.position = cc.v2(0,0);
            item.scale = 0.8;
            item.node = event.target;
            item.active = true;
            item.getChildByName("lbNumber").getComponent(cc.Label).string = data;
            item.getComponent(cc.Toggle).isChecked = true;

            item.getComponent(cc.Toggle).clickEvents = [];
            var eventHandler = new cc.Component.EventHandler();
            eventHandler.target = this.node;
            eventHandler.component = "ChonSoLoDe";
            eventHandler.handler = "cancelNumberBet";
            eventHandler.customEventData = data;
            item.getComponent(cc.Toggle).clickEvents.push(eventHandler);

            this.listSelected.addChild(item);
            this.listNumberSelected.push(data)
        }
        else {
            console.log("Số " + data + " đã bị hủy");
            let index = Global.LoDe.listNumberbet.indexOf(data.toString());
            if (index != -1) {
                Global.LoDe.listNumberbet.splice(index, 1);
            }
            this.listSelected.children.forEach(itemNumber => {
                cc.log("check item number : ", itemNumber.getChildByName("lbNumber").getComponent(cc.Label).string)
                cc.log("check item event.target : ",event.target.getChildByName("lbNumber").getComponent(cc.Label).string)
                if(itemNumber.getChildByName("lbNumber").getComponent(cc.Label).string == event.target.getChildByName("lbNumber").getComponent(cc.Label).string){
                    cc.log("co roi dcm")
                    itemNumber.destroy();
                }
            });

              //
              let number = parseInt(data);
              let indexx = Global.LoDe.listNumberbet.indexOf(number);
              if (indexx !== -1) {
                  Global.LoDe.listNumberbet.splice(indexx, 1);
              }
              cc.log("check children by node : ", event.target)
              this.listSelected.children.forEach(itemNumber => {
                  if(itemNumber.getChildByName("lbNumber").getComponent(cc.Label).string === event.target.getChildByName("lbNumber").getComponent(cc.Label).string){
                      itemNumber.destroy();
                  }
              });
              Global.LoDe.lbNumberBet.string = Global.LoDe.listNumberbet.join(", ")
              cc.log("check list bet la : ", Global.LoDe.listNumberbet.join(", "))
        }
        cc.log("check lois : ", Global.LoDe.listNumberbet)
        if(this.currentTypeBet  === BET_TYPE.XIEN_2 || this.currentTypeBet === BET_TYPE.XIEN_3 || this.currentTypeBet  === BET_TYPE.XIEN_4){
            Global.LoDe.lbNumberBet.string = Global.LoDe.listNumberbet.join("-")
        }
        else{
            Global.LoDe.lbNumberBet.string = Global.LoDe.listNumberbet.join(", ")
        }
       
    },

    resetNumberBet(){
        this.listNumberBet.children.forEach(itemNumber => {
            itemNumber.getComponent(cc.Toggle).isChecked = false;
        });
        this.listSelected.destroyAllChildren();
        this.listNumberSelected = [];
        Global.LoDe.lbNumberBet.string = "";
        Global.LoDe.listNumberbet = [];
    },

    cancelNumberBet(event, data){
        let number = parseInt(data);
        let index = Global.LoDe.listNumberbet.indexOf(number);
        if (index !== -1) {
            Global.LoDe.listNumberbet.splice(index, 1);
        }
        cc.log("check children by node : ", event.target)
        this.listNumberBet.children.forEach(itemNumber => {
            if(itemNumber.getChildByName("lbNumber").getComponent(cc.Label).string === event.target.getChildByName("lbNumber").getComponent(cc.Label).string){
                cc.log("co roi dcm")
                itemNumber.getComponent(cc.Toggle).isChecked = false;
                event.target.destroy();
            }
        });
        Global.LoDe.lbNumberBet.string = Global.LoDe.listNumberbet.join(", ")
        cc.log("check list bet la : ", Global.LoDe.listNumberbet.join(", "))
    },

    onClickBetting(){
        this.handleBetting();
        Global.LoDe.onClickShowInfoBet();
    }

    // update (dt) {},
});
