// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
function powerSet( list ){
    var set = [],
        listSize = list.length,
        combinationsCount = (1 << listSize);

    for (var i = 1; i < combinationsCount ; i++ ,set.push(combination))
        for (var j=0, combination = [];j<listSize;j++)
            if ((i & (1 << j)))
                combination.push(list[j]);
    return set;
}

const TYPE = {
    TU_QUY:1,
    THONG:2,
    XAM:3,
    SANH:4,
    DOI:5,
    DON:6
}
// function k_combinations(set, k) {
// 	var i, j, combs, head, tailcombs;
// 	if (k > set.length || k <= 0) {
// 		return [];
// 	}
	
// 	if (k == set.length) {
// 		return [set];
// 	}
	
// 	if (k == 1) {
// 		combs = [];
// 		for (i = 0; i < set.length; i++) {
// 			combs.push([set[i]]);
// 		}
// 		return combs;
// 	}
// 	combs = [];
// 	for (i = 0; i < set.length - k + 1; i++) {
// 		// head is a list that includes only our current element.
// 		head = set.slice(i, i + 1);
// 		// We take smaller combinations from the subsequent elements
// 		tailcombs = k_combinations(set.slice(i + 1), k - 1);
// 		// For each (k-1)-combination we join it with the current
// 		// and store it to the set of k-combinations.
// 		for (j = 0; j < tailcombs.length; j++) {
// 			combs.push(head.concat(tailcombs[j]));
// 		}
// 	}
// 	return combs;
// }
var _isSam = false;
let suiteCard = require('suiteCard');
function CardHelperTLMN (isSam = false) {
    _isSam = isSam;
    this.arrId = [];
    this.listThong = [];
    this.listTuQui = [];
    this.list2 = [];
    this.listXam = [];
    this.listSanh = [];
    this.listDoi = [];
    this.listAll = [];

    this.listSuite = [];

    this.stateXep = 1; //1 tu lon den be 2 theo bo

    this.listArrAn = [];
    this.listArrDanh = [];


    this.listIdNotAn = [];
}

