cc.Class({
  extends: cc.Component,

  properties: {
    iconRank: cc.Sprite,
    lbHang: cc.Label,
    lbName: cc.Label,
    lbMonney: cc.Label,
    sprFrameRank1: cc.SpriteFrame,
    sprFrameRank2: cc.SpriteFrame,
    sprFrameRank3: cc.SpriteFrame,
    sprFrameRank4: cc.SpriteFrame,
    sprFrameRank5: cc.SpriteFrame,
  },

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {},

  initItem(info, xephang) {
    switch (xephang) {
      case 1:
        this.lbHang.node.active = false;
        this.iconRank.node.active = true;
        this.iconRank.spriteFrame = this.sprFrameRank1;
        break;
      case 2:
        this.lbHang.node.active = false;
        this.iconRank.node.active = true;
        this.iconRank.spriteFrame = this.sprFrameRank2;
        break;
      case 3:
        this.lbHang.node.active = false;
        this.iconRank.node.active = true;
        this.iconRank.spriteFrame = this.sprFrameRank3;
        break;
      default:
        this.lbHang.node.active = true;
        this.lbHang.string = xephang;
        this.iconRank.node.active = false;
        break;
    }
    this.lbName.string = info.Username || info.Nickname;
    this.lbMonney.string = Global.formatNumber(info.PrizeValue);
  }

  // update (dt) {},
});
