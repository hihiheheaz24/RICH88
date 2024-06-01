

cc.Class({
    extends: cc.Component,


    onLoad(){
        Global.HuongDanChoiMiniPoker = this;
    },
    show(){
        Global.UIManager.hideMiniLoading();
        this.node.active = true;
        actionEffectOpen(this.node);
    },
    onDestroy(){
        Global.HuongDanChoiMiniPoker = null;
    },
    ClickClose() {
        // Global.UIManager.hideMask();
        actionEffectClose(this.node , ()=>{
            this.node.active = false;
        })
    },
});