CardHelperTLMN.prototype = {
    init(arrId){
        arrId.sort((a,b)=> a-b);
        this.arrId = arrId.slice();
        let list = powerSet(arrId);
        this.listThong = [];
        this.listTuQui = [];
        this.list2 = [];
        this.listXam = [];
        this.listSanh = [];
        this.listDoi = [];
        this.listAll = [];

        this.listSuite = [];

        this.stateXep = 1; //1 tu lon den be 2 theo bo

        this.listArrAn = [];
        this.listArrDanh = [];
        this.listIdNotAn = [];
        this.countInArrAn = 0;
        this.countInArrDanh = 0;
        for(let i = 0 , l = list.length; i < l; i++){
            let arrTemp = list[i];
            let isCheck = false;
            let suite = null;
            if(isThong(arrTemp)){
                 suite = new suiteCard(arrTemp ,TYPE.THONG , this.listSuite.length )
                isCheck = true;
                this.listThong.push(arrTemp)
            }else if (isTuQui(arrTemp)){
                 suite = new suiteCard(arrTemp ,TYPE.TU_QUY , this.listSuite.length )
                isCheck = true;
                this.listTuQui.push(arrTemp)
            }else if (isXam(arrTemp)){
                 suite = new suiteCard(arrTemp ,TYPE.XAM , this.listSuite.length )
                isCheck = true;
                this.listXam.push(arrTemp)
            }else if(isSanh(arrTemp)){
                 suite = new suiteCard(arrTemp ,TYPE.SANH , this.listSuite.length )
                isCheck = true;
                this.listSanh.push(arrTemp)
            }else if (isDoi(arrTemp)){
                 suite = new suiteCard(arrTemp ,TYPE.DOI , this.listSuite.length )
                isCheck = true;
                this.listDoi.push(arrTemp);
            }
            // else if(is2(arrTemp)){
            //     isCheck = true;
            //     this.list2.push(arrTemp);
            // }
            if(isCheck){
               if(suite)this.listSuite.push(suite);
                this.listAll.push(arrTemp);
            }
        }
    },
    clear(){
        this.arrId.length = 0;
        this.listThong.length = 0;
        this.listTuQui.length = 0;
        this.list2.length = 0;
        this.listXam.length = 0;
        this.listSanh.length = 0;
        this.listDoi.length = 0;
        this.listAll.length = 0;
        this.stateXep = 1;
    },
    removeIds(arr){
        for(let i = 0 , l = arr.length; i < l; i++){
            this.listAll.forEach((item)=>{
                if(item.includes(arr[i])) item.length = 0;
            })
            let index = this.arrId.indexOf(arr[i]);
            if(index!= -1){
                this.arrId.splice(index , 1)
            } 
        }

        this.countInArrAn = 0;
        this.countInArrDanh = 0;
    },
    getArrByOneCard(id){ // get arr chat duoc
        for(let i = 0 , l = this.listArrAn.length ; i < l ; i++){
            if(this.listArrAn[i].includes(id)) return this.listArrAn[i]; 
        }
        return [];
    },

    getSuitseById(id){
        let obj = {};
        obj.listThong = [];
        obj.listTuQui = [];
        obj.listXam = [];
        obj.listSanh = [];
        obj.listDoi = [];
        obj.listAll = [];

        for(let i = 0 , l = this.listSuite.length; i < l; i++){
            let suite = this.listSuite[i];
            let isCheck = false;
            if(suite.isContains(id)){
                if(suite.type == TYPE.THONG){
                    isCheck = true;
                    obj.listThong.push(suite);
                }else if(suite.type == TYPE.TU_QUY){
                    isCheck = true;
                    obj.listTuQui.push(suite);
                }else if(suite.type == TYPE.XAM){
                    isCheck = true;
                    obj.listXam.push(suite);
                }else if(suite.type == TYPE.SANH){
                    isCheck = true;
                    obj.listSanh.push(suite);
                }else if (suite.type == TYPE.DOI){
                    isCheck = true;
                    obj.listDoi.push(suite);
                }
            } 
            if(isCheck) obj.listAll.push (suite.getArrIdCard());
        }
        return obj;
    },
    getArrByArr(arr){ // get arr Danh dau tien
       
        let suites = this.getSuitseById(arr);
      //  console.log(JSON.stringify(suites))
        if(suites.listThong.length > 0){
            let arrId =  suites.listThong[0].getArrIdCard();
           if(arrId.length > 0)  return arrId;
        }

        if(suites.listTuQui.length >0 ){
            let arrId =  suites.listTuQui[0].getArrIdCard();
           if(arrId.length > 0) return arrId;
        }

        if(arr.length == 1){
           
           if(suites.listSanh.length == 1 && suites.listXam.length == 0 && suites.listDoi.length ==0){
            let arrId =  suites.listSanh[0].getArrIdCard();
               if(arrId.length > 0) return arrId;
           }
            
           if(suites.listXam.length == 1 && suites.listSanh.length == 0){
            let arrId =  suites.listXam[0].getArrIdCard();
               if(arrId.length > 0) return arrId;
           }
            
           if(suites.listXam.length == 0 && suites.listSanh.length == 0 && suites.listDoi.length > 0){
            let arrId =  suites.listDoi[0].getArrIdCard();
            if(arrId.length > 0) return arrId;
           }
            
            return [];
        }else if (arr.length ==2){
            if(suites.listAll.length ==0 ) return[];
            let itemMax = suites.listAll[0];
            

            let max =itemMax.length;
           for(let i = 1 , l = suites.listAll.length; i < l; i++){
                if(suites.listAll[i].length > max){
                    max = suites.listAll[i].length;
                    itemMax =  suites.listAll[i];
                }
           }
           return itemMax;
        }

        return [];
    },
   
    getCardNotAn(){
       // cc.log("arr ko acti: " + JSON.stringify(this.listIdNotAn))
        return this.listIdNotAn;
    },
   
    updateArrAn(_arr){
       let arr = _arr.sort( (a, b) => { return a - b});
        let listReturn = [];
        if(isThong(arr)){
            this.listThong.forEach((item)=>{
                if((item.length == arr.length &&  getMax(item) > getMax(arr)) || item.length > arr.length ) listReturn.push(item);
            })
            this.listTuQui.forEach((item)=>{
                if(item.length > 0 && arr.length < 8) listReturn.push(item);
            })

        }else if (isTuQui(arr)){
            this.listTuQui.forEach((item)=>{
                if(item.length > 0 && getMax(item) > getMax(arr)) listReturn.push(item);
            })
            this.listThong.forEach((item)=>{
                if(item.length > 7  ) listReturn.push(item);
            })
        }else if (isXam(arr)){
            this.listXam.forEach((item)=>{
                if(item.length >0 && getMax(item) > getMax(arr)) listReturn.push(item);
            })
        }else if (isSanhA23(arr)){
            this.listSanh.forEach((item)=>{
                if(item.length >0 && item.length == arr.length && !isSanhA23(item)) listReturn.push(item);
            })
        }
        else if(isSanh(arr)){
           // cc.log("no la sanh")
            this.listSanh.forEach((item)=>{
                if(item.length >0 && item.length == arr.length &&  !isSanhA23(item)  && getMax(item) > getMax(arr)) listReturn.push(item);
            })
        }else if (isDoi(arr)){
            if(getNum(arr[0]) == 15){ // doi 2

                if(this.isSam){
                    let listCheck = [];
                    this.listTuQui.forEach((item)=>{
                        if(item.length > 0) listCheck.push(item);
                    })
                    if(listCheck.length > 1) listReturn = listCheck; // 2 tu qui
                }else{
                    this.listTuQui.forEach((item)=>{
                        if(item.length > 0) listReturn.push(item);
                    })
                }
               
                this.listThong.forEach((item)=>{
                    if(item.length > 7  ) listReturn.push(item);
                })
            }else{
                this.listDoi.forEach((item)=>{
                    if(item.length >0 && getMax(item) > getMax(arr)) listReturn.push(item);
                })
            }
        }else if(is2(arr)){
            this.listTuQui.forEach((item)=>{
                if(item.length > 0) listReturn.push(item);
            })
            this.listThong.forEach((item)=>{
                if(item.length > 0 ) listReturn.push(item);
            })
            this.arrId.forEach((item)=>{
                if(getMax([item])  >getMax(arr)) listReturn.push([item])
            })
        }else if (arr.length == 1){
            cc.log("is 1")
            this.arrId.forEach((item)=>{
                if(getMax([item])  >getMax(arr)) listReturn.push([item])
            })
        }
        listReturn.sort((a,b)=>a[0] - b[0]);
        this.listArrAn = listReturn;
        this.listIdNotAn = this.getListNotIdByListSuite(listReturn , this.arrId);
        return listReturn
    },
    getListNotIdByListSuite(listSuite  , arrId){
        // cc.log("list an: " + JSON.stringify(listSuite));
        // cc.log("arrId " + JSON.stringify(arrId));
        let listReturn = [];
     if(listSuite.length == 0){
         listReturn = arrId.slice();
     }else{
         for(let i = 0 , l = arrId.length ; i < l ; i++){
             let isCheck = false;
             listSuite.forEach((item)=>{
                 if(item.includes(arrId[i])) isCheck = true;
             })
             if(!isCheck) listReturn.push(arrId[i]);
         }
     }
     return listReturn;
    },
    updateArrXep(){
        let listId = [];
        // this.list2.forEach((item)=>{
        //     listId.push(item[0]);
        // })

        this.listTuQui.forEach((item)=>{
            let isCheck = false;
            if(item.length > 0 ){
                item.forEach((item2)=>{
                    if(listId.includes(item2)){
                        isCheck = true;
                      //  break;
                    } 
                })
                if(!isCheck){
                    item.forEach((item2)=>{
                        listId.unshift(item2);
                    })
                }
            } 
        })

        this.listThong.forEach((item)=>{
            let isCheck = false;
            if(item.length > 0 ){
                item.forEach((item2)=>{
                    if(listId.includes(item2)){
                        isCheck = true;
                       // break;
                    } 
                })
                if(!isCheck){
                    item.forEach((item2)=>{
                        listId.unshift(item2);
                    })
                }
            } 
        })

        this.listSanh.forEach((item)=>{
            let isCheck = false;
            if(item.length > 0 ){
                item.forEach((item2)=>{
                    if(listId.includes(item2)){
                        isCheck = true;
                        //break;
                    } 
                })
                if(!isCheck){
                    item.forEach((item2)=>{
                        listId.unshift(item2);
                    })
                }
            } 
        })
       
        
        this.listXam.forEach((item)=>{
            let isCheck = false;
            if(item.length > 0 ){
                item.forEach((item2)=>{
                    if(listId.includes(item2)){
                        isCheck = true;
                        //break;
                    } 
                })
                if(!isCheck){
                    item.forEach((item2)=>{
                        listId.unshift(item2);
                    })
                }
            } 
        })

        this.listDoi.forEach((item)=>{
            let isCheck = false;
            if(item.length > 0 ){
                item.forEach((item2)=>{
                    if(listId.includes(item2)){
                        isCheck = true;
                      //  break;
                    } 
                })
                if(!isCheck){
                    item.forEach((item2)=>{
                        if(getNum(item) == 15){
                            listId.push(item2);
                        }else{
                            listId.unshift(item2);
                        }
                        
                    })
                }
            } 
        })

        this.arrId.forEach((item)=>{
            if(!listId.includes(item))  listId.unshift(item)
                
        })
       return listId

    },
    getArrXep(){
        //cc.log("type la  " +this.stateXep );
        let listReturn = [];
        if(this.stateXep == 1){
            listReturn = this.arrId.sort((a,b)=> a - b);
            this.stateXep = 2;
        }else{
          
            this.stateXep = 1;
            listReturn = this.updateArrXep();
        }
        return listReturn;
    },
    isThong(arr){
       
        return isThong(arr);
    },
    isTuQui(arr){
        return isTuQui(arr);
    },

    isSanh(arr){
        return isSanh(arr);
    }
}
function getMax(arr){
    if(arr.length ==0 ) return 0
    if(_isSam){
        let num = getNum(arr[arr.length-1])
        cc.log(arr[arr.length-1]);
        cc.log(num);
        return num;
    }else{
        return arr[arr.length-1];
    }
    
}
function isThong(arr){
    if(_isSam) return false;
    if(arr.length > 5 && arr.length %2 ==0){
        for(let i = 0 , l = arr.length; i < l ; i++){
            if(  getNum(arr[i]) !=  getNum(arr[i + 1]) ||   getNum(arr[i]) ==15 ){
                return false;
            }else{
                i++;
            }
        }
       // cc.log("chay dc xuong duoi roi")
        for(let i = 0 , l = arr.length - 2; i < l ; i+=2){
            if(   getNum(arr[i + 2]) -  getNum(arr[i]) != 1) return false;
        }

        return true;
    }
    return false
}

