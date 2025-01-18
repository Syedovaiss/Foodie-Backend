const path = require('path')
const fs = require('fs');
exports.getCountries = (req, res) => {
    const filePath = path.join(__dirname, '../../../assets', 'countries.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).json({ message: 'Error reading file', error: err });
        } else {
            try {
                const jsonData = JSON.parse(data);
                res.status(200).json({ data: jsonData });
            } catch (parseError) {
                res.status(500).json({ message: 'Error parsing JSON', error: parseError });
            }
        }
    });
}