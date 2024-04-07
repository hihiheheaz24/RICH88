
cc.Class({
    extends: cc.Component,

    properties: {
        icon: cc.Sprite,
        numb: cc.Label,

    },

    FillInfo(rewardType, itemType, prizeValue, store) {
        this.node.active = true;
        store.SetIconItem(this.icon, rewardType, itemType);
        this.numb.string = "+" + Global.formatNumber(prizeValue);
    },
    SetupInfo(time, reward, store) {
        this.node.active = true;
        
        store.SetIconItem(this.icon, reward.RewardType, reward.ItemType);
        this.numb.string = "x" + reward.Amount;

    },
    SetupInfoOnline(reward, index, store) {
        this.node.active = true;
        // if (index <= Global.indexOnlineReward) {
        //     this.itemSprite.spriteFrame = this.sprItemReceived;
        // } else {
        //     this.itemSprite.spriteFrame = this.sprItemNormal;
        // }
        store.SetIconItem(this.icon, reward.RewardType, reward.ItemType);
        this.numb.string = "x" + reward.Amount;
    },
});
