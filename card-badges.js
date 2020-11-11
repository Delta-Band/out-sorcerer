import firebase from 'firebase';
import fetch from 'node-fetch';
import { format } from 'timeago.js';
import { currencyFormatter } from './utils';

const cardDetailBadges = {
  'card-badges': async function (t, opts) {
    // console.log('initializig card-detail-badges butons');
    const context = t.getContext();
    // const reward = await t.get(context.card, 'shared', 'reward', 0);
    // const published = await t.get(context.card, 'shared', 'published', false);
    // const timebox = await t.get(context.card, 'shared', 'timebox', null);
    const db = firebase.firestore();
    const fireCardRef = db.collection('cards').doc(context.card);
    const fireCard = await fireCardRef.get();
    const fireCardData = fireCard.data();
    const resp = await fetch(
      `https://api.trello.com/1/cards/${context.card}?attachments=true&attachment_fields=all&key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_API_TOKEN}`
    );
    if (resp.status >= 400 && resp.status < 600) {
      throw new Error('Bad response from server');
    } else {
      const _cardData = await resp.json();
      fireCardRef.set({ native: _cardData }, { merge: true });
    }
    // fireCardRef.onSnapshot(() => {
    //   t.set('card', 'shared', 'updated', Date.now());
    // });
    const badges = [];
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
      if (fireCardData.claims.length > 0) {
        badges.push({
          text: `Claims: ${fireCardData.claims.length}`,
          color: 'purple'
        });
      }
    }
    return badges;
  }
};

export default cardDetailBadges;
