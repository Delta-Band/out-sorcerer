import firebase from 'firebase';
import { format } from 'timeago.js';
import { currencyFormatter, getToken } from './utils';
import _axios from './axios.config';

const cardDetailBadges = {
  'card-badges': async function (t, opts) {
    // console.log('initializig card-detail-badges butons');
    const badges = [];
    let token = await getToken(t);
    console.log('token: ', token);
    const context = t.getContext();
    const userType = await t.get('board', 'shared', 'userType', 'pusher');
    if (userType === 'provider') {
      // const reward = await t.get(context.card, 'shared', 'reward', 0);
      // const published = await t.get(context.card, 'shared', 'published', false);
      // const timebox = await t.get(context.card, 'shared', 'timebox', null);
      const db = firebase.firestore();
      const fireCardRef = db.collection('cards').doc(context.card);
      const fireCard = await fireCardRef.get();
      const fireCardData = fireCard.data();
      const card = await _axios.get(`cards/${context.card}`, {
        parmas: {
          attachments: true,
          attachment_fields: 'all',
          token
        }
      });
      fireCardRef.set({ native: card.data }, { merge: true });
      // fireCardRef.onSnapshot(() => {
      //   t.set('card', 'shared', 'updated', Date.now());
      // });
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
    }
    return badges;
  }
};

export default cardDetailBadges;
