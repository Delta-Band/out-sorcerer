// var Promise = TrelloPowerUp.Promise;
// import fetch from 'fetch';
import cardButtons from './card-buttons';
import cardDetailBadges from './card-detail-badges';
import cardBadges from './card-badges';
import settings from './settings';
import boardButtons from './board-buttons';

const powerUpConfig = {
  // Start adding handlers for your capabilities here!
  ...cardButtons,
  ...cardDetailBadges,
  ...cardBadges,
  ...settings,
  ...boardButtons
};

export default powerUpConfig;
