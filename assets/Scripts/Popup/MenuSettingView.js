// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
	extends: cc.Component,

	properties: {
		// foo: {
		//     // ATTRIBUTES:
		//     default: null,        // The default value will be used only when the component attaching
		//                           // to a node for the first time
		//     type: cc.SpriteFrame, // optional, default is typeof default
		//     serializable: true,   // optional, default is true
		// },
		// bar: {
		//     get () {
		//         return this._bar;
		//     },
		//     set (value) {
		//         this._bar = value;
		//     }
		// },
		iconAmThanh: cc.Sprite,
		sprAmThanh: [cc.SpriteFrame]
	},

	// LIFE-CYCLE CALLBACKS:

	// onLoad () {},

	onLoad() {
		Global.MenuSettingView = this;
	},
	onDestroy() {
		Global.MenuSettingView = null;
	},

	start() {
	},
	ClickBtnSupport() {
		if (!Global.isLogin) {
			Global.UIManager.showCommandPopup(MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		Global.UIManager.showSuportView();
	},
	ClickDangXuat() {
		this.node.active = false;
		if (Global.LobbyView) {
			if (Global.NetworkManager._connect.connectionState !== "Connected") {
				Global.LobbyView.BackEvent();
			} else {
				Global.UIManager.showConfirmPopup(MyLocalization.GetText("QUIT_GAME"), Global.LobbyView.BackEvent, null);
			}
		} else {
			Global.CookieValue = null;
			Global.isLogin = false;
			require("ScreenManager").getIns().LoadScene(SCREEN_CODE.LOGIN);
		}
	},
	ClickBtnHistory() {
		if (!Global.isLogin) {
			Global.UIManager.showCommandPopup(MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		Global.UIManager.showHistoryPopup();
	},
	ClickBtnSetting() {
		if (!Global.isLogin) {
			Global.UIManager.showCommandPopup(MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		//Global.AudioManager.ClickButton();
		Global.UIManager.showSettingPopup();
	},
	onClickClose() {
		Global.onPopOff(this.node);
	},
	show() {
		Global.onPopOn(this.node);
		// this.changeIcon();
	},
	changeIcon(isChange = true) {
		if(isChange) return;
		let isActiveSound = cc.sys.localStorage.getItem("sound");
        let isActiveMusic = cc.sys.localStorage.getItem("music");
		if (isActiveSound == "off" && isActiveMusic == 'off') {
			this.iconAmThanh.spriteFrame = this.sprAmThanh[0];
		}
		else {
			this.iconAmThanh.spriteFrame = this.sprAmThanh[1];
		}
	},
	// update (dt) {},
});
