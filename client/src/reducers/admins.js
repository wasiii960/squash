import { ADMINS, ADMINS_ERROR, ADMINS_INIT_STATE } from "../tasks/types";

const initialState = {
  admins: null,
  loading: true,
  error: {},
};

export default function foo(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case ADMINS:
      return {
        ...state,
        admins: payload,
        loading: false,
      };
    case ADMINS_INIT_STATE:
      return {
        ...initialState,
      };
    case ADMINS_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    default:
      return state;
  }
}
