import firebase from 'firebase';
import { format } from 'timeago.js';

const cardDetailBadges = {
  'card-badges': async function (t, opts) {
    // console.log('initializig card-detail-badges butons');
    const context = t.getContext();
    // const reward = await t.get(context.card, 'shared', 'reward', 0);
    // const published = await t.get(context.card, 'shared', 'published', false);
    // const timebox = await t.get(context.card, 'shared', 'timebox', null);
    const db = firebase.firestore();
    const fireCardRef = db
      .collection('boards')
      .doc(context.baord)
      .collection('cards')
      .doc(context.card);
    const fireCard = await fireCardRef.get();
    const fireCardData = fireCard.data();
    const badges = [];
    const currencyFormatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    if (fireCardData.reward) {
      badges.push({
        icon: 'https://out-sorcerer.vercel.app/reward.png',
        text: currencyFormatter.format(parseInt(fireCardData.reward, 10)),
        color: 'green'
      });
      badges.push({
        icon: 'https://out-sorcerer.vercel.app/timebox.png',
        text: `${fireCardData.timebox} Work Days`,
        color: 'green'
      });
      badges.push({
        icon: 'https://out-sorcerer.vercel.app/published.png',
        text: format(fireCardData.published),
        color: 'green'
      });
    }
    return badges;
  }
};

export default cardDetailBadges;
