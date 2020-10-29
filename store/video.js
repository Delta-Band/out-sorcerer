import merge from 'deepmerge';

const reducer = (state = {
  canPlayThrough: false,
  finishedChapter: false,
}, action) => {
  switch (action.type) {
    case 'VIDEO:CAN_PLAY_THROUGH':
      return merge(state, { canPlayThrough: action.bool });
    case 'VIDEO:FINISHED_CHAPTER':
      return merge(state, { finishedChapter: action.bool });
    default:
      return state;
  }
};

const actions = {
  storeCanPlayThrough: (bool) => (dispatch, getState) => {
    const canPlayThrough = selectors.canPlayThrough(getState());
    if (canPlayThrough !== bool) {
      return dispatch({
        type: 'VIDEO:CAN_PLAY_THROUGH',
        bool,
      });
    }
  },
  storeFinishedChapter: (bool) => (dispatch) =>
    dispatch({
      type: 'VIDEO:FINISHED_CHAPTER',
      bool,
    }),
};

const selectors = {
  canPlayThrough: (state) => state.video.canPlayThrough,
  finishedChapter: (state) => state.video.finishedChapter,
};

export default {
  reducer,
  actions,
  selectors,
};
