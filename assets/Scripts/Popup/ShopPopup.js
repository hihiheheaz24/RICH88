cc.Class({
	extends: cc.Component,

	ctor() {
		this.status = 3;
		this.isInit = false;
		this.statusCardIn = 0;
		this.valueCardIn = 0;
	},

	properties: {
		nodeInputCard: cc.Node,
		tabCashInObj: cc.Node,
		tabCashOutObj: cc.Node,
		tabIapObj: cc.Node,
		tabTradeGold: cc.Node,

		btnCardIn: cc.Toggle,
		btnMomoIn: cc.Toggle,
		// btnIAP: cc.Toggle,

		cardObj: cc.Node,
		//out
		btnCardOut: cc.Toggle,
		btnMomoOut: cc.Toggle,
		btnPieceOut: cc.Toggle,
		btnHistoryOut: cc.Toggle,
		cardOutObj: cc.Node,
		pieceOutObj: cc.Node,

		// new
		// toggleItem: cc.Toggle,
		toggleCashIn: cc.Toggle,
		toggleMomo: cc.Toggle,
		toggleIAP: cc.Toggle,
		toggleBank: cc.Toggle,
		toggleSMS: cc.Toggle,
		tabMomoContent: require("ShopTabMomo"),
		tabCashInContent: require("ShopTabCardIn"),
		tabIAPContent: require("ShopTabIAP"),
		tabSMSContent: require("ShopTabSMS"),
		tabBankingContent: require("ShopTabCashInBanking"),

		listItemDiamond: cc.ScrollView,
		itemDiamond: cc.Node,
		btnTradeGold : cc.Toggle,
		btnTradeDiamond : cc.Toggle,
	},
	onLoad() {
		this.initUI();
		this.nodeInputCard.active = false;
		// this.ClickTabIAP();
	},

	initUI() {
		// this.toggleItem.node.on('toggle', this.callbackTabItemChanged, this);
		this.toggleCashIn.node.on("toggle", this.callbackTabCardInChanged, this);
		this.toggleMomo.node.on("toggle", this.callbackTabMomoChanged, this);
		this.toggleIAP.node.on("toggle", this.callbackTabIAPChanged, this);
		this.toggleBank.node.on("toggle", this.callbackTabBankingChanged, this);
		this.toggleSMS.node.on("toggle", this.callbackTabSMSChanged, this);
		this.isInit = true;
	},

	show(statusShop) {
		this.status = statusShop;
		Global.onPopOn(this.node);
		// this.node.active = true;
		if (!this.isInit) this.initUI();

		if (CONFIG.VERSION === "2.0.0") {
			// this.setConfigStore(); //fix cung
		}
		cc.log("check status shop ", statusShop)
		switch (statusShop) {
			case 1:
				this.ClickTabIAP();
				this.btnTradeGold.uncheck();
				this.btnTradeDiamond.check();
				break;
			case 2:
				setTimeout(() => {
					this.btnTradeGold.check();
				this.btnTradeDiamond.uncheck();
				}, 50);
				this.ClickTabTradeGold();
				
				break;
		}

		//this.ClickChangeTab(null, this.status);
	},

	onEnable() {
		this.CheckStatusTab();
	},

	setConfigStore() {
		Global.GameConfig.FeatureConfig.CashInByMomoFeature = 2;
		Global.GameConfig.FeatureConfig.CashInBySmsFeature = 2;
		Global.GameConfig.FeatureConfig.CashInByCardFeature = 2;
		Global.GameConfig.FeatureConfig.CashInByBankFeature = 2;
		Global.GameConfig.FeatureConfig.CashInByIAPFeature = 1;
	},

	CheckStatusTab() {
		//show tab
		if (this.status == STATUS_SHOP.CARD_IN && Global.GameConfig.FeatureConfig.CashInByCardFeature == EFeatureStatus.Open) {
			// this.toggleCashIn.check();
			// this.ClickTabCardIn();
		} else if (this.status == STATUS_SHOP.MOMO && Global.GameConfig.FeatureConfig.CashInByMomoFeature == EFeatureStatus.Open) {
			this.toggleMomo.check();
			this.ClickTabMomo();
		} else if (this.status == STATUS_SHOP.IAP && Global.GameConfig.FeatureConfig.CashInByIAPFeature == EFeatureStatus.Open) {
			this.toggleIAP.check();
			this.ClickTabIAP();
		} else if (this.status == STATUS_SHOP.SMS && Global.GameConfig.FeatureConfig.CashInBySmsFeature == EFeatureStatus.Open) {
			this.toggleSMS.check();
			this.ClickTabSMS();
		} else if (this.status == STATUS_SHOP.BANKING && Global.GameConfig.FeatureConfig.CashInByBankFeature == EFeatureStatus.Open) {
			this.toggleBank.check();
			this.clickTabBanking();
		} else {
			if (Global.GameConfig.FeatureConfig.CashInByCardFeature == EFeatureStatus.Open) {
				// this.toggleCashIn.check();
				// this.ClickTabCardIn();
			} else if (Global.GameConfig.FeatureConfig.CashInByMomoFeature == EFeatureStatus.Open) {
				this.toggleMomo.check();
				this.ClickTabMomo();
			} else if (Global.GameConfig.FeatureConfig.CashInByIAPFeature == EFeatureStatus.Open) {
				this.toggleIAP.check();
				this.ClickTabIAP();
			} else if (Global.GameConfig.FeatureConfig.CashInBySmsFeature == EFeatureStatus.Open) {
				this.toggleSMS.check();
				this.ClickTabSMS();
			} else if (Global.GameConfig.FeatureConfig.CashInByBankFeature == EFeatureStatus.Open) {
				this.toggleBank.check();
				this.clickTabBanking();
			}
		}

		//(MainPlayerInfo.phoneNumber || cc.sys.os !== cc.sys.OS_ANDROID)
		// if (Global.GameConfig.FeatureConfig.CashInByCardFeature == EFeatureStatus.Open) {
		//     this.toggleCashIn.check();
		//     this.ClickTabCardIn();
		// } else if (Global.GameConfig.FeatureConfig.CashInByMomoFeature == EFeatureStatus.Open) {
		//     this.toggleMomo.check();
		//     this.ClickTabMomo();
		// } else if (Global.GameConfig.FeatureConfig.CashInByIAPFeature == EFeatureStatus.Open) {
		//     this.toggleIAP.check();
		//     this.ClickTabIAP();
		// }
		// else if (Global.GameConfig.FeatureConfig.CashInBySmsFeature == EFeatureStatus.Open) {
		//     this.toggleSMS.check();
		//     this.ClickTabSMS();
		// }
		// else if (Global.GameConfig.FeatureConfig.CashInByBankFeature == EFeatureStatus.Open) {
		//     this.toggleBank.check();
		//     this.clickTabBanking();
		// }
	},

	CheckActiveCashIn() {
		// if (Global.GameConfig.FeatureConfig.CashInByIAPFeature == EFeatureStatus.Open && !cc.sys.isBrowser) {
		//     this.btnIAP.node.active = true;
		//     this.statusCardIn = STATUS_CASH_IN.IAP;
		// } else {
		//     this.btnIAP.node.active = false;
		// }
		// if (Global.GameConfig.FeatureConfig.CashInByMomoFeature == EFeatureStatus.Open) {
		//     this.statusCardIn = STATUS_CASH_IN.MOMO;
		//     this.btnMomoIn.node.active = true;
		// } else {
		//     if (this.statusCardIn == STATUS_CASH_IN.MOMO)
		//         this.statusCardIn = STATUS_CASH_IN.IAP;
		//     this.btnMomoIn.node.active = false;
		// }
		// if (Global.GameConfig.FeatureConfig.CashInByCardFeature == EFeatureStatus.Open) {
		//     this.statusCardIn = STATUS_CASH_IN.CARD_IN;
		//     this.btnCardIn.node.active = true;
		// } else {
		//     if (this.statusCardIn == STATUS_CASH_IN.CARD)
		//         this.statusCardIn = STATUS_CASH_IN.IAP;
		//     this.btnCardIn.node.active = false;
		// }
		// if (this.statusCardIn == STATUS_CASH_IN.IAP) {
		//     this.btnIAP.isChecked = true;
		//     this.ClickTabIAP();
		// }
		// else if (Global.GameConfig.FeatureConfig.CashInByCardFeature == EFeatureStatus.Open) {
		//     this.btnCardIn.isChecked = true;
		//     this.ClickTabCardIn();
		// } else if (Global.GameConfig.FeatureConfig.CashInByMomoFeature == EFeatureStatus.Open) {
		//     this.btnMomoIn.isChecked = true;
		//     this.ClickTabCardIn();
		// }
	},

	showTabInputCard() {
		Global.onPopOn(this.nodeInputCard);
	},

	onClickMaskInputCard() {
		Global.onPopOff(this.nodeInputCard);
	},

	CheckActiveCashOut() {
		let state = 0;
		if (Global.GameConfig.FeatureConfig.CashOutByMomoFeature == EFeatureStatus.Open) {
			state = 0;
			this.btnMomoOut.node.active = true;
		} else {
			this.btnMomoOut.node.active = false;
		}
		if (Global.GameConfig.FeatureConfig.HistoryCashOutFeature == EFeatureStatus.Open) {
			state = 1;
			// this.btnHistoryOut.node.active = true;
		} else {
			// this.btnHistoryOut.node.active = false;
		}
		if (Global.GameConfig.FeatureConfig.CashOutByPieceFeature == EFeatureStatus.Open) {
			state = 2;
			this.btnPieceOut.node.active = true;
		} else {
			this.btnPieceOut.node.active = false;
		}

		if (Global.GameConfig.FeatureConfig.CashOutByCardFeature == EFeatureStatus.Open) {
			state = 3;
			this.btnCardOut.node.active = true;
		} else {
			this.btnCardOut.node.active = false;
		}
		if (state == 0) {
		} else if (state == 1) {
		} else if (state == 2) {
			this.btnPieceOut.check();
		} else if (state == 3) {
			this.btnCardOut.check();
		}
	},
	callbackTabCashOutChanged(toggle) {
		if (toggle.isChecked) {
			this.ClickTabCardOut();
		}
	},

	callbackTabSMSChanged(toggle) {
		if (toggle.isChecked) {
			this.ClickTabSMS();
		}
	},
	callbackTabBankingChanged(toggle) {
		if (toggle.isChecked) {
			this.clickTabBanking();
		}
	},
	callbackTabIAPChanged(toggle) {
		if (toggle.isChecked) {
			this.ClickTabIAP();
		}
	},
	callbackTabItemChanged(toggle) {
		if (toggle.isChecked) {
			this.ClickTabItem();
		}
	},
	callbackTabCardInChanged(toggle) {
		if (toggle.isChecked) {
			this.ClickTabCardIn();
		}
	},
	callbackTabMomoChanged(toggle) {
		if (toggle.isChecked) {
			this.ClickTabMomo();
		}
	},

	ClickTabIAP() {
		this.status = STATUS_SHOP.IAP;
		this.tabIAPContent.show();
		this.tabCashInContent.hide();
		this.tabMomoContent.hide();
		this.tabSMSContent.hide();
		this.tabBankingContent.hide();
		this.tabTradeGold.active = false;
	},
	ClickTabTradeGold() {
		cc.log("chay vao show redode")
		this.status = STATUS_SHOP.TRADE_GOLD;
		this.tabTradeGold.active = true;
		this.tabCashInContent.hide();
		this.tabMomoContent.hide();
		this.tabSMSContent.hide();
		this.tabBankingContent.hide();
		this.tabIAPContent.hide();
		this.UpdateItemConfig();
	},
	ClickTabSMS() {
		this.status = STATUS_SHOP.SMS;
		this.tabIAPContent.hide();
		this.tabCashInContent.hide();
		this.tabMomoContent.hide();
		this.tabSMSContent.show();
		this.tabBankingContent.hide();
	},
	clickTabBanking() {
		//tabBankingContent
		this.status = STATUS_SHOP.BANKING;
		this.tabIAPContent.hide();
		this.tabCashInContent.hide();
		this.tabMomoContent.hide();
		this.tabSMSContent.hide();
		this.tabBankingContent.show();
	},
	ClickTabItem() {
		this.status = STATUS_SHOP.ITEM;
		this.tabCashInContent.hide();
		this.tabMomoContent.hide();
		this.tabIAPContent.hide();
		this.tabSMSContent.hide();
		this.tabBankingContent.hide();
	},
	ClickTabCardIn() {
		this.status = STATUS_SHOP.CARD_IN;
		this.tabCashInContent.show();
		this.tabMomoContent.hide();
		this.tabIAPContent.hide();
		this.tabSMSContent.hide();
		this.tabBankingContent.hide();
	},

	ClickTabMomo() {
		this.status = STATUS_SHOP.MOMO;
		this.tabMomoContent.show();
		this.tabIAPContent.hide();
		this.tabCashInContent.hide();
		this.tabSMSContent.hide();
		this.tabBankingContent.hide();
	},

	ClickTabCardOut() {
		this.status = STATUS_SHOP.CARD_OUT;
		this.tabCashOutContent.show();
		this.tabIAPContent.hide();
		this.tabCashInContent.hide();
		this.tabMomoContent.hide();
		this.tabSMSContent.hide();
		this.tabBankingContent.hide();
	},

	ClickTabPieceOut() {
		this.cardOutObj.active = false;
		this.pieceOutObj.active = true;
		this.pieceOutObj.getComponent("ShopTabPiece").show();
	},
	OnClickNapDiamond() {
		this.ClickTabIAP();
	},
	OnClickTradeGold() {
		this.ClickTabTradeGold();
	},
	ClickTabCashCode() {
		// this.tabCashCode.getComponent("ShopTabCashCode").show();
	},

	ClickTabHistoryIn() {
		this.tabHistory.getComponent("ShopHistoryView").show(1);
	},
	ClickTabHistoryOut() {
		this.tabHistory.getComponent("ShopHistoryView").show(2);
	},

	UpdateMomoInfo(data) {
		//this.cardObj.getComponent("ShopTabCardIn").UpdateMomoInfo(name, phone, code);
		this.tabMomoContent.updateInfo(data);
	},
	GetInputPhoneMomo() { },

	UpdateItemConfig() {
		let data = Global.DataConfigShopDiamond;
		this.listItemDiamond.content.removeAllChildren();
		cc.log("check data diamad : ", data)
		for (let i = 0; i < data.length; i++) {
			const objData = data[i];
			let itemDiamond = null;
            if (i < this.listItemDiamond.content.children.length) {
                itemDiamond = this.listItemDiamond.children[i];
            }
            else {
                itemDiamond = cc.instantiate(this.itemDiamond)
            }
			itemDiamond.active = true;
			itemDiamond.getComponent("ShopItemView").SetupInfo(objData);
			this.listItemDiamond.content.addChild(itemDiamond);
		}
  },

	ClickChangeTab(event, index) {
		this.status = index;
		if (this.status == STATUS_SHOP.CARD_IN) {
			this.tabCashInObj.active = true;
			this.tabCashOutObj.active = false;
			// this.CheckActiveCashIn();
		} else if (this.status == STATUS_SHOP.CARD_OUT) {
			this.tabCashInObj.active = false;
			this.tabCashOutObj.active = true;
			this.ClickTabCardOut();
		}
	},

	SetUpListInfoPiece(listTelcoPiece, numbPiece) {
		this.pieceOutObj.getComponent("ShopTabPiece").SetUpListInfoPiece(listTelcoPiece, numbPiece);
	},

	UpdateListCashoutCode(lstCashout, percent) {
		// this.tabCashCode.getComponent("ShopTabCashCode").UpdateListCashoutCode(lstCashout, percent);
	},

	CheckSpace(content) {
		if (/\s/g.test(content) == true) {
			Global.UIManager.showCommandPopup(MyLocalization.GetText("PASS_WORD_SPACE"), null);
			return false;
		}
		return true;
	},

	GetNspNameByType(nspType) {
		if (nspType == NSP_TYPE.VIETTEL) return "Viettel";
		else if (nspType == NSP_TYPE.VINAPHONE) return "VinaPhone";
		else if (nspType == NSP_TYPE.MOBIFONE) return "MobiFone";
	},

	GetCardTypeByAmount(cardAmount) {
		let index = CARD_AMOUNT_VALUE.indexOf(cardAmount);
		if (index == -1) return 0;
		return index;
	},

	onShowIapItem(response) {
		this.tabIapObj.getComponent("ShopTabIAP").ShowItemIAP(response);
	},

	onClickClose() {
		Global.onPopOff(this.node);
	},

	OnIAPError() {
		Global.UIManager.hideMiniLoading();
	},

	OnIAPCancel() {
		Global.UIManager.hideMiniLoading();
	},

	onToggle(event, data) {
		let node = event.target.node;
		//cc.find("Lb" , node)
	},
	onDestroy() {
		Global.ShopPopup = null;
	},
});
