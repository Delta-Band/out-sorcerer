// var Promise = TrelloPowerUp.Promise;
// import fetch from 'fetch';
import cardButtons from './card-buttons';
import cardDetailBadges from './card-detail-badges';
import cardBadges from './card-badges';
import settings from './settings';
import boardButtons from './board-buttons';
import onEnable from './on-enable';

const powerUpConfig = {
  // Start adding handlers for your capabilities here!
  ...cardButtons,
  ...cardDetailBadges,
  ...cardBadges,
  ...settings,
  ...boardButtons,
  ...onEnable
};

export default powerUpConfig;
