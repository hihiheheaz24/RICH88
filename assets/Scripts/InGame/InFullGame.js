cc.Class({
    extends: cc.Component,

    properties: {
        nodeGame: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Global.GameScence = this;
        // Global.UIManager.nodeBtnJackpotCard.active = false;
    },

    start() {
        cc.log("Slot full game start");
        var url = "GamePrefabs/EgryptSlot";
        if (require("ScreenManager").getIns().roomType == 1){
            //url = "GamePrefabs/MyNhanSlot";
            cc.assetManager.loadBundle(GAME_TYPE.ORACLE.toString() , (err , bundle)=>{
                if(err) return
                bundle.load("ThatTruyen" , cc.Prefab ,(count , total)=>{
                    Global.UIManager.progressLoading(count/total);
                }, (err2 , prefab)=>{
                    if (err2) return;
                    this.nodeGame.addChild(cc.instantiate(prefab));
                })

            })

        }else{
            cc.assetManager.loadBundle(GAME_TYPE.TAM_BAO.toString() , (err , bundle)=>{
                if(err) return
                bundle.load("VoLam" , cc.Prefab ,(count , total)=>{
                    Global.UIManager.progressLoading(count/total);
                }, (err2 , prefab)=>{
                    if (err2) return;
                    this.nodeGame.addChild(cc.instantiate(prefab));
                })

            })
        }
            

       
        
    },

    // update (dt) {},
});
