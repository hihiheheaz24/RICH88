// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
const NodeType = cc.Enum({
    NONE: 0,
    NapTien: 1,
    RutTien: 2,
    NapMomo: 3,
    NapSms: 4,
    NapCard: 5,
    NapIAP: 6,
    NapBank: 7,
    Event: 8,
    GiftCode: 9,
    TopGame: 10,
    CashOutBank: 11,

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
        type: {
            default: NodeType.NONE,
            type: NodeType
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Global.UIManager.dangKyNodeActiveByConfig(this);
    },
    onDestroy() {
        Global.UIManager.huyDangKyNodeActiveByConfig(this);
    },
    // start () {

    // },
    onEnable() {
        if (Global.GameConfig == null) {
            this.node.active = false;
            return;
        }
        let temp = -1;
        switch (this.type) {
            case NodeType.NapTien:
                temp = Global.GameConfig.FeatureConfig.CashinLobbyFeature;
                break


            case NodeType.RutTien:
                temp = Global.GameConfig.FeatureConfig.CashOutFeature;
                // if (!MainPlayerInfo.phoneNumber && cc.sys.os === cc.sys.OS_ANDROID)
                //     temp = 2;
                break

            case NodeType.NapMomo:
                temp = Global.GameConfig.FeatureConfig.CashInByMomoFeature;
                // if (!MainPlayerInfo.phoneNumber && cc.sys.os === cc.sys.OS_ANDROID)
                // temp = 2;
                break;

            case NodeType.NapSms:
                temp = Global.GameConfig.FeatureConfig.CashInBySmsFeature;
                // if (!MainPlayerInfo.phoneNumber)
                // temp = 2;
                break;

            case NodeType.NapCard:
                temp = Global.GameConfig.FeatureConfig.CashInByCardFeature;
                // if (!MainPlayerInfo.phoneNumber && cc.sys.os === cc.sys.OS_ANDROID)
                // temp = 2;
                break;

            case NodeType.NapIAP:
                if(cc.sys.isBrowser){
                    temp = EFeatureStatus.Close;
                }
                else{
                    temp = Global.GameConfig.FeatureConfig.CashInByIAPFeature;
                }
               
                break;

            case NodeType.NapBank:
                temp = Global.GameConfig.FeatureConfig.CashInByBankFeature;
                // if (!MainPlayerInfo.phoneNumber && cc.sys.os === cc.sys.OS_ANDROID)
                // temp = 2;
                break;

            case NodeType.Event:
                temp = Global.GameConfig.FeatureConfig.EventsStatus;
                break;

            case NodeType.GiftCode:
                temp = Global.GameConfig.FeatureConfig.GiftCodeFeature;
                // if (!MainPlayerInfo.phoneNumber && cc.sys.os === cc.sys.OS_ANDROID)
                //     temp = 2;
                break;

            case NodeType.TopGame:
                temp = Global.GameConfig.FeatureConfig.TopGameFeature;
                break;

            case NodeType.CashOutBank:
                temp = Global.GameConfig.FeatureConfig.CashOutByBankFeature;
                break;

        }
        // cc.log("chay vao onenable nay " + JSON.stringify(Global.GameConfig)); 
        // cc.log("chay vao onenable nay " + JSON.stringify(Global.GameConfig)); 
        if (temp == EFeatureStatus.Open) {
            this.node.active = true;

        } else {
            this.node.active = false;
        }



    },
    emitNewData() {
        this.onEnable();
    }
    // update (dt) {},
});
