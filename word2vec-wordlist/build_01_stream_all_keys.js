//build list of all words in the word2vec leveldb ...

var level = require('level');
var ldb = level('../../../../datasets/word2vec/dbs_googlenews/word2vec_mddf_level_db');

var fullList = [];

//level db stream...
var i=0;

ldb.createReadStream()
  .on('data', function (data) {
      i++;
      fullList.push(data.key);
      if(i%10000==0){
          console.log(data.key,i);
      }
    //console.log(data.key);//, '=', data.value)
  })
  .on('error', function (err) {
    console.log('Oh my!', err)
  })
  .on('close', function () {
    console.log('Stream closed')
  })
  .on('end', function () {
    console.log('Stream ended')
      require('jsonfile').writeFileSync('./ALL_WORDS.json',fullList);
  })

