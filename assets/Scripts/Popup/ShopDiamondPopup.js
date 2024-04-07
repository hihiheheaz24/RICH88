cc.Class({
    extends: cc.Component,
    ctor() {
        this.currentNumbItem = 0;
        this.currentItem = null;
        this.listItem = [];
        this.listData = [];
    },

    properties: {
        txtNumb : cc.Label,
        txtPrize : cc.Label,
        txtDescription : cc.Label,
        txtDiamondBalance : cc.Label,
        imgSelect : cc.Sprite,
        shopItem : cc.Node,
    },

    Init() {
        if(this.isInit)
        {
            return;
        }
        this.isInit = true;
        this.listItem[this.listItem.length] = this.shopItem.getComponent("ItemShopView");
    },

    show(listData, diamondBalance) {
        this.Init();
        this.node.active = true;
        this.listData = listData;
        this.UpdateDiamond (diamondBalance);
        this.Reset ();
        for (let i = 0; i < this.listItem.length; i++) {
            this.listItem [i].node.active = false;
        }
        for (let i = 0; i < this.listData.length; i++) {
            if (i < this.listItem.length) {
                this.listItem [i].ShowItem (this.listData[i]);
            } else {
                let itemTrans = cc.instantiate(this.shopItem);
                itemTrans.active = true;
                itemTrans.parent = this.shopItem.parent;
                let itemView = itemTrans.getComponent("ItemShopView");
                itemView.ShowItem (this.listData[i]);
                this.listItem[this.listItem.length] = itemView;
            }
        }
        for(let i = 0; i < this.listItem.length; i++) {
            this.listItem[i].Init(this.listItem);
        }
    },

    SelectItem(id, spr) {
        if (this.currentItem == null || id != this.currentItem.Id) {
            for (let i = 0; i < this.listData.length; i++) {
                if (this.listData [i].Id == id) {
                    this.currentItem = this.listData [i];
                    break;
                }
            }
            this.currentNumbItem = 1;
            this.txtDescription.string = this.currentItem.Description;
            this.imgSelect.node.active = true;
            this.imgSelect.spriteFrame = spr;
            this.CalculatorPrize ();
        }
    },

    Reset() {
        this.txtNumb.string = "0";
        this.txtPrize.string = "0";
        this.imgSelect.node.active = false;
        this.currentItem = null;
        this.currentNumbItem = 0;
    },

    CalculatorPrize() {
        this.txtNumb.string = this.currentNumbItem.toString ();
        if (this.currentItem.DiamondPrice > 0) {
            this.txtPrize.string = Global.formatNumber (this.currentItem.DiamondPrice * this.currentNumbItem);
        } else if (this.currentItem.MoneyPrice > 0) {
            this.txtPrize.string = Global.NumberShortK (this.currentItem.MoneyPrice * this.currentNumbItem);
        }
    },

    BuyItem() {
        if (this.currentItem == null) {
            Global.UIManager.showCommandPopup (MyLocalization.GetText("NO_SELECT_ITEM"));
        } else {
            let type = this.currentItem.DiamondPrice > 0 ? MyLocalization.GetText ("DIAMOND_BALANCE") : MyLocalization.GetText ("GOLD_BALANCE");
            let cost = this.currentItem.DiamondPrice > 0 ? (this.currentItem.DiamondPrice * this.currentNumbItem).toString () : (this.currentItem.MoneyPrice * this.currentNumbItem).toString ();
            Global.UIManager.showConfirmPopup (Global.formatString (MyLocalization.GetText ("CONFIRM_BUY_ITEM"), [cost, type, this.currentItem.Name, this.currentNumbItem.toString ()]), this.ConfirmBuyItem, null);
        }
    },

    ConfirmBuyItem() {
        let msgData = {};
        msgData[1] = Global.ShopDiamondPopup.currentItem.Id;
        msgData [2] = Global.ShopDiamondPopup.currentNumbItem;
        require("SendRequest").getIns().MST_Client_Buy_Shop_Package(msgData);
    },

    AddItem() {
        this.currentNumbItem += 1;
        this.CalculatorPrize ();
    },

    SubItem() {
        if (this.currentNumbItem > 1) {
            this.currentNumbItem -= 1;
            this.CalculatorPrize ();
        }
    },

    UpdateDiamond(diamondBalance) {
        this.txtDiamondBalance.string = Global.formatNumber (diamondBalance);
    },

    Hide() {
        this.node.active = false;
    },

    onDestroy(){
		Global.ShopDiamondPopup = null;
	},
    
});
