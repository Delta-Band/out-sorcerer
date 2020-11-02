const settings = {
  'show-settings': async function (t, opts) {
    console.log('initializig card-detail-badges butons');
    // const context = t.getContext();
    const userType = await t.get('board', 'shared', 'userType', 'pusher');
    return t.popup({
      title: 'Ouy Sourcer Settings',
      url: 'https://out-sorcerer.vercel.app/settings',
      height: 170,
      args: { userType },
      callback: function (t, opt) {
        console.log('callback fired from parent');
        t.closePopup();
      }
    });
  }
};

export default settings;
