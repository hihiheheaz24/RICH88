cc.Class({
    extends: cc.Component,

    properties: {
       lbTitle : cc.Label,
       lbTime : cc.Label,
       lbContent : cc.Label,
       icNew : cc.Node,
       icMail : cc.Sprite,
       sprNewMail : cc.SpriteFrame,
       sprReadedMail : cc.SpriteFrame,
    //    nodeContent : cc.Node,
    //    btnClick : cc.Sprite,
    //     listSprBtn : {
    //         default : [],
    //         type : [cc.SpriteFrame]
    //     },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // this.isClick = false;
        this.contentMail = "";
        this.mailHeader = "";
        this.timeMail = "";
    },

    // start () {

    // },
    init(data){
        // IsReaded: 0
        // MailContent: "Bạn đã đăng ký đổi thưởng qua MOMO, số tiền 50000 vào số điện thoại 67678, vui lòng chờ hệ thống duyệt trong ngày !"
        // MailHeader: "Đăng ký đổi thưởng thành công"
        // MailId: 10343
        // SendTime: "2021-10-18T01:19:21.563"
        // SenderNickname: "Admin"
        // SystemMailId: 0
        cc.log("init item mail ", data); 
        if(data.IsReaded !== 0) this.icNew.active = true;
        else this.icNew.active = false;

        // if(data.IsReaded !== 0) this.icMail.spriteFrame = this.sprNewMail;
        // else this.icMail.spriteFrame = this.sprReadedMail;

        this.lbTitle.string = data.MailHeader.substring(0, 15) + '...';
        this.lbContent.string = data.MailContent.substring(0, 15) + '...';
        this.contentMail = data.MailContent;
        this.mailHeader = data.MailHeader;

        let date = new Date(data.SendTime);
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

        this.lbTime.string = day + "-" + month + "-" + year;
        this.timeMail = hours + ":" + minutes + ":" + seconds + " " + day + "." + month + "." + year;
    },

    onClickShowMail(){
        cc.log("chay vao set content mail")
        // this.icMail.spriteFrame = this.sprReadedMail;
        Global.MailPopup.listItemMail.content.children.forEach(itemMail => {
            cc.log("check item mail : ", itemMail)
            itemMail.getChildByName("lbTile").color = cc.Color.WHITE;
        });
        this.lbTitle.node.color = new cc.Color({ r: 255, g: 255, b: 68, a: 255 })
        Global.MailPopup.titleMail.string = this.mailHeader;
        Global.MailPopup.contentMail.string = this.contentMail;
        Global.MailPopup.timeMail = this.timeMail;
    },
    // onClickItem(){
    //     let listView = this.node.parent;
    //     for (let i = 0; i < listView.children.length; i++) {
    //         const objItem = listView.children[i];
    //         objItem.getChildByName("bg_content").active = false;
    //         objItem.getChildByName("bgMail").getChildByName("sprButton").getComponent(cc.Sprite).spriteFrame = this.listSprBtn[0];
    //         objItem.getComponent("ItemMail").isClick = false;
    //     }
    //     this.isClick = !this.isClick;
    //     if(this.isClick){
    //         this.nodeContent.active = true;
    //         this.btnClick.spriteFrame = this.listSprBtn[1];
    //     }
    //     else{
    //         this.nodeContent.active = false;
    //         this.btnClick.spriteFrame = this.listSprBtn[0];
    //     }
      
    // },

    // update (dt) {},
});
