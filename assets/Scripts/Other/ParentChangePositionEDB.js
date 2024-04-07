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
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    initNodeMove(node){
        if(!cc.sys.isNative)return
        this.nodeMove = node;
    },
    resignEdb(edb){
        if(!cc.sys.isNative || edb == null)return
        let eventBegan = new cc.Component.EventHandler();
        eventBegan.target = this.node; 
        eventBegan.component = "ParentChangePositionEDB";
        eventBegan.handler = "editBegan";
        eventBegan.customEventData = "";
        edb.editingDidBegan[0] =eventBegan;


        let eventEnd = new cc.Component.EventHandler();
        eventEnd.target = this.node; 
        eventEnd.component = "ParentChangePositionEDB";
        eventEnd.handler = "editEnd";
        eventEnd.customEventData = "";
        edb.editingDidEnded[0] =eventEnd;

    },

    resignNext(edb , edbNext = ""){
        if(!cc.sys.isNative || edb == null)return
        let eventNext = new cc.Component.EventHandler();
        eventNext.target = this.node; 
        eventNext.component = "ParentChangePositionEDB";
        eventNext.handler = "editNext";
        eventNext.customEventData = edbNext;
        edb.editingReturn.push(eventNext);
        edb.returnType = 5;
    },

    resetEmitNext(edb){
        if(!cc.sys.isNative || edb == null)return;
        edb.editingReturn.length = 0;
    },
    editBegan(event , data){
        // cc.log(event);
         Global.EDBController.checkAndChangePositionEDB(event , this.nodeMove|| this.node )
         cc.log("chay vao editbegan")
     },
     editEnd(){
        Global.EDBController.endNodeEDB()
    },
    editNext(event , data){
        if(!cc.sys.isNative)return
        this.scheduleOnce(()=>{
            let edbNext = this[data]
            if(edbNext)edbNext.focus();
        } , 0.2)
        
    }


   

    // update (dt) {},
});
