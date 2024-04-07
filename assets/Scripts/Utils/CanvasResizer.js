cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.designResolution = cc.size(1920, 1080)
        this.lastWitdh = 0;
        this.lastHeight = 0;
        this.canvas = this.node.getComponent(cc.Canvas);
    },

    start () {

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


    // update (dt) {},
});
