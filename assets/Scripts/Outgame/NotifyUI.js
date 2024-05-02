const NOTIFICATION_TYPE = cc.Enum({
    NORMAL:0,
    LIMITED:1,
    IN_ROOM:2,
})
cc.Class({
    extends: cc.Component,
    ctor() {

        this.listNomrl = [];
        this.listLimit = [];
        this.listInGame = [];
        this.isRuning =false;
        this._isInGame = false;

        this.indexInGame = 0;
        this.indexInLobby = 0;
        this.indexInNomal = 0;
        // this.index = -1; 
        // this.countTime = 0;
        // this.isUpdateTime = true;
        // this.SPEED = 50;
        // this.TIME_DISTANCE = 5;
    },

    properties: {
        description : cc.RichText,
        boxNotify : cc.Node,
        isInGame:{
            get(){
                return this._isInGame;
            },
            set(value){
                this._isInGame = value;
                this.description.node.parent.active = false;
                this.boxNotify.active = false;
                this.isRuning =false;
                if(value){
                    this.listLimit.length = 0;
                    this.indexInGame = 0;
                }else{
                    this.showListNomal();
                    this.indexInLobby = 0;
                    this.listInGame.length = 0;
                }
                
            }   
        }

        // startObj : cc.Node,
        // endObj : cc.Node,
    },

    start() {
        Global.NotifyUI =this;
        // if(this.isUpdateTime)
        //     this.ActiveNotify(false);
    },
    onLoad() {
        Global.NotifyUI =this;
    },

    UpdateListNotify(packet) {
        let obj = JSON.parse(packet[1]) ;
        if(obj.Type == NOTIFICATION_TYPE.NORMAL){
            this.listNomrl.push(obj);
            if(!this.isRuning)
            this.showListNomal();
        }else if (obj.Type == NOTIFICATION_TYPE.LIMITED){
            this.listLimit.push(obj);
            if(!this.isRuning)
            this.showListLimit();
        }else{
            if(!this.isRuning && this.isInGame)
            this.listInGame.push(obj);

        }
    },
    showListNomal(){
        if(this.listNomrl.length > 0){
            let obj = this.listNomrl[this.indexInNomal];
            this.showUI(obj.Content);
            this.isRuning = true;
            this.indexInNomal++;
            if(this.indexInNomal > this.listNomrl.length - 1) this.indexInNomal = 0;
        }else{
            this.description.node.parent.active = false;
            this.boxNotify.active = false;
        }
    },
    showListLimit(){
        if(this.listLimit.length <1 ){
            this.showListNomal();
            return;
        }else{
            let obj = this.listLimit[this.indexInLobby];
            this.showUI(obj.Content);
            obj.RunTimes--;
            if(obj.RunTimes <= 0){
                this.listLimit.splice(this.indexInLobby , 1);
            }
            this.indexInLobby++;
            if(this.indexInLobby > this.listLimit.length - 1) this.indexInLobby = 0;
        }
        this.isRuning = true;
    },

    showListInGame(){
        if(this.listInGame.length > 0){
            let obj = this.listInGame[this.indexInGame];
            this.showUI(obj.Content);
            this.isRuning = true;
            obj.RunTimes--;
            if(obj.RunTimes <= 0){
                this.listInGame.splice(this.indexInGame , 1);
            }
            this.indexInGame++;
            if(this.indexInGame > this.listInGame.length - 1) this.indexInGame = 0;
        }else{
            this.description.node.parent.active = false;
            this.boxNotify.active = false;
        }
    },

    showUI(content){
        this.description.string = content;
        this.description.node.parent.active = true;
        this.boxNotify.active = true;
        let width = this.description.node.width;
        let widthParent = this.description.node.parent.width;
        this.description.node.x = 0;

        let speed = 120;
        let quangDuong = widthParent + width;
        let time =  quangDuong/speed;

        cc.Tween.stopAllByTarget(this.description.node);
        cc.tween(this.description.node)
        .to(time , {x:-quangDuong})
        .call(()=>{
            this.isRuning = false;
            if(this.isInGame){
                this.showListInGame();
            }else{
                this.showListLimit();
            }
            
        })
        .start()
    },


    onDestroy(){
        Global.NotifyUI =null;
    }
});
