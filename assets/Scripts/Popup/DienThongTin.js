// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        edbHoTen : {
            default : null,
            type : cc.EditBox
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    },

    show(){
        Global.DienThongTin = this;
        this.edbHoTen.string = "";
        Global.onPopOn(this.node); 
    },

    start () {

    },

    // update (dt) {},
    onClose(){
        Global.onPopOff(this.node);
    },
    clickDieuKhoanSuDung(){
		cc.sys.openURL("https://sites.google.com/view/vsop-poker-online/trang-ch%E1%BB%A7");
	},
    onClickConfirm(){
        if(this.edbHoTen.string === ""){
            Global.UIManager.showNoti("Họ tên không được để trống");
            return;
        }
        cc.sys.localStorage.setItem(MainPlayerInfo.userName , "yes")
        Global.UIManager.showNoti("Cập nhật thông tin thành công");
        Global.onPopOff(this.node);
    },
});
