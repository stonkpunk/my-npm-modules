function normalize(data) {
    let n;
    let minValues;
    let maxValues;
    var fields = [];
    var isArray = Array.isArray(data[0]);
    const normalizedData = [];

    if (isArray) {
        n = data[0].length;
        minValues = new Array(n).fill(Number.POSITIVE_INFINITY);
        maxValues = new Array(n).fill(Number.NEGATIVE_INFINITY);

        for (const row of data) {
            for (let i = 0; i < n; i++) {
                minValues[i] = Math.min(minValues[i], row[i]);
                maxValues[i] = Math.max(maxValues[i], row[i]);
            }
        }

        for (const row of data) {
            let normalizedRow;
            normalizedRow = [];
            for (let i = 0; i < n; i++) {
                normalizedRow.push((row[i] - minValues[i]) / (maxValues[i] - minValues[i]));
            }
            normalizedData.push(normalizedRow);
        }
    } else {
        fields = Object.keys(data[0]);
        n = fields.length;
        minValues = new Array(n).fill(Number.POSITIVE_INFINITY);
        maxValues = new Array(n).fill(Number.NEGATIVE_INFINITY);

        for (const row of data) {
            for (let i = 0; i < n; i++) {
                const field = fields[i];
                minValues[i] = Math.min(minValues[i], row[field]);
                maxValues[i] = Math.max(maxValues[i], row[field]);
            }
        }

        for (const row of data) {
            let normalizedRow;

            normalizedRow = {};
            for (let i = 0; i < n; i++) {
                const field = fields[i];
                normalizedRow[field] = (row[field] - minValues[i]) / (maxValues[i] - minValues[i]);
            }

            normalizedData.push(normalizedRow);
        }
    }

    return {
        data:normalizedData,
        minValues,
        maxValues
    };
}

function denormalize(normalizedResult) {
    var {data, minValues, maxValues} = normalizedResult;
    let n = minValues.length;
    let originalData = [];
    var fields = [];
    var isArray = Array.isArray(data[0]);

    if (isArray) {
        for (const row of data) {
            let originalRow;
            originalRow = [];
            for (let i = 0; i < n; i++) {
                originalRow.push(row[i] * (maxValues[i] - minValues[i]) + minValues[i]);
            }
            originalData.push(originalRow);
        }
    }else{
        fields = Object.keys(data[0]);
        for (const row of data) {
            let originalRow;
            originalRow = {};
            for (let i = 0; i < n; i++) {
                const field = fields[i];
                originalRow[field] = row[field] * (maxValues[i] - minValues[i]) + minValues[i];
            }
            originalData.push(originalRow);
        }
    }

    return originalData;
}

module.exports = {normalize, denormalize}
