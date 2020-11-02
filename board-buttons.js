var LOGO = 'https://out-sorcerer.vercel.app/logo.png';

const boardButtons = {
  'board-buttons': async function (t, options) {
    console.log('initializig card butons');
    const context = t.getContext();
    console.log('context:', context);
    const reward = await t.get(context.card, 'shared', 'reward', 0);
    console.log('reward:', reward);
    const published = await t.get(context.card, 'shared', 'published', false);
    console.log('published:', published);
    const timebox = await t.get(context.card, 'shared', 'timebox', null);
    console.log('timebox:', timebox);
    // const userType = await t.get('board', 'shared', 'userType', 'pusher');
    if ((parseInt(reward, 10) === 0 || !timebox) && published) {
      console.log('setting published to false');
      t.set('card', 'shared', 'published', false);
    }
    const items = [];
    items.push({
      icon: {
        dark: LOGO,
        light: LOGO
      },
      text: 'OS Market',
      url: 'https://out-sorcerer.vercel.app/market',
      fullscreen: true
    });
    return items;
  }
};

export default boardButtons;