function isTuQui(arr){
    if(arr.length  == 4){
        for(let i = 0 , l = arr.length - 1; i < l ; i++){
            if(  getNum(arr[i]) !=  getNum(arr[i + 1])) return false;
        }
        return true;
    }
    return false
}
function isXam(arr){
    if(arr.length  == 3){
        for(let i = 0 , l = arr.length - 1; i < l ; i++){
            if(  getNum(arr[i]) !=  getNum(arr[i + 1])) return false;
        }
        return true;
    }
    return false
}
function isSanh(arr){
    if(arr.length  > 2){
        let isCheck = true;
        for(let i = 0 , l = arr.length -1; i < l ; i++){
           // console.log( getNum(arr[i + 1]) +";"+ getNum(arr[i]) );
            if( getNum(arr[i + 1])  - getNum(arr[i]) != 1 || getNum(arr[i]) == 15){
                isCheck = false;
                break;
            } 
        }
        if( getNum(arr[arr.length -1]) == 15) isCheck = false;
        
        if(isCheck) return true;
        if(isSanhA23(arr)) isCheck = true;

        return isCheck;
     
    }
    return false
}

function isSanhA23(_arr){ // danh cho sam
    if(_isSam){
        if(_arr.length < 3) return false;
        let arr = _arr.slice();
        arr.sort( (a, b) => { return getNumSam(a) - getNumSam(b)})
        if(getNumSam(arr[0]) != 1) return false;
        for(let i = 0 , l = arr.length -1; i < l ; i++){
            let num1 = getNumSam(arr[i]);
            let num2 = getNumSam(arr[i + 1]);
            if( num2  - num1 != 1 ) return false;
        }
        return true;
    }
   
    return false
}


function isDoi(arr){
    if(arr.length  == 2){
        if( getNum(arr[0]) != getNum(arr[1])) return false;
        return true;
    }
    return false
}
function is2(arr){
    if(arr.length  == 1){
        if( getNum(arr[0]) != 15) return false;
        return true;
    }
    return false
}

function getNum(id){
    return parseInt(id / 10);
}
function getNumSam(id){
    
    let isReturn = parseInt(id / 10);
    if(isReturn > 13) isReturn =isReturn - 13 ;
   //. if(id > 139) cc.log("num sam: " + (isReturn))
    return isReturn;
}
function getFace(id){
    return id % 10;
} 

module.exports = CardHelperTLMN;