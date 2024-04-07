
cc.Class({
    extends: cc.Component,

    properties: {
        lbPro: cc.Label,
    },



    onLoad() {
        this.lbPro.string = "0%";
    },

    setPercent(getPercent) {
        if (this.node == null) return;
        if (isNaN(getPercent)) return;
        this.lbPro.string = getPercent + "%";
    }

});
