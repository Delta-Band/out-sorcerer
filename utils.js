export const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
});

const tokenLooksValid = function (token) {
  console.log('token is valid: ', /^[0-9a-f]{64}$/.test(token));
  return /^[0-9a-f]{64}$/.test(token);
};

export const getToken = async function (t) {
  let token = await t.get('organization', 'private', 'token', null);
  if (!tokenLooksValid(token)) {
    token = await t.get('board', 'private', 'token', null);
  }
  return token;
};
