cc.Class({
  extends: cc.Component,

  onLoad() {
    // cc.director.
    let tile = cc.winSize.width / cc.winSize.height;
    // if (!cc.sys.isNative && !cc.sys.isMobile) {

    //   // cc.log(document.body.clientHeight + " mutil la " + cc.Canvas.instance.designResolution.width);
    //   if (document.body.clientHeight >= 720) {
    //     cc.Canvas.instance.designResolution = new cc.Size(document.body.clientWidth, document.body.clientHeight);
    //   } else {
    //     let mutil = cc.Canvas.instance.designResolution.height / document.body.clientHeight;
    //     cc.Canvas.instance.designResolution = new cc.Size(document.body.clientWidth * mutil, document.body.clientHeight * mutil);
    //   }

    //   cc.SizeCanvas = cc.Canvas.instance.designResolution;
    // }
    //  cc.log("nhau vao fit height");
    if (tile >= 16 / 9) {
      //           cc.log("nhau vao fit height");
      cc.Canvas.instance.fitHeight = true;
      cc.Canvas.instance.fitWidth = false;
    } else {
      cc.Canvas.instance.fitHeight = false;
      cc.Canvas.instance.fitWidth = true;
      //        cc.log("nhau vao fit width");
    }

    this.designResolution = cc.size(1080, 1920); // 2220:1080
    this.lastWitdh = 0;
    this.lastHeight = 0;
    this.canvas = this.node.getComponent(cc.Canvas);
    //cc.NGWlog = cc.log;
  },
  update(dt) {
    this.updateCanvas();
  },
  updateCanvas() {
    var frameSize = cc.view.getFrameSize();
    if (this.lastWitdh !== frameSize.width || this.lastHeight !== frameSize.height) {
      this.lastWitdh = frameSize.width;
      this.lastHeight = frameSize.height;

      if (this.designResolution.width / this.designResolution.height > frameSize.width / frameSize.height) {
        var newDesignSize = cc.size(this.designResolution.width, this.designResolution.width * (frameSize.height / frameSize.width));
        this.canvas.designResolution = newDesignSize;
        cc.log("update canvas size: " + newDesignSize);
      } else {
        var newDesignSize = cc.size(this.designResolution.height * (frameSize.width / frameSize.height), this.designResolution.height);
        this.canvas.designResolution = newDesignSize;
        cc.log("update canvas size: " + newDesignSize);
      }
    }
  },
});
