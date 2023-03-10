var YggdrasilDecisionForests = require('./ydf/inference.js');

function getYdfPromise(){
    return YggdrasilDecisionForests();
}

var _theServer = null;
module.exports.quickServer = function(folder='./model', port = 1335, destroyAfterMs=1000){
    var http = require('http');
    var finalhandler = require('finalhandler');
    var serveStatic = require('serve-static');
    var serveIndex = require('serve-index');
    var index = serveIndex(folder, {'icons': true});
    var serve = serveStatic(folder);
    var server = http.createServer(function(req, res) {
        var done = finalhandler(req, res);
        serve(req, res, function onNext(err) {
            if (err) return done(err);
            index(req, res, done)
        })
    });
    server.listen(port);

    if(destroyAfterMs){
        setTimeout(function(){
            server.close(function(){});
        },destroyAfterMs);
    }
}

module.exports.getYdfPromise = getYdfPromise;
module.exports.loadModel = function(url, cb, _ydf){
    (_ydf || getYdfPromise()).then(function (m) {
        var ydf = m;
        //console.log("The library is loaded and ready to be used!");
        let model = null;
        ydf.loadModelFromUrl(url).then((loadedModel) => {
            model = loadedModel;
            //console.log("The model is loaded");
            cb(loadedModel);
        });
    });
}
