// var Promise = TrelloPowerUp.Promise;

var BLACK_ROCKET_ICON =
  'https://cdn.glitch.com/1b42d7fe-bda8-4af8-a6c8-eff0cea9e08a%2Frocket-ship.png?1494946700421';

const powerUpConfig = {
  // Start adding handlers for your capabilities here!
  'card-buttons': async function (t, options) {
    console.log('initializig card butons');
    const context = t.getContext();
    console.log('context:', context);
    const reward = await t.get(context.card, 'shared', 'reward', 0);
    console.log('reward:', reward);
    const published = await t.get(context.card, 'shared', 'published', false);
    console.log('published:', published);
    const items = [
      {
        text: reward ? 'Change Reward' : 'Add Reward',
        callback: function (t, opt) {
          t.popup({
            title: 'Change Rerward',
            url: 'https://out-sorcerer.vercel.app/add-reward',
            args: { reward },
            callback: function (t, opt) {
              console.log('callback fired from parent');
              t.closePopup();
            }
          });
        }
      }
    ];
    if (reward) {
      items.push({
        text: published ? 'Unpublish' : 'Publish',
        callback: function (t, opt) {
          t.popup({
            title: 'Publish',
            url: 'https://out-sorcerer.vercel.app/publish',
            args: { published },
            callback: function (t, opt) {
              t.closePopup();
            }
          });
        }
      });
    }
    return [
      {
        icon: BLACK_ROCKET_ICON,
        text: 'Out Sorcerer',
        callback: function (t) {
          return t.popup({
            title: 'Out Sorcerer',
            items: items
          });
        }
      }
    ];
  }
};

export default powerUpConfig;
