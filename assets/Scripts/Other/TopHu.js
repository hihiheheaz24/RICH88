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
    ctor(){
        this.listGameShow = ["8","5","4","13"]
        this._listMoneyCurrent=[];
        this._listCpItem=[];
        this._currentTabIndex=0;
        this._lastTabIndex=0;
        this._isInit = false;
        this.countRepeatRun = 0;
    },
    properties: {
        parentItem:cc.Node,
        itemClone:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Global.TopHu = this;
    },
    onDestroy(){
        Global.TopHu = null;
    },
    initItem(){
        if(!this._isInit ){
            let obj = Global.JackpotController.listMoneyJackpot;
            for(let temp in obj){
                if(this.listGameShow.includes(temp)){
                    let itemCP = cc.instantiate(this.itemClone).getComponent("TopItemView");
                    this.parentItem.addChild(itemCP.node);
                    itemCP.node.active = true;
                    itemCP.initItem(temp);
                    this._listCpItem.push(itemCP);
                }
                
            }
            this._isInit = true;
        }
        this.sortItem();
    },
    onClickTab(event, data){
        //let node = event.target.node;

        let num = parseInt(data);
        this._lastTabIndex = this._currentTabIndex;
        this._currentTabIndex = num;
        if(this._lastTabIndex == this._currentTabIndex) return;
       
        let length = this._listCpItem.length;
        for(let i = 0 ; i < length ; i++){
            let item = this._listCpItem[i];
            item.changeIndex(this._currentTabIndex);
        }
        this.sortItem();
    },
    sortItem(){
        let tempList=this._listCpItem.slice();
        tempList.sort((x,y)=>{
          return y.lbMoney._money - x.lbMoney._money
        });

        let length = tempList.length;
        for(let i = 0 ; i < length ; i++){
            for( let j = 0 ;  j < length ; j++){
                if(this._listCpItem[j].gameType == tempList[i].gameType){
                    this._listCpItem[j].node.zIndex = i;
                    break;
                }
            }
        }
        tempList = null;
        this.parentItem.sortAllChildren();
        this.sortPosChildren();
    },
    sortPosChildren(){
        let length = this.parentItem.childrenCount;
        let child = this.parentItem.children;
        //- 64 * (0.5 + i)
        for(let  i = 0 ; i  < length ;i++){
            let pos = cc.v2(0  , - (0.5 + i) * 55 );
            child[i].stopAllActions();
            child[i].runAction(cc.moveTo(0.3 , pos));
        }
        this.parentItem.height = (55 )*length;
    }



    // update (dt) {},
});
