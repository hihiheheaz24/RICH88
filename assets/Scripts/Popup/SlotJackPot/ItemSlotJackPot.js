var VITRI = {
    pos1 : cc.v2(0,0),
    pos2 : cc.v2(0,0),
    pos3 : cc.v2(0,0),
}
cc.Class({
    extends: cc.Component,

    properties: {
       listItem : [cc.Node]
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {

    // },

    start () {
        this.value = 0;
    },

    setStringItem(value){
        if(this.listItem[this.listItem.length - 1].getNumberOfRunningActions()) return;

        for (let i = 0; i < this.listItem.length; i++) {
            const item = this.listItem[i];
            let index = 0
            if(i+1 >= this.listItem.length){
                index = 0;
                item.opacity = 0;
            }
            else{
                index = i + 1;
                item.opacity = 255;
            }

            switch (i) {
                case 0:
                    item.getComponent(cc.Label).string = value
                    break;

                case 1:
                    if(value - 1 < 0) {
                        item.getComponent(cc.Label).string = 9;
                    }
                    else{
                        item.getComponent(cc.Label).string = value - 1;
                    }
                    break;
                case 2:
                    if(value + 1 > 10) {
                        item.getComponent(cc.Label).string = 0
                    }
                    else{
                        item.getComponent(cc.Label).string = value + 1;
                    }
                    break;
            }
           
            cc.tween(item)
            .to(0.3, {position: this.listItem[index].position})
            .start();
        }
        this.listItem.unshift(this.listItem.pop())
    },

    getStringJackpot(){
        return this.listItem[1].getComponent(cc.Label).string;
    },

    clickItem(){
        this.value++
        this.setStringItem(this.value)
    }, 

    // update (dt) {},
});
