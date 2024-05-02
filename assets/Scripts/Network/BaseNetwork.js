var BaseNetwork = cc.Class({
    statics: {
        request(link, data, event = null) {
            data = data || {};
            this.config_links = link;
            this.cors_url = "";
            cc.log("======> REQUEST LINK : ", link);
            cc.log("======> REQUEST data : ", data);
            var http = cc.loader.getXMLHttpRequest();
            http.open("POST", this.cors_url + this.config_links, true);
            http.setRequestHeader("Content-Type", "application/json");
            // http.setRequestHeader('client-version', CONFIG.VERSION);
            // http.setRequestHeader('language', "vni");
            // http.setRequestHeader('os-type', require("ReceiveResponse").getIns().GetPlatFrom());
            // http.setRequestHeader('device-client-id', Global.deviceId);
            // http.setRequestHeader('merchantid', CONFIG.MERCHANT);
            //http.withCredentials = true;
            http.onreadystatechange = () => {
                //Call a function when the state changes.
                if (http.readyState === 4 && http.status >= 200 && http.status < 300) {
                    try {
                        //  cc.log(cc.sys.localstorge);
                        //cc.log(getCookie(CONFIG.COOKIENAME));
                    } catch (err) { }

                    //Global.CookieValue = this.getCookieV2(CONFIG.COOKIENAME);
                    //  cc.log("cookie:"+Global.CookiValue);*/
                    let str = LZString.decompressFromBase64(http.responseText);

                    // cc.log("str la " + str);
                    // cc.log("str ko decom la " + http.responseText);
                    //cc.log(str)

                    cc.log("======> response text base network : ", str);

                    if (event) event(str);
                    // return http.responseText;
                    //this.reviceConfig(http.responseText);
                }
            };
            //	cc.log(md5("123456789"));
            data.ClientVersion = CONFIG.VERSION;
            data.Language = "vni";
            data.OsType = Global.GetPlatFrom(); //require("ReceiveResponse").getIns().GetPlatFrom();
            data.DeviceId = Global.deviceId;
            data.MerchantId = CONFIG.MERCHANT;
            if (!cc.sys.localStorage.getItem("IpClient")) cc.sys.localStorage.setItem("IpClient", "1.1.1.1");
            data.ClientIp = cc.sys.localStorage.getItem("IpClient"); //Global.IpClient; // du lieu tu getGlobalIp();
            data.UtcTime = Date.now();
            data.SecretKey = this.create(data.UtcTime.toString());
            data.Cookie = Global.CookieValue;
            cc.log("======> data send request : ", JSON.stringify(data));
            http.send(JSON.stringify(data));
            var self = this;
            http.onerror = function () {
                cc.log("chay vao request bi loi");
            };

            http.ontimeout = () => {
                console.log("load config time out");
            };
        },

        getQrMomo(postData ,event = null) {
            // Tạo đối tượng XMLHttpRequest
            const http = new XMLHttpRequest();

            // Địa chỉ URL cần gửi POST request
            const url = "https://cors-proxy.fringe.zone/https://bio.ziller.vn/api/qr/add"; // URL của server cần truy cập

            // Chuyển đổi dữ liệu thành chuỗi JSON
            const jsonData = JSON.stringify(postData);

            // Mở kết nối POST đến địa chỉ URL
            http.open("POST", url, true);

            // Đặt header cho request
            http.setRequestHeader('Content-Type', 'application/json');
            http.setRequestHeader('Authorization', 'Bearer f10d246d8056fdd1a1b106878dbb0533');
            http.setRequestHeader("Access-Control-Allow-Origin", "*");

            // Xử lý sự kiện khi nhận được phản hồi từ server
            http.onreadystatechange = function () {
                if (http.readyState === XMLHttpRequest.DONE) {
                    if (http.status === 200) {
                        console.log('Response:', http.responseText);
                        if(event) event(http.responseText)
                    } else {
                        console.error('Error:', http.status);
                    }
                }
            };

            // Gửi dữ liệu
            http.send(jsonData);
        },

        getGlobalIp() {
            var http = cc.loader.getXMLHttpRequest();

            http.open("GET", "https://api.ipify.org?format=json", true);
            http.onreadystatechange = () => {
                if (http.readyState === 4 && http.status >= 200 && http.status < 300) {
                    let str = http.responseText;
                    var data = JSON.parse(str);
                    cc.sys.localStorage.setItem("IpClient", data.ip);
                    //
                    // Global.ConfigScene.getConfigLink();
                }
            };
            http.send();
            http.onerror = () => {
                console.log("chay vao error get ip roif");
                // Global.ConfigScene.getConfigLink();
            };
            http.ontimeout = () => {
                console.log("chay vao timeout get ip roif");
                // Global.ConfigScene.getConfigLink();
            };
            // tuyen fix
        },

        create(utcTime) {
            let md5Hash = md5(utcTime);
            md5Hash = md5Hash + utcTime + "d078031a0e17f1e0dc57c65a170393f7"; //string.Format("{0}{1}{2}", md5Hash, utcTime, StaticData.AppSecretKey);
            return md5(md5Hash);
        },

        getCookie(name) {
            var arr,
                reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if ((arr = document.cookie.match(reg))) return arr[2];
            else return null;
        },

        getCookieV2(cname) {
            var name = cname + "=";
            var decodedCookie = decodeURIComponent(document.cookie);
            cc.log("decode:" + decodedCookie);
            var ca = decodedCookie.split(";");
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == " ") {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        },

        getCapcha(base64, node) {
            if (cc.sys.isNative) {
                const buffer = new Buffer(base64, "base64");
                const len = buffer.length;
                const bytes = new Uint8Array(len);
                for (let i = 0; i < len; i++) {
                    bytes[i] = buffer[i];
                }
                const extName = "png";
                const randomFileName = "base64_img." + extName;
                const dir = `${jsb.fileUtils.getWritablePath()}${randomFileName}`;
                cc.loader.release(dir);
                if (jsb.fileUtils.writeDataToFile(bytes, dir)) {
                    cc.loader.load(dir, (err, texture) => {
                        if (!err && texture) {
                            node.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                        }
                    });
                }
            } else {
                var src = "data:image/png;base64," + base64;
                var imgElement = new Image();
                imgElement.src = src;
                setTimeout(function () {
                    var sprite = new cc.Texture2D();
                    sprite.initWithElement(imgElement);
                    sprite.handleLoadedTexture();
                    var spriteFrame = new cc.SpriteFrame(sprite);
                    node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                }, 10);
            }
        },
    },
});

module.exports = BaseNetwork;
