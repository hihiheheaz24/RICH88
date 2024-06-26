cc.Class({
    extends: cc.Component,
    ctor() {
        this.timeType1 = 0;
        this.timeType2 = 0;
        this.currentTypeTimeTx = 1;
        this.currentTimeTx = 0;
        this.isLoading = false;
        this.savePos = cc.v2(0, 0);
        this.fx = null;
        this.listScheduMoneyFly = [];
    },
    properties: {
        _isTouch: false,
        _isMoveBtnMiniGame: false,
        _v2OffsetChange: null,
        _vecStart: null,
        lbTimeTx: cc.Label,
        nodeBg : cc.Node,
        // contentTime: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Global.BtnMiniGame = this;
        this.posCache = null;
        this.savePos = this.node.position;
        // let offsetX = cc.winSize.width / 2;
        // let offsety = cc.winSize.height / 2;
        let offsetX = cc.winSize.width / 2;
        let offsety = cc.winSize.height / 2;


        this.offsetIsGame = 1;

        this.node.on(cc.Node.EventType.TOUCH_START, (touch) => {
            let v2Touch = cc.v2(touch.getLocation());
            let target = v2Touch.subSelf(cc.v2(offsetX, offsety)).mulSelf(this.offsetIsGame);
            this._vecStart = target;
            this._v2OffsetChange = this.node.position.subSelf(target);
            this._isMoveBtnMiniGame = false;
            this._isTouch = true;
        })

        this.node.on(cc.Node.EventType.TOUCH_MOVE, (touch) => {
           
            if (this._isTouch) {
                let v2Touch = cc.v2(touch.getLocation());
                let target = v2Touch.subSelf(cc.v2(offsetX, offsety)).mulSelf(this.offsetIsGame);
                this.node.position = target.addSelf(this._v2OffsetChange);
                this.savePos = this.node.position;
                this._isMoveBtnMiniGame = true;
            }
        })

        this.node.on(cc.Node.EventType.TOUCH_CANCEL, (touch) => {

            this._isTouch = false;
            this.checkPosition();
            if (!this._isMoveBtnMiniGame) this.onClick();
        })

        this.node.on(cc.Node.EventType.TOUCH_END, (touch) => {

            this._isTouch = false;
            let v2Touch = cc.v2(touch.getLocation());
            let target = v2Touch.subSelf(cc.v2(offsetX, offsety)).mulSelf(this.offsetIsGame);


            if (target.subSelf(this._vecStart).mag() < 15) {
                this.onClick();
            }else{
                this.checkPosition()
            }
        })
        this.poolMoney = new cc.NodePool();


        this.height = 1920/2;
        this.width = 1080/2;
    },

    start() {
        this.reset();
        let action1 = cc.scaleTo(0.1 , 0.7);
        let action2 = cc.scaleTo(0.1 , 1);
        let action3 = cc.delayTime(2);
       this.node.runAction(cc.repeatForever(cc.sequence(cc.repeat(cc.sequence(action1,action2),3) ,action3) ));
    },

    onClick(){
        if(this.nodeBg.getNumberOfRunningActions() > 0) return;
        if(!this._isOpen){
           Global.UIManager.showMask();
            this.nodeBg.active = true;
            this.nodeBg.scale = 0;
            cc.Tween.stopAllByTarget(this.nodeBg);
          
            cc.tween(this.nodeBg)
            .to(0.5, { scale: 1, angle: 360 }, { easing: 'backOut' }) // Hiệu ứng mở rộng và xoay với easing 'backOut'
            .call(() => {
                this._isOpen = !this._isOpen;
            })
            .start();
        }else{
            cc.tween(this.nodeBg)
            .to(0.5, { scale: 0, angle: 0 }, { easing: 'backIn' }) // Hiệu ứng mở rộng và xoay với easing 'backOut'
            .call(() => {
                this._isOpen = !this._isOpen;
            })
            .start();
          
            Global.UIManager.hideMask();
        }
    },

    onClickOpenMiniGame(event, data) {

        cc.tween(this.nodeBg)
            .to(0.5, { scale: 0, angle: 0 }, { easing: 'backIn' }) // Hiệu ứng mở rộng và xoay với easing 'backOut'
            .call(() => {
                this._isOpen = !this._isOpen;
            })
            .start();

        if (!Global.isLogin) {
            Global.UIManager.showCommandPopup(MyLocalization.GetText("NEED_LOGIN"));
            Global.UIManager.hideMask();
            return;
        }
        let idGame = parseInt(data);
        cc.log("on click onpen game id : ", idGame)
        Global.UIManager.showMiniLoading();
		switch (idGame) {
			case GAME_TYPE.XOCDIA:
				Global.UIManager.onClickOpenMiniGame(GAME_TYPE.XOCDIA);
				break;
			case GAME_TYPE.TAI_XIU:
				Global.UIManager.onClickOpenMiniGame(GAME_TYPE.TAI_XIU);
				break;
			case GAME_TYPE.MINI_POKER:
				Global.UIManager.onClickOpenMiniGame(GAME_TYPE.MINI_POKER);
				break;
			case GAME_TYPE.MINI_SLOT:
				Global.UIManager.onClickOpenMiniGame(GAME_TYPE.MINI_SLOT);
				break;
			case GAME_TYPE.LODE:
				Global.UIManager.onClickOpenMiniGame(GAME_TYPE.LODE);
				break;
			default:
				if (data === "TMN") {
					let msg = {};
					msg[AuthenticateParameterCode.RoomType] = 1;
					msg[AuthenticateParameterCode.GameId] = "TMN";
					msg[AuthenticateParameterCode.Blind] = 0;
					msg[AuthenticateParameterCode.RoomId] = 25;
					cc.log("send ow itemlobby : ", msg);
					require("SendCardRequest").getIns().MST_Client_Join_Game(msg);
					Global.UIManager.showMiniLoading();
					break;
				}
				break
		}
    },

    initTimeTaiXiu(type, time) {
        // this.lbTimeTx.node.parent.active = true;
        this.currentTypeTimeTx = type;
        if (this.currentTypeTimeTx == 1) {
            this.lbTimeTx.node.color = cc.Color.WHITE;
        } else {
            this.lbTimeTx.node.color = cc.Color.YELLOW;
        }
        this.currentTimeTx = time;
        if (time < 10) {
            this.lbTimeTx.string = "0" + time;
        } else {
            this.lbTimeTx.string = "" + time;
        }
        

        this.unschedule(this.funSche);
        this.schedule(this.funSche = () => {
            this.currentTimeTx--;
            if (this.currentTimeTx < 10) {
                this.lbTimeTx.string = "0" + this.currentTimeTx;
            } else {
                this.lbTimeTx.string = "" + this.currentTimeTx;
            }
            if (this.currentTimeTx < 1) {
                if (this.currentTypeTimeTx == 1) {
                    this.currentTypeTimeTx = 2;
                    this.currentTimeTx = this.timeType2;
                    this.lbTimeTx.node.color = cc.Color.YELLOW;
                } else {
                    this.currentTypeTimeTx = 1;
                    this.currentTimeTx = this.timeType1;
                    this.lbTimeTx.node.color = cc.Color.WHITE;
                }
            }
            

        }, 1)
    },

    reset(){
        this.node.angle = 0;
        this.node.scale = 1;
        this.node.opacity = 255;
        
        let Y = 0;
        let posTarget = null;
            if(this.node.y > this.height - this.node.width/2) Y = this.height - this.node.width/2;
            if(this.node.y < -this.height + this.node.width/2) Y = -this.height + this.node.width/2;
    
            if(this.node.x >= 0){
                posTarget = cc.v2(this.width - this.node.width/2 -10 , Y);
            }else{
                posTarget = cc.v2(-this.width  + this.node.width/2 +10, Y);
            }
         this.node.position =    posTarget;
         this.posCache = this.node.position;
         //cc.log( this.node.x +" toa do cua no la " + this.node.y )
    },
    checkPosition(){
            let X =0;
            let Y = this.node.y;
            let posTarget = null;
            if(this.node.y > this.height - this.node.width/2) Y = this.height - this.node.width/2;
            if(this.node.y < -this.height + this.node.width/2) Y = -this.height + this.node.width/2;
    
            if(this.node.x >= 0){
                posTarget = cc.v2(this.width - this.node.width/2 -10 , Y);
            }else{
                posTarget = cc.v2(-this.width  + this.node.width/2 +10, Y);
            }
            this.node.stopAllActions();
            this.node.runAction(cc.moveTo(0.15 , posTarget).easing(cc.easeBackOut()) )
      //  }

       
    },
    onDestroy() {
        Global.BtnMiniGame = null;
    },

    // update (dt) {},
});
