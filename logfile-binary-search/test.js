
var {LogfileBinarySearch} = require('./index.js');
var {generateFakeLogFileSync, generateFakeLogFile} = require('./generate-fake-logfile.js');

//sync version:
// Example usage in main function
function mainSync() {
    const logFilePath = './fake_logfile.txt';
    const numberOfEntries = 10000000; // 10 million entries ~ 1.5gb

    // run this first, then run this again with it commented out again
    // console.log('Generating fake log file synchronously...');
    // generateFakeLogFileSync(logFilePath, numberOfEntries);

    const indexer = new LogfileBinarySearch(logFilePath);

    const startDate = new Date('2024-11-18T10:00:00Z');
    const endDate = new Date('2024-11-18T14:00:00Z');

    //idk might be o(log(n)) so its almost constant time
    //1M rows query: 1.354ms [150mb]
    //10M rows query: 5.709ms? [1.5gb]
    //27M rows query: 2ms?? [15gb]

    try {
        console.log('Searching for log entries between', startDate, 'and', endDate);
        console.time('query');
        const lines = indexer.findDateRangeSync(startDate, endDate);
        console.timeEnd('query')
        console.log(`Found ${lines.length} lines.`);
        console.log('First 5 lines:', lines.slice(0, 5));
        console.log('Last 5 lines:', lines.slice(-5));
    } catch (error) {
        console.error('Error:', error.message);
    }
}
mainSync();

//async version:
async function mainAsync() {
    const logFilePath = './fake_logfile.txt';
    const indexer = new LogfileBinarySearch(logFilePath);

    const startDate = new Date('2024-11-18T10:00:00Z');
    const endDate = new Date('2024-11-18T14:00:00Z');

    try {
        console.log('Searching for log entries between', startDate, 'and', endDate);
        console.time('query2');
        //todo add 'max results' param ?
        const lines = indexer.findDateRangeSync(startDate, endDate);
        console.timeEnd('query2')
        console.log(`Found ${lines.length} lines.`);
        console.log('First 5 lines:', lines.slice(0, 5));
        console.log('Last 5 lines:', lines.slice(-5));
    } catch (error) {
        console.error('Error:', error.message);
    }
}
mainAsync().catch(console.error);