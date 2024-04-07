// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        lbNo : cc.Label,
        lbPlayer : cc.Label,
        lbStack : cc.Label,
        lbPrize : cc.Label,
        texture : cc.SpriteFrame,
        registered : cc.Node,
        lbBounty : cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    init(data){
        this.lbNo.string = this.itemID + 1;

        let name = data.NickName;
        if(data.NickName.length > 12)
            name = data.NickName.substring(0, 12) + '...';
        
        this.lbPlayer.string = name;
        this.lbStack.string =  Global.formatNumberPoker(data.Stack);
        if(data.NumberBuyin > 1)
            this.lbPlayer.string = name + " (" + data.NumberBuyin + ")";

        if(data.NickName === MainPlayerInfo.nickName)
            this.registered.active = true;
        else
            this.registered.active = false;

            cc.log("check stakc : ",Global.TournamentView.indexStack )
        if((data.Reward > 0 || data.TicketReward > 0) && data.Stack > 0 && Global.TournamentView.indexStack > 1 && Global.TournamentView.dataTour.State !== 6){
            this.lbPrize.string = "-";
        }
        else{
            this.lbPrize.string = Global.formatNumberPoker(data.Reward + data.RewardBounty);
            if(Global.TournamentView.dataTour.TicketRewards){
                let dataTicket = JSON.parse(Global.TournamentView.dataTour.TicketRewards)
                cc.log("check data tick ",dataTicket.TicketValue)
                if(data.TicketReward > 0)
                    this.lbPrize.string =  "Ticket tour " +Global.formatMoneyChip(dataTicket.TicketValue);
            }
        }
        // if(Global.TournamentView.indexStack === 1)
        //     this.lbPrize.string = Global.formatNumber(data.Reward);

        if(Global.TournamentView.dataTour.StartBountyValue > 0){
            this.lbBounty.node.active = true;
            this.lbBounty.string = Global.formatNumberPoker(data.RewardBounty);
        }           
        else    
            this.lbBounty.node.active = false;
        
       
        if (Global.TournamentView && Global.TournamentView.timeCountDown <= 0 && data.Stack <= 0) {
            this.node.opacity = 100;
        }
        else{
            this.node.opacity = 255;
        }

        if(this.itemID % 2 !== 0) this.node.getComponent(cc.Sprite).spriteFrame = this.texture;
        else this.node.getComponent(cc.Sprite).spriteFrame = null;
    }
    // update (dt) {},
});
