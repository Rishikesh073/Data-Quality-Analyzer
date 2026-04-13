const express = require('express');
const router = express.Router();
const analyzeController = require('../controllers/analyze.controller');
const upload = require('../config/multer.config');

router.post('/', upload.single('file'), analyzeController.analyzeData);

module.exports = router;
