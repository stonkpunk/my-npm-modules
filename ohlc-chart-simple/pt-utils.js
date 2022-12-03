// function boundingBlockOfPts_2d(sop){
//     var bb = [clonePt(sop[0]),clonePt(sop[0])];
//     for(var i=0; i<sop.length;i++){
//         var p = sop[i];
//         var xLo = Math.min(Math.min(p[0],bb[0][0]), Math.min(p[0],bb[0][0]));
//         var xHi = Math.max(Math.max(p[0],bb[1][0]), Math.max(p[0],bb[1][0]));
//         var yLo = Math.min(Math.min(p[1],bb[0][1]), Math.min(p[1],bb[0][1]));
//         var yHi = Math.max(Math.max(p[1],bb[1][1]), Math.max(p[1],bb[1][1]));
//         bb=[[xLo,yLo],[xHi,yHi]];
//     }
//     return bb;
// };

function clonePt(pt){
    var ptB=[];
    pt.forEach(function(d){ptB.push(d);});
    return ptB;
}

function boundingBlockOfPts_nd(sop, padding = 0.0){
    var n = sop[0].length;
    var bb = [clonePt(sop[0]),clonePt(sop[0])];
    for(var i=0; i<sop.length;i++){
        var p = sop[i];
        for(var d=0;d<n;d++){
            var xLo = Math.min(Math.min(p[d]-padding,bb[0][d]));
            var xHi = Math.max(Math.max(p[d]+padding,bb[1][d]));
            bb[0][d] = xLo;
            bb[1][d] = xHi;
        }
    }
    return bb;
};

function getPtRelativeToBounds(pt, bounds){
    return pt.map(function(dim,j){
        return (dim - bounds[0][j])/(bounds[1][j]-bounds[0][j]);
    });
}

function boundsCenter(bb){
    return bb[1].map(function(dim,j){
        return (bb[0][j] + bb[1][j])/2;
    });
}

function lerpNd(pt0,pt1,t){
    return pt0.map(function(dim,j){
        return pt0[j]+(pt1[j]-pt0[j])*t;
    });
}

// function getPtRelativeToBounds2(pt, bounds){
//     var bc = boundsCenter(bounds);
//     return pt.map(function(dim,j){
//         var d = (dim - bounds[0][j])
//         return bounds[0][j] + d/(bounds[1][j]-bounds[0][j]);
//     }).map(d=>Math.min(1.0,Math.max(0.0,d)));
// }

function scaleBounds(bb,s=2.0){
    var center = boundsCenter(bb);
    var bb0 = lerpNd(center,bb[0],s);
    var bb1 = lerpNd(center,bb[1],s);
    return [bb0,bb1];
}

function clampPtNd(pt){
    return pt.map(function(dim,j){
        return Math.max(Math.min(dim,0.99),0.01);
    });
}

function remapPts_nd_rolling(sop, windowSize=1){ //remap nd pts to range 0...1
    var res = [];
    for(var i=windowSize;i<sop.length-1;i++){
        var _sop = sop.slice(i-windowSize,i);
        var _boundsSop = scaleBounds(
            boundingBlockOfPts_nd(_sop, 0.0)
        , 1.0);
        res.push(
            clampPtNd (
                getPtRelativeToBounds(sop[i], _boundsSop)
            )
        );
    }
    return res;
    // var bb = _bb || boundingBlockOfPts_nd(sop);
    // var sizes = bb[1].map(function(dim,j){
    //     return dim - bb[0][j];
    // });
    // var res= sop.map(function(row, i){
    //     return row.map(function(dim,j){
    //         return (dim - bb[0][j])/sizes[j];
    //     });
    // });
    //
    // return shiftPts_nd( scalePts_nd(res,postScaleDown), 0.5-0.5*postScaleDown );
}

//remapPts_5space -- x*x method [using this one for now]
//remapPts_5space2 -- atan method
//remapPts_5space3 -- exp method

//infinite clamp
function remapTo5Space(x, scaleDown=1.0, POW=2){
    var _x=0;
    var xScaleDown = 1.0; //larger number ==> infinity squashed into edges more , space looks more scaled down, larger movements needed
    var pow = POW;
    if(x>0){
        _x=Math.pow(x/xScaleDown,pow)/(Math.pow(x/xScaleDown,pow)+1); //x=[0...inf] ==> y=[0...1]
        _x=0.5+_x/2.0*scaleDown; //0.5...1
    }else{
        _x*=-1;
        _x=Math.pow(x/xScaleDown,pow)/(Math.pow(x/xScaleDown,pow)+1); //x=[0...inf] ==> y=[0...1]
        _x=0.5-_x/2.0*scaleDown; //0...0.5
    }
    return _x;
}

