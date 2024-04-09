var colorText = {
   gold: -1,
   violet: 0,
   bue: 1,
   green: 2,
   yellow: 3,
   white: 4,
}
cc.Class({
   extends: cc.Component,

   properties: {
      itemPlayer: cc.Prefab,
      itemCard: cc.Prefab,
      imgChip: cc.SpriteFrame,
      listSprChip: [cc.SpriteFrame],
   },

   // LIFE-CYCLE CALLBACKS:

   onLoad() {
      this.playerPool = new cc.NodePool("PlayerViewTLMN");
      this.cardPool = new cc.NodePool("CardTLMN");
      this.chipPool = new cc.NodePool();
      this.listColor = [{ r: 36, g: 102, b: 44, a: 255 }, { r: 26, g: 109, b: 102, a: 255 }, { r: 165, g: 90, b: 22, a: 255 },
         { r: 71, g: 15, b: 78, a: 255 }, { r: 158, g: 35, b: 69, a: 255 }, { r: 0, g: 0, b: 0, a: 255 }];
   },
   onDestroy() {
      this.playerPool.clear();
      this.cardPool.clear();
   },
   getPlayer() {
      let node = null;
      node = cc.instantiate(this.itemPlayer);
      // if (this.playerPool.size() > 0) {
      //    node = this.playerPool.get();
      // } else {
      //    node = cc.instantiate(this.itemPlayer);
      // }
      node.position = cc.v2(0, 0);
      return node;
   },
   putPlayer(node) {
      node.destroy();
      // this.playerPool.put(node);
   },
   getCard() {
      let node = null;
      node = cc.instantiate(this.itemCard);
      // if (this.cardPool.size() > 0) {
      //    node = this.cardPool.get();
      // } else {
      //    node = cc.instantiate(this.itemCard);
      // }
      return node;
   },
   putCard(node) {
      node.destroy();
      // this.cardPool.put(node);
   },
   getChip(value = 0) {
      this.listValue = Global.TienLenMN.listValue;
      let node = null;
      let label = null;
      if (this.chipPool.size() > 0) {
         node = this.chipPool.get();

         label = new cc.Node();
		   label.addComponent(cc.Label);
         label.position = cc.v2(0 , 3);
         // node.addChild(label);
      } else {
         node = new cc.Node();
         node.addComponent(cc.Sprite);
         node.scale = 1.5;

         label = new cc.Node();
		   label.addComponent(cc.Label);
         label.position = cc.v2(0 , 3);
         // node.addChild(label);

      }

      let color = null;
      let spr = null;
      for (let i = this.listValue.length - 1; i >= 0; i--) {
         if (value == this.listValue[i]) {
            spr = this.listSprChip[i];
            color = this.listColor[i];
            break;
         }
      }

      if (spr == null) {
         spr = this.imgChip;
         color = { r: 214, g: 200, b: 43, a: 255};
      }

      node.scale = 0.6;
      node.getComponent(cc.Sprite).spriteFrame = spr;
      
      let labelText = label.getComponent(cc.Label);
      if(labelText) {
         labelText.string = Global.formatMoneyChip(value).replace(/(.)(?=(\d{3})+$)/g, '$1,').toUpperCase();
         labelText.fontSize = 13;
         labelText.lineHeight = 15;
         labelText.horizontalAlign = 1;
         labelText.verticalAlign = 1;
         labelText.node.color = new cc.Color(color);
      }
      return node;
   },
   putChip(node) {
      this.chipPool.put(node);
   }

   // update (dt) {},
});
