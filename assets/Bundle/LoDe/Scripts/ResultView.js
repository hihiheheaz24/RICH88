cc.Class({
    extends: cc.Component,

    properties: {
        listLabel : [cc.Label],
        lbDate : cc.Label,
        listLbChooseDate : [cc.Label],
        toggleDate : cc.Toggle
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Global.ResultView = this;
    },

    start () {

    },

    show() {
        this.toggleDate.isChecked = false;
        let dateNow = new Date();
        // let day = dateNow.getDate();
        let month = dateNow.getMonth() + 1;
        let year = dateNow.getFullYear();

        var ngayHomTruoc = new Date();
        ngayHomTruoc.setDate(dateNow.getDate() - 1);

        // Lấy thông tin ngày, tháng, năm của ngày hôm trước
        var ngayHomTruocNgay = ngayHomTruoc.getDate();

        if (ngayHomTruocNgay < 10) {
            ngayHomTruocNgay = "0" + ngayHomTruocNgay;
        }
        if (month < 10) {
            month = "0" + month;
        }

        let dataSendDate = year + "-" + month + "-" + ngayHomTruocNgay;
        
        Global.onPopOn(this.node);
        let msg = {};
        msg[1] = dataSendDate;
        require("SendRequest").getIns().MST_Client_LoDe_Get_Daily_Result(msg);

        this.lbDate.string = ngayHomTruocNgay + "/" + month + "/" + year;
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

        let data =  JSON.parse(packet[1])
        cc.log("Check data result la : ", JSON.parse(packet[1]))
        for (let i = 0; i < this.listLabel.length; i++) {
            const lbResult = this.listLabel[i];
            let index = "G" + i;
            if(i === 0) index = "DB";
            cc.log("check data at index  : ",  data[index])
            lbResult.string = data[index];
        }
    },

    generateDate() {
        for (let i = 0; i < 10; i++) {
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

            this.listLbChooseDate[i].string = ngayHomTruocNgay + "/" + ngayHomTruocThang + "/" + ngayHomTruocNam;
            this.listLbChooseDate[i].node.dateClick = ngayHomTruocNgay + "/" +  ngayHomTruocThang + "/" + ngayHomTruocNam;

            var eventHandler = new cc.Component.EventHandler();
            eventHandler.target = this.node;
            eventHandler.component = "ResultView";
            eventHandler.handler = "clickChooseDate";
            eventHandler.customEventData = ngayHomTruocNam + "-" + ngayHomTruocThang + "-" + ngayHomTruocNgay;
            this.listLbChooseDate[i].node.getComponent(cc.Button).clickEvents.push(eventHandler);

        }
    },

    clickChooseDate(event, data){
        Global.UIManager.showMiniLoading();
        cc.log("cehck eveng : ", event.target.dateClick)
        this.lbDate.string = event.target.dateClick;
        let msg = {};
        msg[1] = data;
        require("SendRequest").getIns().MST_Client_LoDe_Get_Daily_Result(msg);
        this.toggleDate.isChecked = false;
    },

    hide(){
        Global.onPopOff(this.node);
    },

    // update (dt) {},
});
