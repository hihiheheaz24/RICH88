
var CardHelperTLMN = cc.Class({
    statics: {
        getIns() {
            if (this.self == null) this.self = new CardHelperTLMN();
            return this.self;
        }
    },

    isOneBigger(card1, card2) {
        let res = false;
        if (this.getCard(card1) > this.getCard(card2)) {
            res = true;
        } else if (this.getCard(card1) == this.getCard(card2)) {
            if (this.getFace(card1) > this.getFace(card2)) {
                res = true;
            }
        }
        return res;
    },
    isTwoBigger(cards1, cards2) {
        let max1 = this.isOneBigger(cards1[0], cards1[1]) ? cards1[0] : cards1[1];
        let max2 = this.isOneBigger(cards2[0], cards2[1]) ? cards2[0] : cards2[1];
        return this.isOneBigger(max1, max2);
    },

    isPair(card1, card2) {
        let card1Card = this.getCard(card1);
        let card1Face = this.getFace(card1);
        let card2Card = this.getCard(card2);
        let card2Face = this.getFace(card2);
        return card1Card == card2Card && card1Face != card2Face;
    },
    isDoi(cards) {
        return cards.length == 2 && this.isPair(cards[0], cards[1]);
    },
    isSanh(cards) {
        if (cards.length < 3) {
            return false;
        }
        cards.sort(function (a, b) { return a - b });
        let firstCard = cards[0];
        for (let i = 1; i < cards.length; i++) {
            const temp = cards[i];
            if (this.getCard(firstCard) + i != this.getCard(temp)) {
                return false;
            }
        }
        return true;
    },
    isSamCo(cards) {
        return cards.length == 3 && this.isPair(cards[0], cards[1]) && this.isPair(cards[0], cards[2]);
    },
    isTuQuy(cards) {
        return cards.length == 4 && this.isPair(cards[0], cards[1]) && this.isPair(cards[0], cards[2]) && this.isPair(cards[0], cards[3]);
    },
    isThung(cards) {
        if (cards.length < 3)
            return false;
        let firstCard = cards[0];
        for (let i = 1; i < cards.length; i++) {
            const temp = cards[i];
            if (this.getFace(firstCard) != this.getFace(temp)) {
                return false;
            }
        }
        return true;
    },
    isThungPhaSanh(cards) {
        return this.isSanh(cards) && this.isThung(cards);
    },
    is3DoiThong(cards) {
        if (cards.length != 6) {
            return false;
        }
        cards.sort(function (a, b) { return a - b });

        if (this.isPair(cards[0], cards[1]) && this.isPair(cards[2], cards[3]) && this.isPair(cards[4], cards[5])) {
            if (this.getCard(cards[2]) == this.getCard(cards[0]) + 1 && this.getCard(cards[4]) == this.getCard(cards[2]) + 1) {
                return true;
            }
        }
        return false;
    },
    is4DoiThong(cards) {
        if (cards.length != 8) {
            return false;
        }
        cards.sort(function (a, b) { return a - b });

        if (this.isPair(cards[0], cards[1]) && this.isPair(cards[2], cards[3]) && this.isPair(cards[4], cards[5]) && this.isPair(cards[6], cards[7])) {
            if (this.getCard(cards[2]) == this.getCard(cards[0]) + 1 && this.getCard(cards[4]) == this.getCard(cards[2]) + 1 && this.getCard(cards[6]) == this.getCard(cards[4]) + 1) {
                return true;
            }
        }
        return false;
    },
    is5DoiThong(cards) {
        if (cards.length != 10) {
            return false;
        }
        cards.sort(function (a, b) { return a - b });

        if (this.isPair(cards[0], cards[1]) && this.isPair(cards[2], cards[3])
            && this.isPair(cards[4], cards[5]) && this.isPair(cards[6], cards[7])
            && this.isPair(cards[8], cards[9])) {
            if (this.getCard(cards[2]) == this.getCard(cards[0]) + 1
                && this.getCard(cards[4]) == this.getCard(cards[2]) + 1
                && this.getCard(cards[6]) == this.getCard(cards[4]) + 1
                && this.getCard(cards[8]) == this.getCard(cards[6]) + 1) {
                return true;
            }
        }
        return false;
    },
    is6Doi(cards){
        if (cards.length != 12) {
            return false;
        }
        cards.sort(function (a, b) { return a - b });

        if (this.isPair(cards[0], cards[1]) && this.isPair(cards[2], cards[3])
            && this.isPair(cards[4], cards[5]) && this.isPair(cards[6], cards[7])
            && this.isPair(cards[8], cards[9]) && this.isPair(cards[10], cards[11])) 
            {
                return true;
            }
        return false;
    },

    is6DoiThong(cards) {
        if (cards.length != 12) {
            return false;
        }
        cards.sort(function (a, b) { return a - b });

        if (this.isPair(cards[0], cards[1]) && this.isPair(cards[2], cards[3])
            && this.isPair(cards[4], cards[5]) && this.isPair(cards[6], cards[7])
            && this.isPair(cards[8], cards[9]) && this.isPair(cards[10], cards[11])) {
            if (this.getCard(cards[2]) == this.getCard(cards[0]) + 1
                && this.getCard(cards[4]) == this.getCard(cards[2]) + 1
                && this.getCard(cards[6]) == this.getCard(cards[4]) + 1
                && this.getCard(cards[8]) == this.getCard(cards[6]) + 1
                && this.getCard(cards[10]) == this.getCard(cards[8]) + 1) {
                return true;
            }
        }
        return false;
    },
    get6DoiThong(cards) {
        let pairList = [];
        for (let i = 0; i < cards.length; i++) {
            const value = parseInt(cards[i] / 10);
            var pair = cards.filter(card => {
                let cardValue = parseInt(card / 10);
                return cardValue == value;
            });
            if (pair.length >= 2) {
                pairList.push(pair[0]);
                pairList.push(pair[1]);
            }
        }
        if (this.is6DoiThong(pairList)) {
            return pairList;
        }
        return pairList;
    },
    ///-------------------------------------------------------------------------------- start TLMN Logic
    // get rank card TLMN
    isTLMN2(card) {
        return card && this.getCard(card[0]) == 15;
    },
    isTLMNPair(cards) {
        if (!cards) {
            return false;
        }
        return cards.length == 2 && this.isPair(cards[0], cards[1]);
    },
    isTLMNSamCo(cards) {
        if (!cards) {
            return false;
        }
        return cards.length == 3 && this.isPair(cards[0], cards[1]) && this.isPair(cards[0], cards[2]);
    },
    isTLMNTuQuy(cards) {
        if (!cards) {
            return false;
        }
        return cards.length == 4 && this.isPair(cards[0], cards[1]) && this.isPair(cards[0], cards[2]) && this.isPair(cards[0], cards[3]);
    },
    isTLMNSanh(cards) {
        if (!cards || cards.length < 3) {
            return false;
        }
        cards.sort(function (a, b) { return a - b });
        let firstCard = cards[0];
        for (let i = 1; i < cards.length; i++) {
            const temp = cards[i];
            if (this.getCard(firstCard) + i != this.getCard(temp) || this.getCard(temp) == 15) {
                return false;
            }
        }
        return true;
    },

    isSamSanh(cards) {
        if (!cards || cards.length < 3) {
            return false;
        }
        cards.sort(function (a, b) { return a - b });
        let firstCard = cards[0];
        for (let i = 1; i < cards.length; i++) {
            const temp = cards[i];
            let numCardTemp = this.getCard(firstCard);
            if(numCardTemp == 14) numCardTemp = 1;
            if(numCardTemp == 15) numCardTemp = 2;
            let numCardTemp2 = this.getCard(temp);
            if ( numCardTemp + i != numCardTemp2 || numCardTemp2 == 15) {
                return false;
            }
        }
        return true;
    },
    // -- get đôi

    getDoiTLMN(arrIdTemp) {
        arrIdTemp.sort((a,b)=> a - b)
        let listDoi = [];
        for(let i = 0 , l = arrIdTemp.length ; i < l ; i++ ){
            let idTemp = this.getCard(arrIdTemp[i]);
            let listTemp = [arrIdTemp[i]];
            for(let j = i + 1 ; j < l ; j++){
                let idTemp2 = this.getCard(arrIdTemp[j]);
                if(idTemp2 == idTemp){
                    listTemp.push(arrIdTemp[j]);
                } else{
                    i = j - 1;
                    break;
                }
                if(listTemp.length == 2) {
                    i = j;
                    listDoi.push(listTemp) 
                    break;
                }
            }
        }
        return listDoi;
    },
    getListDoi(cards , compareCards){
        let listDoi = this.getDoiTLMN(cards);
        let listRetun = [];
        for(let i = 0 , l =  listDoi.length; i < l ; i++ ){
            let doi = listDoi[i];
            if(this.getMax(doi) > this.getMax(compareCards)) listRetun.push(doi);
        }
        return listRetun;
    },
  
     // get sám cô
    getSamCoTLMN(arrIdTemp) {
        arrIdTemp.sort((a,b)=> a - b)
        let listSamCo = [];
        for(let i = 0 , l = arrIdTemp.length ; i < l ; i++ ){
            let idTemp = this.getCard(arrIdTemp[i]);
            let listTemp = [arrIdTemp[i]];
            for(let j = i + 1 ; j < l ; j++){
                let idTemp2 = this.getCard(arrIdTemp[j]);
                if(idTemp2 == idTemp){
                    listTemp.push(arrIdTemp[j]);
                } else{
                    i = j - 1;
                    break;
                }
                if(listTemp.length == 3) {
                    listSamCo.push(listTemp) 
                    break;
                }
            }
        }
        return listSamCo;
        
    },
   
   
    getListSamCo(cards , compareCards){
        let listReturn = [];
        let listSamCo = this.getSamCoTLMN(cards);
        for(let i = 0 , l =  listSamCo.length; i < l ; i++ ){
            let samCo = listSamCo[i];
            if(this.getMax(samCo) > this.getMax(compareCards)) listReturn.push(samCo);
        }
        return listReturn;
    },

    // get Tứ Quý
    getTuQuyTLMN(arrIdTemp) {
        arrIdTemp.sort((a,b)=> a - b)
        let listTuqui = [];
        for(let i = 0 , l = arrIdTemp.length ; i < l ; i++ ){
            let idTemp = this.getCard(arrIdTemp[i]);
            let listTemp = [arrIdTemp[i]];
            for(let j = i + 1 ; j < l ; j++){
                let idTemp2 = this.getCard(arrIdTemp[j]);
                if(idTemp2 == idTemp){
                    listTemp.push(arrIdTemp[j]);
                } else{
                    i = j - 1;
                    break;
                }
            }
            if(listTemp.length >3) {
                listTuqui.push(listTemp) 
            } 
        }
        return listTuqui;
        
    },
    getSanhSam(cards , isAtTo14 = false){ // sanh? Sâm
        let tempCards = [];
        //cards.sort(function (a, b) { return a - b });
        for (let i = 0; i < cards.length; i++) {
            const valueCard = {};
            valueCard.id = cards[i];
            valueCard.number = this.getCard(cards[i]);
            if(valueCard.number == 14  && !isAtTo14) valueCard.number = 1;
            if(valueCard.number == 15 ) valueCard.number = 2;
            tempCards.push(valueCard);
        }
        tempCards.sort(function (a, b) { return a.number - b.number })
            let listSanh = [];
            for(let i = 0 ; i < tempCards.length ; i++){
                let listTemp = [tempCards[i].id];
                let numCheck = tempCards[i].number;
                for(let j = i+1 ; j <tempCards.length ; j++){
                    if(numCheck == tempCards[j].number) continue;
                    if(numCheck == tempCards[j].number - 1){
                        listTemp.push(tempCards[j].id);
                        numCheck = tempCards[j].number;
                        tempCards.splice(j , 1);
                        j--;
                    }
                }
                if(listTemp.length > 2){
                    tempCards.splice(i , 1);
                    i--;
                    listSanh.push(listTemp)
                }
            }
        return listSanh;

    },
    getSanhTLMN(cards){ 
        let tempCards = [];
        //cards.sort(function (a, b) { return a - b });
        for (let i = 0; i < cards.length; i++) {
            const valueCard = {};
            valueCard.id = cards[i];
            valueCard.number = this.getCard(cards[i]);
            if(valueCard.number != 15 )tempCards.push(valueCard);
            
        }
        tempCards.sort(function (a, b) { return a.number - b.number })
            let listSanh = [];
            for(let i = 0 ; i < tempCards.length ; i++){
                let listTemp = [tempCards[i].id];
                let numCheck = tempCards[i].number;
                for(let j = i+1 ; j <tempCards.length ; j++){
                    if(numCheck == tempCards[j].number) continue;
                    if(numCheck == tempCards[j].number - 1){
                        listTemp.push(tempCards[j].id);
                        numCheck = tempCards[j].number;
                        tempCards.splice(j , 1);
                        j--;
                    }
                }
                if(listTemp.length > 2){
                    tempCards.splice(i , 1);
                    i--;
                    listSanh.push(listTemp)
                }
            }
        return listSanh;

    },
    getListSanhCaoHon(cards , compareCards){
        let listReturn = [];
        let arrSanh = this.getSanhTLMN(cards);
        for(let i = 0 , l =  arrSanh.length; i < l ; i++ ){
            let sanh = arrSanh[i];
            if(this.getMax(sanh) > this.getMax(compareCards) && sanh.length >=  compareCards.length) listReturn.push(sanh);
        }
        return listReturn;
    },
    //Mau Binh=========================================================
    getThungPhaSanhLon(cards){
        let listReturn = this.getThungPhaSanh(cards);
        listReturn.sort(function (a, b) { return a - b });
        //cc.log(listReturn);
        if(listReturn.length > 0 && this.getCard(listReturn[listReturn.length - 1]) == 14 ){
            return listReturn
        }else{
            return [];
        }
    },
    getThungPhaSanh(cards){
        let listReturn = this.getSanhBinh(cards);
        //cc.log(listReturn);
        let thung = this.getThung(cards);
        //cc.log("thung leng la " + thung.length);
        if(listReturn.length > 4 && thung.length > 0){
            return listReturn;
        }
        return [];
    },
    getTuQuiBinh(cards){
        let listReTurn = this.getTuQuyTLMN(cards);
        let listtemp = [];

        for(let i = 0 ; i < listReTurn.length ; i++){
            let tuQui = listReTurn[i];
            for(let j = 0 ; j < tuQui.length ; j++){
                listtemp.push(tuQui[j]);
            }
        }
        return listtemp;

    },
    getCuLu(cards){
        let listXam = this.getSamCoTLMN(cards);
        let listReturn = [];
        if(listXam.length > 0){
            let cardsTemp = cards.slice();
            let xam = listXam[0];
            for(let  i = 0 , l = xam.length ; i < l ; i++){
                let index = cardsTemp.indexOf(xam[i]);
                if (index > -1) {
                    cardsTemp.splice(index, 1);
                }
                listReturn.push(xam[i]);
            }
            
            let doi = this.getThu(cardsTemp);
            if(doi.length > 0){
                for(let i = 0 ; i < doi.length ; i++){
                    listReturn.push(doi[i]);
                }
              //  return cards;
            }else{
                return [];
            }

        }
        return listReturn
    },

    getThung(cards){
        let firt = this.getFace(cards[0]);
        for(let i = 1 ; i < cards.length ; i++){
            if(firt != this.getFace(cards[i])){
                return [];
            }
        }
        return cards;
    },
    getThu(cards){
        let listReturn = this.getDoiTLMN(cards);
        let listTemp = []
        for(let i = 0 ; i < listReturn.length ; i++){
            let doi = listReturn[i];
            for(let j = 0 , l = doi.length ; j < l ; j++){
                listTemp.push(doi[j]);
            }
        }
        listTemp.sort(function (a, b) { return b - a });
        return listTemp;
    },
    getSanhBinh(cards){
        let listReturn = this.getSanhSam(cards); // at 2 -3 -4 -5,
        if(listReturn.length > 0 &&  listReturn[0].length  == 5){
            listReturn[0].sort(function (a, b) { return b - a });
            return listReturn[0]
        }

        let listReturn2 = this.getSanhSam(cards , true); // 10 , j , q, k ,at
        if(listReturn2.length > 0 &&  listReturn2[0].length  == 5){
            listReturn2[0].sort(function (a, b) { return b - a });
            return listReturn2[0]
        }
        return [];
    },

    
    // End Mau Binh==============================================
    // get sảnh


  
 
    // get đôi thông

    getDoiThong(cards) {
        let cardRemove2 = [];
        for(let i = 0 , l = cards.length; i < l ; i++){
            if(this.getCard(cards[i]) != 15) cardRemove2.push(cards[i]);
        }

        let listDoi = this.getDoiTLMN(cardRemove2);
        let listReturn = [];
        for(let i = 0  ; i < listDoi.length ; i++){
            let doi = listDoi[i];
            let listTemp = [doi];
            let numCheck = this.getCard(doi[0]) ;
            for(let j = i+1 ; j <listDoi.length ; j++){
                if(numCheck == this.getCard(listDoi[j][0]) ) continue;
                if(numCheck == this.getCard(listDoi[j][0]) - 1){
                    listTemp.push(listDoi[j]);
                    numCheck = this.getCard(listDoi[j][0]);
                    listDoi.splice(j , 1);
                    j--;
                }
            }
            if(listTemp.length > 2){
                listDoi.splice(i , 1);
                i--;
                let arrIdThong = [];
                for(let a = 0 ; a < listTemp.length; a++ ){
                    let m = listTemp[a];
                    for(let a2 = 0 ; a2 < m.length ; a2++){
                        arrIdThong.push(m[a2]);
                    }
                }
                listReturn.push(arrIdThong)
            }
        }

        return listReturn;
    },

    // get 2
    getTwoCard(cards) {
        if (!cards) {
            return [];
        }
        return cards.filter(card => {
            let cardValue = parseInt(card / 10);
            return cardValue == 15;
        });
    },
    // get one
    getOneCard(cards, compareCards) {
        if (!cards) {
            return 0;
        }
        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            if (card > compareCards) {
                return card;
            }
        }
        return 0;
    },
    getOneCardSam(cards, compareCards) {
        if (!cards) {
            return 0;
        }
        for (let i = 0; i < cards.length; i++) {
            const card =  this.getCard(cards[i]);
            if (card > this.getCard(compareCards) ) {
                return card;
            }
        }
        return 0;
    },

    // TLMN common
    getMinSuite(cards) {
        if (!cards || cards.length == 0) return -999;
        let min = parseInt(cards[0] / 10);
        for (let i = 0; i < cards.length; i++) {
            const card = parseInt(cards[i] / 10);
            if (card < min) min = card;
        }
        return min;
    },
    getMaxSuite(cards) {
        if (!cards || cards.length == 0) return -999;
        let max = parseInt(cards[0] / 10);
        for (let i = 0; i < cards.length; i++) {
            const card = parseInt(cards[i] / 10);
            if (card > max) max = card;
        }
        return max;
    },
    containsPair(cards, pairValue) {
        if (!cards || cards.length == 0) {
            return false;
        }
        for (let i = 0; i < cards.length; i++) {
            const value = parseInt(cards[i] / 10);
            if (value == pairValue) {
                return true;
            }
        }
        return false;
    },
    containsList(cards, cardsContains) {
        if (!cards || cards.length == 0) {
            return false;
        }
        for (let i = 0; i < cards.length; i++) {
            const temps = cards[i];
            for (let j = 0; j < temps.length; j++) {
                const value = temps[j];
                if (cardsContains.includes(value)) {
                    return true;
                }
            }
        }
        return false;
    },
    getMax(cards) {
        cards.sort(function (a, b) { return a - b });
        return cards[cards.length - 1];
    },
    getMaxSam(cards) {
        cards.sort(function (a, b) { return a - b });
        return this.getCard( cards[cards.length - 1]);
    },
    ///------------------------------------------------------------------------------- end TLMN Logic
    ///-------------------------------------------------------------------------------- start Phỏm Logic
    // get Phỏm face
    getPhomFace(cards) {
        let tempCards = [];
        cards.sort(function (a, b) { return a - b });
        for (let i = 0; i < cards.length; i++) {
            const valueCard = cards[i];
            tempCards.push(valueCard);
        }
        let phoms = [];
        let check = true;
        while (check) {
            let temp = this.getPhomByFaces(tempCards);
            if (temp && temp.length > 0) {
                if (!this.containsList(phoms, temp)) {
                    phoms.push(temp);
                }
                for (let i = 0; i < temp.length; i++) {
                    let index = tempCards.indexOf(temp[i]);
                    if (index > -1) {
                        tempCards.splice(index, 1);
                    }
                }
            } else {
                check = false;
            }
        }
        return phoms;
    },
    getPhomByFaces(cards) {
        let tempCards = [];
        cards.sort(function (a, b) { return a - b });
        for (let i = 0; i < cards.length; i++) {
            const valueCard = cards[i];
            tempCards.push(valueCard);
        }
        let suites = [];
        let temp = [];
        for (let i = 0; i < tempCards.length; i++) {
            let card1 = this.getCard(tempCards[i]);
            let face1 = this.getFace(tempCards[i]);
            temp.push(tempCards[i]);
            for (let j = i; j < tempCards.length; j++) {
                let card2 = this.getCard(tempCards[j]);
                let face2 = this.getFace(tempCards[j]);
                if (!this.containsPair(temp, card2) && face2 == face1) {
                    let min = this.getMinSuite(temp);
                    let max = this.getMaxSuite(temp);
                    if (card2 == min - 1 || card2 == max + 1) {
                        temp.push(tempCards[j]);
                    }
                }
            }
            for (let j = i; j >= 0; j--) {
                let card2 = this.getCard(tempCards[j]);
                let face2 = this.getFace(tempCards[j]);
                if (!this.containsPair(temp, card2) && face2 == face1) {
                    let min = this.getMinSuite(temp);
                    let max = this.getMaxSuite(temp);
                    if (card2 == min - 1 || card2 == max + 1) {
                        temp.push(tempCards[j]);
                    }
                }
            }
            if (temp.length >= 3) {
                return temp;
            }
            temp = [];
        }
        return suites;
    },

    getPhomByCard(cards) {
        let tempCards = [];
        cards.sort(function (a, b) { return a - b });
        for (let i = 0; i < cards.length; i++) {
            const valueCard = cards[i];
            tempCards.push(valueCard);
        }
        let temp = [];
        for (let i = 0; i < tempCards.length; i++) {
            let tempValue = parseInt(tempCards[i] / 10);
            let pair = tempCards.filter(c => {
                let cardValue = parseInt(c / 10);
                return cardValue == tempValue;
            });
            if (pair.length >= 3 && !this.containsList(temp, pair)) {
                temp.push(pair);
            }
        }
        return temp;
    },

    getPhom(cards) {
        let tempCards = [];
        let pairs = this.getPhomByCard(cards);
        let suites = this.getPhomFace(cards);
        suites = suites.concat(pairs);
        if (suites.length > 0) {
            for (let i = 0; i < suites.length; i++) {
                for (let j = i + 1; j < suites.length; j++) {
                    let suite = this.getCommonPhom(suites[i], suites[j]);
                    if (suite.length > 0) {
                        let newSuite1 = this.getNewPhom(suites[i], suite);
                        let newSuite2 = this.getNewPhom(suites[j], suite);
                        if (newSuite1.length > 0) {
                            if (newSuite2.length > 0) {
                                if (this.isTuQuy(suites[i])) {
                                    suites[i] = newSuite1;
                                } else if (this.isTuQuy(suites[j])) {
                                    suites[j] = newSuite2;
                                } else {
                                    if (this.sumCards(suites[i]) > this.sumCards(suites[j])) {
                                        suites[j] = newSuite2;
                                    } else {
                                        suites[i] = newSuite1;
                                    }
                                }
                            } else {
                                suites[i] = newSuite1;
                            }
                        } else {
                            if (newSuite2.length > 0) {
                                suites[j] = newSuite2;
                            } else {
                                if (this.sumCards(suites[i]) > this.sumCards(suites[j])) {
                                    suites[j] = [];
                                } else {
                                    suites[i] = [];
                                }
                            }
                        }
                    }
                }
            }

            for (let index = 0; index < suites.length; index++) {
                let temp = suites[index];
                if (temp.length > 0) {
                    tempCards.push(temp);
                }
            }
        }
        return tempCards;
    },
    getCardOdd(cards) {
        let tempCards = [];
        cards.sort(function (a, b) { return a - b });
        for (let i = 0; i < cards.length; i++) {
            let card = this.getCard(cards[i]);
            let face = this.getFace(cards[i]);
            let pair = cards.filter(c => {
                let cardValue = this.getCard(c);
                return cardValue == card;
            });
            let suite = cards.filter(s => {
                let cardSuite = this.getCard(s);
                let faceSuite = this.getFace(s);
                return Math.abs(cardSuite - card) <= 2 && faceSuite == face;
            });
            if (pair.length <= 1 && suite.length <= 1) {
                tempCards.push(cards[i]);
            }
        }
        return tempCards;
    },

    // common Phỏm
    getCommonPhom(cards1, cards2) {
        let temp = [];
        for (let i = 0; i < cards1.length; i++) {
            let card = cards1[i];
            if (cards2.includes(card)) {
                temp.push(card);
            }
        }
        return temp;
    },
    getNewPhom(cards, suite) {
        let tempCards = [];
        for (let i = 0; i < cards.length; i++) {
            let card = cards[i];
            if (!suite.includes(card)) {
                tempCards.push(card);
            }
        }
        if (tempCards.length >= 3) {
            if (this.isSamCo(tempCards)) {
                return tempCards;
            } else {
                let temp = this.getPhomFace(tempCards);
                if (temp.length > 0) {
                    return temp[0];
                }
                return [];
            }
        }
        return [];
    },
    sumCards(cards) {
        let sum = 0
        for (let i = 0; i < cards.length; i++) {
            let card = parseInt(cards[i] / 10);
            sum += card;
        }
        return sum;
    },
    ///------------------------------------------------------------------------------- end Phỏm Logic
    callPair(cards) {
        for (let i = 0; i < cards.length; i++) {
            const temp = cards[i];
            for (let j = 0; j < cards.length; j++) {
                const temp2 = cards[j];
                if ((temp.card == temp2.card && temp.face != temp2.face) || (temp.card != temp2.card && temp.face == temp2.face && Math.abs(temp.card - temp2.card) <= 2)) {
                    cards[i].pair = 2;
                }
            }
        }
    },
    sortFace(cards, pair, id) {
        let pairList = [];
        for (let i = 0; i < cards.length; i++) {
            const temp = cards[i];
            if (temp.pair == pair) {
                for (let j = 0; j < cards.length; j++) {
                    const temp2 = cards[j];
                    if (temp2.pair == pair) {
                        if (temp.card != temp2.card && temp.face == temp2.face && Math.abs(temp.card - temp2.card) <= 1) {
                            if (pairList.length > 0) {
                                let hasPair = false;
                                for (let n = 0; n < pairList.length; n++) {
                                    const element = pairList[n];
                                    if (!this.contains(element, temp) && !this.contains(element, temp2)) {

                                    } else if (!this.contains(element, temp) && this.contains(element, temp2)) {
                                        temp.index = i;
                                        pairList[n].push(temp);
                                        hasPair = true;
                                    } else if (this.contains(element, temp) && this.contains(element, temp2)) {
                                        hasPair = true;
                                    } else if (this.contains(element, temp) && !this.contains(element, temp2)) {
                                        temp2.index = j;
                                        pairList[n].push(temp2);
                                        hasPair = true;
                                    }

                                    if (!hasPair) {
                                        temp.index = i;
                                        let arrCard = [temp];
                                        pairList.push(arrCard);
                                    }
                                }
                            } else {
                                temp.index = i;
                                let arrCard = [temp];
                                pairList.push(arrCard);
                            }
                        }
                    }
                }
            }
        }

        for (let x = 0; x < pairList.length; x++) {
            const pairChild = pairList[x];
            if (pairChild.length >= 3) {
                for (let y = 0; y < pairChild.length; y++) {
                    cards[pairChild[y].index].pair = 1;
                    cards[pairChild[y].index].suite = x + id + (y >= 6 ? 0.6 : y >= 3 ? 0.3 : 0);
                }
            }
        }
    },
    sortFaceTLMN(cards, pair, id) {
        let pairList = [];
        for (let i = 0; i < cards.length; i++) {
            const temp = cards[i];
            if (temp.pair == pair) {
                for (let j = 0; j < cards.length; j++) {
                    const temp2 = cards[j];
                    if (temp2.pair == pair) {
                        if (temp.card != temp2.card && Math.abs(temp.card - temp2.card) <= 1 && Math.abs(temp.card - temp2.card) != 0) {
                            if (pairList.length > 0) {
                                let hasPair = false;
                                for (let n = 0; n < pairList.length; n++) {
                                    const element = pairList[n];
                                    if (!this.contains(element, temp) && !this.contains(element, temp2)) {

                                    } else if (!this.contains(element, temp) && this.contains(element, temp2)) {
                                        temp.index = i;
                                        pairList[n].push(temp);
                                        hasPair = true;
                                    } else if (this.contains(element, temp) && this.contains(element, temp2)) {
                                        hasPair = true;
                                    } else if (this.contains(element, temp) && !this.contains(element, temp2)) {
                                        temp2.index = j;
                                        pairList[n].push(temp2);
                                        hasPair = true;
                                    }

                                    if (!hasPair) {
                                        temp.index = i;
                                        let arrCard = [temp];
                                        pairList.push(arrCard);
                                    }
                                }
                            } else {
                                temp.index = i;
                                let arrCard = [temp];
                                pairList.push(arrCard);
                            }
                        }
                    }
                }
            }
        }

        for (let x = 0; x < pairList.length; x++) {
            const pairChild = pairList[x];
            if (pairChild.length >= 3) {
                for (let y = 0; y < pairChild.length; y++) {
                    cards[pairChild[y].index].pair = 1;
                    cards[pairChild[y].index].suite = x + id + (y >= 6 ? 0.6 : y >= 3 ? 0.3 : 0);
                }
            }
        }
    },
    sortNumber(cards, pair, id) {
        let pairList = [];
        for (let i = 0; i < cards.length; i++) {
            const temp = cards[i];
            if (temp.pair == pair)
                for (let j = 0; j < cards.length; j++) {
                    const temp2 = cards[j];
                    if (temp2.pair == pair) {
                        if (temp.card == temp2.card && temp.face != temp2.face) {
                            if (pairList.length > 0) {
                                let hasPair = false;
                                for (let x = 0; x < pairList
                                    .length; x++) {
                                    const pairChild = pairList[x];
                                    if (!this.contains(pairChild, temp) && !this.contains(pairChild, temp2)) {

                                    } else if (!this.contains(pairChild, temp) && this.contains(pairChild, temp2)) {
                                        temp.index = i;
                                        pairList[x].push(temp);
                                        hasPair = true;
                                    } else if (this.contains(pairChild, temp) && this.contains(pairChild, temp2)) {
                                        hasPair = true;
                                    } else if (this.contains(pairChild, temp) && !this.contains(pairChild, temp2)) {
                                        temp2.index = j;
                                        pairList[x].push(temp2);
                                        hasPair = true;
                                    }

                                }
                                if (!hasPair) {
                                    temp.index = i;
                                    let pairArr = [temp];
                                    pairList.push(pairArr);
                                }
                            } else {
                                temp.index = i;
                                let pairArr = [temp];
                                pairList.push(pairArr);
                            }
                        }
                    }
                }
        }

        for (let i = 0; i < cards.length; i++) {
            const pairChild = cards[i];
            if (pairChild.length >= 3) {
                for (let j = 0; j < pairChild.length; j++) {
                    cards[pairChild[j].index].pair = 1;
                    cards[pairChild[j].index].suite = i + id;
                }
            }
        }
    },
    sorted(cards) {
        cards.sort(function (a, b) {
            return a.pair - b.pair || a.suite - b.suite || a.card - b.card || a.face - b.face;
        });
    },
    contains(cards, temp) {
        let isContains = false;
        for (let i = 0; i < cards.length; i++) {
            const element = cards[i];
            if (element.card == temp.card && element.face == temp.face) {
                isContains = true;
            }
        }
        return isContains;
    },

    getListCardData(cards) {
        let lstCards = [];
        for (let i = 0; i < cards.length; i++) {
            const temp = cards[i];
            var tempCard = {
                card: this.getCard(temp),
                face: this.getFace(temp),
                pair: 0,
                suite: 0,
                index: 0,
                toNumber: temp,
            };
            lstCards.push(tempCard);
        }
        return lstCards;
    },
    getCard(value) {
        return parseInt(value / 10);
    },
    getFace(value) {
        return value % 10;
    },
    resetCardNotAnIsMe(){
        let listCard = Global.TienLenMN.isMe.listCard;
        for(let i = 0 , l = listCard.length; i < l ; i++){
            listCard[i].setNormalCard();
        }
    },

});
module.exports = CardHelperTLMN;
