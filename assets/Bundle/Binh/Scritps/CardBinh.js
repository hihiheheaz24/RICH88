cc.Class({
  extends: cc.Component,

  properties: {
    alatasCard: cc.SpriteAtlas,
    imgUp: cc.SpriteFrame,
    img: cc.Sprite,
    nodeNhapNhay: cc.Node,
    colorGold: cc.Color,
    mask: cc.Node,
    viensang: cc.Node,
  },

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {},

  ctor() {
    this.id = -1;
    this.cardNumber = -1;
    this.cardFace = -1; // 0 bich // 1 tep // 2 ro // 3 co
    this.isSlect = false;
    this.positionCache = null;
  },
  onVienSang() {
    this.viensang.active = true;
  },
  offVienSang() {
    this.viensang.active = false;
  },
  onSlectCard() {
    this.isSlect = true;
    cc.Tween.stopAllByTarget(this.node);
    cc.tween(this.node)
      .to(0.15, { position: cc.v2(this.positionCache.x, this.positionCache.y + 50) })
      .start();

    if (Global.SamView) {
      Global.SamView.checkActiveBtnPlay();
    }
    if (Global.TienLenMN) {
      Global.TienLenMN.checkActiveBtnPlay();
    }
  },
  unSlectCard() {
    this.isSlect = false;
    cc.Tween.stopAllByTarget(this.node);
    cc.tween(this.node).to(0.15, { position: this.positionCache }).start();
    if (Global.SamView) {
      Global.SamView.checkActiveBtnPlay();
    }
    if (Global.TienLenMN) {
      Global.TienLenMN.checkActiveBtnPlay();
    }
  },
  start() {},
  setCardId(id = -1) {
    this.id = id;
    if (id == -1) return;
    this.converId();
  },
  setCardIdAndOpen(id = -1) {
    if (id == -1 || id == null) {
      this.id = -1;
      this.img.spriteFrame = this.imgUp;
      return;
    }
    this.id = id;
    this.converId();
    this.img.spriteFrame = this.alatasCard.getSpriteFrame(this.getUrlCard());
  },
  setCardIdAndOpenEffect(id = -1) {
    if (id == -1 || id == null) {
      this.id = -1;
      this.img.spriteFrame = this.imgUp;
      return;
    }
    this.id = id;
    let node = this.img.node;
    cc.tween(node)
      .to(0.15, { scaleX: 0.1, skewY: 15 })
      .call(() => {
        this.openCard();
        node.skewY = -15;
      })
      .to(0.1, { scaleX: 1, skewY: 0 }, { easing: "backInOut" })
      .start();
  },
  upCard() {
    this.id = -1;
    this.cardNumber = -1;
    this.cardFace = -1;
    this.img.spriteFrame = this.imgUp;
  },
  SetAngle(angle) {
    this.node.angle = angle;
  },
  openCard() {
    if (this.id == -1) {
      this.img.spriteFrame = this.imgUp;
      return;
    }
    this.img.spriteFrame = this.alatasCard.getSpriteFrame(this.getUrlCard());
  },
  openCardWithEffect() {
    if (this.id == -1) return;
    let node = this.img.node;
    //let scaleCache = node
    cc.tween(node)
      .to(0.15, { scaleX: 0.1, skewY: 15 })
      .call(() => {
        this.openCard();
        node.skewY = -15;
      })
      .to(0.1, { scaleX: 1, skewY: 0 }, { easing: "backInOut" })
      .start();
  },
  openCardWithEffect_swapCard() {
    if (this.id == -1) return;
    let node = this.img.node;
    //let scaleCache = node
    cc.tween(node)
      .to(0.07, { scaleX: 0.1, skewY: 15 })
      .call(() => {
        this.openCard();
        node.skewY = -15;
      })
      .to(0.05, { scaleX: 1, skewY: 0 }, { easing: "backInOut" })
      .start();
  },
  unuse() {
    this.upCard();
    this.img.node.color = cc.Color.WHITE;
    this.nodeNhapNhay.color = cc.Color.WHITE;
    this.positionCache = null;
    cc.Tween.stopAllByTarget(this.img.node);
    cc.Tween.stopAllByTarget(this.node);
    this.node.stopAllActions();
    this.nodeNhapNhay.active = false;
    this.node.angle = 0;
    this.node.scale = 1;
    this.node.position = cc.v2(0, 0);
    this.img.node.scaleX = 1;
    this.img.node.scaleY = 1;
    this.img.node.skewY = 0;
    this.node.opacity = 255;
    this.node.zIndex = 0;
    this.isSlect = false;
  },
  setGrayCard() {
    this.img.node.color = cc.Color.GRAY;
    // this.mask.active = true;
  },
  setNormalCard() {
    this.offLight();
    this.img.node.color = cc.Color.WHITE;
    // this.mask.active = false;
  },
  getUrlCard() {
    this.converId();
    let result = "";
    result = "card_" + this.cardNumber + "_" + this.cardFace;
    // cc.log("URL card", result, this.id);
    return result;
  },
  thoi2() {
    this.nodeNhapNhay.active = true;
    this.nodeNhapNhay.opacity = 255;
    this.nodeNhapNhay.color = cc.Color.RED;
    cc.Tween.stopAllByTarget(this.nodeNhapNhay);
    cc.tween(this.nodeNhapNhay).to(0.5, { opacity: 50 }).to(0.5, { opacity: 255 }).union().repeatForever().start();
  },
  showEffectNhapNhay() {
    this.nodeNhapNhay.active = true;
    this.nodeNhapNhay.opacity = 255;
    cc.Tween.stopAllByTarget(this.nodeNhapNhay);
    cc.tween(this.nodeNhapNhay).to(0.5, { opacity: 50 }).to(0.5, { opacity: 255 }).union().repeatForever().start();
  },
  showLight(opacity) {
    cc.Tween.stopAllByTarget(this.nodeNhapNhay);
    this.nodeNhapNhay.active = true;
    this.nodeNhapNhay.opacity = opacity;
    // this.mask.active = false;
  },
  offLight() {
    this.nodeNhapNhay.active = false;
  },
  converId() {
    this.cardNumber = parseInt(this.id / 10);
    this.cardFace = this.id % 10;
    if (Global.BinhView && Global.BinhView.isTest == true) MainPlayerInfo.CurrentGameCode = CARD_GAME_CODE.BINH;
    switch (MainPlayerInfo.CurrentGameCode) {
      case CARD_GAME_CODE.TLMN:
      case CARD_GAME_CODE.SAM:
        if (this.cardNumber == 14) this.cardNumber = 1;
        if (this.cardNumber == 15) this.cardNumber = 2;
        break;
      case CARD_GAME_CODE.PHOM:
        break;
      case CARD_GAME_CODE.POKER:
        break;

      case CARD_GAME_CODE.BA_CAY:
        break;
      case CARD_GAME_CODE.BINH:
        if (this.cardNumber == 14) this.cardNumber = 1;
        if (this.cardNumber == 15) this.cardNumber = 2;
        break;
      default:
        break;
    }
    // cc.log("cardNumber card face", this.cardNumber, this.cardFace);
  },

  setCardGold() {
    this.img.node.color = this.colorGold;
  },
  setCardNomal() {
    //cc.log("chay vao set nomakl")
    this.img.node.color = cc.Color.WHITE;
  },

  // update (dt) {},
});
