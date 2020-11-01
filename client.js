import { useDispatch } from 'react-redux';
import { card } from './store';

// var Promise = TrelloPowerUp.Promise;

var BLACK_ROCKET_ICON =
  'https://cdn.glitch.com/1b42d7fe-bda8-4af8-a6c8-eff0cea9e08a%2Frocket-ship.png?1494946700421';

const powerUpConfig = {
  // Start adding handlers for your capabilities here!
  'card-buttons': async function (t, options) {
    const dispatch = useDispatch();
    const context = t.getContext();
    console.log('context:', context);
    const reward = await t.get(context.card, 'shared', 'reward', 0);
    // const published = await t.get(context.card, 'shared', 'published', false);
    dispatch(card.actions.update({ reward, id: context.card }));
    const items = [
      {
        text: reward ? 'Change Reward' : 'Add Reward',
        callback: function (t, opt) {
          t.popup({
            title: 'Change Rerward',
            url: 'https://out-sorcerer.vercel.app/add-reward',
            callback: function (t, opt) {
              console.log('callback fired from parent');
            }
          });
        }
      }
    ];
    // if (reward) {
    //   items.push({
    //     text: published ? 'Unpublish' : 'Publish',
    //     callback: function (t, opt) {
    //       if (published) {
    //         t.set('card', 'shared', 'published', false);
    //         dispatch(card.actions.update({ published: false }));
    //       } else {
    //         t.popup({
    //           title: 'Publish',
    //           url: 'https://out-sorcerer.vercel.app/publish',
    //           callback: function (t, opt) {
    //             t.set('card', 'shared', 'published', true);
    //             dispatch(card.actions.update({ published: true }));
    //           }
    //         });
    //       }
    //     }
    //   });
    // }
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
