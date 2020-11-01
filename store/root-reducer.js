import { combineReducers } from 'redux';
import { card } from './index';

const rootReducer = combineReducers({
  card: card.reducer
});

export default rootReducer;
