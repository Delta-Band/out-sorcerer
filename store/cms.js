import merge from 'deepmerge';

const reducer = (
  state = {
    navigation: {},
    contact: {},
    footer: {}
  },
  action
) => {
  switch (action.type) {
    case 'CMS:NAVIGATION':
      return merge(state, { navigation: action.data });
    case 'CMS:CONTACT':
      return merge(state, { contact: action.data });
    case 'CMS:FOOTER':
      return merge(state, { footer: action.data });
    default:
      return state;
  }
};

const actions = {
  storeNavigationData: (data) => (dispatch) =>
    dispatch({
      type: 'CMS:NAVIGATION',
      data
    }),
  storeContactnData: (data) => (dispatch) =>
    dispatch({
      type: 'CMS:CONTACT',
      data
    }),
  storeFooterData: (data) => (dispatch) =>
    dispatch({
      type: 'CMS:FOOTER',
      data
    })
};

const selectors = {
  navigation: (state) => state.cms.navigation,
  contact: (state) => state.cms.contact,
  footer: (state) => state.cms.footer
};

export default {
  reducer,
  actions,
  selectors
};
