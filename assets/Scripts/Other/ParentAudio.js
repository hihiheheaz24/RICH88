cc.Class({
    extends: cc.Component,
    ctor(){
        this._isActiveSound = true;
        this._isActiveMusic = true;
        // this.isActiveSound = true;
    },
    properties: {
        audioClick : cc.AudioSource,
        audioCoin :cc.AudioSource,
        audios: [cc.AudioSource],
        audiosPoker: [cc.AudioSource],
        backgroundMusicAudio: cc.AudioSource,
        ingameAudio: cc.AudioSource,
        audioJoinGame: cc.AudioSource,
        isActiveSound:{
            get(){
                return this._isActiveSound;
            },
            set(value) {
                if(value != this._isActiveSound){
                    if(!value){
                        cc.sys.localStorage.setItem("sound" , "off")
                        this.stopSound();
                    }else{
                        cc.sys.localStorage.setItem("sound" , "on")
                    }
                }
                this._isActiveSound = value;
            }
        },
        isActiveMusic:{
            get(){
                return this._isActiveMusic;
            },
            set(value) {
                cc.log("value la "+ value)
                this._isActiveMusic = value;
                if(value != this._isActiveSoun){
                    if(!value){
                        cc.sys.localStorage.setItem("music" , "off")
                        this.stopMusic();
                    }else{
                        cc.sys.localStorage.setItem("music" , "on")
                        this.playMusic();
                    }
                }
            }
        }

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
        Global.AudioManager = this;
        cc.log("check cgeck ecj : ", this.isActiveMusic)
       
        // this.isActiveSound = true;
    },
    onEnable (){
      if(this.backgroundMusicAudio)  this.backgroundMusicAudio.loop = true;
        let isActiveSound = cc.sys.localStorage.getItem("sound");
        let isActiveMusic = cc.sys.localStorage.getItem("music");

        if(isActiveSound == 'off') {
            this.isActiveSound = false;
        }else{
            this.isActiveSound = true;
        }
        if(isActiveMusic == 'off') {
            this.isActiveMusic = false;
        }else{
            this.isActiveMusic = true;
        }
        if(this.isActiveMusic) this.playMusic();
    },

    clickButtonAudio(){
        if(!this.isActiveSound) return;
        this.audioClick.play();
    },

    playMusicJoinGamePlay(){
        if(this.audioJoinGame && this._isActiveSound) this.audioJoinGame.play();
    },
    playMusicJoinGameStop(){
        if(this.audioJoinGame) this.audioJoinGame.stop();
    },
    playMusic(){
        if(this.isActiveMusic && this.backgroundMusicAudio){
            if(Global.GameView){
                Global.AudioManager.playInGame();
            }
            else{
                this.backgroundMusicAudio.play();
            }
           
        } 
       
    },
    stopMusic() {
        if (this.backgroundMusicAudio) {
            this.backgroundMusicAudio.stop();
        }

        this.stopInGame();
    },

    playInGame() {
        if (this.backgroundMusicAudio) {
            cc.log("chay vao stop muasic")
            this.backgroundMusicAudio.stop();
        }
        if (!this.isActiveMusic) return;
        cc.log("chay vao stop muasic", this.isActiveMusic)
        this.ingameAudio.play();
        if(this.ingameAudio)  this.ingameAudio.loop = true;
       
    },
    stopInGame() {
        this.ingameAudio.stop();
    },

    onDestroy() {
        Global.AudioManager = null;
    },
    stopSound(){
        for(let i = 0 , l = this.audios.length; i < l ; i++){
            if(this.audios[i]) this.audios[i].stop();
        }
    }, 
    
    playAudioCoin(){
        this.audioCoin.play();
    },
    // start () {   

    // },

    // update (dt) {},
});
