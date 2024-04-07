// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
const GameType2 = cc.Enum({
    NONE: 0,
    BAN_CA: 1,
    FARM: 2,
    COW_BOY: 3,
    MY_NHAN: 6,
    MINI_SLOT: 5,
    TAM_BAO: 4,
    TAI_XIU: 7,
    MINI_POKER: 8,
    FISH_HUNTER: 9,
    LUCKY_WHEEL: 10,
    ORACLE: 13,
})
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
        nodeActive:cc.Node,
        gameType:{
            default:GameType2.NONE,
            type:GameType2
        },
        currentIndex:{
            default:0,
            type:cc.Integer
        },
        lbXHu:cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    onLoad () {
        this.nodeActive.active= false;
        this.infoXhu = null;
        this.isCheck = false;
        this.indexRoomActive = -2; // 0 tat ca , 1 room 1 , 2 room 2 , 3 room 3;
        Global.JackpotController.dangXHu(this);
    },
    onEnable(){
        if(Global.JackpotController && Global.JackpotController.dataXhu)this.emitNewDataJackpot();
    },
    onDestroy(){
        if(Global.JackpotController) Global.JackpotController.huyDangXHu(this);
     },
     emitNewDataJackpot(){
        let data = Global.JackpotController.dataXhu;
        let dataXhu = null;
        this.dangXHu = null;
        this.nodeActive.active = false;
        for(let i = 0 , l = data.length; i < l ; i++){
            let temp = data[i];
            if(temp.EventId == 21 ){
                dataXhu = temp;
                break;
            }
        }
        if(dataXhu == null) return;
        this.dangXHu = dataXhu;
        let listGame = dataXhu.RuleConfig;
        this.infoXhu  = null;
        for(let i = 0 , l = listGame.length; i < l ; i++){
            let temp = listGame[i];

            if(temp.PlayMode == this.gameType){
                this.infoXhu = temp;
                
                break;
            }
        }
   
        if(this.infoXhu == null) return;
        cc.log("info x hu la : ", this.infoXhu);
        this.updateXHu();

      

        // for(let i = 0 , l = data.length; i < l ; i++){
        //     let temp = data[i];
        //     if(temp.EventId = this.gameType ){
               

        //         let listHourStart = temp.

        //         break;
        //     }
        // }
     },

    checkActiveByTime() {
        this.nodeActive.active = false;
        if (this.dangXHu == null) return;

        let dateStart = new Date(this.dangXHu.StartDate);
        let dateEnd = new Date(this.dangXHu.EndDate);
        let listHourStart = this.infoXhu.StartTime;
        let listHourEnd = this.infoXhu.EndTime;
        let currentTime = Date.now();
        if (currentTime < dateStart.getTime() || currentTime > dateEnd.getTime()) return false;


        // listHourStart[0] = "10:56:00";
        // listHourEnd[0] = "17:56:00"; // test
        for (let i = 0, l = listHourStart.length; i < l; i++) {
            let timeTempStart = listHourStart[i].split(":");
            let timeTempEnd = listHourEnd[i].split(":");

            let dateStartInDay = new Date();
            dateStartInDay.setHours(parseInt(timeTempStart[0].trim()), parseInt(timeTempStart[1].trim()), parseInt(timeTempStart[2].trim()));
            let time1 = dateStartInDay.getTime();
            cc.log("curent1 : " + dateStartInDay);
            dateStartInDay.setHours(parseInt(timeTempEnd[0].trim()), parseInt(timeTempEnd[1].trim()), parseInt(timeTempEnd[2].trim()));
            let time2 = dateStartInDay.getTime();
            cc.log("curent2 : " + dateStartInDay);
            if (currentTime < time1 && currentTime < time2) {
                let time = time1 - currentTime;
                let timeOff = time + (time2 - time1);
                this.activeWithDelayTime(time / 1000);
                this.offWithDelayTime(timeOff / 1000);
                return true;
            } else if (currentTime >= time1 && currentTime < time2) {
                this.activeWithDelayTime(0);
                let timeOff = time2 - currentTime;
                this.offWithDelayTime(timeOff / 1000);
                return true;
            }

        }
        return false;
    },
     changeIndex(index){
        this.reset();
        this.currentIndex = index;
        this.updateXHu();
     },
     updateXHu(){
        
        if(this.infoXhu){
            let listRoom = this.infoXhu.RoomId;
            let listXValue = this.infoXhu.XValue
            for(let i = 0 , l = listRoom.length ; i < l ; i++){
                if(this.currentIndex == -1 || listRoom[i] == 0 || this.currentIndex == listRoom[i]){
                    this.lbXHu.string = "X" + listXValue[i];
                    if(this.checkActiveByTime()){
                        this.indexRoomActive = listRoom[i];
                    }else{
                        this.indexRoomActive = -2;
                    }
                    return;
                }
            }

            this.nodeActive.active = false;
        }
     },
     reset(){
        this.indexRoomActive = -2;
        this.unschedule(this.funActive);
        this.unschedule(this.funOff);
     },
     activeWithDelayTime(time , mutil){
         cc.log("=====> chay vao active xhu : ", time)
         this.nodeActive.active = true;
        this.scheduleOnce( this.funActive = ()=>{
            this.nodeActive.active = true;
        } , time)
     },
     offWithDelayTime(time){
        this.scheduleOnce( this.funOff = ()=>{
            this.nodeActive.active = false;
        } , time)
     },

    update (dt) {},
});
