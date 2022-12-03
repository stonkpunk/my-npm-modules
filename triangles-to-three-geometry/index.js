var THREE =  require('three');
function trianglesIndexed2ThreeGeom(bunny){ //indexed triangles list to three geom
    var geometry = new THREE.BufferGeometry();
    var vertices = new Float32Array( [].concat(...bunny.positions));
    var indices = new Uint32Array( [].concat(...bunny.cells));
    geometry.setIndex( indices ); //indices int array of vert indices eg for adding 1 face we do, indices.push( a, b, d );
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
    return geometry;
}

function _triangles2ThreeGeom(tris){ //raw triangles list to three geom
    var geometry = new THREE.BufferGeometry();
    var positions = [].concat(...tris);
    var vertices = new Float32Array( [].concat(...positions));
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
    return geometry;
}

var ti = require('triangles-index');
function triangles2ThreeGeom(tris, doIndex=true){
    if(doIndex){
        var bunny = ti.indexTriangles_meshView(tris);
        return trianglesIndexed2ThreeGeom(bunny);
    }else{
        return _triangles2ThreeGeom(tris);
    }
}

function chunk (arr, len) {//https://stackoverflow.com/questions/8495687/split-array-into-chunks
    var chunks = [],
        i = 0,
        n = arr.length;

    while (i < n) {
        chunks.push(arr.slice(i, i += len));
    }

    return chunks;
}

function threeGeomToTriangles(threeGeom, doIndex = false){
    var pos = threeGeom.getAttribute("position").array;
    var index = threeGeom.getIndex();

    if(index){
        var positions = chunk(pos,3);
        var cells = chunk(index,3);
        return doIndex ? {positions, cells} : ti.deindexTriangles_meshView({positions,cells});
    }

    var positions = chunk(pos,3);
    var tris = chunk(positions,3)

    return doIndex ? ti.indexTriangles_meshView(tris) : tris;
}

function threeGeomToTrianglesIndexed(threeGeom){
    return threeGeomToTriangles(threeGeom, true);
}

module.exports = {triangles2ThreeGeom, trianglesIndexed2ThreeGeom, threeGeomToTriangles, threeGeomToTrianglesIndexed};

//building a geometry...
//const geometry = new THREE.BufferGeometry();
//with index:
// geometry.setIndex( indices ); //indices int array of vert indices eg for adding 1 face we do, indices.push( a, b, d );
// geometry.setAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );

//without index:
// create a simple square shape. We duplicate the top left and bottom right
// vertices because each vertex needs to appear once per triangle.
// const vertices = new Float32Array( [
//     -1.0, -1.0,  1.0,
//     1.0, -1.0,  1.0,
//     1.0,  1.0,  1.0,
//
//     1.0,  1.0,  1.0,
//     -1.0,  1.0,  1.0,
//     -1.0, -1.0,  1.0
// ] );
//
// // itemSize = 3 because there are 3 values (components) per vertex
// geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
// const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
// const mesh = new THREE.Mesh( geometry, material );