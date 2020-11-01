var merge = require('merge-deep');

const reducer = (
  state = {
    reward: 0,
    published: false,
    id: null
  },
  action
) => {
  switch (action.type) {
    case 'CARD:UPDATE':
      return merge(state, action.data);
    default:
      return state;
  }
};

const actions = {
  update: (data) => (dispatch) =>
    dispatch({
      type: 'CARD:UPDATE',
      data
    })
};

const selectors = {
  data: (state) => state.card
};

export default {
  reducer,
  actions,
  selectors
};
