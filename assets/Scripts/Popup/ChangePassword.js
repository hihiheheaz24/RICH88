// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        passOldIF: cc.EditBox,
        passNewIF: cc.EditBox,
        passNewAgainIF: cc.EditBox,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    ClickConfirmChangePass() {
        if (this.CheckPassword(this.passOldIF.string) && this.SoSanhPassword(this.passNewIF.string, this.passNewAgainIF.string)) {
            this.SendRequestChangePass(this.passOldIF.string, this.passNewIF.string, this.passNewAgainIF.string);
        }
    },

    SendRequestChangePass(oldPass, newPass, newPassAgain) {
        if (this.CheckPassword(newPass) && this.SoSanhPassword(newPass, newPassAgain)) {
            let msgData = {};
            msgData[1] = oldPass;
            msgData[2] = newPass;
            require("SendRequest").getIns().MST_Client_Change_Password(msgData);
            this.ClearIF();
        }
    },

    CheckPassword(pass) {
        if (pass.length < 6) {
            Global.UIManager.showCommandPopup(MyLocalization.GetText("PASS_WORD_MIN_6"), null);
            return;
        }
        if (/^[a-zA-Z0-9]*$/.test(pass) == false) {
            Global.UIManager.showCommandPopup(MyLocalization.GetText("PASS_WORD_SPECIAL"), null);
            return;
        }
        if (/\s/g.test(pass) == true) {
            Global.UIManager.showCommandPopup(MyLocalization.GetText("PASS_WORD_SPACE"), null);
            return;
        }
        return true;
    },

    SoSanhPassword(pass1, pass2) {
        if (pass1 != pass2) {
            Global.UIManager.showCommandPopup(MyLocalization.GetText("PASS_WORD_NOT_SAME"));
            return false;
        }
        else
            return true;
    },

    ClearIF() {
        this.passOldIF.string = "";
        this.passNewIF.string = "";
        this.passNewAgainIF.string = "";
    },

    show(){
        Global.onPopOn(this.node);
    },

    hide(){
        Global.onPopOff(this.node);
    },
    // update (dt) {},
});
