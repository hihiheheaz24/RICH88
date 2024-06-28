cc.Class({
    extends: cc.Component,

    properties: {
        labelSess: cc.Label,
        labelTime: cc.Label,
        labelSub: cc.Label,
        labelAdd: cc.Label,
        labelGold: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    initItem(info) {
        let date = new Date(info.CreatedAt);
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();
        if (day < 10) {
            day = "0" + day;
        }
        if (month < 10) {
            month = "0" + month;
        }
        if (hours < 10) {
            hours = "0" + hours;
        }
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        this.labelSess.string = "#" + info.TurnId;
        this.labelTime.string = day + "/" + month + " " + hours + ":" + minutes + ":" + seconds;
        this.labelSub.string = "-" + this.formatGold(info.TotalBet);
        this.labelAdd.string = "+" + this.formatGold(info.Prize);
        this.labelGold.string = this.formatGold(info.AccountBalance);
    },

    formatGold(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },

    // update (dt) {},
});
