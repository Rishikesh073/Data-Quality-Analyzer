const csvParser = require('csv-parser');
const xlsx = require('xlsx');
const stream = require('stream');

const parseFile = async (file) => {
    return new Promise((resolve, reject) => {
        const ext = file.originalname.split('.').pop().toLowerCase();

        if (ext === 'csv') {
            const results = [];
            const bufferStream = new stream.PassThrough();
            bufferStream.end(file.buffer);

            bufferStream
                .pipe(csvParser())
                .on('data', (data) => results.push(data))
                .on('end', () => resolve(results))
                .on('error', (err) => reject(new Error('Failed to parse CSV file: ' + err.message)));
        } else if (ext === 'xlsx') {
            try {
                const workbook = xlsx.read(file.buffer, { type: 'buffer' });
                // Handle multiple sheets: defaults to the first sheet
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                
                // Convert to JSON
                const results = xlsx.utils.sheet_to_json(worksheet, { defval: null });
                resolve(results);
            } catch (err) {
                reject(new Error('Failed to parse XLSX file: ' + err.message));
            }
        } else {
            reject(new Error('Unsupported file extension.'));
        }
    });
};

module.exports = {
    parseFile
};
