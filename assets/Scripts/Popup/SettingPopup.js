cc.Class({
    extends: cc.Component,

    properties: {
        // scrollMusic: cc.Slider,
        // scrollSound: cc.Slider,
        // barMusic: cc.Sprite,
        // barSound: cc.Sprite,
        // btnSoundOn: cc.Button,
        // btnSoundOff: cc.Button,
        // btnMusicOn: cc.Button,
        // btnMusicOff: cc.Button
        toggleMusic:cc.Toggle,
        toggleSound:cc.Toggle,
    },


    start() {
        let isActiveSound = cc.sys.localStorage.getItem("sound");
        let isActiveMusic = cc.sys.localStorage.getItem("music");
        if(isActiveSound == null || isActiveSound == "" || isActiveSound == 'off') {
            //this.isActiveSound = false;
            this.toggleSound.uncheck();
        }else{
           // this.isActiveSound = true;
            this.toggleSound.check();
        }
        if(isActiveMusic == null || isActiveMusic == "" || isActiveMusic == 'off') {
           // this.isActiveMusic = false;
            this.toggleMusic.uncheck();
        }else{
           // this.isActiveMusic = true;
            this.toggleMusic.check();
        }


    },

    setupInfo() {
        // this.btnMusicOn.node.active = //Global.AudioManager.GetValueMusic() > 0 ? false : true;
        // this.btnMusicOff.node.active = //Global.AudioManager.GetValueMusic() > 0 ? true : false;
        // this.btnSoundOn.node.active = //Global.AudioManager.GetValueSound() > 0 ? false : true;
        // this.btnSoundOff.node.active = //Global.AudioManager.GetValueSound() > 0 ? true : false;
    },

    show() {
        // this.node.active = true;
        Global.onPopOn(this.node);
    },

    // ChangeValueMusic(slider, event) {
    //     this.barMusic.fillRange = 1 - slider.progress;
    //     //Global.AudioManager.ChangeValueMusic(slider.progress);
    // },

    // ChangeValueSound(slider, event) {
    //     this.barSound.fillRange = 1 - slider.progress;
    //     //Global.AudioManager.ChangeValueSound(slider.progress);
    // },

    Hide() {
        Global.onPopOff(this.node);
        if(Global.GroupMenuInGame) Global.GroupMenuInGame.reset();
        // Global.MenuSettingView.changeIcon();
    },

    onDestroy() {
        Global.SettingPopup = null;
    },
    onSoundClicked(event, index) {
        this.isActiveSound = this.toggleSound.isChecked;
      if(Global.AudioManager)  Global.AudioManager.isActiveSound = this.isActiveSound;
        // cc.log("gia tri la " + Global.AudioManager.isActiveSound)
        // cc.log("gia tri la " + this.isActiveSound)
    },
    onMusicClicked(event, index) {
        this.isActiveMusic = this.toggleMusic.isChecked;
        if(Global.AudioManager) Global.AudioManager.isActiveMusic = this.isActiveMusic;
    },
});
