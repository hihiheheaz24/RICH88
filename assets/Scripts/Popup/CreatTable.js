cc.Class({
    extends: cc.Component,

    properties: {
        slider: {
            default: null,
            type: cc.Slider
        },
        lbBlind: {
            default: null,
            type: cc.Label
        },
        fill: {
            default: null,
            type: cc.Sprite
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.list_creat_table = Global.ChooseTable.dataBlind; // cái này data blind
        this.cur_index = 0;
        this.blind = 0;
        this.cur_per = Math.round(9 / this.list_creat_table.length * 100) / 1000;
        this.index = this.list_creat_table.length / 10 ;
        Global.onPopOn(this.node);
        for (let i = this.list_creat_table.length; i >= 0 ; i--) {
            const itemValue = this.list_creat_table[i];
            if(MainPlayerInfo.ingameBalance >= itemValue * 20){
                this.slider.progress = parseFloat(1 / this.list_creat_table.length * i).toFixed(1);
                this.handleSlide();
                return;
            }
            else{
                this.slider.progress = 0.1;
                this.handleSlide();
            }
        }
    },

    start () {

    },

    handleSlide() {
        this.slider.progress = Math.max(this.slider.progress, 0.1);
        this.slider.progress = Math.min(this.slider.progress, 1);

        this.cur_index = Math.ceil((this.slider.progress - 0.1) / this.cur_per * 100) / 100; // 0.9 / 0.3 * 100 = 3
        this.cur_index = Math.max(this.cur_index, 0);
        this.cur_index = Math.min(this.cur_index, this.list_creat_table.length - 1);
        this.cur_index = Math.floor(this.cur_index);
        this.blind = this.list_creat_table[this.cur_index];
        this.lbBlind.string = Global.formatMoneyChip(this.list_creat_table[this.cur_index]);
        this.fill.node.active = true;
        this.fill.node.setContentSize(cc.size(this.slider.progress * 530, this.fill.node.getContentSize().height));
    },
    onClickTaoBan(){
        let msg = {};
        msg[AuthenticateParameterCode.GameId] = MainPlayerInfo.CurrentGameCode;
        msg[AuthenticateParameterCode.Blind] = this.blind;
        msg[AuthenticateParameterCode.TableId] = 0;
        cc.log("send ow itemlobby : ", msg);
        require("SendCardRequest").getIns().MST_Client_Join_Game(msg);
        Global.UIManager.showMiniLoading();
        this.node.active = false;
    },
    onClickSub() {
        this.slider.progress = this.slider.progress - this.cur_per;
        this.handleSlide();
    },

    onClickAdd() {
        this.slider.progress = this.slider.progress + this.cur_per;
        this.handleSlide();
    },
    onClose(){
        Global.onPopOff(this.node);
    },

    // update (dt) {},
});
