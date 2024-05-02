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
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    Global.SuportView = this;
  },
  onDestroy() {
    Global.SuportView = null;
  },

  start() {},
  onClickClose() {
    // this.node.active = false;
    Global.onPopOff(this.node);
  },
  show() {
    Global.onPopOn(this.node);
    // this.node.active = true;
    //this.ClickChangeTab(null, this.status);
  },
  ClickBtnMessage() {
    //Global.AudioManager.ClickButton();
    cc.sys.openURL(Global.ConfigLogin.HotSmsFanpage);
  },

  ClickBtnHotLine() {
    //Global.AudioManager.ClickButton();
    if (!Global.CheckFunction(Global.GameConfig.FeatureConfig.OpenFanPageFeature)) return;

    //cc.log(Global.ConfigLogin);
    let phone = Global.ConfigLogin.HotLine;
    if (phone == null || phone == "") return;
    if (cc.sys.isNative) {
      let url = "tel:" + phone;
      cc.sys.openURL(url);
      require("Util").onCallPhone(phone);
    } else {
      Global.UIManager.showConfirmPopup(MyLocalization.GetText("HOT_LINE").replace("%n", phone));
    }
  },

  onClickFanpage() {
    cc.sys.openURL(Global.ConfigLogin.FanpageUrl);
  },

  onClickSupport() {
    cc.sys.openURL(Global.ConfigLogin.HotLine);
  },

  onClickChanel() {
    cc.sys.openURL(Global.ConfigLogin.HotSmsFanpage);
  },

  onClickNull() {
    Global.UIManager.showCommandPopup("Tính năng đang phát triển");
  },

  // update (dt) {},
});
