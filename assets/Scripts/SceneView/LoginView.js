cc.Class({
	extends: require("ParentChangePositionEDB"),
	properties: {},
	onLoad() {
		Global.LoginView = this;
	},

	onEnable() { },

	InitFacebookSdkBox() {
		if (typeof sdkbox === "undefined") return;
		if (!sdkbox.PluginFacebook) return;
		if (cc.sys.os == cc.sys.OS_WINDOWS || cc.sys.os == cc.sys.OS_OSX) return;
		sdkbox.PluginFacebook.init();
		sdkbox.PluginFacebook.setListener({
			onLogin: function (isLogin, msg) {
				if (isLogin) {
					var data = {
						id: sdkbox.PluginFacebook.getUserID(),
						token: sdkbox.PluginFacebook.getAccessToken(),
					};
					Global.LoginView.LoginWithFacebookData(data);
				} else {
					//	cc.sys.openURL("https://www.banca.com/" + msg);
					Global.UIManager.hideMiniLoading();
					cc.log("PPP onLogin :  login failed");
				}
			},
		});
	},

	requestLogin(username, password, capcha, isPlayNow = true) {
		var data = {
			AccountName: username,
			Password: password,
			MerchantId: "1",
			Captcha: capcha,
			Verify: Global.CapchaController.veriLogin,
			TimeCaptcha: Global.CapchaController.timeLogin,
		};
		if (!isPlayNow) {
			cc.sys.localStorage.setItem(CONFIG.KEY_USERNAME, username);
			cc.sys.localStorage.setItem(CONFIG.KEY_PASSWORD, password);
		}
		Global.UIManager.showMiniLoading();
		require("BaseNetwork").request(Global.ConfigLogin.LoginUrl, data, this.LoginAuthenProcess.bind(this));
	},

	requestLoginTelegram(teleName) {
		var data = {
			GameCode: 7,
			AccountName: teleName,
			MerchantId: "1",
			Verify: Global.CapchaController.veriLogin,
			TimeCaptcha: Global.CapchaController.timeLogin,
		};
		cc.log("request login : ")
		require("BaseNetwork").request(Global.ConfigLogin.FastLoginUrl, data, this.LoginAuthenProcess.bind(this));
	},

	requestFastLogin(username, password) {
		var data = {
			AccountName: username,
			Password: password,
			MerchantId: "1",
			Captcha: "",
			Verify: Global.CapchaController.veriLogin,
			TimeCaptcha: Global.CapchaController.timeLogin,
		};
		console.log("check data send request : ", JSON.stringify(data))
		require("BaseNetwork").request(Global.ConfigLogin.FastLoginUrl, data, this.LoginAuthenProcess.bind(this));
	},

	onClickLogin() {
		Global.UIManager.showLoginTabView();
	},

	onClickPlayNowLogin() {
		let accPlayNow = cc.sys.localStorage.getItem("USER_PLAYNOW");
		let passPlayNow = cc.sys.localStorage.getItem("PASS_PLAYNOW");
		if (Global.deviceId && accPlayNow === null) {
			accPlayNow = Global.deviceId;
			passPlayNow = "vpl" + Global.deviceId;

			cc.sys.localStorage.setItem("USER_PLAYNOW", accPlayNow);
			cc.sys.localStorage.setItem("PASS_PLAYNOW", passPlayNow);
		}
		else {
			if (accPlayNow == null) {
				let timeSta = new Date().getTime();
				let textRandom = "";
				let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
				for (let i = 0; i < 10; i++) textRandom += possible.charAt(Math.floor(Math.random() * possible.length));

				accPlayNow = timeSta;
				passPlayNow = "rik" + timeSta + textRandom;

				cc.sys.localStorage.setItem("USER_PLAYNOW", accPlayNow);
				cc.sys.localStorage.setItem("PASS_PLAYNOW", passPlayNow);
			}
		}

		console.log("check device id : ", Global.deviceId)
		console.log("check acc play now la : ", accPlayNow);
		console.log("check pass play now la : ", passPlayNow);
		Global.LoginView.requestFastLogin(accPlayNow, passPlayNow);
	},

	onClickDangKy() {
		Global.UIManager.showRegisterTabView();
	},

	LoginAuthenProcess(data) {
		var rs = JSON.parse(data);
		cc.log("check data login : ", data);
		// Global.UIManager.hideMiniLoading();
		if (rs.c != 0) {
			cc.log("error");
			Global.UIManager.hideMiniLoading();
			// Global.UIManager.showLoginTabView();
			if (rs.c == -101) {
				if (Global.LoginTabView) Global.LoginTabView.showCapcha();
				Global.UIManager.showCommandPopup(MyLocalization.GetText("NEED_CAPTCHA"), null);
			} else if (rs.c != -54) {
				cc.log("show error");
				Global.UIManager.showCommandPopup(MyLocalization.GetText(rs.m), null);
			} else {
				Global.CookieValue = rs.d.Cookie;
				Global.AcessToken = rs.d.AccessToken;
				Global.UIManager.showSetNamePopup(rs.d.NickName, this.UpdateNickName.bind(this));
			}
		} else {
			if(Global.LoginTabView){
				Global.LoginTabView.onClickClose();
			}
			if(Global.RegisterTabView){
				Global.RegisterTabView.onClickClose();
			}
			
			if (Global.SetNamePopup) Global.SetNamePopup.Hide();
			Global.AcessToken = rs.d.AccessToken;
			cc.log("check login : ", rs.d);
			Global.IsNewUser = rs.d.IsNewUser;
			this.LoginSuccess(rs.d);
			if (rs.d.UserName === cc.sys.localStorage.getItem(CONFIG.KEY_USERNAME)) {
				cc.sys.localStorage.setItem("FAST_LOGIN_USERNAME", cc.sys.localStorage.getItem(CONFIG.KEY_USERNAME));
				cc.sys.localStorage.setItem("FAST_LOGIN_PASSWORD", cc.sys.localStorage.getItem(CONFIG.KEY_PASSWORD));
			}
			else {
				cc.sys.localStorage.setItem("FAST_LOGIN_USERNAME", cc.sys.localStorage.getItem("USER_PLAYNOW"));
				cc.sys.localStorage.setItem("FAST_LOGIN_PASSWORD", cc.sys.localStorage.getItem("PASS_PLAYNOW"));
			}
		}
	},

	UpdateNickName(accountName) {
		var data = {
			NewNickName: accountName,
			Cookie: Global.CookieValue,
		};
		require("BaseNetwork").request(Global.ConfigLogin.UpdateInfoUrl, data, Global.LoginView.LoginAuthenProcess.bind(this));
		// Global.UIManager.showMiniLoading();
	},

	LoginSuccess(data) {
		require("ScreenManager").getIns().currentScreen = SCREEN_CODE.LOBBY;
		Global.CookieValue = data.Cookie;
		Global.LobbyView.Connect();
	},

	load_Facebook_SDK() {
		if (!cc.sys.isBrowser) {
			cc.log("isMobile");
		} else {
			cc.log("isBrowser");
			var check_SDK_Exist = true;
			var temp = setInterval(function () {
				cc.log("setInterval   ");
				if (!check_SDK_Exist) {
					cc.log("clearInterval");
					clearInterval(temp);
					return;
				}

				if (document.getElementById("fb-root")) {
					check_SDK_Exist = false;
					Global.LoginView.InitFacebookSdk();
				}
			}, 500);

			(function (d, s, id) {
				var js,
					fjs = d.getElementsByTagName(s)[0];
				if (d.getElementById(id)) return;
				js = d.createElement(s);
				js.id = id;
				js.src = "https://connect.facebook.net/vi_VN/sdk.js";
				fjs.parentNode.insertBefore(js, fjs);
			})(document, "script", "facebook-jssdk");
		}
	},

	InitFacebookSdk() {
		FB.init({
			appId: "753166882278013",
			cookie: true, // enable cookies to allow the server to access
			xfbml: true, // parse social plugins on this page
			version: "v3.2", // The Graph API version to use for the call
		});
	},
	OnFbStatusChangeCallback(response) {
		cc.log("statusChangeCallback");
		if (response.status === "connected") {
			// Logged into your app and Facebook.
			cc.log("Welcome!");
		} else {
			// The person is not logged into your app or we are unable to tell.
			cc.log("Please log into this app.");
		}
	},
	CheckLFbLoginState() {
		FB.getLoginStatus(function (response) {
			this.OnFbStatusChangeCallback(response);
		});
	},

	SignInFb() {
		if (typeof sdkbox === "undefined") return;
		if (!cc.sys.isNative) {
			FB.login(
				function (response) {
					// handle the response
					if (response.status === "connected") {
						// Logged into your app and Facebook.
						cc.log("login  : connected");
						var userId = response.authResponse.userID;
						var accessToken = response.authResponse.accessToken;
						var data = {
							id: userId,
							token: accessToken,
						};
						Global.LoginView.LoginWithFacebookData(data);
					} else {
						// The person is not logged into this app or we are unable to tell.
						cc.log("Not sigin");
					}
				},
				{
					scope: "public_profile,email",
				}
			);
			var curlocation = window.location.href;
			urlFB = urlFB + "?ref=" + curlocation;
			window.location = "https://vb.sieuthibanca.club/";
			Global.isClickLogout = false;
			window.location = "https://52.sieuthibanca.club/";
		} else {
			cc.log("send login:");
			if (sdkbox.PluginFacebook.isLoggedIn) {
				var data = {
					id: sdkbox.PluginFacebook.getUserID(),
					token: sdkbox.PluginFacebook.getAccessToken(),
				};
				if (data.id.toString().length == 0 || data.token.length == 0) {
					sdkbox.PluginFacebook.logout();
					Global.UIManager.showMiniLoading();
					sdkbox.PluginFacebook.login();
					return;
				}
				Global.LoginView.LoginWithFacebookData(data);
			} else {
				Global.UIManager.showMiniLoading();
				sdkbox.PluginFacebook.login();
			}
			require("Util").onLoginFb();
		}
	},
	LoginWithFacebookData(data) {
		var d = {
			Token: data.token,
			MerchantId: 1,
		};
		cc.log("Token");
		cc.log(d);
		require("BaseNetwork").request(Global.ConfigLogin.LoginFbUrl, d, this.LoginAuthenProcess.bind(this));
	},

	enableResigeTab() { },
	disableResigeTab() { },

	onDestroy() {
		Global.LoginView = null;
	},

	// update (dt) {},
});
