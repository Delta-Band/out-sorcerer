import { getToken } from './utils';

const authStatus = {
  'authorization-status': async function (t, opts) {
    // return a promise that resolves to the object with
    // a property 'authorized' being true/false
    // you can also return the object synchronously if you know
    // the answer synchronously
    let token = await getToken(t);
    return { authorized: Boolean(token) };
  }
};

export default authStatus;
