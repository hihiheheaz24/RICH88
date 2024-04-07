cc.Class({
    extends: cc.Component,

    properties: {
        _isTouch: false,
        _isMoveBtnMiniGame: false,
        _v2OffsetChange: null,
        _vecStart: null,

        nodeQuest : cc.Node,
        lbDescription : cc.Label,
        lbProgress : cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // let offsetX = this.node.position.x;
        // let offsety = this.node.position.y;

        this.isClick = true;

        // this.posCache = cc.v2((this.node.position.x * (cc.winSize.width / 1920)), (this.node.position.y * (cc.winSize.height / 1080))) ;

        // this.savePos = this.node.position;
        // this.offsetIsGame = 1;

        return;
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
            } else {
                this.checkPosition()
            }
        })
    },

    onClick() {
        cc.log("click btn mini gameeee : ");
        if (!Global.isLogin) {
            Global.UIManager.showCommandPopup(MyLocalization.GetText("NEED_LOGIN"));
            return;
        }

        if(!this.isClick) return;
        
        

        let scale = 0;
        // this.isClick ? scale = 1 : scale = 0

        // cc.tween(this.nodeQuest)
        // .to(0.25, {scaleX : scale})
        // .start();


        this.nodeQuest.stopAllActions();
        this.nodeQuest.active = true;
        this.nodeQuest.opacity = 255;
        this.nodeQuest.scale = 0;
        cc.Tween.stopAllByTarget(this.nodeQuest);
        cc.tween(this.nodeQuest)
        .to(0.15 , {scale:1} , {easing:"backOut"})
        .delay(2)
        .to(0.5 ,{opacity: 0} )
        .call(()=>{
            this.isClick = true;
        })
        .start();

        this.isClick = false;

        // this.nodeQuest.active = this.isClick;
        cc.log("check to day mission : ", Global.TodayMission)
        if(Global.TodayMission){
            this.lbDescription.string = Global.TodayMission.MissionName;
            this.lbProgress.node.active = true;
            this.lbProgress.string = Global.TodayMission.Point + "/" + Global.TodayMission.RulePoints;
        }
        else{
            this.lbDescription.string = "Chưa có nhiệm vụ";
            this.lbProgress.node.active = false;
        }
     
    },

    onClickQuest(){
        return;
        let gameName = Global.getGameNameById(Global.TodayMission.GameCode);
        MainPlayerInfo.CurrentGameCode = gameName;
        MainPlayerInfo.CurrentGameId = Global.TodayMission.GameCode;
        if (Global.TodayMission.GameCode > 0) {
            let msg = {};
            msg[AuthenticateParameterCode.GameId] = gameName;
            msg[AuthenticateParameterCode.Blind] = 0;
            cc.log("send ow itemlobby : ", msg);
            require("SendCardRequest").getIns().MST_Client_Join_Game(msg);
            Global.UIManager.showMiniLoading();
        }

        this.nodeQuest.scaleX = 0;
        this.isClick = false;
    },

    hideQuest(){
        cc.tween(this.nodeQuest)
        .to(0.25, {scaleX : 0})
        .start();

        this.isClick = false;
    },

    // checkPosition() {
    //     let X = this.node.x;
    //     let Y = this.node.y;
    //     let posTarget = this.posCache;
    //     this.node.stopAllActions();
    //     this.node.runAction(cc.moveTo(0.15, posTarget).easing(cc.easeBackOut()))

    // },

    start() {

    },

    // update (dt) {},
});
