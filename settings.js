import _axios from './axios.config';
import { getToken } from './utils';

const settings = {
  'show-settings': async function (t, opts) {
    let token = getToken(t);
    const context = t.getContext();
    console.log('context: ', context);
    const userType = await t.get('board', 'shared', 'userType', 'pusher');
    const webPage = await t.get('board', 'shared', 'webPage', '');
    const logo = await t.get('board', 'shared', 'logo', '');
    const board = await _axios.get(`boards/${context.board}`, {
      paramas: {
        token
      }
    });
    const user = await _axios.get(`member/${context.member}`, {
      paramas: {
        token
      }
    });
    console.log('board', board.data);
    console.log('user', user.data);
    // console.log('webPage', webPage);
    // console.log('logo', logo);
    return t.modal({
      title: 'Out-Sourcer Settings',
      url: 'https://out-sorcerer.vercel.app/settings',
      height: 460,
      args: {
        userType,
        context,
        webPage,
        logo,
        user: user.data,
        board: board.data
      }
    });
  }
};

export default settings;
