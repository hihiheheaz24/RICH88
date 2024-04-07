

cc.Class({
    extends: cc.Component,
    ctor() {
        this.listVipInfo = [];
    },

    properties: {
        description: cc.Label,
        requireTopup: cc.Label,


        iconVip : [cc.Sprite],
        imgActive : [cc.SpriteFrame],
      //  imgUnActive : [cc.SpriteFrame],


       // parentLabel:cc.Node,
       lbRequirePoint :cc.Label,
       lbCurrentVip:cc.Label,
       lbCurrentVipPoint:cc.Label,
       lbTotalVip:cc.Label,
       lbVipConLai:cc.Label,

        iconVipSp:cc.Sprite


        
    },

    start() {

    },

    show() {
        this.node.active = true;
        require("SendRequest").getIns().MST_Client_Get_Vip_Config_Info();
        let material =  cc.Material.getBuiltinMaterial("2d-gray-sprite");
        for(let i = 0; i < 10; i++) {
            if(i < MainPlayerInfo.vipLevel) {
               
            } else {
                this.iconVip[i].setMaterial(0 , material);
            }
            
        }
        
        this.iconVipSp.spriteFrame = this.imgActive[MainPlayerInfo.vipLevel];
    },

    GetVipInfo(listVipInfo, des, dq) {
        this.listVipInfo = listVipInfo;
        this.OnShowVipContent(null, 0);
    },
    OnShowVipContent(event, index) {
        if(index < MainPlayerInfo.vipLevel )index = MainPlayerInfo.vipLevel;
        if (this.listVipInfo != null && this.listVipInfo.length > index) {
            this.description.string = this.listVipInfo[index].Description;
          //  this.lbRequirePoint.string = "Bạn cần nạp thêm " + 
            let vipNext = parseInt(index) + 1;

          this.lbCurrentVip.string = MainPlayerInfo.vipLevel  + "->" +vipNext;
          this.lbTotalVip.string = Global.formatNumber(this.listVipInfo[index].RequireTopup);

          let vipConLai = this.listVipInfo[index].RequireTopup - MainPlayerInfo.vipPoint;
          if(vipConLai < 0) vipConLai = 0;
          this.lbVipConLai.string = Global.formatNumber(vipConLai) ;
          this.lbCurrentVipPoint.string = Global.formatNumber (MainPlayerInfo.vipPoint) ;
        this.lbRequirePoint.string = Global.formatMoney(this.listVipInfo[index].RequireTopup) + " Xu";
           

            
        } else {
            this.lbCurrentVip.string = MainPlayerInfo.vipLevel ;
          this.lbTotalVip.string = Global.formatNumber(this.listVipInfo[index].RequireTopup);
          this.lbVipConLai.string ="0";
          this.lbCurrentVipPoint.string = Global.formatNumber (MainPlayerInfo.vipPoint) ;
        this.lbRequirePoint.string =   "0 Xu";
        }
    },

    ClickButtonShop() {
        this.Hide();
        Global.UIManager.showShopPopup(STATUS_SHOP.CARD_IN);
    },

    Hide() {
        this.node.active = false;
    },

    onDestroy() {
        Global.VipInfoPopup = null;
    },

});
