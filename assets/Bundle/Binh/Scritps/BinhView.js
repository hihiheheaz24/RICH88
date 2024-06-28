var TypeAnTrang = {
	BA_SANH: 0,
	BA_THUNG: 1,
	SAU_DOI: 2,
	NAM_DOI_1_XAM: 3,
	DONG_MAU: 4,
	SANH_RONG: 5,
	RONG_CUON: 6,
	UNKNOWN: 7,
};
cc.Class({
	extends: require("GameView"),

	ctor() {
		this.players = [null, null, null, null];
		this.players1 = [null, null, null, null];
		this.countPlayer = 0;
		this.isMe = null;
		this.isNeedResetPosition = false;
		this.stateTable = 0;
		this.isThoatBan = true;
		this.turnTime = 0;
		this.isNeedResetGame = true;
		this.timeTest = 0;
		this.isCompareAt = false;
		this.time_enter_background = 0;
		this.isClickXepXong = false;
		this.isClickBaoMauBinh = false;
		this.isPlaying = false;
		this.countScreenShot = 0;
		this.countIsPlaying = 0;
		this.dataEndGame = null;
		this.countInitTable = 0;
		this.isSwapOK = true;
		this.isEndGame = false;
		this.isMauBinh_2User = false;
		this.isToiTrang = false;
		this.isBinhLung = false;
		this.checkBinhLung = false;
		this.isBinhLung_2User = false;
		this.blockShowPointChi = false;
		this.listPlayerWin = [];
		this.listLoseSapHam = [];
		this.listLoseBinhLung = [];
		this.listLoseBatSapLang = [];
		this.listArrLoseSapHam = [];
		this.listWinSapHam = [];
		this.listWinType = [];
		this.listWinBinhLung = [];
		this.listPlayer = [];
		this.listTypeWinPlayer = [];
		this.listWinTypeBL = [];
		this.listMoneyEndGame = [];
		this.listCashEndGame = [];
		this.isSapHam = false;
		this.isBatSapLang = false;
		this.isBanLan2 = false;
		this.isBanLan3 = false;
		this.isBanLan1 = false;
	},

	properties: {
		pool: require("PoolControllerBinh"),
		cardController: require("CardControllerBinh"),
		chatController: require("ChatController"),
		selectTable: require("SelectTable"),
		listPos: [cc.Vec2],
		listPosClockTime: [cc.Vec2],
		lbTableBet: cc.Label,
		banNumber: cc.Label,
		betsNumber: cc.Label,
		lbTableId: cc.Label,
		parentPlayer: cc.Node,
		parentChip: cc.Node,
		parentEffect: cc.Node,
		lbNoti: cc.Label,
		lbTimeCountDown: cc.Label,
		timeCountDownGroup: cc.Node,
		nodeClockTime: cc.Node,
		panelResult: cc.Node,
		parentSpiteTypeWin: cc.Node,
		btnMauBinh: cc.Button,
		betsNumberAndTableId: cc.Label,
		iconRoiban: cc.Node,
		clockAnim: sp.Skeleton,
		btnXepXong: cc.Node,
		maskShowScreen: cc.Node,
		btnNhiemVu: cc.Node,
		btnMenuGame: cc.Node,
		posTagetGoldFly: cc.Node,
		parentGoldFly: cc.Node,
	},

	onLoad() {
		this._super();
		// for (let i = 0; i < this.listPos.length; i++) {
		// 	const objPos = this.listPos[i];
		// 	if (cc.winSize.width / 1080 > 1) {
		// 		objPos.x = objPos.x * (cc.winSize.width / 1080);
		// 	}
		// }
		// if (Global.LeagueData) {
		// 	this.btnLeague.active = true;
		// } else {
		// 	this.btnLeague.active = false;
		// }

		Global.BinhView = this;
		this.node.setContentSize(cc.winSize);
		this.chatController.initCardView(this);
		this.chatController.gameView = this;
		this.panelResult.active = false;

		this.listEvtTest = [];
		this.listEvtTest.push(
			`{"0":0,"2":0,"3":0,"5":"MAB1","10":100,"11":1,"12":[{"Position":0,"NickName":"Player1037","Cash":20000,"AccountId":1037,"HandCards":[],"NumberOfCards":0,"IsReady":true,"TotalScore":0,"WinLoseCash":0,"SuggestPlan":[]},{"Position":2,"NickName":"hahahaha","Cash":0,"AccountId":1014,"HandCards":[],"NumberOfCards":0,"IsReady":false,"TotalScore":0,"WinLoseCash":0,"SuggestPlan":[]}],"37":0,"38":0,"43":30}`
		);

		this.listEvtTest.push(`{"0":1,"2":0,"5":"SBI11","10":5,"16":20000,"18":"MAB","35":2000}`);
		this.listEvtTest.push(`{"0":0,"2":0,"3":0,"4":"","5":"SBI4","15":0,"16":20000,"18":"MAB","35":20000}`);
		this.listEvtTest.push(`{"0":1,"2":0,"5":"MAB13","43":5}`);
		this.listEvtTest.push(
			`{"0":1,"2":0,"5":"MAB14","12":[{"Position":0,"NickName":"Player1037","Cash":20000,"AccountId":0,"HandCards":[101,110,120,130,140,141,21,32,41,52,111,70,122],"NumberOfCards":13,"IsReady":false,"TotalScore":0,"WinLoseCash":0,"SuggestPlan":[]},{"Position":2,"NickName":"hahahaha","Cash":20000,"AccountId":2,"HandCards":[],"NumberOfCards":13,"IsReady":false,"TotalScore":0,"WinLoseCash":0,"SuggestPlan":[{"Name":"Đôi - Mậu thầu - Mậu thầu","Cards":[23,50,53,101,141,93,113,123,140,130,111,70,122]},{"Name":"Mậu thầu - Mậu thầu - Đôi","Cards":[23,101,70,141,93,113,123,130,50,53,140,111,122]},{"Name":"Mậu thầu - Mậu thầu - Thú","Cards":[23,70,122,101,141,93,123,130,50,53,140,113,111]},{"Name":"Đôi - Mậu thầu - Sảnh","Cards":[23,50,53,141,93,113,123,70,101,140,130,111,122]},{"Name":"Mậu thầu - Mậu thầu - Thùng","Cards":[50,101,140,141,130,111,70,122,23,93,53,113,123]},{"Name":"Đôi - Đôi - Đôi","Cards":[23,50,53,101,141,140,113,70,93,123,130,111,122]},{"Name":"Mậu thầu - Đôi - Thú","Cards":[23,93,70,101,141,140,123,130,50,53,113,111,122]},{"Name":"Đôi - Đôi - Sảnh","Cards":[23,50,53,141,140,113,123,70,101,93,130,111,122]},{"Name":"Mậu thầu - Đôi - Thùng","Cards":[50,101,70,141,140,130,111,122,23,93,53,113,123]},{"Name":"Mậu thầu - Thú - Thú","Cards":[23,93,70,50,141,53,140,130,101,113,123,111,122]}]}],"43":30}`
		);
		this.listEvtTest.push(
			`{"0":1,"2":0,"5":"MAB16","12":[{"Position":0,"NickName":"Player1037","HandCards":[112,21,121,41,42,31,30,71,143,142,62,61,63],"Chi1Type":1,"Chi1Score":1,"Chi2Type":3,"Chi2Score":1,"Chi3Type":7,"Chi3Score":1,"IsCompareAt":false,"ComPareAtScore":0,"TotalScore":3,"WinType":4,"WinLoseCash":294,"ToiTrangType":7},{"Position":2,"NickName":"hahahaha","HandCards":[23,50,101,141,93,53,140,113,123,130,111,70,122],"Chi1Type":1,"Chi1Score":-1,"Chi2Type":2,"Chi2Score":-1,"Chi3Type":2,"Chi3Score":-1,"IsCompareAt":false,"ComPareAtScore":0,"TotalScore":-3,"WinType":2,"WinLoseCash":-300,"ToiTrangType":7}]}`
		);
		// this.listEvtTest.push(``);

		this.indexClick = 0;
		// this.turnTime = 20;
		// this.activeClockAndRun()

		if (MainPlayerInfo.nickName == "anhtrongbn99" || MainPlayerInfo.nickName == "anhtrongbn992") {
			let node = cc.find("NodeTestCard", this.node);
			if (node) node.active = true;
		}
		let fixingStatus = cc.sys.localStorage.getItem("Fixing_Status");
		// if (fixingStatus == 0) {
		// 	Global.UIManager.showFixingScreen();
		// }
	},
	start() {
		this.onEvent();
	},
	onEvent() {
		for (let i = 0; i < this.players.length; i++) {
			let player = this.players[i];
			if (player) {
				player.node.on("chip da gom het vao giua", this.showEffectGoldFlyToPlayerWin, this);
			}
		}
	},
	showEffectGoldFlyToPlayerWin() {
		// cc.log("show gold fly to player win");
	},
	initBg_cardsGroup() { },
	getPlayerWithName(namePlayer) {
		for (let i = 0; i < this.players.length; i++) {
			let player = this.players[i];
			if (player) {
				if (player.fullName === namePlayer) return player;
			}
		}
		return null;
	},

	onEventShow(time_out_bg) {
		// cc.log("chay vao event show nay Binh");
		if (time_out_bg > 0) {
			this.resetWithLeaveGame(time_out_bg);
			MainPlayerInfo.CurrentTableId = this.tableId;
			require("SendCardRequest").getIns().MST_Client_BINH_Get_Table_Info();
		}
	},

	onClickTest() {
		return;
		this.cardController.showCardWinWhite(6, [140, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130], 2);
		return;
		cc.log("str data: " + this.listEvtTest[this.indexClick]);
		let obj = JSON.parse(this.listEvtTest[this.indexClick]);
		this.OnServerResponse(obj[5], obj);
		this.OnServerPush(obj[5], obj);
		this.indexClick++;
	},
	onDestroy() {
		cc.Tween.stopAllByTarget(this.node);
		this._super();
		Global.BinhView = null;
		Global[MainPlayerInfo.CurrentGameCode + this.tableId] = null;
	},
	initGame(data) {
		this.mePosition = data[TMN_ParameterCode.Position];
		this.tableId = data[TMN_ParameterCode.TableId];
		MainPlayerInfo.CurrentTableId = this.tableId;
		require("SendCardRequest").getIns().MST_Client_BINH_Get_Table_Info();
	},
	onClickMoiChoi() {
		Global.UIManager.showInviteList();
	},
	onClickShowMenu() {
		if (Global.GroupMenuInGameCard == null) {
			// cc.log("Global.GroupMenuInGameCard == null");
			let menuNode = cc.instantiate(this.groupMenuInGame);
			let item = menuNode.getComponent("GroupMenuInGameCard");
			this.node.addChild(menuNode);
		} else {
			// cc.log("Global.GroupMenuInGameCard != null");
			this.node.addChild(Global.GroupMenuInGameCard.node);
		}
	},

	OnServerResponse(code, packet) {
		// chỗ này là send lên thì mới bắn về
		//  cc.log("TLMN response : === Code===" + code + "====Packet===" + JSON.stringify(packet));
		switch (code) {
			case CODE_RUN.BINH_TABLE_INFO:
				this.countInitTable++;
				if (this.countInitTable == 1) {
					// cc.log("init table reconnect");
					this.initTable(packet);
				}
				this.scheduleOnce(function () {
					this.countInitTable = 0;
				}, 0.5);
				break;
			case CODE_RUN.TLMN_FOLD_RESPONSE:
				if (packet[ParameterCode.ErrorCode] != 0) {
					this.showNoti(packet[ParameterCode.ErrorMsg]);
				}
				break;
			case CODE_RUN.BINH_LEAVE_TABLE:
				this.reviceDangKyThoat(packet);
				break;
			case CODE_RUN.BINH_APPLY_CHI:
				if (packet[ParameterCode.ErrorCode] != 0) {
					this.showNoti(packet[ParameterCode.ErrorMsg]);
				}
				break;
			case CODE_RUN.TLMN_READY_RESPONSE:
				break;

			default:
				break;
		}
	},
	OnServerPush(code, packet) {
		// chỗ này là server tự động bắn về
		// cc.log("TLMN push : === Code===" + code + "====Packet===" + JSON.stringify(packet));
		switch (code) {
			case CODE_RUN.BINH_PUSH_JOIN_GAME_FOR_OTHER:
				this.otherJoinTable(packet);
				break;
			case CODE_RUN.BINH_PUSH_LEAVE_TABLE:
				this.otherLeaveTable(packet);
				break;
			case CODE_RUN.BINH_PUSH_APPLY_CHI:
				this.onPlayerXepXong(packet);
				break;
			case CODE_RUN.BINH_PUSH_START_GAME:
				this.scheduleOnce(
					(this.StartGame = () => {
						this.startGame(packet);
					}),
					1
				);

				break;
			case CODE_RUN.BINH_PUSH_START_COUNTDOWN:
				cc.log("check count down start ,", packet)
				this.countDownStartGame(packet);
				break;

			case CODE_RUN.BINH_PUSH_END_GAME:
				this.stateTable = StateTable.Endgame;
				this.scheduleOnce(
					(this.EndGame = () => {
						this.endGame(packet);
					}),
					1
				);

				break;

			default:
				break;
		}
	},
	startGame(data) {
		this.countIsPlaying = 0;
		this.isPlaying = true;
		this.isThoatBan = false;
		// cc.log("DATA START GAME", data);
		this.updatePositionPlayers_startGame();
		this.parentBtnInvite.active = false;
		this.unschedule(this.funScheduleCountDown);
		this.lbTimeCountDown.node.parent.active = false;
		this.stateTable = StateTable.Playing;
		let Players = data[TMN_ParameterCode.Players];
		this.countIsPlaying = Players.length;
		// cc.log("players", Players, this.countIsPlaying);
		let posCurrentPlayer = data[TMN_ParameterCode.CurrentPlayer];
		let playerCurrent = this.getPlayerWithPosition(posCurrentPlayer);
		this.cardController.chiaBaiAll(data);
	},

	endGame(data) {
		this.listPlayerWin = [];
		this.listLoseSapHam = [];
		this.listLoseBinhLung = [];
		this.listLoseBatSapLang = [];
		this.listArrLoseSapHam = [];
		this.listWinSapHam = [];
		this.listWinType = [];
		this.listWinBinhLung = [];
		this.listWinTypeBL = [];
		this.listPlayer = [];
		this.listTypeWinPlayer = [];
		this.listMoneyEndGame = [];
		this.listCashEndGame = [];
		this.isSapHam = false;
		this.isBatSapLang = false;
		this.isBanLan1 = false;
		this.isBanLan2 = false;
		this.isBanLan3 = false;
		this.isEndGame = true;
		this.isNeedResetGame = true;
		this.checkBinhLung = false;
		let countListA = 0;
		let countListB = 0;
		let timeDelayShowMoney = 0;
		let countListSapHam = 0;
		this.cardController.onThuCard(0.5);
		this.stateTable = StateTable.Endgame;
		let result = data[12];
		cc.log("result data", result);
		let playerWin = [];
		let listPlayerLost = [];
		let countPlayer = 0;
		this.isCompareAt = data[37];
		let timeAtCompare = this.isCompareAt ? 3 : 0;
		let timeAnTrang = 0;
		for (let i = 0; i < result.length; i++) {
			result[i] = JSON.parse(result[i]);
			let posPlayer = result[i].Position;
			let player = this.getPlayerWithPosition(posPlayer);
			if (player) {
				if (result[i].WinType === WinTypeBinh.Win_ToiTrang) {
					timeAnTrang = 4;
					this.isToiTrang = true;
					player.isMauBinh = true;
				}
				let isBinhLung = result[i].IsBinhLung;
				if (isBinhLung) {
					this.isBinhLung = true;
					player.isBinhLung = true;
				}
			}
		}

		// cc.log("check time ann trang : ", timeAnTrang);
		let action_pre_end_game = () => {
			// cc.log("endgame : action 1 : ");
			for (let i = 0; i < result.length; i++) {
				let posPlayer = result[i].Position;
				let player = this.getPlayerWithPosition(posPlayer);
				if (player) {
					if (player.listCard.length > 0) {
						countPlayer++;
					}
					player.endTurn();
					player.resetXepXong();
					player._isPlaying = false;
					// if (player === this.isMe && result[i].HandCards.length > 0) this.panelResult.active = true;
				}
			}
			if (countPlayer == 2) {
				if (this.isToiTrang) {
					this.isMauBinh_2User = true;
					this.blockShowPointChi = true;
				} else if (this.isBinhLung) {
					this.isBinhLung_2User = true;
					this.blockShowPointChi = true;
				}
			} else {
				this.isToiTrang = false;
				this.isMauBinh_2User = false;
				this.isBinhLung = false;
				this.isBinhLung_2User = false;
				this.blockShowPointChi = false;
			}
		};

		let action_lat_bai = () => {
			let timestamp = Date.now();
			let resultHistory = {};
			// cc.log("resuls", result);
			if (!Global.listResultHistory) {
				Global.listResultHistory = [];
			}
			resultHistory = {
				results: result,
				timestamp: timestamp,
			};
			Global.listResultHistory.push(resultHistory);
			if (Global.listResultHistory.length > 10) {
				const newListResultHistory = [];
				const startIndex = Global.listResultHistory.length - 10;

				for (let i = startIndex; i < Global.listResultHistory.length; i++) {
					newListResultHistory.push(Global.listResultHistory[i]);
				}

				Global.listResultHistory = newListResultHistory;
			}
			// cc.log("LIST-RESULT-HISTORY", Global.listResultHistory);
			let stringifly = JSON.stringify(Global.listResultHistory);
			// cc.log("stringifly", stringifly);
			cc.sys.localStorage.setItem("LIST-RESULT-HISTORY", stringifly);
			// cc.log("endgame : action 2 : ", result);
			this.cardController.latBai(result);
		};

		let action_show_win_lose = () => {
			// cc.log("endgame : action 3 : ");
			this.cardController.isSoChi = false;
			this.panelResult.active = false;
			for (let i = 0; i < result.length; i++) {
				let posPlayer = result[i].Position;
				let player = this.getPlayerWithPosition(posPlayer);
				if (player) {
					this.cardController.xuLyCardEndGame(player);
					this.scheduleOnce(function () {
						player.showInfo();
						if (result[i].HandCards.length > 0) {
							this.listPlayer.push(player);
							this.listMoneyEndGame.push(result[i].WinLoseCash);
							this.listCashEndGame.push(result[i].Cash);
							this.listTypeWinPlayer.push(result[i].WinType);
						}
						let isBinhLung = result[i].IsBinhLung;
						if (isBinhLung) {
							this.listLoseBinhLung.push(player);
							cc.log("player lose Binh Lung", this.listLoseBinhLung);
						} else if (!isBinhLung && result[i].HandCards.length > 0) {
							this.listWinBinhLung.push(player);
							cc.log("list win binh lung", this.listWinBinhLung);
							this.listWinTypeBL.push(result[i].WinType);
						}
						if (!isBinhLung && result[i].WinType != WinTypeBinh.Win_ToiTrang) {
							cc.log("result", result[i]);
							if (result[i].WinType == WinTypeBinh.Win_SapHam || result[i].WinType == WinTypeBinh.Win_SapLang) {
								this.isSapHam = true;
							}
							if (result[i].PlayerBiSapList.length > 0) {
								countListSapHam++;
								this.listArrLoseSapHam.push(result[i].PlayerBiSapList);
								this.listWinSapHam.push(player);
								if (result[i].WinType == WinTypeBinh.Lose_SapLang) {
									this.listWinType.push(WinTypeBinh.Win_SapHam);
								} else {
									this.listWinType.push(result[i].WinType);
								}
							}
							if (result[i].WinType == WinTypeBinh.Lose_SapHam) {
								this.listLoseSapHam.push(player);
							} else if (result[i].WinType != WinTypeBinh.Win_SapLang && result[i].HandCards.length > 0) {
								this.listLoseBatSapLang.push(player);
							} else if (result[i].WinLoseCash == 0 && result[i].HandCards.length > 0) {
								player.showTypeNone(result[i].WinLoseCash);
							}
							this.scheduleOnce(function () {
								for (let j = 0; j < this.listPlayer.length; j++) {
									if (this.listTypeWinPlayer[j] != WinTypeBinh.Win_ToiTrang) {
										this.listPlayer[j].showTypeWin(this.listTypeWinPlayer[j], [], false);
									}
								}
								if (this.listLoseBinhLung.length > 0) {
									this.checkBinhLung = true;
								} else {
									this.checkBinhLung = false;
								}
								//contro rocket khi end game
								if (this.isSapHam) {
									// cc.log("count list sap ham", countListSapHam, this.listArrLoseSapHam);
									if (countListSapHam == 1) {
										this.isBanLan1 = true;
										cc.log("nhay vao day set ban ten lua sap ham", this.listWinSapHam[0].nameUser, this.listWinType[0], this.listArrLoseSapHam[0], this.checkBinhLung);
										this.listWinSapHam[0].showTypeWin(this.listWinType[0], this.listArrLoseSapHam[0], this.checkBinhLung);
									} else if (countListSapHam == 2) {
										if (this.listArrLoseSapHam[0].length == this.listArrLoseSapHam[1].length) {
											this.isBanLan1 = true;
											for (let j = 0; j < this.listWinSapHam.length; j++) {
												this.listWinSapHam[j].showTypeWin(this.listWinType[j], this.listArrLoseSapHam[j], this.checkBinhLung);
											}
										} else if (this.listArrLoseSapHam[0].length > this.listArrLoseSapHam[1].length) {
											// cc.log("this.listArrLoseSapHam[0].length > this.listArrLoseSapHam[1].length", this.listWinType[1]);
											this.isBanLan2 = true;
											this.listWinSapHam[1].showTypeWin(this.listWinType[1], this.listArrLoseSapHam[1], this.checkBinhLung);
											this.scheduleOnce(function () {
												this.listWinSapHam[0].showTypeWin(this.listWinType[0], this.listArrLoseSapHam[0], this.checkBinhLung);
											}, 1);
										} else if (this.listArrLoseSapHam[0].length < this.listArrLoseSapHam[1].length) {
											this.isBanLan2 = true;
											// cc.log("this.listArrLoseSapHam[0].length < this.listArrLoseSapHam[1].length", this.listWinType[0]);
											this.listWinSapHam[0].showTypeWin(this.listWinType[0], this.listArrLoseSapHam[0], this.checkBinhLung);
											this.scheduleOnce(function () {
												this.listWinSapHam[1].showTypeWin(this.listWinType[1], this.listArrLoseSapHam[1], this.checkBinhLung);
											}, 1);
										}
									} else if (countListSapHam == 3) {
										if (this.listArrLoseSapHam[0].length == this.listArrLoseSapHam[1].length && this.listArrLoseSapHam[0].length == this.listArrLoseSapHam[2].length) {
											this.isBanLan1 = true;
											for (let j = 0; j < this.listWinSapHam.length; j++) {
												this.listWinSapHam[j].showTypeWin(this.listWinType[j], this.listArrLoseSapHam[j], this.checkBinhLung);
											}
										} else if (this.listArrLoseSapHam[0].length == this.listArrLoseSapHam[1].length) {
											if (this.listArrLoseSapHam[0].length > this.listArrLoseSapHam[2].length) {
												this.isBanLan2 = true;
												this.listWinSapHam[2].showTypeWin(this.listWinType[2], this.listArrLoseSapHam[2], this.checkBinhLung);
												this.scheduleOnce(function () {
													this.listWinSapHam[1].showTypeWin(this.listWinType[1], this.listArrLoseSapHam[1], this.checkBinhLung);
													this.listWinSapHam[0].showTypeWin(this.listWinType[0], this.listArrLoseSapHam[0], this.checkBinhLung);
												}, 1);
											} else if (this.listArrLoseSapHam[0].length < this.listArrLoseSapHam[2].length) {
												this.isBanLan2 = true;
												this.listWinSapHam[1].showTypeWin(this.listWinType[1], this.listArrLoseSapHam[1], this.checkBinhLung);
												this.listWinSapHam[0].showTypeWin(this.listWinType[0], this.listArrLoseSapHam[0], this.checkBinhLung);
												this.scheduleOnce(function () {
													this.listWinSapHam[2].showTypeWin(this.listWinType[2], this.listArrLoseSapHam[2], this.checkBinhLung);
												}, 1);
											}
										} else if (this.listArrLoseSapHam[0].length == this.listArrLoseSapHam[2].length) {
											if (this.listArrLoseSapHam[0].length > this.listArrLoseSapHam[1].length) {
												this.isBanLan2 = true;
												this.listWinSapHam[1].showTypeWin(this.listWinType[1], this.listArrLoseSapHam[1], this.checkBinhLung);
												this.scheduleOnce(function () {
													this.listWinSapHam[2].showTypeWin(this.listWinType[2], this.listArrLoseSapHam[2], this.checkBinhLung);
													this.listWinSapHam[0].showTypeWin(this.listWinType[0], this.listArrLoseSapHam[0], this.checkBinhLung);
												}, 1);
											} else if (this.listArrLoseSapHam[0].length < this.listArrLoseSapHam[1].length) {
												this.isBanLan2 = true;
												this.listWinSapHam[2].showTypeWin(this.listWinType[2], this.listArrLoseSapHam[2], this.checkBinhLung);
												this.listWinSapHam[0].showTypeWin(this.listWinType[0], this.listArrLoseSapHam[0], this.checkBinhLung);
												this.scheduleOnce(function () {
													this.listWinSapHam[1].showTypeWin(this.listWinType[1], this.listArrLoseSapHam[1], this.checkBinhLung);
												}, 1);
											}
										} else if (this.listArrLoseSapHam[1].length == this.listArrLoseSapHam[2].length) {
											if (this.listArrLoseSapHam[1].length > this.listArrLoseSapHam[0].length) {
												this.isBanLan2 = true;
												this.listWinSapHam[0].showTypeWin(this.listWinType[0], this.listArrLoseSapHam[0], this.checkBinhLung);
												this.scheduleOnce(function () {
													this.listWinSapHam[1].showTypeWin(this.listWinType[1], this.listArrLoseSapHam[1], this.checkBinhLung);
													this.listWinSapHam[2].showTypeWin(this.listWinType[2], this.listArrLoseSapHam[2], this.checkBinhLung);
												}, 1);
											} else if (this.listArrLoseSapHam[1].length < this.listArrLoseSapHam[0].length) {
												this.isBanLan2 = true;
												this.listWinSapHam[2].showTypeWin(this.listWinType[2], this.listArrLoseSapHam[2], this.checkBinhLung);
												this.listWinSapHam[1].showTypeWin(this.listWinType[1], this.listArrLoseSapHam[1], this.checkBinhLung);
												this.scheduleOnce(function () {
													this.listWinSapHam[0].showTypeWin(this.listWinType[0], this.listArrLoseSapHam[0], this.checkBinhLung);
												}, 1);
											}
										} else if (this.listArrLoseSapHam[0].length > this.listArrLoseSapHam[1].length && this.listArrLoseSapHam[0].length > this.listArrLoseSapHam[2].length) {
											this.isBanLan3 = true;
											if (this.listArrLoseSapHam[1].length > this.listArrLoseSapHam[2].length) {
												this.listWinSapHam[2].showTypeWin(this.listWinType[2], this.listArrLoseSapHam[2], this.checkBinhLung);
												this.scheduleOnce(function () {
													this.listWinSapHam[1].showTypeWin(this.listWinType[1], this.listArrLoseSapHam[1], this.checkBinhLung);
												}, 1);
												this.scheduleOnce(function () {
													this.listWinSapHam[0].showTypeWin(this.listWinType[0], this.listArrLoseSapHam[0], this.checkBinhLung);
												}, 2);
											} else if (this.listArrLoseSapHam[1].length < this.listArrLoseSapHam[2].length) {
												this.listWinSapHam[1].showTypeWin(this.listWinType[1], this.listArrLoseSapHam[1], this.checkBinhLung);
												this.scheduleOnce(function () {
													this.listWinSapHam[2].showTypeWin(this.listWinType[2], this.listArrLoseSapHam[2], this.checkBinhLung);
												}, 1);
												this.scheduleOnce(function () {
													this.listWinSapHam[0].showTypeWin(this.listWinType[0], this.listArrLoseSapHam[0], this.checkBinhLung);
												}, 2);
											}
										} else if (this.listArrLoseSapHam[1].length > this.listArrLoseSapHam[0].length && this.listArrLoseSapHam[1].length > this.listArrLoseSapHam[2].length) {
											this.isBanLan3 = true;
											if (this.listArrLoseSapHam[0].length > this.listArrLoseSapHam[2].length) {
												this.listWinSapHam[2].showTypeWin(this.listWinType[2], this.listArrLoseSapHam[2], this.checkBinhLung);
												this.scheduleOnce(function () {
													this.listWinSapHam[0].showTypeWin(this.listWinType[0], this.listArrLoseSapHam[0], this.checkBinhLung);
												}, 1);
												this.scheduleOnce(function () {
													this.listWinSapHam[1].showTypeWin(this.listWinType[1], this.listArrLoseSapHam[1], this.checkBinhLung);
												}, 2);
											} else if (this.listArrLoseSapHam[0].length < this.listArrLoseSapHam[2].length) {
												this.listWinSapHam[0].showTypeWin(this.listWinType[0], this.listArrLoseSapHam[0], this.checkBinhLung);
												this.scheduleOnce(function () {
													this.listWinSapHam[2].showTypeWin(this.listWinType[2], this.listArrLoseSapHam[2], this.checkBinhLung);
												}, 1);
												this.scheduleOnce(function () {
													this.listWinSapHam[1].showTypeWin(this.listWinType[1], this.listArrLoseSapHam[1], this.checkBinhLung);
												}, 2);
											}
										} else if (this.listArrLoseSapHam[2].length > this.listArrLoseSapHam[0].length && this.listArrLoseSapHam[2].length > this.listArrLoseSapHam[1].length) {
											this.isBanLan3 = true;
											if (this.listArrLoseSapHam[0].length > this.listArrLoseSapHam[1].length) {
												this.listWinSapHam[1].showTypeWin(this.listWinType[1], this.listArrLoseSapHam[1], this.checkBinhLung);
												this.scheduleOnce(function () {
													this.listWinSapHam[0].showTypeWin(this.listWinType[0], this.listArrLoseSapHam[0], this.checkBinhLung);
												}, 1);
												this.scheduleOnce(function () {
													this.listWinSapHam[2].showTypeWin(this.listWinType[2], this.listArrLoseSapHam[2], this.checkBinhLung);
												}, 2);
											} else if (this.listArrLoseSapHam[0].length < this.listArrLoseSapHam[1].length) {
												this.listWinSapHam[0].showTypeWin(this.listWinType[0], this.listArrLoseSapHam[0], this.checkBinhLung);
												this.scheduleOnce(function () {
													this.listWinSapHam[1].showTypeWin(this.listWinType[1], this.listArrLoseSapHam[1], this.checkBinhLung);
												}, 1);
												this.scheduleOnce(function () {
													this.listWinSapHam[2].showTypeWin(this.listWinType[2], this.listArrLoseSapHam[2], this.checkBinhLung);
												}, 2);
											}
										}
									}
								} else if (this.checkBinhLung) {
									cc.log("bắn binh lung lần 1");
									if (result[i].HandCards.length > 0 && this.listLoseBinhLung.length > 0) {
										for (let j = 0; j < this.listWinBinhLung.length; j++) {
											cc.log("ban binh lung");
											this.listWinBinhLung[j].showEffectBanTenLua(true, false, false);
										}
									}
								}
								//contro time chipFly khi end game
								let timeShowMoneyEndGame = 0;
								if (!this.isSapHam) {
									if (this.checkBinhLung) {
										// cc.log("ban binh lung", timeShowMoneyEndGame);
										timeShowMoneyEndGame = 3;
									} else if (!this.checkBinhLung) {
										// cc.log("ko bắn", timeShowMoneyEndGame);
										timeShowMoneyEndGame = 2;
									}
								} else {
									if (this.isBanLan1) {
										// cc.log("bắn lần 1", timeShowMoneyEndGame);
										timeShowMoneyEndGame = 3;
									} else if (this.isBanLan2) {
										// cc.log("bắn lần 2", timeShowMoneyEndGame);
										timeShowMoneyEndGame = 4;
									} else if (this.isBanLan3) {
										// cc.log("bắn lần 3", timeShowMoneyEndGame);
										timeShowMoneyEndGame = 5;
									}
								}
								this.scheduleOnce(function () {
									// cc.log("nhảy vào đây set show tiền", timeShowMoneyEndGame);
									for (let j = 0; j < this.listPlayer.length; j++) {
										let player = this.listPlayer[j];
										if (this.listMoneyEndGame[j] > 0) {
											playerWin.push(player);
											this.listPlayerWin.push(player);
											player.showAnimWin();
											if (player == this.isMe) {
												Global.AudioManager.playWin();
											}
											this.scheduleOnce(function () {
												player.changeMoneyEndGame(this.listMoneyEndGame[j], this.listCashEndGame[j]);
											}, 0.1);
										} else if (this.listMoneyEndGame[j] < 0) {
											listPlayerLost.push(player);
											if (player == this.isMe) {
												Global.AudioManager.playLose();
											}
											player.showAnimLose();
											this.scheduleOnce(function () {
												player.changeMoneyEndGame(this.listMoneyEndGame[j], this.listCashEndGame[j]);
											}, 0.1);
										} else if (this.listMoneyEndGame[j] == 0) {
											player.showTypeNone(this.listMoneyEndGame[j]);
										}
										player._gold = this.listCashEndGame[j];
									}
								}, timeShowMoneyEndGame);
							}, 0.2);
						} else {
							if (result[i].HandCards.length > 0 && this.listLoseBinhLung.length > 0 && this.listWinBinhLung.length > 0) {
								for (let j = 0; j < this.listWinBinhLung.length; j++) {
									cc.log("ban binh lung");
									this.listWinBinhLung[j].showEffectBanTenLua(true, false, false);
								}
							}
							player.showTypeAnTrang(result[i].ToiTrangType);
							if (result[i].WinLoseCash > 0) {
								playerWin.push(player);
								this.listPlayerWin.push(player);
								player.showAnimWin();
								if (player == this.isMe) {
									Global.AudioManager.playWin();
								}
								this.scheduleOnce(function () {
									player.changeMoneyEndGame(result[i].WinLoseCash, result[i].Cash);
								}, 0.1);
							} else if (result[i].WinLoseCash < 0) {
								listPlayerLost.push(player);
								if (player == this.isMe) {
									Global.AudioManager.playLose();
								}
								player.showAnimLose();
								this.scheduleOnce(function () {
									player.changeMoneyEndGame(result[i].WinLoseCash, result[i].Cash);
								}, 0.1);
							}
						}
					}, 0.3);
					player.isPlaying = false;
				}
			}
			// cc.log("chay vào dây set tien win");
			for (let i = 0; i < playerWin.length; i++) {
				const playerW = playerWin[i];
				if (this.isMe === playerW) {
					// cc.log("tien user chua + " + playerW.gold);
				}
				playerW.gold = playerW._gold;
				if (this.isMe === playerW) {
					// cc.log("tien user sau khi + " + playerW.gold);
				}
			}
			// cc.log("chạy vào đây set tiền bay lose");
			for (let i = 0, l = listPlayerLost.length; i < l; i++) {
				// cc.log("chay vao tru tien player lose");
				let playerLose = listPlayerLost[i];
				this.chipMovePlayerToPlayerWin(listPlayerLost[i], playerWin);
				playerLose.gold = playerLose._gold;
			}
			//update tien user
		};

		let action_reset_endgame = () => {
			// this.cardController.setOffMaskCardGroup();
			this.isEndGame = false;
			// cc.log("endgame : action 4 : ");
			this.parentBtnInvite.active = true;
			this.isPlaying = false;
			this.resetForNewGame();
			this.isNeedResetGame = false;
		};

		cc.tween(this.node)
			.call(action_pre_end_game)
			.delay(0.5)
			.call(action_lat_bai)
			.delay(timeAtCompare + 14 + timeAnTrang)
			.call(action_show_win_lose)
			.delay(9)
			.call(action_reset_endgame)
			.start();
	},
	playerReviceMoney(listPlayer, listMoney) {
		for (let i = 0, l = listPlayer.length; i < l; i++) {
			listPlayer[i].changeMoneyEndGame(listMoney[i]);
		}
	},

	reviceCashIn(money) {
		if (this.isMe) this.isMe.gold = money;
	},
	otherJoinTable(data) {
		// cc.log("other join table game");
		let dataTemp = {};
		dataTemp.AccountId = data[TMN_ParameterCode.AccountId];
		dataTemp.NickName = data[TMN_ParameterCode.NickName];
		dataTemp.Cash = data[TMN_ParameterCode.Cash];
		dataTemp.Position = data[TMN_ParameterCode.Position];
		this.creatPlayerWithData(dataTemp);
		if (this.isPlaying == false) {
			this.updatePositionPlayers_startGame();
		}
	},

	getIndexTableInPlaying() {
		// tim cho trong' de ngoi tam
		for (let i = 0; i < 4; i++) {
			let indexTable = i;
			let isCheck = false;
			for (let j = 0, l = this.players.length; j < l; j++) {
				if (this.players[j] && this.players[j].indexInTable == indexTable) {
					isCheck = true;
					break;
				}
			}
			if (!isCheck) return i;
		}

		return null;
	},

	reviceOtherCashIn(index, money) {
		let player = this.players[index];
		player.gold = money;
	},
	creatPlayerWithData(data) {
		// cc.log("chay vao creat player : ", data);
		let player = this.pool.getPlayer().getComponent("PLayerViewBinh");
		// cc.log("mainPlayerInfo", MainPlayerInfo.accountId);
		if (data.AccountId == MainPlayerInfo.accountId) {
			// cc.log("set this.isme = player");
			this.isMe = player;
			// cc.log("player", player);
			player._isMe = true;
			player.toiTrangType = data.ToiTrangType;
			player.handCards = data.HandCards;
			if (data.IsToiTrang) {
				// isAnTrang = true;
				if (this.isMe) {
					this.isToiTrang = true;
				}
				this.btnMauBinh.node.active = true;
				this.btnXepXong.active = true;
			} else {
				this.btnMauBinh.node.active = false;
				this.btnXepXong.active = true;
				this.isToiTrang = false;
			}
		}
		if (data.Position >= 0)
			// hien thi viewer
			this.parentPlayer.addChild(player.node);

		if (this.players[data.Position] === null) {
			this.players[data.Position] = player;
		} else {
			for (let i = 0; i < this.players.length; i++) {
				let itemPlayer = this.players[i];
				if (!itemPlayer) {
					data.Position = i;
					this.players[data.Position] = player;
				}
			}
		}
		player.showInfo();
		player.initPlayer(data);
		let indexpos = this.checkUsingPositon();
		player.node.position = this.listPos[indexpos];
		player.indexInTable = indexpos;
		return player;
	},
	checkUsingPositon() {
		// cc.log("check list pos : ", this.listPos);
		for (let i = 0; i < this.listPos.length; i++) {
			let daconguoingoi = false;
			let itemPos = this.listPos[i];
			for (let j = 0; j < this.players.length; j++) {
				const player = this.players[j];
				if (player) {
					if (player.node.position.x === itemPos.x && player.node.position.y === itemPos.y) {
						daconguoingoi = true;
					}
				}
			}
			if (!daconguoingoi) {
				// cc.log("ket qua tra ve la posX : " + itemPos.x + " POsY : " + itemPos.y);
				return i;
			}
		}
		return cc.v2(0, 0);
	},
	removePlayer(player) {
		player.resetCard(this);
		this.players[player.position] = null;
		this.pool.putPlayer(player.node);
		this.updatePositionPlayers_startGame();
		this.countPlayer--;
	},

	updatePositionPlayers_reconnect() {
		// cc.log("updatePositionPlayer");
		let listConfigUser = [];
		let listPlayer = [];
		let index = 0;
		for (let i = 0; i < this.players.length; i++) {
			let player = this.players[i];
			if (player) {
				index++;
				player.node.active = true;
				player.indexInTable = this.getIndexOf(player);
				// cc.log("playerIndexInTable", player.indexInTable);
				listPlayer.push(player);
			}
		}
		listPlayer.sort(function (a, b) {
			return a.indexInTable - b.indexInTable;
		});
		switch (listPlayer.length) {
			case 1:
				listConfigUser = [0];
				break;
			case 2:
				listConfigUser = [0, 2];
				break;
			case 3:
				listConfigUser = [0, 1, 2];
				break;
			case 4:
				listConfigUser = [0, 1, 2, 3];
				break;
		}
		cc.log("check listUser:", listPlayer);
		cc.log("check list config user", listConfigUser);
		for (let i = 0; i < listPlayer.length; i++) {
			let player = listPlayer[i];
			if (player) {
				player.node.position = this.listPos[listConfigUser[i]];
				cc.log("index in table trước", player.indexInTable, player.nameUser);
				player.indexInTable = listConfigUser[i];
				cc.log("index in table sau", player.indexInTable);
				cc.tween(player.node).to(0.1, { position: this.listPos[player.indexInTable] }).start();
				cc.Tween.stopAllByTarget(this.cardController.listMaskCardGroup[player.indexInTable]);
				cc.tween(this.cardController.listMaskCardGroup[player.indexInTable]).to(0.3, { opacity: 255 }).start();
			}
		}
	},
	updatePositionPlayers_startGame() {
		// cc.log("updatePositionPlayer");
		let listConfigUser = [];
		let listPlayer = [];
		let index = 0;
		for (let i = 0; i < this.players.length; i++) {
			let player = this.players[i];
			if (player) {
				index++;
				player.node.active = true;
				player.indexInTable = this.getIndexOf(player);
				listPlayer.push(player);
			}
		}
		listPlayer.sort(function (a, b) {
			return a.indexInTable - b.indexInTable;
		});
		switch (listPlayer.length) {
			case 1:
				listConfigUser = [0];
				break;
			case 2:
				listConfigUser = [0, 2];
				break;
			case 3:
				listConfigUser = [0, 1, 2];
				break;
			case 4:
				listConfigUser = [0, 1, 2, 3];
				break;
		}
		// cc.log("check listUser : ", listPlayer);
		for (let i = 0; i < listPlayer.length; i++) {
			let player = listPlayer[i];
			if (player) {
				player.node.position = this.listPos[listConfigUser[i]];
				player.indexInTable = listConfigUser[i];
				cc.tween(player.node).to(0.1, { position: this.listPos[player.indexInTable] }).start();
				cc.Tween.stopAllByTarget(this.cardController.listMaskCardGroup[player.indexInTable]);
				cc.tween(this.cardController.listMaskCardGroup[player.indexInTable]).to(0.3, { opacity: 255 }).start();
			}
		}
	},
	updatePositionPlayers_inOut() {
		// cc.log("updatePositionPlayer");
		let listConfigUser = [];
		let listPlayer = [];
		let index = 0;
		for (let i = 0; i < this.players.length; i++) {
			let player = this.players[i];
			if (player) {
				index++;
				player.node.active = true;
				player.indexInTable = this.getIndexOf(player);
				listPlayer.push(player);
			}
		}
		listPlayer.sort(function (a, b) {
			return a.indexInTable - b.indexInTable;
		});
		switch (listPlayer.length) {
			case 1:
				listConfigUser = [0];
				break;
			case 2:
				listConfigUser = [0, 2];
				break;
			case 3:
				listConfigUser = [0, 1, 2];
				break;
			case 4:
				if (this.countIsPlaying == 2) {
					listConfigUser = [0, 1, 2, 3];
				} else if (this.countIsPlaying == 3) {
					listConfigUser = [0, 1, 2, 3];
				}

				break;
		}
		// cc.log("check lisConfigUser", listConfigUser);
		// cc.log("check listUser : ", listPlayer);
		for (let i = 0; i < listPlayer.length; i++) {
			const player = listPlayer[i];
			if (player) {
				// cc.log("check lisConfigUser", listConfigUser);
				player.indexInTable = listConfigUser[i];
				// cc.log("indexIntable", player.indexInTable, listConfigUser[i]);
				player.node.position = this.listPos[player.indexInTable];
				// cc.log("player data", player);
			}
		}
	},
	resetWithLeaveGame(time_out_bg) {
		this.resetForNewGame(time_out_bg);
		this.resetPlayer();
	},
	resetPlayer() {
		for (let i = 0, l = this.players.length; i < l; i++) {
			let player = this.players[i];
			if (player) {
				player.lbName.node.parent.active = true;
				player.avatar.node.active = true;
				player.node.position = cc.v2(0, 0);
				this.pool.putPlayer(player.node);
			}
		}
		this.players = [null, null, null, null];
		this.players1 = [null, null, null, null];
		this.isMe = null;
		this.countPlayer = 0;
	},
	onPlayerXepXong(data) {
		let position = data[34];
		let player = this.getPlayerWithPosition(position);
		if (player) {
			player.showXepXong();
			player.endTurn();
		}
	},
	getPlayerWithId(ID) {
		cc.log("list Player", this.players);
		for (let i = 0, l = this.players.length; i < l; i++) {
			let player = this.players[i];
			if (player) {
				if (player.id == ID) {
					return player;
				}
			}
		}
	},
	getPlayerWithPosition(position) {
		return this.players[position];
	},
	getDynamicIndex(index) {
		if (index == 0) return 0;

		var _index = index;

		if (this.countPlayer < 3) {
			_index = 2;
		}
		return _index;
	},
	getIndexOf(player) {
		let index = player.position; //vi tri hien tai trong players
		let thisPlayerIndex = this.players.length;
		if (this.isMe) {
			thisPlayerIndex = this.isMe.position;
		}
		return (index + this.players.length - thisPlayerIndex) % this.players.length;
	},
	resetPlayerNewTurn() {
		for (let i = 0, l = this.players.length; i < l; i++) {
			let player = this.players[i];
			if (player) {
				player.resetZindexNode();
				player.resetNewturn();
			}
		}
	},

	chipMovePlayerToPlayerWin(playerLost, playerWin) {
		let listChip = [];
		for (let i = 0, l = playerLost.length; i < l; i++) {
			let listTemp = playerLost[i].listChip;
			for (let j = 0, l = listTemp.length; j < l; j++) {
				listChip.push(listTemp[j]);
			}
			playerLost[i].listChip.length = 0;
		}

		let phanChia = parseInt(listChip.length / playerWin.length);
		for (let i = 0, l = playerWin.length; i < l; i++) {
			let pos = this.listPos[playerWin[i].indexInTable];
			let start = i * phanChia;
			let length = phanChia * (i + 1);
			if (i == l - 1) length = listChip.length;
			for (let j = start; j < length; j++) {
				let chip = listChip[j];
				cc.Tween.stopAllByTarget(chip);
				let delay = 0;
				let random1 = Global.RandomNumber(0, 100);
				if (random1 < 20) {
					delay = 0.3; // random2 = Global.RandomNumber(0 , 15)/500;
				} else if (random1 < 50) {
					delay = 0.15;
				} else {
					delay = 0.0;
				}
				cc.tween(chip)
					.delay(delay)
					.to(0.35, { position: pos }, { easing: "expoIn" })
					.call(() => {
						this.pool.putChip(chip);
					})
					.start();
			}
		}
	},
	activeClockAndRun(time) {
		this.clockAnim.node.active = true;
		this.nodeClockTime.active = true;
		this.nodeClockTime.opacity = 255;
		let bgrTime = cc.find("bgr-time", this.nodeClockTime);
		let sprite = cc.find("SpClock", this.nodeClockTime).getComponent(cc.Sprite);
		let lbClock = cc.find("LabelTime", this.nodeClockTime).getComponent(cc.Label);
		lbClock.string = time;
		lbClock.node.active = true;
		bgrTime.active = true;
		this.unschedule(this.funCd);
		// this.clockAnim.setAnimation(0, "animation", true);
		this.schedule(
			(this.funCd = () => {
				time--;
				lbClock.string = time;
				if (time == 1) {
					this.sendApplyChi(true);
				}
				if (time == 0) {
					this.unschedule(this.funCd);
					lbClock.node.active = false;
					bgrTime.active = false;
					this.clockAnim.node.active = false;
				}
			}),
			1
		);
		sprite.fillRange = 1;
		cc.Tween.stopAllByTarget(sprite);
		cc.tween(sprite).to(time, { fillRange: 0 }).start();
		sprite.node.color = cc.Color.GREEN;
		cc.Tween.stopAllByTarget(sprite.node);
		cc.tween(sprite.node).to(time, { color: cc.Color.RED }).start();
	},
	activeClockCountDown() {
		let time = 5;
		this.clockAnim.node.active = true;
		this.nodeClockTime.active = true;
		this.nodeClockTime.opacity = 255;
		let bgrTime = cc.find("bgr-time", this.nodeClockTime);
		let sprite = cc.find("SpClock", this.nodeClockTime).getComponent(cc.Sprite);
		let lbClock = cc.find("LabelTime", this.nodeClockTime).getComponent(cc.Label);
		lbClock.string = time;
		lbClock.node.active = true;
		bgrTime.active = true;
		this.unschedule(this.funCd);
		// this.clockAnim.setAnimation(0, "animation", true);
		this.schedule(
			(this.funCd = () => {
				time--;
				lbClock.string = time;
				if (time == 0) {
					this.unschedule(this.funCd);
					lbClock.node.active = false;
					bgrTime.active = false;
					this.clockAnim.node.active = false;
				}
			}),
			1
		);
		sprite.fillRange = 1;
		cc.Tween.stopAllByTarget(sprite);
		cc.tween(sprite).to(time, { fillRange: 0 }).start();
		sprite.node.color = cc.Color.GREEN;
		cc.Tween.stopAllByTarget(sprite.node);
		cc.tween(sprite.node).to(time, { color: cc.Color.RED }).start();
	},
	ClockTimerMoveFinish() {
		let posShowPoint = this.listPosClockTime[1];
		// cc.log("posShowPoint", posShowPoint);
		let scale = 0.8;
		cc.Tween.stopAllByTarget(this.nodeClockTime);
		cc.tween(this.nodeClockTime).to(0.5, { position: posShowPoint, scale: scale }, { easing: "backInOut" }).start();
	},
	ClockTimerMoveScaleMax() {
		let posShowPoint = this.listPosClockTime[0];
		// cc.log("posShowPoint", posShowPoint);
		let scale = 1.2;
		cc.Tween.stopAllByTarget(this.nodeClockTime);
		cc.tween(this.nodeClockTime).to(0.5, { position: posShowPoint, scale: scale }, { easing: "backInOut" }).start();
	},
	setupEndGame() {
		this.unschedule(this.funCd);
		this.nodeClockTime.active = false;
	},
	countPlayers() {
		let index = 0;
		for (let i = 0; i < this.players.length; i++) {
			const tempPlayer = this.players[i];
			if (tempPlayer) {
				index++;
			}
		}
		return index;
	},
	initTable(data) {
		this.resetPlayer();
		// cc.log("data player", data);
		this.betsNumberAndTableId.string = "Bàn: " + this.tableId + " " + "Cược: " + Global.formatNumber(data[TMN_ParameterCode.Blind]) + " (Tính Át)";
		this.stateTable = data[TMN_ParameterCode.TableState];
		this.turnTime = data[TMN_ParameterCode.TimeConfigs];
		let timeRemain = data[TMN_ParameterCode.TimeRemain];
		Global.betInTable = data[TMN_ParameterCode.Blind];
		let playerInfos = data[TMN_ParameterCode.Players];
		for (let i = 0; i < playerInfos.length; i++) {
			let temp = null;
			temp = JSON.parse(playerInfos[i]);
			this.creatPlayerWithData(temp);
		}
		for (let i = 0; i < this.players.length; i++) {
			let player = this.players[i];
			if (player) {
				player.updateAvata();
				if (player.NumberOfCards == 13 && this.stateTable == StateTable.Playing) {
					if (player.isStoreDone) {
						player.showXepXong();
					} else {
						player.showDangXep();
					}
				}
			}
		}
		this.updatePositionPlayers_reconnect();
		if (this.stateTable == StateTable.Playing || this.stateTable == StateTable.Endgame) {
			this.isPlaying = true;
			this.isThoatBan = false;
			// cc.log("nhay vào dây set reconnect");
			this.setupPlayerForReconnect();
		} else {
			this.parentBtnInvite.active = true;
		}
		if (timeRemain > 0) {
			this.activeClockAndRun(timeRemain);
			if (this.stateTable == StateTable.Waiting) {
				this.countDownTime(timeRemain);
			} else if (this.stateTable == StateTable.Endgame) {
				this.unschedule(this.funResetGame);
				this.scheduleOnce(
					(this.funResetGame = () => {
						this.resetForNewGame();
						this.isNeedResetGame = false;
					}),
					timeRemain - 3
				);
			} else {
				if (this.isMe._isPlaying) {
					// cc.log("nhay vào đây init table");
					this.onClickXepCard_reconnect();
					this.activeClockAndRun(timeRemain);
				}
			}
		}
		setTimeout(() => {
			// cc.log("chekc card leng ", this.isMe.listCard.length);
			let index = this.countPlayers();
			if (index === 1) {
				this.chatController.showNoti("Đợi người vào chơi bạn nhé");
			} else if (this.stateTable == StateTable.Playing && this.isMe.listCard.length === 0) {
				this.chatController.showNoti("Bạn sẽ chơi ở ván sau nha");
			}
		}, 300);
	},
	reviceDangKyThoat(data) {
		// cc.log("Data dang ký thoat bàn", data);
		let error = data[ParameterCode.ErrorCode];
		let isRegisterLeave = data[AuthenticateParameterCode.Session];
		if (error == 1) {
			this.isMe.dangKyThoatBan(isRegisterLeave);
			if (isRegisterLeave) {
				this.showNoti(MyLocalization.GetText("DANGKY_THOAT_BAN"));
			} else {
				this.showNoti(MyLocalization.GetText("HUY_DANGKY_THOAT_BAN"));
			}
		}
	},

	otherLeaveTable(data) {
		// cc.log("nhay vao thoat ban roi");
		let position = data[TMN_ParameterCode.Position];
		let nextPosition = data[TMN_ParameterCode.NextPosition];
		let isNewRound = data[TMN_ParameterCode.NewRound];
		let cash = data[TMN_ParameterCode.Cash];
		let player = this.getPlayerWithPosition(position);
		// cc.Tween.stopAllByTarget(this.cardController.listMaskCardGroup[player.indexInTable]);
		// cc.tween(this.cardController.listMaskCardGroup[player.indexInTable]).to(0.2, { opacity: 70 }).start();
		if (player == null) return;
		if (player == this.isMe) {
			MainPlayerInfo.setMoneyUser(this.isMe.gold);
			MainPlayerInfo.ingameBalance = cash;
			// require("WalletController").getIns().UpdateWallet(cash);
			this.resetWithLeaveGame();
			// this.node.active = false;
			Global.AudioManager.playMusic();
			if (Global.GroupMenuInGameCard) {
				Global.GroupMenuInGameCard.SetStatusOriginPopup();
			}
			this.node.destroy();
		} else {
			// cc.log("player != this.isMe");
			this.removePlayer(player);
			if (Global.GroupMenuInGameCard) {
				Global.GroupMenuInGameCard.SetStatusOriginPopup();
			}
		}
	},

	showNoti(content) {
		if (content !== "Hết thời gian báo chi!") {
			let node = this.lbNoti.node.parent;
			this.lbNoti.string = content;
			node.stopAllActions();
			node.active = true;
			node.opacity = 255;
			node.scale = 0;
			cc.Tween.stopAllByTarget(node);
			cc.tween(node).to(0.15, { scale: 1 }, { easing: "backOut" }).delay(2).to(0.5, { opacity: 0 }).start();
		}
	},
	countDownStartGame(data) {
		let timer = data[TMN_ParameterCode.TimeConfigs];
		if (timer) {
			// cc.log("binh view ==> chay vao time countdown  co chay vao: " + data[TMN_ParameterCode.TimeConfigs]);
			this.countDownTime(timer);
		}
		this.parentBtnInvite.active = false;

		// cc.log("binh view ==> chay vao time countdown : " + data[TMN_ParameterCode.TimeConfigs]);
		if (this.isNeedResetGame) {
			this.resetForNewGame();
			this.isNeedResetGame = false;
		}
		this.unschedule(this.funResetGame);
		
		this.isThoatBan = true;
		this.stateTable = StateTable.Waiting;
		if (this.isNeedResetPosition) {
			this.updatePositionPlayers();
		}
		this.isNeedResetPosition = false;
		this.chatController.offNodeChat();
	},
	countDownTime(timer) {
		// this.activeClockCountDown();
		this.lbTimeCountDown.node.parent.active = true;
		// let posTaget = Global.BinhView.cardController.listPosFirtCardFinish[0];
		// this.timeCountDownGroup.setPosition(posTaget.x, posTaget.y + 430);
		this.lbTimeCountDown.string = timer + "s";
		cc.log("chay vao day set time : ", timer)
		this.unschedule(this.funScheduleCountDown);
		this.schedule(
			(this.funScheduleCountDown = () => {
				timer--;
				this.lbTimeCountDown.string = timer + "s";
				if (timer == 0) {
					this.lbTimeCountDown.node.parent.active = false;
					this.parentBtnInvite.active = true;
					this.unschedule(this.funScheduleCountDown);
				}
			}),
			1
		);
	},
	resetForNewGame(time_out_bg = 0) {
		// cc.log("select table in reconnect", Global.SlectTable);
		cc.Tween.stopAllByTarget(this.node);
		this.unschedule(this.StartGame);
		this.unschedule(this.EndGame);
		this.unschedule(this.funEndMoney);
		this.unschedule(this.funEndChip);
		this.unschedule(this.funResetGame);
		this.unschedule(this.funScheduleCountDown);
		this.lbTimeCountDown.node.parent.active = false;
		this.resetPlayerNewTurn();
		this.cardController.reset(time_out_bg);
		this.removeChipAllPlayer();
		this.panelResult.active = false;
		let parentLabel = cc.find("ParentLabePoint", this.panelResult);
		let listLabel = parentLabel.getComponentsInChildren(cc.Label);
		Global.GroupMenuInGameCard = null;
		for (let i = 0, l = listLabel.length; i < l; i++) {
			listLabel[i].string = 0;
			listLabel[i].node.color = cc.Color.WHITE;
		}
		this.isToiTrang = false;
		this.isBinhLung = false;
		this.isMauBinh_2User = false;
		this.isBinhLung_2User = false;
		this.blockShowPointChi = false;
	},
	setPointPanelIsMe(point, chi) {
		// chi = 3 la tong?
		if (chi == 3) {
			// cc.log("check pont la : ", point);
		}
		let parentLabel = cc.find("ParentLabePoint", this.panelResult);
		let listLabel = parentLabel.getComponentsInChildren(cc.Label);
		listLabel[chi].string = point;
		if (point < 0) {
			listLabel[chi].node.color = cc.Color.RED;
		} else if (point > 0) {
			listLabel[chi].node.color = cc.Color.GREEN;
		} else {
			listLabel[chi].node.color = cc.Color.WHITE;
		}
	},
	removeChipAllPlayer() {
		for (let i = 0, l = this.players.length; i < l; i++) {
			let player = this.players[i];
			if (player) {
				player.listChip.length = 0;
			}
		}
		let listChiInTable = this.parentChip.children;
		for (let i = 0, l = listChiInTable.length; i < l; i++) {
			let node = listChiInTable[0];
			this.pool.putChip(node);
		}
	},
	setupPlayerForReconnect() {
		for (let i = 0, l = this.players.length; i < l; i++) {
			let player = this.players[i];
			// cc.log("create player reconnect", player);
			if (player && player._isPlaying) this.cardController.creatCardForReconnect(player);
		}
	},
	onClickback() {
		if (this.state == StateTable.Playing) {
			Global.UIManager.showConfirmPopup(MyLocalization.GetText("LEAVE_ROOM_NOTIFY"));
		} else {
			require("SendCardRequest").getIns().MST_Client_BINH_LeaveRoom();
		}
	},

	testPushNoti() {
		// Global.UIManager.showRewardPopup(2);
	},

	onClickSwap23() {
		if (this.isSwapOK) {
			this.isSwapOK = false;
			this.cardController.swapChi23();
			this.scheduleOnce(function () {
				this.isSwapOK = true;
			}, 0.5);
		}
	},
	onClickXepCard() {
		this.btnXepXong.active = true;
		this.btnMauBinh.node.active = false;
		this.cardController.onXepCard(false);
	},
	onClickXepCard_reconnect() {
		if (this.isMe.isToiTrang) {
			this.btnXepXong.active = true;
			this.btnMauBinh.node.active = true;
			this.cardController.onXepCard(true);
		} else {
			this.btnXepXong.active = true;
			this.btnMauBinh.node.active = false;
			this.cardController.onXepCard(false);
		}
	},
	onClickXepXong() {
		this.isClickXepXong = true;
		this.cardController.isThuCard = true;
		this.btnXepXong.active = false;
		this.btnMauBinh.node.active = false;
		this.cardController.checkCard();
		this.scheduleOnce(function () {
			if (this.cardController.isLung) {
				this.cardController.isSwapCard = false;
				this.cardController.onThuCard(0.5);
				this.sendApplyChi(true);
				this.isMe.endTurn();
			} else {
				this.cardController.isSwapCard = false;
				this.cardController.onThuCard(0.5);
				this.sendApplyChi(true);
				this.isMe.endTurn();
			}
		}, 0.5);
	},
	onClickMauBinh() {
		// cc.log("oncLick mau binh");
		this.isClickBaoMauBinh = true;
		this.cardController.checkCard();
		this.scheduleOnce(function () {
			this.isClickBaoMauBinh = false;
			Global.BinhView.sendApplyChi(true, true);
			this.isMe.endTurn();
			this.cardController.parentButtonPlay.active = false;
			// cc.log("check win white : ", this.isMe.toiTrangType);
			// cc.log("check win white : ", this.isMe.handCards);
			let arrHandCards = this.isMe.handCards.slice();
			let arrIDnew = [];
			//set toi trăng 3 thung
			// if (this.isMe.toiTrangType == TypeAnTrang.BA_THUNG) {
			//   let arr_chi1 = [];
			//   let arr_chi2 = [];
			//   let arr_chi3 = [];
			//   let arr_chi1_2 = [];
			//   arrHandCards.sort(function (a, b) {
			//     var unitA = a % 10;
			//     var unitB = b % 10;
			//     if (unitA === unitB) {
			//       return a - b;
			//     }
			//     return unitA - unitB;
			//   });
			//   cc.log("arr HandCards", arrHandCards);
			//   let resultArr = this.arrangeListID_toiTrang(arrHandCards);
			//   cc.log("mang của mang", resultArr);
			//   for (let i = 0; i < resultArr.length; i++) {
			//     let arrChild = resultArr[i];
			//     if (arrChild.length == 3) {
			//       arr_chi3 = arrChild.slice();
			//       cc.log("arr_chi3", arr_chi3);
			//     } else if (arrChild.length == 5) {
			//       arr_chi1_2.push(arrChild);
			//     }
			//   }
			//   cc.log("arr chi 1-2", arr_chi1_2);
			//   let arrA = arr_chi1_2[0];
			//   let arrB = arr_chi1_2[1];
			//   if (arrA[4] > arrB[4]) {
			//     arr_chi1 = arrA;
			//     arr_chi2 = arrB;
			//   } else {
			//     arr_chi1 = arrB;
			//     arr_chi2 = arrA;
			//   }
			//   cc.log("chi 33 , chi 2, chi 1", arr_chi3, arr_chi2, arr_chi1);
			//   arrIDnew = arr_chi3.concat(arr_chi2, arr_chi1);
			//   cc.log("arr ID new", arrIDnew);
			// }
			// this.cardController.showCardWinWhite(this.isMe.toiTrangType, arrIDnew, this.isMe);
			this.cardController.showCardWinWhite(this.isMe.toiTrangType, arrHandCards, this.isMe);
		}, 0.5);
	},
	arrangeListID_toiTrang(arrID) {
		let arr_id = arrID.slice();
		var groups = {};
		arr_id.forEach(function (item) {
			var lastDigit = item % 10;
			if (!groups[lastDigit]) {
				groups[lastDigit] = [item];
			} else {
				groups[lastDigit].push(item);
			}
		});
		var resultArrays = Object.values(groups);
		return resultArrays;
	},
	sendApplyChi(isXepXong = false, isMauBinh = false) {
		// cc.log("send apply chi", isXepXong, isMauBinh);
		let msg = {};
		msg[16] = this.isMe.getListIdCurrentCard();
		msg[17] = isXepXong;
		msg[19] = isMauBinh;
		require("SendCardRequest").getIns().MST_Client_BINH_Play_Card(msg);
	},
	onClickSuggestCard() {
		this.cardController.clickSuggestCardWithList();
	},
	onClickConfigCard(event, data) {
		// cc.log("chay vao day roi");
		let edb = cc.find("NodeTestCard/editbox", this.node).getComponent(cc.EditBox);
		Global.InGameCard.onSetCardClicked(edb.string);
	},
	clickBtnSetting() {
		if (!Global.isLogin) {
			Global.UIManager.showCommandPopup(MyLocalization.GetText("NEED_LOGIN"));
			return;
		}

		Global.UIManager.showSettingPopup();
	},
	onClickback() {
		if (this.state == StateTable.Playing) {
			Global.UIManager.showConfirmPopup(MyLocalization.GetText("LEAVE_ROOM_NOTIFY"));
		} else {
			require("SendCardRequest").getIns().MST_Client_BINH_LeaveRoom();
		}
	},
	onClickShowLeague() {
		Global.UIManager.showLeaguePopup();
	},
	setOffActiveIconAll() {
		this.btnLeague.active = false;
		this.btnNhiemVu.active = false;
		this.btnMenuGame.active = false;
	},
	setOnActiveIconAll() {
		this.btnLeague.active = true;
		this.btnNhiemVu.active = true;
		this.btnMenuGame.active = true;
	},
	//screen shot
	OnClickLoadAndDisplayImage: function () {
		this.showScreenShot.node.active = true;
		// Lấy mảng capturedImages từ local storage
		let savedImages = Global.capturedImages;
		if (savedImages) {
			let index = savedImages.length - 1;
			if (index >= 0 && index < savedImages.length) {
				// Tạo Texture2D từ dataURL
				let latestImage = savedImages[index];
				let timestamp = latestImage.timestamp;
				// cc.log("timestamp", timestamp);
				let spriteFrame = latestImage.image;
				// Chuyển đổi timestamp thành định dạng thời gian bạn muốn
				let date = new Date(timestamp);
				let hours = date.getHours().toString().padStart(2, "0"); // Lấy giờ
				let minutes = date.getMinutes().toString().padStart(2, "0"); // Lấy phút

				let formattedTime = hours + ":" + minutes; // Định dạng giờ:phút
				this.timeHistory.string = formattedTime;
				let sprite = this.showScreenShot;
				sprite.spriteFrame = spriteFrame;
			} else {
				console.error("Index không hợp lệ!");
			}
		} else {
			console.error("Không tìm thấy ảnh trong local storage!");
		}
	},

	onClearShowShot() {
		this.showScreenShot.node.active = false;
	},
});
