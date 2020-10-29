const reducer = (
  state = {
    tabTitle: 'Sanoclis - MIMS',
    metaDescription: 'Sanoculis MIMS Device'
  },
  action
) => {
  switch (action.type) {
    case 'HOME:UPDATE':
      return action.data;
    default:
      return state;
  }
};

const actions = {
  update: (data) => (dispatch) =>
    dispatch({
      type: 'HOME:UPDATE',
      data
    })
};

const selectors = {
  data: (state) => state.helmet
};

export default {
  reducer,
  actions,
  selectors
};
