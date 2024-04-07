cc.Class({
    extends: cc.Component,
    ctor() {
        this.typeNspCardPiece = 1;
        this.listTelcoPiece = [];
        this.transelementValueTelco = [];
        this.typeCardPiece = 0;
        this.listShopView = [];
        this.listSelectValueView = [];        
    },

    properties: {
        textValue : cc.Label,
        textNeedPiece : cc.Label,
        btnSelectVietelPiece : cc.Node,
        btnSelectMobiPiece : cc.Node,
        btnSelectVinaPiece : cc.Node,
        objListButtonCardPiece : cc.Node,
        shopView : cc.Node,
        selectValueView : cc.Node,
        currentPiece : cc.Label,
    },

    Init() {
        if(this.isInit)
        {
            return;
        }
        this.isInit = true;
        this.listShopView[this.listShopView.length] = this.shopView.getComponent("ShopTelcoView");
        this.listSelectValueView[this.listSelectValueView.length] = this.selectValueView.getComponent("ShopTelcoView");
    },

    show() {
        this.Init();
        require("SendRequest").getIns().MST_Client_Get_Join_Card_Piece_Info();
    },

    CheckNSPActive() {
        if (Global.GameConfig.FeatureConfig.CashOutByMobiFeature == EFeatureStatus.Open) {
            this.typeNspCardPiece = NSP_TYPE.MOBIFONE;
            this.btnSelectMobiPiece.active = true;
        } else {
            this.btnSelectMobiPiece.active = false;
        }
        if (Global.GameConfig.FeatureConfig.CashOutByVinaFeature == EFeatureStatus.Open) {
            this.typeNspCardPiece = NSP_TYPE.VINAPHONE;
            this.btnSelectVinaPiece.active = true;
        } else {
            this.btnSelectVinaPiece.active = false;
        }
        if (Global.GameConfig.FeatureConfig.CashOutByViettelFeature == EFeatureStatus.Open) {
            this.typeNspCardPiece = NSP_TYPE.VIETTEL;
            this.btnSelectVietelPiece.active = true;
        } else {
            this.btnSelectVietelPiece.active = false;
        }
        this.ClickSelectNSP(null, this.typeNspCardPiece);
    },

    SetUpListInfoPiece(listTelcoPiece, numbPiece) {
        this.currentPiece.string = numbPiece.toString();
        this.listTelcoPiece = listTelcoPiece;
        this.CheckNSPActive();
    },

    ClickSelectNSP(event, index) {
        this.ResetUI();
        this.typeNspCardPiece = index;
        let listCard = [];
        cc.log(this.listTelcoPiece);
        for(let i = 0; i < this.listTelcoPiece.length; i++) {
            if(this.listTelcoPiece[i].CardType == this.typeNspCardPiece) {
                listCard[listCard.length] = this.listTelcoPiece[i];
            }
        }
        this.SetListValueNSP(listCard);
    },

    ClickShowListValue() {
        this.objListButtonCardPiece.active = !this.objListButtonCardPiece.active;
    },

    SetListValueNSP(listCard) {
        for (let i = 0; i < this.listShopView.length; i++) {
            this.listShopView [i].node.active = false;
            this.listSelectValueView[i].node.active = false;
        }
        for (let i = 0; i < listCard.length; i++) {
            if (i < this.listShopView.length) {
                this.listShopView [i].SetUp (listCard[i].CardAmount, listCard[i].PiecesAmount);
                this.listSelectValueView [i].SetUp (listCard[i].CardAmount, listCard[i].PiecesAmount);
            } else {
                let itemTrans = cc.instantiate(this.shopView);
                itemTrans.parent = this.shopView.parent;
                let itemView = itemTrans.getComponent("ShopTelcoView");
                itemView.SetUp (listCard[i].CardAmount, listCard[i].PiecesAmount);
                this.listShopView[this.listShopView.length] = itemView;

                let item2Trans = cc.instantiate(this.selectValueView);
                item2Trans.parent = this.selectValueView.parent;
                let item2View = item2Trans.getComponent("ShopTelcoView");
                item2View.SetUp (listCard[i].CardAmount, listCard[i].PiecesAmount);
                this.listSelectValueView[this.listSelectValueView.length] = item2View;
            }
        }
        for(let i = 0; i < this.listSelectValueView.length; i++) {
            let index = i;
            this.listSelectValueView [i].node.off(cc.Node.EventType.TOUCH_END , ()=>{
                this.ClickBtnSelectValuePiece(listCard[index].CardAmount, listCard[index].PiecesAmount);
            }, this);
            this.listSelectValueView [i].node.on(cc.Node.EventType.TOUCH_END , ()=>{
                this.ClickBtnSelectValuePiece(listCard[index].CardAmount, listCard[index].PiecesAmount);
            }, this);
        }
    },

    ClickBtnSelectValuePiece(cardAmout, pieceCost) {
        this.objListButtonCardPiece.active = false;
        this.typeCardPiece = Global.ShopPopup.GetCardTypeByAmount(cardAmout);
        this.textValue.string = Global.formatNumber(cardAmout);
        this.pieceCost = pieceCost;
        this.textNeedPiece.string = Global.formatString(MyLocalization.GetText("NEED_PIECE"),[Global.formatNumber(pieceCost)]);
    },

    ResetUI() {
        this.objListButtonCardPiece.active = false;
        this.typeCardPiece = 0;
        this.textValue.string = MyLocalization.GetText("SELECT_VALUE");
        this.textNeedPiece.string = Global.formatString(MyLocalization.GetText("NEED_PIECE"),["0"]);
    },

    ClickConfirmCardOut() {
        if (this.typeCardPiece == 0) {
            Global.UIManager.showCommandPopup (MyLocalization.GetText ("CAST_OUT_AMOUNT_ERROR"));
        } else {
            Global.UIManager.showConfirmPopup (Global.formatString(MyLocalization.GetText ("CAST_OUT_PIECE_NOTIFY"), [Global.formatNumber(this.pieceCost), Global.ShopPopup.GetNspNameByType(this.typeNspCardPiece), Global.formatNumber(this.textValue.string)]), () => this.SendCardPiece ());
        }
    },

    SendCardPiece() {
        Global.UIManager.showMiniLoading();
        let msgData = {};
        msgData[1] = this.typeNspCardPiece;
        msgData[2] = this.typeCardPiece;
        require("SendRequest").getIns().MST_Client_Join_Card_Piece(msgData);
    },
    
});
