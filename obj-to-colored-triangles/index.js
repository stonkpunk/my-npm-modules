var OBJFile = require('obj-file-parser');
var fs = require('fs');
var ri = require("readimage");
var deasync = require("deasync");

var obj2ColoredTrianglesSync = deasync(obj2ColoredTriangles);

function obj2ColoredTriangles(TEXTURE_FILE_NAME, OBJ_FILE_NAME, SMOOTH_COLORS=false, _onGotResult){
    fs.readFile(TEXTURE_FILE_NAME,function(err,data){
        ri(data, function(_err,_data){
            var res = {data: _data.frames[0].data, width: _data.width, height: _data.height};
            onGotImgData(OBJ_FILE_NAME, res, SMOOTH_COLORS, _onGotResult);
        });
    })
}

function onGotImgData(OBJ_FILE_NAME, texture_res, SMOOTH_COLORS=false, cb){
    var image = texture_res;
    var imagePixels = image.data; //{data, width, height}

    fs.readFile(OBJ_FILE_NAME,'utf8', function(err,fileContentsObj){

        const objFile = new OBJFile(fileContentsObj);
        const outputObj = objFile.parse(); // see description below

        function convertUv(uv){return [uv.u,uv.v];}

        var meshes = outputObj.models.map(function(model){
            var res = {
                //uv_indices: model.faces.map(f=>[f.vertices[0].textureCoordsIndex,f.vertices[1].textureCoordsIndex,f.vertices[2].textureCoordsIndex]),
                cells_uvs:  model.faces.map(function(f){
                    return [
                        convertUv(model.textureCoords[f.vertices[0].textureCoordsIndex-1]), //note that indices uses by this lib are start on 1 not zero!
                        convertUv(model.textureCoords[f.vertices[1].textureCoordsIndex-1]),
                        convertUv(model.textureCoords[f.vertices[2].textureCoordsIndex-1])
                    ]
                }),
                cells: model.faces.map(function(f){
                    return [
                        f.vertices[0].vertexIndex-1,
                        f.vertices[1].vertexIndex-1,
                        f.vertices[2].vertexIndex-1
                    ]}),
                positions: model.vertices.map(v=>[v.x,v.y,v.z]),
                tris: model.faces.map(function(f){
                    return [
                        model.vertices[f.vertices[0].vertexIndex-1],
                        model.vertices[f.vertices[1].vertexIndex-1],
                        model.vertices[f.vertices[2].vertexIndex-1]
                    ].map(v=>[v.x,v.y,v.z])})
            };

            res.cellFlatColors = [];
            res.cellVertsColors = res.cells_uvs.map(function(uvs_for_cell){
                var uv0 = uvs_for_cell[0];
                var uv1 = uvs_for_cell[1];
                var uv2 = uvs_for_cell[2];
                var c0 = sampleTexture(imagePixels,image.width,image.height, uv0[0], 1.0-uv0[1]);
                var c1 = sampleTexture(imagePixels,image.width,image.height, uv1[0], 1.0-uv1[1]);
                var c2 = sampleTexture(imagePixels,image.width,image.height, uv2[0], 1.0-uv2[1]);

                var averageUv = averagePts3_2d(uv0,uv1,uv2);
                var centerColor = sampleTexture(imagePixels,image.width,image.height, averageUv[0], 1.0-averageUv[1]);
                var averageColors = averagePts3(c0,c1,c2);

                res.cellFlatColors.push(SMOOTH_COLORS ? centerColor : averageColors);
                return [c0,c1,c2]
            });

            return res;
        });

        if(cb){
            cb(null,meshes);
        }
    });
}

function sampleTexture(texBuffer, texWidth, texHeight, u, v){
    var x = Math.floor(u*texWidth);
    var y = Math.floor(v*texHeight);
    var o = 4*(texWidth*y+x);
    return [
        texBuffer[o], texBuffer[o+1], texBuffer[o+2]
    ]
}

function averagePts3(p0, p1, p2){
    return [(p0[0]+p1[0]+p2[0])/3, (p0[1]+p1[1]+p2[1])/3, (p0[2]+p1[2]+p2[2])/3].map(Math.floor);
}

function averagePts3_2d(p0, p1, p2){
    return [(p0[0]+p1[0]+p2[0])/3, (p0[1]+p1[1]+p2[1])/3];
}

var rt = require('./rescale-tris.js');
var ti = require('triangles-index');

function getJsonModel(coloredTrianglesResultObj, rescaleSize = 10, FLOAT_DIGITS=3, doIncludeFlatColors = true, doIncludeVertColors=false){
    var res = coloredTrianglesResultObj;
    var TRIS = rt.rescaleTrisForLargestDimSize(res.tris, rescaleSize); //rescale model so largest dimension is q0
    var cellFlatColors = res.cellFlatColors;
    var cellVertsColors = res.cellVertsColors;

    function reduceFloat(f){return parseFloat(f.toFixed(FLOAT_DIGITS))}
    function reduceFloatsPt(pt){return pt.map(reduceFloat)}
    function reduceFloatsTri(tri){return tri.map(reduceFloatsPt)}

    var output = {
        meshIndexed: ti.indexTriangles_meshView(TRIS.map(reduceFloatsTri)),
    }

    if(doIncludeFlatColors){
        output.flatColors = cellFlatColors
    }
    if(doIncludeVertColors){
        output.vertColors = cellVertsColors
    }

    return output;
}

module.exports = {obj2ColoredTriangles, obj2ColoredTrianglesSync, getJsonModel, rescaleTris: require('./rescale-tris.js') };