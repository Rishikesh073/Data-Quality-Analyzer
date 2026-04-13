const detectDataType = (value) => {
    if (value === null || value === undefined || value === '') return 'unknown';

    // Check if boolean
    const lowerVal = String(value).toLowerCase().trim();
    if (lowerVal === 'true' || lowerVal === 'false') {
        return 'boolean';
    }

    // Check if date (simple regex format YYYY-MM-DD or valid string)
    if (isNaN(value) && !isNaN(Date.parse(value))) {
        if (String(value).length > 5) {
            return 'date';
        }
    }

    // Check if number
    if (!isNaN(value) && !isNaN(parseFloat(value))) {
        return 'number';
    }

    // Default to string
    return 'string';
};

module.exports = {
    detectDataType
};
