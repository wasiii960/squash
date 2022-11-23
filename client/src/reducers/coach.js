import {
  COACHES,
  CLEAR_COACHE,
  COACHE_SINGLE,
  COACHES_ERROR,
  COACHES_INIT_STATE,
} from "../tasks/types";

const initialState = {
  coaches: null,
  singleCoach: null,
  singleCoachLoading: true,
  loading: true,
  error: {},
};

export default function foo(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case COACHES:
      return {
        ...state,
        coaches: payload,
        loading: false,
      };
    case CLEAR_COACHE:
      return {
        ...state,
        singleCoach: null,
        singleCoachLoading: true,
      };
    case COACHE_SINGLE:
      return {
        ...state,
        singleCoach: payload,
        singleCoachLoading: false,
      };
    case COACHES_INIT_STATE:
      return {
        ...initialState,
      };
    case COACHES_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    default:
      return state;
  }
}
