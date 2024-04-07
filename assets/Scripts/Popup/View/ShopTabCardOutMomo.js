
cc.Class({
    extends: require("ParentChangePositionEDB"),
    ctor() {
        this.status = 0;
        this.isInit = false;
        this.lstNSP = [];
        this.lstCost = [];
        this.lstTelco = [];
    },

    properties: {
       
        scr:cc.ScrollView,
        itemCard:cc.Node,
        edbSdt:cc.EditBox,

    },
    onLoad() {
        this.nodeCache = null;
       // Global.CashOut = this;
        
        //this.initNodeMove(Global.CashOut.node);
        //this.resignEdb(this.edtPhone);
    },
    start(){
       this.Init();
    },
    onDestroy() {
      //  Global.CashOut = null;
    },
    Init() {
        let listInfo = Global.cardTopupInfosOut;
        let listMOMO = [];

        for(let i = 0 , l = listInfo.length ; i < l ; i++){
            let info = listInfo[i];
            if(info.NSPType == NSP_TYPE.MOMO){
                listMOMO.push(info);
            }
        }
        for(let i = 0 , l = listMOMO.length ; i < l ; i++){
            this.creatItem(listMOMO[i] , i+ 1);
        }
        // this.scheduleOnce(()=>{
        let letngth = this.scr.content.children.length;
        let cot = letngth ;
        let layout = this.scr.content.getComponent(cc.Layout);
        let totalSize = (this.itemCard.width * cot) + (layout.spacingX* (cot - 1));
        if(totalSize < this.scr.node.width){
            layout.paddingLeft = (this.scr.node.width - totalSize)/2;
        }
    },
    onClickParentItem(touch){
        
        touch.stopPropagation();
        let v2Touch = cc.v2(touch.getLocation());
        let listChild = this.scr.content.children;
        for(let i = 0 , l = listChild.length ; i < l ; i++){
            let node = listChild[i];
            if (node.getBoundingBoxToWorld().contains(v2Touch)){
                this.nodeCache = node;
                let name = node.name;
                let listNameSplit = name.split(":");
                let goldCose = Global.formatNumber(parseInt(listNameSplit[2])) ;
                if(!MainPlayerInfo.checkCardOut(goldCose)) return;
                this.edbSdt.node.parent.active = true;
                 //   this.showConfirmSdt(node);
                break;
            }
        }
    },
  
    onClickXacNhanSDT(){
        let str = this.edbSdt.string;
        if(str == ""){
            Global.UIManager.showCommandPopup(MyLocalization.GetText("IF_MOBILE_NULL"));
            return;
        } 
        this.edbSdt.node.parent.active = false;
        let node = this.nodeCache;
        let name = node.name;
        let listNameSplit = name.split(":");
        let type = parseInt(listNameSplit[0]);
        let gold = parseInt(listNameSplit[1]);
        let goldCose = Global.formatNumber(parseInt(listNameSplit[2])) ;
        Global.UIManager.showConfirmPopup(Global.formatString(MyLocalization.GetText("CAST_OUT_NOTIFY_MOMO"),
         [goldCose , str ,Global.formatNumber(gold)]),
             ()=>{
                let msgData = {};
                msgData[1] = type;
                msgData[2] = this.GetCardTypeByAmount(gold);
                msgData[3] = str;
                Global.UIManager.showMiniLoading();
                require("SendRequest").getIns().MST_Client_Telco_CashOut(msgData);
             }
             );
    },
    onClickHuy(){
        this.edbSdt.node.parent.active = false;
    },
    creatItem(info , index){
        let parent = this.scr.content;
        let nph = info.NSPType;
        let gold = info.CardAmount;
        let goldNeed = info.GoldCost;
        let node = cc.instantiate(this.itemCard);
        node.active= true;
        node.y = 0;
        parent.addChild(node);
        node.name = nph +":" + gold +":" +goldNeed;
        let listLb = node.getComponentsInChildren(cc.Label);
        let strNph = "MOMO PACK " + index;
        listLb[0].string = strNph;
        listLb[1].string = Global.formatMoney(gold,0);
        listLb[2].string = Global.formatNumber(goldNeed);
    },
    onEnable() {
        this.scr.content.on('touchend' ,this.onClickParentItem , this );
        
    },
    onDisable() {
        this.scr.content.off('touchend' ,this.onClickParentItem , this );
    },
   
  
    GetCardTypeByAmount(cardAmount) {
        let index = CARD_AMOUNT_VALUE.indexOf(cardAmount);
        if(index == -1) return 0;
        return index
    },
    GetNspNameByType(nspType) {
        if (nspType == NSP_TYPE.VIETTEL)
            return "Viettel";
        else if (nspType == NSP_TYPE.VINAPHONE)
            return "VinaPhone";
        else if (nspType == NSP_TYPE.MOBIFONE)
            return "MobiFone";
        else if (nspType == NSP_TYPE.MOMO)
        return "MOMO";
    },
});
