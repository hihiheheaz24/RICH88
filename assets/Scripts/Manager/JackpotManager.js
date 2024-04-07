var JackpotManager = cc.Class({
	statics: {
        getIns() {
            if (this.self == null) this.self = new JackpotManager();
            return this.self;
        }
    },

    properties: {
        jackpotValueRoom1 : 0,
        jackpotValueRoom2 : 0,
        jackpotValueSlot1Room1 : 0,
        jackpotValueSlot1Room2 : 0,
        jackpotValueSlot1Room3 : 0,
        jackpotValueSlot2Room1 : 0,
        jackpotValueSlot2Room2 : 0,
        jackpotValueSlot2Room3 : 0,
    },

    SetValueJackpotRoom1(jackpotValue) {
        this.jackpotValueRoom1 = jackpotValue;
    },

    SetValueJackpotRoom2(jackpotValue) {
        this.jackpotValueRoom2 = jackpotValue;
    },

    SetValueJackpotSlot1Room1(jackpotValue) {
        this.jackpotValueSlot1Room1 = jackpotValue;
    },

    SetValueJackpotSlot1Room2(jackpotValue) {
        this.jackpotValueSlot1Room2 = jackpotValue;
    },

    SetValueJackpotSlot1Room3(jackpotValue) {
        this.jackpotValueSlot1Room3 = jackpotValue;
    },

    SetValueJackpotSlot2Room1(jackpotValue) {
        this.jackpotValueSlot2Room1 = jackpotValue;
    },

    SetValueJackpotSlot2Room2(jackpotValue) {
        this.jackpotValueSlot2Room2 = jackpotValue;
    },

    SetValueJackpotSlot2Room3(jackpotValue) {
        this.jackpotValueSlot2Room3 = jackpotValue;
    },

    GetValueJackpotRoom1() {
        return this.jackpotValueRoom1;
    },

    GetValueJackpotRoom2() {
        return this.jackpotValueRoom2;
    },

    GetValueJackpotSlot1Room1() {
        return this.jackpotValueSlot1Room1;
    },

    GetValueJackpotSlot1Room2() {
        return this.jackpotValueSlot1Room2;
    },

    GetValueJackpotSlot1Room3() {
        return this.jackpotValueSlot1Room3;
    },

    GetValueJackpotSlot2Room1() {
        return this.jackpotValueSlot2Room1;
    },

    GetValueJackpotSlot2Room2() {
        return this.jackpotValueSlot2Room2;
    },

    GetValueJackpotSlot2Room3() {
        return this.jackpotValueSlot2Room3;
    },
    
});
module.exports = JackpotManager;
