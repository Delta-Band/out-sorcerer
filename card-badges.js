import firebase from 'firebase';
import fetch from 'node-fetch';
import { format } from 'timeago.js';

const cardDetailBadges = {
  'card-badges': async function (t, opts) {
    // console.log('initializig card-detail-badges butons');
    const context = t.getContext();
    const marketName = await t.get('board', 'shared', 'marketName', '');
    // const reward = await t.get(context.card, 'shared', 'reward', 0);
    // const published = await t.get(context.card, 'shared', 'published', false);
    // const timebox = await t.get(context.card, 'shared', 'timebox', null);
    const db = firebase.firestore();
    const fireCardRef = db
      .collection('boards')
      .doc(marketName)
      .collection('cards')
      .doc(context.card);
    const fireCard = await fireCardRef.get();
    const fireCardData = fireCard.data();
    const resp = await fetch(
      `https://api.trello.com/1/cards/${context.card}?attachments=true&attachment_fields=all&key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_API_TOKEN}`
    );
    if (resp.status >= 400 && resp.status < 600) {
      throw new Error('Bad response from server');
    } else {
      const _cardData = await resp.json();
      console.log('_cardData', _cardData);
      fireCardRef.set({ native: _cardData }, { merge: true });
    }
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
