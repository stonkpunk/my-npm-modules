var word2Vec_wordList = require('./index.js');

word2Vec_wordList.decompress(onDecompressed);

function onDecompressed(){ //takes about 20 seconds to decompress
    console.log(word2Vec_wordList.getWord("cheese")); //this result is instant

    // Float32Array(300) [
    // -0.08591480553150177,  -0.07043947279453278,   0.03762108087539673,
    // 0.13874441385269165,  -0.01687612198293209,   0.06163453683257103,
    // -0.05923318862915039,  -0.04108969122171402,  -0.06030045449733734,
    // 0.05069507285952568,  -0.04215695336461067,   -0.0853811725974083,
    // -0.07577579468488693,  0.034419286996126175,  -0.04429148510098457,
    // ...
    // ]
}