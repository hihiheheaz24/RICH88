var UpdateAssetManager = require("UpdateAssetsManager");
cc.Class({
	extends: cc.Component,

	ctor() {
		this.listEventEnter = [];
		this.listEditBoxCurret = [];
		this.currentIndexEdb = 0;
		this.currentIndexBanner = 0;
		this.countTimeOut = 0;
		this.isCountTime = false;
		this.isShowInviteTable = true;

		this.objGameWating = {};
		this.time_enter_background = 0;

		this.listNodeActiveByConfig = [];
	},

	properties: {
		parentMiniGame: cc.Node,
		// btnMiniGame : cc.Node,
		mask: cc.Node,
		parentPopup: cc.Node,
		parentPopupLogin: cc.Node,
		miniLoading: cc.Node,

		animAlert: cc.Animation,
		_listCpNeedTime: [],

		// prefabDownload: cc.Prefab,
		loading: require("Loading"),
		lbNoti: cc.Label,		
	},

	onLoad() {
		require("Util").getGetDeviceId();
		cc.game.addPersistRootNode(this.node);
		// this.node.x = cc.winSize.width/2
		// this.node.y = cc.winSize.height/2
		Global.UIManager = this;

		this.initConfigBundle();

		cc.game.on(cc.game.EVENT_HIDE, () => {
			console.log("Check connect server ====> Ứng dụng bị tạm ẩn hoặc bị tắt")
			// console.log("check time show bonus : ", Global.NetworkManager.GetTimeRemain());
			// let timeLeft = Global.NetworkManager.GetTimeRemain();
			if(Global.GameView){
				if(Global.GameView.state !== StateTable.Playing){
					console.log("send roi ban tlmn")
					require("SendCardRequest").getIns().MST_Client_LeaveRoom();
				}
			}
			
			var noti = {
				title: "Tiến Lên Vplay",
				time: 10800,
				content: Global.encode("Quay lại nhận thưởng ngay bạn nhé. Thưởng to đấy"),
				category: "",
				identifier: "",
				data: "",
				isLoop: false
			};
			require("Util").pushNotiOffline(JSON.stringify(noti));

			var noti = {
				title: "Tiến Lên Vplay",
				time: 21600,
				content: Global.encode("Bị đối thủ vượt qua rồi bạn ơi, vô lấy lại vị trí nào"),
				category: "",
				identifier: "",
				data: "",
				isLoop: false
			};
			require("Util").pushNotiOffline(JSON.stringify(noti));
			// Global.LobbyView.sendPing()

			this.time_enter_background = Date.now() / 1000;
			// if (Global.TaiXiu) Global.TaiXiu.updateTimeStartHide();
		});
		cc.game.on(cc.game.EVENT_SHOW, () => {
			console.log("Check connect server ====> Ứng dụng được mở trở lại")
			// Global.LobbyView.sendPing();
			if (this.time_enter_background < 1) return;

			var _time = Date.now() / 1000;
			let time_out_bg = _time - this.time_enter_background;
			if (cc.sys.isNative && time_out_bg > 1800) cc.game.restart();
			this.time_enter_background = 0;
			cc.log("time out bg la ???????? ", time_out_bg);

			cc.log("poker uimanager la /; ", MainPlayerInfo.CurrentGameCode);

			switch (MainPlayerInfo.CurrentGameCode) {
				case "TMN":
					if (Global.TienLenMN) {
						Global.TienLenMN.onEventShow(time_out_bg);
					}
					break;
				case "MAB":
					if (Global.BinhView) {
						Global.BinhView.onEventShow(time_out_bg);
					}
					break;
				case "PKR":
					if (Global.PokerView) {
						Global.PokerView.onEventShow(time_out_bg);
					}
					break;
			}

			if (Global.NetworkManager._connect && Global.NetworkManager._connect.connectionState !== "Connected") {
				Global.UIManager.showCommandPopup("Mất kết nối. Vui lòng khởi động lại trò chơi")
				cc.game.restart();
			}

			if(time_out_bg > 10){
				Global.NetworkManager.disconnect();
				cc.game.restart(); 
			}
			// if(Global.LoDe)
			// 	require("SendRequest").getIns().MST_Client_LoDe_Open_Game();
			if (cc.sys.isNative) {
				cc.director.getActionManager().update(time_out_bg);
				cc.director.getScheduler().update(time_out_bg);
			}
		});

		// this.parentPopup.on("child-added", (itemPopup) => {
		// 	this.closeAllPopup();
		// 	setTimeout(() => {
		// 		Global.onPopOn(this.parentPopupLogin.children[0]);
		// 	}, 0);
		// });

		// this.parentPopupLogin.on("child-removed", (itemPopup) => {
		// 	console.log("chay vao remove item", itemPopup);
		// 	if (this.parentPopupLogin.children.length > 0) Global.onPopOn(this.parentPopupLogin.children[0]);
		// });
	},

	initGameScence() {
		// this.node.x = cc.winSize.width/2;
		// this.node.y = cc.winSize.height/2;
		// this.node.scale = 1280/1920;
		// this.parentMiniGame.scale = 1920 / 1280;
	},

	preLoadPopupInRes(funNext) {
		// this.autoLogin();
		funNext();
		cc.resources.loadDir(
			"Popup",
			(count, total) => {
				this.progressLoading(count / total);
			},
			(err, listAset) => {
				this.hideLoading();
				funNext();
			}
		);
	},

	showButtonMiniGame(isActive) {
		// this.btnMiniGame.active = isActive;
	},

	hideMark(){

	},

	autoLogin() {

		if (cc.sys.isBrowser) {
			var url = new URL(window.location.href);
			var teleName = url.searchParams.get("telename");
			var telepass = url.searchParams.get("telepass");
			console.log("check tele name : ", teleName)
			if (teleName) {
				Global.LoginView.requestLoginTelegram(teleName);
			}
			else{
				Global.LoginView.requestLogin("tuyent321", "123456h")
			}
		}

		// if (cc.sys.isBrowser) {
		// 	var url = new URL(window.location.href);
		// 	var AccessToken = url.searchParams.get("accesstoken");
		// 	var LoginToken = url.searchParams.get("logintoken");
		// 	var RequestTime = parseInt(url.searchParams.get("requesttime"));
		// 	var PartnerCode = url.searchParams.get("partnercode");
		// }

		// if (AccessToken) {
		// 	cc.log("check LoginToken la : ", LoginToken);
		// 	cc.log("check AccessToken la : ", AccessToken);
		// 	cc.log("check RequestTime la : ", RequestTime);
		// 	cc.log("check PartnerCode la : ", PartnerCode);

		// 	var data = {
		// 		PartnerCode: PartnerCode,
		// 		RequestTime: RequestTime,
		// 		AccessToken: AccessToken,
		// 		LoginToken: LoginToken,
		// 	};
		// 	require("BaseNetwork").request(Global.ConfigLogin.PartnerLoginUrl, data, Global.LoginView.LoginAuthenProcess.bind(Global.LoginView));
		// } else {
		// 	let userName = cc.sys.localStorage.getItem("FAST_LOGIN_USERNAME");
        // 	let passWord = cc.sys.localStorage.getItem("FAST_LOGIN_PASSWORD");
		// 	cc.log("check user name : ", userName)
		// 	cc.log("check passw  : ", passWord)
		// 	if(userName){
		// 		if(userName === cc.sys.localStorage.getItem(CONFIG.KEY_USERNAME)){
		// 			cc.log("normal login" , cc.sys.localStorage.getItem(CONFIG.KEY_USERNAME))
		// 			Global.LoginView.requestLogin(userName,passWord, "", false);
		// 		}
		// 		else{
		// 			cc.log("fast login")
		// 			Global.LoginView.requestFastLogin(userName,passWord, "", false);
		// 		}
		// 	}
		// 	else{
		// 		Global.UIManager.hideMiniLoading();
		// 		this.showLoginTabView();
		// 	}
		// }
	},

	showMark(){
		
	},

	onClickQuitGame() {
		// document.location = 'vpl.asia';
		// parent.cc.TestCode();
		// // If TestCode is defined on window, then
		// parent.TestCode();
		document.location = "dev.vpl.mobi";
	},

	showNoti(content, position = null) {
		let node = this.lbNoti.node.parent;
		this.lbNoti.string = content;
		var numberOfRunningActions = node.getNumberOfRunningActions();
		cc.log("check number actob : ", numberOfRunningActions)
		if(numberOfRunningActions >= 1){
			node.scale = 1;
			node.stopAllActions()
		}
		else{
			node.scale = 0;
		}
		node.active = true;
		node.opacity = 255;
		
		cc.Tween.stopAllByTarget(node);
		cc.tween(node).to(0.15, { scale: 1 }, { easing: "backOut" }).delay(1.5).to(0.5, { opacity: 0 }).start();
	},

	showCommandPopup(message, event) {
		console.log("check message : ", message);
		this.showNoti(message);
		return;
		if(Global.CommandPopup === null){
			cc.resources.load("Popup/CommandPopup", cc.Prefab, (err, prefab) => {
				let item = cc.instantiate(prefab).getComponent("CommandPopup");
				item.node.name = "Dialog";
				Global.CommandPopup = item;
				item.show(message, event);
				// if(this.parentPopupLogin)
					this.parentPopupLogin.addChild(item.node);
				// item.node.active = false;
				item.node.zIndex = 999;
				console.log(" chay vao command popup ");
			});
		}		
		else{
			this.parentPopupLogin.addChild(Global.CommandPopup.node);
			Global.CommandPopup.node.active = false;
			Global.CommandPopup.show(message, event)
		}
	},

	showCommandPopupPO(message, event) {
		cc.resources.load("Popup/CommandPopupPO", cc.Prefab, (err, prefab) => {
			let item = cc.instantiate(prefab).getComponent("CommandPopup");
			item.node.name = "Dialog";
			Global.CommandPopup = item;
			item.show(message, event);
			this.parentPopup.addChild(item.node);
			item.node.zIndex = 999;
		});
	},

	showInputRefCode() {
		if (Global.InputRefCode == null) {
			cc.resources.load("Popup/InputRefCode", cc.Prefab, (err, prefab) => {
				let item = cc.instantiate(prefab).getComponent("InputRefCode");
				item.show();
				Global.InputRefCode = item;
				this.parentPopup.addChild(item.node);
			});
		} else {
			Global.InputRefCode.show();
		}
	},

	showCashOutPopup() {
		if (!MainPlayerInfo.phoneNumber) {
			this.showCommandPopup("Bạn cần xác thực số điện thoại trước");
			// this.textGift.placeholder = "Bạn cần xác thực số điện thoại trước";
			return;
		}
		if (Global.GameConfig.FeatureConfig.CashOutFeature == EFeatureStatus.Open) {
			if (Global.CashOut == null) {
				cc.resources.load("Popup/CashOutPopup", cc.Prefab, (err, prefab) => {
					let item = cc.instantiate(prefab).getComponent("CashOutPopup");
					item.show();
					this.parentPopup.addChild(item.node);
				});
			} else {
				Global.CashOut.show();
			}
		} else {
			Global.UIManager.showVipInfoPopup();
		}
	},

	showConfirmPopup(message, yesEvent, noEvent = null) {
		if (Global.ConfirmPopup == null) {
			cc.resources.load("Popup/ConfirmPopup", cc.Prefab, (err, prefab) => {
				let item = cc.instantiate(prefab).getComponent("ConfirmPopup");
				Global.ConfirmPopup = item;
				item.show(message, yesEvent, noEvent);
				this.parentPopup.addChild(item.node);
				item.node.zIndex = 999;
			});
		} else {
			Global.ConfirmPopup.show(message, yesEvent, noEvent);
		}
	},

	showConfirmPopupPO(message, yesEvent, noEvent = null) {
		if (Global.ConfirmPopupPO == null) {
			cc.resources.load("Popup/ConfirmPopupPO", cc.Prefab, (err, prefab) => {
				let item = cc.instantiate(prefab).getComponent("ConfirmPopup");
				Global.ConfirmPopupPO = item;
				item.show(message, yesEvent, noEvent);
				this.parentPopup.addChild(item.node);
				item.node.zIndex = 999;
			});
		} else {
			Global.ConfirmPopupPO.show(message, yesEvent, noEvent);
		}
	},

	showSetNamePopup(accountId, event) {
		cc.resources.load("Popup/SetNamePopup", cc.Prefab, (err, prefab) => {
			let item = cc.instantiate(prefab).getComponent("SetNamePopup");
			item.show(accountId, event);
			this.parentPopup.addChild(item.node);
		});
	},

	showShopPopup(statusShop, isInGame = false) {
		return;
		cc.log("======> isingame = ", isInGame, " config la : ", Global.GameConfig.FeatureConfig.CashinIngameFeature);
		if (isInGame && Global.GameConfig.FeatureConfig.CashinIngameFeature != EFeatureStatus.Open) return;

		if (Global.ShopPopup == null) {
			cc.resources.load("Popup/ShopPopup", cc.Prefab, (err, prefab) => {
				let item = cc.instantiate(prefab).getComponent("ShopPopup");
				Global.ShopPopup = item;
				item.show(statusShop);
				this.parentPopup.addChild(item.node);
			});
		} else {
			Global.ShopPopup.show(statusShop);
		}
	},

	showQuestPopup() {
		if (Global.QuestPopup == null) {
			cc.log("show quest 111");
			cc.resources.load("Popup/QuestPopup", cc.Prefab, (err, prefab) => {
				let item = cc.instantiate(prefab).getComponent("QuestPopup");
				Global.QuestPopup = item;
				item.show();
				this.parentPopup.addChild(item.node);
			});
		} else {
			cc.log("show quest 222");
			Global.QuestPopup.show();
		}
	},
	showVipInfoPopup() {
		if (Global.VipInfoPopup == null) {
			cc.resources.load("Popup/VipInfoPopup", cc.Prefab, (err, prefab) => {
				let item = cc.instantiate(prefab).getComponent("VipInfoPopup");
				Global.VipInfoPopup = item;
				item.show();
				this.parentPopup.addChild(item.node);
			});
		} else {
			Global.VipInfoPopup.show();
		}
	},
	showRuleGamePoker() {
		if (Global.RuleGamePoker == null) {
			cc.resources.load("Popup/RuleGamePoker", cc.Prefab, (err, prefab) => {
				let item = cc.instantiate(prefab).getComponent("RuleGamePoker");
				Global.RuleGamePoker = item;
				item.show();
				this.parentPopup.addChild(item.node);
			});
		} else {
			Global.RuleGamePoker.show();
		}
	},
	showSuportView() {
		if (Global.SuportView == null) {
			cc.resources.load("Popup/SuportView", cc.Prefab, (err, prefab) => {
				let item = cc.instantiate(prefab).getComponent("SuportView");
				Global.SuportView = item;
				item.show();
				this.parentPopup.addChild(item.node);
			});
		} else {
			Global.SuportView.show();
		}
	},

	showTournamentView(data = null) {
		if (Global.TournamentView == null) {
			cc.resources.load("Popup/TournamentView", cc.Prefab, (err, prefab) => {
				let item = cc.instantiate(prefab).getComponent("TournamentView");
				Global.TournamentView = item;
				this.parentPopup.addChild(item.node);
				if (data) item.show(data);
			});
		} else {
			if (data) Global.TournamentView.show(data);
		}
	},

	showLoginTabView() {
		if (Global.LoginTabView == null) {
			cc.resources.load("Popup/LoginTabView", cc.Prefab, (err, prefab) => {
				let item = cc.instantiate(prefab);
				this.parentPopup.addChild(item);
			})
		} else {
			Global.LoginTabView.show();
		}
	},

	showCashOutPartnerView() {
		if (Global.CashOutPartner == null) {
			cc.resources.load("Popup/CashOutPartner", cc.Prefab, (err, prefab) => {
				let item = cc.instantiate(prefab).getComponent("CashOutPartner");
				this.parentPopup.addChild(item.node);
				item.show();
			});
		} else {
			Global.CashOutPartner.show();
		}
	},

	showRegisterTabView() {
		if (Global.RegisterTabView == null) {
			cc.resources.load("Popup/RegisterTabView", cc.Prefab, (err, prefab) => {
				let item = cc.instantiate(prefab);
				this.parentPopup.addChild(item);
			});
		} else {
			Global.RegisterTabView.show();
		}
	},
	showMenuSettingView() {
		if (Global.MenuSettingView == null) {
			cc.resources.load("Popup/MenuSettingView", cc.Prefab, (err, prefab) => {
				let item = cc.instantiate(prefab).getComponent("MenuSettingView");
				Global.MenuSettingView = item;
				item.show();
				this.parentPopup.addChild(item.node);
			});
		} else {
			Global.MenuSettingView.show();
		}
	},
	showProfilePopup(idPlayer = null) {
		if (Global.ProfilePopup == null) {
			cc.resources.load("Popup/ProfilePopup", cc.Prefab, (err, prefab) => {
				let item = cc.instantiate(prefab).getComponent("ProfilePopup");
				Global.ProfilePopup = item;
				item.show(idPlayer);
				this.parentPopup.addChild(item.node);
			});
		} else {
			Global.ProfilePopup.show(idPlayer);
		}
	},

	showInfoPlayerCard(player) {
		if (Global.InfoPlayerView == null) {
			cc.resources.load("Popup/InfoPlayerView", cc.Prefab, (err, prefab) => {
				let item = cc.instantiate(prefab).getComponent("InfoPlayerView");
				item.init(player);
				this.parentPopup.addChild(item.node);
			});
		} else {
			Global.InfoPlayerView.init(player);
		}
	},
	showInfoPlayerCardPO(player) {
		if (Global.InfoPlayerViewPO == null) {
			cc.resources.load("Popup/InfoPlayerViewPO", cc.Prefab, (err, prefab) => {
				let item = cc.instantiate(prefab).getComponent("InfoPlayerView");
				item.init(player);
				this.parentPopup.addChild(item.node);
			});
		} else {
			Global.InfoPlayerViewPO.init(player);
		}
	},
	showInviteList() {
		if (Global.MoiChoi == null) {
			cc.resources.load("Popup/MoiChoi", cc.Prefab, (err, prefab) => {
				this.parentPopup.addChild(cc.instantiate(prefab));
				Global.MoiChoi.show();
			});
		} else {
			Global.MoiChoi.show();
		}
	},
	notShowInviteTalbe(isChecked) {
		this.isShowInviteTable = !isChecked;
		this.unschedule(this.funNotShowInvite);
		if (isChecked) {
			this.scheduleOnce(
				(this.funNotShowInvite = () => {
					this.isShowInviteTable = true;
				}),
				60 * 60
			);
		}
	},
	showInviteTable(info) {
		return;
		if (!this.isShowInviteTable || Global.GameView !== null || Global.FishCaMap !== null || Global.LobbyView === null) return;
		if (Global.InviteTablePush && Global.InviteTablePush.node.active) return;
		if (Global.InviteTablePush == null) {
			cc.resources.load("Popup/InviteTablePush", cc.Prefab, (err, prefab) => {
				this.parentPopup.addChild(cc.instantiate(prefab));
				Global.InviteTablePush.show(info);
			});
		} else {
			Global.InviteTablePush.show(info);
		}
	},
	showInfoTablePopup(data) {
		if (Global.InfoTablePopup == null) {
			cc.resources.load("Popup/InfoTable", cc.Prefab, (err, prefab) => {
				let item = cc.instantiate(prefab).getComponent("InfoTable");
				Global.InfoTablePopup = item;
				item.init(data);
				this.parentPopup.addChild(item.node);
			});
		} else {
			Global.InfoTablePopup.init(data);
		}
	},

	showWeeklyRewardPopup(status) {
		if (Global.WeeklyRewardPopup == null) {
			cc.resources.load("Popup/WeeklyRewardPopup", cc.Prefab, (err, prefab) => {
				let item = cc.instantiate(prefab).getComponent("WeeklyRewardPopup");
				Global.WeeklyRewardPopup = item;
				item.show(status);
				this.parentPopup.addChild(item.node);
			});
		} else {
			Global.WeeklyRewardPopup.show(status);
		}
	},

	showRewardPopup(status, content, func = null) {
		if (Global.GameView !== null) {
			if (status == STATUS_GIFT_POPUP.ATTENDANCE || status == STATUS_GIFT_POPUP.ONLINE || status == STATUS_GIFT_POPUP.VIP) {
				Global.listDelayReward.push(status);
				cc.log("chay vao push delay noti : ", Global.listDelayReward);
				return;
			}
		}
		if (Global.ShowRewardPopup == null) {
			cc.resources.load("Popup/ShowRewardPopup", cc.Prefab, (err, prefab) => {
				let item = cc.instantiate(prefab).getComponent("ShowRewardPopup");
				Global.ShowRewardPopup = item;
				this.parentPopupLogin.addChild(item.node);
				item.show(status, content, func);
				item.node.active = false;
			});
		}
	},

	handleReceivedFirstLogin(data, func = null) {
		if (Global.ShowRewardPopup === null) {
			cc.resources.load("Popup/ShowRewardPopup", cc.Prefab, (err, prefab) => {
				let item = cc.instantiate(prefab).getComponent("ShowRewardPopup");
				Global.ShowRewardPopup = item;
				this.parentPopupLogin.addChild(item.node);
				item.showRewardFirstLogin(data, func);
				item.node.active = false;
			});
		}
		// else {
		// 	this.parentPopupLogin.addChild(Global.ShowRewardPopup.node);
		// 	Global.ShowRewardPopup.node.active = false;
		//     Global.ShowRewardPopup.showRewardFirstLogin(data, func);
		// }
	},

	handleReceivedFinishQuest(data, func = null) {
		if (Global.ShowRewardPopup === null) {
			cc.resources.load("Popup/ShowRewardPopup", cc.Prefab, (err, prefab) => {
				let item = cc.instantiate(prefab).getComponent("ShowRewardPopup");
				Global.ShowRewardPopup = item;
				this.parentPopupLogin.addChild(item.node);
				item.showRewardFinishQuest(data, func);
				item.node.active = false;
			});
		}
		// else {
		// 	this.parentPopupLogin.addChild(Global.ShowRewardPopup.node);
		// 	Global.ShowRewardPopup.node.active = false;
		//     Global.ShowRewardPopup.showRewardFinishQuest(data, func);
		// }
	},

	showGiftCodePopup() {
		if (Global.GiftCodePopup == null) {
			cc.resources.load("Popup/GiftCodePopup", cc.Prefab, (err, prefab) => {
				let item = cc.instantiate(prefab).getComponent("GiftCodePopup");
				Global.GiftCodePopup = item;
				item.show();
				this.parentPopup.addChild(item.node);
			});
		} else {
			Global.GiftCodePopup.show();
		}
	},

	showSettingPopup() {
		if (Global.SettingPopup == null) {
			cc.resources.load("Popup/SettingPopup", cc.Prefab, (err, prefab) => {
				let item = cc.instantiate(prefab).getComponent("SettingPopup");
				Global.SettingPopup = item;
				item.show();
				this.parentPopup.addChild(item.node);
			});
		} else {
			Global.SettingPopup.show();
		}
	},

	showLeaguePopup() {
		if (Global.LeaguePopup == null) {
			cc.resources.load("Popup/LeaguePopup", cc.Prefab, (err, prefab) => {
				let item = cc.instantiate(prefab).getComponent("LeaguePopup");
				Global.LeaguePopup = item;
				item.show();
				this.parentPopup.addChild(item.node);
			});
		} else {
			Global.LeaguePopup.show();
		}
	},

	showLuckySpinPopup(listResult, currentSpin) {
		return;
		if (Global.LuckySpinPopup == null) {
			cc.assetManager.loadBundle(GAME_TYPE.LUCKY_WHEEL.toString(), (err, bundle) => {
				if (err) return;
				bundle.load("LuckySpinPopup", cc.Prefab, (err, prefab) => {
					if (err) return;
					Global.LuckySpinPopup = cc.instantiate(prefab).getComponent("LuckySpinPopup");
					Global.LuckySpinPopup.show(listResult, currentSpin);
					this.parentPopup.addChild(Global.LuckySpinPopup.node);
				});
			});
		} else {
			Global.LuckySpinPopup.show(listResult, currentSpin);
		}
	},

	showMailPopup() {
		if (Global.MailPopup == null) {
			cc.resources.load("Popup/MailPopup", cc.Prefab, (err, prefab) => {
				let item = cc.instantiate(prefab).getComponent("MailPopup");
				Global.MailPopup = item;
				item.show();
				Global.UIManager.parentPopup.addChild(item.node);
			});
		} else {
			Global.MailPopup.show();
		}
	},

	showPopupDienThongTin() {
		if (Global.DienThongTin == null) {
			cc.resources.load("Popup/ThongTinCaNhan", cc.Prefab, (err, prefab) => {
				let item = cc.instantiate(prefab).getComponent("DienThongTin");
				Global.DienThongTin = item;
				item.show();
				this.parentPopup.addChild(item.node);
			});
		} else {
			Global.DienThongTin.show();
		}
	},

	showItemNewsPopup(event, data) {
		if (Global.NewsPopup == null) {
			cc.resources.load("Popup/NewsPopup", cc.Prefab, (err, prefab) => {
				let item = cc.instantiate(prefab).getComponent("NewsPopup");
				Global.NewsPopup = item;
				item.show(event, data);
				Global.UIManager.parentPopup.addChild(item.node);
			});
		} else {
			Global.NewsPopup.show(event, data);
		}
	},

	showEventPopup(status, isClick = true) {
		if (Global.EventPopup == null) {
			cc.resources.load("Popup/EventPopup", cc.Prefab, (err, prefab) => {
				let item = cc.instantiate(prefab).getComponent("EventPopup");
				item.show(status, isClick);
				this.parentPopup.addChild(item.node);
			});
		} else {
			Global.EventPopup.show(status, isClick);
		}
	},

	showEventRanking(status, isClick = true) {
		if (Global.EventRanking == null) {
			cc.resources.load("Popup/EventRanking", cc.Prefab, (err, prefab) => {
				let item = cc.instantiate(prefab).getComponent("EventRanking");
				Global.EventRanking = item;
				item.show(status, isClick);
				this.parentPopup.addChild(item.node, 10);
				item.initView();
			});
		} else {
			Global.EventRanking.show(status, isClick);
		}
	},

	showShopDiamondPopup(listData, diamondBalance) {
		// if (Global.ShopDiamondPopup == null) {
		// 	cc.resources.load("Popup/ShopDiamondPopup", cc.Prefab, (err, prefab) => {
		// 		let item = cc.instantiate(prefab).getComponent("ShopDiamondPopup");
		// 		Global.ShopDiamondPopup = item;
		// 		item.show(listData, diamondBalance);
		// 		this.parentPopup.addChild(item.node);
		// 	})
		// } else {
		// 	Global.ShopDiamondPopup.show(listData, diamondBalance);
		// }
	},

	// showHelpPopup() {
	// 	if (Global.HelpPopup == null) {
	// 		cc.resources.load("Popup/HelpPopup", cc.Prefab, (err, prefab) => {
	// 			let item = cc.instantiate(prefab).getComponent("HelpPopup");
	// 			Global.HelpPopup = item;
	// 			item.show();
	// 			this.parentPopup.addChild(item.node);
	// 		})
	// 	} else {
	// 		Global.HelpPopup.show();
	// 	}
	// },

	showHistoryPopup() {
		if (Global.HistoryPopup == null) {
			cc.resources.load("Popup/HistoryPopup", cc.Prefab, (err, prefab) => {
				let item = cc.instantiate(prefab).getComponent("HistoryPopup");
				Global.HistoryPopup = item;
				item.show();
				this.parentPopup.addChild(item.node);
			});
		} else {
			Global.HistoryPopup.show();
		}
	},

	showRankPopup() {
		if (Global.RankPopup == null) {
			cc.resources.load("Popup/RankPopup", cc.Prefab, (err, prefab) => {
				let item = cc.instantiate(prefab).getComponent("RankPopup");
				Global.RankPopup = item;
				item.show();
				this.parentPopup.addChild(item.node);
			});
		} else {
			Global.RankPopup.show();
		}
	},

	showFAQ() {
		if (Global.FAQ == null) {
			cc.resources.load("Popup/FAQ", cc.Prefab, (err, prefab) => {
				let item = cc.instantiate(prefab).getComponent("FAQ");
				Global.FAQ = item;
				item.show();
				this.parentPopup.addChild(item.node);
			});
		} else {
			Global.FAQ.show();
		}
	},

	showServerRewardPopup(content, currentspin, coin) {
		if (Global.ServerRewardPopup == null) {
			cc.resources.load("Popup/ServerRewardPopup", cc.Prefab, (err, prefab) => {
				let item = cc.instantiate(prefab).getComponent("ServerRewardPopup");
				Global.ServerRewardPopup = item;
				item.show(content, currentspin, coin);
				this.parentPopup.addChild(item.node);
			});
		} else {
			Global.ServerRewardPopup.show(content, currentspin, coin);
		}
	},

	showBannerPopup() {
		if (Global.BannerPopup == null) {
			cc.resources.load("Popup/Banner", cc.Prefab, (err, prefab) => {
				let item = cc.instantiate(prefab).getComponent("Banner");
				Global.BannerPopup = item;
				this.parentPopup.addChild(item.node);
				item.show();
			});
		} else {
			Global.BannerPopup.show();
		}
	},

	onShowTopView(typeRank) {
		if (Global.TopView === null) {
			cc.resources.load("Popup/TopView", cc.Prefab, (err, prefab) => {
				let item = cc.instantiate(prefab).getComponent("TopView");
				Global.TopView = item;
				this.parentPopup.addChild(item.node);
				item.show(typeRank);
			});
		} else {
			Global.TopView.show(typeRank);
		}
	},

	onShowJackPotView() {
		if (Global.JackPotView === null) {
			cc.resources.load("Popup/JackPotView", cc.Prefab, (err, prefab) => {
				let item = cc.instantiate(prefab).getComponent("JackPotView");
				Global.JackPotView = item;
				this.parentPopup.addChild(item.node);
				item.show();
			});
		} else {
			Global.JackPotView.show();
		}
	},

	showPromotion() {
		if (Global.PromotionView === null) {
			cc.resources.load("Popup/PromotionPopup", cc.Prefab, (err, prefab) => {
				let item = cc.instantiate(prefab).getComponent("PromotionPopup");
				Global.PromotionView = item;
				this.parentPopup.addChild(item.node);
				item.show();
			});
		} else {
			Global.PromotionView.show();
		}
	},

	showPromotionFirstCashIn() {
		if (Global.FirstCashIn === null) {
			cc.resources.load("Popup/FirstCashIn", cc.Prefab, (err, prefab) => {
				let item = cc.instantiate(prefab).getComponent("FirstCashIn");
				Global.FirstCashIn = item;
				this.parentPopupLogin.addChild(item.node);
				item.show();
				item.node.active = false;
				console.log(" chay vao firstcashin popup ");
			});
		}
		// else{
		// 	this.parentPopupLogin.addChild(Global.FirstCashIn.node);
		// 	Global.FirstCashIn.node.active = false;
		// 	Global.FirstCashIn.show();
		// }
	},

	showPassWordPopup() {
		if (Global.PassWordPopup === null) {
			cc.resources.load("Popup/PassWordPopup", cc.Prefab, (err, prefab) => {
				let item = cc.instantiate(prefab).getComponent("PassWordPopup");
				Global.PassWordPopup = item;
				this.parentPopup.addChild(item.node);
				item.show();
			});
		} else {
			Global.PassWordPopup.show();
		}
	},

	closeAllPopup() {
		for (let i = 0; i < this.parentPopup.children.length; i++) {
			const popup = this.parentPopup.children[i];
			if (popup) {
				popup.active = false;
			}
		}

		for (let i = 0; i < this.parentPopupLogin.children.length; i++) {
			const popup = this.parentPopupLogin.children[i];
			if (popup) {
				popup.active = false;
			}		
		}
	},

	onDisconnect() {
		let children = this.parentPopup.children;
		for (let i = 0, l = children.length; i < l; i++) {
			if (children[i].name != "Dialog") children[i].active = false;
		}
	},

	HideShopPopup() {
		if (Global.ShopPopup != null && Global.ShopPopup.node.active == true) Global.ShopPopup.onClickClose();
	},

	showMiniLoading() {
		this.isCountTime = true;
		this.countTimeOut = 0;
		this.miniLoading.active = true;
	},

	hideMiniLoading() {
		this.isCountTime = false;
		this.miniLoading.active = false;
	},

	showLoading() {
		this.isCountTime = true;
		this.countTimeOut = 0;
		this.loading.node.active = true;
		this.loading.setFrogress(0);
	},
	progressLoading(per) {
		if (isNaN(per)) return;
		this.loading.setFrogress(per);
	},
	hideLoading() {
		this.isCountTime = false;
		this.loading.node.active = false;
	},

	showAlertMini(text) {
		this.animAlert.getComponentInChildren(cc.Label).string = text;
		this.animAlert.play();
	},
	ShowTogetherConfirmMessenge(content, confirmCode) {
		//0-NONE, 1-SHOW_SHOP, 2-DEFAULT, 3-CLOSE_SHOP, 4-OUT_GAME, 5-SHOW_MAIL
		if (confirmCode == 5) {
			if (Global.GameConfig.FeatureConfig.MailFeature != EFeatureStatus.Open) return;
		}
		let actionCall = null;
		let actionCancle = null;
		let isShowConfirm = false;
		switch (confirmCode) {
			case 1: //show shop
				actionCall = () => {
					this.showShopPopup(STATUS_SHOP.CARD_IN);
				};
				actionCancle = this.CallLeave.bind(this);
				isShowConfirm = true;
				break;
			case 0: //none
				actionCall = this.CallLeave.bind(this);
				isShowConfirm = false;
				break;
			case 2: //default
				actionCall = null;
				isShowConfirm = false;
				break;
			case 3: //close shop
				actionCall = this.HideShopPopup;
				isShowConfirm = false;
				break;
			case 4: //out game
				actionCall = this.OutGame;
				isShowConfirm = false;
				break;
			case 5: //show mail
				actionCall = this.showMailPopup;
				isShowConfirm = true;
				break;
			default:
				actionCall = null;
				break;
		}
		if (isShowConfirm) {
			this.showConfirmPopup(content, actionCall, actionCancle);
		} else {
			let contentText = content;
			if (MyLocalization.GetText(content)) contentText = MyLocalization.GetText(content);
			this.showCommandPopup(contentText, actionCall);
		}
	},

	CallLeave() {
		if (require("ScreenManager").getIns().currentScreen == SCREEN_CODE.INGAME_KILL_BOSS && Global.NetworkManager._connect.connectionState === "Connected") {
			require("SendRequest").getIns().MST_Client_LeaveRoom();
		} else {
			require("ScreenManager").getIns().LoadScene(SCREEN_CODE.LOBBY);
		}
	},

	CheckHideMiniGame() {
		if (Global.TaiXiu) {
			if (Global.TaiXiu.node.active) {
				Global.TaiXiu.onClickClose();
			}
		}
	},

	OutGame() {
		cc.log("chay vao out game")
		cc.game.end();
		// if (Global.NetworkManager._connect.connectionState === "Connected") {
		// 	Global.NetworkManager.OnDisconnect();
		// }
		// require("ScreenManager").getIns().LoadScene(SCREEN_CODE.LOBBY);
	},

	addEventHideTime(component) {
		if (this._listCpNeedTime.indexOf(component) === -1) {
			this._listCpNeedTime.push(component);
		}
	},
	removeEventHideTime(component) {
		let index = this._listCpNeedTime.indexOf(component);
		if (index > -1) {
			this._listCpNeedTime.splice(index, 1);
		}
	},

	onEventEnter(fun) {
		this.listEventEnter.unshift(fun);
	},
	offEventEnter(fun) {
		let index = this.listEventEnter.indexOf(fun);
		if (index != -1) this.listEventEnter.splice(index, 1);
	},

	checkShowMiniGame(cp, isResetPosition) {
		let length = this.parentMiniGame.childrenCount;
		let isReturn = false;
		for (let i = 0; i < length; i++) {
			if (this.parentMiniGame.children[i] == cp.node) {
				isReturn = true;
			} else {
				try {
					this.parentMiniGame.children[i].getComponent("DragMiniGame").miniSize()
				} catch (error) {
					cc.log(" ==============> loi checkShowMiniGame")
				}
			}
		}
		if (cp.node.parent != null) {
			cp.node.setSiblingIndex(length - 1);
		}
		if (isResetPosition) cp.node.position = cc.v2(0, 0);
		return isReturn;
	},

	initConfigBundle() {
		let data = cc.sys.localStorage.getItem("configBundle");
		if (data != null && data != "") {
			let obj = JSON.parse(data);
			verChildGame = obj.VerGame || verChildGame;
			LIST_REMOVE_BUNDLE_GAME = obj.ListRemoveBundleGame || {};
			LIST_VERSION_REMOVE = obj.ListVersionRemove || [];
			if (Global.ConfigScene) Global.ConfigScene.checkListVerRemove();
			cc.log("data config nhan duoc " + data);
		}
	},
	getConfigBundle() {
		if (!cc.sys.isNative) return;
		let http = cc.loader.getXMLHttpRequest();
		http.open("GET", linkConfig, true);
		http.setRequestHeader("Content-Type", "application/json");
		http.onreadystatechange = () => {
			//Call a function when the state changes.
			if (http.readyState === 4 && http.status >= 200 && http.status < 300) {
				let obj = JSON.parse(http.responseText);
				if (obj == null) return;
				cc.sys.localStorage.setItem("configBundle", http.responseText);
				this.initConfigBundle();
			}
		};
		http.send();
	},
	onDestroy() {
		Global.UIManager = null;
		cc.log("onDestroy UIManager");
	},

	update(dt) {
		if (this.isCountTime) {
			this.countTimeOut += dt;
			if (this.countTimeOut >= 30) {
				this.countTimeOut = 0;
				this.hideMiniLoading();
				this.hideLoading();
				this.showCommandPopup(MyLocalization.GetText("NOT_LOAD_INFO"));
			}
		}
	},

	checkAssets(gameType, isForcePlay = false) {
		return false; // fix cung
		if (!cc.sys.isNative || cc.sys.os == cc.sys.OS_WINDOWS) return false;
		let updateAssetManager = new UpdateAssetManager();
		if (updateAssetManager.updateAsset(gameType)) {
			this.removeDownload(gameType);
			let funFinish = () => {
				this.removeDownload(gameType);
				this.objGameWating[gameType] = false;
				updateAssetManager.onDestroyClass();

				MainPlayerInfo.CurrentGameCode = Global.getGameTypeById(gameType);
				MainPlayerInfo.CurrentGameId = Global.getGameIdByName(MainPlayerInfo.CurrentGameCode);
				Global.nodeInOutToRight(Global.LobbyView.nodePlayNow, null);
				Global.nodeInOutToLeft(null, Global.LobbyView.nodeMiddle);
				Global.LobbyView.nodeSuggestGame.active = false;

				if (Global.IsNewUser) {
					cc.log("check today mission : ", Global.TodayMission);
					if (Global.TodayMission && MainPlayerInfo.CurrentGameCode === "TMN") {
						Global.UIManager.showConfirmPopup(Global.TodayMission.MissionDescription, () => {
							let msg = {};
							msg[AuthenticateParameterCode.GameId] = MainPlayerInfo.CurrentGameCode;
							msg[AuthenticateParameterCode.Blind] = 0;
							cc.log("send ow itemlobby : ", msg);
							require("SendCardRequest").getIns().MST_Client_Join_Game(msg);
							Global.UIManager.showMiniLoading();
						});
					} else {
						Global.UIManager.showConfirmPopup("Chưa có nhiệm vụ hiện tại");
					}
				}

				Global.LobbyView.setIconGame();
			};
			if (isForcePlay) {
				let funProgress = null;
				funProgress = (per) => {
					Global.UIManager.progressLoading(per / 100);
				};
				updateAssetManager.initProgress(funProgress, funFinish);
			} else {
				updateAssetManager.initProgress(this.downloadProgress(gameType), funFinish);
			}
			updateAssetManager.checkUpdate();
			return true;
		} else {
			return false;
		}
	},
	getBundleAndInitGame(gameType, funProgress, funFinish) {
		cc.log("checjj assts : ")
		cc.log("checjj assts : ", this.checkAssets(gameType))
		if (this.checkAssets(gameType)) return;
		let str = "";
		let strGame = "";
		let component = "";
		switch (gameType) {
			case GAME_TYPE.TAI_XIU:
				str = "TaiXiu";
				strGame = "TaiXiu";
				component = "TaiXiu";
				break;
			case GAME_TYPE.TLMN:
				str = "TLMN"; // ten cua no trong thu muc
				strGame = "TLMNView"; // ten cua global
				component = "TLMNView";
				break;
			case GAME_TYPE.SAM:
				str = "Sam"; // ten cua no trong thu muc
				strGame = "SamView"; // ten cua global
				component = "SamView";
				break;

			case GAME_TYPE.LODE:
				str = "LoDe"; // ten cua no trong thu muc
				strGame = "LoDe"; // ten cua global
				component = "LoDeView";
				break;

			case GAME_TYPE.XOCDIA:
				str = "XocDiaView"; // ten cua no trong thu muc
				strGame = "XocDia"; // ten cua global
				component = "XocDiaView";
				break;

			case GAME_TYPE.MINI_POKER:
				str = "MiniPoker"; // ten cua no trong thu muc
				strGame = "MiniPoker"; // ten cua global
				component = "MiniPokerView";
				break;

			case GAME_TYPE.MINI_SLOT:
				str = "MiniSlot";
				strGame = "MiniSlot";
				component = "MiniSlotView";
				break;
		}

		if (LIST_GAME_ASSET.includes(gameType)) {
			cc.resources.load(
				str,
				cc.Prefab,
				(count, total) => {
					if (funProgress) {
						let per = parseInt(count / total) * 100;
						funProgress(per);
					}
				},
				(err, prefab) => {
					if (err) {
						cc.log(err);
						return;
					}
					Global[strGame] = cc.instantiate(prefab).getComponent(component);
					funFinish(Global[strGame]);
					this.removeDownload(gameType);
				}
			);
		} else {
			cc.log("chay vao load bundle")
			cc.assetManager.loadBundle(gameType.toString(), (err, bundle) => {
				if (err) {
					return cc.log("loi roi nay " + err);
				}
				bundle.load(
					str,
					cc.Prefab,
					(count, total) => {
						if (funProgress) {
							let per = parseInt(count / total) * 100;
							funProgress(per);
						}
					},
					(err, prefab) => {
						if (err) return;
						Global[strGame] = cc.instantiate(prefab).getComponent(component);
						funFinish(Global[strGame]);
						this.removeDownload(gameType);
					}
				);
			});
		}
	},

	onClickOpenMiniGame(gameType) {
		let funFinish = (component) => {
			if (!this.checkShowMiniGame(component, false)) {
				component.node.parent = this.parentMiniGame;
				if (!component.isMinimizeGame) component.startGame();
				component.isMinimizeGame = false;
				this.hideMiniLoading();
			}
		};
		
		if (Global.XocDia == null) {
			cc.log("chay vao day 1222", gameType)
			this.getBundleAndInitGame(gameType, this.downloadProgress(gameType), funFinish);
		} else {
			funFinish(Global.XocDia);
		}
	},

	onClickOpenBigGame(gameType, isForcePlay = false) {
		console.log("check click game type : ", gameType);
		console.log("check list game type : ", this.objGameWating[gameType]);
		if (this.objGameWating[gameType]) return true;
		this.objGameWating[gameType] = true;

		let retun = this.checkAssets(gameType, isForcePlay);
		console.log("gia tri return " + retun);
		if (!retun) this.objGameWating[gameType] = false;
		return retun;
	},
	downloadProgress(gameType) {
		return null;
		let itemIconGame = null;
		let nodeProgress = null;
		let nodeProgressTamThoi = null;

		if (Global.LobbyView) {
			itemIconGame = Global.LobbyView.nodeGameList.getChildByName(gameType.toString());
		}

		if (itemIconGame != null) {
			nodeProgress = cc.instantiate(this.prefabDownload).getComponent("DownloadProgress");
			nodeProgress.node.name = "ProgressDownload";
			itemIconGame.addChild(nodeProgress.node);
		}

		if (Global.LobbyView.nodeSuggestGame.getChildByName("21")) {
			nodeProgressTamThoi = cc.instantiate(this.prefabDownload).getComponent("DownloadProgress");
			nodeProgressTamThoi.node.name = "ProgressDownload";
			Global.LobbyView.nodeSuggestGame.getChildByName("21").addChild(nodeProgressTamThoi.node);
		}

		let fun = (per) => {
			console.log("phan tram tai dc la : ", per);
			if (nodeProgress != null) {
				nodeProgress.setPercent(per);
			}

			if (nodeProgressTamThoi != null) {
				nodeProgressTamThoi.setPercent(per);
			}
		};

		return fun;
	},
	removeDownload(gameType) {
		return;
		let itemIconGame = null;
		if (Global.LobbyView) {
			itemIconGame = Global.LobbyView.nodeGameList.getChildByName(gameType.toString());
		}
		if (itemIconGame != null) {
			let nodeDel = itemIconGame.getChildByName("ProgressDownload");
			if (nodeDel != null) {
				nodeDel.destroy();
			}
		}
	},

	showMask() {
		this.mask.active = true;
	},

	hideMask() {
		this.mask.active = false;
	},

	emitNewData() {
		for (let i = 0, l = this.listNodeActiveByConfig.length; i < l; i++) {
			this.listNodeActiveByConfig[i].emitNewData();
		}
	},
	dangKyNodeActiveByConfig(component) {
		if (!this.listNodeActiveByConfig.includes(component)) this.listNodeActiveByConfig.push(component);
	},
	huyDangKyNodeActiveByConfig(component) {
		let index = this.listNodeActiveByConfig.indexOf(component);
		if (index > -1) this.listNodeActiveByConfig.splice(index, 1);
	},
});
