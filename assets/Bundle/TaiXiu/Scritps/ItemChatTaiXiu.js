// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        itemID:0,
        lb:cc.RichText,
        alats: cc.SpriteAtlas,
    },

    // LIFE-CYCLE CALLBACKS:

    //onLoad () {},

    initItem( info){
        
        let vip = info.VipLevel;
        let nickName = info.Nickname;
        let content = info.ChatContent;
        var lb = this.lb;
        if(vip > 2){
          //  this.node.getComponentInChildren(cc.Sprite).spriteFrame = this.alats.getSpriteFrame("V" + vip);
            //lb.node.x = this.node.children[0].width;
        }else{
            lb.node.x = 0;
           // this.node.getComponentInChildren(cc.Sprite).spriteFrame = null;
        }
        let str1 = "";//<img src='V%v'/>".replace("%v" , vip) ";
        let str2 = "<color=#ffdd69>" + nickName ;
        let str3 = "<color=#FFFFFF>"+": " + content + "</c>" ;

       // if(vip > 2){
            lb.string = str1 + str2 + str3;
        // }else{
        //     str2 = "<color=#FFF500>" + nickName +  "[V" + vip + "]";
        //     lb.string =  str2 + str3;
        // }
       // this.node.height = info.height;
     
    },
    unuse(){
        this.node.height = 0;
    }

    // update (dt) {},
});
