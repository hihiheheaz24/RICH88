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
        listSpCau:[cc.SpriteFrame],
        listSpDice:[cc.SpriteFrame],
        scrView:cc.ScrollView,
        line:cc.Graphics,
        line1:cc.Graphics,
        line2:cc.Graphics,
        line3:cc.Graphics,
        parentDice0:cc.Node,
        parentDice1:cc.Node,
        parentDice2:cc.Node,

        contentPro:cc.Node,
        
        lbSumTai:cc.Label,
        lbSumXiu:cc.Label,

        _isInitPro:false,
        lbInfoPhien:cc.RichText,
        _sumTai:0,
        _sumXiu:0,
        scrViewPro:cc.ScrollView,
        spKetQua:cc.SpriteAtlas,


        node1:cc.Node,
        node2:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.poolCauLineTren = new cc.NodePool();
        this.poolCauLineDuoi = new cc.NodePool();
        this.poolContentCauPro = new cc.NodePool();


        Global.SoiCauTaiXiu = this;
        this.contentTong = this.scrView.content.getChildByName("parentTong");
        this.contentPro2 = this.scrViewPro.content;

        this.offsetX = 583 / 19;
        this.offsetY = 175/ 15;
        this.offsetY2 = 175/ 6;
        
    },
    show(){
        Global.UIManager.hideMiniLoading();
        this.node.active= true;
        this._list = Global.TaiXiu._listHistory.slice();
        this.initCauTong();
        this.countChildrenPro2 = 0;
        this.currentTab = "0";
        actionEffectOpen(this.node);
    },
    onClickClose(){
        Global.UIManager.hideMark();
        actionEffectClose(this.node , ()=>{
            this.node.active = false;
        })
    },
    onDestroy(){
        this.poolCauLineTren.clear();
        this.poolCauLineDuoi.clear();
        this.poolContentCauPro.clear();
        Global.SoiCauTaiXiu = null;
    },
    initCauTong(){
        this.listCau = this._list.slice(0,40);
        this.listCau.reverse();
        let length = this.listCau.length;
        this.line.moveTo( this.offsetX , (this.listCau[0].DiceSum  - 3) * this.offsetY + 18);
        this.line.lineWidth = 3;
      //  this.contentTong.width = length * this.offsetX + this.offsetX;
        this.scrView.content.width = length * this.offsetX + this.offsetX;;
        for(let i = 0 ; i < length; i++){
            this.addCauTong(this.listCau[i].DiceSum , i , false);
        }
        this.line.stroke();
        let str = "line";
        let str2 = "Dice";
        let obj = this.listCau[0];
        for(let i = 1 ; i < 4 ; i++){
            this[str+i].moveTo(this.offsetX , obj[str2 + i] * this.offsetY2 - 192 - this.offsetY2/2 );
        }
        for(let i = 0 ; i < length; i++){
            this.addCauLe(this.listCau[i] , i , false);
        }
        for(let i = 1 ; i < 4 ; i++){
            this[str+i].stroke();
        }
        this.scrView.scrollToRight(0.1);


    },
    
    getPoolCauLineTren(){
        let node = null;
        if(this.poolCauLineTren.size() > 0){
            node = this.poolCauLineTren.get();
        }else{
            node = new cc.Node();;
            node.addComponent(cc.Sprite);
        }
        return node;
    },
    getPoolCauLineDuoi(){
        let node = null;
        if(this.poolCauLineDuoi.size() > 0){
            node = this.poolCauLineDuoi.get();
        }else{
            node = new cc.Node();;
            node.addComponent(cc.Sprite);
        }
        return node;
    },

    getPoolConTentCauPro(){
        let node = null;
        if(this.poolContentCauPro.size() > 0){
            node = this.poolContentCauPro.get();
        }else{
            node = new cc.Node();;
            node.addComponent(cc.Sprite);
        }
        return node;
    },



    addCauTong(result , index , isStrokeLine = true){
        let node = this.getPoolCauLineTren();
        node.scale = 0.8;
        let cp = node.getComponent(cc.Sprite);
        this.contentTong.addChild(node);
        node.y =  (result - 3) * this.offsetY   + 18 ;
        node.x =  (index * this.offsetX) + this.offsetX;
        cp.spriteFrame = this.spKetQua.getSpriteFrame(result.toString())  //result > 10 ? this.listSpCau[1] : this.listSpCau[0];
        if(index > 0 ){
            this.line.lineTo(node.x, node.y);
            if(isStrokeLine)this.line.stroke();
        }
    },

    addCauLe(obj , index , isStrokeLine = true){
        let str1 = 'parentDice';
        let  str2 = "Dice";
        let str3 = "line"
        for(let i = 0 ; i < 3 ; i++){
            let node = new cc.Node;
            //if(i==0) node.color = cc.Color.RED
            node.scale = 0.8;
            let cp = node.addComponent(cc.Sprite);
            this[str1+ i].addChild(node);
            node.y = obj[str2 + (i+1)]  * this.offsetY2 - 192 - this.offsetY2/2;
            node.x = (index * this.offsetX) + this.offsetX;
            cp.spriteFrame = this.listSpDice[i];
            if(index > 0){
               this[str3 + (i+1)].lineTo(node.x , node.y);
               if(isStrokeLine)this[str3 + (i+1)].stroke();
            }
        }
    },
    
    emitNewcau(){
        //return;
        this._list = Global.TaiXiu._listHistory.slice();
        this.listCau = this._list.slice(0,40);
        this.listCau.reverse();
        if(this.node2.active){
            this.resetViewCauPhai();
            this.initCauPro();
            this.initCauPro2();
            this.updateLbInfo();
            this.scheduleOnce(()=>{this.scrViewPro.scrollToRight(0.1)} , 0.2);
        }
        if(this.node1.active){
            this.resetViewCauTrai();
            this.initCauTong();
        }
    },
    resetViewCauTrai(){
        let length = this.contentTong.childrenCount;
        let list = this.contentTong.children;
        for(let i = 1 ; i < length ; i++){
            this.poolCauLineTren.put(list[1]);
        }
        this.line.clear(true);
        this.line1.clear(true);
        this.line2.clear(true);
        this.line3.clear(true);

       
        let str1 = 'parentDice';
        for(let i = 0 ;  i < 3 ; i++){
            let newLength = this[str1 + i].childrenCount;
            let newList = this[str1 + i].children;
            for(let i = 1 ; i < newLength ; i++){
                this.poolCauLineDuoi.put(newList[1]);
            }
        }
    },

    resetViewCauPhai(){
        this._sumTai = 0;
        this._sumXiu = 0;
        let length = this.contentPro.childrenCount;
        let list = this.contentPro.children;
        for(let i = 0 ; i < length ; i++){
            this.poolContentCauPro.put(list[0]);
        }
        length = this.contentPro2.childrenCount;
        let list2 = this.contentPro2.children;
        for(let i = 0 ; i < length ; i++){
            this.poolContentCauPro.put(list2[0]);
        }
    },

    



    onCheckToggle(event, data){
        cc.log("check data toggle : ",data)
        // let cpToggle =cc.find("Scale/Node1/toggle"+ data).getComponent(cc.Toggle);
        // let isCheck = cpToggle.isChecked;
        switch(data){
            case "0":
                // this.parentDice0.active = isCheck;
                // this.parentDice1.active = isCheck;
                // this.parentDice2.active = isCheck;
                this.contentTong.active = event.isChecked;
                cc.log("check log isChecked",event.isChecked)
                break;
            case "1":
            case "2":
            case "3":
                let str = "parentDice" + (parseInt(data) - 1);
                this[str].active = event.isChecked;
                cc.log("check log isChecked",event.isChecked)
                // if(this.parentDice0.active && this.parentDice1.active && this.parentDice2.active){
                //     cc.find("Node1/toggle0" , this.node).getComponent(cc.Toggle).check();
                // }

                // if(!this.parentDice0.active && !this.parentDice1.active && !this.parentDice2.active){
                //     cc.find("Node1/toggle0" , this.node).getComponent(cc.Toggle).uncheck();
                // }
                break;                
        }
    },

    onClickNextCau(event , data){
        if(this.currentTab == data) return;
        switch(data){
            case "0":
                this.node1.active = true;
                this.node2.active = false;
                this.resetViewCauTrai();
                this.initCauTong();
                break;
            case "1":
                this.resetViewCauPhai();
                this.node1.active = false;
                this.node2.active = true;
                this.initCauPro();
                this.initCauPro2();
                this.updateLbInfo();
                this.scheduleOnce(()=>{this.scrViewPro.scrollToRight(0.1)} , 0.2);
                break;
        }
        this.currentTab = data;
    },

    initCauPro(){
        this.listCauPro = this._list.slice(0 , this._list.length < 100 ? this._list.length : 100 );
        this.listCauPro.reverse();
        let length = this.listCauPro.length;
        for(let i = 0 ; i < length ; i++){
           this.addCauPro(this.listCauPro[i]);
        }
    },



    updateLbInfo(){
        let obj = this.listCauPro[this.listCauPro.length - 1]
        let phien = obj.GameSessionID ;
        let sum = obj.DiceSum ;
        let strT = sum> 10 ? " Tài " : " Xỉu "
        this.lbInfoPhien.string = "Phiên " + "<color=#FCB356>#" +  phien.toString() + "</c>" + strT  + sum + " (" + obj.Dice1  + "-" +  obj.Dice2 +"-" + obj.Dice3 +  ")</color>";
        
        this.lbSumTai.string = this._sumTai.toString();
        this.lbSumXiu.string = this._sumXiu.toString();
    },
    addCauPro(obj){
        let data = obj;
        let node = this.getPoolConTentCauPro();
        let cp = node.getComponent(cc.Sprite);
        this.contentPro.addChild(node);
        cp.sizeMode = 0;
        cp.spriteFrame = this.spKetQua.getSpriteFrame(data.DiceSum.toString())
        if(data.DiceSum > 10){
            //cp.spriteFrame =this.listSpCau[1];
            this._sumTai++;
        }else{
            //cp.spriteFrame =this.listSpCau[0];
            this._sumXiu ++;
        }
        node.setContentSize(25,25);
        // if(this.contentPro.childrenCount > 100){
        //     if(this.listCauPro[0].DiceSum > 10){
        //         this._sumTai--;
        //     }else{
        //         this._sumXiu--;
        //     }
        //     let nodeRM = this.contentPro.children[0];
        //     nodeRM.removeFromParent();
        //     nodeRM.destroy();
        // }

    },


    initCauPro2(){
        let length = this.listCauPro.length;
        // this.lastResult  = this.listCauPro[0].DiceSum > 10 ? 2:1;
        // this.nodeFirt = cc.instantiate(this.contentPro2.children[0]);
        // this.contentPro2.addChild(this.nodeFirt);
        //this.nodeFirt.active = true;
        let lastType = this.listCauPro[0].DiceSum > 10 ? 2:1;
        let parent = this.contentPro2;
        let indexX = 0;
            let indexY = 0;
        for(let i = 0 ; i < length ; i++){

             let sum = this.listCauPro[i].DiceSum;
             let sumType = sum > 10 ? 2 : 1;
             this.addCauPro2(sum , parent);
            if( i > 0){
                if (lastType != sumType){
                    indexX += 1;
                    indexY = 0;
                    lastType = sumType;
                } else{
                    indexY += 1;
                }
                
                if (indexY >= 5) {
                    indexY = 0;
                    indexX += 1;
                }
            }
            parent.children[i].setPosition( cc.v2( (32 * indexX) + 14, -15.67 - (31.55 * indexY)));
        }
        parent.width = 30 + (32 * indexX);

    },
    addCauPro2(result , nodeAdd){
        let node = this.getPoolConTentCauPro();
        let cp = node.getComponent(cc.Sprite);
        cp.sizeMode = 0;
        cp.spriteFrame =this.spKetQua.getSpriteFrame(result.toString())// result > 10 ? this.listSpCau[1] :this.listSpCau[0];
        node.setContentSize(25,25);
        nodeAdd.addChild(node);
        this.countChildrenPro2 ++;
    }
});
