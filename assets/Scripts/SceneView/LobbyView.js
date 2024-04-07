cc.Class({
	extends: cc.Component,
	ctor() {
		this.countTime = 0;
		this.notifyUI = null;
		this.lstItemBlind = [];
		this.lobbyStatus = 0;
		this.isShowMenu = false;
		this.checkBottom = false;
		this.topValue = 100;
		this.dataTop = null;
		this.topRankGame = 0;
	},

	properties: {
		txtGold: require("LbMonneyChange"),
		txtDiamond: cc.Label,
		txtName: cc.Label,
		imgAva: cc.Sprite,
		txtID: cc.Label,
		nodeLoginTabView: cc.Node,
		contentTop: cc.Node,
		bgMenu: cc.Node,
		btnCashOutPartner: cc.Button,
		nodeMiddle: cc.Node,
		iconCoin: cc.Node,
		banner: cc.Node,
		btnFirstCashIn: cc.Node,
		btnEventSanHeo: cc.Node,
		notiMission: cc.Node,
		btnLeague : cc.Node,
		btnAdmob : cc.Node,
		// lbVersion : cc.Label,
	},

	onClickTest() {

	},

	onEnable(){
		let count = 0;
		Global.UIManager.showLoading();
		this.schedule(
			(this.loading = () => {
				count += 0.01;
				cc.log("check perceny : ", count)
				Global.UIManager.progressLoading(count)
				if (count >= 0.99) {
					this.unschedule(this.loading);
				}
			}),
			0.01
		);
	},

	onLoad() {

		if(cc.sys.isBrowser){
			if ('wakeLock' in navigator) {
				// Yêu cầu quyền truy cập để giữ màn hình sáng
				navigator.wakeLock.request('screen').then(
					() => {
						console.log('Màn hình sẽ được giữ sáng.');
					},
					(err) => {
						console.error('Không thể giữ màn hình sáng:', err.name, err.message);
					}
				);
			} else {
				console.log('Trình duyệt không hỗ trợ Screen API.');
			}
		}
		require("Util").onSendTrackingFirebaseScreen("Lobby");
		MainPlayerInfo.CurrentGameId = 7;
		MainPlayerInfo.CurrentGameCode = "TMN";
	},

	onClickBtnEvent() {
		Global.onPopOn(this.banner);
	},

	onClickMaskOffBanner() {
		Global.onPopOff(this.banner);
	},

	reviceLoginData(packet) {
		cc.log("chay duoc vao login lobby view + data login la : ", packet);
		Global.UIManager.hideLoading();
		Global.UIManager.hideMiniLoading();
		this.sendPing();
		MainPlayerInfo.SetUpInfo(JSON.parse(packet[1]));
		cc.log("show lobbyview 1 : ", MainPlayerInfo.ingameBalance);
		this.UpdateInfoView(MainPlayerInfo.ingameBalance);
		CONFIG.TX_BET_PERIOD = 60;
		CONFIG.TX_AWARD_PERIOD = 20;
		if (Global.GameConfig.TextNotifiAlterLogin) {
			Global.UIManager.showCommandPopup(Global.GameConfig.TextNotifiAlterLogin, null);
		}
		Global.isLogin = true;
		Global.UIManager.hideMask();
		Global.XocDia = null;
		cc.log("chay vao open mini game ")
		Global.UIManager.onClickOpenMiniGame(GAME_TYPE.XOCDIA);
	},

	checkShowPopupNewUser(dataUser) {
		let data = JSON.parse(dataUser);
		MainPlayerInfo.SetUpInfo(data);
		MainPlayerInfo.ingameBalance = data.IngameBalance;
	},

	getRdPointPosition(start) {
		return cc.v2(start.x + Global.RandomNumber(-200, 200), start.y + Global.RandomNumber(0, 50));
	},

	checkDate() {
		// let day =
		let now = Date.now().toString(); //ngay hien tai

		let sub = now.substring(0, 10);

		let timeHasPassed = (parseInt(sub) + 25200) % 86400;
		let timeRemaining = 86400 - timeHasPassed;

		cc.log("sub = : ", sub);
		cc.log("timeHasPassed = : ", timeHasPassed);
		cc.log("timeRemaining = : ", timeRemaining);

		this.scheduleOnce(() => {
			let msg = {};
			msg[1] = Global.DaycountMax + 1;
			if (Global.DaycountMax <= 6) require("SendRequest").getIns().MST_Client_Receive_Bonus_Firsi_Cashin(msg);
		}, timeRemaining);
	},

	start() {
		let funNext = () => { };

		if (Global.UIManager) {
			cc.log("chay vao load res dau game");
			Global.UIManager.preLoadPopupInRes(funNext);
		} else {
			cc.log("chay vao load res dau game UIManager = null");
			funNext();
		}
		Global.LobbyView = this;
		if (!Global.isLogin) {
			// this.requestJackpotChuaLogin();
			Global.NotifyUI.isInGame = false;
			// this.onHideLobby();
		}
	},
	sendPing() {
		cc.log("send ping nay");
		let msg = {};
		msg[1] = Date.now();
		var date = new Date();
		msg[2] = date.getTimezoneOffset();
		Global.NetworkManager.sendRequest(REQUEST_CODE.MST_CLIENT_PING, msg);
	},

	onClickTournament(event, data) {
		MainPlayerInfo.CurrentGameType = 4;
		MainPlayerInfo.CurrentGameId = Global.getGameIdByName(data);
		MainPlayerInfo.CurrentGameCode = data;
		require("SendCardRequest").getIns().MST_Client_Poker_Spin_Go_Get_Config();
	},

	Init() {
		this.CheckCastOut();
		if (Global.listNotifyDefault.length > 0) {
			this.UpdateNotify(Global.listNotifyDefault[0].Notify, Global.listNotifyDefault[0].Speed);
		}
		if (Global.isShowShop) {
			Global.isShowShop = false;
			this.ClickBtnShopCashIn();
		}
		cc.log("đã init");
	},

	Connect() {
		this.Init();
		if (!Global.NetworkManager._connect || Global.NetworkManager._connect.connectionState !== "Connected") {
			var data = {};
			require("BaseNetwork").request(Global.ConfigLogin.GameConfigUrl, data, this.GetConfig.bind(this));
		} else {
			Global.UIManager.hideMiniLoading();
			this.UpdateInfoView(MainPlayerInfo.ingameBalance);
			this.getDataLogin();
		}
	},

	GetConfig(response) {
		let dataJson = JSON.parse(response);
		console.log("check config : ", dataJson.d);
		if (dataJson.c != 0) {
			Global.UIManager.showCommandPopup(MyLocalization.GetText(dataJson.m), this.Connect.bind(this));
		} else {
			Global.GameConfig = dataJson.d;
			Global.NetworkManager.init("");
			Global.NetworkManager.connect_sv(Global.GameConfig.UrlGameLogic.WebServerLogicAddress);
		}
	},

	OnUpdateMoney(money) {
		cc.log("check money la : ", money)
		this.txtGold.setMoney(money);
		cc.log("chay vao day offf ads 222")
		if(money <  Global.MinMoneyAdmob){
			if(cc.sys.os === cc.sys.OS_ANDROID)
				this.btnAdmob.active = true;
		}
		else{
			this.btnAdmob.active = false;
		}
	},

	UpdateInfoView(ingameBlance = null) {
		cc.log("check connect la : ", Global.NetworkManager._connect)
		Global.GetAvataById(this.imgAva, MainPlayerInfo.accountId);
		if(MainPlayerInfo.nickName.length > 15)
			this.txtName.string = MainPlayerInfo.nickName.substring(0, 15) + "...";
		else
			this.txtName.string = MainPlayerInfo.nickName;
		
		this.txtID.string = "ID: " + MainPlayerInfo.accountId;
		cc.log("chay vao set tien : ", )
		this.txtGold.setMoney(ingameBlance);
	},

	ClickJoinFishRoom(event, index) {
		//Global.AudioManager.ClickButton();
		if (!Global.isLogin) {
			Global.UIManager.showCommandPopup(MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		for (var i = 0; i < Global.GameConfig.ListRoomConfig.length; i++) {
			if (Global.GameConfig.ListRoomConfig[i].RoomId == index) {
				if (MainPlayerInfo.ingameBalance < Global.GameConfig.ListRoomConfig[i].MinMoney) {
					Global.UIManager.showCommandPopup(Global.formatString(MyLocalization.GetText("MIN_MONEY_JOIN_ROOM"), [Global.formatNumber(Global.GameConfig.ListRoomConfig[i].MinMoney)]), null);
					return;
				}
			}
		}
		require("ScreenManager").getIns().roomType = index;
		require("ScreenManager").getIns().LoadScene(SCREEN_CODE.INGAME_KILL_BOSS);
	},

	ClickShowDailyBonus() {
		if (!Global.isLogin) {
			Global.UIManager.showCommandPopup(MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		//Global.AudioManager.ClickButton();
		Global.UIManager.showWeeklyRewardPopup(STATUS_GIFT_POPUP.NONE);
	},

	onClickShowTimeOnline() {
		if (!Global.isLogin) {
			Global.UIManager.showCommandPopup(MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		//Global.AudioManager.ClickButton();
		Global.UIManager.showWeeklyRewardPopup(STATUS_GIFT_POPUP.ONLINE);
	},

	ClickShowQuestPopup() {
		if (!Global.isLogin) {
			Global.UIManager.showCommandPopup(MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		//Global.AudioManager.ClickButton();
		Global.UIManager.showQuestPopup();
	},

	ClickShowVipInfoPopup() {
		if (!Global.isLogin) {
			Global.UIManager.showCommandPopup(MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		//Global.AudioManager.ClickButton();
		Global.UIManager.showVipInfoPopup();
	},

	ClickBtnShopDiamond() {
		if (!Global.isLogin) {
			Global.UIManager.showCommandPopup(MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		Global.AudioManager.ClickButton();
		require("SendRequest").getIns().MST_Client_Get_Shop_Config();
		cc.log("data shop diamond lla : ", Global.DataConfigShopDiamond);
	},

	clickShowTopView(event, data) {
		if (!Global.isLogin) {
			Global.UIManager.showCommandPopup(MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		if (data) {
			Global.UIManager.onShowTopView(null);
		} else {
			Global.UIManager.onShowTopView(this.topRankGame);
		}
	},

	clickShowJackPotView() {
		if (!Global.isLogin) {
			Global.UIManager.showCommandPopup(MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		// this.nodeJackpot.active = false;
		// Global.onPopOff(this.nodeJackpot)// = false;
		Global.UIManager.onShowJackPotView();
	},

	ClickBtnEvent() {
		if (!Global.isLogin) {
			Global.UIManager.showCommandPopup(MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		//Global.AudioManager.ClickButton();
		Global.UIManager.showEventPopup(STATE_EVENT.EVENT);
	},

	onClickBtnEventRanking() {
		if (!Global.isLogin) {
			Global.UIManager.showCommandPopup(MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		//Global.AudioManager.ClickButton();
		Global.UIManager.showEventRanking(STATE_EVENT.EVENT);
	},

	ClickBtnMail() {
		if (!Global.isLogin) {
			Global.UIManager.showCommandPopup(MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		Global.UIManager.showMailPopup();
	},

	onClickGetConfigTournament(event, data) {
		cc.log("send get config tournament");
		Global.PokerRoomType = JSON.parse(data);
		require("SendCardRequest").getIns().MST_Client_Tournament_Get_List();
	},

	onClickPromotion() {
		if (!Global.isLogin) {
			Global.UIManager.showCommandPopup(MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		Global.UIManager.showPromotionFirstCashIn();
	},

	ClickBtnFanpage() {
		if (!Global.isLogin) {
			Global.UIManager.showCommandPopup(MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		// if (!Global.CheckFunction(Global.GameConfig.FeatureConfig.OpenFanPageFeature))
		// 	return;

		// cc.log(Global.ConfigLogin);
		// cc.sys.openURL(Global.ConfigLogin.FanpageUrl);
		Global.UIManager.showSuportView();
	},

	clickBtnTournament() {
		if (!Global.isLogin) {
			Global.UIManager.showCommandPopup(MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		Global.UIManager.showTournamentView();
	},

	ClickBtnCloseSupport() {
		cc.log("close support");
		let tween1 = cc.tween().to(0.1, { scale: 1.2 });
		let tween2 = cc.tween().to(0.05, { scale: 1 });
		cc.tween(this.nodeSupport)
			.then(tween1)
			.then(tween2)
			.call(() => {
				this.nodeSupport.active = false;
			})
			.start();
	},

	ClickBtnTaiXiu() {
		cc.log("ClickBtnTaiXiu");
		if (!Global.isLogin) {
			Global.UIManager.showCommandPopup(MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		Global.UIManager.onClickOpenMiniGame(GAME_TYPE.TAI_XIU);
	},

	ClickBtnGiftCode() {
		if (!Global.isLogin) {
			Global.UIManager.showCommandPopup(MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		//Global.AudioManager.ClickButton();
		Global.UIManager.showGiftCodePopup();
	},

	onClickCommingSoon() {
		if (!Global.isLogin) {
			Global.UIManager.showCommandPopup(MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		Global.UIManager.showCommandPopup("Trò chơi đang được xây dựng !");
	},

	ClickBtnRank() {
		if (!Global.isLogin) {
			Global.UIManager.showCommandPopup(MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		//Global.AudioManager.ClickButton();
		Global.UIManager.showRankPopup();
	},

	ClickBtnProfilePopup() {
		if (!Global.isLogin) {
			Global.UIManager.showCommandPopup(MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		//Global.AudioManager.ClickButton();
		Global.UIManager.showProfilePopup();
	},

	onClickShowLeague(){
		if (!Global.isLogin) {
			Global.UIManager.showCommandPopup(MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
        Global.UIManager.showLeaguePopup();
    },

	ClickShowFAQ(event, data) {
		if (!Global.isLogin) {
			Global.UIManager.showCommandPopup(MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		require("Util").onSendTrackingFirebase(data);
		Global.UIManager.showFAQ(data);
	},

	ClickBtnTelegram() {
		if (!Global.isLogin) {
			Global.UIManager.showCommandPopup(MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		//Global.AudioManager.ClickButton();
		cc.sys.openURL(Global.ConfigLogin.TelegramUrl);
	},

	UpdateMailStatus() {
		let numberMailNotRead = 0;
		for (let i = 0; i < MainPlayerInfo.listMail.length; i++) {
			if (MainPlayerInfo.listMail[i].IsReaded == 0) {
				numberMailNotRead += 1;
			}
		}
	},

	playCardGameNew(event, strGame) {
		// Global.AudioManager.ClickButton();
		if (!Global.isLogin) {
			Global.UIManager.showCommandPopup(MyLocalization.GetText("NEED_LOGIN"));
			return;
		}

		let returnGame = Global.UIManager.onClickOpenBigGame(Global.getGameTypeByName(strGame));
		if (returnGame) return;

		MainPlayerInfo.CurrentGameCode = strGame;
		MainPlayerInfo.CurrentGameId = Global.getGameIdByName(strGame);
		MainPlayerInfo.CurrentGameType = 1;
		Global.nodeInOutToRight(null, this.nodeMiddle);

		// if (Global.IsNewUser && MainPlayerInfo.CurrentGameCode === "TMN") {
		// 	if (Global.TodayMission) {
		// 		Global.UIManager.showConfirmPopup(Global.TodayMission.MissionDescription, () => {
		// 			let msg = {};
		// 			msg[AuthenticateParameterCode.GameId] = MainPlayerInfo.CurrentGameCode;
		// 			msg[AuthenticateParameterCode.Blind] = 0;
		// 			require("SendCardRequest").getIns().MST_Client_Join_Game(msg);
		// 			Global.UIManager.showMiniLoading();
		// 		});
		// 	} else {
		// 		Global.UIManager.showConfirmPopup("Chưa có nhiệm vụ hiện tại");
		// 	}
		// }
	},

	onClickSendGetListRoom() {
		let msg = {};
		msg[AuthenticateParameterCode.RoomType] = 1;
		msg[AuthenticateParameterCode.RoomId] = null;
		msg[AuthenticateParameterCode.GameId] = MainPlayerInfo.CurrentGameCode;
		msg[AuthenticateParameterCode.GameCode] = MainPlayerInfo.CurrentGameCode; // NEW;
		cc.log("chay vao send info data : ", msg);
		require("SendCardRequest").getIns().MST_Client_Get_Game_Blind(msg);
	},

	onClickPlayNow() {
		if (!Global.isLogin) {
			Global.UIManager.showCommandPopup(MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		let msg = {};
		msg[AuthenticateParameterCode.GameId] = MainPlayerInfo.CurrentGameCode;
		msg[AuthenticateParameterCode.Blind] = 0;
		cc.log("send ow itemlobby : ", msg);
		require("SendCardRequest").getIns().MST_Client_Join_Game(msg);
		Global.UIManager.showMiniLoading();
	},

	onDisconnect() { },

	UpdateTopJackpot(data) {
		this.dataTop = data;
		let roomType = 1;
		if (this.topValue == 1000) {
			roomType = 2;
		} else if (this.topValue == 10000) {
			roomType = 3;
		}
		let lst = [];
		for (let i = 0; i < data.length; i++) {
			const temp = data[i];
			if (temp.GameId == 2 && temp.RoomType == roomType) {
				lst.push(temp);
			}
		}
		for (let index = 0; index < lst.length; index++) {
			if (index < this.lstTopHu.length) {
				this.lstTopHu[index].setupInfo(lst[index]);
			} else {
				let item = this.GetItemTophu();
				item.setupInfo(lst[index]);
				this.lstTopHu.push(item);
			}
		}
	},

	ClickBtnShopCashOut() {
		//Global.AudioManager.ClickButton();
		if (!Global.isLogin) {
			Global.UIManager.showCommandPopup(MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		Global.UIManager.showCashOutPopup();
	},

	clickBtnShopCashIn(event, data) {
		//Global.AudioManager.ClickButton();
		if (!Global.isLogin) {
			Global.UIManager.showCommandPopup(MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		Global.UIManager.showShopPopup(JSON.parse(data));
	},

	CheckCastOut() {
		Global.statusAuthen = cc.sys.localStorage.getItem(CONFIG.KEY_CHECK) || 0;
		if (Global.statusAuthen == 1 && Global.GameConfig != null && Global.GameConfig.FeatureConfig.CashOutFeature == EFeatureStatus.Open) {
			//hide cash out
		}
	},

	getDataLogin() {
		if (Global.NetworkManager._connect && Global.NetworkManager._connect.connectionState !== "Connected") return;
		cc.log("=======> chay vao get data login");
		require("SendCardRequest").getIns().MST_Client_Jackpot_CardGame_Info();
		require("SendRequest").getIns().MST_Client_Get_News();
		require("SendRequest").getIns().MST_Client_Get_Mission_Info();
		require("SendRequest").getIns().MST_Client_Get_Shop_Config();
		this.onClickSendGetListRoom();
		this.unschedule(this.refreshListRoom);
		this.schedule(this.refreshListRoom = ()=>{
			if(!Global.GameView)
				this.onClickSendGetListRoom();
		}, 2)
	

		let msgData = {};
		msgData[1] = 21;
		require("SendRequest").getIns().MST_Client_Top_Event(msgData);

		cc.log("check link request ", Global.GameConfig.UrlGameLogic.GetAdmobInfo)
		if(Global.LeagueData){
			this.btnLeague.active = true;
		}
		else{
			this.btnLeague.active = false;
		}
	},

	getSessionAdmob (){
		let msg = {}
		msg.AccountId = MainPlayerInfo.accountId;
		require("BaseNetwork").request(Global.GameConfig.UrlGameLogic.GetAdmobInfo, msg, (dataRevice) => {
			console.log("check data admod : ", dataRevice)
			let data = JSON.parse(dataRevice);
			Global.SessionKeyAdmod = data.SessionKey;
			if(data.MinMoney)
				Global.MinMoneyAdmob = data.MinMoney
			cc.log("check min money : ", Global.MinMoneyAdmob)
			if(MainPlayerInfo.ingameBalance <  Global.MinMoneyAdmob){
				if(cc.sys.os === cc.sys.OS_ANDROID)
					this.btnAdmob.active = true;
			}
			else{
				this.btnAdmob.active = false;
			}
			console.log("check SessionKey : ", Global.SessionKeyAdmod)
		});
	},

	requestJackpotChuaLogin() {
		require("BaseNetwork").request(Global.ConfigLogin.GetJackpotUrl, {}, (dataRevice) => {
			cc.log(dataRevice);
			cc.log(typeof dataRevice);
			let objJackPot = dataRevice;
			Global.JackpotController.reviceDataChuaLogin(JSON.parse(dataRevice));
		});
	},

	UpdateNumberSpin(numberSpin) {
		// if (numberSpin > 0) {
		// 	this.spinObj.active = true;
		// } else {
		// 	this.spinObj.active = false;
		// }
	},

	UpdateNotify(content, speed) {
		// if (Global.GameConfig.FeatureConfig.NotifyLobbyFeautre != EFeatureStatus.Open)
		// 	return;
		//	this.notifyUI.UpdateListNotify(content, speed);
	},

	ShowNotifyCash(content, speed, repeat) {
		return;
		this.notifyUI.AddNotify(content, speed, repeat);
	},

	onClickNull() {
		Global.UIManager.showCommandPopup("Tính năng đang phát triển");
	},

	onClickGameNull() {
		if (!Global.isLogin) {
			Global.UIManager.showCommandPopup(MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		Global.UIManager.showCommandPopup("Trò chơi đang phát triển");
	},

	OnBack() {
		//Global.AudioManager.ClickButton();
		if (!Global.isLogin) {
			Global.UIManager.showCommandPopup(MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		if (Global.NetworkManager._connect.connectionState !== "Connected") {
			this.BackEvent();
		} else {
			Global.UIManager.showConfirmPopup(MyLocalization.GetText("QUIT_GAME"), this.BackEvent, null);
		}
	},

	BackEvent() {
		Global.CookieValue = null;
		Global.isLogin = false;
		// Global.UIManager.showButtonMiniGame(false);
		require("ScreenManager").getIns().LoadScene(SCREEN_CODE.LOGIN);
	},

	OnShowLobby() {
		// this.contentTop.active = true;
		this.nodeMiddle.active = true;
		// if (Global.NetworkManager._connect.connectionState === "Connected") require("SendRequest").getIns().MST_Client_Get_History_Tour_Ranking();

		if (cc.sys.isNative) jsb.Device.setKeepScreenOn(true);
	},

	onHideLobby() {
		// this.contentTop.active = false;
		this.nodeMiddle.active = false;
	},

	OnShowMenu() {
		//Global.AudioManager.ClickButton();
		if (!Global.isLogin) {
			Global.UIManager.showCommandPopup(MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		// effect
		Global.UIManager.showMenuSettingView();
	},
	onShowHistoryChip(event, data) {
		if (!Global.isLogin) {
			Global.UIManager.showCommandPopup(MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		require("Util").onSendTrackingFirebase(data);
		Global.UIManager.showHistoryPopup();
	},
	HideMenu() {
		this.nodeMenu.active = false;
		this.isShowMenu = false;
	},

	GetItemTophu() {
		let nodeTopHu = cc.instantiate(this.topHuItem);
		this.topHuContent.addChild(nodeTopHu);
		nodeTopHu.active = true;
		return nodeTopHu.getComponent("TopItemView");
	},

	onClickShowListMenu() {
		if (!Global.isLogin) {
			Global.UIManager.showCommandPopup(MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		this.bgMenu.scale = 0;
		this.bgMenu.opacity = 0;
		this.bgMenu.active = !this.bgMenu.active;
		cc.Tween.stopAllByTarget(this.bgMenu);
		cc.tween(this.bgMenu).to(0.1, { opacity: 255 }).start();
		cc.tween(this.bgMenu).to(0.25, { scale: 1 }, { easing: "backOut" }).start();
	},

	onClickCloseListMenu() {
		this.bgMenu.active = false;
	},

	showRuleGame() {
		Global.UIManager.showRuleGamePoker();
	},

	showCashOutGamePartner() {
		Global.UIManager.showCashOutPartnerView();
	},

	onDestroy() {
		cc.log("chay vao ondes troy lobby");
		Global.LobbyView = null;
		require("WalletController").getIns().RemoveListener();
	},
});
