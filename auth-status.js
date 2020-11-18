import { getToken } from './utils';

const showAuth = {
  'authorization-status': async function (t, opts) {
    // return a promise that resolves to the object with
    // a property 'authorized' being true/false
    // you can also return the object synchronously if you know
    // the answer synchronously
    let token = await getToken(t);
    return new window.TrelloPowerUp.Promise((resolve) =>
      resolve({ authorized: Boolean(token) })
    );
  }
};

export default showAuth;
