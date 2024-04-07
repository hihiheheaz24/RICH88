const TemplateType = cc.Enum({
    'NODE': 1,
    'PREFAB': 2,
});
cc.Class({
    extends: cc.Component,

    properties: {
        templateType: {
            default: TemplateType.PREFAB,
            type: TemplateType,
        },
        itemTemplateNode: {
            default: null,
            type: cc.Node,
            visible: function () {
                let bool = this.templateType == TemplateType.NODE;
                if (!bool)
                    this.tmpNode = null;
                return bool;
            }
        },
        itemTemplate: {
            default: null,
            type: cc.Prefab,
            visible: function () {
                let bool = this.templateType == TemplateType.PREFAB;
                if (!bool)
                    this.tmpPrefab = null;
                return bool;
            }
        },

        // itemTemplate: { 
        //     default: null,
        //     type: cc.Prefab
        // },
        nameComponentItem:{
            default:""
        },
        funtionSetInfo:{
            default:"initItem"
        },
        
        scrollView: {
        	default: null,
        	type: cc.ScrollView
        },
        spawnCount: {
            default:0,
            type : cc.Integer
        }, 

        spacing: {
            default : 0,
            type :cc.Integer
        }, 

        isViewBottomFirt:{
            default: false,
        },

        nodeMoveToChat:{
            default:null,
            type:cc.Node
        },

        _listInfo:[],
        _sumHeight:0,
        _isDragScr:true,
        _firtOffsetItem : 0,
        _currentChatMiss:0,
        _isStateWatting:false,
        _init : false,
    },

    // use this for initialization
    onLoad: function () {
        cc.log("chay vao onload basse scrool")
        this._init = true;
    	this.content = this.scrollView.content;
        this.items = []; 
        this.updateTimer = 0;
        this.updateInterval = 0.05;
        this.lastContentPosY = 0;
        this._sumHeight = 0;
        this.bufferZone = 0;
        this.itemPool = new cc.NodePool();
        this.itemTemplate = this.templateType == TemplateType.PREFAB ? this.itemTemplate: this.itemTemplateNode;
    },
    getItemPool(){
        if(this.itemPool.size() > 0){
            return this.itemPool.get();
        }else{
            let node = cc.instantiate(this.itemTemplate);
            node.active= true;
            return node;
        }
    },
    resetScr(){
        if(!this._init) return;
        let length = this.content.childrenCount;
        let childs = this.content.children;
        for(let i = 0 ; i < length ; i++){
            this.itemPool.put(childs[0]);
        }
        this.items.length = 0;
        this._listInfo = [];
    },
    init: function (list , sumHeightToTal , _firtHeight) {
        //return;
        
        cc.log("chay vao inti ");
        this.items.length = 0;
        let length = list.length;
        this._listInfo = list ;
        let firtHeight = 0;
        if(length > 0){
            firtHeight  = this._listInfo[0].height || _firtHeight;
        }
        this.firtHeight = firtHeight;
        let spawn = this.spawnCount;
        spawn = spawn < length ? spawn : length;
        

        this.bufferZone = this.scrollView.node.height / 2 + firtHeight;
        this.totalCount = length;
        this._sumHeight = 0;
        let contentHeight = (this.totalCount *   (this.spacing)  ) - this.spacing  + sumHeightToTal;
        this.content.height = contentHeight;
        let content = this.content;
        if(this.isViewBottomFirt){
            this._isStateWatting = false;
            let offsetPositin = contentHeight - this.scrollView.node.height/2;
            if(offsetPositin > 0)  content.y = offsetPositin;
            let start = length - spawn;
            if(start < 0) start = 0;
            let lastNodeHeight = null;
            let lastNodeY = null;
            
            for(let i = length - 1; i >= start ; i--){
                let data = this._listInfo[i];
                let item = this.getItemPool();
                content.insertChild(item , 0);
                let itemCp = item.getComponent(this.nameComponentItem);
                itemCp.itemID = i;
                itemCp[this.funtionSetInfo](data);
                this.items.push(item);
                if(i == (length - 1)){
                    item.setPosition(0, item.height/2 -contentHeight);
                }else{
                    item.setPosition(0, lastNodeY + lastNodeHeight/2 +item.height/2 + this.spacing );
                }
                lastNodeHeight = item.height;
                lastNodeY = item.y;
                this._sumHeight += (item.height + this.spacing);
            }
           
        }else{
            this._isStateWatting = true;
            let lastNodeHeight = null;
            let lastNodeY = null;
            content.y = this.scrollView.node.height/2;
            for (let i = 0 ; i < spawn; ++i) {
            
                let data = this._listInfo[i];

                let item = this.getItemPool();
                content.addChild(item);
               let itemCp = item.getComponent(this.nameComponentItem);
                itemCp.itemID = i;
                itemCp[this.funtionSetInfo](data);
                this.items.push(item);
                if(i == 0){
                    item.setPosition(0, - item.height/2);
                   
                }else{
                    item.setPosition(0, lastNodeY - lastNodeHeight/2 - item.height/2 - this.spacing );
                }
                lastNodeHeight = item.height;
                lastNodeY = item.y;
                this._sumHeight += (item.height + this.spacing);
            }        
        }     
    },

    getPositionInView: function (item) { 
        let worldPos = item.parent.convertToWorldSpaceAR(item.position);
        let viewPos = this.scrollView.node.convertToNodeSpaceAR(worldPos);
        return viewPos;
    },

    update: function(dt) {
        this.updateTimer += dt;
        if (this.updateTimer < this.updateInterval) return; // we don't need to do the math every frame
        this.updateTimer = 0;
        let items = this.items;
        let buffer = this.bufferZone;
        let isDown = this.content.y < this.lastContentPosY; // scrolling direction
        let offset = this._sumHeight;
        let contentHeight = this.content.height;
            if(this.content.y >= contentHeight - this.scrollView.node.height/2 -10){
                this._isStateWatting = false;
                if(this.nodeMoveToChat){
                    this.nodeMoveToChat.active = false;
                }  
            }else{
                if(this.nodeMoveToChat){
                  if(!this.nodeMoveToChat.active) this.nodeMoveToChat.getComponentInChildren(cc.Label).string = "";
                    this.nodeMoveToChat.active = true;
                }  
                this._isStateWatting = true;
            }
        for (let i = 0; i < items.length; ++i) {
            let viewPos = this.getPositionInView(items[i]);
            if (isDown) {
                if (viewPos.y < -buffer && items[i].y + offset  < 0) {
                    let firtItem = this.content.children[0];
                    let id = firtItem.getComponent(this.nameComponentItem).itemID;

                    if(id > 0){
                        items[i].setSiblingIndex(0);
                        this._sumHeight  -= items[i].height;
                        let item = items[i].getComponent(this.nameComponentItem);
                        let itemId = id - 1; // update item id
                        item.itemID = itemId;
                        item[this.funtionSetInfo](this._listInfo[itemId]);
                        items[i].y = firtItem.y + firtItem.height/2  + items[i].height/2 + this.spacing;
                        this._sumHeight  += items[i].height;
                    }
                }
            } else {
                // if away from buffer zone and not reaching bottom of content
                if (viewPos.y > buffer && items[i].y - offset > -contentHeight) {
                    let lastNode = this.content.children[this.content.childrenCount - 1];
                    let id = lastNode.getComponent(this.nameComponentItem).itemID;
                    if(id < this.totalCount - 1){
                        items[i].setSiblingIndex(this.content.childrenCount - 1);
                        this._sumHeight  -= items[i].height;
                        let item = items[i].getComponent(this.nameComponentItem);
                        let itemId = id + 1;
                        item.itemID = itemId;
                        item[this.funtionSetInfo](this._listInfo[itemId]);
                        items[i].y = lastNode.y - lastNode.height/2 - items[i].height/2 - this.spacing;
                        this._sumHeight  += items[i].height;       
                    }
                }
               
            }
        }
        // update lastContentPosY
        this.lastContentPosY = this.scrollView.content.y;
    },

    // getHeightItems(){
    //     let length = this.items.length;
    //     let sum = 0;
    //     for(let i = 0 ; i < length ; i++){
    //         sum += (this.items[i].height  + this.spacing );
    //     }

    //     return sum - this.spacing;
    // },
    // scrollEvent: function(sender, event) {
    // //    if(event == 9){
    // //         this._isDragScr = false;
    // //    }else{
    // //         this._isDragScr = true;
    // //    }
    // },

    addItem: function(info) {
        let add = 0;
        if(info.height != null){
            add = info.height;
        }else{
            add = this.firtHeight;
        }
        this._listInfo.push(info);
        this.content.height += (add + this.spacing);
        this.totalCount += 1;
        if(!this._isStateWatting){
            let nodeSet = null;
            let lastNode = this.content.children[this.content.childrenCount - 1];
            if(this.content.childrenCount < this.spawnCount){
                nodeSet = this.getItemPool();
                this.content.addChild(nodeSet);
            }else{
                nodeSet = this.content.children[0];
            }
            if(lastNode == null){
                let id = 0;
                nodeSet.setSiblingIndex(this.content.childrenCount - 1);
                this._sumHeight  -= nodeSet.height;
                let item = nodeSet.getComponent(this.nameComponentItem);
                let itemId = id + 1;
                item.itemID = itemId;
                item[this.funtionSetInfo](info);
                nodeSet.y = - nodeSet.height/2;
                this._sumHeight  += nodeSet.height;
            }else{
                let id = lastNode.getComponent(this.nameComponentItem).itemID;
                nodeSet.setSiblingIndex(this.content.childrenCount - 1);
                this._sumHeight  -= nodeSet.height;
                let item = nodeSet.getComponent(this.nameComponentItem);
                let itemId = id + 1;
                item.itemID = itemId;
                item[this.funtionSetInfo](info);
                nodeSet.y = lastNode.y - lastNode.height/2 - nodeSet.height/2 - this.spacing;
                this._sumHeight  += nodeSet.height;
            }
            


            if(this.nodeMoveToChat)this.nodeMoveToChat.active = false;
            this.scrollView.stopAutoScroll();
            this.scrollView.scrollToBottom(0.2);
            this._currentChatMiss = 0;
        }else{
            if(this.nodeMoveToChat){
                this.nodeMoveToChat.active = true;
                this._currentChatMiss++;
                let lbStringMissChat = this.nodeMoveToChat.getComponentInChildren(cc.Label);
                if(lbStringMissChat ) lbStringMissChat.string = this._currentChatMiss.toString();
            }
        }

    },
    updateAllItemInView(){
        let list = this.getListItemCpInView();
        for(let i = 0 , l = list.length ; i < l ; i++){
            let item = list[i];
            let info = this._listInfo[item.itemID];
            item[this.funtionSetInfo](info);
        }
    },
    getListItemCpInView(){
        // let listReturn  = [];
        // let listChild = this.content.children;
        // for (let i = listChild  , l = listChild.length ; i < l ; i++){
        //     listReturn.push(listChild[i].getComponent())
        // }
        return this.content.getComponentsInChildren(this.nameComponentItem);
    },
    addListItem(listItem , heights){
        let length = listItem.length;
        this.content.height += (this.spacing * length   + heights );
        this.totalCount += length;
        this._listInfo = this._listInfo.concat(listItem);
    },

    onClickBtnMissChat(){
        let listChild = this.content.children;

        cc.log(this.spawnCount +  " list child la " + listChild.length )
        if(listChild.length < this.spawnCount) return;
        

        this._isStateWatting = false;
        if(this.nodeMoveToChat){
            this.nodeMoveToChat.active = false;
            this.nodeMoveToChat.getComponentInChildren(cc.Label).string = "";
        }
        
        
        this._sumHeight = 0;
        let length = this._listInfo.length;
        let start = length - this.spawnCount;
        let count = this.spawnCount - 1;
        if(start < 0) start = 0;
        
        let lastNode = null;
        let contentHeight = this.content.height;
        for(let i = length - 1; i >= start ; i--){
            let data = this._listInfo[i]
            let item = listChild[count];
            count--;
            let itemCp = item.getComponent(this.nameComponentItem);
            itemCp.itemID = i;
            itemCp[this.funtionSetInfo](data);
            if(i == (length - 1)){
                item.setPosition(0, item.height/2 -contentHeight);
            }else{
                
                item.setPosition(0, lastNode.y + lastNode.height/2 +item.height/2 + this.spacing );
            }
            lastNode = item
            this._sumHeight += (data.height + this.spacing);
        }
    
       

        this._currentChatMiss = 0;
        this.scrollView.stopAutoScroll();
        this.scrollView.scrollToBottom(0.2);
        
    },

    getItemAtBottom () {
        let item = this.items[0];
        for (let i = 1; i < this.items.length; ++i) {
            if (item.y > this.items[i].y) {
                item = this.items[i];
            }
        }
        return item;
    },
    scrollToFixedPosition: function () {
        this.scrollView.scrollToOffset(cc.v2(0, 500), 2);
    },
    onDestroy(){
        this.itemPool.clear();
    }
});
