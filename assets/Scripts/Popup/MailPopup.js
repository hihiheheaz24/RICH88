

cc.Class({
    extends: cc.Component,
    properties: {
        // textNullMail: cc.Node,
        listItemMail: require("BaseScrollView"),
        contentMail: cc.Label,
        titleMail: cc.Label,
        timeMail: cc.Label,
    },

    show() {
        Global.onPopOn(this.node);
        setTimeout(() => {
            this.SetInfoMail();
            cc.log("Check length : ",  this.listItemMail.content.children.length)
            if(this.listItemMail.content.children.length > 0){
                this.listItemMail.content.children[0].getComponent("ItemMail").onClickShowMail();
            }    
        }, 0);

    
      
    },

    SetInfoMail() {
        this.listItemMail.resetScr();
        this.listItemMail.init(MainPlayerInfo.listMail, MainPlayerInfo.listMail.length * 181 , 181);
    },
    
    Hide() {
        Global.onPopOff(this.node);
    },

    onDestroy() {
        Global.MailPopup = null;
    },
});
