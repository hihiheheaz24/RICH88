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
  ctor() {
    this.base64 = null;
    this.veriLogin = null;
    this.timeLogin = null;
    this.listSpriteCapcha = [];
    this.spriteFrameCacha = null;
  },
  // LIFE-CYCLE CALLBACKS:
  requestCapcha() {
    require("BaseNetwork").request(Global.ConfigLogin.AuthenGetCaptchaUrl, {}, this.responseServer.bind(this));
  },
  onLoad() {
    cc.game.addPersistRootNode(this.node);
    Global.CapchaController = this;
  },
  onDestroy() {
    this.spriteFrameCacha = null;
    Global.CapchaController = null;
  },
  responseServer(_data) {
    var capcha = JSON.parse(_data);
    cc.log("check data capcha : ", capcha);
    this.base64 = capcha.d[0];
    this.veriLogin = capcha.d[1];
    this.timeLogin = capcha.d[2];
    this.getCapcha(this.base64);
  },

  emitNewCacha() {
    if (this.spriteFrameCacha == null) return;
    for (let i = 0, l = this.listSpriteCapcha.length; i < l; i++) {
      this.listSpriteCapcha[i].spriteFrame = this.spriteFrameCacha.clone();
    }
  },
  dangKy(component) {
    if (!this.listSpriteCapcha.includes(component)) this.listSpriteCapcha.push(component);
  },
  huyDangKy(component) {
    let index = this.listSpriteCapcha.indexOf(component);
    if (index > -1) this.listSpriteCapcha.splice(index, 1);
  },
  getCapcha(base64) {
    if (cc.sys.isNative) {
      const buffer = new Buffer(base64, "base64");
      const len = buffer.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = buffer[i];
      }
      const extName = "png";
      const randomFileName = "base64_img." + extName;
      const dir = `${jsb.fileUtils.getWritablePath()}${randomFileName}`;
      cc.loader.release(dir);
      if (jsb.fileUtils.writeDataToFile(bytes, dir)) {
        cc.loader.load(dir, (err, texture) => {
          if (!err && texture) {
            this.spriteFrameCacha = new cc.SpriteFrame(texture);
            this.emitNewCacha();
          }
        });
      }
    } else {
      var src = "data:image/png;base64," + base64;
      var imgElement = new Image();
      imgElement.src = src;
      setTimeout(() => {
        var sprite = new cc.Texture2D();
        sprite.initWithElement(imgElement);
        sprite.handleLoadedTexture();
        this.spriteFrameCacha = new cc.SpriteFrame(sprite);
        this.emitNewCacha();
      }, 10);
    }
  },

  // update (dt) {},
});
