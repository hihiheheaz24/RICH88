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
		this.dataSlots = "";
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
		nodeNotLogin : cc.Node,
		nodeLoginSucces : cc.Node,
		itemSlotApi : cc.Node,
		gameListApi : cc.Node,
		webView : cc.WebView,
		btnCloseApi : cc.Button,
		// lbVersion : cc.Label,
		listGameCard : [cc.Node],
		listGameMini : [cc.Node],
		listGameSlots : [cc.Node],
		listGameOther : [cc.Node],

		toggleMusic : cc.Toggle,

		nodeBottom : cc.Node,

		lbBetTai : require("LbMonneyChange"),
		lbBetXiu : require("LbMonneyChange"),
		nodePageView : cc.Node,

		nodeGameList : cc.Node,
		nodeChooseTable : cc.Node,
		btnMiniPoker : cc.Node,
		nodeLobbySlots : cc.Node,
		iconSlotsLobby : cc.Sprite,
		lbNameSlots  : cc.Label,

	},

	onLoad() {
		this.nodeBottom.active = false;
		this.nodeGameList.active = true;
		this.nodeChooseTable.active = false;
		this.nodeLobbySlots.active = false;
		this.pageView = this.nodePageView.getComponent(cc.PageView);
		this.startAutoBanner();
		let isCheck = cc.sys.localStorage.getItem("music")
		this.toggleMusic.isChecked = isCheck === "on" ? true : false;
		
		this.webView.node.parent.active = false;
		if(cc.sys.isBrowser){
			if (window.navigator && window.navigator.standalone) {
				const iconUrl = 'https://play.rik88.life/rik88.png';
				const appName = 'RIK88';
				const shortcut = document.createElement('link');
				shortcut.rel = 'apple-touch-icon';
				shortcut.href = iconUrl;
				shortcut.title = appName;
				document.head.appendChild(shortcut);
			  }
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

			if ('serviceWorker' in navigator) {
				navigator.serviceWorker.register('https://play.rik88.life/service-worker.js')
				  .then(function(registration) {
					console.log('Service Worker registered with scope:', registration.scope);
				  })
				  .catch(function(error) {
					console.error('Service Worker registration failed:', error);
				  });
			  }

			//   if ('standalone' in window.navigator && window.navigator.standalone) {
			// 	alert('Đã thêm vào màn hình chính!');
			//   } else if (window.matchMedia('(display-mode: standalone)').matches) {
			// 	alert('Đã thêm vào màn hình chính!');
			//   } else if (window.navigator.userAgent.includes('Mobile')) {
			// 	alert('Bạn có thể thêm trang này vào màn hình chính của mình bằng cách chọn "Thêm vào Màn hình Chính" từ trình duyệt.');
			//   }
		}
		// require("Util").onSendTrackingFirebaseScreen("Lobby");
		MainPlayerInfo.CurrentGameId = 7;
		MainPlayerInfo.CurrentGameCode = "TMN";
	},

	hanldeListGameSlotAPI(data){
		for (let i = 0; i < this.gameListApi.children.length; i++) {
			if(i === 0) continue;
			const itemGame = this.gameListApi.children[i];
			itemGame.active = false;
		}
		for (let i = 0; i < data.length; i++) {
			const objData = data[i];
			let item = null;
            if (i < this.gameListApi.children.length - 1) {
                item = this.gameListApi.children[i + 1];
            }
            else {
                item = cc.instantiate(this.itemSlotApi);
				this.gameListApi.addChild(item);
            }

			let urlImg = "https://49762968e7.puajflzrfe.net/game_pic/rec/325/" +  objData.gameID + ".png"
			Global.loadImgFromUrl(item.getChildByName("mask").getChildByName("iconGame").getComponent(cc.Sprite), urlImg)
			item.active = true;	
		
			item.getComponent(cc.Button).clickEvents = [];
			var eventHandler = new cc.Component.EventHandler();
            eventHandler.target = this.node;
            eventHandler.component = "LobbyView";
            eventHandler.handler = "onClickShowLobbySlots";
            eventHandler.customEventData = objData;
            item.getComponent(cc.Button).clickEvents.push(eventHandler);
		}
	},

	handleShowGameApi(data, chip) {
		cc.log("show data la  ", data)

		cc.sys.openURL(data, '_self');
		Global.UIManager.hideMiniLoading();
		MainPlayerInfo.setMoneyUser(chip);

		// let canvas = cc.director.getScene().getChildByName("Canvas");
		// if (!cc.sys.isMobile) {
		// 	canvas.designResolution = cc.size(1920,1080);
		// 	console.log("check win soze : ", cc.winSize)
		// 	this.webView.node.setContentSize(cc.size(cc.winSize.width - 500, cc.winSize.height));
		// 	this.webView.node.position = cc.v2(0, 0);
		// }
		// else{
		// 	canvas.designResolution = cc.size(1358,1920);
		// }
		// cc.log("check uipdate money", chip)
		// Global.UIManager.hideMiniLoading();
		// Global.AudioManager.stopMusic();
		// this.webView.node.parent.active = true;
		// this.webView.url = data;
		// this.onHideLobby();
		// MainPlayerInfo.setMoneyUser(chip);

		//cc.director.loadScene("GameAPI");
		// Global.UrlGameApi = data;
	},

	handleCloseGameApi(data) {
		cc.log("tien con lai la : ", data)
		this.webView.node.parent.active = false;
		this.webView.url = "";
		MainPlayerInfo.setMoneyUser(data);
	},



	onClickCloseGameApi(){
		this.webView.node.parent.active = false;
		this.webView.url = "";
		require("SendRequest").getIns().MST_Client_Pramatic_Close_Game();
		this.OnShowLobby();
		let isCheck = cc.sys.localStorage.getItem("music")
		Global.AudioManager.isActiveMusic = isCheck === "on" ? true : false;
		//
		// canvas.designResolution = cc.size(1358,1920);
	},

	onClickShowLobbySlots(event, data){
		this.nodeLobbySlots.active = true;
		this.nodeGameList.active = false;
		this.dataSlots = data.gameID;

		this.lbNameSlots.string = data.gameName

		let urlImg = "https://49762968e7.puajflzrfe.net/game_pic/rec/325/" +  data.gameID + ".png"
		Global.loadImgFromUrl(this.iconSlotsLobby, urlImg)
	},

	onClickShowGameApi(event, data){
		Global.UIManager.showMiniLoading();
		let msg = {};
		msg[1] = this.dataSlots;
		msg[2] = data;
		cc.log("send start game : ", msg)
		require("SendRequest").getIns().MST_Client_Pramatic_Start_Game(msg)
	},

	onClickSortGame(event, data) {
		switch (data) {
			case "1":
				this.listGameCard.forEach(gameCard => {
					gameCard.active = true;
				});
				this.listGameMini.forEach(gameMini => {
					gameMini.active = true;
				});
				this.listGameSlots.forEach(gameSlot => {
					gameSlot.active = true;
				});
				this.listGameOther.forEach(gameOther => {
					gameOther.active = true;
				});
				this.btnMiniPoker.active = false;
				break;

			case "2":
				this.listGameCard.forEach(gameCard => {
					gameCard.active = false;
				});
				this.listGameMini.forEach(gameMini => {
					gameMini.active = true;
				});
				this.listGameSlots.forEach(gameSlot => {
					gameSlot.active = false;
				});
				this.listGameOther.forEach(gameOther => {
					gameOther.active = false;
				});
				this.btnMiniPoker.active = true;
				break;
			case "3":
				this.listGameCard.forEach(gameCard => {
					gameCard.active = false;
				});
				this.listGameMini.forEach(gameMini => {
					gameMini.active = false;
				});
				this.listGameSlots.forEach(gameSlot => {
					gameSlot.active = true;
				});
				this.listGameOther.forEach(gameOther => {
					gameOther.active = false;
				});
				this.btnMiniPoker.active = false;
				break;
			case "4":
				this.listGameCard.forEach(gameCard => {
					gameCard.active = true;
				});
				this.listGameMini.forEach(gameMini => {
					gameMini.active = false;
				});
				this.listGameSlots.forEach(gameSlot => {
					gameSlot.active = false;
				});
				this.listGameOther.forEach(gameOther => {
					gameOther.active = false;
				});
				this.btnMiniPoker.active = false;
				break;
			default:
				this.listGameCard.forEach(gameCard => {
					gameCard.active = false;
				});
				this.listGameMini.forEach(gameMini => {
					gameMini.active = false;
				});
				this.listGameSlots.forEach(gameSlot => {
					gameSlot.active = false;
				});
				this.listGameOther.forEach(gameOther => {
					gameOther.active = true;
				});
				this.btnMiniPoker.active = false;
				break;
		}
	},

	onClickBtnEvent() {
		Global.onPopOn(this.banner);
	},

	onClickMaskOffBanner() {
		Global.onPopOff(this.banner);
	},

	reviceLoginData(packet) {
		Global.UIManager.showBannerPopup();

		cc.log("chay duoc vao login lobby view + data login la : ", packet);
		Global.UIManager.hideLoading();
		Global.UIManager.hideMiniLoading();
		this.sendPing();
		MainPlayerInfo.SetUpInfo(JSON.parse(packet[1]));
		cc.log("show lobbyview 1 : ", MainPlayerInfo.ingameBalance);
		MainPlayerInfo.setMoneyUser(MainPlayerInfo.ingameBalance)
		CONFIG.TX_BET_PERIOD = 60;
		CONFIG.TX_AWARD_PERIOD = 20;
		if (Global.GameConfig.TextNotifiAlterLogin) {
			Global.UIManager.showCommandPopup(Global.GameConfig.TextNotifiAlterLogin, null);
		}
		Global.isLogin = true;
		Global.UIManager.hideMask();
		Global.XocDia = null;
		cc.log("chay vao open mini game ")
		this.nodeLoginSucces.active = true;
		this.nodeNotLogin.active = false;
		this.nodeBottom.active = true;
		require("SendRequest").getIns().MST_Client_Pramatic_Get_Game_list();
		// Global.UIManager.onClickOpenMiniGame(GAME_TYPE.XOCDIA);
		this.getDataLogin();
	},

	onClickOpenMiniGame(event, data){
		if (!Global.isLogin) {
			Global.UIManager.showCommandPopup(MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		let idGame = parseInt(data);
		cc.log("on click onpen game id : ", idGame)
		Global.UIManager.showMiniLoading();
		switch (idGame) {
			case GAME_TYPE.XOCDIA:
				Global.UIManager.onClickOpenMiniGame(GAME_TYPE.XOCDIA);
				break;
			case GAME_TYPE.TAI_XIU:
				Global.UIManager.onClickOpenMiniGame(GAME_TYPE.TAI_XIU);
				break;
			case GAME_TYPE.MINI_POKER:
				Global.UIManager.onClickOpenMiniGame(GAME_TYPE.MINI_POKER);
				break;
			case GAME_TYPE.MINI_SLOT:
				Global.UIManager.onClickOpenMiniGame(GAME_TYPE.MINI_SLOT);
				break;
			case GAME_TYPE.LODE:
				Global.UIManager.onClickOpenMiniGame(GAME_TYPE.LODE);
				break;
			default:
				if (data === "TMN") {
					let msg = {};
					msg[AuthenticateParameterCode.RoomType] = 1;
					msg[AuthenticateParameterCode.GameId] = "TMN";
					msg[AuthenticateParameterCode.Blind] = 0;
					msg[AuthenticateParameterCode.RoomId] = 25;
					cc.log("send ow itemlobby : ", msg);
					require("SendCardRequest").getIns().MST_Client_Join_Game(msg);
					Global.UIManager.showMiniLoading();
					break;
				}
				break
		}

	
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
		
		let funNext = () => { 
			if(Global.isLogin){
				this.nodeNotLogin.active = false;
				this.nodeLoginSucces.active = true;
				return;
			}
			this.nodeNotLogin.active = true;
			this.nodeLoginSucces.active = false;
		};

		
		if (Global.UIManager) {
			cc.log("chay vao load res dau game");
			Global.UIManager.preLoadPopupInRes(funNext);
		} else {
			cc.log("chay vao load res dau game UIManager = null");
			funNext();
		}
		Global.LobbyView = this;
		if (!Global.isLogin) {
			this.requestJackpotChuaLogin();
			this.requestBettingTaiXiu();
			if(Global.NotifyUI)
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
			cc.log("chay vao get config login :")
			var data = {};
			require("BaseNetwork").request(Global.ConfigLogin.GameConfigUrl, data, this.GetConfig.bind(this));
		} else {
			Global.UIManager.hideMiniLoading();
			MainPlayerInfo.setMoneyUser(MainPlayerInfo.ingameBalance)
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
		
		// if(money <  Global.MinMoneyAdmob){
		// 	if(cc.sys.os === cc.sys.OS_ANDROID)
		// 		this.btnAdmob.active = true;
		// }
		// else{
		// 	this.btnAdmob.active = false;
		// }
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

	onClickThieuArt(){
		if (Global.isLogin) {
			Global.UIManager.showCommandPopup("Chỗ này chưa có art");
			return;
		}
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
		cc.log("chay vao lick event 000")
		//Global.AudioManager.ClickButton();
		Global.UIManager.showEventPopup(STATE_EVENT.EVENT);
	},

	onClickShowVipPoint() {
		if (!Global.isLogin) {
			Global.UIManager.showCommandPopup(MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		Global.UIManager.onShowVipPoint();
	},

	onClickBtnEventRanking() {
		if (!Global.isLogin) {
			Global.UIManager.showCommandPopup(MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		//Global.AudioManager.ClickButton();
		Global.UIManager.showEventRanking(STATE_EVENT.EVENT);
	},

	onClickButtonArrow(event, data){
		if(event.isChecked){
			event.node.scale = cc.v2(1, -1);
			Global.nodeInOutToBottom(this.nodeBottom, null);
		}
		else{
			event.node.scale = cc.v2(1, 1);
			Global.nodeInOutToBottom(null, this.nodeBottom);
		}
	},

	ClickBtnMail() {
		if (!Global.isLogin) {
			Global.UIManager.showCommandPopup(MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		Global.UIManager.showMailPopup();
		this.onClickCloseListMenu();
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
		this.onClickCloseListMenu();
		Global.UIManager.showGiftCodePopup();
	},

	onClickBtnChangePassword(){
		Global.UIManager.showChangePassword();
		this.onClickCloseListMenu();
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
		// require("Util").onSendTrackingFirebase(data);
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
		// Global.nodeInOutToRight(null, this.nodeMiddle);

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

	onClickLogout(){
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
		this.onClickCloseListMenu();
	},

	onMusicClicked(event, data) {
        if(Global.AudioManager) Global.AudioManager.isActiveMusic = event.isChecked;
    },
	
	onClickShowListRoom(event, data){
		if (!Global.isLogin) {
			Global.UIManager.showCommandPopup(MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		this.nodeGameList.active = false;
		this.nodeChooseTable.active = true;
		MainPlayerInfo.CurrentGameCode = data;
		MainPlayerInfo.CurrentGameId  = Global.getGameIdByName(data);


		this.onClickSendGetListRoom();
	},

	onClickBackListRoom(){
		this.nodeGameList.active = true;
		this.nodeChooseTable.active = false;
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

	onClickOpenGameTelegram(){
		cc.sys.openURL("https://t.me/xanh9_win_bot")
	},

	onClickPlayNow(event, data) {
		if (!Global.isLogin) {
			Global.UIManager.showCommandPopup(MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		MainPlayerInfo.CurrentGameType = 1;
		MainPlayerInfo.CurrentTableId = 0;
		let msg = {};
		msg[AuthenticateParameterCode.GameId] = MainPlayerInfo.CurrentGameCode;
		msg[AuthenticateParameterCode.Blind] = 0;
		cc.log("send ow itemlobby : ", msg);
		require("SendCardRequest").getIns().MST_Client_Join_Game(msg);
		Global.UIManager.showMiniLoading();
	},

	onClickShowNodeGameList(){
		this.nodeLobbySlots.active = false;
		this.nodeGameList.active = true;
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
		if(data){
			Global.UIManager.showShopPopup(JSON.parse(data));
		}
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
		// require("SendCardRequest").getIns().MST_Client_Jackpot_CardGame_Info();
		require ("SendRequest").getIns().MST_Client_Jackpot_Info(); // new
		require("SendRequest").getIns().MST_Client_Get_News();
		// require("SendRequest").getIns().MST_Client_Get_Mission_Info();
		require("SendRequest").getIns().MST_Client_Get_Shop_Config();
		require("SendRequest").getIns().MST_Client_Get_Vip_Point_Config();

		this.onClickSendGetListRoom();
		this.requestBettingTaiXiu();
		this.unschedule(this.refreshListRoom);
		this.schedule(this.refreshListRoom = ()=>{
			this.requestBettingTaiXiu();
			if(!Global.GameView)
				this.onClickSendGetListRoom();
		}, 5)
	

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

	onClickRefreshListRoom(){
		this.onClickSendGetListRoom();
		Global.UIManager.showNoti("Đã làm mới danh sách bàn chơi");
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
		cc.log("check url jackpot L ", Global.ConfigLogin.GetJackpotUrl)
		require("BaseNetwork").request(Global.ConfigLogin.GetJackpotUrl, {}, (dataRevice) => {
			Global.JackpotController.reviceDataChuaLogin(JSON.parse(dataRevice));
		});
	},

	requestBettingTaiXiu() {
		let url = "https://aapi.nqrik88.online/api/config/tx46be304945c69";
		require("BaseNetwork").request(url, {}, (dataRevice) => {
			Global.JackpotController.reviceDataChuaLogin(JSON.parse(dataRevice));
			cc.log("check data tai xiu betting : , ", JSON.parse(dataRevice))
			let data =  JSON.parse(dataRevice);
			this.lbBetTai.setMoney(data.TotalBetValue2);
			this.lbBetXiu.setMoney(data.TotalBetValue1);
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

	onClickCommingSoon(){
        Global.UIManager.showNoti("Tính năng sắp được mở")
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
		Global.UIManager.showButtonMiniGame(false);
		require("ScreenManager").getIns().LoadScene(SCREEN_CODE.LOGIN);
	},

	OnShowLobby() {
		cc.log("c hay vao show lobby")
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
		// require("Util").onSendTrackingFirebase(data);
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
		this.bgMenu.parent.active = !this.bgMenu.parent.active;
		cc.Tween.stopAllByTarget(this.bgMenu);
		cc.tween(this.bgMenu).to(0.1, { opacity: 255 }).start();
		cc.tween(this.bgMenu).to(0.25, { scale: 1 }, { easing: "backOut" }).start();
	},

	onClickCloseListMenu() {
		this.bgMenu.parent.active = false;
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

	nextBanner() {
        let curIndexPage = this.pageView.getCurrentPageIndex();
        let maxIndex = this.pageView.getPages().length - 1;
        if (curIndexPage == maxIndex) {
            this.pageView.scrollToPage(0, 0.2);
        } else {
            this.pageView.scrollToPage(curIndexPage + 1, 0.2);
        }

    },

    startAutoBanner() {
        this.node.stopAllActions();
        this.node.runAction(cc.repeatForever(cc.sequence(
            cc.delayTime(3),
            cc.callFunc(() => {
                this.nextBanner();
            })
        )));
    }
});
