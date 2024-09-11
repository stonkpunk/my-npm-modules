const fs = require('fs').promises;
const fsSync = require('fs');
const { createReadStream, createWriteStream } = require('fs');

class Index {
    constructor(filePath, maxResults = 9999, chunkSize = 2000) {
        this.filePath = filePath;
        this.fileSize = null;
        this.dateRegex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})/g;
        this.chunkSize = chunkSize;
        this.maxBufferSize = 100 * 1024 * 1024; // 100MB in bytes
        this.maxResults = maxResults;
    }

    initialize() {
        const stats = fsSync.statSync(this.filePath);
        this.fileSize = stats.size;
    }

    estimateRowCountSync(nChunksToSample=100) {
        this.initialize();
        const chunk = this.readChunkSync(0, Math.min(this.fileSize, this.chunkSize*nChunksToSample));
        const lines = this.findCompleteLines(chunk);

        const sampleLines = lines;
        const totalSampleLength = sampleLines.reduce((sum, line) => sum + line.length + 1, 0); // +1 for newline character
        const averageRowLength = totalSampleLength / sampleLines.length;

        const [shortestRowLength, longestRowLength] = sampleLines.reduce(
            ([minLen, maxLen], line) => [
                Math.min(minLen, line.length),
                Math.max(maxLen, line.length)
            ],
            [Infinity, 0]
        );

        const estimatedRowCount = Math.floor(this.fileSize / averageRowLength);

        return {
            estimatedRowCount,
            averageRowLength,
            shortestRowLength,
            longestRowLength,
            sampleSizeRows: sampleLines.length
        };
    }

    async estimateRowCountAsync(nChunksToSample = 100) {
        await this.initialize();
        const chunk = await this.readChunk(0, Math.min(this.fileSize, this.chunkSize*nChunksToSample));
        const lines = this.findCompleteLines(chunk);

        const sampleLines = lines;
        const totalSampleLength = sampleLines.reduce((sum, line) => sum + line.length + 1, 0); // +1 for newline character
        const averageRowLength = totalSampleLength / sampleLines.length;

        const [shortestRowLength, longestRowLength] = sampleLines.reduce(
            ([minLen, maxLen], line) => [
                Math.min(minLen, line.length),
                Math.max(maxLen, line.length)
            ],
            [Infinity, 0]
        );

        const estimatedRowCount = Math.floor(this.fileSize / averageRowLength);

        return {
            estimatedRowCount,
            averageRowLength,
            shortestRowLength,
            longestRowLength,
            sampleSizeRows: sampleLines.length
        };
    }

    readChunkSync(start, end) {
        const fd = fsSync.openSync(this.filePath, 'r');
        try {
            const totalSize = end - start;
            const chunks = [];
            let bytesRead = 0;

            while (bytesRead < totalSize) {
                const remainingBytes = totalSize - bytesRead;
                const bufferSize = Math.min(remainingBytes, this.maxBufferSize);
                const buffer = Buffer.alloc(bufferSize);
                fsSync.readSync(fd, buffer, 0, bufferSize, start + bytesRead);
                chunks.push(buffer);
                bytesRead += bufferSize;
            }

            return Buffer.concat(chunks).toString('utf8');
        } finally {
            fsSync.closeSync(fd);
        }
    }

    binarySearchSync(targetDate, start, end, isEndDate = false) {
        if (start > end) return -1;

        const mid = Math.floor((start + end) / 2);
        const chunk = this.readChunkSync(Math.max(0, mid - this.chunkSize), Math.min(this.fileSize, mid + this.chunkSize));
        const lines = this.findCompleteLines(chunk);

        if (lines.length === 0) return -1;

        const midLine = lines[Math.floor(lines.length / 2)];
        const date = this.extractEarliestDate(midLine);
        if (!date) return -1;

        if (isEndDate) {
            if (date > targetDate) return this.binarySearchSync(targetDate, start, mid - 1, isEndDate);
            if (date <= targetDate && (mid === end || this.extractEarliestDate(lines[Math.floor(lines.length / 2) + 1]) > targetDate)) {
                return mid;
            }
            return this.binarySearchSync(targetDate, mid + 1, end, isEndDate);
        } else {
            if (date < targetDate) return this.binarySearchSync(targetDate, mid + 1, end, isEndDate);
            if (date >= targetDate && (mid === start || this.extractEarliestDate(lines[Math.floor(lines.length / 2) - 1]) < targetDate)) {
                return mid;
            }
            return this.binarySearchSync(targetDate, start, mid - 1, isEndDate);
        }
    }

    findDateRangeSync(startDate, endDate) {
        this.initialize();
        const startPosition = this.binarySearchSync(startDate, 0, this.fileSize);
        const endPosition = this.binarySearchSync(endDate, 0, this.fileSize, true);

        if (startPosition === -1 || endPosition === -1) {
            throw new Error('Unable to find specified date range');
        }

        return this.extractLinesSync(startPosition, endPosition, startDate, endDate);
    }

    extractLinesSync(start, end, startDate, endDate) {
        const totalSize = end - start + this.chunkSize;
        const chunks = [];
        let bytesRead = 0;
        const fd = fsSync.openSync(this.filePath, 'r');
        const results = [];

        try {
            while (bytesRead < totalSize && results.length < this.maxResults) {
                const remainingBytes = totalSize - bytesRead;
                const bufferSize = Math.min(remainingBytes, this.maxBufferSize);
                const buffer = Buffer.alloc(bufferSize);
                fsSync.readSync(fd, buffer, 0, bufferSize, start + bytesRead);
                chunks.push(buffer);
                bytesRead += bufferSize;

                const content = buffer.toString('utf8');
                const lines = this.findCompleteLines(content);

                for (const line of lines) {
                    const date = this.extractEarliestDate(line);
                    if (date >= startDate && date <= endDate) {
                        results.push(line);
                        if (results.length >= this.maxResults) {
                            break;
                        }
                    }
                }
            }
        } finally {
            fsSync.closeSync(fd);
        }

        return results;
    }

    findFirstAndLastDatesSync() {
        this.initialize();
        let firstDate = null;
        let lastDate = null;

        // Find first date
        let start = 0;
        while (!firstDate && start < this.fileSize) {
            const chunk = this.readChunkSync(start, Math.min(start + this.chunkSize, this.fileSize));
            const lines = this.findCompleteLines(chunk);
            for (const line of lines) {
                const date = this.extractEarliestDate(line);
                if (date) {
                    firstDate = date;
                    break;
                }
            }
            start += this.chunkSize;
        }

        // Find last date
        let end = this.fileSize;
        while (!lastDate && end > 0) {
            const chunk = this.readChunkSync(Math.max(0, end - this.chunkSize), end);
            const lines = this.findCompleteLines(chunk);
            for (let i = lines.length - 1; i >= 0; i--) {
                const date = this.extractEarliestDate(lines[i]);
                if (date) {
                    lastDate = date;
                    break;
                }
            }
            end -= this.chunkSize;
        }

        return { firstDate, lastDate };
    }

    async findFirstAndLastDates() {
        await this.initialize();
        let firstDate = null;
        let lastDate = null;

        // Find first date
        let start = 0;
        while (!firstDate && start < this.fileSize) {
            const chunk = await this.readChunk(start, Math.min(start + this.chunkSize, this.fileSize));
            const lines = this.findCompleteLines(chunk);
            for (const line of lines) {
                const date = this.extractEarliestDate(line);
                if (date) {
                    firstDate = date;
                    break;
                }
            }
            start += this.chunkSize;
        }

        // Find last date
        let end = this.fileSize;
        while (!lastDate && end > 0) {
            const chunk = await this.readChunk(Math.max(0, end - this.chunkSize), end);
            const lines = this.findCompleteLines(chunk);
            for (let i = lines.length - 1; i >= 0; i--) {
                const date = this.extractEarliestDate(lines[i]);
                if (date) {
                    lastDate = date;
                    break;
                }
            }
            end -= this.chunkSize;
        }

        return { firstDate, lastDate };
    }

    async readChunk(start, end) {
        const fileHandle = await fs.open(this.filePath, 'r');
        try {
            const totalSize = end - start;
            const chunks = [];
            let bytesRead = 0;

            while (bytesRead < totalSize) {
                const remainingBytes = totalSize - bytesRead;
                const bufferSize = Math.min(remainingBytes, this.maxBufferSize);
                const buffer = Buffer.alloc(bufferSize);
                await fileHandle.read(buffer, 0, bufferSize, start + bytesRead);
                chunks.push(buffer);
                bytesRead += bufferSize;
            }

            return Buffer.concat(chunks).toString('utf8');
        } finally {
            await fileHandle.close();
        }
    }

    findCompleteLines(chunk) {
        const lines = chunk.split('\n');
        // Remove potentially incomplete lines at the start and end
        if (!chunk.startsWith('\n')) lines.shift();
        if (!chunk.endsWith('\n')) lines.pop();
        return lines;
    }

    extractEarliestDate(jsonString) {
        if(!jsonString) return null;
        try {
            const dates = jsonString.match(this.dateRegex);
            if (!dates) return null;
            return new Date(dates.sort()[0]);
        } catch (error) {
            console.error('Error parsing JSON or extracting date:', error);
            return null;
        }
    }

    async binarySearch(targetDate, start, end, isEndDate = false) {
        if (start > end) return -1;

        const mid = Math.floor((start + end) / 2);
        const chunk = await this.readChunk(Math.max(0, mid - this.chunkSize), Math.min(this.fileSize, mid + this.chunkSize));
        const lines = this.findCompleteLines(chunk);

        if (lines.length === 0) return -1;

        const midLine = lines[Math.floor(lines.length / 2)];
        const date = this.extractEarliestDate(midLine);
        if (!date) return -1;

        if (isEndDate) {
            if (date > targetDate) return this.binarySearch(targetDate, start, mid - 1, isEndDate);
            if (date <= targetDate && (mid === end || this.extractEarliestDate(lines[Math.floor(lines.length / 2) + 1]) > targetDate)) {
                return mid;
            }
            return this.binarySearch(targetDate, mid + 1, end, isEndDate);
        } else {
            if (date < targetDate) return this.binarySearch(targetDate, mid + 1, end, isEndDate);
            if (date >= targetDate && (mid === start || this.extractEarliestDate(lines[Math.floor(lines.length / 2) - 1]) < targetDate)) {
                return mid;
            }
            return this.binarySearch(targetDate, start, mid - 1, isEndDate);
        }
    }

    async findDateRange(startDate, endDate) {
        await this.initialize();

        const startPosition = await this.binarySearch(startDate, 0, this.fileSize);
        const endPosition = await this.binarySearch(endDate, 0, this.fileSize, true);

        if (startPosition === -1 || endPosition === -1) {
            throw new Error('Unable to find specified date range');
        }

        return this.extractLines(startPosition, endPosition, startDate, endDate);
    }

    async extractLines(start, end, startDate, endDate) {
        const totalSize = end - start + this.chunkSize;
        const chunks = [];
        let bytesRead = 0;
        const fileHandle = await fs.open(this.filePath, 'r');
        const results = [];

        try {
            while (bytesRead < totalSize && results.length < this.maxResults) {
                const remainingBytes = totalSize - bytesRead;
                const bufferSize = Math.min(remainingBytes, this.maxBufferSize);
                const buffer = Buffer.alloc(bufferSize);
                await fileHandle.read(buffer, 0, bufferSize, start + bytesRead);
                chunks.push(buffer);
                bytesRead += bufferSize;

                const content = buffer.toString('utf8');
                const lines = this.findCompleteLines(content);

                for (const line of lines) {
                    const date = this.extractEarliestDate(line);
                    if (date >= startDate && date <= endDate) {
                        results.push(line);
                        if (results.length >= this.maxResults) {
                            break;
                        }
                    }
                }
            }
        } finally {
            await fileHandle.close();
        }

        return results;
    }
}

module.exports = { LogfileBinarySearch: Index };