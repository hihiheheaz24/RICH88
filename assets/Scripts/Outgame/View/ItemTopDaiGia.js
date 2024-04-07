// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        lb_name : {
            default : null,
            type : cc.Label
        },

        lb_ag : {
            default : null,
            type : cc.Label
        },

        avatar : {
            default : null,
            type : cc.Sprite
        },
        listIconTop : {
            default : [],
            type : [cc.SpriteFrame]
        },

        iconTop : {
            default : null,
            type : cc.Sprite
        },
        lbTop : {
            default : null,
            type : cc.Label
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    init(data, i){
        cc.log("data item top dai gia la : ", data);
        Global.GetAvataById(this.avatar, data.AccountId);
        this.lb_name.string = data.NickName;
        this.lb_ag.string = Global.formatNumber(data.TotalMoney);

        if(i < 3){
            this.iconTop.spriteFrame = this.listIconTop[i];
        }
        else{
            this.lbTop.string  = i + 1;
            this.iconTop.node.active = false;
        }
    },
});
