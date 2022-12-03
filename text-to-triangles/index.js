const path = require("svg-path-properties");
const lu = require("./lines-utils.js");
const svgMesh3d = require("svg-mesh-3d");

const TextToSVG = require('text-to-svg');
const textToSVG = TextToSVG.loadSync();

function svgMesh2Tris(m){

    function swapYZ(pt){
        return [pt[0],pt[2],pt[1]];
    }

    var tris = m.cells.map(function(c,i){
        var tri = [
            m.positions[c[0]],m.positions[c[1]],m.positions[c[2]]
        ].map(swapYZ);
        //tri.color =  [Math.random(),Math.random(),Math.random()];
        return tri;
    });

    return tris;
}

function part2Line(svgPart){
    var s = 0;//Math.random();
    var line = [
        [(svgPart.start.x),s,(svgPart.start.y)],
        [(svgPart.end.x),s,(svgPart.end.y)]
    ]
    //line.color = [Math.random(),Math.random(),Math.random()];
    return line;
}

function renderTextAsTrianglesAndLines(str,  attributes = {fill: 'red', stroke: 'black'}, options = {x: 0, y: 0, fontSize: 36, anchor: 'top', attributes: attributes}){
    var D = textToSVG.getD(str, options)
    const properties = new path.svgPathProperties(D);

    // const length = properties.getTotalLength();
    // const point = properties.getPointAtLength(200);
    // const tangent = properties.getTangentAtLength(200);
    // const allProperties = properties.getPropertiesAtLength(200);

    const parts = properties.getParts();
    var lines2 = lu.linesetFlipAlongZ(parts.map(part2Line).filter(lu.lineLength));

    var meshTris = svgMesh2Tris(svgMesh3d(D));
    var meshTrisRemapped = lu.remapTrisToSector(meshTris,lu.boundingBlockOfLines(lines2));

    var linesTris = lu.lines2ConesTriangles(lu.shiftLines(lines2,[0,2,0]), 0.25)

    return {
        tris: meshTrisRemapped,
        lines: lines2,
        linesTris: linesTris
    }
}

module.exports = {renderTextAsTrianglesAndLines};
