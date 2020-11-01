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
        text: reward === 0 ? 'Change Reward' : 'Add Reward',
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
  },
  'card-detail-badges': async function (t, opts) {
    console.log('initializig card-detail-badges butons');
    const context = t.getContext();
    const reward = await t.get(context.card, 'shared', 'reward', 0);
    const published = await t.get(context.card, 'shared', 'published', false);
    const badges = [];
    if (reward > 0) {
      badges.push({
        title: 'Reward',
        text: `$${reward}`,
        color: '#32094d',
      });
    if (published) {
      badges.push({
        title: 'Published',
        text: `$${published}`,
        color: '#4d0947',
      });
    }
    return [
      {
        // its best to use static badges unless you need your badges
        // to refresh you can mix and match between static and dynamic
        title: 'Detail Badge',
        text: 'Static',
        color: null
      },
      {
        // card detail badges (those that appear on the back of cards)
        // also support callback functions so that you can open for example
        // open a popup on click
        title: 'Popup Detail Badge',
        text: 'Popup',
        callback: function (t, opts) {
          // function to run on click
          // do something
        }
      },
      {
        // or for simpler use cases you can also provide a url
        // when the user clicks on the card detail badge they will
        // go to a new tab at that url
        title: 'URL Detail Badge',
        text: 'URL',
        url: 'https://trello.com/home',
        target: 'Trello Landing Page' // optional target for above url
      }
    ];
  }
};

export default powerUpConfig;
