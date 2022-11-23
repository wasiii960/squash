import {
  PLAYERS,
  PLAYER_SINGLE,
  PLAYER_CLEAR,
  PLAYERS_ERROR,
  PLAYERS_INIT_STATE,
} from "../tasks/types";

const initialState = {
  players: null,
  singlePlayer: null,
  singlePlayerLoading: true,
  loading: true,
  error: {},
};

export default function foo(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case PLAYERS:
      return {
        ...state,
        players: payload,
        loading: false,
      };
    case PLAYER_CLEAR:
      return {
        ...state,
        singlePlayer: null,
        singlePlayerLoading: true,
      };
    case PLAYER_SINGLE:
      return {
        ...state,
        singlePlayer: payload,
        singlePlayerLoading: false,
      };
    case PLAYERS_INIT_STATE:
      return {
        ...initialState,
      };
    case PLAYERS_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    default:
      return state;
  }
}
