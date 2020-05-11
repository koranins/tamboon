
const loadDonations = require('./loadDonations');
const createCardToken = require('./createCardToken');
const chargeCard = require('./chargeCard');

/**
 * Process single donation.
 */
async function processDonation(donation) {
  try {
    const cardToken = await createCardToken({
      name: donation.name,
      number: donation.card_number,
      expirationMonth: Number.parseInt(donation.card_exp_month),
      expirationYear: Number.parseInt(donation.card_exp_year),
      city: donation.card_city,
      postalCode: Number.parseInt(donation.card_postal_code),
      securityCode: Number.parseInt(donation.card_security_code),
    });
    const charge = await chargeCard({
      amount: Number.parseInt(donation.amount),
      currency: 'thb',
      card: cardToken,
    });
    return {
      name: donation.name,
      amount: Number.parseInt(donation.amount),
      isSuccess: true,
    };
  } catch (err) {
    return {
      name: donation.name,
      amount: Number.parseInt(donation.amount),
      isSuccess: false,
    };
  }
}

async function main() {
  const donations = await loadDonations('donations.csv');

  const results = await Promise.all(donations.map(donation => processDonation(donation)));
  const successResults = results.filter(r => r.isSuccess);
  const failedResults = results.filter(r => !r.isSuccess);
  const totalDonations = successResults.reduce((acc, result) => acc + result.amount, 0);
  
  console.log('Total donations:', `฿${totalDonations / 100}`);
  console.log('Successful charges:')
  successResults.forEach(result => {
    console.log('-', result.name, `฿${result.amount / 100}`);
  });
  console.log('Failed charges:');
  failedResults.forEach(result => {
    console.log('-', result.name, `฿${result.amount / 100}`);
  });
  console.log('Average amount per person:', `฿${totalDonations / successResults.length}`);
  console.log('Top 2 donators:')
  successResults.slice(0, 2).forEach(result => {
    console.log('-', result.name, `฿${result.amount / 100}`);
  });
}

main();
