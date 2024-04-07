

cc.Class({
    extends: cc.Component,
    ctor() {
        this.mailObject = null;
        this.mailPopup = null;
    },

    properties: {
        headerText: cc.RichText,
        timeText: cc.RichText,
        nodeBg: cc.Sprite,
        sprBgActive: cc.SpriteFrame,
        sprBgInActive: cc.SpriteFrame,
    },

    SetInfo(mailObject, mailPopup) {
        this.mailObject = mailObject;
        this.mailPopup = mailPopup;
        this.headerText.string = Global.formatMail(mailObject.MailHeader);
        this.timeText.string = this.formatTime(mailObject.SendTime);
        if (mailObject.IsReaded == 0) {
            this.nodeBg.spriteFrame = this.sprBgActive;
        }
        else if (mailObject.IsReaded == 1) {
            this.nodeBg.spriteFrame = this.sprBgInActive;
        }
    },

    ShowMess() {
        if (this.mailPopup) this.mailPopup.ShowMailById(this.mailObject.MailId);
        else Global.MailPopup.ShowMailById(this.mailObject.MailId);
        if (this.mailObject.IsReaded == 0) {
            let msgData = {};
            msgData[1] = this.mailObject.MailId;
            require("SendRequest").getIns().MST_Client_Read_Mail(msgData);
            if (Global.LobbyView) {
                Global.LobbyView.UpdateMailStatus();
            }
        }
        if (this.mailObject.IsReaded == 0) {
            this.nodeBg.spriteFrame = this.sprBgInActive;
            this.mailObject.IsReaded = 1;
            this.headerText.string = Global.formatMail(this.mailObject.MailHeader);
            this.timeText.string = this.formatTime(this.mailObject.SendTime);

            Global.LobbyView.UpdateMailStatus();
        }
    },

    formatTime(str) {
        return require("SyncTimeControl").getIns().convertTimeToString((new Date(str)).getTime());
    },

    ClickDeleteMail() {
        Global.UIManager.showConfirmPopup(MyLocalization.GetText("DELETE_MAIL"), () => {
            let msgData = {};
            msgData[1] = this.mailObject.MailId;
            require("SendRequest").getIns().MST_Client_Delete_Mail(msgData);
        }, null);
    },

});
