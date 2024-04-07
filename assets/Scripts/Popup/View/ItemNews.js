// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,
    
    properties: {
        lbTitle : cc.Label,
        nodeContent : cc.Node,
        lbContent : cc.Label,
        btnClick : cc.Sprite,
        listSprBtn : {
            default : [],
            type : [cc.SpriteFrame]
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.isClick = false;
    },

    start () {

    },
    init(data){
        this.lbTitle.string = data.Title;
        this.lbContent.string = data.Content;
    },

    // onClickitem(event, data){
    //     let listView = this.node.parent;
    //     for (let i = 0; i < listView.children.length; i++) {
    //         const objItem = listView.children[i];
    //         objItem.getChildByName("lbContent").active = false;
    //         objItem.getComponent("ItemNews").isClick = false;
    //         objItem.getChildByName("bgNews").getChildByName("sprButton").getComponent(cc.Sprite).spriteFrame = this.listSprBtn[0];
    //     }
    //     this.isClick = !this.isClick;
    //     if(this.isClick){
    //         this.nodeContent.active = true;
    //         this.btnClick.spriteFrame = this.listSprBtn[1];
    //     }
    //     else{
    //         this.nodeContent.active = false;
    //         this.btnClick.spriteFrame = this.listSprBtn[0];
    //     }
      
    // },
});
