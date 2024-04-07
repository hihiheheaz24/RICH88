
cc.Class({
    extends: cc.Component,

    ctor() {
        this.isInit = false;
        this._data = null;
    },

    properties: {
        element1: cc.Label,
        element2: cc.Label,
        element3: cc.Label,
        element4: cc.Label,
        element5: cc.Label,
        element6: cc.Label,
    },

    Init() {
        this.isInit = true;
        // to do here
    },

    SetInfo(data) {
        if (!this.isInit)
            this.Init();

        this._data = data;
        this.element1.string = data.LogActionId.toString();
        this.element2.string = data.CardSeri + "\n" + data.CardCode;
        this.element3.string = Global.formatPrice(data.CardAmount);
        this.element4.string = data.Status == 1 ? "Thành Công" : "Thất Bại";
        this.element5.string = Global.formatTime(data.UpdateTime);
        this.element6.string = data.Description;
    },




});
