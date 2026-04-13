const ss = require('simple-statistics');

/* =========================
   HELPERS
========================= */

function getNumericColumns(data) {
    const sample = data[0];
    return Object.keys(sample).filter(key => {
        return typeof sample[key] === 'number' && !isNaN(sample[key]);
    });
}

function computeCorrelationImportance(data, target) {
    if (!target) return {};

    const numericCols = getNumericColumns(data);
    const targetValues = data.map(row => Number(row[target])).filter(v => !isNaN(v));

    const importance = {};

    numericCols.forEach(col => {
        if (col === target) return;

        const colValues = data.map(row => Number(row[col])).filter(v => !isNaN(v));

        if (colValues.length !== targetValues.length) {
            importance[col] = 0;
            return;
        }

        try {
            const corr = ss.sampleCorrelation(colValues, targetValues);
            importance[col] = Math.abs(corr);
        } catch {
            importance[col] = 0;
        }
    });

    return importance;
}

function normalizeImportance(importance) {
    const values = Object.values(importance);

    if (values.length === 0) return {};

    const max = Math.max(...values, 1);

    const normalized = {};
    for (let key in importance) {
        normalized[key] = Number(((importance[key] / max) * 100).toFixed(2));
    }

    return normalized;
}

/* =========================
   MAIN SCORING FUNCTION
========================= */

const computeScores = (data, profile, targetColumn = null) => {
    const { rows, columns, missing_per_column, duplicates, dtypes } = profile;

    let totalCells = rows * columns;
    let totalMissing = Object.values(missing_per_column).reduce((sum, val) => sum + val, 0);

    // 1. Completeness
    const completeness = totalCells > 0
        ? Math.max(0, 100 - ((totalMissing / totalCells) * 100))
        : 0;

    // 2. Consistency (Checks for data type conformance)
    let mixedColumns = 0;
    Object.values(dtypes).forEach(type => {
        if (type === 'mixed/empty' || type === 'unknown') mixedColumns++;
    });
    const consistency = columns > 0
        ? Math.max(0, 100 - ((mixedColumns / columns) * 100))
        : 0;

    // 3. Uniqueness
    const uniqueness = rows > 0
        ? Math.max(0, 100 - ((duplicates / rows) * 100))
        : 0;

    // 4. Integrity (Checks for Outliers)
    const { outliers } = profile;
    let totalOutliers = 0;
    if (outliers) {
        totalOutliers = Object.values(outliers).reduce((sum, count) => sum + count, 0);
    }
    const integrity = totalCells > 0
        ? Math.max(0, 100 - ((totalOutliers / totalCells) * 150)) // Heavily penalize massive outlier populations
        : 0;

    // 5. Distribution
    let distribution = 100;
    if (targetColumn && dtypes[targetColumn]) {
        const classCounts = {};
        let validTargets = 0;

        data.forEach(row => {
            const val = row[targetColumn];
            if (val !== null && val !== undefined && String(val).trim() !== '') {
                classCounts[val] = (classCounts[val] || 0) + 1;
                validTargets++;
            }
        });

        if (validTargets > 0) {
            const keys = Object.keys(classCounts);

            if (keys.length > 1) {
                const maxCount = Math.max(...Object.values(classCounts));
                const proportion = maxCount / validTargets;

                if (proportion > 0.8) distribution = 60;
                else if (proportion > 0.6) distribution = 80;
                else distribution = 100;

            } else {
                distribution = 0;
            }
        }
    }

    /* =========================
       FEATURE IMPORTANCE
    ========================= */

    let featureImportanceRaw = {};
    let featureImportance = {};
    let relevance = 60; // default fallback

    if (targetColumn) {
        featureImportanceRaw = computeCorrelationImportance(data, targetColumn);
        featureImportance = normalizeImportance(featureImportanceRaw);

        const values = Object.values(featureImportance);
        if (values.length > 0) {
            relevance = Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(2));
        }
    }

    const scores = {
        completeness: Number(completeness.toFixed(2)),
        consistency: Number(consistency.toFixed(2)),
        uniqueness: Number(uniqueness.toFixed(2)),
        integrity: Number(integrity.toFixed(2)),
        distribution: Number(distribution.toFixed(2)),
        relevance: Number(relevance.toFixed(2))
    };

    // FINAL DQS
    const dqs = (
        0.25 * scores.completeness +
        0.15 * scores.consistency +
        0.10 * scores.uniqueness +
        0.20 * scores.integrity +
        0.15 * scores.distribution +
        0.15 * scores.relevance
    );

    return {
        data_quality_score: Number(dqs.toFixed(2)),
        scores,
        feature_importance: featureImportance
    };
};

module.exports = {
    computeScores
};