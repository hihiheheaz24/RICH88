cc.Class({
    extends: cc.Component,

    properties: {
        listItemSuggest : [cc.Node],
        itemSuggest : cc.Node,
        inputValue : cc.EditBox
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Global.CashOutPartner = this;
    },

    start () {

    },

    show(){
        Global.onPopOn(this.node);
        this.genListSuggestCashOut();
    },

    close(){
        Global.onPopOff(this.node)
    },

    sendCashOutPartner(){
        let mystr = this.inputValue.string;
        let split_str = mystr.replace(/[^0-9]/g, '');

		let msg = {}
		msg[1] = parseInt(split_str);
		require("SendRequest").getIns().MST_Client_Cash_Out_To_Partner(msg);
		this.inputValue.string = ""
	},

    genListSuggestCashOut(){
        for (let i = 0; i < this.listItemSuggest.length; i++) {
            const item = this.listItemSuggest[i];

            let mystr = item.getComponent(cc.Label).string;
            let split_str = mystr.replace(/[^0-9]/g, '');
            cc.log("check valie  : ", parseInt(split_str))

            if (split_str > MainPlayerInfo.ingameBalance)
                item.active = false;
        }
    },

    onClickSuggest(event, data){
        this.inputValue.string = Global.formatNumber(data);
    },

    onEdbBegin(){
        // this.inputValue.string = "";
    },

    onEdbChange(sender, text){
        let mystr = text.string;
        let split_str = mystr.replace(/[^0-9]/g, '');
        let value = parseInt(split_str);

        if(value >  MainPlayerInfo.ingameBalance){
            this.inputValue.string = Global.formatNumber(MainPlayerInfo.ingameBalance)
        }
        else{
            this.inputValue.string = Global.formatNumber(value)
        }
        if (cc.sys.isBrowser) {
            this.inputValue.focus();
        }

    },

    onClickAllIn(){
        this.inputValue.string = Global.formatNumber(MainPlayerInfo.ingameBalance)
    },

    // update (dt) {},
});
