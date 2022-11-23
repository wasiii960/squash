import {
  LOGIN_FAILED,
  LOGIN_SUCCESS,
  SET_LOADING,
  USER_LOADED,
  LOGOUT,
  AUTH_ERROR,
} from "../tasks/types";

const initialState = {
  token: localStorage.getItem("token"),
  loading: true,
  userLoading: true,
  isAuthenticated: false,
  user: null,
  error: null,
};

export default function foo(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_LOADING:
      return {
        ...state,
        loading: payload,
      };
    case LOGIN_SUCCESS:
      localStorage.setItem("token", payload.token);
      return {
        ...state,
        token: payload.token,
        user: payload.user,
        isAuthenticated: true,
        loading: false,
        userLoading: false,
        error: null,
      };
    case USER_LOADED:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        userLoading: false,
        user: payload,
        error: null,
      };
    case LOGIN_FAILED:
    case AUTH_ERROR:
    case LOGOUT:
      localStorage.removeItem("token");
      return {
        ...initialState,
        token: null,
        loading: false,
        error: payload,
      };

    default:
      return state;
  }
}
