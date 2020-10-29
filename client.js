// var Promise = TrelloPowerUp.Promise;

var BLACK_ROCKET_ICON =
  'https://cdn.glitch.com/1b42d7fe-bda8-4af8-a6c8-eff0cea9e08a%2Frocket-ship.png?1494946700421';

const powerUpConfig = {
  // Start adding handlers for your capabilities here!
  'card-buttons': function (t, options) {
    var context = t.getContext();
    console.log(context);
    console.log(JSON.stringify(context, null, 2));
    return [
      {
        icon: BLACK_ROCKET_ICON,
        text: 'Out Sorcerer',
        callback: function (t) {
          return t.popup({
            title: 'Actions',
            items: [
              {
                text: 'Add Reward',
                callback: function (t, opt) {
                  t.popup({
                    title: 'Add Rerward',
                    url: 'https://out-sorcerer.vercel.app/add-reward'
                  });
                }
              }
            ]
          });
        }
      }
    ];
  }
};

export default powerUpConfig;
