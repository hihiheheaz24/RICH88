cc.Class({
    extends: cc.Component,

    properties: {
        titleNews: cc.Label,
        descriptionNew: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Global.NewsPopup = this;
    },

    start () {

    },

    

    show(event, data){
        Global.onPopOn(this.node);

        

        let currentIndexNews = parseInt(data);
        let newsData = Global.DataNews[currentIndexNews];
        cc.log("====> event la : ", currentIndexNews)
        cc.log("====> event la : ", newsData)
        this.titleNews.string = newsData.Title;
        this.descriptionNew.string = newsData.Content.replace("\\n", "\n");
    },

    onClose(){
        Global.onPopOff(this.node);
    },
    // update (dt) {},
});
