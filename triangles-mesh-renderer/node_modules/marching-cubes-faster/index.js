var bmbb = require('./buildMeshForBb.js');
var dfb = require('./df-builder.js');

module.exports = {
    dfBuilder: dfb,
    meshBuilder: bmbb
}

//TODO add intersection op by intersecting the affected bounding boxes within the rtree after add