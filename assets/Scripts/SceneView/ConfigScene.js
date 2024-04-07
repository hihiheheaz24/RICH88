var globalGameCustomManifest = JSON.stringify({
	packageUrl: "http://mewin.club/bundle/android2/remote-assets/",
	remoteManifestUrl: "http://mewin.club/bundle/android2/remote-assets/project.manifest",
	remoteVersionUrl: "http://mewin.club/bundle/android2/remote-assets/version.manifest",
	version: "1.0",
	assets: {},
	searchPaths: [],
});

cc.Class({
	extends: cc.Component,

	properties: {
		loadingProgressBar: {
			default: null,
			type: cc.Sprite,
		},
		labelUpdateVersion: {
			default: null,
			type: cc.RichText,
		},
		labelUpdateProgress: {
			default: null,
			type: cc.Label,
		},

		labelTip: {
			default: null,
			type: cc.Label,
		},

		manifest: {
			default: null,
			type: cc.JsonAsset,
		},

		// btnQuit: cc.Node,

		nodeSupport: cc.Node,
	},

	globalGameStoragePath: "",
	currentVersion: "",
	newVersion: "",

	reviceConfigResponse: null,

	onLoad() {
		cc.log("!===> Game running ConfigScene.js");
		Global.ConfigScene = this;
		CONFIG.VERSION = cc.sys.localStorage.getItem("versionClient") || "1.0.0";
		Global.startAppTime = new Date();
		require("BaseNetwork").getGlobalIp();
		Global.ConfigScene.getConfigLink();
		this.nodeSupport.scale = 0;
		this.dataSupport = null;
		this.count = 0;
		this.schedule(
			(this.loading = () => {
				this.count += 0.01;
				this.loadingProgressBar.node.active = true;
				this.loadingProgressBar.fillRange = this.count;
				this.labelUpdateProgress.string = parseInt(this.count * 100) + "%";
				if (this.count >= 0.99) {
					this.unschedule(this.loading);
				}
			}),
			0.01
		);

		if (!cc.sys.isNative) {
			return;
		}
		this.globalGameStoragePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") + "remote-asset";
	},

	onEnable() {
		let stt_text = Global.RandomNumber(0, 5);
		let textConfig = MyLocalization.GetText("loading_text");
		let textEdit = textConfig.replace("%d", stt_text);
		// this.labelTip.string = MyLocalization.GetText(textEdit);
		this.labelTip.string = "";

		// if (cc.sys.isBrowser) {
		// 	var url = new URL(window.location.href);
		// 	var AccessToken = url.searchParams.get("accesstoken");
		// 	if (AccessToken) {
		// 		this.btnQuit.active = true;
		// 	} else {
		// 		this.btnQuit.active = false;
		// 	}
		// } else {
		// 	this.btnQuit.active = false;
		// }
	},

	getConfigLink() {
		if (cc.sys.isNative)
			linkFire = "https://raw.githubusercontent.com/hihiheheaz24/TLMN-Online/master/config.json"
		else
			linkFire = "https://vpl-poker.web.app/config.json";

		cc.log("chay vao get config link ", linkFire);

		let http = cc.loader.getXMLHttpRequest();
		http.open("GET", linkFire, true);
		http.setRequestHeader("Content-Type", "application/json");
		http.onreadystatechange = () => {
			//Call a function when the state changes.
			if (http.readyState === 4) {
				if (http.status >= 200 && http.status < 300) {
					cc.log("data load duowc la " + http.responseText);
					if (http.responseText == "") return;
					let data = null;
					data = JSON.parse(http.responseText);
					if (data == null) return;
					this.dataSupport = data.dataSupport;
					Global.LinkUpdateStore = data.linkUpdateStore;
					CONFIG.CONFIG_LINK = data.ConfigUrl;
					// CONFIG.CONFIG_LINK = "https://tele-apis.vpl.mobi/api/config/gconfbd46a2b5fadcbc" //sv test chuyen tien
                    CONFIG.CONFIG_LINK = "https://api-dev.vpl.mobi/api/config/gconfbd46a2b5fadcbc" //sv test chuyen tien


					var dataSend = {
						version: CONFIG.VERSION,
						os: require("ReceiveResponse").getIns().GetPlatFrom(),
						merchantid: CONFIG.MERCHANT,
					};

					cc.log("====> CONFIG.CONFIG_LINK : ", CONFIG.CONFIG_LINK, "===> data post : ", JSON.stringify(dataSend));

					cc.log("bat dau send request");
					require("BaseNetwork").request(CONFIG.CONFIG_LINK, dataSend, this.reviceConfig.bind(this));
					if (cc.sys.isNative && cc.sys.os != cc.sys.OS_WINDOWS) {
						this.initUrl(data.BundleUrl);
					}
					this.getConfigBundle();
				}
			}
		};
		http.ontimeout = () => {
			console.log("load config time out");
			this.funGetConfigErr();
		};
		http.onerror = () => {
			console.log("chay vao error roif");
			this.funGetConfigErr();
		};
		http.send();
	},
	funGetConfigErr() {
		cc.log("chay vao config offline");
		let linkbundleOffline = "https://bundless.vpl.mobi/";
		CONFIG.CONFIG_LINK = "https://apis.vpl.mobi/api/config/gconfbd46a2b5fadcbc";
		var dataSend = {
			version: CONFIG.VERSION,
			os: require("ReceiveResponse").getIns().GetPlatFrom(),
			merchantid: CONFIG.MERCHANT,
		};
		require("BaseNetwork").request(CONFIG.CONFIG_LINK, dataSend, this.reviceConfig.bind(this));
		if (cc.sys.isNative && cc.sys.os != cc.sys.OS_WINDOWS) {
			linkBundle = linkBundle.replace("%s", linkbundleOffline);
			linkFull = linkFull.replace("%s", linkbundleOffline);
			linkConfig = linkConfig.replace("%s", linkbundleOffline);
			cc.log("link hotupdate full la : ", linkbundleOffline);
			this.initUrl(linkFull);
		}
		this.getConfigBundle();
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
	onDestroy() {
		Global.ConfigScene = null;
	},

	start() {
		this.InitOneSignal();
	},

	InitOneSignal() {
		if (!cc.sys.isNative || cc.sys.os == cc.sys.OS_WINDOWS || cc.sys.os == cc.sys.OS_OSX || typeof sdkbox === "undefined") {
			return;
		}
		cc.log("GGGG PluginOneSignal InitOneSignal");
		if (sdkbox.firebase) {
			sdkbox.firebase.Analytics.init();
			let ver = sdkbox.firebase.Analytics.getVersion();
			cc.log("ver fire base " + ver);
		}

		if (sdkbox.PluginFacebook) {
			sdkbox.PluginFacebook.init();
			// sdkbox.PluginFacebook.setAppId('227927532786026');
		}

		if (sdkbox.PluginOneSignal) {
			sdkbox.PluginOneSignal.init();
			sdkbox.PluginOneSignal.setSubscription(true);
			sdkbox.PluginOneSignal.enableInAppAlertNotification(true);
			sdkbox.PluginOneSignal.setListener({
				onSendTag: function (success, key, message) { },
				onGetTags: function (jsonString) { },
				onIdsAvailable: function (userId, pushToken) {
					cc.log("GGGG PluginOneSignal userId : ", userId);
					cc.log("GGGG PluginOneSignal pushToken : ", pushToken);
					// Global.deviceId = userId;
				},
				onPostNotification: function (success, message) { },
				onNotification: function (isActive, message, additionalData) { },
			});
		}
	},

	onClickQuitGame() {
		document.location = "dev.vpl.asia";
	},

	reviceConfig(response) {
		// cc.log("nhan duoc request" , response);
		this.reviceConfigResponse = response;
		if (!cc.sys.isNative || cc.sys.os == cc.sys.OS_WINDOWS) {
			let dataJson = JSON.parse(response);
			cc.log("reviceConfig : " + CONFIG.CONFIG_LINK);
			cc.log(dataJson.d);
			Global.ConfigLogin = dataJson.d;
			cc.log("load lobby");
			cc.director.loadScene("LobbyScene");
			return;
		}
		this.checkGameVersionGlobal();
	},
	checkGameVersionGlobal() {
		cc.log("GGGG checkGameVersionGlobal");
		if (!cc.sys.isNative) {
			return;
		}
		this.globalGameStoragePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") + "remote-asset";
		this._am = new jsb.AssetsManager("", this.globalGameStoragePath, this.versionCompareHandle.bind(this));
		if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
			var manifest = new jsb.Manifest(JSON.stringify(this.json), this.globalGameStoragePath);
			this._am.loadLocalManifest(manifest, this.globalGameStoragePath);
			cc.log("GGGG Using globalGameCustomManifest");
		}

		this._am.setVerifyCallback(function (path, asset) {
			var compressed = asset.compressed;
			var expectedMD5 = asset.md5;
			var relativePath = asset.path;
			var size = asset.size;
			if (compressed) {
				return true;
			} else {
				return true;
			}
		});

		if (cc.sys.os === cc.sys.OS_ANDROID) {
			this._am.setMaxConcurrentTask(2);
		}

		this._am.setEventCallback(this.globalCheckCb.bind(this));
		this._am.checkUpdate();
	},

	versionCompareHandle(versionA, versionB) {
		this.currentVersion = "v" + versionA;
		this.newVersion = "v" + versionB;
		cc.log("JS Custom Version Compare: version A is " + versionA + ", version B is " + versionB);
		var vA = versionA.split(".");
		var vB = versionB.split(".");
		for (var i = 0; i < vA.length; ++i) {
			var a = parseInt(vA[i]);
			var b = parseInt(vB[i] || 0);
			if (a === b) {
				continue;
			} else {
				return a - b;
			}
		}
		if (vB.length > vA.length) {
			return -1;
		} else {
			return 0;
		}
	},
	globalCheckCb(event) {
		cc.log("GGGG Code: " + event.getEventCode());
		switch (event.getEventCode()) {
			case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
				cc.log("GGGG checkCb : No local manifest file found, hot update skipped.");
				this.labelUpdateProgress.node.active = true;
				this.labelUpdateProgress.string = " Thiết lập trò chơi thất bại. Vui lòng thử lại sau ! ";
				this._am.setEventCallback(null);
				break;
			case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
			case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
				cc.log("GGGG checkCb : Fail to download manifest file, hot update skipped.");
				// this.labelUpdateProgress.node.active = true;
				// this.labelUpdateProgress.string = " Thiết lập trò chơi thất bại. Vui lòng thử lại sau ! ";
				this._am.setEventCallback(null);

				Global.ConfigLogin = JSON.parse(this.reviceConfigResponse).d;
				//cc.log("con fig ca " + JSON.stringify(dataJson) );
				// require("ScreenManager").getIns().LoadScene(SCREEN_CODE.LOGIN);
				cc.director.loadScene("LobbyScene");
				break;
			case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
				cc.log("GGGG checkCb : Already up to date with the latest remote version.");
				this._am.setEventCallback(null);

				let dataJson = JSON.parse(this.reviceConfigResponse);
				Global.ConfigLogin = dataJson.d;
				//cc.log("con fig ca " + JSON.stringify(dataJson) );
				// require("ScreenManager").getIns().LoadScene(SCREEN_CODE.LOGIN);
				cc.director.loadScene("LobbyScene");
				break;
			case jsb.EventAssetsManager.NEW_VERSION_FOUND:
				cc.log("GGGG checkCb : New version found, please try to update.");
				this._am.setEventCallback(null);
				this.globalUpdateGame();
				break;
			default:
				return; // return thoat khoi callback khi vao case 5
		}
	},

	globalUpdateGame() {
		cc.log("GGG globalUpdateGame ");
		if (this._am) {
			cc.log("GGG globalUpdateGame OK");
			this._am.setEventCallback(this.globalUpdateCb.bind(this));

			if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
				// var url = this.manifestUrl.nativeUrl;
				// if (cc.loader.md5Pipe) {
				//   url = cc.loader.md5Pipe.transformURL(url);
				// }
				// this._am.loadLocalManifest(url);
				var manifest = new jsb.Manifest(JSON.stringify(this.json), this.globalGameStoragePath);
				this._am.loadLocalManifest(manifest, this.globalGameStoragePath);
			}

			this._am.update();
			this.labelUpdateVersion.node.active = true;
			this.labelUpdateVersion.string = " Bản cập nhật : <color=#ff5722> " + this.currentVersion + " </c> -> <color=#64dd17>" + this.newVersion + " </c>";
			Global.newVersion = this.newVersion;
			this.labelUpdateProgress.node.active = true;
			this.labelUpdateProgress.string = "Loading  0 % ";
			this.loadingProgressBar.node.active = true;
			this.loadingProgressBar.fillRange = 0;
		}
	},

	globalUpdateCb(event) {
		var needRestart = false;
		var failed = false;
		switch (event.getEventCode()) {
			case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
				cc.log("GGGG updateCb :No local manifest file found, hot update skipped.");
				failed = true;
				break;
			case jsb.EventAssetsManager.UPDATE_PROGRESSION:
				cc.log("GGGG updateCb : UPDATE_PROGRESSION");
				let number = (100 * event.getPercent()).toFixed(0);
				if (number >= 100) number = 100;
				this.labelUpdateProgress.string = "Loading " + number + " % ";
				this.loadingProgressBar.node.active = true;
				this.loadingProgressBar.fillRange = event.getPercent();
				break;
			case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
			case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
				cc.log("GGGG updateCb Fail to download manifest file, hot update skipped.");
				failed = true;
				break;
			case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
				cc.log("GGGG updateCb Already up to date with the latest remote version.");
				failed = true;
				break;
			case jsb.EventAssetsManager.UPDATE_FINISHED:
				cc.log("GGGG updateCb Update finished.");
				needRestart = true;
				break;
			case jsb.EventAssetsManager.UPDATE_FAILED:
				cc.log("GGGG updateCb Update failed. : " + event.getMessage());
				// cho nay co the dung tinh nang tai lai toan bo hoac la tai phan bi loi : khong ro nua vi chua thu
				// neu cho retry thi xem code o phan download subgame ben tren
				failed = true;
				break;
			case jsb.EventAssetsManager.ERROR_UPDATING:
				cc.log("GGGG updateCb Asset update error: " + event.getAssetId() + ", " + event.getMessage());
				break;
			case jsb.EventAssetsManager.ERROR_DECOMPRESS:
				cc.log("GGGG updateCb ERROR_DECOMPRESS : " + event.getMessage());
				break;
			default:
				break;
		}

		if (failed) {
			this._am.setEventCallback(null);
			this.labelUpdateVersion.node.active = false;
			this.labelUpdateProgress.string = " Cập nhật thất bại. Vui lòng thử lại sau ! ";
		}

		if (needRestart) {
			this.labelUpdateVersion.node.active = false;
			this.labelUpdateProgress.string = " Cập nhật thành công. Game sẽ tự khởi động lại";
			this._am.setEventCallback(null);

			// let strTemp = jsb.fileUtils.getStringFromFile(this.globalGameStoragePath + "/assets/project.manifest");
			// jsb.fileUtils.writeStringToFile(strTemp, this.globalGameStoragePath + "/project.manifest");

			// Prepend the manifest's search path
			var searchPaths = jsb.fileUtils.getSearchPaths();
			var newPaths = this._am.getLocalManifest().getSearchPaths();
			Array.prototype.unshift.apply(searchPaths, newPaths);
			// This value will be retrieved and appended to the default search path during game startup,
			// please refer to samples/js-tests/main.js for detailed usage.
			// !!! Re-add the search paths in main.js is very important, otherwise, new scripts won't take effect.
			cc.sys.localStorage.setItem("SearchAssets", JSON.stringify(searchPaths));
			jsb.fileUtils.setSearchPaths(searchPaths);
			// setTimeout(function () {
			cc.audioEngine.stopAll();
			cc.game.restart();
			//}, 2000);
		}
	},

	initUrl(url) {
		let uri = this.globalGameStoragePath + "/project.manifest";
		if (jsb.fileUtils.isFileExist(uri)) {
			cc.log("str get la " + uri);
			let strTemp = jsb.fileUtils.getStringFromFile(uri);
			cc.log("str get la " + strTemp);
			if (strTemp != null && strTemp != "") {
				let obj = JSON.parse(strTemp);
				obj.packageUrl = url;
				obj.remoteManifestUrl = url + "project.manifest";
				obj.remoteVersionUrl = url + "version.manifest";
				let strWirte = JSON.stringify(obj);
				jsb.fileUtils.writeStringToFile(strWirte, this.globalGameStoragePath + "/project.manifest");
			}
		}

		this.json = this.manifest.json;
		this.json.packageUrl = url;
		this.json.remoteManifestUrl = url + "project.manifest";
		this.json.remoteVersionUrl = url + "version.manifest";
	},
	checkListVerRemove() {
		if (!cc.sys.isNative) return;
		let uri = this.globalGameStoragePath + "/project.manifest";
		if (jsb.fileUtils.isFileExist(uri)) {
			let strTemp = jsb.fileUtils.getStringFromFile(uri);
			let obj = JSON.parse(strTemp);
			if (LIST_VERSION_REMOVE.includes(obj.version)) {
				cc.log("remove" + JSON.stringify(LIST_VERSION_REMOVE));
				cc.log("gia tri la " + jsb.fileUtils.removeDirectory(this.globalGameStoragePath));
				cc.audioEngine.stopAll();
				cc.game.restart();
			}
		}
	},

	onClickShowSupport() {
		cc.tween(this.nodeSupport).to(0.2, { scale: 1 }, { easing: "backOut" }).start();
	},

	onClickHideMask() {
		cc.tween(this.nodeSupport).to(0.2, { scale: 0 }, { easing: "backIn" }).start();
	},

	onClickSupport(event, data) {
		cc.log("Chgeck data support ", this.dataSupport);
		if (!this.dataSupport) {
			cc.log("k co du lieu");
			return;
		}
		let itemSupport = parseInt(data);
		switch (itemSupport) {
			case 1:
				cc.sys.openURL(this.dataSupport.Fanpage);
				break;

			case 2:
				let phone = this.dataSupport.HotLine;
				if (phone == null || phone == "") return;
				if (cc.sys.isNative) {
					let url = "tel:" + phone;
					cc.sys.openURL(url);
				} else {
					this.showConfirmPopup(MyLocalization.GetText("HOT_LINE").replace("%n", phone));
				}
				break;
			case 3:
				cc.sys.openURL(this.dataSupport.HotSmsFanpage);
				break;
		}
	},

	showConfirmPopup(message, yesEvent, noEvent = null) {
		cc.resources.load("Popup/ConfirmPopup", cc.Prefab, (err, prefab) => {
			let item = cc.instantiate(prefab).getComponent("ConfirmPopup");
			Global.ConfirmPopup = item;
			item.show(message, yesEvent, noEvent);
			this.node.addChild(item.node);
			item.node.zIndex = 999;
		});
	},
});
