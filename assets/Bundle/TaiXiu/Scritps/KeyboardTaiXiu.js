// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        nodeKeyboard1: cc.Node,
        nodeKeyboard2: cc.Node,


        lbMoneyBoxTai: cc.Label,
        lbMoneyBoxXiu: cc.Label,

        _currentLbString: null,

        _currentBoxBet: null,


        _lbGoc: 0,
        _isKeyBoardType: false,
        _gate: 1,
        _lastBet: 0,

        boxBetTai: cc.Button,
        boxBetXiu: cc.Button

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.initEventButton();
        this.listMoneyDefine = ["1K", "5K", "10K", "50K", "100K", "500K", "1M", "5M"];
        this.list0Define = ["0", "00", "000"];
        this.sum = 0;
        this.currentBoxBet = "";
    },


    onClickBoxBet(event, data) {
        // tai 0 , xiu 1
        cc.log("check box betttt")
        // if (this.currentBoxBet == data) return;
        this.currentBoxBet = data;
        this.sum = 0;
        this._lbGoc = "";
        switch (data) {
            case "0":
                //click bet tai
                if(Global.TaiXiu.lbMyMonneyBetXiu.getComponent(cc.Label).string !== "0"){
                    Global.TaiXiu.effectThongBaoCuoiGame("Bạn chỉ được đặt 1 cửa")
                    return;
                }
                this._currentLbString = this.lbMoneyBoxTai;
                this._currentBoxBet = this.boxBetTai.node;
                this.lbMoneyBoxTai.string = "0";
                this.boxBetTai.node.active = false;
                this.boxBetXiu.node.active = true;
                this._gate = 2;
                break;
            case "1":
                  //click bet xiu
                  if(Global.TaiXiu.lbMyMonneyBetTai.getComponent(cc.Label).string !== "0"){
                    cc.log("check log la : ", Global.TaiXiu.lbMyMonneyBetTai.getComponent(cc.Label).string)
                    Global.TaiXiu.effectThongBaoCuoiGame("Bạn chỉ được đặt 1 cửa")
                    return;
                }
                this._currentLbString = this.lbMoneyBoxXiu;
                this._currentBoxBet = this.boxBetXiu.node
                this.lbMoneyBoxXiu.string = "0";
                this.boxBetTai.node.active = true;
                this.boxBetXiu.node.active = false;
                this._gate = 1;
                break;
            default:
                break;
        }

        if (!this.node.active) {
            Global.UIManager.onEventEnter(this.funEmit = () => { this.sendBetTaiXiu(null, "3") });
            this.node.active = true;
        }

        if (Global.TaiXiu.node.y < (138 - ((cc.winSize.height - 750) / 2))) {
            let action = cc.moveTo(0.3, Global.TaiXiu.node.x, (138 - ((cc.winSize.height - 750) / 2)));
            action.setTag(999);
            Global.TaiXiu.node.stopActionByTag(999);
            Global.TaiXiu.node.runAction(action);
        }
    },
    initEventButton() {
        let length1 = this.nodeKeyboard1.childrenCount;
        let length2 = this.nodeKeyboard2.childrenCount;
        for (let i = 0; i < length1; i++) {
            let child = this.nodeKeyboard1.children[i];
            let button = child.addComponent(cc.Button);
            button.target = child;

            let clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = this.node; // This node is the node to which your event handler code component belongs
            clickEventHandler.component = "KeyboardTaiXiu";// This is the code file name
            clickEventHandler.handler = "onClickKeyBoard";
            clickEventHandler.customEventData = "";

            button.transition = 0;
            button.clickEvents.push(clickEventHandler);
        }

        for (let i = 0; i < length2; i++) {
            let child = this.nodeKeyboard2.children[i];

            let clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = this.node; // This node is the node to which your event handler code component belongs
            clickEventHandler.component = "KeyboardTaiXiu";// This is the code file name
            clickEventHandler.handler = "onClickKeyBoard";



            let button = child.addComponent(cc.Button);
            button.transition = 0;
            button.target = child;
            button.clickEvents.push(clickEventHandler);
        }

    },
    onClickChangeKeyBoard(){
        this._lbGoc = "";
        this.sum = 0;
        this._isKeyBoardType = !this._isKeyBoardType;
        this.updateStateKeyBoard();
        this._currentLbString.string = "0";
    },
    onClickKeyBoard(event, data) {

        let node = event.target;
        //cc.log("chya vao onClick " + node.name);
        let infoString = node.getComponentInChildren(cc.Label).string;
        cc.log("lb click la " + infoString)
        this.sum += this.formatMoneyToNum(infoString);


        if (this.listMoneyDefine.includes(infoString)) {
            this._lbGoc = this.sum;
        } else {
            if (infoString == "<----") {
                this._lbGoc = this._lbGoc.substring(0, this._lbGoc.length - 1);

            } else if (infoString == "#") {
                this._lbGoc = "";
                this.sum = 0;
                this._isKeyBoardType = !this._isKeyBoardType;
                this.updateStateKeyBoard();
            } else {
                if (this._lbGoc.length > 0 || !this.list0Define.includes(infoString)) {
                    
                    this._lbGoc += infoString;
                    cc.log("lb goc la " + this._lbGoc);
                }
            }
        }
        if (this._lbGoc.length < 1) {
            this._currentBoxBet.active = true;
        } else {
            this._currentBoxBet.active = false;
            this._currentLbString.string = Global.formatNumber(this._lbGoc);
        }

    },
    sendBetServerTaiXiu(obj) {
        require("SendRequest").getIns().MST_Client_TaiXiu_Set_Bet(obj);
        this.sum = 0;
        this.currentBoxBet = "";
        this._currentBoxBet.active = true;
        this._lbGoc = "";
    },
    onInputKeyBoard(keyCode) {
        if (this.node.activeInHierarchy) {
            let str = "";
            switch (keyCode) {
                //cc.KEY.
                case cc.KEY.num0:
                    str = "0";
                    break;
                case cc.KEY.num1:
                    str = "1";
                    break;
                case cc.KEY.num2:
                    str = "2";
                    break;
                case cc.KEY.num3:
                    str = "3";
                    break;
                case cc.KEY.num4:
                    str = "4";
                    break;
                case cc.KEY.num5:
                    str = "5";
                    break;
                case cc.KEY.num6:
                    str = "6";
                    break;
                case cc.KEY.num7:
                    str = "7";
                    break;
                case cc.KEY.num8:
                    str = "8";
                    break;
                case cc.KEY.num9:
                    str = "9";
                    break;

                case 48:
                    str = "0";
                    break;
                case 49:
                    str = "1";
                    break;
                case 50:
                    str = "2";
                    break;
                case 51:
                    str = "3";
                    break;
                case 52:
                    str = "4";
                    break;
                case 53:
                    str = "5";
                    break;
                case 54:
                    str = "6";
                    break;
                case 55:
                    str = "7";
                    break;
                case 56:
                    str = "8";
                    break;
                case 57:
                    str = "9";
                    break;
                case cc.KEY.backspace:
                    str = "<----"
                    break
            }

            if (str != "" && str != "<----") {
                if (this._lbGoc.length > 0 || !this.list0Define.includes(str)) {
                    this._lbGoc += str;
                    this._currentBoxBet.active = false;
                    this._currentLbString.string = Global.formatNumber(this._lbGoc);
                }
            } else if (str != "" && str == "<----") {
                this._lbGoc = this._lbGoc.substring(0, this._lbGoc.length - 1);
                if (this._lbGoc.length < 1) {
                    this._currentBoxBet.active = true;
                } else {
                    this._currentBoxBet.active = false;
                    this._currentLbString.string = Global.formatNumber(this._lbGoc);
                }
            }
        }
    },
    sendBetTaiXiu(event, data) {
        switch (data) {
            case "0":
                // this._lbGoc = require("GameManager").getIns().userAg + "";
                this._lbGoc = MainPlayerInfo.ingameBalance + "";
                this._currentBoxBet.active = false;
                this._currentLbString.string = Global.formatNumber(this._lbGoc);
                cc.log("")
                break;
            case "1":
                // if(this._lastBet == 0 ) return;
                // this._lbGoc = this._lastBet * 2 > require("GameManager").getIns().userAg ? require("GameManager").getIns().userAg : this._lastBet * 2;
                this._lbGoc = this._lastBet * 2 > MainPlayerInfo.ingameBalance ? MainPlayerInfo.ingameBalance : this._lastBet * 2;
                this._currentLbString.string = Global.formatNumber(this._lbGoc);
                this._currentBoxBet.active = false;
                break;
            case "2":
                this.currentBoxBet = "";
                this._lbGoc = "";
                this._currentBoxBet.active = true;
                Global.UIManager.offEventEnter(this.funEmit);
                this.node.active = false;
                break;
            case "3":
                let msgData = {};
                msgData[1] = this._gate;
                msgData[2] = parseInt(this._lbGoc);
                this.sendBetServerTaiXiu(msgData);
                this.node.active = false;
                break;
        }

    },
    // onDisable(){
    //     cc.log("disable key board===============================");

    // },
    endTimeBet() {
        this.currentBoxBet = "";
        this._lbGoc = "";
        if (this._currentBoxBet) this._currentBoxBet.active = true;
        this.boxBetXiu.interactable = false;
        this.boxBetTai.interactable = false;
        this.boxBetXiu.node.action = true;
        this.boxBetTai.node.active = true;
        Global.UIManager.offEventEnter(this.funEmit);
        Global.TaiXiu.effectThongBaoCuoiGame("Hết thời gian đặt cược: Cân cửa")
        this.node.active = false;
    },

    startNewGame() {
        this.currentBoxBet = "";
        this.boxBetXiu.interactable = true;
        this.boxBetTai.interactable = true;
    },

    updateStateKeyBoard() {
        if (this._isKeyBoardType) {
            this.nodeKeyboard1.active = true;
            this.nodeKeyboard2.active = false;
        } else {
            this.nodeKeyboard1.active = false;
            this.nodeKeyboard2.active = true;
        }
    },
    formatMoneyToNum(string) {
        string = string.replace("M", "000000");
        string = string.replace("K", "000");
        cc.log("gia tri return la " + parseInt(string));
        return parseInt(string)
    },

    onEnable() {
        // This method is called when the node/component is activated
        console.log("Node is now active");
        // Add your event handling logic here

        Global.TaiXiu.nodeDuDay.active = false;
    },

    onDisable() {
        // This method is called when the node/component is deactivated
        console.log("Node is now inactive");
        // Add your event cleanup logic here

        Global.TaiXiu.nodeDuDay.active = true;
    },


    // update (dt) {},
});
