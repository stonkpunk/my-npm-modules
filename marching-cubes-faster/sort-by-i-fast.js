function sortByIndex(a,b){return a.i-b.i;}

function sort3Fast_i_reverse(_a,_b,_c){//, i){ //sorts descending w/ 5 comparisons // https://stackoverflow.com/questions/6145364/sort-4-number-with-few-comparisons
    var a = _a.i;//[i];
    var b = _b.i;//[i];
    var c = _c.i;//[i];
    //var d = _d[i];
    if(a > b){
        if(b > c){
            return [_c, _b, _a];
        }else{
            if(a > c){
                return [_b, _c, _a];
            }else{
                return [_b, _a, _c];
            }
        }
    }else{
        if(a > c){
            return [ _c, _a, _b];
        }else{
            if(b > c){
                return [_a, _c, _b];
            }else{
                return [ _a, _b, _c];
            }
        }
    }
}

function sort4Fast_i_reverse(_a,_b,_c,_d){ //sorts asc w/ 5 comparisons // https://stackoverflow.com/questions/6145364/sort-4-number-with-few-comparisons
    /*var a = _a[i];
    var b = _b[i];
    var c = _c[i];
    var d = _d[i];*/
    var a = _a.i;
    var b = _b.i;
    var c = _c.i;
    var d = _d.i;
    if(a > b){
        if(b > c){
            if(d > b){
                if(d > a){
                    return [_c, _b, _a, _d]
                }else{
                    return [_c, _b, _d, _a]
                }
            }else{
                if(d > c){
                    return [_c, _d, _b, _a]
                }else{
                    return [_d, _c, _b, _a]
                }
            }
        }else{
            if(a > c){
                if(d > c){
                    if(d > a){
                        return [_b, _c, _a, _d]
                    }else{
                        return [_b, _c, _d, _a]
                    }
                }else{
                    if(d > b){
                        return [_b, _d, _c, _a]
                    }else{
                        return [_d, _b, _c, _a]
                    }
                }
            }else{
                if(d > a){
                    if(d > c){
                        return [_b, _a, _c, _d]
                    }else{
                        return [_b, _a, _d, _c]
                    }
                }else{
                    if(d > b){
                        return [_b, _d, _a, _c]
                    }else{
                        return [_d, _b, _a, _c]
                    }
                }
            }
        }
    }else{
        if(a > c){
            if(d > a){
                if(d > b){
                    return [_c, _a, _b, _d]
                }else{
                    return [_c, _a, _d, _b]
                }
            }else{
                if(d > c){
                    return [_c, _d, _a, _b]
                }else{
                    return [_d, _c, _a, _b]
                }
            }
        }else{
            if(b > c){
                if(d > c){
                    if(d > b){
                        return [_a, _c, _b, _d]
                    }else{
                        return [_a, _c, _d, _b]
                    }
                }else{
                    if(d > a){
                        return [_a, _d, _c, _b]
                    }else{
                        return [_d, _a, _c, _b]
                    }
                }
            }else{
                if(d > b){
                    if(d > c){
                        return [_a, _b, _c, _d]
                    }else{
                        return [_a, _b, _d, _c]
                    }
                }else{
                    if(d > a){
                        return [_a, _d, _b, _c]
                    }else{
                        return [_d, _a, _b, _c]
                    }
                }
            }
        }
    }
}

function sortBlocksFast(closeBlocks){
    //if(closeBlocks.length<5){ //~4M times
        switch(closeBlocks.length){ //cases are ordered by frequency
            case 2: //2,742,947 times
                closeBlocks = closeBlocks[0].i<closeBlocks[1].i ? closeBlocks : [closeBlocks[1],closeBlocks[0]];
                break;
            case 3: //978,558 times
                closeBlocks = sort3Fast_i_reverse(closeBlocks[0],closeBlocks[1],closeBlocks[2]);
                break;
            case 1: //252,561 times //do nothing
                break;
            case 4: //36,715 times
                closeBlocks = sort4Fast_i_reverse(closeBlocks[0],closeBlocks[1],closeBlocks[2],closeBlocks[3]);
                break;
            default:
                closeBlocks.sort(sortByIndex); //sort by ascending index //TODO use network / timsort instead?
        }
   // }else{ //~7000 times
   //      closeBlocks.sort(sortByIndex); //sort by ascending index
   // }
    return closeBlocks;
}

module.exports = sortBlocksFast;