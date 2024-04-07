// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: require("ParentChangePositionEDB"),

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        inputUserNameRegister:cc.EditBox,
        inputPassWordRegister:cc.EditBox,
        inputRePassWordRegister:cc.EditBox,
        edbCapcha:cc.EditBox,
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        this.resignEdb(this.inputUserNameRegister); 
		this.resignEdb(this.inputPassWordRegister); 
		this.resignEdb(this.inputRePassWordRegister); 
		this.resignEdb(this.edbCapcha); 
       
		this.resignNext(this.inputUserNameRegister , "inputPassWordRegister");
		this.resignNext(this.inputPassWordRegister , "inputRePassWordRegister");
		this.resignNext(this.inputRePassWordRegister , "edbCapcha");
         Global.RegisterTabView = this;
         this.userNameTemp = "";
		this.userPassTemp = "";
        // Global.onPopOn(this.node);
     },
     onDestroy () {
        Global.RegisterTabView = null;
    },
    onClickReFeshCapcha(){
        Global.CapchaController.requestCapcha();
    },
    onClickClose() {
        // Global.onPopOff(this.node);
    },
    show() {
        // Global.onPopOn(this.node);
    },
   
    // start () {
    onClickConfirmRegister() {
        if (this.inputUserNameRegister.string.length < 6) {
            Global.UIManager.showCommandPopup(MyLocalization.GetText("USER_NAME_MIN_6"), null);
            return;
        }
        if (this.inputPassWordRegister.string.length < 6) {
            Global.UIManager.showCommandPopup(MyLocalization.GetText("PASS_WORD_MIN_6"), null);
            return;
        }
        if (/\s/g.test(this.inputPassWordRegister.string) == true) {
            Global.UIManager.showCommandPopup(MyLocalization.GetText("PASS_WORD_SPACE"), null);
            return;
        }
        if (/^[a-zA-Z0-9]*$/.test(this.inputPassWordRegister.string) == false) {
            Global.UIManager.showCommandPopup(MyLocalization.GetText("PASS_WORD_SPECIAL"), null);
            return;
        }
        if (this.inputPassWordRegister.string != this.inputRePassWordRegister.string) {
            Global.UIManager.showCommandPopup(MyLocalization.GetText("PASS_WORD_NOT_SAME"), null);
            return;
        }

        var data = {
            AccountName: this.inputUserNameRegister.string,
            Password: this.inputPassWordRegister.string,
            MerchantId: "1",
            Captcha: this.edbCapcha.string,
            Verify: Global.CapchaController.veriLogin,
            TimeCaptcha: Global.CapchaController.timeLogin,
        }

        this.userNameTemp = this.inputUserNameRegister.string;
        this.userPassTemp =  this.inputPassWordRegister.string;
        require("BaseNetwork").request(Global.ConfigLogin.RegisterUrl, data, this.ReceiveRegister.bind(this));
        Global.UIManager.showMiniLoading();
    },

        ReceiveRegister(data) {
            Global.UIManager.hideMiniLoading();
            var rs = JSON.parse(data);
            cc.log( "Dang ky user : " + rs);
            if (rs.c != 0) {
                Global.UIManager.showCommandPopup(MyLocalization.GetText(rs.m), null);
            }
            else {
                Global.LoginView.requestLogin(this.userNameTemp, this.userPassTemp , this.edbCapcha.string, false);
            }
        },

 
    
    // },
    onEnable(){
       this.inputUserNameRegister.string = "";
       this.inputPassWordRegister.string = "";
       this.inputRePassWordRegister.string = "";
       this.edbCapcha.string = "";
        this.onClickReFeshCapcha();
        Global.EDBController.onEventEnter(this.funEmit = ()=>{
            this.onClickConfirmRegister();
        });
    },
    onDisable(){
        Global.EDBController.offEventEnter(this.funEmit);
    },

    onClickShowPassRegis1(event , data){
        if(event.isChecked)
            this.inputPassWordRegister.inputFlag = 5;
        else
            this.inputPassWordRegister.inputFlag = 0;
    },

    onClickShowPassRegis2(event , data){
        if(event.isChecked)
            this.inputRePassWordRegister.inputFlag = 5;
        else
            this.inputRePassWordRegister.inputFlag = 0;
    },


    // update (dt) {},
});
