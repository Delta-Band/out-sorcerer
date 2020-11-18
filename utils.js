export const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
});

const tokenLooksValid = function (token) {
  return /^[0-9a-f]{64}$/.test(token);
};

export const getToken = function (t) {
  let token = t.get('organization', 'private', 'token');
  if (!tokenLooksValid(token)) {
    token = t.get('board', 'private', 'token');
  }
  return token;
};
