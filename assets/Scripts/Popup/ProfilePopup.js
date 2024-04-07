cc.Class({
    extends:  require("ParentChangePositionEDB"),

    properties: {
        tabChangePass: cc.Node,
        tabInfo : cc.Node,
        textName: cc.Label,
        textMoney: cc.Label,
        textMobile: cc.Label,
        textId: cc.Label,
        tetxDiamond: cc.Label,
        // textVip: cc.Label,
        passOldIF: cc.EditBox,
        passNewIF: cc.EditBox,
        passNewAgainIF: cc.EditBox,
        avata: cc.Sprite,
        // boxRegisterMobile: cc.Node,
        mobileIF: cc.EditBox,
        nodeSms:cc.Node,
        lbInfoSms:cc.RichText,
        btnKichHoatSdt:cc.Node,
        btnReSend: cc.Button,
        nodeInputOtp: cc.Node,
        nodeInputPhoneNumber: cc.Node,
        edbOtp: cc.EditBox,
        nodeMobile : cc.Node,
        lbTimeCDReSend: cc.Label,
        lbPin: cc.Label,
        borderAvatar: cc.Node,
        listTicket : cc.ScrollView,
        itemTicket : cc.Node,

        btnLogOut: cc.Button,
        toggleChangePass : cc.Toggle,

        lbTotalPlayed : cc.Label,
        lbPercenWinRate : cc.Label,
        lbStarLevel : cc.Label,
        listStarLevel : [cc.SpriteFrame],
        starLevel : cc.Sprite,

        listStar : [cc.Node],
        achivementList: cc.ScrollView,
        itemAchivement : cc.Node,
        listTypeAchivment : [cc.SpriteFrame],
        lbLeagueLevel : cc.Label,
        lbLeaguePoint : cc.Label,
        iconLeague : cc.Sprite,
        listIconLeague : [cc.SpriteFrame],
        listSprStar : [cc.SpriteFrame]
    },

    onLoad(){
        Global.ProfilePopup = this;
        this.dataVerify = null;

        if(cc.sys.isBrowser) {
			var url = new URL(window.location.href);
			var AccessToken = url.searchParams.get("accesstoken");
			if (AccessToken) {
				this.btnLogOut.node.active = false;
                this.toggleChangePass.node.active = false;
			}
			else{
				this.btnLogOut.node.active = true;
                this.toggleChangePass.node.active = true;
			}
		}
		else{
			this.btnLogOut.node.active = true;
            this.toggleChangePass.node.active = true;
		}
    },

    start() {
        this.resignEdb(this.passOldIF);
        this.resignEdb(this.passNewIF);
        this.resignEdb(this.passNewAgainIF);

        this.nodeInputOtp.active= false;
        this.otpCode = 0;

        this.resignNext(this.passOldIF , "passNewIF");
        this.resignNext(this.passNewIF , "passNewAgainIF");
    },

    show(idPlayer) {
        Global.onPopOn(this.node);
        this.ShowTabProfile();
        // this.SetInfoProfile();
        let id = null
        if(idPlayer){
            id = idPlayer;
        }
        else{
            id = MainPlayerInfo.accountId
        }
        let msg = {};
        msg[1] = id;
        require("SendRequest").getIns().MST_Client_Get_Other_Player_Info(msg)
    },
    onClickShowTicket(){
        require("SendRequest").getIns().MST_Client_Get_Acount_Ticket();
	},
    
    onPasswordChanged() {
        this.ShowTabChangePass();
        
    },

    handleDataInfoPlayer(data) {
        let dataPlayer = JSON.parse(data[1]);
        this.textName.string = dataPlayer.NickName;
        Global.GetAvataById(this.avata, dataPlayer.AccountId)
       
        this.textId.string = dataPlayer.AccountId
        this.btnLogOut.node.active = false;
        if(Global.GameView){
            this.node.getChildByName("background").scale = cc.v2(0.7,0.7);
        }
        else{
            this.node.getChildByName("background").scale = cc.v2(1,1);
        }
        cc.log("check id play : ", dataPlayer.AccountId)
        cc.log("check id play : ", MainPlayerInfo.accountId)
        if (dataPlayer.AccountId !== MainPlayerInfo.accountId) {
            this.tetxDiamond.node.parent.active = false;
            this.textMoney.node.active = false;

            let player = Global.GameView.getPlayerWithId(dataPlayer.AccountId);
            cc.log("check data  league : ", player)
            if (player) {

                this.textMoney.node.active = true;
                this.textMoney.string = Global.formatNumber(player.gold);
            }
            this.btnLogOut.node.active = false;
            cc.log("check data  league : ", dataPlayer.LeagueInfo)
            if (dataPlayer.LeagueInfo) {
                this.iconLeague.node.parent.active = true;
                if (dataPlayer.LeagueInfo.rank) {
                    this.lbLeagueLevel.node.active = true;
                    this.lbLeagueLevel.string = "Hạng: " + dataPlayer.LeagueInfo.rank;
                }
                else {
                    this.lbLeagueLevel.node.active = false;
                }

                this.lbLeaguePoint.string = "Điểm: " + dataPlayer.LeagueInfo.Point;
                this.iconLeague.spriteFrame = this.listIconLeague[dataPlayer.LeagueInfo.LeagueLevel - 1];
            }
            else{
                this.iconLeague.node.parent.active = false;
            }
        }
        else{
            this.tetxDiamond.node.parent.active = true;
            this.textMoney.node.active = true;
            this.tetxDiamond.string = Global.formatNumber(MainPlayerInfo.diamondBalance);
            this.textMoney.string = Global.formatNumber(MainPlayerInfo.ingameBalance);
            this.btnLogOut.node.active = true;
            if(Global.LeagueLInfo){
                this.iconLeague.node.parent.active = true;
                if(Global.LeagueLInfo.rank){
                    this.lbLeagueLevel.node.active = true;
                    this.lbLeagueLevel.string = "Hạng: " + Global.LeagueLInfo.rank;
                }    
                else{
                    this.lbLeagueLevel.node.active = false;
                }
                this.lbLeaguePoint.string = "Điểm: " + Global.LeagueLInfo.Point;
                this.iconLeague.spriteFrame = this.listIconLeague[Global.LeagueLInfo.LeagueLevel - 1];
            }
            else{
                this.iconLeague.node.parent.active = false;
            }
        } 

        let dataStatic = dataPlayer.StatiticList[0];
        if(dataStatic){
            let percentWin = ((dataStatic.WinMatch / dataStatic.PlayMatch) * 100).toFixed(0);
            if (!percentWin) percentWin = 0;
            this.lbTotalPlayed.string = "Số trận: " + dataStatic.PlayMatch;
            this.lbPercenWinRate.string = "Tỉ lệ thắng: " + percentWin + " %";
        }
      
        this.achivementList.content.removeAllChildren();

        // TOP_EVENT_SAN_HEO = 1,
        // TOP_BXH_GAME_TUAN = 2,
        // TOP_BXH_GAME_THANG = 3,
        // TOTAL_SAN_HEO = 4,
        // PLAY_MATCH = 5,
        // MAN_KILLER = 6,
        // SERIAL_WIN = 7,
        // VIP_DONG = 8,
        // VIP_BAC = 9,
        // VIP_VANG = 10,
        // VIP_KIM_CUONG = 11

        for (let i = 0; i < dataPlayer.AchievementList.length; i++) {
            const dataAchivement = dataPlayer.AchievementList[i];
            if (!this.listTypeAchivment[dataAchivement.AchievementId - 1]) continue;
            let item = null;
            if (i < this.achivementList.content.children.length) {
                item = this.achivementList.content.children[i];
            }
            else {
                item = cc.instantiate(this.itemAchivement)
            }
            // item.getChildByName("lbDes").getComponent(cc.Label).string = dataAchivement.Name;
            item.active = true;
            item.getChildByName("lbNumber").getComponent(cc.Label).string = dataAchivement.Number;
            item.getComponent(cc.Sprite).spriteFrame = this.listTypeAchivment[dataAchivement.AchievementId - 1];
            this.achivementList.content.addChild(item)
        }

        //define 1 -> top 1 TLMN : 4 -> TOP 1 SAN HEO : 5 -> TOP 1 SAN HEO THANG
        this.listStar.forEach(iconStar => {
            iconStar.active = false ;
        });

        if(dataPlayer.StarLevel > 3) dataPlayer.StarLevel  = 3;
        for (let i = 0; i < dataPlayer.StarLevel; i++) {
            const iconStar = this.listStar[i];
            iconStar.active = true;
            if(dataPlayer.Level > 0)
                iconStar.getComponent(cc.Sprite).spriteFrame = this.listSprStar[dataPlayer.Level - 1]
        }

       
        this.starLevel.node.parent.active = true;
        this.starLevel.spriteFrame = this.listStarLevel[dataPlayer.Level];

        let text = ""
        switch (dataPlayer.Level) {
            case 0:
                this.starLevel.node.parent.active = false;
                break;
            case 1:
                text = "SAO BIỂN"
                break;
            case 2:
                text = "CÁ KIẾM"
                break;
            case 3:
                text = "TÔM"
                break;
            case 4:
                text = "CUA"
                break;
            case 5:
                text = "BẠCH TUỘC"
                break;
            case 6:
                text = "CÁ VOI"
                break;
            case 7:
                text = "CÁ MẬP"
                break;
        }
        this.lbStarLevel.string = text;
    },

    SetInfoProfile() {
        return
        this.textName.string = MainPlayerInfo.nickName;
        if(MainPlayerInfo.pinCode !== "")
            this.lbPin.string = MainPlayerInfo.pinCode;
        else
            this.lbPin.string = "...";
        
        Global.GetAvataById(this.avata, MainPlayerInfo.accountId)
        this.textMoney.string = Global.formatNumber(MainPlayerInfo.ingameBalance);
        this.textId.string = MainPlayerInfo.accountId.toString();
        this.tetxDiamond.string = MainPlayerInfo.diamondBalance;
        // this.textVip.string = MainPlayerInfo.vipLevel.toString();
        this.textMobile.string = MainPlayerInfo.phoneNumber;
        this.btnReSend.node.active = false;
        // if(MainPlayerInfo.phoneNumber){
        //     // Global.UIManager.showCommandPopup("Bạn đã xác thực SĐT")
        //     this.btnKichHoatSdt.active = false;
        //     this.nodeInputPhoneNumber.active = false;
        //     this.nodeMobile.active = true;
        //     cc.Tween.stopAllByTarget(this.borderAvatar);
        //     this.borderAvatar.opacity = 255;
        // }else{
        //     this.btnKichHoatSdt.active = true;
        //     this.nodeInputPhoneNumber.active = true;
        //     this.nodeMobile.active = false;
        //     cc.Tween.stopAllByTarget(this.borderAvatar);
        //     cc.tween(this.borderAvatar)
        //     .to(0.5 , {opacity:0})
        //     .to(0.5 , {opacity:255})
        //     .union()
        //     .repeatForever()
        //     .start()
        // }
        this.nodeInputOtp.active= false;
        this.mobileIF.string ="";
        this.edbOtp.string ="";
    },

    UpdateInfoVip(listVipInfo) {
        // if (MainPlayerInfo.vipLevel == listVipInfo.length) {
            // this.desVip.string = MyLocalization.GetText("FULL_VIP");
            // this.progressVip.width = 400;
        // } else {
            // let vipInfo = listVipInfo[MainPlayerInfo.vipLevel];
            // this.progressVip.width = (MainPlayerInfo.vipPoint / vipInfo.RequireTopup) * 400;
            // this.desVip.string = Global.formatString(MyLocalization.GetText("CASH_IN_VIP"), [Global.formatNumber(vipInfo.RequireTopup - MainPlayerInfo.vipPoint), vipInfo.VipId]);
        // }
    },

    ShowTabProfile() {
        // this.tabChangePass.active = false;
        // this.tabInfo.active = true;
        this.ClearIF();
    },

    ShowTabChangePass() {
        // this.tabChangePass.active = true;
        // this.tabInfo.active = false;
        this.ClearIF();
    },
    ClickShowVip() {
        this.Hide();
        Global.UIManager.showVipInfoPopup();
    },
    setTypeVeryPhone(packet){

        let number = this.mobileIF.string;
        if (number == "") {
            Global.UIManager.showCommandPopup(MyLocalization.GetText("IF_MOBILE_NULL"));
            return;
        }
        if (number[0] != "0") {
            Global.UIManager.showCommandPopup(MyLocalization.GetText("VALIBLE_SDT"));
            return;
        }

        let type = packet[1];
        this.numberSms = packet[3];
        this.infoSms = packet[2];

        // {"1":-1,"2":"Số điện thoại đã dùng cho tài khoản khác","3":"","200":49}}
        switch (type) {
            case -1:
                Global.UIManager.showNoti(packet[2]);
                break;
            case 1:
                this.ClickRegisPhone();
                break;
            case 2:
               
                let str = `<color=#00FF0A>${this.infoSms}</color> gửi <color=#00FF0A>${this.numberSms}</color> (1000đ/Sms)`
                Global.onPopOn(this.nodeSms);
                this.lbInfoSms.string = str;
                break;
        }

    },
    ClickCloseDoiMatKhau(){
        this.tabChangePass.active= false;
    },

    SendRegisPhone(number) {
        let msgData = {};
        msgData[1] = number;
        require("SendRequest").getIns().MST_Client_Update_PhoneNumber(msgData);
    },

    CheckShowMobile(isShowRegis) {
        //this.boxRegisterMobile.active = isShowRegis;
    },

    ClickConfirmChangePass() {
        if (this.CheckPassword(this.passOldIF.string) && this.SoSanhPassword(this.passNewIF.string, this.passNewAgainIF.string)) {
            this.SendRequestChangePass(this.passOldIF.string, this.passNewIF.string, this.passNewAgainIF.string);
        }
    },

    SendRequestChangePass(oldPass, newPass, newPassAgain) {
        if (this.CheckPassword(newPass) && this.SoSanhPassword(newPass, newPassAgain)) {
            let msgData = {};
            msgData[1] = oldPass;
            msgData[2] = newPass;
            require("SendRequest").getIns().MST_Client_Change_Password(msgData);
            this.ClearIF();
        }
    },

    CheckPassword(pass) {
        if (pass.length < 6) {
            Global.UIManager.showCommandPopup(MyLocalization.GetText("PASS_WORD_MIN_6"), null);
            return;
        }
        if (/^[a-zA-Z0-9]*$/.test(pass) == false) {
            Global.UIManager.showCommandPopup(MyLocalization.GetText("PASS_WORD_SPECIAL"), null);
            return;
        }
        if (/\s/g.test(pass) == true) {
            Global.UIManager.showCommandPopup(MyLocalization.GetText("PASS_WORD_SPACE"), null);
            return;
        }
        return true;
    },

    SoSanhPassword(pass1, pass2) {
        if (pass1 != pass2) {
            Global.UIManager.showCommandPopup(MyLocalization.GetText("PASS_WORD_NOT_SAME"));
            return false;
        }
        else
            return true;
    },

    ClearIF() {
        this.passOldIF.string = "";
        this.passNewIF.string = "";
        this.passNewAgainIF.string = "";
    },

    Hide() {
        actionEffectClose(this.node , ()=>{
            this.node.active = false;
        })
        // cc.Tween.stopAllByTarget(this.borderAvatar);
        // this.borderAvatar.opacity = 255;
    },
    HideSms() {
        actionEffectClose(this.nodeSms , ()=>{
            this.nodeSms.active = false;
        })
    },
    onDestroy() {
        Global.ProfilePopup = null;
    },
    onClickSendSms(){
        if (cc.sys.isMobile) {
            let url = "sms:" + this.numberSms + "?body=" + encodeURI(this.infoSms);
            if(cc.sys.os == cc.sys.OS_IOS){
                 url = "sms:" + this.numberSms + "&body=" + encodeURI(this.infoSms);
            }
            cc.sys.openURL(url);
        } else {
            this.nodeSms.active = false;
        }
    },
    ClickDangXuat() {
		this.node.active = false;
		if (Global.LobbyView) {
			if (Global.NetworkManager._connect.connectionState !== "Connected") {
				Global.LobbyView.BackEvent();
			} else {
				Global.UIManager.showConfirmPopup(MyLocalization.GetText("QUIT_GAME"), Global.LobbyView.BackEvent, null);
			}
		} else {
			Global.CookieValue = null;
			Global.isLogin = false;
			require("ScreenManager").getIns().LoadScene(SCREEN_CODE.LOGIN);
		}
	},
    responsePhone(packet) {
        console.log("data xac thuc la : ", JSON.stringify(packet));
        Global.UIManager.hideMiniLoading();
        let number = packet[1];
        let money = packet[2];
        let pinCode = packet[4];

        this.lbPin.string = pinCode;
        MainPlayerInfo.pinCode = pinCode
        console.log("pin la : ", pinCode);

        this.dataVerify = packet;
        // Global.UIManager.showCommandPopup("Mã PIN code của bạn là: " + pinCode + "\n Hãy lưu mã PIN code lại để sử dụng khi đủ điều kiện rút tiền", this.receiveBonusVerify.bind(this));
        this.nodeInputOtp.active = false;
        this.nodeInputPhoneNumber.active = false;
        this.nodeMobile.active = true;
        this.textMobile.string = number;
        MainPlayerInfo.setMoneyUser(money);
        MainPlayerInfo.phoneNumber = number;
        this.SetInfoProfile();
        
        // cc.Tween.stopAllByTarget(Global.LobbyView.borderAvatar);
        // Global.LobbyView.borderAvatar.opacity = 255;
    },

    receiveBonusVerify(packet){
        console.log("list phan luong: " + this.dataVerify[3]);
        if(!this.dataVerify) return;
        if (this.dataVerify[3] && this.dataVerify[3] != "") {
            try {
                let listPhanThuong = JSON.parse(this.dataVerify[3]);
                if (listPhanThuong && listPhanThuong.length > 0) {
                    if (Global.ShowRewardPopup == null) {
                        cc.resources.load("Popup/ShowRewardPopup", cc.Prefab, (err, prefab) => {
                            let item = cc.instantiate(prefab).getComponent("ShowRewardPopup");
                            Global.ShowRewardPopup = item;
                            Global.UIManager.parentPopup.addChild(item.node);
                            item.active = false;
                            item.showRewardKichHoat(listPhanThuong);
                        })
                    } else {
                        Global.ShowRewardPopup.showRewardKichHoat(listPhanThuong);
                    }
                } else {
                    Global.UIManager.showCommandPopup(MyLocalization.GetText("SUCCESS"));
                }


            } catch (e) {
                Global.UIManager.showCommandPopup(MyLocalization.GetText("SUCCESS"));
            }

        } else {
            Global.UIManager.showCommandPopup(MyLocalization.GetText("SUCCESS"));
        }
    },

    clickGetTypeVerify() {

        // let msgData = {};
        // msgData[1] = "0122465789";
        // msgData[2] = 123456;
        // require("SendRequest").getIns().MST_Client_Update_PhoneNumber(msgData);
        // cc.log("nhay vao click nay" + MainPlayerInfo.phoneNumber)
        // if(MainPlayerInfo.phoneNumber) return;
        
        if(MainPlayerInfo.phoneNumber){
            Global.UIManager.showCommandPopup("Bạn đã xác thực SĐT")
        }else{
            let msg = {};
            msg[1] = this.mobileIF.string;
            cc.log("send checl phone : ", msg);
            require("SendRequest").getIns().MST_Client_Get_Type_Very(msg);
        }
      
 
    },

    onVeryPhoneSuccess(params){
        params = params.replace("+84" , 0);
        let otpSave = parseInt(cc.sys.localStorage.getItem("otp"));
        if(this.otpCode === 0){
           if(otpSave){
               this.otpCode = otpSave;
           }
           else{
                this.otpCode = 536376;
           }
        }
        let msgData = {};
        msgData[1] = params;
        msgData[2] = this.otpCode;
       
        console.log("send verify phone to server accept : ", msgData)
        require("SendRequest").getIns().MST_Client_Update_PhoneNumber(msgData);
    },

    handleDataTicket(data){
        cc.log("chan vl ", data)
        this.listTicket.content.removeAllChildren();
        for (let i = 0; i < data[1].length; i++) {
            const objData = JSON.parse(data[1][i]);
            cc.log("data jsomn la : ", objData)
            let item = null;
			if (i < this.listTicket.content.children.length) {
				item = this.listTicket.content.children[i].getComponent("ItemTicket");
			}
			else {
				item = cc.instantiate(this.itemTicket).getComponent("ItemTicket")
            }
            item.node.active = true;
            item.init(objData);
            this.listTicket.content.addChild(item.node);
            
        }
    },

    onClickSendOTP(){
        let number = this.edbOtp.string;
        if (number == "") {
            Global.UIManager.showCommandPopup(MyLocalization.GetText("IF_OTP_NULL"));
            return;
        }
        // this.nodeInputOtp.active= false;
        this.otpCode = number;
        cc.sys.localStorage.setItem("otp" , number)
        require("Util").onVeryOTP(number);
        console.log("send phone to firebase")
        Global.UIManager.showMiniLoading();
    },

    onClickReSendOTP(){
        this.cDResendOTP();
        if(cc.sys.os == cc.sys.OS_IOS){
            this.ClickRegisPhone();
        }else{
            require("Util").onReSendOTP();
        }
        
    },

    onVeryPhoneFail(){
        this.nodeInputOtp.active= false;
        this.btnKichHoatSdt.active = true;
        this.btnReSend.node.active = false;
        this.mobileIF.string = "";
        Global.UIManager.showCommandPopup(MyLocalization.GetText("FAIL_VERY_PHONE"));
        Global.UIManager.hideMiniLoading();
    },

    onReviceOTP(){
        Global.UIManager.hideMiniLoading();
        this.nodeInputOtp.active= true;
        this.edbOtp.string = "";
        console.log("nhan dc otp cho firebase xac thuc")
    //    this.cDResendOTP();
    },

    cDResendOTP(){
        this.btnReSend.node.active = true;
        this.btnReSend.interactable = false;
        this.lbTimeCDReSend.node.parent.active = true;
        let time = 60;
        this.unschedule(this.funCdReSend);
        this.lbTimeCDReSend.string = time;
        this.schedule(this.funCdReSend = ()=>{
            time--;
            this.lbTimeCDReSend.string = time;
            if(time < 1) {
                this.lbTimeCDReSend.node.parent.active = false;
                this.btnReSend.interactable = true;
            }
        },1)
    },

    ClickRegisPhone() {
        if(cc.sys.isBrowser){
            Global.UIManager.showCommandPopup(MyLocalization.GetText("Tính năng không khả dụng trên trình duyệt"));
            return;
        }
        
        this.btnKichHoatSdt.active = false;
        this.cDResendOTP();
        number = number.replace("0" , "+84")
        Global.UIManager.showMiniLoading();
        require("Util").onVeryPhone(number);
    },

    onEdbTextChange(){
        this.btnKichHoatSdt.active = true;
        this.btnReSend.node.active = false;
        this.nodeInputOtp.active = false;
        this.edbOtp.string = "";
    },

    LogOut() {
        //Global.AudioManager.ClickButton();
        if (Global.NetworkManager._connect.connectionState !== "Connected") {
            Global.CookieValue = null;
            Global.isLogin = false;
            require("ScreenManager").getIns().LoadScene(SCREEN_CODE.LOGIN);
        } else {
            Global.UIManager.showConfirmPopup(MyLocalization.GetText("QUIT_GAME"), () => {
                Global.CookieValue = null;
                Global.isLogin = false;
                require("ScreenManager").getIns().LoadScene(SCREEN_CODE.LOGIN);
            }, null);
        }
    },

    onClickShowPassOld(event , data){
        if(event.isChecked)
            this.passOldIF.inputFlag = 5;
        else
            this.passOldIF.inputFlag = 0;
    },
    onClickShowPassNew(event , data){
        if(event.isChecked)
            this.passNewIF.inputFlag = 5;
        else
            this.passNewIF.inputFlag = 0;
    },
    onClickShowPassReNew(event , data){
        if(event.isChecked)
            this.passNewAgainIF.inputFlag = 5;
        else
            this.passNewAgainIF.inputFlag = 0;
    },

});
