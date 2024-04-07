cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    setInfo(info) {
        let result = info.LocationIDWin == 1 ? "Xỉu" : "Tài";
        let str = `#${info.GameSessionID} ${result} ${info.DiceSum} - (${info.Dice1},${info.Dice2},${info.Dice3})`;
        this.getComponentInChildren(cc.Label).string = str;
    }

    // update (dt) {},
});
