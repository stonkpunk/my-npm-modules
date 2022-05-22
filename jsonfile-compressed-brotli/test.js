var jfc = require('./index.js');

var obj = {"ok":"here is some stuff"};

jfc.writeFileSync("test.json", obj); //note - file extension is ignored
//object is saved as test.jsonpack.7z

var obj_decompressed = jfc.readFileSync("test.json"); //file extension optional
//^^^filename is automatically changed internally, from test.json to to test.jsonpack.7z

console.log(obj_decompressed);

//result:
//{ ok: 'here is some stuff' }

//without jsonpack:

var obj = {"ok":"here is some stuff"};

jfc.writeFileSync("test2.json", obj, false);

var obj_decompressed = jfc.readFileSync("test2.json", false);

console.log(obj_decompressed);

//result:
//{ ok: 'here is some stuff' }

//async:

var obj = {"ok2":"here is some stuff2"};
var jsonPackEnabled=true;

jfc.writeFile("test3.json", obj, jsonPackEnabled,function(err,res){
    jfc.readFile("test3.json", jsonPackEnabled, function(err2,res2){
        console.log("async",res2);
        //result
        //async { ok2: 'here is some stuff2' }
    });
});
