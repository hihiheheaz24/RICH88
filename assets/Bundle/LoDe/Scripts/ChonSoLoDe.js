cc.Class({
    extends: cc.Component,

    properties: {
        listNumberBet: cc.Node,
        itemNumberBet: cc.Node,
        listTabNumber: [cc.Node],
        listTop : cc.Node,
        listSelected : cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // this.dataBet = null;
        // this.minNumberSelectRequire = 0;
        // this.maxNumberSelectRequire = 0;
        Global.ChonSoLoDe = this;
        this.currentTypeBet = 1;
        cc.log("chay vao 111 onload")
    },

    show(dataBet) {
        Global.onPopOn(this.node);
        cc.log("check data bet la  : ", dataBet)
        cc.log("Check type bet current : ", this.currentTypeBet  + " check nua : ", dataBet.typeBet)
        if(this.currentTypeBet !== dataBet.typeBet){
            cc.log("chay vao reset")
            this.currentTypeBet = dataBet.typeBet;
            Global.LoDe.listNumberbet = [];
        }
       
        this.dataBet = dataBet;
        this.minNumberSelectRequire = dataBet.minNumberSelectRequire;
        this.maxNumberSelectRequire = dataBet.maxNumberSelectRequire;
        this.chooseListTabNumber(null, 0);

        let totalTab = Math.floor(dataBet.numberRequire / 100);
        this.listTabNumber.forEach(tabNumber => {
            tabNumber.active = false;
        });

        if(totalTab === 1) this.listTop.active = false;
        else this.listTop.active = true

        cc.log("check toteltab : ", totalTab)
        for (let i = 0; i < totalTab; i++) {
            if (this.listTabNumber.length > i) {
                this.listTabNumber[i].active = true;
            }
        }
    },

    hide() {
        cc.log("chay vao close : " + Global.LoDe.listNumberbet.length + " tiep " + this.minNumberSelectRequire)
        // if(Global.LoDe.listNumberbet.length < this.minNumberSelectRequire){
        //     Global.LoDe.effectThongBaoCuoiGame("Bạn chưa chọn đủ số, Yêu cầu chọn đủ " + this.minNumberSelectRequire + " số");
        //     return;
        // }
        Global.onPopOff(this.node);
        Global.LoDe.resetGameView();
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

            if(Global.LoDe.listNumberbet.includes(addNumber + number)){
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
            let item = cc.instantiate(this.itemNumberBet);
            item.position = cc.v2(0,0);
            item.scale = 0.8;
            item.node = event.target;
            item.active = true;
            item.getChildByName("lbNumber").getComponent(cc.Label).string = data;
            item.getComponent(cc.Toggle).isChecked = true;

            var eventHandler = new cc.Component.EventHandler();
            eventHandler.target = this.node;
            eventHandler.component = "ChonSoLoDe";
            eventHandler.handler = "cancelNumberBet";
            eventHandler.customEventData = data;
            item.getComponent(cc.Toggle).clickEvents.push(eventHandler);

            this.listSelected.addChild(item)
        }
        else {
            console.log("Số " + data + " đã bị hủy");
            let index = Global.LoDe.listNumberbet.indexOf(data);
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
        cc.log("check lois : ", Global.LoDe.listNumberbet)
        if(this.currentTypeBet  === BET_TYPE.XIEN_2 || this.currentTypeBet === BET_TYPE.XIEN_3 || this.currentTypeBet  === BET_TYPE.XIEN_4){
            Global.LoDe.lbNumberBet.string = Global.LoDe.listNumberbet.join("-")
        }
        else{
            Global.LoDe.lbNumberBet.string = Global.LoDe.listNumberbet.join(", ")
        }
       
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

    // update (dt) {},
});
