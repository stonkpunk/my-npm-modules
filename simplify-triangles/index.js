var THREE = require("three"); //use 0.112.0
const {ThreeGeometry, FastQuadric} = require("mesh-simplifier");

function tris2Geom(tris){
    var geom = new THREE.Geometry();
    for(var i=0; i<tris.length; i++){
        var tri= tris[i];
        var lastIndex = geom.vertices.length;
        geom.vertices.push(new THREE.Vector3(tri[0][0], tri[0][1], tri[0][2]));
        geom.vertices.push(new THREE.Vector3(tri[1][0], tri[1][1], tri[1][2]));
        geom.vertices.push(new THREE.Vector3(tri[2][0], tri[2][1], tri[2][2]));
        geom.faces.push( new THREE.Face3( 0+lastIndex, 1+lastIndex, 2+lastIndex ) );
    }
    geom.computeFaceNormals();
    return geom;
}

function vec2Pt(vec){
    return [vec.x,vec.y,vec.z];
}

function geom2Tris(geom){
    return geom.originalGeometry.faces.map(function(face){
        return [
            vec2Pt(geom.originalGeometry.vertices[face.a]),
            vec2Pt(geom.originalGeometry.vertices[face.b]),
            vec2Pt(geom.originalGeometry.vertices[face.c])
        ]
    });
}

function simplify(tris, percent, verbose){
    const geometry = tris2Geom(tris);//new THREE.TorusKnotGeometry(10); //tris2Geom(tris);//.toBufferGeometry();//
    const adaptedGeometry = new ThreeGeometry(geometry);
    const simplifier = new FastQuadric(
        {
            targetPercentage: percent,
            aggressiveness: 7
        }); //lower agg = more accurate, slower? [not sure - lower numbers = more verts]

    simplifier.simplify(adaptedGeometry);

    if(verbose){
        console.log(tris.length, adaptedGeometry.originalGeometry.faces.length)
    }

    return geom2Tris(adaptedGeometry);
}

module.exports = {simplify};