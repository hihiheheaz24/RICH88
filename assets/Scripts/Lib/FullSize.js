cc.Class({
  extends: cc.Component,

  properties: {
    isWithCavans: {
      default: true,
    },
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    if (this.isWithCavans) {
      this.canvas = cc.director.getScene().getChildByName("Canvas");
      // if(!cc.sys.isBrowser)
      this.canvas.on(cc.Node.EventType.SIZE_CHANGED, this.onSizeChange, this);
    } else {
      let cp = this.getComponent(cc.Sprite);
      if (cp) {
        cp.sizeMode = 0;
      }
      this.node.setContentSize(cc.winSize);
    }
  },

  onEnable() {
    // if(!cc.sys.isBrowser)
    this.onSizeChange();
  },
  onSizeChange() {
    let cp = this.getComponent(cc.Sprite);
    if (cp) {
      cp.sizeMode = 0;
    }
    if (this.canvas) {
      this.node.setContentSize(this.canvas.getContentSize().width, this.canvas.getContentSize().height);
    }
  },

  onDisable() {
    if (this.canvas) this.canvas.off(cc.Node.EventType.SIZE_CHANGED, this.onSizeChange, this);
  },

  // update (dt) {},
});
