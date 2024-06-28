cc.Class({
    extends: cc.Component,

    properties: {
        listLbChooseDate : [cc.Label],
        lbDate : cc.Label,
        toggle : cc.Toggle,
        listLabelInfo : [cc.Label],
        lbDate2 : cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.weekdays = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
        this.weekdays2 = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

    },

    start () {

    },

    show(){
        this.node.active = true;
        // let msg = {};
        // msg[1] = "13-06-2024";

        let dateNow = new Date();
        // let day = dateNow.getDate();
        
        this.lbDate2.string = this.generateDateNow();


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

        let dataSendDate = ngayHomTruocNgay + "-" + month + "-" + year;
        
        this.node.active = true;
        let msg = {};
        msg[1] = dataSendDate;
        require("SendRequest").getIns().MST_Client_LoDe_Get_Cau_XSMB(msg);

        // this.lbDate.string = ngayHomTruocNgay + "/" + month + "/" + year;
        this.lbDate.string = this.weekdays[ngayHomTruoc.getDay()] + " Ngày " + ngayHomTruocNgay + "-" + month + "-" + year;
        for (let i = 0; i < this.listLbChooseDate.length; i++) {
            const lb = this.listLbChooseDate[i];
            lb.node.color = cc.Color.WHITE;
        }
        this.listLbChooseDate[1].node.color = cc.Color.YELLOW;
        this.generateDate();
    },

    generateDateNow() {
        let date = new Date();
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
        return day + "/" + month + "/" + year;
    },

    hide(){
        this.node.active = false;
    },

    handleDataAnalytics(data){
        Global.UIManager.hideMiniLoading();
        cc.log("check data analytics ", data[0]);
        this.dataAnalytics = data[0];
        this.toggle.isChecked = true;
        this.onClickTypeAnalytics(null, "caunhieunhay");

    },

    onClickTypeAnalytics(event, data){
        let dataInput = this.dataAnalytics[data];
        cc.log("check data la : ", dataInput[0]);
        let objData =  dataInput[0];
        if(objData.biendo1 === "null") objData.biendo1 = "";
        if(objData.biendo2 === "null") objData.biendo2 = "";
        if(objData.biendo3 === "null") objData.biendo3 = "";
        if(objData.value1 === "null") objData.value1 = "";
        if(objData.value2 === "null") objData.value2 = "";
        if(objData.value3 === "null") objData.value3 = "";
        this.listLabelInfo[0].string = objData.biendo1;
        this.listLabelInfo[1].string = objData.value1;
        this.listLabelInfo[2].string = objData.biendo2;
        this.listLabelInfo[3].string = objData.value2;
        this.listLabelInfo[4].string = objData.biendo3;
        this.listLabelInfo[5].string = objData.value3;

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
            this.listLbChooseDate[i].node.dateClick = this.weekdays[ngayHomTruoc.getDay()] + " Ngày " + ngayHomTruocNgay + "-" + ngayHomTruocThang + "-" + ngayHomTruocNam;
            var eventHandler = new cc.Component.EventHandler();
            eventHandler.target = this.node;
            eventHandler.component = "AnalyticsView";
            eventHandler.handler = "clickChooseDate";
            eventHandler.customEventData = ngayHomTruocNgay + "-" + ngayHomTruocThang + "-" + ngayHomTruocNam;
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
        require("SendRequest").getIns().MST_Client_LoDe_Get_Cau_XSMB(msg);
    },

    // update (dt) {},
});
