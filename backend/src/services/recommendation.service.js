const { GoogleGenAI } = require('@google/genai');

const generateRecommendations = async (profile, scores, featureImportance) => {
    let recommendations = [];
    const { rows, missing_per_column, duplicates, dtypes, outliers } = profile;

    // Optional LLM Upgrade: If you provide a GEMINI_API_KEY in your .env, the system will use an actual LLM to evaluate the data shape!
    if (process.env.GEMINI_API_KEY) {
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
            const prompt = `
            You are an expert Data Scientist. I have profiled a dataset with the following statistics:
            Rows: ${rows}
            Duplicates: ${duplicates}
            Columns and Types: ${JSON.stringify(dtypes)}
            Missing Values by Column: ${JSON.stringify(missing_per_column)}
            Calculated Quality Scores: ${JSON.stringify(scores)}
            Outliers Count by Column: ${JSON.stringify(outliers || {})}
            Feature Importance (Correlation): ${JSON.stringify(featureImportance || {})}

            Your job is to provide highly specific, actionable rules and recommendations for data cleaning.
            CRITICAL RULES TO FOLLOW:
            - If an important feature (correlation heavily positive or > 50) has ANY null/missing values, you MUST inject a critical alert indicating that the existence of those rows is doubtful and action must be taken.
            - If any column has more than 70% missing values (relative to rows count), explicitly recommend filling it with "NA" and specify that doing so will forcefully affect consistency and completeness matrices.
            - If outliers are heavily present, instruct the user how they can ruin statistical calculations and should be handled.
            
            Do NOT provide boilerplate. Focus purely on anomalies or structural decisions. Output the recommendations as a raw JSON array of strings ONLY. For example: ["Fill 'price' with NA", "Drop duplicate rows"].
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            const textOutput = response.text().trim();
            // Try to parse the JSON array from the markdown codeblocks if present
            const cleanJson = textOutput.replace(/```json/g, '').replace(/```/g, '').trim();
            recommendations = JSON.parse(cleanJson);
            if (Array.isArray(recommendations) && recommendations.length > 0) return recommendations;
            
        } catch (error) {
            console.error("LLM Generation failed, falling back to heuristics:", error.message);
        }
    }

    // --- FALLBACK HEURISTIC (When no API key is provided) ---
    // Duplicates
    if (duplicates > 0) {
        recommendations.push(`Remove ${duplicates} duplicate row${duplicates > 1 ? 's' : ''}.`);
    }

    // Missing values
    for (const [col, missingCount] of Object.entries(missing_per_column)) {
        if (missingCount > 0) {
            const missingPercent = (missingCount / rows) * 100;
            
            // Check if it's an IMPORTANT feature
            if (featureImportance && featureImportance[col] && featureImportance[col] > 40) {
                recommendations.push(`CRITICAL ALERT: The highly important feature '${col}' has missing values. This doubts the correct existence of those records. Action must be taken.`);
            }

            if (missingPercent > 70) { // user request
                recommendations.push(`Warning: '${col}' has >70% missing values. Recommended to fill it with "NA", noting that doing so will affect completeness and consistency calculations.`);
            } else if (missingPercent > 30) {
                recommendations.push(`Drop column '${col}' due to high missing values (${missingPercent.toFixed(2)}%).`);
            } else {
                let imputeMethod = dtypes[col] === 'number' ? 'mean/median' : 'mode/most-frequent';
                recommendations.push(`Impute missing values in column '${col}' (suggested: ${imputeMethod}).`);
            }
        }
    }

    // Outliers
    if (outliers) {
        let heavyOutliersCol = null;
        for (const [col, outlierCount] of Object.entries(outliers)) {
            if (outlierCount > (rows * 0.05)) heavyOutliersCol = col;
        }
        if (heavyOutliersCol) {
            recommendations.push(`Notice: Outliers are heavily present in column '${heavyOutliersCol}'. Outliers can mathematically ruin your statistical distribution calculations and should be capped or transformed.`);
        }
    }

    // Categorical Encoding & Imbalance
    for (const [col, type] of Object.entries(dtypes)) {
        if (type === 'string' || type === 'boolean') {
            recommendations.push(`Suggest encoding for categorical data in column '${col}' (e.g., One-Hot or Label Encoding if used for ML).`);
        }
    }
    
    // Low scores
    if (scores.distribution < 80) {
        recommendations.push(`Detect class imbalance in the target variable. Consider techniques like SMOTE or class weighting.`);
    }

    // Uniqueness constraint warning
    if (scores.uniqueness < 100) {
        recommendations.push('Consider removing duplicated records to improve the uniqueness metric.');
    }

    // If completely clean (like standard finance datasets)
    if (recommendations.length === 0) {
        recommendations.push('Data is structurally perfect according to heuristics (no duplicates, no missing data). Ready for modeling!');
    }

    return recommendations;
};

module.exports = {
    generateRecommendations
};