function unremapTo5Space(x, scaleDown=1.0, POW=2){ //0 ... -inf ... inf
    //x = ((1-y)/y)^(-1/n) //0...1 => 0... inf
    //y = x^n/(x^n+1) //0 ... inf => 0...1
    var _x = x-0.5;
    _x*=2.0;
    _x/=scaleDown;

    if(_x==0){
        return 0;
    }

    var y;
    if(_x>0){
        y = Math.pow(-((_x-1)/_x), (-1/POW));
    }else{
        _x*=-1;
        y = Math.pow(-((_x-1)/_x), (-1/POW));
        y*=-1;
    }
    return y;
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

function remapTo5Space3(x,scaleDown=1.0){ //https://math.stackexchange.com/questions/3116137/convert-numbers-between-0-and-infinity-to-numbers-between-0-0-and-1-0
    var _x=0;
    var BASE = 3.0;

    if(x>0){
        _x=1.0-Math.pow(BASE,-x);
        _x=0.5+_x/2.0*scaleDown; //0.5...1
    }else{
        x*=-1;
        _x=1.0-Math.pow(BASE,-x);
        _x=0.5-_x/2.0*scaleDown; //0...0.5
    }

    return _x;
}

function remapPts_5space3(sop,scaleDown){ //https://math.stackexchange.com/questions/3116137/convert-numbers-between-0-and-infinity-to-numbers-between-0-0-and-1-0
    return sop.map(function(row, i){
        return row.map(function(dim,j){
            return remapTo5Space3(dim,scaleDown);
        });
    });
}


function remapPts_5space2(sop,scaleDown){ //https://math.stackexchange.com/questions/3116137/convert-numbers-between-0-and-infinity-to-numbers-between-0-0-and-1-0
    return sop.map(function(row, i){
        return row.map(function(dim,j){
            return remapTo5Space2(dim,scaleDown);
        });
    });
}

//https://math.stackexchange.com/questions/3116137/convert-numbers-between-0-and-infinity-to-numbers-between-0-0-and-1-0
function remapPts_5space(sop, scaleDown){ //maps -inf ... inf to 0...1
    return sop.map(function(row, i){
        return row.map(function(dim,j){
            return remapTo5Space(dim, scaleDown);
        });
    });
}

function unremapPts_5space(sop, scaleDown){ //maps -inf ... inf to 0...1
    return sop.map(function(row, i){
        return row.map(function(dim,j){
            return unremapTo5Space(dim, scaleDown);
        });
    });
}

function remapPts_nd(sop, _bb, postScaleDown=1.0){ //remap nd pts to range 0...1
    var bb = _bb || boundingBlockOfPts_nd(sop);
    var sizes = bb[1].map(function(dim,j){
        return dim - bb[0][j];
    });
    var res= sop.map(function(row, i){
        return row.map(function(dim,j){
            return (dim - bb[0][j])/sizes[j];
        });
    });

    return shiftPts_nd( scalePts_nd(res,postScaleDown), 0.5-0.5*postScaleDown );
}

function scalePts_nd(sop, s){  //nd scale [s is length n vector]
    if(Array.isArray(s)){
        return sop.map(function(row, i){
            return row.map(function(dim,j){
                return dim*s[j];
            });
        });
    }else{
        return sop.map(function(row, i){
            return row.map(function(dim,j){
                return dim*s;
            });
        });
    }
}

function shiftPts_nd(sop, s){  //nd shift [s is length n vector]
    if(Array.isArray(s)){
        return sop.map(function(row, i){
            return row.map(function(dim,j){
                return dim+s[j];
            });
        });
    }else{
        return sop.map(function(row, i){
            return row.map(function(dim,j){
                return dim+s;
            });
        });
    }
}

function indexPluckPts(sop, indexList){
    var obj = {};
    indexList.forEach(function(i){obj[i]=true;});
    return sop.map(function(row){
        return row.filter(function(dim,j){
            return obj[j];
        })
    })
}

// var { UMAP } = require('umap-js');
// function getUmap(data,_epochs,stepCb){
//     console.log('calculating UMAP...');
//     var umap = new UMAP();
//     var nEpochs = umap.initializeFit(data);
//     if(_epochs){nEpochs=_epochs;}
//     for (var i = 0; i < nEpochs; i++) {
//         console.log('epoch step',i+1,'/',nEpochs);
//         umap.step();
//         if(stepCb){
//             stepCb(umap,i);
//         }
//     }
//     console.log('done');
//     return umap;
// }

module.exports = {
    remapTo5Space, unremapTo5Space, remapPts_5space, unremapPts_5space, remapPts_5space2, remapPts_5space3, lerpNd,
    clonePt, boundingBlockOfPts_nd, remapPts_nd, remapPts_nd_rolling, scalePts_nd, shiftPts_nd, indexPluckPts
}