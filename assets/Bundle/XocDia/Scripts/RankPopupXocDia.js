cc.Class({
    extends: cc.Component,

    properties: {
        listTop :  require("BaseScrollView"),
        itemTop : cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.dataTop = null;
        this.listDataTop = [[], [], [], []];
        this.isClickTotalBet = false;
        this.isClickDay = true;

    },

    start () {

    },

    show(){
        Global.onPopOn(this.node);
        this.listTop.resetScr();
    },

    hide(){
        Global.onPopOff(this.node);
    },

    handleData(listArray){
        for (let i = 0; i < listArray[1].length; i++) {
            const objData = JSON.parse(listArray[1][i]);
            this.listDataTop[0].push(objData)
        }

        for (let i = 0; i < listArray[2].length; i++) {
            const objData = JSON.parse(listArray[2][i]);
            this.listDataTop[1].push(objData)
        }

        for (let i = 0; i < listArray[3].length; i++) {
            const objData = JSON.parse(listArray[3][i]);
            this.listDataTop[2].push(objData)
        }

        for (let i = 0; i < listArray[4].length; i++) {
            const objData = JSON.parse(listArray[4][i]);
            this.listDataTop[3].push(objData)
        }

        this.generateListTop();
    },

    generateListTop(){
        if(this.isClickTotalBet && this.isClickDay){
            this.dataTop = this.listDataTop[0];
            cc.log("check check top bet ngay`")
        }
        else if(this.isClickTotalBet && !this.isClickDay){
            this.dataTop = this.listDataTop[2]
            cc.log("check check top bet tuan`")
        }
        else if(!this.isClickTotalBet && this.isClickDay){
            this.dataTop = this.listDataTop[1]
            cc.log("check check top win ngay`")
        }
        else if(!this.isClickTotalBet && !this.isClickDay){
            this.dataTop = this.listDataTop[3]
            cc.log("check check top win tuan`")
        }


        cc.log("cehck data top la : ", this.dataTop);
        this.listTop.resetScr();
        this.listTop.init(this.dataTop, this.dataTop.length * 110, 110);

    },

    onClickTotalBet(){
        this.isClickTotalBet = true;
        this.generateListTop();
    },

    onClickTotalWin(){
        this.isClickTotalBet = false;
        this.generateListTop();
    },

    onClickDay(){
        this.isClickDay = true;
        this.generateListTop();
    },

    onClickWeek(){
        this.isClickDay = false;
        this.generateListTop();
    },

    // update (dt) {},
});
