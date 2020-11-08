var LOGO = 'https://out-sorcerer.vercel.app/logo.png';

const cardButtons = {
  'card-buttons': async function (t, options) {
    console.log('initializig card butons');
    const context = t.getContext();
    console.log('context:', context);
    const userType = await t.get('board', 'shared', 'userType', 'pusher');
    const marketName = await t.get('board', 'shared', 'marketName', '');
    const items = [];
    if (userType === 'provider') {
      items.push({
        icon: LOGO,
        text: 'Out Sorcerer',
        callback: function (t, opt) {
          t.popup({
            title: 'Publish to OS-Market',
            url: 'https://out-sorcerer.vercel.app/set-card',
            height: 338,
            args: { marketName, cardId: context.card, boardId: context.board },
            callback: function (t, opt) {
              console.log('callback fired from parent');
              t.closePopup();
              t.set('card', 'shared', 'lastUpdate', Date.now());
            }
          });
        }
      });
    }
    // if (userType === 'pusher' && published) {
    //   items.push({
    //     text: 'Claim',
    //     condition: 'always'
    //     // callback: function (t, opt) {
    //     //   published
    //     //     ? t.set('card', 'shared', 'claim', false)
    //     //     : t.popup({
    //     //         title: 'Publish',
    //     //         url: 'https://out-sorcerer.vercel.app/publish',
    //     //         args: { published, reward: parseInt(reward, 10), timebox },
    //     //         callback: function (t, opt) {
    //     //           t.closePopup();
    //     //         }
    //     //       });
    //     // }
    //   });
    // }

    return items;
  }
};

export default cardButtons;
