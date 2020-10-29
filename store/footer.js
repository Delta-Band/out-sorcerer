import merge from 'deepmerge';

const reducer = (state = { show: false }, action) => {
  switch (action.type) {
    case 'FOOTER:TOGGLE':
      return merge(state, { show: action.bool });
    default:
      return state;
  }
};

const actions = {
  show: (bool) => (dispatch) =>
    dispatch({
      type: 'FOOTER:TOGGLE',
      bool
    })
};

const selectors = {
  show: (state) => state.footer.show
};

export default {
  reducer,
  actions,
  selectors
};
