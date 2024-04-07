cc.Class({
    extends: cc.Component,

    properties: {
        imgContent : cc.Sprite,
        listImgContent : [cc.SpriteFrame]
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    show(){
        Global.onPopOn(this.node)
    },

    hide(){
        Global.onPopOff(this.node)
    },

    onClickBtn(event, data){
        cc.log("check dara : ", data)
        let index = JSON.parse(data);

        switch (index) {
            case 0:
                this.imgContent.spriteFrame = this.listImgContent[index];
                break;
            case 1:
                this.imgContent.spriteFrame = this.listImgContent[index];
                break;
            case 2:
                this.imgContent.spriteFrame = this.listImgContent[index];
                break;
            case 3:
                this.imgContent.spriteFrame = this.listImgContent[index];
                break;
            case 4:
                this.imgContent.spriteFrame = this.listImgContent[index];
                break;
        }
    },

    // update (dt) {},
});
