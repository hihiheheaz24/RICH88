window.MainPlayerInfo = {
	accountId: null,
	userName: null,
	nickName: null,
	vipLevel: 0,
	ingameBalance: 0,
	diamondBalance: 0,
	phoneNumber: null,
	vipPoint: 0,
	timeCountTx: -1,
	listMail: null,
	numbetMailNotRead: 0,
	CurrentGameCode: null,
	CurrentGameType: 1,
	CurrentGameId: null,
	CurrentBlind: 0,
	CurrentTableId: 0,
	listMoney:[],
	isReconnect:false,
	listCacheGun:[],

	SetUpInfo(userProperties) {
		this.accountId = userProperties.AccountId;
		this.userName = userProperties.UserName;
		this.nickName = userProperties.NickName;
		cc.log("check tien : ", userProperties.IngameBalance)
		this.ingameBalance = userProperties.IngameBalance;
		this.diamondBalance = userProperties.Diamond;
		this.phoneNumber = userProperties.PhoneNumber;
		this.vipLevel = userProperties.VipLevel;
		this.vipPoint = userProperties.VipPoint;
		this.pinCode = userProperties.PinCode;
		this.IsEnteredRefCode = userProperties.IsEnteredRefCode;

		require("Util").onSendTrackingSetUserID(userProperties.AccountId);
		Global.UIManager.emitNewData();
	},
	
	setMoneyUser(money){
		cc.log("money uesr la " + money);
		this.ingameBalance = money;
		Global.MoneyUser.emitNewMonney();
		Global.LobbyView.UpdateInfoView(money);
	},

	SetUpMail(listMail, numbetMailNotRead) {
		if (Global.GameConfig.FeatureConfig.MailFeature != EFeatureStatus.Open) {
			this.listMail = [];
			return;
		}
		this.listMail = listMail;
		this.numbetMailNotRead = numbetMailNotRead;
	},

	UpdateNewMail(mail) {
		if (Global.GameConfig.FeatureConfig.MailFeature != EFeatureStatus.Open) {
			this.listMail = [];
			return;
		}
		let newListMail = [];//new MailObject[listMail.Length + 1];
		newListMail[0] = mail;
		for (let i = this.listMail.length; i > 0; i--) {
			newListMail[i] = this.listMail[i - 1];
		}
		this.listMail = newListMail;
		this.numbetMailNotRead += 1;
	},

	SetUpDiamond(diamondBalance) {
		// Nếu chưa cập nhật diamond thì viết thêm hàm ở đây
		this.diamondBalance = diamondBalance;
	},

	SetupMoney(inGameBalance) {
		this.ingameBalance = inGameBalance;
	},

	SetVip(vipLevel) {
		this.vipLevel = vipLevel;
	},

	SetVipPoint(vipPoint) {
		this.vipPoint = vipPoint;
	},
	checkCardOut(goldCose){
		if(MyLocalization.ingameBalance < goldCose){
			Global.UIManager.showCommandPopup(MyLocalization.GetText("NO_MONEY_CARD_OUT"))
			return false;
		}

		if(MyLocalization.ingameBalance < goldCose + 50000){
			Global.UIManager.showCommandPopup(MyLocalization.GetText("CASH_OUT_REMAIN_MONEY_ERROR"))
			return false;
		}

		let phone = MainPlayerInfo.phoneNumber;
		if(phone == null || phone == "" ){

			Global.UIManager.showCommandPopup(MyLocalization.GetText("NEED_UPDATE_PHONE") ,
			 ()=>{
				if(Global.CashOut) Global.CashOut.hide();
				Global.UIManager.showProfilePopup();
			 }
			 );  
			return false
		}

		return true;
	}

}