var data = [];
for(var i=0;i<100000;i++){
    data.push(Math.random());
}

var SimpleHisto = require('./index.js');

//you can override min/max, otherwise it will auto-range to the values in the input array
//SimpleHisto([data], numberBuckets=10, min=auto, max=auto)
var sh = SimpleHisto(data);

console.log(sh.result);

// {
//     '0.00014417416554568518': 0.1002,
//     '0.10011602789876432': 0.1015,
//     '0.20008788163198296': 0.1015,
//     '0.3000597353652016': 0.1006,
//     '0.40003158909842024': 0.1043,
//     '0.5000034428316389': 0.0977,
//     '0.5999752965648575': 0.0976,
//     '0.6999471502980762': 0.0997,
//     '0.7999190040312948': 0.1017,
//     '0.8998908577645134': 0.0951
// }

console.log(sh.resultCounts);

// {
//     '0.0000809159023666961': 1038,
//     '0.10006868510259237': 1000,
//     '0.20005645430281804': 946,
//     '0.3000442235030437': 968,
//     '0.4000319927032694': 997,
//     '0.5000197619034951': 1026,
//     '0.6000075311037207': 996,
//     '0.6999953003039464': 1011,
//     '0.7999830695041721': 1024,
//     '0.8999708387043976': 993
// }

//generate random number with similar distribution to this histogram
//sh.random(randomFunc=Math.random);
//console.log(sh.random());

//get pdf(x) for this histogram [qunatized to the buckets, no interpolation]
console.log(sh.pdf(-0.05)); //0.0
console.log(sh.pdf(0.5)); //0.10093
console.log(sh.pdf(1.05)); //0.0

// all fields...
// sh.data = data;
// sh.dataMax = Math.max(...sh.data);
// sh.dataMin = Math.min(...sh.data);
// sh.numBuckets = numBuckets;
// sh.buckets = {}; //for internal use, indexed 0...n, absolute counts
// sh.bucketsFreqs = {}; //for internal use, indexed 0...n, normalized
// sh.dataRange = (sh.dataMax-sh.dataMin);
// sh.bucketLabels = ['field names from bucketsLabelled']
// sh.bucketsLabelled = { '0.00006862812315966416': 123 ... } //absolute counts
// sh.bucketsFreqsLabelled = { '0.00006862812315966416': 0.1001 ... } //normalized frequencies
// sh.result = sh.bucketsFreqsLabelled //just an alias
// sh.resultCounts = sh.bucketsLabelled //just an alias

console.log(sh.toString())

// 0.0000: ##
// 0.1000: ##
// 0.2000: ##
// 0.3000: #
// 0.4000: #
// 0.5000: #
// 0.6000: #
// 0.7000: ##
// 0.8000: #
// 0.9000: ##
