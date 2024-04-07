
cc.Class({
    extends:  require("ParentChangePositionEDB"),

    properties: {
        inputNickName: cc.EditBox,
    },

    onClickConfirm() {
        this.event(this.inputNickName.string);
      //  this.Hide();
    },
    
    show(accountId, event) {
        this.inputNickName.string = accountId;
        this.event = event;
    },
    
    start() {
        Global.SetNamePopup = this;
        this.resignEdb(this.inputNickName);
    },
    Hide() {
        this.node.active = false;
    },
    // update (dt) {},
});
