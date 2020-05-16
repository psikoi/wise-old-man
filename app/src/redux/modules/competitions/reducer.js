import _ from 'lodash';

import { toMap } from '../../utils';
import { TRACK_PLAYER_SUCCESS } from '../players/reducer';

export const CREATE_COMPETITION_REQUEST = 'wise-old-man/competitions/CREATE_COMPETITION_REQUEST';
export const CREATE_COMPETITION_SUCCESS = 'wise-old-man/competitions/CREATE_COMPETITION_SUCCESS';
export const CREATE_COMPETITION_FAILURE = 'wise-old-man/competitions/CREATE_COMPETITION_FAILURE';

export const EDIT_COMPETITION_REQUEST = 'wise-old-man/competitions/EDIT_COMPETITION_REQUEST';
export const EDIT_COMPETITION_SUCCESS = 'wise-old-man/competitions/EDIT_COMPETITION_SUCCESS';
export const EDIT_COMPETITION_FAILURE = 'wise-old-man/competitions/EDIT_COMPETITION_FAILURE';

export const DELETE_COMPETITION_REQUEST = 'wise-old-man/competitions/DELETE_COMPETITION_REQUEST';
export const DELETE_COMPETITION_SUCCESS = 'wise-old-man/competitions/DELETE_COMPETITION_SUCCESS';
export const DELETE_COMPETITION_FAILURE = 'wise-old-man/competitions/DELETE_COMPETITION_FAILURE';

export const FETCH_COMPETITIONS_REQUEST = 'wise-old-man/competitions/FETCH_LIST_REQUEST';
export const FETCH_COMPETITIONS_SUCCESS = 'wise-old-man/competitions/FETCH_LIST_SUCCESS';
export const FETCH_COMPETITIONS_FAILURE = 'wise-old-man/competitions/FETCH_LIST_FAILURE';

export const FETCH_PLAYER_COMPETITIONS_REQUEST = 'wise-old-man/competitions/FETCH_PLAYER_REQUEST';
export const FETCH_PLAYER_COMPETITIONS_SUCCESS = 'wise-old-man/competitions/FETCH_PLAYER_SUCCESS';
export const FETCH_PLAYER_COMPETITIONS_FAILURE = 'wise-old-man/competitions/FETCH_PLAYER_FAILURE';

export const FETCH_GROUP_COMPETITIONS_REQUEST = 'wise-old-man/competitions/FETCH_GROUP_REQUEST';
export const FETCH_GROUP_COMPETITIONS_SUCCESS = 'wise-old-man/competitions/FETCH_GROUP_SUCCESS';
export const FETCH_GROUP_COMPETITIONS_FAILURE = 'wise-old-man/competitions/FETCH_GROUP_FAILURE';

export const FETCH_COMPETITION_REQUEST = 'wise-old-man/competition/FETCH_REQUEST';
export const FETCH_COMPETITION_SUCCESS = 'wise-old-man/competition/FETCH_SUCCESS';
export const FETCH_COMPETITION_FAILURE = 'wise-old-man/competition/FETCH_FAILURE';

export const UPDATE_PARTICIPANTS_REQUEST = 'wise-old-man/competition/UPDATE_PARTICIPANTS_REQUEST';
export const UPDATE_PARTICIPANTS_SUCCESS = 'wise-old-man/competition/UPDATE_PARTICIPANTS_SUCCESS';
export const UPDATE_PARTICIPANTS_FAILURE = 'wise-old-man/competition/UPDATE_PARTICIPANTS_FAILURE';

const initialState = {
  isCreating: false,
  isDeleting: false,
  isEditing: false,
  isFetchingAll: false,
  isFetchingPlayerCompetitions: false,
  isFetchingGroupCompetitions: false,
  isFetchingDetails: false,
  competitions: {},
  playerCompetitions: {},
  groupCompetitions: {},
  error: { message: null, data: null }
};

