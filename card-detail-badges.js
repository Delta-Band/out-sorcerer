import { format } from 'timeago.js';

const cardDetailBadges = {
  'card-detail-badges': async function (t, opts) {
    console.log('initializig card-detail-badges butons');
    const context = t.getContext();
    const reward = await t.get(context.card, 'shared', 'reward', 0);
    const published = await t.get(context.card, 'shared', 'published', null);
    console.log('published: ', published);
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
      text: published ? format(published) : '-',
      color: published ? 'green' : 'red'
    });
    return badges;
  }
};

export default cardDetailBadges;
