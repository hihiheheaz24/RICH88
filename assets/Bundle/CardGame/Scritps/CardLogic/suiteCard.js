// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

function suitecard (arrId , type , indexInList) {
    this.indexInList = indexInList;
    this.listIdCard = [];
    this.type = type;
    this.listIdCard = arrId;
}
suitecard.prototype ={
    getArrIdCard(){
        return this.listIdCard;
    },

    isContains(ids){
        for(let i = 0 ,l  = ids.length; i < l; i++){
            if(!this.listIdCard.includes(ids[i])) return false;
        }
        return true
    }
}

module.exports = suitecard;