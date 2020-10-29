import merge from 'deepmerge';

const reducer = (
  state = {
    info: null,
    shareLink: ''
  },
  action
) => {
  switch (action.type) {
    case 'CONTACT:UPDATE':
      return merge(state, { info: action.data });
    case 'CONTACT:STORE_SHARED_LINK':
      return merge(state, { shareLink: action.link });
    default:
      return state;
  }
};

const actions = {
  update: (data) => (dispatch) =>
    dispatch({
      type: 'CONTACT:UPDATE',
      data
    }),
  storeSharedLink: (link) => (dispatch) =>
    dispatch({
      type: 'CONTACT:STORE_SHARED_LINK',
      link
    })
};

const selectors = {
  info: (state) => state.contact.info,
  shareLink: (state) => state.contact.shareLink
};

export default {
  reducer,
  actions,
  selectors
};
