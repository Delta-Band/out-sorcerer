var LOGO = 'https://out-sorcerer.vercel.app/logo.png';

const boardButtons = {
  'board-buttons': async function (t, options) {
    const context = t.getContext();
    console.log('context: ', context);
    return [
      {
        icon: {
          dark: LOGO,
          light: LOGO
        },
        text: 'OS Market',
        callback: function (t, opt) {
          t.modal({
            url: 'https://out-sorcerer.vercel.app/market',
            fullscreen: true,
            args: {
              userId: context.member
            },
            callback: function (t, opt) {
              // console.log('modal closed');
              // t.closeModal();
            }
          });
        }
      }
    ];
  }
};

export default boardButtons;

// import firebase from 'firebase';
// import fetch from 'node-fetch';

// const _CREDS = `key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_API_TOKEN}`;

// var LOGO = 'https://out-sorcerer.vercel.app/logo.png';

// const boardButtons = {
//   'board-buttons': async function (t, options) {
//     const context = t.getContext();
//     const db = firebase.firestore();
//     const cardsRef = db.collection('cards');
//     const userType = await t.get('board', 'shared', 'userType', 'pusher');
//     const buttons = [];
//     if (userType === 'pusher') {
//       buttons.push({
//         icon: {
//           dark: LOGO,
//           light: LOGO
//         },
//         text: 'Sync Market',
//         callback: async function (t, opt) {
//           let resp;
//           resp = await fetch(
//             `https://api.trello.com/1/boards/${context.board}/lists?${_CREDS}`,
//             {
//               method: 'GET'
//             }
//           );
//           const boardLists = await resp.json();
//           const marketList = boardLists.find(
//             (list) => list.name.toLowerCase() === 'market'
//           );
//           if (marketList) {
//             // get cards on market list
//             resp = await fetch(
//               `https://api.trello.com/1/lists/${marketList.id}/cards${_CREDS}`,
//               {
//                 method: 'GET'
//               }
//             );
//             const cards = resp.json();
//             const cardIds = cards.reduce(async (accumilator, card) => {
//               accumilator.push(card.id);
//               return accumilator;
//             }, []);
//             const querySnapshot = cardsRef.get();
//             querySnapshot.forEach(async function (doc) {
//               const data = doc.data();
//               const card = cards.find(card => card.id === doc.id)
//               if (cardIds.includes(doc.id)) {
//                 // card exsists so update it
//               } else {
//                 // card does not esist so creat it
//                 await fetch(
//                   `https://api.trello.com/1/cards?${_CREDS}&name=${}`,
//                   {
//                     method: 'POST'
//                   }
//                 );
//               }
//             });
//           }
//         }
//       });
//     }
//     return buttons;
//   }
// };

// export default boardButtons;
