
cc.Class({
	extends: cc.Component,
	ctor() {
		this.isInitAssets = true;
		this.ForcedUpdate = true;
		this.aniUpdate = null;
		this.countFail = 0;
		this.btnMiniGame = null;
		this.perMiniGame = null;
		this.isFirtInit = true;

		this.funProgress = null;
		this.funFinish = null;
		this.isSuccessUpdate = false;


		this.customManifestStr = {
			"packageUrl": "",
			"remoteManifestUrl": "",
			"remoteVersionUrl": "",
			"version": "1.0.0",
			"assets": {
			},
			"searchPaths": []
		};
		this.verBCache = "1.0.0";
	},
	properties: {
		gameType: {
			default: 0,
			type: cc.Integer
		},
		urlGameRes: {
			default: ""
		},
		_isInit: false,
	},

	// LIFE-CYCLE CALLBACKS:

	onLoad() {

	},

	onDestroyClass() {
		console.log("chay me vao destroy class update manager");
		if (this._am) this._am.setEventCallback(null);
		this._checkListener = null;
		this._updateListener = null;
	},
	dynamicUpdate() {
		if (this._am && !this._updating) {
			this._am.setEventCallback(this.updateCb.bind(this));
			if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
				var manifest = new jsb.Manifest(JSON.stringify(this.customManifestStr), this._storagePath);
				this._am.loadLocalManifest(manifest, this._storagePath);
			}
			this._failCount = 0;
			this._am.update();
			this._updating = true;
		} else {
			let _this = this;
			this.scheduleOnce(function () {
				_this.dynamicUpdate();
			}, 0.5)
		}
	},
	checkUpdate() {
		console.log("Check Update");
		if (this._updating) {
			console.log("Checking or updating ...");
			return;
		}
		if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
			// Resolve md5 url
			console.log("check manifest : ", JSON.stringify(this.customManifestStr))
			var manifest = new jsb.Manifest(JSON.stringify(this.customManifestStr), this._storagePath);
			this._am.loadLocalManifest(manifest, this._storagePath);
		}

		if (
			!this._am.getLocalManifest() ||
			!this._am.getLocalManifest().isLoaded()
		) {
			console.log("Failed to load local manifest ...");
			return;
		}
		this._am.setEventCallback(this.checkCb.bind(this));
		this._am.checkUpdate();
		this._updating = true;
	},
	getManifest() {
		let urlChidl = linkBundle;

		// urlChidl = "https://rik88.asia/bundle/%n/"
		let uri = this._storagePath + "/project.manifest";
		let verCurrent = "1.0.0";
		if (jsb.fileUtils.isFileExist(uri)) {
			urlChidl = urlChidl.replace("%n", this.gameType + "full");
			this.isFirtInit = false;
			let strTemp = jsb.fileUtils.getStringFromFile(uri);
			let obj = JSON.parse(strTemp);
			obj.packageUrl = urlChidl;
			obj.remoteManifestUrl = urlChidl + "project.manifest";
			obj.remoteVersionUrl = urlChidl + "version.manifest";
			let strWirte = JSON.stringify(obj);
			jsb.fileUtils.writeStringToFile(strWirte, this._storagePath + "/project.manifest");
			verCurrent = obj.version;
		} else {
			urlChidl = urlChidl.replace("%n", this.gameType);
		}
		console.log("check ver childgame : ", verChildGame[this.gameType])
		let verInServer = verChildGame[this.gameType];
		this.customManifestStr.packageUrl = urlChidl;
		this.customManifestStr.remoteManifestUrl = urlChidl + "project.manifest";
		this.customManifestStr.remoteVersionUrl = urlChidl + "version.manifest";
		console.log("check manifest : ", urlChidl + "version.manifest")
		let isReturn = this.versionCompareHandleCheck(verCurrent, verInServer) >= 0 ? false : true;
		console.log("gia tri return trong getmanifet " + isReturn);
		return isReturn
	},
	updateCb: function (event) {
		console.log("chay vao update start")
		var needRestart = false;
		var failed = false;
		switch (event.getEventCode()) {
			case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
				failed = true;
				break;
			case jsb.EventAssetsManager.UPDATE_PROGRESSION:

				let getPercent = event.getPercent();
				if (isNaN(getPercent)) getPercent = 0;
				if (getPercent > 1.0) getPercent = 1;
				let temp = parseInt(getPercent * 100);
				if (this.funProgress) this.funProgress(temp);

				var msg = event.getMessage();
				if (msg) {
					console.log("Updated file: " + msg);
				}
				break;
			case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
			case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
				console.log("lo down load == bo qua");
				failed = true;
				break;
			case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
				console.log("phien ban moi nhat");


				failed = true;
				break;
			case jsb.EventAssetsManager.UPDATE_FINISHED:
				console.log("Update finished. " + event.getMessage());
				needRestart = true;
				break;
			case jsb.EventAssetsManager.UPDATE_FAILED:
				console.log("Update failed. " + event.getMessage());

				this.countFail++;
				if (this.countFail < 5) {
					this._am.downloadFailedAssets();
					this._updating = false;
					this._canRetry = true;
				} else {
					jsb.fileUtils.removeDirectory(this._storagePath);
					failed = true;
					this.countFail = 0;
				}

				break;
			case jsb.EventAssetsManager.ERROR_UPDATING:
				console.log(
					"Asset update error: " +
					event.getAssetId() +
					", " +
					event.getMessage()
				);
				break;
			case jsb.EventAssetsManager.ERROR_DECOMPRESS:
				console.log("loi la==>" + event.getMessage());
				failed = true;
				break;
			default:
				break;
		}

		if (failed) {
			this._am.setEventCallback(null);
			this._updateListener = null;
			this._updating = false;
			this.funFinish();
		}
		if (needRestart) {

			if (this.isFirtInit) {
				let strProjectManifestTemp = this._storagePath + "/assets/project.manifest";
				if (jsb.fileUtils.isFileExist(strProjectManifestTemp)) {
					let strTemp = jsb.fileUtils.getStringFromFile(strProjectManifestTemp);
					jsb.fileUtils.writeStringToFile(strTemp, this._storagePath + "/project.manifest");
				}
			}
			var searchPaths = jsb.fileUtils.getSearchPaths();
			var newPaths = this._am.getLocalManifest().getSearchPaths();
			Array.prototype.unshift.apply(searchPaths, newPaths);
			cc.sys.localStorage.setItem(
				"SearchAssets",
				JSON.stringify(searchPaths)
			);
			let str = "updateResource" + this.gameType;
			cc.sys.localStorage.setItem(str, false);
			jsb.fileUtils.setSearchPaths(searchPaths);
			this._am.setEventCallback(null);
			this.funFinish();
		}
	},
	checkCb: function (event) {
		let str = "updateResource" + this.gameType;
		console.log("Code: " + event.getEventCode());

		console.log("check Code: ERROR_NO_LOCAL_MANIFEST " +  jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST);
		console.log("check Code: ERROR_DOWNLOAD_MANIFEST " + jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST);
		console.log("check Code: ERROR_PARSE_MANIFEST " + jsb.EventAssetsManager.ERROR_PARSE_MANIFEST);
		console.log("check Code: ALREADY_UP_TO_DATE " + jsb.EventAssetsManager.ALREADY_UP_TO_DATE);
		console.log("check Code: NEW_VERSION_FOUND " + jsb.EventAssetsManager.NEW_VERSION_FOUND);
		

		switch (event.getEventCode()) {
			case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
				console.log("ko tim thay mainfest file");
				if (this.funFinish) this.funFinish();
				break;
			case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
			case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
				console.log("loi ERROR_PARSE_MANIFEST");
				console.log("loi ERROR_DOWNLOAD_MANIFEST");
				if (this.funFinish) this.funFinish();
				break;
			case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
				console.log("Phien ban moi nhat " + this.verBCache);

				verChildGame[this.gameType] = this.verBCache;
				cc.sys.localStorage.setItem(str, false);
				if (this.funFinish) this.funFinish();
				break;
			case jsb.EventAssetsManager.NEW_VERSION_FOUND:
				console.log("bat dau update");
				this.dynamicUpdate();
				break;
			default:
				return;
		}
		// this._am.setEventCallback(null);
		console.log("chay xuong duoi")
		this._am.setEventCallback(null);
		this._checkListener = null;
		this._updating = false;
	},


	initProgress(funProgress, funFinish) {
		// this.funProgress = funProgress;
		this.funFinish = funFinish;
	},
	versionCompareHandle(versionA, versionB) {
		console.log("check version b la : ", versionB);
		console.log(
			"JS Custom Version Compare: version A is " +
			versionA +
			", version B is " +
			versionB
		);


		var vA = versionA.split(".");
		var vB = versionB.split(".");
		this.verBCache = versionB
		// _this.versionA = versionA;
		// _this.versionB = versionB;
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
	versionCompareHandleCheck(versionA, versionB) {
		console.log(
			"JS Custom Version Compare check: version A is " +
			versionA +
			", version B is " +
			versionB
		);


		var vA = versionA.split(".");
		var vB = versionB.split(".");
		// _this.versionA = versionA;
		// _this.versionB = versionB;
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
	updateAsset(gameType) {

		this.gameType = gameType;
		// if(cc.sys.os == cc.sys.OS_WINDOWS ) return false; // danh cho simulator
		if (LIST_GAME_ASSET.includes(gameType)) return false
		this._storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") + "AllGame/" + gameType;

		// doan nay la danh cho fix loi

		let urlFixloi = this._storagePath + "/project.manifest";
		if (jsb.fileUtils.isFileExist(urlFixloi)) {
			let str = jsb.fileUtils.getStringFromFile(urlFixloi);
			let obj = JSON.parse(str);
			let ver = obj.version;
			let listCheck = ver.split(".");
			if (listCheck.length < 3) {
				console.log("game nay bi loi " + jsb.fileUtils.removeDirectory(this._storagePath))
			}
		}



		let objRemove = LIST_REMOVE_BUNDLE_GAME;
		let versionRemove = objRemove[gameType];
		console.log("check version remove : ", versionRemove)
		if (versionRemove != null) {
			let url = this._storagePath + "/project.manifest";
			if (jsb.fileUtils.isFileExist(url)) {
				let str = jsb.fileUtils.getStringFromFile(url);
				let obj = JSON.parse(str);
				if (versionRemove == obj.version) {
					console.log("gia tri la " + jsb.fileUtils.removeDirectory(this._storagePath));
				}
			}
		}

		let isReturn = this.getManifest();
		if (!isReturn) return false;
		console.log("chay tiep update asset : ", this._storagePath)
		this._am = new jsb.AssetsManager(
			"",
			this._storagePath,
			this.versionCompareHandle
		);
		this._am.setVerifyCallback(function (path, asset) {

			var compressed = asset.compressed;

			var expectedMD5 = asset.md5;

			var relativePath = asset.path;

			var size = asset.size;
			if (compressed) {
				console.log("Verification passed : " + relativePath);
				return true;
			} else {
				console.log(
					"Verification passed : " + relativePath + " (" + expectedMD5 + ")"
				);
				return true;
			}
		});
		// if (cc.sys.os === cc.sys.OS_ANDROID) {
		// 	this._am.setMaxConcurrentTask(2);
		// }
		console.log("end update asset")
		return true;
	},

	getIsSuccesUpdate() {
		console.log("hahaha vao destroy class");
	}
	// update (dt) {},
});

