cc.Class({
    extends: require("ParentChangePositionEDB"),
    ctor(){
        this.cardView = null;
    },
    properties: {
        mask:cc.Node,
        // parentEmoji:cc.Node,
        parentText:cc.Node,
        itemChat:cc.Node,
        parentItem:cc.Node,
        edbChat:cc.EditBox,
        edbChat2:cc.EditBox,

        // parentEmojiNem:cc.Node,
        // History Chat In Game
        listChatInGame : cc.ScrollView,
        listChatInGame2 : cc.ScrollView,
        itemChatInGame : cc.Prefab,

        nodeChat2 : cc.Node,

    },

    // LIFE-CYCLE CALLBACKS:
    initCardView(cardView){
        this.cardView = cardView;
    },
    onLoad () {
        this.node.setContentSize(cc.winSize);
        this.dataChatText = null;
        this.resignEdb(this.edbChat);
        this.resignEdb(this.edbChat2);
        this.funEmit = null;
        this.funEmit2 = null;
        // let length1 = this.parentEmoji.getChildByName("NodeItemEmoji").childrenCount;
        let listChildText = cc.find("scrollview/view/content" , this.parentText).children;
        let length2 = listChildText.length;
        // for(let i = 0 ; i < length1 ; i++){
        //     let child = this.parentEmoji.getChildByName("NodeItemEmoji").children[i];
        //     let button = child.addComponent(cc.Button);
        //         button.target = child;

        //     let clickEventHandler = new cc.Component.EventHandler();
        //     clickEventHandler.target = this.node; // This node is the node to which your event handler code component belongs
        //     clickEventHandler.component = "ChatController";// This is the code file name
        //     clickEventHandler.handler = "onClickItemEmoji";
        //     clickEventHandler.customEventData = (i+1) + "";
        //     button.transition = 0;
        //     button.clickEvents.push(clickEventHandler);
        // }

        for(let i = 0 ; i < length2 ; i++){
            let child = listChildText[i];

            let clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = this.node; // This node is the node to which your event handler code component belongs
            clickEventHandler.component = "ChatController";// This is the code file name
            clickEventHandler.handler = "onClickItemText";
            
            clickEventHandler.customEventData = child.getComponentInChildren(cc.Label).string;

            let button = child.addComponent(cc.Button);
            button.transition = 0;
            button.target = child;
            button.clickEvents.push(clickEventHandler);
        }
    },
    reviceServer(code , packet){
        cc.log("nhan dc chat sv : ", code, " noi dung : ", packet)
        switch(code){
            case CODE_RUN.CHAT_EMOTION :
                if (packet[ParameterCode.ErrorCode] != 0) {
                    this.cardView.showNoti(packet[ParameterCode.ErrorMsg])
                } 
                break;
            case CODE_RUN.CHAT_TEXT :
                if (packet[ParameterCode.ErrorCode] != 0) {
                    this.cardView.showNoti(packet[ParameterCode.ErrorMsg])
                }
                break;
            case CODE_RUN.GET_CHAT_TEXT :
                this.dataChatText = packet;
                this.handleListChatText();
                break;
            case CODE_RUN.PUSH_CHAT_EMTION :
                this.chatEmoji(packet);
                break;
            case CODE_RUN.PUSH_CHAT_TEXT :
                this.chatText(packet);
                this.dataChatText = packet;
                this.handleAddItemChat();
                break;
        }
    },
    start () {

    },
    chatEmoji(data){
        cc.log("chay vao day chat roi")
        // let senderPos =  data[13];
        // let revicePos =  data[26];
        // let idEmoji = data[21];

        // let playerSender = this.cardView.getPlayerWithPosition(senderPos);
        // let playerRevice = this.cardView.getPlayerWithPosition(revicePos);
        // let listPos = this.cardView.listPos;
        // if(senderPos == revicePos){  // chat emoji thuong
        //     let emoji = this.parentEmoji.getChildByName("NodeItemEmoji").getChildByName(idEmoji +"");
        //     let omijiClone =  cc.instantiate(emoji);
        //     this.parentItem.addChild(omijiClone);
        //     omijiClone.children[0].scale = 1 ; // mac dinh no bang 0.6
        //     omijiClone.position = listPos[playerSender.indexInTable];
        //     omijiClone.y += 35;
        //     cc.tween(omijiClone)
        //     .delay(3)
        //     .call(()=>{
        //         omijiClone.destroy();
        //     })
        //     .start();
            
            
        // }else{ // chat emoji nem'
        //    let node = cc.instantiate(this.parentEmojiNem.children[parseInt(idEmoji) - 1]) ;
        //    let posTarget =  listPos[playerRevice.indexInTable].clone();
        //    posTarget.y += 50;
        //    this.parentItem.addChild(node);
        //    //node.children[0].active= false; // spine
        //    //node.children[1].active= true; // sprite
        //    node.position = listPos[playerSender.indexInTable];
           
        //    cc.tween(node)
        //    .to(0.7 , {position:posTarget})
        //    .call(()=>{
        //     // node.children[0].active= true; // spine
        //     // node.children[1].active= false; 
        //     node.getComponent(sp.Skeleton).setAnimation(0,node.name , false);
        //    })
        //    .delay(2)
        //    .call(()=>{
        //     node.destroy();
        //    })
        //    .start()
           
        // }
    },

    showNoti(content){
        let player = this.cardView.isMe;
        let listPos = this.cardView.listPos;
        let nodeChat = cc.instantiate(this.itemChat);
        this.parentItem.addChild(nodeChat);
        nodeChat.active= true;
        nodeChat.getComponentInChildren(cc.Label).string = content;
        nodeChat.position = cc.v2(listPos[player.indexInTable].x + 50, listPos[player.indexInTable].y);
        nodeChat.y += 80;

        nodeChat.opacity = 0;
        nodeChat.scale = 0;
        cc.tween(nodeChat)
        .to(0.1 , {opacity:255})
        .start();

        cc.tween(nodeChat)
        .to(0.15 , {scale:1} , {easing:"backOut"})
        .delay(3)
        .to(0.1 , {opacity:0})
        .call(()=>{
            nodeChat.destroy();
        })
        .start();
    },

    chatText(data){
        let senderPos =  data[13];
        let objChat = JSON.parse(data[24]);
        let listChat = data[42];

        let player = this.cardView.getPlayerWithPosition(senderPos);
        let listPos = this.cardView.listPos;
        let nodeChat = cc.instantiate(this.itemChat);
        this.parentItem.addChild(nodeChat);
        nodeChat.active= true;
        nodeChat.getComponentInChildren(cc.Label).string = objChat.Content;
        nodeChat.position = cc.v2(listPos[player.indexInTable].x + 50, listPos[player.indexInTable].y);
        nodeChat.y += 80;

        nodeChat.opacity = 0;
        nodeChat.scale = 0;
        cc.tween(nodeChat)
        .to(0.1 , {opacity:255})
        .start();

        cc.tween(nodeChat)
        .to(0.15 , {scale:1} , {easing:"backOut"})
        .delay(3)
        .to(0.1 , {opacity:0})
        .call(()=>{
            nodeChat.destroy();
        })
        .start();
        
    },
    handleListChatText(){
        if(!this.dataChatText) return;
        if(this.nodeChat2.active){
            let dataHis = this.dataChatText[42];
            this.listChatInGame2.content.destroyAllChildren();
            for (let i = 0; i < dataHis.length; i++) {
                const objData = dataHis[i];
                let data = JSON.parse(objData);
                let item = cc.instantiate(this.itemChatInGame);
                this.listChatInGame2.content.addChild(item);
                item.active = true;
                item.getComponent(cc.Label).string = data.SenderName + " : " + data.Content;
                let player = this.cardView.getPlayerWithName(data.SenderName)
                if(player)
                    item.color = player.randomColor
              
            }
            this.listChatInGame2.stopAutoScroll();
            this.listChatInGame2.scrollToBottom();
            return;
        }
        cc.log("checl list chat test : ", this.dataChatText[42])
        let dataHis = this.dataChatText[42];
        this.listChatInGame.content.destroyAllChildren();
        for (let i = 0; i < dataHis.length; i++) {
            const objData = dataHis[i];
            let data = JSON.parse(objData);
            let item = cc.instantiate(this.itemChatInGame);
            cc.log("chack data chat : ", objData)
            this.listChatInGame.content.addChild(item);
            item.active = true;
            item.getComponent(cc.Label).string = data.SenderName + " : " + data.Content;
            let player = this.cardView.getPlayerWithName(data.SenderName)
            if(player)
                item.color = player.randomColor
        }
        this.listChatInGame.stopAutoScroll();
        this.listChatInGame.scrollToBottom();
    },

    handleAddItemChat (){
        if(!this.parentText.active && !this.nodeChat2.active){
            let dataChat = this.dataChatText[42];
            let data = JSON.parse(dataChat[dataChat.length - 1]);
            let item = cc.instantiate(this.itemChatInGame);
            this.listChatInGame.content.addChild(item);
            item.active = true;
            item.getComponent(cc.Label).string = data.SenderName + " : " + data.Content;
            let player = this.cardView.getPlayerWithName(data.SenderName)
            if(player)
                item.color = player.randomColor
            this.listChatInGame.stopAutoScroll();
            this.listChatInGame.scrollToBottom();
        }
        if(this.parentText.active){
            let dataChat = this.dataChatText[42];
            let data = JSON.parse(dataChat[dataChat.length - 1]);
            let item = cc.instantiate(this.itemChatInGame);
            this.listChatInGame.content.addChild(item);
            item.active = true;
            item.getComponent(cc.Label).string = data.SenderName + " : " + data.Content;
            let player = this.cardView.getPlayerWithName(data.SenderName)
            if(player)
                item.color = player.randomColor
            this.listChatInGame.stopAutoScroll();
            this.listChatInGame.scrollToBottom();
        }
        if(this.nodeChat2.active){
            let dataChat = this.dataChatText[42];
            let data = JSON.parse(dataChat[dataChat.length - 1]);
            let item = cc.instantiate(this.itemChatInGame);
            this.listChatInGame2.content.addChild(item);
            item.active = true;
            item.getComponent(cc.Label).string = data.SenderName + " : " + data.Content;
            let player = this.cardView.getPlayerWithName(data.SenderName)
            if(player)
                item.color = player.randomColor
            this.listChatInGame2.stopAutoScroll();
            this.listChatInGame2.scrollToBottom();
        }
    },
    
    onClickChatText(){
        // for (let i = 0; i < this.cardView.players.length; i++) {
        //     const player = this.cardView.players[i];
        //     if(!player) continue;
        //     if(player.icAllIn.node.active && this.cardView.stateTable === StateTable.Playing){
        //         this.cardView.showNoti("Bạn không thể chat khi có người trong bàn chơi All-in. No in hand - No comment.");
        //         return;
        //     }
        // }
        if(this.mask.getNumberOfRunningActions() > 0) return;
        setTimeout(() => {
            this.listChatInGame.stopAutoScroll();
            this.listChatInGame.scrollToBottom();
        }, 300);
        this.mask.active = true;
        this.mask.opcity = 0;
        let bgChat = this.parentText.getChildByName("bg_khung_chat");
        cc.Tween.stopAllByTarget(this.mask);
        cc.tween(this.mask)
            .to(0.2, { opacity: 150 })
            .start();
        this.parentText.active = true;
        Global.EDBController.onEventEnter(this.funEmit = () => {
            this.onClickBtnSendChat()
       });
        bgChat.scale = 0;
        bgChat.opacity = 0;
        cc.Tween.stopAllByTarget(bgChat);
        cc.tween(bgChat)
            .to(0.1, { opacity: 255 })
            .start();
        cc.tween(bgChat)
            .to(0.25, { scale: 1 }, { easing: "backOut" })
            .start();
        require("SendCardRequest").getIns().MST_Client_Get_History_Chat_Text();
      
    },

    onClickChatEmoji(){
        // if(this.mask.getNumberOfRunningActions() > 0) return;
        // this.mask.active = true;
        // this.mask.opcity = 0;
        // cc.Tween.stopAllByTarget(this.mask);
        // cc.tween(this.mask)
        // .to(0.3 , {opacity:150})
        // .start();
        // this.parentEmoji.active = true;
        // this.parentEmoji.scale = 0;
        // this.parentEmoji.opacity = 0;

        // cc.Tween.stopAllByTarget(this.parentEmoji);
        // cc.tween(this.parentEmoji)
        // .to(0.1 , {opacity:255})
        // .start();
        // cc.tween(this.parentEmoji)
        // .to(0.25 , {scale:1} , {easing:"backOut"})
        // .start();
    },
    onClickMask(){
        if(this.mask.getNumberOfRunningActions() > 0) return;

        //   cc.Tween.stopAllByTarget(this.mask);
        //   cc.tween(this.mask)
        //   .to(0.3 , {opacity:0})
        //   .call(()=>{
        //     this.mask.active = false
        //   })
        //   .start();

        //   if(this.parentEmoji.active){
        //     cc.Tween.stopAllByTarget(this.parentEmoji);
        //     cc.tween(this.parentEmoji)
        //     .to(0.15 , {opacity:0})
        //     .start();
        //     cc.tween(this.parentEmoji)
        //     .to(0.3 , {scale:0} , {easing:"backIn"})
        //     .call(()=>{
        //         this.parentEmoji.active =false;
        //     })
        //     .start();
        //   }

        this.mask.active = false

          if(this.parentText.active){
            this.parentText.active = false;
            Global.EDBController.offEventEnter(this.funEmit);
            let bgChat = this.parentText.getChildByName("bg_khung_chat");
            cc.Tween.stopAllByTarget(bgChat);
           
            cc.tween(bgChat)
            .to(0.15 , {opacity:0})
            .start();
            cc.tween(bgChat)
            .to(0.3 , {scale:0} , {easing:"backIn"})
            .call(()=>{
                // this.parentText.active =false;
                this.onClickBtnSendChat();
            })
            .start();
          }

          if(this.nodeChat2.active){
            this.nodeChat2.active = false;
            Global.EDBController.offEventEnter(this.funEmit2);
            let bgChat = this.nodeChat2.getChildByName("bg_khung_chat");
            cc.Tween.stopAllByTarget(bgChat);
            cc.tween(bgChat)
            .to(0.15 , {opacity:0})
            .start();
            cc.tween(bgChat)
            .to(0.3 , {scale:0} , {easing:"backIn"})
            .call(()=>{
                // this.nodeChat2.active =false;
                this.onClickBtnSendChat2();
            })
            .start();
          }
          
    },
    onClickItemEmoji(event , data){
        if(this.mask.getNumberOfRunningActions() > 0) return;
        let msg = {};
        msg[21] = data;
        msg[26] = this.cardView.isMe.position;  
        require("SendCardRequest").getIns().MST_Client_ChatEmoji(msg);
        this.onClickMask();
    },

    onClickItemText(event , data){
        if(this.mask.getNumberOfRunningActions() > 0) return;
        data = data.trim();
        if(data == ""){
            return;
        } 

        let msg = {};
        msg[24] = data;
        require("SendCardRequest").getIns().MST_Client_ChatText(msg);
        this.onClickMask();
    },
    onClickBtnSendChat(event , data){
        if(this.mask.getNumberOfRunningActions() > 0) return;
        let str = this.edbChat.string;
        str = str.trim();
        if(str == ""){
            return;
        }
        let msg = {};
        msg[24] = str;
        require("SendCardRequest").getIns().MST_Client_ChatText(msg);
        this.edbChat.string = "";
        cc.log("send chat ne")
        // setTimeout(() => {
        //     this.edbChat.focus();
        // }, 100);
        // this.edbChat.focus();
       
        // this.onClickMask();
    },

    onClickBtnSendChat2(event , data){
        if(this.mask.getNumberOfRunningActions() > 0) return;
        let str = this.edbChat2.string;
        str = str.trim();
        if(str == ""){
            return;
        }
        let msg = {};
        msg[24] = str;
        require("SendCardRequest").getIns().MST_Client_ChatText(msg);
        this.edbChat2.string = "";
        // setTimeout(() => {
        //     this.edbChat2.focus();
        // }, 10);
        // this.edbChat2.focus();
    },

    onClickShowChat1(){
        this.nodeChat2.active = false;
        Global.EDBController.offEventEnter(this.funEmit2);
        this.parentText.active = true;
        Global.EDBController.onEventEnter(this.funEmit = () => {
            this.onClickBtnSendChat()
        });
        let bgChat = this.parentText.getChildByName("bg_khung_chat");
        bgChat.scale = 0;
        bgChat.opacity = 0;
        cc.Tween.stopAllByTarget(bgChat);
        cc.tween(bgChat)
            .to(0.1, { opacity: 255 })
            .start();
        cc.tween(bgChat)
            .to(0.25, { scale: 1 }, { easing: "backOut" })
            .start();

        if (this.dataChatText) {
            let dataHis = this.dataChatText[42];
            this.listChatInGame.content.destroyAllChildren();
            for (let i = 0; i < dataHis.length; i++) {
                const objData = dataHis[i];
                let data = JSON.parse(objData);
                let item = cc.instantiate(this.itemChatInGame);
                this.listChatInGame.content.addChild(item);
                item.active = true;
                item.getComponent(cc.Label).string = data.SenderName + " : " + data.Content;
                let player = this.cardView.getPlayerWithName(data.SenderName)
                if(player)
                    item.color = player.randomColor
            }
            this.listChatInGame.stopAutoScroll();
            this.listChatInGame.scrollToBottom();
            // setTimeout(() => {
            //     this.edbChat.focus();
            // }, 100);
        };
    },

    onClickShowChat2(){
        this.nodeChat2.active = true;
        Global.EDBController.onEventEnter(this.funEmit2 = () => {
            this.onClickBtnSendChat2()
        });
        let bgChat = this.nodeChat2.getChildByName("bg_khung_chat");
        bgChat.scale = 0;
        bgChat.opacity = 0;
        cc.Tween.stopAllByTarget(bgChat);
        cc.tween(bgChat)
            .to(0.1, { opacity: 255 })
            .start();
        cc.tween(bgChat)
            .to(0.25, { scale: 1 }, { easing: "backOut" })
            .start();
        this.parentText.active = false;
        Global.EDBController.offEventEnter(this.funEmit);
        if (this.dataChatText) {
            let dataHis = this.dataChatText[42];
            this.listChatInGame2.content.destroyAllChildren();
            for (let i = 0; i < dataHis.length; i++) {
                const objData = dataHis[i];
                let data = JSON.parse(objData);
                let item = cc.instantiate(this.itemChatInGame);
                this.listChatInGame2.content.addChild(item);
                item.active = true;
                item.getComponent(cc.Label).string = data.SenderName + " : " + data.Content;
                let player = this.cardView.getPlayerWithName(data.SenderName)
                if(player)
                    item.color = player.randomColor
            }
            this.listChatInGame2.stopAutoScroll();
            this.listChatInGame2.scrollToBottom();
            // setTimeout(() => {
            //     this.edbChat2.focus();
            // }, 100);
        };
       
    },

    edbEditingDidEndText(){
        console.log("chay vao did end")
        Global.isTyping = false;
    },

    edbEditingBegin(){
        console.log("chay vao begin start")
        Global.isTyping = true;
    },

    reset(){
        this.parentItem.destroyAllChildren();
    }

    // update (dt) {},
});
