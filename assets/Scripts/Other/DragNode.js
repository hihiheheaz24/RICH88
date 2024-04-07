cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad() {
        setTimeout(() => {
            this.handleSnap(this.node.position);
        }, 500);
        this.handleMove();
        this.isMoving = false;
        this.checkMovingTimeOut = false;
    },
    handleMove() {
        let orginPos = null;
        let isShootX = 0;
        let isShootY = 0;
        this.node.on(cc.Node.EventType.TOUCH_START, (touch) => {
            cc.log("chay vao touch start")
            orginPos = this.node.position;
            this.node.stopAllActions();
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, (touch) => {
            let delta = touch.getDelta();
            this.node.x += delta.x;
            this.node.y += delta.y;
            // cc.log("!> rogiin pos : ",orginPos)
            // if(!orginPos) orginPos = this.node.position;
            if (Math.sqrt(Math.pow(this.node.x - orginPos.x, 2)) >= 10
                || Math.sqrt(Math.pow(this.node.y - orginPos.y, 2)) >= 10) {
                this.isMoving = true;
            } else {
                this.isMoving = false;
            }
            isShootX = Math.sqrt(Math.pow(delta.x, 2)) >= 20 ? delta.x : 0;
            isShootY = Math.sqrt(Math.pow(delta.y, 2)) >= 20 ? delta.y : 0;
            if (isShootY == 0 && isShootX != 0) isShootY = delta.y;

            if (!this.checkMovingTimeOut) {
                this.isMoving = false;
                this.checkMovingTimeOut = true;
                setTimeout(() => {
                        this.isMoving = true;
                    }, 100);
            }
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_END, (touch) => {
            cc.log("chay vao touch end ")
            orginPos = null;
            let x = this.node.x;
            let y = this.node.y;
            if (isShootX != 0) {
                x = x + (20 * isShootX);
                cc.log('!> shoot X', isShootX, x)
                isShootX = 0;
            }
            if (isShootY != 0) {
                y = y + (20 * isShootY);
                cc.log('!> shoot Y', isShootY, y)
                isShootY = 0;
            }
            this.handleSnap(cc.v2(x, y));

            setTimeout(() => {
                this.isMoving = false; // when touch ended, stop moving]
            }, 500);
            this.checkMovingTimeOut = false;
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_CANCEL, (touch) => {cc.log("chay vao touch cancel ")

            orginPos = null;
            let x = this.node.x;
            let y = this.node.y;
            if (isShootX != 0) {
                x = x + (20 * isShootX);
                cc.log('!> shoot X', isShootX, x)
                isShootX = 0;
            }
            if (isShootY != 0) {
                y = y + (20 * isShootY);
                cc.log('!> shoot Y', isShootY, y)
                isShootY = 0;
            }
            this.handleSnap(cc.v2(x, y));
        }, this);
    },

    handleSnap(_curPos) {
        let curPos = _curPos;
        let x = curPos.x;
        let y = curPos.y;
        let canvas = cc.director.getScene().getChildByName('Canvas');
        let wid = canvas.getContentSize().width / 2;
        let hei = canvas.getContentSize().height / 2;
        let R = this.node.width;
        if (curPos.x >= 0) {
            if (curPos.x !== wid - R + 100) {
                x = wid - R + 100
            }
        } else {
            if (curPos.x !== -wid + R - 100) {
                x = -wid + R - 100
            }
        }

        if (curPos.y >= 0) {
            if (curPos.y >= hei - R + 100) {
                y = hei - R + 100
            }
        } else {
            if (curPos.y <= -hei + R - 100) {
                y = -hei + R - 100
            }
        }
        this.node.stopAllActions();
        this.node.runAction(cc.moveTo(0.25, cc.v2(x, y)).easing(cc.easeBackOut()));
        cc.log("!> handleSnap", x, y)
    },
});
