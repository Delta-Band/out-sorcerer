const settings = {
  'show-settings': async function (t, opts) {
    console.log('initializig card-detail-badges butons');
    // const context = t.getContext();
    const userType = await t.get('board', 'shared', 'userType', 'pusher');
    console.log(userType);
    return t.modal({
      title: 'Out-Sourcer Settings',
      url: 'https://out-sorcerer.vercel.app/settings',
      height: 460,
      args: { userType },
      callback: function (t, opt) {
        console.log('callback fired from parent');
        t.closeModal();
      }
    });
  }
};

export default settings;
