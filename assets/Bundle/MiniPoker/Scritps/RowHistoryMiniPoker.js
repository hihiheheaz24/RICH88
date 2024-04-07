cc.Class({
    extends: cc.Component,

    properties: {
        element1 : cc.Label,
        element2 : cc.Label,
        element3 : cc.Label,
        element4 : cc.Label,
        element5 : cc.Label,
      //  bgSprite : cc.Sprite,
    },

    SetInfo(data1, data2, data3, data4, data5,index) {
        this.element1.string = data1;
        this.element2.string = data2;
        this.element3.string = data3;
        this.element4.string = data4;
        this.element5.string = data5;
       // this.bgSprite.enabled = (index % 2) == 0 ? false : true;
    },

   
});
