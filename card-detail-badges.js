import { format } from 'timeago.js';
import firebase from 'firebase';

const cardDetailBadges = {
  'card-detail-badges': async function (t, opts) {
    // console.log('initializig card-detail-badges butons');
    const context = t.getContext();
    // const reward = await t.get(context.card, 'shared', 'reward', 0);
    // const published = await t.get(context.card, 'shared', 'published', null);
    // console.log('published: ', published);
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
        title: 'Reward',
        text: currencyFormatter.format(parseInt(fireCardData.reward, 10)),
        color: 'green'
      });
      badges.push({
        title: 'Timebox',
        text: `${fireCardData.timebox} Work Days`,
        color: 'green'
      });
      badges.push({
        title: 'Published',
        text: format(fireCardData.published),
        color: 'green'
      });
    }
    return badges;
  }
};

export default cardDetailBadges;
