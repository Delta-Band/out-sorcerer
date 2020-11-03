var LOGO = 'https://out-sorcerer.vercel.app/logo.png';

const cardButtons = {
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
    const userType = await t.get('board', 'shared', 'userType', 'pusher');
    if ((parseInt(reward, 10) === 0 || !timebox) && published) {
      console.log('setting published to false');
      t.set('card', 'shared', 'published', false);
    }
    const items = [];
    if (userType === 'provider') {
      items.push({
        text: reward > 0 ? 'Change Reward' : 'Add Reward',
        callback: function (t, opt) {
          t.popup({
            title: reward > 0 ? 'Change Reward' : 'Add Reward',
            url: 'https://out-sorcerer.vercel.app/reward',
            height: 120,
            args: { reward: parseInt(reward, 10) },
            callback: function (t, opt) {
              console.log('callback fired from parent');
              t.closePopup();
            }
          });
        }
      });
      items.push({
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
      });
      if (reward) {
        items.push({
          text: published ? 'Unpublish' : 'Publish',
          callback: function (t, opt) {
            published
              ? t.set('card', 'shared', 'published', false)
              : t.popup({
                  title: 'Publish',
                  url: 'https://out-sorcerer.vercel.app/publish',
                  args: { published, reward: parseInt(reward, 10), timebox },
                  callback: function (t, opt) {
                    t.closePopup();
                  }
                });
          }
        });
      }
    }
    if (userType === 'pusher' && published) {
      items.push({
        text: 'Claim',
        condition: 'always'
        // callback: function (t, opt) {
        //   published
        //     ? t.set('card', 'shared', 'claim', false)
        //     : t.popup({
        //         title: 'Publish',
        //         url: 'https://out-sorcerer.vercel.app/publish',
        //         args: { published, reward: parseInt(reward, 10), timebox },
        //         callback: function (t, opt) {
        //           t.closePopup();
        //         }
        //       });
        // }
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
  }
};

export default cardButtons;
