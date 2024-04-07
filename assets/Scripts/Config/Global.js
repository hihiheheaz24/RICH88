var _utf8_encode =function (string) {  
    string = string.replace(/\r\n/g,"\n");  
    var utftext = "";  
    for (var n = 0; n < string.length; n++) {  
        var c = string.charCodeAt(n);  
        if (c < 128) {  
            utftext += String.fromCharCode(c);  
        } else if((c > 127) && (c < 2048)) {  
            utftext += String.fromCharCode((c >> 6) | 192);  
            utftext += String.fromCharCode((c & 63) | 128);  
        } else {  
            utftext += String.fromCharCode((c >> 12) | 224);  
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);  
            utftext += String.fromCharCode((c & 63) | 128);  
        }  

    }  
    return utftext;  
}  
window.Global = {
    CariName: "",
    UIManager: null,
    NetworkManager: null,
    SpecialGunManager: null,
    AudioManager: null,
    CookieValue: null,
    AcessToken: null,
    deviceId: "",
    isShowShop: false,
    isLogin: false,
    IsNewUser: false,
    LeagueData: null,

    //data
    TourType: 0,
    DataNews: null,
    DataConfigShopDiamond: null,
    MissionFail: false,
    TodayMission: null,

    RuleGamePoker: null,
    MiniGameView: null,
    CookieValue: null,
    startAppTime: null,
    statusAuthen: 0, //0-NONE, 1-SHOW, 2-NOT_SHOW, 3-CLOSE
    indexDailyReward: 0,
    indexOnlineReward: 0,
    PokerRoomType: 0,
    PokerIdRoom: 0,
    RoomID: 0,
    CreatTableReconnect: 0,
    DaycountMax: 0,
    listDailyReward: [],
    listOnlineReward: [],
    listReward: [],
    listResult: null,
    currentSpin: 0,
    listNotifyDefault: [],
    listDelayReward: [],
    DienThongTin: null,
    listPromotionCashIn: null,

    dataSmsItem: null,
    //config
    taiXiuConfigTime: null,
    ConfigLogin: null,
    GameConfig: null,
    gunConfigModelRoom1: null,
    gunConfigModelRoom2: null,
    shopSpinConfig: null,
    smsTopupInfosIn: null,
    cardTopupInfosIn: null,
    cardTopupInfosOut: null,
    cardGameConfig: null,
    momoTopupInfosIn: null,
    bankTopupInfosIn: null,
    //view
    LoginView: null,
    LobbyView: null,
    InGameView: null,
    ChooseTable: null,

    isPortrait: false,
    //ingame
    InGameManager: null,
    GameLogic: null,
    //popup
    LoginTabView : null,
    EventRanking: null,
    CommandPopup: null,
    NotifyPopup: null,
    ConfirmPopup: null,
    CheckAuthenPopup: null,
    ShopPopup: null,
    TopView: null,
    JackPotView: null,
    ShowRewardPopup: null,
    ShopTabCashInBanking: null,
    NewsPopup: null,
    ShopTabCashOut: null,
    WeeklyRewardPopup: null,
    QuestPopup: null,
    VipInfoPopup: null,
    ShopIAP: null,
    ProfileLobby: null,
    GiftCodePopup: null,
    LuckySpinPopup: null,
    MailPopup: null,
    EventPopup: null,
    ProfilePopup: null,
    ShopDiamondPopup: null,
    HelpPopup: null,
    SettingPopup: null,
    HistoryPopup: null,
    ServerRewardPopup: null,
    RankPopup: null,
    TopDaiGia: null,
    MoiChoi: null,
    CashOutCard: null,
    CashOutMomo: null,
    PromotionView: null,
    PassWordPopup: null,
    PokerStatusPopup: null,
    DataConfigSpinGo: null,
    TournamentView: null,
    CashOutPartner: null,
    TransferChip: null,
    FirstCashIn: null,
    InfoPlayerTLMN: null,
    BannerPopup : null,

    testWindow: null,
    //----- Game---
    GameScence: null,
    EgryptGameView: null,
    FishCaMap: null,

    RePlayViewPoker: null,

    //--- Minigame--
    BtnMiniGame: null,

    //Mini Poker
    MiniPoker: null,

    //Tai Xiu
    TaiXiu: null,
    HistoryTaiXiu: null,
    XepHangTaiXiu: null,
    SoiCauTaiXiu: null,
    ChiTietPhienTaiXiu: null,
    TopDuDay : null,
    HDDuDay : null,
    SlotGameType: 0, // 0 slot Tầm Bảo , 1 slot Mỹ Nhân

    //Mini Slot
    MiniSlot: null,
    GuideMiniSlot: null,
    HistoryMiniSlot: null,
    RankMiniSlot: null,

    //Lode
    LoDe : null,
    ChonSoLoDe : null,
    ResultView : null,
    LoDeHistory : null,
    GuideViewLoDe : null,
    TopViewLoDe : null,
    InfoBetting : null,

    //XocDia

    XocDia : null,
    HistoryXocDia : null,

    // --- Card Game
    CardGameManager: null,
    CardAudioManager: null,
    TLMNView: null,
    PokerView: null,
    PokerViewPortrait: null,
    SamView: null,
    BaCayView: null,
    PhomView: null,
    MauBinhView: null,
    GroupMenuInGame: null,
    GameView: null,
    isTyping: false,
    IpClient: "1.1.1.1",

    listCacheShow: [],
    isShow: true,
    EventSanHeo: null,
    //
    SlectTable: null,
    LinkUpdateStore: "",
    FAQ: null,
    LeaguePopup: null,
    SessionKeyAdmod: null,
    MinMoneyAdmob: 0,
    LeagueLInfo : null,
    ReceivedFirstMisson : false,
    AgRewardAds : 0,
    newVersion : "1.0.0",
    isSendDanhBai : false,

    encode: function (input) {
        var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = _utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output + _keyStr.charAt(enc1) + _keyStr.charAt(enc2) + _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }
        return output;
    },
    setPingTime(packet) {
        let sendClientTime = packet[1];
        let receiveServerTime = packet[3];
        //  let test = new Date(receiveServerTime);
        let receiveClientTime = new Date().getTime();
        this.receivedTimeServer = receiveServerTime;
        let deltaPingTime = receiveClientTime - sendClientTime;
        this.timeInServer = receiveServerTime; // + (deltaPingTime / 2)  ;
        this.realtimeStartUpWhenPing = receiveClientTime;
        // cc.log("time in sever " + receiveServerTime);
        // cc.log("time in sever1 " + receiveClientTime);
    },

    getTime() {
        let returnValue = new Date().getTime() - this.realtimeStartUpWhenPing + this.timeInServer;
        return returnValue;
    },

    generateDate(data) {
        let date = new Date(data);
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();

        if (day < 10) {
            day = "0" + day;
        }
        if (month < 10) {
            month = "0" + month;
        }
        if (hours < 10) {
            hours = "0" + hours;
        }
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        cc.log("phus la : ", seconds);
        return hours + ":" + minutes + ":" + seconds + " " + day + "/" + month;
    },

    formatTimeBySec(time, houre = true) {
        time = parseInt(time);
        if (houre) {
            if (time <= 0) return "00:00:00";
            let hourse = Number.parseInt(time / (60 * 60));
            if (hourse > 0) time -= hourse * (60 * 60);
            let min = Number.parseInt(time / 60);
            if (min > 0) time -= min * 60;
            let sec = time % 60;
            if (hourse < 10) hourse = "0" + hourse;
            if (min < 10) min = "0" + min;
            if (sec < 10) sec = "0" + sec;
            return `${hourse}:${min}:${sec}`;
        } else {
            if (time <= 0) return "00:00";
            let hourse = Number.parseInt(time / (60 * 60));
            if (hourse > 0) time -= hourse * (60 * 60);
            let min = Number.parseInt(time / 60);
            if (min > 0) time -= min * 60;
            let sec = time % 60;
            if (hourse < 10) hourse = "0" + hourse;
            if (min < 10) min = "0" + min;
            if (sec < 10) sec = "0" + sec;
            return `${min}:${sec}`;
        }
    },

    formatTimeToDay(time) {
        time = parseInt(time);
        if (time <= 0) return "00:00:00:00";
        let day = Number.parseInt(time / (60 * 60 * 24));
        if (day > 0) time -= day * (60 * 60 * 24);

        let hourse = Number.parseInt(time / (60 * 60));
        if (hourse > 0) time -= hourse * (60 * 60);

        let min = Number.parseInt(time / 60);
        if (min > 0) time -= min * 60;

        let sec = time % 60;

        if (hourse < 10) hourse = "0" + hourse;
        if (min < 10) min = "0" + min;
        if (sec < 10) sec = "0" + sec;

        let msg = {};
        msg.day = day;
        msg.hourse = hourse;
        msg.min = min;
        msg.sec = sec;

        return msg;
    },

    convertTimeToSecond(data) {
        let date = new Date(data);
        let day = date.getDate();
        let month = date.getMonth();
        let year = date.getFullYear();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();

        return new Date(year, month, day, hours, minutes, seconds).getTime();
    },

    formatNumber(number, width = 0) {
        return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1."); //String(number).replace(/(.)(?=(\d{3})+$)/g, '$1,');
    },
    formatNumberPoker(number, width = 0) {
        let value = 0;
        if (number % 1 == 0) value = parseInt(number);
        else value = parseFloat(number.toFixed(2));

        if (value < 10000) return value;
        return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1."); //String(number).replace(/(.)(?=(\d{3})+$)/g, '$1,');
    },
    formatDate(str) {
        let date = new Date(str);
        let lbDate = date.getDate();
        if (lbDate < 10) lbDate = "0" + lbDate;
        let lbMonth = date.getMonth() + 1;
        if (lbMonth < 10) lbMonth = "0" + lbMonth;
        let lbHour = date.getHours();
        if (lbHour < 10) lbHour = "0" + lbHour;
        let lbMinute = date.getMinutes();
        if (lbMinute < 10) lbMinute = "0" + lbMinute;
        let lbSeccond = date.getSeconds();
        if (lbSeccond < 10) lbSeccond = "0" + lbSeccond;
        return lbDate + "/" + lbMonth + " " + lbHour + ":" + lbMinute + ":" + lbSeccond;
    },
    formatMoneyChip(money) {
        let format = "";
        let mo = Math.abs(money);
        //int cha;
        if (mo >= 1000000000) {
            mo /= 1000000000;
            format = "B";
        } else if (mo >= 1000000) {
            mo /= 1000000;
            format = "M";
        } else if (mo >= 1000) {
            mo /= 1000;
            format = "K";
        } else {
            return this.formatNumber(money);
        }

        let num = 0;

        if (mo % 1 == 0) num = parseInt(mo);
        else num = parseFloat(mo.toFixed(2));

        return money < 0 ? "-" + num + format : num + format;
    },

    formatMoneyPoker(money, label = null) {
        let format = "";
        let mo = Math.abs(money);
        //int cha;
        if (mo >= 10000) {
            mo /= 1000;
            format = "K";
            if (label) {
                label.enableBold = true;
                if (label.node.getComponent(cc.LabelOutline)) {
                    label.node.getComponent(cc.LabelOutline).enabled = true;
                }
            }
        } else {
            if (label) {
                if (label.node.getComponent(cc.LabelOutline)) {
                    label.node.getComponent(cc.LabelOutline).enabled = false;
                }
            }
            return this.formatNumber(money);
        }

        return money < 0 ? "-" + mo + format : mo + format;
    },

    formatMoney(num, digits = 1) {
        var si = [
            { value: 1, symbol: "" },
            { value: 1e3, symbol: "k" },
            { value: 1e6, symbol: "m" },
            { value: 1e9, symbol: "b" },
            { value: 1e12, symbol: "T" },
            { value: 1e15, symbol: "P" },
            { value: 1e18, symbol: "E" },
        ];
        var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
        var i;
        for (i = si.length - 1; i > 0; i--) {
            if (num >= si[i].value) {
                break;
            }
        }
        return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
    },
    getGameTypeByName(name) {
        switch (name) {
            case "PHO":
                return 22;
            case "SAM":
                return 24;
            case "BCA":
                return 23;
            case "TMN":
                return 21;
            case "PKR":
                return 20;
            case "MAB":
                return 25;
        }
    },

    getGameTypeById(id) {
        switch (id) {
            case 22:
                return "PHO";
            case 24:
                return "SAM";
            case 23:
                return "BCA";
            case 21:
                return "TMN";
            case 20:
                return "PKR";
            case 25:
                return "MAB";
        }
    },

    getGameIdByName(name) {
        switch (name) {
            case "PKR":
                return 4;
            case "BCA":
                return 1;
            case "TMN":
                return 7;
            case "MAB":
                return 5;
        }
    },

    getGameNameById(name) {
        switch (name) {
            case 4:
                return "PKR";
            case 1:
                return "BCA";
            case 7:
                return "TMN";
            case 5:
                return "MAB";
        }
    },

    getNameGameCardByType(name) {
        switch (name) {
            case "PHO":
                return 22;
            case "SAM":
                return "Sâm";
            case "BCA":
                return "Binh";
            case "TMN":
                return "Tiến Lên Miền Nam";
            case "PKR":
                return "POKER";
            case "MAB":
                return "Binh";
        }
    },

    formatString(text, argument) {
        for (var i = 0; i < argument.length; i++) {
            text = text.replace("{" + i + "}", argument[i]);
        }
        return text;
    },

    formatPrice(value) {
        if (value < 1000) return value.toString();
        else if (value < 1000000) return parseInt(value / 1000) + "k";
        else return parseInt(value / 1000000) + "m";
    },
    formatPrice2(value) {
        if (value < 1000) return value.toString();
        else if (value < 1000000) return parseFloat(value / 1000) + "k";
        else return parseFloat(value / 1000000) + "m";
    },

    NumberShortK(number) {
        return number <= 0 ? "0" : number < 10000 ? this.formatNumber(number) : this.formatNumber(number / 1000) + "K";
    },

    NumberGroup(strNumber) {
        return strNumber <= 0 ? "0" : this.formatString("{0:##,##}", [strNumber]).replace(",", ".");
    },

    GetPositionSliceBySittingId(sittingId, position) {
        let direction = this.GetVectorDirectionBySittingID(sittingId);
        return cc.v2(position.x * direction.x, position.y * direction.y);
    },

    GetVectorDirectionBySittingID(sittingId) {
        switch (sittingId) {
            case 2:
                return cc.v2(1, 1);
            case 3:
                return cc.v2(-1, 1);
            case 5:
                return cc.v2(-1, -1);
            case 7:
                return cc.v2(1, -1);
            default:
                return cc.v2(1, 1);
        }
    },

    RandomNumber(min_value, max_value) {
        let random_number = Math.random() * (max_value - min_value) + min_value;
        return Math.floor(random_number);
    },

    CheckFunction(fName) {
        if (fName == EFeatureStatus.Close) {
            Global.UIManager.showCommandPopup(MyLocalization.GetText("LOCK_FUNTION"));
        } else if (fName == EFeatureStatus.CommingSoon) {
            Global.UIManager.showCommandPopup(MyLocalization.GetText("COMMING_SOON"));
        } else if (fName == EFeatureStatus.None) {
            Global.UIManager.showCommandPopup(MyLocalization.GetText("LOCK_FUNTION"));
            return false;
        } else if (fName == EFeatureStatus.Open) {
            return true;
        }
        return false;
    },

    formatMail(content, display_len = 60) {
        let ret = "";
        if (content.length >= display_len) {
            ret = content.splice(0, 60);
            ret += "...";
        } else {
            ret = content;
        }

        return ret;
    },

    GetAvata(spr) {
        let idAvata = parseInt(MainPlayerInfo.accountId % 10) + 1;
        cc.log("idAvatr la " + idAvata);
        cc.resources.load("Img/" + idAvata, cc.SpriteFrame, (err, pre) => {
            if (err || spr.node == null || !spr.node.active || spr.node.parent == null) return;
            spr.spriteFrame = pre;
        });
    },
    GetAvataById(spr, id) {
        let idAvata = parseInt(id % 30) + 1;
        cc.resources.load("Img/" + idAvata, cc.SpriteFrame, (err, pre) => {
            if (err || spr.node == null || !spr.node.active || spr.node.parent == null) return;
            spr.spriteFrame = pre;
        });
    },

    GetRealTimeStartUp() {
        let currentDateTime = new Date();
        let realtimeSinceStartup = (currentDateTime.getTime() - Global.startAppTime.getTime()) / 1000;
        return realtimeSinceStartup;
    },

    GetNameResult(resultType) {
        switch (resultType) {
            case CARD_RESULT_TYPE.THUNG_PHA_SANH_DAI:
                return MyLocalization.GetText("THUNG_PHA_SANH_DAI");
            case CARD_RESULT_TYPE.THUNG_PHA_SANH:
                return MyLocalization.GetText("THUNG_PHA_SANH");
            case CARD_RESULT_TYPE.TU_QUY:
                return MyLocalization.GetText("TU_QUY");
            case CARD_RESULT_TYPE.CU_LU:
                return MyLocalization.GetText("CU_LU");
            case CARD_RESULT_TYPE.THUNG:
                return MyLocalization.GetText("THUNG");
            case CARD_RESULT_TYPE.SANH:
                return MyLocalization.GetText("SANH");
            case CARD_RESULT_TYPE.SAM_CO:
                return MyLocalization.GetText("SAM_CO");
            case CARD_RESULT_TYPE.HAI_DOI:
                return MyLocalization.GetText("HAI_DOI");
            case CARD_RESULT_TYPE.DOI:
                return MyLocalization.GetText("DOI");
            case CARD_RESULT_TYPE.BAI_CAO:
                return MyLocalization.GetText("BAI_CAO");
            case CARD_RESULT_TYPE.DOI_BE:
                return MyLocalization.GetText("DOI_BE");
            default:
                return "";
        }
    },

    FormatTimeRemain(timeRemain) {
        let minute = parseInt(timeRemain / 60);
        let second = parseInt(timeRemain % 60);
        let strMinute = "";
        let strSecond = "";
        if (minute < 10) strMinute = "0" + minute;
        else strMinute = minute.toString();
        if (second < 10) strSecond = "0" + second;
        else strSecond = second.toString();
        return strMinute + ":" + strSecond;
    },

    getNameGameByType(gameType) {
        switch (gameType) {
            case GAME_TYPE.MINI_SLOT:
                return "Candy Crush";

            case GAME_TYPE.MINI_POKER:
                return "Mini Poker";

            case GAME_TYPE.TAM_BAO:
                return "Võ Lâm";

            case GAME_TYPE.ORACLE:
                return "Thất Truyền";
            default:
                return "ErrName";
        }
    },

    formatTime(str) {
        return require("SyncTimeControl").getIns().convertTimeToString(new Date(str).getTime());
    },

    fallbackCopyTextToClipboard(text) {
        var textArea = document.createElement("textarea");
        textArea.value = text;
        // Avoid scrolling to bottom
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            var successful = document.execCommand("copy");
            if (successful) {
                Global.UIManager.showAlertMini("Đã Sao Chép");
            } else {
                Global.UIManager.showAlertMini("Không Thể Sao Chép");
            }
        } catch (err) {
            Global.UIManager.showAlertMini("Không Thể Sao Chép ");
        }

        document.body.removeChild(textArea);
    },
    coppyToClipboard(text) {
        if (cc.sys.isNative) {
            Global.UIManager.showAlertMini("Đã Sao Chép");
            jsb.copyTextToClipboard(text);
            require("Util").onCoppyToClip(text);
        } else {
            if (!navigator.clipboard) {
                this.fallbackCopyTextToClipboard(text);
                return;
            }
            navigator.clipboard.writeText(text).then(
                function () {
                    Global.UIManager.showAlertMini("Đã Sao Chép");
                },
                function (err) {
                    Global.UIManager.showAlertMini("Không Thể Sao Chép");
                }
            );
        }
    },

    ConvertCardId(id) {
        if (id < 8) return id + 2 + "♠";

        if (id > 12 && id <= 20) {
            return id - 11 + "♣";
        }

        if (id > 25 && id <= 33) {
            return id - 24 + "♦";
        }

        if (id > 38 && id <= 46) {
            return id - 37 + "♥";
        }

        switch (id) {
            case 8:
                return "10♠";
            case 9:
                return "J♠";
            case 10:
                return "Q♠";
            case 11:
                return "K♠";
            case 12:
                return "A♠";

            case 21:
                return "10♣";
            case 22:
                return "J♣";
            case 23:
                return "Q♣";
            case 24:
                return "K♣";
            case 25:
                return "A♣";

            case 34:
                return "10♦";
            case 35:
                return "J♦";
            case 36:
                return "Q♦";
            case 37:
                return "K♦";
            case 38:
                return "A♦";

            case 47:
                return "10♥";
            case 48:
                return "J♥";
            case 49:
                return "Q♥";
            case 50:
                return "K♥";
            case 51:
                return "A♥";
        }

        return string.Empty;
    },

    playSpine(nAnim, animName, loop, func) {
        let spine = nAnim.getComponent(sp.Skeleton);
        let track = spine.setAnimation(0, animName, loop);
        if (track) {
            // Register the end callback of the animation
            spine.timeScale = 1;
            spine.setCompleteListener((trackEntry, loopCount) => {
                let name = trackEntry.animation ? trackEntry.animation.name : "";
                if (name === animName && func) {
                    func && func(); // Execute your own logic after the animation ends
                }
            });
        }
    },

    GetTextListCardByInt(listCard) {
        let list = "";
        list += this.ConvertCardId(listCard.CardID1) + ",";
        list += this.ConvertCardId(listCard.CardID2) + ",";
        list += this.ConvertCardId(listCard.CardID3) + ",";
        list += this.ConvertCardId(listCard.CardID4) + ",";
        list += this.ConvertCardId(listCard.CardID5);

        return list;
    },
    GetPlatFrom() {
        if (cc.sys.isBrowser) return 3; //CONFIG.SOURCE_ID_WEB;
        //else return "3";
        switch (cc.sys.os) {
            case cc.sys.OS_ANDROID:
                return 3; //CONFIG.SOURCE_ID_ANDROID;
            case cc.sys.OS_IOS:
                return 2; //CONFIG.SOURCE_ID_IOS;
            case cc.sys.OS_WINDOWS:
                return 4; //CONFIG.SOURCE_ID_PC;
        }
    },

    loadImgFromUrl(nodeImg, url) {
        cc.assetManager.loadRemote(url, (err, spr) => {
            if (err) cc.log("=====> loi tai anh : ", err);
            if (!nodeImg) return;
            nodeImg.spriteFrame = new cc.SpriteFrame(spr);
        });
    },

    loadAvtFb(sprite) {
        let url = "https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=132214442526520&gaming_photo_type=unified_picture&ext=1640419440&hash=AeTvCH3kS51R3dDdTTo";
        if (url.indexOf(".png") === -1) {
            cc.loader.load(
                {
                    url: url,
                    type: "png",
                },
                (err, tex) => {
                    if (err || sprite === null || typeof sprite.spriteFrame == "undefined") {
                        cc.log("loadTextureFromUrl FB error:" + err);
                        return;
                    }
                    try {
                        sprite.spriteFrame = new cc.SpriteFrame(tex);
                    } catch (e) {
                        cc.log("load avt fail ");
                    }
                }
            );
        } else {
            cc.loader.load(url, (err, tex) => {
                if (err || sprite === null || typeof sprite.spriteFrame === "undefined") {
                    cc.log("Error Load Image");
                    return;
                }
                try {
                    sprite.spriteFrame = new cc.SpriteFrame(tex);
                } catch (e) {
                    cc.log("load avt fail ");
                }
            });
        }
    },

    nodeInOutToLeft(nodeIn = null, nodeOut = null) {
        //====== ACTION NODE OUT ======//

        if (nodeIn !== null && nodeIn.getNumberOfRunningActions() > 0) return;
        if (nodeOut !== null && nodeOut.getNumberOfRunningActions() > 0) return;

        if (nodeOut) {
            cc.Tween.stopAllByTarget(nodeOut);
            let posSaveOut = nodeOut.position;
            let posOut = nodeOut.getContentSize().width + 2000;
            cc.tween(nodeOut)
                .by(0.4, { position: cc.v2(-posOut, 0) }, { easing: "expoOut" })
                .call(() => {
                    nodeOut.active = false;
                    nodeOut.position = posSaveOut;
                    //====== ACTION NODE IN ======//
                    if (nodeIn) {
                        cc.Tween.stopAllByTarget(nodeIn);
                        let posSaveIn = nodeIn.position;
                        nodeIn.setPosition(cc.v2(nodeIn.position.x - nodeIn.getContentSize().width - 1000, nodeIn.position.y));
                        nodeIn.active = true;
                        cc.tween(nodeIn).to(0.4, { position: posSaveIn }, { easing: "expoOut" }).start();
                    }
                    //====== END AC NODE IN ====//
                })
                .start();
        } else {
            //====== ACTION NODE IN ======//
            if (nodeIn) {
                cc.Tween.stopAllByTarget(nodeIn);
                let posSaveIn = nodeIn.position;
                nodeIn.setPosition(cc.v2(nodeIn.position.x - nodeIn.getContentSize().width - 1000, nodeIn.position.y));
                nodeIn.active = true;
                let mask = nodeIn.getChildByName("mask");
                if (mask) mask.active = false;
                cc.tween(nodeIn).to(0.4, { position: posSaveIn }, { easing: "expoOut" }).start();
            }
            //====== END AC NODE IN ====//
        }
    },
    nodeInOutToRight(nodeIn = null, nodeOut = null) {
        if (nodeIn !== null && nodeIn.getNumberOfRunningActions() > 0) return;
        if (nodeOut !== null && nodeOut.getNumberOfRunningActions() > 0) return;
        //====== ACTION NODE OUT ======//
        // if(showMask){
        //     if(nodeIn){
        //         Global.UIManager.showMask();
        //     }
        //     else if(nodeOut){
        //         Global.UIManager.hideMask();
        //     }
        // }

        if (nodeOut) {
            cc.Tween.stopAllByTarget(nodeOut);
            let posSaveOut = nodeOut.position;
            let posOut = nodeOut.getContentSize().width + 2000;
            cc.tween(nodeOut)
                .by(0.4, { position: cc.v2(posOut, 0) }, { easing: "expoOut" })
                .call(() => {
                    nodeOut.active = false;
                    nodeOut.position = posSaveOut;
                    //====== ACTION NODE IN ======//
                    if (nodeIn) {
                        cc.Tween.stopAllByTarget(nodeIn);
                        let posSaveIn = nodeIn.position;
                        nodeIn.setPosition(cc.v2(nodeIn.position.x + nodeIn.getContentSize().width + 1000, nodeIn.position.y));
                        nodeIn.active = true;
                        cc.tween(nodeIn).to(0.4, { position: posSaveIn }, { easing: "expoOut" }).start();
                    }
                    //====== END AC NODE IN ====//
                })
                .start();
        } else {
            //====== ACTION NODE IN ======//
            console.log("check win szie : ", cc.winSize.width);
            if (nodeIn) {
                let mask = nodeIn.getChildByName("mask");
                cc.Tween.stopAllByTarget(nodeIn);
                let posSaveIn = nodeIn.position;
                let posSaveInX = nodeIn.position.x;
                cc.log("check pos save in : ", posSaveInX);
                nodeIn.setPosition(cc.v2(posSaveInX + nodeIn.getContentSize().width + 1000, nodeIn.position.y));
                nodeIn.active = true;
                if (mask) mask.active = false;
                cc.tween(nodeIn)
                    .to(0.4, { position: cc.v2(posSaveInX, posSaveIn.y) }, { easing: "expoOut" })
                    .start();
            }
            //====== END AC NODE IN ====//
        }
    },
    nodeInOutToTop(nodeIn = null, nodeOut = null) {
        if (nodeIn !== null && nodeIn.getNumberOfRunningActions() > 0) return;
        if (nodeOut !== null && nodeOut.getNumberOfRunningActions() > 0) return;
        //====== ACTION NODE OUT ======//
        if (nodeOut) {
            cc.Tween.stopAllByTarget(nodeOut);
            let posSaveOut = nodeOut.position;
            let posOut = nodeOut.getContentSize().height + 500;
            cc.tween(nodeOut)
                .by(0.4, { position: cc.v2(0, posOut) }, { easing: "expoOut" })
                .call(() => {
                    nodeOut.active = false;
                    nodeOut.position = posSaveOut;
                    //====== ACTION NODE IN ======//
                    if (nodeIn) {
                        cc.Tween.stopAllByTarget(nodeIn);
                        let posSaveIn = nodeIn.position;
                        nodeIn.setPosition(cc.v2(nodeIn.position.x, nodeIn.position.y + nodeIn.getContentSize().height + 500));
                        nodeIn.active = true;
                        cc.tween(nodeIn).to(0.4, { position: posSaveIn }, { easing: "expoOut" }).start();
                    }
                    //====== END AC NODE IN ====//
                })
                .start();
        } else {
            //====== ACTION NODE IN ======//
            if (nodeIn) {
                cc.Tween.stopAllByTarget(nodeIn);
                let posSaveIn = nodeIn.position;
                nodeIn.setPosition(cc.v2(nodeIn.position.x, nodeIn.position.y + nodeIn.getContentSize().height + 500));
                nodeIn.active = true;
                cc.tween(nodeIn).to(0.4, { position: posSaveIn }, { easing: "expoOut" }).start();
            }
            //====== END AC NODE IN ====//
        }
    },
    nodeInOutToBottom(nodeIn = null, nodeOut = null, posAdd) {
        if (nodeIn !== null && nodeIn.getNumberOfRunningActions() > 0) return;
        if (nodeOut !== null && nodeOut.getNumberOfRunningActions() > 0) return;
        //====== ACTION NODE OUT ======//
        if (nodeOut) {
            cc.Tween.stopAllByTarget(nodeOut);
            let posSaveOut = nodeOut.position;
            let posOut = nodeOut.getContentSize().height + posAdd;
            cc.tween(nodeOut)
                .by(0.4, { position: cc.v2(0, -posOut) }, { easing: "expoOut" })
                .call(() => {
                    nodeOut.active = false;
                    nodeOut.position = posSaveOut;
                    //====== ACTION NODE IN ======//
                    if (nodeIn) {
                        cc.Tween.stopAllByTarget(nodeIn);
                        let posSaveIn = nodeIn.position;
                        nodeIn.setPosition(cc.v2(nodeIn.position.x, nodeIn.position.y - nodeIn.getContentSize().height - posAdd));
                        nodeIn.active = true;
                        cc.tween(nodeIn).to(0.4, { position: posSaveIn }, { easing: "expoOut" }).start();
                    }
                    //====== END AC NODE IN ====//
                })
                .start();
        } else {
            //====== ACTION NODE IN ======//
            if (nodeIn) {
                cc.Tween.stopAllByTarget(nodeIn);
                let posSaveIn = nodeIn.position;
                nodeIn.setPosition(cc.v2(nodeIn.position.x, nodeIn.position.y - nodeIn.getContentSize().height - posAdd));
                nodeIn.active = true;
                cc.tween(nodeIn).to(0.4, { position: posSaveIn }, { easing: "expoOut" }).start();
            }
            //====== END AC NODE IN ====//
        }
    },
    onPopOn(node) {
        if (!node) return;
        node.active = true;
        node.setScale(1.2, 1.2);
        node.opacity = 0;
        node.stopAllActions();
        let acFadeOut = cc.fadeTo(0.2, 255).easing(cc.easeCubicActionOut());
        let acScaleOut = cc.scaleTo(0.2, 1.0).easing(cc.easeCubicActionOut());
        node.runAction(cc.spawn(acScaleOut, acFadeOut));
    },
    onPopOff(node, isRemoveFromParent = false) {
        if (!node) return;
        node.stopAllActions();
        let acScaleOut = cc.scaleTo(0.2, 1.3).easing(cc.easeCubicActionIn());
        let acFadeOut = cc.fadeOut(0.2).easing(cc.easeCubicActionIn());
        node.runAction(cc.spawn(acScaleOut, acFadeOut));
        setTimeout(() => {
            if (isRemoveFromParent) {
                node.destroy();
            } else {
                node.active = false;
            }
        }, 200);
    },
    getPostionInOtherNode(spaceNode, targetNode) {
        if (targetNode.parent == null) {
            return null;
        }
        let pos = targetNode.parent.convertToWorldSpaceAR(targetNode.getPosition());
        return spaceNode.convertToNodeSpaceAR(pos);
    },
};
