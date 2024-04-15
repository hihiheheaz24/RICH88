// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
  extends: cc.Component,
  ctor() {
    this.listBezier = [];
    this.currentPointIndex = 0;
    this.statusMoving = false;
    this.playerLoseSapHam = null;
    this.zIndexOrigin = 0;
    this.totalDistance = 0;
    this.hesogiatoc = 0.1;
    this.distanceThreshold = 0;
  },
  properties: {},
  start() {},
  getListBezier(listBezier, statusMoving, playerLoseSapHam, zIndex) {
    Global.AudioManager.playRocketFly();
    this.listBezier = [];
    this.playerLoseSapHam = playerLoseSapHam;
    this.listBezier = listBezier;
    // cc.log("listBezier", this.listBezier);
    this.zIndexOrigin = zIndex;
    this.totalDistance = this.getTotalDistance();
    this.statusMoving = statusMoving;
    this.distanceThreshold = this.calculateDistanceThreshold(this.listBezier);
    // cc.log("distancethreshold", this.distanceThreshold);
  },
  getTotalDistance() {
    let totalDistance = 0;

    for (let i = 1; i < this.listBezier.length - 1; i++) {
      totalDistance += this.listBezier[i].sub(this.listBezier[i + 1]).mag();
    }
    return totalDistance;
  },
  calculateDistanceThreshold(listBezier) {
    let totalDistance = 0;
    for (let i = 1; i < listBezier.length - 1; i++) {
      totalDistance += listBezier[i].sub(listBezier[i + 1]).mag();
    }
    let averageDistance = totalDistance / (listBezier.length - 2);
    return averageDistance;
  },
  update(dt) {
    if (this.statusMoving) {
      if (this.currentPointIndex + 1 >= this.listBezier.length) {
        if (this.playerLoseSapHam) {
          this.scheduleOnce(function () {
            Global.AudioManager.stopRocketFly();
            this.node.parent.parent.setSiblingIndex(this.zIndexOrigin);
            this.node.destroy();
          }, 3);
          this.playerLoseSapHam.showEffectBoom();
          this.node.active = false;
        }
        this.hesogiatoc = 0.1;
        return;
      } else {
        let tagetPosition = this.listBezier[this.currentPointIndex + 1];
        //lấy hướng từ đối tượng hiện tại tới mục tiêu
        let direction = tagetPosition.sub(this.node.position);
        direction.normalizeSelf();
        //tinh toán góc quay vector hướng
        let angle = cc.v2(0, 1).signAngle(direction);
        let degree = cc.misc.radiansToDegrees(angle);
        //đặt góc quay cho đối tượng
        this.node.angle = degree;
        let distance_Threshold = 40;
        let distanceToTarget = tagetPosition.sub(this.node.position).mag();
        let speed = 800 * this.hesogiatoc * (distanceToTarget / this.distanceThreshold);
        // let speed = 500 * this.hesogiatoc;

        let newPosition = this.node.position.add(direction.mul(speed * dt));
        this.node.setPosition(newPosition);
        // Ngưỡng cách gần đúng đích
        if (tagetPosition.sub(this.node.position).mag() < this.distanceThreshold) {
          this.currentPointIndex++;
          if (this.currentPointIndex < 10) {
            this.hesogiatoc += 0.05;
          } else if (this.currentPointIndex >= 10 && this.currentPointIndex < 20) {
            this.hesogiatoc += 0.15;
          } else {
            this.hesogiatoc += 0.25;
          }
        }
      }
    }
  },
});
