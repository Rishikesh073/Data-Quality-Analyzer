const { detectDataType } = require('../utils/helpers');

const generateProfile = (data) => {
    const rows = data.length;
    if (rows === 0) return { rows: 0, columns: 0, missing_per_column: {}, duplicates: 0, dtypes: {} };

    const sampleRow = data[0];
    const columnsArr = Object.keys(sampleRow);
    const columns = columnsArr.length;

    const missing_per_column = {};
    const dtypes = {};

    columnsArr.forEach(col => {
        missing_per_column[col] = 0;
        dtypes[col] = 'unknown';
    });

    const stringifiedRows = new Set();
    let duplicates = 0;

    const typeCounts = {};
    const histograms = {}; // Will hold distributions for numeric columns
    
    columnsArr.forEach(col => {
        typeCounts[col] = { number: 0, string: 0, boolean: 0, date: 0 };
    });

    data.forEach(row => {
        // Check for duplicates
        const rowString = JSON.stringify(row);
        if (stringifiedRows.has(rowString)) {
            duplicates++;
        } else {
            stringifiedRows.add(rowString);
        }

        // Process columns
        columnsArr.forEach(col => {
            const val = row[col];
            
            // Check missing
            if (val === null || val === undefined || String(val).trim() === '') {
                missing_per_column[col]++;
            } else {
                // Determine type
                const type = detectDataType(val);
                if (typeCounts[col][type] !== undefined) {
                    typeCounts[col][type]++;
                }
            }
        });
    });

    // Finalize data types
    columnsArr.forEach(col => {
        const counts = typeCounts[col];
        const validValues = rows - missing_per_column[col];
        if (validValues > 0) {
            let dominantType = 'string';
            let maxCount = 0;
            for (const [type, count] of Object.entries(counts)) {
                if (count > maxCount) {
                    maxCount = count;
                    dominantType = type;
                }
            }
            dtypes[col] = dominantType;
        } else {
            dtypes[col] = 'mixed/empty';
        }
    });

    // Generate histograms for fully numeric columns
    columnsArr.forEach(col => {
        if (dtypes[col] === 'number') {
            // Get all valid numeric values for this column
            const values = data.map(row => Number(row[col])).filter(v => !isNaN(v));
            if (values.length > 0) {
                const min = Math.min(...values);
                const max = Math.max(...values);
                const binCount = 10;
                const binSize = (max - min) / binCount || 1; // Prevent div by 0

                // Initialize bins
                const bins = Array(binCount).fill(0);
                values.forEach(v => {
                    let binIndex = Math.floor((v - min) / binSize);
                    if (binIndex >= binCount) binIndex = binCount - 1; // Capture exact max value
                    // Ensure the bin index is never negative
                    if (binIndex < 0) binIndex = 0;
                    bins[binIndex]++;
                });

                // Format bins mapping
                histograms[col] = bins.map((count, i) => {
                    return {
                        range: `${(min + i * binSize).toFixed(1)} - ${(min + (i + 1) * binSize).toFixed(1)}`,
                        count: count
                    };
                });
            }
        }
    });

    // Detect Outliers using IQR for fully numeric columns
    const outliers = {};
    columnsArr.forEach(col => {
        if (dtypes[col] === 'number') {
            const values = data.map(row => Number(row[col])).filter(v => !isNaN(v));
            if (values.length > 3) { // Need enough data points for IQR
                values.sort((a, b) => a - b);
                const q1 = values[Math.floor((values.length / 4))];
                const q3 = values[Math.floor((values.length * (3 / 4)))];
                const iqr = q3 - q1;
                const lowerBound = q1 - 1.5 * iqr;
                const upperBound = q3 + 1.5 * iqr;
                
                let outlierCount = 0;
                values.forEach(v => {
                    if (v < lowerBound || v > upperBound) outlierCount++;
                });
                
                if (outlierCount > 0) {
                    outliers[col] = outlierCount;
                }
            }
        }
    });

    return {
        rows,
        columns,
        missing_per_column,
        duplicates,
        dtypes,
        histograms,
        outliers
    };
};

module.exports = {
    generateProfile
};
