var {createWriteStream} = require("fs");

function generateFakeLogFile(filePath, numberOfEntries) {
    return new Promise((resolve, reject) => {
        const writeStream = createWriteStream(filePath);
        const startDate = new Date('2023-01-01T00:00:00Z');

        const logLevels = ['INFO', 'WARNING', 'ERROR', 'DEBUG'];
        const services = ['UserService', 'PaymentService', 'NotificationService', 'DatabaseService'];

        for (let i = 0; i < numberOfEntries; i++) {
            const entryDate = new Date(startDate.getTime() + i * 60000); // Add 1 minute per entry
            const logLevel = logLevels[Math.floor(Math.random() * logLevels.length)];
            const service = services[Math.floor(Math.random() * services.length)];

            const logEntry = {
                timestamp: entryDate.toISOString(),
                level: logLevel,
                service: service,
                message: `Log message ${i + 1}`,
                data: {
                    userId: Math.floor(Math.random() * 1000),
                    action: `action_${Math.floor(Math.random() * 10)}`
                }
            };

            writeStream.write(JSON.stringify(logEntry) + '\n');
        }

        writeStream.end();
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
    });
}

function generateFakeLogFileSync(filePath, numberOfEntries) {
    const writeStream = createWriteStream(filePath);
    const startDate = new Date('2023-01-01T00:00:00Z');

    const logLevels = ['INFO', 'WARNING', 'ERROR', 'DEBUG'];
    const services = ['UserService', 'PaymentService', 'NotificationService', 'DatabaseService'];

    for (let i = 0; i < numberOfEntries; i++) {
        if(i%1000000==0){console.log(`fake row ${i}`);}
        const entryDate = new Date(startDate.getTime() + i * 60000); // Add 1 minute per entry
        const logLevel = logLevels[Math.floor(Math.random() * logLevels.length)];
        const service = services[Math.floor(Math.random() * services.length)];

        const logEntry = {
            timestamp: entryDate.toISOString(),
            level: logLevel,
            service: service,
            message: `Log message ${i + 1}`,
            data: {
                userId: Math.floor(Math.random() * 1000),
                action: `action_${Math.floor(Math.random() * 10)}`
            }
        };

        writeStream.write(JSON.stringify(logEntry) + '\n');
    }

    writeStream.end();

    // Wait for the stream to finish
    writeStream.on('finish', () => {
        console.log('Fake log file generated synchronously.');
    });
}

module.exports = {
    generateFakeLogFileSync, generateFakeLogFile
}