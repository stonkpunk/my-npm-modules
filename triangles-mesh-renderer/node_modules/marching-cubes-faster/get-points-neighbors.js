/**
 * Created by user on 11/14/2017.
 */

function distPt2PtSq(p0,p1){
    var x=(p0[0]-p1[0]);
    var y=(p0[1]-p1[1]);
    var z=(p0[2]-p1[2]);
    return x*x+y*y+z*z;
}

function getPointNeighborsNaive(setOfPts, _minDist){
    console.log("getting pt-set neighbors, slow", setOfPts.length);

    var eps = 0.001;
    var sop = setOfPts;
    var minDist = _minDist;// || (1.0*Math.sqrt(3));
    var mds = minDist*minDist; //min dist squared
    for(var i=0;i<sop.length;i++){
        if(i%100==0)console.log(i);
        var pt = sop[i];
        pt.neighbors=null; //reset existing neighbors...
        for(var j=0;j<sop.length;j++){
            if(j!=i){
                var ptn = sop[j];
                if(! pt.neighbors) pt.neighbors=[];

                var d = distPt2PtSq(pt, ptn);
                if(d<=mds && d>=eps){
                    pt.neighbors.push(ptn);
                }
            }
        }
    }
    //console.log("got neighbors!");
    return setOfPts;
}


// function getPointNeighbors_sameNormal(setOfPts, _minDist){
//
//     function normalsSame(p0, p1){
//         var eps = 0.1;
//         var norm0 = [p0.norm._x,p0.norm._y,p0.norm._z];
//         var norm1 = [p1.norm._x,p1.norm._y,p1.norm._z];
//         return Math.sqrt(distPt2PtSq(norm0,norm1))<eps;
//     }
//
//     var eps = 0.001;
//     var sop = setOfPts;
//     var minDist = _minDist;// || (1.0*Math.sqrt(3));
//     var mds = minDist*minDist; //min dist squared
//     for(var i=0;i<sop.length;i++){
//         var pt = sop[i];
//         for(var j=0;j<sop.length;j++){
//             if(j!=i){
//                 var ptn = sop[j];
//                 if(! pt.neighbors) pt.neighbors=[];
//
//                 var d = distPt2PtSq(pt, ptn);
//                 if(d<=mds && d>=eps && normalsSame(pt,ptn)){
//                     pt.neighbors.push(ptn);
//                 }
//             }
//         }
//     }
//     return setOfPts;
// }

var octreeYaot = require('yaot');

