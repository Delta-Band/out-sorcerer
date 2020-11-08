import fetch from 'node-fetch';

const OSLists = [
  'Market',
  'Starred',
  'Claim',
  'Approved',
  'Client Review',
  'Done',
  'Paid'
];

const onEnable = {
  'on-enable': async function (t, options) {
    console.log('on enable handler');
    const context = t.getContext();
    const userType = await t.get('board', 'shared', 'userType', null);
    if (userType === 'pusher') {
      const boardLists = await getBoardLists(context.board);
      OSLists.forEach(async (list) => {
        // check if list already esists
        const listExsists = boardLists.find((_lst) => _lst === list);
        if (!listExsists) {
          // list does not exsist so create it!
          await createOSLists(context.board, list);
          console.log('created list: ', list);
        }
      });
    }
    return t.modal({
      url: 'https://out-sorcerer.vercel.app/on-enable',
      height: 500,
      title: 'My Power-Up Overview'
    });
  }
};

function createOSLists(boardId, listName) {
  return fetch(
    `https://api.trello.com/1/boards/${boardId}/lists?&key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_API_TOKEN}&name=${listName}&pos=bottom`,
    {
      method: 'POST'
    }
  );
}

function getBoardLists(boardId) {
  const promise = new Promise(async (resolve, reject) => {
    const resp = await fetch(
      `https://api.trello.com/1/boards/${boardId}/lists?&key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_API_TOKEN}`
    );
    if (resp.status >= 400 && resp.status < 600) {
      reject(new Error('Bad response from server'));
    } else {
      resolve(resp.json());
    }
  });
  return promise;
}

export default onEnable;
