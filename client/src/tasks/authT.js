import axios from "axios";
import {
  LOGIN_FAILED,
  LOGIN_SUCCESS,
  SET_LOADING,
  USER_LOADED,
  LOGOUT,
  AUTH_ERROR,
} from "./types";
import { setAlert } from "./alertT";
import setAuthToken from "../utils/setAuthToken";

export const setLoading = (loading) => (dispatch) => {
  dispatch({
    type: SET_LOADING,
    payload: { loading },
  });
};

// User Login
export const login = (email, password) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({ email, password });
    const res = await axios.post(
      "https://squashsiteserver.alliancetechltd.com/api/auth",
      body,
      config
    );

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });

    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
  } catch (err) {
    const errors = err.response.data;
    if (errors) {
      dispatch(setAlert(errors, "danger"));
      dispatch({
        type: AUTH_ERROR,
        payload: errors,
      });
    }
    dispatch({
      type: LOGIN_FAILED,
    });
  }
};

// Load User
export const loadUser = () => async (dispatch) => {
  try {
    const res = await axios.get(
      "https://squashsiteserver.alliancetechltd.com/api/auth"
    );
    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (error) {
    console.log(error.response.data);
    dispatch({
      type: AUTH_ERROR,
      payload: error,
    });
  }
};

// Change Password
export const changePassword = (password, passwordNew) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ password, passwordNew });
  try {
    await axios.put(
      "https://squashsiteserver.alliancetechltd.com/api/users/changePassword",
      body,
      config
    );

    dispatch(
      setAlert(
        "Passsword Changed Successfully. You Have to login again!",
        "success"
      )
    );
    dispatch({
      type: LOGOUT,
    });
  } catch (err) {
    console.log(err.response.data);
    const errors = err.response.data;
    if (errors) {
      dispatch(setAlert(errors, "danger"));
      dispatch({
        type: AUTH_ERROR,
      });
    }
    dispatch({
      type: LOGIN_FAILED,
    });
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem(localStorage.token);
  setAuthToken(null);
  dispatch({
    type: LOGOUT,
  });
};
