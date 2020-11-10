// import fetch from 'node-fetch';

const onEnable = {
  'on-enable': async function (t, options) {
    // console.log('on enable handler');
    // const context = t.getContext();
    // const userType = await t.get('board', 'shared', 'userType', null);
    // if (userType === 'pusher') {
    //   const boardLists = await getBoardLists(context.board);
    //   await createOSLists(context.board, 'Market', boardLists);
    //   await createOSLists(context.board, 'Starred', boardLists);
    //   await createOSLists(context.board, 'Approved', boardLists);
    //   await createOSLists(context.board, 'Client Review', boardLists);
    //   await createOSLists(context.board, 'Done', boardLists);
    //   await createOSLists(context.board, 'Paid', boardLists);
    // }
    return t.modal({
      url: 'https://out-sorcerer.vercel.app/on-enable',
      height: 500,
      title: 'My Power-Up Overview'
    });
  }
};

// function createOSLists(boardId, listName, boardLists) {
//   const promise = new Promise(async (resolve, reject) => {
//     const listExsists = boardLists.find((_lst) => _lst === listName);
//     if (listExsists) {
//       resolve();
//     } else {
//       await fetch(
//         `https://api.trello.com/1/boards/${boardId}/lists?&key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_API_TOKEN}&name=${listName}&pos=bottom`,
//         {
//           method: 'POST'
//         }
//       );
//       resolve();
//     }
//   });
//   return promise;
// }

// function getBoardLists(boardId) {
//   const promise = new Promise(async (resolve, reject) => {
//     const resp = await fetch(
//       `https://api.trello.com/1/boards/${boardId}/lists?&key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_API_TOKEN}`
//     );
//     if (resp.status >= 400 && resp.status < 600) {
//       reject(new Error('Bad response from server'));
//     } else {
//       const lists = await resp.json();
//       resolve(lists);
//     }
//   });
//   return promise;
// }

export default onEnable;
