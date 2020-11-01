const reducer = (
  state = {
    reward: 0,
    id: null
  },
  action
) => {
  switch (action.type) {
    case 'CARD:UPDATE':
      return action.data;
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
