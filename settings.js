const settings = {
  'show-settings': async function (t, opts) {
    console.log('initializig card-detail-badges butons');
    const context = t.getContext();
    const userType = await t.get('board', 'shared', 'userType', 'pusher');
    const webPage = await t.get('board', 'shared', 'webPage', '');
    const marketName = await t.get('board', 'shared', 'marketName', '');
    const logo = await t.get('board', 'shared', 'logo', '');
    const marketPlaceBoardName = await t.get(
      'board',
      'shared',
      'marketPlaceBoardName',
      ''
    );
    console.log(userType);
    return t.modal({
      title: 'Out-Sourcer Settings',
      url: 'https://out-sorcerer.vercel.app/settings',
      height: 460,
      args: {
        userType,
        marketPlaceBoardName,
        context,
        webPage,
        marketName,
        logo
      },
      callback: function (t, opt) {
        console.log('callback fired from parent');
        // t.closeModal();
      }
    });
  }
};

export default settings;
