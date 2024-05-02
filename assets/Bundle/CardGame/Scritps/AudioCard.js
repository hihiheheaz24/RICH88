cc.Class({
    extends: require("ParentAudio"),

    properties: {
        // audiosPoker: [cc.AudioSource],
    },
    // LIFE-CYCLE CALLBACKS:
    // onLoad () {},

   
    stopMusic() {
        this._super();
        this.stopInGame();
    },
    playMusic() {
        this._super();
        this.stopSound(); // ra ngoaif lobby thi dung het sound
    },
    playChiaBai() {
        if (this.isActiveSound) this.audios[5].play();
    },
    stopChiaBai() {
        this.audios[5].stop();
    },

    playCountDown() {
        if (this.isActiveSound) this.audios[6].play();
    },
    stopCountDown() {
        this.audios[6].stop();
    },

    playJoinRoom() {
        if (this.isActiveSound && !this.audios[7].isPlaying && !this.audios[8].isPlaying && Global.RandomNumber(0, 2) == 0) { // 50% phat join room
            let rd = Global.RandomNumber(7, 9);
            this.audios[rd].play();
        }
    },
    stopJoinRoom() {
        this.audios[7].stop();
        this.audios[8].stop();
    },


    playLose() {
        if (this.isActiveSound) { // 50% phat join room
            let rd = Global.RandomNumber(9, 11);
            this.audios[rd].play();
        }
    },
    stopLose() {
        this.audios[9].stop();
        this.audios[10].stop();
    },

    playWin() {
        if (this.isActiveSound) { // 50% phat join room
            this.audios[11].play();
        }
    },
    stopWin() {
        this.audios[11].stop();
    },

    playTurn() {
        if (this.isActiveSound) { // 50% phat join room
            this.audios[12].play();
        }
    },
    stopTurn() {
        this.audios[12].stop();
    },

    danh2(){
        if(!this.isActiveSound) return;
        this.audios[23].play();
    },

    baiDacBiet(){
        if(!this.isActiveSound) return;
        this.audios[24].play();
    },

    danhBai(){
        if(!this.isActiveSound) return;
        this.audios[25].play();
    },

    playRocketFly() {
        // this.audios[27].play();
    },

    stopRocketFly() {
        // this.audios[27].stop();
    },

    playBoom() {
        // this.audios[28].play();
      },
      stopBoom() {
        // this.audios[28].stop();
      },


    playAgain() {
        let isCheck = false;

        for (let i = 13; i < 19; i++) {
            if (this.audios[i].isPlaying) {
                isCheck = true;
                break;
            }
        }

        if (this.isActiveSound && !isCheck && Global.RandomNumber(0, 2) == 0) { // 50% phat agin room
            let rd = Global.RandomNumber(13, 19);
            this.audios[rd].play();
        }
    },
    stopAgain() {

    },

    playKill() {
        this.stopAgain();
        if (this.isActiveSound) { // 50% phat agin room
            let rd = Global.RandomNumber(19, 23);
            this.audios[rd].play();
        }
    },
    stopAgain() {
        for (let i = 19; i < 23; i++) {
            this.audios[i].stop();
        }
    },

    // sound poker
    
    pokerAllinChip(){
        if(!this.isActiveSound) return;
        this.audiosPoker[13].play();
    },

    pokerAllinVoice(){
        if(!this.isActiveSound) return;
        this.audiosPoker[4].play();
    },

    pokerRaiseChip(){
        if(!this.isActiveSound) return;
        this.audiosPoker[10].play();
    },

    pokerRaiseVoice(){
        if(!this.isActiveSound) return;
        this.audiosPoker[3].play();
    },

    pokerCallChip(){
        if(!this.isActiveSound) return;
        this.audiosPoker[9].play();
    },

    pokerCallVoice(){
        if(!this.isActiveSound) return;
        this.audiosPoker[2].play();
    },

    pokerCheckChip(){
        if(!this.isActiveSound) return;
        this.audiosPoker[8].play();
    },

    pokerCheckVoice(){
        if(!this.isActiveSound) return;
        this.audiosPoker[11].play();
    },

    pokerVoiceFold(){
        if(!this.isActiveSound) return;
        this.audiosPoker[1].play();
    },

    pokerWinPot(){
        if(!this.isActiveSound) return;
        this.audiosPoker[6].play();
    },

    pokerWinGame(){
        if(!this.isActiveSound) return;
        this.audiosPoker[12].play();
    },

    pokerShowCard(){
        if(!this.isActiveSound) return;
        this.audiosPoker[0].play();
    },

    pokerDealCardBoard(){
        if(!this.isActiveSound) return;
        this.audiosPoker[7].play();
    },

    pokerDealCard(){
        if(!this.isActiveSound) return;
        this.audiosPoker[5].play();
    },

    toiTrangTLMN(){
        if(!this.isActiveSound) return;
        this.audios[26].play();
    },

    // update (dt) {},
});
