cc.Class({
    extends: cc.Component,

    properties: {
        textValue : require("TextJackpot"),
    },

    Show(valueJackpot, posMini) {
        this.node.active = true;
        this.textValue.StartIncreaseTo(valueJackpot);
        this.node.setPosition(posMini);
        this.node.x = this.node.x + 50;
        this.node.getComponent(cc.Animation).play("ShowJackpot");
        cc.resources.load("EffectBoomBig" , cc.Prefab , (err , pre)=>{
            let eff = cc.instantiate(pre);
            this.node.addChild(eff);
            eff.runAction(cc.sequence(cc.delayTime(2) , cc.callFunc(()=>{
                eff.destroy();
            })));
        });
    },

    Hide() {
        this.node.destroy();
    },
});
