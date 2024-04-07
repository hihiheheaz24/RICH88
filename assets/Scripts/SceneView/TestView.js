cc.Class({
    extends: cc.Component,

    properties: {
        // chip : cc.Node,
        // parentChip : cc.Node,
        // listPos: cc.Vec2,
        // listBoxBet: cc.Node,

        // // chia bai
        // players : [require("PlayerViewPoker")],
        // cardControllerPoker : require("CardControllerPoker"),
        // potShow : require("PotShow"),
        // nodeBetPoker : cc.Prefab,
        // lbTimeCountDown : cc.Label
        // toggle : cc.Prefab


        // chipControllerPoker: require("ChipControllerPoker"),
        // player : require("PlayerViewPoker"),
        // pool: require("PoolControllerPoker"),
        // pot : cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // this.nodeBet = null;
        // this.listBoxBet.active = false;
        // this.isMe = this.players[0];
        // this.initNodeBet();
        // this.countDownTime(9);
        Global.Test = this;
        // this.nodeToggle = null;
        // this.initNodeToggle();
    },
    initNodeToggle(){
        if (this.nodeToggle) {
            this.nodeToggle.node.active = false;
            return;
        }
        this.nodeToggle = cc.instantiate(this.toggle).getComponent("NodeToggle");
        this.nodeToggle.node.active = false;
        this.nodeToggle.pokerView = this;
        this.node.addChild(this.nodeToggle.node);
    },
    initNodeBet(){
        if(this.nodeBet){
            this.nodeBet.node.active = false;
            return;
        }
        this.nodeBet = cc.instantiate(this.nodeBetPoker);
        // this.nodeBet.node.active = false;
        this.node.addChild(this.nodeBet);
    },
    countDownTime(timer){
        this.lbTimeCountDown.node.active = true;
        this.lbTimeCountDown.string = timer;
        this.unschedule(this.funScheduleCountDown);
        this.schedule( this.funScheduleCountDown = ()=>{
            timer--;
            // this.lbTimeCountDown.string = timer;
            this.showPlainNumberEffect(timer);
            if(timer == 0){
                this.lbTimeCountDown.node.active = false;
                this.unschedule(this.funScheduleCountDown);
            }
        } , 1);
    },
    showPlainNumberEffect(time) {
        this.lbTimeCountDown.string = time;
        this.lbTimeCountDown.node.stopAllActions();
        this.lbTimeCountDown.node.setScale(0.5,0.5);
        this.lbTimeCountDown.node.runAction(
            cc.scaleTo(0.3,1).easing(cc.easeBackOut())
        )
    },
    start () {

    },
    flyChipBet(player, valueChip) {
		//chip bet
        // làm tồng quát hơn
        this.listBoxBet.active = true;
        this.listBoxBet.getChildByName("lb-chip-bet").getComponent("LbMonneyChange").setMoney(valueChip);

		for (let j = 0; j < 5; j++) {
            cc.tween(this.node)
            .delay(j * 0.1)
            .call(()=>{
                let offSet1 = Math.random() * 30 - 15;
                let offSet2 = Math.random() * 30 - 15;
                cc.log("====> chay vao instan chip")
                let chip = cc.instantiate(this.chip).getComponent("ChipBetPoker");
                chip.node.position = cc.v2(this.listPos.x + offSet1, this.listPos.y);
                chip.node.active = true;
                this.parentChip.addChild(chip.node);
                chip.onMove(cc.v2(this.listBoxBet.position.x + offSet2, this.listBoxBet.position.y), 0.4);
            })
            .start();
        }

    },

    onclickkkkkk(){

        cc.log("====> log test : ", parseFloat(5.50342.toFixed(2)));

        // let data = {};
        // data.arrCard = [110,100];
        // for (let i = 0; i < this.players.length; i++) {
        //     const player = this.players[i];
        //     i === this.players.length - 1 ? player.lastPlayer = true : player.lastPlayer = false
        //     cc.tween(this.node)
        //     .delay(0.3 * i)
        //     .call(()=>{
        //         this.cardControllerPoker.dealCard(player, data.arrCard);
        //     })
        //     .start(); 
        // }
        // this.nodeToggle.onShow(false);
        // this.nodeToggle.node.active = true;
        // let cashBet = 4000;
        // this.player.setBoxbet(cashBet);
        // this.chipControllerPoker.flyChipBetting(this.player, cashBet, cc.v2(0, 0), Global.getPostionInOtherNode(this.player.node, this.player.boxBet.getChildByName("ic-chip")));
    },  

    clickthuchip(){
        cc.log("===> ")
        this.chipControllerPoker.chipCollecttion(this.player.parentChip.children, this.pot);
    },

    dealCardFlop(event, data){
        cc.log("data la : ", parseFloat(data));
        // let arrCard = [110];
        // // data.arrCard = [110, 111, 121];
        // this.cardControllerPoker.dealCardInTable(arrCard);
        // this.potShow.setValue(1000, 0.4);
    },

    formatMoneyLobby(money) {
        let mo = Math.abs(money);

        mo /= 1;

        let str = money.toString() + "0"; // str length se la 200000000
        let str1 = mo.toString() + "a"; // str1 length se la  20a

        let idex = 0;
        for (let i = 0; i < str.length; i++) {
            if (str[i] !== str1[i]) {
                idex = i;
                break;
            }

        }

        return (money < 0 ? "-" : "") + Math.floor(mo) + ((str.toString()[idex] === '0' && str.toString()[idex + 1] === '0') ? "" : ",") + ((str.toString()[idex] === '0' && str.toString()[idex + 1] === '0') ? "" : str.toString()[idex])
            + (str.toString()[idex + 1] === '0' ? "" : str.toString()[idex + 1]);
    },

    formatNumber(number, width = 3) {
        return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');//String(number).replace(/(.)(?=(\d{3})+$)/g, '$1,');
    },
    // update (dt) {},
});
