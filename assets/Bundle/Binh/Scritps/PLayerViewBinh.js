const { callbackify } = require("util");

var TypeAnTrang = {
  BA_SANH: 0,
  BA_THUNG: 1,
  SAU_DOI: 2,
  NAM_DOI_1_XAM: 3,
  DONG_MAU: 4,
  SANH_RONG: 5,
  RONG_CUON: 6,
  UNKNOWN: 7,
};
var TypeStrongCard = {
  MauThau: 1,
  Doi: 2,
  Thu: 3,
  Xam: 4,
  Sanh: 5,
  Thung: 6,
  CuLu: 7,
  Tuqui: 8,
  ThungPhaSanh: 9,
  ThungPhaSanhLon: 10,
};

cc.Class({
  extends: cc.Component,
  properties: {
    bgNameShowChi_userOther: cc.SpriteFrame,
    bgNameShowChi_playerMain: cc.SpriteFrame,
    listPosShowMoneyEndGame: [cc.Vec2],
    _isPlaying: false,
    _nameUser: "",
    _gold: 0,
    id: 0,
    iconCard: null,
    indexInTable: 0,
    nodeEmoji: null,
    fullName: null,
    nodeText: null,
    randomColor: null,
    position: -1,
    listCard: [],
    listChip: [],
    listCardCurrentSlect: [],
    listCardIdForReconnect: [],
    listCardShowResultHistory: [],
    numberCard: 0,
    isFrirtTurn: false,
    isTurn: false,
    nodeAnTrang: cc.Node,
    nameUser: {
      get() {
        return this._nameUser;
      },
      set(value) {
        this._nameUser = value;
        if (value.length >= 15) {
          this.lbName.string = value.substring(0, 15) + "...";
        } else {
          this.lbName.string = value;
        }
      },
    },

    gold: {
      get() {
        return this._gold;
      },
      set(value) {
        this._gold = value;
        this.lbGold.setMoney(value);
      },
    },
    skeTime: sp.Skeleton,

    lbName: cc.Label,
    lbGold: require("LbMonneyChange"),
    avatar: cc.Sprite,
    iconThoatBan: cc.Node,
    imgCountDown: cc.Sprite,
    nodeParentText: cc.Node,
    spWin: cc.SpriteFrame,
    spLost: cc.SpriteFrame,
    spCong: cc.SpriteFrame,
    spAnTrang: cc.SpriteFrame,
    spBoLuot: cc.SpriteFrame,
    _moneyEarnCardCahe: 0,
    avatarBG: cc.Node,
    ringAvatar: cc.Node,
    rocketNode: cc.Node,
    rocketAtlas: cc.SpriteAtlas,
    boomNode: cc.Node,
    boomAtlas: cc.SpriteAtlas,
    posTagetRocketFly: cc.Node,
    fontPointLost: cc.Font,
    fontPointWin: cc.Font,
    parentEffect: cc.Node,
    nodeXepXong: cc.Node,
    nodeDangXep: cc.Node,
    winner: cc.Node,
    loser: cc.Node,
    nodeLbGold: cc.Label,
    goldParent: cc.Node,
    //set show result history
    id_showHistory: 0,
    fullName_showHistory: null,
    nameUser_showHistory: {
      get() {
        return this._nameUser;
      },
      set(value) {
        this._nameUser = value;
        if (value.length >= 20) {
          this.lbName.string = value.substring(0, 20) + "...";
        } else {
          this.lbName.string = value;
        }
      },
    },
    gold_showHistory: {
      get() {
        return this._gold;
      },
      set(value) {
        this._gold = value;
        this.lbGold.setMoney(value);
      },
    },
    position_showHistory: -1,
    indexTableView_showHistory: 0,
    isPlaying_showHistory: false,
    indexInTable_showHistory: 0,
  },
  ctor() {
    this.isMauBinh = false;
    this.isBinhLung = false;
    this.isCard = false;
    this.isStoreDone = false;
    this.listChiIdCard = [null, null, null];
    this.cardChi0 = [];
    this.cardChi1 = [];
    this.cardChi2 = [];
    this.listLbPoint = [];
    this.totalPoint = 0;
    this.currentPoint = 0;
    this.spStrongCard = null;
    this.pointAt = 0;
    this.isToiTrang = false;
    this.toiTrangType = 0;
    this.toiTrangType_showHistory = 0;
    this.handCards = [];
    this.isPlaying = false;
    this.NumberOfCards = 0;
    this.isFakeSwapCard = false;
    this.pointSoChiOrigin = 0;
    this.controPosX1 = 500;
    this.controPosY1 = 500;
    this.controPosX2 = 200;
    this.controPosY2 = 200;
    this.originZIndex = 0;
    this.PointNumber = 30;
    this.minTime = 2;
    this.maxTime = 4;
  },
  onLoad() {
    for (let i = 0; i < this.listPosShowMoneyEndGame.length; i++) {
      const objPos = this.listPosShowMoneyEndGame[i];
      if (cc.winSize.width / 1080 > 1) {
        objPos.x = objPos.x * (cc.winSize.width / 1080);
      }
    }
    this.timer = 0;
    // Random thời gian đầu tiên để swap card
    this.nextLaunchTime = this.randomLaunchTime();
  },
  start() {
    this.originZIndex = this.node.parent.getSiblingIndex();
    // cc.log("origin zindex", this.originZIndex);
  },
  randomLaunchTime() {
    return Math.random() * (this.maxTime - this.minTime) + this.minTime;
  },
  // LIFE-CYCLE CALLBACKS:
  getCardById(id = -1, isRemoveFromMe = false) {
    for (let i = this.listCard.length - 1; i >= 0; i--) {
      let card = this.listCard[i];
      if (card.id == id) {
        let indexOfCardSlect = this.listCardCurrentSlect.indexOf(card);
        if (indexOfCardSlect > -1) this.listCardCurrentSlect.splice(indexOfCardSlect, 1);

        if (isRemoveFromMe) {
          this.listCard.splice(i, 1);
        }
        return card;
      }
    }
    return null;
  },
  onClickAvata() {
    // if (this.indexInTable == 0) return; // isMe
    //  Global.GameView.showInfoPlayerTLMN(this.id);
    Global.UIManager.showProfilePopup(0.6, this.indexInTable, this.id);
  },
  initPlayer(data) {
    cc.log("initPlayer", data.NickName, data.AccountId);
    this.NumberOfCards = data.NumberOfCards;
    this.id = data.AccountId;
    this.fullName = data.NickName;
    this.nameUser = data.NickName;
    this.gold = data.Cash;
    this.position = data.Position;
    this.indexInTable = 0;
    this._isPlaying = data.IsReady;
    this.isStoreDone = data.IsSortedDone;
    this.updateAvata();
    if (data.NumberOfCards) this.numberCard = data.NumberOfCards;
    if (data.HandCards && data.HandCards.length > 0) {
      this.listCardIdForReconnect = data.HandCards;
      this.isCard = true;
    } else {
      this.isCard = false;
    }
    this.nodeXepXong.active = false;
    this.nodeDangXep.active = false;
    this.isToiTrang = data.IsToiTrang;
    this.toiTrangType = data.ToiTrangType;
    if (data.SuggestPlan && data.SuggestPlan.length > 0) this.suggestPlan = data.SuggestPlan;

    this.randomColor = new cc.Color({ r: Global.RandomNumber(0, 255), g: Global.RandomNumber(0, 255), b: Global.RandomNumber(0, 255), a: 255 });
  },
  initShowPlayer(data) {
    this.id_showHistory = data.AccountId;
    // cc.log("id_showHistory", this.id_showHistory);
    this.fullName_showHistory = data.NickName;
    this.nameUser_showHistory = data.NickName;
    this.gold_showHistory = data.Cash;
    this.indexInTable = 0;
    this.position_showHistory = data.Position;
    this.updateAvata_showHistory();
    this.nodeXepXong.active = false;
    this.nodeDangXep.active = false;
    this.toiTrangType_showHistory = data.toiTrangType;
    if (data.HandCards && data.HandCards.length > 0) this.listCardShowResultHistory = data.HandCards;
  },
  dangKyThoatBan(isStatus) {
    // cc.log("trang thai dang ky la " + isStatus);
    this.iconThoatBan.active = isStatus;
  },

  onChonCard(card) {
    if (card.isSlect) return;
    this.listCardCurrentSlect.push(card);
    card.onSlectCard();
  },
  boLuot() {
    let node = this.getNodeTxt("bo_luot");
    if (node) {
      node.active = true;
      this.nodeBoLuot = node;
    }
    this.avatar.node.color = cc.Color.GRAY;
  },
  resetNewturn() {
    if (this.nodeBoLuot) this.nodeBoLuot.active = false;
    this.avatar.node.color = cc.Color.WHITE;
    this.winner.active = false;
    this.loser.active = false;
  },
  boChonCard(card) {
    if (!card.isSlect) return;
    let index = this.listCardCurrentSlect.indexOf(card);
    if (index > -1) this.listCardCurrentSlect.splice(index, 1);
    card.unSlectCard();
  },
  boChonAllCard() {
    for (let i = 0, l = this.listCardCurrentSlect.length; i < l; i++) {
      this.boChonCard(this.listCardCurrentSlect[0]);
    }
  },
  getNodeTxt(str) {
    return cc.find(str, this.nodeParentText);
  },
  getListIdCardSlect() {
    let listTemp = [];
    for (let i = 0, l = this.listCardCurrentSlect.length; i < l; i++) {
      listTemp.push(this.listCardCurrentSlect[i]);
    }

    listTemp.sort((a, b) => a.node.zIndex - b.node.zIndex);
    let listReturn = [];

    for (let i = 0, l = listTemp.length; i < l; i++) {
      listReturn.push(listTemp[i].id);
    }

    return listReturn;
  },

  getListIdCurrentCard() {
    let listReturn = [];
    for (let i = 0, l = this.listCard.length; i < l; i++) {
      listReturn.push(this.listCard[i].id);
    }
    return listReturn;
  },
  sortCardWithListCardId(listCardId) {
    for (let i = 0, l = listCardId.length; i < l; i++) {
      let id = listCardId[i];
      let temp = this.listCard[i];
      for (let c = 0, l2 = this.listCard.length; c < l2; c++) {
        if (id == this.listCard[c].id) {
          this.listCard[i] = this.listCard[c];
          this.listCard[c] = temp;
          break;
        }
      }
    }
  },

  changeMoneyEndGame(money, cash) {
    let delayGoldFly = 0.01;
    let delayGoldFly2 = 0.01;
    let delay = 0.05;
    let delay2 = 0.05;
    // cc.log("cash cash total", cash);
    this.gold = cash;
    if (money == 0) return;
    this.lbPointAt = null;
    let font = money > 0 ? this.fontPointWin : this.fontPointLost;
    if (money < 0) {
      let playerWins = [];
      let timeGoldFly = 0;
      if (Global.BinhView.listPlayerWin.length > 0) {
        playerWins = Global.BinhView.listPlayerWin;
        // cc.log("playerWins list", playerWins);
      }
      let nodeChipParent = new cc.Node();
      this.node.addChild(nodeChipParent);
      nodeChipParent.setPosition(0, 0);
      for (let i = 0; i < 10; i++) {
        let nodeChip = Global.BinhView.pool.getChip();
        if (nodeChip) {
          nodeChipParent.addChild(nodeChip);
          nodeChip.setPosition(0, 0);
        }
      }
      let childGoldPly = nodeChipParent.children;
      // cc.log("ChildGolPly", childGoldPly);
      for (let i = 0; i < childGoldPly.length; i++) {
        let nodeChild = childGoldPly[i];
        let posTagetGoldFly = Global.getPostionInOtherNode(childGoldPly[i].parent, Global.BinhView.posTagetGoldFly);
        let distance2Point = Global.distanceBetweenPoints(nodeChild.position, posTagetGoldFly);
        let speedFly = 2200;
        timeGoldFly = distance2Point / speedFly;
        // cc.log("timeGlodFly", timeGoldFly);
        cc.Tween.stopAllByTarget(nodeChild);
        cc.tween(nodeChild)
          .delay(delayGoldFly)
          .to(timeGoldFly, { position: posTagetGoldFly })
          .call(() => {})
          .start();
        delayGoldFly += delay;
      }
      this.scheduleOnce(function () {
        for (let j = 0; j < playerWins.length; j++) {
          let nodeSpace = new cc.Node();
          Global.BinhView.node.addChild(nodeSpace);
          nodeSpace.setPosition(0, 0);
          for (let i = 0; i < 10; i++) {
            let ChipNode = Global.BinhView.pool.getChip();
            nodeSpace.addChild(ChipNode);
            ChipNode.setPosition(0, 0);
          }
          delayGoldFly2 = 0.03;
          let childsChip = nodeSpace.children;
          for (let i = 0; i < childsChip.length; i++) {
            let nodeChild1 = childsChip[i];
            let posTagetGoldFly1 = Global.getPostionInOtherNode(nodeChild1.parent, playerWins[j].node);
            let distance2Point = Global.distanceBetweenPoints(nodeChild1.position, posTagetGoldFly1);
            let speedFly = 2000;
            timeGoldFly = distance2Point / speedFly;
            // cc.log("timeGlodFly", timeGoldFly);
            cc.Tween.stopAllByTarget(nodeChild1);
            cc.tween(nodeChild1)
              .delay(delayGoldFly2)
              .to(timeGoldFly, { position: posTagetGoldFly1 })
              .call(() => {
                Global.BinhView.pool.putChip(nodeChild1);
                if (i == childsChip.length - 1) {
                  nodeSpace.destroy();
                }
              })
              .start();
            delayGoldFly2 += delay2;
          }
        }
      }, 1);
      this.scheduleOnce(function () {
        let childChip = nodeChipParent.children;
        for (let i = 0; i < childChip.length; i++) {
          let child = childChip[i];
          Global.BinhView.pool.putChip(child);
        }
        nodeChipParent.destroy();
      }, 1.7);
    }
    let nodeLb = this.nodeLbGold.node.parent;
    let lbCp = this.nodeLbGold;
    // lbCp.resetLb();

    let strTem = money < 0 ? "" : "+";
    let convertMoney = Global.formatMoneyChip(money);
    // lbCp.setMoney(money , false , strTem);
    lbCp.string = strTem + convertMoney;

    this.nodeLbGold.fontSize = 30;
    this.nodeLbGold.font = font;
    this.nodeLbGold.spacingX = 0;
    // node.parent = this.node//Global.BinhView.parentEffect;
    // cc.log("chay vao sday set tiebn bay");
    nodeLb.position = this.listPosShowMoneyEndGame[this.indexInTable];
    nodeLb.scale = 0;
    nodeLb.active = true;
    cc.tween(nodeLb)
      .to(0.3, { scale: 1 })
      .delay(5)
      .call(() => {
        // nodeLb.active = false;
        // Global.BinhView.pool.putText(node);
      })
      .start();
    this.nodeMoneyChangeEndGame = nodeLb;
  },
  changeMoneyEndGame_showHistoryRound(money, cash) {
    let delayGoldFly = 0.03;
    let delay = 0.1;
    // cc.log("cash cash total", cash);
    this.gold = cash;
    if (money == 0) return;
    // if (this.lbPointAt) this.lbPointAt.node.destroy();
    this.lbPointAt = null;
    let font = money > 0 ? this.fontPointWin : this.fontPointLost;
    let nodeLb = this.nodeLbGold.node.parent;
    let lbCp = this.nodeLbGold;
    // lbCp.resetLb();

    let strTem = money < 0 ? "" : "+";
    let convertMoney = Global.formatMoneyChip(money);
    // lbCp.setMoney(money , false , strTem);
    lbCp.string = strTem + convertMoney;

    this.nodeLbGold.fontSize = 30;
    this.nodeLbGold.font = font;
    this.nodeLbGold.spacingX = 0;
    // node.parent = this.node//Global.BinhView.parentEffect;
    // cc.log("chay vao sday set tiebn bay");
    nodeLb.position = this.listPosShowMoneyEndGame[this.indexInTable];
    nodeLb.scale = 0;
    nodeLb.active = true;
    cc.tween(nodeLb)
      .to(0.3, { scale: 1 })
      .delay(5)
      .call(() => {
        // nodeLb.active = false;
        // Global.BinhView.pool.putText(node);
      })
      .start();
    this.nodeMoneyChangeEndGame = nodeLb;
  },
  updateAvata() {
    this.avatar.node.active = true;
    // cc.log("set avatar by id", this.id);
    Global.GetAvataById(this.avatar, this.id);
    this.avatar.node.scale = cc.v2(0.9, 0.9);
  },
  updateAvata_showHistory() {
    Global.GetAvataById(this.avatar, this.id_showHistory);
    this.avatar.node.scale = cc.v2(0.9, 0.9);
    this.ringAvatar.scale = cc.v2(0.9, 0.9);
  },
  resetZindexNode() {
    if (this.originZIndex != 0) {
      this.node.parent.setSiblingIndex(this.originZIndex);
      // cc.log("zindexOrigin", this.node.parent.getSiblingIndex());
    }
  },
  setBgInfo() {
    if (this.indexInTable === 3) {
      this.lbName.node.parent.scale = cc.v2(1.3, 1.3);
      this.lbName.node.scale = cc.v2(1, 1);
      this.lbGold.node.scale = cc.v2(1, 1);
    } else {
      this.lbName.node.parent.scale = cc.v2(1.3, 1.3);
      this.lbName.node.scale = cc.v2(1, 1);
      this.lbGold.node.scale = cc.v2(1, 1);
      this.nodeXepXong.scale = cc.v2(1, 1);
      this.nodeDangXep.scale = cc.v2(1, 1);
    }

    if (this.indexInTable === 0) {
      this.nodeXepXong.position = cc.v2(85, 400);
      this.nodeXepXong.getComponent(cc.Sprite).spriteFrame = null;
      // this.nodeDangXep.position = cc.v2(85, 560);
    }
  },

  hideUser() {
    this.lbName.node.parent.active = false;
    this.avatar.node.active = false;
    this.ringAvatar.active = false;
    this.avatarBG.active = false;
  },
  hideUser_showHistory() {
    this.lbName.node.parent.active = false;
    this.avatar.node.active = false;
    this.ringAvatar.active = false;
    this.avatarBG.active = false;
    this.offTextEffect();
  },

  showInfo() {
    this.lbName.node.parent.active = true;
    this.ringAvatar.active = true;
    this.avatar.node.active = true;
    this.avatarBG.active = true;
  },

  setTurn(time) {
    // cc.Tween.stop
    // this.skeTime.node.active = true;
    // this.skeTime.timeScale = 10/time;
    // this.skeTime.setAnimation(0 ,"run_10s");
    cc.tween(this.node).to(0.08, { scale: 1.3 }).to(0.08, { scale: 1 }).start();
    this.imgCountDown.node.active = true;
    this.imgCountDown.fillRange = 1;
    cc.tween(this.imgCountDown)
      .to(time, { fillRange: 0 })
      .call(() => {
        this.imgCountDown.node.active = false;
        // this.skeTime.node.active = false;
      })
      .start();
    if (this._isMe) {
      Global.AudioManager.playTurn();
      this.scheduleOnce(
        (this.funPlaySOund = () => {
          Global.AudioManager.playCountDown();
        }),
        time - 3
      );
    }
  },
  endTurn() {
    if (this._isMe) {
      this.unschedule(this.funPlaySOund);
      if (Global.AudioManager) Global.AudioManager.stopCountDown();
    }
    this.imgCountDown.node.active = false;
    // this.skeTime.node.active = false;
    this.isFrirtTurn = false;
    cc.Tween.stopAllByTarget(this.node);
    cc.Tween.stopAllByTarget(this.imgCountDown);
  },
  unuse() {
    cc.Tween.stopAllByTarget(this.node);
    this.node.setPosition(0, 0);
    if (this.nodeEmoji) this.nodeEmoji.destroy();
    this.nodeEmoji = null;
    if (this.nodeText) this.nodeText.destroy();
    this.nodeText = null;
    this.endTurn();
  },

  creatNodeWithSp(spriteFrame) {
    let node = new cc.Node();
    let cpSp = node.addComponent(cc.Sprite);
    cpSp.spriteFrame = spriteFrame;
    return node;
  },

  showXepXong() {
    cc.log("show xep xong", this.nameUser);
    this.nodeDangXep.active = false;
    this.nodeXepXong.active = true;
    cc.log("this.indexInTable", this.indexInTable);
    let posTaget = this.listPosShowMoneyEndGame[this.indexInTable];
    if (this.indexInTable == 0) {
      this.nodeXepXong.position = cc.v2(posTaget.x - 470, posTaget.y);
    } else if (this.indexInTable == 1) {
      this.isFakeSwapCard = false;
      this.nodeXepXong.position = cc.v2(posTaget.x - 290, posTaget.y - 60);
    } else if (this.indexInTable == 2) {
      this.isFakeSwapCard = false;
      this.nodeXepXong.position = cc.v2(posTaget.x - 290, posTaget.y - 50);
    } else if (this.indexInTable == 3) {
      this.isFakeSwapCard = false;
      this.nodeXepXong.position = cc.v2(posTaget.x + 290, posTaget.y - 60);
    }
  },

  showDangXep() {
    cc.log("show đang xep", this.nameUser);
    this.nodeDangXep.active = true;
    this.nodeXepXong.active = false;
    cc.log("this.indexInTable", this.indexInTable);
    let posTaget = this.listPosShowMoneyEndGame[this.indexInTable];
    if (this.indexInTable == 0) {
      this.nodeDangXep.position = cc.v2(posTaget.x - 470, posTaget.y);
    } else if (this.indexInTable == 1) {
      this.nodeDangXep.position = cc.v2(posTaget.x - 290, posTaget.y - 60);
      this.isFakeSwapCard = true;
    } else if (this.indexInTable == 2) {
      this.nodeDangXep.position = cc.v2(posTaget.x - 290, posTaget.y - 50);
      this.isFakeSwapCard = true;
    } else if (this.indexInTable == 3) {
      this.nodeDangXep.position = cc.v2(posTaget.x + 290, posTaget.y - 60);
      this.isFakeSwapCard = true;
    }
  },

  resetXepXong() {
    this.isFakeSwapCard = false;
    this.nodeDangXep.active = false;
    this.nodeXepXong.active = false;
  },

  setupCard3ChiWithStartGame() {
    let listConfigCard = Global.BinhView.cardController.listConfigCard[this.indexInTable];
    let firtChi0 = listConfigCard[0];
    let firtChi1 = listConfigCard[3];
    let firtChi2 = listConfigCard[8];
    let delay = 0.05;
    let currentIndex = 0;
    for (let i = 0, l = this.cardChi0.length; i < l; i++) {
      let objCardConfigPosAndAngle = listConfigCard[currentIndex];
      let posTarget = cc.v2(objCardConfigPosAndAngle.position.x, objCardConfigPosAndAngle.position.y);
      let cardNode = this.cardChi0[i].node;
      cardNode.x = firtChi0.position.x;
      cardNode.y = firtChi0.position.y;
      cardNode.scale = 0.4;
      cardNode.angle = firtChi0.angle;
      cardNode.opacity = 0;
      cc.tween(cardNode)
        .delay(delay * (i + 1))
        .to(0.2, { angle: objCardConfigPosAndAngle.angle, position: posTarget, opacity: 255 })
        .start();

      cc.tween(cardNode)
        .delay(delay * i)
        .to(0.5, { opacity: 255 })
        .start();

      currentIndex++;
    }
    for (let i = 0, l = this.cardChi1.length; i < l; i++) {
      let objCardConfigPosAndAngle = listConfigCard[currentIndex];
      let posTarget = cc.v2(objCardConfigPosAndAngle.position.x, objCardConfigPosAndAngle.position.y);
      let cardNode = this.cardChi1[i].node;
      cardNode.x = firtChi1.position.x;
      cardNode.y = firtChi1.position.y;
      cardNode.angle = firtChi1.angle;
      cardNode.opacity = 0;
      cardNode.scale = 0.4;
      cc.tween(cardNode)
        .delay(delay * i)
        .to(0.2, { angle: objCardConfigPosAndAngle.angle, position: posTarget, opacity: 255 })
        .start();

      cc.tween(cardNode)
        .delay(delay * i)
        .to(0.5, { opacity: 255 })
        .start();
      currentIndex++;
    }
    for (let i = 0, l = this.cardChi2.length; i < l; i++) {
      let objCardConfigPosAndAngle = listConfigCard[currentIndex];
      let posTarget = cc.v2(objCardConfigPosAndAngle.position.x, objCardConfigPosAndAngle.position.y);
      let cardNode = this.cardChi2[i].node;
      cardNode.x = firtChi2.position.x;
      cardNode.y = firtChi2.position.y;
      cardNode.angle = firtChi2.angle;
      cardNode.opacity = 0;
      cardNode.scale = 0.4;
      cc.tween(cardNode)
        .delay(delay * i)
        .to(0.2, { angle: objCardConfigPosAndAngle.angle, position: posTarget, opacity: 255 })
        .start();

      cc.tween(cardNode)
        .delay(delay * i)
        .to(0.5, { opacity: 255 })
        .start();
      currentIndex++;
    }
  },

  openAllCardWithEffect() {
    for (let i = 0, l = this.listCard.length; i < l; i++) {
      this.listCard[i].openCardWithEffect();
    }
  },

  offTextEffect() {
    if (this.spStrongCard) this.spStrongCard.active = false;
    this.spStrongCard = null;
  },

  showTypeWin(typeWin, listLoseSapHam = [], isBinhLung = false) {
    cc.log("player ID", this.id, this.nameUser);
    this.offTextEffect();
    let str = "";
    switch (typeWin) {
      case WinTypeBinh.Lose_SapHam:
        cc.log("thua sap ham");
        cc.log("list lose sap ham", listLoseSapHam.length);
        str = "Sập Hầm";
        if (isBinhLung && listLoseSapHam.length > 0) {
          this.showEffectBanTenLua(false, true, false, listLoseSapHam);
        }
        break;
      case WinTypeBinh.Lose_SapLang:
        cc.log("thua sap lang");
        cc.log("list lose sap ham", listLoseSapHam.length);
        str = "Thua"; //thua
        if (isBinhLung && listLoseSapHam.length > 0) {
          this.showEffectBanTenLua(false, true, false, listLoseSapHam);
        }
        break;
      case WinTypeBinh.Lose_ToiTrang:
        cc.log("thua toi trang");
        cc.log("list lose sap ham", listLoseSapHam.length);
        str = "Thua"; // thua
        break;
      case WinTypeBinh.Lose_BinhLung:
        cc.log("thua binh lung");
        cc.log("list lose sap ham", listLoseSapHam.length);
        str = "Binh Lủng";
        break;
      case WinTypeBinh.Lose:
        cc.log("thua");
        cc.log("list lose sap ham", listLoseSapHam.length);
        str = "Thua"; //thua
        if (isBinhLung && listLoseSapHam.length > 0) {
          this.showEffectBanTenLua(false, true, false, listLoseSapHam);
        }
        break;
      case WinTypeBinh.Win:
        cc.log("thang");
        cc.log("list lose sap ham", listLoseSapHam.length);
        str = "Thắng"; //thang
        if (isBinhLung && listLoseSapHam.length > 0) {
          this.showEffectBanTenLua(false, true, false, listLoseSapHam);
        }
        break;
      case WinTypeBinh.Win_SapLang:
        if (listLoseSapHam.length > 0) {
          this.showEffectBanTenLua(false, false, true, listLoseSapHam);
        }
        cc.log("Ăn Sập Làng");
        cc.log("list lose sap ham", listLoseSapHam.length);
        str = "Ăn Sập Làng";
        break;

      case WinTypeBinh.Win_ToiTrang:
        str = "Ăn Trắng";
        cc.log("list lose sap ham", listLoseSapHam.length);
        cc.log("an trang");
        if (isBinhLung && listLoseSapHam.length > 0) {
          this.showEffectBanTenLua(false, true, false, listLoseSapHam);
        }
        break;

      case WinTypeBinh.Win_SapHam:
        cc.log("thang sap ham");
        cc.log("list lose sap ham", listLoseSapHam.length);
        str = "Thắng Sập Hầm";
        if (listLoseSapHam.length > 0) {
          this.showEffectBanTenLua(false, true, false, listLoseSapHam);
        }
        break;
      default:
        break;
    }
    if (str != "") {
      let nodeChild = cc.instantiate(cc.find(str, Global.BinhView.parentSpiteTypeWin));
      nodeChild.active = true;
      nodeChild.parent = this.node;
      this.spStrongCard = nodeChild;
      let pos = Global.BinhView.cardController.listPosFirtCardFinish[this.indexInTable].clone();
      if (this.indexInTable == 0) pos.y -= 250;
      else pos.y -= 200;
      nodeChild.position = cc.v2(0, 50);
      if (this.indexInTable === 3) nodeChild.position = cc.v2(280, -50);
      else if (this.indexInTable === 0) nodeChild.position = cc.v2(-380, 20);
      else if (this.indexInTable === 1) nodeChild.position = cc.v2(-280, -50);
      else if (this.indexInTable === 2) nodeChild.position = cc.v2(-260, -40);
    }
  },
  showEffectBanTenLua(binhLung = false, sapHam = false, batSapLang = false, listID_LoseSapHam = []) {
    this.node.parent.setSiblingIndex(999);
    let listLoseSapHam = [];
    let listLoseSapLang = [];
    let listLoseBinhLung = Global.BinhView.listLoseBinhLung;
    if (sapHam) {
      if (listID_LoseSapHam.length > 0) {
        let listIDLoseSapHam = listID_LoseSapHam;
        cc.log("listIDLoseSapHam", listIDLoseSapHam);
        for (let i = 0; i < listIDLoseSapHam.length; i++) {
          cc.log("player ID", listIDLoseSapHam[i]);
          let player = Global.BinhView.getPlayerWithId(listIDLoseSapHam[i]);
          // cc.log("player  width id", player);
          listLoseSapHam.push(player);
        }
      }
      // cc.log("list lose sap ham", listLoseSapHam);
      this.setRocketMoving(listLoseSapHam);
    } else if (listLoseBinhLung.length > 0 && binhLung) {
      this.setRocketMoving(listLoseBinhLung);
    } else if (batSapLang) {
      if (listID_LoseSapHam.length > 0) {
        let listIDLoseSapLang = listID_LoseSapHam;
        for (let i = 0; i < listIDLoseSapLang.length; i++) {
          let player = Global.BinhView.getPlayerWithId(listIDLoseSapLang[i]);
          listLoseSapLang.push(player);
        }
      }
      this.setRocketMoving(listLoseSapLang);
    }
  },
  setRocketMoving(listLose) {
    for (let i = 0; i < listLose.length; i++) {
      let nodeRocket = new cc.Node();
      this.node.addChild(nodeRocket);
      nodeRocket.addComponent(cc.Sprite);
      nodeRocket.addComponent("rocketMovingBinh");
      nodeRocket.setPosition(0, 0);
      nodeRocket.setScale(1.3, 1.3);
      this.showEffectRocketFly(nodeRocket);
      let playerLoseSapHam = listLose[i];
      playerLoseSapHam.SetPosTagetRocketFly();
      let tagetPos = Global.getPostionInOtherNode(nodeRocket.parent, playerLoseSapHam.posTagetRocketFly);
      let startPos = nodeRocket.position;
      if (this.indexInTable == 0) {
        if (playerLoseSapHam.indexInTable == 1) {
          let controPos1 = startPos.add(cc.v2(this.controPosX1, -this.controPosY1));
          let controPos2 = tagetPos.add(cc.v2(this.controPosX2, -this.controPosY2));
          let listBezier = Global.calculateBezierPoints(startPos, controPos1, controPos2, tagetPos, this.PointNumber);
          // cc.log("listbezier", listBezier);
          let rocketMovingJs = nodeRocket.getComponent("rocketMovingBinh");
          rocketMovingJs.getListBezier(listBezier, true, playerLoseSapHam, this.originZIndex);
        } else if (playerLoseSapHam.indexInTable == 2) {
          let controPos1 = startPos.add(cc.v2(-this.controPosX1, -this.controPosY1));
          let controPos2 = tagetPos.add(cc.v2(-this.controPosX2, -this.controPosY2));
          let listBezier = Global.calculateBezierPoints(startPos, controPos1, controPos2, tagetPos, this.PointNumber);
          let rocketMovingJs = nodeRocket.getComponent("rocketMovingBinh");
          rocketMovingJs.getListBezier(listBezier, true, playerLoseSapHam, this.originZIndex);
        } else if (playerLoseSapHam.indexInTable == 3) {
          let controPos1 = startPos.add(cc.v2(-this.controPosX1, -this.controPosY1));
          let controPos2 = tagetPos.add(cc.v2(-this.controPosX2, -this.controPosY2));
          let listBezier = Global.calculateBezierPoints(startPos, controPos1, controPos2, tagetPos, this.PointNumber);
          let rocketMovingJs = nodeRocket.getComponent("rocketMovingBinh");
          rocketMovingJs.getListBezier(listBezier, true, playerLoseSapHam, this.originZIndex);
        }
      } else if (this.indexInTable == 1) {
        if (playerLoseSapHam.indexInTable == 0) {
          let controPos1 = startPos.add(cc.v2(-this.controPosX1, this.controPosY1));
          let controPos2 = tagetPos.add(cc.v2(this.controPosX2, this.controPosY2));
          let listBezier = Global.calculateBezierPoints(startPos, controPos1, controPos2, tagetPos, this.PointNumber);
          let rocketMovingJs = nodeRocket.getComponent("rocketMovingBinh");
          rocketMovingJs.getListBezier(listBezier, true, playerLoseSapHam, this.originZIndex);
        } else if (playerLoseSapHam.indexInTable == 2) {
          let controPos1 = startPos.add(cc.v2(this.controPosX1, this.controPosY1));
          let controPos2 = tagetPos.add(cc.v2(this.controPosX2, -this.controPosY2));
          let listBezier = Global.calculateBezierPoints(startPos, controPos1, controPos2, tagetPos, this.PointNumber);
          let rocketMovingJs = nodeRocket.getComponent("rocketMovingBinh");
          rocketMovingJs.getListBezier(listBezier, true, playerLoseSapHam, this.originZIndex);
        } else if (playerLoseSapHam.indexInTable == 3) {
          let controPos1 = startPos.add(cc.v2(this.controPosX1, this.controPosY1));
          let controPos2 = tagetPos.add(cc.v2(this.controPosX2, this.controPosY2));
          let listBezier = Global.calculateBezierPoints(startPos, controPos1, controPos2, tagetPos, this.PointNumber);
          let rocketMovingJs = nodeRocket.getComponent("rocketMovingBinh");
          rocketMovingJs.getListBezier(listBezier, true, playerLoseSapHam, this.originZIndex);
        }
      } else if (this.indexInTable == 2) {
        if (playerLoseSapHam.indexInTable == 0) {
          let controPos1 = startPos.add(cc.v2(this.controPosX1, this.controPosY1));
          let controPos2 = tagetPos.add(cc.v2(this.controPosX2, this.controPosY2));
          let listBezier = Global.calculateBezierPoints(startPos, controPos1, controPos2, tagetPos, this.PointNumber);
          let rocketMovingJs = nodeRocket.getComponent("rocketMovingBinh");
          rocketMovingJs.getListBezier(listBezier, true, playerLoseSapHam, this.originZIndex);
        } else if (playerLoseSapHam.indexInTable == 1) {
          let controPos1 = startPos.add(cc.v2(this.controPosX1, this.controPosY1));
          let controPos2 = tagetPos.add(cc.v2(this.controPosX2, this.controPosY2));
          let listBezier = Global.calculateBezierPoints(startPos, controPos1, controPos2, tagetPos, this.PointNumber);
          let rocketMovingJs = nodeRocket.getComponent("rocketMovingBinh");
          rocketMovingJs.getListBezier(listBezier, true, playerLoseSapHam, this.originZIndex);
        } else if (playerLoseSapHam.indexInTable == 3) {
          let controPos1 = startPos.add(cc.v2(-this.controPosX1, this.controPosY1));
          let controPos2 = tagetPos.add(cc.v2(-this.controPosX2, this.controPosY2));
          let listBezier = Global.calculateBezierPoints(startPos, controPos1, controPos2, tagetPos, this.PointNumber);
          let rocketMovingJs = nodeRocket.getComponent("rocketMovingBinh");
          rocketMovingJs.getListBezier(listBezier, true, playerLoseSapHam, this.originZIndex);
        }
      } else if (this.indexInTable == 3) {
        if (playerLoseSapHam.indexInTable == 0) {
          let controPos1 = startPos.add(cc.v2(this.controPosX1, this.controPosY1));
          let controPos2 = tagetPos.add(cc.v2(this.controPosX2, this.controPosY2));
          let listBezier = Global.calculateBezierPoints(startPos, controPos1, controPos2, tagetPos, this.PointNumber);
          let rocketMovingJs = nodeRocket.getComponent("rocketMovingBinh");
          rocketMovingJs.getListBezier(listBezier, true, playerLoseSapHam, this.originZIndex);
        } else if (playerLoseSapHam.indexInTable == 1) {
          let controPos1 = startPos.add(cc.v2(-this.controPosX1, this.controPosY1));
          let controPos2 = tagetPos.add(cc.v2(-this.controPosX2, this.controPosY2));
          let listBezier = Global.calculateBezierPoints(startPos, controPos1, controPos2, tagetPos, this.PointNumber);
          let rocketMovingJs = nodeRocket.getComponent("rocketMovingBinh");
          rocketMovingJs.getListBezier(listBezier, true, playerLoseSapHam, this.originZIndex);
        } else if (playerLoseSapHam.indexInTable == 2) {
          let controPos1 = startPos.add(cc.v2(-this.controPosX1, -this.controPosY1));
          let controPos2 = tagetPos.add(cc.v2(-this.controPosX2, -this.controPosY2));
          let listBezier = Global.calculateBezierPoints(startPos, controPos1, controPos2, tagetPos, this.PointNumber);
          let rocketMovingJs = nodeRocket.getComponent("rocketMovingBinh");
          rocketMovingJs.getListBezier(listBezier, true, playerLoseSapHam, this.originZIndex);
        }
      }
    }
  },
  SetPosTagetRocketFly() {
    if (this.indexInTable == 0) {
      this.posTagetRocketFly.setPosition(-300, -300);
    } else if (this.indexInTable == 1) {
      this.posTagetRocketFly.setPosition(-200, -250);
    } else if (this.indexInTable == 2) {
      this.posTagetRocketFly.setPosition(-200, -250);
    } else if (this.indexInTable == 3) {
      this.posTagetRocketFly.setPosition(200, -250);
    }
  },
  showEffectRocketFly(rocketNode) {
    let index = 0;
    let delayArt = 0;
    let delay = 0.5;

    cc.Tween.stopAllByTarget(rocketNode);
    cc.tween(rocketNode)
      .delay(0.2)
      .call(() => {
        let urlImage = "maubinh_rocket_0" + index.toString();
        // cc.log("urlImageRocket", urlImage);
        let rocketSprite = rocketNode.getComponent(cc.Sprite);
        rocketSprite.spriteFrame = this.rocketAtlas.getSpriteFrame(urlImage);
        index += 1;
        if (index == 10) {
          index = 0;
        }
      })
      .union()
      .repeat(500)
      .start();
  },
  showEffectBoom() {
    let nodeBoom = new cc.Node();
    this.node.addChild(nodeBoom);
    nodeBoom.addComponent(cc.Sprite);
    nodeBoom.setPosition(0, 0);
    Global.AudioManager.playBoom();
    if (this.indexInTable == 0) {
      nodeBoom.setPosition(-300, -300);
      this.node.parent.setSiblingIndex(999);
      nodeBoom.scale = cc.v2(3.5, 3.5);
    } else if (this.indexInTable == 1) {
      nodeBoom.setPosition(-200, -250);
      nodeBoom.scale = cc.v2(2.5, 2.5);
    } else if (this.indexInTable == 2) {
      nodeBoom.setPosition(-200, -250);
      nodeBoom.scale = cc.v2(2.5, 2.5);
    } else if (this.indexInTable == 3) {
      nodeBoom.setPosition(200, -250);
      nodeBoom.scale = cc.v2(2.5, 2.5);
    }
    let index = 3;
    cc.Tween.stopAllByTarget(nodeBoom);
    cc.tween(nodeBoom)
      .delay(0.1)
      .call(() => {
        let numberString = "";
        if (index < 10) {
          numberString = "0000" + index.toString();
        } else if (index >= 10 && index < 100) {
          numberString = "000" + index.toString();
        }
        let urlImage = "maubinh_rocketbomb__" + numberString;
        // cc.log("urlImageBoom", urlImage);
        let boomSprite = nodeBoom.getComponent(cc.Sprite);
        boomSprite.spriteFrame = this.boomAtlas.getSpriteFrame(urlImage);
        index += 1;
        if (index == 23) {
          Global.AudioManager.stopBoom();
          nodeBoom.active = false;
          index = 3;
          this.scheduleOnce(function () {
            this.node.parent.setSiblingIndex(this.originZIndex);
            nodeBoom.destroy();
          }, 3);
        }
      })
      .union()
      .repeat(19)
      .start();
  },
  showTypeWin_history(typeWin) {
    // cc.log("TYPE WIN LOSE GAME", typeWin);
    this.offTextEffect();
    let str = "";
    switch (typeWin) {
      case WinTypeBinh.Lose_SapHam:
        str = "Sập Hầm";
        break;
      case WinTypeBinh.Lose_SapLang:
        str = "Thua"; //thua
        break;
      case WinTypeBinh.Lose_ToiTrang:
        str = "Thua"; // thua
        break;
      case WinTypeBinh.Lose_BinhLung:
        str = "Binh Lủng";
        break;
      case WinTypeBinh.Lose:
        str = "Thua"; //thua
        break;
      case WinTypeBinh.Win:
        str = "Thắng"; //thang
        break;
      case WinTypeBinh.Win_SapLang:
        str = "Ăn Sập Làng";
        break;

      case WinTypeBinh.Win_ToiTrang:
        str = "Ăn Trắng";
        break;

      case WinTypeBinh.Win_SapHam:
        str = "Thắng Sập Hầm";
        break;
      default:
        break;
    }
    if (str != "") {
      let nodeChild = cc.instantiate(cc.find(str, Global.BinhView.parentSpiteTypeWin));
      nodeChild.active = true;
      nodeChild.parent = this.node;
      this.spStrongCard = nodeChild;
      let pos = Global.BinhView.cardController.listPosFirtCardFinish[this.indexInTable].clone();
      if (this.indexInTable == 0) pos.y -= 250;
      else pos.y -= 200;
      nodeChild.position = cc.v2(0, 50);
      if (this.indexInTable === 3) nodeChild.position = cc.v2(260, -50);
      else if (this.indexInTable === 0) nodeChild.position = cc.v2(-300, 10);
      else if (this.indexInTable === 1) nodeChild.position = cc.v2(-260, -50);
      else if (this.indexInTable === 2) nodeChild.position = cc.v2(-260, -30);
    }
  },
  showTypeNone(winLoseCash) {
    this.offTextEffect();
    let str = "";
    if (winLoseCash == 0) {
      str = "Text-hoa";
    }
    if (str != "") {
      let nodeChild = cc.instantiate(cc.find(str, Global.BinhView.parentSpiteTypeWin));
      nodeChild.active = true;
      nodeChild.parent = this.node;
      this.spStrongCard = nodeChild;
      let pos = Global.BinhView.cardController.listPosFirtCardFinish[this.indexInTable].clone();
      if (this.indexInTable == 0) pos.y -= 250;
      else pos.y -= 200;
      nodeChild.position = cc.v2(0, 50);
      if (this.indexInTable === 3) nodeChild.position = cc.v2(280, -50);
      else if (this.indexInTable === 0) nodeChild.position = cc.v2(-350, 20);
      else if (this.indexInTable === 1) nodeChild.position = cc.v2(-280, -50);
      else if (this.indexInTable === 2) nodeChild.position = cc.v2(-260, -40);
      // if (this.indexInTable === 3) nodeChild.position = cc.v2(-280, 50);
      this.isPlaying = false;
    }
  },
  showTypeNone_history(winLoseCash) {
    this.offTextEffect();
    let str = "";
    if (winLoseCash == 0) {
      str = "Text-hoa";
    }
    if (str != "") {
      let nodeChild = cc.instantiate(cc.find(str, Global.BinhView.parentSpiteTypeWin));
      nodeChild.active = true;
      nodeChild.parent = this.node;
      this.spStrongCard = nodeChild;
      let pos = Global.BinhView.cardController.listPosFirtCardFinish[this.indexInTable].clone();
      if (this.indexInTable == 0) pos.y -= 250;
      else pos.y -= 200;
      nodeChild.position = cc.v2(0, 50);
      if (this.indexInTable === 3) nodeChild.position = cc.v2(260, -50);
      else if (this.indexInTable === 0) nodeChild.position = cc.v2(-300, 10);
      else if (this.indexInTable === 1) nodeChild.position = cc.v2(-260, -50);
      else if (this.indexInTable === 2) nodeChild.position = cc.v2(-260, -30);
      // if (this.indexInTable === 3) nodeChild.position = cc.v2(-280, 50);
      this.isPlaying = false;
    }
  },

  showTypeAnTrang(typeWin) {
    // cc.log("stringgggggg la : ", typeWin);
    this.offTextEffect();
    let str = "";
    switch (typeWin) {
      case TypeAnTrang.BA_SANH:
        str = "Ba Sảnh";
        break;
      case TypeAnTrang.BA_THUNG:
        str = "Ba Thùng";
        break;
      case TypeAnTrang.SAU_DOI:
        str = "Sáu Đôi";
        break;
      case TypeAnTrang.NAM_DOI_1_XAM:
        str = "5 Đôi 1 Xám";
        break;
      case TypeAnTrang.DONG_MAU:
        str = "Đồng Màu";
        break;
      case TypeAnTrang.SANH_RONG:
        str = "Sảnh Rồng";
        break;
      case TypeAnTrang.RONG_CUON:
        str = "Sảnh Rồng Đồng Hoa";
        break;
      case TypeAnTrang.UNKNOWN:
        break;
    }
    if (str != "") {
      let nodeChild = cc.find(str, this.nodeAnTrang);
      nodeChild.active = true;
      // nodeChild.parent = this.node //Global.BinhView.parentEffect;
      this.spStrongCard = nodeChild;
      // let pos = Global.BinhView.cardController.listPosFirtCardFinish[this.indexInTable].clone();

      // if(this.indexInTable == 0) pos.y -= 210;
      // else pos.y -= 180;
      // nodeChild.position = cc.v2(-20, 100);
      let pos = Global.BinhView.cardController.listPosFirtCardFinish[this.indexInTable].clone();
      if (this.indexInTable == 0) pos.y -= 250;
      else pos.y -= 200;
      nodeChild.position = cc.v2(0, 50);
      if (this.indexInTable === 3) nodeChild.position = cc.v2(300, 100);
      else if (this.indexInTable === 0) nodeChild.position = cc.v2(-420, 160);
      else if (this.indexInTable === 1) nodeChild.position = cc.v2(-300, 100);
      else if (this.indexInTable === 2) nodeChild.position = cc.v2(-300, 100);
    }
  },
  showTypeAnTrang_history(typeWin) {
    // cc.log("stringgggggg la : ", typeWin);
    this.offTextEffect();
    let str = "";
    switch (typeWin) {
      case TypeAnTrang.BA_SANH:
        str = "Ba Sảnh";
        break;
      case TypeAnTrang.BA_THUNG:
        str = "Ba Thùng";
        break;
      case TypeAnTrang.SAU_DOI:
        str = "Sáu Đôi";
        break;
      case TypeAnTrang.NAM_DOI_1_XAM:
        str = "5 Đôi 1 Xám";
        break;
      case TypeAnTrang.DONG_MAU:
        str = "Đồng Màu";
        break;
      case TypeAnTrang.SANH_RONG:
        str = "Sảnh Rồng";
        break;
      case TypeAnTrang.RONG_CUON:
        str = "Sảnh Rồng Đồng Hoa";
        break;
      case TypeAnTrang.UNKNOWN:
        break;
    }
    if (str != "") {
      let nodeChild = cc.find(str, this.nodeAnTrang);
      nodeChild.active = true;
      // nodeChild.parent = this.node //Global.BinhView.parentEffect;
      this.spStrongCard = nodeChild;
      // let pos = Global.BinhView.cardController.listPosFirtCardFinish[this.indexInTable].clone();

      // if(this.indexInTable == 0) pos.y -= 210;
      // else pos.y -= 180;
      // nodeChild.position = cc.v2(-20, 100);
      let pos = Global.BinhView.cardController.listPosFirtCardFinish[this.indexInTable].clone();
      if (this.indexInTable == 0) pos.y -= 250;
      else pos.y -= 200;
      nodeChild.position = cc.v2(0, 50);
      if (this.indexInTable === 3) nodeChild.position = cc.v2(300, 100);
      else if (this.indexInTable === 0) nodeChild.position = cc.v2(-350, 160);
      else if (this.indexInTable === 1) nodeChild.position = cc.v2(-300, 100);
      else if (this.indexInTable === 2) nodeChild.position = cc.v2(-300, 100);
    }
  },

  getPositionInViewParentText: function (pos, parent = this.parentEffect) {
    let worldPos = Global.BinhView.cardController.parentCard.convertToWorldSpaceAR(pos);
    let viewPos = parent.convertToNodeSpaceAR(worldPos);
    return viewPos;
  },

  setupCard3Chi() {
    this.cardChi0.length = 0;
    this.cardChi1.length = 0;
    this.cardChi2.length = 0;
    let index = 0;
    for (let i = 0; i < 3; i++) {
      this.cardChi0.push(this.listCard[index]);
      index++;
    }
    for (let i = 0; i < 5; i++) {
      this.cardChi1.push(this.listCard[index]);
      index++;
    }
    for (let i = 0; i < 5; i++) {
      this.cardChi2.push(this.listCard[index]);
      index++;
    }
  },

  setDataEndGame(obj, objPlayer) {
    this.obj = obj;
    this.objPlayer = objPlayer;
    this.pointAt = objPlayer.CompareAtScore;
    this.totalPoint = objPlayer.TotalScore;

    // cc.log("check point at is me : ", this.pointAt);
    // cc.log("check point total is me : ", this.totalPoint);
  },
  GetNameChiIsMe() {
    let objPlayer = this.objPlayer;
    let typeStrongChi0 = objPlayer.Chi1Type;
    let typeStrongChi1 = objPlayer.Chi2Type;
    let typeStrongChi2 = objPlayer.Chi3Type;
    let strNameChi0 = Global.BinhView.cardController.getNameBoBaiByType(typeStrongChi0);
    let strNameChi1 = Global.BinhView.cardController.getNameBoBaiByType(typeStrongChi1);
    let strNameChi2 = Global.BinhView.cardController.getNameBoBaiByType(typeStrongChi2);
    // cc.log("name chi 0", strNameChi0);
    // cc.log("name chi 1", strNameChi1);
    // cc.log("name chi 2", strNameChi2);
  },
  setCardChiWithEndGame() {
    let obj = this.obj;
    let objPlayer = this.objPlayer;
    let typeStrongChi0 = objPlayer.Chi1Type;
    let typeStrongChi1 = objPlayer.Chi2Type;
    let typeStrongChi2 = objPlayer.Chi3Type;

    let pointChi0 = obj.Chi1Score;
    let pointChi1 = obj.Chi2Score;
    let pointChi2 = obj.Chi3Score;

    if (this != Global.BinhView.isMe) {
      let objPoint = this.getPointChiWithObj(objPlayer);
      pointChi0 = objPoint.Chi1Score;
      pointChi1 = objPoint.Chi2Score;
      pointChi2 = objPoint.Chi3Score;
    }

    this.currentPoint += pointChi0;

    let isDelayShowCompareAt = Global.BinhView.isCompareAt ? 3 : 0;

    this.effectShowCardByChi(0, typeStrongChi0, pointChi0);
    cc.tween(this.node)
      .delay(3.5)
      .call(() => {
        this.ScaleChi(0);
        this.currentPoint += pointChi1;
        this.scheduleOnce(function () {
          this.resetCardEffect();
          this.setGrayChiCard(0);
          this.effectShowCardByChi(1, typeStrongChi1, pointChi1);
        }, 0.1);
      })
      .delay(3.5)
      .call(() => {
        this.ScaleChi(1);
        this.currentPoint += pointChi2;
        this.scheduleOnce(function () {
          this.resetCardEffect();
          this.setGrayChiCard(1);
          this.setGrayChiCard(0);
          this.effectShowCardByChi(2, typeStrongChi2, pointChi2);
        }, 0.1);
      })
      .delay(3.5)
      .call(() => {
        this.ScaleChi(2);
        this.scheduleOnce(function () {
          this.resetCardEffect();
          this.setNomalAllCard();
        }, 0.1);
      })
      .delay(0.5)
      .call(() => {
        this.checkCompareAndShowPointAt();
      })
      .delay(isDelayShowCompareAt)
      .call(() => {
        this.setNomalAllCard();
        this.pointSoChiOrigin = 0;
        this.resetCardEffect();
        if (this == Global.BinhView.isMe) {
          // cc.log("chay vao set diem cuoi cunng : ", this.totalPoint);
          // Global.BinhView.setPointPanelIsMe(this.totalPoint, 4);
        }
      })
      .start();
  },
  checkCompareAndShowPointAt() {
    // cc.log("chay vao compare at");
    let pos = Global.BinhView.cardController.listPosFirtCardFinish[this.indexInTable].clone();
    if (Global.BinhView.isCompareAt) {
      if (this.listCard.length < 1) return;
      let listCard = this.listCard;
      for (let i = 0, l = listCard.length; i < l; i++) {
        if (listCard[i].cardNumber == 1) {
          listCard[i].showLight(0);
          listCard[i].onVienSang();
        } else {
          listCard[i].setGrayCard();
          listCard[i].offVienSang();
        }
      }
      // cc.log("check point at : ", this.pointAt);
      if (this._isMe) {
        this.currentPoint += this.pointAt;
        // Global.BinhView.setPointPanelIsMe(this.pointAt, 3);
        // Global.BinhView.setPointPanelIsMe(this.currentPoint, 4);
      }
      this.scheduleOnce(function () {
        this.showPointAt();
      }, 1);
    }
  },
  getPointChiWithObj(obj) {
    let objReturn = {
      Chi1Score: 0,
      Chi2Score: 0,
      Chi3Score: 0,
    };
    for (let c = 1; c < 4; c++) {
      let strTemp = "Chi%nCompareScore".replace("%n", c);
      let strObj = "Chi%nScore".replace("%n", c);
      let listPoint = obj[strTemp];
      for (let i = 0, l = listPoint.length; i < l; i++) {
        let temp = listPoint[i];
        if (temp.Position == Global.BinhView.isMe.position) {
          objReturn[strObj] = temp.Score;
          break;
        }
      }
    }
    // cc.log(JSON.stringify(objReturn));
    return objReturn;
  },
  ScaleChi(chi) {
    let listCard = this.getCardByChi(chi);
    for (let i = 0, l = listCard.length; i < l; i++) {
      let cardCp = listCard[i];
      let nodeCard = cardCp.node;
      let scale = 0.53;
      if (this.indexInTable == 0) scale = 0.8;
      cc.Tween.stopAllByTarget(nodeCard);
      cc.tween(nodeCard)
        .to(0.3, { scale: scale })
        .call(() => {})
        .start();
    }
  },
  CheckAtInListCard(listCard) {
    let countAt = 0;
    for (let i = 0; i < listCard.length; i++) {
      if (listCard[i].cardNumber == 1) {
        countAt++;
      }
    }
    if (countAt != 0) {
      return true;
    } else {
      return false;
    }
  },
  resetShowChi(chi, strongType, point = 0) {
    let delay = 0.03;
    let listCards = this.getCardByChi(chi);
    let listCardsTest = listCards.slice();
    // cc.log("listCard", listCards);
    let str = Global.BinhView.cardController.getNameBoBaiByType(strongType);
    // cc.log("STR STR ", str);
    if (str == RESULT_NAME_CHI.SANH || str == RESULT_NAME_CHI.THUNG || str == RESULT_NAME_CHI.THUNG_PHA_SANH || str == RESULT_NAME_CHI.MAU_THAU || str == RESULT_NAME_CHI.THUNG_PHA_SANH_DAI) {
      for (let n = 0; n < 5; n++) {
        let isAtInlistCard = this.CheckAtInListCard(listCards);
        // cc.log("isAtinlistCard", isAtInlistCard);
        if (isAtInlistCard) {
          for (let i = 0; i < listCards.length - 1; i++) {
            let cardCpi = listCards[i];
            let cardNumberi = cardCpi.cardNumber;
            for (let j = i + 1; j < listCards.length; j++) {
              let cardCpj = listCards[j];
              let cardNumberj = cardCpj.cardNumber;
              if (cardNumberi > cardNumberj) {
                let CardNumber = listCards[i].cardNumber;
                listCards[i].cardNumber = listCards[j].cardNumber;
                listCards[j].cardNumber = CardNumber;
                let CardID = listCards[i].id;
                listCards[i].id = listCards[j].id;
                listCards[j].id = CardID;
              }
            }
          }
          for (let i = 0; i < listCards.length; i++) {
            // cc.log("cardNumber", listCards[i].cardNumber);
          }
          if (listCards[1].cardNumber == 2) {
          } else if (listCards[listCards.length - 1].cardNumber == 13) {
            let AtNumber = listCards[0].cardNumber;
            let AtID = listCards[0].id;
            for (let i = 0; i < listCards.length - 1; i++) {
              listCards[i].cardNumber = listCards[i + 1].cardNumber;
              listCards[i].id = listCards[i + 1].id;
            }
            listCards[listCards.length - 1].cardNumber = AtNumber;
            listCards[listCards.length - 1].id = AtID;
          }
        } else {
          for (let i = 0; i < listCards.length - 1; i++) {
            let cardCpi = listCards[i];
            let cardNumberi = cardCpi.cardNumber;
            for (let j = i + 1; j < listCards.length; j++) {
              let cardCpj = listCards[j];
              let cardNumberj = cardCpj.cardNumber;
              if (cardNumberi > cardNumberj) {
                let cardNumber = listCards[i].cardNumber;
                listCards[i].cardNumber = listCards[j].cardNumber;
                listCards[j].cardNumber = cardNumber;
                let CardID = listCards[i].id;
                listCards[i].id = listCards[j].id;
                listCards[j].id = CardID;
              }
            }
          }
        }
      }
    } else if (str == RESULT_NAME_CHI.ĐOI || str == RESULT_NAME_CHI.TU_QUY || str == RESULT_NAME_CHI.SAM) {
      // cc.log("set swap card", str);
      //set phan tu dau mang
      let duplicateNumber = 0;
      for (let i = 0; i < listCards.length - 1; i++) {
        let cardi = listCards[i];
        let cardNumberi = cardi.cardNumber;
        for (let j = i + 1; j < listCards.length; j++) {
          let cardj = listCards[j];
          let cardNumberj = cardj.cardNumber;
          if (cardNumberi == cardNumberj) {
            duplicateNumber = cardNumberi;
          }
        }
      }
      // cc.log("duplicateNumber", duplicateNumber);
      for (let i = 0; i < listCards.length; i++) {
        let card = listCards[i];
        let cardNumber = card.cardNumber;
        if (cardNumber == duplicateNumber) {
          if (listCards[0].cardNumber != duplicateNumber) {
            // cc.log("nhay vao dây đê swap");
            let tempNumber = listCards[0].cardNumber;
            listCards[0].cardNumber = listCards[i].cardNumber;
            listCards[i].cardNumber = tempNumber;
            let tempId = listCards[0].id;
            listCards[0].id = listCards[i].id;
            listCards[i].id = tempId;
            break;
          }
        }
      }
      // cc.log("lisrcards befor cho la bai trung lên đầu", listCards);
      // set doi
      for (let i = 0; i < listCards.length - 1; i++) {
        let cardi = listCards[i];
        let cardNumberi = cardi.cardNumber;
        for (let j = i + 1; j < listCards.length; j++) {
          let cardj = listCards[j];
          let cardNumberj = cardj.cardNumber;
          if (cardNumberi == cardNumberj) {
            let tempNumber = listCards[j].cardNumber;
            let tempId = listCards[j].id;
            for (let k = j; k > i; k--) {
              listCards[k].cardNumber = listCards[k - 1].cardNumber;
              listCards[k].id = listCards[k - 1].id;
            }
            listCards[i].cardNumber = tempNumber;
            listCards[i].id = tempId;
          }
        }
      }
      // cc.log("lisrcards befor don la bai trung len dau", listCards);
      //sắp xếp các phần tử khác theo chiều tăng từ trái sang phải
      for (let i = 0; i < listCards.length - 1; i++) {
        let cardCpi = listCards[i];
        let cardNumberi = cardCpi.cardNumber;
        if (cardNumberi != duplicateNumber) {
          for (let j = i + 1; j < listCards.length; j++) {
            let cardCpj = listCards[j];
            let cardNumberj = cardCpj.cardNumber;
            if (cardNumberj != duplicateNumber) {
              if (cardNumberi > cardNumberj) {
                let cardNumber = listCards[i].cardNumber;
                listCards[i].cardNumber = listCards[j].cardNumber;
                listCards[j].cardNumber = cardNumber;
                let CardID = listCards[i].id;
                listCards[i].id = listCards[j].id;
                listCards[j].id = CardID;
              }
            }
          }
        }
      }
      // cc.log("listCards cuối cùng sau săp xêp", listCards);
    } else if (str == RESULT_NAME_CHI.THU) {
      //Thu
      //lấy phan tu dau mang
      let cardBigNumber = 0;
      let cardSmallNumber = 0;
      let listcardNumber = [];
      for (let i = 0; i < 2; i++) {
        for (let i = 0; i < listCards.length - 1; i++) {
          let cardi = listCards[i];
          let cardNumberi = cardi.cardNumber;
          for (let j = i + 1; j < listCards.length; j++) {
            let cardj = listCards[j];
            let cardNumberj = cardj.cardNumber;
            if (cardNumberi == cardNumberj) {
              listcardNumber.push(listCards[i].cardNumber);
            }
          }
        }
        if (listcardNumber[0] > listcardNumber[1]) {
          if (listcardNumber[1] == 1) {
            cardBigNumber = listcardNumber[1];
            cardSmallNumber = listcardNumber[0];
          } else {
            cardBigNumber = listcardNumber[0];
            cardSmallNumber = listcardNumber[1];
          }
        } else if (listcardNumber[0] < listcardNumber[1]) {
          if (listcardNumber[0] == 1) {
            cardBigNumber = listcardNumber[0];
            cardSmallNumber = listcardNumber[1];
          } else {
            cardBigNumber = listcardNumber[1];
            cardSmallNumber = listcardNumber[0];
          }
        }
        //set phần tử đầu mảng
        for (let i = 0; i < listCards.length; i++) {
          let cardi = listCards[i];
          let cardNumberi = cardi.cardNumber;
          if (cardNumberi == cardBigNumber) {
            if (listCards[0].cardNumber != cardBigNumber) {
              let tempNumber = listCards[0].cardNumber;
              listCards[0].cardNumber = listCards[i].cardNumber;
              listCards[i].cardNumber = tempNumber;
              let tempId = listCards[0].id;
              listCards[0].id = listCards[i].id;
              listCards[i].id = tempId;
              break;
            }
          }
        }
        //set phần tử thứ 3 của mảng
        for (let i = 0; i < listCards.length; i++) {
          let cardi = listCards[i];
          let cardNumberi = cardi.cardNumber;
          if (cardNumberi == cardSmallNumber) {
            if (listCards[2].cardNumber != cardSmallNumber) {
              let tempNumber = listCards[2].cardNumber;
              listCards[2].cardNumber = listCards[i].cardNumber;
              listCards[i].cardNumber = tempNumber;
              let tempId = listCards[2].id;
              listCards[2].id = listCards[i].id;
              listCards[i].id = tempId;
              break;
            }
          }
        }
        //set doi lon
        for (let i = 0; i < listCards.length - 1; i++) {
          let cardi = listCards[i];
          let cardNumberi = cardi.cardNumber;
          for (let j = i + 1; j < listCards.length; j++) {
            let cardj = listCards[j];
            let cardNumberj = cardj.cardNumber;
            if (cardNumberi == cardNumberj && cardNumberi == cardBigNumber) {
              let tempNumber = listCards[j].cardNumber;
              let tempId = listCards[j].id;
              for (let k = j; k > i; k--) {
                listCards[k].cardNumber = listCards[k - 1].cardNumber;
                listCards[k].id = listCards[k - 1].id;
              }
              listCards[i].cardNumber = tempNumber;
              listCards[i].id = tempId;
            }
          }
        }
        //set doi nho
        for (let i = 0; i < listCards.length - 1; i++) {
          let cardi = listCards[i];
          let cardNumberi = cardi.cardNumber;
          for (let j = i + 1; j < listCards.length; j++) {
            let cardj = listCards[j];
            let cardNumberj = cardj.cardNumber;
            if (cardNumberi == cardNumberj && cardNumberi == cardSmallNumber) {
              let tempNumber = listCards[j].cardNumber;
              let tempId = listCards[j].id;
              for (let k = j; k > i; k--) {
                listCards[k].cardNumber = listCards[k - 1].cardNumber;
                listCards[k].id = listCards[k - 1].id;
              }
              listCards[i].cardNumber = tempNumber;
              listCards[i].id = tempId;
            }
          }
        }
      }
    } else if (str == RESULT_NAME_CHI.CU_LU) {
      // cc.log("set culu");
      let countCuLu = 0;
      let duplicateNumber = 0;
      //get card number culu
      for (let i = 0; i < listCards.length - 1; i++) {
        let cardi = listCards[i];
        let cardNumberi = cardi.cardNumber;
        countCuLu = 0;
        for (let j = i + 1; j < listCards.length; j++) {
          let cardj = listCards[j];
          let cardNumberj = cardj.cardNumber;
          if (cardNumberi == cardNumberj) {
            countCuLu++;
            if (countCuLu == 2) {
              duplicateNumber = cardNumberi;
              countCuLu = 0;
              break;
            }
          }
        }
      }
      // cc.log("dulicateNumber", duplicateNumber);
      //set vi tri đầu mảng cho card culu
      for (let i = 0; i < listCards.length; i++) {
        let cardi = listCards[i];
        let cardNumberi = cardi.cardNumber;
        if (cardNumberi == duplicateNumber && listCards[0].cardNumber != duplicateNumber) {
          let tempNumber = listCards[0].cardNumber;
          listCards[0].cardNumber = listCards[i].cardNumber;
          listCards[i].cardNumber = tempNumber;
          let tempId = listCards[0].id;
          listCards[0].id = listCards[i].id;
          listCards[i].id = tempId;
          break;
        }
      }
      //set bai trung
      for (let i = 0; i < listCards.length - 1; i++) {
        let cardi = listCards[i];
        let cardNumberi = cardi.cardNumber;
        for (let j = i + 1; j < listCards.length; j++) {
          let cardj = listCards[j];
          let cardNumberj = cardj.cardNumber;
          let tempId = listCards[j].id;
          if (cardNumberi == cardNumberj) {
            let tempNumber = listCards[j].cardNumber;
            for (let k = j; k > i; k--) {
              listCards[k].cardNumber = listCards[k - 1].cardNumber;
              listCards[k].id = listCards[k - 1].id;
            }
            listCards[i].cardNumber = tempNumber;
            listCards[i].id = tempId;
          }
        }
      }
    }
    if (listCards.length == 0) return;
    let posMid = listCards[parseInt(listCards.length / 2)].node.position;
    let widthCard = listCards[0].node.width * (listCards[0].node.scaleX + 0.04);
    let posFirt = posMid.clone();

    posFirt.x -= parseInt(listCards.length / 2) * widthCard;
    for (let i = 0, l = listCards.length; i < l; i++) {
      // cc.log("listCardNumber ", listCards[i].cardNumber);
      let cardCp = listCards[i];
      let nodeCard = cardCp.node;
      let posTarget = posFirt.clone();
      let scale = 0.53;
      if (this.indexInTable == 0) scale = 0.8;
      posTarget.x += i * widthCard;
      posTarget.y = nodeCard.position.y;
      nodeCard.zIndex = 100 + i + chi * 5;
      nodeCard.angle = nodeCard.angle;
      cc.Tween.stopAllByTarget(nodeCard);
      cc.tween(nodeCard)
        .delay(delay)
        .call(() => {
          cardCp.openCardWithEffect_swapCard();
        })
        .start();
      delay += 0.03;
    }
  },
  effectShowCardByChi(chi, strongType, point) {
    let delay = 0.03;
    let listCards = this.getCardByChi(chi);
    let str = Global.BinhView.cardController.getNameBoBaiByType(strongType);
    // cc.log("STR STR ", str);
    if (str == RESULT_NAME_CHI.SANH || str == RESULT_NAME_CHI.THUNG || str == RESULT_NAME_CHI.THUNG_PHA_SANH || str == RESULT_NAME_CHI.MAU_THAU || str == RESULT_NAME_CHI.THUNG_PHA_SANH_DAI) {
      let isAtInlistCard = this.CheckAtInListCard(listCards);
      // cc.log("isAtinlistCard", isAtInlistCard);
      if (isAtInlistCard) {
        for (let i = 0; i < listCards.length - 1; i++) {
          let cardCpi = listCards[i];
          let cardNumberi = cardCpi.cardNumber;
          for (let j = i + 1; j < listCards.length; j++) {
            let cardCpj = listCards[j];
            let cardNumberj = cardCpj.cardNumber;
            if (cardNumberi > cardNumberj) {
              let CardNumber = listCards[i].cardNumber;
              listCards[i].cardNumber = listCards[j].cardNumber;
              listCards[j].cardNumber = CardNumber;
              let CardID = listCards[i].id;
              listCards[i].id = listCards[j].id;
              listCards[j].id = CardID;
            }
          }
        }
        for (let i = 0; i < listCards.length; i++) {
          // cc.log("cardNumber", listCards[i].cardNumber);
        }
        if (listCards[1].cardNumber == 2) {
        } else if (listCards[listCards.length - 1].cardNumber == 13) {
          let AtNumber = listCards[0].cardNumber;
          let AtID = listCards[0].id;
          for (let i = 0; i < listCards.length - 1; i++) {
            listCards[i].cardNumber = listCards[i + 1].cardNumber;
            listCards[i].id = listCards[i + 1].id;
          }
          listCards[listCards.length - 1].cardNumber = AtNumber;
          listCards[listCards.length - 1].id = AtID;
        }
      } else {
        for (let i = 0; i < listCards.length - 1; i++) {
          let cardCpi = listCards[i];
          let cardNumberi = cardCpi.cardNumber;
          for (let j = i + 1; j < listCards.length; j++) {
            let cardCpj = listCards[j];
            let cardNumberj = cardCpj.cardNumber;
            if (cardNumberi > cardNumberj) {
              let cardNumber = listCards[i].cardNumber;
              listCards[i].cardNumber = listCards[j].cardNumber;
              listCards[j].cardNumber = cardNumber;
              let CardID = listCards[i].id;
              listCards[i].id = listCards[j].id;
              listCards[j].id = CardID;
            }
          }
        }
      }
    }
    if (listCards.length == 0) return;
    let posMid = listCards[parseInt(listCards.length / 2)].node.position;
    let posStrongType = posMid.clone();
    // posStrongType.y += 110;

    let posPoint = posMid.clone();
    let widthCard = listCards[0].node.width * (listCards[0].node.scaleX + 0.04);
    // posStrongType.x += (widthCard * listCard.length) / 2 + widthCard / 2;
    let posFirt = posMid.clone();

    posFirt.x -= parseInt(listCards.length / 2) * widthCard;
    for (let i = 0, l = listCards.length; i < l; i++) {
      let cardCp = listCards[i];
      // cc.log("listCardNumber ", listCards[i].cardNumber);
      let nodeCard = cardCp.node;
      let posTarget = posFirt.clone();
      let scale = 0.53;
      if (this.indexInTable == 0) scale = 0.8;
      posTarget.x += i * widthCard;
      posTarget.y = nodeCard.position.y;

      nodeCard.zIndex = 100 + i + chi * 5;
      nodeCard.angle = nodeCard.angle;
      cc.Tween.stopAllByTarget(nodeCard);
      cc.tween(nodeCard)
        .to(0.2, { scale: scale })
        .to(0.1, { position: posTarget })
        .delay(delay)
        .call(() => {
          cardCp.openCardWithEffect();
        })
        .start();
      delay += 0.03;
    }
    let isWin = point < 0 ? false : true;
    this.unschedule(this.funShowStrong);
    this.unschedule(this.funResetChi);
    this.scheduleOnce(
      (this.funShowStrong = () => {
        this.showStrongChi(strongType, posStrongType, chi, isWin);
        this.scheduleOnce(function () {
          if (this != Global.BinhView.isMe && !Global.BinhView.blockShowPointChi) {
            // cc.log("state MB BL 2 user other", Global.BinhView.blockShowPointChi);
            this.showPointChiOtherPlayer(point, posStrongType);
          }
        }, 0.7);

        if (this == Global.BinhView.isMe && !Global.BinhView.blockShowPointChi) {
          // cc.log("state MB BL 2 user main", Global.BinhView.blockShowPointChi);
          // Global.BinhView.setPointPanelIsMe(point, chi);
          // Global.BinhView.setPointPanelIsMe(this.currentPoint, 4);
          this.scheduleOnce(function () {
            this.showPointChiOtherPlayer(point, posStrongType);
          }, 0.7);
        }
      }),
      1.3
    );

    // this.scheduleOnce(this.funResetChi = ()=>{
    //     this.resetCardPosition();
    // } , 1);
  },

  resetCardEffect() {
    if (this.lbPointChi) {
      this.lbPointChi.node.destroy();
      this.lbPointChi = null;
    }
    // this.pointSoChiOrigin = 0;
  },
  resetCardPosition() {
    let listCard = this.listCard;
    let objConfig = Global.BinhView.cardController.listConfigCardFinish[this.indexInTable];

    for (let i = 0, l = listCard.length; i < l; i++) {
      let nodeCard = listCard[i].node;
      let objPosAndAngle = objConfig[i];
      nodeCard.zIndex = i;
      cc.Tween.stopAllByTarget(nodeCard);
      cc.tween(nodeCard)
        .to(0.3, { position: cc.v2(objPosAndAngle.position.x, objPosAndAngle.position.y), angle: objPosAndAngle.angle })
        .start();
    }
  },

  setGrayChiCard(chi) {
    let listCard = this.getCardByChi(chi);
    for (let i = 0, l = listCard.length; i < l; i++) {
      listCard[i].setGrayCard();
    }
  },
  setNomalAllCard() {
    let listCard = this.listCard;
    for (let i = 0, l = listCard.length; i < l; i++) {
      listCard[i].setNormalCard();
      listCard[i].offVienSang();
    }
  },

  getCardByChi(chi) {
    let str = "cardChi";
    return this[str + chi];
  },

  getIdCardByChi(chi) {
    let str = "cardChi";
    let cardChi = this[str + chi];
    let arrId = [];
    for (let i = 0; i < cardChi.length; i++) {
      arrId.push(cardChi[i].id);
    }
    return arrId;
  },
  resetAllByTaget() {
    this.unschedule(this.funShowStrong);
    let listCard = this.listCard;
    for (let i = 0, l = listCard.length; i < l; i++) {
      let cardCp = listCard[i];
      let nodeCard = cardCp.node;
      cardCp.offVienSang();
      cc.Tween.stopAllByTarget(nodeCard);
    }
  },
  resetCard(gameView) {
    this.resetAllByTaget();
    if (this.nodeMoneyChangeEndGame) this.nodeMoneyChangeEndGame.active = false;

    let children = this.nodeParentText.children;
    for (let i = 0; i < children.length; i++) {
      children[i].active = false;
    }

    this._moneyEarnCardCahe = 0;
    for (let i = 0, l = this.listCard.length; i < l; i++) {
      gameView.pool.putCard(this.listCard[i].node);
    }
    this.avatar.node.color = cc.Color.WHITE;
    this.listCardCurrentSlect.length = 0;
    this.listCard.length = 0;
    this.listCardIdForReconnect.length = 0;
    this.numberCard = 0;
    this.nodeMoneyChangeEndGame = null;
    this.offTextEffect();
    if (this.lbStrongCard) this.lbStrongCard.destroy();
    this.lbStrongCard = null;
    for (let i = 0, l = this.listLbPoint.length; i < l; i++) {
      this.listLbPoint[i].destroy();
    }
    this.listLbPoint.length = 0;
    if (this.lbTotalPoint) this.lbTotalPoint.node.destroy();
    if (this.lbPointChi) this.lbPointChi.node.destroy();
    // if (this.lbPointAt) this.lbPointAt.node.destroy();
    this.lbPointChi = null;
    this.lbTotalPoint = null;
    this.lbPointAt = null;
    this.totalPoint = 0;
    this.currentPoint = 0;
    this.cardChi0.length = 0;
    this.cardChi1.length = 0;
    this.cardChi2.length = 0;
    this.nodeDangXep.active = false;
    this.nodeXepXong.active = false;
  },
  checkGiongChi(chi, listArrid) {
    let listArrIdChi = this.listChiIdCard[chi];
    if (listArrIdChi == null) {
      this.listChiIdCard[chi] = listArrid;
      return false;
    }
    for (let i = 0, l = listArrIdChi.length; i < l; i++) {
      if (listArrIdChi[i] != listArrid[i]) {
        this.listChiIdCard[chi] = listArrid.slice();
        return false;
      }
    }
    return true;
  },
  showStrongChi(strongType, pos, chi, isWin = true) {
    let strongTypeClone = strongType;
    // cc.log("chiIndex", chi);
    // cc.log("strong type", strongTypeClone);
    if (this.lbStrongCard) this.lbStrongCard.destroy();
    if (strongType == TypeStrongCard.ThungPhaSanh) {
      let listIDCardChi = this.getIdCardByChi(chi);
      listIDCardChi.sort(function (a, b) {
        return a - b;
      });
      // cc.log("listIDCard", listIDCardChi);
      let cardDau = this.getCard(listIDCardChi[0]);
      let cardCuoi = this.getCard(listIDCardChi[listIDCardChi.length - 1]);
      if (cardDau == 10 && cardCuoi == 14) {
        strongTypeClone = TypeStrongCard.ThungPhaSanhLon;
      }
    }
    // cc.log("strong type clone", strongTypeClone);
    let str = Global.BinhView.cardController.getNameBoBaiByType(strongTypeClone);
    let parent = Global.BinhView.parentEffect;
    let nodeClone = cc.find(str, Global.BinhView.cardController.parentSpiteStrongCard);
    if (nodeClone == null) return;
    let node = cc.instantiate(nodeClone);
    node.active = true;
    if (this == Global.BinhView.isMe) {
      let spriteBg = node.getComponent(cc.Sprite);
      spriteBg.spriteFrame = this.bgNameShowChi_playerMain;
      node.x = pos.x;
      node.y = pos.y - 90;
    } else if (this.indexInTable == 1) {
      let spriteBg = node.getComponent(cc.Sprite);
      spriteBg.spriteFrame = this.bgNameShowChi_userOther;
      if (chi == 0) {
        node.x = pos.x + 30;
        node.y = pos.y - 60;
      } else {
        node.x = pos.x;
        node.y = pos.y - 60;
      }
    } else if (this.indexInTable == 3) {
      let spriteBg = node.getComponent(cc.Sprite);
      spriteBg.spriteFrame = this.bgNameShowChi_userOther;
      if (chi == 0) {
        node.x = pos.x - 30;
        node.y = pos.y - 60;
      } else {
        node.x = pos.x;
        node.y = pos.y - 60;
      }
    } else if (this.indexInTable == 2) {
      let spriteBg = node.getComponent(cc.Sprite);
      spriteBg.spriteFrame = this.bgNameShowChi_userOther;
      if (chi == 0) {
        node.x = pos.x + 30;
        node.y = pos.y - 60;
      } else {
        node.x = pos.x;
        node.y = pos.y - 60;
      }
    }
    node.parent = parent;
    node.zIndex = 9999;
    node.scale = 0.7;
    this.lbStrongCard = node;
    cc.tween(node)
      .delay(1.7)
      .call(() => {
        node.destroy();
        this.lbStrongCard = null;
      })
      .start();
  },
  getCard(value) {
    return parseInt(value / 10);
  },
  showPointChiOtherPlayer(point, poswithChi) {
    // cc.log("bet in table", Global.betInTable);
    let nodePosShowPointChi = Global.BinhView.cardController.listPosFirtCardFinish[this.indexInTable];
    let scaleCard = 1.2;
    if (this.indexInTable == 0) scaleCard = 1.4;
    let lbPointChi = this.lbPointChi;
    if (lbPointChi == null) {
      let parent = Global.BinhView.parentEffect;
      let node = new cc.Node();
      lbPointChi = node.addComponent(cc.Label);
      node.parent = parent;
      node.scale = scaleCard;
      this.lbPointChi = lbPointChi;
    }
    lbPointChi.node.scale = 0;
    cc.Tween.stopAllByTarget(lbPointChi.node);
    cc.tween(lbPointChi.node).to(0.3, { scale: 1.6 }, { easing: "backInOut" }).to(1, { scale: scaleCard }, { easing: "backInOut" }).start();
    if (point > 0) {
      lbPointChi.font = this.fontPointWin;
      let pointCv = Global.formatMoneyChip(point * Global.betInTable);
      // cc.log("pointCv", pointCv, point);
      pointCv = "+" + pointCv;
      lbPointChi.fontSize = 25;
      lbPointChi.spacingX = 0;
      lbPointChi.string = pointCv;
    } else if (point == 0) {
      lbPointChi.font = this.fontPointWin;
      lbPointChi.fontSize = 25;
      lbPointChi.spacingX = 0;
      // lbPointChi.string = point;
    } else if (point < 0) {
      let pointCv = Global.formatMoneyChip(point * Global.betInTable);
      // cc.log("pointCv", pointCv, point);
      lbPointChi.font = this.fontPointLost;
      lbPointChi.fontSize = 25;
      lbPointChi.spacingX = 0;
      lbPointChi.string = pointCv;
    }
    let pos = poswithChi;
    if (this.indexInTable == 0) {
      lbPointChi.node.x = nodePosShowPointChi.x + 180;
      lbPointChi.node.y = nodePosShowPointChi.y + 300;
    } else if (this.indexInTable == 1) {
      lbPointChi.node.x = nodePosShowPointChi.x + 145;
      lbPointChi.node.y = nodePosShowPointChi.y + 50;
    } else if (this.indexInTable == 2) {
      lbPointChi.node.x = nodePosShowPointChi.x + 150;
      lbPointChi.node.y = nodePosShowPointChi.y + 50;
    } else if (this.indexInTable == 3) {
      lbPointChi.node.x = nodePosShowPointChi.x - 160;
      lbPointChi.node.y = nodePosShowPointChi.y + 50;
    }
    lbPointChi.node.zIndex = 999;
  },

  showPointAt() {
    let point = this.pointAt;
    let scaleCard = 1.2;
    if (this.indexInTable == 0) scaleCard = 1.4;
    let nodePosShowPointChi = Global.BinhView.cardController.listPosFirtCardFinish[this.indexInTable];
    let lbPointAt = this.lbPointChi;
    if (lbPointAt == null) {
      let parent = Global.BinhView.parentEffect;
      let node = new cc.Node();
      lbPointAt = node.addComponent(cc.Label);
      node.parent = parent;
      node.scale = scaleCard;
      this.lbPointChi = lbPointAt;
    }
    lbPointAt.node.scale = 0;
    cc.Tween.stopAllByTarget(lbPointAt.node);
    cc.tween(lbPointAt.node).to(0.3, { scale: 1.6 }, { easing: "backInOut" }).to(1, { scale: scaleCard }, { easing: "backInOut" }).start();
    let node = new cc.Node();
    cc.tween(lbPointAt.node)
      .delay(2)
      .call(() => {
        lbPointAt.node.destroy();
        this.lbStrongCard = null;
      })
      .start();
    if (point > 0) {
      lbPointAt.font = this.fontPointWin;
      let pointCv = Global.formatMoneyChip(point * Global.betInTable);
      // cc.log("pointCv", pointCv, point);
      pointCv = "+" + pointCv;
      lbPointAt.fontSize = 25;
      lbPointAt.spacingX = 0;
      lbPointAt.string = pointCv;
    } else if (point == 0) {
      lbPointAt.font = this.fontPointWin;
      lbPointAt.fontSize = 25;
      lbPointAt.spacingX = 0;
      // lbPointAt.string = point;
    } else if (point < 0) {
      let pointCv = Global.formatMoneyChip(point * Global.betInTable);
      // cc.log("pointCv", pointCv, point);
      lbPointAt.font = this.fontPointLost;
      lbPointAt.fontSize = 25;
      lbPointAt.spacingX = 0;
      lbPointAt.string = pointCv;
    }
    if (this.indexInTable == 0) {
      lbPointAt.node.x = nodePosShowPointChi.x + 180;
      lbPointAt.node.y = nodePosShowPointChi.y + 300;
    } else if (this.indexInTable == 1) {
      lbPointAt.node.x = nodePosShowPointChi.x + 160;
      lbPointAt.node.y = nodePosShowPointChi.y + 50;
    } else if (this.indexInTable == 2) {
      lbPointAt.node.x = nodePosShowPointChi.x + 145;
      lbPointAt.node.y = nodePosShowPointChi.y + 60;
    } else if (this.indexInTable == 3) {
      lbPointAt.node.x = nodePosShowPointChi.x - 160;
      lbPointAt.node.y = nodePosShowPointChi.y + 50;
    }
    lbPointAt.node.zIndex = 999;
  },

  showTotalPointChiEndGame() {
    if (this.lbPointChi) this.lbPointChi.node.destroy();
    this.lbPointChi = null;
    if (this.totalPoint == 0) return;
    let lbTotalPoint = this.lbTotalPoint;

    if (lbTotalPoint == null) {
      this.nodeTotalPoint = null;
      let parent = Global.BinhView.parentPlayer;
      let node = new cc.Node();
      node.parent = parent;
      this.nodeTotalPoint = node;
      let posShowPoint = Global.BinhView.cardController.listPosFirtCardFinish[this.indexInTable];
      if (this == Global.BinhView.isMe) {
        node.x = posShowPoint.x;
        node.y = posShowPoint.y + 130;
      } else {
        node.x = posShowPoint.x;
        node.y = posShowPoint.y + 200;
      }
      node.scale = 1.5;
      node.zIndex = 999;
      lbTotalPoint = node.addComponent(cc.Label);
    }
    cc.Tween.stopAllByTarget(lbTotalPoint.node);
    cc.tween(lbTotalPoint.node).to(0.1, { scale: 1.7 }).to(0.1, { scale: 1.5 }).start();
    if (this.totalPoint > 0) {
      lbTotalPoint.font = this.fontPointWin;
      lbTotalPoint.node.color = cc.Color.WHITE;
    } else {
      lbTotalPoint.font = this.fontPointLost;
      lbTotalPoint.node.color = cc.Color.RED;
    }
    lbTotalPoint.fontSize = 25;
    lbTotalPoint.spacingX = -10;
    lbTotalPoint.string = this.totalPoint;
    this.lbTotalPoint = lbTotalPoint;
    lbTotalPoint.node.zIndex = 999;
  },
  MovingTotalPointNodeReconnectPos() {
    let posShowPoint = Global.BinhView.cardController.listPosFirtReconnect[this.indexInTable];
    let posTaget = new cc.Vec2(0, 0);
    if (this == Global.BinhView.isMe) {
      posTaget.x = posShowPoint.x;
      posTaget.y = posShowPoint.y - 180;
    } else {
      posTaget.x = posShowPoint.x;
      posTaget.y = posShowPoint.y - 170;
    }
    // cc.log("posShowPoint", posTaget);
    if (this.totalPoint != null) {
      // cc.log("totaPointNode", this.nodeTotalPoint);
      cc.Tween.stopAllByTarget(this.nodeTotalPoint);
      cc.tween(this.nodeTotalPoint).to(0.5, { position: posTaget }, { easing: "backInOut" }).start();
    } else {
      // cc.log("null me no roi");
    }
  },
  showAnimWin() {
    this.winner.active = true;
  },

  showAnimLose() {
    this.loser.active = true;
  },
  setStatusSwapCard(status) {
    this.isFakeSwapCard = status;
  },
  fakeSwapCards() {
    let randomIndextCard1 = Global.RandomNumber(0, 12);
    let randomIndextCard2 = Global.RandomNumber(0, 12);
    while (randomIndextCard1 == randomIndextCard2) {
      randomIndextCard2 = Global.RandomNumber(0, 12);
    }
    // cc.log("randomCard1 , randomCard2", randomIndextCard1, randomIndextCard2);
    if (this.listCard.length > 0) {
      let card1 = this.listCard[randomIndextCard1];
      let card2 = this.listCard[randomIndextCard2];
      this.swapCardMoving(card1, card2, randomIndextCard1, randomIndextCard2);
    }
  },
  swapCard(randomCard1, randomCard2) {
    let card1 = this.listCard[randomCard1];
    this.listCard[randomCard1] = this.listCard[randomCard2];
    this.listCard[randomCard2] = card1;
  },
  swapCardMoving(card1, card2, randomCard1, randomCard2) {
    let posCard1 = card1.node.position;
    let posCard2 = card2.node.position;
    let card_1 = card1.node;
    let card_2 = card2.node;
    let distance2CardNode = Global.distanceBetweenPoints(card_1.position, card_2.position);
    let speedMoving = 1000;
    let timeMoving = distance2CardNode / speedMoving;
    cc.log("distanceNode", distance2CardNode);
    card_1.zIndex = 999;
    cc.Tween.stopAllByTarget(card_1);
    cc.Tween.stopAllByTarget(card_2);
    cc.tween(card_1)
      .delay(0.1)
      .to(timeMoving, { position: posCard2 })
      .call(() => {})
      .start();
    card_2.zIndex = 999;
    cc.tween(card_2)
      .delay(0.1)
      .to(timeMoving, { position: posCard1 })
      .call(() => {
        this.swapCard(randomCard1, randomCard2);
        this.setupCard3Chi();
      })
      .start();
  },
  update(dt) {
    if (this.isFakeSwapCard && this.indexInTable != 0) {
      // Cập nhật biến đếm thời gian
      this.timer += dt;
      if (this.timer >= this.nextLaunchTime) {
        this.timer = 0;
        this.fakeSwapCards();
        this.nextLaunchTime = this.randomLaunchTime();
      }
    }
  },
});
