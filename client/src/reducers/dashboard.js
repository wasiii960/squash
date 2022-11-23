import {
  DASHBOARD,
  DASHBOARD_ERROR,
  DASHBOARD_INIT_STATE,
} from "../tasks/types";

const initialState = {
  dashboard: null,
  loading: true,
  error: {},
};

export default function foo(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case DASHBOARD:
      return {
        ...state,
        dashboard: payload,
        loading: false,
      };
    case DASHBOARD_INIT_STATE:
      return {
        ...state,
        dashboard: null,
        loading: true,
      };
    case DASHBOARD_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    default:
      return state;
  }
}
