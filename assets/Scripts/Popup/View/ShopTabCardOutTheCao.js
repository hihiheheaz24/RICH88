
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
        listSpNphCard:[cc.SpriteFrame],
    },
    onLoad() {
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
        let listVN = [];
        let listVT = [];
        let listMB = [];
        for(let i = 0 , l = listInfo.length ; i < l ; i++){
            let info = listInfo[i];
            if(info.NSPType == NSP_TYPE.VINAPHONE){
                listVN.push(info);
            }else if(info.NSPType == NSP_TYPE.MOBIFONE){
                listMB.push(info)
            }else if(info.NSPType == NSP_TYPE.VIETTEL){
                listVT.push(info);
            }
        }
        for(let i = 0 , l = listVT.length ; i < l ; i++){
            this.creatItem(listVT[i]);
        }
        for(let i = 0 , l = listMB.length ; i < l ; i++){
            this.creatItem(listMB[i]);
        }

        for(let i = 0 , l = listVN.length ; i < l ; i++){
            this.creatItem(listVN[i]);
        }
        // this.scheduleOnce(()=>{
        let letngth = this.scr.content.children.length;
        let cot = parseInt(letngth /2) ;
        let du = letngth%2;
        if(du != 0) cot++;
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
                let name = node.name;
                let listNameSplit = name.split(":");
                let type = parseInt(listNameSplit[0]);
                let gold = parseInt(listNameSplit[1]);
                let goldCose = Global.formatNumber(parseInt(listNameSplit[2])) ;
                Global.UIManager.showConfirmPopup(Global.formatString(MyLocalization.GetText("CAST_OUT_NOTIFY"),
                 [goldCose, this.GetNspNameByType(type),
                     Global.formatNumber(gold)]),
                     ()=>{
                        if(!MainPlayerInfo.checkCardOut(goldCose)) return;
                        let msgData = {};
                        msgData[1] = type;
                        msgData[2] = this.GetCardTypeByAmount(gold);
                        Global.UIManager.showMiniLoading();
                        require("SendRequest").getIns().MST_Client_Telco_CashOut(msgData);
                     }
                     );
                break;
            }
        }
        
    },
    creatItem(info){
        let parent = this.scr.content;
        let nph = info.NSPType;
        let gold = info.CardAmount;
        let goldNeed = info.GoldCost;
        let node = cc.instantiate(this.itemCard);
        node.active= true;
        parent.addChild(node);
        node.name = nph +":" + gold +":" +goldNeed;
        let listLb = node.getComponentsInChildren(cc.Label);
        let spriteNph = node.getComponent(cc.Sprite);
        let strNph = "";
        if(nph == NSP_TYPE.VIETTEL ){
            strNph = "VT";
        }else if (nph == NSP_TYPE.VINAPHONE ){
            strNph = "VN";
        }else if(nph == NSP_TYPE.MOBIFONE ){
            strNph = "MB";
        }
        spriteNph.spriteFrame = this.listSpNphCard[nph - 1];
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
    },

});
