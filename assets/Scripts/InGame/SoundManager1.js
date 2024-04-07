var objAudioClip = {};
var objGameTypeOff = {
   "0": 0,
   "1": 0,
    "2": 0,
    "3": 0,
    "5": 0,
    "4": 0,
    "7": 0,
     "8": 0,
     "9": 0,
     "10": 0,
    "13": 0,

     "20": 0,
    "21": 0,
     "22": 0,
     "23": 0,
    "24": 0,
   "25": 0,
     "30": 0,
     "31": 0,
};

var SoundManager1 = cc.Class({
    extends: cc.Component,

    properties: {
        isPlayMusic : true,
    },
    statics: {
        getIns() {
            if (this.self == null) {
                this.self = new SoundManager1();
            }
            return this.self;
        }
    },
    stopMusicBackground() {
        this.isPlayMusic = false;
        if (this.currentCipMusicBackGround != null) {
            cc.log("Stop Bg Music======>DOne"); 
            cc.audioEngine.stop(this.currentCipMusicBackGround);
        }
    },
    playMusicBackground(gameType = 0, ResDefine, volume = 0.3) {
        // gameType = 0 la lobby
        
        gameType = gameType.toString();
    this.isPlayMusic = true;

        if(gameType == 0 ){
            cc.loader.loadRes(ResDefine, cc.AudioClip, (err, clip) => {
                if (err) return;
                if (this.currentCipMusicBackGround != null) {
                    cc.audioEngine.stop(this.currentCipMusicBackGround);
                }
                if(this.isPlayMusic)
                    this.currentCipMusicBackGround = cc.audioEngine.play(clip, true, volume);
            });
        }else{
            let bundle = this.getBundle(gameType);
            if(bundle != null){
                bundle.load(ResDefine , cc.AudioClip , (err , clip) =>{
                    if (err) return;
                    if (this.currentCipMusicBackGround != null) {
                        cc.audioEngine.stop(this.currentCipMusicBackGround);
                    }
                    if(this.isPlayMusic)
                        this.currentCipMusicBackGround = cc.audioEngine.play(clip, true, volume);

                })
            }
        }

        
    },
    getBundle(gameType){
        return cc.assetManager.getBundle(gameType.toString());
    },
    playEffect( gameType = 0, ResDefine, isLoop = false, volume = 1) {
   // gameType = 0 la lobby
        if(objGameTypeOff[gameType] == 0) return;
        gameType = gameType.toString();
        if(gameType ==0){
            cc.loader.loadRes(ResDefine, cc.AudioClip, (err, clip) => {
                if (err) return;
                if (objAudioClip[gameType] &&objAudioClip[gameType][ResDefine] != null) {
                    cc.audioEngine.stop(objAudioClip[gameType][ResDefine]);
                }
                if(objAudioClip[gameType] == null) objAudioClip[gameType] = {};
                objAudioClip[gameType][ResDefine] = cc.audioEngine.play(clip, isLoop, volume);
    
    
            });
        }else{
            let bundle = this.getBundle(gameType);
            if(bundle != null){
                bundle.load(ResDefine , cc.AudioClip , (err , clip) =>{
                    if (err) return;
                    if (objAudioClip[gameType] && objAudioClip[gameType][ResDefine] != null) {
                        cc.audioEngine.stop(objAudioClip[gameType][ResDefine]);
                    }

                   

                    if(objAudioClip[gameType] == null) objAudioClip[gameType] = {};
                    objAudioClip[gameType][ResDefine] = cc.audioEngine.play(clip, isLoop, volume);

                })
            }
        }

        
    },
    stopEffect(gameType, ResDefine) {
        gameType = gameType.toString();
        if ( objAudioClip[gameType] && objAudioClip[gameType][ResDefine] != null) {
            cc.audioEngine.stop(objAudioClip[gameType][ResDefine]);
            objAudioClip[gameType][ResDefine] = null;
        }


    },
    pasauseEffect(gameType,ResDefine) {
        gameType = gameType.toString();
        if (objAudioClip[gameType] &&objAudioClip[gameType][ResDefine] != null) {
            cc.audioEngine.pause(objAudioClip[gameType][ResDefine]);
        }
    },

    resumeEffect(gameType,ResDefine) {
        gameType = gameType.toString();
        if (objAudioClip[gameType] &&objAudioClip[gameType][ResDefine] != null) {
            cc.audioEngine.resume(objAudioClip[gameType][ResDefine]);
        }
    },
    stopAllEffectByGameType(gameType){
        gameType = gameType.toString();
        objGameTypeOff[gameType] = 0;
        if(objAudioClip[gameType]){
            let obj = objAudioClip[gameType];
            for(let temp in obj){
                if(obj[temp])
                cc.audioEngine.stop(obj[temp]);
            }
        }
    },






    setStateSound(isActive){
        if(isActive){
            for(let temp in objGameTypeOff){
                objGameTypeOff[temp] = 1;
            }

        }else{

            for(let temp in objGameTypeOff){
                objGameTypeOff[temp] = 0;
            }

            for(let temp in objAudioClip){
                let objActive = objAudioClip[temp];
                if(objActive){
                    for(let temp2 in objActive){
                        let clip = objActive[temp2];
                        cc.audioEngine.stop(clip);
                    }
                }
            }

            objAudioClip = {};
        }
    },

    setStateMusic(isActive){

    },


    stopAll() {
        // for(let temp in objAudioClip){
        //     if(objAudioClip[temp] != null ){

        //     }
        // }
        cc.audioEngine.stopAll();
        objAudioClip = {};
    },

});

export default SoundManager1;