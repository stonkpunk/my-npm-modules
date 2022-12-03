var path = require('path');

module.exports = {
    entry: {
        wcf: './index.js'
    },
    output: {
        path: __dirname,
        filename: "[name].js",
        library: "wcf",
        libraryTarget: "umd"
    },
    module: {
        loaders: [
            {
                test: /.*\.js$/,
                loader: 'babel'
            }
        ]
    }
};
