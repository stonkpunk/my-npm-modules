//https://stackoverflow.com/questions/43566019/how-to-choose-a-weighted-random-array-element-in-javascript
function weighted_random(items, weights, _random=Math.random) {
    var i;

    for (i = 0; i < weights.length; i++)
        weights[i] += weights[i - 1] || 0;

    var random = _random() * weights[weights.length - 1];

    for (i = 0; i < weights.length; i++)
        if (weights[i] > random)
            break;

    return items[i];
}

function Histo(data, numBuckets = 10, dataMin, dataMax){
    var _this = this;
    this.data = data;
    var maxDatum = Math.max(..._this.data);
    var minDatum = Math.min(..._this.data);
    var bandwidth = 0;//(maxDatum - minDatum)/numBuckets/2.0; //todo is this an improvement or not?
    this.dataMax = typeof dataMax === 'undefined' ? maxDatum+bandwidth : dataMax;
    this.dataMin = typeof dataMin === 'undefined' ? minDatum-bandwidth : dataMin;
    this.numBuckets = numBuckets;
    this.buckets = {};
    this.bucketsFreqs = {};
    this.dataRange = (_this.dataMax-_this.dataMin);

    this.datumToBucketId = function(datum){
        var bucketId = Math.floor((datum-_this.dataMin)/_this.dataRange*_this.numBuckets);
        return bucketId;
    }

    this.data.forEach(function(datum){
        var bucketId = _this.datumToBucketId(datum);
        _this.buckets[bucketId] = _this.buckets[bucketId] || 0;
        _this.buckets[bucketId]++;
    })

    //normalize into bucketsFreqs
    for(var bucketId in _this.buckets){
        _this.bucketsFreqs[bucketId] = _this.buckets[bucketId];
        _this.bucketsFreqs[bucketId]/=_this.data.length;
    }

    // this.bucketLabelsLong = new Array(numBuckets).fill(1).map(function(one,i){
    //     var baseNumber = _this.dataMin + i*(_this.dataMax-_this.dataMin)/_this.numBuckets;
    //     var nextNumber = _this.dataMin + (i+1)*(_this.dataMax-_this.dataMin)/_this.numBuckets;
    //     return `n<=${baseNumber}<${nextNumber}`;//_this.dataMin + i*(_this.dataMax-_this.dataMin)/_this.numBuckets;
    // });

    this.bucketLabels = new Array(numBuckets).fill(1).map(function(one,i){
        return _this.dataMin + i*(_this.dataMax-_this.dataMin)/_this.numBuckets;
    });

    this.bucketsLabelled = Object.fromEntries(_this.bucketLabels.map(function(label,i){
       return [label, _this.buckets[i] || 0];
    }));

    this.bucketsFreqsLabelled = Object.fromEntries(_this.bucketLabels.map(function(label,i){
        return [label, _this.bucketsFreqs[i] || 0];
    }));

    this.result = this.bucketsFreqsLabelled;
    this.resultCounts = this.bucketsLabelled;

    this.pdf = function(x){

        //var bucketDist = _this.dataRange / _this.numBuckets;

        if(x<_this.dataMin || x>_this.dataMax){
            return 0;
        }

        var id = _this.datumToBucketId(x);

        return _this.bucketsFreqs[id] || 0;

        // if(!doInterp){
        //     return _this.bucketsFreqs[id] || 0;
        // }

        // var baseNumber = _this.bucketLabels[id] || (_this.dataMin - bucketDist);
        // var nextNumber = _this.bucketLabels[id+1] || (baseNumber + bucketDist);
        //
        // var baseValue = _this.bucketsFreqs[id] || 0;
        // var nextValue = _this.bucketsFreqs[id+1] || 0;
        //
        // var t = (x-baseNumber)/bucketDist;
        //
        // return baseValue + (nextValue-baseValue)*t;
    }

    this.random = function(_random=Math.random){ //return random value with similar histogram to what is recorded here
        var buckets = _this.bucketsLabelled; //[label, weight]
        var bucketDist = _this.dataRange / _this.numBuckets;
        var bucketName = weighted_random(_this.bucketLabels, _this.bucketLabels.map(b=>_this.bucketsFreqsLabelled[b]), _random);
        var val = parseFloat(bucketName)+Math.random()*bucketDist;
        return val;
    }

    function pad(num, size) { //https://stackoverflow.com/questions/2998784/how-to-output-numbers-with-leading-zeros-in-javascript
        var s = "000000000" + num;
        return s.substr(s.length-size);
    }

    this.toString = function(fullWidth=20){
        var str = "";
        for(var level in _this.resultCounts){
            var amt = Math.floor(_this.result[level]*fullWidth);
            str+=`${parseFloat(level).toFixed(4)}: ${new Array(amt).fill("#").join('')}\n`;
        }
        return str;
    }

    return this;
}
module.exports = Histo;