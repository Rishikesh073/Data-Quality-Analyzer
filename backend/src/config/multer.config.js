const multer = require('multer');
const path = require('path');

// Configure storage in memory for immediate processing
const storage = multer.memoryStorage();

// File filter for CSV and XLSX
const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype;

    if (
        ext === '.csv' || 
        ext === '.xlsx' || 
        mime === 'text/csv' || 
        mime === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only CSV and XLSX are allowed.'), false);
    }
};

const limits = {
    fileSize: 50 * 1024 * 1024 // 50 MB limit to prevent memory crashes
};

const upload = multer({
    storage,
    fileFilter,
    limits
});

module.exports = upload;
