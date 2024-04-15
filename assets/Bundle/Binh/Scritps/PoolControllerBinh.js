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
    itemPlayer: cc.Prefab,
    itemCard: cc.Prefab,
    imgChip: cc.SpriteFrame,
    nodeText: cc.Node,
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    this.playerPool = new cc.NodePool("PLayerViewBinh");
    this.cardPool = new cc.NodePool("CardBinh");
    this.chipPool = new cc.NodePool();

    this.textPool = new cc.NodePool();
  },
  onDestroy() {
    this.playerPool.clear();
    this.cardPool.clear();
    this.chipPool.clear();
    this.textPool.clear();
  },
  initPool() {
    this.playerPool = new cc.NodePool("PLayerViewBinh");
    this.cardPool = new cc.NodePool("CardBinh");
    this.chipPool = new cc.NodePool();

    this.textPool = new cc.NodePool();
  },
  getPlayer() {
    let node = null;
    if (this.playerPool.size() > 0) {
      node = this.playerPool.get();
    } else {
      node = cc.instantiate(this.itemPlayer);
    }
    node.position = cc.v2(0, 0);
    return node;
  },
  putPlayer(node) {
    this.playerPool.put(node);
  },
  getCard() {
    let node = null;
    if (this.cardPool.size() > 0) {
      node = this.cardPool.get();
    } else {
      node = cc.instantiate(this.itemCard);
    }
    return node;
  },
  putCard(node) {
    this.cardPool.put(node);
  },
  getChip() {
    let node = null;
    if (this.chipPool.size() > 0) {
      node = this.chipPool.get();
    } else {
      node = new cc.Node();
      node.addComponent(cc.Sprite).spriteFrame = this.imgChip;
      node.scale = 0.6;
    }
    return node;
  },
  getText(isLost = false) {
    let node = null;
    if (this.textPool.size() > 0) {
      node = this.textPool.get();
    } else {
      node = cc.instantiate(this.nodeText);
    }
    //  let material = null;
    //  if(isLost){
    //   material =  cc.Material.getBuiltinMaterial("2d-gray-sprite");
    //  }else{
    //   material =  cc.Material.getBuiltinMaterial("2d-sprite");
    //  }
    node.active = true;
    let nodeCp = node.getComponent(cc.Label);
    //  nodeCp.setMaterial(0 , material);
    return nodeCp;
  },

  putText(node) {
    cc.Tween.stopAllByTarget(node);
    this.textPool.put(node);
  },

  putChip(node) {
    this.chipPool.put(node);
  },

  // update (dt) {},
});
