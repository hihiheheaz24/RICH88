var StateSortCardMe = {
  ChuaXep: 0,
  LenDenBe: 1,
  TheoBo: 2,
};

var widthCard = 165;
var heightCard = 225;
var sizeCard = {
  x: 165,
  y: 225,
};
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
    listPosFirtCardFinish: [cc.Vec2],
    listPosFirtReconnect: [cc.Vec2],
    listPosFirtBGCardsGroup: [cc.Vec2],
    parentCard: cc.Node,
    parentCardMe: cc.Node,
    maskCard: cc.Node,
    parentButtonPlay: cc.Node,
    btnXepBai: cc.Node,
    nodeAnTrang: cc.Node,
    lbTitleCardAnTrang: cc.Node,
    nodeZoneClickCard: cc.Node,
    listSpriteNameCard: [cc.Label],

    listSpineFullCard: [sp.Skeleton],
    listIconWrong: [cc.Sprite],
    listFrameTrueFalse: [cc.Sprite],
    listMaskCardGroup: [cc.Node],
    frameTrue_3: cc.SpriteFrame,
    frameFalse_3: cc.SpriteFrame,
    frameTrue_5: cc.SpriteFrame,
    frameFalse_5: cc.SpriteFrame,
    iconV: cc.SpriteFrame,
    iconX: cc.SpriteFrame,
    mask: cc.Node,
    maskSoChi: cc.Node,
    parentSpiteStrongCard: cc.Node,
    fontNumber: cc.Font,
    animDealCard: sp.Skeleton,
    frameTruFalseGroup: cc.Node,
    textSoChiGroup: cc.Node,
    iconTrueFalseGroup: cc.Node,
    btnMauBinh_xepxong: cc.Node,
    swapNode: cc.Node,
    SkeletonGroup: cc.Node,

    //nodeZoneClickBoChonAllCard:cc.Node,
  },
  ctor() {
    this.canTouchCard = false;
    this.isXepBai = false;
    this.cardCurrent = null;
    this._v2OffsetBody = null;
    this.listCardTurn = [];
    this.listCardTurnPlayer = [];
    this.listNodeCardEffect = [];
    this.listCurrentIdCard = [];
    this.listResultHistory = [];
    this.stateSortCardMe = StateSortCardMe.LenDenBe;
    this.listConfigCard = [];
    this.listConfigCardFinish = [];
    this.listConfigCardMe = [];
    this.listConfigCardMax = [];
    this.listStrongCard = [0, 1, 2];
    this.listConfigCardFinish_isMe = [];
    this.listConfigCardOnXep = [];
    this.listConfigCardOnXepCard_isMe = [];
    this.listConfigCardToiTrang = [];
    this.listConfigCardToiTrangOrigin = [];
    this.listSuggestCard = [];
    this.indexListGoiY = 0;

    this.isLung = false;
    this.isThuCard = false;
    this.istoiTrang = false;
    this.isSwapCard = false;
    this.isSoChi = false;
  },
  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    // cc.game.canvas.addEventListener("touchmove", function (event) {
    //   // Ngăn chặn sự kiện mặc định của việc vuốt (swipe)
    //   event.preventDefault();

    //   // Xử lý sự kiện của bạn (nếu cần)
    // });
    // this.maskCard.on(cc.Node.EventType.TOUCH_START, this.clearnEventDefaut, this);
    for (let i = 0; i < this.listPosFirtCardFinish.length; i++) {
      const objPos = this.listPosFirtCardFinish[i];
      objPos.x *= cc.winSize.width / 1920;
    }

    for (let i = 0; i < this.listPosFirtReconnect.length; i++) {
      const objPos = this.listPosFirtReconnect[i];
      objPos.x *= cc.winSize.width / 1920;
    }

    this.node.setContentSize(cc.winSize);
    this.offsetX = cc.winSize.width / 2;
    this.offsety = cc.winSize.height / 2;
    for (let i = 0; i < 4; i++) {
      this.listConfigCard.push(this.getListCardPosAndAngleReconnect(i, 0.53, 350));
    }

    // this.listConfigCard.push(this.getListCardPosAndAngleWithAnTrang(i, 0.8, 350)); // danh cho case an trang;

    for (let i = 0; i < 4; i++) {
      this.listConfigCardFinish.push(this.getListCardPosAndAngleFinish(i, 0.6, 350));
      this.listConfigCardFinish_isMe.push(this.getListCardPosAndAngleFinish_isMe(i, 0.6, 350));
      this.listConfigCardOnXep.push(this.getListCardPosAndAngleOnXepCards(i, 0.6, 350));
      this.listConfigCardToiTrang.push(this.getListCardPosAndAngleFinish(i, 0.53, 350));
      this.listConfigCardToiTrangOrigin.push(this.getListCardPosAndAngleWithAnTrang(i, 0.6, 450));
    }

    this.setUpListCardOnXep();
    cc.log("onloading");
    this.setupStateBtn();
    this.setupBgCardGroup();
    this.btnXepBai.active = false;
    this.cardStack = [];
  },
  onEvent() {
    let player = Global.BinhView.isMe;
    let listCard = player.listCard;
    for (let i = 0; i < listCard.length; i++) {
      let cardCp = listCard[i];
      let cardNode = cardCp.node;
      cardNode.on(cc.Node.EventType.TOUCH_START, this.onClickCard, this);
      cardNode.on(cc.Node.EventType.TOUCH_MOVE, this.onMoveCard, this);
      cardNode.on(cc.Node.EventType.TOUCH_CANCEL, this.onCancelCard, this);
      cardNode.on(cc.Node.EventType.TOUCH_END, this.onEndCard, this);
    }
  },
  setupBgCardGroup() {
    for (let i = 0; i < this.listPosFirtBGCardsGroup.length; i++) {
      let posTaget = this.listPosFirtCardFinish[i];
      this.listMaskCardGroup[i].active = true;
      cc.tween(this.listMaskCardGroup[i]).to(0.2, { opacity: 70 }).start();
      if (i == 0) {
        this.listMaskCardGroup[i].setPosition(posTaget.x, posTaget.y + 100);
        this.listMaskCardGroup[i].setScale(1.4, 1.4);
      } else if (i === 1) {
        this.listMaskCardGroup[i].setPosition(posTaget.x, posTaget.y - 100);
      } else if (i === 2) {
        this.listMaskCardGroup[i].setPosition(posTaget.x, posTaget.y - 100);
      } else if (i === 3) {
        this.listMaskCardGroup[i].setPosition(posTaget.x, posTaget.y - 100);
      }
    }
  },
  setUpListCardOnXep() {
    // Vị trí card lúc xếp bài
    let firtPos = cc.v2(-178, 137);
    for (let i = 0; i < 3; i++) {
      let temp = firtPos.clone();
      this.listConfigCardMe.push(temp);
      firtPos.x += widthCard + 20;
    }

    firtPos.x = -358;
    firtPos.y -= heightCard + 40;
    for (let i = 0; i < 5; i++) {
      let temp = firtPos.clone();
      this.listConfigCardMe.push(temp);
      firtPos.x += widthCard + 20;
    }

    firtPos.x = -358;
    firtPos.y -= heightCard + 40;
    for (let i = 0; i < 5; i++) {
      let temp = firtPos.clone();
      this.listConfigCardMe.push(temp);
      firtPos.x += widthCard + 20;
    }
  },
  getMaxCardConfig(midPoint, scaleCard, distanceSum = 200) {
    let parameters = 0;
    let maxCard = 5;
    let distanceMax = distanceSum * scaleCard; // khoang canh tu quan giua den quan cuoi
    let firtPoint = midPoint.x - distanceMax;
    let lastPoint = midPoint.x + distanceMax;
    let p0 = { x: firtPoint, y: midPoint.y - parameters * scaleCard }, //use whatever points you want obviously
      p1 = { x: midPoint.x - distanceMax / 3, y: midPoint.y },
      p2 = { x: midPoint.x + distanceMax / 3, y: midPoint.y },
      p3 = { x: lastPoint, y: midPoint.y - parameters * scaleCard };
    let rotateFirt = -15; // angle card dau tien
    let rotateLast = -rotateFirt;
    let offsetRotate = (rotateLast - rotateFirt) / (maxCard - 1); //5la - 1;
    let offsetTime = 1 / (maxCard - 1); // 5la - 1;
    let firtTime = 0;
    // full dang la 5 la';
    let listReTurn = [];
    for (let i = 0; i < maxCard; i++) {
      let obj = {};
      // obj.angle = -rotateFirt;
      obj.angle = 0;
      obj.position = this.getBezier(firtTime, p0, p1, p2, p3);
      obj.scale = scaleCard;
      firtTime += offsetTime;
      rotateFirt += offsetRotate;
      listReTurn.push(obj);
    }
    return listReTurn;
  },

  getNewConfigCardPosition(midPoint, scale) {
    // cc.log("check size card : ", sizeCard);
    let listReTurn = [];
    let maxCard = 5;

    for (let i = 0; i < maxCard; i++) {
      let obj = {};
      obj.angle = 0;
      obj.scale = scale;
      obj.position = this.getPositionFromeMiddleX(maxCard, sizeCard.x * scale, i, midPoint);
      listReTurn.push(obj);
    }

    return listReTurn;
  },

  getPositionFromeMiddleX(maxCard, sizeCardX, i, midPoint) {
    let positionX = midPoint.x + sizeCardX * i - (sizeCardX * (maxCard + 1)) / 2 + sizeCardX;
    let positionY = midPoint.y;
    return cc.v2(positionX, positionY);
  },

  getBezier(t, p0, p1, p2, p3) {
    var cX = 3 * (p1.x - p0.x),
      bX = 3 * (p2.x - p1.x) - cX,
      aX = p3.x - p0.x - cX - bX;

    var cY = 3 * (p1.y - p0.y),
      bY = 3 * (p2.y - p1.y) - cY,
      aY = p3.y - p0.y - cY - bY;

    var x = aX * Math.pow(t, 3) + bX * Math.pow(t, 2) + cX * t + p0.x;
    var y = aY * Math.pow(t, 3) + bY * Math.pow(t, 2) + cY * t + p0.y;

    // cc.log("check t la : ", t);
    return { x: x, y: y };
  },

  onDestroy() {},
  offEvent() {
    let player = Global.BinhView.isMe;
    let listCard = player.listCard;
    for (let i = 0; i < listCard.length; i++) {
      let cardCp = listCard[i];
      let cardNode = cardCp.node;
      cardNode.off(cc.Node.EventType.TOUCH_START, this.onClickCard, this);
      cardNode.off(cc.Node.EventType.TOUCH_MOVE, this.onMoveCard, this);
      cardNode.off(cc.Node.EventType.TOUCH_CANCEL, this.onCancelCard, this);
      cardNode.off(cc.Node.EventType.TOUCH_END, this.onEndCard, this);
    }
  },
  clearnEventDefaut(touch) {},
  onClickCard(touch) {
    if (!this.canTouchCard) return;
    let clickedCardNode = touch.target;
    let player = Global.BinhView.isMe;
    let listCard = player.listCard;
    for (let i = 0; i < listCard.length; i++) {
      let cardCp = listCard[i];
      let cardNode = cardCp.node;
      if (cardNode === clickedCardNode) {
        let v2Touch = cc.v2(touch.getLocation());
        let target = v2Touch.subSelf(cc.v2(this.offsetX, this.offsetY));
        this._v2OffsetBody = cardNode.position.subSelf(target);
        this.cardCurrent = cardCp;
        this.cardCurrent.node.zIndex = 999;
        break;
      }
    }
  },
  onMoveCard(touch) {
    if (!this.canTouchCard || this.cardCurrent == null) return;
    let movedTouch = touch.getLocation();
    let v2Touch = cc.v2(movedTouch);
    let player = Global.BinhView.isMe;
    let listCard = player.listCard;
    let topmostCard = null;
    for (let i = listCard.length - 1; i >= 0; i--) {
      let cardCp = listCard[i];
      let cardNode = cardCp.node;

      if (cardNode.getBoundingBoxToWorld().contains(v2Touch) && this.cardCurrent != cardCp) {
        topmostCard = cardCp;
        break;
      }
    }
    for (let i = 0; i < listCard.length; i++) {
      let cardCp = listCard[i];
      cardCp.offLight();
    }
    if (topmostCard) {
      topmostCard.showLight(150);
    }
    let target = v2Touch.subSelf(cc.v2(this.offsetX, this.offsetY));
    this.cardCurrent.node.position = target.addSelf(this._v2OffsetBody);
  },
  onCancelCard() {
    if (!this.canTouchCard || this.cardCurrent == null) return;
    this.cardCurrent = null;
    this.resetCardOnXep(0.2);
  },
  onEndCard(touch) {
    if (!this.canTouchCard) return;
    let endedTouch = touch.getLocation();
    let v2Touch = cc.v2(endedTouch);
    let player = Global.BinhView.isMe;
    let listCard = player.listCard;

    for (let i = listCard.length - 1; i >= 0; i--) {
      let cardCp = listCard[i];
      let cardNode = cardCp.node;

      if (cardNode.getBoundingBoxToWorld().contains(v2Touch) && this.cardCurrent != cardCp) {
        this.swapCard(cardCp, this.cardCurrent);
        break;
      }
    }
    this.cardCurrent = null;
    this.resetCardOnXep(0.2);
  },
  swapCard(card1, card2) {
    // cc.log("Swap cards");
    let listCard = Global.BinhView.isMe.listCard;
    let index1 = listCard.indexOf(card1);
    let index2 = listCard.indexOf(card2);
    if (index1 > -1 && index2 > -1) {
      let temp = listCard[index1];
      listCard[index1] = listCard[index2];
      listCard[index2] = temp;
    }
    this.isSwapCard = true;
  },
  onClickBoChonAllCard() {
    Global.BinhView.isMe.boChonAllCard();
  },

  removeIconCard(player) {
    player.iconCard.destroy();
    player.iconCard = null;
  },
  getListCardPosAndAngleFinish(indexInTable, scale, distanceSum) {
    let midPoint = this.listPosFirtCardFinish[indexInTable].clone();
    if (indexInTable == 0) {
      midPoint.y = midPoint.y + 300;
      scale = 0.8;
      distanceSum = distanceSum - 30;
    }
    // setUpOfset5Card
    let listConfig = this.getMaxCardConfig(midPoint, scale, distanceSum);
    // cc.log("check listconfig 1 : ", listConfig);
    midPoint.y -= sizeCard.y * scale + 10;
    let listConfig2 = this.getMaxCardConfig(midPoint, scale, distanceSum);
    // cc.log("check listconfig 2 : ", listConfig2);
    midPoint.y -= sizeCard.y * scale + 10;
    let listConfig3 = this.getMaxCardConfig(midPoint, scale, distanceSum);
    // cc.log("check listconfig 3 : ", listConfig3);
    let listArrConfigCard = [];
    if (indexInTable == 3) {
      for (let i = 2; i < 5; i++) {
        // chi 1 3 la'
        listArrConfigCard.push(listConfig[i]);
      }
    } else {
      for (let i = 0; i < 3; i++) {
        // chi 1 3 la'
        listArrConfigCard.push(listConfig[i]);
      }
    }

    for (let i = 0; i < listConfig2.length; i++) {
      listArrConfigCard.push(listConfig2[i]);
    }
    for (let i = 0; i < listConfig3.length; i++) {
      listArrConfigCard.push(listConfig3[i]);
    }
    return listArrConfigCard;
  },

  getListCardPosAndAngleOnXepCards(indexInTable, scale, distanceSum) {
    let midPoint = this.listPosFirtCardFinish[indexInTable].clone();
    if (indexInTable == 0) {
      midPoint.y = midPoint.y + 501;
      midPoint.x = midPoint.x + 40;
      scale = 0.85;
      distanceSum = 330;
    }
    // setUpOfset5Card
    let listConfig = this.getMaxCardConfig(midPoint, scale, distanceSum);
    // cc.log("check listconfig 1 : ", listConfig);
    midPoint.y -= sizeCard.y * scale + 37;
    let listConfig2 = this.getMaxCardConfig(midPoint, scale, distanceSum);
    // cc.log("check listconfig 2 : ", listConfig2);
    midPoint.y -= sizeCard.y * scale + 37;
    let listConfig3 = this.getMaxCardConfig(midPoint, scale, distanceSum);
    // cc.log("check listconfig 3 : ", listConfig3);
    let listArrConfigCard = [];
    if (indexInTable == 3) {
      for (let i = 2; i < 5; i++) {
        // chi 1 3 la'
        listArrConfigCard.push(listConfig[i]);
      }
    } else {
      for (let i = 0; i < 3; i++) {
        // chi 1 3 la'
        listArrConfigCard.push(listConfig[i]);
      }
    }
    for (let i = 0; i < listConfig2.length; i++) {
      listArrConfigCard.push(listConfig2[i]);
    }
    for (let i = 0; i < listConfig3.length; i++) {
      listArrConfigCard.push(listConfig3[i]);
    }
    return listArrConfigCard;
  },
  getListCardPosAndAngleFinish_isMe(indexInTable, scale, distanceSum) {
    let midPoint = this.listPosFirtCardFinish[indexInTable].clone();
    if (indexInTable == 0) {
      midPoint.y = midPoint.y + 270;
      distanceSum = 340;
      scale = 0.8;
    }
    // setUpOfset5Card
    let listConfig = this.getMaxCardConfig(midPoint, scale, distanceSum);
    // cc.log("check listconfig 1 : ", listConfig);
    midPoint.y -= sizeCard.y * scale;
    let listConfig2 = this.getMaxCardConfig(midPoint, scale, distanceSum);
    // cc.log("check listconfig 2 : ", listConfig2);
    midPoint.y -= sizeCard.y * scale;
    let listConfig3 = this.getMaxCardConfig(midPoint, scale, distanceSum);
    // cc.log("check listconfig 3 : ", listConfig3);
    let listArrConfigCard = [];
    if (indexInTable == 3) {
      for (let i = 2; i < 5; i++) {
        // chi 1 3 la'
        listArrConfigCard.push(listConfig[i]);
      }
    } else {
      for (let i = 0; i < 3; i++) {
        // chi 1 3 la'
        listArrConfigCard.push(listConfig[i]);
      }
    }
    for (let i = 0; i < listConfig2.length; i++) {
      listArrConfigCard.push(listConfig2[i]);
    }
    for (let i = 0; i < listConfig3.length; i++) {
      listArrConfigCard.push(listConfig3[i]);
    }
    return listArrConfigCard;
  },
  getListCardPosAndAngleReconnect(indexInTable, scale, distanceSum) {
    let midPoint = this.listPosFirtReconnect[indexInTable].clone();
    // setUpOfset5Card
    if (indexInTable == 0) {
      midPoint.y = midPoint.y + 180;
      scale = 0.8;
      distanceSum = 340;
    }
    let listConfig = this.getMaxCardConfig(midPoint, scale, distanceSum);
    // cc.log("check listconfig 1 : ", listConfig);
    midPoint.y -= sizeCard.y * scale + 10;
    let listConfig2 = this.getMaxCardConfig(midPoint, scale, distanceSum);
    // cc.log("check listconfig 2 : ", listConfig2);
    midPoint.y -= sizeCard.y * scale + 10;
    let listConfig3 = this.getMaxCardConfig(midPoint, scale, distanceSum);
    // cc.log("check listconfig 3 : ", listConfig3);
    let listArrConfigCard = [];

    if (indexInTable == 3) {
      for (let i = 2; i < 5; i++) {
        // chi 1 3 la'
        listArrConfigCard.push(listConfig[i]);
      }
    } else {
      for (let i = 0; i < 3; i++) {
        // chi 1 3 la'
        listArrConfigCard.push(listConfig[i]);
      }
    }
    for (let i = 0; i < listConfig2.length; i++) {
      listArrConfigCard.push(listConfig2[i]);
    }
    for (let i = 0; i < listConfig3.length; i++) {
      listArrConfigCard.push(listConfig3[i]);
    }
    return listArrConfigCard;
  },

  getListCardPosAndAngleWithAnTrang(indexInTable, scale, distanceSum) {
    let midPoint = cc.v2(0, 270);
    // setUpOfset5Card
    let listConfig = this.getMaxCardConfig(midPoint, scale, distanceSum);
    midPoint.y -= 180;
    let listConfig2 = this.getMaxCardConfig(midPoint, scale, distanceSum);
    midPoint.y -= 180;
    let listConfig3 = this.getMaxCardConfig(midPoint, scale, distanceSum);
    midPoint.y -= 180;
    let listArrConfigCard = [];
    if (indexInTable == 3) {
      for (let i = 2; i < 5; i++) {
        // chi 1 3 la'
        listArrConfigCard.push(listConfig[i]);
      }
    } else {
      for (let i = 0; i < 3; i++) {
        // chi 1 3 la'
        listArrConfigCard.push(listConfig[i]);
      }
    }
    for (let i = 0; i < listConfig2.length; i++) {
      listArrConfigCard.push(listConfig2[i]);
    }
    for (let i = 0; i < listConfig3.length; i++) {
      listArrConfigCard.push(listConfig3[i]);
    }
    return listArrConfigCard;
  },
  creatCard(player = null, idCard = -1) {
    //binh
    let nodeCard = Global.BinhView.pool.getCard();
    let cardComponent = nodeCard.getComponent("CardBinh");
    cardComponent.setCardId(idCard);
    if (player) {
      player.listCard.push(cardComponent);
    }
    if (player !== Global.BinhView.isMe && player) {
      let node = new cc.Node();
      let lbNumberCard = node.addComponent(cc.Label);
      node.parent = nodeCard;
      node.name = "lbNumberCard";
      node.position = cc.v2(0, 0);
      lbNumberCard.fontSize = 120;
      if (player.indexInTable === 1 || player.indexInTable === 3) lbNumberCard.node.angle = 90;
      lbNumberCard.font = this.fontNumber;
      lbNumberCard.lineHeight = 80;
      lbNumberCard.node.active = false;
      lbNumberCard.string = player.listCard.length;
    }
    nodeCard.scale = 0.7;
    this.parentCard.addChild(nodeCard);
    return nodeCard;
  },
  setOffMaskCardGroup() {},
  chiaBaiAll(data) {
    // cc.log("DAAAAAAAAAAAA TAAAAAAAAAAAAAAAA", data);
    this.isLung = false;
    let isAnTrang = false;
    let isToiTrang = false;
    let isMe = Global.BinhView.isMe;
    let listPlayer = Global.BinhView.players;
    let dataPlayers = data[TMN_ParameterCode.Players];
    let dataMe = {};
    this.cardStack = [];
    // cc.log("DATA PLAYER", dataPlayers);
    for (let i = 0, l = dataPlayers.length; i < l; i++) {
      if (!Global.BinhView.isTest) dataPlayers[i] = JSON.parse(dataPlayers[i]);
      if (isMe && dataPlayers[i].Position == isMe.position) {
        dataMe = dataPlayers[i];
        // cc.log("check data me la : ", dataMe);
        isMe.toiTrangType = dataMe.ToiTrangType;
        isMe.handCards = dataMe.HandCards;
        if (dataMe.IsToiTrang) {
          // isAnTrang = true;
          isToiTrang = true;
        } else {
          isToiTrang = false;
        }
      }
    }

    if (isMe) {
      let arrCardMe = dataMe.HandCards;
      dataMe.HandCards.sort((a, b) => a - b);
      for (let i = 0, l = dataPlayers.length; i < l; i++) {
        let obj = dataPlayers[i];
        let player = Global.BinhView.getPlayerWithPosition(obj.Position);
        if (player == null) continue;
        player.numberCard = obj.NumberOfCards;
        if (player == Global.BinhView.isMe) {
          this.setupListSuggest(obj.SuggestPlan);
          for (let j = 0; j < obj.HandCards.length; j++) {
            let numberCard = obj.HandCards[j];
            let card = this.creatCard(player, numberCard);
            card.position = cc.v2(i / 10, 60 + i / 6);
            this.cardStack.push(card);
          }
        } else {
          for (let j = 0; j < arrCardMe.length; j++) {
            let card = this.creatCard(player);
            card.position = cc.v2(i / 10, 60 + i / 6);
            this.cardStack.push(card);
          }
        }
        player._isPlaying = true;
        this.scheduleOnce(() => {}, 0.7);
      }
    }
    let action2 = () => {
      for (let i = 0; i < this.cardStack.length; i++) {
        let card = this.cardStack[i];
        card.active = false;
        card.scale = 1;
      }
      this.animDealCard.node.active = true;
      this.animDealCard.node.setScale(0.7, 0.7);
      this.animDealCard.setAnimation(0, "animation", false);
    };
    let action3 = () => {
      Global.AudioManager.playChiaBai();
      for (let i = 0; i < this.cardStack.length; i++) {
        let card = this.cardStack[i];
        card.active = true;
        card.scale;
      }
      this.animDealCard.node.active = false;
      let delay = 0;
      let listPlayers = [0, 1, 2, 3];
      for (let i = 0; i < listPlayer.length; i++) {
        const player = listPlayer[i];
        if (player === null) {
          continue;
        }
        player.isPlaying = true;
        delay = 0;
        let index = listPlayers.indexOf(player.indexInTable);
        if (index !== -1) {
          listPlayers.splice(index, 1);
        }
        // cc.log("new listPlayersIndexIntable", listPlayers);
        // cc.log("listMaskCardGroupplayer.indexInTable", this.listMaskCardGroup[player.indexInTable]);
        cc.Tween.stopAllByTarget(this.listMaskCardGroup[player.indexInTable]);
        cc.tween(this.listMaskCardGroup[player.indexInTable]).to(0.3, { opacity: 255 }).start();
        let maskPos = this.listPosFirtReconnect[player.indexInTable];
        // cc.log("player position start phat bai", maskPos);
        let posTarget = this.listConfigCard[player.indexInTable];
        for (let j = 0; j < player.listCard.length; j++) {
          let objCardPosAndAngle = posTarget[j];
          const card = player.listCard[j];
          card.node.setScale(0, 0);
          if (player === isMe) {
            let cardPos = cc.v2(objCardPosAndAngle.position.x, objCardPosAndAngle.position.y);
            let cardAngle = objCardPosAndAngle.angle;
            let cardScale = objCardPosAndAngle.scale;
            cc.tween(card.node)
              .delay(delay)
              .to(0.3, { scale: cardScale, position: cardPos, angle: cardAngle }, { easing: "backOut" })
              .delay(0.5)
              .call(() => {})
              .start();
          } else {
            let cardPos = cc.v2(objCardPosAndAngle.position.x, objCardPosAndAngle.position.y);
            let cardAngle = objCardPosAndAngle.angle;
            let cardScale = objCardPosAndAngle.scale;
            cc.tween(card.node)
              .delay(delay)
              .to(0.3, { scale: cardScale, position: cardPos, angle: cardAngle }, { easing: "expoOut" })
              .call(() => {})
              .start();
          }
          delay += 0.05;
        }
      }
      for (let i = 0; i < listPlayers.length; i++) {
        cc.Tween.stopAllByTarget(this.listMaskCardGroup[listPlayers[i]]);
        cc.tween(this.listMaskCardGroup[listPlayers[i]]).to(0.2, { opacity: 70 }).start();
      }
      this.scheduleOnce(
        (this.funSoundChiaBai = () => {
          Global.AudioManager.stopChiaBai();
        }),
        delay + 0.1
      );
      this.scheduleOnce(() => {
        for (let i = 0; i < listPlayer.length; i++) {
          let player = listPlayer[i];
          if (player === null) continue;
        }
      }, 3);
    };
    cc.tween(this).call(action2).delay(2.5).call(action3).start();
    if (isMe) {
      // cc.log("is ME", isMe);
      this.scheduleOnce(
        (this.fun3 = () => {
          isMe.openAllCardWithEffect();
          this.onEvent();
        }),
        4
      );
      this.scheduleOnce(
        (this.fun2 = () => {
          this.onXepCard(isToiTrang);
          for (let i = 0, l = dataPlayers.length; i < l; i++) {
            let obj = dataPlayers[i];
            let player = Global.BinhView.getPlayerWithPosition(obj.Position);
            player.setTurn(Global.BinhView.turnTime - 5);
            player.showDangXep();
          }
          // cc.log("turn time", Global.BinhView.turnTime);
          Global.BinhView.activeClockAndRun(Global.BinhView.turnTime - 5);
          this.xepBaiCloneUserOther();
        }),
        4.5
      );
    }
    for (let i = 0, l = dataPlayers.length; i < l; i++) {
      let obj = dataPlayers[i];
      let player = Global.BinhView.getPlayerWithPosition(obj.Position);
      player.setupCard3Chi();
    }
    if (isMe && isMe._isPlaying && isAnTrang) {
      this.scheduleOnce(
        (this.fun1 = () => {
          this.latBaiPlayer(isMe, dataMe.HandCards, false, true);
          // isMe.showTypeAnTrang(dataMe.ToiTrangType);
        }),
        0.7
      );
    }
  },

  latBai(result) {
    this.offEvent();
    Global.BinhView.nodeClockTime.opacity = 1;
    let isMe = Global.BinhView.isMe;
    this.btnXepBai.active = false;
    let isToiTrang = false;
    this.isSoChi = true;
    let infoMe = null;
    for (let i = 0, l = result.length; i < l; i++) {
      let temp = result[i];
      // cc.log("temp", result[i]);
      let tempCards = temp.HandCards;
      let position = temp.Position;
      let player = Global.BinhView.getPlayerWithPosition(position);
      if (player == null) continue;
      let anTrangType = result[i].ToiTrangType;
      if (anTrangType != TypeAnTrang.UNKNOWN && player !== isMe) {
        this.showCardWinWhite(result[i].ToiTrangType, tempCards, player);
        isToiTrang = true;
        //break;
      }
      if (player == isMe) {
        infoMe = temp;
      }
    }
    let timeDelay = 1;
    if (isToiTrang) timeDelay = 4;
    this.scheduleOnce(
      (this.funLatBai = () => {
        for (let i = 0, l = result.length; i < l; i++) {
          let temp = result[i];
          // cc.log("temp", temp);
          let tempCards = temp.HandCards;
          let position = temp.Position;
          let player = Global.BinhView.getPlayerWithPosition(position);
          if (player == null) continue;
          player.hideUser();
          // cc.log("player data end game", player);
          player.setDataEndGame(infoMe, temp);
          let winType = result[i].WinType;
          let isBinhLung = result[i].IsBinhLung;
          // cc.log("result Binh Lung state", isBinhLung);
          let anTrangType = result[i].ToiTrangType == TypeAnTrang.UNKNOWN ? false : true;
          if (isBinhLung) {
            this.latBaiPlayer(player, tempCards, isBinhLung, false, winType == WinTypeBinh.Lose_ToiTrang); // thua lung hoac thua toi trang thi bai mau xam'
          } else if (anTrangType) {
            // cc.log("lat bai player ####################");
            this.latBaiPlayer(player, tempCards, false, true);
          } else {
            // cc.log("lat bai từng chi #######################");
            this.latBaiPlayer(player, tempCards);
            this.scheduleOnce(
              (this.funLat = () => {
                player.setCardChiWithEndGame();
              }),
              0.2
            );
          }
          if (player == isMe && (anTrangType || isBinhLung)) {
            player.hideUser();
            // isMe.showTotalPointChiEndGame();
            // Global.BinhView.setPointPanelIsMe(isMe.totalPoint, 4);
          }
        }
      }),
      timeDelay
    );
  },
  latBaiMe(arrIdCard) {
    let listConfig = this.listConfigCardFinish_isMe[0];
    // cc.log(arrIdCard);
    for (let c = 0, l2 = arrIdCard.length; c < l2; c++) {
      let objConfig = listConfig[c];
      let card = this.creatCard(Global.BinhView.isMe, arrIdCard[c]);
      card.scale = objConfig.scale;
      card.position = cc.v2(objConfig.position.x, objConfig.position.y);
      card.angle = objConfig.angle;
      let cardCp = card.getComponent("CardBinh");
      cardCp.openCard();
    }
  },
  latBaiPlayer(player, arrIdCard, isBinhLung = false, isToiTrang = false, isLoseToiTrang = false) {
    // cc.log("playerIndex table", player.indexInTable);
    let listPosAndAngleCard = this.listConfigCard[player.indexInTable];
    // cc.log("lật bài player ddddddddddddddddddddddd");
    player.resetXepXong();
    player.endTurn();
    let listCard = player.listCard;
    for (let i = 0, l = arrIdCard.length; i < l; i++) {
      let objPosAndAngle = listPosAndAngleCard[i];
      let card = listCard[i];
      if (card == null) {
        card = this.creatCard(player, arrIdCard[i]).getComponent("CardBinh");
        // cc.log("chay vao day la " + i)
        card.node.scale = objPosAndAngle.scale;
      }
      card.upCard();
      if (isBinhLung || isToiTrang || isLoseToiTrang) {
        if (player.indexInTable !== 0) {
          card.setCardIdAndOpenEffect(arrIdCard[i]);
        } else {
          card.setCardIdAndOpen(arrIdCard[i]);
        }
        if (isBinhLung) {
          card.setGrayCard();
        }
      } else {
        // cc.log("card ID", arrIdCard[i]);
        card.setCardId(arrIdCard[i]);
      }
      let cardPos = cc.v2(objPosAndAngle.position.x, objPosAndAngle.position.y);
      let cardAngle = objPosAndAngle.angle;
      let cardScale = objPosAndAngle.scale;

      cc.Tween.stopAllByTarget(card.node);
      cc.tween(card.node).to(0.3, { scale: cardScale }, { easing: "backInOut" }).start();
      cc.tween(card.node)
        .to(0.3, { position: cardPos, angle: cardAngle }, { easing: "backInOut" })
        .call(() => {
          cc.tween(this.maskSoChi).to(0.3, { opacity: 100 }).start();
        })
        .start();
    }

    if (isBinhLung) player.showTypeWin(WinTypeBinh.Lose_BinhLung);
    if (isLoseToiTrang) player.showTypeWin(WinTypeBinh.Lose);

    // danh cho truong hop bi loi
    if (arrIdCard.length < 1) return;
    for (let i = arrIdCard.length, l = listCard.length; i < l; i++) {
      let card = player.getCardById(null, true);
      if (card) Global.BinhView.pool.putCard(card.node);
    }
  },

  creatCardForReconnect(player) {
    // cc.log("set reconnnect create");
    cc.Tween.stopAllByTarget(this.listMaskCardGroup[player.indexInTable]);
    cc.tween(this.listMaskCardGroup[player.indexInTable]).to(0.3, { opacity: 255 }).start();
    if (player == Global.BinhView.isMe) {
      if (player.listCardIdForReconnect.length > 0) {
        this.latBaiMe(player.listCardIdForReconnect);
        this.setupListSuggest(player.suggestPlan);
        player.setupCard3Chi();
        this.onEvent();
      }
      return;
    }
    let idCard = player.listCardIdForReconnect;
    if (idCard.length == 0) idCard.length = 13; // case dang xep bai
    this.showCardReconnect(player, idCard, false, true);
    player.setupCard3Chi();
  },

  showCardReconnect(player, arrIdCard, isBinhLung = false, isToiTrang = false, isLoseToiTrang = false) {
    // cc.log("chay vao show card reconnect");
    let listPosAndAngleCard = this.listConfigCard[player.indexInTable];
    player.endTurn();
    let listCard = player.listCard;
    let posInTable = player.indexInTable;
    let scale = 0.53;
    // if (posInTable == 0) scale = 0.;
    for (let i = 0, l = arrIdCard.length; i < l; i++) {
      let objPosAndAngle = listPosAndAngleCard[i];
      let card = listCard[i];
      if (card == null) {
        card = this.creatCard(player, arrIdCard[i]).getComponent("CardBinh");
        card.node.scale = scale;
      }
      card.upCard();
      if (isBinhLung || isToiTrang || isLoseToiTrang) {
        card.setCardIdAndOpen(arrIdCard[i]);
        if (isBinhLung) {
          card.setGrayCard();
        }
      } else {
        card.setCardId(arrIdCard[i]);
      }

      card.node.x = objPosAndAngle.position.x;
      card.node.y = objPosAndAngle.position.y;
      card.node.scale = scale;
      card.node.angle = objPosAndAngle.angle;
    }
    if (isBinhLung) player.showTypeWin(WinTypeBinh.Lose_BinhLung);
    if (isLoseToiTrang) player.showTypeWin(WinTypeBinh.Lose);

    // danh cho truong hop bi loi
    // trường hợp gen ra nhiều card thì put bớt card đi :))
    if (arrIdCard.length < 1) return;
    for (let i = arrIdCard.length, l = listCard.length; i < l; i++) {
      let card = player.getCardById(null, true);
      if (card) Global.BinhView.pool.putCard(card.node);
    }
  },

  reset(time_out_bg) {
    // cc.log("reset card");
    let listPlayer = Global.BinhView.players;
    for (let i = 0, l = listPlayer.length; i < l; i++) {
      let player = listPlayer[i];
      if (player) {
        player.resetCard(Global.BinhView);
        player.isMauBinh = false;
        player.isBinhLung = false;
      }
    }
    if (time_out_bg >= 40) {
      cc.Tween.stopAllByTarget(this.node);
      this.unschedule(this.fun2);
    }
    cc.tween(this.maskSoChi).to(0.1, { opacity: 0 }).start();
    this.animDealCard.node.active = false;
    this.btnXepBai.active = false;
    this.parentButtonPlay.active = false;
    this.listCardTurn.length = 0;
    this.listCardTurnPlayer.length = 0;
    this.listCurrentIdCard.length = 0;
    this.isXepBai = false;
    this.unschedule(this.funLat);
    this.unschedule(this.funLatBai);
    this.unschedule(this.fun1);
    this.unschedule(this.fun3);
    this.resetCardEffect();
  },

  showCardWinWhite(typeWin, arrIdCard, player) {
    // cc.log("ARR ID CARD", arrIdCard);
    //arrIdCard.sort((a,b) => a-b);
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
    if (str == "") return;
    this.nodeAnTrang.active = true;
    this.mask.opacity = 0;
    cc.tween(this.mask).to(0.15, { opacity: 180 }).start();
    let listConfigCard = this.listConfigCardToiTrangOrigin[player.indexInTable];
    let firtChi0 = listConfigCard[0];
    let firtChi1 = listConfigCard[3];
    let firtChi2 = listConfigCard[8];

    let delay = 0.03;
    let currentIndex = 0;
    for (let i = 0; i < 3; i++) {
      let objCardPosAndAngle = listConfigCard[currentIndex];
      let posTarget = cc.v2(objCardPosAndAngle.position.x, objCardPosAndAngle.position.y);
      let cardNode = this.creatCard(null, arrIdCard[currentIndex]);
      cardNode.parent = this.nodeAnTrang;
      cardNode.scale = 0.8;
      this.listNodeCardEffect.push(cardNode);
      cardNode.x = firtChi0.position.x;
      cardNode.y = firtChi0.position.y;
      cardNode.angle = firtChi0.angle;
      cardNode.opacity = 0;
      cc.tween(cardNode)
        .delay(delay * (i + 1))
        .to(0.2, { angle: objCardPosAndAngle.angle, position: posTarget, opacity: 255 })
        .start();
      cc.tween(cardNode)
        .delay(delay * i)
        .to(0.3, { opacity: 255 })
        .start();
      currentIndex++;
    }
    for (let i = 0; i < 5; i++) {
      let objCardPosAndAngle = listConfigCard[currentIndex];
      let posTarget = cc.v2(objCardPosAndAngle.position.x, objCardPosAndAngle.position.y);
      let cardNode = this.creatCard(null, arrIdCard[currentIndex]);
      cardNode.parent = this.nodeAnTrang;
      cardNode.scale = 0.8;
      this.listNodeCardEffect.push(cardNode);
      cardNode.x = firtChi1.position.x;
      cardNode.y = firtChi1.position.y;
      cardNode.angle = firtChi1.angle;
      cardNode.opacity = 0;
      cc.tween(cardNode)
        .delay(delay * i)
        .to(0.2, { angle: objCardPosAndAngle.angle, position: posTarget, opacity: 255 })
        .start();

      cc.tween(cardNode)
        .delay(delay * i)
        .to(0.3, { opacity: 255 })
        .start();
      currentIndex++;
    }
    for (let i = 0; i < 5; i++) {
      let objCardPosAndAngle = listConfigCard[currentIndex];
      let posTarget = cc.v2(objCardPosAndAngle.position.x, objCardPosAndAngle.position.y);
      let cardNode = this.creatCard(null, arrIdCard[currentIndex]);
      cardNode.parent = this.nodeAnTrang;
      cardNode.scale = 0.8;
      this.listNodeCardEffect.push(cardNode);
      cardNode.x = firtChi2.position.x;
      cardNode.y = firtChi2.position.y;
      cardNode.angle = firtChi2.angle;
      cardNode.opacity = 0;
      cc.tween(cardNode)
        .delay(delay * i)
        .to(0.2, { angle: objCardPosAndAngle.angle, position: posTarget, opacity: 255 })
        .start();
      cc.tween(cardNode)
        .delay(delay * i)
        .to(0.3, { opacity: 255 })
        .start();
      currentIndex++;
    }
    for (let i = 0; i < player.listCard.length; i++) {
      const objCard = player.listCard[i];
      objCard.node.active = false;
    }
    this.unschedule(this.funAnTrang);
    this.scheduleOnce(
      (this.funAnTrang = () => {
        for (let i = 0, l = this.listNodeCardEffect.length; i < l; i++) {
          let cardCp = this.listNodeCardEffect[i].getComponent("CardBinh");
          cardCp.openCardWithEffect();
        }
      }),
      1
    );

    let funMoveCard = () => {
      let listConfigTemp = this.listConfigCardToiTrang[player.indexInTable];
      if (player.indexInTable == 0) {
        for (let i = 0, l = this.listNodeCardEffect.length; i < l; i++) {
          let objTemp = listConfigTemp[i];
          let cardNode = this.listNodeCardEffect[i];
          cc.tween(cardNode)
            .to(0.3, { position: cc.v2(objTemp.position.x, objTemp.position.y - 50), scale: objTemp.scale }, { easing: "backInOut" })
            .start();
        }
      } else if (player.indexInTable == 2) {
        for (let i = 0, l = this.listNodeCardEffect.length; i < l; i++) {
          let objTemp = listConfigTemp[i];
          let cardNode = this.listNodeCardEffect[i];
          cc.tween(cardNode)
            .to(0.3, { position: cc.v2(objTemp.position.x, objTemp.position.y), scale: objTemp.scale }, { easing: "backInOut" })
            .start();
        }
      } else if (player.indexInTable == 1) {
        for (let i = 0, l = this.listNodeCardEffect.length; i < l; i++) {
          let objTemp = listConfigTemp[i];
          let cardNode = this.listNodeCardEffect[i];
          cc.tween(cardNode)
            .to(0.3, { position: cc.v2(objTemp.position.x, objTemp.position.y + 50), scale: objTemp.scale }, { easing: "backInOut" })
            .start();
        }
      } else if (player.indexInTable == 3) {
        for (let i = 0, l = this.listNodeCardEffect.length; i < l; i++) {
          let objTemp = listConfigTemp[i];
          let cardNode = this.listNodeCardEffect[i];
          cc.tween(cardNode)
            .to(0.3, { position: cc.v2(objTemp.position.x + 10, objTemp.position.y + 30), scale: objTemp.scale }, { easing: "backInOut" })
            .start();
        }
      }
    };

    let funFade = () => {
      cc.tween(this.mask).to(0.15, { opacity: 0 }).start();
      cc.tween(this.lbTitleCardAnTrang).to(0.15, { opacity: 0 }).start();
    };

    let nodeText = cc.find(str, this.lbTitleCardAnTrang);
    if (nodeText) nodeText.active = true;
    let nodeLb = this.lbTitleCardAnTrang;
    let posNodeLb = cc.v2(nodeLb.x, nodeLb.y + 200);
    let posOrigin = cc.v2(nodeLb.x, nodeLb.y);
    cc.Tween.stopAllByTarget(nodeLb);
    nodeLb.active = true;
    nodeLb.opacity = 0;
    nodeLb.scale = 10;
    cc.tween(nodeLb)
      .delay(1.0)
      .to(0.5, { position: posNodeLb, scale: 1, opacity: 255 }, { easing: "expoIn" })
      .delay(1)
      .call(funFade)
      .delay(0.15)
      .call(funMoveCard)
      .delay(0.4)
      .call(() => {
        nodeLb.setPosition(posOrigin);
        nodeText.active = false;
        nodeLb.active = false;
        this.resetCardEffect();
        for (let i = 0; i < player.listCard.length; i++) {
          const objCard = player.listCard[i];
          objCard.node.active = true;
        }
        if (player.indexInTable == 0) {
          this.setPositionCards(player);
        }
      })
      .start();
  },

  xuLyCardEndGame(player) {
    // player.MovingTotalPointNodeReconnectPos();
    cc.tween(this.maskSoChi).to(0.3, { opacity: 0 }).start();
    let listPosAndAngleCard = this.listConfigCard[player.indexInTable];
    let listCard = player.listCard;
    for (let i = 0, l = listCard.length; i < l; i++) {
      let objPosAndAngle = listPosAndAngleCard[i];
      let card = listCard[i];
      if (card == null) {
        card = this.creatCard(player, arrIdCard[i]).getComponent("CardBinh");
        // cc.log("chay vao day la " + i)
        card.node.scale = objPosAndAngle.scale;
      }
      let cardPos = cc.v2(objPosAndAngle.position.x, objPosAndAngle.position.y);
      let cardAngle = objPosAndAngle.angle;
      let cardScale = objPosAndAngle.scale;
      cc.Tween.stopAllByTarget(card.node);
      cc.tween(card.node).to(0.3, { scale: cardScale }, { easing: "backInOut" }).start();
      cc.tween(card.node)
        .to(0.3, { position: cardPos, angle: cardAngle }, { easing: "backInOut" })
        .call(() => {})
        .start();
    }
  },

  resetCardEffect() {
    this.unschedule(this.funAnTrang);
    cc.Tween.stopAllByTarget(this.lbTitleCardAnTrang);
    for (let i = 0, l = this.listNodeCardEffect.length; i < l; i++) {
      Global.BinhView.pool.putCard(this.listNodeCardEffect[i]);
    }

    let children = this.lbTitleCardAnTrang.children;

    for (let i = 0, l = children.length; i < l; i++) {
      children[i].active = false;
    }

    this.listNodeCardEffect.length = 0;
    this.nodeAnTrang.active = false;
    this.lbTitleCardAnTrang.active = false;
  },

  resetCardOnXep(timeSwap) {
    // cc.log("chay vao binh resetCardOnXep");
    let isMe = Global.BinhView.isMe;
    let listCard = isMe.listCard;
    isMe.setupCard3Chi();
    //  cc.log()
    let listConfig = this.listConfigCardOnXep[0];
    this.maskCard.opacity = 150;
    for (let i = 0, l = listCard.length; i < l; i++) {
      let objConfig = listConfig[i];
      let pos = cc.v2(objConfig.position.x, objConfig.position.y);
      let angle = objConfig.angle;
      let scale = objConfig.scale;
      let cardCp = listCard[i];
      let cardNode = cardCp.node;
      cardNode.zIndex = i;
      cardNode.parent = this.parentCardMe;
      cardCp.setCardNomal();
      cardCp.offLight();
      cc.Tween.stopAllByTarget(cardNode);
      cc.tween(cardNode).to(timeSwap, { scale: scale }, { easing: "backInOut" }).start();
      cc.tween(cardNode).to(timeSwap, { position: pos, angle: angle }, { easing: "backInOut" }).start();
    }
    this.checkCard();
    Global.BinhView.sendApplyChi();
  },
  resetCardSuggest() {
    // cc.log("chay vao binh resetCardSuggest");
    let isMe = Global.BinhView.isMe;
    let listCard = isMe.listCard;
    isMe.setupCard3Chi();
    //  cc.log()
    let listPos = this.listConfigCardMe;
    for (let i = 0, l = listCard.length; i < l; i++) {
      let cardCp = listCard[i];
      let cardNode = cardCp.node;
      cardNode.zIndex = i;
      cardCp.offLight();
      cc.Tween.stopAllByTarget(cardNode);
      cc.tween(cardNode).to(0.4, { position: listPos[i] }).start();
    }
    this.checkCard();
    Global.BinhView.sendApplyChi();
  },
  onXepCard(isAnTrang) {
    if (isAnTrang) {
      Global.BinhView.btnMauBinh.node.active = true;
      Global.BinhView.btnXepXong.active = true;
    } else {
      Global.BinhView.btnXepXong.active = true;
      Global.BinhView.btnMauBinh.node.active = false;
    }

    // cc.log("chay vao binh onXepCard");
    if (Global.BinhView.stateTable == StateTable.Endgame) return;
    this.isXepBai = true;
    this.canTouchCard = true;
    this.isThuCard = false;
    Global.BinhView.isClickXepXong = false;
    this.scheduleOnce(function () {
      // cc.log("onxepcard");
      this.setupStateBtn();
    }, 0.3);

    this.resetCardOnXep(0.2);
    // cc.log(Global.BinhView.parentPlayer.children);
    let isMe = Global.BinhView.isMe;
    // cc.log("isMeData", Global.BinhView.isMe);
    let listCard = isMe.listCard;
    console.log("isMe node", isMe.node);
    isMe.node.active = false;
    let listConfig = this.listConfigCardOnXep[0];
    let posTaget = this.listPosFirtCardFinish[0];
    // cc.log("postaget", posTaget);
    this.frameTruFalseGroup.position = cc.v2(posTaget.x - 20, posTaget.y + 498 + 145);
    this.textSoChiGroup.position = cc.v2(posTaget.x - 200, posTaget.y + 450 + 145);
    this.iconTrueFalseGroup.position = cc.v2(posTaget.x - 240, posTaget.y + 270 + 145);
    // this.swapNode.position = cc.v2(posTaget.x + 240, posTaget.y + 145);
    this.SkeletonGroup.position = cc.v2(posTaget.x + 50, posTaget.y + 350 + 145);
    cc.tween(this.maskCard).to(0.3, { opacity: 100 }).start();
    for (let i = 0, l = listCard.length; i < l; i++) {
      let objConfig = listConfig[i];
      let pos = cc.v2(objConfig.position.x, objConfig.position.y);
      let angle = objConfig.angle;
      let scale = objConfig.scale;
      let cardCp = listCard[i];
      let cardNode = cardCp.node;
      cardNode.zIndex = i;
      cardNode.parent = this.parentCardMe;
      cardCp.setCardNomal();
      cardCp.offLight();
      cc.Tween.stopAllByTarget(cardNode);
      cc.tween(cardNode).to(0.5, { scale: scale }, { easing: "backInOut" }).start();
      cc.tween(cardNode).to(0.5, { position: pos, angle: angle }, { easing: "backInOut" }).start();
    }
  },
  onThuCard(timeScale) {
    // cc.log("on thucard");
    // Global.BinhView.ClockTimerMoveFinish();
    this.canTouchCard = false;
    this.cardCurrent = null;
    this.isXepBai = false;
    cc.Tween.stopAllByTarget(this.maskCard);
    this.setupStateBtn();
    cc.tween(this.maskCard).to(timeScale, { opacity: 0 }).start();
    let isMe = Global.BinhView.isMe;
    let listCard = isMe.listCard;
    let listConfig = this.listConfigCardFinish_isMe[0];
    for (let i = 0, l = listCard.length; i < l; i++) {
      let objConfig = listConfig[i];
      cc.log("check dcm m : ", objConfig)
      let pos = cc.v2(objConfig.position.x, objConfig.position.y);
      let angle = objConfig.angle;
      let scale = objConfig.scale;
      let cardCp = listCard[i];
      let cardNode = cardCp.node;
      cardNode.zIndex = i;
      cardNode.parent = this.parentCardMe;
      cardCp.setCardNomal();
      cardCp.offLight();
      cc.Tween.stopAllByTarget(cardNode);
      cc.tween(cardNode)
        .to(timeScale, { position: pos, angle: angle }, { easing: "backInOut" })
        .call(() => {
          Global.BinhView.isMe.node.active = true;
        })
        .start();
      cc.tween(cardNode).to(timeScale, { scale: scale }, { easing: "backInOut" }).start();
    }
  },
  setPositionCards(player) {
    this.canTouchCard = false;
    this.cardCurrent = null;
    this.isXepBai = false;
    let listConfig = [];
    cc.Tween.stopAllByTarget(this.maskCard);
    cc.tween(this.maskCard).to(0.1, { opacity: 0 }).start();
    // let isMe = Global.BinhView.isMe;
    this.setupStateBtn();
    this.btnXepBai.active = false;
    if (Global.BinhView.isEndGame == true) {
      Global.BinhView.nodeClockTime.opacity = 0;
    } else {
      Global.BinhView.nodeClockTime.opacity = 255;
    }
    let listCard = player.listCard;
    if (player.indexInTable == 0) {
      listConfig = this.listConfigCardFinish_isMe[player.indexInTable];
    } else {
      listConfig = this.listConfigCard[player.indexInTable];
    }

    for (let i = 0, l = listCard.length; i < l; i++) {
      let objConfig = listConfig[i];
      let pos = cc.v2(objConfig.position.x, objConfig.position.y);
      let angle = objConfig.angle;
      let scale = objConfig.scale;
      let cardCp = listCard[i];
      let cardNode = cardCp.node;
      cardNode.zIndex = i;
      cardNode.parent = this.parentCardMe;
      cardCp.setCardNomal();
      cardCp.offLight();
      cc.Tween.stopAllByTarget(cardNode);
      cardNode.setPosition(pos);
      cardNode.setScale(scale);
      cardNode.angle = angle;
      player.node.active = true;
      if (!this.isSoChi) {
        player.showXepXong();
      }
    }
  },
  arrangeCard() {
    let isMe = Global.BinhView.isMe;
    let listPlayer = Global.BinhView.players;
    for (let i = 0; i < listPlayer.length; i++) {
      if (listPlayer[i] == isMe) {
        listPlayer[i].GetNameChiIsMe();
      }
    }
  },
  setupStateBtn() {
    // cc.log("setupStateBtn");
    if (this.isXepBai) {
      Global.BinhView.nodeClockTime.opacity = 255;
      this.parentButtonPlay.active = true;
      // this.frameTrueFalse.active = true;
      this.btnXepBai.active = false;
      cc.tween(this.maskCard).to(0.3, { opacity: 150 }).start();
    } else {
      Global.BinhView.nodeClockTime.opacity = 255;
      this.parentButtonPlay.active = false;
      // this.frameTrueFalse.active = false;
      if (Global.BinhView.stateTable == StateTable.Playing) {
        // cc.log("on active btnXepBai");
        this.btnXepBai.active = true;
      }
    }
  },

  setupListSuggest(listArrIdSugges) {
    this.listSuggestCard = [];
    for (let i = 0, l = listArrIdSugges.length; i < l; i++) {
      this.listSuggestCard.push(listArrIdSugges[i].Cards);
    }
    let nodeGoiY = cc.find("buttonGoiY", this.parentButtonPlay);
    if (this.listSuggestCard.length == 0) {
      nodeGoiY.active = false;
    } else {
      nodeGoiY.active = true;
    }
  },
  checkCard() {
    // cc.log("check card");
    let isMe = Global.BinhView.isMe;
    for (let i = 0, l = this.listSpineFullCard.length; i < l; i++) {
      this.listSpineFullCard[i].node.active = false;
    }
    let list1 = isMe.getIdCardByChi(0);
    let list2 = isMe.getIdCardByChi(1);
    let list3 = isMe.getIdCardByChi(2);

    for (let i = 0; i < 3; i++) {
      this.resetWrongCard(i);
    }
    this.listStrongCard.length = 0;
    this.layTenBoBai(list1, 0);
    this.layTenBoBai(list2, 1);
    this.layTenBoBai(list3, 2);
  },
  layTenBoBai(listArrId, indexBoCard) {
    // cc.log("lay ten bo bai");
    listArrId.sort(function (a, b) {
      return b - a;
    });
    let objBoCard = {};
    objBoCard.maxCard2 = listArrId.slice();
    let cardHelper = require("CardHelperBinh").getIns();
    let doi = cardHelper.getThu(listArrId); // vi thu la 2 doi
    let samCo = cardHelper.getSamCoTLMN(listArrId);
    let sriteStrongCard = this.listSpriteNameCard[indexBoCard];
    let strongCard = TypeStrongCard.MauThau;
    let listIdGold = [];
    let listCardConLai = [];
    let maxCard1 = 0;
    if (listArrId.length < 4) {
      if (samCo.length > 0) {
        strongCard = TypeStrongCard.Xam;
        maxCard1 = samCo[0][0];
        listIdGold = samCo[0];
      } else if (doi.length > 0) {
        strongCard = TypeStrongCard.Doi;
        maxCard1 = doi[0];
        listIdGold = doi;
      }
    } else {
      let thungPhaSanhLon = cardHelper.getThungPhaSanhLon(listArrId.slice());
      let thungPhaSanh = cardHelper.getThungPhaSanh(listArrId.slice());
      let tuqui = cardHelper.getTuQuiBinh(listArrId.slice());
      let cuLu = cardHelper.getCuLu(listArrId.slice());
      let thung = cardHelper.getThung(listArrId.slice());
      let sanh = cardHelper.getSanhBinh(listArrId.slice());
      if (thungPhaSanhLon.length > 0) {
        strongCard = TypeStrongCard.ThungPhaSanhLon;
        listIdGold = thungPhaSanhLon;
        objBoCard.maxFace = thungPhaSanhLon[0] % 10;
      } else if (thungPhaSanh.length > 0) {
        strongCard = TypeStrongCard.ThungPhaSanh;
        listIdGold = thungPhaSanh;
        objBoCard.maxFace = thungPhaSanh[0] % 10;
      } else if (tuqui.length > 0) {
        strongCard = TypeStrongCard.Tuqui;
        listIdGold = tuqui;
        maxCard1 = tuqui[0][0];
      } else if (cuLu.length > 0) {
        strongCard = TypeStrongCard.CuLu;
        listIdGold = cuLu;
        maxCard1 = cuLu[0];
      } else if (thung.length > 0) {
        strongCard = TypeStrongCard.Thung;
        listIdGold = thung;
        objBoCard.maxFace = thung[0] % 10;
        maxCard1 = 999;
      } else if (sanh.length > 0) {
        strongCard = TypeStrongCard.Sanh;
        listIdGold = sanh;
        if (cardHelper.getCard(sanh[1]) == 13) objBoCard.maxCard += 4; // case QKA > A123
        objBoCard.maxFace = sanh[0] % 10;
        maxCard1 = 999;
      } else if (samCo.length > 0) {
        strongCard = TypeStrongCard.Xam;
        listIdGold = samCo[0];
        maxCard1 = samCo[0][0];
      } else if (doi.length > 3) {
        strongCard = TypeStrongCard.Thu;
        listIdGold = doi;
        maxCard1 = doi[0];
      } else if (doi.length > 1) {
        strongCard = TypeStrongCard.Doi;
        listIdGold = doi;
        maxCard1 = doi[0];
      }
    }

    for (let i = 0, l = listIdGold.length; i < l; i++) {
      if (!listArrId.includes(listIdGold[i])) listCardConLai.push(listIdGold[i]);
    }
    if (listCardConLai.length > 0) {
      objBoCard.maxCard2 = listCardConLai;
    }
    objBoCard.maxCard1 = maxCard1;
    objBoCard.strongCard = strongCard;
    sriteStrongCard.string = this.getSpriteFrameStrongCard(strongCard);
    this.listStrongCard[indexBoCard] = objBoCard;
    this.checkSpineCard(listArrId, listIdGold, indexBoCard);
    this.checkWrongCard();
    this.goldCardWithId(listIdGold);
    if (Global.BinhView.isClickXepXong && this.isSwapCard) {
      // cc.log("xep lai cac la bai tu be den lon tu trai qua phai");
      let isMe = Global.BinhView.isMe;
      let listPlayer = Global.BinhView.players;
      for (let i = 0; i < listPlayer.length; i++) {
        if (listPlayer[i] == isMe) {
          // cc.log("reset show chi");
          listPlayer[i].resetShowChi(indexBoCard, strongCard);
        }
      }
    } else if (Global.BinhView.isClickBaoMauBinh) {
      // cc.log("xep lai cac la bai tu be den lon tu trai qua phai");
      let isMe = Global.BinhView.isMe;
      let listPlayer = Global.BinhView.players;
      for (let i = 0; i < listPlayer.length; i++) {
        if (listPlayer[i] == isMe) {
          // cc.log("reset show chi");
          listPlayer[i].resetShowChi(indexBoCard, strongCard);
        }
      }
    }
  },
  checkSpineCard(listArrId, listIdGold, indexChi) {
    let isMe = Global.BinhView.isMe;
    let isCheckKhac = isMe.checkGiongChi(indexChi, listArrId);
    if (listIdGold.length == listArrId.length && !isCheckKhac) {
      this.listSpineFullCard[indexChi].node.active = true;
      this.listSpineFullCard[indexChi].setAnimation(0, "animation", false);
    }
  },
  clickSuggestCardWithList() {
    if (this.listSuggestCard.length < 1) return;
    let arrId = this.listSuggestCard[this.indexListGoiY];
    Global.BinhView.isMe.sortCardWithListCardId(arrId);
    this.resetCardSuggest();
    this.indexListGoiY++;
    if (this.indexListGoiY == this.listSuggestCard.length) this.indexListGoiY = 0;
  },
  goldCardWithId(listId) {
    let tempList = Global.BinhView.isMe.listCard;
    for (let z = 0, lz = tempList.length; z < lz; z++) {
      for (let i = 0, l = listId.length; i < l; i++) {
        if (tempList[z].id == listId[i]) {
          tempList[z].setCardGold();
        }
      }
    }
  },
  checkWrongCard() {
    let listStrongCard = this.listStrongCard;
    this.isLung = false;

    for (let i = 1; i < listStrongCard.length; i++) {
      let firt = listStrongCard[i - 1];
      let temp = listStrongCard[i];
      if (firt.strongCard > temp.strongCard) {
        this.setWrongCard(i - 1);
      } else if (firt.strongCard == temp.strongCard) {
        if (firt.maxCard1 > temp.maxCard1) {
          this.setWrongCard(i - 1);
        } else if (firt.maxCard1 == temp.maxCard1) {
          // cc.log("maxcard1 for firt and temp", firt.maxCard1, temp.maxCard1);
          let list1 = firt.maxCard2;
          let list2 = temp.maxCard2;
          // cc.log("list 1", list1);
          // cc.log("list 2", list2);
          list1.sort(function (a, b) {
            return b - a;
          });
          list2.sort(function (a, b) {
            return b - a;
          });

          // cc.log(JSON.stringify(list1));
          // cc.log(JSON.stringify(list2));

          for (let m = 0, l = list1.length; m < l; m++) {
            let num1 = parseInt(list1[m] / 10);
            let num2 = parseInt(list2[m] / 10);
            // cc.log("number1 number2", num1, num2);
            if (num1 > num2) {
              this.setWrongCard(i - 1);
              break;
            } else if (num1 == num2) {
              if (m != l - 1) {
                continue;
              } else if (m == l - 1) {
                num1FaceMax = parseInt(list1[0] % 10);
                num2FaceMax = parseInt(list2[0] % 10);
                if (num1FaceMax > num2FaceMax) {
                  this.setWrongCard(i - 1);
                }
              }
            } else {
              break;
            }
          }
        }
      }
    }
  },
  setWrongCard(chi) {
    this.isLung = true;
    let listCard = Global.BinhView.isMe.getCardByChi(chi);
    for (let i = 0, l = listCard.length; i < l; i++) {
      listCard[i].setGrayCard();
    }
    this.listIconWrong[chi].spriteFrame = this.iconX;
    if (chi == 0) {
      this.listFrameTrueFalse[chi].spriteFrame = this.frameFalse_3;
    } else {
      this.listFrameTrueFalse[chi].spriteFrame = this.frameFalse_5;
    }
  },
  resetWrongCard(chi) {
    let listCard = Global.BinhView.isMe.getCardByChi(chi);
    for (let i = 0, l = listCard.length; i < l; i++) {
      listCard[i].setCardNomal();
    }
    this.listIconWrong[chi].spriteFrame = this.iconV;
    if (chi == 0) {
      this.listFrameTrueFalse[chi].spriteFrame = this.frameTrue_3;
    } else {
      this.listFrameTrueFalse[chi].spriteFrame = this.frameTrue_5;
    }
  },

  getNameBoBaiByType(type) {
    switch (type) {
      case TypeStrongCard.MauThau:
        return "Mậu Thầu";
      case TypeStrongCard.Doi:
        return "Đôi";
      case TypeStrongCard.Thu:
        return "Thú";
      case TypeStrongCard.Xam:
        return "Sám";
      case TypeStrongCard.Sanh:
        return "Sảnh";
      case TypeStrongCard.Thung:
        return "Thùng";
      case TypeStrongCard.CuLu:
        return "Cù Lũ";
      case TypeStrongCard.Tuqui:
        return "Tứ Quý";
      case TypeStrongCard.ThungPhaSanh:
        return "Thùng Phá Sảnh";
      case TypeStrongCard.ThungPhaSanhLon:
        return "Thùng Phá Sảnh Đại";
    }
    return "Wrong";
  },
  swapChi23() {
    let listCard = Global.BinhView.isMe.listCard;
    this.swapCard(listCard[3], listCard[8]);
    this.swapCard(listCard[4], listCard[9]);
    this.swapCard(listCard[5], listCard[10]);
    this.swapCard(listCard[6], listCard[11]);
    this.swapCard(listCard[7], listCard[12]);
    this.resetCardOnXep(0.4);
  },
  getSpriteFrameStrongCard(type) {
    let str = "";
    switch (type) {
      case TypeStrongCard.MauThau:
        str = "MẬU THẦU";
        break;
      case TypeStrongCard.Doi:
        str = "ĐÔI";
        break;
      case TypeStrongCard.Thu:
        str = "THÚ";
        break;
      case TypeStrongCard.Xam:
        str = "SÁM";
        break;
      case TypeStrongCard.Sanh:
        str = "SẢNH";
        break;
      case TypeStrongCard.Thung:
        str = "THÙNG";
        break;
      case TypeStrongCard.CuLu:
        str = "CÙ LŨ";
        break;
      case TypeStrongCard.Tuqui:
        str = "TỨ QUÝ";
        break;
      case TypeStrongCard.ThungPhaSanh:
        str = "THÙNG PHÁ \n SẢNH";
        break;
      case TypeStrongCard.ThungPhaSanhLon:
        str = "THÙNG PHÁ  \n SẢNH ĐẠI";
        break;
    }
    if (str != "") {
      // let node = this.parentSpiteStrongCard.getChildByName(str);
      // if (node) {
      //   return node.getComponent(cc.Sprite).spriteFrame;
      // }
      return str;
    }
  },

  xepBaiCloneUserOther() {
    let listPlayer = Global.BinhView.players;
    for (let i = 0; i < listPlayer.length; i++) {
      let player = listPlayer[i];
      if (player != Global.BinhView.isMe && player != null && player.listCard.length > 0) {
        player.setStatusSwapCard(true);
      }
    }
  },
});
