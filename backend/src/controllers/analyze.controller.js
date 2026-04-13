const fileService = require('../services/file.service');
const profilingService = require('../services/profiling.service');
const scoringService = require('../services/scoring.service');
const recommendationService = require('../services/recommendation.service');


const analyzeData = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const target = req.body.target;

        // 1. Process File
        const data = await fileService.parseFile(req.file);

        if (!data || data.length === 0) {
            return res.status(400).json({ error: 'Uploaded file is empty or contains no valid data' });
        }

        // 2. Profile Data
        const profile = profilingService.generateProfile(data);

        // 3. Score Data
        const scoreResult = scoringService.computeScores(data, profile, target);

        // 4. Generate Recommendations (Now async for LLM Option)
        const recommendations = await recommendationService.generateRecommendations(profile, scoreResult.scores, scoreResult.feature_importance);

        // FINAL RESPONSE
        res.status(200).json({
            data_quality_score: scoreResult.data_quality_score,
            scores: scoreResult.scores,
            profile: profile,
            feature_importance: scoreResult.feature_importance, // Extracted directly from scoreResult
            recommendations: recommendations,
            preview: data.slice(0, 10) // Sending top 10 rows to frontend
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    analyzeData
};