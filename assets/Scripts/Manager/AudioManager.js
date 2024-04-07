

cc.Class({
    extends: cc.Component,
    ctor() {
        this.currentIndex1 = 0;
        this.currentIndex2 = 7;
        this.musicValue = 0;
        this.soundValue = 0;
        this.lobbyMusicId = 0;
        this.inGameMusicId = 0;
    },

    properties: {
        audios: [cc.AudioSource],
        backgroundMusicAudio: cc.AudioSource,
    },

    start() {
        cc.game.addPersistRootNode(this.node);
        this.SetUpAudioStartGame();
    },

    SetUpAudioStartGame() {

        let isSound = cc.sys.localStorage.getItem(CONFIG.KEY_SOUND) || 1;
        this.SetUpSound(isSound);
        this.soundValue = isSound;

        let isMusic = cc.sys.localStorage.getItem(CONFIG.KEY_MUSIC) || 1;
        this.SetUpMusic(isMusic);
        this.musicValue = isMusic;
        this.SaveStatusAudio();
    },

    SetUpSound(value) {
        for (let i = 0; i < this.audios.length; i++) {
            this.audios[i].volume = value;
        }
        if (value == 0) {
            for (let i = 0; i < this.audios.length; i++) {
                this.audios[i].stop();
            }
        }
    },

    SetUpMusic(value) {
        //this.backgroundMusicAudio.volume = value;
        cc.audioEngine.setMusicVolume(value);
    },

    SaveStatusAudio() {
        cc.sys.localStorage.setItem(CONFIG.KEY_MUSIC, this.musicValue);
        cc.sys.localStorage.setItem(CONFIG.KEY_SOUND, this.soundValue);
    },

    ChangeValueMusic(value) {
        this.musicValue = value;
        this.SetUpMusic(value);
        this.SaveStatusAudio();
    },

    ChangeValueSound(value) {
        this.soundValue = value;
        this.SetUpSound(value);
        this.SaveStatusAudio();
    },

    GetValueMusic() {
        return this.musicValue;
    },

    GetValueSound() {
        return this.soundValue;
    },


    PlayMusicInGameSlot() {
        //this.backgroundMusicAudio.stop();
        cc.audioEngine.stopMusic();
    },
    PlayMusicInGameCard() {
        //this.backgroundMusicAudio.stop();
        cc.audioEngine.stopMusic();
    },

    //sound
    ClickButton() {
        this.PlayAudio1("ClickButton");
    },

    
    //play
    PlayAudio1(clipName) {
        this.currentIndex1 += 1;
        if (this.currentIndex1 >= 6)
            this.currentIndex1 = 0;
        cc.resources.load("Sound/" + clipName, cc.AudioClip, (err, pre) => {
            // this.audios[this.currentIndex1].clip = pre;
            // this.audios[this.currentIndex1].play();
            if (err) return;
            cc.audioEngine.play(pre, false, this.soundValue);
        });
    },

    PlayAudio2(clipName) {
        this.currentIndex2 += 1;
        if (this.currentIndex2 >= 9)
            this.currentIndex2 = 6;
        cc.resources.load("Sound/" + clipName, cc.AudioClip, (err, pre) => {
            // this.audios[this.currentIndex2].clip = pre;
            // this.audios[this.currentIndex2].play();
            if (err) return;
            cc.audioEngine.play(pre, false, this.soundValue);
        });
    },

    onLoad() {
        //Global.AudioManager = this;
    },
});
