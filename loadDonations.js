const csv = require('csv-parser');
const fs = require('fs');

/**
 * Loads donation data from a CSV file.
 * @returns donations
 */
async function loadDonations(donationFile) {
  return new Promise(resolve => {
    const results = [];
    fs.createReadStream(donationFile)
      .pipe(csv())
      .on('data', (data) => {
        results.push(data)
      })
      .on('end', () => {
        resolve(results);
      });
  });
}

module.exports = loadDonations;
