const axios = require('axios');
const querystring = require('querystring');

/**
 * Invokes Omise Charge API.
 */
async function chargeCard({ amount, currency = 'thb', card }) {
  const token = Buffer.from(`${process.env.OMISE_SECRET_KEY}:`, 'utf8')
    .toString('base64');
  const response = await axios({
    url: 'https://api.omise.co/charges',
    method: 'POST',
    headers: {
      'Authorization': `Basic ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: querystring.stringify({
      amount,
      currency,
      card,
    }),
  })
  return response.data;
}

module.exports = chargeCard;
