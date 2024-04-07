cc.Class({
  extends: require("ParentChangePositionEDB"),

  properties: {
    inputUserNameLogin: cc.EditBox,
    inputPassWordLogin: cc.EditBox,
    edbCapcha: cc.EditBox,
    nodeCapCha: cc.Node,
    nodeLogin: cc.Node,
    nodeRegister: cc.Node,
    nodeInput: cc.Node,
    edbPassWord: cc.EditBox,
    toggleSave: cc.Toggle,
    listSupport: cc.Node,
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    this.resignEdb(this.inputUserNameLogin);
    this.resignEdb(this.inputPassWordLogin);
    this.resignEdb(this.edbCapcha);

    this.resignNext(this.inputUserNameLogin, "inputPassWordLogin");
    Global.LoginTabView = this;
    this.funEmit = null;
    this.node.active = true;
  },

  onEnable() {
    this.nodeCapCha.active = false;
    this.inputUserNameLogin.string = "";
    this.inputPassWordLogin.string = "";
    this.edbCapcha.string = "";
    let strSave = cc.sys.localStorage.getItem("isSavePass");
    if (strSave != null && strSave != "" && strSave != "not") {
      let user = cc.sys.localStorage.getItem(CONFIG.KEY_USERNAME);
      let pass = cc.sys.localStorage.getItem(CONFIG.KEY_PASSWORD);
      if (user != null) this.inputUserNameLogin.string = user;
      if (pass != null) this.inputPassWordLogin.string = pass;
      this.toggleSave.check();
    } else if (strSave === null) {
      this.toggleSave.check();
      let str = "yes";
      cc.sys.localStorage.setItem("isSavePass", str);
    } else {
      this.toggleSave.uncheck();
    }
    Global.EDBController.onEventEnter(
      (this.funEmit = () => {
        this.onClickBtnLogin();
      })
    );
    this.nodeLogin.active = false;
    this.nodeRegister.active = false;
  },

  onToggleSaveInfo(event, date) {
    let isChecked = event.isChecked;
    let str = "not";
    if (isChecked) str = "yes";
    cc.sys.localStorage.setItem("isSavePass", str);
  },

  onDestroy() {
    Global.LoginTabView = null;
  },
  onClickReFeshCapcha() {
    Global.CapchaController.requestCapcha();
  },
  onClickClose() {
    cc.log("chay vao offf tab");
    this.node.active = false;
    // Global.onPopOff(this.node);
  },
  show() {
    cc.log("chay vao showw tab");
    this.node.active = true;
  },
  showCapcha() {
    this.nodeCapCha.active = true;
    Global.CapchaController.requestCapcha();
    //
  },
  // start () {
  onClickBtnLogin() {
    // //Global.AudioManager
    if (this.inputUserNameLogin.string.length < 6) {
      Global.UIManager.showCommandPopup(MyLocalization.GetText("USER_NAME_MIN_6"), null);
      return;
    }
    if (this.inputPassWordLogin.string.length < 6) {
      Global.UIManager.showCommandPopup(MyLocalization.GetText("PASS_WORD_MIN_6"), null);
      return;
    }
    Global.LoginView.requestLogin(this.inputUserNameLogin.string, this.inputPassWordLogin.string, this.edbCapcha.string, false);
  },

  onClickShowPass(event, data) {
    if (event.isChecked) this.edbPassWord.inputFlag = 5;
    else this.edbPassWord.inputFlag = 0;
  },

  clickForgotPass() {
    cc.sys.openURL(Global.ConfigLogin.HotSmsFanpage);
  },

  onClickShowRegister() {
    Global.UIManager.showMask();
    Global.nodeInOutToRight(this.nodeRegister, null, true);
    Global.nodeInOutToLeft(null, this.nodeLogin, true);
  },

  onClickShowLogin() {
    Global.UIManager.showMask();
    Global.nodeInOutToRight(this.nodeLogin, null, true);
    Global.nodeInOutToLeft(null, this.nodeRegister, true);
  },

  onClickCloseLogin() {
    Global.UIManager.hideMask();
    Global.nodeInOutToLeft(null, this.nodeLogin, true);
  },

  onClickCloseRegister() {
    Global.UIManager.hideMask();
    Global.nodeInOutToLeft(null, this.nodeRegister, true);
  },

  onClickShowListSupport(event, data) {},

  ClickBtnMessage() {
    //Global.AudioManager.ClickButton();
    cc.sys.openURL(Global.ConfigLogin.HotSmsFanpage);
  },

  onClickFanpage() {
    cc.sys.openURL(Global.ConfigLogin.FanpageUrl);
  },

  ClickBtnHotLine() {
    //Global.AudioManager.ClickButton();
    if (!Global.CheckFunction(Global.GameConfig.FeatureConfig.OpenFanPageFeature)) return;

    //cc.log(Global.ConfigLogin);
    let phone = Global.ConfigLogin.HotLine;
    if (phone == null || phone == "") return;
    if (cc.sys.isNative) {
      let url = "tel:" + phone;
      cc.sys.openURL(url);
      require("Util").onCallPhone(phone);
    } else {
      Global.UIManager.showConfirmPopup(MyLocalization.GetText("HOT_LINE").replace("%n", phone));
    }
  },

  onClickPlayNow() {
    let accPlayNow = cc.sys.localStorage.getItem("USER_PLAYNOW");
    let passPlayNow = cc.sys.localStorage.getItem("PASS_PLAYNOW");
    if(Global.deviceId && accPlayNow === null){
      accPlayNow = Global.deviceId;
      passPlayNow = "vpl" + Global.deviceId;

      cc.sys.localStorage.setItem("USER_PLAYNOW", accPlayNow);
      cc.sys.localStorage.setItem("PASS_PLAYNOW", passPlayNow);
    }
    else{
      if (accPlayNow == null){
        let timeSta = new Date().getTime();
        let textRandom = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < 10; i++) textRandom += possible.charAt(Math.floor(Math.random() * possible.length));
  
        accPlayNow = timeSta;
        passPlayNow = "vpl" + timeSta + textRandom;

        cc.sys.localStorage.setItem("USER_PLAYNOW", accPlayNow);
        cc.sys.localStorage.setItem("PASS_PLAYNOW", passPlayNow);
      }    
    }
 
    console.log("check device id : ", Global.deviceId)
    console.log("check acc play now la : ", accPlayNow);
    console.log("check pass play now la : ", passPlayNow);
    Global.LoginView.requestFastLogin(accPlayNow, passPlayNow);
  },

  gnerateDeviceId() {
    if (!cc.sys.isNative) {
      let deviceId = cc.sys.localStorage.getItem("GEN_DEVICEID");
      if (deviceId === null) {
        deviceId = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        for (var i = 0; i < 6; i++) {
          deviceId += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        deviceId += "-";
        for (var _i = 0; _i < 4; _i++) {
          deviceId += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        deviceId += "-";
        for (var _i2 = 0; _i2 < 4; _i2++) {
          deviceId += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        deviceId += "-";
        for (var _i3 = 0; _i3 < 4; _i3++) {
          deviceId += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        deviceId += "-";
        for (var _i4 = 0; _i4 < 8; _i4++) {
          deviceId += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        cc.sys.localStorage.setItem("GEN_DEVICEID", deviceId);
      }

      return deviceId;
    }
  },

  onClickNull() {
    Global.UIManager.showCommandPopup("Tính năng đang phát triển");
  },

  onDisable() {
    Global.EDBController.offEventEnter(this.funEmit);
  },

  // update (dt) {},
});
