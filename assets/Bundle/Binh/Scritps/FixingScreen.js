// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
  extends: cc.Component,
  ctor() {
    this.statusAnNotyfi = 0;
  },
  properties: {},
  onLoad() {
    Global.FixingScreen = this;
  },
  Show() {},
  Hide() {
    cc.log("off popup");
    Global.onPopOff(this.node);
  },
  onClickOffNotyfi() {
    cc.sys.localStorage.setItem("Fixing_Status", 1);
    this.Hide();
  },
  start() {},
});