export default function competitionsReducer(state = initialState, action) {
  switch (action.type) {
    // If a player gets updated, update it's updatedAt field in
    // the participants list of every containing competition
    case TRACK_PLAYER_SUCCESS:
      return { ...state, competitions: playerUpdated(state.competitions, action.username) };

    case CREATE_COMPETITION_REQUEST:
      return { ...state, isCreating: true };

    case CREATE_COMPETITION_SUCCESS:
      return {
        ...state,
        isCreating: false,
        competitions: { ...replaceDetails(state.competitions, action.competition) }
      };

    case CREATE_COMPETITION_FAILURE:
      return { ...state, isCreating: false, error: { message: action.error, data: action.data } };

    case EDIT_COMPETITION_REQUEST:
      return { ...state, isEditing: true };

    case EDIT_COMPETITION_SUCCESS:
      return {
        ...state,
        isEditing: false,
        competitions: { ...replaceDetails(state.competitions, action.competition) }
      };

    case EDIT_COMPETITION_FAILURE:
      return { ...state, isEditing: false, error: { message: action.error, data: action.data } };

    case DELETE_COMPETITION_REQUEST:
      return { ...state, isDeleting: true };

    case DELETE_COMPETITION_SUCCESS:
      return {
        ...state,
        isDeleting: false,
        competitions: { ..._.omit(state.competitions, action.competitionId) }
      };

    case DELETE_COMPETITION_FAILURE:
      return { ...state, isDeleting: false, error: { message: action.error } };

    case FETCH_COMPETITIONS_REQUEST:
      return { ...state, isFetchingAll: true };

    case FETCH_COMPETITIONS_SUCCESS:
      return {
        ...state,
        isFetchingAll: false,
        competitions: action.refresh
          ? { ...toMap(action.competitions, 'id') }
          : { ...state.competitions, ...toMap(action.competitions, 'id') }
      };

    case FETCH_COMPETITIONS_FAILURE:
      return { ...state, isFetchingAll: false, error: { message: action.error } };

    case FETCH_COMPETITION_REQUEST:
      return { ...state, isFetchingDetails: true };

    case FETCH_COMPETITION_SUCCESS:
      return {
        ...state,
        isFetchingDetails: false,
        competitions: { ...replaceDetails(state.competitions, action.competition) }
      };

    case FETCH_COMPETITION_FAILURE:
      return { ...state, isFetchingDetails: false, error: { message: action.error } };

    case FETCH_PLAYER_COMPETITIONS_REQUEST:
      return { ...state, isFetchingPlayerCompetitions: true };

    case FETCH_PLAYER_COMPETITIONS_SUCCESS:
      return {
        ...state,
        isFetchingPlayerCompetitions: false,
        competitions: { ...toMap(action.competitions, 'id') },
        playerCompetitions: { ...state.playerCompetitions, [action.playerId]: action.competitions }
      };

    case FETCH_PLAYER_COMPETITIONS_FAILURE:
      return { ...state, isFetchingPlayerCompetitions: false, error: { message: action.error } };

    case FETCH_GROUP_COMPETITIONS_REQUEST:
      return { ...state, isFetchingGroupCompetitions: true };

    case FETCH_GROUP_COMPETITIONS_SUCCESS:
      return {
        ...state,
        isFetchingGroupCompetitions: false,
        competitions: { ...toMap(action.competitions, 'id') },
        groupCompetitions: { ...state.groupCompetitions, [action.groupId]: action.competitions }
      };

    case FETCH_GROUP_COMPETITIONS_FAILURE:
      return { ...state, isFetchingGroupCompetitions: false, error: { message: action.error } };

    default:
      return state;
  }
}

function replaceDetails(competitions, details) {
  // If competition is not in the list, simply add it
  if (!competitions[details.id]) {
    return { ...competitions, [details.id]: details };
  }

  // If it already exists in the list, add the new key:value pairs to it
  return { ...competitions, [details.id]: { ...competitions[details.id], ...details } };
}

function playerUpdated(competitions, username) {
  const newCompetitions = _.mapValues(competitions, c => {
    if (!c.participants) {
      return c;
    }

    return {
      ...c,
      participants: c.participants.map(p => ({
        ...p,
        updatedAt: p.username === username ? new Date() : p.updatedAt
      }))
    };
  });

  return newCompetitions;
}
