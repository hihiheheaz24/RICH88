cc.Class({
    extends: cc.Component,

    properties: {
        listItemRward : [cc.Node],

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    runItemReward(){

        for (let i = 0; i < this.listItemRward.length; i++) {
            this.listItemRward[i].opacity = 255;
        }
      
        cc.tween(this.listItemRward[0])
        .to(0.1, {position : this.listItemRward[1].position})
        .start()

        if(this.listItemRward[1].position.y > 0){
            this.listItemRward[0].opacity = 0;
        }

        cc.tween(this.listItemRward[1])
        .to(0.1, {position : this.listItemRward[2].position})
        .start()

        if(this.listItemRward[2].position.y > 0){
            this.listItemRward[1].opacity = 0;
        }

        cc.tween(this.listItemRward[2])
        .to(0.1, {position : this.listItemRward[0].position})
        .start()

        if(this.listItemRward[0].position.y > 0){
            this.listItemRward[2].opacity = 0;
        }
    },

    randomRewardItem(listPlayerName){
        for (let i = 0; i < this.listItemRward.length; i++) {
            const itemReward = this.listItemRward[i];
            cc.log("check i la : ",i / listPlayerName.length)
            itemReward.getComponent(cc.Label).string = listPlayerName[i % listPlayerName.length];
        }
    },

    setItemReward(playerFirstTurn){
        for (let i = 0; i < this.listItemRward.length; i++) {
            const item = this.listItemRward[i];
            if(item.position.y > 0)
                item.getComponent(cc.Label).string = playerFirstTurn;
        }
    }

});
