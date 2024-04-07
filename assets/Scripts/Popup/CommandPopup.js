

cc.Class({
	extends: cc.Component,

	properties: {
		// foo: {
		content: cc.Label,
	},

	onClickClose() {
		if (this.event != null)
			this.event();
		this.event = null;

		Global.onPopOff(this.node)
		// let acScaleOut = cc.scaleTo(0.2, 1.3).easing(cc.easeCubicActionIn());
        // let acFadeOut = cc.fadeOut(0.2).easing(cc.easeCubicActionIn());
        // this.node.runAction(cc.spawn(acScaleOut, acFadeOut));
        // setTimeout(() => {
		// 	if(this.node)
		// 		this.node.destroy();
        // }, 200);
	
	},

	show(message, event) {
		Global.onPopOn(this.node);
		cc.log("chay vao show command pooup")
		this.content.string = message;//"<outline color=black width=1>"+message+"</outline>";
		this.event = event;
	},

	start() {

	},

	onDestroy() {
		Global.CommandPopup = null;
	},

	// update (dt) {},
});
