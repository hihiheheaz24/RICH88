// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,
    // ctor(){
    //     this.size = 520;
    // },
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
        nodeCoin:cc.Node,
        progressBar:cc.Sprite,
        lbPer:cc.Label,
        lbTip : cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {
        
    // },

    onEnable(){//MyLocalization.GetText("HUY_DANGKY_THOAT_BAN")
        let stt_text = Global.RandomNumber(0,5);
        let textConfig = MyLocalization.GetText("loading_text");
        let textEdit = textConfig.replace('%d', stt_text);
        // this.lbTip.string = MyLocalization.GetText(textEdit);
        this.lbTip.string = ""
    },

    // start () {

    // },
    setFrogress(per){
        let max = this.nodeCoin.parent.width; 
        this.nodeCoin.x = per*max - 383;
        this.progressBar.fillRange = per;
        this.lbPer.string = parseInt(per*100) + "%";
    }
    // update (dt) {},
});
