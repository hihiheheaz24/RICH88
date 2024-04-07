

cc.Class({
    extends: cc.Component,

    properties: {
        ip: "",
        ipSend: "178.128.127.199",
        CAfile: {
            type: cc.Asset,
            default: null
        },
    },


    start() {
        cc.game.addPersistRootNode(this.node);
        this.onTimeOut = false;
    },

    init(ip) {
        this.ip = Global.GameConfig.UrlGameLogic.WebServerLogicAddress;
    },

    connect_sv(urlConnect) {
        cc.log("check url connect : ", urlConnect)
        try {
            var connect = new signalR.HubConnectionBuilder()
                .withUrl(urlConnect)
                .withAutomaticReconnect([0, 3000, 6000, 10000, 10000, 10000, 10000, 10000])
                // .withUrl("https://devserver.vpl.asia/network")  // sv test
                .build();
            // connect.serverTimeoutInMilliseconds = 120000;
            // connect.keepAliveIntervalInMilliseconds = 60000;
        } catch (error) {
            cc.log("loi connect")
        }

        connect.on("sendToClient", function (opCode, message) {
            // cc.log("check op code : ", opCode , " va messgae ", message )
            switch (opCode) {
                case RESPONSE_CODE.CTP_OPERATION_CODE:
                    require("ReceiveResponse").getIns().reviceData(message);
                    break;
                case RESPONSE_CODE.CTP_EVENT_CODE:

                switch (key) {
                    case value:
                        
                        break;
                
                    default:
                        break;
                }

                    require("CardReceiveResponse").getIns().reviceData(message);
                    break;
            }

            // Đã ngắt kết nối ở máy chủ, client chủ động ngắt kết nối
            if (opCode == 49) {
                console.log('ngat ket noi tu server');
                Global.NetworkManager.OnDisconnect();
                Global.NetworkManager._connect.stop();
            }

        });


        connect.onreconnected(data => {
            cc.error('on reconnected success');
            Global.NetworkManager.connect();
            Global.UIManager.hideMiniLoading();
        });



        connect.start().then(function () {
            console.log('connection started succes');
            Global.NetworkManager.connect();
        }).catch(function (err) {
            Global.NetworkManager.OnDisconnect();
            console.log("Loi ket noi : ", err.message);
            return
        });

        // Hàm xử lý lúc ngắt kết nối
        connect.onclose(error => {
            console.log("ngat ket noi ..");
            if (Global.isLogin) {
                Global.UIManager.showCommandPopup(MyLocalization.GetText("DISCONNECT"));
            }
            Global.LeagueData = null;
            Global.LeagueLInfo = null;
            Global.NetworkManager.OnDisconnect();
        });

        //fix
        this._connect = connect;
    },

    sendRequest(code, msg, isAiPoker = 100) {
        if (this._connect && this._connect.connectionState !== "Connected") {
            cc.log("send error");
            // this.OnDisconnect();
            // Global.UIManager.showCommandPopup(MyLocalization.GetText("DISCONNECT"));
            return;
        }

        cc.log("check accestoken ", Global.AcessToken)

        msg[200] = code;
        msg[250] = code;
        msg[254] = Global.AcessToken;
        msg[255] = this.ipSend;
        //cc.log("Send Request:" + JSON.stringify(msg));
        let arr = [];
        for (let temp in msg) {
            arr.push(parseInt(temp));
            arr.push(msg[temp])
        }



        var data = {
            "vals": msg
        }
        cc.log("send data service : " + JSON.stringify(data));

        cc.log("check connect la : ", this._connect)

        try {
            this._connect.send('sendToServer', isAiPoker, JSON.stringify(data));
        } catch (err) {
            console.log("loi : ", err)
            this.OnDisconnect();
        }
    },
    sendCardRequest(requestCode, msg, gameCode, isCardCode = 105) {
        if (this._connect && this._connect.connectionState !== "Connected") {
            cc.log("send error");
            // this.OnDisconnect();
            // Global.UIManager.showCommandPopup(MyLocalization.GetText("DISCONNECT"));
            return;
        }
        msg[ParameterCode.CodeRun] = requestCode;
        msg[250] = requestCode;
        msg[255] = this.ipSend;
        msg[254] = Global.AcessToken;
        let arr = [];
        for (let temp in msg) {
            arr.push(parseInt(temp));
            arr.push(msg[temp])
        }


        var data = {
            "vals": msg
        }

        if (requestCode !== "SBI9")
        cc.log("!> send data game : " + JSON.stringify(data));

        try {
            this._connect.invoke('SendToServerAsync', isCardCode, JSON.stringify(data));
        } catch (err) {
            console.log("send data error => disconnect ")
            this.OnDisconnect();
        }
    },

    fun1(data) {
        require("ReceiveResponse").getIns().reviceData(data);
    },
    fun2(data) {
        require("CardReceiveResponse").getIns().reviceData(data);
    },
    fun3(data) {
        require("CardReceiveResponse").getIns().reviceData(data);
    },


    connect() {
        this.onTimeOut = false;
        let source = "";
        if (cc.sys.isBrowser) {
            source = "1";//CONFIG.SOURCE_ID_WEB;
        }
        else if (cc.sys.os.toString() == "Android") {
            source = "3";
        }
        else if (cc.sys.os == cc.sys.OS_IOS) {
            source = "2";
        }
        else if (cc.sys.os == cc.sys.OS_WINDOWS) {
            source = "4";
        }

        let msgData = {};
        cc.log(Global.CookieValue);
        msgData[1] = Global.CookieValue;
        msgData[2] = CONFIG.MERCHANT;
        msgData[3] = source;
        msgData[4] = CONFIG.VERSION;
        msgData[5] = 3; //game id
        require("SendRequest").getIns().MST_Client_Login(msgData);

    },
    
    connectClosed() {
        Global.isLogin = false;
        this.LoadLoginScene();
        Global.UIManager.showCommandPopup(MyLocalization.GetText("DISCONNECT"));
        Global.UIManager.onDisconnect();
        cc.log("connectClosed -> disconnect server")
    },
    disconnect() {
        
        if(this._connect && this._connect.connectionState === "Connected"){
            cc.log("connect -> disconnect");
            this._connect.stop();
        }
       
    },

    OnDisconnect() {
        console.log("poker on disconnect");
        Global.isLogin = false;
        this.LoadLoginScene();
        // Global.UIManager.showCommandPopup(MyLocalization.GetText("DISCONNECT"));
        Global.UIManager.onDisconnect();
        // this._connect.disconnect();
    },

    LoadLoginScene() {
        require("ScreenManager").getIns().LoadScene(SCREEN_CODE.LOGIN);
    },

    SetTimeOnline(minute) {
        cc.log("chay vao set time online received : ", minute)
        this.timeOnline = minute * 60;
        cc.log("cgheck time online : ", this.timeOnline)
    },

    GetTimeRemain() {
        return parseInt(this.timeOnline);
    },

    update(dt) {
        if (this.timeOnline > 0) {
            this.timeOnline -= dt;
            if (this.timeOnline < 0) {
                if (Global.LobbyView) {
                    require("SendRequest").getIns().MST_Client_Receive_TimeOnline_Reward();
                }
            }
        }
    },

    onLoad() {
        if (Global.NetworkManager != null) {
            this.node.destroy();
            return;
        }
        Global.NetworkManager = this;
        Global.CApem = this.CAfile.nativeUrl;
    },

    onDestroy() {
        // Global.NetworkManager = null;
    },



});
