const axios = require('axios');
const querystring = require('querystring');

/**
 * Invokes Omise Token API to create a credit card token.
 * @returns token ID
 */
async function createCardToken({
  name,
  number,
  expirationMonth,
  expirationYear,
  city,
  postalCode,
  securityCode,
}) {
  const token = Buffer.from(`${process.env.OMISE_PUBLIC_KEY}:`, 'utf8')
    .toString('base64');
  const response = await axios({
    url: 'https://vault.omise.co/tokens',
    method: 'POST',
    headers: {
      'Authorization': `Basic ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: querystring.stringify({
      'card[name]': name,
      'card[number]': number,
      'card[expiration_month]': expirationMonth,
      'card[expiration_year]': expirationYear,
      'card[city]': city,
      'card[postal_code]': postalCode,
      'card[security_code]': securityCode,
    }),
  });
  return response.data.id;
} 

module.exports = createCardToken; 
