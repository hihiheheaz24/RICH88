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
        listCard:[require("SpinCardRunning")],

        spriteResult:cc.Sprite,
        textBalance:cc.Label,
        imgTextBalance:cc.Node,
        animation:cc.Animation,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
       // this.animation = this.getComponent(cc.Animation);
        this.isRunning = false;
    },

    spinItem(){
        this.isRunning = true;
        this.animation.play("SpinCard");
    },
    stopAnimation(){
        this.animation.play("StopCard");  
    },
    Force(){
        this.imgTextBalance.parent.active = false;
        for(let i = 0  , l = this.listCard.length ; i < l ; i++){
            this.listCard[i].Force();
        }
    },

    stopByNotMoney(){
        this.stopAnimation();
        this.isRunning = false;
        this.Force();
    },

    handleShowResult(listCard , funNext){
        if(!this.isRunning){
            funNext();
            return;
        }
        
        let money = listCard.PrizeValue;
        this.cardType = listCard.CardTypeID;
        this.textBalance.string = "+" + Global.formatNumber(money);
        let timedl = 2.5;
        if(this.cardType !=  CARD_RESULT_TYPE.DOI_BE && this.cardType !=  CARD_RESULT_TYPE.BAI_CAO && this.cardType !=CARD_RESULT_TYPE.THUNG_PHA_SANH_DAI ){
            this.imgTextBalance.parent.active = true;
            this.spriteResult.node.scale = 0;
            this.imgTextBalance.scale = 0;
            this.textBalance.node.scale = 0;
            this.spriteResult.node.runAction(cc.scaleTo(0.3 , 0.3 ).easing(cc.easeBackOut()));    
            this.imgTextBalance.runAction(cc.sequence(cc.delayTime(0.1 ) , cc.scaleTo(0.3 , 1 ).easing(cc.easeBackOut())) );
            this.textBalance.node.runAction(cc.sequence(cc.delayTime(0.2 ) ,  cc.scaleTo(0.3 , 1 ).easing(cc.easeBackOut())) );
        }else{
            timedl = 0;
        }

        this.setSpriteCardResult(this.cardType);
        this.unschedule(this.funDelay);
        this.scheduleOnce(this.funDelay = ()=>{
            this.imgTextBalance.parent.active = false;
            this.isRunning = false;
            funNext();
        } , timedl)
    },

    setCard(listCard, funNext){
        if(!this.isRunning){
            funNext();
            return;
        }
      
        let timeDelay = 1;
        Global.MiniPoker.isSieuToc === true ? timeDelay = 0 : timeDelay = 1;
        cc.log("check time delay : ", timeDelay)
        cc.tween(this.node)
        .delay(timeDelay)
        .call(()=>{
            this.stopAnimation();
        })
        .call(()=>{
            let str = "CardID";
            for(let i = 0 ; i < 5 ; i++){
                this.listCard[i].SetImage(listCard[str +(i + 1)])
            }
            funNext();
            cc.log("chay vao ham xu li xong")
        })
        .start();
    },

    setCardStart(listCard){
        let str = "CardID";
        for(let i = 0 ; i < 5 ; i++){
            this.listCard[i].SetImage(listCard[str +(i + 1)])
        }
    },

    setSpriteCardResult(resultType){
        switch (resultType) {
            case CARD_RESULT_TYPE.THUNG_PHA_SANH_DAI:
                 this.spriteResult.spriteFrame =  Global.MiniPoker.listSpriteResult[8];
                 break;
            case CARD_RESULT_TYPE.THUNG_PHA_SANH:
                this.spriteResult.spriteFrame =  Global.MiniPoker.listSpriteResult[7];
                break; 
            case CARD_RESULT_TYPE.TU_QUY:
                this.spriteResult.spriteFrame =  Global.MiniPoker.listSpriteResult[6];
                break;
            case CARD_RESULT_TYPE.CU_LU:
                this.spriteResult.spriteFrame =  Global.MiniPoker.listSpriteResult[5];
                break; 
            case CARD_RESULT_TYPE.THUNG:
                this.spriteResult.spriteFrame =  Global.MiniPoker.listSpriteResult[4];
                break; 
            case CARD_RESULT_TYPE.SANH:
                this.spriteResult.spriteFrame =  Global.MiniPoker.listSpriteResult[3];
                break; 
            case CARD_RESULT_TYPE.SAM_CO:
                this.spriteResult.spriteFrame =  Global.MiniPoker.listSpriteResult[2];
                break; 
            case CARD_RESULT_TYPE.HAI_DOI:
                this.spriteResult.spriteFrame =  Global.MiniPoker.listSpriteResult[1];
                break; 
            case CARD_RESULT_TYPE.DOI:
                this.spriteResult.spriteFrame =  Global.MiniPoker.listSpriteResult[0];
                break; 
            case CARD_RESULT_TYPE.BAI_CAO:
                  //  this.spriteResult.spriteFrame =  this.listSpriteResult[0];
                break; //MyLocalization.GetText("BAI_CAO");
            case CARD_RESULT_TYPE.DOI_BE:

                break; //MyLocalization.GetText("DOI_BE");
            default:
                break; "";
        }
    },

    // update (dt) {},
});
