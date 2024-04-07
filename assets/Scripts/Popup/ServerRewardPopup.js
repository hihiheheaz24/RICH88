

cc.Class({
    extends: cc.Component,

    properties: {
        textSpin : cc.Label,
        textGold : cc.Label,
        textContent : cc.Label,
    },

    Hide(){
		this.node.active = false;
	},
	
	show(content, currentspin, coin){
        this.node.active = true;
        this.textContent.strin = content;
        // this.textSpin.string = Global.formatNumber(currentspin);
        this.textGold.string = Global.formatNumber(coin);
	},
	
	onDestroy(){
		Global.ServerRewardPopup = null;
	},
});
