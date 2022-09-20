var ago = require('s-ago');
var fs = require('fs');
function fileAgeString(file){
    //(new Date().getTime() - new Date(stats.mtime).getTime()) / 1000
    var tdFileStats = fs.statSync(file);
    var secondsAgo = (new Date().getTime() - new Date(tdFileStats.mtime).getTime()) / 1000;
    var tdDataAge = ago(new Date(new Date().getTime()-secondsAgo*1000.0))
    return tdDataAge;
}
module.exports = {fileAgeString}