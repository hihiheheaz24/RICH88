
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        parentBtn:cc.Node,
        btn_odd: cc.Button,
        btn_even: cc.Button,
        btn_all: cc.Button,
        btn_dont: cc.Button,
        //node_guide_1: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.listOdd = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
        this.listEven = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20];
        this.listLineChoose = [...this.listOdd, ...this.listEven];

    },
    start() {
        this.listLineOdd = [];
        this.listLineEven = [];
        let children = this.parentBtn.children;
        for(let i = 0 , l = children.length; i < l; i++){
            let node = children[i];
            if(parseInt(node.name) %2 ==0){
                this.listLineEven.push(node)
            }else{
                this.listLineOdd.push(node)
            }
        }
        this.listAllLine = [...this.listLineOdd, ...this.listLineEven];
        for (let i = 0; i < this.listAllLine.length; i++) {
            this.listAllLine[i].addComponent(cc.Button);
            var clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = this.node; // This node is the node to which your event handler code component belongs
            clickEventHandler.component = "PopupChooseLineCandy";// This is the code file name
            clickEventHandler.handler = "onClickChooseLine";
            clickEventHandler.customEventData = "Single";

            var button = this.listAllLine[i].getComponent(cc.Button);
            button.clickEvents.push(clickEventHandler);
        }
    },
    onClickChooseLine(event, data) {
      //   Global.MiniSlot.playSound(Sound.SOUND_SLOT.CLICK);
        // require("SoundManager1").getIns().playEffect(Sound.SOUND_SLOT.CLICK);
        cc.log("chay vao click choose line")
        switch (data) {
            case "Odd":
                for (let i = 0; i < this.listLineEven.length; i++) {
                    this.listLineEven[i].children[0].color = cc.Color.GRAY;
                    
                }
                for (let i = 0; i < this.listLineOdd.length; i++) {
                    this.listLineOdd[i].children[0].color = cc.Color.WHITE;
                }
                this.listLineChoose = this.listOdd;

                break;
            case "Even":
                for (let i = 0; i < this.listLineEven.length; i++) {
                    this.listLineEven[i].children[0].color = cc.Color.WHITE;
                }
                for (let i = 0; i < this.listLineOdd.length; i++) {
                    this.listLineOdd[i].children[0].color = cc.Color.GRAY;
                }
                this.listLineChoose = this.listEven;
                break;
            case "All":
                for (let i = 0; i < this.listAllLine.length; i++) {
                    this.listAllLine[i].children[0].color = cc.Color.WHITE;
                }
                this.listLineChoose = [...this.listOdd, ...this.listEven];
                break;
            case "Dont":
                for (let i = 0; i < this.listAllLine.length; i++) {
                    this.listAllLine[i].children[0].color = cc.Color.GRAY;
                }
                this.listAllLine[0].color = cc.Color.WHITE;
                this.listLineChoose = [1];
                break;
            case "Single":
                var node = event.target;
                let id = node.name;
                id = parseInt(id);
                if (!this.listLineChoose.includes(id)) {
                    this.listLineChoose.push(parseInt(id));
                    node.children[0].color = cc.Color.WHITE;
                } else {
                    this.listLineChoose.splice(this.listLineChoose.indexOf(id), 1);
                    node.children[0].color = cc.Color.GRAY;
                }

                break;

        }
        Global.MiniSlot.setTxtChooseLine(this.listLineChoose);
        this.setStateBtn(data);

    },
    setStateBtn(data) {
        this.btn_odd.node.color = cc.Color.WHITE;
        this.btn_even.node.color = cc.Color.WHITE;
        this.btn_all.node.color = cc.Color.WHITE;
        this.btn_dont.node.color = cc.Color.WHITE;

        this.btn_odd.interactable = true;
        this.btn_even.interactable = true;
        this.btn_all.interactable = true;
        this.btn_dont.interactable = true;
        switch (data) {
            case "Odd":
                this.btn_odd.node.color = cc.Color.GRAY;
                this.btn_odd.interactable = false;
                break;
            case "Even":
                this.btn_even.node.color = cc.Color.GRAY;
                this.btn_even.interactable = false;
                break;
            case "All":
                this.btn_all.node.color = cc.Color.GRAY;
                this.btn_all.interactable = false;
                break;
            case "Dont":
                this.btn_dont.node.color = cc.Color.GRAY;
                this.btn_dont.interactable = false;
                break;
            case "Single":
                this.btn_odd.interactable = true;
                this.btn_even.interactable = true;
                this.btn_all.interactable = true;
                this.btn_dont.interactable = true;
                break;
        }
    },
    onClose() {
        // Global.MiniSlot.playSound(Sound.SOUND_SLOT.CLICK);
        actionEffectClose(this.node, () => {
            this.node.active = false;
        })

    }

    // update (dt) {},
});
