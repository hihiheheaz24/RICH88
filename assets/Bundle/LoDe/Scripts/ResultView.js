cc.Class({
    extends: cc.Component,

    properties: {
        listLabel : [cc.Label],
        lbDate : cc.Label,
        listLbChooseDate : [cc.Label],
        lbInfo : cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Global.ResultView = this;
        // Chuyển số thứ tự thành tên thứ
        this.weekdays = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
        this.weekdays2 = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

    },

    start () {

    },

    show() {
        let dateNow = new Date();
        // let day = dateNow.getDate();


        var ngayHomTruoc = new Date();
        ngayHomTruoc.setDate(dateNow.getDate() - 1);

        // Lấy thông tin ngày, tháng, năm của ngày hôm trước
        var ngayHomTruocNgay = ngayHomTruoc.getDate();
        let month = ngayHomTruoc.getMonth() + 1;
        let year = ngayHomTruoc.getFullYear();
        let day  = ngayHomTruoc.get
        if (ngayHomTruocNgay < 10) {
            ngayHomTruocNgay = "0" + ngayHomTruocNgay;
        }
        if (month < 10) {
            month = "0" + month;
        }

        let dataSendDate = year + "-" + month + "-" + ngayHomTruocNgay;
        
        // Global.onPopOn(this.node)
        this.node.active = true;
        let msg = {};
        msg[1] = dataSendDate;
        require("SendRequest").getIns().MST_Client_LoDe_Get_Daily_Result(msg);

        this.lbDate.string = ngayHomTruocNgay + "/" + month + "/" + year;
        this.lbInfo.string = this.weekdays[ngayHomTruoc.getDay()] + " Ngày " + ngayHomTruocNgay + "-" + month + "-" + year;
        for (let i = 0; i < this.listLbChooseDate.length; i++) {
            const lb = this.listLbChooseDate[i];
            lb.node.color = cc.Color.WHITE;
        }
        this.listLbChooseDate[1].node.color = cc.Color.YELLOW;;
    },

    handleDataResult(packet){
        Global.UIManager.hideMiniLoading();
        if(packet[1] === ''){
            for (let i = 0; i < this.listLabel.length; i++) {
                const lbResult = this.listLabel[i];
                lbResult.string = "...";
            }
            return;
        }

        let data = JSON.parse(packet[1])
        cc.log("Check data result la : ", JSON.parse(packet[1]))
        for (let i = 0; i < this.listLabel.length; i++) {
            const lbResult = this.listLabel[i];
            let index = "G" + i;
            if (i === 0) index = "DB";
            cc.log("check data at index  : ", data[index])

            if (i === 3 || i === 5) {
                // Tìm khoảng trắng giữa các số và thêm 3 đơn vị space nữa
                let result = "";
                let count = 0;
                for (let i = 0; i < data[index].length; i++) {
                    if (count === 3) {
                        result += "\n"; // Xuống dòng sau mỗi 3 số
                        count = 0;
                    }
                    result += data[index][i];
                    if (data[index][i] === " ") {
                        count++;
                    }
                }
                lbResult.string = result.replace(/ /g, "      ");
            }
            else {
                lbResult.string = data[index].replace(/ /g, "      ");
            }

        }
        let dateInfo = new Date(data.SessionId);
        let month = dateInfo.getMonth() + 1;
        let day = dateInfo.getDate();
        if (month < 10) {
            month = "0" + month;
        }
        if (day < 10) {
            day = "0" + day;
        }
        this.lbInfo.string = this.weekdays[dateInfo.getDay()] + " Ngày " + day + "-" + month + "-" + dateInfo.getFullYear();
    },

    generateDate() {
        for (let i = 6; i >= 0; i--) {
            var ngayHienTai = new Date();

            // Lấy ngày hôm trước
            var ngayHomTruoc = new Date();
            ngayHomTruoc.setDate(ngayHienTai.getDate() - i);

            // Lấy thông tin ngày, tháng, năm của ngày hôm trước
            var ngayHomTruocNgay = ngayHomTruoc.getDate();
            var ngayHomTruocThang = ngayHomTruoc.getMonth() + 1; // Tháng bắt đầu từ 0 nên cộng thêm 1
            var ngayHomTruocNam = ngayHomTruoc.getFullYear();

            if (ngayHomTruocNgay < 10) {
                ngayHomTruocNgay = "0" + ngayHomTruocNgay;
            }
            if (ngayHomTruocThang < 10) {
                ngayHomTruocThang = "0" + ngayHomTruocThang;
            }

            this.listLbChooseDate[i].string = this.weekdays2[ngayHomTruoc.getDay()] + "\n" + ngayHomTruocNgay + "/" + ngayHomTruocThang;
            this.listLbChooseDate[i].node.dateClick = ngayHomTruocNgay + "/" +  ngayHomTruocThang + "/" + ngayHomTruocNam;
            var eventHandler = new cc.Component.EventHandler();
            eventHandler.target = this.node;
            eventHandler.component = "ResultView";
            eventHandler.handler = "clickChooseDate";
            eventHandler.customEventData = ngayHomTruocNam + "-" + ngayHomTruocThang + "-" + ngayHomTruocNgay;
            this.listLbChooseDate[i].node.getComponent(cc.Button).clickEvents.push(eventHandler);

        }
    },

    clickChooseDate(event, data) {
        cc.log("check mau : ", event.target.color)
        for (let i = 0; i < this.listLbChooseDate.length; i++) {
            const lb = this.listLbChooseDate[i];
            lb.node.color = cc.Color.WHITE;
        }
        event.target.color = cc.Color.YELLOW;
        Global.UIManager.showMiniLoading();
        cc.log("cehck eveng : ", event.target.dateClick)
        this.lbDate.string = event.target.dateClick;
        let msg = {};
        msg[1] = data;
        require("SendRequest").getIns().MST_Client_LoDe_Get_Daily_Result(msg);
    },

    hide(){
        // Global.onPopOff(this.node);
        this.node.active = false;
    },

    // update (dt) {},
});
