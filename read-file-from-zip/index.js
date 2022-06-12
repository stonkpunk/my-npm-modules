//https://stackoverflow.com/questions/39705209/node-js-read-a-file-in-a-zip-without-unzipping-it
var StreamZip = require("node-stream-zip");
var deasync = require("deasync");

function readFileFromZip(zipname, filename, cb){
    const zip = new StreamZip({
        file: zipname,
        storeEntries: true
    });
    zip.on('ready', () => {
        if(!filename){
            var files = [];
            for (const entry of Object.values(zip.entries())) {
                const desc = entry.isDirectory ? 'directory' : `${entry.size} bytes`;
                files.push([entry.name, desc]);
            }
            zip.close()
            cb(null,files);
            return;
        }
        let zipDotTxtContents = zip.entryDataSync(filename).toString('utf8');
        zip.close()
        cb(null, zipDotTxtContents);
    });
}

var readFileFromZipSync = deasync(readFileFromZip);

module.exports = {readFileFromZip, readFileFromZipSync}
