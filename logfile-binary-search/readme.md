# logfile-binary-search

Efficiently search and extract date-ranged entries from large log files using binary search.

## How It Works

The `LogfileBinarySearch` class employs a binary search algorithm to quickly locate and extract log entries within a specified date range, even in very large log files. Here's how it works:

1. **Minimal Assumptions**: The class makes no assumptions about the file content or structure, except that each line contains a timestamp. The content of the log entries can vary, making it flexible for different log formats.

2. **Configurable Timestamp Pattern**: The timestamp pattern is defined by the `dateRegex` property, which can be customized to match various date formats. By default, it's set to match ISO 8601 timestamps, but you can modify it to work with any timestamp format.

3. **Binary Search**: Instead of reading the entire file sequentially, the algorithm performs a binary search to quickly narrow down the relevant portion of the file.

4. **Chunked Reading**: The file is read in chunks to minimize memory usage while maintaining performance.

5. **Date Extraction**: The class extracts dates from log entries using the specified regular expression, allowing it to work with the timestamp format in your logs.

6. **Range Identification**: Once the start and end positions are found, the class extracts all log entries within the specified date range.

This approach allows for efficient searching in large log files, with time complexity closer to O(log n) rather than O(n) for a linear search, while remaining flexible enough to work with various log formats.

## Installation

```bash
npm install logfile-binary-search
```

## Features

- Fast binary search for date ranges in large log files
- Flexible: works with any log format as long as it contains timestamps
- Configurable timestamp pattern via `dateRegex`
- Supports both synchronous and asynchronous operations
- Estimates row count and file statistics
- Finds first and last dates in the log file
- Configurable chunk size and maximum results

## Usage

```javascript
const {LogfileBinarySearch} = require('MY_NPM_MODULES/stonkpunk/logfile-binary-search/index');

const filePath = 'path/to/your/logfile.log';
const searcher = new LogfileBinarySearch(filePath);

// Optionally, configure the timestamp pattern
// searcher.dateRegex = /your-custom-timestamp-pattern/;

// Asynchronous usage
async function searchLogs() {
    const startDate = new Date('2023-01-01T00:00:00Z');
    const endDate = new Date('2023-01-31T23:59:59Z');

    const results = await searcher.findDateRange(startDate, endDate);
    console.log(results);
}

searchLogs();

// Synchronous usage
const results = searcher.findDateRangeSync(startDate, endDate);
console.log(results);
```

## API

### Constructor

```javascript
new LogfileBinarySearch(filePath, maxResults = 9999, chunkSize = 2000)
```

- `filePath`: Path to the log file
- `maxResults`: Maximum number of results to return (default: 9999)
- `chunkSize`: Size of chunks to read from the file (default: 2000 bytes)

### Properties

- `dateRegex`: Regular expression used to match timestamps in log entries. Can be customized to match different timestamp formats.

### Methods

#### Asynchronous Methods

- `estimateRowCountAsync(nChunksToSample = 100)`: Estimates the number of rows in the file
- `findFirstAndLastDates()`: Finds the first and last dates in the log file
- `findDateRange(startDate, endDate)`: Searches for log entries within the specified date range

#### Synchronous Methods

- `estimateRowCountSync(nChunksToSample = 100)`: Synchronous version of `estimateRowCountAsync`
- `findFirstAndLastDatesSync()`: Synchronous version of `findFirstAndLastDates`
- `findDateRangeSync(startDate, endDate)`: Synchronous version of `findDateRange`

## License

MIT

[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)