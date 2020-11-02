const cardDetailBadges = {
  'card-badges': async function (t, opts) {
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
    if (reward > 0) {
      badges.push({
        icon: 'https://out-sorcerer.vercel.app/reward.png',
        text: formatter.format(parseInt(reward, 10))
      });
    }
    if (timebox) {
      badges.push({
        icon: 'https://out-sorcerer.vercel.app/timebox.png',
        text: `${timebox} Work Days`
      });
    }
    if (published) {
      badges.push({
        icon: 'https://out-sorcerer.vercel.app/timebox.png',
        text: 'Published'
      });
    }
    return badges;
  }
};

export default cardDetailBadges;
