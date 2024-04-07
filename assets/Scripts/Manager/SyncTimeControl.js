var SyncTimeControl = cc.Class({
    statics: {
        getIns() {
            if (this.self == null) this.self = new SyncTimeControl();
            return this.self;
        }
    },

    properties: {
        pingTime: 0,
        receivePingTime: 0,
        realtimeStartUpWhenPing: 0,
    },

    SetReceivePingTime(sendClientTime, receiveClientTime, receiveServerTime) {
        var ServerTime = this.convertTime(receiveServerTime);
        var deltaPingTime = parseFloat(receiveClientTime) - parseFloat(sendClientTime);
        this.receivePingTime = ServerTime.getTime() + deltaPingTime / 2 * 0.001;
        let currentDateTime = new Date();
        this.realtimeStartUpWhenPing = currentDateTime.getTime() - Global.startAppTime.getTime();

        cc.log("get current time server:" + this.GetCurrentTimeServer());
    },

    GetCurrentTimeServer() {
        let currentDateTime = new Date();
        var currentRealTime = currentDateTime.getTime() - Global.startAppTime.getTime();
        var returnValue = currentRealTime - this.realtimeStartUpWhenPing + this.receivePingTime;
        return returnValue;
    },

    SendPing() {
        let msgTime = {};
        let currentDateTime = new Date();
        var currentRealTime = currentDateTime.getTime() - Global.startAppTime.getTime();
        msgTime[1] = currentRealTime.toString();
        require("SendRequest").getIns().MST_Client_Send_Ping(msgTime);
    },

    HandlePing(packet) {
        var sendClientTime = packet[1];
        var receiveServerTime = packet[2];
        let currentDateTime = new Date();
        var currentRealTime = currentDateTime.getTime() - Global.startAppTime.getTime();
        var receiveClientTime = currentRealTime.toString();
        this.SetReceivePingTime(sendClientTime, receiveClientTime, receiveServerTime);
    },

    //string to dateTime
    convertTime(str) {
        let arr = str.split(" ");
        let timeConvert = arr[0].split("/").reverse().join("-") + "T" + arr[1] + "+07:00";
        return new Date(timeConvert);
    },

    //minisecond to string of dateTime
    convertTimeToString(times) {
        let date = new Date(times);
        let lbDate = date.getDate();
        if (lbDate < 10) lbDate = "0" + lbDate;
        let lbMonth = date.getMonth();
        if (lbMonth < 9) lbMonth = "0" + (lbMonth + 1);
        else lbMonth = "" + (lbMonth + 1);


        let lbHour = date.getHours();
        if (lbHour < 10) lbHour = "0" + lbHour;
        let lbMinute = date.getMinutes();
        if (lbMinute < 10) lbMinute = "0" + lbMinute;
        let lbSeccond = date.getSeconds();
        if (lbSeccond < 10) lbSeccond = "0" + lbSeccond;
        let minisecon = date.getMilliseconds().toString();
        let length = minisecon.length;
        for (let i = 0; i < 4 - length; i++) {
            minisecon += "0";
        }

        let str = lbDate + "/" + lbMonth + "/" + date.getFullYear() + " " + lbHour + ":" + lbMinute + ":" + lbSeccond + "." + minisecon;
        return str;
    },

});
module.exports = SyncTimeControl;