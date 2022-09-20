var jfcb = require('jsonfile-compressed-brotli');
var path = require("path");

module.exports = {
    loadProfiles: function(){
        return jfcb.readFileSync(path.resolve(__dirname, "./COMPANY_PROFILES.json"));
    }
}