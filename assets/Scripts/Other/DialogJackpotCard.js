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
        textName:cc.RichText,
        textInfo:cc.RichText,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    show(data){
        cc.log("data take jackpot card " + JSON.stringify(data));
        let id = data[13];
        let goldRevice = data[16];
        let moneyPlayer = data[15];
        let name = data[14];
        let gameId = data[18];
        let str = `Chúc mừng <color=#F8F800>%n</color>`.replace("%n" , name);
        let str2 = "Nổ hũ game <color=#0BFE8E>" + this.getNameGame(gameId)+ "</color> <color=#FFDB32>" + Global.formatNumber(goldRevice) + "</color>";

        this.textName.string = str;
        this.textInfo.string = str2;

        this.node.active= true;
        this.node.scale = 0;
        cc.tween(this.node)
        .to(0.7 , {scale:1} , {easing:"backOut"})
        .delay(5)
        .to(0.5 , {scale:0} , {easing:"backIn"})
        .call(()=>{
            this.node.active = false;
        })
        .start();
    },
    getNameGame(type){
        switch (type){
            case "TMN":return "Tiến Lên";
            case "MAB": return " Binh";
            case "SAM" : return "Sâm";
        }
    }

    // update (dt) {},
});