function getPointNeighborsFast(setOfPts, _minDist){

    if(!octreeYaot){
        console.log("WARNING -- missing octree library -- pt neighbors falling back to naive mode");
        return getPointNeighborsNaive(setOfPts, _minDist);
    }

    //console.log("getting pt-set neighbors, octree", setOfPts.length);
    var sop = setOfPts;
    var tree = octreeYaot();
    var ptList = [];

    sop.map(function(p){
        ptList.push(p[0]);
        ptList.push(p[1]);
        ptList.push(p[2]);
    });

    tree.init(ptList);

    //console.log("tree inited!", tree);

    var eps = 0.001;

    var minDist = _minDist;// || (1.0*Math.sqrt(3));
    //var mds = minDist*minDist; //min dist squared
    for(var i=0;i<sop.length;i++){
        var p = sop[i];
        var matches = tree.intersectSphere(p[0], p[1], p[2], minDist);
        p.neighbors=[];

        for(var j=0; j<matches.length; j++){
            var op = sop[Math.floor(matches[j]/3.0)];
            //var d = distPt2PtSq(p, op); //apparently intersectSphere already does this...
            //if(d<=mds && d>=eps){
                p.neighbors.push(op);
            //}
        }
    }
    //console.log("got neighbors!");
    //setOfPts.tree=tree;
    return setOfPts;
}
//
// function pt2RTreeObj(pt,_rad){
//     var rad = _rad ;
//     const item = {
//         minX: pt[0]-rad,
//         minY: pt[1]-rad,
//         minZ: pt[2]-rad,
//         maxX: pt[0]+rad,
//         maxY: pt[1]+rad,
//         maxZ: pt[2]+rad,
//         pt: pt
//     };
//     return item;
// }
//
// function getPointNeighborsRBush(pts, ptsScales){
//     if(!RTREE)console.log("RTREE library not found! import rtree.js");
//     var tree = new RTREE.RBush3D(16);
//
//     tree.load(pts.map(function(pt,i){return pt2RTreeObj(pt, ptsScales[i]);}));
//
//     return pts.map(function(pt,i){
//         var neighborsAll = tree.search(pt2RTreeObj(pt,ptsScales[i])).map(box => box.pt);
//         pt.neighbors = neighborsAll;
//         return pt;
//     })
// }
//
// function getPointNeighborsBVH(pts, ptsScales){
//
//     /*
//        var createBvh = window.BVH; //generalized-bvh.js
//
//     //https://bl.ocks.org/rreusser/a00c6989d82d7c5e497ad0dbe16275af
//     //mit license
//
//     var bvh = createBvh([
//         // Bounding box of item id=0:
//         0,0,0,
//         1,1,1
//     ]);
//
//     console.log("bvh?",bvh);
//      */
//
//     if(!window.BVH)console.log("BVH library not found! import unrolled-bvh-browserify.js");
//
//     //TODO get neighbors from bvh as above, use test func...
//
//     /*var bvh = window.BVH([
//         // Bounding box of item id=0:
//         0,0,0,
//         1,1,1,
//         //id=1
//         0,0,0,
//         1,1,1
//     ]);*/
//
//     var arr = [];
//
//     for(var i=0;i< pts.length;i++){
//         var pt = pts[i];
//         arr.push(
//             pt[0]-ptsScales[i],pt[1]-ptsScales[i],pt[2]-ptsScales[i],
//             pt[0]+ptsScales[i],pt[1]+ptsScales[i],pt[2]+ptsScales[i]
//         );
//     }
//
//     var bvh = window.BVH(arr
//         /*[].concat(...
//             pts.map(
//                 (pt,i)=>[
//                     pt[0]-ptsScales[i],pt[1]-ptsScales[i],pt[2]-ptsScales[i],
//                     pt[0]+ptsScales[i],pt[1]+ptsScales[i],pt[2]+ptsScales[i]
//                 ]
//             )
//         )*/
//     );
//
//     function neighborsFromBvh(x,y,z,scale,index){
//         var neighbors = [];
//         bvh.test(function(extents){ //bbox test..
//             //console.log("bbox test extens", extents); //extens is float[6]
//             // do sector intersect func
//             var s = scale/2;
//             return sectorsMightTouch_intersection(sectorFromArray(extents),[[x-s,y-s,z-s],[x+s,y+s,z+s]]);
//             //return true;
//         }, function(leafid){ //leaf test
//             //console.log("leafid",leafid); //0,1
//             //if( lineLength([[x,y,z],pts[leafid]])<(ptsScales[leafid]+ptsScales[index]) ){
//                 neighbors.push(pts[leafid]);
//             //}
//             //
//         })
//         return neighbors;
//     }
//
//     return pts.map(function(pt,i){
//         pt.neighbors=neighborsFromBvh(pt[0],pt[1],pt[2],ptsScales[i],i);
//         return pt;
//     });
//
//     //var tree = new RTREE.RBush3D(16);
//
//     //tree.load(pts.map(function(pt,i){return pt2RTreeObj(pt, ptsScales[i]);}));
//     //
//     // return pts.map(function(pt,i){
//     //     var neighborsAll = tree.search(pt2RTreeObj(pt,ptsScales[i])).map(box => box.pt);
//     //     pt.neighbors = neighborsAll;
//     //     return pt;
//     // })
// }
//
// var getPointNeighbors = getPointNeighborsFast;

function getPointNeighborsDelaunay(points){

    function addNeighbors(point,tetra){
        point.neighbors = point.neighbors || [];
        tetra.forEach(function(index){
            var p0 = points[index];
            if(point!=p0 && point.neighbors.indexOf(p0)==-1){point.neighbors.push(p0);}
        })
    }

    var triangulate = require("delaunay-triangulate")

    var tetras = triangulate(points)

    //console.log(tetras) //list of tetras [ 691, 344, 957, 684 ]

    tetras.forEach(function(tetra){
        addNeighbors(points[tetra[0]], tetra);
        addNeighbors(points[tetra[1]], tetra);
        addNeighbors(points[tetra[2]], tetra);
        addNeighbors(points[tetra[3]], tetra);
    });

    return points;

}

module.exports = {getPointNeighborsFast, getPointNeighborsDelaunay};