import axios from "axios";
import { ADMINS, ADMINS_ERROR, ADMINS_INIT_STATE } from "./types";
import { setAlert } from "./alertT";

export const loadAdmins = () => async (dispatch) => {
  try {
    const res = await axios.get(
      "https://squashsiteserver.alliancetechltd.com/api/users/admins"
    );
    dispatch({
      type: ADMINS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: ADMINS_ERROR,
      payload: {
        msg: error.response.data,
        status: error.response.status,
      },
    });
  }
};

export const addAdmin =
  (name, email, password, navigate) => async (dispatch) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const body = JSON.stringify({ name, email, password });
      await axios.post(
        `https://squashsiteserver.alliancetechltd.com/api/users/admin/`,
        body,
        config
      );
      dispatch(setAlert("Admin account added", "success"));
      navigate("/users/admins");
    } catch (err) {
      const errors = err.response.data;
      if (errors) {
        dispatch(setAlert(errors, "danger"));
      }
      dispatch({
        type: ADMINS_ERROR,
        payload: {
          msg: err.response.data,
          status: err.response.status,
        },
      });
    }
  };

export const deleteAdmin = (id) => async (dispatch) => {
  if (window.confirm("Are You Sure you Want to delete this captain?")) {
    try {
      await axios.delete(
        `https://squashsiteserver.alliancetechltd.com/api/users/${id}`
      );
      dispatch({ type: ADMINS_INIT_STATE });
      dispatch(setAlert("Admin account removed", "success"));
      dispatch(loadAdmins());
      //   navigate("/users/admins");
    } catch (err) {
      const errors = err.response.data;
      if (errors) {
        dispatch(setAlert(errors, "danger"));
      }
      dispatch({
        type: ADMINS_ERROR,
        payload: {
          msg: err.response.data,
          status: err.response.status,
        },
      });
    }
  }
};
