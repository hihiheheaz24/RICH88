cc.Class({
    extends: cc.Component,

    properties: {
        edbInputRefCode : cc.EditBox,
        nodeInfoRefCode : cc.Node,
        nodeInputRefCode : cc.Node,
        infoRefCode : cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    },

    start () {

    },

    onEnable(){
        this.edbInputRefCode.string = "";
    },

    show(){
        Global.onPopOn(this.node)
        cc.log("Check code : ", MainPlayerInfo.IsEnteredRefCode)

        if(MainPlayerInfo.IsEnteredRefCode){
            this.nodeInfoRefCode.active = true;
            this.nodeInputRefCode.active = false;
            require("SendRequest").getIns().MST_Client_Get_Entered_Code_Info();
        }
        else{
            this.nodeInfoRefCode.active = false;
            this.nodeInputRefCode.active = true;
        }
       
    },

    onClickSendRefCode(){
        if(this.edbInputRefCode.string === ''){
            Global.UIManager.showCommandPopup("Thông tin nhập vào bị thiếu")
            return;
        }
        let msg = {};
        msg[1] = this.edbInputRefCode.string;
        cc.log("check msh : ", msg)
        require("SendRequest").getIns().MST_Client_Input_Ref_Code(msg)  ;
        this.onClickHide();     
    },

    setUpInfo(data){
        this.infoRefCode.string = data;
    },

    onClickHide(){
        Global.onPopOff(this.node)
    },

    // update (dt) {},
});
