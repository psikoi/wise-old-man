import { combineReducers } from 'redux';

import notifications from './modules/notifications/reducer';
import deltas from './modules/deltas/reducer';
import records from './modules/records/reducer';
import competitions from './modules/competitions/reducer';
import snapshots from './modules/snapshots/reducer';
import players from './modules/players/reducer';
import achievements from './modules/achievements/reducer';
import groups from './modules/groups/reducer';
import hiscores from './modules/hiscores/reducer';

export default combineReducers({
  notifications,
  deltas,
  records,
  competitions,
  snapshots,
  players,
  achievements,
  groups,
  hiscores
});
