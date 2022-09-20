//https://math.stackexchange.com/questions/3116137/convert-numbers-between-0-and-infinity-to-numbers-between-0-0-and-1-0

//infinite clamp
function remapTo5Space(x, scaleDown=1.0, POW=2, unsigned = false){
    var _x=0;
    //scaleDown //larger number ==> infinity squashed into edges more , space looks more scaled down, larger movements needed
    var pow = POW;

    if(unsigned){
        _x=Math.pow(x/scaleDown,pow)/(Math.pow(x/scaleDown,pow)+1); //x=[0...inf] ==> y=[0...1]
    }else{
        if(x>0){
            _x=Math.pow(x/scaleDown,pow)/(Math.pow(x/scaleDown,pow)+1); //x=[0...inf] ==> y=[0...1]
            _x=0.5+_x/2.0; //0.5...1
        }else{
            _x*=-1;
            _x=Math.pow(x/scaleDown,pow)/(Math.pow(x/scaleDown,pow)+1); //x=[0...inf] ==> y=[0...1]
            _x=0.5-_x/2.0; //0...0.5
        }
    }

    return _x;
}

function unremapTo5Space(x, scaleDown=1.0, POW=2, unsigned=false){ //0 ... -inf ... inf
    //x = ((1-y)/y)^(-1/n) //0...1 => 0... inf
    //y = x^n/(x^n+1) //0 ... inf => 0...1
    var _x ;
    var y = 0;

    if(unsigned){
        y = Math.pow(-((_x-1)/_x), (-1/POW));
    }else{
        _x=x-0.5;
        _x*=2.0;

        if(_x>0){
            y = Math.pow(-((_x-1)/_x), (-1/POW));
        }else{
            _x*=-1;
            y = Math.pow(-((_x-1)/_x), (-1/POW));
            y*=-1;
        }
    }

    if(_x==0){
        return 0;
    }

    return y * scaleDown;
    // var _x=0;
    // var xScaleDown = 1.0; //larger number ==> infinity squashed into edges more , space looks more scaled down, larger movements needed
    // var pow = POW;
    // if(x>0){
    //     _x=Math.pow(x/xScaleDown,pow)/(Math.pow(x/xScaleDown,pow)+1); //x=[0...inf] ==> y=[0...1]
    //     _x=0.5+_x/2.0*scaleDown; //0.5...1
    // }else{
    //     _x*=-1;
    //     _x=Math.pow(x/xScaleDown,pow)/(Math.pow(x/xScaleDown,pow)+1); //x=[0...inf] ==> y=[0...1]
    //     _x=0.5-_x/2.0*scaleDown; //0...0.5
    // }
    // return _x;
}
//
// function remapTo5Space3(x,scaleDown=1.0){ //https://math.stackexchange.com/questions/3116137/convert-numbers-between-0-and-infinity-to-numbers-between-0-0-and-1-0
//     var _x=0;
//     var BASE = 3.0;
//
//     if(x>0){
//         _x=1.0-Math.pow(BASE,-x);
//         _x=0.5+_x/2.0*scaleDown; //0.5...1
//     }else{
//         x*=-1;
//         _x=1.0-Math.pow(BASE,-x);
//         _x=0.5-_x/2.0*scaleDown; //0...0.5
//     }
//
//     return _x;
// }

function remapUnsigned(x, scaleDown=1.0, POW=2, unsigned = false){
    return remapTo5Space(x, scaleDown, POW,true)
}

function unremapUnsigned(x, scaleDown=1.0, POW=2, unsigned = false){
    return unremapTo5Space(x, scaleDown, POW,true)
}

module.exports = {remap: remapTo5Space, unremap: unremapTo5Space, remapUnsigned, unremapUnsigned}
//
// function remapPts_5space3(sop,scaleDown){ //https://math.stackexchange.com/questions/3116137/convert-numbers-between-0-and-infinity-to-numbers-between-0-0-and-1-0
//     return sop.map(function(row, i){
//         return row.map(function(dim,j){
//             return remapTo5Space3(dim,scaleDown);
//         });
//     });
// }
//
//
// function remapPts_5space2(sop,scaleDown){ //https://math.stackexchange.com/questions/3116137/convert-numbers-between-0-and-infinity-to-numbers-between-0-0-and-1-0
//     return sop.map(function(row, i){
//         return row.map(function(dim,j){
//             return remapTo5Space2(dim,scaleDown);
//         });
//     });
// }
//
// //https://math.stackexchange.com/questions/3116137/convert-numbers-between-0-and-infinity-to-numbers-between-0-0-and-1-0
// function remapPts_5space(sop, scaleDown){ //maps -inf ... inf to 0...1
//     return sop.map(function(row, i){
//         return row.map(function(dim,j){
//             return remapTo5Space(dim, scaleDown);
//         });
//     });
// }
//
// function unremapPts_5space(sop, scaleDown){ //maps -inf ... inf to 0...1
//     return sop.map(function(row, i){
//         return row.map(function(dim,j){
//             return unremapTo5Space(dim, scaleDown);
//         });
//     });
// }
