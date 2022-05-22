var TEX = '/Users/user/Documents/datasets/models3d/uploads_files_719569_Satsuki-Bonsai-Collection_OBJ/Ficus Carica_OBJ/Ficus-Carica-Texture-8k.jpg';
var OBJ = '/Users/user/Documents/datasets/models3d/uploads_files_719569_Satsuki-Bonsai-Collection_OBJ/Ficus Carica_OBJ/Ficus-Carica.OBJ';
var SMOOTH_COLORS = false;
var res = require('./index.js').obj2ColoredTrianglesSync(TEX,OBJ, SMOOTH_COLORS)[0];
var output = require('./index.js').getJsonModel(res)

//original obj 5MB + 349kb texture
//brotli without jsonpack takes 6-7 seconds - result 611kb
var t0=Date.now()
require('jsonfile-compressed-brotli').writeFileSync('./Ficus-Carica.json', output);
console.log('done',((Date.now()-t0)/1000),"sec");
