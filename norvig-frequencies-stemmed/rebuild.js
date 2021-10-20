var fs = require('fs');
var stemmer = require('stemmer');
var dataSet = fs.readFileSync('./norvig_count_1w.txt','utf8'); //https://norvig.com/ngrams/count_1w.txt

//total word count for the dataset is 588124220187

var stemmedWordObj = {};

var words = dataSet.split('\n').map(function(row){
    var parts = row.split('\t');
    var stemmedWord = stemmer(parts[0]);
    var res = null;
    if(!stemmedWordObj[stemmedWord]){
        res = [stemmedWord, parseFloat((parseInt(parts[1])/588124220187.0).toFixed(7))];
        //total+=res[1];
        stemmedWordObj[stemmedWord] = res;
    }else{
        stemmedWordObj[stemmedWord][1]+=parseInt(parts[1])/588124220187.0; //add the frequency
        stemmedWordObj[stemmedWord][1] = parseFloat(stemmedWordObj[stemmedWord][1].toFixed(7));//reformat
    }

    return res;
}).filter(i=>i && i[0]);

//const reducer = (accumulator, currentValue) => accumulator + currentValue[1];
//var wordTotal = words.reduce(reducer,0)

//console.log(words.slice(0,5),wordTotal)

//console.log(Object.keys(stemmedWordObj).length, words.length); //263327 333333, ratio 0.78998178998179

var theArr = Object.entries(stemmedWordObj)
    .sort(function(a,b){return b[1]-a[1]})
    .map(i=>i[1]).slice(0,40000);

var theObj = {};

theArr.forEach(function(item){
    theObj[item[0]]=item[1];
})

fs.writeFileSync('norvig-frequencies-stemmed.js',
    "module.exports="+JSON.stringify(theObj) + ";"
);

//jfc.writeFileSync('norvig-frequencies', words,false);

//word total = 588124220187


