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
        lbName:cc.Label,
        lbGold:cc.Label,
        toggle:cc.Toggle,
        avatar:cc.Sprite,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.check = false;
    },

    initItem(data){
        this.data  = data;
        this.lbName.string = data.NickName;
        this.lbGold.string = Global.formatNumber(data.IngameBalance);
        Global.GetAvataById(this.avatar , data.AccountId);
        if(data.isChecked == null || data.isChecked == false){
            this.toggle.uncheck();
        }else{
            this.toggle.check();
        }
        
    },
    onToggle(event , data){
        cc.log("chay vao ham togle ??? ")
        if(event.isChecked){
            Global.MoiChoi.dangKyList(this);
        }else{
            Global.MoiChoi.huyDangKy(this);
        }
    },
    checkList(){
        cc.log("chay vao ham nah ??? ", this.toggle.isChecked)
        if(this.toggle.isChecked){
            Global.MoiChoi.dangKyList(this);
        }
        else{
            Global.MoiChoi.huyDangKy(this);
        }
    },

    // update (dt) {},
});
