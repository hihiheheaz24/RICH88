
cc.Class({
    extends: cc.Component,

    properties: {
        lblGold: cc.Label,
    },

    initItem(info) {
        let date = new Date(info.LogDate);
        let lbDate = date.getDate();
        let lbMonth = date.getMonth();
        let lbHour = date.getHours();
        let lbMinute = date.getMinutes();
        let timeLog = lbDate + "/" + lbMonth + " " + lbHour + ":" + lbMinute;

        if (info.RewardType == REWARD_TYPE.INGAME_BALANCE) {
            if (info.ItemType == 0) {
                lblGold.string = Global.formatString("[{0}] nhận {1} {2}", [timeLog, Global.formatNumber(info.RewardAmount), "Xu"]);
            } else if (info.ItemType == 1) {
                lblGold.string = Global.formatString("[{0}] nhận {1} {2} Xu ", [timeLog, "Jackpot", Global.formatNumber(info.RewardAmount)]);
            }
        } else if (info.RewardType == REWARD_TYPE.LIXI) {
            lblGold.string = Global.formatString("[{0}] nhận {1} {2}", [timeLog, Global.formatNumber(info.RewardAmount), "Chìa khóa"]);
        } else if (info.RewardType == REWARD_TYPE.CARD) {
            lblGold.string = Global.formatString("[{0}] nhận {1}", [timeLog, "Thẻ " + info.RewardAmount + "K"]);
        }
    },

});
