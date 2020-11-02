// var Promise = TrelloPowerUp.Promise;
// import fetch from 'fetch';

var LOGO =
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
    const timebox = await t.get(context.card, 'shared', 'timebox', null);
    console.log('timebox:', timebox);
    if ((reward === 0 || !timebox) && published) {
      t.set('card', 'shared', 'published', false);
    }
    const items = [
      {
        text: reward > 0 ? 'Change Reward' : 'Add Reward',
        callback: function (t, opt) {
          t.popup({
            title: reward > 0 ? 'Change Reward' : 'Add Reward',
            url: 'https://out-sorcerer.vercel.app/add-reward',
            height: 120,
            args: { reward },
            callback: function (t, opt) {
              console.log('callback fired from parent');
              t.closePopup();
            }
          });
        }
      },
      {
        text: timebox ? 'Change Timebox' : 'Add Timebox',
        callback: function (t, opt) {
          t.popup({
            title: timebox ? 'Change Timebox' : 'Add Timebox',
            url: 'https://out-sorcerer.vercel.app/timebox',
            height: 210,
            args: { timebox: 5 },
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
          published
            ? t.set('card', 'shared', 'published', false)
            : t.popup({
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
        icon: LOGO,
        text: 'Out Sorcerer',
        callback: function (t) {
          return t.popup({
            title: 'Out Sorcerer',
            items: items
          });
        }
      }
    ];
  },
  'card-detail-badges': async function (t, opts) {
    console.log('initializig card-detail-badges butons');
    const context = t.getContext();
    const reward = await t.get(context.card, 'shared', 'reward', 0);
    const published = await t.get(context.card, 'shared', 'published', false);
    const timebox = await t.get(context.card, 'shared', 'timebox', null);
    const badges = [];
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    badges.push({
      title: 'Reward',
      text: formatter.format(parseInt(reward, 10)),
      color: reward > 0 ? 'green' : 'red'
    });
    badges.push({
      title: 'Timebox',
      text: timebox ? `${timebox} Work Days` : 'Required!',
      color: timebox ? 'green' : 'red'
    });
    badges.push({
      title: 'Published',
      text: published ? 'YES' : 'NO',
      color: published ? 'green' : 'red'
    });
    return badges;
  }
};

export default powerUpConfig;
