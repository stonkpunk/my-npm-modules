# yggdrasil-inference-stopgap

unofficial hack to run inference from pre-trained [yggdrasil decision forests](https://ydf.readthedocs.io/en/latest/index.html) models in node.js

based on the yggdrasil [javascript browser example](https://ydf.readthedocs.io/en/latest/js_serving.html)

to use this, first make a .zip of a yggdrasil model as described in the [example](https://ydf.readthedocs.io/en/latest/js_serving.html#usage-example)

then serve the model from a URL to run the inference like below.

includes `jszip` with small modifications to make the demo run in node instead of browser.

Known issue: `inference.js` does not work with models containing `CATEGORICAL_SET` -- javascript cannot produce the `vector<string>` needed by the code -- issue is similar to [this](https://github.com/emscripten-core/emscripten/issues/6905) or [this](https://github.com/emscripten-core/emscripten/issues/8933)

## Installation

```sh
npm i yggdrasil-inference-stopgap
```

## Usage 

node version of the [official web demo](https://achoum.github.io/yggdrasil_decision_forests_js_example/example.html) with identical results

```javascript
var ydf = require('yggdrasil-inference-stopgap');

//can make a little http file server for convenience 
ydf.quickServer('./model',1335,1000); //serve './model' directory on localhost port 1335. kill the server after 1000ms to avoid having the process stay running. use 0 to leave the server running.

// using model.zip is identical to online example
// https://achoum.github.io/yggdrasil_decision_forests_js_example/example.html
// https://achoum.github.io/yggdrasil_decision_forests_js_example/model.zip

ydf.loadModel("http://localhost:1335/model.zip", function(model, _ydf){

    var examples = {
        "age":[39,40,40,35],
        "workclass":["State-gov","Private","Private","Federal-gov"],
        "fnlwgt":[77516,121772,193524,76845],
        "education":["Bachelors","Assoc-voc","Doctorate","9th"],
        "education_num":["13","11","16","5"],
        "marital_status":["Never-married","Married-civ-spouse","Married-civ-spouse","Married-civ-spouse"],
        "occupation":["Adm-clerical","Craft-repair","Prof-specialty","Farming-fishing"],
        "relationship":["Not-in-family","Husband","Husband","Husband"],
        "race":["White","Asian-Pac-Islander","White","Black"],
        "sex":["Male","Male","Male","Male"],
        "capital_gain":[2174,0,0,0],
        "capital_loss":[0,0,0,0],
        "hours_per_week":[40,40,60,40],
        "native_country":["United-States","","United-States","United-States"]
    }  ;

    let predictions = model.predict(examples);

    console.log("predictions",predictions);

    // predictions [
    //         0.012130673043429852,
    //         0.3310021460056305,
    //         0.7801117300987244,
    //         0.11152036488056183
    //     ]

    console.log("input features", model.getInputFeatures())

    // input features [
    //     { name: 'age', type: 'NUMERICAL', internalIdx: 0 },
    //         { name: 'workclass', type: 'CATEGORICAL', internalIdx: 1 },
    //         { name: 'fnlwgt', type: 'NUMERICAL', internalIdx: 2 },
    //         { name: 'education', type: 'CATEGORICAL', internalIdx: 3 },
    //         { name: 'education_num', type: 'CATEGORICAL', internalIdx: 4 },
    //         { name: 'marital_status', type: 'CATEGORICAL', internalIdx: 5 },
    //         { name: 'occupation', type: 'CATEGORICAL', internalIdx: 6 },
    //         { name: 'relationship', type: 'CATEGORICAL', internalIdx: 7 },
    //         { name: 'race', type: 'CATEGORICAL', internalIdx: 8 },
    //         { name: 'sex', type: 'CATEGORICAL', internalIdx: 9 },
    //         { name: 'capital_gain', type: 'NUMERICAL', internalIdx: 10 },
    //         { name: 'capital_loss', type: 'NUMERICAL', internalIdx: 11 },
    //         { name: 'hours_per_week', type: 'NUMERICAL', internalIdx: 12 },
    //         { name: 'native_country', type: 'CATEGORICAL', internalIdx: 13 }
    //     ]

    // after we are done w the model...
    model.unload();
    model = null;
}/*, _existingYdf*/)

//can pre-load ydf library with ydf.getYdfPromise().then(f(ydf))
```

quickServer src:
```javascript
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
```

[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)

