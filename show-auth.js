// import firebase from 'firebase';
// import fetch from 'node-fetch';
// import { format } from 'timeago.js';
// import { currencyFormatter } from './utils';

const showAuth = {
  'show-authorization': async function (t, opts) {
    // var Promise = window.TrelloPowerUp.Promise;

    // When constructing the URL, remember that you'll need to encode your
    // APPNAME and RETURNURL
    // You can do that with the encodeURIComponent(string) function
    // encodeURIComponent('Hello World') -> "Hello%20World"
    const oauthUrl = `https://trello.com/1/authorize?expiration=never&name=Out-Sorcerer&scope=read,write,account&key=${process.env.TRELLO_API_KEY}&callback_method=fragment&return_url=https://trello.com`;

    const tokenLooksValid = function (token) {
      return /^[0-9a-f]{64}$/.test(token);
    };

    const storageHandler = function (evt, authorizeWindow) {
      console.log('storageHandler evt:', evt);
      console.log('storageHandler authorizeWindow:', authorizeWindow);
      if (evt.key === 'token' && evt.newValue) {
        // Do something with the token here, then...
        authorizeWindow.close();
        window.removeEventListener('storage', storageHandler);
      }
    };

    var authorizeOpts = {
      height: 680,
      width: 580,
      validToken: tokenLooksValid,
      windowCallback: function (authorizeWindow) {
        console.log('authorizeWindow: ', authorizeWindow);
        // This callback gets called with the handle to the
        // authorization window. This can be useful if you
        // can't call window.close() in your new window
        // (such as the case when your authorization page
        // is rendered inside an iframe).
        window.addEventListener('storage', function (e) {
          storageHandler(e, authorizeWindow);
        });
      }
    };
    // return t.popup({
    //   title: 'My Auth Popup',
    //   url: 'https://out-sorcerer.vercel.app/claims',
    //   height: 338
    // });
    return t
      .authorize(oauthUrl, authorizeOpts)
      .then(function (token) {
        console.log('new token: ', token);
        return t
          .set('organization', 'private', 'token', token)
          .catch(t.NotHandled, function () {
            // fall back to storing at board level
            console.log("can't set token for organiztion so set for the board");
            return t.set('board', 'private', 'token', token);
          });
      })
      .then(function () {
        // now that the token is stored, we can close this popup
        // you might alternatively choose to open a new popup
        t.closeModal();
        t.closePopup();
      });
  }
};

export default showAuth;
