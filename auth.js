const showAuth = {
  'show-authorization': function (t, options) {
    // return what to do when a user clicks the 'Authorize Account' link
    // from the Power-Up gear icon which shows when 'authorization-status'
    // returns { authorized: false }
    // in this case we would open a popup
    return t.popup({
      title: 'Authorize Out-Sourcerer',
      url: 'https://out-sorcerer.vercel.app/auth',
      height: 140
    });
  }
};

export default showAuth;
