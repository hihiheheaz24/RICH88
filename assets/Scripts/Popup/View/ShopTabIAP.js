cc.Class({
    extends: cc.Component,

    properties: {
        listTextCost: [cc.Label],
        listTextValue: [cc.Label],
    },
    onLoad() {
        Global.ShopIAP = this;
        this.productIaps = null;
        this.productID = null;
        this.transId = "";
        this.systemProductId = 0;
    },
    start() {
        if (!cc.sys.isBrowser && cc.sys.os !== cc.sys.OS_OSX && typeof sdkbox !== "undefined") {
            console.log("chay vao init iap roi...");
            sdkbox.IAP.init();
            sdkbox.IAP.setListener({
                onSuccess: function (product) {
                    console.log("GGGG onSuccess 1 : ", product);
                    console.log("===> clikcbuy onSucees 1  : ", product.id);
                    Global.UIManager.showMiniLoading();
                    var data = {
                        ProductId: product.id,
                        Receipt: product.receipt,
                        TransactionId: Global.ShopIAP.transId,
                        PackageName: "com.tienlen.choibai.vplay",
                        PurchaseTime: "",
                        PurchaseState: "",
                        PurchaseToken: product.receiptCipheredPayload,
                        SystemProductId: Global.ShopIAP.systemProductId,
                    };
                    console.log("data send confirm iap : " + JSON.stringify(data));
                    require("BaseNetwork").request(Global.ConfigLogin.ConfirmIapOrder, data, Global.ShopIAP.ConfirmSuccess);
                    // Update User Gold ...
                },
                onFailure: function (product, msg) {
                    Global.UIManager.hideMiniLoading();
                    console.log("TTT onFailure : ", JSON.stringify(product) + " - " + msg);
                },
                onCanceled: function (product) {
                    //Purchase was canceled by user
                    Global.UIManager.hideMiniLoading();
                    console.log("TTT onCanceled : ", JSON.stringify(product));
                },
                onRestored: function (product) {
                    //Purchase restored
                    Global.UIManager.hideMiniLoading();
                    console.log("TTT onRestored : ", JSON.stringify(product));
                },
                onRestoreComplete: function (ok, msg) {
                    //Purchase onRestoreComplete
                    Global.UIManager.hideMiniLoading();
                    console.log("TTT onRestoreComplete : ", ok + "-" + msg);
                },
                onPurchaseHistory: function (data) {
                    Global.UIManager.hideMiniLoading();
                    console.log("TTT onPurchaseHistory : ", data);
                },
                onProductRequestSuccess: function (products) {
                    //Returns you the data for all the iap products
                    //You can get each item using following method
                    console.log("GGGG onProductRequestSuccess : ", JSON.stringify(products));
                    for (let index = 0; index < products.length; index++) {
                        console.log("GGGG item : ", JSON.stringify(products[index]));
                    }
                },
                onProductRequestFailure: function (msg) {
                    //When product refresh request fails.
                    console.log("LLL onProductRequestFailure : ", msg);
                    Global.UIManager.hideMiniLoading();
                },
            });
            sdkbox.IAP.refresh();
            sdkbox.IAP.getProducts();
            // let data = JSON.stringify(sdkbox_config_iap_id);
            // require("Util").onInitIAP(data);
        }
    },

    show() {
        cc.log("chay vao show ship iap ", Global.ConfigLogin.GetListProductIap);
        Global.UIManager.showMiniLoading();
        this.node.active = true;
        var data = {
            PackageName: "com.tienlen.choibai.vplay"
        };
        require("BaseNetwork").request(Global.ConfigLogin.GetListProductIap, data, function (response) {
            Global.ShopPopup.onShowIapItem(response);
        });
    },

    ShowItemIAP(response) {
        cc.log("check data shop iap : ", response);
        if (!response) return;

        Global.UIManager.hideMiniLoading();
        let dataJson = JSON.parse(response);
        cc.log(dataJson);
        if (dataJson.c != 0) {
            if (dataJson.m) Global.UIManager.showCommandPopup(MyLocalization.GetText(dataJson.m));
            else Global.UIManager.showCommandPopup("Không có dữ liệu");
        } else {
            this.productIaps = dataJson.d;
            if (this.productIaps == null || this.productIaps.length == 0) {
                Global.ShopPopup.onClickClose();
                return;
            }
            for (let i = 0; i < this.listTextValue.length; i++) {
                if (!this.productIaps[i]) {
                    this.listTextValue[i].node.getParent().active = false;
                    continue;
                }
                if (cc.sys.OS_ANDROID) {
                    this.listTextCost[i].string = Global.formatNumber(this.productIaps[i].UsdCost) + " USD";
                } else {
                    this.listTextCost[i].string = Global.formatNumber(this.productIaps[i].VndCost) + " VND";
                }
                this.listTextValue[i].string = "+" + Global.formatNumber(this.productIaps[i].DiamondReward);
                // if (this.productIaps[i].DiamondReward === 0) this.listTextValue[i].string = "+" + Global.formatNumber(this.productIaps[i].GoldReward);
            }
        }
    },

    onClickBuyItem(event, index) {
        Global.UIManager.showMiniLoading();
        this.productID = this.productIaps[index].ProductId;
        this.systemProductId = this.productIaps[index].SystemProductId;
        var data = {
            ProductId: this.productID,
            SystemProductId: this.systemProductId,
        };
        console.log("===> clikcbuy index iap  : ", data);
        require("BaseNetwork").request(Global.ConfigLogin.CreateIapOrder, data, this.BuyItemSuccess);
    },

    BuyItemSuccess(response) {
        let dataJson = JSON.parse(response);
        console.log("===> clikcbuy server respone buy  : ", JSON.stringify(dataJson));
        // Global.UIManager.hideMiniLoading();
        if (dataJson.c != -1) {
            Global.ShopIAP.transId = dataJson.d.TransId;
            if (Global.UIManager) {
                if (dataJson.d.MessageFail) {
                    Global.UIManager.showCommandPopup(dataJson.d.MessageFail);
                } else {
                    if (!cc.sys.isBrowser && Global.ShopIAP.productID !== null) {
                        console.log("===> clikcbuy sdkbox purchase  : ", Global.ShopIAP.productID);
                        //
                        Global.UIManager.hideMiniLoading();
                        switch (cc.sys.os) {
                            case cc.sys.OS_ANDROID:
                                require("Util").onBuyIap(Global.ShopIAP.productID);
                                break;
                            case cc.sys.OS_IOS:
                                sdkbox.IAP.purchase(Global.ShopIAP.productID);
                                break;
                        }
                    } else {
                        console.log("product id null : " + Global.ShopIAP.productID);
                    }
                }
            }
        }
    },

    ConfirmSuccess(response) {
        //data tra ve thanh cong :
        //{"c":0,"m":"SUCCESS","d":{"ResponseCode":1,"GoldAdd":1000,"ItemName":null,
        //"NewBalance":0,"ClientVersion":null,"Language":null,"OsType":0,"DeviceId":null,"MerchantId":0,"ClientIp":null,"UtcTime":null,"SecretKey":null,"Cookie":null}}
        let dataJson = JSON.parse(response);
        console.log("======> data tra ve thanh cong : ", response);
        Global.UIManager.hideMiniLoading();
        if (dataJson.c >= 0) {
            let dataSuccess = dataJson.d;
            if (dataSuccess.ResponseCode == 1) {
                // Mua thành công,sv tự cộng tiền
                //var messSuccess = string.Format("Mua thành công gói [{0}], bạn được cộng {1} vàng", dataSuccess.ItemName, dataSuccess.GoldAdd);

                //MiniGameManager.Instance.ShowCommandPopup(MyLocalization.GetText(messSuccess));
                if (dataSuccess.GoldAdd > 0) Global.UIManager.showCommandPopup("Giao dịch thành công. Bạn nhận được " + Global.formatNumber(dataSuccess.GoldAdd) + " Chip");
                else Global.UIManager.showCommandPopup("Giao dịch thành công. Bạn nhận được " + Global.formatNumber(dataSuccess.DiamondAdd) + " Kim cương");
            } else {
                var messFail = Global.formatString(MyLocalization.GetText("IAP_BILLING_FAIL"), [dataSuccess.ItemName]);
                Global.UIManager.showCommandPopup(MyLocalization.GetText(messFail));
            }
        } else {
            Global.UIManager.showCommandPopup(MyLocalization.GetText(data.m));
        }
    },

    hide() {
        this.node.active = false;
    },
});
