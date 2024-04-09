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
        alatasCard:cc.SpriteAtlas,
        imgUp:cc.SpriteFrame,
        img:cc.Sprite,
        nodeNhapNhay :cc.Node,
        textThoi2 : cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    ctor(){
        this.id = -1;
        this.cardNumber = -1;
        this.cardFace = -1; // 0 bich // 1 tep // 2 ro // 3 co
        this.isSlect = false;
        this.positionCache = cc.v2(0, 0);
    },
    onSlectCard(){
        this.isSlect = true;
        cc.Tween.stopAllByTarget(this.node);
        cc.tween(this.node)
        .to(0.15 , {position:cc.v2(this.positionCache.x ,this.positionCache.y + 50)})
        .start();

        if(Global.SamView){Global.SamView.checkActiveBtnPlay()};
        if(Global.TienLenMN){Global.TienLenMN.checkActiveBtnPlay()};

    },
    unSlectCard(){
        this.isSlect = false;
        cc.Tween.stopAllByTarget(this.node);
        cc.tween(this.node)
        .to(0.15 , {position:this.positionCache})
        .start();
        if(Global.SamView){Global.SamView.checkActiveBtnPlay()};
        if(Global.TienLenMN){Global.TienLenMN.checkActiveBtnPlay()};
    },
    start () {

    },
    setCardId(id = -1){
        this.id = id;
        if(id == - 1) return;
        this.converId();
    },
    setCardIdAndOpen(id = -1){
        if(id == - 1 || id == null){
            this.id = -1;
            this.img.spriteFrame = this.imgUp;
            return;
        } 
        this.id = id;
        this.converId();
        this.img.spriteFrame = this.alatasCard.getSpriteFrame(this.getUrlCard());
        if(this.node.getChildByName("lbNumberCard"))
            this.node.getChildByName("lbNumberCard").destroy();
    },
    upCard(){
        this.id = -1;
        this.cardNumber = -1;
        this.cardFace = -1;
        this.img.spriteFrame = this.imgUp;
    },
    openCard(){
        if(this.id == -1 ) {
            this.img.spriteFrame = this.imgUp;
            return;
        }
        this.img.spriteFrame = this.alatasCard.getSpriteFrame(this.getUrlCard());
    },
    openCardWithEffect(){
        if(this.id == -1 ) return;
        let node = this.img.node;
        //let scaleCache = node
        cc.tween(node)
        .to(0.1 , {scaleX:0.1 , skewY:-15})
        .call(()=>{
            this.openCard();
            node.skewY = 15;
        })
        .to(0.1 , {scaleX:1 ,skewY:0})
        .start();
    },
    unuse(){
        this.upCard();
        this.img.node.color = cc.Color.WHITE;
        this.nodeNhapNhay.color = cc.Color.WHITE;
        this.positionCache = cc.v2(0 ,0);
        cc.Tween.stopAllByTarget(this.img.node);
        cc.Tween.stopAllByTarget(this.node);
        this.node.stopAllActions();
        this.nodeNhapNhay.active = false;
        this.textThoi2.active = false
        this.textThoi2.position = cc.v2(0, 190)
        this.node.angle = 0;
        this.node.scale = 1;
        this.node.position = cc.v2(0,0);
        this.img.node.scaleX = 1;
        this.img.node.scaleY = 1;
        this.img.node.skewY = 0;
        this.node.opacity = 255;
        this.node.zIndex = 0;
        this.isSlect = false;
        if(this.node.getChildByName("lbNumberCard"))
            this.node.getChildByName("lbNumberCard").destroy();
    },
    setGrayCard(){
        this.img.node.color = cc.Color.GRAY;
    },
    setNormalCard(){
        this.offLight();
        this.img.node.color = cc.Color.WHITE;
    },
    getUrlCard() {
        let result = "";
        result = "card_" + this.cardNumber + "_" + this.cardFace;
        return result;
    },
    thoi2(){
        this.nodeNhapNhay.active = true;
        this.nodeNhapNhay.opacity = 255;
        this.nodeNhapNhay.color = cc.Color.RED;
       
        cc.Tween.stopAllByTarget(this.nodeNhapNhay);
        cc.tween(this.nodeNhapNhay)
        .to(0.5 , {opacity:50})
        .to(0.5 , {opacity:255})
        .union()
        .repeatForever()
        .start()
    },

    showTextThoi2(index = 0){
        this.textThoi2.position = cc.v2(0, -164)
        this.textThoi2.active = true;
    },

    showEffectNhapNhay(){
        this.nodeNhapNhay.active = true;
        this.nodeNhapNhay.opacity = 255;
        cc.Tween.stopAllByTarget(this.nodeNhapNhay);
        cc.tween(this.nodeNhapNhay)
        .to(0.5 , {opacity:50})
        .to(0.5 , {opacity:255})
        .union()
        .repeatForever()
        .start()
    },
    showLight(){
        cc.Tween.stopAllByTarget(this.nodeNhapNhay);
        this.nodeNhapNhay.active = true;
        this.nodeNhapNhay.opacity = 255;
    },
    offLight(){
        this.nodeNhapNhay.active = false;
    },
    converId(){
        this.cardNumber = parseInt(this.id / 10);
        this.cardFace  = this.id % 10;
        if(Global.BinhView && Global.BinhView.isTest == true) MainPlayerInfo.CurrentGameCode = CARD_GAME_CODE.BINH;
        switch (MainPlayerInfo.CurrentGameCode) {
            case CARD_GAME_CODE.TLMN: 
            case CARD_GAME_CODE.SAM:
                if (this.cardNumber == 14) this.cardNumber = 1;
                if (this.cardNumber == 15) this.cardNumber = 2;
                break;
            case CARD_GAME_CODE.PHOM:
                break;
            case CARD_GAME_CODE.POKER:
                break;
            
                
            case CARD_GAME_CODE.BA_CAY:
                break;
            case CARD_GAME_CODE.BINH:
                if (this.cardNumber == 14) this.cardNumber = 1;
                if (this.cardNumber == 15) this.cardNumber = 2;
                break;
            default:
                
                break;
        }
    }
    

    // update (dt) {},
});
