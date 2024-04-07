

cc.Class({
    extends: cc.Component,

    properties: {
        txtCode: cc.Label,
        txtPrice: cc.Label,
        txtDate: cc.Label,
        txtDescription: cc.Label,
    },

    FillData(item){
        cc.log(item);
        this.node.active = true;
        this.txtCode.string = item.Code;
        this.txtPrice.string = this.GetNameNSP(item.NspType) + "-" + Global.NumberShortK(item.CardAmount);
        let updateDate = new Date(item.CreateDate);
        this.txtDate.string = updateDate.getDate() + "/" + (updateDate.getMonth() + 1) + "/" + updateDate.getFullYear();
        this.txtDescription.string = item.Des;
    },

    GetNameNSP(type)
    {
        
        if (type == NSP_TYPE.VIETTEL)
        {
            return "Viettel";
        }
        else if (type == NSP_TYPE.VINAPHONE)
        {
            return "VinaPhone";
        }
        else if (type == NSP_TYPE.MOBIFONE)
        {
            return "MobiFone";
        }
        else if (type == NSP_TYPE.ZING)
        {
            return "Zing";
        }
        else if (type == NSP_TYPE.MOMO)
        {
            return "Momo";
        }
        return "";
    },

    
});
