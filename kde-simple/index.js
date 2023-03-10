function kernelDensityEstimate(data, point, bandwidth, useTriangular, range){//, normalizedKernel=true) {
    var density = 0;
    var n = data.length;
    var kernel;

    // if(normalizedKernel){
    kernel = useTriangular ? triangularKernel : gaussianKernel;
    // }else{
    //     kernel = useTriangular ? triangularKernel1 : gaussianKernel1;
    // }
    var totalWeight = 0;
    for (var i = 0; i < n; i++) {
        var w = 1.0;
        if (typeof data[i].weight !== 'undefined') {
            w = data[i].weight;
        }
        density += w*kernel((point - data[i].x) / bandwidth);
        totalWeight+=bandwidth*w;
    }

    var v = density / totalWeight;

    if(range){
        return (v-range[0])/(range[1]-range[0]);
    }

    return v;
}

function getRange(data, bandwidth, useTriangular){
    var min = 0;
    var max = 0;
    data.forEach(function(p){
        var v = kernelDensityEstimate(data, p.x, bandwidth, useTriangular);
        min=Math.min(v,min);
        max=Math.max(v,max);
    });
    return [min,max];
}

function gaussianKernel(x) {
    return (1.0 / Math.sqrt(2.0 * Math.PI)) * Math.exp(-0.5 * x * x);
}

function triangularKernel(x) {
    var _x = Math.max(Math.min(x,1.0),-1);
    return (1.0 - Math.abs(_x));
}

module.exports = {getRange, gaussianKernel, triangularKernel, kernelDensityEstimate}