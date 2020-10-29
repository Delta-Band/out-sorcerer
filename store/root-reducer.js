import { combineReducers } from 'redux';
import { contact, footer, video } from './index';

const rootReducer = combineReducers({
  contact: contact.reducer,
  footer: footer.reducer,
  video: video.reducer
});

export default rootReducer;
